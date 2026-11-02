// relics.js — the Walker's relic library.
//
// Relics are HOST-BUILT, never scene-built (R8): a world module declares
// only `relic: { id, name, x, z }` (id + name assigned in walk/relics.json)
// and the Walker instantiates the visual from here when the world streams
// in. One library, authored once, instead of Qwen improvising a treasure
// object per scene — no more Chalice clones in the wrong world.
//
// Discipline (same hard constraint as the legacy prop): PURE Three.js
// primitives + MeshStandardMaterial only. No textures, no sprites, no
// glow quads, no transparency tricks. The "glow" is emissive material
// plus the real PointLight every builder carries.
//
// Return contract (consumed by walk/walker.html):
//   { group, core, light, ringA, ringB }
// - group: origin at the relic's centre; the Walker positions it at
//   (relic.x, groundY + 1.05, relic.z) and bobs it. Builders keep their
//   silhouette roughly within y -0.45..+0.45 of the origin.
// - core: a Group holding ALL of the relic's meshes. The Walker's frame
//   loop rotates core (rotation.x / rotation.y) — the whole relic
//   tumbles slowly, which reads as "floating magic object" in any world.
// - light: PointLight(0xffbe4a, 7, 10, 1.8), the legacy prop's light.
//   The frame loop pulses its intensity, so it hangs off `group`,
//   never off the tumbling core.
// - ringA / ringB: the frame loop also rotates these (the legacy prop's
//   crossing rings). Builders without natural rings return inert empty
//   Groups — rotating them is a no-op, and the loop stays untouched.
//
// Unknown id -> the generic builder (the legacy gold core-and-rings).

function mats(THREE) {
  const std = (color, emissive, emissiveIntensity, metalness, roughness) =>
    new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity, metalness, roughness });
  return {
    gold:       std(0xd9a43b, 0xffae2e, 0.35, 0.85, 0.30),
    goldBright: std(0xf3d27a, 0xcc8a1e, 0.45, 0.90, 0.22),
    goldDark:   std(0x8a6420, 0x593f08, 0.20, 0.80, 0.42),
    silver:     std(0xc9d2dd, 0x5a6c80, 0.25, 0.90, 0.28),
    iron:       std(0x5b6470, 0x11151a, 0.10, 0.85, 0.45),
    ruby:       std(0xd92638, 0xff2a44, 1.10, 0.20, 0.18),
    sapphire:   std(0x2456d8, 0x2a6bff, 1.10, 0.20, 0.18),
    emerald:    std(0x1fae5c, 0x22dd77, 1.00, 0.20, 0.18),
    amethyst:   std(0x8a3ffc, 0xa55cff, 1.10, 0.20, 0.18),
    crystal:    std(0x9fe8ff, 0x3fc4ff, 1.20, 0.15, 0.12),
    ember:      std(0xff7a26, 0xff5a00, 1.25, 0.20, 0.20),
  };
}

function mesh(THREE, geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  return m;
}

function finish(THREE, core, ringA, ringB) {
  const group = new THREE.Group();
  group.add(core);
  if (ringA) group.add(ringA);
  if (ringB) group.add(ringB);
  const light = new THREE.PointLight(0xffbe4a, 7, 10, 1.8);
  group.add(light);
  return { group, core, light, ringA: ringA || null, ringB: ringB || null };
}

// For builders without natural rings: inert placeholders the Walker's
// ring animation can rotate harmlessly.
function noRings(THREE) {
  return [new THREE.Group(), new THREE.Group()];
}

