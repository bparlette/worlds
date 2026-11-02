"""
make_walker_module.py
Converts finished standalone diorama Three.js scenes into Walker-Ready modules:
walk/modules/<id>.js and updates the sorted manifest in walk/worlds.json.

Follows the exact module contract and verification gate:
- R1: One standard Three.js import
- R2: One group returned containing all meshes, lights, and effects
- R3: Per-frame animation in update(t, dt)
- R4: Ground spawn { x, z, yaw }
- R5: Doors { next: {x, z}, prev: {x, z} }
- R6: Env { background, fogColor, fogDensity }
- §4: Headless Node.js validation gate before entering walk/worlds.json
- R9: Top-down map thumbnail baked to walk/thumbs/<id>.png after a module
  validates (headless Chrome, bounds-framed orthographic render, 512x512).
  Decorative only: a bake failure logs a warning and never fails conversion.
"""

import os
import re
import sys
import json
import base64
import shutil
import struct
import tempfile
import threading
import functools
import subprocess
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

WORLDS_DIR = os.environ.get("WORLDS_DIR", "/Users/braidpairlette/worlds")
SCENES_DIR = os.path.join(WORLDS_DIR, "scenes")
WALK_DIR = os.path.join(WORLDS_DIR, "walk")
MODULES_DIR = os.path.join(WALK_DIR, "modules")
THUMBS_DIR = os.path.join(WALK_DIR, "thumbs")
MANIFEST_PATH = os.path.join(WALK_DIR, "worlds.json")
REGISTRY_PATH = os.path.join(WORLDS_DIR, "game_worlds_extracted.json")

os.makedirs(MODULES_DIR, exist_ok=True)
os.makedirs(THUMBS_DIR, exist_ok=True)

# R9 master switch; the CLI flag --no-thumbs turns it off for a run.
BAKE_THUMBS_ENABLED = True


def _load_relic_assignments():
    """walk/relics.json: { "<zero-padded world id>": {"id": ..., "name": ...} }.

    Relic identity lives in data, never in generation (R8): look beside
    this script first (the repo root), then in WALK_DIR. Absence is
    tolerated — unassigned worlds keep the legacy derivation and the
    generic visual.
    """
    for candidate in (
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "walk", "relics.json"),
        os.path.join(WALK_DIR, "relics.json"),
    ):
        try:
            with open(candidate) as f:
                data = json.load(f)
            if isinstance(data, dict):
                return data
        except Exception:
            continue
    return {}


RELIC_ASSIGNMENTS = _load_relic_assignments()


