// @world {"id": "1045", "title": "Pok\u00e9mon Ruby/Sapphire/Emerald", "sub": "Pok\u00e9mon Center", "system": "3D Render"}
// Converted from 1045-pokmon_ruby_sapphire_emerald_pokmon_center.html into a Back Roms World Walker module.

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

    // scene redirect
    scene.background = new THREE.Color(0x07111f);
    scene.fog = new THREE.Fog(0x07111f, 25, 48);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.prepend(renderer.domElement);

    // ------------------------------------------------------------
    // Materials
    // ------------------------------------------------------------

    const mat = {
      wall: new THREE.MeshStandardMaterial({
        color: 0xd68b43,
        roughness: 0.78,
        metalness: 0.04
      }),
      wallDark: new THREE.MeshStandardMaterial({
        color: 0x8a4d23,
        roughness: 0.8
      }),
      trim: new THREE.MeshStandardMaterial({
        color: 0xf1d0a1,
        roughness: 0.55
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x465a6c,
        roughness: 0.58,
        metalness: 0.12
      }),
      floorA: new THREE.MeshStandardMaterial({
        color: 0xc9b98b,
        roughness: 0.86
      }),
      floorB: new THREE.MeshStandardMaterial({
        color: 0xe0d1a4,
        roughness: 0.82
      }),
      floorC: new THREE.MeshStandardMaterial({
        color: 0x9f8b62,
        roughness: 0.9
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xf5f1e8,
        roughness: 0.62
      }),
      cream: new THREE.MeshStandardMaterial({
        color: 0xffe5b5,
        roughness: 0.6
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x52a9d8,
        roughness: 0.48,
        metalness: 0.12
      }),
      blueDark: new THREE.MeshStandardMaterial({
        color: 0x287fa9,
        roughness: 0.45,
        metalness: 0.18
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xe44b3f,
        roughness: 0.4,
        metalness: 0.08
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x65b85e,
        roughness: 0.55
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xf08a35,
        roughness: 0.62
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xf4c54e,
        roughness: 0.52
      }),
      purple: new THREE.MeshStandardMaterial({
        color: 0x8066b8,
        roughness: 0.6
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x172330,
        roughness: 0.62
      }),
      glass: new THREE.MeshStandardMaterial({
        color: 0x8bc9e6,
        roughness: 0.18,
        metalness: 0.25,
        transparent: true,
        opacity: 0.62
      }),
      plant: new THREE.MeshStandardMaterial({
        color: 0x4f9d57,
        roughness: 0.82
      }),
      plantLight: new THREE.MeshStandardMaterial({
        color: 0x78bd62,
        roughness: 0.8
      }),
      soil: new THREE.MeshStandardMaterial({
        color: 0x4b382b,
        roughness: 1
      })
    };

    // ------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------

    const sceneRoot = new THREE.Group();
    scene.add(sceneRoot);

    function box(
      width,
      height,
      depth,
      material,
      x,
      y,
      z,
      parent = sceneRoot,
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
      parent.add(mesh);
      return mesh;
    }

    function voxelSphere(
      radius,
      material,
      x,
      y,
      z,
      parent = sceneRoot,
      segments = 12
    ) {
      const geometry = new THREE.IcosahedronGeometry(radius, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function roundedPlatform(
      width,
      depth,
      height,
      material,
      x,
      y,
      z,
      parent = sceneRoot
    ) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      parent.add(group);

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
      );
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const inset = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.72, 0.08, depth * 0.72),
        mat.floorB
      );
      inset.rotation.x = -Math.PI / 2;
      inset.position.y = height / 2 + 0.045;
      inset.receiveShadow = true;
      group.add(inset);

      return group;
    }

    function makeTextSprite(text, options = {}) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 128;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = options.background || "rgba(10, 23, 38, 0.86)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = options.border || "rgba(146, 205, 255, 0.55)";
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);
      ctx.fillStyle = options.color || "#eef8ff";
      ctx.font = "700 48px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: false
        })
      );
      sprite.scale.set(3.2, 0.8, 1);
      return sprite;
    }

    // ------------------------------------------------------------
    // Building shell
    // ------------------------------------------------------------

    const building = new THREE.Group();
    sceneRoot.add(building);

    // Floor dimensions.
    const floorLength = 18;
    const floorWidth = 12.6;
    const floorY = 0.18;

    // Main floor slab.
    box(
      floorLength,
      0.3,
      floorWidth,
      mat.floorC,
      0,
      0.12,
      0,
      building
    );

    // Individual tiled floor squares.
    const tileSize = 1.25;
    const tileGap = 0.035;
    const tileHeight = 0.08;

    for (let x = -floorLength / 2 + tileSize / 2; x < floorLength / 2; x += tileSize) {
      for (let z = -floorWidth / 2 + tileSize / 2; z < floorWidth / 2; z += tileSize) {
        const material =
          ((x / tileSize + z / tileSize) % 2 === 0
            ? mat.floorA
            : mat.floorB);

        const tile = box(
          tileSize - tileGap,
          tileHeight,
          tileSize - tileGap,
          material,
          x,
          floorY + 0.015,
          z,
          building,
          false,
          true
        );
        tile.rotation.y = (x + z) * 0.001;
      }
    }

    // Back and side walls, built as panels.
    const wallPanelHeight = 3.1;
    const wallPanelWidth = 1.55;

    for (let x = -floorLength / 2 + wallPanelWidth / 2; x < floorLength / 2; x += wallPanelWidth) {
      box(
        wallPanelWidth - 0.05,
        wallPanelHeight,
        0.28,
        mat.wall,
        x,
        1.73,
        -floorWidth / 2 + 0.16,
        building
      );
    }

    for (let z = -floorWidth / 2 + wallPanelWidth / 2; z < floorWidth / 2; z += wallPanelWidth) {
      box(
        0.28,
        wallPanelHeight,
        wallPanelWidth - 0.05,
        mat.wall,
        -floorLength / 2 + 0.16,
        1.73,
        z,
        building
      );
    }

    // Lower wall trim and top cap.
    box(
      floorLength,
      0.32,
      0.34,
      mat.wallDark,
      0,
      0.58,
      -floorWidth / 2 + 0.22,
      building
    );

    box(
      floorLength,
      0.18,
      0.34,
      mat.trim,
      0,
      wallPanelHeight + 0.08,
      -floorWidth / 2 + 0.22,
      building
    );

    box(
      floorLength,
      0.18,
      0.34,
      mat.trim,
      -floorLength / 2 + 0.22,
      wallPanelHeight + 0.08,
      0,
      building
    );

    // Roof / upper frame.
    box(
      floorLength + 0.3,
      0.22,
      floorWidth + 0.3,
      mat.roof,
      0,
      3.38,
      0,
      building
    );

    // Front open edge, so the interior remains visible.
    box(
      floorLength + 0.3,
      0.16,
      0.2,
      mat.roof,
      0,
      3.3,
      floorWidth / 2 + 0.1,
      building
    );

    // ------------------------------------------------------------
    // Reception counter
    // ------------------------------------------------------------

    const counter = new THREE.Group();
    counter.position.set(0.7, 0, 2.15);
    building.add(counter);

    roundedPlatform(
      6.7,
      2.15,
      0.68,
      mat.blueDark,
      0,
      0.48,
      0,
      counter
    );

    roundedPlatform(
      6.35,
      1.75,
      0.34,
      mat.white,
      0,
      0.91,
      0,
      counter
    );

    // Counter front panels.
    for (let x = -2.45; x <= 2.46; x += 1.225) {
      box(
        1.13,
        0.43,
        0.08,
        mat.blue,
        x,
        0.48,
        1.075,
        counter
      );
      box(
        0.72,
        0.06,
        0.025,
        mat.trim,
        x,
        0.58,
        1.124,
        counter
      );
    }

    // Counter top.
    box(
      6.65,
      0.16,
      1.85,
      mat.cream,
      0,
      1.12,
      0,
      counter
    );

    // Registration screen.
    box(
      1.4,
      0.78,
      0.16,
      mat.black,
      -0.9,
      1.68,
      -0.4,
      counter
    );

    const registrationScreen = box(
      1.16,
      0.54,
      0.035,
      mat.blue,
      -0.9,
      1.71,
      -0.29,
      counter
    );
    registrationScreen.rotation.x = -0.12;

    // Monitor stand.
    box(
      0.55,
      0.08,
      0.55,
      mat.trim,
      -0.9,
      1.35,
      -0.38,
      counter
    );

    // Pokeball on the counter.
    const pokeball = new THREE.Group();
    pokeball.position.set(2.15, 1.28, 0.18);
    counter.add(pokeball);

    voxelSphere(0.36, mat.red, 0, 0, 0, pokeball, 16);
    voxelSphere(0.2, mat.white, 0, 0.02, 0, pokeball, 12);
    voxelSphere(0.075, mat.black, 0, 0.08, 0, pokeball, 8);
    box(0.06, 0.18, 0.06, mat.black, 0, 0.11, 0, pokeball);

    // Medical station on the counter.
    const medicalBase = new THREE.Group();
    medicalBase.position.set(-0.55, 1.2, 0.05);
    counter.add(medicalBase);

    box(
      1.35,
      0.28,
      0.72,
      mat.white,
      0,
      0.14,
      0,
      medicalBase
    );

    box(
      0.72,
      0.43,
      0.48,
      mat.blue,
      0,
      0.46,
      0,
      medicalBase
    );

    // Cross.
    box(
      0.18,
      0.18,
      0.035,
      mat.red,
      0,
      0.58,
      0.255,
      medicalBase
    );
    box(
      0.3,
      0.07,
      0.035,
      mat.red,
      0,
      0.53,
      0.258,
      medicalBase
    );

    // Small medicine bottles.
    for (let i = 0; i < 4; i++) {
      const bottle = new THREE.Group();
      bottle.position.set(0.45 + i * 0.2, 0.28, 0.2);
      medicalBase.add(bottle);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.115, 0.3, 10),
        i % 2 === 0 ? mat.yellow : mat.green
      );
      body.position.y = 0.15;
      body.castShadow = true;
      bottle.add(body);

      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.08, 10),
        mat.black
      );
      cap.position.y = 0.33;
      cap.castShadow = true;
      bottle.add(cap);
    }

    // Cash register.
    const register = new THREE.Group();
    register.position.set(2.45, 1.2, -0.55);
    register.rotation.y = -0.18;
    counter.add(register);

    box(
      0.72,
      0.18,
      0.55,
      mat.black,
      0,
      0.1,
      0,
      register
    );

    const registerScreen = box(
      0.56,
      0.36,
      0.04,
      mat.blue,
      0,
      0.35,
      0.285,
      register
    );
    registerScreen.rotation.x = -0.12;

    // ------------------------------------------------------------
    // Wall TV and map
    // ------------------------------------------------------------

    const wallTV = new THREE.Group();
    wallTV.position.set(-2.65, 2.18, -floorWidth / 2 + 0.4);
    wallTV.rotation.y = 0.12;
    building.add(wallTV);

    box(
      1.75,
      1.12,
      0.22,
      mat.black,
      0,
      0,
      0,
      wallTV
    );

    const tvScreen = box(
      1.5,
      0.88,
      0.035,
      mat.blue,
      0,
      0.02,
      0.12,
      wallTV
    );

    // Map frame.
    const mapFrame = new THREE.Group();
    mapFrame.position.set(3.25, 2.15, -floorWidth / 2 + 0.4);
    mapFrame.rotation.y = -0.1;
    building.add(mapFrame);

    box(
      1.65,
      1.15,
      0.13,
      mat.trim,
      0,
      0,
      0,
      mapFrame
    );

    const map = box(
      1.34,
      0.86,
      0.04,
      mat.green,
      0,
      0.02,
      0.085,
      mapFrame
    );

    // Map route lines.
    for (let i = 0; i < 4; i++) {
      const line = box(
        0.65,
        0.035,
        0.025,
        mat.yellow,
        0,
        0.08,
        0.115,
        mapFrame
      );
      line.rotation.z = (i - 1.5) * 0.12;
    }

    // ------------------------------------------------------------
    // Shelf and books
    // ------------------------------------------------------------

    const shelf = new THREE.Group();
    shelf.position.set(-4.75, 0, -3.85);
    building.add(shelf);

    box(
      2.65,
      0.12,
      1.05,
      mat.trim,
      0,
      0.12,
      0,
      shelf
    );
    box(
      2.65,
      0.12,
      1.05,
      mat.trim,
      0,
      2.05,
      0,
      shelf
    );

    for (const x of [-1.18, 1.18]) {
      box(
        0.12,
        1.9,
        0.9,
        mat.blueDark,
        x,
        1.1,
        0,
        shelf
      );
    }

    const bookColors = [
      mat.red,
      mat.blue,
      mat.green,
      mat.yellow,
      mat.purple,
      mat.orange
    ];

    for (let row = 0; row < 2; row++) {
      for (let i = 0; i < 8; i++) {
        const book = box(
          0.29,
          0.58 + (i % 3) * 0.08,
          0.72,
          bookColors[(i + row) % bookColors.length],
          -0.82 + i * 0.3,
          0.54 + row * 1.88,
          0,
          shelf
        );
        book.rotation.z = (i % 2 ? 1 : -1) * 0.035;
      }
    }

    // ------------------------------------------------------------
    // Potted plant
    // ------------------------------------------------------------

    const plant = new THREE.Group();
    plant.position.set(-4.15, 0, -3.4);
    building.add(plant);

    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.38, 0.72, 12),
      mat.cream
    );
    pot.position.y = 0.36;
    pot.castShadow = true;
    pot.receiveShadow = true;
    plant.add(pot);

    const potRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.45, 0.09, 8, 16),
      mat.blueDark
    );
    potRim.rotation.x = Math.PI / 2;
    potRim.position.y = 0.7;
    potRim.castShadow = true;
    plant.add(potRim);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.11, 1.35, 8),
      mat.soil
    );
    trunk.position.y = 1.5;
    trunk.rotation.z = -0.1;
    trunk.castShadow = true;
    plant.add(trunk);

    for (let i = 0; i < 8; i++) {
      const leaf = new THREE.Mesh(
        new THREE.ConeGeometry(0.34, 0.72, 5),
        i % 2 ? mat.plant : mat.plantLight
      );
      const angle = (i / 8) * Math.PI * 2;
      leaf.position.set(
        Math.cos(angle) * 0.25,
        2.05 + (i % 3) * 0.16,
        Math.sin(angle) * 0.25
      );
      leaf.rotation.z = Math.cos(angle) * 0.35;
      leaf.rotation.x = Math.sin(angle) * 0.35;
      leaf.castShadow = true;
      plant.add(leaf);
    }

    // ------------------------------------------------------------
    // Lounge seating
    // ------------------------------------------------------------

    const lounge = new THREE.Group();
    lounge.position.set(-3.35, 0, 2.7);
    building.add(lounge);

    // Rug.
    roundedPlatform(
      3.1,
      2.15,
      0.08,
      mat.orange,
      0,
      0.04,
      0,
      lounge
    );

    // Three cushion seats.
    for (let i = 0; i < 3; i++) {
      const x = (i - 1) * 0.8;

      roundedPlatform(
        0.82,
        0.82,
        0.18,
        i === 1 ? mat.yellow : mat.orange,
        x,
        0.18,
        0,
        lounge
      );

      const cushion = new THREE.Mesh(
        new THREE.CylinderGeometry(0.37, 0.37, 0.18, 12),
        i === 1 ? mat.yellow : mat.orange
      );
      cushion.position.set(x, 0.34, 0);
      cushion.castShadow = true;
      cushion.receiveShadow = true;
      lounge.add(cushion);
    }

    // Coffee table.
    const table = new THREE.Group();
    table.position.set(-3.35, 0, 2.7);
    building.add(table);

    roundedPlatform(
      1.45,
      0.9,
      0.15,
      mat.cream,
      0,
      0.63,
      0,
      table
    );

    for (const x of [-0.48, 0.48]) {
      for (const z of [-0.3, 0.3]) {
        box(
          0.06,
          0.58,
          0.06,
          mat.blueDark,
          x,
          0.3,
          z,
          table
        );
      }
    }

    // Small items on the table.
    const tableBottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.11, 0.38, 10),
      mat.yellow
    );
    tableBottle.position.set(-0.25, 0.88, 0.05);
    tableBottle.castShadow = true;
    table.add(tableBottle);

    const tableCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.08, 10),
      mat.black
    );
    tableCap.position.set(-0.25, 1.1, 0.05);
    table.add(tableCap);

    // ------------------------------------------------------------
    // Escalator / lift
    // ------------------------------------------------------------

    const lift = new THREE.Group();
    lift.position.set(-5.65, 0, 3.75);
    lift.rotation.y = -0.18;
    building.add(lift);

    roundedPlatform(
      1.65,
      2.25,
      0.38,
      mat.blueDark,
      0,
      0.3,
      0,
      lift
    );

    // Lift door.
    box(
      1.42,
      1.7,
      0.08,
      mat.glass,
      0,
      1.2,
      1.08,
      lift
    );

    for (const x of [-0.7, 0.7]) {
      box(
        0.1,
        1.75,
        0.1,
        mat.trim,
        x,
        1.2,
        1.12,
        lift
      );
    }

    // Staircase.
    const stairs = new THREE.Group();
    stairs.position.set(-4.85, 0, 4.8);
    stairs.rotation.y = -0.55;
    building.add(stairs);

    const stairCount = 8;
    const stairWidth = 1.65;
    const run = 0.72;
    const rise = 0.28;

    for (let i = 0; i < stairCount; i++) {
      const y = i * rise;
      const x = -stairWidth / 2 + i * run;

      box(
        stairWidth,
        0.12,
        run + 0.04,
        mat.trim,
        x,
        y + 0.06,
        0,
        stairs
      );

      box(
        stairWidth - 0.12,
        0.035,
        run * 0.7,
        mat.floorB,
        x,
        y + 0.13,
        0,
        stairs,
        false,
        true
      );

      // Railing.
      box(
        0.07,
        0.85,
        0.07,
        mat.blueDark,
        -stairWidth / 2 + 0.08,
        y + 0.5,
        run * 0.48,
        stairs
      );
    }

    // Landing.
    box(
      2.2,
      0.18,
      1.25,
      mat.trim,
      0.65,
      2.25,
      0,
      stairs
    );

    // ------------------------------------------------------------
    // Floor markings and entrance mat
    // ------------------------------------------------------------

    // Entrance mat.
    roundedPlatform(
      1.8,
      0.9,
      0.1,
      mat.orange,
      0,
      0.035,
      floorWidth / 2 - 0.75,
      building
    );

    // Decorative dotted path leading to reception.
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        const marker = box(
          0.28,
          0.025,
          0.28,
          row % 2 ? mat.yellow : mat.white,
          -1.35 + col * 0.72,
          floorY + 0.045,
          0.75 - row * 0.7,
          building,
          false,
          true
        );
        marker.rotation.y = 0.18;
      }
    }

    // Small wall signs.
    const careSign = makeTextSprite("CARE", {
      color: "#fff5dc",
      border: "#f2a35b"
    });
    careSign.position.set(0.7, 2.55, -floorWidth / 2 + 0.46);
    careSign.scale.set(2.1, 0.525, 1);
    building.add(careSign);

    const helpSign = makeTextSprite("HELP", {
      color: "#bdeaff",
      border: "#65b9df"
    });
    helpSign.position.set(-4.75, 2.72, -3.85);
    helpSign.scale.set(1.7, 0.425, 1);
    building.add(helpSign);

    // ------------------------------------------------------------
    // Lighting
    // ------------------------------------------------------------

    const hemisphere = new THREE.HemisphereLight(
      0xd9efff,
      0x62452d,
      2.1
    );
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xfff0d5, 3.2);
    sun.position.set(8, 13, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -13;
    sun.shadow.camera.right = 13;
    sun.shadow.camera.top = 13;
    sun.shadow.camera.bottom = -13;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 35;
    sun.shadow.normalBias = 0.025;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x8bc9ff, 1.25);
    fill.position.set(-8, 6, -5);
    scene.add(fill);

    const counterLight = new THREE.PointLight(0xffd6a0, 1.7, 7, 2);
    counterLight.position.set(0.7, 2.6, 1.8);
    scene.add(counterLight);

    // ------------------------------------------------------------
    // Custom camera controls
    // ------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(-0.35, 1.0, 0.25),
      spherical: new THREE.Spherical(17.6, Math.PI * 0.39, Math.PI * 0.31),
      dragging: false,
      panning: false,
      lastX: 0,
      lastY: 0
    };

    const initialTarget = controls.target.clone();
    const initialSpherical = controls.spherical.clone();

    function updateCamera() {
      controls.spherical.phi = THREE.MathUtils.clamp(
        controls.spherical.phi,
        0.18,
        Math.PI * 0.49
      );

      controls.spherical.radius = THREE.MathUtils.clamp(
        controls.spherical.radius,
        9.5,
        27
      );

      const offset = new THREE.Vector3().setFromSpherical(
        controls.spherical
      );

      camera.position.copy(controls.target).add(offset);
      camera.lookAt(controls.target);
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.panning = event.button === 2 || event.shiftKey;
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

      if (controls.panning) {
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();

        camera.matrixWorld.extractBasis(right, up, new THREE.Vector3());

        const panScale = controls.spherical.radius * 0.0015;
        controls.target.addScaledVector(right, -dx * panScale);
        controls.target.addScaledVector(up, dy * panScale);

        controls.target.x = THREE.MathUtils.clamp(
          controls.target.x,
          -7,
          7
        );
        controls.target.y = THREE.MathUtils.clamp(
          controls.target.y,
          0.2,
          3.2
        );
        controls.target.z = THREE.MathUtils.clamp(
          controls.target.z,
          -6,
          6
        );
      } else {
        controls.spherical.theta -= dx * 0.006;
        controls.spherical.phi -= dy * 0.005;
      }

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      controls.panning = false;

      if (renderer.domElement.hasPointerCapture(event.pointerId)) {
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
        controls.spherical.radius *= Math.exp(event.deltaY * 0.001);
        updateCamera();
      },
      { passive: false }
    );

    updateCamera();

    // ------------------------------------------------------------
    // Resize and render loop
    // ------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
      requestAnimationFrame(animate);

      // Subtle breathing glow on the reception area.
      counterLight.intensity = 1.65 + Math.sin(performance.now() * 0.0015) * 0.08;

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
    spawn: { x: -0.3, z: -13.8, yaw: 0 },
    relic: { id: "generic", name: "Pok\u00e9mon Ruby/Sapphire/Emerald Relic", x: -10.3, z: 12.2 },
    env:   { background: 0x07111f, fogColor: 0x07111f, fogDensity: 0.025 },
    doors: {
      next: { x: 11.7, z: -9.8 },
      prev: { x: -12.3, z: 10.2 },
      east: { x: 11.7, z: 10.2 },
      west: { x: -12.3, z: -9.8 }
    }
  };
}
