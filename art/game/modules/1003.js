// @world {"id": "1003", "title": "Doom", "sub": "E1M1 \u2014 Hangar", "system": "3D Render"}
// Converted from 1003-doom_e1m1_hangar.html into a Back Roms World Walker module.

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

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // scene redirect
    scene.background = new THREE.Color(0x17212b);
    scene.fog = new THREE.Fog(0x17212b, 18, 38);

    camera = dummyCamera();

    const hemi = new THREE.HemisphereLight(0xbad9e8, 0x26321f, 1.45);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff1cf, 3.1);
    sun.position.set(7, 12, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -13;
    sun.shadow.camera.right = 13;
    sun.shadow.camera.top = 13;
    sun.shadow.camera.bottom = -13;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 35;
    sun.shadow.bias = -0.00035;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x78b9d6, 1.1);
    fill.position.set(-8, 5, -6);
    scene.add(fill);

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const V = 0.48;
    const cubeGeometry = new THREE.BoxGeometry(V, V, V);
    const tempObject = new THREE.Object3D();

    const materials = {
      darkMetal: new THREE.MeshStandardMaterial({
        color: 0x26343a,
        roughness: 0.82,
        metalness: 0.48
      }),
      greenMetal: new THREE.MeshStandardMaterial({
        color: 0x35544b,
        roughness: 0.76,
        metalness: 0.36
      }),
      paleMetal: new THREE.MeshStandardMaterial({
        color: 0x9bb0b3,
        roughness: 0.58,
        metalness: 0.48
      }),
      floor: new THREE.MeshStandardMaterial({
        color: 0x9a7145,
        roughness: 0.93
      }),
      grass: new THREE.MeshStandardMaterial({
        color: 0x1f6d3b,
        roughness: 0.95
      }),
      moss: new THREE.MeshStandardMaterial({
        color: 0x327a42,
        roughness: 1
      }),
      rust: new THREE.MeshStandardMaterial({
        color: 0x98542d,
        roughness: 0.95
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x111719,
        roughness: 0.8
      })
    };

    function voxel(x, y, z, material, castShadow = true, receiveShadow = true) {
      const mesh = new THREE.Mesh(cubeGeometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      return mesh;
    }

    function voxelBatch(positions, material, castShadow = true) {
      const data = [];

      for (const p of positions) {
        data.push({
          x: p[0],
          y: p[1],
          z: p[2],
          sx: p[3] ?? V,
          sy: p[4] ?? V,
          sz: p[5] ?? V
        });
      }

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const mesh = new THREE.InstancedMesh(
        geometry,
        material,
        data.length
      );

      for (let i = 0; i < data.length; i++) {
        const d = data[i];

        tempObject.position.set(d.x, d.y, d.z);
        tempObject.scale.set(d.sx, d.sy, d.sz);
        tempObject.updateMatrix();

        mesh.setMatrixAt(i, tempObject.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);

      return mesh;
    }

    function horizontalLayer(y, positions, material) {
      return voxelBatch(
        positions.map(([x, z]) => [x, y, z]),
        material
      );
    }

    // -------------------------------------------------------------------------
    // Ground slab and lower floor
    // -------------------------------------------------------------------------

    voxelBatch(
      [
        [-7.2, -0.35, -7.2],
        [7.2, -0.35, -7.2],
        [-7.2, -0.35, 7.2],
        [7.2, -0.35, 7.2]
      ],
      materials.black
    );

    const lowerFloorPositions = [
      [-7.2, 0.02, -7.2],
      [7.2, 0.02, -7.2],
      [-7.2, 0.02, 7.2],
      [7.2, 0.02, 7.2]
    ];

    voxelBatch(
      lowerFloorPositions,
      materials.floor
    );

    // -------------------------------------------------------------------------
    // Main room walls
    // -------------------------------------------------------------------------

    // Back wall with large central opening and side rooms.
    const backWallPositions = [
      [-7.2, 0, -7.2],
      [-6.7, 0, -7.2],
      [-6.2, 0, -7.2],
      [-5.7, 0, -7.2],
      [-5.2, 0, -7.2],
      [-4.7, 0, -7.2],
      [-4.2, 0, -7.2],
      [-3.7, 0, -7.2],
      [-3.2, 0, -7.2],
      [-2.7, 0, -7.2],
      [-2.2, 0, -7.2],
      [-1.7, 0, -7.2],
      [-1.2, 0, -7.2],
      [-0.7, 0, -7.2],
      [-0.2, 0, -7.2],
      [0.2, 0, -7.2],
      [0.7, 0, -7.2],
      [1.2, 0, -7.2],
      [1.7, 0, -7.2],
      [2.2, 0, -7.2],
      [2.7, 0, -7.2],
      [3.2, 0, -7.2],
      [3.7, 0, -7.2],
      [4.2, 0, -7.2],
      [4.7, 0, -7.2],
      [5.2, 0, -7.2],
      [5.7, 0, -7.2],
      [6.2, 0, -7.2],
      [6.7, 0, -7.2],
      [7.2, 0, -7.2]
    ];

    horizontalLayer(0, backWallPositions, materials.greenMetal);
    horizontalLayer(2.1, backWallPositions, materials.greenMetal);

    // Side walls.
    const leftWallPositions = [
      [-7.2, 0, -7.2],
      [-7.2, 0, -6.7],
      [-7.2, 0, -6.2],
      [-7.2, 0, -5.7],
      [-7.2, 0, -5.2],
      [-7.2, 0, -4.7],
      [-7.2, 0, -4.2],
      [-7.2, 0, -3.7],
      [-7.2, 0, -3.2],
      [-7.2, 0, -2.7],
      [-7.2, 0, -2.2],
      [-7.2, 0, -1.7],
      [-7.2, 0, -1.2],
      [-7.2, 0, -0.7],
      [-7.2, 0, -0.2],
      [-7.2, 0, 0.2],
      [-7.2, 0, 0.7],
      [-7.2, 0, 1.2],
      [-7.2, 0, 1.7],
      [-7.2, 0, 2.2],
      [-7.2, 0, 2.7],
      [-7.2, 0, 3.2],
      [-7.2, 0, 3.7],
      [-7.2, 0, 4.2],
      [-7.2, 0, 4.7],
      [-7.2, 0, 5.2],
      [-7.2, 0, 5.7],
      [-7.2, 0, 6.2],
      [-7.2, 0, 6.7],
      [-7.2, 0, 7.2]
    ];

    horizontalLayer(0, leftWallPositions, materials.greenMetal);
    horizontalLayer(2.1, leftWallPositions, materials.greenMetal);

    const rightWallPositions = [
      [7.2, 0, -7.2],
      [7.2, 0, -6.7],
      [7.2, 0, -6.2],
      [7.2, 0, -5.7],
      [7.2, 0, -5.2],
      [7.2, 0, -4.7],
      [7.2, 0, -4.2],
      [7.2, 0, -3.7],
      [7.2, 0, -3.2],
      [7.2, 0, -2.7],
      [7.2, 0, -2.2],
      [7.2, 0, -1.7],
      [7.2, 0, -1.2],
      [7.2, 0, -0.7],
      [7.2, 0, -0.2],
      [7.2, 0, 0.2],
      [7.2, 0, 0.7],
      [7.2, 0, 1.2],
      [7.2, 0, 1.7],
      [7.2, 0, 2.2],
      [7.2, 0, 2.7],
      [7.2, 0, 3.2],
      [7.2, 0, 3.7],
      [7.2, 0, 4.2],
      [7.2, 0, 4.7],
      [7.2, 0, 5.2],
      [7.2, 0, 5.7],
      [7.2, 0, 6.2],
      [7.2, 0, 6.7],
      [7.2, 0, 7.2]
    ];

    horizontalLayer(0, rightWallPositions, materials.greenMetal);
    horizontalLayer(2.1, rightWallPositions, materials.greenMetal);

    // -------------------------------------------------------------------------
    // Structural columns
    // -------------------------------------------------------------------------

    const columnPositions = [
      [-6.7, -6.7],
      [-6.7, -3.7],
      [-6.7, 0.2],
      [-6.7, 3.2],
      [6.7, -6.7],
      [6.7, -3.7],
      [6.7, 0.2],
      [6.7, 3.2]
    ];

    for (const [x, z] of columnPositions) {
      voxelBatch(
        [
          [x, 0.2, z],
          [x, 2.1, z]
        ],
        materials.darkMetal
      );

      voxelBatch(
        [
          [x, 1.35, z],
          [x, 1.85, z]
        ],
        materials.paleMetal
      );

      voxelBatch(
        [
          [x, 0.1, z],
          [x, 0.6, z]
        ],
        materials.rust
      );
    }

    // -------------------------------------------------------------------------
    // Windows and frames
    // -------------------------------------------------------------------------

    const windowPositions = [
      [-3.7, -7.2],
      [-2.9, -7.2],
      [-2.1, -7.2],
      [-1.3, -7.2],
      [-0.5, -7.2],
      [0.3, -7.2],
      [1.1, -7.2],
      [1.9, -7.2],
      [2.7, -7.2]
    ];

    for (const [x, z] of windowPositions) {
      voxelBatch(
        [
          [x, 1.1, z],
          [x, 1.6, z]
        ],
        materials.paleMetal
      );

      voxelBatch(
        [
          [x, 2.3, z]
        ],
        materials.darkMetal
      );

      voxelBatch(
        [
          [x - 0.2, 1.35, z],
          [x + 0.2, 1.35, z]
        ],
        materials.paleMetal
      );
    }

    // -------------------------------------------------------------------------
    // Interior room floors
    // -------------------------------------------------------------------------

    // Rear room floor.
    const rearRoomPositions = [
      [-5.2, -6.7],
      [-4.7, -6.7],
      [-4.2, -6.7],
      [-3.7, -6.7],
      [-3.2, -6.7],
      [-2.7, -6.7],
      [-2.2, -6.7],
      [-1.7, -6.7],
      [-1.2, -6.7],
      [-0.7, -6.7],
      [-0.2, -6.7],
      [0.2, -6.7],
      [0.7, -6.7],
      [1.2, -6.7],
      [1.7, -6.7],
      [2.2, -6.7],
      [2.7, -6.7],
      [3.2, -6.7],
      [3.7, -6.7],
      [4.2, -6.7],
      [4.7, -6.7],
      [5.2, -6.7],
      [5.7, -6.7],
      [6.2, -6.7],
      [6.7, -6.7]
    ];

    horizontalLayer(0.12, rearRoomPositions, materials.floor);

    // Side room floors.
    const leftRoomPositions = [
      [-6.7, -5.2],
      [-6.7, -4.7],
      [-6.7, -4.2],
      [-6.7, -3.7],
      [-6.7, -3.2],
      [-6.7, -2.7],
      [-6.7, -2.2],
      [-6.7, -1.7],
      [-6.7, -1.2],
      [-6.7, -0.7],
      [-6.7, 0.2],
      [-6.7, 0.7],
      [-6.7, 1.2],
      [-6.7, 1.7],
      [-6.7, 2.2],
      [-6.7, 2.7],
      [-6.7, 3.2],
      [-6.7, 3.7],
      [-6.7, 4.2],
      [-6.7, 4.7],
      [-6.7, 5.2],
      [-6.7, 5.7]
    ];

    horizontalLayer(0.12, leftRoomPositions, materials.floor);

    const rightRoomPositions = [
      [6.7, -5.2],
      [6.7, -4.7],
      [6.7, -4.2],
      [6.7, -3.7],
      [6.7, -3.2],
      [6.7, -2.7],
      [6.7, -2.2],
      [6.7, -1.7],
      [6.7, -1.2],
      [6.7, -0.7],
      [6.7, 0.2],
      [6.7, 0.7],
      [6.7, 1.2],
      [6.7, 1.7],
      [6.7, 2.2],
      [6.7, 2.7],
      [6.7, 3.2],
      [6.7, 3.7],
      [6.7, 4.2],
      [6.7, 4.7],
      [6.7, 5.2],
      [6.7, 5.7]
    ];

    horizontalLayer(0.12, rightRoomPositions, materials.floor);

    // -------------------------------------------------------------------------
    // Ceiling
    // -------------------------------------------------------------------------

    const ceilingPositions = [
      [-7.2, 4.2, -7.2],
      [-6.7, 4.2, -7.2],
      [-6.2, 4.2, -7.2],
      [-5.7, 4.2, -7.2],
      [-5.2, 4.2, -7.2],
      [-4.7, 4.2, -7.2],
      [-4.2, 4.2, -7.2],
      [-3.7, 4.2, -7.2],
      [-3.2, 4.2, -7.2],
      [-2.7, 4.2, -7.2],
      [-2.2, 4.2, -7.2],
      [-1.7, 4.2, -7.2],
      [-1.2, 4.2, -7.2],
      [-0.7, 4.2, -7.2],
      [-0.2, 4.2, -7.2],
      [0.2, 4.2, -7.2],
      [0.7, 4.2, -7.2],
      [1.2, 4.2, -7.2],
      [1.7, 4.2, -7.2],
      [2.2, 4.2, -7.2],
      [2.7, 4.2, -7.2],
      [3.2, 4.2, -7.2],
      [3.7, 4.2, -7.2],
      [4.2, 4.2, -7.2],
      [4.7, 4.2, -7.2],
      [5.2, 4.2, -7.2],
      [5.7, 4.2, -7.2],
      [6.2, 4.2, -7.2],
      [6.7, 4.2, -7.2],
      [7.2, 4.2, -7.2]
    ];

    horizontalLayer(4.2, ceilingPositions, materials.darkMetal);

    // Ceiling panels.
    const panelPositions = [
      [-5.7, -6.7],
      [-4.9, -6.7],
      [-4.1, -6.7],
      [-3.3, -6.7],
      [-2.5, -6.7],
      [-1.7, -6.7],
      [-0.9, -6.7],
      [-0.1, -6.7],
      [0.7, -6.7],
      [1.5, -6.7],
      [2.3, -6.7],
      [3.1, -6.7],
      [3.9, -6.7],
      [4.7, -6.7],
      [5.5, -6.7],
      [6.3, -6.7]
    ];

    horizontalLayer(4.45, panelPositions, materials.paleMetal);

    // -------------------------------------------------------------------------
    // Foreground floor and raised platforms
    // -------------------------------------------------------------------------

    const foregroundPositions = [
      [-6.7, 0.1, 3.2],
      [-6.7, 0.1, 3.7],
      [-6.7, 0.1, 4.2],
      [-6.7, 0.1, 4.7],
      [-6.7, 0.1, 5.2],
      [-6.7, 0.1, 5.7],
      [-6.7, 0.1, 6.2],
      [-6.7, 0.1, 6.7],
      [-6.7, 0.1, 7.2],
      [-5.2, 0.1, 4.2],
      [-4.7, 0.1, 4.2],
      [-4.2, 0.1, 4.2],
      [-3.7, 0.1, 4.2],
      [-3.2, 0.1, 4.2],
      [-2.7, 0.1, 4.2],
      [-2.2, 0.1, 4.2],
      [-1.7, 0.1, 4.2],
      [-1.2, 0.1, 4.2],
      [-0.7, 0.1, 4.2],
      [-0.2, 0.1, 4.2],
      [0.2, 0.1, 4.2],
      [0.7, 0.1, 4.2],
      [1.2, 0.1, 4.2],
      [1.7, 0.1, 4.2],
      [2.2, 0.1, 4.2],
      [2.7, 0.1, 4.2],
      [3.2, 0.1, 4.2],
      [3.7, 0.1, 4.2],
      [4.2, 0.1, 4.2],
      [4.7, 0.1, 4.2],
      [5.2, 0.1, 4.2],
      [5.7, 0.1, 4.2],
      [6.2, 0.1, 4.2],
      [6.7, 0.1, 4.2]
    ];

    horizontalLayer(0.1, foregroundPositions, materials.floor);

    // Raised L-shaped platform.
    const platformPositions = [
      [-6.7, 0.65, 3.2],
      [-6.7, 0.65, 3.7],
      [-6.7, 0.65, 4.2],
      [-6.7, 0.65, 4.7],
      [-6.7, 0.65, 5.2],
      [-6.7, 0.65, 5.7],
      [-6.7, 0.65, 6.2],
      [-6.7, 0.65, 6.7],
      [-6.7, 0.65, 7.2],
      [-5.2, 0.65, 3.2],
      [-4.7, 0.65, 3.2],
      [-4.2, 0.65, 3.2],
      [-3.7, 0.65, 3.2],
      [-3.2, 0.65, 3.2],
      [-2.7, 0.65, 3.2],
      [-2.2, 0.65, 3.2],
      [-1.7, 0.65, 3.2],
      [-1.2, 0.65, 3.2],
      [-0.7, 0.65, 3.2],
      [-0.2, 0.65, 3.2],
      [0.2, 0.65, 3.2],
      [0.7, 0.65, 3.2],
      [1.2, 0.65, 3.2],
      [1.7, 0.65, 3.2],
      [2.2, 0.65, 3.2],
      [2.7, 0.65, 3.2],
      [3.2, 0.65, 3.2],
      [3.7, 0.65, 3.2],
      [4.2, 0.65, 3.2],
      [4.7, 0.65, 3.2],
      [5.2, 0.65, 3.2],
      [5.7, 0.65, 3.2],
      [6.2, 0.65, 3.2],
      [6.7, 0.65, 3.2]
    ];

    horizontalLayer(0.65, platformPositions, materials.darkMetal);

    // Platform edge trim.
    const platformEdgePositions = [
      [-6.7, 0.45, 3.2],
      [-6.7, 0.45, 3.7],
      [-6.7, 0.45, 4.2],
      [-6.7, 0.45, 4.7],
      [-6.7, 0.45, 5.2],
      [-6.7, 0.45, 5.7],
      [-6.7, 0.45, 6.2],
      [-6.7, 0.45, 6.7],
      [-6.7, 0.45, 7.2],
      [-5.2, 0.45, 3.2],
      [-4.7, 0.45, 3.2],
      [-4.2, 0.45, 3.2],
      [-3.7, 0.45, 3.2],
      [-3.2, 0.45, 3.2],
      [-2.7, 0.45, 3.2],
      [-2.2, 0.45, 3.2],
      [-1.7, 0.45, 3.2],
      [-1.2, 0.45, 3.2],
      [-0.7, 0.45, 3.2],
      [-0.2, 0.45, 3.2],
      [0.2, 0.45, 3.2],
      [0.7, 0.45, 3.2],
      [1.2, 0.45, 3.2],
      [1.7, 0.45, 3.2],
      [2.2, 0.45, 3.2],
      [2.7, 0.45, 3.2],
      [3.2, 0.45, 3.2],
      [3.7, 0.45, 3.2],
      [4.2, 0.45, 3.2],
      [4.7, 0.45, 3.2],
      [5.2, 0.45, 3.2],
      [5.7, 0.45, 3.2],
      [6.2, 0.45, 3.2],
      [6.7, 0.45, 3.2]
    ];

    horizontalLayer(0.45, platformEdgePositions, materials.paleMetal);

    // -------------------------------------------------------------------------
    // Green floor patches / moss
    // -------------------------------------------------------------------------

    const mossPositions = [
      [-6.7, 0.1, 2.7],
      [-6.7, 0.1, 3.2],
      [-6.7, 0.1, 3.7],
      [-6.7, 0.1, 4.2],
      [-6.7, 0.1, 4.7],
      [-6.7, 0.1, 5.2],
      [-6.7, 0.1, 5.7],
      [-6.7, 0.1, 6.2],
      [-6.7, 0.1, 6.7],
      [-6.7, 0.1, 7.2],
      [-5.2, 0.1, 2.7],
      [-4.7, 0.1, 2.7],
      [-4.2, 0.1, 2.7],
      [-3.7, 0.1, 2.7],
      [-3.2, 0.1, 2.7],
      [-2.7, 0.1, 2.7],
      [-2.2, 0.1, 2.7],
      [-1.7, 0.1, 2.7],
      [-1.2, 0.1, 2.7],
      [-0.7, 0.1, 2.7],
      [-0.2, 0.1, 2.7],
      [0.2, 0.1, 2.7],
      [0.7, 0.1, 2.7],
      [1.2, 0.1, 2.7],
      [1.7, 0.1, 2.7],
      [2.2, 0.1, 2.7],
      [2.7, 0.1, 2.7],
      [3.2, 0.1, 2.7],
      [3.7, 0.1, 2.7],
      [4.2, 0.1, 2.7],
      [4.7, 0.1, 2.7],
      [5.2, 0.1, 2.7],
      [5.7, 0.1, 2.7],
      [6.2, 0.1, 2.7],
      [6.7, 0.1, 2.7]
    ];

    horizontalLayer(0.12, mossPositions, materials.moss);

    // Darker green patches.
    const darkMossPositions = [
      [-6.7, 0.1, 2.2],
      [-6.7, 0.1, 2.7],
      [-6.7, 0.1, 3.2],
      [-6.7, 0.1, 3.7],
      [-6.7, 0.1, 4.2],
      [-6.7, 0.1, 4.7],
      [-6.7, 0.1, 5.2],
      [-6.7, 0.1, 5.7],
      [-6.7, 0.1, 6.2],
      [-6.7, 0.1, 6.7],
      [-6.7, 0.1, 7.2],
      [-5.2, 0.1, 2.2],
      [-4.7, 0.1, 2.2],
      [-4.2, 0.1, 2.2],
      [-3.7, 0.1, 2.2],
      [-3.2, 0.1, 2.2],
      [-2.7, 0.1, 2.2],
      [-2.2, 0.1, 2.2],
      [-1.7, 0.1, 2.2],
      [-1.2, 0.1, 2.2],
      [-0.7, 0.1, 2.2],
      [-0.2, 0.1, 2.2],
      [0.2, 0.1, 2.2],
      [0.7, 0.1, 2.2],
      [1.2, 0.1, 2.2],
      [1.7, 0.1, 2.2],
      [2.2, 0.1, 2.2],
      [2.7, 0.1, 2.2],
      [3.2, 0.1, 2.2],
      [3.7, 0.1, 2.2],
      [4.2, 0.1, 2.2],
      [4.7, 0.1, 2.2],
      [5.2, 0.1, 2.2],
      [5.7, 0.1, 2.2],
      [6.2, 0.1, 2.2],
      [6.7, 0.1, 2.2]
    ];

    horizontalLayer(0.13, darkMossPositions, materials.grass);

    // -------------------------------------------------------------------------
    // Decorative crates / boxes
    // -------------------------------------------------------------------------

    const cratePositions = [
      [-5.2, 0.45, -6.7],
      [-4.7, 0.45, -6.7],
      [-4.2, 0.45, -6.7],
      [4.7, 0.45, -6.7],
      [5.2, 0.45, -6.7],
      [5.7, 0.45, -6.7],
      [-6.7, 0.45, -5.2],
      [-6.7, 0.45, -5.7],
      [6.7, 0.45, -5.2],
      [6.7, 0.45, -5.7]
    ];

    for (const [x, y, z] of cratePositions) {
      voxelBatch(
        [
          [x, y, z]
        ],
        materials.rust
      );
    }

    // -------------------------------------------------------------------------
    // Ceiling lights
    // -------------------------------------------------------------------------

    const lightPositions = [
      [-3.7, 4.65, -3.7],
      [0, 4.65, -3.7],
      [3.7, 4.65, -3.7]
    ];

    const shimmerLights = [];

    for (const [x, y, z] of lightPositions) {
      voxelBatch(
        [
          [x, y, z]
        ],
        materials.paleMetal
      );

      const glow = new THREE.PointLight(0xffd58a, 1.3, 5.5, 2);
      glow.position.set(x, y - 0.15, z);
      scene.add(glow);
      shimmerLights.push(glow);
    }

    // -------------------------------------------------------------------------
    // Custom orbit camera controls
    // -------------------------------------------------------------------------

    let azimuth = 0.48;
    let polar = 1.24;
    let radius = 18.5;
    const target = new THREE.Vector3(0, 1.2, -0.8);

    function updateCamera() {
      const sinPolar = Math.sin(polar);

      camera.position.set(
        target.x + radius * sinPolar * Math.sin(azimuth),
        target.y + radius * Math.cos(polar),
        target.z + radius * sinPolar * Math.cos(azimuth)
      );

      camera.lookAt(target);
    }

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

      azimuth -= deltaX * 0.006;
      polar = THREE.MathUtils.clamp(
        polar + deltaY * 0.005,
        0.48,
        1.48
      );

      updateCamera();
    });

    function stopDragging(event) {
      dragging = false;
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", stopDragging);
    renderer.domElement.addEventListener("pointercancel", stopDragging);

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();
      radius = THREE.MathUtils.clamp(
        radius + event.deltaY * 0.012,
        10,
        28
      );
      updateCamera();
    }, { passive: false });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    updateCamera();

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Gentle light shimmer.
      for (let i = 0; i < shimmerLights.length; i++) {
        shimmerLights[i].intensity = 1.15 + Math.sin(elapsed * 0.7 + i) * 0.12;
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
    relic: { id: "generic", name: "Doom Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x17212b, fogColor: 0x17212b, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
