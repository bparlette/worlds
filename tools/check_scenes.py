"""Render gate for the interactive 100N voxel scenes in bparlette/worlds.

Discovers every scenes/100*.html file in the repo, downloads the LIVE bytes
from GitHub Pages, and renders each one in headless Chromium (SwiftShader):
PASS = no uncaught page errors + a canvas exists + the screenshot is not one
flat color (>=99% single color bucket). Prints a per-scene verdict and writes
scene_report.json next to this script; exit code 1 if any scene fails.

Why localhost serving: headless Chromium on the build VM cannot egress
(ERR_TUNNEL_CONNECTION_FAILED), so scenes are fetched with curl (which can)
and served byte-identical over localhost. The scenes' one external request —
three.js 0.160.0 from cdnjs — is fulfilled from a vendored copy of the
identical artifact; set WORLDS_THREE_VENDOR to its path (default:
~/workspace/worlds-gate1/vendor/three.module.min.js). If the vendored file is
missing and your Chromium CAN reach cdnjs, the interception is skipped.

Run with a Python that has playwright installed, e.g.:
  ~/workspace/worlds-gate1/venv/bin/python tools/check_scenes.py
"""
import glob, json, os, subprocess, sys, tempfile, threading, http.server, socketserver, functools
from playwright.sync_api import sync_playwright

REPO = "bparlette/worlds"
PAGES = "https://bparlette.github.io/worlds/scenes/"
PORT = 8974
EXE = "/home/hatch/.cache/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell"
VENDOR = os.environ.get("WORLDS_THREE_VENDOR", os.path.expanduser("~/workspace/worlds-gate1/vendor/three.module.min.js"))
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'scene_report.json')

def discover():
    r = subprocess.run(['curl', '-s', f'https://api.github.com/repos/{REPO}/contents/scenes'],
                       capture_output=True, text=True)
    names = [x['name'] for x in json.loads(r.stdout)
             if x['name'].startswith('100') and x['name'].endswith('.html')]
    return sorted(names)

FILES = discover()
print(f'discovered {len(FILES)} scenes', flush=True)
DIR = tempfile.mkdtemp(prefix='scene_gate_')
for f in FILES:
    subprocess.run(['curl', '-s', '-o', os.path.join(DIR, f), PAGES + f], check=True)
    print('downloaded', f, flush=True)

Handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=DIR)
socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(("127.0.0.1", PORT), Handler)
threading.Thread(target=httpd.serve_forever, daemon=True).start()

FLAT_JS = """(src) => new Promise(resolve => {
  const img = new Image();
  img.onload = () => {
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const ctx = c.getContext('2d'); ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const counts = {}; let n = 0;
    for (let y = 0; y < c.height; y += 6) for (let x = 0; x < c.width; x += 6) {
      const i = (y * c.width + x) * 4;
      const key = (d[i] >> 4) + ',' + (d[i+1] >> 4) + ',' + (d[i+2] >> 4);
      counts[key] = (counts[key] || 0) + 1; n++;
    }
    resolve({distinct_buckets: Object.keys(counts).length, samples: n,
             dominant_pct: +(100 * Math.max(...Object.values(counts)) / n).toFixed(1)});
  };
  img.onerror = () => resolve({error: 'img load failed'});
  img.src = src;
})"""

results = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=EXE, args=[
        "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
        "--disable-dev-shm-usage", "--no-sandbox"])
    for f in FILES:
        errs, perrs, failed = [], [], []
        page = browser.new_page(viewport={"width": 900, "height": 700})
        if os.path.exists(VENDOR):
            page.route("**/three.module.min.js", lambda r: r.fulfill(path=VENDOR, content_type="text/javascript"))
        page.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: perrs.append((getattr(e, 'stack', None) or str(e))))
        page.on("requestfailed", lambda r: failed.append(r.url))
        canvas, flat = False, None
        shot = 'shot_' + f.replace('.html', '.png')
        try:
            page.goto(f"http://127.0.0.1:{PORT}/{f}", timeout=20000)
            page.wait_for_timeout(6000)
            canvas = page.evaluate("!!document.querySelector('canvas')")
            page.screenshot(path=os.path.join(DIR, shot))
            flat = page.evaluate(FLAT_JS, f"http://127.0.0.1:{PORT}/{shot}")
        except Exception as e:
            perrs.append(f"NAV/CHECK: {e}")
        is_flat = bool(flat and flat.get('dominant_pct', 0) >= 99)
        verdict = 'pass' if (len(perrs) == 0 and canvas and not is_flat) else 'fail'
        results.append({'file': f, 'verdict': verdict,
                        'evidence': f"canvas={canvas}; pageerrors={perrs}; console_errors={errs}; failed={failed}; flat={flat}"})
        print(f, '->', verdict, '| pageerrors:', len(perrs), '| flat:', flat, flush=True)
        page.close()
    browser.close()

json.dump({'scene_count': len(FILES), 'results': results}, open(OUT, 'w'), indent=1)
fails = [r['file'] for r in results if r['verdict'] != 'pass']
print(f"WROTE {OUT} | pass {len(results) - len(fails)}/{len(results)}" + (f" | FAILING: {fails}" if fails else ""))
sys.exit(1 if fails else 0)
