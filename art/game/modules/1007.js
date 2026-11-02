// @world {"id": "1007", "title": "Mortal Kombat", "sub": "The Courtyard", "system": "3D Render"}
// Converted from 1007-mortal_kombat_the_courtyard.html into a Back Roms World Walker module.

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

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x111416);
    scene.fog = new THREE.Fog(0x111416, 18, 38);

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
    // Voxel helpers
    // -------------------------------------------------------------------------

    const voxel = (x, y, z, sx, sy, sz, material) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    const cube = (x, y, z, size, material) => {
      return voxel(x, y, z, size, size, size, material);
    };

    const bar = (x, y, z, sx, sy, sz, material) => {
      return voxel(x, y, z, sx, sy, sz, material);
    };

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      stone: new THREE.MeshStandardMaterial({
        color: 0x6f7775,
        roughness: 0.95
      }),
      darkStone: new THREE.MeshStandardMaterial({
        color: 0x343a3a,
        roughness: 0.95
      }),
      lightStone: new THREE.MeshStandardMaterial({
        color: 0x9a9b8e,
        roughness: 0.9
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0x9d2828,
        roughness: 0.8
      }),
      darkRed: new THREE.MeshStandardMaterial({
        color: 0x6e171a,
        roughness: 0.85
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xc69532,
        metalness: 0.3,
        roughness: 0.6
      }),
      goldDark: new THREE.MeshStandardMaterial({
        color: 0x76521c,
        metalness: 0.25,
        roughness: 0.7
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x285b3d,
        roughness: 0.85
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x164d68,
        roughness: 0.55,
        metalness: 0.1
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x15191a,
        roughness: 0.75
      }),
      skin: new THREE.MeshStandardMaterial({
        color: 0xb97850,
        roughness: 0.85
      }),
      scorpionYellow: new THREE.MeshStandardMaterial({
        color: 0xe2ad32,
        roughness: 0.55
      }),
      scorpionBlack: new THREE.MeshStandardMaterial({
        color: 0x171a1b,
        roughness: 0.7
      }),
      subBlue: new THREE.MeshStandardMaterial({
        color: 0x1f88b5,
        roughness: 0.45,
        metalness: 0.12
      }),
      subBlack: new THREE.MeshStandardMaterial({
        color: 0x10171c,
        roughness: 0.65
      })
    };

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0x9bb4c8, 0x282119, 1.25));

    const keyLight = new THREE.DirectionalLight(0xffe4b8, 3.2);
    keyLight.position.set(-6, 11, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 35;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6daeff, 1.8);
    rimLight.position.set(8, 5, -9);
    scene.add(rimLight);

    const warmFill = new THREE.PointLight(0xff8a3d, 18, 25, 2);
    warmFill.position.set(-4, 4, 3);
    scene.add(warmFill);

    // -------------------------------------------------------------------------
    // Ground platform
    // -------------------------------------------------------------------------

    cube(0, -1.2, 0, 34, 1.2, 18, materials.darkStone);
    cube(0, -0.45, 0, 32, 0.65, 16, materials.stone);
    cube(0, 0.05, 0, 30, 0.25, 14, materials.lightStone);

    // Stage side blocks.
    for (let x = -14; x <= 14; x += 2) {
      cube(x, 0.28, 7.15, 1.8, 0.45, 0.65, materials.stone);
      cube(x, 0.28, -7.15, 1.8, 0.45, 0.65, materials.stone);
    }

    // -------------------------------------------------------------------------
    // Background palace / mountain backdrop
    // -------------------------------------------------------------------------

    // Distant mountain walls.
    for (let i = 0; i < 10; i++) {
      const x = (i - 5) * 4.2;
      const height = 3.5 + ((i * 7) % 4);
      bar(x, height / 2, -10, 3.7, height, 1.2, materials.darkStone);
      bar(x, height + 0.08, -10, 3.4, 0.18, 1.35, materials.stone);
    }

    // Main palace structure.
    const palaceZ = -6.2;

    // Back wall.
    bar(0, 4.15, palaceZ, 12.5, 2.3, 1.2, materials.darkStone);
    bar(0, 5.4, palaceZ, 11.8, 0.35, 1.45, materials.stone);

    // Roof tiers.
    bar(0, 6.25, palaceZ, 13.2, 0.45, 4.2, materials.red);
    bar(0, 7.0, palaceZ, 12.4, 0.35, 3.5, materials.darkRed);
    bar(0, 7.55, palaceZ, 10.8, 0.3, 2.8, materials.red);

    // Roof tile details.
    for (let x = -6; x <= 6; x += 0.7) {
      bar(x, 7.72, palaceZ, 0.22, 0.12, 2.8, materials.goldDark);
    }

    // Decorative roof corners.
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const x = side * (5.8 - i * 0.8);
        const y = 6.3 + i * 0.38;
        const z = palaceZ + (i % 2) * 0.7;
        cube(x, y, z, 0.42, 0.42, 0.42, materials.red);
      }
    }

    // Red pillars.
    for (const x of [-5.4, -2.7, 0, 2.7, 5.4]) {
      cube(x, 3.25, palaceZ, 0.62, 2.5, 0.62, materials.red);
      cube(x, 4.6, palaceZ, 0.82, 0.3, 0.82, materials.goldDark);
    }

    // Horizontal beams.
    bar(0, 4.45, palaceZ, 11.2, 0.32, 0.45, materials.darkRed);
    bar(0, 4.45, palaceZ - 0.35, 11.2, 0.2, 0.2, materials.goldDark);

    // Dragon statues.
    function createDragon(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);

      const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.32, 1.15, 4, 8),
        materials.gold
      );
      body.rotation.z = Math.PI / 2;
      body.castShadow = true;
      group.add(body);

      const head = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 0.85, 6),
        materials.gold
      );
      head.rotation.z = -Math.PI / 2;
      head.position.x = 0.95;
      head.castShadow = true;
      group.add(head);

      const tail = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, 1.4, 5),
        materials.goldDark
      );
      tail.rotation.z = Math.PI;
      tail.position.x = -1.35;
      group.add(tail);

      for (const side of [-1, 1]) {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 8, 6),
          materials.black
        );
        eye.position.set(1.15, 0.1, side * 0.2);
        group.add(eye);
      }

      scene.add(group);
    }

    createDragon(-4.4, -6.25, 1.15);
    createDragon(4.4, -6.25, 1.15);

    // Throne.
    cube(-0.65, 5.45, -6.2, 1.7, 0.55, 1.2, materials.darkStone);
    cube(-0.65, 5.95, -6.2, 1.1, 0.35, 0.85, materials.gold);
    cube(-0.65, 6.3, -6.2, 0.55, 0.3, 0.55, materials.goldDark);

    // -------------------------------------------------------------------------
    // Crowd of tiny voxel spectators
    // -------------------------------------------------------------------------

    const spectatorColors = [
      materials.black,
      materials.red,
      materials.goldDark,
      materials.blue
    ];

    for (let row = 0; row < 3; row++) {
      for (let i = 0; i < 34; i++) {
        const x = -12.5 + i * 0.73;
        const z = -3.35 + row * 1.05;
        const y = 0.55 + row * 0.58;

        cube(x, y, z, 0.34, 0.48, 0.34, spectatorColors[i % spectatorColors.length]);
      }
    }

    // -------------------------------------------------------------------------
    // Fighters
    // -------------------------------------------------------------------------

    function createScorpion() {
      const group = new THREE.Group();
      group.position.set(-2.15, 0.62, 1.25);
      group.rotation.y = -0.12;

      // Legs.
      const legPositions = [
        [-0.38, -0.18], [0.38, -0.18],
        [-0.38, 0.25], [0.38, 0.25],
        [-0.25, 0.5], [0.25, 0.5]
      ];

      for (const [x, z] of legPositions) {
        const leg = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.13, 0.42, 3, 6),
          materials.scorpionBlack
        );
        leg.position.set(x, 0.15, z);
        leg.castShadow = true;
        group.add(leg);
      }

      // Torso.
      const torso = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.34, 0.52, 4, 8),
        materials.scorpionBlack
      );
      torso.position.y = 0.55;
      torso.castShadow = true;
      group.add(torso);

      // Yellow chest armor.
      const chest = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.31, 0.18, 8),
        materials.scorpionYellow
      );
      chest.rotation.x = Math.PI / 2;
      chest.position.y = 0.62;
      chest.castShadow = true;
      group.add(chest);

      // Head and mask.
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.27, 10, 8),
        materials.scorpionYellow
      );
      head.position.set(0, 1.04, 0);
      head.castShadow = true;
      group.add(head);

      const mask = new THREE.Mesh(
        new THREE.BoxGeometry(0.43, 0.22, 0.16),
        materials.scorpionBlack
      );
      mask.position.set(0, 1.03, 0.22);
      group.add(mask);

      // Eyes.
      for (const side of [-1, 1]) {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 8, 6),
          materials.black
        );
        eye.position.set(side * 0.12, 1.05, 0.31);
        group.add(eye);
      }

      // Arms.
      const leftArm = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.13, 0.42, 3, 6),
        materials.scorpionBlack
      );
      leftArm.position.set(-0.43, 0.72, 0.05);
      leftArm.rotation.z = -0.45;
      leftArm.castShadow = true;
      group.add(leftArm);

      const rightArm = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.13, 0.42, 3, 6),
        materials.scorpionBlack
      );
      rightArm.position.set(0.43, 0.72, 0.05);
      rightArm.rotation.z = 0.45;
      rightArm.castShadow = true;
      group.add(rightArm);

      // Kick.
      const kickLeg = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.13, 0.6, 3, 6),
        materials.scorpionBlack
      );
      kickLeg.position.set(0.38, 0.38, 0.42);
      kickLeg.rotation.z = -0.75;
      kickLeg.rotation.x = -0.25;
      kickLeg.castShadow = true;
      group.add(kickLeg);

      // Spear.
      const spear = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 1.45, 6),
        materials.gold
      );
      spear.position.set(-0.55, 0.55, -0.25);
      spear.rotation.z = -0.55;
      spear.castShadow = true;
      group.add(spear);

      scene.add(group);
      return group;
    }

    function createSubZero() {
      const group = new THREE.Group();
      group.position.set(2.15, 0.62, 1.25);
      group.rotation.y = 0.12;

      // Legs.
      const legPositions = [
        [-0.38, -0.18], [0.38, -0.18],
        [-0.38, 0.25], [0.38, 0.25],
        [-0.25, 0.5], [0.25, 0.5]
      ];

      for (const [x, z] of legPositions) {
        const leg = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.13, 0.42, 3, 6),
          materials.subBlack
        );
        leg.position.set(x, 0.15, z);
        leg.castShadow = true;
        group.add(leg);
      }

      // Torso.
      const torso = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.34, 0.52, 4, 8),
        materials.subBlack
      );
      torso.position.y = 0.55;
      torso.castShadow = true;
      group.add(torso);

      // Blue chest armor.
      const chest = new THREE.Mesh(
        new THREE.CylinderGeometry(0.27, 0.31, 0.18, 8),
        materials.subBlue
      );
      chest.rotation.x = Math.PI / 2;
      chest.position.y = 0.62;
      chest.castShadow = true;
      group.add(chest);

      // Head and mask.
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.27, 10, 8),
        materials.subBlue
      );
      head.position.set(0, 1.04, 0);
      head.castShadow = true;
      group.add(head);

      const mask = new THREE.Mesh(
        new THREE.BoxGeometry(0.43, 0.22, 0.16),
        materials.subBlack
      );
      mask.position.set(0, 1.03, 0.22);
      group.add(mask);

      // Eyes.
      for (const side of [-1, 1]) {
        const eye = new THREE.Mesh(
          new THREE.SphereGeometry(0.045, 8, 6),
          materials.black
        );
        eye.position.set(side * 0.12, 1.05, 0.31);
        group.add(eye);
      }

      // Arms.
      const leftArm = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.13, 0.42, 3, 6),
        materials.subBlack
      );
      leftArm.position.set(-0.43, 0.72, 0.05);
      leftArm.rotation.z = 0.45;
      leftArm.castShadow = true;
      group.add(leftArm);

      const rightArm = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.13, 0.42, 3, 6),
        materials.subBlack
      );
      rightArm.position.set(0.43, 0.72, 0.05);
      rightArm.rotation.z = -0.45;
      rightArm.castShadow = true;
      group.add(rightArm);

      // Ice blade.
      const blade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.72, 8),
        materials.subBlue
      );
      blade.position.set(-0.43, 0.7, 0.28);
      blade.rotation.z = -0.65;
      blade.castShadow = true;
      group.add(blade);

      scene.add(group);
      return group;
    }

    const scorpion = createScorpion();
    const subZero = createSubZero();

    // -------------------------------------------------------------------------
    // Floating particles / snow
    // -------------------------------------------------------------------------

    const particleCount = 90;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 24;
      particlePositions[i * 3 + 1] = Math.random() * 12;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
      particleSpeeds[i] = 0.08 + Math.random() * 0.18;
    }

    particles.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particlePoints = new THREE.Points(
      particles,
      new THREE.PointsMaterial({ color: 0xdfe9f5, size: 0.08, transparent: true, opacity: 0.7 })
    );
    scene.add(particlePoints);

    // -------------------------------------------------------------------------
    // Custom camera controls
    // -------------------------------------------------------------------------

    const cameraState = {
      theta: 0.05,
      phi: Math.PI / 2,
      radius: 21,
      target: new THREE.Vector3(0, 3.1, 0)
    };

    const defaultCamera = {
      theta: 0.05,
      phi: Math.PI / 2,
      radius: 21
    };

    function updateCamera() {
      const sinPhi = Math.sin(cameraState.phi);
      camera.position.set(
        cameraState.target.x + cameraState.radius * sinPhi * Math.sin(cameraState.theta),
        cameraState.target.y + cameraState.radius * Math.cos(cameraState.phi),
        cameraState.target.z + cameraState.radius * sinPhi * Math.cos(cameraState.theta)
      );
      camera.lookAt(cameraState.target);
    }

    updateCamera();

    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    let pointerId = null;

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      pointerId = event.pointerId;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging || event.pointerId !== pointerId) return;

      const deltaX = event.clientX - previousX;
      const deltaY = event.clientY - previousY;

      previousX = event.clientX;
      previousY = event.clientY;

      cameraState.theta -= deltaX * 0.006;
      cameraState.phi = THREE.MathUtils.clamp(
        cameraState.phi + deltaY * 0.005,
        0.62,
        1.48
      );

      updateCamera();
    });

    function endDrag(event) {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (renderer.domElement.hasPointerCapture(pointerId)) {
        renderer.domElement.releasePointerCapture(pointerId);
      }

      pointerId = null;
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();
      cameraState.radius = THREE.MathUtils.clamp(
        cameraState.radius + event.deltaY * 0.012,
        13,
        30
      );
      updateCamera();
    }, { passive: false });

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Subtle fighter breathing and idle movement.
      scorpion.position.y = 0.62 + Math.sin(elapsed * 1.7) * 0.018;
      subZero.position.y = 0.62 + Math.sin(elapsed * 1.7 + 1.4) * 0.018;

      scorpion.rotation.y = -0.12 + Math.sin(elapsed * 0.7) * 0.035;
      subZero.rotation.y = 0.12 - Math.sin(elapsed * 0.7 + 1.1) * 0.035;

      // Animate particles.
      const positions = particles.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= particleSpeeds[i] * 0.016;
        positions[i * 3] += Math.sin(elapsed * 0.4 + i) * 0.0015;

        if (positions[i * 3 + 1] < 0.2) {
          positions[i * 3 + 1] = 12;
        }
      }

      particles.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    // -------------------------------------------------------------------------
    // Resize
    // -------------------------------------------------------------------------

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });
  

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
    relic: { id: "generic", name: "Mortal Kombat Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x111416, fogColor: 0x111416, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
