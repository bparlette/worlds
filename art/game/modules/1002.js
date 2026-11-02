// @world {"id": "1002", "title": "Super Mario Bros.", "sub": "World 1-1", "system": "3D Render"}
// Converted from 1002-super_mario_bros_world_1_1.html into a Back Roms World Walker module.

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  let scene = {
    add: (...objs) => objs.forEach(o => o && group.add(o)),
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

    

    // scene redirect
    scene.background = new THREE.Color(0xaeb9c3);
    scene.fog = new THREE.Fog(0xaeb9c3, 32, 75);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    const hemi = new THREE.HemisphereLight(0xdcecff, 0x5b4630, 2.2);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff1ce, 3.4);
    sun.position.set(-12, 18, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -25;
    sun.shadow.camera.right = 25;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 60;
    sun.shadow.normalBias = 0.035;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x9fc8ff, 0.8);
    fill.position.set(15, 8, -12);
    scene.add(fill);

    const materials = {
      brick: new THREE.MeshStandardMaterial({
        color: 0x9a4626,
        roughness: 0.92
      }),
      brickLight: new THREE.MeshStandardMaterial({
        color: 0xb95b34,
        roughness: 0.9
      }),
      brickDark: new THREE.MeshStandardMaterial({
        color: 0x71351f,
        roughness: 0.95
      }),
      mortar: new THREE.MeshStandardMaterial({
        color: 0x3e281e,
        roughness: 1
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x3c6875,
        roughness: 0.86
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0x66939f,
        roughness: 0.82
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x39b967,
        roughness: 0.65
      }),
      greenDark: new THREE.MeshStandardMaterial({
        color: 0x24783f,
        roughness: 0.75
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xf1bd38,
        roughness: 0.72
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x171b1d,
        roughness: 0.95
      }),
      flag: new THREE.MeshStandardMaterial({
        color: 0xf4f7ef,
        roughness: 0.75,
        side: THREE.DoubleSide
      })
    };

    const voxelGeometry = new THREE.BoxGeometry(1, 1, 1);

    function mesh(geometry, material, x, y, z, sx = 1, sy = 1, sz = 1) {
      const object = new THREE.Mesh(geometry, material);
      object.position.set(x, y, z);
      object.scale.set(sx, sy, sz);
      object.castShadow = true;
      object.receiveShadow = true;
      scene.add(object);
      return object;
    }

    function block(x, y, z, material, sx = 1, sy = 1, sz = 1) {
      return mesh(voxelGeometry, material, x, y, z, sx, sy, sz);
    }

    // Main platform: long brick wall made from individual visible blocks.
    const platformStart = -13;
    const platformEnd = 13;
    const platformDepth = 2.25;
    const platformHeight = 1.35;
    const brickWidth = 0.62;

    for (let x = platformStart; x <= platformEnd; x += brickWidth) {
      const offset = Math.floor(x / brickWidth) % 2;
      const zLeft = -platformDepth / 2 + 0.18 + offset * brickWidth * 0.48;
      const zRight = -platformDepth / 2 + 0.18 + (1 - offset) * brickWidth * 0.48;

      block(x, 0.12, zLeft, materials.brick, brickWidth * 0.96, 0.42, brickWidth * 0.94);
      block(x, 0.12, zRight, materials.brick, brickWidth * 0.96, 0.42, brickWidth * 0.94);
    }

    for (let x = platformStart + 0.2; x <= platformEnd - 0.1; x += brickWidth) {
      const offset = Math.floor(x / brickWidth) % 2;
      const zLeft = -platformDepth / 2 + 0.18 + offset * brickWidth * 0.48;
      const zRight = -platformDepth / 2 + 0.18 + (1 - offset) * brickWidth * 0.48;

      block(x, 0.72, zLeft, materials.brickLight, brickWidth * 0.96, 0.3, brickWidth * 0.94);
      block(x, 0.72, zRight, materials.brickLight, brickWidth * 0.96, 0.3, brickWidth * 0.94);
    }

    // Structural supports under the platform.
    for (const x of [-10.4, -3.2, 4.2, 10.8]) {
      for (let z = -0.72; z <= 0.75; z += 0.36) {
        block(x, -0.62, z, materials.stone, 0.48, 0.85, 0.38);
      }
    }

    // Large teal portal at the left end.
    const portal = new THREE.Group();
    portal.position.set(-12.8, 0, 0);

    const portalLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 3.3, 0.65),
      materials.stone
    );
    portalLeft.position.set(-1.55, 1.65, 0);
    portalLeft.castShadow = true;
    portal.add(portalLeft);

    const portalRight = portalLeft.clone();
    portalRight.position.x = 1.55;
    portal.add(portalRight);

    const portalTop = new THREE.Mesh(
      new THREE.BoxGeometry(3.9, 0.65, 0.65),
      materials.stone
    );
    portalTop.position.set(0, 3.35, 0);
    portalTop.castShadow = true;
    portal.add(portalTop);

    const portalInnerLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 2.7, 0.18),
      materials.stoneLight
    );
    portalInnerLeft.position.set(-0.78, 1.35, 0);
    portal.add(portalInnerLeft);

    const portalInnerRight = portalInnerLeft.clone();
    portalInnerRight.position.x = 0.78;
    portal.add(portalInnerRight);

    for (let y = 0.4; y < 3.1; y += 0.35) {
      block(-1.72, y, 0.02, materials.stoneLight, 0.08, 0.2, 0.1);
      block(1.72, y, 0.02, materials.stoneLight, 0.08, 0.2, 0.1);
    }

    const portalBase = new THREE.Group();
    portalBase.position.set(-12.8, 0, 0);

    for (let z = -0.78; z <= 0.78; z += 0.39) {
      block(-1.55, 0.18, z, materials.stone, 0.58, 0.36, 0.42);
      block(1.55, 0.18, z, materials.stone, 0.58, 0.36, 0.42);
    }

    // Side supports for the portal.
    for (const z of [-0.72, 0.72]) {
      block(-2.05, 0.18, z, materials.stone, 0.5, 0.36, 0.42);
      block(2.05, 0.18, z, materials.stone, 0.5, 0.36, 0.42);
    }

    // Green pipe.
    const pipeGroup = new THREE.Group();
    pipeGroup.position.set(-9.3, 0, 0.25);

    const pipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.38, 0.38, 0.9, 16),
      materials.green
    );
    pipe.rotation.z = Math.PI / 2;
    pipe.castShadow = true;
    pipeGroup.add(pipe);

    const pipeRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.08, 8, 16),
      materials.greenDark
    );
    pipeRing.rotation.y = Math.PI / 2;
    pipeRing.position.z = 0.45;
    pipeGroup.add(pipeRing);

    // Stacked question-mark block structure.
    const pyramid = new THREE.Group();
    pyramid.position.set(-5.1, 0, 0.25);

    for (let level = 0; level < 6; level++) {
      const count = 5 - level;
      const half = (count - 1) * 0.42 / 2;

      for (let i = 0; i < count; i++) {
        const x = (i - half) * 0.42;
        const block = new THREE.Mesh(voxelGeometry, materials.brickLight);
        block.position.set(x, level * 0.43, 0);
        block.scale.set(0.39, 0.4, 0.39);
        block.rotation.y = (Math.sin(i * 0.8) * 0.08);
        block.castShadow = true;
        block.receiveShadow = true;
        pyramid.add(block);
      }
    }

    // A hanging question-mark block.
    const hangingBlock = new THREE.Mesh(voxelGeometry, materials.yellow);
    hangingBlock.position.set(-8.1, 2.1, 0.2);
    hangingBlock.scale.set(0.42, 0.62, 0.42);
    hangingBlock.rotation.z = -0.12;
    hangingBlock.castShadow = true;
    scene.add(hangingBlock);

    // Castle tower on the right.
    const tower = new THREE.Group();
    tower.position.set(7.2, 0, 0.2);

    // Main tower body.
    for (let row = 0; row < 3; row++) {
      for (let x = -1.3; x <= 1.4; x += 0.43) {
        for (let z = -1.3; z <= 1.4; z += 0.43) {
          const material = (row + Math.floor((x + z) * 2)) % 3 === 0
            ? materials.brickDark
            : materials.brick;

          const block = new THREE.Mesh(voxelGeometry, material);
          block.position.set(x, 0.21 + row * 0.43, z);
          block.scale.set(0.4, 0.4, 0.4);
          block.castShadow = true;
          block.receiveShadow = true;
          tower.add(block);
        }
      }
    }

    // Battlements.
    for (let x = -1.7; x <= 1.8; x += 0.42) {
      for (let z of [-1.4, 1.4]) {
        const block = new THREE.Mesh(voxelGeometry, materials.brickLight);
        block.position.set(x, 1.95, z);
        block.scale.set(0.38, 0.42, 0.38);
        block.castShadow = true;
        tower.add(block);
      }
    }

    for (let z = -0.9; z <= 1.9; z += 0.42) {
      const block = new THREE.Mesh(voxelGeometry, materials.brickLight);
      block.position.set(-1.65, 1.95, z);
      block.scale.set(0.38, 0.42, 0.38);
      block.castShadow = true;
      tower.add(block);
    }

    // Arched doorway made from dark blocks.
    for (let y = 0.25; y < 1.8; y += 0.34) {
      for (let x = -0.72; x <= 0.73; x += 0.34) {
        if (Math.abs(x) < 0.28 && y < 1.25) {
          continue;
        }

        const material = y > 1.15 ? materials.mortar : materials.brickDark;
        const block = new THREE.Mesh(voxelGeometry, material);
        block.position.set(x, y, 1.54);
        block.scale.set(0.31, 0.31, 0.12);
        tower.add(block);
      }
    }

    // Side turret.
    const turret = new THREE.Group();
    turret.position.set(8.65, 0, 0.1);

    for (let row = 0; row < 3; row++) {
      for (let x = -0.65; x <= 0.66; x += 0.34) {
        for (let z = -0.65; z <= 0.66; z += 0.34) {
          const block = new THREE.Mesh(voxelGeometry, row % 2 ? materials.brick : materials.brickLight);
          block.position.set(x, 0.17 + row * 0.34, z);
          block.scale.set(0.31, 0.32, 0.31);
          block.castShadow = true;
          turret.add(block);
        }
      }
    }

    const turretRoof = new THREE.Mesh(
      new THREE.ConeGeometry(0.7, 0.55, 4),
      materials.stone
    );
    turretRoof.position.y = 2.02;
    turretRoof.rotation.y = Math.PI / 4;
    turretRoof.castShadow = true;
    turret.add(turretRoof);

    // Flagpole and pixel flag.
    const flagPole = new THREE.Group();
    flagPole.position.set(2.2, 0, 0.2);

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.085, 3.2, 10),
      materials.green
    );
    pole.position.y = 1.6;
    pole.castShadow = true;
    flagPole.add(pole);

    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.5),
      materials.flag
    );
    flag.position.set(0.38, 2.95, 0);
    flag.castShadow = true;
    flagPole.add(flag);

    const flagTip = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 10, 8),
      materials.green
    );
    flagTip.position.set(0.8, 2.95, 0);
    flagPole.add(flagTip);

    // Small foreground block details.
    block(-1.8, 0.08, 1.25, materials.brickDark, 0.7, 0.22, 0.55);
    block(0.4, 0.08, 1.35, materials.brickDark, 0.65, 0.22, 0.5);
    block(1.2, 0.08, 1.4, materials.brickDark, 0.55, 0.22, 0.45);

    // Pixel-style grass tufts along the front edge.
    const grassColors = [0x39b967, 0x49c976, 0x31a95f];

    for (let i = 0; i < 22; i++) {
      const x = -11.5 + i * 1.08;
      const material = new THREE.MeshStandardMaterial({
        color: grassColors[i % grassColors.length],
        roughness: 0.95
      });

      const tuft = new THREE.Mesh(voxelGeometry, material);
      tuft.position.set(x, 0.48, 1.02 + (i % 3) * 0.08);
      tuft.scale.set(0.2, 0.22 + (i % 2) * 0.08, 0.2);
      tuft.rotation.y = (i * 0.7) % (Math.PI * 2);
      tuft.castShadow = true;
      scene.add(tuft);
    }

    // Custom orbit controls implemented directly.
    const controls = {
      azimuth: 0.78,
      elevation: 0.28,
      distance: 28,
      target: new THREE.Vector3(0, 1.1, 0),
      dragging: false,
      lastX: 0,
      lastY: 0
    };

    function updateCamera() {
      const cosElevation = Math.cos(controls.elevation);

      camera.position.set(
        controls.target.x + controls.distance * cosElevation * Math.sin(controls.azimuth),
        controls.target.y + controls.distance * Math.sin(controls.elevation),
        controls.target.z + controls.distance * cosElevation * Math.cos(controls.azimuth)
      );

      camera.lookAt(controls.target);
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;

      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.azimuth -= dx * 0.006;
      controls.elevation = THREE.MathUtils.clamp(
        controls.elevation + dy * 0.005,
        -0.12,
        1.18
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (event && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();
      controls.distance = THREE.MathUtils.clamp(
        controls.distance + event.deltaY * 0.02,
        13,
        48
      );
      updateCamera();
    }, { passive: false });

    // Responsive resize.
    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    updateCamera();
    renderer.render(scene, camera);
  

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
    relic: { id: "generic", name: "Super Mario Bros. Relic", x: -10.0, z: -12.0 },
    env:   { background: 0xaeb9c3, fogColor: 0xaeb9c3, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
