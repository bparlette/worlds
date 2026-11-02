# KICKOFF — TOP 100 SCREENS BUILD LOOP (v2, Nov 1)

Repo: bparlette/worlds, branch main. Re-pull first; report the tip.

INPUT: `art/top100.json` in this repo — 100 ranked screens {rank, game, name, image_url, width, height}. Live now; if the file is missing, stop and report — do not substitute other images.

TASK: Run these 100 through the SAME scripts and loop as the 1,000-world catalog (Qwen generation + sanitizer + make_walker_module.py conversion + gate), in rank order, one at a time. Same pipeline — the only changes are the image type and the Qwen prompt rules below.

## QWEN PROMPT CHANGES (screens run — this replaces the map framing)

The 1,000's template carries the Section Rule because catalog images are whole maps. These images are NOT maps. For this run, replace that part of the prompt with:

> IMAGE TYPE: this image is a single gameplay SCREEN — one place at player-view scale, not a map. Build the entire pictured place. There is no larger map and no section to choose; do not crop, zoom, or select a sub-area.
>
> WHO IS IN THE PICTURE: the screen may show characters, enemies, a player sprite, HUD, score counters, and text. Build NONE of those. Build only the background world — the terrain, buildings, platforms, scenery, and fixed props that would remain if every character and every HUD element vanished. Characters set the scale and nothing else. No text, no letters, no HUD shapes as geometry.
>
> Everything else in the standard template stands.

## LOCKED STANDARDS (unchanged from the 1,000 run)
- Footprint ≤ 30×30; height cap ~13.
- Walls: inside-only — wall material renders interior faces only (BackSide): solid from inside, not drawn from outside.
- Sanitizer: canvas-declaration fix, defaultCamera.distance() replacement, touch CSS backstop AND the JS gesture guard (non-passive touchstart/touchmove preventDefault on the canvas; gesturestart/gesturechange preventDefault on document) — iOS orbit is owner-tested on her phone.
- Relics are NOT generation-side: the Qwen prompt must contain NO relic mention of any kind (the input stays image + minimal text). Relic identity comes from `walk/relics.json`, placement is stamped and clearance-validated by the converter, and the Walker builds the visual from `walk/relics.js` (pure 3D shapes by construction). If a treasure-like object is part of the source screen's scenery, it is scenery — build it as such; it is not the relic.
- The Glitch rules unchanged (Back Roms-wide).
- Walker conversion per the R1–R9 contract in WALKER-PIPELINE-ADD.md; every scene registers in the walker manifest; bake thumbnails as in the 1,000 run.

## GATE PER WORLD (all pass before the next)
Scene loads error-free; conversion validates; footprint and height measured and inside caps; relic assignment stamped by the converter (id/name from walk/relics.json, anchor clearance-validated); spawn and doors present; NO character/HUD geometry in the scene (check the render against the reference: if a person-shaped or text-shaped mesh exists, it fails). Log measured numbers — don't assert them.

## COMMITS + STOP CONDITIONS
Batch per world (or per small set), on main, message format: `top100 #NNN <game> — <name>`. Report each world as: rank, game, commit, gate results with measured numbers. If a world fails its gate twice, park it, note why, and move on. After #100, stop and summarize. Do not continue into the 1,000-world loop or the screens pool without the owner's explicit go. Do not swap, drop, or re-rank list entries.
