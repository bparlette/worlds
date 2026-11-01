# Walker-Ready: what to add to the worlds pipeline

**One new step in the generation pipeline, after `scene_healer` and
`scene_linter` accept a scene:**

```
extract → generate → heal → lint → [ NEW: make_walker_module ] → registry + manifest
```

It converts each finished diorama scene into a **World Walker module** and
registers it in `walk/worlds.json`. From then on the world is walkable and
portal-connected in the Walker (bparlette.github.io/worlds/walk/walker.html)
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
    doors: { next: { x: 13.1, z: -20.7 },        // exit landmark
             prev: { x: -17,  z: -17.2 } }       // secondary landmark
  };
}
```

## 2. Conversion rules (checkable)

- **R1 — One import.** The cdnjs three 0.160.0 module line above is the only
  external reference. No other assets, no fetches.
- **R2 — One group.** Every mesh, light and effect goes into the single
  returned `group`. Nothing touches a global scene. The module contains
  **no** renderer, camera, HUD/DOM, orbit controls, or
  `requestAnimationFrame` — the Walker owns all of that.
- **R3 — Animation lives in `update(t, dt)`.** Move the scene's per-frame
  expressions there verbatim (they read the same closure variables the
  build created). `update` must not reference the old clock/renderer, and
  must be safe to simply stop calling — unloading = the Walker disposes
  the group.
- **R4 — Spawn.** A point on walkable ground, not inside geometry, `yaw`
  facing the world's hero view (what the diorama's default camera framed).
- **R5 — Doors.** Two walkable ground points, ≥ 2 units clear of obstacles.
  `next` at the world's exit landmark (gate, path end, dock, cave mouth);
  `prev` at a secondary landmark. The Walker draws the rift prop itself —
  the module supplies coordinates only.
- **R6 — Env.** `background`, `fogColor`, `fogDensity` copied from the
  scene's own values, so walking in feels like the diorama looked.
- **R7 — Real ground.** Terrain must be actual meshes inside the group —
  the Walker floors the player by raycasting down. No invisible or
  merged-away ground planes.

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
   with finite numbers in `spawn`, `env`, `doors`.
3. `group` contains at least one mesh.
4. `update(0, 0.016)` and `update(1, 0.016)` run without throwing.

Failures go to a **conversion report** (world id + which rule failed),
never into `worlds.json`. A world that isn't in the manifest simply isn't
in the walk yet — the walk itself never breaks.

## 5. The endgame (retire the converter)

Teach `generate_worlds.py` to emit this shape natively: one build function,
two wrappers — the diorama page and the Walker module. At that point
conversion is free, spawn/doors come from the generator's own scene
knowledge, and this document becomes a historical footnote. Until then,
the converter above is the bridge — and every converted world is also a
perfect training example of the target format.
