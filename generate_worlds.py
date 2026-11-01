"""
generate_worlds.py
Feeds extracted retro walkthrough prompts into Qwen 3.5 3D-Coder (via llama-server port 8082),
generates complete standalone Three.js WebGL 3D worlds, saves them, generates a gallery portal,
and commits/pushes each generated world incrementally to GitHub repo 'bparlette/worlds'.
"""

import os
import sys
import io
import math
import json
import time
import re
import urllib.request
import urllib.error
import subprocess
import concurrent.futures
import base64
from PIL import Image
from scene_linter import lint_and_autofix_scene

WORLDS_DIR = "/Users/braidpairlette/worlds"
SCENES_DIR = os.path.join(WORLDS_DIR, "scenes")
JSON_PATH = os.path.join(WORLDS_DIR, "game_worlds_extracted.json")
PROGRESS_PATH = os.path.join(WORLDS_DIR, "generation_progress.json")
LLAMA_PORT = 8082

# Qwen3.5-VL vision token standard:
# patch_size = 16, spatial_merge_size = 2 -> 1 vision token per 32x32 px (1,024 px).
# Cap at 1,280 vision tokens (1,310,720 px) aligned to 32-px grid; never upscale smaller images.
VISION_STRIDE = 32
MAX_VISION_TOKENS = 1280
MAX_VISION_PIXELS = MAX_VISION_TOKENS * VISION_STRIDE * VISION_STRIDE  # 1,310,720

os.makedirs(SCENES_DIR, exist_ok=True)

SYSTEM_PROMPT = """You are an expert 3D WebGL / Three.js developer.
Generate a complete, self-contained 3D WebGL interactive world inside a single HTML file.
CRITICAL CONSTRAINTS:
1. Write concise, clean, modular Three.js code using helper functions and loops so the entire file finishes in 15,000 to 20,000 characters (~3,500-4,500 tokens). Avoid bloated repetitive code.
2. Must properly close all functions, add the animation loop (requestAnimationFrame), and close </script></body></html>. NEVER leave code unfinished or cut off mid-function.
3. Use only Three.js core ES module:
   https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js
   Use renderer.toneMapping = THREE.ACESFilmicToneMapping;
   Append canvas via document.body.appendChild(renderer.domElement);
   Never create inline canvas gradients inside CanvasTexture. Use standard Three.js materials.
4. Implement native drag-to-orbit camera controls directly in JS.
5. Create recognizable landmarks, atmospheric lighting/fog, and animated elements.
6. RELIC (required): Include the world's hidden treasure relic object:
   - name: this game's single most iconic treasure object (proper name in quotes, e.g. Adventure's chalice, Pitfall's golden idol).
   - x, z: a point on WALKABLE ground in this world, at least 6 units from spawn and at least 3 units from doors/landmarks, off the direct beeline. Build the relic from pure Three.js 3D primitives only (no sprite/billboard/canvas).
7. HYGIENE (required): Do NOT create any object, variable, or group named 'glitch' (case-insensitive) to prevent collision with the Back Roms host entity.
8. SCALE (required): Build SMALL, dense worlds — about half the size of a typical sprawling scene. The entire playable layout (including outer wall thickness, loops, and trees/ceilings) MUST fit strictly within a 30 x 30 unit footprint (X in [-15, 15], Z in [-15, 15]; place outer wall centers at most at ±14.5) and height Y in [0, 12]. Check loop bounds so no repeated object overshoots ±14.5. Make one rich, compact room/area, not a sprawling field: bring landmarks close and keep walking distances short. If the reference map shows a whole world or multi-room sheet, build ONLY its single most iconic room/section at full detail.
9. FOUR WALLS (required): Give the world a clear outer boundary made of four walls — north, east, south, and west — using whatever fits the theme (walls, cliffs, hedges, cave rock, fences, or a water's edge), forming a compact rectangular layout. The Back Roms host turns each entire wall into a passage, so keep the boundary walls plain, solid, and continuous, with no essential landmark built into or against them. Do NOT place a freestanding portal, rift, gate, doorway, or travel hole anywhere in the room — the walls are the exits, and the host draws the passage effect on them.
10. Output ONLY executable HTML inside ```html ... ```."""


def load_progress() -> dict:
    if os.path.exists(PROGRESS_PATH):
        try:
            with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}


def save_progress(progress: dict):
    with open(PROGRESS_PATH, "w", encoding="utf-8") as f:
        json.dump(progress, f, indent=2)