const BUILDERS = {

  // Adventure — the Enchanted Chalice.
  chalice(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.20, 0.27, 0.08, 18), M.goldDark, 0, -0.38, 0));
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.05, 0.09, 0.24, 12), M.gold, 0, -0.23, 0));
    const bowl = mesh(THREE, new THREE.SphereGeometry(0.30, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.58), M.gold, 0, 0.10, 0);
    bowl.scale.y = 1.25;
    core.add(bowl);
    const rim = mesh(THREE, new THREE.TorusGeometry(0.295, 0.035, 10, 28), M.goldBright, 0, 0.115, 0);
    rim.rotation.x = Math.PI / 2;
    core.add(rim);
    for (const s of [-1, 1]) {
      const handle = mesh(THREE, new THREE.TorusGeometry(0.11, 0.028, 8, 20), M.goldDark, s * 0.31, -0.02, 0);
      handle.rotation.y = Math.PI / 2;
      core.add(handle);
    }
    core.add(mesh(THREE, new THREE.OctahedronGeometry(0.085, 0), M.ruby, 0, 0.02, 0.27));
    core.add(mesh(THREE, new THREE.SphereGeometry(0.055, 10, 8), M.goldBright, 0, 0.30, 0));
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // Pitfall II — the Golden Idol: a squat headdressed figure.
  "golden-idol"(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    core.add(mesh(THREE, new THREE.BoxGeometry(0.36, 0.09, 0.36), M.goldDark, 0, -0.40, 0));
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.13, 0.18, 0.30, 12), M.gold, 0, -0.21, 0));
    for (const s of [-1, 1]) {
      const arm = mesh(THREE, new THREE.CylinderGeometry(0.045, 0.045, 0.26, 8), M.gold, s * 0.20, -0.22, 0);
      arm.rotation.z = s * 0.5;
      core.add(arm);
    }
    const head = mesh(THREE, new THREE.SphereGeometry(0.155, 16, 12), M.goldBright, 0, 0.02, 0);
    head.scale.y = 1.12;
    core.add(head);
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.17, 0.13, 0.11, 12), M.gold, 0, 0.185, 0));
    core.add(mesh(THREE, new THREE.SphereGeometry(0.05, 10, 8), M.ruby, 0, 0.29, 0));
    for (const s of [-1, 1]) {
      core.add(mesh(THREE, new THREE.SphereGeometry(0.028, 8, 6), M.ruby, s * 0.06, 0.05, 0.135));
    }
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // H.E.R.O. — the Crystal Urn: an open urn with its crystal floating free.
  "crystal-urn"(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.22, 0.26, 0.07, 16), M.iron, 0, -0.40, 0));
    const body = mesh(THREE, new THREE.SphereGeometry(0.24, 18, 12), M.silver, 0, -0.13, 0);
    body.scale.y = 1.15;
    core.add(body);
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.115, 0.15, 0.10, 14), M.silver, 0, 0.10, 0));
    const rim = mesh(THREE, new THREE.TorusGeometry(0.115, 0.025, 8, 20), M.goldBright, 0, 0.15, 0);
    rim.rotation.x = Math.PI / 2;
    core.add(rim);
    const crystal = mesh(THREE, new THREE.OctahedronGeometry(0.14, 0), M.crystal, 0, 0.30, 0);
    crystal.scale.y = 1.35;
    core.add(crystal);
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // Yar's Revenge — the Zorlon Core: an ember orb in a tilted gyro ring.
  "zorlon-core"(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    core.add(mesh(THREE, new THREE.IcosahedronGeometry(0.20, 0), M.ember, 0, -0.02, 0));
    core.add(mesh(THREE, new THREE.SphereGeometry(0.115, 14, 10), M.goldBright, 0, -0.02, 0));
    const gyro = mesh(THREE, new THREE.TorusGeometry(0.30, 0.038, 10, 30), M.iron, 0, -0.02, 0);
    gyro.rotation.x = Math.PI / 2.6;
    core.add(gyro);
    for (const a of [0, Math.PI]) {
      core.add(mesh(THREE, new THREE.SphereGeometry(0.05, 10, 8), M.crystal,
        Math.cos(a) * 0.345, Math.sin(a) * 0.13 - 0.02, Math.sin(a) * 0.20));
    }
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.022, 0.022, 0.18, 8), M.iron, 0, 0.26, 0));
    core.add(mesh(THREE, new THREE.SphereGeometry(0.05, 10, 8), M.ruby, 0, 0.38, 0));
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // River Raid — Ace's Medal: a starred disc on a ribbon V.
  "aces-medal"(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    for (const s of [-1, 1]) {
      const ribbon = mesh(THREE, new THREE.BoxGeometry(0.10, 0.26, 0.03), M.ruby, s * 0.09, 0.30, -0.01);
      ribbon.rotation.z = s * -0.42;
      core.add(ribbon);
    }
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.07, 0.07, 0.05, 12), M.goldDark, 0, 0.155, 0));
    const disc = mesh(THREE, new THREE.CylinderGeometry(0.27, 0.27, 0.06, 26), M.gold, 0, -0.08, 0);
    disc.rotation.x = Math.PI / 2;
    core.add(disc);
    const star = mesh(THREE, new THREE.OctahedronGeometry(0.155, 0), M.goldBright, 0, -0.08, 0.045);
    star.scale.z = 0.32;
    core.add(star);
    core.add(mesh(THREE, new THREE.SphereGeometry(0.045, 10, 8), M.sapphire, 0, -0.08, 0.075));
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // Mountain King — the Crown: band, points, and a ruby front.
  crown(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.33, 0.35, 0.20, 18, 1, true), M.gold, 0, -0.02, 0));
    const rimT = mesh(THREE, new THREE.TorusGeometry(0.33, 0.032, 8, 26), M.goldBright, 0, 0.08, 0);
    rimT.rotation.x = Math.PI / 2;
    core.add(rimT);
    const rimB = mesh(THREE, new THREE.TorusGeometry(0.345, 0.032, 8, 26), M.goldDark, 0, -0.12, 0);
    rimB.rotation.x = Math.PI / 2;
    core.add(rimB);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const x = Math.cos(a) * 0.33, z = Math.sin(a) * 0.33;
      core.add(mesh(THREE, new THREE.ConeGeometry(0.07, 0.22, 8), M.gold, x, 0.19, z));
      core.add(mesh(THREE, new THREE.SphereGeometry(0.034, 8, 6), M.goldBright, x, 0.325, z));
    }
    core.add(mesh(THREE, new THREE.OctahedronGeometry(0.09, 0), M.ruby, 0, -0.02, 0.345));
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // Super Mario Bros. 3 — the Magic Wand, held on the diagonal.
  wand(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    const tilt = 0.5;
    const shaft = mesh(THREE, new THREE.CylinderGeometry(0.028, 0.034, 0.78, 10), M.goldDark, 0, -0.05, 0);
    shaft.rotation.z = tilt;
    core.add(shaft);
    const tipX = -Math.sin(tilt) * 0.39, tipY = Math.cos(tilt) * 0.39 - 0.05;
    const collar = mesh(THREE, new THREE.CylinderGeometry(0.05, 0.05, 0.07, 10), M.goldBright, tipX * 0.88, tipY * 0.88 + 0.01, 0);
    collar.rotation.z = tilt;
    core.add(collar);
    const star = mesh(THREE, new THREE.OctahedronGeometry(0.13, 0), M.amethyst, tipX, tipY + 0.04, 0);
    star.scale.y = 1.25;
    core.add(star);
    core.add(mesh(THREE, new THREE.SphereGeometry(0.052, 10, 8), M.goldBright,
      Math.sin(tilt) * 0.40, -Math.cos(tilt) * 0.40 - 0.03, 0));
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // Blaster Master — the Hover Chip: a circuit die on a glowing ring.
  "hover-chip"(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    core.add(mesh(THREE, new THREE.BoxGeometry(0.50, 0.07, 0.50), M.iron, 0, 0, 0));
    core.add(mesh(THREE, new THREE.BoxGeometry(0.23, 0.055, 0.23), M.crystal, 0, 0.062, 0));
    for (let i = 0; i < 4; i++) {
      const off = -0.165 + i * 0.11;
      core.add(mesh(THREE, new THREE.BoxGeometry(0.05, 0.03, 0.10), M.goldBright, off, -0.01, 0.285));
      core.add(mesh(THREE, new THREE.BoxGeometry(0.05, 0.03, 0.10), M.goldBright, off, -0.01, -0.285));
      core.add(mesh(THREE, new THREE.BoxGeometry(0.10, 0.03, 0.05), M.goldBright, 0.285, -0.01, off));
      core.add(mesh(THREE, new THREE.BoxGeometry(0.10, 0.03, 0.05), M.goldBright, -0.285, -0.01, off));
    }
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      core.add(mesh(THREE, new THREE.SphereGeometry(0.028, 8, 6), M.emerald, sx * 0.20, 0.05, sz * 0.20));
    }
    const glow = mesh(THREE, new THREE.TorusGeometry(0.32, 0.024, 8, 28), M.crystal, 0, -0.13, 0);
    glow.rotation.x = Math.PI / 2;
    core.add(glow);
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // Bionic Commando — the Bionic Arm, claw open.
  "grapple-arm"(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    core.add(mesh(THREE, new THREE.SphereGeometry(0.10, 12, 10), M.iron, -0.20, 0.16, 0));
    const upper = mesh(THREE, new THREE.CylinderGeometry(0.075, 0.075, 0.30, 10), M.silver, -0.08, 0.02, 0);
    upper.rotation.z = 0.7;
    core.add(upper);
    core.add(mesh(THREE, new THREE.SphereGeometry(0.085, 12, 10), M.goldDark, 0.03, -0.12, 0));
    const fore = mesh(THREE, new THREE.CylinderGeometry(0.06, 0.06, 0.28, 10), M.silver, 0.17, -0.12, 0);
    fore.rotation.z = Math.PI / 2;
    core.add(fore);
    core.add(mesh(THREE, new THREE.SphereGeometry(0.06, 10, 8), M.iron, 0.31, -0.12, 0));
    for (const s of [-1, 0, 1]) {
      const claw = mesh(THREE, new THREE.ConeGeometry(0.032, 0.14, 8), M.goldBright, 0.40, -0.12 + s * 0.055, s * 0.05);
      claw.rotation.z = -Math.PI / 2 - s * 0.35;
      core.add(claw);
    }
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // A stacked pair of gold bars.
  "gold-bar"(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    const lower = new THREE.Group();
    lower.rotation.y = 0.4;
    lower.add(mesh(THREE, new THREE.BoxGeometry(0.52, 0.12, 0.26), M.gold, 0, -0.16, 0));
    lower.add(mesh(THREE, new THREE.BoxGeometry(0.40, 0.10, 0.18), M.gold, 0, -0.05, 0));
    core.add(lower);
    core.add(mesh(THREE, new THREE.BoxGeometry(0.52, 0.12, 0.26), M.goldBright, 0, 0.08, 0));
    core.add(mesh(THREE, new THREE.BoxGeometry(0.40, 0.10, 0.18), M.goldBright, 0, 0.19, 0));
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.05, 0.05, 0.02, 12), M.goldDark, 0, 0.25, 0));
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // A jeweled ring, gem up.
  ring(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    core.add(mesh(THREE, new THREE.TorusGeometry(0.25, 0.068, 12, 30), M.gold, 0, -0.03, 0));
    core.add(mesh(THREE, new THREE.SphereGeometry(0.045, 8, 6), M.goldBright, -0.105, 0.20, 0));
    core.add(mesh(THREE, new THREE.SphereGeometry(0.045, 8, 6), M.goldBright, 0.105, 0.20, 0));
    const gem = mesh(THREE, new THREE.OctahedronGeometry(0.11, 0), M.sapphire, 0, 0.30, 0);
    gem.scale.y = 1.3;
    core.add(gem);
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // A great faceted gem on a gold collar.
  gem(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    const big = mesh(THREE, new THREE.OctahedronGeometry(0.32, 0), M.emerald, 0, 0.02, 0);
    big.scale.y = 1.25;
    core.add(big);
    const inner = mesh(THREE, new THREE.OctahedronGeometry(0.17, 0), M.goldBright, 0, 0.02, 0);
    inner.scale.y = 1.25;
    core.add(inner);
    const collar = mesh(THREE, new THREE.TorusGeometry(0.17, 0.032, 8, 22), M.gold, 0, -0.30, 0);
    collar.rotation.x = Math.PI / 2;
    core.add(collar);
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // A brass key, bow to the left, teeth down.
  key(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    const shaft = mesh(THREE, new THREE.CylinderGeometry(0.042, 0.042, 0.48, 10), M.gold, 0.03, 0, 0);
    shaft.rotation.z = Math.PI / 2;
    core.add(shaft);
    core.add(mesh(THREE, new THREE.TorusGeometry(0.125, 0.040, 10, 22), M.goldBright, -0.335, 0, 0));
    const collar = mesh(THREE, new THREE.TorusGeometry(0.068, 0.026, 8, 18), M.goldDark, -0.19, 0, 0);
    collar.rotation.y = Math.PI / 2;
    core.add(collar);
    core.add(mesh(THREE, new THREE.BoxGeometry(0.05, 0.13, 0.045), M.gold, 0.20, -0.075, 0));
    core.add(mesh(THREE, new THREE.BoxGeometry(0.05, 0.10, 0.045), M.gold, 0.285, -0.06, 0));
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // A speckled egg in a gold nest.
  egg(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    const shell = mesh(THREE, new THREE.SphereGeometry(0.235, 18, 14),
      new THREE.MeshStandardMaterial({ color: 0xf5e9d0, emissive: 0x8a6f3a, emissiveIntensity: 0.25, metalness: 0.1, roughness: 0.5 }), 0, 0.03, 0);
    shell.scale.y = 1.3;
    core.add(shell);
    const spots = [[0.14, 0.16, 0.14], [-0.16, 0.05, 0.12], [0.05, -0.08, 0.20], [-0.08, 0.22, -0.14], [0.17, -0.02, -0.13], [-0.15, -0.14, -0.12]];
    for (const [x, y, z] of spots) {
      core.add(mesh(THREE, new THREE.SphereGeometry(0.026, 8, 6), M.gold, x, y, z));
    }
    const nest = mesh(THREE, new THREE.TorusGeometry(0.25, 0.055, 8, 22), M.goldDark, 0, -0.26, 0);
    nest.rotation.x = Math.PI / 2;
    core.add(nest);
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // A short sword, point up.
  sword(THREE) {
    const M = mats(THREE);
    const core = new THREE.Group();
    const blade = mesh(THREE, new THREE.ConeGeometry(0.058, 0.56, 4), M.silver, 0, 0.13, 0);
    blade.scale.z = 0.35;
    blade.rotation.y = Math.PI / 4;
    core.add(blade);
    core.add(mesh(THREE, new THREE.BoxGeometry(0.27, 0.045, 0.065), M.gold, 0, -0.17, 0));
    core.add(mesh(THREE, new THREE.CylinderGeometry(0.036, 0.036, 0.16, 10), M.goldDark, 0, -0.27, 0));
    core.add(mesh(THREE, new THREE.SphereGeometry(0.056, 10, 8), M.goldBright, 0, -0.385, 0));
    core.add(mesh(THREE, new THREE.OctahedronGeometry(0.045, 0), M.ruby, 0, -0.17, 0.05));
    const [ringA, ringB] = noRings(THREE);
    return finish(THREE, core, ringA, ringB);
  },

  // The legacy prop: a golden core inside two crossing rings.
  generic(THREE) {
    const M = mats(THREE);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xd9a43b, emissive: 0xffae2e, emissiveIntensity: 0.9,
      metalness: 0.65, roughness: 0.3
    });
    const core = new THREE.Group();
    core.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 0), coreMat));
    const ringMat = M.goldBright;
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.045, 10, 44), ringMat);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.045, 10, 44), ringMat);
    ringB.rotation.x = Math.PI / 2;
    return finish(THREE, core, ringA, ringB);
  },
};

export function buildRelic(THREE, id) {
  const build = BUILDERS[id] || BUILDERS.generic;
  return build(THREE);
}
