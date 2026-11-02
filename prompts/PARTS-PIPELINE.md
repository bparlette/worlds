# PARTS PIPELINE — Qwen emits JSON, a script builds the world

**Status:** built Nov 1, 2026. Pieces: `walk/parts.js` (builder),
`make_parts_module.py` (converter + gate), `walk/parts/example.json`
(self-test fixture). Test protocol below runs world #001 ONLY.

---

## 1. Why: the error model

The old pipeline has Qwen write a whole Three.js scene as JavaScript —
typically ~22k characters per world. Every failure we actually measured
at the Gate 1 gate was a JavaScript failure class:

- **Undeclared variables** — the scene references `canvas` the template
  never declared; the sanitizer now injects a declaration to save it.
- **Invented APIs** — `defaultCamera.distance()` and friends: plausible-
  sounding calls to functions that do not exist.
- **Temporal-dead-zone references** — a build block reads a `const`
  declared further down; the module dies silently, no canvas at all.
- **Truncation** — the output hits the token cap mid-function and the
  file is syntactically incomplete.

These are not carelessness; they are what a language model writing
22,000 characters of code does at some rate, and the rate scales with
the amount of novel code. Prompt rules do not bind code. What binds it
is shrinking what Qwen's output is responsible for:

**Qwen now outputs only a JSON parts list. A deterministic builder
script — `walk/parts.js`, driven by `make_parts_module.py`, no AI
involved — turns the list into the walker module.**

JSON cannot have an undeclared variable, a TDZ failure, an invented
API, or an unbalanced brace. A malformed part is caught by schema
validation and dropped or clamped — per part, never per world. The
builder is written once, tested once, and produces the identical world
from the identical list every time, for all 1,100 worlds, at zero
token cost. A parts list is also roughly a quarter the characters of
the equivalent JS scene, which retires the truncation risk at the
token cap instead of managing it.

What remains Qwen's job is the thing it is good at: looking at a
picture of a place and listing the shapes that make it up.

---

## 2. The exact Qwen prompt

Nothing else is added. No relic text (relics are host-side, §5), no
size rules beyond the coordinate contract (normalization is
mechanical, §5), no wall instructions beyond the `role` tag.

```
You are given one screenshot of a video game place. Describe ONLY the place as a JSON parts list. Output ONLY the JSON object — no prose, no code, no markdown fences.
Coordinates: origin at the centre of the place, ground level y=0, +y up, +x right, +z toward the viewer. Each part's "p" is its CENTRE [x,y,z]; each part's "z" is its FULL size [sx,sy,sz]. Units are world units: make the place about 30 units wide and at most 13 high.
Each part: {"s":shape,"p":[x,y,z],"z":[sx,sy,sz],"c":"#rrggbb"} — use flat colours sampled from the screenshot.
Shapes: "box" block; "cyl" cylinder (z[0]=diameter, z[1]=height); "sph" ball (stretched by z); "cone" (z[0]=base diameter, z[1]=height); "tor" ring standing upright (z[0]=ring diameter, z[1]=tube radius); "wed" ramp, low edge toward +z, high edge toward -z; "gnd" ground slab (p[1] is its TOP height).
Optional per part: "ry" rotation in degrees; "e":"#rrggbb" glow colour; "a":"bob"|"spin"|"sway"|"pulse" for simple motion (pulse needs "e"); "r":[dx,dy,dz] and "n":count repeat a part in a row (fences, posts, trees); "role":"wall" ONLY on the outer boundary walls.
Build only the background world: the terrain, buildings, platforms and fixed props that would remain if every character vanished. No characters, no enemies, no HUD, no text or lettering as shapes. Characters set the scale and nothing else.
Order: biggest shapes first (ground, walls, buildings), then props. Use as many parts as the place needs.
{"id":"<world id>","title":"<place name>","game":"<game>","sky":"#rrggbb","fog":"#rrggbb","ground":"#rrggbb","parts":[ ... ]}
```

---

## 3. Schema reference

World object:

| field | meaning | rule |
|---|---|---|
| `id` | world id (`"001"`) | required; numbers are zero-padded to 3 |
| `title` | the pictured place | string, may be empty |
| `game` | the game | string, may be empty |
| `sky` | background colour | `#rrggbb`; invalid → `#111111` |
| `fog` | fog colour | `#rrggbb`; invalid/missing → sky |
| `ground` | ground colour | used as the fallback colour for `gnd` parts |
| `parts` | the part list | required array |

