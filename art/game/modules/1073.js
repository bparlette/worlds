// @world {"id": "1073", "title": "Kirby", "sub": "Battleship Halberd", "system": "3D Render"}
// Converted from 1073-kirby_battleship_halberd.html into a Back Roms World Walker module.

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
    // Renderer and scene
    // ------------------------------------------------------------

    container = dummyEl();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    // scene redirect
    scene.background = new THREE.Color(0x98502d);
    scene.fog = new THREE.Fog(0x98502d, 18, 38);

    camera = dummyCamera();

    // ------------------------------------------------------------
    // Voxel construction helpers
    // ------------------------------------------------------------

    const V = 0.28; // Main voxel size
    const model = new THREE.Group();
    scene.add(model);

    const materials = {
      hull: new THREE.MeshStandardMaterial({
        color: 0x424b50,
        roughness: 0.72,
        metalness: 0.48
      }),
      darkHull: new THREE.MeshStandardMaterial({
        color: 0x252d31,
        roughness: 0.78,
        metalness: 0.42
      }),
      steel: new THREE.MeshStandardMaterial({
        color: 0xaeb9b8,
        roughness: 0.38,
        metalness: 0.78
      }),
      paleSteel: new THREE.MeshStandardMaterial({
        color: 0xd5d9d3,
        roughness: 0.32,
        metalness: 0.68
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xc39743,
        roughness: 0.4,
        metalness: 0.72
      }),
      purple: new THREE.MeshStandardMaterial({
        color: 0x69438d,
        roughness: 0.72,
        metalness: 0.28
      }),
      wing: new THREE.MeshStandardMaterial({
        color: 0x5b3778,
        roughness: 0.78,
        metalness: 0.18
      }),
      wingEdge: new THREE.MeshStandardMaterial({
        color: 0x35224f,
        roughness: 0.7,
        metalness: 0.35
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xd77932,
        roughness: 0.65,
        metalness: 0.25
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x101416,
        roughness: 0.82,
        metalness: 0.25
      }),
      glass: new THREE.MeshStandardMaterial({
        color: 0x203b42,
        roughness: 0.18,
        metalness: 0.65,
        emissive: 0x07171a,
        emissiveIntensity: 0.55
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x70d8ff,
        roughness: 0.25,
        metalness: 0.2,
        emissive: 0x238cc7,
        emissiveIntensity: 1.4
      })
    };

    function addBox(parent, position, size, material, castShadow = true) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        material
      );
      mesh.position.set(...position);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function addVoxelColumn(
      parent,
      x,
      z,
      y,
      count,
      material,
      size = V
    ) {
      for (let i = 0; i < count; i++) {
        addBox(
          parent,
          [x, y + i * size, z],
          [size, size, size],
          material
        );
      }
    }

    function addCylinder(
      parent,
      position,
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
      mesh.position.set(...position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function addBarrel(parent, position, direction, radius = 0.16) {
      const group = new THREE.Group();
      group.position.set(...position);
      group.rotation.y = Math.atan2(direction[1], direction[0]);

      const barrel = addCylinder(
        group,
        [0, 0, 0],
        radius,
        0.95,
        materials.steel,
        12
      );

      const muzzle = addCylinder(
        group,
        [0, 0, 0.53],
        radius * 0.78,
        0.18,
        materials.darkHull,
        12
      );

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.72, 0.035, 6, 16),
        materials.gold
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.z = 0.42;
      group.add(ring);

      parent.add(group);
      return group;
    }

    function addSpire(parent, x, z, y, height, material) {
      addCylinder(parent, [x, y + height / 2, z], 0.14, height, material, 8);

      const cap = new THREE.Mesh(
        new THREE.ConeGeometry(0.2, 0.25, 8),
        material
      );
      cap.position.set(x, y + height + 0.12, z);
      cap.castShadow = true;
      parent.add(cap);
    }

    // ------------------------------------------------------------
    // Dragon-battleship hull
    // ------------------------------------------------------------

    const ship = new THREE.Group();
    ship.rotation.y = -0.18;
    model.add(ship);

    // Main elongated hull, assembled from visible square voxels.
    for (let x = -5; x <= 5; x++) {
      for (let z = -4; z <= 4; z++) {
        const taper = Math.max(
          0,
          1 - Math.abs(x) * 0.19 - Math.abs(z) * 0.14
        );

        const y = -1.35;
        const size = V * (0.88 + taper * 0.18);

        addBox(
          ship,
          [x * V, y, z * V],
          [size, V * 0.9, size],
          materials.hull
        );
      }
    }

    // Upper deck.
    for (let x = -4; x <= 4; x++) {
      for (let z = -3; z <= 3; z++) {
        const edge = Math.max(
          0,
          1 - Math.abs(x) * 0.25 - Math.abs(z) * 0.2
        );

        addBox(
          ship,
          [x * V, 0.18, z * V],
          [V, V * 0.75, V],
          materials.darkHull
        );
      }
    }

    // Main forward face / dragon helm.
    addBox(ship, [0, 0.35, 1.25], [2.15, 1.2, 0.7], materials.steel);
    addBox(ship, [0, 0.45, 1.64], [1.7, 0.7, 0.12], materials.paleSteel);
    addBox(ship, [0, 0.48, 1.74], [0.9, 0.22, 0.08], materials.gold);
    addBox(ship, [0, 0.48, 1.84], [0.62, 0.09, 0.06], materials.glass);

    // Helmet spikes.
    for (const x of [-0.62, 0, 0.62]) {
      addBox(ship, [x, 1.08, 1.32], [0.18, 0.68, 0.18], materials.paleSteel);
      addBox(ship, [x, 1.25, 1.32], [0.12, 0.3, 0.12], materials.gold);
    }

    // Side cheek plates and decorative runes.
    addBox(ship, [-0.86, 0.35, 0.86], [0.22, 0.72, 0.48], materials.paleSteel);
    addBox(ship, [0.86, 0.35, 0.86], [0.22, 0.72, 0.48], materials.paleSteel);

    // Small gold side ornaments.
    for (const side of [-1, 1]) {
      addBox(
        ship,
        [side * 1.02, 0.42, 0.78],
        [0.08, 0.34, 0.18],
        materials.gold
      );
    }

    // Back / rear tower and mast.
    addBox(ship, [0, 1.55, -1.15], [2.15, 0.85, 1.45], materials.hull);
    addBox(ship, [0, 2.0, -1.15], [1.7, 0.45, 1.1], materials.darkHull);

    addCylinder(ship, [0, 2.7, -1.15], 0.13, 1.1, materials.steel, 10);
    addCylinder(ship, [0, 3.28, -1.15], 0.19, 0.16, materials.gold, 10);
    addSpire(ship, -0.45, -1.15, 3.4, 0.75, materials.steel);
    addSpire(ship, 0.45, -1.15, 3.4, 0.75, materials.steel);

    // Rear gun turrets.
    addBarrel(ship, [-0.85, 1.9, -0.75], [-1, 0, 0]);
    addBarrel(ship, [0.85, 1.9, -0.75], [1, 0, 0]);
    addBarrel(ship, [0, 1.9, -2.3], [0, -1, 0]);

    // Side gun turrets.
    addBarrel(ship, [-1.75, 0.15, -0.35], [-1, 0, 0]);
    addBarrel(ship, [1.75, 0.15, -0.35], [1, 0, 0]);
    addBarrel(ship, [-1.72, 0.15, 1.0], [-1, 0, 0]);
    addBarrel(ship, [1.72, 0.15, 1.0], [1, 0, 0]);

    // Forward-facing main cannon.
    addBarrel(ship, [0, -0.4, 2.78], [0, -1, 0], 0.22);
    addCylinder(ship, [0, -0.4, 3.15], 0.22, 0.25, materials.darkHull, 14);

    // Secondary cannons.
    addBarrel(ship, [-1.35, 0.25, 2.55], [-1, 0, 0], 0.14);
    addBarrel(ship, [1.35, 0.25, 2.55], [1, 0, 0], 0.14);

    // Wings: voxel-built, broad dragon wings.
    for (const side of [-1, 1]) {
      const wing = new THREE.Group();
      wing.position.set(side * 0.25, 0.45, 0);
      wing.rotation.y = side * -0.12;
      ship.add(wing);

      // Root and upper wing.
      for (let i = 0; i < 7; i++) {
        const x = side * (0.55 + i * 0.55);
        const y = 0.25 + i * 0.1;
        const z = 0.05;
        const size = 0.48;

        addBox(
          wing,
          [x, y, z],
          [size, size, size],
          materials.wing
        );
      }

      // Lower, swept wing section.
      for (let i = 0; i < 6; i++) {
        const x = side * (1.85 + i * 0.58);
        const y = -0.55 - i * 0.12;
        const z = 0.15;
        const size = 0.44;

        addBox(
          wing,
          [x, y, z],
          [size, size, size],
          materials.wing
        );
      }

      // Wing leading-edge frame.
      for (let i = 0; i < 7; i++) {
        const x = side * (0.55 + i * 0.55);
        addBox(
          wing,
          [x, 0.55, 0.2],
          [0.13, 0.13, 0.13],
          materials.wingEdge
        );
      }

      // Wing trailing-edge frame.
      for (let i = 0; i < 6; i++) {
        const x = side * (1.85 + i * 0.58);
        addBox(
          wing,
          [x, -0.67, 0.13],
          [0.13, 0.13, 0.13],
          materials.wingEdge
        );
      }

      // Wing spars.
      for (const y of [0.2, -0.18]) {
        for (let i = 0; i < 5; i++) {
          addBox(
            wing,
            [side * (1.4 + i * 0.55), y, 0.05],
            [0.12, 0.12, 0.12],
            materials.wingEdge
          );
        }
      }

      // Wing claws.
      for (let i = 0; i < 3; i++) {
        const x = side * (3.1 + i * 0.34);
        addBox(wing, [x, -1.35, 0.15], [0.22, 0.62, 0.18], materials.wingEdge);
        addBox(wing, [x, -1.67, 0.15], [0.14, 0.3, 0.14], materials.gold);
      }

      // Wing roots and armor.
      addBox(wing, [side * 0.7, 0.25, 0], [0.6, 0.75, 0.65], materials.darkHull);
      addBox(wing, [side * 0.7, 0.3, 0], [0.4, 0.45, 0.16], materials.gold);
    }

    // Ventral tail and tail spikes.
    addBox(ship, [0, -1.65, -1.75], [1.05, 0.5, 0.7], materials.darkHull);
    addBox(ship, [0, -2.05, -2.25], [0.65, 0.35, 0.45], materials.hull);

    for (let i = 0; i < 4; i++) {
      addBox(
        ship,
        [0, -2.35 - i * 0.22, -2.48 - i * 0.08],
        [0.16, 0.48, 0.16],
        materials.steel
      );
    }

    // Tail fin.
    addBox(ship, [0, -2.65, -2.72], [0.55, 0.35, 0.18], materials.wing);
    addBox(ship, [0, -2.86, -2.72], [0.38, 0.2, 0.12], materials.gold);

    // Side fins.
    for (const side of [-1, 1]) {
      addBox(ship, [side * 1.45, -0.75, -1.7], [0.35, 0.45, 0.6], materials.wing);
    }

    // Small side details and exhaust.
    for (const side of [-1, 1]) {
      addBox(ship, [side * 1.25, -0.65, 0.55], [0.35, 0.35, 0.3], materials.darkHull);
    }

    const exhaust = addCylinder(
      ship,
      [0, -1.0, 0.4],
      0.13,
      0.65,
      materials.black,
      10
    );

    const exhaustGlow = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.12, 12),
      materials.blue
    );
    exhaustGlow.position.set(0, -1.3, 0.4);
    ship.add(exhaustGlow);

    // ------------------------------------------------------------
    // Island / map slab
    // ------------------------------------------------------------

    const island = new THREE.Group();
    island.position.set(0, -1.45, 2.6);
    island.rotation.y = -0.1;
    scene.add(island);

    const islandMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b4b25,
      roughness: 0.96,
      metalness: 0.02
    });

    const islandTopMaterial = new THREE.MeshStandardMaterial({
      color: 0xa96332,
      roughness: 0.9,
      metalness: 0.02
    });

    // Circular / irregular voxel island.
    for (let x = -4; x <= 4; x++) {
      for (let z = -4; z <= 4; z++) {
        const distance = Math.sqrt(x * x + z * z);
        const included = distance <= 4.35;

        if (included) {
          const edge = distance > 3.65;

          addBox(
            island,
            [x * V, 0, z * V],
            [V, edge ? 0.3 : 0.22, V],
            edge ? islandTopMaterial : islandMaterial
          );
        }
      }
    }

    // A few raised landforms.
    for (const [x, z, height] of [
      [-1.6, -0.8, 0.55],
      [1.5, -0.5, 0.4],
      [0.4, 1.6, 0.35]
    ]) {
      for (let i = 0; i < height; i++) {
        addBox(
          island,
          [x, i * 0.24, z],
          [0.3, 0.23, 0.3],
          islandTopMaterial
        );
      }
    }

    // Decorative glowing path or river.
    const pathMaterial = new THREE.MeshStandardMaterial({
      color: 0xd7a45c,
      roughness: 0.7,
      emissive: 0x4a2608,
      emissiveIntensity: 0.35
    });

    for (let i = 0; i < 8; i++) {
      addBox(
        island,
        [0.15, 0.13, 1.3 + i * 0.65],
        [0.42, 0.06, 0.42],
        pathMaterial
      );
    }

    // ------------------------------------------------------------
    // Ground plane and atmospheric particles
    // ------------------------------------------------------------

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(18, 96),
      new THREE.MeshStandardMaterial({
        color: 0x763c22,
        roughness: 1,
        metalness: 0
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.62;
    ground.receiveShadow = true;
    scene.add(ground);

    const particleCount = 260;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 28;
      particlePositions[i * 3 + 1] = Math.random() * 12 - 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 28;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xe6b272,
        size: 0.055,
        transparent: true,
        opacity: 0.45,
        depthWrite: false
      })
    );
    scene.add(particles);

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------

    const hemisphere = new THREE.HemisphereLight(
      0xffd9a3,
      0x302438,
      1.55
    );
    scene.add(hemisphere);

    const keyLight = new THREE.DirectionalLight(
      0xffe0a8,
      3.2
    );
    keyLight.position.set(8, 13, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -12;
    keyLight.shadow.camera.right = 12;
    keyLight.shadow.camera.top = 12;
    keyLight.shadow.camera.bottom = -12;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 35;
    keyLight.shadow.bias = -0.00025;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(
      0x877cff,
      2.1
    );
    rimLight.position.set(-8, 7, -9);
    scene.add(rimLight);

    const warmLight = new THREE.PointLight(
      0xff9b48,
      28,
      13,
      2
    );
    warmLight.position.set(4, 2, 5);
    scene.add(warmLight);

    // ------------------------------------------------------------
    // Custom camera controls
    // ------------------------------------------------------------

    const target = new THREE.Vector3(0, 0.3, 0);
    const spherical = new THREE.Spherical(11.8, Math.PI * 0.39, Math.PI * 0.25);
    const initialTarget = target.clone();
    const initialSpherical = spherical.clone();

    let dragging = false;
    let panning = false;
    let previousX = 0;
    let previousY = 0;
    let autoRotate = false;

    function updateCamera() {
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, 0.12, Math.PI * 0.49);
      spherical.radius = THREE.MathUtils.clamp(spherical.radius, 5.2, 24);

      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      panning = event.button === 2 || event.shiftKey;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = panning ? "move" : "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;

      previousX = event.clientX;
      previousY = event.clientY;

      if (panning) {
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();
        camera.matrixWorld.extractBasis(right, up, new THREE.Vector3());

        target.addScaledVector(right, -dx * 0.008);
        target.addScaledVector(up, dy * 0.008);

        target.x = THREE.MathUtils.clamp(target.x, -5, 5);
        target.y = THREE.MathUtils.clamp(target.y, -1.5, 4);
        target.z = THREE.MathUtils.clamp(target.z, -5, 5);
      } else {
        spherical.theta -= dx * 0.006;
        spherical.phi -= dy * 0.006;
      }

      updateCamera();
    });

    function endDrag(event) {
      dragging = false;
      panning = false;
      renderer.domElement.style.cursor = "grab";

      if (event.pointerId !== undefined &&
          renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        spherical.radius *= Math.exp(event.deltaY * 0.001);
        updateCamera();
      },
      { passive: false }
    );

    renderer.domElement.style.cursor = "grab";

    const resetButton = dummyEl();
    const spinButton = dummyEl();
    const lightButton = dummyEl();

    resetButton.addEventListener("click", () => {
      target.copy(initialTarget);
      spherical.copy(initialSpherical);
      updateCamera();
    });

    spinButton.addEventListener("click", () => {
      autoRotate = !autoRotate;
      spinButton.textContent = autoRotate ? "Pause rotation" : "Auto rotate";
    });

    let lightEnabled = true;

    lightButton.addEventListener("click", () => {
      lightEnabled = !lightEnabled;
      lightButton.textContent = lightEnabled ? "Light on" : "Light off";

      if (!lightEnabled) {
        keyLight.intensity = 0;
        hemisphere.intensity = 0.2;
        rimLight.intensity = 0.2;
        warmLight.intensity = 0;
      } else {
        keyLight.intensity = 3.2;
        hemisphere.intensity = 1.55;
        rimLight.intensity = 2.1;
        warmLight.intensity = 28;
      }
    });

    // ------------------------------------------------------------
    // Resize and animation
    // ------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      if (autoRotate && !dragging) {
        spherical.theta += 0.0025;
        updateCamera();
      }

      particles.rotation.y = elapsed * 0.012;
      particles.position.y = Math.sin(elapsed * 0.22) * 0.12;

      exhaustGlow.scale.y = 1 + Math.sin(elapsed * 7.5) * 0.12;
      exhaustGlow.material.emissiveIntensity =
        1.25 + Math.sin(elapsed * 7.5) * 0.25;

      renderer.render(scene, camera);
    }

    updateCamera();
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
    relic: { id: "generic", name: "Kirby Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x98502d, fogColor: 0x98502d, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
