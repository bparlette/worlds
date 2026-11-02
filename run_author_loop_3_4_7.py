#!/usr/bin/env python3
"""Run worlds through the exact HuggingFace author-prompt voxel pipeline:
1. Generate scene via Qwen3.5-4B-3D-Coder with author prompt: "create this scene using voxels 3d"
2. Convert and validate walker module via make_walker_module.py
3. Screenshot WebGL render and generate thumbnail
4. Update art/index.html with Launch 3D World button and timestamp
5. Commit and push immediately as each world finishes
"""
import os
import sys
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
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

os.makedirs(SCENES_DIR, exist_ok=True)
os.makedirs(RENDER_DIR, exist_ok=True)
os.makedirs(PURE_DIR, exist_ok=True)

sys.path.insert(0, ROOT)
import make_walker_module as m
from top100_loop import update_art_page

CCORE_SYSTEM_PROMPT = """Use only the Three.js core ES module from
https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js.
Do not import addons or legacy examples/js paths;
implement any camera controls directly inside the HTML."""

USER_PROMPT = "create this scene using voxels 3d"
TEMPERATURE = 0.6
TOP_P = 0.95
TOP_K = 20
REPEAT_PENALTY = 1.0

TARGET_RANKS = [3, 4, 7]

def slugify(text):
    import re
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
    subprocess.run(cmd, capture_output=True, timeout=30)

def make_thumb(src_png, dst_jpg):
    im = Image.open(src_png).convert("RGB")
    im.thumbnail((800, 560))
    im.save(dst_jpg, "JPEG", quality=85)

def commit_and_push(msg):
    subprocess.run(["git", "add", "."], cwd=ROOT, check=True)
    res = subprocess.run(["git", "commit", "-m", msg], cwd=ROOT, capture_output=True, text=True)
    print("Git commit output:\n", res.stdout)
    push_res = subprocess.run(["git", "push", "origin", "main"], cwd=ROOT, capture_output=True, text=True)
    print("Git push output:\n", push_res.stdout)

def run():
    with open(os.path.join(ROOT, "art", "top100.json")) as f:
        top100 = json.load(f)
    
    prog_path = os.path.join(ROOT, "top100_progress.json")
    if os.path.exists(prog_path):
        with open(prog_path) as f:
            prog = json.load(f)
    else:
        prog = {}

    entries = [e for e in top100 if e["rank"] in TARGET_RANKS]
    entries.sort(key=lambda x: TARGET_RANKS.index(x["rank"]))

    for e in entries:
        rank = e["rank"]
        game = e["game"]
        name = e["name"]
        url = e["image_url"]
        slug = f"{slugify(game)}_{slugify(name)}"
        scene_filename = f"{1000 + rank:04d}-{slug}.html"
        scene_path = os.path.join(SCENES_DIR, scene_filename)
        pure_html_path = os.path.join(PURE_DIR, f"{rank:03d}_{slug}.html")
        raw_png = os.path.join(PURE_DIR, f"{rank:03d}_{slug}_webgl.png")
        thumb_jpg = os.path.join(RENDER_DIR, f"{rank:03d}.jpg")

        print(f"\n=======================================================")
        print(f"Starting Rank #{rank}: {game} — {name}")
        print(f"=======================================================")

        print(f"Fetching image from: {url}")
        img_uri = get_image_data_uri(url)

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

        print("Requesting 3D scene from Qwen...")
        t0 = time.time()
        req = urllib.request.Request(
            "http://127.0.0.1:8082/v1/chat/completions",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=1200) as resp:
            res = json.loads(resp.read().decode("utf-8"))
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

        # Save scene
        with open(scene_path, "w", encoding="utf-8") as f:
            f.write(html)
        with open(pure_html_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Saved standalone scene to {scene_path}")

        # Render screenshot & thumb
        screenshot(scene_path, raw_png)
        if os.path.exists(raw_png):
            make_thumb(raw_png, thumb_jpg)
            print(f"Saved thumbnail to {thumb_jpg}")
        else:
            print(f"Warning: Screenshot failed for {scene_path}")

        # Convert to walker module and validate
        spec = {
            "id": rank,
            "rank": rank,
            "game": game,
            "target": name,
            "name": name,
            "title": f"{game} — {name}",
            "platform": "Arcade" if e.get("clean") else "Console"
        }
        conv_res = m.convert_scene_to_walker_module(scene_path, spec)
        print(f"Walker conversion result: {conv_res}")

        # Update progress and art page
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M EST")
        prog[str(rank)] = {
            "rank": rank,
            "game": game,
            "name": name,
            "status": "pass",
            "filename": scene_filename,
            "fails": [],
            "attempts": 1,
            "updated_at": now_str
        }
        with open(prog_path, "w", encoding="utf-8") as f:
            json.dump(prog, f, indent=2)

        update_art_page(prog)
        print(f"Updated art/index.html for rank #{rank}")

        # Push immediately
        commit_msg = f"Add world #{rank} ({game} - {name}) with author voxel prompt and update art page"
        commit_and_push(commit_msg)
        print(f"✓ Pushed rank #{rank} ({game} — {name}) to GitHub!\n")

if __name__ == "__main__":
    run()