Part object (converter validation; every violation is logged, the part
is repaired or dropped — the build never fails on a bad part):

| field | meaning | default / clamp |
|---|---|---|
| `s` | shape: `box` `cyl` `sph` `cone` `tor` `wed` `gnd` | unknown → part dropped |
| `p` | centre `[x,y,z]` (for `gnd`: centre x/z, **top** y) | required; each axis clamped to ±80; non-numeric → dropped |
| `z` | full extents `[sx,sy,sz]` (for `tor`: `[ring diameter, tube radius, —]`) | required; each clamped to [0.05, 60]; non-numeric → dropped |
| `c` | colour `#rrggbb` | invalid/missing → `#888888` (`gnd` → world `ground`) |
| `ry` `rx` `rz` | rotation, degrees | default 0; non-numeric → 0 |
| `e` | emissive (glow) colour `#rrggbb` | none; invalid → removed |
| `role` | `"prop"` or `"wall"` | `"wall"` ⇒ the part's material renders BackSide (inside-only wall); unknown → `prop` |
| `a` | anim tag: `none` `bob` `spin` `sway` `pulse` | unknown → `none`; `pulse` without `e` → `none` |
| `ap` | anim params `[amp, speed]` | builder defaults: bob [.3, 1.5], spin speed .8, sway [.08, 1.2], pulse speed 2.0 |
| `r` + `n` | repeat step `[dx,dy,dz]` × count | `n` clamped to 500; expanded before all later steps |
| `name` | debug label (mesh name) | optional, cosmetic |

Pipeline-wide clamps: at most **800 parts** after repeat expansion
(excess truncated + logged); exact-duplicate parts are deduped.

Anim semantics (executed by builder tickers, one per instance):
`bob` — y = base + sin(t·speed)·amp; `spin` — rotation.y advances
t·speed; `sway` — rotation.z = base + sin(t·speed)·amp; `pulse` —
emissiveIntensity oscillates 0.4…1.0 (requires `e`).

Shapes (builder geometry): `box`/`gnd` — BoxGeometry (for `gnd` the
builder shifts the centre so p[1] is the top surface); `cyl` —
CylinderGeometry(z[0]/2, z[0]/2, z[1], 20), elliptical if z[2]≠z[0];
`sph` — unit sphere scaled by z (non-uniform ok); `cone` —
ConeGeometry(z[0]/2, z[1], 20); `tor` — TorusGeometry(z[0]/2, z[1],
10, 24) in the XY plane (standing); `wed` — BufferGeometry prism from
z: footprint z[0]×z[2], height z[1], low edge at +z, high edge at −z,
computed normals. Materials: MeshStandardMaterial, roughness .85,
metalness 0; emissive + emissiveIntensity 1 when `e` is present.

---

## 4. Builder contract

**`walk/parts.js` — `buildParts(THREE, data)` → `{ group, tickers, warnings }`.**
One mesh per part instance, in the data's own coordinates; `tickers`
are the per-instance animation functions the module's `update(t)`
calls (each is exception-proof); `warnings` collects every skipped
part. `buildParts` never throws on bad part data. It does NOT scale,
place anchors, or stamp relics — that is the converter's job.

**`make_parts_module.py <parts.json> [--out <path>] [--selftest]`:**

1. **Validate + repair** per §3; log every repair; drop unrepairable
   parts. Repeat expansion, the 800 cap and dedupe happen here, so the
   part list inlined into the module is exactly the built list.
2. **Bounds + normalization (mechanical size).** Analytic AABB over the
   expanded parts (for yaw/pitch/roll that are not multiples of 90°,
   the conservative diagonal radius). Scale
   `s = min(30/w, 30/d, 13/h)`, clamped to ≤ 1.25, applied only when
   |s−1| > 0.02. The module wraps the built group in the scale; all
   anchors are emitted in scaled space. Proportions are never touched
   — one uniform factor.
3. **Walls (mechanical).** No prompt rule and no geometry guessing:
   parts Qwen tagged `role:"wall"` are built with BackSide materials
   by `parts.js`. Solid from inside, not drawn from outside.
