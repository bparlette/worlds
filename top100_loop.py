#!/usr/bin/env python3
"""Top-100 screens build loop.

Runs art/top100.json through the SAME generator, sanitizer, walker converter
and thumbnail baker as the 1,000-world catalog, one world at a time in rank
order. Only the Qwen prompt differs (screens, not maps). Each rank gets world
id 1000+rank so it can never collide with catalog ids 1-1000.

Usage: python3 -u top100_loop.py [max_worlds]
"""
import io
import json
import os
import re
import subprocess
import sys
import time
import urllib.request

import generate_worlds as g
import make_walker_module as m
from scene_healer import automated_rule_based_patch, test_scene_runtime_in_chrome

ROOT = g.WORLDS_DIR
ART_PATH = os.path.join(ROOT, "art", "top100.json")
PROGRESS = os.path.join(ROOT, "top100_progress.json")
RENDER_DIR = os.path.join(ROOT, "art", "top100-renders")
os.makedirs(RENDER_DIR, exist_ok=True)

ID_BASE = 1000
MAX_ATTEMPTS = 2
# Gate tolerances (owner: size close is enough; height barely matters).
XZ_CAP, Y_CAP = 32.0, 20.0

IMAGE_TYPE = (
    "IMAGE TYPE: this image is a single gameplay SCREEN — one place at player-view scale, "
    "not a map. Build the entire pictured place. There is no larger map and no section to "
    "choose; do not crop, zoom, or select a sub-area."
)
WHO = (
    "WHO IS IN THE PICTURE: the screen may show characters, enemies, a player sprite, HUD, "
    "score counters, and text. Build NONE of those. Build only the background world — the "
    "terrain, buildings, platforms, scenery, and fixed props that would remain if every "
    "character and every HUD element vanished. Characters set the scale and nothing else. "
    "No text, no letters, no HUD shapes as geometry."
)
STANDARD_TAIL = (
    "Keep it within 30x30 units across and 13 units high. Walls must be inside-only: give "
    "wall materials side: THREE.BackSide so they are solid from inside and not drawn from "
    "outside. Include lighting, fog, textures/materials, animated environmental elements, "
    "and mouse/touch orbit camera controls. "
    "RELIC: You MUST explicitly declare a relic object in your scene: "
    "const relic = { name: '<iconic treasure for this game>', x: <x on walkable ground>, z: <z on walkable ground> };"
)

# The catalog system prompt tells Qwen to pick one section of a multi-room sheet;
# screens have no sections, so drop that one sentence and keep everything else.
g.SYSTEM_PROMPT = re.sub(
    r" If the reference map shows a whole world or multi-room sheet, build ONLY its single "
    r"most iconic room/section at full detail\.",
    " Build the entire pictured place compactly inside that footprint.",
    g.SYSTEM_PROMPT,
)

TEXT_TECHNIQUES = re.compile(r"fillText|strokeText|TextGeometry|FontLoader|THREE\.Sprite\b|CSS2DObject|CSS3DObject")
CHAR_HUD_IDENT = re.compile(r"\b\w*(?:player|enemy|enemies|npc|avatar|hud|scoreboard|score|lives|character)\w*\b", re.I)


