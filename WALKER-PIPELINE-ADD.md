# Walker-Ready: what to add to the worlds pipeline

**One new step in the generation pipeline, after `scene_healer` and
`scene_linter` accept a scene:**

```
extract → generate → heal → lint → [ NEW: make_walker_module ] → registry + manifest
```

It converts each finished diorama scene into a **Back Roms module** and
registers it in `walk/worlds.json`. From then on the world is walkable and
portal-connected in Back Roms (bparlette.github.io/worlds/walk/walker.html)
with zero further hand work.

Is it generic? **Yes, with one honest caveat.** The transformation is
mechanical for any scene that follows the generator's own template (build
into a `world` group, animate inside one loop). The script performs the
mechanical ~90 % (rules R1–R3, R6). The remaining ~10 % — choosing spawn and
door positions (R4–R5) and scenes whose animation is structured unusually —
must never be guessed silently: the script emits the module with those
fields flagged plus a line in the conversion report, and the world stays
out of the manifest until the values are set. §5 removes even that residue.

---

## 1. The module contract (exact)

Output file: `walk/modules/<id>.js` (e.g. `walk/modules/042.js`)

```js
import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();
  // … ALL of the scene's build code, adding everything to `group` …
  function update(t, dt) {
    // … ALL of the scene's per-frame animation expressions …
  }
  return {
    group,
    update,
    spawn: { x: 0, z: 14, yaw: 0 },              // walkable start, faces the hero view
    env:   { background: 0x17120d, fogColor: 0x17120d, fogDensity: 0.025 },
    doors: { next: { x: 0, z: -14.8 },          // north wall passage
             prev: { x: 0, z: 14.8 },           // south wall passage
             east: { x: 14.8, z: 0 },           // east wall passage (routes/grid)
             west: { x: -14.8, z: 0 } },        // west wall passage (routes/grid)
    relic: { name: "Enchanted Chalice", x: 20, z: -43 }  // hidden, off the beeline (R8)
  };
}
```

## 2. Conversion rules (checkable)

- **R1 — One import.** The cdnjs three 0.160.0 module line above is the only
  external reference. No other assets, no fetches.
- **R2 — One group.** Every mesh, light and effect goes into the single
  returned `group`. Nothing touches a global scene. The module contains
  **no** renderer, camera, HUD/DOM, orbit controls, or
  `requestAnimationFrame` — Back Roms owns all of that.
- **R3 — Animation lives in `update(t, dt)`.** Move the scene's per-frame
  expressions there verbatim (they read the same closure variables the
  build created). `update` must not reference the old clock/renderer, and
  must be safe to simply stop calling — unloading = Back Roms disposes
  the group.
- **R4 — Spawn.** A point on walkable ground, not inside geometry, `yaw`
  facing the world's hero view (what the diorama's default camera framed).
- **R5 — Doors = the four walls themselves (Cherie, 2026-11-01, as
  amended same day: the ENTIRE wall is the passage, not a doorway in
  it).** The world's boundary is four walls (N/E/S/W, themed as the
  scene requires), and each wall is a full-length passage to the
  neighboring world on that side: the Walker triggers travel when the
  player crosses the wall plane at ANY point along its span, and draws
  the warp dressing across the whole wall. `doors` supplies four
  anchor points (wall midpoints, just inside the boundary) that name
  the directions — `next` = north wall, `prev` = south wall (the ring's
  two active passages), `east`/`west` = the side walls, always present
  in the data and activated when a favorites route or a grid layout
  assigns those neighbors — plus the world's bounds, from which the
  host derives each wall segment (corner to corner). There is no
  freestanding rift or portal object in the middle of the room, and no
  door-sized hole in a solid wall. **The membranes are host-layered**
  (Cherie, 2026-11-01): exactly like the relic prop and the original
  rift, the Walker builds the full-wall warp membrane itself from the
  module's bounds + door anchors, inset a hair inside the wall plane —
  Qwen does NOT build membrane walls, and scene walls stay plain and
  solid. Host layering is the primary mechanism (uniform and guaranteed
  in every world, including already-generated ones); the generator's
  four-walls rule only keeps the boundary compact and readable so the
  overlay sits cleanly.
- **R6 — Env.** `background`, `fogColor`, `fogDensity` copied from the
  scene's own values, so walking in feels like the diorama looked.
