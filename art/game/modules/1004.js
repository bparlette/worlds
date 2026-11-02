// @world {"id": "1004", "title": "Super Mario World", "sub": "Yoshi's Island 1", "system": "3D Render"}
// Converted from 1004-super_mario_world_yoshix27s_island_1.html into a Back Roms World Walker module.

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

    

    // ------------------------------------------------------------
    // Scene setup
    // ------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x0c6670);
    scene.fog = new THREE.Fog(0x0c6670, 28, 62);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------

    const hemisphere = new THREE.HemisphereLight(
      0xb9f4ff,
      0x36562b,
      2.1
    );
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xfff0c4, 3.2);
    sun.position.set(12, 22, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 65;
    sun.shadow.bias = -0.0008;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x65d7ff, 1.1);
    fill.position.set(-15, 8, -12);
    scene.add(fill);

    // ------------------------------------------------------------
    // Materials
    // ------------------------------------------------------------

    const materials = {
      grass: new THREE.MeshStandardMaterial({
        color: 0x68d94d,
        roughness: 0.88,
        metalness: 0.02
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x3b9c38,
        roughness: 0.95
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x8ee469,
        roughness: 0.85
      }),
      soil: new THREE.MeshStandardMaterial({
        color: 0xa9783b,
        roughness: 1
      }),
      soilDark: new THREE.MeshStandardMaterial({
        color: 0x6f4b28,
        roughness: 1
      }),
      pipe: new THREE.MeshStandardMaterial({
        color: 0x91a5aa,
        roughness: 0.72,
        metalness: 0.08
      }),
      pipeDark: new THREE.MeshStandardMaterial({
        color: 0x4d6067,
        roughness: 0.78
      }),
      greenPipe: new THREE.MeshStandardMaterial({
        color: 0x39c96b,
        roughness: 0.65
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xffd54a,
        roughness: 0.48,
        metalness: 0.12
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x68b9d3,
        roughness: 0.82
      }),
      blueLight: new THREE.MeshStandardMaterial({
        color: 0x9bd9e8,
        roughness: 0.8
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xe9f7f3,
        roughness: 0.9
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x102c32,
        roughness: 0.92
      }),
      purple: new THREE.MeshStandardMaterial({
        color: 0x8d67d6,
        roughness: 0.85
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xd95b58,
        roughness: 0.8
      })
    };

    // ------------------------------------------------------------
    // Voxel helpers
    // ------------------------------------------------------------

    const sceneObjects = [];

    function addBox(
      x,
      y,
      z,
      width,
      height,
      depth,
      material,
      castShadow = true,
      receiveShadow = true
    ) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      sceneObjects.push(mesh);
      return mesh;
    }

    function addCylinder(
      x,
      y,
      z,
      radius,
      height,
      material,
      radialSegments = 12
    ) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          radius,
          radius,
          height,
          radialSegments
        ),
        material
      );

      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      sceneObjects.push(mesh);
      return mesh;
    }

    function addRoundedVoxel(
      x,
      y,
      z,
      width,
      height,
      depth,
      material
    ) {
      // A rounded voxel is made from a lower box and a slightly
      // smaller top cap, creating a stepped rounded silhouette.
      addBox(
        x,
        y - height * 0.42,
        z,
        width,
        height * 0.84,
        depth,
        material
      );

      addBox(
        x,
        y + height * 0.1,
        z,
        width * 0.88,
        height * 0.16,
        depth * 0.88,
        material
      );
    }

    // ------------------------------------------------------------
    // Ground island
    // ------------------------------------------------------------

    addBox(
      0,
      -0.85,
      0,
      38,
      1.2,
      24,
      materials.soilDark
    );

    addBox(
      0,
      -0.28,
      0,
      39,
      0.55,
      25,
      materials.soil
    );

    addBox(
      0,
      0.08,
      0,
      40,
      0.32,
      26,
      materials.grassDark
    );

    // Main grassy platform.
    addBox(
      0,
      0.32,
      0,
      40,
      0.5,
      26,
      materials.grass
    );

    // Uneven foreground edge made from individual grass blocks.
    for (let x = -19; x <= 19; x += 2) {
      const variation = Math.sin(x * 0.75) * 0.65;
      addBox(
        x + variation,
        0.48,
        12.8,
        1.75,
        0.35,
        1.25,
        materials.grassLight
      );
    }

    // ------------------------------------------------------------
    // Left side: green and gray pipes
    // ------------------------------------------------------------

    const pipeRows = [
      [-15.8, 0.85, 8.3, 4.2],
      [-13.8, 0.85, 8.5, 3.2],
      [-11.8, 0.85, 8.7, 2.2],
      [-9.8, 0.85, 8.9, 1.2]
    ];

    for (const [x, y, z, count] of pipeRows) {
      for (let i = 0; i < count; i++) {
        const px = x + i * 1.1;
        const pipe = addCylinder(
          px,
          y,
          z,
          0.62,
          0.9,
          i % 3 === 0 ? materials.greenPipe : materials.pipe
        );

        // Dark opening on the front side.
        addBox(
          px,
          y,
          z + 0.61,
          0.68,
          0.42,
          0.08,
          materials.black
        );

        // Top rim highlight.
        addBox(
          px,
          y + 0.49,
          z + 0.12,
          0.78,
          0.12,
          0.72,
          materials.grassLight
        );
      }
    }

    // A row of short gray pipes.
    for (let i = 0; i < 7; i++) {
      const pipe = addCylinder(
        15.7 + i * 0.9,
        0.82,
        8.2,
        0.55,
        0.85,
        materials.pipe
      );

      addBox(
        15.7 + i * 0.9,
        1.29,
        8.7,
        0.7,
        0.13,
        0.12,
        materials.pipeDark
      );
    }

    // ------------------------------------------------------------
    // Obstacles and decorations
    // ------------------------------------------------------------

    // Hurdle.
    addBox(
      -5.4,
      1.05,
      4.6,
      0.13,
      2.1,
      0.13,
      materials.white
    );

    addBox(
      -6.05,
      1.05,
      4.6,
      0.75,
      0.13,
      0.13,
      materials.white
    );

    addBox(
      -4.75,
      1.05,
      4.6,
      0.75,
      0.13,
      0.13,
      materials.white
    );

    addBox(
      -5.4,
      0.58,
      4.6,
      1.3,
      0.13,
      0.13,
      materials.white
    );

    // Small bushes.
    for (const [x, z, scale] of [
      [-10.5, 5.2, 1.2],
      [-8.9, 5.5, 0.85],
      [3.2, 9.2, 1.1],
      [5.2, 8.7, 0.75],
      [10.5, 10.0, 1.25]
    ]) {
      addBox(
        x,
        0.55 * scale,
        z,
        1.2 * scale,
        1.1 * scale,
        1.0 * scale,
        materials.grassDark
      );

      addBox(
        x + 0.25 * scale,
        0.95 * scale,
        z - 0.1 * scale,
        0.9 * scale,
        0.8 * scale,
        0.9 * scale,
        materials.grassLight
      );
    }

    // Small tree.
    addCylinder(
      10.7,
      1.15,
      10.2,
      0.42,
      1.8,
      materials.soilDark
    );

    addBox(
      10.7,
      2.15,
      10.2,
      1.45,
      1.25,
      1.45,
      materials.grassDark
    );

    addBox(
      10.7,
      2.95,
      10.2,
      1.1,
      0.9,
      1.1,
      materials.grassLight
    );

    // A little red flag.
    const flag = addBox(
      13.2,
      1.7,
      10.7,
      0.08,
      1.15,
      0.7,
      materials.red
    );
    flag.rotation.y = -0.12;

    // ------------------------------------------------------------
    // Right side: stepped platforms and slide
    // ------------------------------------------------------------

    // Lower block.
    addBox(
      6.4,
      0.85,
      5.4,
      4.2,
      1.7,
      4.2,
      materials.soil
    );

    addBox(
      6.4,
      1.72,
      5.4,
      4.4,
      0.35,
      4.4,
      materials.grass
    );

    // Middle block.
    addBox(
      6.4,
      2.05,
      2.5,
      3.8,
      2.1,
      3.5,
      materials.soil
    );

    addBox(
      6.4,
      3.1,
      2.5,
      4.0,
      0.35,
      3.7,
      materials.grass
    );

    // Slide ramp.
    addBox(
      6.4,
      3.48,
      0.7,
      4.1,
      0.45,
      7.6,
      materials.soil
    );

    addBox(
      6.4,
      4.1,
      -2.8,
      4.35,
      0.35,
      7.85,
      materials.grass
    );

    // Gold coin on the slide.
    const coin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.48, 0.18, 24),
      materials.gold
    );
    coin.position.set(6.4, 4.35, -2.7);
    coin.castShadow = true;
    scene.add(coin);
    sceneObjects.push(coin);

    // Coin ring around the coin.
    const coinRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.09, 8, 24),
      materials.gold
    );
    coinRing.position.set(6.4, 4.35, -2.7);
    coinRing.rotation.x = Math.PI / 2;
    coinRing.castShadow = true;
    scene.add(coinRing);
    sceneObjects.push(coinRing);

    // A small yellow cube.
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.7, 0.7),
      materials.gold
    );
    cube.position.set(-1.4, 1.05, 7.2);
    cube.rotation.y = 0.25;
    cube.castShadow = true;
    scene.add(cube);
    sceneObjects.push(cube);

    // ------------------------------------------------------------
    // Background mountains / voxel clouds
    // ------------------------------------------------------------

    const mountainMaterials = [
      materials.blue,
      materials.blueLight,
      materials.white
    ];

    const mountainData = [
      [-15, 4.8, -12, 5.5, 7],
      [-9, 5.8, -15, 6.5, 8],
      [-2, 4.8, -17, 5.8, 7],
      [6, 5.7, -15, 6.8, 8],
      [13, 4.7, -17, 6, 7],
      [20, 5.2, -13, 6.5, 8],
      [-18, 3.8, -4, 4.8, 6],
      [17, 4.2, -3, 5.2, 7],
      [-6, 3.6, 1, 4.5, 5]
    ];

    for (const [x, y, z, width, height] of mountainData) {
      addRoundedVoxel(
        x,
        y,
        z,
        width,
        height,
        4.8,
        mountainMaterials[Math.floor(Math.random() * mountainMaterials.length)]
      );
    }

    // Stylized cloud clusters.
    const cloudMaterial = materials.white;
    const cloudData = [
      [-12, 8.5, -23, 4.2],
      [-3, 9.5, -26, 5.0],
      [8, 8.8, -24, 4.8],
      [18, 10.0, -27, 5.5],
      [27, 7.5, -20, 4.0],
      [-25, 6.8, -18, 3.5]
    ];

    for (const [x, y, z, width] of cloudData) {
      for (let i = 0; i < 3; i++) {
        const cx = x + (i - 1) * 1.35;
        addRoundedVoxel(
          cx,
          y + Math.sin(i * 1.7) * 0.35,
          z,
          2.2,
          1.15,
          1.7,
          cloudMaterial
        );
      }
    }

    // ------------------------------------------------------------
    // Floating particles
    // ------------------------------------------------------------

    const particleCount = 90;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 42;
      particlePositions[i * 3 + 1] = Math.random() * 13 + 0.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 34;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xe9ffff,
        size: 0.12,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      })
    );

    scene.add(particles);

    // ------------------------------------------------------------
    // Custom camera controls
    // ------------------------------------------------------------

    const cameraState = {
      azimuth: 0.68,
      polar: 1.12,
      radius: 34,
      target: new THREE.Vector3(0, 2.2, 1)
    };

    const initialCamera = { ...cameraState };

    function updateCamera() {
      const sinPolar = Math.sin(cameraState.polar);
      camera.position.set(
        cameraState.target.x +
          cameraState.radius * sinPolar * Math.sin(cameraState.azimuth),
        cameraState.target.y +
          cameraState.radius * Math.cos(cameraState.polar),
        cameraState.target.z +
          cameraState.radius * sinPolar * Math.cos(cameraState.azimuth)
      );

      camera.lookAt(cameraState.target);
    }

    updateCamera();

    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const deltaX = event.clientX - previousX;
      const deltaY = event.clientY - previousY;

      previousX = event.clientX;
      previousY = event.clientY;

      cameraState.azimuth -= deltaX * 0.006;
      cameraState.polar = THREE.MathUtils.clamp(
        cameraState.polar - deltaY * 0.005,
        0.35,
        1.48
      );

      updateCamera();
    });

    renderer.domElement.addEventListener("pointerup", (event) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    });

    renderer.domElement.addEventListener("pointercancel", () => {
      dragging = false;
    });

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();

        cameraState.radius = THREE.MathUtils.clamp(
          cameraState.radius + event.deltaY * 0.025,
          16,
          55
        );

        updateCamera();
      },
      { passive: false }
    );

    // ------------------------------------------------------------
    // Keyboard movement
    // ------------------------------------------------------------

    const keys = new Set();

    window.addEventListener("keydown", (event) => {
      keys.add(event.key.toLowerCase());

      if (
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
      }
    });

    window.addEventListener("keyup", (event) => {
      keys.delete(event.key.toLowerCase());
    });

    const movement = new THREE.Vector3();

    if (keys.has("arrowleft")) movement.x -= 1;
    if (keys.has("arrowright")) movement.x += 1;
    if (keys.has("arrowup")) movement.z -= 1;
    if (keys.has("arrowdown")) movement.z += 1;

    function updateMovement() {
      const speed = 4.5;
      const length = movement.length();

      if (length > 1) {
        movement.normalize().multiplyScalar(speed);
      }

      cameraState.target.add(movement);
      cameraState.target.x = THREE.MathUtils.clamp(
        cameraState.target.x,
        -12,
        12
      );
      cameraState.target.z = THREE.MathUtils.clamp(
        cameraState.target.z,
        -8,
        10
      );

      updateCamera();
    }

    // ------------------------------------------------------------
    // Score collection
    // ------------------------------------------------------------

    let score = 0;
    const scoreValue = dummyEl();

    const collectedCoins = [];

    for (const object of sceneObjects) {
      if (
        object.geometry?.type === "CylinderGeometry" ||
        object.geometry?.type === "TorusGeometry"
      ) {
        collectedCoins.push(object);
      }
    }

    // The coin and ring are already in sceneObjects; mark them collected.
    collectedCoins[0].userData.collected = true;
    collectedCoins[1].userData.collected = true;

    function checkCoins() {
      for (const coin of collectedCoins) {
        if (!coin.userData.collected) {
          score += 100;
          scoreValue.textContent = score;
          coin.userData.collected = true;
          break;
        }
      }
    }

    // ------------------------------------------------------------
    // Animation
    // ------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.05);

      // Gentle coin rotation.
      coin.rotation.y += delta * 0.55;
      coinRing.rotation.z += delta * 0.25;

      // Floating particles drift upward and wrap.
      const positions = particleGeometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += delta * 0.12;

        if (positions[i * 3 + 1] > 14) {
          positions[i * 3 + 1] = 0.3;
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;

      // Subtle flag flutter.
      flag.rotation.z = Math.sin(elapsed * 2.2) * 0.08;

      // Check for collected coins once per second.
      if (clock.elapsedTime > 1.5) {
        checkCoins();
      }

      // Keyboard movement.
      updateMovement();

      renderer.render(scene, camera);
    }

    animate();

    // ------------------------------------------------------------
    // Resize
    // ------------------------------------------------------------

    window.addEventListener("resize", () => {
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
    spawn: { x: 0.0, z: -13.0, yaw: 0 },
    relic: { id: "generic", name: "Super Mario World Relic", x: -10.0, z: 13.0 },
    env:   { background: 0x0c6670, fogColor: 0x0c6670, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -9.0 },
      prev: { x: -12.0, z: 11.0 },
      east: { x: 12.0, z: 11.0 },
      west: { x: -12.0, z: -9.0 }
    }
  };
}