4. **Anchors** (same conventions as the JS converter's modules):
   `spawn { x: 0, z: (d/2 − 2.5)·s, yaw: 0 }` — south edge facing the
   centre, the shape module 001 declares. Doors: `next` at the north
   wall midpoint, `prev` at the south, inset 0.2 inside the boundary.
   (`yaw` is the contract's field name — module 001 and walker.html
   both use it.)
5. **Relic (host-side, unchanged).** Identity from `walk/relics.json`
   (unassigned → `id: "generic"` + legacy derived name). The anchor is
   chosen with the JS converter's exact clearance algorithm — formula
   point (−10, −12), then mirrored offsets, scaled by s; the 2-unit
   ground column is raycast against the built group headlessly;
   overhangs that merely cross above the column do not block; a
   perched anchor (ground differing from the surrounding ring median)
   does block. Scene meshes are never deleted. If no candidate is
   clear, the formula anchor is kept and the module header + report
   carry `anchor_warning`.
6. **Emission.** The module matches the R1–R8 contract exactly:
   `// @world` header (plus parts kept/dropped, analytic bounds, scale,
   warnings), the one cdnjs three 0.160.0 import (R1), `buildParts`
   imported from `../parts.js`, the validated parts inlined as
   `PARTS_DATA`, and `createWorld(THREE)` returning
   `{ group, update, spawn, relic, env, doors }` in module 001's field
   order. `env` comes from the list's `sky`/`fog` (fogDensity 0.02).
   Default output: `walk/parts/<id>.module.js` beside the source list.
7. **Gate before write.** The module is only written if the §5 gate
   passes; a hard failure writes nothing and exits non-zero.

The converter does **not** register parts modules in
`walk/worlds.json`, does not bake thumbnails, and does not touch
`walk/modules/` — promotion is a separate, deliberate step.

---

## 5. Gates (measured, not asserted)

`node --check` on the emitted module, then a headless Node run against
the vendored three 0.160.0 build (the staged copy's CDN import is
rewritten to the local build, the same trick as the R9 bake):

1. Module parses as an ES module.
2. `createWorld(THREE)` returns every required key with finite
   numbers; `relic.name` non-empty, `relic.id` a string (the §4 gate
   of WALKER-PIPELINE-ADD.md, same checks).
3. Built mesh count **equals** the expanded kept-part count — a silent
   builder skip fails here, loudly.
4. Measured post-scale bounds (real `THREE.Box3`): footprint ≤ 30×30,
   height ≤ 13.01; zero non-finite vertex values anywhere.
5. `update(0)`, `update(1)`, `update(1.7)` run without throwing.
6. Relic anchor clearance, per §4.5 — pass, or `anchor_warning`
   recorded (a warning, not a failure, exactly as in the JS pipeline).

The converter prints the numbers for every run: entries → kept /
dropped / repairs, analytic bounds, scale, gate mesh count, measured
bbox, relic anchor and its clearance.

---

## 6. Test protocol — world #001 ONLY

Run these in order. Stop after #001 and report; do not proceed to any
other world, do not register anything, do not overwrite anything.

1. **Self-test.** `python3 make_parts_module.py --selftest`
   Builds `walk/parts/example.json` (a hand-authored room exercising
   every shape, walls with a door gap, repeat, all four anim tags)
   through the whole flow in a temp dir. Expect: `PASS` with 18 meshes,
   bbox 30.00 × 30.00 × 6.00, scale 1.0000.
2. **Qwen pass.** Run Qwen with the §2 prompt, verbatim, on the SAME
   source image previously used for `scenes/001` (Adventure — Castles
   & Mazes). Save its raw output, unedited, to `walk/parts/001.json`.
3. **Convert.** `python3 make_parts_module.py walk/parts/001.json`
   → `walk/parts/001.module.js`. **Do NOT overwrite
   `walk/modules/001.js`. Do NOT register in the walker manifest.**
4. **Report:** parts kept/dropped and every repair line; analytic
   bounds + scale applied; gate results with the measured bbox and
   mesh count; the relic line (expect `chalice` / "Enchanted Chalice"
   from walk/relics.json, with its anchor and clearance result); and a
   rendered screenshot of the built world next to the reference image.

---

## 7. Non-goals

- No changes to `walker.html`, `walk/relics.js`, `walk/relics.json`,
  or the JS-scene converter (`make_walker_module.py`). The JS pipeline
  is untouched and remains the production path for the 1,000-world
  catalog until this one proves itself on #001.
- No manifest registration, no thumbnails, no gallery changes.
- Qwen is never told about relics (R8 stands); there is no relic field
  in the parts schema and none may be added to the prompt.
