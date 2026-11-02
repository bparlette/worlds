"""
make_parts_module.py
The JSON parts-list pipeline (see prompts/PARTS-PIPELINE.md): Qwen emits
ONLY a JSON parts list — no JavaScript — and this deterministic builder
script turns it into a Walker-Ready module with the exact contract of
make_walker_module.py's output (R1-R8):

    python3 make_parts_module.py <parts.json> [--out <path>]
    python3 make_parts_module.py --selftest

Steps: input repair (strip markdown fences, drop trailing commas,
salvage complete parts out of a truncated document) -> validate +
repair the parts (per-part graceful degradation) -> analytic bounds
-> mechanical normalization scale -> degeneracy gates (repair ratio,
sliver footprint) -> spawn/doors/relic
anchors (relic identity from walk/relics.json, anchor chosen with the
same ground-column clearance algorithm as make_walker_module.py) ->
emit the module (buildParts from walk/parts.js does the geometry) ->
headless Node gate before the module is written anywhere real.

Nothing here registers the module in walk/worlds.json and nothing
touches the JS-scene pipeline; parts modules land beside their source
(walk/parts/<id>.module.js) until a human promotes them.
"""

import os
import re
import sys
import json
import math
import shutil
import subprocess
import tempfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
WORLDS_DIR = os.environ.get("WORLDS_DIR", "/Users/braidpairlette/worlds")
WALK_DIR = os.path.join(WORLDS_DIR, "walk")

SHAPES = {"box", "cyl", "sph", "cone", "tor", "wed", "gnd"}
ANIMS = {"none", "bob", "spin", "sway", "pulse"}
COLOR_RE = re.compile(r"^#[0-9a-fA-F]{6}$")
MAX_PARTS = 800
MAX_REPEAT = 500
POS_CLAMP = 80.0
SIZE_MIN, SIZE_MAX = 0.05, 60.0
CAP_W, CAP_D, CAP_H = 30.0, 30.0, 13.0
SCALE_MAX = 1.25
FOG_DENSITY = 0.02


