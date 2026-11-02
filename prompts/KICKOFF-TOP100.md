# KICKOFF — TOP 100 SCREENS BUILD LOOP (v2, Nov 1)

Repo: bparlette/worlds, branch main. Re-pull first; report the tip.

INPUT: `art/top100.json` in this repo — 100 ranked screens {rank, game, name, image_url, width, height}. Live now; if the file is missing, stop and report — do not substitute other images.

TASK: Run these 100 through the SAME scripts and loop as the 1,000-world catalog (Qwen generation + sanitizer + make_walker_module.py conversion + gate), in rank order, one at a time. Same pipeline — the only changes are the image type and the Qwen prompt rules below.

## GENERATION — PARTS PIPELINE (this replaces the Qwen prompt rules)

These 100 are built with the JSON parts pipeline — `prompts/PARTS-PIPELINE.md` in this repo is the full spec; read it first. In short:

- Qwen emits a **JSON parts list** per screen, using the exact prompt in PARTS-PIPELINE.md §2 — image in, JSON out. Qwen writes NO JavaScript, so there is no scene code and no sanitizer pass.
- The builder script (`walk/parts.js` + `make_parts_module.py`) constructs the walker module deterministically; the gates in PARTS-PIPELINE.md §5 are the per-world gates for this run.
- The screen framing survives inside that prompt: this image is a single gameplay SCREEN — one place at player-view scale; build the entire pictured place; background world only — no characters, enemies, HUD, score counters, or text as geometry. Characters set the scale and nothing else. There is no larger map and no section to choose.
- **PILOT FIRST:** run the PARTS-PIPELINE.md §6 test protocol on world #001 only and report the results before starting the Top 100 loop.

## LOCKED STANDARDS (unchanged from the 1,000 run)
- Size, walls, and relics are MECHANICAL — none of them is prompt text: the builder script normalizes scale to the 30×30 footprint / ~13 height caps, boundary walls are flipped inside-only (BackSide) from the parts list's `role:"wall"` tag, and relic identity/placement come from `walk/relics.json` + converter-validated anchors with the visual built by the host from `walk/relics.js`. Qwen is told nothing about relics; a treasure-like object in a source screen's scenery is scenery, not the relic.
- Sanitizer: canvas-declaration fix, defaultCamera.distance() replacement, touch CSS backstop AND the JS gesture guard (non-passive touchstart/touchmove preventDefault on the canvas; gesturestart/gesturechange preventDefault on document) — iOS orbit is owner-tested on her phone. (Applies to the 1,000 run's JS scenes; the parts pipeline emits no Qwen code to sanitize.)
- The Glitch rules unchanged (Back Roms-wide).
- Walker conversion per the R1–R9 contract in WALKER-PIPELINE-ADD.md; every scene registers in the walker manifest; bake thumbnails as in the 1,000 run.

## GATE PER WORLD (all pass before the next)
Scene loads error-free; conversion validates; footprint and height measured and inside caps; relic assignment stamped by the converter (id/name from walk/relics.json, anchor clearance-validated); spawn and doors present; NO character/HUD geometry in the scene (check the render against the reference: if a person-shaped or text-shaped mesh exists, it fails). Log measured numbers — don't assert them.

## COMMITS + STOP CONDITIONS
Batch per world (or per small set), on main, message format: `top100 #NNN <game> — <name>`. Report each world as: rank, game, commit, gate results with measured numbers. If a world fails its gate twice, park it, note why, and move on. After #100, stop and summarize. Do not continue into the 1,000-world loop or the screens pool without the owner's explicit go. Do not swap, drop, or re-rank list entries.
