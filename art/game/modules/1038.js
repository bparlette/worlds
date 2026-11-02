// @world {"id": "1038", "title": "Pok\u00e9mon FireRed", "sub": "Player's Room", "system": "3D Render"}
// Converted from 1038-pokmon_firered_playerx27s_room.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): h, sx, sy, w, zoom
  let h = 0;
  let sx = 0;
  let sy = 0;
  let w = 0;
  let zoom = 0;

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

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
    scene.background = new THREE.Color(0x080b12);
    scene.fog = new THREE.FogExp2(0x080b12, 0.025);

    camera = dummyCamera();

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      wall: new THREE.MeshStandardMaterial({
        color: 0xd9d5c8,
        roughness: 0.92
      }),
      wallTrim: new THREE.MeshStandardMaterial({
        color: 0x668aa0,
        roughness: 0.8
      }),
      ceiling: new THREE.MeshStandardMaterial({
        color: 0xe3dfd0,
        roughness: 0.95
      }),
      floorBase: new THREE.MeshStandardMaterial({
        color: 0x7f765e,
        roughness: 0.94
      }),
      floorLight: new THREE.MeshStandardMaterial({
        color: 0xa89976,
        roughness: 0.92
      }),
      floorDark: new THREE.MeshStandardMaterial({
        color: 0x686350,
        roughness: 0.96
      }),
      rug: new THREE.MeshStandardMaterial({
        color: 0x55a66e,
        roughness: 0.98
      }),
      rugBorder: new THREE.MeshStandardMaterial({
        color: 0x91d49b,
        roughness: 0.98
      }),
      rugDot: new THREE.MeshStandardMaterial({
        color: 0xd4f1bd,
        roughness: 0.98
      }),
      bedFrame: new THREE.MeshStandardMaterial({
        color: 0x6e8998,
        roughness: 0.72,
        metalness: 0.08
      }),
      mattress: new THREE.MeshStandardMaterial({
        color: 0xf3f0e7,
        roughness: 0.98
      }),
      pillow: new THREE.MeshStandardMaterial({
        color: 0xdbe8f1,
        roughness: 0.98
      }),
      blanket: new THREE.MeshStandardMaterial({
        color: 0x6ab6bd,
        roughness: 0.95
      }),
      blanketStripe: new THREE.MeshStandardMaterial({
        color: 0xd9f2f0,
        roughness: 0.95
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0xc28a4f,
        roughness: 0.82
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0xe0b77a,
        roughness: 0.8
      }),
      woodDark: new THREE.MeshStandardMaterial({
        color: 0x765038,
        roughness: 0.86
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x20262d,
        roughness: 0.62
      }),
      screen: new THREE.MeshStandardMaterial({
        color: 0x173a45,
        emissive: 0x0b3039,
        emissiveIntensity: 0.55,
        roughness: 0.45
      }),
      lamp: new THREE.MeshStandardMaterial({
        color: 0xffdf91,
        emissive: 0xffb84d,
        emissiveIntensity: 1.5
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xd98245,
        roughness: 0.9
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xe8ece8,
        roughness: 0.85
      })
    };

    const bookMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x9b4f47, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x3e6872, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xd5a542, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x637857, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x8d5b7d, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x354b67, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xc28c55, roughness: 0.9 })
    ];

    // -------------------------------------------------------------------------
    // Voxel construction helpers
    // -------------------------------------------------------------------------

    const room = new THREE.Group();
    scene.add(room);

    function addVoxelBox(
      parent,
      size,
      position,
      material,
      castShadow = true,
      receiveShadow = true
    ) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        material
      );

      mesh.position.set(position[0], position[1], position[2]);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      parent.add(mesh);
      return mesh;
    }

    function addBox(
      size,
      position,
      material,
      parent = room,
      castShadow = true,
      receiveShadow = true
    ) {
      return addVoxelBox(
        parent,
        size,
        position,
        material,
        castShadow,
        receiveShadow
      );
    }

    function addWallBox(
      size,
      position,
      material,
      parent = room,
      castShadow = false
    ) {
      return addBox(
        size,
        position,
        material,
        parent,
        castShadow,
        false
      );
    }

    function addBookshelf() {
      const shelf = new THREE.Group();
      shelf.position.set(4.65, 0, -3.65);
      room.add(shelf);

      // Cabinet sides and back.
      addBox(
        [0.18, 2.25, 1.65],
        [-0.72, 1.125, 0],
        materials.woodDark,
        shelf
      );
      addBox(
        [0.18, 2.25, 1.65],
        [0.72, 1.125, 0],
        materials.woodDark,
        shelf
      );
      addBox(
        [1.68, 0.12, 1.65],
        [0, 0.12, 0],
        materials.woodDark,
        shelf
      );
      addBox(
        [1.68, 0.12, 1.65],
        [0, 2.12, 0],
        materials.woodDark,
        shelf
      );
      addBox(
        [1.48, 2.0, 0.08],
        [0, 1.12, -0.78],
        materials.woodDark,
        shelf
      );

      // Shelves.
      for (const y of [0.38, 1.08, 1.78]) {
        addBox(
          [1.55, 0.1, 1.55],
          [0, y, 0],
          materials.wood,
          shelf
        );
      }

      // Books.
      const books = [
        [-0.48, 0.5, 0.04, 0.22, 0.55, 0.08],
        [-0.25, 0.5, 0.04, 0.18, 0.68, 0.08],
        [-0.03, 0.5, 0.04, 0.2, 0.48, 0.08],
        [0.2, 0.5, 0.04, 0.16, 0.72, 0.08],
        [0.4, 0.5, 0.04, 0.24, 0.5, 0.08],
        [-0.47, 1.1, 0.04, 0.21, 0.6, 0.08],
        [-0.25, 1.1, 0.04, 0.17, 0.75, 0.08],
        [-0.03, 1.1, 0.04, 0.2, 0.5, 0.08],
        [0.2, 1.1, 0.04, 0.16, 0.7, 0.08],
        [0.4, 1.1, 0.04, 0.23, 0.55, 0.08],
        [-0.48, 1.8, 0.04, 0.2, 0.58, 0.08],
        [-0.27, 1.8, 0.04, 0.18, 0.65, 0.08],
        [0.02, 1.8, 0.04, 0.21, 0.5, 0.08],
        [0.24, 1.8, 0.04, 0.16, 0.7, 0.08],
        [0.46, 1.8, 0.04, 0.22, 0.52, 0.08]
      ];

      for (const [x, y, z, w, h, d] of books) {
        addBox(
          [w, h, d],
          [x, y, z],
          bookMaterials[Math.floor(Math.random() * bookMaterials.length)],
          shelf
        );
      }

      // Shelf objects.
      addBox(
        [0.45, 0.28, 0.32],
        [-0.45, 0.68, 0.2],
        materials.woodLight,
        shelf
      );
      addBox(
        [0.3, 0.22, 0.28],
        [0.48, 0.68, 0.2],
        materials.orange,
        shelf
      );
    }

    function addDesk() {
      const desk = new THREE.Group();
      desk.position.set(-3.65, 0, -3.45);
      room.add(desk);

      // Desk top.
      addBox(
        [2.25, 0.16, 1.05],
        [0, 1.05, 0],
        materials.woodLight,
        desk
      );

      // Drawer.
      addBox(
        [0.72, 0.75, 0.86],
        [0.68, 0.43, 0],
        materials.wood,
        desk
      );

      addBox(
        [0.08, 0.08, 0.1],
        [0.68, 0.63, 0.45],
        materials.woodDark,
        desk
      );

      // Legs.
      for (const x of [-0.85, 0.85]) {
        for (const z of [-0.36, 0.36]) {
          addBox(
            [0.14, 1.02, 0.14],
            [x, 0.51, z],
            materials.woodDark,
            desk
          );
        }
      }

      // Monitor.
      addBox(
        [0.88, 0.55, 0.12],
        [-0.48, 1.43, 0.02],
        materials.black,
        desk
      );

      addBox(
        [0.68, 0.34, 0.035],
        [-0.48, 1.43, 0.09],
        materials.screen,
        desk
      );

      // Monitor stand.
      addBox(
        [0.28, 0.12, 0.18],
        [-0.48, 1.19, 0.02],
        materials.black,
        desk
      );

      // Keyboard.
      addBox(
        [0.68, 0.1, 0.28],
        [-0.5, 1.16, 0.42],
        materials.black,
        desk
      );

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 5; col++) {
          addBox(
            [0.065, 0.025, 0.08],
            [-0.82 + col * 0.135, 1.22, 0.34 + row * 0.09],
            materials.white,
            desk,
            false
          );
        }
      }

      // Side stool.
      const stool = new THREE.Group();
      stool.position.set(-3.65, 0, -2.05);
      room.add(stool);

      addBox(
        [0.72, 0.12, 0.72],
        [0, 0.48, 0],
        materials.blue ||
          (materials.blue = new THREE.MeshStandardMaterial({
            color: 0x5b8ca5,
            roughness: 0.8
          })),
        stool
      );

      for (const x of [-0.25, 0.25]) {
        for (const z of [-0.25, 0.25]) {
          addBox(
            [0.08, 0.43, 0.08],
            [x, 0.22, z],
            materials.woodDark,
            stool
          );
        }
      }
    }

    function addBed() {
      const bed = new THREE.Group();
      bed.position.set(-3.65, 0, 1.05);
      room.add(bed);

      // Bed base and frame.
      addBox(
        [2.35, 0.22, 2.25],
        [0, 0.22, 0],
        materials.bedFrame,
        bed
      );

      // Rounded-ish headboard using stacked boxes.
      addBox(
        [2.45, 0.55, 0.18],
        [0, 0.57, -0.98],
        materials.bedFrame,
        bed
      );

      addBox(
        [2.45, 0.22, 0.18],
        [0, 0.83, -0.98],
        materials.bedFrame,
        bed
      );

      // Mattress.
      addBox(
        [2.2, 0.3, 2.05],
        [0, 0.48, 0.12],
        materials.mattress,
        bed
      );

      // Pillow.
      addBox(
        [1.48, 0.2, 0.58],
        [0.16, 0.72, -0.35],
        materials.pillow,
        bed
      );

      // Blanket.
      addBox(
        [2.18, 0.12, 1.25],
        [-0.1, 0.68, 0.72],
        materials.blanket,
        bed
      );

      addBox(
        [2.18, 0.12, 0.16],
        [-0.1, 0.75, 0.3],
        materials.blanketStripe,
        bed
      );

      // Small bedside lamp.
      const lamp = new THREE.Group();
      lamp.position.set(-4.9, 0, 0.95);
      room.add(lamp);

      addBox(
        [0.18, 0.7, 0.18],
        [0, 0.35, 0],
        materials.woodDark,
        lamp
      );

      addBox(
        [0.34, 0.34, 0.34],
        [0, 0.78, 0],
        materials.lamp,
        lamp
      );

      // Wall clock.
      const clock = new THREE.Group();
      clock.position.set(-3.65, 2.25, -1.02);
      room.add(clock);

      addBox(
        [0.48, 0.48, 0.12],
        [0, 0, 0],
        materials.white,
        clock
      );

      addBox(
        [0.055, 0.29, 0.035],
        [0.08, 0.06, 0.08],
        materials.black,
        clock,
        false
      );

      addBox(
        [0.045, 0.2, 0.035],
        [-0.1, -0.05, 0.08],
        materials.orange,
        clock,
        false
      );
    }

    function addCenterFurniture() {
      const center = new THREE.Group();
      center.position.set(0.75, 0, 0.25);
      room.add(center);

      // Low media console.
      addBox(
        [1.65, 0.18, 0.95],
        [0, 0.48, 0],
        materials.wood,
        center
      );

      for (const x of [-0.66, 0.66]) {
        for (const z of [-0.34, 0.34]) {
          addBox(
            [0.12, 0.45, 0.12],
            [x, 0.23, z],
            materials.woodDark,
            center
          );
        }
      }

      // TV.
      addBox(
        [1.12, 0.72, 0.18],
        [0, 0.93, 0],
        materials.black,
        center
      );

      addBox(
        [0.94, 0.54, 0.035],
        [0, 0.93, 0.105],
        materials.screen,
        center
      );

      addBox(
        [0.5, 0.1, 0.12],
        [0, 0.65, 0],
        materials.black,
        center
      );

      // Game console and controller.
      addBox(
        [0.65, 0.25, 0.38],
        [-0.35, 0.68, 0.05],
        materials.orange,
        center
      );

      addBox(
        [0.44, 0.1, 0.13],
        [-0.35, 0.83, 0.15],
        materials.black,
        center
      );

      for (const [x, y, z, sx, sy, sz] of [
        [-0.5, 0.88, 0.13, 0.09, 0.05, 0.05],
        [-0.36, 0.88, 0.13, 0.09, 0.05, 0.05],
        [-0.22, 0.88, 0.13, 0.09, 0.05, 0.05]
      ]) {
        addBox(
          [sx, sy, sz],
          [x, y, z],
          materials.white,
          center,
          false
        );
      }
    }

    function addRug() {
      const rug = new THREE.Group();
      rug.position.set(0.75, 0.025, 0.25);
      room.add(rug);

      // Main rug.
      addBox(
        [3.35, 0.08, 3.05],
        [0, 0.04, 0],
        materials.rug,
        rug
      );

      // Border.
      addBox(
        [3.42, 0.09, 0.16],
        [0, 0.095, -1.45],
        materials.rugBorder,
        rug
      );
      addBox(
        [3.42, 0.09, 0.16],
        [0, 0.095, 1.45],
        materials.rugBorder,
        rug
      );
      addBox(
        [0.16, 0.09, 2.9],
        [-1.56, 0.095, 0],
        materials.rugBorder,
        rug
      );
      addBox(
        [0.16, 0.09, 2.9],
        [1.56, 0.095, 0],
        materials.rugBorder,
        rug
      );

      // Small square pattern.
      for (const x of [-1.15, 1.15]) {
        for (const z of [-1.12, 1.12]) {
          addBox(
            [0.28, 0.02, 0.28],
            [x, 0.1, z],
            materials.rugDot,
            rug,
            false
          );
        }
      }
    }

    function addWindowFrame() {
      const frame = new THREE.Group();
      frame.position.set(7.25, 0, -3.65);
      room.add(frame);

      // Wall panel behind the window.
      addBox(
        [2.35, 1.55, 0.12],
        [0, 1.2, 0],
        materials.wall,
        frame
      );

      // Window frame.
      addBox(
        [2.2, 1.4, 0.1],
        [0, 1.2, 0.08],
        materials.white,
        frame
      );

      addBox(
        [0.1, 1.4, 0.1],
        [0, 1.2, 0.14],
        materials.white,
        frame
      );

      addBox(
        [2.2, 0.1, 0.1],
        [0, 1.2, 0.14],
        materials.white,
        frame
      );

      // Curtain.
      for (const x of [-1.04, 1.04]) {
        addBox(
          [0.2, 1.65, 0.12],
          [x, 1.25, 0.12],
          materials.orange,
          frame
        );
      }

      // Small sill.
      addBox(
        [2.4, 0.12, 0.38],
        [0, 0.48, 0.17],
        materials.woodLight,
        frame
      );
    }

    function addPoster() {
      const poster = new THREE.Group();
      poster.position.set(7.25, 1.85, -3.52);
      room.add(poster);

      addBox(
        [1.12, 0.72, 0.08],
        [0, 0, 0],
        materials.orange,
        poster
      );

      addBox(
        [0.88, 0.48, 0.025],
        [0, 0, 0.055],
        materials.white,
        poster
      );

      for (let i = 0; i < 4; i++) {
        addBox(
          [0.035, 0.38, 0.02],
          [-0.27 + i * 0.18, 0, 0.075],
          materials.white,
          poster,
          false
        );
      }
    }

    function addWallDetails() {
      // Wall baseboard.
      addBox(
        [14.7, 0.18, 0.16],
        [0, 0.3, -3.65],
        materials.wallTrim
      );

      addBox(
        [14.7, 0.18, 0.16],
        [0, 0.3, 3.65],
        materials.wallTrim
      );

      // Ceiling.
      addBox(
        [14.7, 0.18, 17.7],
        [0, 3.0, 0],
        materials.ceiling
      );

      // Ceiling light fixture.
      addBox(
        [2.6, 0.12, 0.65],
        [0, 2.87, 0.2],
        materials.white
      );

      addBox(
        [2.35, 0.08, 0.42],
        [0, 2.78, 0.2],
        materials.lamp,
        room,
        false
      );
    }

    function addFloor() {
      const floor = new THREE.Group();
      room.add(floor);

      // Floor base.
      addBox(
        [14.6, 0.22, 17.6],
        [0, 0.1, 0],
        materials.floorBase,
        floor
      );

      // Individual tiled floor blocks.
      const tileSizeX = 0.9;
      const tileSizeZ = 0.9;

      for (let x = 0; x < 16; x++) {
        for (let z = 0; z < 19; z++) {
          const px = (x - 7.5) * tileSizeX;
          const pz = (z - 9.5) * tileSizeZ;
          const edge = x === 0 || x === 15 || z === 0 || z === 18;

          if (edge) {
            addBox(
              [tileSizeX - 0.025, 0.055, tileSizeZ - 0.025],
              [px, 0.245, pz],
              materials.floorDark,
              floor,
              false
            );
          } else {
            const material = Math.random() > 0.5
              ? materials.floorLight
              : materials.floorBase;

            addBox(
              [tileSizeX - 0.025, 0.055, tileSizeZ - 0.025],
              [px, 0.245, pz],
              material,
              floor,
              false
            );
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Assemble the room
    // -------------------------------------------------------------------------

    addFloor();
    addWallDetails();
    addBookshelf();
    addDesk();
    addBed();
    addCenterFurniture();
    addRug();
    addWindowFrame();
    addPoster();

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    const hemisphere = new THREE.HemisphereLight(
      0xc8e5ff,
      0x5b4938,
      1.75
    );
    scene.add(hemisphere);

    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff1cf, 3.1);
    sun.position.set(-5, 10, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -10;
    sun.shadow.camera.right = 10;
    sun.shadow.camera.top = 10;
    sun.shadow.camera.bottom = -10;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 30;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x8ec8ff, 1.15);
    fill.position.set(7, 5, -7);
    scene.add(fill);

    // -------------------------------------------------------------------------
    // Direct camera controls: orbit, zoom, and keyboard rotation
    // -------------------------------------------------------------------------

    const target = new THREE.Vector3(0, 1.1, 0);
    const spherical = new THREE.Spherical();
    const initialPosition = new THREE.Vector3(
      12.8,
      10.2,
      15.8
    );

    spherical.setFromVector3(initialPosition.clone().sub(target));

    let theta = spherical.theta;
    let phi = spherical.phi;
    let radius = spherical.radius;

    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    const clamp = THREE.MathUtils.clamp;

    function updateCamera() {
      const safeRadius = clamp(radius, 7.5, 27);
      const safePhi = clamp(phi, 0.22, 1.43);

      spherical.set(safeRadius, safePhi, theta);
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging) return;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;

      previousX = event.clientX;
      previousY = event.clientY;

      theta -= dx * 0.006;
      phi -= dy * 0.005;

      updateCamera();
    });

    function endDrag(event) {
      dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (
        event.pointerId !== undefined &&
        renderer.domElement.hasPointerCapture(event.pointerId)
      ) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        radius = clamp(radius + event.deltaY * 0.012, 7.5, 27);
        updateCamera();
      },
      { passive: false }
    );

    window.addEventListener("keydown", (event) => {
      const key = event.key;

      if (key === "ArrowLeft") {
        theta += 0.12;
      } else if (key === "ArrowRight") {
        theta -= 0.12;
      } else if (key === "ArrowUp") {
        phi = clamp(phi - 0.08, 0.22, 1.43);
      } else if (key === "ArrowDown") {
        phi = clamp(phi + 0.08, 0.22, 1.43);
      } else {
        return;
      }

      updateCamera();
    });

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    updateCamera();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
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
    relic: { id: "generic", name: "Pok\u00e9mon FireRed Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x080b12, fogColor: 0x080b12, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
