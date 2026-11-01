"""
generate_worlds.py
Feeds extracted retro walkthrough prompts into Qwen 3.5 3D-Coder (via llama-server port 8082),
generates complete standalone Three.js WebGL 3D worlds, saves them, generates a gallery portal,
and commits/pushes each generated world incrementally to GitHub repo 'bparlette/worlds'.
"""

import os
import sys
import json
import time
import re
import urllib.request
import urllib.error
import subprocess
from scene_linter import lint_and_autofix_scene

WORLDS_DIR = "/Users/braidpairlette/worlds"
SCENES_DIR = os.path.join(WORLDS_DIR, "scenes")
JSON_PATH = os.path.join(WORLDS_DIR, "game_worlds_extracted.json")
PROGRESS_PATH = os.path.join(WORLDS_DIR, "generation_progress.json")
LLAMA_PORT = 8082

os.makedirs(SCENES_DIR, exist_ok=True)

SYSTEM_PROMPT = """You are an expert 3D WebGL / Three.js developer.
Generate a complete, self-contained 3D WebGL interactive world inside a single HTML file.
CRITICAL CONSTRAINTS:
1. Write concise, clean, highly modular Three.js code that ALWAYS finishes completely within 2,500 tokens.
2. Must properly close all functions, add the animation loop (requestAnimationFrame), and close </script></body></html>. NEVER leave code unfinished or cut off mid-function.
3. Use only Three.js core ES module:
   https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js
4. Implement native drag-to-orbit camera controls directly in JS.
5. Create recognizable landmarks, atmospheric lighting/fog, and animated elements.
6. Output ONLY executable HTML inside ```html ... ```."""


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


def generate_single_world(spec: dict) -> str:
    prompt = spec["qwen_prompt"]
    print(f"\n[AI Dispatch] Sending #{spec['id']:03d} {spec['game']} - {spec['target']} to Qwen3.5-3D-Coder...")

    payload = {
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 31500,
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

    return html


def update_gallery(specs: list, progress: dict):
    """Regenerates index.html with interactive cards for all generated worlds."""
    completed = [s for s in specs if str(s["id"]) in progress]

    cards_html = []
    for s in completed:
        info = progress[str(s["id"])]
        filename = info["filename"]
        cards_html.append(f"""
        <div class="world-card">
            <div class="card-header">
                <span class="badge platform">{s['platform']}</span>
                <span class="world-id">#{s['id']:03d}</span>
            </div>
            <div class="card-body">
                <h3>{s['game']}</h3>
                <h4>{s['target']}</h4>
                <p class="description">{s['description'][:140]}...</p>
            </div>
            <div class="card-footer">
                <a class="play-btn" href="scenes/{filename}" target="_blank">Launch 3D World ➔</a>
            </div>
        </div>
        """)

    index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>100 Retro Worlds - 3D WebGL Walkthrough Explorer</title>
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
        .description {{
            font-size: 0.88rem;
            color: var(--text-muted);
            line-height: 1.5;
            margin-bottom: 20px;
            flex: 1;
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
        <h1>100 Retro Game Worlds</h1>
        <p>Autonomous procedural 3D WebGL environments extracted from StrategyWiki walkthroughs and synthesized by Qwen3.5-3D-Coder.</p>
        <div class="stats-bar">
            <span>Worlds Synthesized: <strong>{len(completed)} / 100</strong></span>
            <span>Architecture: <strong>Three.js WebGL</strong></span>
            <span>Target Platforms: <strong>Atari, NES, SNES, Genesis, Arcade</strong></span>
        </div>
    </header>
    <main>
        <div class="grid">
            {''.join(cards_html) if cards_html else '<p style="color:var(--text-muted);grid-column:1/-1;text-align:center;">Synthesizing worlds...</p>'}
        </div>
    </main>
    <footer>
        <p>Generated by Antigravity & Qwen3.5-3D-Coder • Hosted with GitHub Pages</p>
    </footer>
</body>
</html>
"""
    with open(os.path.join(WORLDS_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_html)


def git_commit_and_push(world_spec: dict, filename: str):
    """Commits the newly generated world and pushes live to GitHub."""
    os.chdir(WORLDS_DIR)
    try:
        subprocess.run(["git", "add", f"scenes/{filename}", "index.html", "generation_progress.json"], check=True)
        commit_msg = f"Add #{world_spec['id']:03d} {world_spec['game']} - {world_spec['target']} 3D World"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        subprocess.run(["git", "push", "origin", "main"], check=True)
        print(f"[GitHub Sync] ✓ Pushed world #{world_spec['id']:03d} ({world_spec['game']}) to bparlette/worlds")
    except Exception as e:
        print(f"[GitHub Sync] Warning on push: {e}")


def main():
    max_count = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        specs = json.load(f)

    progress = load_progress()
    print(f"Loaded {len(specs)} world specifications. Already completed: {len(progress)}.")

    count = 0
    for spec in specs:
        s_id = str(spec["id"])
        if s_id in progress:
            continue

        if count >= max_count:
            print(f"Reached batch limit of {max_count} worlds. Pausing.")
            break

        # Generate world HTML
        html_code = generate_single_world(spec)

        slug = re.sub(r"[^a-z0-9]+", "_", f"{spec['game']}_{spec['target']}".lower()).strip("_")
        filename = f"{spec['id']:03d}_{slug}.html"
        filepath = os.path.join(SCENES_DIR, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_code)

        # Automated Node.js syntax linting & auto-repair step
        lint_report = lint_and_autofix_scene(filepath)
        if lint_report.get("status") == "repaired":
            print(f"[Auto-Linter] Successfully auto-repaired {lint_report.get('repairs')} syntax issue(s) in {filename}")
        elif lint_report.get("status") == "clean":
            print(f"[Auto-Linter] Syntax verified clean for {filename}")
        elif lint_report.get("status") == "syntax_error":
            print(f"[Auto-Linter] Warning: Unresolved syntax error: {lint_report.get('errors')}")

        progress[s_id] = {
            "id": spec["id"],
            "game": spec["game"],
            "target": spec["target"],
            "platform": spec["platform"],
            "filename": filename,
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        save_progress(progress)

        # Update Gallery index.html
        update_gallery(specs, progress)

        # Git commit & push live
        git_commit_and_push(spec, filename)

        count += 1
        time.sleep(1)

    print(f"\nBatch processing finished. Total worlds complete: {len(progress)} / 100.")


if __name__ == "__main__":
    main()
