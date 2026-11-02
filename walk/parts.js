// parts.js — the Walker's JSON parts-list builder.
//
// The parts pipeline (prompts/PARTS-PIPELINE.md): Qwen writes NO code.
// It emits a JSON parts list — primitive shapes, centre positions, full
// extents, flat colours — and THIS file, authored once and tested,
// builds the world. Every Qwen-JS failure class we measured in the old
// pipeline (undeclared variables, invented APIs, temporal-dead-zone
// references, token-cap truncation mid-function) is impossible here by
// construction: the worst a bad parts list can do is a wrong-looking
// world, never a broken one.
//
// Return contract (consumed by parts-built modules, see
// make_parts_module.py):
//   buildParts(THREE, data) -> { group, tickers, warnings }
// - group: a THREE.Group holding one mesh per part instance, in the
//   data's own coordinate space (origin at world centre, ground y=0).
//   Normalization scaling is the converter's job, applied outside.
// - tickers: array of functions(t) — one per animated part instance —
//   that the module's update(t) calls. Every ticker is exception-proof.
// - warnings: human-readable strings, one per skipped/repaired part.
//   buildParts NEVER throws on bad part data: a bad part is skipped
//   and logged here (graceful degradation, per part).
//
// Part schema (data = { id, title, game, sky, fog, ground, parts }):
//   { s, p:[x,y,z] centre, z:[sx,sy,sz] full extents, c:"#rrggbb",
//     ry, rx, rz (degrees, default 0), e:"#rrggbb" emissive,
//     role ("prop" default; "wall" => material side BackSide),
//     a: anim tag, ap: [amp, speed], r:[dx,dy,dz] repeat step,
//     n: repeat count (default 1) }
// Shapes ("s"): box | cyl | sph | cone | tor | wed | gnd.
// See prompts/PARTS-PIPELINE.md for the full reference.

const SHAPES = new Set(["box", "cyl", "sph", "cone", "tor", "wed", "gnd"]);

