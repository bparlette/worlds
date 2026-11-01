# Scene remap — map-first catalog swap (based on main @ d1823670)

Matching rule: exact (game, target) pair match between the old catalog / `generation_progress.json` (ids 1–39, pairs verified identical in both) and the new map-first catalog, after light normalization (case, punctuation, `&`→`and`). Result independently reproduces the merge report's count: **15 survivors + 24 orphans = 39**.

## Survivors — old id → new id (15)

| Old id | Game — Target | Scene file (unchanged) | Verified | New id | New platform |
|---|---|---|---|---|---|
| 001 | Adventure — Castles & Mazes | `scenes/001_adventure_castles_mazes.html` | 🟢 | **001** | Atari 2600 |
| 027 | Dragon Warrior — Charlock Castle | `scenes/027_dragon_warrior_charlock_castle.html` | ⚠️ | **011** | NES |
| 014 | Metroid — Norfair Volcanic Caverns | `scenes/014_metroid_norfair_volcanic_caverns.html` | ⚠️ | **108** | NES |
| 016 | Mega Man 2 — Bubble Man's Underwater Lair | `scenes/016_mega_man_2_bubble_man_s_underwater_lair.html` | ⚠️ | **109** | NES |
| 024 | Kirby's Adventure — Rainbow Resort | `scenes/024_kirby_s_adventure_rainbow_resort.html` | ⚠️ | **110** | NES |
| 010 | Super Mario Bros. — World 1-1 | `scenes/010_super_mario_bros_world_1_1.html` | ⚠️ | **112** | NES |
| 021 | DuckTales — The Moon Base | `scenes/021_ducktales_the_moon_base.html` | ⚠️ | **132** | NES |
| 029 | Rygar — Lapis Valley | `scenes/029_rygar_lapis_valley.html` | ⚠️ | **133** | NES |
| 031 | Crystalis — Floating Tower of Babylon | `scenes/031_crystalis_floating_tower_of_babylon.html` | ⚠️ | **134** | NES |
| 019 | Blaster Master — Area 1 Underworld | `scenes/019_blaster_master_area_1_underworld.html` | 🟢 | **224** | NES |
| 032 | A Boy and His Blob — Blobolonia | `scenes/032_a_boy_and_his_blob_blobolonia.html` | ⚠️ | **245** | NES |
| 038 | Chrono Trigger — 2300 A.D. Ruined Domes | `scenes/038_chrono_trigger_2300_a_d_ruined_domes.html` | 🟢 | **262** | SNES |
| 039 | Chrono Trigger — 65,000,000 B.C. Tyrano Lair | `scenes/039_chrono_trigger_65_000_000_b_c_tyrano_lair.html` | ⚠️ | **263** | SNES |
| 034 | Super Mario World — Forest of Illusion | `scenes/034_super_mario_world_forest_of_illusion.html` | ⚠️ | **344** | SNES |
| 037 | Super Metroid — Maridia Submerged Depths | `scenes/037_super_metroid_maridia_submerged_depths.html` | ⚠️ | **355** | SNES |

