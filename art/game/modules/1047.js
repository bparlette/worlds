// @world {"id": "1047", "title": "The Elder Scrolls V: Skyrim", "sub": "Skyrim VG Remix Diorama", "system": "3D Render"}
// Converted from 1047-the_elder_scrolls_v_skyrim_skyrim_vg_remix_diorama.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): flowers, rocks
  let flowers = 0;
  let rocks = 0;

    

    // -------------------------------------------------------------------------
    // Renderer and scene
    // -------------------------------------------------------------------------
    renderer = dummyRenderer();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // scene redirect
    scene.background = new THREE.Color(0x080b10);
    scene.fog = new THREE.FogExp2(0x080b10, 0.035);

    camera = dummyCamera();

    // Custom camera controls; no addons.
    const controls = {
      target: new THREE.Vector3(0, 2.2, 0),
      radius: 15.5,
      theta: 0.72,
      phi: 1.05,
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
    updateCamera();

    scene.add(new THREE.HemisphereLight(0xb9dcff, 0x302517, 2.0));

    const key = new THREE.DirectionalLight(0xfff1cf, 3.2);
    key.position.set(7, 12, 8);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 35;
    key.shadow.bias = -0.0004;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x6ea8ff, 1.8);
    rim.position.set(-8, 6, -9);
    scene.add(rim);

    // -------------------------------------------------------------------------
    // Voxel materials
    // -------------------------------------------------------------------------
    const mat = {
      grass: new THREE.MeshStandardMaterial({
        color: 0x65a943, roughness: 0.95
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x83bd55, roughness: 0.95
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: 0x478436, roughness: 1
      }),
      soil: new THREE.MeshStandardMaterial({
        color: 0x6b4930, roughness: 1
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x8c98a1, roughness: 0.95
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0xb5b9b4, roughness: 0.9
      }),
      stoneDark: new THREE.MeshStandardMaterial({
        color: 0x53616a, roughness: 1
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x8b572e, roughness: 0.95
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0xb57a43, roughness: 0.9
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xd3a23e, roughness: 0.72, metalness: 0.15
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xd94f45, roughness: 0.85
      }),
      redDark: new THREE.MeshStandardMaterial({
        color: 0x9d2f32, roughness: 0.9
      }),
      cream: new THREE.MeshStandardMaterial({
        color: 0xf0d8a0, roughness: 0.85
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x3778b4, roughness: 0.8
      }),
      purple: new THREE.MeshStandardMaterial({
        color: 0x7755aa, roughness: 0.85
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: 0x3e8d3a, roughness: 0.95
      }),
      leafLight: new THREE.MeshStandardMaterial({
        color: 0x58a845, roughness: 0.95
      }),
      leafDark: new THREE.MeshStandardMaterial({
        color: 0x2c6e32, roughness: 1
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x171b1d, roughness: 0.9
      })
    };

    function box(w, h, d, material, x, y, z, parent = scene) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    // Small block gaps make the construction read as voxels.
    function voxelBox(
      w, h, d, material,
      x, y, z,
      parent = scene,
      gap = 0.035
    ) {
      const mesh = box(w - gap, h - gap, d - gap, material, x, y, z, parent);
      return mesh;
    }

    // -------------------------------------------------------------------------
    // Floating island base
    // -------------------------------------------------------------------------
    const island = new THREE.Group();
    scene.add(island);

    // Lower foundation: stacked irregular stone courses.
    for (let y = 0; y < 4; y++) {
      const halfWidth = 4.75 - y * 0.34;
      const offset = y % 2 ? 0.22 : 0;

      for (let x = -4; x <= 4; x++) {
        for (let z = -4; z <= 4; z++) {
          const edge = Math.max(
            Math.abs(x) / 4.5,
            Math.abs(z) / 4.5
          );
          const angle = Math.atan2(z, x);
          const irregular =
            1 - 0.18 * Math.sin(angle * 3 + y) - 0.1 * Math.cos(angle * 5);

          if (edge > 0.93 && y === 3) continue;

          const w = 1.02;
          const d = 1.02;
          const h = 0.62;

          let material = mat.stone;
          if ((x + z + y) % 3 === 0) material = mat.stoneLight;
          if ((x + z + y) % 5 === 0) material = mat.stoneDark;

          voxelBox(
            w, h, d,
            material,
            x + offset,
            0.31 + y * 0.66,
            z + offset * 0.7,
            island,
            0.045
          );
        }
      }
    }

    // Curved grass top.
    const topRadius = 4.55;
    const topSegments = 18;

    for (let ix = 0; ix <= topSegments; ix++) {
      const a = (ix / topSegments) * Math.PI * 2;
      const x = Math.cos(a) * topRadius;
      const z = Math.sin(a) * topRadius;

      for (let iz = 0; iz <= topSegments; iz++) {
        const b = (iz / topSegments) * Math.PI * 2;
        const px = Math.cos(b) * topRadius;
        const pz = Math.sin(b) * topRadius;

        const dx = x - px;
        const dz = z - pz;
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance > 1.35) continue;

        const angle = Math.atan2(dz, dx);
        const edge = Math.max(
          Math.abs(x) / topRadius,
          Math.abs(z) / topRadius
        );

        let material = mat.grass;
        if (edge > 0.78) material = mat.grassDark;
        if (Math.sin(angle * 5 + distance * 2) > 0.75) {
          material = mat.grassLight;
        }

        voxelBox(
          0.78, 0.48, 0.78,
          material,
          x,
          0.98,
          z,
          island,
          0.055
        );
      }
    }

    // Exposed soil side and broken edge.
    for (let i = 0; i < 13; i++) {
      const a = (i / 13) * Math.PI * 2;
      const x = Math.cos(a) * 4.3;
      const z = Math.sin(a) * 4.3;
      const irregular = 1 - 0.13 * Math.sin(a * 3);

      voxelBox(
        0.8, 0.48, 0.3,
        mat.soil,
        x * irregular,
        0.72,
        z * irregular,
        island,
        0.04
      );
    }

    // -------------------------------------------------------------------------
    // Trees
    // -------------------------------------------------------------------------
    function makeTree(x, z, scale = 1, parent = island) {
      const tree = new THREE.Group();
      tree.position.set(x, 1.02, z);
      tree.scale.setScalar(scale);
      parent.add(tree);

      // Root blocks.
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        voxelBox(
          0.45, 0.34, 0.45,
          mat.wood,
          Math.cos(a) * 0.28,
          0.18,
          Math.sin(a) * 0.28,
          tree,
          0.05
        );
      }

      // Trunk.
      voxelBox(0.55, 2.05, 0.55, mat.wood, 0, 1.15, 0, tree, 0.06);
      voxelBox(0.68, 0.55, 0.68, mat.woodLight, 0, 2.05, 0, tree, 0.06);

      // Layered cubic canopy.
      const layers = [
        { y: 2.75, sx: 2.55, sy: 0.72, sz: 2.55 },
        { y: 3.5, sx: 1.85, sy: 0.72, sz: 1.85 },
        { y: 4.18, sx: 1.15, sy: 0.72, sz: 1.15 }
      ];

      layers.forEach((layer, i) => {
        const material = i === 1 ? mat.leafLight : mat.leaf;
        voxelBox(
          layer.sx, layer.sy, layer.sz,
          material,
          0, layer.y, 0,
          tree,
          0.09
        );

        // Exposed branch ends.
        for (let j = 0; j < 3; j++) {
          const a = (j / 3) * Math.PI * 2 + i;
          voxelBox(
            0.38, 0.34, 0.38,
            mat.leafDark,
            Math.cos(a) * (layer.sx * 0.46),
            layer.y + 0.2,
            Math.sin(a) * (layer.sx * 0.46),
            tree,
            0.07
          );
        }
      });

      return tree;
    }

    makeTree(-1.35, 1.05, 0.95);
    makeTree(1.25, 0.75, 0.82);
    makeTree(0.45, -1.45, 0.72);

    // A wind-whipped tree on the right with displaced leaves.
    const windTree = makeTree(2.45, -0.45, 1.05);
    windTree.rotation.z = -0.13;

    const displacedLeaves = [];
    for (let i = 0; i < 18; i++) {
      const leaf = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.38, 0.28),
        i % 3 === 0 ? mat.leafLight : mat.leaf
      );
      const angle = (i / 18) * Math.PI * 2 + 0.2;
      leaf.position.set(
        2.45 + Math.cos(angle) * 1.4,
        4.4 + (i % 4) * 0.2,
        -0.45 + Math.sin(angle) * 1.4
      );
      leaf.rotation.set(0.2, angle, 0.1);
      leaf.castShadow = true;
      scene.add(leaf);
      displacedLeaves.push(leaf);
    }

    // -------------------------------------------------------------------------
    // Dragon
    // -------------------------------------------------------------------------
    const dragon = new THREE.Group();
    dragon.position.set(0.35, 4.65, -0.65);
    dragon.rotation.y = -0.35;
    island.add(dragon);

    // Body built from overlapping cubic chunks.
    voxelBox(1.25, 0.75, 0.95, mat.red, 0, 0, 0, dragon, 0.08);
    voxelBox(0.95, 0.85, 1.05, mat.red, 0.75, 0.05, 0, dragon, 0.08);
    voxelBox(0.7, 0.72, 0.85, mat.cream, 1.38, 0.12, 0, dragon, 0.08);

    // Head.
    voxelBox(0.82, 0.65, 0.72, mat.cream, 2.02, 0.38, 0, dragon, 0.08);
    voxelBox(0.4, 0.42, 0.5, mat.red, 2.5, 0.48, 0, dragon, 0.08);

    // Snout and nostrils.
    voxelBox(0.35, 0.24, 0.42, mat.cream, 2.72, 0.39, 0, dragon, 0.07);
    voxelBox(0.08, 0.1, 0.16, mat.black, 2.94, 0.4, 0.12, dragon, 0.04);
    voxelBox(0.08, 0.1, 0.16, mat.black, 2.94, 0.4, -0.12, dragon, 0.04);

    // Eyes.
    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0x111519,
      roughness: 0.35
    });
    voxelBox(0.16, 0.16, 0.12, eyeMaterial, 2.34, 0.66, 0.36, dragon, 0.055);
    voxelBox(0.16, 0.16, 0.12, eyeMaterial, 2.34, 0.66, -0.36, dragon, 0.055);

    // Horns.
    for (let i = 0; i < 2; i++) {
      const z = i === 0 ? 0.38 : -0.38;
      voxelBox(0.13, 0.25, 0.13, mat.redDark, 2.2, 0.95, z, dragon, 0.07);
      voxelBox(0.1, 0.3, 0.1, mat.red, 2.2, 1.18, z, dragon, 0.06);
    }

    // Wings made from block panels and ribs.
    for (const side of [-1, 1]) {
      const wing = new THREE.Group();
      wing.position.set(side * 0.58, 0.05, 0);
      wing.rotation.z = side * -0.18;
      dragon.add(wing);

      voxelBox(1.35, 0.18, 0.55, mat.redDark, 0, 0, 0, wing, 0.08);
      voxelBox(0.95, 0.12, 0.45, mat.red, 0.62, 0.1, 0, wing, 0.08);
      voxelBox(0.55, 0.1, 0.36, mat.red, 1.12, 0.16, 0, wing, 0.08);

      for (let i = 0; i < 4; i++) {
        voxelBox(
          0.1, 0.65, 0.1,
          mat.redDark,
          side * 0.28,
          0.38 - i * 0.19,
          0,
          wing,
          0.055
        );
      }
    }

    // Tail as a descending voxel chain.
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 1.7 + 0.2;
      const r = 0.55 + i * 0.17;
      const segment = voxelBox(
        0.42, 0.3, 0.3,
        i % 2 ? mat.red : mat.redDark,
        Math.cos(a) * r,
        -0.15 - i * 0.2,
        Math.sin(a) * r,
        dragon,
        0.07
      );
      segment.rotation.y = -a;
    }

    // Legs.
    for (const side of [-1, 1]) {
      voxelBox(0.45, 0.55, 0.5, mat.red, side * 0.55, -0.34, 0.15, dragon, 0.07);
      voxelBox(0.32, 0.28, 0.42, mat.cream, side * 0.7, -0.66, 0.18, dragon, 0.06);
    }

    // Small spikes.
    for (let i = 0; i < 4; i++) {
      voxelBox(
        0.12, 0.28, 0.12,
        mat.redDark,
        0.72 + i * 0.22,
        0.65,
        0.42,
        dragon,
        0.05
      );
    }

    // -------------------------------------------------------------------------
    // Knight on the island
    // -------------------------------------------------------------------------
    const knight = new THREE.Group();
    knight.position.set(-1.45, 1.03, -0.25);
    knight.rotation.y = -0.4;
    island.add(knight);

    // Boots.
    voxelBox(0.36, 0.42, 0.28, mat.black, -0.22, 0.2, 0.2, knight, 0.055);
    voxelBox(0.36, 0.42, 0.28, mat.black, 0.22, 0.2, 0.2, knight, 0.055);

    // Legs.
    voxelBox(0.3, 0.65, 0.34, mat.blue, -0.18, 0.66, 0, knight, 0.06);
    voxelBox(0.3, 0.65, 0.34, mat.blue, 0.18, 0.66, 0, knight, 0.06);

    // Torso and belt.
    voxelBox(0.68, 0.78, 0.48, mat.blue, 0, 1.25, 0, knight, 0.065);
    voxelBox(0.82, 0.18, 0.55, mat.gold, 0, 1.03, 0, knight, 0.055);

    // Shield.
    const shield = new THREE.Group();
    shield.position.set(-0.52, 1.28, 0.04);
    shield.rotation.y = 0.15;
    knight.add(shield);

    voxelBox(0.5, 0.62, 0.12, mat.wood, 0, 0, 0, shield, 0.05);
    voxelBox(0.24, 0.3, 0.14, mat.gold, 0, 0, 0.015, shield, 0.035);
    for (let i = 0; i < 3; i++) {
      voxelBox(
        0.055, 0.28, 0.15,
        mat.gold,
        0,
        0,
        0.02,
        shield,
        0.02
      );
    }

    // Arms and sword.
    voxelBox(0.27, 0.65, 0.3, mat.blue, -0.47, 1.27, 0, knight, 0.06);
    voxelBox(0.27, 0.65, 0.3, mat.blue, 0.47, 1.27, 0, knight, 0.06);
    voxelBox(0.25, 0.25, 0.3, mat.gold, 0.48, 0.91, 0, knight, 0.06);

    const sword = new THREE.Group();
    sword.position.set(0.62, 1.36, 0.1);
    sword.rotation.z = -0.25;
    knight.add(sword);

    voxelBox(0.11, 1.1, 0.11, mat.gold, 0, 0, 0, sword, 0.04);
    voxelBox(0.38, 0.12, 0.14, mat.gold, 0, 0.54, 0, sword, 0.04);
    voxelBox(0.18, 0.06, 0.1, mat.cream, 0, 0.96, 0, sword, 0.04);

    // Helmet.
    voxelBox(0.5, 0.3, 0.4, mat.gold, 0, 1.72, 0, knight, 0.06);
    voxelBox(0.58, 0.1, 0.48, mat.gold, 0, 1.89, 0, knight, 0.06);

    // -------------------------------------------------------------------------
    // Lower-level adventurer
    // -------------------------------------------------------------------------
    const lowerKnight = new THREE.Group();
    lowerKnight.position.set(-0.75, 0.4, 0.1);
    lowerKnight.rotation.y = 0.6;
    scene.add(lowerKnight);

    voxelBox(0.34, 0.42, 0.28, mat.black, -0.2, 0.2, 0.18, lowerKnight, 0.055);
    voxelBox(0.34, 0.42, 0.28, mat.black, 0.2, 0.2, 0.18, lowerKnight, 0.055);
    voxelBox(0.3, 0.65, 0.34, mat.blue, -0.18, 0.68, 0, lowerKnight, 0.06);
    voxelBox(0.3, 0.65, 0.34, mat.blue, 0.18, 0.68, 0, lowerKnight, 0.06);
    voxelBox(0.68, 0.78, 0.48, mat.blue, 0, 1.25, 0, lowerKnight, 0.065);
    voxelBox(0.82, 0.18, 0.55, mat.gold, 0, 1.03, 0, lowerKnight, 0.055);
    voxelBox(0.5, 0.3, 0.4, mat.gold, 0, 1.72, 0, lowerKnight, 0.06);
    voxelBox(0.58, 0.1, 0.48, mat.gold, 0, 1.89, 0, lowerKnight, 0.06);

    const lowerSword = new THREE.Group();
    lowerSword.position.set(0.62, 1.37, 0.05);
    lowerSword.rotation.z = 0.25;
    lowerKnight.add(lowerSword);
    voxelBox(0.11, 1.1, 0.11, mat.gold, 0, 0, 0, lowerSword, 0.04);
    voxelBox(0.38, 0.12, 0.14, mat.gold, 0, 0.54, 0, lowerSword, 0.04);

    // -------------------------------------------------------------------------
    // Treasure room
    // -------------------------------------------------------------------------
    const room = new THREE.Group();
    room.position.set(1.05, 0.4, -0.1);
    scene.add(room);

    // Rear wall.
    for (let i = 0; i < 7; i++) {
      voxelBox(
        0.8, 2.2, 0.45,
        i % 2 ? mat.wood : mat.woodLight,
        -2.4 + i * 0.8,
        1.1,
        -0.55,
        room,
        0.045
      );
    }

    // Side wall.
    for (let i = 0; i < 5; i++) {
      voxelBox(
        0.45, 2.2, 0.8,
        i % 2 ? mat.wood : mat.woodLight,
        -3.05,
        1.1,
        -0.85 + i * 0.8,
        room,
        0.045
      );
    }

    // Ceiling beams.
    for (let i = 0; i < 3; i++) {
      voxelBox(
        6.2, 0.3, 0.35,
        mat.wood,
        0,
        2.35,
        -1.05 + i * 1.2,
        room,
        0.04
      );
    }

    // Chest.
    const chest = new THREE.Group();
    chest.position.set(1.85, 0.55, 0.2);
    chest.rotation.y = -0.15;
    room.add(chest);

    voxelBox(1.15, 0.58, 0.75, mat.wood, 0, 0, 0, chest, 0.06);
    voxelBox(1.27, 0.08, 0.87, mat.gold, 0, 0.31, 0, chest, 0.05);
    voxelBox(0.16, 0.48, 0.16, mat.gold, 0, 0, 0, chest, 0.05);
    voxelBox(0.34, 0.25, 0.08, mat.gold, 0, 0.08, 0.41, chest, 0.04);

    // Treasure glow.
    const glow = new THREE.PointLight(0xffa73d, 1.1, 4.5);
    glow.position.set(1.85, 1.15, 0.2);
    scene.add(glow);

    // Bottles and jars.
    function makeJar(x, y, z, material, parent = scene) {
      voxelBox(0.28, 0.42, 0.28, material, x, y, z, parent, 0.055);
      voxelBox(0.34, 0.08, 0.34, material, x, y + 0.23, z, parent, 0.045);
    }

    makeJar(-1.85, 0.45, 0.7, mat.red);
    makeJar(-1.4, 0.45, 0.85, mat.blue);
    makeJar(-2.05, 0.45, 0.35, mat.purple);

    // Pot.
    voxelBox(0.55, 0.45, 0.55, mat.stoneDark, -2.35, 0.47, 0.75, scene, 0.055);
    voxelBox(0.42, 0.1, 0.42, mat.stone, -2.35, 0.72, 0.75, scene, 0.05);

    // Small glowing crystal.
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.24, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffb547,
        emissive: 0xff6a18,
        emissiveIntensity: 1.4,
        roughness: 0.3
      })
    );
    crystal.position.set(-2.35, 0.95, 0.75);
    crystal.scale.y = 1.6;
    scene.add(crystal);

    // -------------------------------------------------------------------------
    // Path, rocks, flowers, and grass
    // -------------------------------------------------------------------------
    // Stone path.
    for (let i = 0; i < 10; i++) {
      const a = 0.15 + (i / 9) * 0.7;
      const x = Math.cos(a) * 1.7;
      const z = Math.sin(a) * 1.7;
      const stone = voxelBox(
        0.65, 0.22, 0.65,
        i % 3 === 0 ? mat.stoneLight : mat.stone,
        x,
        1.2,
        z,
        island,
        0.07
      );
      stone.rotation.y = a;
    }

    // Rocks.
    const rockPositions = [
      [-2.4, 1.45, 0.35],
      [-3.05, 1.2, -0.65],
      [2.75, 1.3, 0.45],
      [0.8, 1.2, 1.35],
      [-0.75, 1.2, 1.45]
    ];

    rockPositions.forEach((p, i) => {
      const rock = new THREE.Group();
      rock.position.set(p[0], p[1], p[2]);
      rock.rotation.set(0.1 * i, i * 0.7, 0.08 * i);
      island.add(rock);

      voxelBox(0.65, 0.35, 0.55, mat.stone, 0, 0, 0, rock, 0.07);
      voxelBox(0.42, 0.24, 0.38, mat.stoneLight, 0.18, 0.22, 0.05, rock, 0.055);
      voxelBox(0.3, 0.2, 0.3, mat.stoneDark, -0.12, 0.2, -0.04, rock, 0.05);
    });

    // Flowers.
    const flowerColors = [0xf0b45a, 0xe85e83, 0xf4e3a6];

    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + 0.3;
      const radius = 1.4 + (i % 4) * 0.28;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      voxelBox(
        0.13, 0.18, 0.13,
        mat.leafDark,
        x,
        1.3,
        z,
        island,
        0.04
      );

      const flowerMaterial = new THREE.MeshStandardMaterial({
        color: flowerColors[i % flowerColors.length],
        roughness: 0.8
      });

      voxelBox(
        0.18, 0.1, 0.18,
        flowerMaterial,
        x,
        1.43,
        z,
        island,
        0.035
      );
    }

    // Tufts of grass.
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2 + 0.4;
      const radius = 1.45 + (i % 5) * 0.2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const tuft = new THREE.Group();
      tuft.position.set(x, 1.25, z);
      island.add(tuft);

      for (let j = 0; j < 3; j++) {
        const blade = voxelBox(
          0.12, 0.32, 0.12,
          j % 2 ? mat.grassLight : mat.leaf,
          (j - 1) * 0.1,
          0.16,
          0,
          tuft,
          0.035
        );
        blade.rotation.z = (j - 1) * 0.15;
      }
    }

    // -------------------------------------------------------------------------
    // Floating particles / magical motes
    // -------------------------------------------------------------------------
    const moteMaterial = new THREE.MeshBasicMaterial({
      color: 0x8fd8ff,
      transparent: true,
      opacity: 0.65
    });

    const motes = [];
    for (let i = 0; i < 30; i++) {
      const mote = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.045 + (i % 3) * 0.012, 0),
        moteMaterial
      );
      mote.position.set(
        (Math.random() - 0.5) * 10,
        1 + Math.random() * 8,
        (Math.random() - 0.5) * 8
      );
      scene.add(mote);
      motes.push({
        mesh: mote,
        speed: 0.25 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();
    const windArc = Math.sin(clock.getElapsedTime() * 2.2);

    function animate() {
      requestAnimationFrame(animate);

      const t = clock.getElapsedTime();

      // Dragon subtle breathing and wing motion.
      dragon.scale.y = 1 + Math.sin(t * 1.65) * 0.025;
      dragon.rotation.z = Math.sin(t * 1.2) * 0.018;

      const wings = dragon.children.filter(child => child.name.includes("wing") || child.userData.wing);
      wings.forEach((wing, i) => {
        wing.rotation.x = Math.sin(t * 1.5 + i) * 0.08;
        wing.rotation.z = Math.sin(t * 1.2 + i) * 0.08;
      });

      // Wind tree and displaced leaves.
      windTree.rotation.z = -0.13 + windArc * 0.12;
      windTree.rotation.x = windArc * 0.06;

      displacedLeaves.forEach((leaf, i) => {
        leaf.position.x += 0.0007 + windArc * 0.001;
        leaf.position.y += Math.sin(t * 1.6 + i) * 0.0012;
        leaf.rotation.z += 0.0008;
      });

      // Floating motes.
      motes.forEach((mote, i) => {
        mote.mesh.position.y += mote.speed * 0.016;
        mote.mesh.position.x += Math.sin(t * 0.5 + mote.phase) * 0.0008;
        mote.mesh.rotation.x += 0.01;
        mote.mesh.rotation.y += 0.015;

        if (mote.mesh.position.y > 10) {
          mote.mesh.position.y = 0.5;
        }
      });

      crystal.rotation.y = t * 0.7;
      crystal.scale.y = 1.55 + Math.sin(t * 2.1) * 0.08;

      glow.intensity = 1.05 + Math.sin(t * 2.4) * 0.15;

      renderer.render(scene, camera);
    }

    animate();

    // -------------------------------------------------------------------------
    // Direct pointer controls and keyboard
    // -------------------------------------------------------------------------
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
        1.42
      );
      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(
        controls.radius + event.deltaY * 0.012,
        8,
        24
      );
      updateCamera();
    }, { passive: false });

    window.addEventListener("keydown", (event) => {
      const step = 0.13;

      if (event.key === "ArrowLeft") controls.theta += step;
      if (event.key === "ArrowRight") controls.theta -= step;
      if (event.key === "ArrowUp") controls.phi = Math.max(0.35, controls.phi - step);
      if (event.key === "ArrowDown") controls.phi = Math.min(1.42, controls.phi + step);
      if (event.key.toLowerCase() === "r") {
        controls.target.set(0, 2.25, 0);
        controls.radius = 15.5;
        controls.theta = 0.72;
        controls.phi = 1.05;
        updateCamera();
      }

      updateCamera();
    });

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
    spawn: { x: 0.0, z: 14.0, yaw: 0 },
    relic: { id: "generic", name: "The Elder Scrolls V: Skyrim Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x080b10, fogColor: 0x080b10, fogDensity: 0.035 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