function num(v, fallback) {
  // Strict on purpose: Number(null) === 0 would silently teleport a
  // broken part to the origin instead of skipping it.
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function vec3(v, fallback) {
  if (!Array.isArray(v) || v.length < 3) return fallback;
  const out = [num(v[0], NaN), num(v[1], NaN), num(v[2], NaN)];
  return out.every(Number.isFinite) ? out : fallback;
}

function colorOf(v, fallback) {
  return typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback;
}

// Wedge geometry from full extents [sx, sy, sz]: a triangular prism.
// Low edge at the +z front (height 0), high edge at the -z back
// (height sy), extruded across sx. Built centred: x in [-sx/2, sx/2],
// y in [-sy/2, sy/2], z in [-sz/2, sz/2]. Non-indexed triangles with
// computed normals — 8 triangles, 24 vertices.
function wedgeGeometry(THREE, sx, sy, sz) {
  const x = sx / 2, y = sy / 2, z = sz / 2;
  // Corners: B = bottom (y=-y), T = top of the back edge (y=+y).
  const bfl = [-x, -y, z], bfr = [x, -y, z];      // bottom front (low edge)
  const bbl = [-x, -y, -z], bbr = [x, -y, -z];    // bottom back
  const tbl = [-x, y, -z], tbr = [x, y, -z];      // top back (high edge)
  const tris = [
    // bottom
    bfl, bbr, bfr, bfl, bbl, bbr,
    // back (full-height face at z=-z)
    bbl, tbr, bbr, bbl, tbl, tbr,
    // slope (low front edge -> high back edge)
    bfr, bfl, tbl, bfr, tbl, tbr,
    // left triangle (x=-x)
    bfl, bbl, tbl,
    // right triangle (x=+x)
    bbr, bfr, tbr,
  ];
  const flat = [];
  for (const v of tris) flat.push(v[0], v[1], v[2]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(flat, 3));
  geo.computeVertexNormals();
  return geo;
}

function geometryFor(THREE, part, z) {
  const [sx, sy, sz] = z;
  switch (part.s) {
    case "box":
    case "gnd":
      return new THREE.BoxGeometry(sx, sy, sz);
    case "cyl":
      return new THREE.CylinderGeometry(sx / 2, sx / 2, sy, 20);
    case "sph":
      // Unit-diameter sphere scaled per-axis by the mesh itself.
      return new THREE.SphereGeometry(0.5, 20, 14);
    case "cone":
      return new THREE.ConeGeometry(sx / 2, sy, 20);
    case "tor":
      // TorusGeometry lies in the XY plane (ring standing, axis +z).
      // For "tor", z[1] is the TUBE radius (not an extent) — see
      // prompts/PARTS-PIPELINE.md; the converter's AABB accounts for it.
      return new THREE.TorusGeometry(sx / 2, sy, 10, 24);
    case "wed":
      return wedgeGeometry(THREE, sx, sy, sz);
    default:
      return null;
  }
}

// One ticker per animated instance. base values are captured at build
// time; every ticker swallows its own exceptions so update() can never
// be broken by a single part.
function makeTicker(mesh, mat, part) {
  const tag = part.a;
  if (!tag || tag === "none") return null;
  const ap = vec3(part.ap, null);
  const amp = ap ? ap[0] : undefined;
  const speed = ap ? ap[1] : undefined;
  const baseY = mesh.position.y;
  const baseRy = mesh.rotation.y;
  const baseRz = mesh.rotation.z;
  let fn = null;
  if (tag === "bob") {
    const A = num(amp, 0.3), S = num(speed, 1.5);
    fn = (t) => { mesh.position.y = baseY + Math.sin(t * S) * A; };
  } else if (tag === "spin") {
    const S = num(speed, 0.8);
    fn = (t) => { mesh.rotation.y = baseRy + t * S; };
  } else if (tag === "sway") {
    const A = num(amp, 0.08), S = num(speed, 1.2);
    fn = (t) => { mesh.rotation.z = baseRz + Math.sin(t * S) * A; };
  } else if (tag === "pulse") {
    if (!mat || !mat.emissive) return null;
    const S = num(speed, 2.0);
    fn = (t) => { mat.emissiveIntensity = 0.7 + 0.3 * Math.sin(t * S); };
  }
  if (!fn) return null;
  return (t) => { try { fn(t); } catch (e) { /* inert */ } };
}

function buildOne(THREE, part, offset, warnings, label) {
  const z = vec3(part.z, null);
  const p = vec3(part.p, null);
  if (!z || !p) { warnings.push(`${label}: bad p/z, skipped`); return null; }
  if (z.some((v) => v <= 0)) { warnings.push(`${label}: non-positive size, skipped`); return null; }

  let geo;
  try {
    geo = geometryFor(THREE, part, z);
  } catch (e) {
    warnings.push(`${label}: geometry failed (${e.message}), skipped`);
    return null;
  }
  if (!geo) { warnings.push(`${label}: unknown shape "${part.s}", skipped`); return null; }

  const matOpts = {
    color: new THREE.Color(colorOf(part.c, "#888888")),
    roughness: 0.85,
    metalness: 0,
  };
  const emissive = colorOf(part.e, null);
  if (emissive) {
    matOpts.emissive = new THREE.Color(emissive);
    matOpts.emissiveIntensity = 1;
  }
  if (part.role === "wall") matOpts.side = THREE.BackSide;
  const mat = new THREE.MeshStandardMaterial(matOpts);

  const mesh = new THREE.Mesh(geo, mat);
  let cx = p[0] + offset[0], cy = p[1] + offset[1], cz = p[2] + offset[2];
  if (part.s === "gnd") cy = (p[1] + offset[1]) - z[1] / 2; // p[1] is the TOP height
  mesh.position.set(cx, cy, cz);
  if (part.s === "sph") mesh.scale.set(z[0], z[1], z[2]);
  if (part.s === "cyl" && z[0] > 0 && Math.abs(z[2] - z[0]) > 1e-6) {
    mesh.scale.set(1, 1, z[2] / z[0]); // elliptical footprint
  }
  const D = Math.PI / 180;
  mesh.rotation.set(num(part.rx, 0) * D, num(part.ry, 0) * D, num(part.rz, 0) * D);
  mesh.name = typeof part.name === "string" ? part.name : "";
  return { mesh, mat };
}

export function buildParts(THREE, data) {
  const group = new THREE.Group();
  const tickers = [];
  const warnings = [];
  const parts = data && Array.isArray(data.parts) ? data.parts : [];
  if (!data || !Array.isArray(data.parts)) {
    warnings.push("buildParts: data.parts missing or not an array; empty world built");
  }

  parts.forEach((part, idx) => {
    const label = `parts[${idx}]${part && part.s ? " (" + part.s + ")" : ""}`;
    try {
      if (!part || typeof part !== "object") { warnings.push(`${label}: not an object, skipped`); return; }
      if (!SHAPES.has(part.s)) { warnings.push(`${label}: unknown shape, skipped`); return; }
      const step = vec3(part.r, [0, 0, 0]);
      let n = Math.floor(num(part.n, 1));
      if (!(n >= 1)) n = 1;
      if (n > 500) { warnings.push(`${label}: repeat count ${n} clamped to 500`); n = 500; }
      for (let i = 0; i < n; i++) {
        const offset = [step[0] * i, step[1] * i, step[2] * i];
        const built = buildOne(THREE, part, offset, warnings, n > 1 ? `${label}#${i}` : label);
        if (!built) continue;
        group.add(built.mesh);
        const ticker = makeTicker(built.mesh, built.mat, part);
        if (ticker) tickers.push(ticker);
      }
    } catch (e) {
      warnings.push(`${label}: build failed (${e.message}), skipped`);
    }
  });

  return { group, tickers, warnings };
}
