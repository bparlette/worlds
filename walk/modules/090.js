// @world {"id": "090", "title": "Resident Evil \u00d7 Silent Hill (tribute)", "sub": "\u201cResident Hill\u201d \u2014 The Mansion", "system": "Console"}
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

    

    // ---------------------------------------------------------------------
    // Renderer and scene
    // ---------------------------------------------------------------------
    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    

    // scene redirect
    scene.background = new THREE.Color(0x171b1e);
    scene.fog = new THREE.FogExp2(0x171b1e, 0.035);

    camera = dummyCamera();

    const controls = {
      target: new THREE.Vector3(0, 2.4, 0),
      azimuth: -0.42,
      polar: 1.25,
      radius: 13.5,
      dragging: false,
      panning: false,
      lastX: 0,
      lastY: 0
    };

    const hemisphere = new THREE.HemisphereLight(0x9bb5c0, 0x241a15, 1.7);
    scene.add(hemisphere);

    // Soft, warm key light.
    const keyLight = new THREE.DirectionalLight(0xffd3a1, 4.2);
    keyLight.position.set(6, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -9;
    keyLight.shadow.camera.right = 9;
    keyLight.shadow.camera.top = 10;
    keyLight.shadow.camera.bottom = -7;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool fill and rim lights.
    const fillLight = new THREE.DirectionalLight(0x75a9c4, 1.8);
    fillLight.position.set(-7, 5, -5);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x75b8d0, 28, 18, 2);
    rimLight.position.set(-4, 5, 4);
    scene.add(rimLight);

    // ---------------------------------------------------------------------
    // Materials
    // ---------------------------------------------------------------------
    const materials = {
      wood: new THREE.MeshStandardMaterial({
        color: 0x5b3928,
        roughness: 0.92
      }),
      darkWood: new THREE.MeshStandardMaterial({
        color: 0x2f211b,
        roughness: 0.95
      }),
      beam: new THREE.MeshStandardMaterial({
        color: 0x8a5a38,
        roughness: 0.88
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x48504e,
        roughness: 0.94
      }),
      paleStone: new THREE.MeshStandardMaterial({
        color: 0x7b827b,
        roughness: 0.9
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x303638,
        roughness: 0.88
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x111313,
        roughness: 0.85
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0x39413f,
        metalness: 0.55,
        roughness: 0.55
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xb08a47,
        metalness: 0.65,
        roughness: 0.42
      }),
      plant: new THREE.MeshStandardMaterial({
        color: 0x273b2b,
        roughness: 0.95
      }),
      plantLight: new THREE.MeshStandardMaterial({
        color: 0x35503a,
        roughness: 0.95
      }),
      lamp: new THREE.MeshStandardMaterial({
        color: 0xffd99a,
        emissive: 0xffa74d,
        emissiveIntensity: 2.3,
        roughness: 0.45
      }),
      window: new THREE.MeshStandardMaterial({
        color: 0x8cb6c2,
        emissive: 0x5b91aa,
        emissiveIntensity: 1.4,
        roughness: 0.35
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x78d3a0,
        emissive: 0x317a5c,
        emissiveIntensity: 1.5,
        roughness: 0.4
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0x9e4e3e,
        emissive: 0x4b180e,
        emissiveIntensity: 0.7,
        roughness: 0.65
      })
    };

    // ---------------------------------------------------------------------
    // Voxel helpers
    // ---------------------------------------------------------------------
    const house = new THREE.Group();
    scene.add(house);

    function box(
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

    function voxelColumn(
      parent,
      width,
      height,
      depth,
      x,
      y,
      z,
      material,
      castShadow = true
    ) {
      return box(
        parent,
        new THREE.Vector3(width, height, depth),
        new THREE.Vector3(x, y, z),
        material,
        castShadow,
        true
      );
    }

    function addLamp(parent, position, scale = 1, color = 0xffc26b) {
      const group = new THREE.Group();
      group.position.copy(position);
      group.scale.setScalar(scale);

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 10, 8),
        materials.lamp
      );
      glow.castShadow = false;

      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.17, 0.22, 0.22, 8),
        materials.metal
      );
      housing.position.y = 0.13;

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.045, 0.38, 6),
        materials.metal
      );
      stem.position.y = -0.22;

      group.add(housing, glow, stem);
      parent.add(group);
      return group;
    }

    // ---------------------------------------------------------------------
    // Foundation and base
    // ---------------------------------------------------------------------
    box(
      house,
      new THREE.Vector3(8.8, 0.55, 7.3),
      new THREE.Vector3(0, 0.25, 0),
      materials.black
    );

    box(
      house,
      new THREE.Vector3(7.7, 0.28, 6.2),
      new THREE.Vector3(0, 0.64, 0),
      materials.stone
    );

    for (let i = 0; i < 12; i++) {
      const x = -3.5 + i * 0.62;
      const z = -2.9;
      box(
        house,
        new THREE.Vector3(0.28, 0.22, 0.18),
        new THREE.Vector3(x, 0.48, z),
        materials.darkWood
      );
    }

    // ---------------------------------------------------------------------
    // Main structure
    // ---------------------------------------------------------------------
    const levels = [
      { y: 1.0, height: 2.2 },
      { y: 3.45, height: 2.25 },
      { y: 5.85, height: 2.2 }
    ];

    // Lower level walls.
    voxelColumn(
      house,
      6.2,
      2.2,
      5.5,
      0,
      1.25,
      0,
      materials.wood
    );

    // Side walls and front facade.
    box(house, new THREE.Vector3(6.4, 2.15, 0.3), new THREE.Vector3(0, 1.3, 2.78), materials.darkWood);
    box(house, new THREE.Vector3(0.3, 2.15, 5.7), new THREE.Vector3(-3.15, 1.3, 0), materials.darkWood);
    box(house, new THREE.Vector3(0.3, 2.15, 5.7), new THREE.Vector3(3.15, 1.3, 0), materials.darkWood);

    // Rear wall.
    box(house, new THREE.Vector3(6.2, 2.15, 0.3), new THREE.Vector3(0, 1.3, -2.75), materials.wood);

    // Front window bays.
    box(house, new THREE.Vector3(1.15, 1.1, 0.22), new THREE.Vector3(-1.35, 1.35, 2.9), materials.darkWood);
    box(house, new THREE.Vector3(0.72, 0.78, 0.1), new THREE.Vector3(-1.35, 1.35, 3.04), materials.window);

    box(house, new THREE.Vector3(1.25, 1.12, 0.22), new THREE.Vector3(1.35, 1.35, 2.9), materials.darkWood);
    box(house, new THREE.Vector3(0.78, 0.76, 0.1), new THREE.Vector3(1.35, 1.35, 3.04), materials.window);

    // Door.
    box(house, new THREE.Vector3(0.82, 1.75, 0.22), new THREE.Vector3(2.3, 1.4, 2.9), materials.darkWood);
    box(house, new THREE.Vector3(0.18, 0.32, 0.1), new THREE.Vector3(2.3, 1.4, 3.08), materials.gold);
    box(house, new THREE.Vector3(0.62, 0.78, 0.12), new THREE.Vector3(2.3, 1.35, 3.05), materials.red);

    // Decorative trim.
    for (let i = 0; i < 5; i++) {
      box(
        house,
        new THREE.Vector3(0.12, 1.75, 0.18),
        new THREE.Vector3(-3.05 + i * 0.31, 1.4, 2.96),
        materials.paleStone
      );
    }

    // ---------------------------------------------------------------------
    // Upper level
    // ---------------------------------------------------------------------
    box(house, new THREE.Vector3(6.7, 0.28, 5.9), new THREE.Vector3(0, 2.42, 0), materials.darkWood);
    box(house, new THREE.Vector3(6.2, 2.1, 0.28), new THREE.Vector3(0, 3.55, 2.82), materials.wood);
    box(house, new THREE.Vector3(0.28, 2.1, 5.8), new THREE.Vector3(-3.16, 3.55, 0), materials.wood);
    box(house, new THREE.Vector3(0.28, 2.1, 5.8), new THREE.Vector3(3.16, 3.55, 0), materials.wood);
    box(house, new THREE.Vector3(6.2, 2.1, 0.28), new THREE.Vector3(0, 3.55, -2.8), materials.wood);

    // Upper windows.
    box(house, new THREE.Vector3(1.2, 0.88, 0.16), new THREE.Vector3(-1.45, 3.6, 2.96), materials.darkWood);
    box(house, new THREE.Vector3(0.72, 0.64, 0.08), new THREE.Vector3(-1.45, 3.6, 3.06), materials.window);

    box(house, new THREE.Vector3(1.2, 0.88, 0.16), new THREE.Vector3(1.45, 3.6, 2.96), materials.darkWood);
    box(house, new THREE.Vector3(0.72, 0.64, 0.08), new THREE.Vector3(1.45, 3.6, 3.06), materials.window);

    // Balcony and railing.
    box(house, new THREE.Vector3(4.6, 0.18, 0.9), new THREE.Vector3(0, 2.57, 3.15), materials.darkWood);
    box(house, new THREE.Vector3(4.7, 0.09, 0.1), new THREE.Vector3(0, 3.15, 3.62), materials.beam);

    for (let i = 0; i < 7; i++) {
      box(
        house,
        new THREE.Vector3(0.08, 0.58, 0.08),
        new THREE.Vector3(-2.05 + i * 0.7, 2.92, 3.62),
        materials.beam
      );
    }

    // ---------------------------------------------------------------------
    // Top level
    // ---------------------------------------------------------------------
    box(house, new THREE.Vector3(6.3, 0.26, 5.6), new THREE.Vector3(0, 4.76, 0), materials.darkWood);
    box(house, new THREE.Vector3(6.0, 2.05, 0.25), new THREE.Vector3(0, 5.88, 2.82), materials.wood);
    box(house, new THREE.Vector3(0.25, 2.05, 5.6), new THREE.Vector3(-3.05, 5.88, 0), materials.wood);
    box(house, new THREE.Vector3(0.25, 2.05, 5.6), new THREE.Vector3(3.05, 5.88, 0), materials.wood);
    box(house, new THREE.Vector3(6.0, 2.05, 0.25), new THREE.Vector3(0, 5.88, -2.8), materials.wood);

    // Top windows.
    box(house, new THREE.Vector3(1.0, 0.76, 0.15), new THREE.Vector3(-1.45, 5.9, 2.95), materials.darkWood);
    box(house, new THREE.Vector3(0.58, 0.5, 0.08), new THREE.Vector3(-1.45, 5.9, 3.05), materials.window);

    box(house, new THREE.Vector3(1.0, 0.76, 0.15), new THREE.Vector3(1.45, 5.9, 2.95), materials.darkWood);
    box(house, new THREE.Vector3(0.58, 0.5, 0.08), new THREE.Vector3(1.45, 5.9, 3.05), materials.window);

    // ---------------------------------------------------------------------
    // Roof
    // ---------------------------------------------------------------------
    const roof = new THREE.Group();
    house.add(roof);

    // Roof supports.
    box(roof, new THREE.Vector3(5.9, 0.28, 5.6), new THREE.Vector3(0, 6.92, 0), materials.darkWood);

    // Main gabled roof.
    const roofGeometry = new THREE.BufferGeometry();
    roofGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([
        -3.25, 7.05, -2.85,
         3.25, 7.05, -2.85,
         3.25, 8.2,  0,
        -3.25, 8.2,  0,
        -3.25, 7.05,  2.85,
         3.25, 7.05,  2.85,
         3.25, 8.2,  0,
        -3.25, 8.2,  0
      ], 3)
    );
    roofGeometry.computeVertexNormals();

    const roofMesh = new THREE.Mesh(roofGeometry, materials.roof);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roof.add(roofMesh);

    // Secondary smaller roof / turret.
    const turretGeometry = new THREE.ConeGeometry(1.25, 2.1, 4);
    turretGeometry.rotateY(Math.PI / 4);
    const turret = new THREE.Mesh(turretGeometry, materials.roof);
    turret.position.set(0.9, 7.65, -0.25);
    turret.rotation.y = Math.PI / 4;
    turret.castShadow = true;
    roof.add(turret);

    // Chimney.
    box(roof, new THREE.Vector3(0.7, 1.55, 0.7), new THREE.Vector3(1.05, 8.55, -0.35), materials.stone);
    box(roof, new THREE.Vector3(0.85, 0.18, 0.85), new THREE.Vector3(1.05, 9.35, -0.35), materials.darkWood);

    // Decorative roof trim.
    for (let i = 0; i < 7; i++) {
      const x = -2.55 + i * 0.78;
      const y = 6.95;
      const z = 2.78;

      box(roof, new THREE.Vector3(0.12, 0.42, 0.16), new THREE.Vector3(x, y, z), materials.beam);
      box(roof, new THREE.Vector3(0.3, 0.1, 0.2), new THREE.Vector3(x, y + 0.1, z), materials.gold);
    }

    // ---------------------------------------------------------------------
    // Exposed beams and braces
    // ---------------------------------------------------------------------
    for (const y of [2.58, 4.82]) {
      box(house, new THREE.Vector3(0.28, 2.1, 0.28), new THREE.Vector3(-3.0, y, 2.72), materials.beam);
      box(house, new THREE.Vector3(0.28, 2.1, 0.28), new THREE.Vector3(3.0, y, 2.72), materials.beam);
      box(house, new THREE.Vector3(0.28, 2.1, 0.28), new THREE.Vector3(-3.0, y, -2.72), materials.beam);
      box(house, new THREE.Vector3(0.28, 2.1, 0.28), new THREE.Vector3(3.0, y, -2.72), materials.beam);
    }

    // Cross braces.
    const brace = new THREE.Group();
    house.add(brace);

    function braceBetween(start, end, thickness) {
      const direction = new THREE.Vector3().subVectors(end, start);
      const length = direction.length();
      const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(thickness, thickness, length, 6),
        materials.beam
      );
      mesh.position.copy(midpoint);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
      );
      mesh.castShadow = true;
      brace.add(mesh);
    }

    braceBetween(
      new THREE.Vector3(-2.95, 2.55, 2.72),
      new THREE.Vector3(-0.75, 4.75, 2.72),
      0.16
    );

    braceBetween(
      new THREE.Vector3(2.95, 2.55, 2.72),
      new THREE.Vector3(0.75, 4.75, 2.72),
      0.16
    );

    braceBetween(
      new THREE.Vector3(-2.95, 4.8, 2.72),
      new THREE.Vector3(-0.75, 6.9, 2.72),
      0.16
    );

    braceBetween(
      new THREE.Vector3(2.95, 4.8, 2.72),
      new THREE.Vector3(0.75, 6.9, 2.72),
      0.16
    );

    // ---------------------------------------------------------------------
    // Interior details
    // ---------------------------------------------------------------------
    const interior = new THREE.Group();
    house.add(interior);

    // Ceiling beams.
    for (let i = 0; i < 4; i++) {
      box(
        interior,
        new THREE.Vector3(0.18, 0.2, 5.4),
        new THREE.Vector3(-2.4 + i * 1.6, 2.38, 0),
        materials.darkWood
      );
    }

    // Ceiling beams.
    for (let i = 0; i < 4; i++) {
      box(
        interior,
        new THREE.Vector3(0.18, 0.2, 5.4),
        new THREE.Vector3(-2.4 + i * 1.6, 4.62, 0),
        materials.darkWood
      );
    }

    // Table and chairs.
    box(
      interior,
      new THREE.Vector3(2.15, 0.16, 1.25),
      new THREE.Vector3(-0.75, 1.72, 0.35),
      materials.wood
    );

    for (const x of [-1.55, 0.05]) {
      box(
        interior,
        new THREE.Vector3(0.15, 0.72, 0.15),
        new THREE.Vector3(x, 1.42, 0.35),
        materials.darkWood
      );
    }

    for (const z of [-0.18, 0.88]) {
      box(
        interior,
        new THREE.Vector3(0.68, 0.12, 0.68),
        new THREE.Vector3(-1.18, 1.18, z),
        materials.darkWood
      );

      for (const dx of [-0.22, 0.22]) {
        for (const dz of [-0.22, 0.22]) {
          box(
            interior,
            new THREE.Vector3(0.08, 0.55, 0.08),
            new THREE.Vector3(-1.18 + dx, 0.9, z + dz),
            materials.darkWood
          );
        }
      }
    }

    // Hanging lamps.
    addLamp(interior, new THREE.Vector3(-1.25, 2.15, 0.1), 0.95);
    addLamp(interior, new THREE.Vector3(0.15, 2.15, 0.1), 0.95);
    addLamp(interior, new THREE.Vector3(1.55, 2.15, 0.1), 0.95);

    addLamp(interior, new THREE.Vector3(-1.4, 3.95, 0.1), 0.8);
    addLamp(interior, new THREE.Vector3(0.2, 3.95, 0.1), 0.8);
    addLamp(interior, new THREE.Vector3(1.6, 3.95, 0.1), 0.8);

    // Counter and bottles.
    box(
      interior,
      new THREE.Vector3(2.5, 0.16, 1.05),
      new THREE.Vector3(0.8, 2.5, 1.65),
      materials.wood
    );

    for (let i = 0; i < 5; i++) {
      const bottle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.11, 0.14, 0.42, 8),
        i % 2 === 0 ? materials.gold : materials.green
      );
      bottle.position.set(0.25 + i * 0.42, 2.77, 1.65);
      bottle.castShadow = true;
      interior.add(bottle);
    }

    // Staircase.
    for (let i = 0; i < 5; i++) {
      box(
        interior,
        new THREE.Vector3(1.05, 0.16, 0.62),
        new THREE.Vector3(-1.65, 1.0 + i * 0.43, -1.0 + i * 0.55),
        materials.darkWood
      );
    }

    for (let i = 0; i < 3; i++) {
      box(
        interior,
        new THREE.Vector3(0.12, 0.12, 1.5),
        new THREE.Vector3(-2.18, 1.3 + i * 0.43, -1.0 + i * 0.55),
        materials.beam
      );
    }

    // Small side table and plant.
    box(
      interior,
      new THREE.Vector3(0.65, 0.12, 0.65),
      new THREE.Vector3(2.45, 1.15, 1.15),
      materials.wood
    );

    const plantPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.19, 0.35, 8),
      materials.stone
    );
    plantPot.position.set(2.45, 1.38, 1.15);
    interior.add(plantPot);

    const plant = new THREE.Mesh(
      new THREE.ConeGeometry(0.28, 0.85, 7),
      materials.plant
    );
    plant.position.set(2.45, 1.9, 1.15);
    plant.castShadow = true;
    interior.add(plant);

    // ---------------------------------------------------------------------
    // Ground-floor shopfront
    // ---------------------------------------------------------------------
    box(
      house,
      new THREE.Vector3(5.3, 0.2, 0.25),
      new THREE.Vector3(0, 0.92, 3.0),
      materials.darkWood
    );

    // Shop sign.
    const sign = new THREE.Group();
    sign.position.set(0, 0.9, 3.16);
    house.add(sign);

    box(sign, new THREE.Vector3(2.4, 0.42, 0.14), new THREE.Vector3(0, 0, 0), materials.wood);

    for (let i = 0; i < 3; i++) {
      box(
        sign,
        new THREE.Vector3(0.35, 0.18, 0.08),
        new THREE.Vector3(-0.65 + i * 0.65, 0, 0.04),
        i === 1 ? materials.green : materials.lamp
      );
    }

    // Exterior lanterns.
    addLamp(house, new THREE.Vector3(-2.65, 1.45, 3.1), 0.72, 0xffbd65);
    addLamp(house, new THREE.Vector3(2.65, 1.45, 3.1), 0.72, 0xffbd65);

    // ---------------------------------------------------------------------
    // Upper balcony objects
    // ---------------------------------------------------------------------
    const balconyPlant = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.65, 7),
      materials.plantLight
    );
    balconyPlant.position.set(-1.75, 2.96, 3.75);
    balconyPlant.castShadow = true;
    house.add(balconyPlant);

    const balconyPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.13, 0.25, 8),
      materials.stone
    );
    balconyPot.position.set(-1.75, 2.75, 3.75);
    house.add(balconyPot);

    const lantern = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 10, 8),
      materials.lamp
    );
    lantern.position.set(1.7, 3.1, 3.7);
    house.add(lantern);

    // ---------------------------------------------------------------------
    // Small figures
    // ---------------------------------------------------------------------
    function voxelPerson(parent, position, coatMaterial, hatMaterial) {
      const person = new THREE.Group();
      person.position.copy(position);

      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.18, 0.48, 8),
        coatMaterial
      );
      body.position.y = 0.3;

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 10, 8),
        materials.stone
      );
      head.position.y = 0.68;

      const hat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.18, 0.12, 8),
        hatMaterial
      );
      hat.position.y = 0.8;

      const legLeft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.065, 0.45, 6),
        materials.darkWood
      );
      legLeft.position.set(-0.06, 0.23, 0);

      const legRight = legLeft.clone();
      legRight.position.x = 0.06;

      person.add(body, head, hat, legLeft, legRight);
      parent.add(person);
      return person;
    }

    voxelPerson(
      interior,
      new THREE.Vector3(-0.85, 1.0, 1.05),
      materials.red,
      materials.black
    );

    voxelPerson(
      interior,
      new THREE.Vector3(1.45, 1.0, 0.25),
      materials.blue,
      materials.gold
    );

    voxelPerson(
      interior,
      new THREE.Vector3(-1.65, 1.0, 0.25),
      materials.green,
      materials.black
    );

    voxelPerson(
      house,
      new THREE.Vector3(-2.45, 0.95, 3.15),
      materials.blue,
      materials.red
    );

    voxelPerson(
      house,
      new THREE.Vector3(2.45, 0.95, 3.15),
      materials.red,
      materials.gold
    );

    // ---------------------------------------------------------------------
    // Side balcony and hanging plant
    // ---------------------------------------------------------------------
    box(
      house,
      new THREE.Vector3(0.18, 0.18, 2.4),
      new THREE.Vector3(-3.35, 4.8, 1.0),
      materials.beam
    );

    const sidePlanter = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.22, 0.42, 8),
      materials.stone
    );
    sidePlanter.position.set(-3.5, 4.45, 1.0);
    house.add(sidePlanter);

    const sidePlant = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 1.05, 7),
      materials.plant
    );
    sidePlant.position.set(-3.5, 5.05, 1.0);
    sidePlant.rotation.z = -0.12;
    sidePlant.castShadow = true;
    house.add(sidePlant);

    // ---------------------------------------------------------------------
    // Small details around the base
    // ---------------------------------------------------------------------
    const baseLamp = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 10, 8),
      materials.lamp
    );
    baseLamp.position.set(-3.45, 0.75, 2.7);
    house.add(baseLamp);

    const baseLamp2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 10, 8),
      materials.lamp
    );
    baseLamp2.position.set(3.45, 0.75, 2.7);
    house.add(baseLamp2);

    // A few crates and barrels.
    for (let i = 0; i < 3; i++) {
      const crate = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.38, 0.48),
        i % 2 === 0 ? materials.wood : materials.darkWood
      );
      crate.position.set(-3.25 + i * 0.58, 0.9, -2.35);
      crate.rotation.y = (i - 1) * 0.18;
      crate.castShadow = true;
      house.add(crate);
    }

    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.55, 10),
      materials.metal
    );
    barrel.position.set(3.25, 0.92, -2.35);
    barrel.castShadow = true;
    house.add(barrel);

    // ---------------------------------------------------------------------
    // Camera controls implemented directly
    // ---------------------------------------------------------------------
    const canvas = renderer.domElement;

    canvas.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    canvas.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.panning = event.button === 2 || event.shiftKey;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
      canvas.style.cursor = controls.panning ? "move" : "grabbing";
    });

    canvas.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      if (controls.panning) {
        const scale = controls.radius * 0.0015;
        const right = new THREE.Vector3();
        const up = new THREE.Vector3();

        camera.getWorldDirection(right);
        right.cross(camera.up).normalize();
        up.crossVectors(right, camera.getWorldDirection(new THREE.Vector3()))
          .normalize();

        controls.target.addScaledVector(right, -dx * scale);
        controls.target.addScaledVector(up, dy * scale);
      } else {
        controls.azimuth -= dx * 0.006;
        controls.polar = THREE.MathUtils.clamp(
          controls.polar - dy * 0.005,
          0.55,
          2.15
        );
      }
    });

    function endDrag(event) {
      controls.dragging = false;
      controls.panning = false;
      canvas.style.cursor = "grab";
      if (event && canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.style.cursor = "grab";

    canvas.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.008,
          7.5,
          22
        );
      },
      { passive: false }
    );

    // Gentle automatic rotation when not interacting.
    let autoRotate = true;
    let lastAutoRotation = performance.now();

    function animate(now) {
      requestAnimationFrame(animate);

      const delta = Math.min((now - lastAutoRotation) / 1000, 0.05);
      lastAutoRotation = now;

      if (autoRotate && !controls.dragging) {
        controls.azimuth += delta * 0.08;
      }

      const sinPolar = Math.sin(controls.polar);
      camera.position.set(
        controls.target.x + controls.radius * sinPolar * Math.sin(controls.azimuth),
        controls.target.y + controls.radius * Math.cos(controls.polar),
        controls.target.z + controls.radius * sinPolar * Math.cos(controls.azimuth)
      );

      camera.lookAt(controls.target);
      renderer.render(scene, camera);
    }

    // ---------------------------------------------------------------------
    // Resize
    // ---------------------------------------------------------------------
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

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
    relic: { id: "generic", name: "Resident Evil \u00d7 Silent Hill (tribute) Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x171b1e, fogColor: 0x171b1e, fogDensity: 0.035 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}