def parse_scene_to_walker(html_content: str, spec: dict, relic_anchor=None) -> str:
    script_match = re.search(r"<script\b[^>]*>([\s\S]*?)</script>", html_content, re.I)
    if not script_match:
        raise ValueError("No <script> tag found in HTML")

    js = script_match.group(1)

    world_id = spec["id"]
    formatted_id = f"{world_id:03d}"
    title = spec.get("game", "")
    sub = spec.get("target", "")
    system = spec.get("platform", "")
    header_json = json.dumps({"id": formatted_id, "title": title, "sub": sub, "system": system})

    # 1. Extract environment
    bg_match = re.search(r"scene\.background\s*=\s*new\s+THREE\.Color\((0x[0-9a-fA-F]+|\d+)\)", js)
    fog_match = re.search(r"scene\.fog\s*=\s*new\s+THREE\.Fog(?:Exp2)?\((0x[0-9a-fA-F]+|\d+),\s*([0-9\.]+)\)", js)

    bg_val = bg_match.group(1) if bg_match else "0x111111"
    fog_val = fog_match.group(1) if fog_match else bg_val
    density_val = fog_match.group(2) if fog_match else "0.025"

    # 2. Extract camera/orbit target for hero view orientation & spawn
    target_match = re.search(r"target:\s*new\s+THREE\.Vector3\(([^)]+)\)", js)
    tx, tz = 0.0, 0.0
    if target_match:
        try:
            parts = [float(p.strip()) for p in target_match.group(1).split(",")]
            tx = parts[0]
            tz = parts[2] if len(parts) > 2 else parts[1]
        except Exception:
            pass

    # 3. Clean and sandbox JS
    clean_js = re.sub(r"import\s+\*\s+as\s+THREE\s+from\s+[^;]+;?", "", js)

    # Neutralize renderer and camera construction so headless and walker run cleanly
    clean_js = re.sub(r"\bnew\s+THREE\.WebGLRenderer\([^)]*\)", "dummyRenderer()", clean_js)
    clean_js = re.sub(r"\bnew\s+THREE\.PerspectiveCamera\([^)]*\)", "dummyCamera()", clean_js)

    # Neutralize scene = new THREE.Scene() so all scene.add() go directly into group!
    clean_js = re.sub(r"\b(?:const|let|var)?\s*scene\s*=\s*new\s+THREE\.Scene\(\);?", "// scene redirect", clean_js)
    clean_js = re.sub(r"\bconst\s+renderer\s*=", "renderer =", clean_js)
    clean_js = re.sub(r"\bconst\s+camera\s*=", "camera =", clean_js)
    clean_js = re.sub(r"renderer\.domElement:\s*document\.body\.appendChild[^;]+;?", "", clean_js)
    # The module's renderer is a dummy; a real browser throws on appending its fake
    # domElement (walker stalls, bake fails). Only Node's faked document tolerated it.
    clean_js = re.sub(r"document\.body\.appendChild\(\s*renderer\.domElement\s*\);?", "", clean_js)

    spawn_z = tz + 14.0 if tz <= 0 else tz - 14.0
    door_next_x = tx + 12.0
    door_next_z = tz - 10.0
    door_prev_x = tx - 12.0
    door_prev_z = tz + 10.0

    # Relic identity + anchor (R8). The id/name come from
    # walk/relics.json when the world has an assignment — generation is
    # never told about relics, and the Walker host builds the visual
    # from walk/relics.js. Unassigned worlds keep the legacy derivation
    # with the generic id. The anchor defaults to the off-beeline
    # formula point; convert_scene_to_walker_module may pass a
    # clearance-validated anchor instead (see relic_anchor_candidates).
    assignment = RELIC_ASSIGNMENTS.get(formatted_id) or {}
    relic_id = assignment.get("id", "generic")
    relic_name = assignment.get("name") or (f"{title} Relic" if title else "Ancient Relic")
    if relic_anchor is not None:
        relic_x, relic_z = float(relic_anchor[0]), float(relic_anchor[1])
    else:
        relic_x = tx - 10.0
        relic_z = tz - 12.0 if tz <= 0 else tz + 12.0

    lines = [
        f'// @world {header_json}',
        f'// Converted from {spec.get("filename", "")} into a Back Roms World Walker module.',
        '',
        'import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";',
        '',
        'export function createWorld(THREE) {',
        '  const group = new THREE.Group();',
        '',
        '  let scene = {',
        '    add: (...objs) => objs.forEach(o => o && group.add(o)),',
        '    updateMatrixWorld: () => {},',
        '    background: null,',
        '    fog: null',
        '  };',
        '',
        '  let updateHook = null;',
        '',
        '  function dummyRenderer() {',
        '    return {',
        '      setPixelRatio: () => {},',
        '      setSize: () => {},',
        '      outputColorSpace: null,',
        '      toneMapping: null,',
        '      toneMappingExposure: null,',
        '      shadowMap: { enabled: false },',
        '      capabilities: { getMaxAnisotropy: () => 16 },',
        '      domElement: {',
        '        style: {},',
        '        setAttribute: () => {},',
        '        addEventListener: () => {},',
        '        removeEventListener: () => {}',
        '      },',
        '      render: () => {}',
        '    };',
        '  }',
        '',
        '  function dummyCamera() {',
        '    return {',
        '      position: (() => { const v = { set: () => v, copy: () => v, add: () => v, sub: () => v, addScaledVector: () => v, clone: () => v }; return v; })(),',
        '      lookAt: () => {},',
        '      updateProjectionMatrix: () => {}',
        '    };',
        '  }',
        '',
        '  let renderer = dummyRenderer();',
        '  let camera = dummyCamera();',
        '  const addEventListener = () => {};',
        '  const devicePixelRatio = 1;',
        '  const innerWidth = 1920;',
        '  const innerHeight = 1080;',
        '  const dummyEl = () => {',
        '    const node = {',
        '      style: {},',
        '      classList: { add: () => {}, remove: () => {} },',
        '      appendChild: () => {},',
        '      prepend: () => {},',
        '      setAttribute: () => {},',
        '      addEventListener: () => {},',
        '      removeEventListener: () => {}',
        '    };',
        '    return node;',
        '  };',
        '  const container = dummyEl();',
        '  const stage = dummyEl();',
        '  const app = dummyEl();',
        '  const window = typeof globalThis.window !== "undefined" ? globalThis.window : {',
        '    innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, addEventListener: () => {}',
        '  };',
        '  const document = typeof globalThis.document !== "undefined" ? globalThis.document : {',
        '    body: dummyEl(),',
        '    querySelector: () => dummyEl(),',
        '    querySelectorAll: () => [],',
        '    getElementById: () => dummyEl(),',
        '    createElement: () => {',
        '      const ctx = new Proxy({}, { get: () => () => ctx, set: () => true });',
        '      return { getContext: () => ctx, width: 64, height: 64, style: {}, appendChild: () => {}, setAttribute: () => {} };',
        '    }',
        '  };',
        '  const requestAnimationFrame = (fn) => { updateHook = fn; };',
        '',
        '  // --- Scoped Diorama Build Code ---',
        clean_js,
        '',
        '  // --- Walker Update Protocol ---',
        '  function update(t, dt) {',
        '    if (typeof updateHook === "function") {',
        '      try {',
        '        updateHook(t, dt);',
        '      } catch (e) {}',
        '    }',
        '  }',
        '',
        '  return {',
        '    group,',
        '    update,',
        f'    spawn: {{ x: {tx:.1f}, z: {spawn_z:.1f}, yaw: 0 }},',
        f'    relic: {{ id: {json.dumps(relic_id)}, name: {json.dumps(relic_name)}, x: {relic_x:.1f}, z: {relic_z:.1f} }},',
        f'    env:   {{ background: {bg_val}, fogColor: {fog_val}, fogDensity: {density_val} }},',
        '    doors: {',
        f'      next: {{ x: {door_next_x:.1f}, z: {door_next_z:.1f} }},',
        f'      prev: {{ x: {door_prev_x:.1f}, z: {door_prev_z:.1f} }}',
        '    }',
        '  };',
        '}',
        ''
    ]
    return '\n'.join(lines)


