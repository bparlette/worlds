# Back Roms pipeline additions — Relic (generation-side) + the Glitch (nothing to do)

Two gameplay layers sit on top of the walkable worlds. Only ONE of them
touches the generation pipeline:

## 1. The Relic — add this block to the generator/converter prompt

Paste into the prompt that produces (or converts) a walker module, next to
the existing spawn/doors instructions:

> RELIC (required): In the object returned by `createWorld`, also emit
> `relic: { name, x, z }` — the world's hidden treasure.
> - `name`: this game's single most iconic treasure object (the thing a fan
>   of the game would cross the map for — Adventure's chalice, Pitfall's
>   golden idol). A proper name, in quotes.
> - `x, z`: a point on WALKABLE ground in this world, at least 10 units
>   from `spawn` and at least 6 units from both `doors` points, and off the
>   straight line between them — the relic rewards exploring, it is never
>   on the beeline. Inside the world's bounds, on the ground plane (the
>   walker floats it at terrain height, so give only x/z).
> The walker renders, lights and tracks it; a module without a valid
> `relic` fails validation (spec rule R8) and is reported, not shipped.

For modules generated without it, the deterministic fallback is
`tools/add-relic.mjs` (proposes a hiding spot from spawn geometry; the R8
gate verifies the ground under it; rejected points take the next
candidate).

## 2. The Glitch — NO pipeline work

The Glitch is part of the Back Roms host (`walk/walker.html`), not of any
world: a single entity that haunts one room in every three to five,
chosen at random — frozen while observed, closing half its distance at
every look-away, gone in a glitch-burst at arm's length. Every generated
world is eligible automatically, forever, with zero per-world data.

One hygiene rule so nothing collides with it: **modules must not create
any object, variable or group named `glitch`** (case-insensitive).
