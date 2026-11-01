// ============================================================================
// @world {"id":"004","title":"YARS' REVENGE","sub":"Neutral Zone & Shield","system":"Atari 2600"}
// World 004 — YARS' REVENGE · Neutral Zone & Shield (Atari 2600)
// Converted from scenes/004_yars_revenge_neutral_zone_shield.html into a World
// Walker module. Geometry/materials/lights preserved; renderer/orbit camera/
// HUD removed; per-frame animation moved into update(t, dt).
//
// Conversion notes:
//  * LAYOUT DEVIATION (deliberate): in the original scene, the mesh()/box()/
//    cylinder() helpers ALWAYS add to the world group, ignoring the subgroup
//    (entrance / barrier / tower / pylon / drone / beacon) transforms — so
//    in the hosted diorama every subgroup part actually piles up at the
//    world origin, and the animated drone/pylon groups are empty. This
//    module honors the subgroup transforms, i.e. it builds the world as it
//    was designed (arch at z=-18, barriers spread along the road, towers
//    and pylons flanking the corridor, drones flying). Same geometry, same
//    materials, same counts — placed where the author put them.
//  * The energy-pylon cores share the world's cyan material, so the original
//    also pulsed every cyan part when animating core emissive intensity.
//    Preserved as authored.
//  * The original's star-twinkle loop iterated stars.children (a Points has
//    no children) and never did anything; omitted.
//  * Stars were added to the scene in the original; folded into the group.
//
// Door choices (the corridor runs along Z):
//   next — in front of the entrance arch at z=-18; door at (0, -14.8),
//          facing the shield-barrier run.
//   prev — at the far south end of the corridor, past the last shield
//          barrier (z=23); door at (0, 31).
// Relic: the Zorlon Core hums at the far north end of the field at
//        (-10.5, -40), off the road among the antennas — past the entrance
//        arch and the whole shield-barrier run.
// Spawn: on the road at the south end, facing the entrance arch.
// ============================================================================

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();
  const world = group;

  const materials = {
    terrain: new THREE.MeshStandardMaterial({
      color: 0x192238,
      roughness: 0.96,
      metalness: 0.05
    }),
    road: new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.88,
      metalness: 0.12
    }),
    wall: new THREE.MeshStandardMaterial({
      color: 0x71809b,
      roughness: 0.78,
      metalness: 0.28
    }),
    wallDark: new THREE.MeshStandardMaterial({
      color: 0x33455f,
      roughness: 0.82,
      metalness: 0.3
    }),
    gold: new THREE.MeshStandardMaterial({
      color: 0xd8aa58,
      roughness: 0.42,
      metalness: 0.72
    }),
    cyan: new THREE.MeshStandardMaterial({
      color: 0x72dfff,
      emissive: 0x1b8ea6,
      emissiveIntensity: 1.4,
      roughness: 0.35,
      metalness: 0.35
    }),
    blue: new THREE.MeshStandardMaterial({
      color: 0x558cff,
      emissive: 0x14366b,
      emissiveIntensity: 1.1,
      roughness: 0.45,
      metalness: 0.4
    }),
    white: new THREE.MeshStandardMaterial({
      color: 0xe5f0ff,
      emissive: 0x8eb8ff,
      emissiveIntensity: 0.65,
      roughness: 0.5
    }),
    red: new THREE.MeshStandardMaterial({
      color: 0xff5c65,
      emissive: 0x8a1520,
      emissiveIntensity: 0.8,
      roughness: 0.55
    })
  };

  function mesh(geometry, material, position, rotation = null, castShadow = true) {
    const object = new THREE.Mesh(geometry, material);
    if (position) object.position.set(...position);
    if (rotation) object.rotation.set(...rotation);
    object.castShadow = castShadow;
    object.receiveShadow = true;
    world.add(object);
    return object;
  }

  function box(w, h, d, material, x, y, z, rotation = null) {
    return mesh(
      new THREE.BoxGeometry(w, h, d),
      material,
      [x, y, z],
      rotation
    );
  }

  function cylinder(rt, rb, h, material, x, y, z, segments = 16, rotation = null) {
    return mesh(
      new THREE.CylinderGeometry(rt, rb, h, segments),
      material,
      [x, y, z],
      rotation
    );
  }

  // Lighting: cool moonlight, warm rim light, and subtle atmospheric glow.
  group.add(new THREE.HemisphereLight(0x9cc8ff, 0x14100d, 1.25));

  const keyLight = new THREE.DirectionalLight(0xb9dcff, 2.4);
  keyLight.position.set(-24, 34, 18);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -42;
  keyLight.shadow.camera.right = 42;
  keyLight.shadow.camera.top = 42;
  keyLight.shadow.camera.bottom = -42;
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 100;
  keyLight.shadow.bias = -0.0004;
  group.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x4d8cff, 1.5);
  rimLight.position.set(22, 15, -28);
  group.add(rimLight);

  const warmLight = new THREE.PointLight(0xff9b55, 28, 42, 2);
  warmLight.position.set(-15, 7, -8);
  group.add(warmLight);

  // Procedural terrain with a grid of low-poly islands, roads, and barriers.
  const terrain = mesh(
    new THREE.PlaneGeometry(110, 110, 30, 30),
    materials.terrain,
    [0, -0.35, 0],
    [-Math.PI / 2, 0, 0],
    false
  );
  terrain.receiveShadow = true;

  const road = box(112, 0.08, 7.5, materials.road, 0, -0.16, 0);
  road.receiveShadow = true;

  // Road lane markers.
  const laneMaterial = new THREE.MeshBasicMaterial({
    color: 0x9db5cf,
    transparent: true,
    opacity: 0.38
  });

  for (let z = -46; z <= 46; z += 7) {
    box(0.12, 0.025, 3.2, laneMaterial, 0, -0.105, z, [0, 0, 0]);
  }

  // Entrance arch and neutral zone. (See header: parts are parented to the
  // arch subgroup here so the arch stands at z=-18 as designed.)
  const archParts = new THREE.Group();
  archParts.position.set(0, 0, -18);
  world.add(archParts);

  function archBox(w, h, d, material, x, y, z, rotation = null) {
    const object = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    object.position.set(x, y, z);
    if (rotation) object.rotation.set(...rotation);
    object.castShadow = true;
    object.receiveShadow = true;
    archParts.add(object);
    return object;
  }

  archBox(11, 6.5, 0.8, materials.wallDark, 0, 3.25, 0, [0, 0, 0]);
  archBox(11.8, 0.7, 1.1, materials.gold, 0, 6.55, 0);
  archBox(1.1, 0.7, 1.1, materials.gold, -5.9, 6.55, 0);
  archBox(1.1, 0.7, 1.1, materials.gold, 5.9, 6.55, 0);

  for (const x of [-4.55, 4.55]) {
    archBox(0.35, 5.8, 0.35, materials.wall, x, 2.9, 0.5);
    archBox(0.7, 0.35, 0.7, materials.gold, x, 1.1, 0.5);
  }

  const entranceSign = archBox(5.2, 0.75, 0.18, materials.gold, 0, 5.45, 0.65);
  entranceSign.rotation.x = -0.08;

  // Shield barriers along the road. (Original parented these to a per-barrier
  // group via the world helpers; positions below are the world-space result.)
  for (let z = -10; z <= 28; z += 11) {
    box(8.5, 1.15, 0.75, materials.wallDark, 0, 0.58, z);
    box(8.8, 0.22, 0.95, materials.gold, 0, 1.18, z);

    for (const x of [-4.25, 4.25]) {
      box(0.55, 1.35, 0.6, materials.wall, x, 0.68, z);
      box(0.85, 0.25, 0.8, materials.gold, x, 0.2, z);
    }

    box(0.8, 0.55, 0.16, materials.cyan, -2.8, 1.55, z + 0.45);
    box(0.8, 0.55, 0.16, materials.cyan, 2.8, 1.55, z + 0.45);
  }

  // Side barriers and colored signal towers.
  for (let z = -35; z <= 36; z += 8) {
    const side = Math.sin(z * 0.17) > 0 ? -1 : 1;
    box(0.7, 2.2, 4.2, materials.wallDark, side * 7.2, 1.1, z, [0, 0, 0]);
    box(0.95, 0.3, 4.5, materials.gold, side * 7.2, 2.3, z);
  }

  const signalTowers = [];

  for (let i = 0; i < 6; i++) {
    const z = -30 + i * 11;
    const side = i % 2 === 0 ? -1 : 1;
    const tx = side * 8.7;

    cylinder(0.35, 0.55, 3.5, materials.wallDark, tx, 1.75, z, 8);
    cylinder(0.65, 0.65, 0.25, materials.gold, tx, 3.6, z, 8);
    cylinder(0.78, 0.78, 0.18, materials.wall, tx, 4.05, z, 8);

    const lamp = cylinder(
      0.34,
      0.34,
      0.32,
      i % 2 === 0 ? materials.red : materials.cyan,
      tx,
      4.4,
      z,
      12
    );

    signalTowers.push(lamp);
  }

  // Rooftop details and antennas.
  for (let i = 0; i < 18; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const z = -44 + Math.floor(i / 2) * 9;
    const x = side * 8.8;

    box(0.12, 5.5, 0.12, materials.wallDark, x, 2.75, z);
    box(0.18, 0.18, 1.1, materials.gold, x, 5.45, z);
    box(0.18, 0.18, 0.18, materials.cyan, x, 5.95, z);
  }

  // Animated energy pylons.
  const energyPylons = [];

  for (let i = 0; i < 4; i++) {
    const z = -22 + i * 14;
    const side = i % 2 === 0 ? -1 : 1;
    const px = side * 10.5;

    cylinder(0.18, 0.3, 4.2, materials.wallDark, px, 2.1, z, 8);
    cylinder(0.55, 0.55, 0.25, materials.gold, px, 4.25, z, 8);

    const ring = mesh(
      new THREE.TorusGeometry(0.85, 0.08, 8, 24),
      materials.cyan,
      [px, 4.75, z],
      [0, 0, 0],
      false
    );

    const core = mesh(
      new THREE.SphereGeometry(0.28, 12, 12),
      materials.cyan,
      [px, 4.75, z],
      [0, 0, 0],
      false
    );

    energyPylons.push({ ring, core, z, side, phase: i * 1.7 });
  }

  // Animated sky particles / stars.
  const starCount = 550;
  const starPositions = new Float32Array(starCount * 3);
  const starSpeeds = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 110;
    starPositions[i * 3 + 1] = 8 + Math.random() * 55;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 110;
    starSpeeds[i] = 0.15 + Math.random() * 0.45;
  }

  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(starPositions, 3)
  );

  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0x9dc9ff,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
      fog: false
    })
  );
  world.add(stars);

  // Floating motes.
  const moteCount = 120;
  const motePositions = new Float32Array(moteCount * 3);
  const moteSpeeds = new Float32Array(moteCount);

  for (let i = 0; i < moteCount; i++) {
    motePositions[i * 3] = (Math.random() - 0.5) * 70;
    motePositions[i * 3 + 1] = 1 + Math.random() * 18;
    motePositions[i * 3 + 2] = (Math.random() - 0.5) * 70;
    moteSpeeds[i] = 0.15 + Math.random() * 0.4;
  }

  const moteGeometry = new THREE.BufferGeometry();
  moteGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(motePositions, 3)
  );

  const motes = new THREE.Points(
    moteGeometry,
    new THREE.PointsMaterial({
      color: 0x9edcff,
      size: 0.09,
      transparent: true,
      opacity: 0.45,
      depthWrite: false
    })
  );
  world.add(motes);

  // Animated distant flying vehicles / drones.
  const drones = [];

  for (let i = 0; i < 7; i++) {
    const drone = new THREE.Group();
    const x = (i % 2 === 0 ? -1 : 1) * (18 + (i % 3) * 7);
    const z = -35 + i * 11;
    drone.position.set(x, 7 + (i % 3) * 3, z);
    world.add(drone);

    const bodyGeo = new THREE.ConeGeometry(0.55, 1.5, 4);
    const body = new THREE.Mesh(bodyGeo, materials.blue);
    body.rotation.set(Math.PI / 2, 0, 0);
    body.rotation.z = Math.PI;
    body.castShadow = true;
    body.receiveShadow = true;
    drone.add(body);

    const wing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.45), materials.gold);
    wing.position.set(0, 0.15, 0);
    wing.rotation.y = Math.PI / 2;
    wing.castShadow = true;
    wing.receiveShadow = true;
    drone.add(wing);

    const light = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 8, 8),
      materials.cyan
    );
    light.position.set(0, -0.45, 0);
    drone.add(light);

    drones.push({
      group: drone,
      baseX: x,
      baseZ: z,
      phase: i * 1.3,
      light
    });
  }

  // Animated rotating warning beacon.
  const beacon = new THREE.Group();
  beacon.position.set(0, 0, -39);
  world.add(beacon);

  cylinder(0.7, 0.9, 1.2, materials.wallDark, 0, 0.6, -39, 12);
  cylinder(1.05, 1.05, 0.25, materials.gold, 0, 1.3, -39, 12);
  cylinder(0.5, 0.5, 0.25, materials.red, 0, 1.58, -39, 12);

  const beaconRing = mesh(
    new THREE.TorusGeometry(0.65, 0.055, 8, 24),
    materials.red,
    [0, 1.75, -39],
    [0, 0, 0],
    false
  );

  // Small environmental details.
  for (let i = 0; i < 28; i++) {
    const side = i % 2 === 0 ? -1 : 1;
    const z = -48 + Math.floor(i / 2) * 9;
    const x = side * (5.5 + Math.random() * 2.5);

    const rock = mesh(
      new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.55, 0),
      materials.wallDark,
      [x, 0.1, z],
      [Math.random(), Math.random(), Math.random()],
      false
    );
    rock.scale.y = 0.65;
  }

  // -------------------------------------------------------------------------
  // Animation — original per-frame expressions, moved here. (The pylon group
  // transforms in the original were applied to world-space ring/core meshes;
  // positions preserved, transforms identical.)
  // -------------------------------------------------------------------------

  function update(t, dt) {
    const elapsed = t;

    // Gentle environmental motion.
    motes.rotation.y = elapsed * 0.012;
    motes.position.y = Math.sin(elapsed * 0.22) * 0.25;

    for (const pylon of energyPylons) {
      pylon.ring.rotation.z = elapsed * 1.2 + pylon.phase;
      pylon.ring.scale.setScalar(1 + Math.sin(elapsed * 2.4 + pylon.phase) * 0.12);

      pylon.core.material.emissiveIntensity =
        1.1 + Math.sin(elapsed * 3.2 + pylon.phase) * 0.45;
    }

    for (const drone of drones) {
      if (!drone || !drone.group) continue;
      drone.group.position.x =
        drone.baseX + Math.sin(elapsed * 0.35 + drone.phase) * 4.5;
      drone.group.position.z =
        drone.baseZ + Math.cos(elapsed * 0.28 + drone.phase) * 2.5;
      drone.group.position.y =
        7 + (drone.baseX > 0 ? 3 : 0) + Math.sin(elapsed * 0.55 + drone.phase) * 1.2;
      drone.group.rotation.y = Math.sin(elapsed * 0.4 + drone.phase) * 0.7;
      drone.group.rotation.z = Math.sin(elapsed * 0.7 + drone.phase) * 0.08;
    }

    beaconRing.rotation.z = elapsed * 1.7;
    beaconRing.scale.setScalar(1 + Math.sin(elapsed * 3) * 0.08);
    beaconRing.material.emissiveIntensity =
      1.1 + Math.sin(elapsed * 3.2) * 0.45;
  }

  return {
    group,
    update,
    spawn: { x: 0, z: 24, yaw: 0 },
    env: { background: 0x070b18, fogColor: 0x081027, fogDensity: 0.022 },
    doors: {
      next: { x: 0, z: -14.8 },
      prev: { x: 0, z: 31 }
    },
    relic: { name: "Zorlon Core", x: -10.5, z: -40 }
  };
}
