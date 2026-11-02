// @world {"id": "1051", "title": "The Legend of Zelda: Link's Awakening", "sub": "Animal Village Kitchen", "system": "3D Render"}
// Converted from 1051-the_legend_of_zelda_linkx27s_awakening_animal_village_kitchen.html into a Back Roms World Walker module.

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
    scene.background = new THREE.Color(0x1b1611);
    scene.fog = new THREE.Fog(0x1b1611, 12, 25);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const mat = {
      wall: new THREE.MeshStandardMaterial({
        color: 0x9b7548,
        roughness: 0.96
      }),
      wallDark: new THREE.MeshStandardMaterial({
        color: 0x65482f,
        roughness: 1
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x8b5a2e,
        roughness: 0.88
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0xc08a50,
        roughness: 0.82
      }),
      woodDark: new THREE.MeshStandardMaterial({
        color: 0x49301f,
        roughness: 0.9
      }),
      floor: new THREE.MeshStandardMaterial({
        color: 0x705039,
        roughness: 0.95
      }),
      rug: new THREE.MeshStandardMaterial({
        color: 0xc96957,
        roughness: 1
      }),
      rugEdge: new THREE.MeshStandardMaterial({
        color: 0x8e3f32,
        roughness: 1
      }),
      cream: new THREE.MeshStandardMaterial({
        color: 0xe7d5ad,
        roughness: 0.95
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x527a50,
        roughness: 0.9
      }),
      greenLight: new THREE.MeshStandardMaterial({
        color: 0x789564,
        roughness: 0.85
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xa93b24,
        roughness: 0.82
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xc76d2d,
        roughness: 0.8
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xe5b84f,
        roughness: 0.72
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x436b83,
        roughness: 0.75
      }),
      ceramic: new THREE.MeshStandardMaterial({
        color: 0x6e7668,
        roughness: 0.72
      }),
      iron: new THREE.MeshStandardMaterial({
        color: 0x292723,
        roughness: 0.66,
        metalness: 0.28
      }),
      soil: new THREE.MeshStandardMaterial({
        color: 0x493526,
        roughness: 1
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: 0x4e7843,
        roughness: 0.9
      }),
      leafLight: new THREE.MeshStandardMaterial({
        color: 0x73945a,
        roughness: 0.85
      }),
      steam: new THREE.MeshBasicMaterial({
        color: 0xf5e4bc,
        transparent: true,
        opacity: 0.22,
        depthWrite: false
      })
    };

    // -------------------------------------------------------------------------
    // Geometry helpers
    // -------------------------------------------------------------------------

    const box = (
      size,
      position,
      material,
      rotation = null,
      castShadow = true,
      receiveShadow = true
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size[0], size[1], size[2]),
        material
      );
      mesh.position.set(...position);
      if (rotation) mesh.rotation.set(...rotation);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      scene.add(mesh);
      return mesh;
    };

    const cylinder = (
      radiusTop,
      radiusBottom,
      height,
      position,
      material,
      segments = 12,
      castShadow = true
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          height,
          segments
        ),
        material
      );
      mesh.position.set(...position);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    const sphere = (
      radius,
      position,
      material,
      castShadow = true
    ) => {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 14, 10),
        material
      );
      mesh.position.set(...position);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    };

    const voxelLine = (
      points,
      material,
      thickness = 0.18,
      castShadow = true
    ) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(...p))
      );
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.LineBasicMaterial({ color: 0xffffff })
      );
      scene.add(mesh);
      return mesh;
    };

    // -------------------------------------------------------------------------
    // Room shell
    // -------------------------------------------------------------------------

    box(
      [12, 10, 12],
      [0, 4.5, 0],
      mat.wall
    );

    // Exposed timber framing.
    box([12, 0.35, 0.42], [0, 8.65, 0], mat.woodDark);
    box([0.42, 0.35, 12], [0, 8.65, 0], mat.woodDark);

    for (const x of [-4.8, 0, 4.8]) {
      box([0.38, 8.2, 0.38], [x, 4.1, 0], mat.woodDark);
    }

    // Diagonal cross braces on the back wall.
    const braceA = box(
      [0.34, 7.5, 0.34],
      [0, 4.1, -5.75],
      mat.woodDark
    );
    braceA.rotation.z = -0.72;

    const braceB = box(
      [0.34, 7.5, 0.34],
      [0, 4.1, -5.75],
      mat.woodDark
    );
    braceB.rotation.z = 0.72;

    // Floor planks.
    for (let i = 0; i < 12; i++) {
      const z = -5.5 + i * 1;
      box(
        [11.5, 0.16, 0.92],
        [0, 0.08, z],
        i % 3 === 0 ? mat.woodDark : mat.wood
      );
    }

    // -------------------------------------------------------------------------
    // Left shelf and stacked bowls
    // -------------------------------------------------------------------------

    box([4.5, 0.25, 1.55], [-3.25, 0.3, 1.25], mat.wood);
    box([4.5, 0.25, 1.55], [-3.25, 2.25, 1.25], mat.wood);

    for (const x of [-5.05, -1.45]) {
      box([0.22, 2.55, 0.22], [x, 1.25, 0.72], mat.woodDark);
      box([0.22, 0.2, 1.45], [x, 0.43, 1.25], mat.woodDark);
      box([0.22, 0.2, 1.45], [x, 2.1, 1.25], mat.woodDark);
    }

    // Bowl stack helper.
    function bowl(position, material = mat.woodLight, radius = 0.55) {
      const group = new THREE.Group();
      group.position.set(...position);

      const outer = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.72, radius, 0.18, 20),
        material
      );
      outer.position.y = 0.09;
      outer.castShadow = true;
      outer.receiveShadow = true;
      group.add(outer);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.78, 0.055, 6, 24),
        material
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.18;
      rim.castShadow = true;
      group.add(rim);

      const inner = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.61, radius * 0.61, 0.025, 20),
        mat.cream
      );
      inner.position.y = 0.185;
      group.add(inner);

      scene.add(group);
      return group;
    }

    for (let i = 0; i < 5; i++) {
      bowl([-3.25, 0.5 + i * 0.2, 1.25], mat.wood, 0.58 - i * 0.035);
    }

    // Large ceramic jar.
    cylinder(
      0.68,
      0.82,
      1.35,
      [-4.9, 1.1, 1.25],
      mat.ceramic,
      20
    );

    cylinder(
      0.72,
      0.72,
      0.12,
      [-4.9, 1.84, 1.25],
      mat.woodDark,
      20
    );

    cylinder(
      0.73,
      0.73,
      0.08,
      [-4.9, 0.38, 1.25],
      mat.woodDark,
      20
    );

    // Lower shelf items.
    bowl([-2.7, 0.75, 1.25], mat.ceramic, 0.48);
    bowl([-2.1, 0.75, 1.25], mat.ceramic, 0.48);
    bowl([-1.5, 0.75, 1.25], mat.ceramic, 0.48);

    cylinder(
      0.35,
      0.4,
      0.72,
      [-0.85, 0.68, 1.25],
      mat.green,
      16
    );

    cylinder(
      0.38,
      0.38,
      0.12,
      [-0.85, 1.08, 1.25],
      mat.woodDark,
      16
    );

    // -------------------------------------------------------------------------
    // Bed / sleeping nook
    // -------------------------------------------------------------------------

    const bed = new THREE.Group();
    bed.position.set(-2.25, 0, 0.4);
    scene.add(bed);

    box([3.25, 0.22, 2.05], [0, 0.38, 0], mat.woodDark, [0, 0, -0.12]);
    box([3.25, 0.22, 2.05], [0, 0.38, 0], mat.woodDark, [0, 0, 0.12]);

    box([3.25, 0.72, 0.25], [0, 0.85, -0.92], mat.wood);
    box([3.25, 0.72, 0.25], [0, 0.85, 0.92], mat.wood);

    // Mattress and blanket.
    box([3.1, 0.3, 1.85], [0, 0.68, 0.05], mat.green);
    box([3.18, 0.14, 1.28], [0, 0.91, 0.35], mat.greenLight);

    // Pillow.
    const pillow = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.32, 0.75),
      mat.cream
    );
    pillow.position.set(0.85, 1.02, -0.35);
    pillow.rotation.y = -0.12;
    pillow.castShadow = true;
    pillow.receiveShadow = true;
    bed.add(pillow);

    // Small hanging lamp over the bed.
    cylinder(
      0.025,
      0.025,
      0.55,
      [-2.25, 3.3, 0.4],
      mat.woodDark,
      8
    );

    const lamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 14, 10),
      mat.yellow
    );
    lamp.position.set(-2.25, 2.96, 0.4);
    scene.add(lamp);

    // -------------------------------------------------------------------------
    // Hanging utensil rack and chilies
    // -------------------------------------------------------------------------

    box([0.35, 2.2, 0.35], [-1.1, 3.25, -0.15], mat.wood);
    box([0.35, 0.25, 0.35], [-1.1, 1.7, -0.15], mat.wood);

    for (const x of [-1.48, -0.72]) {
      cylinder(
        0.035,
        0.035,
        0.72,
        [x, 2.55, -0.15],
        mat.woodDark,
        8
      );
    }

    // Chilies.
    for (let i = 0; i < 5; i++) {
      const x = -1.5 + i * 0.22;
      const chili = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.09, 0.48, 3, 6),
        mat.red
      );
      chili.position.set(x, 2.05, -0.15);
      chili.rotation.z = (i - 2) * 0.08;
      chili.castShadow = true;
      scene.add(chili);
    }

    // -------------------------------------------------------------------------
    // Back wall shelf and herbs
    // -------------------------------------------------------------------------

    box([4.4, 0.18, 0.65], [3.55, 3.0, -5.25], mat.wood);

    for (const x of [1.7, 5.4]) {
      box([0.16, 2.7, 0.16], [x, 4.35, -5.55], mat.woodDark);
    }

    // Bottles.
    cylinder(
      0.25,
      0.31,
      0.72,
      [3.7, 3.55, -5.25],
      mat.woodDark,
      14
    );

    cylinder(
      0.2,
      0.25,
      0.55,
      [4.35, 3.4, -5.25],
      mat.green,
      14
    );

    cylinder(
      0.28,
      0.32,
      0.85,
      [5.05, 3.6, -5.25],
      mat.blue,
      14
    );

    // Herb branches.
    function herbBranch(x, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 3.2, z);
      group.rotation.y = rotation;

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.055, 1.55, 7),
        mat.green
      );
      stem.position.y = 0.75;
      stem.rotation.z = 0.18;
      stem.castShadow = true;
      group.add(stem);

      for (let i = 0; i < 7; i++) {
        const leaf = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 8, 5),
          i % 2 ? mat.leaf : mat.leafLight
        );
        leaf.scale.set(0.55, 1.45, 0.22);
        leaf.position.set(
          Math.sin(i * 1.35) * 0.14,
          0.35 + i * 0.19,
          Math.cos(i * 1.35) * 0.14
        );
        leaf.rotation.z = i * 0.65;
        leaf.castShadow = true;
        group.add(leaf);
      }

      scene.add(group);
    }

    herbBranch(2.55, -5.25, 0.1);
    herbBranch(4.85, -5.25, -0.12);

    // -------------------------------------------------------------------------
    // Cooking area
    // -------------------------------------------------------------------------

    // Counter.
    box([5.0, 0.2, 1.5], [2.1, 1.28, -1.55], mat.wood);
    box([0.22, 1.25, 1.5], [0.15, 0.64, -1.55], mat.woodDark);
    box([0.22, 1.25, 1.5], [4.05, 0.64, -1.55], mat.woodDark);

    // Hearth.
    box([1.85, 0.45, 1.15], [2.25, 0.32, -1.45], mat.woodDark);
    box([1.65, 0.12, 0.95], [2.25, 0.61, -1.45], mat.iron);
    box([0.18, 0.65, 0.18], [1.78, 0.95, -1.45], mat.iron);
    box([0.18, 0.65, 0.18], [2.72, 0.95, -1.45], mat.iron);

    // Fire glow and embers.
    const fire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.25, 1),
      new THREE.MeshBasicMaterial({ color: 0xff6a22 })
    );
    fire.position.set(2.25, 0.9, -1.45);
    fire.scale.y = 0.65;
    scene.add(fire);

    const ember = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.12, 0),
      new THREE.MeshBasicMaterial({ color: 0xffa24d })
    );
    ember.position.set(2.05, 0.91, -1.45);
    scene.add(ember);

    function pot(position, radius, material = mat.iron) {
      const group = new THREE.Group();
      group.position.set(...position);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(radius * 0.72, radius, radius * 1.25, 18),
        material
      );
      body.position.y = radius * 0.62;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const rim = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.74, radius * 0.13, 6, 20),
        material
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = radius * 1.25;
      rim.castShadow = true;
      group.add(rim);

      const handle = new THREE.Mesh(
        new THREE.TorusGeometry(radius * 0.34, radius * 0.1, 6, 16, Math.PI),
        material
      );
      handle.position.set(radius * 0.72, radius * 0.72, 0);
      handle.rotation.z = Math.PI / 2;
      handle.castShadow = true;
      group.add(handle);

      scene.add(group);
      return group;
    }

    // Red stew.
    pot([2.25, 0.9, -1.45], 0.62);
    const stew = new THREE.Mesh(
      new THREE.CylinderGeometry(0.49, 0.52, 0.09, 20),
      mat.red
    );
    stew.position.set(2.25, 1.3, -1.45);
    scene.add(stew);

    // Chopstick.
    const chopstick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.85, 8),
      mat.woodLight
    );
    chopstick.position.set(2.25, 1.52, -1.45);
    chopstick.rotation.z = -0.35;
    scene.add(chopstick);

    // Yellow soup.
    pot([2.95, 1.24, -1.45], 0.5);
    const soup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.39, 0.41, 0.08, 20),
      mat.yellow
    );
    soup.position.set(2.95, 1.53, -1.45);
    scene.add(soup);

    // Small jars and containers.
    cylinder(
      0.2,
      0.23,
      0.45,
      [1.45, 1.55, -1.45],
      mat.ceramic,
      14
    );

    cylinder(
      0.24,
      0.24,
      0.3,
      [1.83, 1.5, -1.45],
      mat.green,
      14
    );

    cylinder(
      0.21,
      0.25,
      0.42,
      [3.3, 1.55, -1.45],
      mat.ceramic,
      14
    );

    cylinder(
      0.25,
      0.25,
      0.34,
      [3.7, 1.5, -1.45],
      mat.blue,
      14
    );

    // Mortar and pestle.
    cylinder(
      0.4,
      0.34,
      0.48,
      [4.55, 1.5, -1.45],
      mat.woodDark,
      18
    );

    cylinder(
      0.16,
      0.2,
      0.45,
      [4.55, 1.75, -1.45],
      mat.wood,
      12
    );

    // Wooden chopping board.
    box([1.05, 0.12, 0.62], [3.15, 1.45, -1.45], mat.woodLight);

    // -------------------------------------------------------------------------
    // Stools
    // -------------------------------------------------------------------------

    function stool(x, z, material = mat.wood) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const seat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.48, 0.18, 16),
        material
      );
      seat.position.y = 0.78;
      seat.castShadow = true;
      seat.receiveShadow = true;
      group.add(seat);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.075, 6, 18),
        material
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.67;
      ring.castShadow = true;
      group.add(ring);

      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.075, 0.68, 7),
          mat.woodDark
        );
        leg.position.set(
          Math.cos(angle) * 0.23,
          0.34,
          Math.sin(angle) * 0.23
        );
        leg.rotation.z = Math.cos(angle) * 0.12;
        leg.rotation.x = Math.sin(angle) * 0.12;
        leg.castShadow = true;
        group.add(leg);
      }

      scene.add(group);
    }

    stool(0.55, 0.35);
    stool(3.65, 0.35);
    stool(5.0, -0.35);

    // -------------------------------------------------------------------------
    // Rug
    // -------------------------------------------------------------------------

    const rug = new THREE.Group();
    rug.position.set(-2.25, 0.18, 0.45);
    scene.add(rug);

    box([4.45, 0.08, 2.85], [0, 0, 0], mat.rug, [0, 0, -0.08]);
    box([4.2, 0.09, 2.6], [0, 0.055, 0], mat.rugEdge, [0, 0, -0.08]);

    for (let i = 0; i < 10; i++) {
      const dash = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.025, 0.09),
        mat.woodLight
      );
      dash.position.set(-1.75 + i * 0.4, 0.11, 1.25);
      dash.rotation.y = -0.35;
      rug.add(dash);
    }

    // -------------------------------------------------------------------------
    // Background crate and tools
    // -------------------------------------------------------------------------

    function crate(x, z, width = 1.1) {
      box([width, 0.65, 0.8], [x, 0.33, z], mat.wood);
      box([width + 0.08, 0.08, 0.9], [x, 0.68, z], mat.woodDark);
      box([width + 0.08, 0.08, 0.9], [x, 0.05, z], mat.woodDark);
      box([0.12, 0.7, 0.9], [x - width / 2, 0.35, z], mat.woodDark);
      box([0.12, 0.7, 0.9], [x + width / 2, 0.35, z], mat.woodDark);
    }

    crate(4.75, 3.45, 1.35);
    crate(5.45, 3.55, 0.85);

    // A wooden spoon leaning against the counter.
    const spoon = new THREE.Group();
    spoon.position.set(3.25, 1.35, -1.45);
    spoon.rotation.z = -0.35;
    scene.add(spoon);

    const spoonHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.075, 0.72, 8),
      mat.woodLight
    );
    spoonHandle.position.y = 0.35;
    spoonHandle.rotation.z = -0.35;
    spoon.add(spoonHandle);

    const spoonBowl = new THREE.Mesh(
      new THREE.SphereGeometry(0.16, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      mat.woodLight
    );
    spoonBowl.position.set(0, 0, 0.1);
    spoonBowl.rotation.z = -0.35;
    spoon.add(spoonBowl);

    // -------------------------------------------------------------------------
    // Hanging moon and stars
    // -------------------------------------------------------------------------

    function hangingOrnament(position, shape, material) {
      const group = new THREE.Group();
      group.position.set(...position);

      const rope = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 0.65, 6),
        mat.woodDark
      );
      rope.position.y = 0.3;
      rope.castShadow = true;
      group.add(rope);

      const ornament = new THREE.Mesh(
        new THREE.SphereGeometry(shape, 12, 8),
        material
      );
      ornament.scale.y = 1.5;
      ornament.position.y = -0.6;
      ornament.castShadow = true;
      group.add(ornament);

      scene.add(group);
    }

    hangingOrnament([-0.2, 7.85, -3.7], 0.22, mat.yellow);
    hangingOrnament([0.2, 7.85, -3.7], 0.22, mat.yellow);

    // -------------------------------------------------------------------------
    // Steam
    // -------------------------------------------------------------------------

    const steamPuffs = [];

    function steamPuff(position, scale = 1) {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 10, 7),
        mat.steam
      );
      puff.position.set(...position);
      puff.scale.setScalar(scale);
      scene.add(puff);
      steamPuffs.push(puff);
    }

    steamPuff([2.25, 1.75, -1.45], 0.8);
    steamPuff([2.95, 1.85, -1.45], 0.65);

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0xffd7a0, 0x30251d, 1.7));

    const warmLight = new THREE.PointLight(0xffa24d, 2.5, 8, 2);
    warmLight.position.set(2.25, 2.5, -1.45);
    scene.add(warmLight);

    const leftLight = new THREE.PointLight(0xffc47b, 1.25, 6, 2);
    leftLight.position.set(-3.2, 3.4, 0.4);
    scene.add(leftLight);

    const backLight = new THREE.PointLight(0xffb65f, 1.0, 7, 2);
    backLight.position.set(3.4, 4.2, -4.4);
    scene.add(backLight);

    const sun = new THREE.DirectionalLight(0xffdfb0, 2.2);
    sun.position.set(-4, 8, 6);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -8;
    sun.shadow.camera.right = 8;
    sun.shadow.camera.top = 8;
    sun.shadow.camera.bottom = -8;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 25;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    // -------------------------------------------------------------------------
    // Custom camera controls
    // -------------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(0.2, 1.7, -0.4),
      azimuth: 0.48,
      polar: 1.12,
      radius: 11.8,
      minRadius: 6.5,
      maxRadius: 16,
      minPolar: 0.65,
      maxPolar: 1.45
    };

    const initial = {
      azimuth: controls.azimuth,
      polar: controls.polar,
      radius: controls.radius
    };

    function updateCamera() {
      const sinPolar = Math.sin(controls.polar);

      camera.position.set(
        controls.target.x + controls.radius * sinPolar * Math.sin(controls.azimuth),
        controls.target.y + controls.radius * Math.cos(controls.polar),
        controls.target.z + controls.radius * sinPolar * Math.cos(controls.azimuth)
      );

      camera.lookAt(controls.target);
    }

    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    let previousRadius = controls.radius;

    renderer.domElement.addEventListener("pointerdown", event => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      previousRadius = controls.radius;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!dragging) return;

      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;

      previousX = event.clientX;
      previousY = event.clientY;

      controls.azimuth -= dx * 0.006;
      controls.polar = THREE.MathUtils.clamp(
        controls.polar - dy * 0.005,
        controls.minPolar,
        controls.maxPolar
      );

      controls.radius = THREE.MathUtils.clamp(
        controls.radius + dx * 0.003,
        controls.minRadius,
        controls.maxRadius
      );

      updateCamera();
    });

    function endDrag(event) {
      dragging = false;
      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener("wheel", event => {
      event.preventDefault();
      controls.radius = THREE.MathUtils.clamp(
        controls.radius + event.deltaY * 0.008,
        controls.minRadius,
        controls.maxRadius
      );
      updateCamera();
    }, { passive: false });

    updateCamera();

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.05);

      // Gentle fire flicker.
      fire.scale.set(
        0.9 + Math.sin(elapsed * 8.5) * 0.1,
        0.55 + Math.sin(elapsed * 11) * 0.15,
        0.9 + Math.cos(elapsed * 7.5) * 0.1
      );
      ember.scale.setScalar(0.85 + Math.sin(elapsed * 9) * 0.2);

      // Slow steam rise.
      for (let i = steamPuffs.length - 1; i >= 0; i--) {
        const puff = steamPuffs[i];
        const age = (elapsed * 0.22 + i * 0.13) % 2.2;

        puff.position.y = 1.72 + age * 0.48;
        puff.position.x += Math.sin(elapsed * 1.8 + i) * delta * 0.08;
        puff.scale.setScalar(0.7 + age * 0.45);
        puff.material.opacity = Math.max(0, 0.22 * (1 - age / 2.2));
      }

      fire.material.opacity = 0.85 + Math.sin(elapsed * 12) * 0.18;

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();

    requestAnimationFrame(() => {
      dummyEl().classList.add("hidden");
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
    spawn: { x: 0.2, z: 13.6, yaw: 0 },
    relic: { id: "generic", name: "The Legend of Zelda: Link's Awakening Relic", x: -9.8, z: -12.4 },
    env:   { background: 0x1b1611, fogColor: 0x1b1611, fogDensity: 0.025 },
    doors: {
      next: { x: 12.2, z: -10.4 },
      prev: { x: -11.8, z: 9.6 },
      east: { x: 12.2, z: 9.6 },
      west: { x: -11.8, z: -10.4 }
    }
  };
}
