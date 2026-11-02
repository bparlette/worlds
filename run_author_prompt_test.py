#!/usr/bin/env python3
"""Run image-guided generation using the exact prompt from the author's HuggingFace card:
'create this scene using voxels 3d'
"""
import os
import sys
import json
import time
import base64
import urllib.request
from PIL import Image
import io

ROOT = "/Users/braidpairlette/worlds"
OUT_DIR = os.path.join(ROOT, "pure_scenes")
os.makedirs(OUT_DIR, exist_ok=True)

CCORE_SYSTEM_PROMPT = """Use only the Three.js core ES module from
https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js.
Do not import addons or legacy examples/js paths;
implement any camera controls directly inside the HTML."""

# The exact prompt used by the author in the README
USER_PROMPT = "create this scene using voxels 3d"

TEMPERATURE = 0.6
TOP_P = 0.95
TOP_K = 20
REPEAT_PENALTY = 1.0

TARGETS = [
    {
        "rank": 1,
        "name": "sonic_green_hill_zone_author_prompt",
        "title": "Sonic the Hedgehog - Green Hill Zone",
        "url": "https://upload.wikimedia.org/wikipedia/en/d/d3/MD_Sonic_the_Hedgehog.png"
    },
    {
        "rank": 2,
        "name": "super_mario_bros_1_1_author_prompt",
        "title": "Super Mario Bros. - World 1-1",
        "url": "https://mario.wiki.gallery/images/1/13/SMB_NES_World_1-1_Screenshot.png"
    }
]

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

for t in TARGETS:
    print(f"\nGenerating with Author's Exact Prompt: #{t['rank']} {t['title']}")
    img_uri = get_image_data_uri(t["url"])
    
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
    
    req = urllib.request.Request(
        "http://127.0.0.1:8082/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    
    t0 = time.time()
    with urllib.request.urlopen(req, timeout=1200) as resp:
        res = json.loads(resp.read().decode("utf-8"))
    elapsed = time.time() - t0
    
    choice = res["choices"][0]
    raw_content = choice["message"]["content"]
    toks = res.get("usage", {}).get("completion_tokens", 0)
    fin = choice.get("finish_reason")
    
    print(f"Finished in {elapsed:.1f}s | {toks} tokens | {len(raw_content)} chars | finish: {fin}")
    
    if "```html" in raw_content:
        html = raw_content.split("```html")[1].split("```")[0].strip()
    elif "```" in raw_content:
        html = raw_content.split("```")[1].split("```")[0].strip()
    elif "<!DOCTYPE html>" in raw_content or "<html" in raw_content:
        html = raw_content.strip()
    else:
        html = f"<!DOCTYPE html><html><body><pre>{raw_content}</pre></body></html>"
        
    out_file = os.path.join(OUT_DIR, f"{t['name']}.html")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Saved to {out_file}")

