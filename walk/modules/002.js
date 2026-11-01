// ============================================================================
// @world {"id":"002","title":"PITFALL!","sub":"Jungle & Underworld","system":"Atari 2600"}
// World 002 — PITFALL! · Jungle & Underworld (Atari 2600)
// Converted from scenes/002_pitfall_jungle_underworld.html into a World Walker
// module. Geometry/materials/lights preserved; renderer/orbit camera/HUD and
// the DOM score readout removed (the score never changed in the original —
// it was decorative). Per-frame animation moved into update(t, dt).
//
// Conversion note: the original tried to pulse the cave-lamp glows by reading
// world.children[16..18] and testing isPointLight — those children are groups,
// so the pulse never ran. This module collects the lamp glow PointLights
// directly and pulses them as the original intended.
//
// Door choices (the world's two caves are its natural portals):
//   next — in front of the eastern cave mouth at (8.8, 8.5); door (8.8, 5.0).
//   prev — in front of the western cave mouth at (-6.7, 7.2); door (-6.7, 3.8).
// Spawn: south clearing, looking north across the jungle floor.
// ============================================================================

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  // -------------------------------------------------------------------------
  // Materials
  // -------------------------------------------------------------------------

  const materials = {
    bark: new THREE.MeshStandardMaterial({
      color: 0x493020,
      roughness: 0.95,
      metalness: 0
    }),
    darkBark: new THREE.MeshStandardMaterial({
      color: 0x241711,
      roughness: 1
    }),
    leaf: new THREE.MeshStandardMaterial({
      color: 0x3a6b2d,
      roughness: 0.88,
      side: THREE.DoubleSide
    }),
    leafLight: new THREE.MeshStandardMaterial({
      color: 0x6b8f37,
      roughness: 0.82,
      side: THREE.DoubleSide
    }),
    vine: new THREE.MeshStandardMaterial({
      color: 0x263d24,
      roughness: 0.95
    }),
    rock: new THREE.MeshStandardMaterial({
      color: 0x55504a,
      roughness: 1
    }),
    ash: new THREE.MeshStandardMaterial({
      color: 0x332b27,
      roughness: 1
    }),
    gold: new THREE.MeshStandardMaterial({
      color: 0xd6a84c,
      roughness: 0.58,
      metalness: 0.25
    }),
    red: new THREE.MeshStandardMaterial({
      color: 0xa6241c,
      roughness: 0.65
    }),
    black: new THREE.MeshStandardMaterial({
      color: 0x100e0d,
      roughness: 0.95
    })
  };

  // -------------------------------------------------------------------------
  // Lighting
  // -------------------------------------------------------------------------

  group.add(new THREE.HemisphereLight(0xb9d29b, 0x382117, 1.45));

  const sun = new THREE.DirectionalLight(0xffd48a, 3.1);
  sun.position.set(-18, 25, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -28;
  sun.shadow.camera.right = 28;
  sun.shadow.camera.top = 28;
  sun.shadow.camera.bottom = -28;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 70;
  sun.shadow.bias = -0.0004;
  group.add(sun);

  const warmFill = new THREE.PointLight(0xff8a3d, 28, 45, 2);
  warmFill.position.set(6, 8, -4);
  group.add(warmFill);

  const coolFill = new THREE.PointLight(0x73b9d8, 18, 40, 2);
  coolFill.position.set(-12, 5, 14);
  group.add(coolFill);

  // -------------------------------------------------------------------------
  // World helpers
  // -------------------------------------------------------------------------

  const world = group;

  function addBox(parent, size, position, material, castShadow = true, receiveShadow = true) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
    mesh.position.set(...position);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = receiveShadow;
    parent.add(mesh);
    return mesh;
  }

  function addCylinder(
    parent,
    radiusTop,
    radiusBottom,
    height,
    position,
    material,
    segments = 12,
    castShadow = true
  ) {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
      material
    );
    mesh.position.set(...position);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addSphere(parent, radius, position, material, segments = 12) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, segments, Math.max(6, segments / 2)),
      material
    );
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function makeTree(x, z, scale = 1, underground = false) {
    const tree = new THREE.Group();
    tree.position.set(x, underground ? -1.8 : 0, z);
    tree.scale.setScalar(scale);
    world.add(tree);

    addCylinder(
      tree,
      0.22,
      0.48,
      5.2,
      [0, 2.6, 0],
      underground ? materials.darkBark : materials.bark,
      9
    );

    const crown = addSphere(tree, 2.05, [0, 5.2, 0], materials.leaf, 14);
    crown.scale.set(1, 1.12, 0.92);

    addSphere(tree, 1.25, [-1.1, 4.45, 0.2], materials.leafLight, 10);
    addSphere(tree, 1.1, [1.15, 4.65, -0.2], materials.leaf, 10);

    for (let i = 0; i < 4; i++) {
      const branch = addCylinder(
        tree,
        0.07,
        0.13,
        1.8,
        [
          Math.cos((i / 4) * Math.PI * 2) * 0.8,
          3.7 + (i % 2) * 0.35,
          Math.sin((i / 4) * Math.PI * 2) * 0.8
        ],
        materials.bark,
        7
      );
      branch.rotation.z = Math.cos((i / 4) * Math.PI * 2) * 0.5;
      branch.rotation.x = Math.sin((i / 4) * Math.PI * 2) * 0.4;
    }

    return tree;
  }

  function makeBush(x, y, z, scale = 1) {
    const bush = new THREE.Group();
    bush.position.set(x, y, z);
    bush.scale.setScalar(scale);
    world.add(bush);

    addSphere(bush, 0.75, [0, 0, 0], materials.leaf, 10);
    addSphere(bush, 0.55, [0.45, 0.3, 0.08], materials.leafLight, 9);
    addSphere(bush, 0.48, [-0.4, 0.25, 0.1], materials.leaf, 9);
    return bush;
  }

  function makeRock(x, y, z, scale = 1, underground = false) {
    const rock = addSphere(world, 0.55 * scale, [x, y, z], materials.rock, 9);
    rock.scale.set(1.4, 0.7, 1);
    rock.rotation.set(0.2, x * 0.4, 0.1);

    if (underground) {
      const cranny = addCylinder(
        world,
        0.15,
        0.3,
        0.9,
        [x + 0.3, y - 0.1, z],
        materials.ash,
        8
      );
      cranny.rotation.z = 0.25;
    }

    return rock;
  }

  function makeVine(parent, x, y, z, length = 2.2) {
    const vine = new THREE.Group();
    vine.position.set(x, y, z);
    parent.add(vine);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.08, length * 0.35, 0.04),
      new THREE.Vector3(-0.08, length * 0.7, -0.04),
      new THREE.Vector3(0.04, length, 0.02)
    ]);

    const mesh = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 12, 0.045, 6, false),
      materials.vine
    );
    mesh.castShadow = true;
    vine.add(mesh);

    for (let i = 0; i < 5; i++) {
      const leaf = addSphere(
        vine,
        0.16,
        [
          curve.getPoint((i + 1) / 6).x,
          curve.getPoint((i + 1) / 6).y,
          curve.getPoint((i + 1) / 6).z
        ],
        i % 2 ? materials.leaf : materials.leafLight,
        6
      );
      leaf.scale.set(0.45, 1.2, 0.25);
      leaf.rotation.z = Math.PI / 2;
    }

    return vine;
  }

  function makeLog(x, y, z, rotation = 0) {
    const log = new THREE.Group();
    log.position.set(x, y, z);
    log.rotation.y = rotation;
    world.add(log);

    addCylinder(log, 0.35, 0.42, 3.5, [0, 0, 0], materials.bark, 10);

    for (let i = 0; i < 3; i++) {
      const crack = addCylinder(
        log,
        0.025,
        0.05,
        0.8,
        [0.18, 0.18, 0.5 + i * 0.25],
        materials.ash,
        5
      );
      crack.rotation.z = Math.PI / 2;
    }

    return log;
  }

  function makeCave(x, z, width = 4, depth = 5) {
    const cave = new THREE.Group();
    cave.position.set(x, 0, z);
    world.add(cave);

    addBox(cave, [width, 0.5, depth], [0, 0.12, 0], materials.ash);

    for (let i = 0; i < 2; i++) {
      const side = addBox(
        cave,
        [0.35, 3.5, depth],
        [-width / 2 + 0.25, 1.8, 0],
        materials.darkBark
      );
      side.rotation.y = i === 0 ? -0.12 : 0.12;
    }

    const ceiling = addBox(
      cave,
      [width * 1.05, 0.35, depth],
      [0, 3.55, 0],
      materials.darkBark
    );
    ceiling.rotation.z = 0.03;

    for (let i = 0; i < 3; i++) {
      const stalactite = addCylinder(
        cave,
        0.06,
        0.22,
        1.2 + i * 0.2,
        [-width / 2 + 0.6 + i * 0.9, 3.1, -depth * 0.25],
        materials.ash,
        7
      );
      stalactite.rotation.z = (i - 1) * 0.12;
    }

    const stalagmite = addCylinder(
      cave,
      0.2,
      0.45,
      1.1,
      [width / 2 - 0.6, 0.45, depth * 0.2],
      materials.ash,
      8
    );
    stalagmite.rotation.z = 0.15;

    return cave;
  }

  const lampGlows = [];

  function makeLamp(x, y, z) {
    const lamp = new THREE.Group();
    lamp.position.set(x, y, z);
    world.add(lamp);

    addCylinder(lamp, 0.05, 0.07, 1.6, [0, 0.8, 0], materials.ash, 7);
    addCylinder(lamp, 0.34, 0.28, 0.32, [0, 1.65, 0], materials.gold, 8);
    addSphere(lamp, 0.18, [0, 1.86, 0], materials.red, 8);

    const glow = new THREE.PointLight(0xff9c35, 8, 7, 2);
    glow.position.set(0, 1.8, 0);
    glow.userData.phase = Math.random() * Math.PI * 2;
    lamp.add(glow);
    lampGlows.push(glow);

    return lamp;
  }

  // -------------------------------------------------------------------------
  // Terrain
  // -------------------------------------------------------------------------

  const terrain = new THREE.Group();
  world.add(terrain);

  for (let z = -18; z < 16; z += 1.35) {
    const y = Math.sin(z * 0.65) * 0.22 + Math.cos(z * 1.1) * 0.12;
    addBox(
      terrain,
      [34, 0.45, 1.3],
      [0, y, z],
      z % 2.5 < 1 ? materials.ash : materials.darkBark
    );
  }

  for (let x = -16; x <= 16; x += 2.7) {
    const y = Math.sin(x * 0.55 + 1) * 0.18 + Math.cos(x * 1.15) * 0.08;
    addBox(
      terrain,
      [1.4, 0.35, 34],
      [x, y, 0],
      Math.abs(x) % 3 > 1 ? materials.ash : materials.darkBark
    );
  }

  // -------------------------------------------------------------------------
  // Pitfall!
  // -------------------------------------------------------------------------

  const pitfall = new THREE.Group();
  pitfall.position.set(5.7, 0.2, -7.5);
  world.add(pitfall);

  addBox(pitfall, [2.8, 0.35, 2.8], [0, 0, 0], materials.ash);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const x = Math.cos(angle) * 1.25;
    const z = Math.sin(angle) * 1.25;

    const spike = addCylinder(
      pitfall,
      0.075,
      0.12,
      0.7,
      [x, 0.38, z],
      materials.gold,
      6
    );
    spike.rotation.z = Math.cos(angle) * 0.2;
    spike.rotation.x = Math.sin(angle) * 0.2;
  }

  const pitHole = addCylinder(
    pitfall,
    1.15,
    1.15,
    0.12,
    [0, -0.2, 0],
    materials.black,
    16
  );
  pitHole.rotation.x = Math.PI / 2;

  // -------------------------------------------------------------------------
  // Environmental placements
  // -------------------------------------------------------------------------

  makeTree(-7, -10, 1.05, false);
  makeTree(-11, -3, 0.85, false);
  makeTree(10, -12, 1.2, false);
  makeTree(14, 3, 0.95, false);
  makeTree(-13, 7, 0.8, false);
  makeTree(12, 11, 1.05, false);

  makeTree(3.8, -15, 0.72, true);
  makeTree(-4.5, -16, 0.8, true);
  makeTree(8.5, -15, 0.75, true);
  makeTree(-9, -14, 0.7, true);

  makeBush(-2.4, 0.15, -5.4, 1.1);
  makeBush(0.7, 0.12, -4.8, 0.85);
  makeBush(3.4, 0.15, -5.7, 1.0);
  makeBush(-10.5, 0.15, 2.2, 1.15);
  makeBush(9.8, 0.15, 1.6, 1.0);
  makeBush(13.6, 0.15, -5.8, 0.85);

  makeRock(-3.8, 0.1, 2.8, 1.15, false);
  makeRock(1.8, 0.1, 3.5, 0.8, false);
  makeRock(-9.5, 0.1, -2.8, 0.9, false);
  makeRock(10.5, 0.1, -2.7, 0.85, false);
  makeRock(-1.5, 0.1, 8.2, 0.75, false);
  makeRock(7.5, 0.1, 7.8, 0.8, false);

  makeCave(-6.7, 7.2, 4.2, 5.5);
  makeCave(8.8, 8.5, 3.2, 4.5);

  makeLog(-1.3, 0.18, 0.5, 0.2);
  makeLog(3.1, 0.18, 1.1, -0.4);
  makeLog(-8.7, 0.18, -5.1, 0.8);

  makeVine(world, -2.7, 0.3, -3.6, 2.3);
  makeVine(world, 1.2, 0.3, -4.2, 2.8);
  makeVine(world, 4.5, 0.3, -3.9, 2.1);
  makeVine(world, -7.5, 0.3, 1.2, 2.5);
  makeVine(world, 9.1, 0.3, 2.3, 2.4);

  makeLamp(-4.1, 0.15, 5.2);
  makeLamp(6.5, 0.15, 5.5);
  makeLamp(-8.6, 0.15, -5.2);

  // Floating glowing spores.
  const spores = [];
  const sporeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd66b,
    transparent: true,
    opacity: 0.75,
    depthWrite: false
  });

  for (let i = 0; i < 30; i++) {
    const spore = new THREE.Mesh(new THREE.SphereGeometry(0.035 + Math.random() * 0.045, 6, 5), sporeMaterial);
    spore.position.set(
      (Math.random() - 0.5) * 24,
      1 + Math.random() * 6,
      (Math.random() - 0.5) * 22
    );
    world.add(spore);
    spores.push({
      mesh: spore,
      speed: 0.25 + Math.random() * 0.35,
      phase: Math.random() * Math.PI * 2
    });
  }

  // -------------------------------------------------------------------------
  // Animation — original per-frame expressions; frame-locked increments
  // rescaled to dt (originals assumed ~60 fps).
  // -------------------------------------------------------------------------

  function update(t, dt) {
    const elapsed = t;

    // Gentle ambient movement.
    warmFill.intensity = 27 + Math.sin(elapsed * 1.4) * 2.2;
    coolFill.intensity = 17 + Math.sin(elapsed * 0.9 + 1) * 1.4;

    // Animate floating spores.
    for (const spore of spores) {
      spore.mesh.position.y += spore.speed * dt;
      spore.mesh.rotation.y += 0.36 * dt;
      spore.mesh.position.x += Math.sin(elapsed * 0.7 + spore.phase) * 0.054 * dt;

      if (spore.mesh.position.y > 7.5) {
        spore.mesh.position.y = 0.6;
      }
    }

    // Cave lamp glow variation (see header note).
    for (const lamp of lampGlows) {
      lamp.intensity = 7.5 + Math.sin(elapsed * 1.8 + lamp.userData.phase) * 0.8;
    }
  }

  return {
    group,
    update,
    spawn: { x: 0, z: 13, yaw: 0 },
    env: { background: 0x17110d, fogColor: 0x271c13, fogDensity: 0.018 },
    doors: {
      next: { x: 8.8, z: 5.0 },
      prev: { x: -6.7, z: 3.8 }
    }
  };
}