def _scene_target(html_content: str):
    """The scene's orbit target (tx, tz), parsed exactly as
    parse_scene_to_walker step 2 parses it."""
    m = re.search(r"target:\s*new\s+THREE\.Vector3\(([^)]+)\)", html_content)
    tx, tz = 0.0, 0.0
    if m:
        try:
            parts = [float(p.strip()) for p in m.group(1).split(",")]
            tx = parts[0]
            tz = parts[2] if len(parts) > 2 else parts[1]
        except Exception:
            pass
    return tx, tz


def relic_anchor_candidates(html_content: str) -> list:
    """Ordered relic-anchor candidates (R8): the formula point first —
    (tx - 10, tz -/+ 12) — then its mirrored offsets, the x/z sign
    variants of the same offsets around the scene's orbit target."""
    tx, tz = _scene_target(html_content)
    fx, mx = tx - 10.0, tx + 10.0
    fz = tz - 12.0 if tz <= 0 else tz + 12.0
    mz = tz + 12.0 if tz <= 0 else tz - 12.0
    candidates = []
    for cand in [(fx, fz), (mx, fz), (fx, mz), (mx, mz)]:
        if cand not in candidates:
            candidates.append(cand)
    return candidates


def check_relic_anchor_clear(module_path: str, anchor_x: float, anchor_z: float) -> dict:
    """
    R8 anchor clearance, run headlessly against the converted module:
    the relic floats at ground+1.05, so the 2-unit-radius column around
    the anchor must be free of scene meshes at ground level. Ground
    height is raycast at the anchor; the column is then sampled (centre
    + rings at r=1 and r=1.8, just inside the 2-unit disc) by casting
    from just above the relic's float height — a sample whose surface
    sits more than 0.6 above or below the anchor's ground means a mesh
    occupies (or drops away inside) the column at ground level.
    Scene meshes are only ever observed here, never modified.
    """
    test_script = f"""
globalThis.innerWidth = 1920;
globalThis.innerHeight = 1080;
globalThis.devicePixelRatio = 1;
globalThis.addEventListener = () => {{}};
globalThis.window = {{ innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, addEventListener: () => {{}} }};
globalThis.document = {{
  createElementNS: () => ({{ getContext: () => null, style: {{}}, addEventListener: () => {{}}, removeEventListener: () => {{}} }}),
  createElement: () => {{
    const ctx = new Proxy({{}}, {{ get: () => () => ctx, set: () => true }});
    return {{ getContext: () => ctx, width: 64, height: 64, style: {{}}, addEventListener: () => {{}}, removeEventListener: () => {{}} }};
  }},
  body: {{ appendChild: () => {{}}, prepend: () => {{}}, style: {{}} }},
  querySelector: () => ({{ style: {{}}, addEventListener: () => {{}} }}),
  getElementById: () => ({{ style: {{}}, classList: {{ add: () => {{}}, remove: () => {{}} }} }})
}};

const fs = require('fs');
let THREE;
try {{ THREE = require('/Users/braidpairlette/worlds/node_modules/three'); }}
catch (e) {{ THREE = require('three'); }}

let code = fs.readFileSync('{module_path}', 'utf8');
code = code.replace(/import\\s+\\*\\s+as\\s+THREE\\s+from\\s+[^;]+;/, '');
code = code.replace(/export\\s+function\\s+createWorld/, 'function createWorld');

try {{
  eval(code);
  const world = createWorld(THREE);
  world.group.updateMatrixWorld(true);
  const ax = {anchor_x!r}, az = {anchor_z!r};
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const topAt = (px, pz, fromY) => {{
    ray.set(new THREE.Vector3(px, fromY, pz), down);
    const hits = ray.intersectObject(world.group, true);
    return hits.length ? hits[0].point.y : null;
  }};
  const samples = [[0, 0],
    [1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7],
    [1.8, 0], [-1.8, 0], [0, 1.8], [0, -1.8], [1.27, 1.27], [-1.27, 1.27], [1.27, -1.27], [-1.27, -1.27]];
  const gTop = topAt(ax, az, 500);
  const groundY = gTop === null ? 0 : gTop;
  // Occupancy is judged AT GROUND LEVEL (the brief's own words): cast
  // from just above the floating relic (ground+2.2), so tall scenery
  // that merely overhangs the disc — a wall cap, a roof edge — never
  // blocks, while anything standing in the column does.
  const tops = samples.map(([dx, dz]) => topAt(ax + dx, az + dz, groundY + 2.2));
  let blocked = null;
  for (let i = 0; i < samples.length; i++) {{
    if (tops[i] !== null && Math.abs(tops[i] - groundY) > 0.6) {{
      blocked = {{ at: [ax + samples[i][0], az + samples[i][1]], topY: tops[i] }};
      break;
    }}
  }}
  // Perch check: a blocker at least as wide as the disc fools the test
  // above (every sample lands on its top, uniformly "flat"). Compare
  // the anchor's ground with the surrounding area's ground — the
  // median surface on a r=4 ring. An anchor perched on an object (or
  // sunk in a pit) relative to its surroundings is not clear.
  if (!blocked) {{
    const ring = [[4, 0], [-4, 0], [0, 4], [0, -4], [2.83, 2.83], [-2.83, 2.83], [2.83, -2.83], [-2.83, -2.83]];
    const ringTops = ring.map(([dx, dz]) => topAt(ax + dx, az + dz, groundY + 2.2))
      .filter(v => v !== null).sort((a, b) => a - b);
    if (ringTops.length) {{
      const areaGround = ringTops[Math.floor(ringTops.length / 2)];
      if (Math.abs(groundY - areaGround) > 0.6) {{
        blocked = {{ at: [ax, az], topY: groundY, areaGround: areaGround, reason: 'anchor ground differs from surrounding ground' }};
      }}
    }}
  }}
  console.log(JSON.stringify({{ clear: !blocked, groundY: groundY, blocked: blocked }}));
}} catch (err) {{
  console.log(JSON.stringify({{ clear: false, error: err.message }}));
}}
"""
    try:
        proc = subprocess.run(
            ["node", "-e", test_script],
            capture_output=True,
            text=True,
            timeout=30,
            env=dict(os.environ, NODE_PATH=os.path.join(WORLDS_DIR, "node_modules"))
        )
        out = proc.stdout.strip()
        if out:
            for line in out.splitlines():
                if line.startswith("{") and line.endswith("}"):
                    return json.loads(line)
        return {"clear": False, "error": proc.stderr.strip() or "No output from node anchor check"}
    except Exception as e:
        return {"clear": False, "error": str(e)}


