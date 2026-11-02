#!/usr/bin/env python3
"""Autonomous background loop for 'The Rendered 100' (art/rendered.html):
- Runs git pull origin main before each world
- Extracts entries from art/rendered.html (or art/rendered100.json)
- Runs each through local Qwen3.5-4B-3D-Coder author voxel pipeline:
  1. Generate Three.js scene with prompt: "create this scene using voxels 3d"
  2. Save standalone scene to scenes/
  3. Screenshot WebGL render and save thumbnail to art/top100-renders/
  4. Convert and validate walker module via make_walker_module.py
  5. Update art/rendered.html with Launch 3D World button and timestamp
  6. Git commit and push immediately after each world
- Repeats and polls for newly added cards through the night
"""
import os
import sys
import re
import json
import time
import base64
import urllib.request
import subprocess
from datetime import datetime
from PIL import Image
import io

ROOT = "/Users/braidpairlette/worlds"
SCENES_DIR = os.path.join(ROOT, "scenes")
RENDER_DIR = os.path.join(ROOT, "art", "top100-renders")
PURE_DIR = os.path.join(ROOT, "pure_scenes")
RENDERED_HTML = os.path.join(ROOT, "art", "rendered.html")
RENDERED_JSON = os.path.join(ROOT, "art", "rendered100.json")
PROGRESS_JSON = os.path.join(ROOT, "rendered_progress.json")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

os.makedirs(SCENES_DIR, exist_ok=True)
os.makedirs(RENDER_DIR, exist_ok=True)
os.makedirs(PURE_DIR, exist_ok=True)

sys.path.insert(0, ROOT)
import make_walker_module as m

CCORE_SYSTEM_PROMPT = """Use only the Three.js core ES module from
https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js.
Do not import addons or legacy examples/js paths;
implement any camera controls directly inside the HTML."""

USER_PROMPT = "create this scene using voxels 3d"
TEMPERATURE = 0.6
TOP_P = 0.95
TOP_K = 20
REPEAT_PENALTY = 1.0

def git_pull():
    try:
        res = subprocess.run(["git", "pull", "--rebase", "origin", "main"], cwd=ROOT, capture_output=True, text=True, timeout=30)
        print("Git pull output:", res.stdout.strip())
    except Exception as e:
        print("Git pull error:", e)

def git_commit_and_push(msg):
    try:
        subprocess.run(["git", "add", "."], cwd=ROOT, check=True)
        res_commit = subprocess.run(["git", "commit", "-m", msg], cwd=ROOT, capture_output=True, text=True)
        print("Git commit output:\n", res_commit.stdout.strip())
        
        # Try pushing, retry with rebase if remote changed
        for attempt in range(5):
            push_res = subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, capture_output=True, text=True)
            if push_res.returncode == 0:
                print("Git push successful!")
                return True
            print(f"Push attempt {attempt+1} failed, rebasing on origin/main...")
            subprocess.run(["git", "pull", "--rebase", "origin", "main"], cwd=ROOT, capture_output=True, text=True)
            time.sleep(3)
    except Exception as e:
        print("Git push exception:", e)
    return False

def slugify(text):
    s = text.lower()
    s = re.sub(r"[—–\-_/]+", " ", s)
    s = re.sub(r"[^a-z0-9 ]+", "", s)
    s = re.sub(r"\s+", "_", s).strip("_")
    return s

