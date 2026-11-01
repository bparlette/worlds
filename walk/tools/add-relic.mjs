#!/usr/bin/env node
/**
 * add-relic.mjs — Back Roms pipeline tool: give a walker module its RELIC.
 *
 * Every world hides one iconic treasure object (its "relic"). The walker
 * (walk/walker.html) renders it and tracks it in the Walker's Journal, from
 * ONE field in the module's createWorld() return:
 *
 *     relic: { name: "Golden Idol", x: 12.5, z: -8.0 }
 *
 * The BEST place to set it is generation time: the generator knows the game
 * and the layout it just built (see PIPELINE-PROMPT-BLOCK.md). This script
 * is the deterministic fallback for modules that arrive without one: it
 * proposes a hiding spot offset from spawn (spiral of radii × compass
 * bearings, kept clear of both doors) and inserts the field.
 *
 * The placement is a CANDIDATE. The walker's validation gate (pipeline spec
 * rule R8) raycasts the point headlessly: if the ground check fails, re-run
 * with --radius / --bearing to take the next candidate, or place by hand.
 *
 * Usage:
 *   node tools/add-relic.mjs <module.js>                 # dry run: report
 *   node tools/add-relic.mjs <module.js> --write         # insert the field
 *   node tools/add-relic.mjs <module.js> --write --name "Crystal Urn"
 *   node tools/add-relic.mjs <module.js> --write --radius 26 --bearing 135
 *
 * Exit codes: 0 = has/inserted a relic · 2 = could not parse the module
 * (flag it for manual placement — never guess silently) · 1 = usage error.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--'));
if (!file) { console.error('usage: add-relic.mjs <module.js> [--write] [--name "…"] [--radius N] [--bearing DEG]'); process.exit(1); }
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const WRITE = args.includes('--write');

const src = readFileSync(file, 'utf8');

// Already has one? Report and stop (idempotent — safe to run over the set).
const existing = src.match(/relic\s*:\s*\{\s*name\s*:\s*"([^"]*)"\s*,\s*x\s*:\s*(-?[\d.]+)\s*,\s*z\s*:\s*(-?[\d.]+)/);
if (existing) {
  console.log(`OK ${file}: relic already present — "${existing[1]}" at (${existing[2]}, ${existing[3]})`);
  process.exit(0);
}

// Parse the anchors the placement rule needs: spawn + both doors.
const num = (re, s) => { const m = s.match(re); return m ? { x: parseFloat(m[1]), z: parseFloat(m[2]) } : null; };
const spawn = num(/spawn\s*:\s*\{\s*x\s*:\s*(-?[\d.]+)\s*,\s*z\s*:\s*(-?[\d.]+)/, src);
const doorN = num(/next\s*:\s*\{\s*x\s*:\s*(-?[\d.]+)\s*,\s*z\s*:\s*(-?[\d.]+)/, src);
const doorP = num(/prev\s*:\s*\{\s*x\s*:\s*(-?[\d.]+)\s*,\s*z\s*:\s*(-?[\d.]+)/, src);
if (!spawn) { console.error(`FLAG ${file}: no parseable spawn — place the relic manually.`); process.exit(2); }

// Title for the fallback name, from the module's @world header.
const titleM = src.match(/"title"\s*:\s*"([^"]+)"/);
const name = opt('name', titleM ? `${titleM[1]} Relic` : 'Lost Relic');

// Candidate hiding spots: radii × compass bearings around spawn, kept at
// least 6 units from either door (never on the spawn→door beeline's ends).
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
const candidates = [];
for (const r of [14, 20, 26, 32, 40]) {
  for (let b = 0; b < 360; b += 45) {
    const rad = (b * Math.PI) / 180;
    const c = { x: +(spawn.x + r * Math.sin(rad)).toFixed(1), z: +(spawn.z + r * Math.cos(rad)).toFixed(1), r, b };
    if (doorN && dist(c, doorN) < 6) continue;
    if (doorP && dist(c, doorP) < 6) continue;
    candidates.push(c);
  }
}
if (!candidates.length) { console.error(`FLAG ${file}: every candidate is too close to a door — place manually.`); process.exit(2); }

let pick = candidates[0];
const wantR = parseFloat(opt('radius', 'NaN')), wantB = parseFloat(opt('bearing', 'NaN'));
if (!Number.isNaN(wantR) || !Number.isNaN(wantB)) {
  pick = candidates.find(c => (Number.isNaN(wantR) || c.r === wantR) && (Number.isNaN(wantB) || c.b === wantB)) || pick;
}

const line = `relic: { name: ${JSON.stringify(name)}, x: ${pick.x}, z: ${pick.z} },`;
console.log(`${WRITE ? 'INSERT' : 'DRY-RUN'} ${file}: ${line}  (candidate ${candidates.indexOf(pick) + 1}/${candidates.length}, r=${pick.r} bearing=${pick.b}° from spawn ${spawn.x},${spawn.z})`);
if (!WRITE) { console.log('Re-run with --write to insert. Candidates in order: ' + candidates.map(c => `(${c.x},${c.z})`).join(' ')); process.exit(0); }

// Insert right after the spawn property inside the createWorld return.
const anchor = src.match(/spawn\s*:\s*\{[^}]*\}\s*,/);
if (!anchor) { console.error(`FLAG ${file}: spawn found but its property line is not insertable — place manually.`); process.exit(2); }
const at = src.indexOf(anchor[0]) + anchor[0].length;
writeFileSync(file, src.slice(0, at) + '\n    ' + line + src.slice(at));
console.log(`WROTE ${file}. Next: run the walker's R8 validation gate (ground-raycast this point); on rejection re-run with the next --radius/--bearing candidate.`);
