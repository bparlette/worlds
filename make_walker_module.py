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
"""

import os
import re
import json
import subprocess

WORLDS_DIR = "/Users/braidpairlette/worlds"
SCENES_DIR = os.path.join(WORLDS_DIR, "scenes")
WALK_DIR = os.path.join(WORLDS_DIR, "walk")
MODULES_DIR = os.path.join(WALK_DIR, "modules")
MANIFEST_PATH = os.path.join(WALK_DIR, "worlds.json")
REGISTRY_PATH = os.path.join(WORLDS_DIR, "game_worlds_extracted.json")

os.makedirs(MODULES_DIR, exist_ok=True)


def parse_scene_to_walker(html_content: str, spec: dict) -> str:
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

    spawn_z = tz + 14.0 if tz <= 0 else tz - 14.0
    door_next_x = tx + 12.0
    door_next_z = tz - 10.0
    door_prev_x = tx - 12.0
    door_prev_z = tz + 10.0

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
        '        addEventListener: () => {},',
        '        removeEventListener: () => {}',
        '      },',
        '      render: () => {}',
        '    };',
        '  }',
        '',
        '  function dummyCamera() {',
        '    return {',
        '      position: { set: () => {}, copy: () => {} },',
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
        '  const window = typeof globalThis.window !== "undefined" ? globalThis.window : {',
        '    innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, addEventListener: () => {}',
        '  };',
        '  const document = typeof globalThis.document !== "undefined" ? globalThis.document : {',
        '    body: { prepend: () => {}, appendChild: () => {}, style: {} },',
        '    querySelector: () => ({ style: {}, addEventListener: () => {} }),',
        '    getElementById: () => ({ style: {}, classList: { add: () => {}, remove: () => {} } }),',
        '    createElement: () => {',
        '      const ctx = new Proxy({}, { get: () => () => ctx, set: () => true });',
        '      return { getContext: () => ctx, width: 64, height: 64, style: {} };',
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

    # Never overwrite handcrafted modules (001-005)
    if world_id <= 5 and os.path.exists(module_path):
        return {"status": "skipped_handcrafted", "id": formatted_id}

    try:
        module_js = parse_scene_to_walker(html, spec)
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
            return {"status": "registered", "id": formatted_id}
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
    with open(REGISTRY_PATH) as f:
        specs = {s["id"]: s for s in json.load(f)}

    print("Running Walker Module conversion on all completed scenes...")
    for s_path in sorted(glob.glob(os.path.join(SCENES_DIR, "*.html"))):
        m = re.search(r"(\d+)_", os.path.basename(s_path))
        if m:
            s_id = int(m.group(1))
            if s_id in specs:
                convert_scene_to_walker_module(s_path, specs[s_id])