def _load_relic_assignments():
    """walk/relics.json — same lookup as make_walker_module.py: beside
    this script first, then in WALK_DIR. Absence is tolerated."""
    for candidate in (
        os.path.join(SCRIPT_DIR, "walk", "relics.json"),
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


# ---------------------------------------------------------------------------
# Input repair. Qwen's raw output needs mechanical cleanup before it
# can be parsed at all: it arrives wrapped in markdown fences, with
# trailing commas, or cut off mid-object at the token cap. Each stage
# is attempted in order and every action is returned as a repair line,
# counted in the run's repair accounting. A document that yields zero
# parts raises, exactly like an unparseable file always did.
# ---------------------------------------------------------------------------

_TRAILING_COMMA_RE = re.compile(r",(\s*[}\]])")


def _strip_code_fence(text):
    """Remove a leading ``` / ```json fence line and a trailing fence.
    The closing fence may be absent (truncated output)."""
    t = text.strip()
    if not t.startswith("```"):
        return text, False
    nl = t.find("\n")
    if nl < 0:
        return text, False
    body = t[nl + 1:]
    tail = body.rstrip()
    if tail.endswith("```"):
        body = tail[:-3]
    return body, True


def _fix_trailing_commas(text):
    return _TRAILING_COMMA_RE.subn(r"\1", text)


def _salvage_parts_array(text):
    """Scan the "parts" array for complete balanced {...} objects
    (string- and escape-aware) and parse each one. Returns the list of
    recovered part objects — possibly empty."""
    m = re.search(r'"parts"\s*:\s*\[', text)
    if not m:
        return []
    i = m.end()
    n = len(text)
    parts = []
    while i < n:
        while i < n and text[i] in " \t\r\n,":
            i += 1
        if i >= n or text[i] == "]":
            break
        if text[i] != "{":
            nxt = text.find("{", i)
            if nxt < 0:
                break
            i = nxt
        depth = 0
        in_str = False
        esc = False
        j = i
        complete = False
        while j < n:
            ch = text[j]
            if in_str:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == '"':
                    in_str = False
            elif ch == '"':
                in_str = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    complete = True
                    j += 1
                    break
            j += 1
        if not complete:
            break
        try:
            obj = json.loads(_fix_trailing_commas(text[i:j])[0])
            if isinstance(obj, dict):
                parts.append(obj)
        except Exception:
            pass
        i = j
    return parts


def _salvage_header(text):
    """Best-effort extraction of the world-level fields from raw text
    (used only when the document as a whole does not parse). Part
    objects never carry these keys, so a plain scan is safe."""
    header = {}
    m = re.search(r'"id"\s*:\s*("[^"]*"|\d+)', text)
    if m:
        try:
            header["id"] = json.loads(m.group(1))
        except Exception:
            pass
    for key in ("title", "game"):
        m = re.search(r'"%s"\s*:\s*"((?:[^"\\]|\\.)*)"' % key, text)
        if m:
            try:
                header[key] = json.loads('"%s"' % m.group(1))
            except Exception:
                header[key] = m.group(1)
    for key in ("sky", "fog", "ground"):
        m = re.search(r'"%s"\s*:\s*"(#[0-9a-fA-F]{6})"' % key, text)
        if m:
            header[key] = m.group(1)
    return header


def load_parts_data(path):
    """Returns (data, input_repairs). Raises if no parseable document
    and no salvageable parts can be recovered."""
    with open(path, "r", encoding="utf-8") as f:
        raw = f.read()
    repairs = []
    try:
        return json.loads(raw), repairs
    except Exception:
        pass
    text, fenced = _strip_code_fence(raw)
    if fenced:
        repairs.append("input: stripped markdown code fence")
        try:
            return json.loads(text), repairs
        except Exception:
            pass
    fixed, n_commas = _fix_trailing_commas(text)
    if n_commas:
        repairs.append(f"input: removed {n_commas} trailing comma(s)")
        try:
            return json.loads(fixed), repairs
        except Exception:
            pass
    salvaged = _salvage_parts_array(text)
    if salvaged:
        data = _salvage_header(text)
        data["parts"] = salvaged
        repairs.append(
            f"input truncated/unparseable: salvaged {len(salvaged)} complete parts")
        return data, repairs
    # Nothing recovered — re-raise the original parse error verbatim so
    # the failure reads exactly as it did before input repair existed.
    json.loads(raw)
    raise ValueError("unparseable parts file")


# ---------------------------------------------------------------------------
# Validation + repair. Every repair is logged; a part that cannot be
# repaired is dropped and logged. Nothing raises on bad part data.
# ---------------------------------------------------------------------------

def _is_num(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool) and math.isfinite(v)


def _vec3(v):
    if isinstance(v, (list, tuple)) and len(v) >= 3 and all(_is_num(x) for x in v[:3]):
        return [float(v[0]), float(v[1]), float(v[2])]
    return None


def _clamp(v, lo, hi):
    return max(lo, min(hi, v))


def validate_parts(data):
    """Returns (clean_data, expanded_parts, repairs, dropped_count,
    vstats).

    clean_data carries the world-level fields; expanded_parts is the
    flat, validated, repeat-expanded, deduped part list that gets
    inlined into the module (so walk/parts.js and this script agree
    mesh-for-mesh). vstats carries the degeneracy-gate counters:
    entries whose position or size was clamped, and exact duplicates
    removed by dedupe.
    """
    repairs = []
    dropped = 0
    clamped_parts = 0
    duplicates_removed = 0

    def rep(msg):
        repairs.append(msg)

    if not isinstance(data, dict):
        raise ValueError("parts file is not a JSON object")
    raw_parts = data.get("parts")
    if not isinstance(raw_parts, list):
        raise ValueError("parts file has no 'parts' array")

    ground_default = data.get("ground") if isinstance(data.get("ground"), str) and COLOR_RE.match(data["ground"]) else "#888888"

    expanded = []
    for idx, raw in enumerate(raw_parts):
        label = f"parts[{idx}]"
        if not isinstance(raw, dict):
            rep(f"{label}: not an object, dropped")
            dropped += 1
            continue
        shape = raw.get("s")
        if shape not in SHAPES:
            rep(f"{label}: unknown shape {shape!r}, dropped")
            dropped += 1
            continue
        p = _vec3(raw.get("p"))
        z = _vec3(raw.get("z"))
        if p is None or z is None:
            rep(f"{label} ({shape}): missing/invalid p or z, dropped")
            dropped += 1
            continue
        part = {"s": shape}
        clamped_here = False
        # position: clamp |p| <= 80
        cp = [_clamp(v, -POS_CLAMP, POS_CLAMP) for v in p]
        if cp != p:
            rep(f"{label} ({shape}): position {p} clamped to {cp}")
            clamped_here = True
        part["p"] = cp
        # size: clamp to [0.05, 60]
        cz = [_clamp(v, SIZE_MIN, SIZE_MAX) for v in z]
        if cz != z:
            rep(f"{label} ({shape}): size {z} clamped to {cz}")
            clamped_here = True
        part["z"] = cz
        if clamped_here:
            clamped_parts += 1
        # color
        c = raw.get("c")
        if not (isinstance(c, str) and COLOR_RE.match(c)):
            fallback = ground_default if shape == "gnd" else "#888888"
            rep(f"{label} ({shape}): bad/missing color {c!r} -> {fallback}")
            c = fallback
        part["c"] = c
        # emissive (optional)
        e = raw.get("e")
        if e is not None:
            if isinstance(e, str) and COLOR_RE.match(e):
                part["e"] = e
            else:
                rep(f"{label} ({shape}): bad emissive {e!r} removed")
        # rotations (degrees)
        for axis in ("ry", "rx", "rz"):
            v = raw.get(axis)
            if _is_num(v) and float(v) != 0.0:
                part[axis] = float(v)
            elif v is not None and not _is_num(v):
                rep(f"{label} ({shape}): bad {axis} {v!r} -> 0")
        # role
        if raw.get("role") == "wall":
            part["role"] = "wall"
        elif raw.get("role") not in (None, "prop"):
            rep(f"{label} ({shape}): unknown role {raw.get('role')!r} -> prop")
        # anim
        a = raw.get("a", "none")
        if a not in ANIMS:
            rep(f"{label} ({shape}): unknown anim {a!r} -> none")
            a = "none"
        if a == "pulse" and "e" not in part:
            rep(f"{label} ({shape}): pulse without emissive -> none")
            a = "none"
        if a != "none":
            part["a"] = a
            ap = raw.get("ap")
            apv = _vec3([ap[0], ap[1], 0]) if isinstance(ap, (list, tuple)) and len(ap) >= 2 and _is_num(ap[0]) and _is_num(ap[1]) else None
            if apv is not None:
                part["ap"] = [apv[0], apv[1]]
            elif raw.get("ap") is not None:
                rep(f"{label} ({shape}): bad ap {raw.get('ap')!r} removed (defaults apply)")
        # name (debug/gate aid only)
        if isinstance(raw.get("name"), str) and raw["name"]:
            part["name"] = raw["name"]
        # repeat expansion
        step = _vec3(raw.get("r")) if raw.get("r") is not None else [0.0, 0.0, 0.0]
        if raw.get("r") is not None and step is None:
            rep(f"{label} ({shape}): bad repeat step {raw.get('r')!r} -> single instance")
            step = [0.0, 0.0, 0.0]
        n = raw.get("n", 1)
        if not (_is_num(n) and int(n) >= 1):
            if raw.get("n") is not None:
                rep(f"{label} ({shape}): bad repeat count {n!r} -> 1")
            n = 1
        n = int(n)
        if n > MAX_REPEAT:
            rep(f"{label} ({shape}): repeat count {n} clamped to {MAX_REPEAT}")
            n = MAX_REPEAT
        for i in range(n):
            inst = dict(part)
            if i:
                inst["p"] = [part["p"][0] + step[0] * i,
                             part["p"][1] + step[1] * i,
                             part["p"][2] + step[2] * i]
            expanded.append(inst)

    # cap after expansion
    if len(expanded) > MAX_PARTS:
        rep(f"part count {len(expanded)} exceeds cap {MAX_PARTS}; truncated")
        dropped += len(expanded) - MAX_PARTS
        expanded = expanded[:MAX_PARTS]

    # dedupe exact-identical parts
    seen = set()
    deduped = []
    for part in expanded:
        key = json.dumps(part, sort_keys=True)
        if key in seen:
            continue
        seen.add(key)
        deduped.append(part)
    if len(deduped) != len(expanded):
        duplicates_removed = len(expanded) - len(deduped)
        rep(f"{duplicates_removed} exact-duplicate part(s) removed")
        expanded = deduped

    clean = {
        "id": data.get("id"),
        "title": data.get("title") if isinstance(data.get("title"), str) else "",
        "game": data.get("game") if isinstance(data.get("game"), str) else "",
        "sky": data.get("sky") if isinstance(data.get("sky"), str) and COLOR_RE.match(data["sky"]) else "#111111",
        "fog": data.get("fog") if isinstance(data.get("fog"), str) and COLOR_RE.match(data["fog"]) else None,
        "ground": ground_default,
    }
    if clean["fog"] is None:
        clean["fog"] = clean["sky"]
    vstats = {"clamped_parts": clamped_parts,
              "duplicates_removed": duplicates_removed}
    return clean, expanded, repairs, dropped, vstats


# ---------------------------------------------------------------------------
# Analytic bounds + normalization scale.
# ---------------------------------------------------------------------------

def _part_half_extents(part):
    """(hx, hy, hz) half extents before rotation, in part space."""
    sx, sy, sz = part["z"]
    if part["s"] == "tor":
        # z[0] = ring diameter, z[1] = tube radius (parts.js semantics).
        r_out = sx / 2.0 + sy
        return (r_out, r_out, sy)
    return (sx / 2.0, sy / 2.0, sz / 2.0)


def _part_center(part):
    p = part["p"]
    if part["s"] == "gnd":
        return (p[0], p[1] - part["z"][1] / 2.0, p[2])  # p[1] is the TOP
    return (p[0], p[1], p[2])


def analytic_aabb(parts):
    """Conservative AABB over the expanded parts. For a yaw that is not
    a multiple of 90 degrees the horizontal half extents become the
    horizontal diagonal radius (same conservatism for pitch/roll on
    their planes)."""
    if not parts:
        return None
    lo = [math.inf, math.inf, math.inf]
    hi = [-math.inf, -math.inf, -math.inf]
    for part in parts:
        hx, hy, hz = _part_half_extents(part)
        ry = part.get("ry", 0.0) % 360.0
        if ry % 90.0 == 0.0:
            if ry % 180.0 != 0.0:
                hx, hz = hz, hx
        else:
            hx = hz = math.hypot(2 * hx, 2 * hz) / 2.0
        rx = part.get("rx", 0.0) % 360.0
        if rx % 90.0 != 0.0:
            hy = hz = math.hypot(2 * hy, 2 * hz) / 2.0
        rz = part.get("rz", 0.0) % 360.0
        if rz % 90.0 != 0.0:
            hx = hy = math.hypot(2 * hx, 2 * hy) / 2.0
        cx, cy, cz = _part_center(part)
        for i, (c, h) in enumerate(((cx, hx), (cy, hy), (cz, hz))):
            lo[i] = min(lo[i], c - h)
            hi[i] = max(hi[i], c + h)
    return lo, hi


def normalization_scale(lo, hi):
    """s = min(30/w, 30/d, 13/h), clamped to <= 1.25, applied only when
    it differs from 1 by more than 0.02 (else exactly 1 — no-op worlds
    stay byte-stable)."""
    w = hi[0] - lo[0]
    d = hi[2] - lo[2]
    h = hi[1] - lo[1]
    ratios = []
    if w > 0:
        ratios.append(CAP_W / w)
    if d > 0:
        ratios.append(CAP_D / d)
    if h > 0:
        ratios.append(CAP_H / h)
    s = min(ratios) if ratios else 1.0
    s = min(s, SCALE_MAX)
    if abs(s - 1.0) <= 0.02:
        s = 1.0
    return s, (w, d, h)


# ---------------------------------------------------------------------------
# Anchors — mirror make_walker_module.py's conventions exactly.
# ---------------------------------------------------------------------------

def relic_anchor_candidates(scale):
    """The converter's formula point first — (tx-10, tz-/+12) with the
    parts coordinate contract's target tx=tz=0 — then its mirrored
    offsets, all scaled (anchors live in scaled/walker space)."""
    tx, tz = 0.0, 0.0
    fx, mx = tx - 10.0, tx + 10.0
    fz = tz - 12.0 if tz <= 0 else tz + 12.0
    mz = tz + 12.0 if tz <= 0 else tz - 12.0
    candidates = []
    for cand in [(fx, fz), (mx, fz), (fx, mz), (mx, mz)]:
        if cand not in candidates:
            candidates.append((cand[0] * scale, cand[1] * scale))
    return candidates


def _fmt(v):
    v = float(v)
    if v == 0:
        v = 0.0  # avoid "-0.0"
    return f"{v:.1f}"


def _hex_int(color):
    return int(color.lstrip("#"), 16)


# ---------------------------------------------------------------------------
# Module emission — the same return shape/order as module 001.js:
# { group, update, spawn, relic, env, doors }.
# ---------------------------------------------------------------------------

def emit_module(clean, parts, scale, dims, relic, spawn, doors, stats):
    fid = clean["formatted_id"]
    header_json = json.dumps({
        "id": fid,
        "title": clean["game"] or clean["title"],
        "sub": clean["title"],
        "system": "",
    })
    w, d, h = dims
    data_literal = json.dumps({
        "id": fid,
        "title": clean["title"],
        "game": clean["game"],
        "sky": clean["sky"],
        "fog": clean["fog"],
        "ground": clean["ground"],
        "parts": parts,
    }, indent=1, sort_keys=True)
    lines = [
        f"// @world {header_json}",
        f"// Built from {stats['source_name']} by make_parts_module.py"
        " (JSON parts pipeline — prompts/PARTS-PIPELINE.md).",
        f"// Parts: {stats['entries']} entries -> {len(parts)} kept,"
        f" {stats['dropped']} dropped, {stats['repairs']} repair(s) logged.",
        f"// Analytic bounds: {w:.2f} x {d:.2f} x {h:.2f} (w x d x h);"
        f" normalization scale applied: {scale:.4f}.",
    ]
    if stats.get("anchor_warning"):
        lines.append(f"// WARNING: {stats['anchor_warning']}")
    lines += [
        "",
        'import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";',
        'import { buildParts } from "../parts.js";',
        "",
        f"const PARTS_DATA = {data_literal};",
        "",
        "export function createWorld(THREE) {",
        "  const built = buildParts(THREE, PARTS_DATA);",
        "  const group = new THREE.Group();",
        f"  built.group.scale.setScalar({scale!r});",
        "  group.add(built.group);",
        "",
        "  function update(t, dt) {",
        "    built.tickers.forEach((f) => { try { f(t); } catch (e) {} });",
        "  }",
        "",
        "  return {",
        "    group,",
        "    update,",
        f"    spawn: {{ x: {_fmt(spawn[0])}, z: {_fmt(spawn[1])}, yaw: 0 }},",
        f"    relic: {{ id: {json.dumps(relic['id'])}, name: {json.dumps(relic['name'])},"
        f" x: {_fmt(relic['x'])}, z: {_fmt(relic['z'])} }},",
        f"    env:   {{ background: 0x{_hex_int(clean['sky']):06x},"
        f" fogColor: 0x{_hex_int(clean['fog']):06x}, fogDensity: {FOG_DENSITY} }},",
        "    doors: {",
        f"      next: {{ x: {_fmt(doors['next'][0])}, z: {_fmt(doors['next'][1])} }},",
        f"      prev: {{ x: {_fmt(doors['prev'][0])}, z: {_fmt(doors['prev'][1])} }}",
        "    }",
        "  };",
        "}",
        "",
    ]
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Headless gate — mirrors make_walker_module.py's §4 gate + R8 anchor
# clearance, run as a Node ESM driver against the vendored three build.
# ---------------------------------------------------------------------------

_DRIVER_JS = r"""
import * as THREE from "./three.module.min.js";
import { createWorld } from "./mod.js";
import fs from "node:fs";

const arg = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const result = { valid: false };
try {
  const world = createWorld(THREE);
  if (!world) throw new Error("createWorld returned nothing");
  if (!world.group) throw new Error("Missing world.group");
  if (typeof world.update !== "function") throw new Error("Missing world.update function");
  const fin = (v) => typeof v === "number" && Number.isFinite(v);
  if (!world.spawn || !fin(world.spawn.x) || !fin(world.spawn.z)) throw new Error("Invalid world.spawn");
  if (!world.relic || typeof world.relic.name !== "string" || !world.relic.name ||
      !fin(world.relic.x) || !fin(world.relic.z)) {
    throw new Error("Rule R8 failed: Missing or invalid world.relic { name, x, z }");
  }
  if (world.relic.id !== undefined && typeof world.relic.id !== "string") {
    throw new Error("Rule R8 failed: world.relic.id must be a string when present");
  }
  if (!world.doors || !world.doors.next || !world.doors.prev ||
      !fin(world.doors.next.x) || !fin(world.doors.next.z) ||
      !fin(world.doors.prev.x) || !fin(world.doors.prev.z)) throw new Error("Invalid world.doors");
  if (!world.env || !fin(world.env.background) || !fin(world.env.fogColor) ||
      !fin(world.env.fogDensity)) throw new Error("Missing/invalid world.env");

  let meshCount = 0;
  let nanValues = 0;
  world.group.traverse((o) => {
    if (o.isMesh) {
      meshCount++;
      const pos = o.geometry && o.geometry.getAttribute ? o.geometry.getAttribute("position") : null;
      if (pos) {
        const a = pos.array;
        for (let i = 0; i < a.length; i++) if (!Number.isFinite(a[i])) nanValues++;
      }
    }
  });
  if (meshCount === 0) throw new Error("Group contains 0 meshes");

  world.group.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(world.group);
  const size = box.getSize(new THREE.Vector3());

  // R8 anchor clearance — the same algorithm as
  // make_walker_module.check_relic_anchor_clear, per candidate.
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const topAt = (px, pz, fromY) => {
    ray.set(new THREE.Vector3(px, fromY, pz), down);
    const hits = ray.intersectObject(world.group, true);
    return hits.length ? hits[0].point.y : null;
  };
  const samples = [[0, 0],
    [1, 0], [-1, 0], [0, 1], [0, -1], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7],
    [1.8, 0], [-1.8, 0], [0, 1.8], [0, -1.8], [1.27, 1.27], [-1.27, 1.27], [1.27, -1.27], [-1.27, -1.27]];
  const clearance = arg.candidates.map(([ax, az]) => {
    const gTop = topAt(ax, az, 500);
    const groundY = gTop === null ? 0 : gTop;
    const tops = samples.map(([dx, dz]) => topAt(ax + dx, az + dz, groundY + 2.2));
    let blocked = null;
    for (let i = 0; i < samples.length; i++) {
      if (tops[i] !== null && Math.abs(tops[i] - groundY) > 0.6) {
        blocked = { at: [ax + samples[i][0], az + samples[i][1]], topY: tops[i] };
        break;
      }
    }
    if (!blocked) {
      const ring = [[4, 0], [-4, 0], [0, 4], [0, -4], [2.83, 2.83], [-2.83, 2.83], [2.83, -2.83], [-2.83, -2.83]];
      const ringTops = ring.map(([dx, dz]) => topAt(ax + dx, az + dz, groundY + 2.2))
        .filter((v) => v !== null).sort((a, b) => a - b);
      if (ringTops.length) {
        const areaGround = ringTops[Math.floor(ringTops.length / 2)];
        if (Math.abs(groundY - areaGround) > 0.6) {
          blocked = { at: [ax, az], topY: groundY, areaGround, reason: "anchor ground differs from surrounding ground" };
        }
      }
    }
    return { anchor: [ax, az], clear: !blocked, groundY, blocked };
  });

  world.update(0, 0.016);
  world.update(1, 0.016);
  world.update(1.7, 0.016);

  result.valid = true;
  result.meshCount = meshCount;
  result.nanValues = nanValues;
  result.bbox = {
    min: [box.min.x, box.min.y, box.min.z],
    max: [box.max.x, box.max.y, box.max.z],
    size: [size.x, size.y, size.z],
  };
  result.clearance = clearance;
} catch (err) {
  result.error = err.message;
}
console.log(JSON.stringify(result));
"""


def _find_three_js():
    """Locate a three module build for the headless gate, mirroring the
    JS converter's expectations (repo-vendored first, then the worlds
    checkout's node_modules)."""
    candidates = [
        os.environ.get("PARTS_THREE_JS"),
        os.path.join(SCRIPT_DIR, "walk", "three.module.min.js"),
        os.path.join(SCRIPT_DIR, "vendor", "three.module.min.js"),
        os.path.join(SCRIPT_DIR, "..", "vendor", "three.module.min.js"),
        os.path.join(WORLDS_DIR, "node_modules", "three", "build", "three.module.js"),
        os.path.join(WORLDS_DIR, "node_modules", "three", "build", "three.module.min.js"),
    ]
    for path in candidates:
        if path and os.path.exists(path):
            return os.path.abspath(path)
    return None


def run_gate(module_js, candidates, expected_meshes):
    """Stage the module + walk/parts.js + three in a temp tree, parse-
    check it, and run the headless driver. Returns (gate_dict, errors)."""
    errors = []
    three_src = _find_three_js()
    if not three_src:
        return None, ["no three.module build found for the headless gate "
                      "(set PARTS_THREE_JS or vendor one at walk/three.module.min.js)"]
    parts_js = os.path.join(SCRIPT_DIR, "walk", "parts.js")
    if not os.path.exists(parts_js):
        return None, [f"walk/parts.js missing beside this script ({parts_js})"]

    tmp = tempfile.mkdtemp(prefix="parts-gate-")
    try:
        walk_dir = os.path.join(tmp, "walk")
        parts_dir = os.path.join(walk_dir, "parts")
        os.makedirs(parts_dir)
        shutil.copy(parts_js, os.path.join(walk_dir, "parts.js"))
        shutil.copy(three_src, os.path.join(parts_dir, "three.module.min.js"))
        # Newer three builds split into module + core; stage the siblings too.
        for sibling in ("three.core.js", "three.core.min.js"):
            sib = os.path.join(os.path.dirname(three_src), sibling)
            if os.path.exists(sib):
                shutil.copy(sib, os.path.join(parts_dir, sibling))
        module_stage = os.path.join(parts_dir, "mod.js")
        # Stage-only rewrite (same trick as the R9 thumbnail bake): the
        # real module keeps the R1 CDN import; the headless gate imports
        # the vendored build instead so it runs offline.
        staged_js = re.sub(
            r'import\s+\*\s+as\s+THREE\s+from\s+"https://cdnjs[^"]+";',
            'import * as THREE from "./three.module.min.js";',
            module_js,
            count=1,
        )
        with open(module_stage, "w", encoding="utf-8") as f:
            f.write(staged_js)

        # Parse check as an ES module.
        check_path = os.path.join(tmp, "check.mjs")
        shutil.copy(module_stage, check_path)
        proc = subprocess.run(["node", "--check", check_path],
                              capture_output=True, text=True, timeout=30)
        if proc.returncode != 0:
            return None, [f"node --check failed: {proc.stderr.strip()[:400]}"]

        arg_path = os.path.join(tmp, "arg.json")
        with open(arg_path, "w", encoding="utf-8") as f:
            json.dump({"candidates": [list(c) for c in candidates]}, f)
        driver_path = os.path.join(parts_dir, "driver.mjs")
        with open(driver_path, "w", encoding="utf-8") as f:
            f.write(_DRIVER_JS)
        proc = subprocess.run(["node", driver_path, arg_path],
                              capture_output=True, text=True, timeout=30)
        out = proc.stdout.strip()
        gate = None
        for line in out.splitlines():
            if line.startswith("{") and line.endswith("}"):
                gate = json.loads(line)
        if gate is None:
            return None, [f"headless gate produced no result: {(proc.stderr or out).strip()[:400]}"]
        if not gate.get("valid"):
            return gate, [f"headless gate: {gate.get('error')}"]
        if gate["meshCount"] != expected_meshes:
            errors.append(f"mesh count {gate['meshCount']} != expanded kept parts {expected_meshes}")
        if gate.get("nanValues"):
            errors.append(f"{gate['nanValues']} non-finite vertex value(s) in built geometry")
        bw, bh, bd = gate["bbox"]["size"]
        if bw > CAP_W + 0.01 or bd > CAP_D + 0.01:
            errors.append(f"post-scale footprint {bw:.2f} x {bd:.2f} exceeds {CAP_W:.0f} x {CAP_D:.0f}")
        if bh > CAP_H + 0.01:
            errors.append(f"post-scale height {bh:.2f} exceeds cap {CAP_H:.0f}")
        return gate, errors
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


# ---------------------------------------------------------------------------
# Conversion driver.
# ---------------------------------------------------------------------------

def convert(parts_path, out_path=None):
    data, input_repairs = load_parts_data(parts_path)

    raw_id = data.get("id")
    if isinstance(raw_id, (int, float)) and not isinstance(raw_id, bool):
        fid = f"{int(raw_id):03d}"
    elif isinstance(raw_id, str) and raw_id.strip():
        fid = raw_id.strip().zfill(3) if raw_id.strip().isdigit() else raw_id.strip()
    else:
        raise ValueError("parts file has no usable 'id'")

    clean, parts, repairs, dropped, vstats = validate_parts(data)
    clean["formatted_id"] = fid
    entries = len(data.get("parts") or [])
    repairs = input_repairs + repairs
    for msg in repairs:
        print(f"[Parts] repair: {msg}")
    print(f"[Parts] world {fid} \"{clean['title'] or clean['game']}\": "
          f"{entries} entries -> {len(parts)} parts kept, {dropped} dropped, "
          f"{len(repairs)} repair(s)")

    bounds = analytic_aabb(parts)
    if bounds is None:
        raise ValueError("no valid parts survived validation")
    lo, hi = bounds
    scale, dims = normalization_scale(lo, hi)
    w, d, h = dims
    print(f"[Parts] analytic bounds {w:.2f} x {d:.2f} x {h:.2f} (w x d x h) "
          f"-> scale {scale:.4f} (post {w * scale:.2f} x {d * scale:.2f} x {h * scale:.2f})")

    # Degeneracy gates — hard fails. A list the validator had to
    # rescue wholesale (duplicates, clamps) or that normalizes to a
    # spike is not a world; nothing is emitted or written.
    repaired = vstats["duplicates_removed"] + vstats["clamped_parts"]
    ratio = repaired / entries if entries else 0.0
    if ratio > 0.35:
        msg = (f"degenerate parts list: repair ratio {ratio:.2f} "
               f"({vstats['duplicates_removed']} exact duplicates removed + "
               f"{vstats['clamped_parts']} parts clamped, of {entries} raw "
               f"entries) exceeds 0.35")
        print(f"[Parts Gate] FAIL: {msg}")
        return {"status": "degenerate", "id": fid, "errors": [msg]}
    pw, pd = w * scale, d * scale
    if min(pw, pd) < 8 and max(pw, pd) > 20:
        msg = (f"sliver world: post-scale footprint {pw:.2f} x {pd:.2f} "
               f"(min {min(pw, pd):.2f} < 8 while max {max(pw, pd):.2f} > 20)")
        print(f"[Parts Gate] FAIL: {msg}")
        return {"status": "degenerate", "id": fid, "errors": [msg]}

    # Shape dominance — a warning only, printed on the gate line.
    dominance_note = ""
    if len(parts) > 40:
        shape_counts = {}
        for p in parts:
            shape_counts[p["s"]] = shape_counts.get(p["s"], 0) + 1
        top_shape, top_count = max(shape_counts.items(), key=lambda kv: kv[1])
        if top_count / len(parts) > 0.85:
            dominance_note = (f" | WARNING: shape '{top_shape}' dominates "
                              f"({top_count}/{len(parts)} = "
                              f"{top_count / len(parts):.0%} of kept parts)")

    # Anchors (scaled space). Spawn mirrors module 001 exactly: south
    # edge, inset 2.5 from the rim, field name `yaw`, facing the centre.
    spawn = (0.0, max(0.0, d / 2.0 - 2.5) * scale)
    half_d = d * scale / 2.0
    doors = {
        "next": (0.0, -(half_d - 0.2) if half_d > 0.2 else 0.0),
        "prev": (0.0, (half_d - 0.2) if half_d > 0.2 else 0.0),
    }

    assignment = RELIC_ASSIGNMENTS.get(fid) or {}
    relic_id = assignment.get("id", "generic")
    relic_name = assignment.get("name") or (
        f"{clean['game'] or clean['title']} Relic" if (clean["game"] or clean["title"]) else "Ancient Relic")
    candidates = relic_anchor_candidates(scale)

    stats = {
        "source_name": os.path.basename(parts_path),
        "entries": entries,
        "dropped": dropped,
        "repairs": len(repairs),
        "anchor_warning": None,
    }
    relic = {"id": relic_id, "name": relic_name, "x": candidates[0][0], "z": candidates[0][1]}
    module_js = emit_module(clean, parts, scale, dims, relic, spawn, doors, stats)

    gate, errors = run_gate(module_js, candidates, len(parts))
    if gate is None:
        for e in errors:
            print(f"[Parts Gate] FAIL: {e}")
        return {"status": "gate_failed", "id": fid, "errors": errors}

    # Anchor choice: first clear candidate wins (formula first). The
    # module is re-emitted if the winner is not the formula point —
    # anchors do not affect geometry, so the gate result stands.
    chosen = None
    for cand, res in zip(candidates, gate.get("clearance", [])):
        if res.get("clear"):
            chosen = cand
            break
    if chosen is None:
        stats["anchor_warning"] = (
            f"relic anchor blocked at all {len(candidates)} candidates; "
            "formula anchor kept — set a clear anchor by hand")
        print(f"[Parts] WARNING: {stats['anchor_warning']}")
        chosen = candidates[0]
    elif chosen != candidates[0]:
        print(f"[Parts] formula relic anchor blocked; mirrored anchor "
              f"({chosen[0]:.1f}, {chosen[1]:.1f}) is clear")
    if chosen != (relic["x"], relic["z"]) or stats["anchor_warning"]:
        relic = {"id": relic_id, "name": relic_name, "x": chosen[0], "z": chosen[1]}
        module_js = emit_module(clean, parts, scale, dims, relic, spawn, doors, stats)

    bw, bh, bd = gate["bbox"]["size"]
    print(f"[Parts Gate] parse OK | meshes {gate['meshCount']}/{len(parts)} | "
          f"bbox {bw:.2f} x {bd:.2f} x {bh:.2f} | NaN values {gate.get('nanValues', 0)} | "
          f"relic '{relic_name}' ({relic_id}) @ ({chosen[0]:.1f}, {chosen[1]:.1f})"
          f"{' clear' if not stats['anchor_warning'] else ' WARNING'}"
          f"{dominance_note}")

    if errors:
        for e in errors:
            print(f"[Parts Gate] FAIL: {e}")
        return {"status": "gate_failed", "id": fid, "errors": errors,
                "gate": gate, "scale": scale}

    if out_path is None:
        out_path = os.path.join(os.path.dirname(os.path.abspath(parts_path)),
                                f"{fid}.module.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(module_js)
    print(f"[Parts] OK wrote {out_path}")
    return {"status": "ok", "id": fid, "out": out_path, "gate": gate,
            "scale": scale, "repairs": repairs, "parts": len(parts),
            "anchor_warning": stats["anchor_warning"]}


def selftest():
    example = os.path.join(SCRIPT_DIR, "walk", "parts", "example.json")
    if not os.path.exists(example):
        print(f"[Parts Selftest] FAIL: example missing at {example}")
        return 1
    tmp = tempfile.mkdtemp(prefix="parts-selftest-")
    try:
        out = os.path.join(tmp, "example.module.js")
        result = convert(example, out_path=out)
        if result.get("status") == "ok" and os.path.exists(out):
            gate = result["gate"]
            bw, bh, bd = gate["bbox"]["size"]
            print(f"[Parts Selftest] PASS — meshes {gate['meshCount']}, "
                  f"bbox {bw:.2f} x {bd:.2f} x {bh:.2f}, scale {result['scale']:.4f}, "
                  f"parts {result['parts']}, module {os.path.getsize(out)} bytes")
            return 0
        print(f"[Parts Selftest] FAIL — {result}")
        return 1
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Build a Walker module from a Qwen JSON parts list.")
    parser.add_argument("parts_json", nargs="?", help="Path to the parts JSON file.")
    parser.add_argument("--out", default=None, help="Module output path "
                        "(default: <id>.module.js beside the parts file).")
    parser.add_argument("--selftest", action="store_true",
                        help="Build walk/parts/example.json end-to-end and run the gate.")
    args = parser.parse_args()

    if args.selftest:
        sys.exit(selftest())
    if not args.parts_json:
        parser.error("a parts JSON path is required (or use --selftest)")
    try:
        result = convert(args.parts_json, out_path=args.out)
    except Exception as e:
        print(f"[Parts] ERROR: {e}")
        sys.exit(1)
    sys.exit(0 if result.get("status") == "ok" else 1)
