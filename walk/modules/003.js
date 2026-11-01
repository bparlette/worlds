// ============================================================================
// @world {"id":"003","title":"HAUNTED HOUSE","sub":"Ghost Mansion","system":"Atari 2600"}
// World 003 — HAUNTED HOUSE · Ghost Mansion (Atari 2600)
// Converted from scenes/003_haunted_house_ghost_mansion.html into a World
// Walker module. The original added its content directly to the scene (no
// world group); the conversion creates the group and points the original
// helpers' default parent at it. All geometry/materials/lights and ambient
// animation preserved; renderer/orbit camera/jump/HUD removed.
//
// Conversion notes:
//  * The original's ghost arm-wave read `ghost.userData?.arms`, but the arms
//    were stored on the wrapper object, so the wave never ran and the loop
//    skipped it. This module wires the arms correctly (the intended effect).
//  * The original animated scene.fog.density; here update() writes the
//    drift into env.fogDensity, which the host applies every frame.
//  * The firefly opacity expression from the original is kept verbatim
//    (it evaluates to a constant — preserved as authored).
//
// Door choices:
//   next — the mansion's front gate: aligned with the front door, just
//          outside the low fence. Door at (-1.5, 9.6).
//   prev — in the graveyard east of the mansion, by the tombstones.
//          Door at (13.5, -4).
// Spawn: south lawn, facing the mansion front.
// ============================================================================

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  const env = { background: 0x17100f, fogColor: 0x17100f, fogDensity: 0.027 };

  // -------------------------------------------------------------------------
  // Materials
  // -------------------------------------------------------------------------
  const materials = {
    brick: new THREE.MeshStandardMaterial({ color: 0x7b2f38, roughness: .95 }),
    darkBrick: new THREE.MeshStandardMaterial({ color: 0x4d1d26, roughness: 1 }),
    trim: new THREE.MeshStandardMaterial({ color: 0xf1c777, roughness: .88 }),
    white: new THREE.MeshStandardMaterial({ color: 0xf0e4bd, roughness: .95 }),
    black: new THREE.MeshStandardMaterial({ color: 0x080706, roughness: 1 }),
    window: new THREE.MeshStandardMaterial({
      color: 0x243642,
      emissive: 0x16232b,
      emissiveIntensity: 1.5,
      roughness: .35,
      metalness: .1
    }),
    windowWarm: new THREE.MeshStandardMaterial({
      color: 0xffd98b,
      emissive: 0xffa63d,
      emissiveIntensity: 2.2,
      roughness: .45
    }),
    porch: new THREE.MeshStandardMaterial({ color: 0x30251f, roughness: .95 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x263d27, roughness: 1 }),
    grassLight: new THREE.MeshStandardMaterial({ color: 0x34512b, roughness: 1 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x4a241d, roughness: .95 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x343331, roughness: .65, metalness: .55 }),
    purple: new THREE.MeshStandardMaterial({
      color: 0x6f246f,
      emissive: 0x28072b,
      emissiveIntensity: .55,
      roughness: .85
    })
  };

  // -------------------------------------------------------------------------
  // Lighting
  // -------------------------------------------------------------------------
  group.add(new THREE.HemisphereLight(0x657785, 0x24120e, 1.25));

  const moon = new THREE.DirectionalLight(0x8eaaff, 2.4);
  moon.position.set(-15, 22, 10);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.left = -25;
  moon.shadow.camera.right = 25;
  moon.shadow.camera.top = 25;
  moon.shadow.camera.bottom = -25;
  moon.shadow.camera.near = 1;
  moon.shadow.camera.far = 65;
  moon.shadow.bias = -.0003;
  group.add(moon);

  const porchLight = new THREE.PointLight(0xffa33d, 3.2, 12, 2);
  porchLight.position.set(0, 4.5, 3.5);
  group.add(porchLight);

  const windowGlow = new THREE.PointLight(0xff8b35, 2.1, 8, 2);
  windowGlow.position.set(0, 4.5, -1.3);
  group.add(windowGlow);

  const purpleGlow = new THREE.PointLight(0x6b217b, 1.1, 10, 2);
  purpleGlow.position.set(0, 2.5, 8);
  group.add(purpleGlow);

  // -------------------------------------------------------------------------
  // Geometry helpers (original default parent was the scene; now the group)
  // -------------------------------------------------------------------------
  function box(w, h, d, material, x, y, z, parent = group) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function cylinder(rt, rb, h, material, x, y, z, parent = group, segments = 12) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segments), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function sphere(r, material, x, y, z, parent = group, widthSegments = 16, heightSegments = 12) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, widthSegments, heightSegments), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function makeTextSprite(text, color = "#f4df9b", bg = "#24171c") {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 512, 128);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = color;
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 496, 112);
    ctx.fillStyle = color;
    ctx.font = "bold 54px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 256, 64);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(5, 1.25, 1);
    return sprite;
  }

  // -------------------------------------------------------------------------
  // Ground, lawn, path, and surroundings
  // -------------------------------------------------------------------------
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 90),
    new THREE.MeshStandardMaterial({ color: 0x18211b, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -.12;
  ground.receiveShadow = true;
  group.add(ground);

  const lawn = new THREE.Mesh(
    new THREE.CircleGeometry(18, 64),
    materials.grass
  );
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = -.08;
  lawn.receiveShadow = true;
  group.add(lawn);

  // Curved path made from alternating stone slabs.
  for (let i = 0; i < 18; i++) {
    const angle = i * 0.32;
    const radius = 5.5 + i * 0.78;
    const slab = box(
      1.25,
      .12,
      .62,
      i % 2 ? materials.trim : materials.porch,
      Math.cos(angle) * radius,
      .025,
      Math.sin(angle) * radius
    );
    slab.rotation.y = -angle + Math.PI / 2;
  }

  // Low fence.
  for (let x = -12; x <= 12; x += 2) {
    cylinder(.055, .055, 1.15, materials.wood, x, .55, 7.2);
    box(.75, .12, .12, materials.wood, x, 1.0, 7.2);
  }
  for (const y of [.45, .9]) {
    box(24, .08, .08, materials.wood, 0, y, 7.2);
  }

  // Graveyard to the right.
  const graveyard = new THREE.Group();
  graveyard.position.set(10, 0, -2);
  group.add(graveyard);

  function makeGrave(x, z, scale = 1) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.scale.setScalar(scale);
    graveyard.add(g);

    cylinder(.42, .52, .25, materials.black, 0, .14, 0, g, 9);
    const crossG = new THREE.Group();
    crossG.position.y = .32;
    g.add(crossG);
    box(.12, .72, .12, materials.trim, 0, .36, 0, crossG);
    box(.52, .12, .12, materials.trim, 0, .68, 0, crossG);
    return g;
  }

  makeGrave(-2.2, 0, 1.1);
  makeGrave(2.3, .5, .85);
  makeGrave(3.4, -1.2, 1.25);
  makeGrave(-3.6, -1.1, .9);

  // Small tombstone.
  const tombstone = new THREE.Mesh(
    new THREE.CylinderGeometry(.16, .34, 1.8, 4),
    materials.trim
  );
  tombstone.rotation.y = Math.PI / 4;
  tombstone.position.set(5.2, .9, -3.4);
  tombstone.castShadow = true;
  graveyard.add(tombstone);

  const tombText = makeTextSprite("R.I.P", "#d99075", "#24151a");
  tombText.position.set(5.2, 1.75, -3.4);
  tombText.scale.set(1.6, .4, 1);
  graveyard.add(tombText);

  // -------------------------------------------------------------------------
  // Mansion
  // -------------------------------------------------------------------------
  const mansion = new THREE.Group();
  mansion.position.set(-1.5, 0, -1.5);
  group.add(mansion);

  box(14, .5, 16, materials.darkBrick, 0, .25, 0, mansion);
  box(12.8, 9.5, 14.8, materials.brick, 0, 5.2, 0, mansion);

  // Roof.
  const roof = cylinder(8.2, 8.2, 3.1, materials.darkBrick, 0, 12.2, 0, mansion, 12);
  roof.scale.z = .72;
  roof.rotation.z = Math.PI / 2;

  for (let i = 0; i < 7; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const ridge = box(
      .16,
      3.25,
      .18,
      materials.darkBrick,
      Math.cos(angle) * 7.8,
      12.2,
      Math.sin(angle) * 5.6,
      mansion
    );
    ridge.rotation.y = -angle;
  }

  // Front facade details.
  box(14.3, .35, .4, materials.trim, 0, 9.75, 7.45, mansion);
  box(13.6, .3, .35, materials.trim, 0, .75, 7.35, mansion);

  for (let x = -5.5; x <= 5.5; x += 2.75) {
    box(.18, 9.6, .28, materials.darkBrick, x, 5.2, 7.38, mansion);
  }

  // Windows.
  const windowPositions = [
    [-4.6, 6.7, 7.55, .95],
    [0, 6.7, 7.55, 1.1],
    [4.6, 6.7, 7.55, .95],
    [-3.3, 3.2, 7.55, .78],
    [0, 3.2, 7.55, .82],
    [3.3, 3.2, 7.55, .78],
    [-5.45, 1.25, 7.45, .6],
    [5.45, 1.25, 7.45, .6]
  ];

  for (const [x, y, z, w] of windowPositions) {
    box(w + .35, 1.55, .22, materials.black, x, y, z, mansion);
    box(w, 1.35, .08, materials.windowWarm, x, y, z + .15, mansion);
    box(w + .08, .08, .1, materials.trim, x, y, z + .2, mansion);
    box(.08, 1.35, .1, materials.trim, x, y, z + .2, mansion);
  }

  // Front door.
  box(2.05, 3.65, .25, materials.wood, 0, 2.15, 7.62, mansion);
  box(2.25, .2, .3, materials.trim, 0, 4.02, 7.68, mansion);
  box(2.25, .2, .3, materials.trim, 0, .3, 7.68, mansion);
  const doorKnob = sphere(.13, materials.metal, 1.0, 2.2, 7.82, mansion);
  doorKnob.scale.z = .45;

  // Porch.
  box(7.4, .28, 4.6, materials.porch, 0, .45, 3.15, mansion);
  for (const x of [-3.1, 3.1]) {
    box(.35, .35, 4.5, materials.trim, x, 1.35, 3.15, mansion);
  }
  for (const x of [-3.3, 3.3]) {
    for (const z of [1.15, 5.15]) {
      cylinder(.13, .16, 1.25, materials.wood, x, .85, z, mansion, 8);
    }
  }

  // Hanging lanterns.
  const lanterns = [];
  function makeLantern(x, y, z, color = 0xffa33d) {
    const lanternGroup = new THREE.Group();
    lanternGroup.position.set(x, y, z);
    mansion.add(lanternGroup);

    cylinder(.018, .018, .8, materials.black, 0, .35, 0, lanternGroup, 6);
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(.18, .23, .48, 8),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 2.2,
        transparent: true,
        opacity: .82,
        roughness: .3
      })
    );
    glass.position.y = .62;
    glass.castShadow = false;
    lanternGroup.add(glass);
    const cap = new THREE.Mesh(
      new THREE.ConeGeometry(.3, .22, 8),
      materials.metal
    );
    cap.position.y = .9;
    lanternGroup.add(cap);
    lanterns.push(glass);
  }

  makeLantern(-2.55, 4.8, 7.95);
  makeLantern(2.55, 4.8, 7.95);
  makeLantern(0, 3.65, 7.95, 0x7228a2);

  // Cross above door.
  const cross = new THREE.Group();
  cross.position.set(0, 10.15, 7.55);
  mansion.add(cross);
  box(.12, 1.2, .14, materials.trim, 0, .6, 0, cross);
  box(.95, .12, .14, materials.trim, 0, 1.2, 0, cross);

  // Sign.
  const sign = makeTextSprite("GHOST MANSION", "#ffb347", "#351b25");
  sign.position.set(0, 5.35, 7.72);
  sign.scale.set(3.2, .8, 1);
  mansion.add(sign);

  // Side windows and balcony.
  for (const side of [-1, 1]) {
    for (const y of [3.3, 7.1]) {
      const wx = side * 6.65;
      box(.2, 1.45, .8, materials.black, wx, y, 0.2, mansion);
      const pane = box(.08, 1.25, .65, materials.windowWarm, wx + side * .12, y, .2, mansion);
      pane.rotation.y = side * .12;
    }

    const balcony = box(2.8, .25, 2.8, materials.porch, side * 6.6, 8.2, 0, mansion);
    balcony.rotation.y = side * .08;
    for (let i = 0; i < 5; i++) {
      const rail = box(.08, 1.15, .08, materials.wood, side * (5.25 + i * .65), 8.85, 0, mansion);
      rail.rotation.y = side * .08;
    }
  }

  // Porch plants.
  const plantPot = new THREE.Mesh(
    new THREE.CylinderGeometry(.3, .25, .45, 10),
    materials.purple
  );
  plantPot.position.set(-4.7, 1.0, 5.35);
  mansion.add(plantPot);

  const plant = sphere(.48, materials.purple, -4.7, 1.55, 5.35, mansion);
  plant.scale.set(.75, 1.25, .75);
  const plant2 = sphere(.38, materials.purple, -4.45, 1.75, 5.35, mansion);
  plant2.scale.set(.8, .9, .8);

  // -------------------------------------------------------------------------
  // Animated environmental elements
  // -------------------------------------------------------------------------
  const fireflies = [];
  const fireflyMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd875,
    transparent: true,
    opacity: .85,
    depthWrite: false
  });

  for (let i = 0; i < 24; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(.065, 6, 4), fireflyMaterial);
    const side = i % 2 ? 1 : -1;
    p.position.set(side * (8 + Math.random() * 12), 2 + Math.random() * 7, -7 + Math.random() * 15);
    group.add(p);
    fireflies.push({
      mesh: p,
      base: p.position.clone(),
      phase: Math.random() * Math.PI * 2,
      speed: .35 + Math.random() * .45
    });
  }

  const butterflies = [];
  for (let i = 0; i < 8; i++) {
    const butterfly = new THREE.Group();
    const wingL = new THREE.Mesh(new THREE.CircleGeometry(.13, 8), materials.purple);
    const wingR = new THREE.Mesh(new THREE.CircleGeometry(.13, 8), materials.purple);
    wingL.rotation.z = Math.PI;
    butterfly.add(wingL, wingR);
    butterfly.position.set((Math.random() - .5) * 20, 2 + Math.random() * 8, (Math.random() - .5) * 18);
    group.add(butterfly);
    butterflies.push({
      group: butterfly,
      base: butterfly.position.clone(),
      phase: Math.random() * Math.PI * 2,
      speed: .3 + Math.random() * .35
    });
  }

  // Windsock / flag on roof.
  cylinder(.045, .055, 4.5, materials.wood, 4.8, 13.3, 1.2, mansion, 8);
  const flag = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, .75, 4, 2),
    new THREE.MeshStandardMaterial({
      color: 0x7d2473,
      emissive: 0x26062b,
      emissiveIntensity: .45,
      side: THREE.DoubleSide,
      roughness: .9
    })
  );
  flag.position.set(6.35, 15.2, 1.2);
  flag.rotation.y = -.15;
  mansion.add(flag);

  // -------------------------------------------------------------------------
  // Ghosts
  // -------------------------------------------------------------------------
  const ghosts = [];

  function makeGhost(color, scale = 1) {
    const ghostGroup = new THREE.Group();
    ghostGroup.scale.setScalar(scale);
    group.add(ghostGroup);

    const bodyMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: .58,
      depthWrite: false
    });

    const body = sphere(.62, bodyMaterial, 0, 0, 0, ghostGroup);
    body.scale.set(.75, 1.15, .75);

    const head = sphere(.38, bodyMaterial, 0, .75, 0, ghostGroup);
    head.scale.set(.8, 1.05, .8);

    const eyes = new THREE.Mesh(
      new THREE.SphereGeometry(.055, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: .95 })
    );
    eyes.position.set(-.15, .78, .31);
    eyes.scale.z = .25;
    ghostGroup.add(eyes);

    const mouth = new THREE.Mesh(
      new THREE.SphereGeometry(.055, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: .95 })
    );
    mouth.position.set(0, .64, .31);
    mouth.scale.z = .25;
    ghostGroup.add(mouth);

    const arms = [];
    for (const side of [-1, 1]) {
      const arm = sphere(.18, bodyMaterial, side * .45, .05, 0, ghostGroup);
      arm.scale.set(.55, 1.5, .55);
      arms.push(arm);
    }

    ghostGroup.userData = { body, head, eyes, mouth, arms };
    ghosts.push({
      group: ghostGroup,
      baseY: 0,
      phase: Math.random() * Math.PI * 2,
      speed: .55 + Math.random() * .35,
      arms,
      bob: 0
    });
  }

  makeGhost(0x8f31b3, .85);
  makeGhost(0x7b2c91, .62);

  // -------------------------------------------------------------------------
  // Atmospheric particles
  // -------------------------------------------------------------------------
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x9eb7c4,
    size: .055,
    transparent: true,
    opacity: .45,
    depthWrite: false
  });

  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(450 * 3);
  for (let i = 0; i < 450; i++) {
    particlePositions[i * 3] = (Math.random() - .5) * 45;
    particlePositions[i * 3 + 1] = Math.random() * 18;
    particlePositions[i * 3 + 2] = (Math.random() - .5) * 35;
  }
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  group.add(new THREE.Points(particleGeometry, particleMaterial));

  // -------------------------------------------------------------------------
  // Animation — the original scene's per-frame expressions, moved here.
  // -------------------------------------------------------------------------

  function update(t, dt) {
    const elapsed = t;

    // Gentle porch light pulse.
    porchLight.intensity = 3.0 + Math.sin(elapsed * 1.7) * .25;
    windowGlow.intensity = 2.0 + Math.sin(elapsed * 1.1 + 1) * .25;

    // Ghosts drift and bob (arm wave wired to the real arms — see header).
    for (const ghost of ghosts) {
      ghost.group.position.y = ghost.baseY + Math.sin(elapsed * ghost.speed + ghost.phase) * .35;
      ghost.group.rotation.y = Math.sin(elapsed * ghost.speed * .7 + ghost.phase) * .16;
      ghost.group.rotation.z = Math.sin(elapsed * ghost.speed * .9 + ghost.phase) * .08;

      const arms = ghost.arms || [];
      if (!arms.length) continue;
      arms[0].rotation.z = Math.sin(elapsed * 3.2 + ghost.phase) * .55;
      arms[1].rotation.z = -Math.sin(elapsed * 3.2 + ghost.phase) * .55;
    }

    // Fireflies.
    for (const f of fireflies) {
      f.mesh.position.y = f.base.y + Math.sin(elapsed * f.speed + f.phase) * .35;
      f.mesh.position.x = f.base.x + Math.cos(elapsed * f.speed * .8 + f.phase) * .25;
      f.mesh.material.opacity = .55 + .35 * .5 + .45 * .5;
    }

    // Butterflies.
    for (const b of butterflies) {
      const bt = elapsed * b.speed + b.phase;
      b.group.position.y = b.base.y + Math.sin(bt) * .45;
      b.group.position.x = b.base.x + Math.cos(bt * .7) * .35;
      b.group.rotation.y = Math.sin(bt) * .8;
      b.group.scale.setScalar(1 + Math.sin(bt * 2) * .12);
    }

    // Flag wave (vertex expressions preserved verbatim from the original,
    // including its index choices).
    flag.geometry.attributes.position.array[1] = 15.2 + Math.sin(elapsed * 2.1) * .18;
    flag.geometry.attributes.position.array[3] = 15.2 + Math.sin(elapsed * 2.1 + .6) * .18;
    flag.geometry.computeVertexNormals();

    // Subtle drifting fog (host applies env.fogDensity every frame).
    env.fogDensity = .026 + Math.sin(elapsed * .18) * .0015;
  }

  return {
    group,
    update,
    spawn: { x: 0, z: 14, yaw: 0 },
    env,
    doors: {
      next: { x: -1.5, z: 9.6 },
      prev: { x: 13.5, z: -4 }
    }
  };
}
