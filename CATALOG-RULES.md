# Catalog curation rules — Back Roms (bparlette/worlds)

The standing rules the 1,000-world catalog was selected under, as amended.
Selection is **image-first**: every entry exists because its map image is a
strong generation reference for Qwen — one complete area, rich legible detail.

## The bar

1. **One coherent area** in a single image — a whole area in frame, not a
   fragment, not a collage.
2. **Detail legible** downscaled to ~1,200 px long edge. Reject mostly-empty
   images, label/legend/arrow-annotated sheets, item/enemy charts, diagrams,
   and menu screens. In-game rendered tiles only.
3. **Long-edge cap ~6,000 px — with the single-act exemption (below).**
   Aspect ≤ 8:1 unless the image is genuinely one level.
4. **Per-game caps:** ~10 soft / 16 hard, iconic franchises preferred;
   platform breadth protected across all major families.
5. Every image URL is live-verified (HTTP 200 + image content type, true
   dimensions measured from the image itself) before it enters the catalog.

## Rule clarification — the long-edge cap targets composites, not long levels

*(Added 2026-11-01, Cherie's call, after the Sonic gap hunt.)*

The ~6,000 px long-edge cap exists to reject **whole-game and whole-world
composites** — stitched sheets that pack many areas into one image. It was
never meant to reject a **verified true single act/level**, however wide that
level legitimately is. Sonic acts run 8,500–12,000 px wide because the levels
are that long; the cap as first applied silently culled every Green Hill,
Emerald Hill, and Angel Island rip from the candidate pools before ranking,
and the catalog shipped with only an 800×263 thumbnail fragment of Green
Hill Zone.

**Rule: a verified true single act/level is EXEMPT from the long-edge cap,
regardless of width.** The cap applies in full to composites, overworld
sheets, and multi-area stitches. When in doubt, the question is not "how
wide is it?" but "is it one place?" — one place passes at any width; many
places fail at any width.

## Companion rules (generation side)

- **Section Rule (R10):** for the overview images that legitimately remain
  (true overworlds), Qwen builds only the single most detailed section at
  full detail inside the 30×30 footprint — never a compressed whole world.
  The instruction lives in every entry's `qwen_prompt` and in
  `PIPELINE-PROMPT-BLOCK.md` / `WALKER-PIPELINE-ADD.md`.
- **Bench:** ranked alternates live in `bench.json` (merge output, kept in
  the workspace). Displaced catalog entries drop to the bench, ranked by
  their original merge scores; bench entries that enter the catalog are
  removed from the bench.