Notes:
- Scene **files keep their old filenames** (e.g. Dragon Warrior's scene stays `scenes/027_dragon_warrior_charlock_castle.html`); only the catalog id that points at them changes. The regenerated gallery already links them from their new-id cards.
- `generation_progress.json` in this bundle is the same data mechanically re-keyed to the new ids above (all other fields preserved verbatim) so the generator's `update_gallery()` keeps producing correct badges after the swap.
- Special case: old #001 Adventure survives at new #001, so the Chalice Run side-file (`scenes/001_adventure_chalice_run.html`) and its gallery button carry over unchanged.

## Orphans — pairs that did NOT survive (24)

These scene files stay in the repo untouched — **nothing is deleted**. They simply have no entry in the new catalog, so the new gallery no longer links them and the re-keyed progress file no longer lists them. If the Mac loop wants any of them back, the pair must re-enter via the bench/catalog, not by re-keying.

| Old id | Game — Target | Scene file (orphaned, kept on disk) | Verified |
|---|---|---|---|
| 002 | Pitfall! — Jungle & Underworld | `scenes/002_pitfall_jungle_underworld.html` | 🟢 |
| 003 | Haunted House — Ghost Mansion | `scenes/003_haunted_house_ghost_mansion.html` | 🟢 |
| 004 | Yars' Revenge — Neutral Zone & Shield | `scenes/004_yars_revenge_neutral_zone_shield.html` | 🟢 |
| 005 | River Raid — Canyon Riverway | `scenes/005_river_raid_canyon_riverway.html` | 🟢 |
| 006 | Solaris — Stellar Quadrants & Canyons | `scenes/006_solaris_stellar_quadrants_canyons.html` | ⚠️ |
| 007 | Mountain King — Diamond Caverns | `scenes/007_mountain_king_diamond_caverns.html` | 🟢 |
| 008 | Berzerk — Electrified Neon Maze | `scenes/008_berzerk_electrified_neon_maze.html` | ⚠️ |
| 009 | Warlords — Quadrant Fortresses | `scenes/009_warlords_quadrant_fortresses.html` | ⚠️ |
| 011 | Super Mario Bros. 3 — Dark Land Airships | `scenes/011_super_mario_bros_3_dark_land_airships.html` | 🟢 |
| 012 | The Legend of Zelda — Underworld Dungeons | `scenes/012_the_legend_of_zelda_underworld_dungeons.html` | 🟢 |
| 013 | Zelda II: The Adventure of Link — Palace Temples | `scenes/013_zelda_ii_the_adventure_of_link_palace_temples.html` | 🟢 |
| 015 | Castlevania — Clock Tower | `scenes/015_castlevania_clock_tower.html` | 🟢 |
| 017 | Contra — Jungle Waterfall | `scenes/017_contra_jungle_waterfall.html` | ⚠️ |
| 018 | Ninja Gaiden — Downtown Neon Rooftops | `scenes/018_ninja_gaiden_downtown_neon_rooftops.html` | ⚠️ |
| 020 | Bionic Commando — Neutral Area Military Base | `scenes/020_bionic_commando_neutral_area_military_base.html` | 🟢 |
| 022 | Kid Icarus — Sky World Floating Palace | `scenes/022_kid_icarus_sky_world_floating_palace.html` | ⚠️ |
| 023 | StarTropics — Submerged Coral Caverns | `scenes/023_startropics_submerged_coral_caverns.html` | ⚠️ |
| 025 | EarthBound Beginnings — Magicant | `scenes/025_earthbound_beginnings_magicant.html` | ⚠️ |
| 026 | Final Fantasy — Flying Fortress | `scenes/026_final_fantasy_flying_fortress.html` | 🟢 |
| 028 | Batman — Axis Chemical Factory | `scenes/028_batman_axis_chemical_factory.html` | ⚠️ |
| 030 | Shadowgate — Castle Crypt | `scenes/030_shadowgate_castle_crypt.html` | 🟢 |
| 033 | Little Samson — Molten Volcanic Caverns | `scenes/033_little_samson_molten_volcanic_caverns.html` | ⚠️ |
| 035 | Yoshi's Island — Pastel Crayon Hills | `scenes/035_yoshi_s_island_pastel_crayon_hills.html` | ⚠️ |
| 036 | A Link to the Past — Dark World Pyramid | `scenes/036_a_link_to_the_past_dark_world_pyramid.html` | 🟢 |

## Walker manifest (`walk/worlds.json`) re-key

The walker manifest lists 9 module worlds by old id. Against the new catalog:

| Walk old id | World | New catalog id | Action for Mac side |
|---|---|---|---|
| 001 | Adventure — Castles & Mazes | **001** | Re-key manifest entry + module filename to 001 |
| 002 | Pitfall! — Jungle & Underworld | — (not in new catalog) | Pair is gone from the catalog: drop from the walk ring or regenerate if the pair re-enters via the bench |
| 003 | Haunted House — Ghost Mansion | — (not in new catalog) | Pair is gone from the catalog: drop from the walk ring or regenerate if the pair re-enters via the bench |
| 004 | Yars' Revenge — Neutral Zone & Shield | — (not in new catalog) | Pair is gone from the catalog: drop from the walk ring or regenerate if the pair re-enters via the bench |
| 005 | River Raid — Canyon Riverway | — (not in new catalog) | Pair is gone from the catalog: drop from the walk ring or regenerate if the pair re-enters via the bench |
| 007 | Mountain King — Diamond Caverns | — (not in new catalog) | Pair is gone from the catalog: drop from the walk ring or regenerate if the pair re-enters via the bench |
| 011 | Super Mario Bros. 3 — Dark Land Airships | — (not in new catalog) | Pair is gone from the catalog: drop from the walk ring or regenerate if the pair re-enters via the bench |
| 019 | Blaster Master — Area 1 Underworld | **224** | Re-key manifest entry + module filename to 224 |
| 020 | Bionic Commando — Neutral Area Military Base | — (not in new catalog) | Pair is gone from the catalog: drop from the walk ring or regenerate if the pair re-enters via the bench |

Only 2 of the 9 walk worlds survive by pair (001 Adventure → 001, 019 Blaster Master → 224). The walker manifest and `walk/modules/NNN.js` files are **not** part of this push — re-keying them is Mac-side work (module contents embed their world id; a blind rename is not safe). Until re-keyed, the live walker keeps walking the old 9 worlds, unaffected by the catalog swap.
