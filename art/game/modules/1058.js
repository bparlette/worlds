// @world {"id": "1058", "title": "Super Mario", "sub": "Small Mario Habitat \u2014 ? Block Island", "system": "3D Render"}
// Converted from 1058-super_mario_small_mario_habitat_block_island.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): ly, lz
  let ly = 0;
  let lz = 0;

    

    container = dummyEl();

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x177cff);
    scene.fog = new THREE.Fog(0x177cff, 13, 27);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0xb9efff, 0x397637, 2.1));

    const sun = new THREE.DirectionalLight(0xfff4d5, 3.2);
    sun.position.set(6, 10, 7);
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x62b8ff, 1.4);
    rim.position.set(-7, 5, -6);
    scene.add(rim);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      sky: new THREE.MeshStandardMaterial({
        color: 0x177cff,
        roughness: 1
      }),
      block: new THREE.MeshStandardMaterial({
        color: 0xffd52e,
        roughness: 0.82
      }),
      blockEdge: new THREE.MeshStandardMaterial({
        color: 0xf4a623,
        roughness: 0.85
      }),
      grass: new THREE.MeshStandardMaterial({
        color: 0x39b85d,
        roughness: 0.95
      }),
      grassTop: new THREE.MeshStandardMaterial({
        color: 0x58d66c,
        roughness: 0.95
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x289749,
        roughness: 1
      }),
      trunk: new THREE.MeshStandardMaterial({
        color: 0x9c5329,
        roughness: 1
      }),
      leaves: new THREE.MeshStandardMaterial({
        color: 0x39b65e,
        roughness: 0.95
      }),
      leavesLight: new THREE.MeshStandardMaterial({
        color: 0x58c966,
        roughness: 0.95
      }),
      overalls: new THREE.MeshStandardMaterial({
        color: 0x1769bd,
        roughness: 0.85
      }),
      skin: new THREE.MeshStandardMaterial({
        color: 0xe3a16f,
        roughness: 0.85
      }),
      hat: new THREE.MeshStandardMaterial({
        color: 0xe83e3b,
        roughness: 0.85
      }),
      hatDark: new THREE.MeshStandardMaterial({
        color: 0x7e1918,
        roughness: 0.9
      }),
      face: new THREE.MeshStandardMaterial({
        color: 0xf1c49a,
        roughness: 0.85
      }),
      eye: new THREE.MeshStandardMaterial({
        color: 0x25313b,
        roughness: 0.75
      }),
      nose: new THREE.MeshStandardMaterial({
        color: 0x79402e,
        roughness: 0.9
      }),
      mouth: new THREE.MeshStandardMaterial({
        color: 0x6f3227,
        roughness: 0.9
      }),
      cloud: new THREE.MeshStandardMaterial({
        color: 0xf3fbff,
        roughness: 1
      }),
      pipe: new THREE.MeshStandardMaterial({
        color: 0x167b55,
        roughness: 0.85
      }),
      pipeDark: new THREE.MeshStandardMaterial({
        color: 0x0d593f,
        roughness: 0.9
      }),
      coin: new THREE.MeshStandardMaterial({
        color: 0xffe35a,
        roughness: 0.4,
        metalness: 0.25
      }),
      flower: new THREE.MeshStandardMaterial({
        color: 0xffe55b,
        roughness: 0.8
      }),
      flowerDark: new THREE.MeshStandardMaterial({
        color: 0xe75b51,
        roughness: 0.85
      }),
      bird: new THREE.MeshStandardMaterial({
        color: 0x4ca4d5,
        roughness: 0.8
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const cube = (
      size,
      material,
      x = 0,
      y = 0,
      z = 0,
      rotationY = 0
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        material
      );
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotationY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    const voxelCloud = (
      radius,
      material,
      x,
      y,
      z,
      rotationY = 0
    ) => {
      const cloud = new THREE.Group();
      const layers = [
        [0, 0, 0, 0.48],
        [-0.38, 0.12, 0, 0.38],
        [0.38, 0.12, 0, 0.38],
        [-0.22, 0.36, 0, 0.32],
        [0.22, 0.36, 0, 0.32],
        [0, 0.56, 0, 0.25]
      ];

      for (const [lx, ly, lz, s] of layers) {
        for (let ix = -1; ix <= 1; ix++) {
          for (let iz = -1; iz <= 1; iz++) {
            const d = Math.abs(ix) + Math.abs(iz);
            if (d > 1 && ly < 0.5) continue;
            const voxel = cube(
              s * 0.9,
              material,
              lx + ix * s * 0.65,
              ly + Math.max(0, d) * s * 0.48,
              lz + iz * s * 0.65
            );
            voxel.rotation.y = rotationY;
            cloud.add(voxel);
          }
        }
      }

      return cloud;
    };

    // -------------------------------------------------------------------------
    // Ground/background
    // -------------------------------------------------------------------------

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      materials.sky
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.65;
    ground.receiveShadow = true;
    scene.add(ground);

    // A few floating square clouds in the distance.
    const distantClouds = [
      [-7, 4.5, -5, 0.5],
      [7, 5.8, -7, 0.7],
      [-10, 7, 3, 0.65],
      [11, 6.8, 2, 0.55]
    ];

    for (const [x, y, z, scale] of distantClouds) {
      const cloud = voxelCloud(
        scale,
        materials.cloud,
        x,
        y,
        z,
        Math.random() * Math.PI
      );
      cloud.scale.setScalar(1.25);
      scene.add(cloud);
    }

    // -------------------------------------------------------------------------
    // Main question block
    // -------------------------------------------------------------------------

    const block = new THREE.Group();

    const blockSize = 1.42;
    const blockThickness = 1.3;

    // Main cube.
    block.add(
      cube(blockSize, materials.block, 0, 0, 0)
    );

    // Darker side trim.
    block.add(
      cube(
        blockSize + 0.08,
        materials.blockEdge,
        0,
        -blockSize * 0.5 - 0.02,
        0
      )
    );

    // Front and right question marks, assembled from blocks.
    function voxelQuestion(material, x, y, z, scale = 0.58) {
      const group = new THREE.Group();
      group.position.set(x, y, z);

      const top = cube(
        scale * 1.45,
        material,
        0,
        scale * 0.69,
        0
      );
      group.add(top);

      const upperLeft = cube(
        scale * 0.48,
        material,
        -scale * 0.48,
        scale * 0.38,
        0
      );
      const upperRight = cube(
        scale * 0.48,
        material,
        scale * 0.48,
        scale * 0.38,
        0
      );
      group.add(upperLeft, upperRight);

      const lowerLeft = cube(
        scale * 0.48,
        material,
        -scale * 0.48,
        -scale * 0.38,
        0
      );
      const lowerRight = cube(
        scale * 0.48,
        material,
        scale * 0.48,
        -scale * 0.38,
        0
      );
      group.add(lowerLeft, lowerRight);

      const stem = cube(
        scale * 0.2,
        material,
        0,
        -scale * 0.72,
        0
      );
      group.add(stem);

      return group;
    }

    // Front face.
    const frontQuestion = voxelQuestion(
      new THREE.MeshStandardMaterial({
        color: 0xf2c8ff,
        roughness: 0.9
      }),
      0,
      0.03,
      blockSize / 2 + 0.025
    );
    frontQuestion.scale.setScalar(0.7);
    block.add(frontQuestion);

    // Right face.
    const rightQuestion = voxelQuestion(
      new THREE.MeshStandardMaterial({
        color: 0xfff5e8,
        roughness: 0.9
      }),
      0,
      0.03,
      blockSize / 2 + 0.025,
      0.66
    );
    rightQuestion.rotation.y = Math.PI / 2;
    rightQuestion.position.x = blockSize / 2 + 0.025;
    block.add(rightQuestion);

    // Small side details.
    for (const [x, y, z, sx] of [
      [-blockSize / 2 - 0.025, -0.55, blockSize / 2 + 0.025, 0.2],
      [blockSize / 2 + 0.025, -0.55, -blockSize / 2 - 0.025, 0.2],
      [-blockSize / 2 - 0.025, -0.55, -blockSize / 2 - 0.025, 0.2]
    ]) {
      block.add(cube(sx, materials.blockEdge, x, y, z));
    }

    // -------------------------------------------------------------------------
    // Grass cap
    // -------------------------------------------------------------------------

    const grassCap = new THREE.Group();

    const capCenter = cube(
      blockSize + 0.28,
      materials.grass,
      0,
      blockSize * 0.5 + 0.08,
      0
    );
    grassCap.add(capCenter);

    // Pixelated grass border.
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * (blockSize * 0.5 + 0.13);
      const z = Math.sin(angle) * (blockSize * 0.5 + 0.13);
      const height = 0.18 + (i % 2) * 0.08;
      grassCap.add(
        cube(
          0.38,
          i % 2 ? materials.grassDark : materials.grassTop,
          x,
          blockSize * 0.5 + height,
          z
        )
      );
    }

    // Irregular top grass patches.
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 0.25 + (i % 3) * 0.13;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      grassCap.add(
        cube(
          0.28,
          i % 2 ? materials.grassTop : materials.grass,
          x,
          blockSize * 0.5 + 0.24,
          z
        )
      );
    }

    grassCap.position.y = 0.79;
    block.add(grassCap);

    // -------------------------------------------------------------------------
    // Tree
    // -------------------------------------------------------------------------

    const tree = new THREE.Group();
    tree.position.set(-0.72, 0.8, -0.35);

    // Trunk made of stacked square blocks.
    tree.add(
      cube(0.28, materials.trunk, 0, 0.35, 0)
    );
    tree.add(
      cube(0.3, materials.trunk, 0, 0.72, 0)
    );
    tree.add(
      cube(0.32, materials.trunk, 0, 1.02, 0)
    );

    // Layered cubic foliage.
    tree.add(
      cube(0.72, materials.leaves, 0, 1.48, 0)
    );
    tree.add(
      cube(0.58, materials.leavesLight, 0, 1.95, 0)
    );
    tree.add(
      cube(0.47, materials.leaves, 0, 2.32, 0)
    );
    tree.add(
      cube(0.38, materials.leavesLight, 0, 2.62, 0)
    );

    // Small branch.
    tree.add(
      cube(0.2, materials.trunk, 0.36, 1.68, 0.05, 0.35)
    );
    tree.add(
      cube(0.18, materials.leaves, 0.61, 1.8, 0.05, 0.35)
    );

    block.add(tree);

    // -------------------------------------------------------------------------
    // Sleeping Mario
    // -------------------------------------------------------------------------

    const mario = new THREE.Group();
    mario.position.set(0.25, 0.84, 0.12);
    mario.rotation.y = -0.18;

    // Body lying on its side.
    mario.add(
      cube(0.82, materials.overalls, 0, 0.13, 0)
    );

    // Head.
    mario.add(
      cube(0.48, materials.face, 0.34, 0.53, 0)
    );

    // Hat brim.
    mario.add(
      cube(0.62, materials.hat, 0.34, 0.39, 0)
    );

    // Hat top.
    mario.add(
      cube(0.34, materials.hat, 0.34, 0.66, 0)
    );

    // Hat underside.
    mario.add(
      cube(0.43, materials.hatDark, 0.34, 0.46, 0)
    );

    // Nose.
    mario.add(
      cube(0.1, materials.nose, 0.69, 0.54, 0)
    );

    // Eyes.
    mario.add(
      cube(0.075, materials.eye, 0.49, 0.61, 0.19)
    );
    mario.add(
      cube(0.075, materials.eye, 0.49, 0.61, -0.19)
    );

    // Smile.
    mario.add(
      cube(0.12, materials.mouth, 0.66, 0.43, 0.01)
    );

    // Arms folded.
    mario.add(
      cube(0.2, materials.skin, 0.03, 0.3, 0.22)
    );
    mario.add(
      cube(0.2, materials.skin, 0.03, 0.3, -0.22)
    );

    // Legs.
    mario.add(
      cube(0.3, materials.skin, -0.18, 0.02, 0.3)
    );
    mario.add(
      cube(0.3, materials.skin, -0.18, 0.02, -0.3)
    );

    // Sleep zzz made from small cubes.
    for (let i = 0; i < 3; i++) {
      mario.add(
        cube(
          0.07,
          materials.white || materials.cloud,
          0.28 + i * 0.22,
          1.05 + i * 0.12,
          -0.35
        )
      );
    }

    block.add(mario);

    // -------------------------------------------------------------------------
    // Pipe
    // -------------------------------------------------------------------------

    const pipe = new THREE.Group();
    pipe.position.set(1.03, 0.83, -0.35);

    // Lower pipe section.
    pipe.add(
      cube(0.54, materials.pipe, 0, 0.27, 0)
    );

    // Upper pipe section.
    pipe.add(
      cube(0.54, materials.pipe, 0, 0.76, 0)
    );

    // Dark inner opening.
    pipe.add(
      cube(0.37, materials.pipeDark, 0, 0.76, 0.276)
    );

    // Pipe rim.
    pipe.add(
      cube(0.6, materials.pipe, 0, 0.99, 0)
    );

    // Small pipe-side block.
    pipe.add(
      cube(0.2, materials.pipeDark, 0.29, 0.62, 0.08)
    );

    block.add(pipe);

    // -------------------------------------------------------------------------
    // Coins and flowers
    // -------------------------------------------------------------------------

    function voxelCoin(x, y, z, rotationY = 0, scale = 1) {
      const coin = new THREE.Group();
      coin.position.set(x, y, z);
      coin.rotation.y = rotationY;
      coin.scale.setScalar(scale);

      coin.add(
        cube(0.25, materials.coin, 0, 0, 0)
      );

      // Pixel hole.
      coin.add(
        cube(
          0.07,
          materials.pipeDark,
          0,
          0.015,
          0.14
        )
      );

      return coin;
    }

    const coinPositions = [
      [0.64, 1.03, -0.2],
      [0.78, 1.08, -0.45],
      [-1.03, 1.02, 0.38],
      [-0.87, 1.08, 0.58]
    ];

    for (const [x, y, z] of coinPositions) {
      const coin = voxelCoin(x, y, z, Math.random() * Math.PI, 0.75);
      block.add(coin);
    }

    function voxelFlower(x, y, z, rotationY = 0, scale = 1) {
      const flower = new THREE.Group();
      flower.position.set(x, y, z);
      flower.rotation.y = rotationY;
      flower.scale.setScalar(scale);

      flower.add(
        cube(0.12, materials.flowerDark, 0, 0, 0)
      );

      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        flower.add(
          cube(
            0.11,
            materials.flower,
            Math.cos(angle) * 0.13,
            0.12,
            Math.sin(angle) * 0.13
          )
        );
      }

      return flower;
    }

    const flowerPositions = [
      [-1.22, 0.9, 0.48, 0.25],
      [-0.98, 0.9, 0.6, 0.2],
      [0.56, 0.9, 0.48, 0.22],
      [0.83, 0.9, 0.57, 0.2]
    ];

    for (const [x, y, z, scale] of flowerPositions) {
      const flower = voxelFlower(x, y, z, Math.random() * Math.PI, scale);
      block.add(flower);
    }

    // -------------------------------------------------------------------------
    // Small bird
    // -------------------------------------------------------------------------

    const bird = new THREE.Group();
    bird.position.set(-1.2, 1.15, 0.65);
    bird.rotation.y = -0.5;

    bird.add(
      cube(0.2, materials.bird, 0, 0, 0)
    );
    bird.add(
      cube(0.09, materials.bird, 0.1, 0, 0.08)
    );
    bird.add(
      cube(0.08, materials.bird, -0.1, 0, -0.08)
    );

    block.add(bird);

    // -------------------------------------------------------------------------
    // Orbit controls implemented directly
    // -------------------------------------------------------------------------

    const controls = {
      theta: 0.72,
      phi: 1.02,
      radius: 8.4,
      target: new THREE.Vector3(0, 1.15, 0),
      dragging: false,
      previousX: 0,
      previousY: 0
    };

    function updateCamera() {
      const sinPhi = Math.sin(controls.phi);
      camera.position.set(
        controls.target.x + controls.radius * sinPhi * Math.sin(controls.theta),
        controls.target.y + controls.radius * Math.cos(controls.phi),
        controls.target.z + controls.radius * sinPhi * Math.cos(controls.theta)
      );
      camera.lookAt(controls.target);
    }

    function resetCamera() {
      controls.theta = 0.72;
      controls.phi = 1.02;
      controls.radius = 8.4;
      controls.target.set(0, 1.15, 0);
      updateCamera();
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.previousX = event.clientX;
      controls.previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.previousX;
      const dy = event.clientY - controls.previousY;

      controls.previousX = event.clientX;
      controls.previousY = event.clientY;

      controls.theta -= dx * 0.008;
      controls.phi = THREE.MathUtils.clamp(
        controls.phi - dy * 0.006,
        0.35,
        1.42
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      if (event.pointerId !== undefined) {
        if (renderer.domElement.hasPointerCapture(event.pointerId)) {
          renderer.domElement.releasePointerCapture(event.pointerId);
        }
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.006,
          5.2,
          13
        );
        updateCamera();
      },
      { passive: false }
    );

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    resetCamera();

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Gentle floating motion for the entire scene.
      block.position.y = Math.sin(elapsed * 0.85) * 0.035;
      block.rotation.y = Math.sin(elapsed * 0.45) * 0.025;

      // Bird wings flap.
      bird.children[0].rotation.z = Math.sin(elapsed * 5.5) * 0.25;
      bird.children[1].rotation.z = -Math.sin(elapsed * 5.5) * 0.25;

      // Coins gently bob.
      const coins = block.children.filter((child) =>
        child.geometry?.type === "BoxGeometry" &&
        child.material === materials.coin
      );

      for (const coin of coins) {
        coin.position.y += Math.sin(elapsed * 1.3 + coin.position.x) * 0.0008;
      }

      renderer.render(scene, camera);
    }

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
    relic: { id: "generic", name: "Super Mario Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x177cff, fogColor: 0x177cff, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