def load_progress():
    if os.path.exists(PROGRESS):
        with open(PROGRESS, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_progress(p):
    with open(PROGRESS, "w", encoding="utf-8") as f:
        json.dump(p, f, indent=2)


ART_PAGE = os.path.join(ROOT, "art", "index.html")
ART_CSS = (".build{padding:0 14px 12px}.build .play{display:block;text-align:center;background:#e0b64f;color:#111;"
           "text-decoration:none;padding:9px 14px;border-radius:9px;font-weight:bold;font-size:.9rem}"
           ".build .updated-at{display:block;margin-top:6px;text-align:center;font-size:.72rem;color:#77747f}"
           ".build .parked{display:block;text-align:center;color:#c9a64a;font-size:.85rem}")


def update_art_page(progress):
    """Add/refresh each finished rank's Launch 3D World button + 'Updated' stamp on art/index.html."""
    with open(ART_PAGE, "r", encoding="utf-8") as f:
        html = f.read()
    if ".build{" not in html:
        html = html.replace("</style>", ART_CSS + "</style>", 1)

    def card(mo):
        block = re.sub(r'<div class="build">[\s\S]*?</div>\s*', "", mo.group(0))
        rk = re.search(r'<b>#(\d+)</b>', block) or re.search(r'<span class="rank">#(\d+)</span>', block)
        info = progress.get(rk.group(1)) if rk else None
        if not info or not info.get("filename"):
            return block
        stamp = info.get("updated_at", "")
        if info["status"] == "pass":
            inner = (f'<a class="play" href="../scenes/{info["filename"]}" target="_blank">Launch 3D World ➔</a>'
                     f'<span class="updated-at">Updated {stamp}</span>')
        else:
            inner = f'<span class="parked">⚠ Parked — needs a rebuild</span><span class="updated-at">Updated {stamp}</span>'
        return block.replace("</figure>", f'<div class="build">{inner}</div>\n</figure>', 1)

    html = re.sub(r'<figure(?:\s+class="[^"]*")?>[\s\S]*?</figure>', card, html)
    with open(ART_PAGE, "w", encoding="utf-8") as f:
        f.write(html)


def build_spec(e):
    return {
        "id": ID_BASE + e["rank"],
        "game": e["game"],
        "target": e["name"],
        "platform": "",
        "description": e["name"],
        "qwen_prompt": (
            f"Generate a fully interactive 3D WebGL Three.js world representing '{e['name']}' "
            f"from {e['game']}. World brief: {e['name']}, {e['game']}. "
            f"{IMAGE_TYPE} {WHO} {STANDARD_TAIL}"
        ),
        "image_urls": [e["image_url"]],
        "image_kinds": ["screen"],
        "image_only": os.environ.get("T100_IMAGE_ONLY") == "1",
    }


def script_text(html):
    return "\n".join(re.findall(r"<script[^>]*>([\s\S]*?)</script>", html))


def strip_comments_strings(js):
    js = re.sub(r"/\*[\s\S]*?\*/", "", js)
    js = re.sub(r"(?m)//.*$", "", js)
    return re.sub(r"(['\"`])(?:\\.|(?!\1).)*\1", '""', js)


def measure_module(module_path):
    """Bounds of the walker module's group via Node + three (finite boxes only)."""
    script = f"""
globalThis.innerWidth=1920;globalThis.innerHeight=1080;globalThis.devicePixelRatio=1;
globalThis.addEventListener=()=>{{}};globalThis.window={{innerWidth:1920,innerHeight:1080,devicePixelRatio:1,addEventListener:()=>{{}}}};
globalThis.document={{createElementNS:()=>({{getContext:()=>null,style:{{}},addEventListener:()=>{{}},removeEventListener:()=>{{}}}}),
createElement:()=>{{const c=new Proxy({{}},{{get:()=>()=>c,set:()=>true}});return{{getContext:()=>c,width:64,height:64,style:{{}},addEventListener:()=>{{}},removeEventListener:()=>{{}}}};}},
body:{{appendChild:()=>{{}},prepend:()=>{{}},style:{{}}}},querySelector:()=>({{style:{{}},addEventListener:()=>{{}}}}),
getElementById:()=>({{style:{{}},classList:{{add:()=>{{}},remove:()=>{{}}}}}})}};
const fs=require('fs');const THREE=require('{ROOT}/node_modules/three');
let code=fs.readFileSync('{module_path}','utf8');
code=code.replace(/import\\s+\\*\\s+as\\s+THREE\\s+from\\s+[^;]+;/,'').replace(/export\\s+function\\s+createWorld/,'function createWorld');
eval(code);const w=createWorld(THREE);w.update(0,0.016);w.group.updateMatrixWorld(true);
const acc=new THREE.Box3(),tmp=new THREE.Box3();
w.group.traverse(o=>{{if(o.isMesh){{tmp.setFromObject(o);if([tmp.min.x,tmp.min.y,tmp.min.z,tmp.max.x,tmp.max.y,tmp.max.z].every(Number.isFinite))acc.union(tmp);}}}});
console.log(JSON.stringify({{min:acc.min.toArray(),max:acc.max.toArray(),spawn:w.spawn,relic:w.relic,doors:w.doors}}));
"""
    proc = subprocess.run(["node", "-e", script], capture_output=True, text=True, timeout=30,
                          env=dict(os.environ, NODE_PATH=os.path.join(ROOT, "node_modules")))
    for line in proc.stdout.splitlines():
        if line.startswith("{"):
            return json.loads(line)
    raise RuntimeError(proc.stderr.strip()[-300:] or "no measurement output")


def screenshot(scene_path, out_jpg):
    chrome = m._find_chrome()
    png = "/tmp/top100_shot.png"
    if os.path.exists(png):
        os.remove(png)
    subprocess.run([chrome, "--headless=new", "--enable-unsafe-swiftshader", "--use-angle=swiftshader",
                    "--window-size=1000,700", "--virtual-time-budget=6000", f"--screenshot={png}",
                    "file://" + scene_path], capture_output=True, text=True, timeout=120)
    from PIL import Image
    im = Image.open(png).convert("RGB")
    im.thumbnail((800, 560))
    im.save(out_jpg, "JPEG", quality=70)
    return out_jpg


def vision_check(ref_uri, render_path):
    """Advisory only: ask local Qwen whether the render contains characters/HUD/text."""
    try:
        import base64
        with open(render_path, "rb") as f:
            uri = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode()
        parts = [
            {"type": "text", "text": "Reference game screen:"},
            {"type": "image_url", "image_url": {"url": ref_uri}},
            {"type": "text", "text": "Our 3D rebuild of it:"},
            {"type": "image_url", "image_url": {"url": uri}},
            {"type": "text", "text": "In the 3D rebuild only, is there any person/creature/character-shaped object, "
                                     "HUD element, score counter, or letter/text shape? "
                                     'Answer ONLY JSON: {"character":true|false,"text_or_hud":true|false}'},
        ]
        payload = {"messages": [{"role": "user", "content": parts}], "max_tokens": 60, "temperature": 0}
        req = urllib.request.Request(f"http://127.0.0.1:{g.LLAMA_PORT}/v1/chat/completions",
                                     data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=180) as r:
            txt = json.loads(r.read())["choices"][0]["message"]["content"]
        mt = re.search(r"\{[^}]*\}", txt)
        return json.loads(mt.group(0)) if mt else {"raw": txt[:80]}
    except Exception as ex:
        return {"error": str(ex)[:80]}


def attempt(e, n):
    """One generate + gate pass. Returns (ok, record)."""
    spec = build_spec(e)
    rec = {"attempt": n, "fails": [], "measured": {}}
    t0 = time.time()
    html = g.generate_single_world(spec)
    rec["gen_sec"] = round(time.time() - t0, 1)
    slug = re.sub(r"[^a-z0-9]+", "_", f"{spec['game']}_{spec['target']}".lower()).strip("_")
    filename = f"{spec['id']:03d}_{slug}.html"
    filepath = os.path.join(g.SCENES_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)
    rec["filename"] = filename

    g.lint_and_autofix_scene(filepath)
    with open(filepath, "r", encoding="utf-8") as f:
        c = f.read()
    patched = automated_rule_based_patch(c)
    if patched != c:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(patched)
        c = patched

    # Gate 1: loads error-free
    rt = test_scene_runtime_in_chrome(filepath, timeout_sec=12)
    if rt.get("status") != "clean":
        rec["fails"].append(f"runtime: {str(rt.get('errors'))[:160]}")

    # Gate 2: conversion validates (+ thumbnail baked)
    conv = m.convert_scene_to_walker_module(filepath, spec)
    rec["conversion"] = conv.get("status")
    if conv.get("status") != "registered":
        rec["fails"].append(f"conversion: {conv}")
    elif not conv.get("thumb"):
        rec["fails"].append("thumbnail not baked")

    # Gate 3: footprint / height measured inside caps; spawn, doors, relic present
    if conv.get("status") == "registered":
        try:
            ms = measure_module(os.path.join(m.MODULES_DIR, f"{spec['id']:03d}.js"))
            x = ms["max"][0] - ms["min"][0]
            z = ms["max"][2] - ms["min"][2]
            rec["measured"] = {"x": round(x, 2), "z": round(z, 2), "y_max": round(ms["max"][1], 2),
                               "y_min": round(ms["min"][1], 2)}
            if x > XZ_CAP or z > XZ_CAP:
                rec["fails"].append(f"footprint {x:.1f}x{z:.1f} > 32")
            if ms["max"][1] > Y_CAP:
                rec["fails"].append(f"height {ms['max'][1]:.1f} > 20")
            if not (ms.get("spawn") and ms.get("doors") and ms.get("relic")):
                rec["fails"].append("spawn/doors/relic missing in module")
        except Exception as ex:
            rec["fails"].append(f"measure: {ex}")

    # Gate 4: scene source — relic, inside-only walls, no text/character/HUD geometry
    js = script_text(c)
    if not re.search(r"relic", js, re.I):
        rec["fails"].append("no relic in scene")
    if "BackSide" not in js:
        rec["fails"].append("walls not BackSide")
    if TEXT_TECHNIQUES.search(js):
        rec["fails"].append("text geometry technique: " + TEXT_TECHNIQUES.search(js).group(0))
    hits = sorted({h.lower() for h in CHAR_HUD_IDENT.findall(strip_comments_strings(js))})
    if hits:
        rec["fails"].append("character/HUD identifiers: " + ",".join(hits[:6]))

    # Render for review + advisory Qwen vision check (not a hard gate)
    try:
        shot = screenshot(filepath, os.path.join(RENDER_DIR, f"{e['rank']:03d}.jpg"))
        ref = g._image_data_uri(e["image_url"])
        rec["vision"] = vision_check(ref, shot)
    except Exception as ex:
        rec["vision"] = {"error": str(ex)[:80]}
    return (not rec["fails"]), rec


def commit(e, status, rec):
    os.chdir(ROOT)
    spec_id = ID_BASE + e["rank"]
    paths = [f"scenes/{rec['filename']}", "walk/", "top100_progress.json", "art/top100-renders/", "art/index.html"]
    subprocess.run(["git", "add", "-A", "--"] + paths, check=True)
    tag = "" if status == "pass" else " [PARKED]"
    msg = (f"top100 #{e['rank']:03d} {e['game']} — {e['name']}{tag}\n\n"
           f"Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>")
    r = subprocess.run(["git", "commit", "-q", "-m", msg], capture_output=True, text=True)
    if r.returncode != 0 and "nothing to commit" not in (r.stdout + r.stderr):
        print("[commit] " + (r.stderr or r.stdout)[:200])
    for _ in range(4):
        pull = subprocess.run(["git", "pull", "--rebase", "origin", "main"], capture_output=True, text=True)
        push = subprocess.run(["git", "push", "origin", "main"], capture_output=True, text=True)
        if push.returncode == 0:
            print(f"[push] ✓ #{e['rank']:03d}")
            return
        time.sleep(5)
    print("[push] ⚠ failed:", (push.stderr or pull.stderr)[-200:])


def main():
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else 100
    with open(ART_PATH, "r", encoding="utf-8") as f:
        entries = sorted(json.load(f), key=lambda x: x["rank"])
    progress = load_progress()
    done = 0
    for e in entries:
        key = str(e["rank"])
        if key in progress:
            continue
        if done >= limit:
            break
        print(f"\n=== top100 #{e['rank']:03d} {e['game']} — {e['name']} ===", flush=True)
        attempts = []
        status = "parked"
        for n in (1, 2):
            try:
                ok, rec = attempt(e, n)
            except Exception as ex:
                ok, rec = False, {"attempt": n, "fails": [f"exception: {str(ex)[:160]}"], "filename": "", "measured": {}}
            attempts.append(rec)
            print(f"  attempt {n}: {'PASS' if ok else 'FAIL ' + '; '.join(rec['fails'])} "
                  f"{rec.get('measured')} vision={rec.get('vision')}", flush=True)
            if ok:
                status = "pass"
                break
        final = attempts[-1]
        progress[key] = {"rank": e["rank"], "game": e["game"], "name": e["name"], "status": status,
                         "filename": final.get("filename", ""), "measured": final.get("measured"),
                         "vision": final.get("vision"), "fails": final["fails"],
                         "attempts": len(attempts), "updated_at": time.strftime("%Y-%m-%d %H:%M %Z")}
        save_progress(progress)
        update_art_page(progress)
        if final.get("filename"):
            commit(e, status, final)
        done += 1
    print("\nTop100 loop pause. Passed:", sum(1 for v in progress.values() if v["status"] == "pass"),
          "Parked:", sum(1 for v in progress.values() if v["status"] == "parked"))


if __name__ == "__main__":
    main()
