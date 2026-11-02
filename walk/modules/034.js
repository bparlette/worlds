// @world {"id": "034", "title": "Mario Kart 8", "sub": "Bowser&#x27;s Castle", "system": "Console"}
// Converted from  into a Back Roms World Walker module.

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
      render: () => {}
    };
  }

  function dummyCamera() {
    return {
      position: (() => { const v = { set: () => v, copy: () => v, add: () => v, sub: () => v, addScaledVector: () => v, clone: () => v }; return v; })(),
      lookAt: () => {},
      updateProjectionMatrix: () => {}
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
  const container = dummyEl();
  const stage = dummyEl();
  const app = dummyEl();
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

    

    // ------------------------------------------------------------
    // Renderer and scene
    // ------------------------------------------------------------
    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // scene redirect
    scene.background = new THREE.Color(0x170d08);
    scene.fog = new THREE.FogExp2(0x170d08, 0.016);

    camera = dummyCamera();

    // ------------------------------------------------------------
    // Direct orbit controls, implemented without addons
    // ------------------------------------------------------------
    const controls = {
      theta: 0.18,
      phi: 1.05,
      radius: 24,
      target: new THREE.Vector3(0, 5.4, 0),
      dragging: false,
      lastX: 0,
      lastY: 0
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

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;

      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.theta -= dx * 0.006;
      controls.phi = THREE.MathUtils.clamp(
        controls.phi - dy * 0.005,
        0.35,
        1.43
      );

      updateCamera();
    });

    function stopDragging(event) {
      controls.dragging = false;
      if (event.pointerId !== undefined) {
        try {
          renderer.domElement.releasePointerCapture(event.pointerId);
        } catch (_) {}
      }
    }

    renderer.domElement.addEventListener("pointerup", stopDragging);
    renderer.domElement.addEventListener("pointercancel", stopDragging);

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.015,
          13,
          42
        );
        updateCamera();
      },
      { passive: false }
    );

    updateCamera();

    // ------------------------------------------------------------
    // Materials
    // ------------------------------------------------------------
    const materials = {
      stone: new THREE.MeshStandardMaterial({
        color: 0x697078,
        roughness: 0.92,
        metalness: 0.02
      }),
      stoneDark: new THREE.MeshStandardMaterial({
        color: 0x3f4951,
        roughness: 0.96
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0x879097,
        roughness: 0.88
      }),
      mortar: new THREE.MeshStandardMaterial({
        color: 0x30383d,
        roughness: 1
      }),
      iron: new THREE.MeshStandardMaterial({
        color: 0x25292d,
        roughness: 0.55,
        metalness: 0.75
      }),
      bronze: new THREE.MeshStandardMaterial({
        color: 0x9a6829,
        roughness: 0.48,
        metalness: 0.62
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xd4a74d,
        roughness: 0.38,
        metalness: 0.72
      }),
      banner: new THREE.MeshStandardMaterial({
        color: 0x6b1717,
        roughness: 0.9,
        side: THREE.DoubleSide
      }),
      bannerGold: new THREE.MeshStandardMaterial({
        color: 0xc38c32,
        roughness: 0.75
      }),
      skull: new THREE.MeshStandardMaterial({
        color: 0xe8d6b4,
        roughness: 0.7
      }),
      flame: new THREE.MeshBasicMaterial({
        color: 0xff7b13,
        toneMapped: false
      }),
      flameOrange: new THREE.MeshBasicMaterial({
        color: 0xff4b08,
        toneMapped: false
      }),
      path: new THREE.MeshStandardMaterial({
        color: 0x9a7448,
        roughness: 1
      }),
      ground: new THREE.MeshStandardMaterial({
        color: 0x493125,
        roughness: 1
      }),
      rock: new THREE.MeshStandardMaterial({
        color: 0x4a3a30,
        roughness: 1
      })
    };

    // ------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------
    const castle = new THREE.Group();
    scene.add(castle);

    const voxelSize = 0.62;

    function addBox(
      parent,
      size,
      position,
      material,
      castShadow = true,
      receiveShadow = true
    ) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size.x, size.y, size.z),
        material
      );

      mesh.position.copy(position);
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
      segments = 12
    ) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          height,
          segments
        ),
        material
      );

      mesh.position.copy(position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function addWallSegment(parent, x, z, length, height, y, material) {
      return addBox(
        parent,
        new THREE.Vector3(length, height, 0.62),
        new THREE.Vector3(x, y, z),
        material
      );
    }

    function addCrenellations(parent, x, z, length, y, material) {
      const count = Math.max(2, Math.floor(length / voxelSize));
      const step = length / count;

      for (let i = 0; i < count; i++) {
        const px = x - length / 2 + step * (i + 0.5);
        addBox(
          parent,
          new THREE.Vector3(step * 0.64, 0.52, 0.58),
          new THREE.Vector3(px, y, z),
          material
        );
      }
    }

    function addBandedBanner(parent, x, y, z, width = 1.25, height = 3.2) {
      addBox(
        parent,
        new THREE.Vector3(width, height, 0.16),
        new THREE.Vector3(x, y, z),
        materials.banner
      );

      for (const side of [-1, 1]) {
        addBox(
          parent,
          new THREE.Vector3(0.11, height + 0.15, 0.24),
          new THREE.Vector3(x + side * width * 0.48, y, z + 0.02),
          materials.bannerGold
        );
      }

      addBox(
        parent,
        new THREE.Vector3(0.48, 0.48, 0.22),
        new THREE.Vector3(x, y, z + 0.04),
        materials.gold
      );
    }

    function addLamp(parent, x, y, z) {
      addBox(
        parent,
        new THREE.Vector3(0.22, 0.34, 0.22),
        new THREE.Vector3(x, y, z),
        materials.iron
      );

      addBox(
        parent,
        new THREE.Vector3(0.25, 0.24, 0.25),
        new THREE.Vector3(x, y + 0.22, z),
        new THREE.MeshStandardMaterial({
          color: 0xffc66e,
          emissive: 0xff8a22,
          emissiveIntensity: 2.4,
          roughness: 0.5
        })
      );
    }

    // ------------------------------------------------------------
    // Terrain
    // ------------------------------------------------------------
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      materials.ground
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.35;
    ground.receiveShadow = true;
    scene.add(ground);

    // Low voxel hills around the castle.
    for (let i = 0; i < 26; i++) {
      const angle = (i / 26) * Math.PI * 2 + 0.2;
      const radius = 14 + (i % 5) * 1.7;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const size = 2.2 + (i % 3) * 0.7;

      const rock = addBox(
        scene,
        new THREE.Vector3(size, size * 0.55, size),
        new THREE.Vector3(x, -0.15, z),
        materials.rock,
        false,
        true
      );

      rock.rotation.y = (i * 0.7) % Math.PI;
    }

    // ------------------------------------------------------------
    // Castle base and central keep
    // ------------------------------------------------------------
    addBox(
      castle,
      new THREE.Vector3(22, 1.1, 15),
      new THREE.Vector3(0, 0.55, 0),
      materials.stoneDark
    );

    // Main keep
    addBox(
      castle,
      new THREE.Vector3(7.2, 10.5, 7.4),
      new THREE.Vector3(0, 5.75, 0),
      materials.stone
    );

    // Keep upper section
    addBox(
      castle,
      new THREE.Vector3(6.2, 4.7, 6.4),
      new THREE.Vector3(0, 12.25, 0),
      materials.stone
    );

    addCrenellations(castle, 0, 0, 7.4, 14.75, materials.stoneLight);
    addCrenellations(castle, 0, 0, 6.4, 14.75, materials.stoneLight);

    // Central horned keep cap
    addBox(
      castle,
      new THREE.Vector3(4.8, 1.2, 4.8),
      new THREE.Vector3(0, 15.3, 0),
      materials.iron
    );

    addBox(
      castle,
      new THREE.Vector3(3.4, 0.65, 3.4),
      new THREE.Vector3(0, 16.3, 0),
      materials.iron
    );

    // Horns, made from stacked angular blocks
    for (const side of [-1, 1]) {
      const horn = new THREE.Group();
      horn.position.set(side * 2.05, 17.1, 0);
      horn.rotation.z = side * -0.2;

      addBox(
        horn,
        new THREE.Vector3(0.8, 2.1, 0.75),
        new THREE.Vector3(0, 0.7, 0),
        materials.iron
      );

      addBox(
        horn,
        new THREE.Vector3(1.25, 0.65, 0.85),
        new THREE.Vector3(0, 0.15, 0),
        materials.iron
      );

      addBox(
        horn,
        new THREE.Vector3(0.42, 1.7, 0.55),
        new THREE.Vector3(side * 0.45, 1.1, 0),
        materials.iron
      );

      castle.add(horn);
    }

    // ------------------------------------------------------------
    // Towers
    // ------------------------------------------------------------
    const towerPositions = [
      [-7.1, 7.0],
      [-4.7, 8.7],
      [4.7, 8.7],
      [7.1, 7.0],
      [-8.4, -4.0],
      [-5.0, -7.0],
      [5.0, -7.0],
      [8.4, -4.0],
      [-8.4, 4.0],
      [8.4, 4.0]
    ];

    for (const [x, z] of towerPositions) {
      const height = 6.2 + (Math.abs(x) > 6 ? 1.0 : 0);

      addCylinder(
        castle,
        2.0,
        2.35,
        height,
        new THREE.Vector3(x, 3.8 + height / 2, z),
        materials.stone,
        16
      );

      addCylinder(
        castle,
        2.15,
        2.15,
        0.55,
        new THREE.Vector3(x, 3.2, z),
        materials.stoneLight,
        16
      );

      addCylinder(
        castle,
        2.15,
        2.15,
        0.55,
        new THREE.Vector3(x, height + 3.2, z),
        materials.stoneLight,
        16
      );

      addCrenellations(
        castle,
        x,
        z,
        4.5,
        height + 3.55,
        materials.stoneLight
      );

      // Arrow slit
      addBox(
        castle,
        new THREE.Vector3(0.42, 1.25, 0.18),
        new THREE.Vector3(x, height + 4.0, z + 2.03),
        materials.iron
      );
    }

    // Front gate towers
    addCylinder(
      castle,
      2.1,
      2.4,
      5.2,
      new THREE.Vector3(-3.4, 3.1, 4.7),
      materials.stone,
      16
    );

    addCylinder(
      castle,
      2.1,
      2.4,
      5.2,
      new THREE.Vector3(3.4, 3.1, 4.7),
      materials.stone,
      16
    );

    addCrenellations(castle, -3.4, 4.7, 4.6, 5.8, materials.stoneLight);
    addCrenellations(castle, 3.4, 4.7, 4.6, 5.8, materials.stoneLight);

    // Gate arch: a dark recessed opening
    addBox(
      castle,
      new THREE.Vector3(3.6, 3.8, 0.35),
      new THREE.Vector3(0, 2.1, 3.85),
      materials.iron
    );

    // Build arch with wedge-like blocks
    for (let i = 0; i < 9; i++) {
      const angle = Math.PI * 0.12 + (i / 8) * (Math.PI * 0.76);
      const radius = 2.05;
      const block = addBox(
        castle,
        new THREE.Vector3(0.72, 0.65, 0.38),
        new THREE.Vector3(
          Math.sin(angle) * radius,
          0.45 + (i / 8) * 3.1,
          3.8
        ),
        materials.stoneLight
      );

      block.rotation.z = -angle + Math.PI / 2;
    }

    // Gateway emblem
    addBox(
      castle,
      new THREE.Vector3(2.0, 2.5, 0.28),
      new THREE.Vector3(0, 4.0, 4.1),
      materials.iron
    );

    // Skull made from voxels
    const skull = new THREE.Group();
    skull.position.set(0, 4.0, 4.34);

    addBox(
      skull,
      new THREE.Vector3(1.45, 1.05, 0.22),
      new THREE.Vector3(0, 0, 0),
      materials.skull
    );

    addBox(
      skull,
      new THREE.Vector3(0.52, 0.42, 0.25),
      new THREE.Vector3(0, -0.05, 0.02),
      materials.iron
    );

    for (const side of [-1, 1]) {
      addBox(
        skull,
        new THREE.Vector3(0.18, 0.42, 0.24),
        new THREE.Vector3(side * 0.39, 0.23, 0.02),
        materials.iron
      );
    }

    skull.rotation.x = -0.12;
    castle.add(skull);

    // ------------------------------------------------------------
    // Walls, gatehouse and decorative details
    // ------------------------------------------------------------
    addWallSegment(castle, -3.0, 3.7, 6.5, 4.0, 2.0, materials.stone);
    addWallSegment(castle, 3.0, 3.7, 6.5, 4.0, 2.0, materials.stone);

    addWallSegment(castle, -8.4, 0, 4.7, 6.8, 3.4, materials.stone);
    addWallSegment(castle, 8.4, 0, 4.7, 6.8, 3.4, materials.stone);
    addWallSegment(castle, 0, -7.0, 14.0, 5.2, 2.6, materials.stone);

    addCrenellations(castle, 0, -7.0, 14.0, 5.35, materials.stoneLight);

    // Side wall crenellations
    addCrenellations(castle, -8.4, 0, 4.7, 6.85, materials.stoneLight);
    addCrenellations(castle, 8.4, 0, 4.7, 6.85, materials.stoneLight);

    addCrenellations(castle, -3.4, 4.7, 4.6, 5.85, materials.stoneLight);
    addCrenellations(castle, 3.4, 4.7, 4.6, 5.85, materials.stoneLight);

    // Corner turrets
    for (const [x, z] of [
      [-10.5, 8.8],
      [10.5, 8.8],
      [-10.5, -9.0],
      [10.5, -9.0]
    ]) {
      addCylinder(
        castle,
        1.45,
        1.7,
        6.0,
        new THREE.Vector3(x, 3.0, z),
        materials.stone,
        14
      );

      addCrenellations(castle, x, z, 3.4, 6.1, materials.stoneLight);
    }

    // Flags and poles
    for (const [x, z, height] of [
      [-7.1, 7.0, 9.0],
      [7.1, 7.0, 9.0],
      [-8.4, 4.0, 7.0],
      [8.4, 4.0, 7.0]
    ]) {
      addCylinder(
        castle,
        0.07,
        0.09,
        height,
        new THREE.Vector3(x, 3.0 + height / 2, z),
        materials.iron,
        8
      );

      const flag = addBox(
        castle,
        new THREE.Vector3(1.6, 0.65, 0.12),
        new THREE.Vector3(x + 0.8, 3.0 + height, z),
        materials.banner
      );

      flag.rotation.y = -0.35;
    }

    // Banners
    addBandedBanner(castle, -2.0, 2.0, 3.95);
    addBandedBanner(castle, 2.0, 2.0, 3.95);
    addBandedBanner(castle, -3.4, 3.1, 6.75, 1.15, 2.7);
    addBandedBanner(castle, 3.4, 3.1, 6.75, 1.15, 2.7);

    // Wall lamps
    const lampPositions = [
      [-6.9, 6.2, 3.7],
      [-5.0, 6.2, 3.7],
      [5.0, 6.2, 3.7],
      [6.9, 6.2, 3.7],
      [-8.3, -0.5, 2.2],
      [8.3, -0.5, 2.2],
      [-8.3, 3.3, 2.2],
      [8.3, 3.3, 2.2],
      [-3.0, 4.4, 6.1],
      [3.0, 4.4, 6.1],
      [0, 4.5, -6.8],
      [-6.0, 4.5, -6.8],
      [6.0, 4.5, -6.8]
    ];

    for (const [x, y, z] of lampPositions) {
      addLamp(castle, x, y, z);
    }

    // ------------------------------------------------------------
    // Bridge and gate interior
    // ------------------------------------------------------------
    addBox(
      castle,
      new THREE.Vector3(5.8, 0.45, 2.2),
      new THREE.Vector3(0, 0.35, 7.3),
      materials.path
    );

    for (let i = 0; i < 11; i++) {
      addBox(
        castle,
        new THREE.Vector3(0.32, 0.35, 2.0),
        new THREE.Vector3(-2.5 + i * 0.5, 0.68, 7.3),
        materials.stoneLight
      );
    }

    // Gate interior floor
    addBox(
      castle,
      new THREE.Vector3(3.3, 0.12, 3.0),
      new THREE.Vector3(0, 0.25, 4.0),
      materials.path
    );

    // Gate side cannons
    for (const side of [-1, 1]) {
      const cannon = new THREE.Group();
      cannon.position.set(side * 3.0, 0.75, 5.5);
      cannon.rotation.y = side * -0.25;

      addBox(
        cannon,
        new THREE.Vector3(0.8, 0.45, 0.55),
        new THREE.Vector3(0, 0, 0),
        materials.iron
      );

      addCylinder(
        cannon,
        0.14,
        0.14,
        1.25,
        new THREE.Vector3(0, 0.05, 0.9),
        materials.iron,
        10
      ).rotation.z = Math.PI / 2;

      castle.add(cannon);
    }

    // Chains
    for (const side of [-1, 1]) {
      const chain = new THREE.Group();
      chain.position.set(side * 2.55, 0.65, 4.2);

      for (let i = 0; i < 8; i++) {
        addBox(
          chain,
          new THREE.Vector3(0.16, 0.38, 0.16),
          new THREE.Vector3(side * 0.16, -0.18, i * 0.32),
          materials.iron
        );
      }

      castle.add(chain);
    }

    // ------------------------------------------------------------
    // Lava foreground
    // ------------------------------------------------------------
    const lava = new THREE.Group();
    scene.add(lava);

    addBox(
      lava,
      new THREE.Vector3(13, 0.18, 3.0),
      new THREE.Vector3(0, -0.08, 7.8),
      materials.flame,
      false,
      false
    );

    addBox(
      lava,
      new THREE.Vector3(8.0, 0.18, 2.2),
      new THREE.Vector3(0, -0.08, -8.0),
      materials.flameOrange,
      false,
      false
    );

    // Animated lava particles
    const lavaParticles = [];

    for (let i = 0; i < 28; i++) {
      const material = Math.random() > 0.5 ? materials.flame : materials.flameOrange;

      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(
          0.12 + Math.random() * 0.22,
          7,
          5
        ),
        material
      );

      particle.position.set(
        (Math.random() - 0.5) * 12,
        0.15,
        6.4 + Math.random() * 1.2
      );

      particle.userData.speed = 0.45 + Math.random() * 0.65;
      particle.userData.phase = Math.random() * Math.PI * 2;
      particle.userData.baseY = particle.position.y;

      lava.add(particle);
      lavaParticles.push(particle);
    }

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------
    const hemisphere = new THREE.HemisphereLight(
      0x6b7180,
      0x2a130b,
      0.75
    );
    scene.add(hemisphere);

    const ambient = new THREE.AmbientLight(0x806044, 0.35);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffd2a0, 2.4);
    sun.position.set(12, 18, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 55;
    sun.shadow.bias = -0.00035;
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x8ba7c4, 1.1);
    rim.position.set(-15, 10, -12);
    scene.add(rim);

    const gateLight = new THREE.PointLight(0xff8b32, 10, 8, 2);
    gateLight.position.set(0, 2.5, 5.5);
    scene.add(gateLight);

    const topLight = new THREE.PointLight(0xffa34a, 8, 10, 2);
    topLight.position.set(0, 16, 0);
    scene.add(topLight);

    // ------------------------------------------------------------
    // Resize
    // ------------------------------------------------------------
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ------------------------------------------------------------
    // Animation
    // ------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Gentle flame flicker.
      for (let i = 0; i < lavaParticles.length; i++) {
        const particle = lavaParticles[i];
        const t = elapsed * particle.userData.speed + particle.userData.phase;

        particle.position.y =
          particle.userData.baseY + Math.sin(t) * 0.25;
        particle.position.x +=
          Math.sin(t * 1.7 + i) * 0.0008;
        particle.scale.setScalar(
          0.8 + Math.sin(t * 2.0) * 0.2
        );
      }

      // Subtle horn glow.
      topLight.intensity = 7.5 + Math.sin(elapsed * 2.2) * 0.7;

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
    relic: { id: "generic", name: "Mario Kart 8 Relic", x: -10.0, z: 12.0 },
    env:   { background: 0x170d08, fogColor: 0x170d08, fogDensity: 0.016 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}
