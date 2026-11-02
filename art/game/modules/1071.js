// @world {"id": "1071", "title": "Ghosts 'n Goblins", "sub": "Stage 1 \u2014 Forest", "system": "3D Render"}
// Converted from 1071-ghosts_x27n_goblins_stage_1_forest.html into a Back Roms World Walker module.

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  let scene = {
    add: (...objs) => objs.forEach(o => o && group.add(o)),
    remove: (...objs) => objs.forEach(o => o && group.remove(o)),
    traverse: (cb) => group.traverse(cb),
    updateMatrixWorld: () => {},
    background: null,
    fog: null
  };

  let updateHook = null;

  function dummyRenderer() {
    return {
      setPixelRatio: () => {},
      setSize: () => {},
      outputColorSpace: null,
      toneMapping: null,
      toneMappingExposure: null,
      shadowMap: { enabled: false },
      capabilities: { getMaxAnisotropy: () => 16 },
      domElement: {
        style: {},
        setAttribute: () => {},
        addEventListener: () => {},
        removeEventListener: () => {}
      },
      render: () => {},
      setAnimationLoop: (cb) => { updateHook = cb; },
    };
  }

  function dummyVec() {
    const v = { x: 0, y: 0, z: 0,
      set: (x, y, z) => { v.x = x || 0; v.y = y || 0; v.z = z || 0; return v; },
      copy: (o) => { if (o) { v.x = o.x || 0; v.y = o.y || 0; v.z = o.z || 0; } return v; },
      add: (o) => { if (o) { v.x += o.x || 0; v.y += o.y || 0; v.z += o.z || 0; } return v; },
      sub: (o) => { if (o) { v.x -= o.x || 0; v.y -= o.y || 0; v.z -= o.z || 0; } return v; },
      addScaledVector: (o, s) => { if (o) { v.x += (o.x || 0) * s; v.y += (o.y || 0) * s; v.z += (o.z || 0) * s; } return v; },
      setFromSpherical: () => v,
      setFromSphericalCoords: () => v,
      length: () => Math.hypot(v.x, v.y, v.z),
      normalize: () => v,
      clone: () => { const c = dummyVec(); c.x = v.x; c.y = v.y; c.z = v.z; return c; }
    };
    return v;
  }

  function dummyCamera() {
    return {
      position: dummyVec(),
      up: dummyVec(),
      rotation: { x: 0, y: 0, z: 0, set: () => {} },
      quaternion: { set: () => {}, copy: () => {} },
      fov: 60, aspect: 16 / 9, near: 0.1, far: 2000,
      lookAt: () => {},
      getWorldDirection: (target) => { const t = target || dummyVec(); if (t.set) t.set(0, 0, -1); return t; },
      updateProjectionMatrix: () => {},
      updateMatrixWorld: () => {}
    };
  }

  let renderer = dummyRenderer();
  let camera = dummyCamera();
  const addEventListener = () => {};
  const devicePixelRatio = 1;
  const innerWidth = 1920;
  const innerHeight = 1080;
  const dummyEl = () => {
    const node = {
      style: {},
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      prepend: () => {},
      setAttribute: () => {},
      addEventListener: () => {},
      removeEventListener: () => {}
    };
    return node;
  };
  let container = dummyEl();
  let stage = dummyEl();
  let app = dummyEl();
  const window = typeof globalThis.window !== "undefined" ? globalThis.window : {
    innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, addEventListener: () => {}
  };
  const document = typeof globalThis.document !== "undefined" ? globalThis.document : {
    body: dummyEl(),
    querySelector: () => dummyEl(),
    querySelectorAll: () => [],
    getElementById: () => dummyEl(),
    createElement: () => {
      const ctx = new Proxy({}, { get: () => () => ctx, set: () => true });
      return { getContext: () => ctx, width: 64, height: 64, style: {}, appendChild: () => {}, setAttribute: () => {} };
    }
  };
  const requestAnimationFrame = (fn) => { updateHook = fn; };

  // --- Scoped Diorama Build Code ---
  // Converter repair: declared identifier(s) the scene used undeclared
  // (strict modules throw where sloppy scripts did not): cy, cz, neck
  let cy = 0;
  let cz = 0;
  let neck = 0;

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------
    // scene redirect
    scene.background = new THREE.Color(0x09151c);
    scene.fog = new THREE.FogExp2(0x09151c, 0.022);

    camera = dummyCamera();
    renderer = dummyRenderer();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------
    scene.add(new THREE.HemisphereLight(0x9edfff, 0x1b2018, 1.35));

    const sun = new THREE.DirectionalLight(0xffe6b0, 3.0);
    sun.position.set(-12, 18, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 55;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const blueLight = new THREE.PointLight(0x35a9ff, 30, 25, 2);
    blueLight.position.set(4, 7, -5);
    scene.add(blueLight);

    const pinkLight = new THREE.PointLight(0xff4ac8, 18, 14, 2);
    pinkLight.position.set(-6, 3, 1);
    scene.add(pinkLight);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------
    const mat = {
      ground: new THREE.MeshStandardMaterial({ color: 0x25231c, roughness: 1 }),
      groundDark: new THREE.MeshStandardMaterial({ color: 0x171512, roughness: 1 }),
      grass: new THREE.MeshStandardMaterial({ color: 0x3e612b, roughness: 1 }),
      grassLight: new THREE.MeshStandardMaterial({ color: 0x567638, roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: 0x4a3020, roughness: 1 }),
      bark: new THREE.MeshStandardMaterial({ color: 0x34261e, roughness: 1 }),
      leaf: new THREE.MeshStandardMaterial({ color: 0x285b36, roughness: 1 }),
      leafLight: new THREE.MeshStandardMaterial({ color: 0x3d7842, roughness: 1 }),
      leafDark: new THREE.MeshStandardMaterial({ color: 0x1d422b, roughness: 1 }),
      iron: new THREE.MeshStandardMaterial({
        color: 0x8b969d, metalness: 0.8, roughness: 0.28
      }),
      ironDark: new THREE.MeshStandardMaterial({
        color: 0x343c42, metalness: 0.75, roughness: 0.38
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xd6a84c, metalness: 0.8, roughness: 0.25
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xc92f48, roughness: 0.65
      }),
      purple: new THREE.MeshStandardMaterial({
        color: 0x6643ff, roughness: 0.6
      }),
      skin: new THREE.MeshStandardMaterial({ color: 0xd7a36b, roughness: 0.9 }),
      bone: new THREE.MeshStandardMaterial({ color: 0xe5d0a1, roughness: 1 }),
      eye: new THREE.MeshStandardMaterial({
        color: 0xffd65c, emissive: 0x8a4b00, emissiveIntensity: 1.2
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helper functions
    // -------------------------------------------------------------------------
    const voxel = (x, y, z, sx, sy, sz, material, cast = true) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = cast;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    const box = (x, y, z, sx, sy, sz, material, cast = true) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = cast;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    function makeVoxelLine(points, thickness = 0.22, material = mat.iron) {
      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const dz = b[2] - a[2];
        const length = Math.hypot(dx, dy, dz);
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(thickness, length, thickness),
          material
        );
        mesh.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
        mesh.rotation.set(
          Math.atan2(dz, dy),
          Math.atan2(dx, dz),
          0
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      }
    }

    // -------------------------------------------------------------------------
    // Ground and environment
    // -------------------------------------------------------------------------
    const ground = box(0, -0.55, 0, 42, 1.1, 32, mat.groundDark);
    ground.castShadow = false;

    // Procedural low-poly grass tufts.
    for (let i = 0; i < 115; i++) {
      const x = (Math.random() - 0.5) * 38;
      const z = (Math.random() - 0.5) * 28;
      const h = 0.25 + Math.random() * 0.55;
      const bladeCount = 3 + Math.floor(Math.random() * 5);
      for (let j = 0; j < bladeCount; j++) {
        const bx = x + (Math.random() - 0.5) * 0.65;
        const bz = z + (Math.random() - 0.5) * 0.65;
        const blade = box(
          bx,
          h * 0.45,
          bz,
          0.075,
          h,
          0.075,
          Math.random() > 0.5 ? mat.grass : mat.grassLight
        );
        blade.rotation.z = (Math.random() - 0.5) * 0.45;
        blade.rotation.x = (Math.random() - 0.5) * 0.45;
      }
    }

    // Background waterfall.
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x68b7d1,
      emissive: 0x174b61,
      emissiveIntensity: 0.65,
      roughness: 0.25,
      metalness: 0.1
    });

    for (let i = 0; i < 10; i++) {
      const x = -13 + i * 2.7;
      const width = 0.7 + Math.random() * 0.8;
      const fall = box(x, 2.5, -12, width, 8, 0.75, waterMaterial, false);
      fall.rotation.z = (Math.random() - 0.5) * 0.08;
    }

    // Distant cliffs.
    for (let i = 0; i < 12; i++) {
      const x = -22 + i * 4;
      const height = 6 + Math.random() * 8;
      box(x, height / 2 - 0.7, -18, 4.2, height, 5, mat.leafDark, false);
      box(x + 1.3, height * 0.72, -18.3, 2.8, 2.2, 4.5, mat.bark, false);
    }

    // Trees.
    function makeTree(x, z, scale = 1) {
      const trunkHeight = 4.8 * scale;
      const trunk = box(x, trunkHeight / 2 - 0.4, z, 0.85 * scale, trunkHeight, 0.85 * scale, mat.trunk);
      trunk.rotation.y = Math.random() * Math.PI;

      const crownY = trunkHeight + 0.25;
      const crownWidth = 2.2 * scale;

      // Cubic crown clusters.
      const clusters = [
        [-0.7, 0, 0, 1.0],
        [0.7, 0, 0, 1.0],
        [0, 0.55, 0, 1.15],
        [0, 0.05, 0.65, 0.85],
        [0, 0.05, -0.65, 0.85],
        [-0.25, 0.15, 0, 0.75]
      ];

      for (const [cx, cy, cz, size] of clusters) {
        const crown = box(
          x + cx * scale,
          crownY + cy * scale,
          z + cz * scale,
          size * scale,
          size * scale,
          size * scale,
          Math.random() > 0.45 ? mat.leaf : mat.leafLight
        );
        crown.rotation.y = Math.random() * Math.PI;
      }

      // Branches.
      makeVoxelLine([
        [x, 2.5 * scale, z],
        [x - 0.65 * scale, 3.7 * scale, z + 0.15],
        [x - 1.0 * scale, 4.4 * scale, z + 0.2]
      ], 0.16, mat.bark);

      makeVoxelLine([
        [x, 3.0 * scale, z],
        [x + 0.65 * scale, 4.2 * scale, z - 0.1],
        [x + 1.0 * scale, 4.8 * scale, z - 0.2]
      ], 0.14, mat.bark);
    }

    makeTree(-7.2, -3.4, 1.05);
    makeTree(-1.4, -4.8, 0.9);
    makeTree(4.3, -5.4, 1.05);
    makeTree(9.0, -3.5, 0.85);
    makeTree(-10.0, 2.0, 0.75);
    makeTree(11.0, 1.5, 0.7);

    // -------------------------------------------------------------------------
    // Demon horde
    // -------------------------------------------------------------------------
    const demons = [];

    function makeDemon(x, z, scale = 1, flying = false) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);
      scene.add(group);

      // Body.
      box(0, 0.65, 0, 0.52, 0.75, 0.48, mat.red, true);
      box(0, 1.25, 0, 0.48, 0.35, 0.46, mat.red, true);

      // Head and horns.
      box(0, 1.68, 0, 0.43, 0.36, 0.38, mat.skin, true);
      box(-0.19, 1.88, 0, 0.11, 0.48, 0.12, mat.bone, true);
      box(0.19, 1.88, 0, 0.11, 0.48, 0.12, mat.bone, true);
      box(-0.11, 1.72, 0.22, 0.2, 0.12, 0.06, mat.eye, false);
      box(0.11, 1.72, 0.22, 0.2, 0.12, 0.06, mat.eye, false);

      // Wings.
      const wingMaterial = flying ? mat.purple : mat.red;
      const leftWing = box(-0.48, 1.25, 0, 0.18, 0.85, 0.18, wingMaterial, true);
      const rightWing = box(0.48, 1.25, 0, 0.18, 0.85, 0.18, wingMaterial, true);
      leftWing.rotation.z = -0.35;
      rightWing.rotation.z = 0.35;
      if (flying) {
        leftWing.rotation.x = -0.45;
        rightWing.rotation.x = 0.45;
      }

      // Arms and weapon.
      const armL = box(-0.34, 1.03, 0.02, 0.17, 0.7, 0.16, mat.red, true);
      armL.rotation.z = -0.55;
      const armR = box(0.34, 1.03, 0.02, 0.17, 0.7, 0.16, mat.red, true);
      armR.rotation.z = 0.55;

      const staff = box(0, 2.15, 0.08, 0.12, 1.4, 0.12, mat.gold, true);
      staff.rotation.z = 0.08;
      const orb = box(0, 2.95, 0.08, 0.22, 0.22, 0.22, mat.purple, true);
      orb.rotation.z = 0.08;

      // Legs.
      const legL = box(-0.17, 0.27, 0.05, 0.2, 0.55, 0.25, mat.red, true);
      const legR = box(0.17, 0.27, 0.05, 0.2, 0.55, 0.25, mat.red, true);
      legL.rotation.x = 0.2;
      legR.rotation.x = -0.2;

      // Shield.
      const shield = box(0.38, 0.58, 0.28, 0.35, 0.55, 0.12, mat.purple, true);
      shield.rotation.z = -0.35;
      box(0.38, 0.58, 0.35, 0.08, 0.34, 0.08, mat.gold, true);

      demons.push({
        group,
        flying,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.55,
        baseX: x,
        baseZ: z,
        wing: leftWing,
        otherWing: rightWing
      });
    }

    makeDemon(-5.0, 0.2, 0.9, false);
    makeDemon(-3.35, 1.2, 0.78, false);
    makeDemon(-1.55, -0.4, 0.68, false);
    makeDemon(0.55, 0.7, 0.72, false);
    makeDemon(2.6, -0.35, 0.82, false);
    makeDemon(4.4, 1.0, 0.66, false);
    makeDemon(-6.6, -1.7, 0.78, true);
    makeDemon(-3.8, -2.5, 0.65, true);

    // Demon fire/particle effects.
    const particleSystems = [];
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3b8e,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });

    function makeParticles(x, y, z, count = 12) {
      for (let i = 0; i < count; i++) {
        const particle = new THREE.Mesh(
          new THREE.BoxGeometry(0.08 + Math.random() * 0.16, 0.08 + Math.random() * 0.16, 0.08 + Math.random() * 0.16),
          particleMaterial
        );
        particle.position.set(
          x + (Math.random() - 0.5) * 0.5,
          y + Math.random() * 1.2,
          z + (Math.random() - 0.5) * 0.5
        );
        scene.add(particle);
        particleSystems.push({
          mesh: particle,
          age: Math.random() * 1.4,
          life: 1.4,
          speed: 0.35 + Math.random() * 0.35
        });
      }
    }

    makeParticles(-4.9, 3.0, 0.3, 18);
    makeParticles(2.6, 3.0, -0.35, 14);

    // -------------------------------------------------------------------------
    // Steel knight
    // -------------------------------------------------------------------------
    const knight = new THREE.Group();
    knight.position.set(6.0, 0, 2.8);
    scene.add(knight);

    // Legs.
    const legL = box(-0.28, 0.48, 0, 0.32, 0.95, 0.48, mat.ironDark, true);
    const legR = box(0.28, 0.48, 0, 0.32, 0.95, 0.48, mat.ironDark, true);
    legL.rotation.x = 0.28;
    legR.rotation.x = -0.28;

    // Boots.
    const bootL = box(-0.3, 0.08, 0.23, 0.38, 0.25, 0.5, mat.iron, true);
    const bootR = box(0.3, 0.08, 0.23, 0.38, 0.25, 0.5, mat.iron, true);
    bootL.rotation.x = 0.2;
    bootR.rotation.x = -0.2;

    // Torso.
    box(0, 1.4, 0, 0.82, 1.0, 0.62, mat.iron, true);
    box(0, 1.45, 0.02, 0.46, 0.58, 0.12, mat.ironDark, true);

    // Chest plate.
    box(0, 1.48, 0.34, 0.58, 0.7, 0.12, mat.iron, true);
    box(0, 1.48, 0.41, 0.24, 0.35, 0.035, mat.gold, true);

    // Shoulder armor.
    const shoulderL = box(-0.45, 1.55, 0, 0.45, 0.55, 0.55, mat.iron, true);
    const shoulderR = box(0.45, 1.55, 0, 0.45, 0.55, 0.55, mat.iron, true);
    shoulderL.rotation.z = -0.12;
    shoulderR.rotation.z = 0.12;

    // Arms.
    const armL = box(-0.56, 1.1, 0, 0.28, 0.85, 0.3, mat.iron, true);
    const armR = box(0.56, 1.1, 0, 0.28, 0.85, 0.3, mat.iron, true);
    armL.rotation.z = -0.48;
    armR.rotation.z = 0.48;

    // Gauntlets.
    const gloveL = box(-0.72, 0.92, 0, 0.32, 0.34, 0.34, mat.gold, true);
    const gloveR = box(0.72, 0.92, 0, 0.32, 0.34, 0.34, mat.gold, true);
    gloveL.rotation.z = -0.48;
    gloveR.rotation.z = 0.48;

    // Head, neck, and face.
    box(0, 2.08, 0, 0.28, 0.38, 0.3, mat.ironDark, true);
    box(0, 2.4, 0, 0.52, 0.48, 0.4, mat.skin, true);
    box(0, 2.55, 0.215, 0.34, 0.18, 0.05, mat.eye, false);
    box(-0.16, 2.45, 0.225, 0.12, 0.16, 0.055, mat.eye, false);
    box(0.16, 2.45, 0.225, 0.12, 0.16, 0.055, mat.eye, false);

    // Beard.
    box(0, 2.13, 0.19, 0.5, 0.48, 0.22, mat.skin, true);

    // Helmet visor.
    box(0, 2.28, 0.22, 0.5, 0.2, 0.04, mat.eye, false);

    // Spear.
    makeVoxelLine([
      [0.72, 0.95, 0],
      [1.15, 2.65, 0.05],
      [1.35, 3.25, 0.05]
    ], 0.1, mat.gold);

    const spearTip = box(1.38, 3.28, 0.05, 0.18, 0.22, 0.18, mat.gold, true);
    spearTip.rotation.z = -0.12;

    // Shield.
    const shield = box(-0.82, 1.35, 0.18, 0.55, 0.72, 0.16, mat.ironDark, true);
    shield.rotation.z = -0.25;
    box(-0.82, 1.35, 0.27, 0.08, 0.4, 0.06, mat.gold, true);

    // Magical aura.
    const aura = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 16, 12),
      new THREE.MeshBasicMaterial({
        color: 0x61d5ff,
        transparent: true,
        opacity: 0.12,
        depthWrite: false
      })
    );
    aura.position.copy(knight.position);
    aura.scale.set(1.25, 0.85, 1.1);
    scene.add(aura);

    // Knight movement and attack state.
    const clock = new THREE.Clock();
    let knightTime = 0;
    let attack = false;
    let attackTimer = 0;

    function updateKnight(dt) {
      knightTime += dt;

      if (attackTimer > 0) {
        attackTimer -= dt;
        attack = true;
      } else {
        attack = false;
      }

      const stride = Math.sin(knightTime * 5.2) * 0.18;
      knight.position.x = 6.0 + stride;
      knight.rotation.y = Math.sin(knightTime * 2.4) * 0.08;

      legL.rotation.x = 0.28 + Math.sin(knightTime * 5.2) * 0.2;
      legR.rotation.x = -0.28 - Math.sin(knightTime * 5.2) * 0.2;

      if (attack) {
        attackTimer = Math.max(0, attackTimer - dt);
        const swing = Math.sin(attackTimer * 18) * 0.5;
        armL.rotation.z = -0.48 + swing;
        armR.rotation.z = 0.48 - swing;
        gloveL.rotation.z = -0.48 + swing;
        gloveR.rotation.z = 0.48 - swing;
        spearTip.rotation.z = -0.12 + swing * 0.15;
      } else {
        armL.rotation.z = -0.48;
        armR.rotation.z = 0.48;
        gloveL.rotation.z = -0.48;
        gloveR.rotation.z = 0.48;
        spearTip.rotation.z = -0.12;
      }

      aura.position.copy(knight.position);
      aura.scale.set(
        1.25 + Math.sin(knightTime * 3.2) * 0.08,
        0.85 + Math.sin(knightTime * 3.2) * 0.06,
        1.1
      );
      aura.material.opacity = 0.08 + Math.sin(knightTime * 4.0) * 0.05;
    }

    // -------------------------------------------------------------------------
    // Floating projectiles
    // -------------------------------------------------------------------------
    const projectiles = [];
    const projectileMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd15c,
      transparent: true,
      opacity: 0.95
    });

    function makeProjectile(x, y, z, speed, angle = 0) {
      const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(0.12, 0.42, 5),
        projectileMaterial
      );
      mesh.position.set(x, y, z);
      mesh.rotation.z = angle;
      scene.add(mesh);
      projectiles.push({
        mesh,
        speed,
        angle,
        phase: Math.random() * Math.PI * 2
      });
    }

    makeProjectile(7.0, 2.4, 1.0, 2.8, -0.2);
    makeProjectile(8.0, 2.0, 0.0, 2.4, 0.25);
    makeProjectile(6.3, 1.7, 1.8, 2.1, -0.35);

    function updateProjectiles(dt) {
      for (const p of projectiles) {
        p.mesh.position.x += p.speed * dt * Math.cos(p.angle);
        p.mesh.position.z += p.speed * dt * Math.sin(p.angle);
        p.mesh.position.y += Math.sin(p.phase) * dt * 0.25;
        p.mesh.rotation.z += dt * 3.2;
        p.phase += dt * 2.2;
      }
    }

    // -------------------------------------------------------------------------
    // Magical impact on the ground
    // -------------------------------------------------------------------------
    const impact = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 16, 10),
      new THREE.MeshBasicMaterial({
        color: 0xff4bc7,
        transparent: true,
        opacity: 0.65,
        depthWrite: false
      })
    );
    impact.position.set(5.9, 0.03, 2.8);
    impact.scale.set(1.8, 0.12, 1.8);
    scene.add(impact);

    const impactRing = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.78, 24),
      new THREE.MeshBasicMaterial({
        color: 0xff72c9,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    impactRing.rotation.x = -Math.PI / 2;
    impactRing.position.set(5.9, 0.075, 2.8);
    scene.add(impactRing);

    // -------------------------------------------------------------------------
    // Custom camera controls
    // -------------------------------------------------------------------------
    let cameraAzimuth = 0.55;
    let cameraPolar = 1.12;
    let cameraRadius = 23;
    const target = new THREE.Vector3(0, 1.2, 0);

    function updateCamera() {
      camera.position.set(
        target.x + cameraRadius * Math.sin(cameraAzimuth) * Math.sin(cameraPolar),
        target.y + cameraRadius * Math.cos(cameraPolar),
        target.z + cameraRadius * Math.cos(cameraAzimuth) * Math.sin(cameraPolar)
      );
      camera.lookAt(target);
    }

    updateCamera();

    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    renderer.domElement.addEventListener("pointerdown", event => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!dragging) return;
      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      previousX = event.clientX;
      previousY = event.clientY;

      cameraAzimuth -= dx * 0.006;
      cameraPolar = THREE.MathUtils.clamp(cameraPolar - dy * 0.005, 0.35, 1.48);
      updateCamera();
    });

    renderer.domElement.addEventListener("pointerup", event => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    });

    renderer.domElement.addEventListener("pointercancel", () => {
      dragging = false;
    });

    renderer.domElement.addEventListener("wheel", event => {
      event.preventDefault();
      cameraRadius = THREE.MathUtils.clamp(cameraRadius + event.deltaY * 0.012, 12, 34);
      updateCamera();
    }, { passive: false });

    // -------------------------------------------------------------------------
    // Animation loop
    // -------------------------------------------------------------------------
    function animate() {
      requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      updateKnight(dt);
      updateProjectiles(dt);

      for (const d of demons) {
        if (d.flying) {
          d.group.position.y = d.baseY + Math.sin(clock.elapsedTime * 2.1 + d.phase) * 0.35;
          d.group.rotation.y = Math.sin(clock.elapsedTime * 1.2 + d.phase) * 0.25;
          const flap = Math.sin(clock.elapsedTime * 5.0 + d.phase) * 0.45;
          d.wing.rotation.x = flap;
          d.otherWing.rotation.x = -flap;
        } else {
          d.group.position.y = Math.sin(clock.elapsedTime * 1.4 + d.phase) * 0.05;
          d.group.rotation.y = Math.sin(clock.elapsedTime * 0.8 + d.phase) * 0.18;
          d.wing.rotation.x = Math.sin(clock.elapsedTime * 2.0 + d.phase) * 0.18;
          d.otherWing.rotation.x = -Math.sin(clock.elapsedTime * 2.0 + d.phase) * 0.18;
        }
      }

      for (const p of particleSystems) {
        p.age += dt;
        if (p.age > p.life) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          p.mesh.material.dispose();
        } else {
          p.mesh.position.y -= p.speed * dt;
          p.mesh.rotation.y += dt * 2;
          p.mesh.material.opacity = 0.8 * (1 - p.age / p.life);
        }
      }

      impactRing.material.opacity = 0.75 * (1 - (clock.elapsedTime % 1.8) / 1.8);
      impact.scale.setScalar(1.8 + Math.sin(clock.elapsedTime * 3.0) * 0.15);

      knightTime += dt;
      updateKnight(dt);

      renderer.render(scene, camera);
    }

    // Restart button.
    addEventListener("keydown", event => {
      if (event.key.toLowerCase() === "r") {
        knightTime = 0;
        attack = false;
        attackTimer = 0;
        knight.position.set(6.0, 0, 2.8);
      }
    });

    animate();
  

  // --- Walker Update Protocol ---
  function update(t, dt) {
    if (typeof updateHook === "function") {
      try {
        updateHook(t, dt);
      } catch (e) {}
    }
  }

  return {
    group,
    update,
    spawn: { x: 0.0, z: 14.0, yaw: 0 },
    relic: { id: "generic", name: "Ghosts 'n Goblins Relic", x: 10.0, z: -12.0 },
    env:   { background: 0x09151c, fogColor: 0x09151c, fogDensity: 0.022 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