- **R7 — Real ground.** Terrain must be actual meshes inside the group —
  Back Roms floors the player by raycasting down. No invisible or
  merged-away ground planes.
- **R8 — Relic.** Every world hides exactly one relic: `createWorld` also
  returns `relic: { name, x, z }` — the world's one iconic object (the
  chalice, the idol, the urn…). The point must be walkable ground (R7
  applies) and clear of the spawn→door beeline — a detour, not a toll
  booth: somewhere a walker only finds by exploring (behind the castle,
  across the river, at the far end of the field). Back Roms renders the
  relic itself — a golden core-and-rings prop, walker-owned — so the
  module supplies only the name and the coordinates.
- **R9 — Top-down thumbnail.** After a module passes the §4 gate and is
  registered, the converter bakes a map thumbnail for the Back Roms map
  overview: `walk/thumbs/<id>.png` (e.g. `walk/thumbs/042.png`), one per
  manifest world, 512×512 PNG. The bake loads the finished module in
  headless Chrome, puts its `group` in a bare scene (the module holds no
  HUD/DOM per R2, and the Walker draws rift/relic props itself, so the
  frame is pure world — nothing to hide), settles it with one
  `update(0, 0.016)` call, and renders a single frame from an
  **orthographic camera directly overhead**: positioned above the centre
  of the group's bounding box (`THREE.Box3.setFromObject`), `up = -Z`
  (the world's north edge at the top of the tile), frustum half-extent =
  `max(bounds X span, Z span) / 2 × 1.08`. Framing is derived from the
  bounds alone — deterministic, no per-world hand-tuning. **Height cut
  (Cherie, 2026-11-01):** the survey clips at **80% of the world's
  height** (`min.y + 0.8 × height`, applied as the ortho camera's near
  plane), so enclosed worlds — caves, roofed interiors — render their
  interior layout instead of their roof shell; the camera effectively
  sits inside the roof. Worlds with negligible height skip the cut.
  Bounds are
  computed defensively: if any object in the group has NaN vertices or
  transforms (which poisons a whole-group `Box3`), the bake falls back
  to a per-object union that skips the non-finite boxes, and a frame
  that comes out a single flat color is rejected as a failed bake. The world's own
  `env.background` is the tile background; fog is left off for the survey
  view. **A thumbnail is decorative, never a gate:** any bake failure
  (no Chrome binary, WebGL unavailable, empty bounds, bad render) logs a
  warning and the conversion still succeeds — the world enters the
  manifest with or without a tile, and the map falls back to its
  reference image / text for that square. `--no-thumbs` skips the bake;
  `--bake-thumbs [--ids 001 007 …]` (re)bakes tiles for modules already
  in `walk/worlds.json` without reconverting — that is also how the
  handcrafted modules (001–005) get theirs, since conversion skips them.

## 3. Manifest step (same script)

After conversion, upsert the world's line in `walk/worlds.json` and keep it
sorted by numeric id:

```json
{"id":"042","module":"modules/042.js","title":"…","sub":"…","system":"…"}
```

`title` / `sub` / `system` come from `game_worlds_extracted.json`. The
Walker reads this file at load and derives ring order, neighbors and the
"World #042 / N" counter from it — new worlds join the walk by appearing
here, never by editing Walker code.

## 4. Validation gate (a world enters the manifest only if ALL pass)

1. The module parses and imports cleanly.
2. `createWorld(THREE)` runs headlessly and returns every required key,
   with finite numbers in `spawn`, `env`, `doors`, and a `relic` whose
   `name` is a non-empty string and whose `x`/`z` are finite.
3. `group` contains at least one mesh.
4. `update(0, 0.016)` and `update(1, 0.016)` run without throwing.

Failures go to a **conversion report** (world id + which rule failed),
never into `worlds.json`. A world that isn't in the manifest simply isn't
in the walk yet — the walk itself never breaks. The R9 thumbnail bake is
deliberately **not** part of this gate — it runs after registration and
can only warn, never block.

## 5. The endgame (retire the converter)

Teach `generate_worlds.py` to emit this shape natively: one build function,
two wrappers — the diorama page and Back Roms module. At that point
conversion is free, spawn/doors come from the generator's own scene
knowledge, and this document becomes a historical footnote. Until then,
the converter above is the bridge — and every converted world is also a
perfect training example of the target format.
