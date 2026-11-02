// @world {"id": "1057", "title": "Super Mario Odyssey", "sub": "Peach's Castle Interior", "system": "3D Render"}
// Converted from 1057-super_mario_odyssey_peachx27s_castle_interior.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): by, bz
  let by = 0;
  let bz = 0;

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0xb9d9ed);
    scene.fog = new THREE.Fog(0xb9d9ed, 28, 62);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    

    // -------------------------------------------------------------------------
    // Voxel materials
    // -------------------------------------------------------------------------

    const materials = {
      blue: new THREE.MeshStandardMaterial({
        color: 0x78b9e8,
        roughness: 0.82,
        metalness: 0.02
      }),
      paleBlue: new THREE.MeshStandardMaterial({
        color: 0xc6e4f2,
        roughness: 0.78
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xf5f3e8,
        roughness: 0.72
      }),
      warmWhite: new THREE.MeshStandardMaterial({
        color: 0xffedcf,
        roughness: 0.7
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xd7a643,
        roughness: 0.42,
        metalness: 0.48
      }),
      darkGold: new THREE.MeshStandardMaterial({
        color: 0x8e5f18,
        roughness: 0.5,
        metalness: 0.35
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0x8e2432,
        roughness: 0.88
      }),
      redDark: new THREE.MeshStandardMaterial({
        color: 0x571721,
        roughness: 0.9
      }),
      carpet: new THREE.MeshStandardMaterial({
        color: 0x8f2030,
        roughness: 0.96
      }),
      carpetEdge: new THREE.MeshStandardMaterial({
        color: 0xe0a047,
        roughness: 0.9
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x252c31,
        roughness: 0.85
      }),
      floor: new THREE.MeshStandardMaterial({
        color: 0xd9d8ce,
        roughness: 0.86
      }),
      glass: new THREE.MeshStandardMaterial({
        color: 0x9ed7f0,
        roughness: 0.22,
        metalness: 0.15,
        emissive: 0x17394a,
        emissiveIntensity: 0.2
      }),
      cloud: new THREE.MeshStandardMaterial({
        color: 0xf4fbff,
        roughness: 1
      }),
      sun: new THREE.MeshStandardMaterial({
        color: 0xffc857,
        emissive: 0xff7b20,
        emissiveIntensity: 0.45,
        roughness: 0.55
      })
    };

    // -------------------------------------------------------------------------
    // Voxel helpers
    // -------------------------------------------------------------------------

    const voxelSize = 0.5;
    const world = new THREE.Group();
    scene.add(world);

    const batches = new Map();

    function addVoxel(x, y, z, material, size = voxelSize) {
      const key = `${x},${y},${z}`;
      if (!batches.has(key)) {
        batches.set(key, {
          x,
          y,
          z,
          material,
          size,
          mesh: null
        });
      }
    }

    function addBlock(x, y, z, material, sx = voxelSize, sy = voxelSize, sz = voxelSize) {
      addVoxel(x, y, z, material);
    }

    function buildBatches() {
      const geometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);
      const transforms = [];

      for (const batch of batches.values()) {
        const mesh = new THREE.Mesh(
          geometry,
          batch.material
        );

        mesh.position.set(batch.x, batch.y, batch.z);
        mesh.scale.set(
          batch.size,
          batch.size,
          batch.size
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        transforms.push(mesh);
      }

      world.add(
        new THREE.Group().add(
          new THREE.InstancedMesh(
            geometry,
            new THREE.MeshStandardMaterial({
              vertexColors: false
            }),
            transforms.length
          )
        )
      );

      for (let i = 0; i < transforms.length; i++) {
        transforms[i].position.y += voxelSize * 0.5;
      }

      batches.clear();
    }

    // To keep code manageable, we'll add individual groups of blocks
    // to the same batch system. Each call becomes one instanced cube.

    function block(x, y, z, material, sx = voxelSize, sy = voxelSize, sz = voxelSize) {
      addVoxel(x, y, z, material);
    }

    function wallBlock(x, y, z, material = materials.blue) {
      block(x, y, z, material);
    }

    // -------------------------------------------------------------------------
    // Floor: checkerboard and decorative center
    // -------------------------------------------------------------------------

    const floorSize = 28;
    const floorCenterY = 0;

    for (let x = -floorSize / 2; x < floorSize / 2; x++) {
      for (let z = -floorSize / 2; z < floorSize / 2; z++) {
        const px = x * voxelSize + voxelSize / 2;
        const pz = z * voxelSize + voxelSize / 2;

        if (Math.abs(x) < 5 && Math.abs(z) < 5) {
          const pattern =
            (Math.abs(x) + Math.abs(z)) % 3 === 0
              ? 0
              : (Math.abs(x) + Math.abs(z)) % 2 === 0
                ? 1
                : 2;

          if (pattern === 0) {
            block(px, -0.25, pz, materials.gold, 1.5, 0.5, 1.5);
          } else if (pattern === 1) {
            block(px, -0.25, pz, materials.black, 1.5, 0.5, 1.5);
          } else {
            block(px, -0.25, pz, materials.floor, 1.5, 0.5, 1.5);
          }
        } else {
          const checker = (x + z) & 1;
          block(px, -0.25, pz, checker ? materials.black : materials.floor, 1.5, 0.5, 1.5);
        }
      }
    }

    // Sunburst rug in the foreground.
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        for (let z = 0; z < 5; z++) {
          const dist = Math.max(x, z);
          if (dist > 2) continue;

          const angle = Math.atan2(z, x);
          const sunAngle = Math.abs(Math.sin(angle * 8) * 0.5 + 0.5);
          const isOuter = dist === 2;

          if (isOuter && sunAngle > 0.72) {
            block(
              (x - 2) * voxelSize + 2.5,
              0.12 + y * voxelSize,
              (z - 2) * voxelSize + 2.5,
              materials.yellow || materials.sun,
              voxelSize * 0.8,
              voxelSize * 0.8,
              voxelSize * 0.8
            );
          } else if (isOuter && sunAngle < 0.72) {
            block(
              (x - 2) * voxelSize + 2.5,
              0.12 + y * voxelSize,
              (z - 2) * voxelSize + 2.5,
              materials.purple || new THREE.MeshStandardMaterial({ color: 0x8a4bd8 }),
              voxelSize * 0.8,
              voxelSize * 0.8,
              voxelSize * 0.8
            );
          } else if (y === 0 && (x === 2 || z === 2)) {
            block(
              (x - 2) * voxelSize + 2.5,
              0.12 + y * voxelSize,
              (z - 2) * voxelSize + 2.5,
              materials.yellow || materials.sun,
              voxelSize * 0.8,
              voxelSize * 0.8,
              voxelSize * 0.8
            );
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Skyline walls
    // -------------------------------------------------------------------------

    const wallHeight = 9;
    const wallWidth = 29;

    // Back and side walls, built as a single voxel shell.
    for (let x = -wallWidth / 2; x < wallWidth / 2; x++) {
      for (let z = -wallWidth / 2; z < wallWidth / 2; z++) {
        const px = x * voxelSize + voxelSize / 2;
        const pz = z * voxelSize + voxelSize / 2;

        const onBack = Math.abs(z) < 2.5;
        const onSide = Math.abs(x) < 2.5;
        const corner = Math.abs(x) < 3 && Math.abs(z) < 3;

        if (onBack || onSide || corner) {
          for (let y = 0; y < wallHeight; y++) {
            const py = y * voxelSize + voxelSize / 2;

            if (y === 8) {
              wallBlock(px, py, pz, materials.paleBlue);
            } else {
              wallBlock(px, py, pz, materials.blue);
            }
          }
        }
      }
    }

    // Upper cornice and lower wall trim.
    for (let x = -wallWidth / 2; x < wallWidth / 2; x++) {
      for (let z = -wallWidth / 2; z < wallWidth / 2; z++) {
        const px = x * voxelSize + voxelSize / 2;
        const pz = z * voxelSize + voxelSize / 2;

        if (Math.abs(x) < 3 || Math.abs(z) < 3) continue;

        block(px, 8.75, pz, materials.white);
        block(px, 0.25, pz, materials.white);
        block(px, 1.25, pz, materials.paleBlue);
        block(px, 8.25, pz, materials.paleBlue);
      }
    }

    // Decorative wall panels.
    for (let x = -10; x <= 10; x += 4) {
      for (let z = -10; z <= 10; z += 4) {
        if (Math.abs(x) < 3 || Math.abs(z) < 3) continue;

        block(x * voxelSize + 2.1, 3.1, z * voxelSize + 2.1, materials.paleBlue);
        block(x * voxelSize + 2.1, 3.1, z * voxelSize + 2.1, materials.gold, 0.7, 0.7, 0.7);
      }
    }

    // -------------------------------------------------------------------------
    // Windows
    // -------------------------------------------------------------------------

    function createWindow(x, z, width = 2.4, height = 3.4) {
      const cx = x * voxelSize + voxelSize / 2;
      const cz = z * voxelSize + voxelSize / 2;

      // Stone frame.
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (i === 0 || i === width - 1 || j === 0 || j === height - 1) {
            block(
              cx + (i - (width - 1) / 2) * voxelSize,
              4.1 + j * voxelSize,
              cz + (z - 10) * voxelSize,
              materials.white
            );
          }
        }
      }

      // Arched top made from stepped voxels.
      for (let i = 0; i < width; i++) {
        const offset = (i - (width - 1) / 2) * voxelSize;
        const archHeight = Math.max(0, 1 - Math.abs(i - (width - 1) / 2));
        for (let j = 0; j < archHeight; j++) {
          block(
            cx + offset,
            4.1 + (height - 1) * voxelSize + j * voxelSize,
            cz + (z - 10) * voxelSize,
            materials.white
          );
        }
      }

      // Glass panes.
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height - 2; j++) {
          block(
            cx + (i - (width - 1) / 2) * voxelSize,
            4.45 + j * voxelSize,
            cz + (z - 10) * voxelSize,
            materials.glass,
            voxelSize * 0.82,
            voxelSize * 0.82,
            voxelSize * 0.82
          );
        }
      }

      // Cross mullions.
      for (let i = -1; i <= 1; i++) {
        block(
          cx + i * voxelSize,
          4.45 + (height - 2) / 2 * voxelSize,
          cz + (z - 10) * voxelSize,
          materials.gold,
          voxelSize * 0.8,
          voxelSize * 0.8,
          voxelSize * 0.35
        );
      }

      block(
        cx,
        4.45 + (height - 2) / 2 * voxelSize,
        cz + (z - 10) * voxelSize,
        materials.gold,
        voxelSize * 0.35,
        voxelSize * 0.8,
        voxelSize * 0.8
      );
    }

    for (let x = -12; x <= 12; x += 4) {
      createWindow(x, -10, 2.4, 3.4);
    }

    // -------------------------------------------------------------------------
    // Columns
    // -------------------------------------------------------------------------

    function createColumn(x, z, height = 8.4) {
      const cx = x * voxelSize + voxelSize / 2;
      const cz = z * voxelSize + voxelSize / 2;

      // Base.
      block(cx, 0.45, cz, materials.white, 2.4, 0.7, 2.4);
      block(cx, 0.95, cz, materials.paleBlue, 2.0, 0.5, 2.0);

      // Shaft.
      for (let y = 0; y < height; y += 0.5) {
        block(
          cx,
          1.2 + y,
          cz,
          materials.white
        );
      }

      // Capital.
      block(cx, height, cz, materials.white, 2.2, 0.7, 2.2);
      block(cx, height + 0.45, cz, materials.gold, 1.8, 0.35, 1.8);
    }

    const columnPositions = [
      [-12, -10], [-8, -10], [-4, -10], [0, -10], [4, -10], [8, -10], [12, -10],
      [-12, -6], [-12, -2], [-12, 2], [-12, 6],
      [12, -6], [12, -2], [12, 2], [12, 6],
      [-8, 0], [-4, 0], [0, 0], [4, 0], [8, 0]
    ];

    for (const [x, z] of columnPositions) {
      createColumn(x, z);
    }

    // -------------------------------------------------------------------------
    // Balustrades
    // -------------------------------------------------------------------------

    function balustrade(x1, z1, x2, z2, y = 1.6) {
      const length = Math.hypot(x2 - x1, z2 - z1);
      const steps = Math.ceil(length / voxelSize);
      const dx = (x2 - x1) / steps;
      const dz = (z2 - z1) / steps;

      for (let i = 0; i <= steps; i++) {
        const x = x1 + dx * i;
        const z = z1 + dz * i;

        block(x, y, z, materials.white, 0.65, 0.65, 0.65);
        block(x, y + 0.38, z, materials.paleBlue, 0.45, 0.35, 0.45);
        block(x, y + 0.72, z, materials.gold, 0.3, 0.18, 0.3);
      }

      // Handrail.
      for (let i = 0; i < steps; i++) {
        const x = x1 + dx * (i + 0.5);
        const z = z1 + dz * (i + 0.5);
        block(x, y + 0.68, z, materials.white, 0.42, 0.42, 0.42);
        block(x, y + 0.92, z, materials.gold, 0.3, 0.16, 0.3);
      }
    }

    // Main central staircase.
    const stairCount = 16;
    const stairWidth = 5.2;
    const stairStartX = 0;
    const stairStartZ = 4.2;
    const stairRise = 3.8;

    for (let i = 0; i < stairCount; i++) {
      const t = i / (stairCount - 1);
      const x = stairStartX;
      const z = stairStartZ + t * 4.1;
      const y = stairRise * t;

      // Carpet tread.
      block(x, y, z, materials.carpet, 5.0, 0.35, voxelSize * 1.15);

      // Side carpet borders.
      block(x - 2.65, y + 0.22, z, materials.carpetEdge, 0.25, 0.35, voxelSize * 1.15);
      block(x + 2.65, y + 0.22, z, materials.carpetEdge, 0.25, 0.35, voxelSize * 1.15);

      // Steps underneath.
      block(x, y - 0.22, z, materials.paleBlue, 5.4, 0.45, voxelSize * 1.15);
    }

    // Staircase handrails.
    balustrade(-2.75, stairStartZ, -2.75, stairStartZ + 4.2, 1.55);
    balustrade(2.75, stairStartZ, 2.75, stairStartZ + 4.2, 1.55);

    // Side staircase on the left.
    const sideStartX = -12.7;
    const sideStartZ = 4.2;
    const sideEndX = -12.7;
    const sideEndZ = -5.7;

    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const x = sideStartX + (sideEndX - sideStartX) * t;
      const z = sideStartZ + (sideEndZ - sideStartZ) * t;
      const y = 3.8 * t;

      block(x, y, z, materials.carpet, voxelSize * 1.15, 0.35, 3.8);
      block(x, y - 0.22, z, materials.paleBlue, voxelSize * 1.15, 0.45, 3.8);
    }

    balustrade(sideStartX, sideStartZ, sideEndX, sideEndZ, 1.55);

    // Lower side balcony.
    for (let x = -13; x <= 13; x += 2) {
      for (let z = -8; z <= -2; z += 2) {
        if (Math.abs(x) < 3 || Math.abs(z) < 2) continue;
        block(x, 1.2, z, materials.blue);
        block(x, 1.75, z, materials.paleBlue);
        block(x, 2.05, z, materials.white);
      }
    }

    // -------------------------------------------------------------------------
    // Throne platform at the back
    // -------------------------------------------------------------------------

    const throneX = 0;
    const throneZ = -10.5;

    // Raised platform.
    for (let x = -4; x <= 4; x++) {
      for (let z = -14; z <= -7; z++) {
        block(
          x * voxelSize + voxelSize / 2,
          0.35,
          z * voxelSize + voxelSize / 2,
          materials.paleBlue
        );
      }
    }

    for (let x = -4; x <= 4; x++) {
      block(
        x * voxelSize + voxelSize / 2,
        0.72,
        throneZ,
        materials.gold
      );
    }

    // Throne chair made from blocks.
    const chairX = 0;
    const chairZ = throneZ - 1.4;

    // Seat and back.
    for (let x = -2; x <= 2; x++) {
      block(
        chairX + x * voxelSize,
        2.0,
        chairZ,
        materials.redDark
      );
    }

    for (let x = -2; x <= 2; x++) {
      for (let y = 0; y < 3; y++) {
        block(
          chairX + x * voxelSize,
          2.7 + y * voxelSize,
          chairZ - 0.7,
          materials.redDark
        );
      }
    }

    // Armrests.
    for (const side of [-1, 1]) {
      for (let z = chairZ - 1.2; z <= chairZ + 0.5; z += 0.5) {
        block(
          chairX + side * 2.1,
          2.7,
          z,
          materials.redDark
        );
      }
    }

    // Throne curtains.
    for (const side of [-1, 1]) {
      for (let y = 0; y < 4; y++) {
        for (let z = 0; z < 4; z++) {
          const wave = Math.sin(y * 0.8 + z * 0.6) * 0.35;
          block(
            chairX + side * (2.2 + wave),
            1.45 + y * voxelSize,
            throneZ + 0.4 + z * voxelSize,
            materials.red
          );
        }
      }
    }

    // Crown above the throne.
    for (let y = 0; y < 3; y++) {
      const radius = 1.15 - y * 0.15;
      for (let x = -2; x <= 2; x++) {
        for (let z = -2; z <= 2; z++) {
          if (x * x + z * z <= radius * radius) {
            block(
              chairX + x * voxelSize,
              4.1 + y * voxelSize,
              throneZ + z * voxelSize,
              y === 1 ? materials.gold : materials.paleBlue
            );
          }
        }
      }
    }

    // -------------------------------------------------------------------------
    // Columns and upper balcony
    // -------------------------------------------------------------------------

    // Already created columns support the upper balcony.
    // Add balcony floor and railing.
    for (let x = -13; x <= 13; x += 2) {
      for (let z = -12; z <= -2; z += 2) {
        if (Math.abs(x) < 3 || Math.abs(z) < 2) continue;
        block(x, 8.45, z, materials.paleBlue);
        block(x, 8.85, z, materials.white);
      }
    }

    balustrade(-13, -2, 13, -2, 9.3);
    balustrade(-13, -12, -13, -2, 9.3);
    balustrade(13, -12, 13, -2, 9.3);

    // -------------------------------------------------------------------------
    // Sky dome / upper structure
    // -------------------------------------------------------------------------

    // A pale blue dome made from stacked circular voxel rings.
    for (let y = 8; y <= 12; y++) {
      const radius = 13 - (y - 8) * 1.4;

      for (let x = -radius; x <= radius; x++) {
        for (let z = -radius; z <= radius; z++) {
          const dx = x / radius;
          const dz = z / radius;

          if (dx * dx + dz * dz <= 1.1) {
            const material = y === 12 ? materials.paleBlue : materials.blue;
            block(x * voxelSize + voxelSize / 2, y * voxelSize + voxelSize / 2, z * voxelSize + voxelSize / 2, material);
          }
        }
      }
    }

    // Clouds in the sky.
    function createCloud(x, y, z, scale = 1) {
      const cloudMaterial = materials.cloud;

      const blobs = [
        [-1.2, 0, 0, 1.1],
        [0, 0.25, 0, 1.35],
        [1.2, 0, 0, 1.0],
        [0.45, -0.35, 0.1, 0.9],
        [-0.55, -0.2, 0.15, 0.8]
      ];

      for (const [bx, by, bz, s] of blobs) {
        for (let ix = 0; ix < 3; ix++) {
          for (let iy = 0; iy < 2; iy++) {
            for (let iz = 0; iz < 3; iz++) {
              if (
                ix === 0 && iy === 1 ||
                ix === 2 && iy === 0 ||
                (ix === 1 && iy === 0 && iz === 0)
              ) {
                block(
                  x + (bx + ix * 0.45) * voxelSize * scale,
                  y + (by + iy * 0.4) * voxelSize * scale,
                  z + (bz + iz * 0.4) * voxelSize * scale,
                  cloudMaterial,
                  voxelSize * 0.8 * scale,
                  voxelSize * 0.8 * scale,
                  voxelSize * 0.8 * scale
                );
              }
            }
          }
        }
      }
    }

    createCloud(-8, 10.5, 4, 1.2);
    createCloud(7, 11.8, -2, 1.0);
    createCloud(1, 13, 9, 0.8);

    // Sun disc.
    for (let x = 0; x < 7; x++) {
      for (let z = 0; z < 7; z++) {
        const dist = Math.hypot(x - 3, z - 3);
        if (dist <= 3.2) {
          block(
            17 + x * voxelSize,
            10.5 + z * voxelSize,
            -22,
            materials.sun,
            voxelSize * 0.8,
            voxelSize * 0.8,
            voxelSize * 0.8
          );
        }
      }
    }

    // -------------------------------------------------------------------------
    // Build instanced meshes
    // -------------------------------------------------------------------------

    buildBatches();

    // Separate sky elements for easier material management.
    const skyBlocks = [];
    const skyTransforms = [];

    for (const batch of batches.values()) {
      if (batch.material === materials.cloud || batch.material === materials.sun) {
        skyBlocks.push({
          x: batch.x,
          y: batch.y,
          z: batch.z,
          sx: batch.size,
          sy: batch.size,
          sz: batch.size
        });
      }
    }

    const skyGeometry = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize);

    for (const item of skyBlocks) {
      const mesh = new THREE.Mesh(
        skyGeometry,
        item.material
      );
      mesh.position.set(item.x, item.y, item.z);
      mesh.scale.set(
        item.sx,
        item.sy,
        item.sz
      );
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      skyTransforms.push(mesh);
    }

    scene.add(
      new THREE.Group().add(
        new THREE.InstancedMesh(
          skyGeometry,
          new THREE.MeshStandardMaterial({
            vertexColors: false
          }),
          skyTransforms.length
        )
      )
    );

    for (let i = 0; i < skyTransforms.length; i++) {
      skyTransforms[i].position.y += voxelSize * 0.5;
    }

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    const hemisphere = new THREE.HemisphereLight(
      0xdaf3ff,
      0x71513b,
      2.1
    );
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(
      0xfff1cf,
      3.4
    );
    sun.position.set(12, 22, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -25;
    sun.shadow.camera.right = 25;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 65;
    sun.shadow.bias = -0.0005;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(
      0x8ecbff,
      1.1
    );
    fill.position.set(-15, 8, -10);
    scene.add(fill);

    // -------------------------------------------------------------------------
    // Custom camera controls
    // -------------------------------------------------------------------------

    const target = new THREE.Vector3(0, 4.5, -2);
    const spherical = new THREE.Spherical(27, 1.16, 0.72);
    const initialTarget = target.clone();
    const initialSpherical = spherical.clone();

    let dragging = false;
    let panning = false;
    let lastX = 0;
    let lastY = 0;
    let pointerId = null;

    const canvas = renderer.domElement;

    canvas.addEventListener("contextmenu", event => {
      event.preventDefault();
    });

    canvas.addEventListener("pointerdown", event => {
      dragging = true;
      panning = event.button === 2 || event.shiftKey;
      pointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(pointerId);
      canvas.style.cursor = panning ? "move" : "grabbing";
    });

    canvas.addEventListener("pointermove", event => {
      if (!dragging || event.pointerId !== pointerId) return;

      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;

      if (panning) {
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();

        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();
        up.cross(right).normalize();

        const panScale = spherical.radius * 0.0015;
        target.addScaledVector(right, -dx * panScale);
        target.addScaledVector(up, dy * panScale);

        target.x = THREE.MathUtils.clamp(target.x, -18, 18);
        target.y = THREE.MathUtils.clamp(target.y, 1, 13);
        target.z = THREE.MathUtils.clamp(target.z, -18, 18);
      } else {
        spherical.theta -= dx * 0.005;
        spherical.phi = THREE.MathUtils.clamp(
          spherical.phi - dy * 0.005,
          0.25,
          Math.PI * 0.48
        );
      }
    });

    function endDrag(event) {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      panning = false;
      pointerId = null;
      canvas.style.cursor = "grab";
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerleave", event => {
      if (dragging && event.pointerId === pointerId) endDrag(event);
    });

    canvas.addEventListener("wheel", event => {
      event.preventDefault();
      spherical.radius = THREE.MathUtils.clamp(
        spherical.radius * Math.exp(event.deltaY * 0.001),
        11,
        52
      );
    }, { passive: false });

    // Gentle idle camera drift until the user interacts.
    let idleTime = 0;
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.05);
      idleTime += dt;

      if (
        !dragging &&
        !panning &&
        idleTime > 3 &&
        target.distanceTo(initialTarget) < 0.01 &&
        spherical.radius === initialSpherical.radius &&
        spherical.phi === initialSpherical.phi &&
        spherical.theta === initialSpherical.theta
      ) {
        spherical.theta += dt * 0.018;
      }

      spherical.makeSafe();
      camera.position.setFromSpherical(spherical).add(target);
      camera.lookAt(target);

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    // Start with a composed view.
    camera.position.set(23, 17, 26);
    camera.lookAt(target);

    dummyEl().style.opacity = "0";
    setTimeout(() => {
      dummyEl().remove();
    }, 600);

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
    relic: { id: "generic", name: "Super Mario Odyssey Relic", x: -10.0, z: -12.0 },
    env:   { background: 0xb9d9ed, fogColor: 0xb9d9ed, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