def validate_module_in_node(module_path: str) -> dict:
    """
    Executes the §4 headless validation gate using Node.js + Three.js:
    1. The module parses and imports cleanly.
    2. createWorld(THREE) returns every required key with finite numbers.
    3. group contains at least one mesh/child.
    4. update(0, 0.016) and update(1, 0.016) execute without throwing.
    """
    test_script = f"""
globalThis.innerWidth = 1920;
globalThis.innerHeight = 1080;
globalThis.devicePixelRatio = 1;
globalThis.addEventListener = () => {{}};
globalThis.window = {{ innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, addEventListener: () => {{}} }};
globalThis.document = {{
  createElementNS: () => ({{ getContext: () => null, style: {{}}, addEventListener: () => {{}}, removeEventListener: () => {{}} }}),
  createElement: () => {{
    const ctx = new Proxy({{}}, {{ get: () => () => ctx, set: () => true }});
    return {{ getContext: () => ctx, width: 64, height: 64, style: {{}}, addEventListener: () => {{}}, removeEventListener: () => {{}} }};
  }},
  body: {{ appendChild: () => {{}}, prepend: () => {{}}, style: {{}} }},
  querySelector: () => ({{ style: {{}}, addEventListener: () => {{}} }}),
  getElementById: () => ({{ style: {{}}, classList: {{ add: () => {{}}, remove: () => {{}} }} }})
}};

const fs = require('fs');
const THREE = require('/Users/braidpairlette/worlds/node_modules/three');

let code = fs.readFileSync('{module_path}', 'utf8');
code = code.replace(/import\\s+\\*\\s+as\\s+THREE\\s+from\\s+[^;]+;/, '');
code = code.replace(/export\\s+function\\s+createWorld/, 'function createWorld');

try {{
  eval(code);
  const world = createWorld(THREE);
  if (!world) throw new Error('createWorld returned nothing');
  if (!world.group) throw new Error('Missing world.group');
  if (!world.update || typeof world.update !== 'function') throw new Error('Missing world.update function');
  if (!world.spawn || typeof world.spawn.x !== 'number' || typeof world.spawn.z !== 'number') throw new Error('Invalid world.spawn');
  if (!world.relic || typeof world.relic.name !== 'string' || typeof world.relic.x !== 'number' || typeof world.relic.z !== 'number') {{
    throw new Error('Rule R8 failed: Missing or invalid world.relic {{ name, x, z }}');
  }}
  if (world.relic.id !== undefined && typeof world.relic.id !== 'string') {{
    throw new Error('Rule R8 failed: world.relic.id must be a string when present');
  }}
  if (!world.doors || !world.doors.next || !world.doors.prev) throw new Error('Invalid world.doors');
  if (!world.env) throw new Error('Missing world.env');

  // Rule 3: Traverse meshes
  let meshCount = 0;
  world.group.traverse(o => {{ if (o.isMesh) meshCount++; }});
  if (meshCount === 0 && world.group.children.length === 0) {{
    throw new Error('Group contains 0 meshes or children');
  }}

  // Rule 4: Test animation update
  world.update(0, 0.016);
  world.update(1, 0.016);

  console.log(JSON.stringify({{ valid: true, meshCount: meshCount, totalChildren: world.group.children.length }}));
}} catch (err) {{
  console.log(JSON.stringify({{ valid: false, error: err.message }}));
}}
"""
    try:
        proc = subprocess.run(
            ["node", "-e", test_script],
            capture_output=True,
            text=True,
            timeout=8,
            env=dict(os.environ, NODE_PATH=os.path.join(WORLDS_DIR, "node_modules"))
        )
        out = proc.stdout.strip()
        if out:
            for line in out.splitlines():
                if line.startswith("{") and line.endswith("}"):
                    return json.loads(line)
        return {"valid": False, "error": proc.stderr.strip() or "No output from node validator"}
    except Exception as e:
        return {"valid": False, "error": str(e)}


