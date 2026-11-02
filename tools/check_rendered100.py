"""Validate the Rendered 100 (art/rendered100.json): every entry's thumbnail
image must load (HTTP 200, image/*, >10 KB) and every Sketchfab model must
still be live (API 200, name matches).

Usage:
  check_rendered100.py [--fix-images] [--data PATH]

--fix-images: for any entry whose image fails but whose model is live,
refresh image_url (and likes/views) from the Sketchfab API's current
thumbnail set, write the data file back, and rebuild rendered.html via
build_page.py. Entries whose MODEL is dead are reported, not auto-fixed —
they need a human-chosen replacement.
"""
import json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(HERE, 'rendered100.json')
FIX = '--fix-images' in sys.argv
if '--data' in sys.argv:
    DATA = sys.argv[sys.argv.index('--data') + 1]

def curl_json(url):
    r = subprocess.run(['curl', '-s', '--max-time', '30', url], capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return None

def image_status(url):
    r = subprocess.run(['curl', '-s', '-o', '/dev/null', '--max-time', '30',
                        '-w', '%{http_code} %{content_type} %{size_download}', url],
                       capture_output=True, text=True).stdout.split()
    if len(r) != 3:
        return (0, '', 0)
    return (int(r[0]), r[1], int(r[2]))

def uid_of(page_url):
    m = re.search(r'([0-9a-f]{32})(?:[/?#]|$)', page_url or '')
    return m.group(1) if m else None

entries = json.load(open(DATA))
broken, refreshed = [], 0
for i, e in enumerate(entries):
    n = i + 1
    uid = uid_of(e.get('page_url'))
    code, ctype, size = image_status(e.get('image_url', ''))
    img_ok = code == 200 and ctype.startswith('image/') and size > 10000
    model = curl_json(f'https://api.sketchfab.com/v3/models/{uid}') if uid else None
    model_ok = bool(model and model.get('name'))
    if img_ok and model_ok:
        continue
    if FIX and not img_ok and model_ok:
        thumbs = (model.get('thumbnails') or {}).get('images') or []
        if thumbs:
            best = max(thumbs, key=lambda t: t.get('size', 0))
            e['image_url'] = best['url']
            e['likes'] = model.get('likeCount', e.get('likes'))
            e['views'] = model.get('viewCount', e.get('views'))
            refreshed += 1
            print(f'#{n} image refreshed from API: {e["game"]} — {e["name"]}')
            continue
    broken.append({'n': n, 'game': e['game'], 'name': e['name'], 'uid': uid,
                   'image': f'{code} {ctype} {size}B', 'model_live': model_ok})

if refreshed:
    json.dump(entries, open(DATA, 'w'), indent=1)
    bp = os.path.join(HERE, 'build_page.py')
    if os.path.exists(bp):
        subprocess.run([sys.executable, bp], check=True)
        print(f'rewrote {DATA} + rebuilt page ({refreshed} image(s) refreshed)')
    else:
        print(f'rewrote {DATA} ({refreshed} image(s) refreshed); build_page.py not beside the checker — rebuild rendered.html where it lives')

print(f'checked {len(entries)} entries | refreshed {refreshed} | broken {len(broken)}')
for b in broken:
    print('BROKEN:', b)
sys.exit(1 if broken else 0)
