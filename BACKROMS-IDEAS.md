# Back Roms — Ideas Backlog

Captured 2026-11-01 from Cherie; expanded and adjudicated by Moth the same day.
Verdicts: **DO** = build as stated · **ADAPT** = build with the noted change · **DON'T** = not as stated (reason given).
Nothing here is scheduled until Cherie picks a phase.

## Decisions — Cherie, 2026-11-01

- §§1–4 **APPROVED**, in implementation as three parallel lanes (walker core / map module / pipeline thumbs); integration lands on main as one batch.
- §5 side-scroller: **DROPPED** — not building it.
- Favorites: ONE simple star touch control. No thumbs up/down, no repair-queue wiring.
- Map thumbnails: REAL baked top-down renders from a new pipeline step in the walker converter — not reference-image tiles.
- The phasing section below is superseded by the parallel build.

---

## 1. Saved state — start where you last played · **DO**

Resume in the same world, at the same spot, with the same relics collected.

- The Walker's Journal already persists collected relics in `localStorage`; this extends the same store: current world id, position, look direction, visited set, favorites (see §2).
- Save on a throttle (every ~5 s while moving), on portal crossings, and on page hide — never per frame.
- Version the save schema (`v2`). Worlds get regenerated and edited, so a saved position can end up inside new geometry: on load, run the same ground/stuck check the walker uses at spawn; if it fails, fall back to the world's normal spawn with relics and visited intact. A stale save must never soft-lock the player.
- Cost: small. All client-side; no server, no account. This is the highest value-per-effort item in this doc.

## 2. Favorite a world · **DO — star only** (Cherie, 2026-11-01: one simple star touch control; no thumbs down)

Cherie's version: a simple touch control, upper-right corner, to favorite/bookmark a room — or thumbs up / thumbs down.

- **Favorites: yes, exactly as stated.** One big touch target, top-right, filled/unfilled state. Favorites are the raw material for the map (§3) and the custom ring (§4), so this signal has three consumers.
- **Thumbs down: only if it does something.** A rating nobody reads is dead UI. Wire thumbs-down to the pipeline: a downvoted world goes into the re-check / repair queue (the same queue the "Issue Detected" audit feeds). Thumbs-up can stay a lighter-weight favorite synonym if two controls feel like too much — decide in the build, not here.
- Keep it to at most two buttons. The walker HUD is deliberately minimal; a cluster of social buttons would cheapen it.

## 3. Map overview — full-screen, zoomable · **DO** (one hard part, named)

A map view that takes over the whole screen: a massive zoomable grid where each square is a tiny thumbnail of a world, showing where you are, where you've visited, where you've collected a relic, and your favorites. Tap to travel.

- Layout/pan/zoom is standard work (pinch + drag, same gesture family as the gallery). The state overlays are free — visited / relic / favorite all live in the §1 save.
- **The hard part is the thumbnails.** True top-down renders of each world do not exist yet. Two sources, in order:
  1. *Now:* the world's gallery reference image as its tile (197 worlds have a good one; the VGMaps pass grows this).
  2. *Proper fix:* bake a top-down snapshot when a scene is converted to a walker module (`make_walker_module` renders the finished scene from directly above, once, and stores `walk/thumbs/<id>.png`). One new pipeline step, no runtime cost, and the tiles become real maps of the actual 3D worlds.
- Fast travel: tap a **visited** world to rift straight there. Unvisited worlds stay fogged / un-tappable — exploration has to mean something, and the current±1 streaming already supports jumping (it just loads a different neighborhood).
- This is also the natural home for the Journal: relic status per tile instead of a separate list.

## 4. Organize favorites into your own connected route · **DO — the standout idea**

From the map, let the player arrange their favorites into a sequence — a personal ring where the rifts lead favorite → favorite in the order they chose.

- This works *because* of how the walker is built: the host drives the ring from an ordered list (`walk/worlds.json`) and streams current ± 1, so a favorites route is just a custom ordered list. No module changes needed; worlds don't know or care who their neighbors are.
- UI: on the map, tap favorites in order (numbered badges 1, 2, 3…), "Walk this route" swaps the active ring. Keep the canonical ring one tap away ("Back Roms ring").
- Why it's the standout: it's the first feature that makes the catalog *personal* — 1,000 worlds is a warehouse; a hand-built route of your 12 favorites is a place. It also gives §2's favorite button its real purpose.

## 5. Side-scroller walker built from the gallery images · **DROPPED** (Cherie, 2026-11-01 — not building it; analysis below kept for the record)

Cherie's version: a side-view walker mode where the gallery images themselves become the scrolling world — walk through the map image.

- Technically easy and genuinely charming for the subset it fits: side-view stage maps (the Sonic / Mega Man class) become the level surface with simple run/jump physics over the image. It falls apart for top-down maps, RPG towns, and maze maps — maybe a few dozen worlds fit, not 1,000.
- **The wrinkle is rights, not code.** The gallery images are fan-made maps and publisher screenshots that we use as *generation reference*. Making the image itself the playable surface ships other people's art as the game. Local prototype: fine under our testing rules. Public feature as stated: don't.
- The shippable variant: generate the scroller backdrop from **our own** material — a side render of the generated 3D scene, or a procedurally redrawn backdrop in the world's palette. Same feel, clean provenance. Decide if the mode earns that work after the local prototype proves the fun.

---

## Phasing (if Cherie green-lights)

1. **Phase 1 — Save + favorites** (§1, §2): small, all client-side, everything else builds on the state it creates.
2. **Phase 2 — Map overview** (§3): reference-image tiles first; top-down bake step added to the converter; fast travel to visited worlds.
3. **Phase 3 — Favorites ring** (§4): custom routes from the map.
4. **Phase 4 — Side-scroller prototype** (§5): local only, side-view subset, evaluate the fun before any public variant.

## Save schema sketch (v2, localStorage `backroms.save`)

```json
{
  "v": 2,
  "world": 14,
  "pos": [x, y, z], "yaw": 0.0,
  "relics": [1, 7, 14],
  "visited": [1, 2, 7, 14],
  "favorites": [14, 64, 506],
  "downvoted": [],
  "routes": [{ "name": "My ring", "worlds": [14, 64, 506] }]
}
```

## Open questions for Cherie

- Thumbs: two controls (favorite + thumbs) or one? And is thumbs-down → repair queue the right consumer?
- Map tiles: reference images acceptable for v1, or wait for baked top-down renders?
- Side-scroller: worth a local prototype in Phase 4, or park it?