# ---------------------------------------------------------------------------
# R9: Top-down map thumbnails (walk/thumbs/<id>.png)
#
# After a module validates, render it once in headless Chrome from an
# orthographic camera directly overhead, framed on the world group's own
# bounds, and save a 512x512 PNG for the Back Roms map overview. The bake
# page contains ONLY the module's group in a bare scene: modules hold no
# HUD/DOM (R2) and the Walker draws rift/relic props itself, so the frame
# is pure world and there is nothing to hide. Fog is left off for the
# survey view; the world's own env.background becomes the tile background.
#
# A bake failure must NEVER fail a conversion: every failure path logs a
# warning and returns None. Modules are the product; thumbnails are not.
# ---------------------------------------------------------------------------

THUMB_SIZE = 512
THUMB_MARGIN = 1.08  # frustum half-extent = max(bounds x/z span) / 2 * this
# Cherie's 80% rule (2026-11-01): the survey clips at 80% of the world's
# height, so enclosed worlds (caves, roofed interiors) render their
# INTERIOR — the camera effectively sits inside the roof — instead of
# the roof shell. Implemented as the ortho camera's near plane.
THUMB_CUT_FRACTION = 0.8

_BAKE_HTML = """<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:#000}canvas{display:block}</style></head>
<body>
<script type="module">
import * as THREE from "./three.module.min.js";
import { createWorld } from "./module_bake.js";
// Bounds that survive NaN-poisoned objects: a single object with NaN
// vertices/transform makes Box3.setFromObject(group) return NaN bounds
// (seen in the wild: world 007's crystals go NaN after one update tick).
// Fall back to a per-object union that simply skips non-finite boxes.
function finiteBox(b) {
  return [b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z].every(Number.isFinite);
}
function worldBounds(group) {
  const whole = new THREE.Box3().setFromObject(group);
  if (finiteBox(whole)) return whole;
  const acc = new THREE.Box3();
  const tmp = new THREE.Box3();
  group.traverse(o => {
    if (o.isMesh || o.isPoints || o.isLine) {
      tmp.setFromObject(o);
      if (finiteBox(tmp)) acc.union(tmp);
    }
  });
  return acc;
}
const out = document.createElement('pre');
out.id = 'bake-out';
try {
  const world = createWorld(THREE);
  const scene = new THREE.Scene();
  if (world.env && typeof world.env.background === 'number') {
    scene.background = new THREE.Color(world.env.background);
  }
  scene.add(world.group);
  if (typeof world.update === 'function') { try { world.update(0, 0.016); } catch (e) {} }
  scene.updateMatrixWorld(true);
  const box = worldBounds(world.group);
  if (box.isEmpty()) throw new Error('empty world bounds');
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const span = Math.max(size.x, size.z);
  const half = Math.max(span / 2, 1) * 1.08;
  const camY = box.max.y + Math.max(size.y, 1) + span + 10;
  // 80% height rule: clip away everything above cutY via the near plane,
  // so the survey sees the highest surface BELOW 80% of the world's
  // height in each column (interior floors under roofs/cave shells).
  // Near-flat worlds (no real height to be inside of) skip the cut.
  const cutY = box.min.y + size.y * 0.8;
  const near = size.y > span * 0.02 ? Math.max(camY - cutY, 0.1) : 0.1;
  const cam = new THREE.OrthographicCamera(-half, half, half, -half, near, 100000);
  cam.up.set(0, 0, -1);
  cam.position.set(center.x, camY, center.z);
  cam.lookAt(center.x, box.min.y, center.z);
  cam.updateProjectionMatrix();
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(512, 512);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  document.body.appendChild(renderer.domElement);
  renderer.render(scene, cam);
  // Reject a background-only frame (world out of frame / failed to draw):
  // sample an 8x8 grid; a real world shows more than one distinct color.
  const gl = renderer.getContext();
  const px = new Uint8Array(4);
  const seen = new Set();
  for (let gy = 0; gy < 8; gy++) {
    for (let gx = 0; gx < 8; gx++) {
      gl.readPixels(Math.floor((gx + 0.5) * 512 / 8), Math.floor((gy + 0.5) * 512 / 8), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      seen.add(px.join(','));
    }
  }
  if (seen.size < 2) throw new Error('frame is a single flat color (world not visible)');
  out.textContent = renderer.domElement.toDataURL('image/png');
  out.setAttribute('data-min', box.min.toArray().join(','));
  out.setAttribute('data-max', box.max.toArray().join(','));
} catch (e) {
  out.textContent = 'BAKE_ERROR: ' + (e && e.message ? e.message : String(e));
}
document.body.appendChild(out);
</script>
</body>
</html>
"""