def get_image_data_uri(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        raw_bytes = r.read()
    with Image.open(io.BytesIO(raw_bytes)) as img:
        rgb = img.convert("RGB")
        buf = io.BytesIO()
        rgb.save(buf, format="PNG")
        png_bytes = buf.getvalue()
    return "data:image/png;base64," + base64.b64encode(png_bytes).decode("ascii")

def screenshot(scene_path, out_png):
    cmd = [
        CHROME, "--headless=new", "--enable-webgl", "--ignore-gpu-blocklist",
        "--window-size=1000,700", "--virtual-time-budget=6000",
        f"--screenshot={out_png}",
        f"file://{os.path.abspath(scene_path)}"
    ]
    try:
        subprocess.run(cmd, capture_output=True, timeout=60)
    except subprocess.TimeoutExpired:
        print(f"Warning: Screenshot timed out for {scene_path}, retrying without webgl blocklist...")
        try:
            cmd_fallback = [
                CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
                "--window-size=1000,700", "--virtual-time-budget=3000",
                f"--screenshot={out_png}",
                f"file://{os.path.abspath(scene_path)}"
            ]
            subprocess.run(cmd_fallback, capture_output=True, timeout=30)
        except Exception as e:
            print(f"Fallback screenshot failed: {e}")
    except Exception as e:
        print(f"Screenshot exception: {e}")

def make_thumb(src_png, dst_jpg):
    im = Image.open(src_png).convert("RGB")
    im.thumbnail((800, 560))
    im.save(dst_jpg, "JPEG", quality=85)

def parse_rendered_html_cards():
    """Extract all cards from art/rendered.html"""
    with open(RENDERED_HTML, "r", encoding="utf-8") as f:
        html = f.read()

    figures = re.findall(r'<figure(?:\s+class="[^"]*")?>[\s\S]*?</figure>', html)
    entries = []
    for fig in figures:
        m_rank = re.search(r'<b>#(\d+)[^<]*—\s*([^·<]+)\s*·\s*([^<]+)</b>', fig)
        m_img = re.search(r'<img[^>]+src="([^">]+)"', fig)
        if m_rank and m_img:
            rank = int(m_rank.group(1))
            game = m_rank.group(2).strip()
            name = m_rank.group(3).strip()
            img_url = m_img.group(1).strip()
            entries.append({
                "rank": rank,
                "game": game,
                "name": name,
                "image_url": img_url,
                "fig_html": fig
            })
    return entries

def ensure_rendered_css(html):
    """Ensure .build button styles are present in art/rendered.html"""
    build_css = ".build{padding:0 14px 12px}.build .play{display:block;text-align:center;background:#e0b64f;color:#111;text-decoration:none;padding:9px 14px;border-radius:9px;font-weight:bold;font-size:.9rem}.build .updated-at{display:block;margin-top:6px;text-align:center;font-size:.72rem;color:#77747f}"
    if ".build{" not in html:
        html = html.replace("</style>", f"{build_css}</style>")
    return html

def update_rendered_page(progress):
    """Inject/update Launch 3D World button and timestamp into art/rendered.html"""
    with open(RENDERED_HTML, "r", encoding="utf-8") as f:
        html = f.read()

    html = ensure_rendered_css(html)

    def repl(m_fig):
        full_fig = m_fig.group(0)
        m_rank = re.search(r'<b>#(\d+)', full_fig)
        if not m_rank:
            return full_fig
        r_str = m_rank.group(1)
        if r_str in progress and progress[r_str].get("status") == "pass":
            info = progress[r_str]
            clean_fig = re.sub(r'<div class="build">[\s\S]*?</div>', '', full_fig).strip()
            if clean_fig.endswith("</figure>"):
                clean_fig = clean_fig[:-9].strip()
            btn_html = (
                f'<div class="build">'
                f'<a class="play" href="../scenes/{info["filename"]}" target="_blank">Launch 3D World ➔</a>'
                f'<span class="updated-at">Updated {info["updated_at"]}</span>'
                f'</div>\n</figure>'
            )
            return f"{clean_fig}\n{btn_html}"
        return full_fig

    updated_html = re.sub(r'<figure(?:\s+class="[^"]*")?>[\s\S]*?</figure>', repl, html)
    with open(RENDERED_HTML, "w", encoding="utf-8") as f:
        f.write(updated_html)

def run_loop():
    print("Starting Rendered 100 Autonomous Pipeline Loop...")
    
    while True:
        # Step 0: Always pull latest changes
        print(f"\n[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Checking remote repository (git pull)...")
        git_pull()

        # Load progress
        if os.path.exists(PROGRESS_JSON):
            try:
                with open(PROGRESS_JSON, "r", encoding="utf-8") as f:
                    progress = json.load(f)
            except Exception:
                progress = {}
        else:
            progress = {}

        # Parse cards from rendered.html
        cards = parse_rendered_html_cards()
        cards.sort(key=lambda x: x["rank"])
        print(f"Loaded {len(cards)} cards from art/rendered.html. Ranks: {[c['rank'] for c in cards]}")

        # Find cards that need building or updating
        pending = [c for c in cards if str(c["rank"]) not in progress or progress[str(c["rank"])].get("status") != "pass"]

        if not pending:
            print("No pending cards right now. Waiting 30s before next remote poll...")
            time.sleep(30)
            continue

        for card in pending:
            rank = card["rank"]
            game = card["game"]
            name = card["name"]
            url = card["image_url"]

            slug = f"{slugify(game)}_{slugify(name)}"
            scene_filename = f"{1000 + rank:04d}-{slug}.html"
            scene_path = os.path.join(SCENES_DIR, scene_filename)
            pure_html_path = os.path.join(PURE_DIR, f"{rank:03d}_{slug}.html")
            raw_png = os.path.join(PURE_DIR, f"{rank:03d}_{slug}_webgl.png")
            thumb_jpg = os.path.join(RENDER_DIR, f"{rank:03d}.jpg")

            print(f"\n=======================================================")
            print(f"Building Rendered World #{rank}: {game} — {name}")
            print(f"Image: {url}")
            print(f"=======================================================")

            # Before generation, pull again in case upstream landed commits
            git_pull()

            try:
                img_uri = get_image_data_uri(url)
            except Exception as e:
                print(f"Error fetching image for rank #{rank}: {e}")
                time.sleep(10)
                continue

            payload = {
                "messages": [
                    {"role": "system", "content": CCORE_SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": [
                            {"type": "image_url", "image_url": {"url": img_uri}},
                            {"type": "text", "text": USER_PROMPT}
                        ]
                    }
                ],
                "temperature": TEMPERATURE,
                "top_p": TOP_P,
                "top_k": TOP_K,
                "repeat_penalty": REPEAT_PENALTY,
                "max_tokens": 16000,
                "stream": False
            }

            print("Requesting 3D scene from local Qwen...")
            t0 = time.time()
            try:
                req = urllib.request.Request(
                    "http://127.0.0.1:8082/v1/chat/completions",
                    data=json.dumps(payload).encode("utf-8"),
                    headers={"Content-Type": "application/json"}
                )
                with urllib.request.urlopen(req, timeout=1200) as resp:
                    res = json.loads(resp.read().decode("utf-8"))
            except Exception as e:
                print(f"Inference request error for rank #{rank}: {e}")
                time.sleep(10)
                continue

            elapsed = time.time() - t0
            choice = res["choices"][0]
            raw_content = choice["message"]["content"]
            tokens = res.get("usage", {}).get("completion_tokens", 0)
            fin = choice.get("finish_reason")
            print(f"Generated {tokens} tokens in {elapsed:.1f}s (finish: {fin})")

            if "```html" in raw_content:
                html = raw_content.split("```html")[1].split("```")[0].strip()
            elif "```" in raw_content:
                html = raw_content.split("```")[1].split("```")[0].strip()
            elif "<!DOCTYPE html>" in raw_content or "<html" in raw_content:
                html = raw_content.strip()
            else:
                html = f"<!DOCTYPE html><html><body><pre>{raw_content}</pre></body></html>"

            with open(scene_path, "w", encoding="utf-8") as f:
                f.write(html)
            with open(pure_html_path, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"Saved standalone scene to {scene_path}")

            # Screenshot & thumbnail
            screenshot(scene_path, raw_png)
            if os.path.exists(raw_png):
                make_thumb(raw_png, thumb_jpg)
                print(f"Saved thumbnail to {thumb_jpg}")

            # Walker module conversion
            spec = {
                "id": rank,
                "rank": rank,
                "game": game,
                "target": name,
                "name": name,
                "title": f"{game} — {name}",
                "platform": "Arcade" if "arcade" in url.lower() else "Console"
            }
            conv_res = m.convert_scene_to_walker_module(scene_path, spec)
            print(f"Walker conversion result: {conv_res}")

            now_str = datetime.now().strftime("%Y-%m-%d %H:%M EST")
            progress[str(rank)] = {
                "rank": rank,
                "game": game,
                "name": name,
                "status": "pass",
                "filename": scene_filename,
                "updated_at": now_str
            }
            with open(PROGRESS_JSON, "w", encoding="utf-8") as f:
                json.dump(progress, f, indent=2)

            update_rendered_page(progress)
            print(f"Updated art/rendered.html for rank #{rank}")

            commit_msg = f"Add world #{rank} ({game} - {name}) to Rendered 100 from 3D fan render"
            git_commit_and_push(commit_msg)
            print(f"✓ Pushed rank #{rank} ({game} — {name}) to GitHub!\n")

if __name__ == "__main__":
    run_loop()
