#!/usr/bin/env node
// ============================================================================
// build-walk-manifest — regenerate walk/worlds.json from converted modules.
//
// The World Walker host (walker.html) contains NO hardcoded world list: it
// fetches worlds.json at runtime and derives the ring, the HUD counter and
// the preload set from it. This script is how the walk grows: convert a new
// scene into modules/<NNN>.js, re-run this script, done — walker code is
// never edited.
//
// A converted module declares its own metadata in a header line:
//
//   // @world {"id":"042","title":"EXAMPLE","sub":"Some Place","system":"Atari 2600"}
//
// The script scans the modules directory, reads that line from every
// NNN.js file, sorts entries by numeric id, and writes the manifest.
// A module without a valid @world line FAILS the build (loudly) — the
// manifest can never silently shrink.
//
// Usage:
//   node tools/build-walk-manifest.mjs [--modules DIR] [--out FILE] [--scenes DIR]
//
//   --modules  conversions directory      (default: <walk>/modules)
//   --out      manifest path              (default: <walk>/worlds.json)
//   --scenes   optional scenes registry directory of NNN_*.html originals;
//              when given, the script also reports which scenes exist but
//              have no converted module yet (the pending-conversion queue).
// ============================================================================

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const walkRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? resolve(process.argv[i + 1]) : fallback;
}

const modulesDir = arg('--modules', join(walkRoot, 'modules'));
const outPath = arg('--out', join(walkRoot, 'worlds.json'));
const scenesDir = process.argv.includes('--scenes') ? arg('--scenes', null) : null;

const files = readdirSync(modulesDir)
  .filter((f) => /^\d+\.js$/.test(f))
  .sort();

if (files.length === 0) {
  console.error(`build-walk-manifest: no NNN.js modules found in ${modulesDir}`);
  process.exit(1);
}

const entries = [];
const problems = [];

for (const file of files) {
  const fileNum = parseInt(file, 10);
  const src = readFileSync(join(modulesDir, file), 'utf8');
  const m = src.match(/^\/\/ @world (.+)$/m);
  if (!m) {
    problems.push(`${file}: missing '// @world {...}' metadata header line`);
    continue;
  }
  let meta;
  try {
    meta = JSON.parse(m[1]);
  } catch (e) {
    problems.push(`${file}: @world line is not valid JSON (${e.message})`);
    continue;
  }
  if (parseInt(meta.id, 10) !== fileNum) {
    problems.push(`${file}: @world id "${meta.id}" does not match the filename number`);
    continue;
  }
  for (const key of ['id', 'title', 'sub']) {
    if (!meta[key]) problems.push(`${file}: @world is missing "${key}"`);
  }
  entries.push({
    id: String(meta.id),
    title: meta.title,
    sub: meta.sub,
    system: meta.system || '',
    module: 'modules/' + file,
  });
}

if (problems.length) {
  console.error('build-walk-manifest: REFUSING to write a manifest with problems:');
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}

entries.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

writeFileSync(outPath, JSON.stringify(entries, null, 2) + '\n', 'utf8');

console.log(
  `build-walk-manifest: wrote ${entries.length} world(s) to ${outPath}` +
    ` (ids ${entries[0].id}..${entries[entries.length - 1].id})`
);

if (scenesDir) {
  const sceneIds = new Set(
    readdirSync(scenesDir)
      .map((f) => f.match(/^(\d+)_.*\.html$/))
      .filter(Boolean)
      .map((m) => m[1])
  );
  const converted = new Set(entries.map((e) => e.id));
  const pending = [...sceneIds].filter((id) => !converted.has(id)).sort();
  console.log(
    `scenes registry: ${sceneIds.size} scene(s), ${converted.size} converted, ` +
      `${pending.length} pending conversion` +
      (pending.length ? ` (first pending: ${pending.slice(0, 10).join(', ')})` : '')
  );
}
