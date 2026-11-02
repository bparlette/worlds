#!/usr/bin/env python3
"""Run user image through the author prompt voxel pipeline and save as World #1
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

def get_image_data_uri_from_file(path):
    with Image.open(path) as img:
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
    img_path = os.path.join(ROOT, "art", "sonic_diorama_ref.png")
    rank = 1
    game = "Sonic the Hedgehog"
    name = "Green Hill Zone"
    scene_filename = "1001-sonic_the_hedgehog_green_hill_zone.html"
    scene_path = os.path.join(SCENES_DIR, scene_filename)
    pure_html_path = os.path.join(PURE_DIR, "001_sonic_diorama_custom.html")
    raw_png = os.path.join(PURE_DIR, "001_sonic_diorama_custom_webgl.png")
    thumb_jpg = os.path.join(RENDER_DIR, "001.jpg")

    print(f"\n=======================================================")
    print(f"Generating World #{rank}: {game} — {name} from User 3D Diorama")
    print(f"=======================================================")

    img_uri = get_image_data_uri_from_file(img_path)

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

    with open(scene_path, "w", encoding="utf-8") as f:
        f.write(html)
    with open(pure_html_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Saved standalone scene to {scene_path}")

    # Screenshot & thumb
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
        "platform": "Genesis"
    }
    conv_res = m.convert_scene_to_walker_module(scene_path, spec)
    print(f"Walker conversion result: {conv_res}")

    # Update progress and art page
    prog_path = os.path.join(ROOT, "top100_progress.json")
    with open(prog_path) as f:
        prog = json.load(f)

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

    # Push
    commit_msg = f"Update world #1 ({game} - {name}) with user 3D diorama reference and update art page"
    commit_and_push(commit_msg)
    print(f"✓ Pushed rank #{rank} to GitHub!\n")

if __name__ == "__main__":
    run()