def _resize_to_vision_standard(data: bytes) -> tuple[bytes, dict]:
    """Normalize and cap reference image to <= 1,280 vision tokens (32x32 patch grid).
    Never upscales smaller images. Converts GIF/palette to RGB PNG for clean ViT decode."""
    orig_bytes = len(data)
    with Image.open(io.BytesIO(data)) as img:
        orig_w, orig_h = img.size
        orig_fmt = img.format or "PNG"
        orig_mode = img.mode
        orig_vtokens = math.ceil(orig_w / VISION_STRIDE) * math.ceil(orig_h / VISION_STRIDE)

        if orig_w * orig_h > MAX_VISION_PIXELS:
            scale = math.sqrt(MAX_VISION_PIXELS / (orig_w * orig_h))
            new_w = max(VISION_STRIDE, (int(orig_w * scale) // VISION_STRIDE) * VISION_STRIDE)
            new_h = max(VISION_STRIDE, (int(orig_h * scale) // VISION_STRIDE) * VISION_STRIDE)
            while (new_w // VISION_STRIDE) * (new_h // VISION_STRIDE) > MAX_VISION_TOKENS:
                if new_w >= new_h and new_w > VISION_STRIDE:
                    new_w -= VISION_STRIDE
                elif new_h > VISION_STRIDE:
                    new_h -= VISION_STRIDE
                else:
                    break
            rgb = img.convert("RGB") if img.mode != "RGB" else img
            resized = rgb.resize((new_w, new_h), Image.Resampling.LANCZOS)
            buf = io.BytesIO()
            resized.save(buf, format="PNG", optimize=True)
            out_bytes = buf.getvalue()
        elif orig_fmt != "PNG" or orig_mode not in ("RGB", "RGBA"):
            new_w, new_h = orig_w, orig_h
            rgb = img.convert("RGB")
            buf = io.BytesIO()
            rgb.save(buf, format="PNG", optimize=True)
            out_bytes = buf.getvalue()
        else:
            new_w, new_h = orig_w, orig_h
            out_bytes = data

    sent_vtokens = math.ceil(new_w / VISION_STRIDE) * math.ceil(new_h / VISION_STRIDE)
    meta = {
        "orig_w": orig_w, "orig_h": orig_h, "orig_fmt": orig_fmt, "orig_mode": orig_mode,
        "orig_bytes": orig_bytes, "orig_vtokens": orig_vtokens,
        "sent_w": new_w, "sent_h": new_h, "sent_bytes": len(out_bytes), "sent_vtokens": sent_vtokens
    }
    return out_bytes, meta


def _image_data_uri(url: str) -> str:
    """Download a reference image, apply the 1,280-token vision resize standard, and inline as a data URI."""
    req = urllib.request.Request(
        url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
    with urllib.request.urlopen(req, timeout=25) as r:
        raw_data = r.read()
    out_bytes, m = _resize_to_vision_standard(raw_data)
    print(
        f"[Image Standard] {m['orig_w']}x{m['orig_h']} {m['orig_fmt']}/{m['orig_mode']} "
        f"({m['orig_bytes']/1024:.1f}KB, {m['orig_vtokens']} vtok) -> "
        f"{m['sent_w']}x{m['sent_h']} PNG ({m['sent_bytes']/1024:.1f}KB, {m['sent_vtokens']} vtok)"
    )
    return "data:image/png;base64," + base64.b64encode(out_bytes).decode("ascii")


_LABEL_PREFIX = re.compile(
    r"^(\s*)[A-Za-z_$][\w$]*(?:\.[\w$]+)+:[ \t]+(?=(?:document|renderer|scene|camera|window)\b)",
    re.M)


def sanitize_scene_html(html: str) -> str:
    """Strip bogus dotted-label prefixes (e.g. 'renderer.domElement: document...')
    that Qwen sometimes writes before a statement. A JS label cannot contain a
    dot, so this is always a parse-time SyntaxError that kills the whole module
    before the first frame (audit 2026-11-01: 9 of 25 flagged scenes)."""
    fixed, n = _LABEL_PREFIX.subn(r"\1", html)
    if n:
        print(f"[Sanitizer] Removed {n} bogus label prefix(es) from generated scene")
    return fixed


def generate_single_world(spec: dict) -> str:
    prompt = spec["qwen_prompt"]
    print(f"\n[AI Dispatch] Sending #{spec['id']:03d} {spec['game']} - {spec['target']} to Qwen3.5-3D-Coder...")

    # Image-led dispatch: reference images (when the catalog has them) go in
    # as labeled parts ahead of the text prompt; any failure falls back to the
    # plain text prompt so a bad image URL can never block generation.
    user_content = prompt
    img_urls = spec.get("image_urls") or ([spec["image_url"]] if spec.get("image_url") else [])
    img_kinds = spec.get("image_kinds") or ([spec.get("image_kind", "image")] if spec.get("image_url") else [])
    if img_urls:
        try:
            parts = []
            for u, k in zip(img_urls[:3], img_kinds[:3]):
                label = "area map (layout)" if k == "map" else "in-game screenshot (look and palette)"
                parts.append({"type": "text", "text": f"Reference image - {label}:"})
                parts.append({"type": "image_url", "image_url": {"url": _image_data_uri(u)}})
            parts.append({"type": "text", "text": prompt})
            user_content = parts
            print(f"[AI Dispatch] Mode: image-led x{len(img_urls[:3])} ({', '.join(img_kinds[:3])})")
        except Exception as e:
            print(f"[Image] Reference image fetch failed ({e}); falling back to text-only.")
            user_content = prompt

    payload = {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content}
        ],
        "max_tokens": 14000,
        "temperature": 0.6,
        "stream": True
    }

    req = urllib.request.Request(
        f"http://127.0.0.1:{LLAMA_PORT}/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    t0 = time.time()
    collected_chunks = []
    # Using streaming with a generous per-chunk read timeout so long generation never drops connection
    with urllib.request.urlopen(req, timeout=120) as resp:
        for line in resp:
            line = line.decode("utf-8").strip()
            if not line or not line.startswith("data: "):
                continue
            data_str = line[6:]
            if data_str == "[DONE]":
                break
            try:
                chunk = json.loads(data_str)
                delta = chunk["choices"][0]["delta"].get("content", "")
                if delta:
                    collected_chunks.append(delta)
            except Exception:
                continue

    raw_content = "".join(collected_chunks)
    elapsed = time.time() - t0
    print(f"[AI Complete] Received response in {elapsed:.1f}s ({len(raw_content)} chars)")

    # Extract HTML
    if "```html" in raw_content:
        html = raw_content.split("```html")[1].split("```")[0].strip()
    elif "```" in raw_content:
        html = raw_content.split("```")[1].split("```")[0].strip()
    elif "<!DOCTYPE html>" in raw_content or "<html" in raw_content:
        html = raw_content.strip()
    else:
        html = f"<!DOCTYPE html><html><body><pre>{raw_content}</pre></body></html>"

    # Validation: Ensure closing tags exist
    if "</html>" not in html.lower():
        print(f"[Warning] Scene code was incomplete, appending closing tags...")
        if "</script>" not in html:
            html += "\n    animate();\n  </script>"
        if "</body>" not in html:
            html += "\n</body>"
        if "</html>" not in html:
            html += "\n</html>"

    return sanitize_scene_html(html)


def update_gallery(specs: list, progress: dict):
    """Regenerates index.html with interactive cards for all 1,000 worlds (completed + coming soon)."""
    completed_count = sum(1 for s in specs if str(s["id"]) in progress)
    total_count = len(specs)

    cards_html = []
    for s in specs:
        s_id_str = str(s["id"])
        is_done = s_id_str in progress

        if is_done:
            info = progress[s_id_str]
            filename = info["filename"]
            verified = info.get("verified_working", True)
            status_badge = (
                '<span class="badge verified" title="WebGL & Runtime Verified Clean">🟢 Verified</span>'
                if verified else
                '<span class="badge needs-attention" title="Runtime Notice: May require manual adjustment">⚠️ Issue Detected</span>'
            )
            card_extra_cls = "card-flagged" if not verified else ""
            if s["id"] == 1 and os.path.exists(os.path.join(SCENES_DIR, "001_adventure_chalice_run.html")):
                footer_html = f'''
                <div style="display:flex;gap:8px;">
                    <a class="play-btn" style="flex:1;" href="scenes/{filename}" target="_blank">Launch 3D World ➔</a>
                    <a class="play-btn" style="flex:1;background:#b8860b;" href="scenes/001_adventure_chalice_run.html" target="_blank">🎮 Play Chalice Run ➔</a>
                </div>'''
            else:
                footer_html = f'<a class="play-btn" href="scenes/{filename}" target="_blank">Launch 3D World ➔</a>'
        else:
            status_badge = '<span class="badge coming-soon" title="Queued in Qwen3.5-3D-Coder synthesis pipeline">⏳ Coming Soon</span>'
            card_extra_cls = "card-coming-soon"
            footer_html = '<span class="play-btn disabled-btn">⏳ Coming Soon — Queued</span>'

        media_html = (
            f'<img class="world-img" src="{s["image_url"]}" alt="{s["game"]} - {s["target"]} reference image" loading="lazy">'
            if s.get("image_url") else ""
        )

        cards_html.append(f"""
        <div class="world-card {card_extra_cls}" data-status="{'ready' if is_done else 'coming-soon'}">
            <div class="card-header">
                <div>
                    <span class="badge platform">{s['platform']}</span>
                    {status_badge}
                </div>
                <span class="world-id">#{s['id']:03d}</span>
            </div>
            <div class="card-body">
                <h3>{s['game']}</h3>
                <h4>{s['target']}</h4>
                {media_html}
                <div class="description-container">
                    <p class="description collapsed" id="desc-{s['id']}">{s['description']}</p>
                    <button class="expand-btn" onclick="toggleDesc('{s['id']}', this)">Read more ▾</button>
                </div>
            </div>
            <div class="card-footer">
                {footer_html}
            </div>
        </div>
        """)

    index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{total_count} Retro Worlds - 3D WebGL Walkthrough Explorer</title>
    <style>
        :root {{
            --bg: #090a10;
            --card-bg: rgba(22, 25, 38, 0.7);
            --card-border: rgba(255, 255, 255, 0.08);
            --text: #f0f3fa;
            --text-muted: #8a93a6;
            --accent: #00d2ff;
            --accent-grad: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
            --card-glow: rgba(0, 210, 255, 0.15);
        }}
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{
            background: var(--bg);
            color: var(--text);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
        }}
        header {{
            padding: 48px 24px 32px;
            text-align: center;
            background: radial-gradient(circle at 50% 0%, rgba(58, 123, 213, 0.25) 0%, transparent 70%);
            border-bottom: 1px solid var(--card-border);
        }}
        header h1 {{
            font-size: 2.8rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            background: linear-gradient(180deg, #ffffff 30%, #a2b4d6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 12px;
        }}
        header p {{
            color: var(--text-muted);
            font-size: 1.1rem;
            max-width: 680px;
            margin: 0 auto 20px;
            line-height: 1.5;
        }}
        .stats-bar {{
            display: inline-flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 24px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid var(--card-border);
            padding: 10px 24px;
            border-radius: 999px;
            font-size: 0.95rem;
            backdrop-filter: blur(12px);
        }}
        .stats-bar strong {{ color: var(--accent); }}
        main {{
            flex: 1;
            max-width: 1400px;
            margin: 0 auto;
            padding: 40px 24px;
            width: 100%;
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 24px;
        }}
        .world-card {{
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 22px;
            display: flex;
            flex-direction: column;
            transition: all 0.25s ease;
            backdrop-filter: blur(16px);
            position: relative;
            overflow: hidden;
        }}
        .world-card:hover {{
            transform: translateY(-4px);
            border-color: rgba(0, 210, 255, 0.35);
            box-shadow: 0 12px 30px var(--card-glow);
        }}
        .world-img {{ width: 100%; border-radius: 10px; margin-bottom: 12px; display: block; }}
        .card-header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
        }}
        .badge.platform {{
            background: rgba(0, 210, 255, 0.12);
            color: var(--accent);
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-right: 6px;
        }}
        .badge.verified {{
            background: rgba(46, 204, 113, 0.15);
            color: #2ecc71;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
        }}
        .badge.needs-attention {{
            background: rgba(241, 196, 15, 0.15);
            color: #f1c40f;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
        }}
        .badge.coming-soon {{
            background: rgba(155, 89, 182, 0.18);
            color: #c39bd3;
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
        }}
        .world-card.card-flagged {{
            border-color: rgba(241, 196, 15, 0.25);
        }}
        .world-card.card-coming-soon {{
            opacity: 0.85;
            border-color: rgba(255, 255, 255, 0.05);
        }}
        .world-id {{
            color: var(--text-muted);
            font-size: 0.85rem;
            font-family: monospace;
        }}
        .card-body h3 {{
            font-size: 1.25rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 4px;
        }}
        .card-body h4 {{
            font-size: 0.95rem;
            color: var(--accent);
            font-weight: 600;
            margin-bottom: 12px;
        }}
        .description-container {{
            margin-bottom: 20px;
            flex: 1;
        }}
        .description {{
            font-size: 0.88rem;
            color: var(--text-muted);
            line-height: 1.5;
            transition: max-height 0.3s ease;
        }}
        .description.collapsed {{
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }}
        .expand-btn {{
            background: none;
            border: none;
            color: var(--accent);
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            padding: 4px 0;
            margin-top: 6px;
            display: inline-block;
        }}
        .expand-btn:hover {{
            text-decoration: underline;
        }}
        .card-footer {{
            margin-top: auto;
        }}
        .play-btn {{
            display: block;
            text-align: center;
            background: var(--accent-grad);
            color: #ffffff;
            text-decoration: none;
            padding: 10px 16px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 0.9rem;
            transition: opacity 0.2s;
        }}
        .play-btn:hover {{
            opacity: 0.9;
        }}
        .play-btn.disabled-btn {{
            background: rgba(255, 255, 255, 0.06);
            color: var(--text-muted);
            border: 1px solid rgba(255, 255, 255, 0.08);
            cursor: default;
        }}
        footer {{
            text-align: center;
            padding: 24px;
            color: var(--text-muted);
            font-size: 0.85rem;
            border-top: 1px solid var(--card-border);
        }}
    </style>
</head>
<body>
    <header>
        <h1>{total_count} Retro Game Worlds</h1>
        <p>Autonomous procedural 3D WebGL environments extracted from StrategyWiki walkthroughs and synthesized by Qwen3.5-3D-Coder.</p>
        <div style="text-align:center;margin:14px 0 16px;">
            <a href="walk/walker.html" style="display:inline-block;padding:12px 26px;border-radius:999px;background:linear-gradient(90deg,#4a5cff,#9b4dff);color:#fff;font-weight:700;font-size:1.05rem;text-decoration:none;">🌀 Back Roms — walk the {total_count} worlds, rift to rift ➔</a>
        </div>
        <div class="stats-bar">
            <span>Worlds Synthesized: <strong>{completed_count} / {total_count}</strong></span>
            <span>Pre-loaded Walkthroughs: <strong>{total_count} / {total_count}</strong></span>
            <span>Architecture: <strong>Three.js WebGL</strong></span>
            <span>Target Platforms: <strong>Atari, NES, SNES, Genesis, Neo Geo, Arcade</strong></span>
        </div>
    </header>
    <main>
        <div class="grid">
            {''.join(cards_html)}
        </div>
    </main>
    <footer>
        <p>Generated by Antigravity & Qwen3.5-3D-Coder • Hosted with GitHub Pages</p>
    </footer>
    <script>
        function toggleDesc(id, btn) {{
            const el = document.getElementById('desc-' + id);
            if (!el) return;
            if (el.classList.contains('collapsed')) {{
                el.classList.remove('collapsed');
                btn.textContent = 'Show less ▴';
            }} else {{
                el.classList.add('collapsed');
                btn.textContent = 'Read more ▾';
            }}
        }}
    </script>
</body>
</html>
"""
    with open(os.path.join(WORLDS_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_html)


def git_commit_and_push(world_spec: dict, filename: str):
    """Commits the newly generated world, walk module & manifest, and pushes live to GitHub."""
    os.chdir(WORLDS_DIR)
    try:
        subprocess.run(["git", "pull", "--rebase", "origin", "main"], check=True)
        subprocess.run(["git", "add", f"scenes/{filename}", "index.html", "generation_progress.json", "walk/"], check=True)
        commit_msg = f"Add #{world_spec['id']:03d} {world_spec['game']} - {world_spec['target']} 3D World"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print(f"[GitHub Sync] ✓ Pushed world #{world_spec['id']:03d} ({world_spec['game']}) to bparlette/worlds")
    except Exception as e:
        print(f"[GitHub Sync] Warning on push: {e}")


def post_process_and_publish(spec: dict, filename: str, filepath: str, specs: list, progress: dict):
    """Runs linting, Chrome verification, Walker module compilation, gallery update, and Git push in background."""
    s_id = str(spec["id"])
    # Automated Node.js syntax linting & auto-repair step
    lint_report = lint_and_autofix_scene(filepath)
    if lint_report.get("status") == "repaired":
        print(f"[Auto-Linter] Successfully auto-repaired {lint_report.get('repairs')} syntax issue(s) in {filename}")
    elif lint_report.get("status") == "clean":
        print(f"[Auto-Linter] Syntax verified clean for {filename}")
    elif lint_report.get("status") == "syntax_error":
        print(f"[Auto-Linter] Warning: Unresolved syntax error: {lint_report.get('errors')}")

    # Automated Headless Chrome WebGL & Runtime Healer
    is_verified = True
    try:
        from scene_healer import automated_rule_based_patch, test_scene_runtime_in_chrome
        with open(filepath, "r", encoding="utf-8") as f:
            c = f.read()
        patched_c = automated_rule_based_patch(c)
        if patched_c != c:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(patched_c)
        t_res = test_scene_runtime_in_chrome(filepath)
        if t_res["clean"]:
            print(f"[Chrome Verifier] ✓ {filename} renders with 0 console errors!")
            is_verified = True
        else:
            print(f"[Chrome Verifier] ⚠ Runtime warning: {t_res['errors'][:2]}")
            is_verified = False
    except Exception as e:
        print(f"[Chrome Verifier] Check exception: {e}")
        is_verified = False

    # Automated Walker Module Conversion & R8 Validation Gate
    try:
        from make_walker_module import convert_scene_to_walker_module
        walker_res = convert_scene_to_walker_module(filepath, spec)
        if walker_res.get("status") == "registered":
            print(f"[Walker Pipeline] ✓ Module registered in walk/worlds.json for #{spec['id']:03d}")
    except Exception as e:
        print(f"[Walker Pipeline] Exception in walker conversion: {e}")

    progress[s_id] = {
        "id": spec["id"],
        "game": spec["game"],
        "target": spec["target"],
        "platform": spec["platform"],
        "filename": filename,
        "verified_working": is_verified,
        "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    save_progress(progress)

    # Update Gallery index.html
    update_gallery(specs, progress)

    # Git commit & push live
    git_commit_and_push(spec, filename)


def main():
    max_count = int(sys.argv[1]) if len(sys.argv) > 1 else 1000
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        specs = json.load(f)

    progress = load_progress()
    print(f"Loaded {len(specs)} world specifications. Already completed: {len(progress)}.")

    # Background single-worker executor so post-processing (Chrome, Walker, Git)
    # overlaps with Qwen generating the next world!
    bg_executor = concurrent.futures.ThreadPoolExecutor(max_workers=1)
    pending_future = None

    count = 0
    dispatched = set()
    while True:
        # Reload the catalog every iteration: a git pull inside post-processing
        # (or an enrichment pass) may have updated it since this run started,
        # and a stale in-memory list once let per-world gallery regenerations
        # clobber the 1,000-world expansion with a 42-spec gallery (2026-11-01).
        try:
            with open(JSON_PATH, "r", encoding="utf-8") as f:
                specs = json.load(f)
        except Exception:
            pass
        spec = next((sp for sp in specs
                     if str(sp["id"]) not in progress and str(sp["id"]) not in dispatched), None)
        if spec is None:
            break

        if count >= max_count:
            print(f"Reached batch limit of {max_count} worlds. Pausing.")
            break

        # Generate world HTML on Qwen immediately
        html_code = generate_single_world(spec)

        # Wait for any previous background post-process to finish before mutating shared progress/git
        if pending_future is not None:
            pending_future.result()

        slug = re.sub(r"[^a-z0-9]+", "_", f"{spec['game']}_{spec['target']}".lower()).strip("_")
        filename = f"{spec['id']:03d}_{slug}.html"
        filepath = os.path.join(SCENES_DIR, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_code)

        # Dispatch post-processing (Linter, Chrome, Walker, Git push) asynchronously
        # so Qwen starts generating the next world immediately with zero idle gap!
        pending_future = bg_executor.submit(
            post_process_and_publish, spec, filename, filepath, specs, progress
        )
        dispatched.add(str(spec["id"]))

        count += 1

    if pending_future is not None:
        pending_future.result()
    bg_executor.shutdown(wait=True)

    print(f"\nBatch processing finished. Total worlds complete: {len(progress)} / {len(specs)}.")


if __name__ == "__main__":
    main()