class _QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def _find_chrome():
    """Locate a Chrome/Chromium binary for the R9 bake. None if unavailable."""
    for env_key in ("THUMB_CHROME_BIN", "CHROME_BIN"):
        candidate = os.environ.get(env_key)
        if candidate and os.path.exists(candidate):
            return candidate
    for name in ("google-chrome", "chromium", "chromium-browser", "chrome"):
        found = shutil.which(name)
        if found:
            return found
    for path in (
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ):
        if os.path.exists(path):
            return path
    return None


def _vendored_three_path():
    """A local three module build the bake can use offline, if one exists."""
    for path in (
        os.path.join(WALK_DIR, "three.module.min.js"),
        os.path.join(WORLDS_DIR, "node_modules", "three", "build", "three.module.js"),
        os.path.join(WORLDS_DIR, "node_modules", "three", "build", "three.module.min.js"),
    ):
        if os.path.exists(path):
            return path
    return None


def _png_dimensions(png: bytes):
    if len(png) < 24 or png[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return struct.unpack(">II", png[16:24])


def bake_thumbnail(module_path: str, formatted_id: str):
    """R9: bake walk/thumbs/<id>.png for a validated module. Never raises.

    Returns the thumbnail path on success, None (with a logged warning) on
    any failure — the conversion that called us is unaffected either way.
    """
    thumb_path = os.path.join(THUMBS_DIR, f"{formatted_id}.png")
    try:
        chrome = _find_chrome()
        if not chrome:
            print(f"[Walker Thumbs] ⚠ World #{formatted_id}: no Chrome/Chromium binary found; thumbnail skipped.")
            return None

        with open(module_path, "r", encoding="utf-8") as f:
            module_js = f.read()

        tmp = tempfile.mkdtemp(prefix=f"thumb-bake-{formatted_id}-")
        try:
            # Drive the bake from a vendored three build when one is on disk
            # (offline-safe); otherwise leave the module's R1 CDN import for
            # Chrome to fetch.
            three_src = _vendored_three_path()
            if three_src:
                shutil.copy(three_src, os.path.join(tmp, "three.module.min.js"))
                three_dir = os.path.dirname(three_src)
                for sibling in ("three.core.js", "three.core.min.js"):
                    sib_path = os.path.join(three_dir, sibling)
                    if os.path.exists(sib_path):
                        shutil.copy(sib_path, os.path.join(tmp, sibling))
                module_js = re.sub(
                    r"import\s+\*\s+as\s+THREE\s+from\s+[^;]+;?",
                    'import * as THREE from "./three.module.min.js";',
                    module_js,
                    count=1,
                )
            with open(os.path.join(tmp, "module_bake.js"), "w", encoding="utf-8") as f:
                f.write(module_js)
            with open(os.path.join(tmp, "bake.html"), "w", encoding="utf-8") as f:
                f.write(_BAKE_HTML)

            handler = functools.partial(_QuietHandler, directory=tmp)
            server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
            threading.Thread(target=server.serve_forever, daemon=True).start()
            try:
                url = f"http://127.0.0.1:{server.server_address[1]}/bake.html"
                cmd = [chrome]
                if "headless" not in os.path.basename(chrome):
                    cmd.append("--headless=new")
                cmd += [
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--use-gl=angle",
                    "--use-angle=swiftshader",
                    "--enable-unsafe-swiftshader",
                    "--virtual-time-budget=30000",
                    "--dump-dom",
                    url,
                ]
                proc = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            finally:
                server.shutdown()
        finally:
            shutil.rmtree(tmp, ignore_errors=True)

        match = re.search(r'<pre id="bake-out"[^>]*>(data:image/png;base64,[^<]+)</pre>', proc.stdout or "")
        if not match:
            err = re.search(r"BAKE_ERROR: ([^<]+)", proc.stdout or "")
            detail = err.group(1).strip() if err else "no bake output in page"
            print(f"[Walker Thumbs] ⚠ World #{formatted_id}: bake failed ({detail}); thumbnail skipped.")
            return None

        png = base64.b64decode(match.group(1).split(",", 1)[1])
        dims = _png_dimensions(png)
        if dims != (THUMB_SIZE, THUMB_SIZE) or len(png) < 4000:
            print(f"[Walker Thumbs] ⚠ World #{formatted_id}: bake produced an invalid PNG (dims={dims}, {len(png)} bytes); thumbnail skipped.")
            return None

        with open(thumb_path, "wb") as f:
            f.write(png)
        print(f"[Walker Thumbs] ✓ World #{formatted_id}: walk/thumbs/{formatted_id}.png baked ({len(png)} bytes).")
        return thumb_path
    except Exception as e:
        print(f"[Walker Thumbs] ⚠ World #{formatted_id}: bake exception ({e}); thumbnail skipped.")
        return None


def bake_all_thumbs(only_ids=None) -> list:
    """(Re)bake thumbnails for modules already registered in walk/worlds.json.

    Covers the handcrafted modules (001-005), which conversion deliberately
    skips, and backfills thumbs after pipeline changes. Never raises.
    """
    results = []
    try:
        with open(MANIFEST_PATH) as f:
            entries = json.load(f)
    except Exception as e:
        print(f"[Walker Thumbs] ⚠ Cannot read manifest {MANIFEST_PATH}: {e}")
        return results
    for entry in entries:
        formatted_id = entry.get("id", "")
        if only_ids and formatted_id not in only_ids:
            continue
        module_path = os.path.join(WALK_DIR, entry.get("module", ""))
        if not os.path.exists(module_path):
            print(f"[Walker Thumbs] ⚠ World #{formatted_id}: module {entry.get('module')} missing; skipped.")
            continue
        baked = bake_thumbnail(module_path, formatted_id)
        results.append({"id": formatted_id, "thumb": baked})
    return results


def update_walker_manifest(new_entry: dict):
    """Upserts world entry into walk/worlds.json using tools/build-walk-manifest.mjs."""
    try:
        cmd = ["node", os.path.join(WALK_DIR, "tools", "build-walk-manifest.mjs")]
        subprocess.run(cmd, check=True, cwd=WORLDS_DIR, capture_output=True, text=True)
    except Exception as e:
        print(f"[Walker Manifest] Warning running build-walk-manifest: {e}")


def convert_scene_to_walker_module(scene_path: str, spec: dict) -> dict:
    world_id = spec["id"]
    formatted_id = f"{world_id:03d}"
    module_filename = f"{formatted_id}.js"
    module_path = os.path.join(MODULES_DIR, module_filename)

    with open(scene_path, "r", encoding="utf-8") as f:
        html = f.read()

    # Never overwrite handcrafted modules 004-005 (001-003 are regenerated, v5 reboot)
    if world_id in (4, 5) and os.path.exists(module_path):
        return {"status": "skipped_handcrafted", "id": formatted_id}

    try:
        # R8 anchor clearance: try the formula anchor, then its mirrored
        # offsets; the first anchor whose 2-unit column is clear of scene
        # meshes wins and is recorded in the module. Scene meshes are
        # never deleted to clear a spot. If no candidate is clear, the
        # formula anchor is kept and the result is flagged — positions
        # are never guessed silently.
        candidates = relic_anchor_candidates(html)
        chosen_anchor = None
        anchor_warning = None
        module_js = None
        tmp_fd, tmp_path = tempfile.mkstemp(suffix=".js")
        os.close(tmp_fd)
        try:
            for cand in candidates:
                cand_js = parse_scene_to_walker(html, spec, relic_anchor=cand)
                with open(tmp_path, "w", encoding="utf-8") as f:
                    f.write(cand_js)
                if check_relic_anchor_clear(tmp_path, cand[0], cand[1]).get("clear"):
                    chosen_anchor, module_js = cand, cand_js
                    break
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        if chosen_anchor is None:
            chosen_anchor = candidates[0]
            module_js = parse_scene_to_walker(html, spec, relic_anchor=chosen_anchor)
            anchor_warning = (f"relic anchor blocked at all {len(candidates)} candidates; "
                              "formula anchor kept — set a clear anchor by hand")
            print(f"[Walker Bridge] ⚠ World #{formatted_id}: {anchor_warning}")
        elif chosen_anchor != candidates[0]:
            print(f"[Walker Bridge] World #{formatted_id}: formula relic anchor blocked; "
                  f"mirrored anchor ({chosen_anchor[0]:.1f}, {chosen_anchor[1]:.1f}) is clear.")

        with open(module_path, "w", encoding="utf-8") as f:
            f.write(module_js)

        # Validate with headless node
        val = validate_module_in_node(module_path)
        if val.get("valid"):
            manifest_entry = {
                "id": formatted_id,
                "module": f"modules/{module_filename}",
                "title": spec["game"],
                "sub": spec["target"],
                "system": spec["platform"]
            }
            update_walker_manifest(manifest_entry)
            print(f"[Walker Bridge] ✓ World #{formatted_id} ({spec['game']}) validated ({val.get('meshCount')} meshes) & registered in walk/worlds.json!")
            # R9: bake the top-down map thumbnail. Decorative only — a bake
            # failure returns None here and never affects registration.
            thumb = bake_thumbnail(module_path, formatted_id) if BAKE_THUMBS_ENABLED else None
            result = {"status": "registered", "id": formatted_id, "thumb": thumb,
                      "relic_anchor": [chosen_anchor[0], chosen_anchor[1]]}
            if anchor_warning:
                result["anchor_warning"] = anchor_warning
            return result
        else:
            # Remove invalid module so build-walk-manifest.mjs remains clean
            if os.path.exists(module_path):
                os.remove(module_path)
            print(f"[Walker Bridge] ⚠ World #{formatted_id} validation failed: {val.get('error')}")
            return {"status": "validation_failed", "error": val.get("error")}
    except Exception as e:
        if os.path.exists(module_path):
            os.remove(module_path)
        print(f"[Walker Bridge] Exception converting World #{formatted_id}: {e}")
        return {"status": "error", "error": str(e)}


if __name__ == "__main__":
    import glob
    import argparse

    parser = argparse.ArgumentParser(description="Convert scenes to Walker modules (with R9 thumbnail bake).")
    parser.add_argument("--no-thumbs", action="store_true",
                        help="Skip the R9 top-down thumbnail bake after conversion.")
    parser.add_argument("--bake-thumbs", action="store_true",
                        help="Only (re)bake thumbnails for modules already in walk/worlds.json, then exit.")
    parser.add_argument("--ids", nargs="*", default=None,
                        help="With --bake-thumbs, limit to these world ids (e.g. --ids 001 007).")
    args = parser.parse_args()

    if args.no_thumbs:
        BAKE_THUMBS_ENABLED = False

    if args.bake_thumbs:
        only = {f"{int(i):03d}" for i in args.ids} if args.ids else None
        bake_all_thumbs(only)
        sys.exit(0)

    with open(REGISTRY_PATH) as f:
        specs = {s["id"]: s for s in json.load(f)}

    print("Running Walker Module conversion on all completed scenes...")
    for s_path in sorted(glob.glob(os.path.join(SCENES_DIR, "*.html"))):
        m = re.search(r"(\d+)_", os.path.basename(s_path))
        if m:
            s_id = int(m.group(1))
            if s_id in specs:
                convert_scene_to_walker_module(s_path, specs[s_id])
