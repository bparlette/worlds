// @world {"id": "1083", "title": "Metal Gear Solid", "sub": "Shadow Moses Island \u2014 Heliport", "system": "3D Render"}
// Converted from 1083-metal_gear_solid_shadow_moses_island_heliport.html into a Back Roms World Walker module.

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
  // (strict modules throw where sloppy scripts did not): lights
  let lights = 0;

    

    // -------------------------------------------------------------------------
    // Scene Setup
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x020508);
    scene.fog = new THREE.FogExp2(0x05090d, 0.018);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    const hemisphere = new THREE.HemisphereLight(0x7894a6, 0x08090b, 0.55);
    scene.add(hemisphere);

    const moon = new THREE.DirectionalLight(0x9eb8d0, 1.8);
    moon.position.set(8, 14, 10);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.left = -16;
    moon.shadow.camera.right = 16;
    moon.shadow.camera.top = 16;
    moon.shadow.camera.bottom = -16;
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 45;
    moon.shadow.bias = -0.0005;
    scene.add(moon);

    const cyanLight = new THREE.PointLight(0x35d5ff, 18, 18, 2);
    cyanLight.position.set(5.5, 3.8, 3.8);
    scene.add(cyanLight);

    const warmLight = new THREE.PointLight(0xff9b45, 13, 15, 2);
    warmLight.position.set(-6, 3.5, -2);
    scene.add(warmLight);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      darkMetal: new THREE.MeshStandardMaterial({
        color: 0x17202a,
        roughness: 0.72,
        metalness: 0.45
      }),
      mediumMetal: new THREE.MeshStandardMaterial({
        color: 0x35414d,
        roughness: 0.65,
        metalness: 0.5
      }),
      lightMetal: new THREE.MeshStandardMaterial({
        color: 0x71808b,
        roughness: 0.6,
        metalness: 0.45
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x080b0e,
        roughness: 0.85,
        metalness: 0.25
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xdde7e8,
        roughness: 0.72,
        metalness: 0.15
      }),
      gray: new THREE.MeshStandardMaterial({
        color: 0x697780,
        roughness: 0.8,
        metalness: 0.2
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0x9e1828,
        roughness: 0.65,
        metalness: 0.2
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x41d49a,
        emissive: 0x0b5f38,
        emissiveIntensity: 1.1,
        roughness: 0.45
      }),
      cyan: new THREE.MeshStandardMaterial({
        color: 0x62d9ff,
        emissive: 0x083e55,
        emissiveIntensity: 1.25,
        roughness: 0.4
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xe9b536,
        emissive: 0x4b2d00,
        emissiveIntensity: 0.45,
        roughness: 0.55
      }),
      snow: new THREE.MeshStandardMaterial({
        color: 0xdde7e8,
        roughness: 0.95,
        metalness: 0
      }),
      rock: new THREE.MeshStandardMaterial({
        color: 0x596166,
        roughness: 0.95,
        metalness: 0.05
      })
    };

    // -------------------------------------------------------------------------
    // Voxel Helpers
    // -------------------------------------------------------------------------

    function voxelBox(width, height, depth, material, x, y, z, castShadow = true) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = true;
      scene.add(mesh);
      return mesh;
    }

    function voxelLine(points, material, thickness = 0.22) {
      const group = new THREE.Group();
      const segments = [];

      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const direction = new THREE.Vector3().subVectors(b, a);
        const length = direction.length();

        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(thickness, thickness, length),
          material
        );

        mesh.position.copy(a).add(b).multiplyScalar(0.5);
        mesh.rotation.y = -Math.atan2(direction.x, direction.z);
        group.add(mesh);
      }

      scene.add(group);
      return group;
    }

    function makeTextSprite(text, color, fontSize = 64) {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 128;

      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = color;
      context.font = "900 72px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(text, 512, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false
      });

      const sprite = new THREE.Sprite(material);
      return sprite;
    }

    // -------------------------------------------------------------------------
    // Snow Terrain and Base Foundation
    // -------------------------------------------------------------------------

    const ground = voxelBox(
      34,
      1.2,
      24,
      materials.rock,
      0,
      -0.65,
      0
    );

    // Irregular snow patches, made from small voxel blocks.
    const snowLocations = [
      [-11, 0.05, 3, 5, 2.2, 4],
      [3, 0.08, 4, 6, 1.8, 5],
      [11, 0.05, -1, 4, 1.6, 3],
      [-2, 0.1, -6, 7, 1.4, 4],
      [7, 0.12, 7, 5, 1.2, 3],
      [-12, 0.1, 6, 4, 1.0, 3]
    ];

    for (const patch of snowLocations) {
      for (let x = 0; x < patch[0]; x++) {
        for (let z = 0; z < patch[2]; z++) {
          const block = voxelBox(
            0.8,
            0.45,
            0.8,
            materials.snow,
            patch[1] - patch[3] / 2 + x * 0.8,
            patch[1],
            patch[2] - patch[4] / 2 + z * 0.8
          );
          block.rotation.y = Math.random() * 0.25;
        }
      }
    }

    // Foundation under the base.
    voxelBox(31, 0.7, 20, materials.darkMetal, 0, -1.45, 0);
    voxelBox(29, 0.18, 18, materials.black, 0, -0.92, 0);

    // -------------------------------------------------------------------------
    // Airbase Building
    // -------------------------------------------------------------------------

    const building = new THREE.Group();
    scene.add(building);

    // Main lower structure.
    voxelBox(22, 3.4, 12, materials.darkMetal, 0, 1.2, 0, false);
    voxelBox(23, 0.45, 13, materials.mediumMetal, 0, 3.0, 0, false);

    // Side wings.
    voxelBox(7, 5.2, 6.5, materials.darkMetal, -12, 1.6, -1, false);
    voxelBox(7, 5.2, 6.5, materials.darkMetal, 12, 1.6, -1, false);

    // Roof panels.
    for (let x = -9; x <= 9; x += 3) {
      voxelBox(2.6, 0.35, 13.5, materials.lightMetal, x, 4.25, 0, false);
    }

    for (let z = -4; z <= 4; z += 2) {
      voxelBox(23, 0.3, 1.7, materials.lightMetal, 0, 4.25, z, false);
    }

    // Structural columns.
    const columns = [
      [-11, 3.6, -5.5],
      [-5, 3.6, -5.5],
      [5, 3.6, -5.5],
      [11, 3.6, -5.5],
      [-11, 3.6, 5.5],
      [-5, 3.6, 5.5],
      [5, 3.6, 5.5],
      [11, 3.6, 5.5]
    ];

    for (const [x, y, z] of columns) {
      voxelBox(0.85, y, 0.85, materials.mediumMetal, x, y, z);
    }

    // Upper walkway.
    voxelBox(25, 0.45, 3.2, materials.mediumMetal, 0, 6.2, -3.4, false);

    // Stairs.
    for (let i = 0; i < 8; i++) {
      voxelBox(
        3.2,
        0.35,
        0.8,
        materials.mediumMetal,
        10.4,
        0.4 + i * 0.58,
        -4.8 + i * 0.72,
        false
      );
    }

    // Windows.
    const windowMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b1820,
      emissive: 0x163d4b,
      emissiveIntensity: 0.8,
      roughness: 0.25,
      metalness: 0.3
    });

    for (let x = -8; x <= 8; x += 2) {
      voxelBox(
        0.9,
        1.2,
        0.12,
        windowMaterial,
        x,
        2.2,
        6.08,
        false
      );
    }

    for (const x of [-11, -5, 5, 11]) {
      voxelBox(
        0.12,
        1.2,
        1.5,
        windowMaterial,
        x + 3.4,
        2.2,
        4.28,
        false
      );
      voxelBox(
        0.12,
        1.2,
        1.5,
        windowMaterial,
        x - 3.4,
        2.2,
        4.28,
        false
      );
    }

    // Pipes and vents.
    voxelBox(0.55, 6, 0.55, materials.mediumMetal, -13.4, 3.1, 3.8);
    voxelBox(0.55, 6, 0.55, materials.mediumMetal, 13.4, 3.1, 3.8);

    for (let y = 0.5; y < 5.8; y += 0.8) {
      voxelBox(0.9, 0.16, 1.2, materials.lightMetal, -13.4, y, 3.8);
      voxelBox(0.9, 0.16, 1.2, materials.lightMetal, 13.4, y, 3.8);
    }

    // Roof antenna.
    voxelBox(0.12, 4, 0.12, materials.lightMetal, 7.8, 6.7, -5.8);
    voxelBox(2.4, 0.12, 0.12, materials.lightMetal, 7.8, 8.5, -5.8);

    // Satellite dish.
    const dish = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      materials.lightMetal
    );
    dish.position.set(-12.5, 5.5, -4.6);
    dish.rotation.set(Math.PI / 2, 0, -0.4);
    dish.castShadow = true;
    scene.add(dish);

    // -------------------------------------------------------------------------
    // Helicopter
    // -------------------------------------------------------------------------

    const helicopter = new THREE.Group();
    helicopter.position.set(-2.3, 0.8, 0.3);
    helicopter.rotation.y = -0.12;
    scene.add(helicopter);

    function helicopterPart(material, x, y, z, sx, sy, sz) {
      const part = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      part.position.set(x, y, z);
      part.castShadow = true;
      part.receiveShadow = true;
      helicopter.add(part);
      return part;
    }

    // Fuselage.
    helicopterPart(materials.darkMetal, 0, 0, 0, 3.2, 1.15, 1.65);
    helicopterPart(materials.lightMetal, 0, 0.1, 0.92, 3.4, 0.85, 0.22);
    helicopterPart(materials.black, 0, 0.05, -0.86, 3.1, 0.75, 0.18);

    // Cockpit glass.
    helicopterPart(materials.cyan, -0.55, 0.42, 0.91, 0.8, 0.42, 0.1);
    helicopterPart(materials.cyan, 0.45, 0.35, 0.91, 0.65, 0.35, 0.1);

    // Tail boom.
    helicopterPart(materials.darkMetal, 1.95, 0, 0, 2.1, 0.55, 0.65);
    helicopterPart(materials.lightMetal, 2.75, 0, 0, 0.7, 0.45, 0.5);

    // Tail fin.
    const tailFin = new THREE.Mesh(
      new THREE.BufferGeometry(),
      materials.darkMetal
    );
    tailFin.position.set(2.65, 0.3, 0);
    tailFin.rotation.z = -0.7;
    tailFin.castShadow = true;
    helicopter.add(tailFin);

    // Main rotor.
    const rotorHub = new THREE.Group();
    rotorHub.position.set(0, 1.65, 0);
    helicopter.add(rotorHub);

    helicopterPart(materials.lightMetal, 0, 0, 0, 0.4, 0.35, 0.45, rotorHub);

    const rotorBladeMaterial = materials.black;
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Group();
      blade.rotation.y = (i * Math.PI) / 2;
      rotorHub.add(blade);

      helicopterPart(
        rotorBladeMaterial,
        0,
        0,
        1.45,
        0.12,
        0.12,
        2.7,
        blade
      );
      helicopterPart(
        rotorBladeMaterial,
        0,
        0,
        -1.45,
        0.12,
        0.12,
        2.7,
        blade
      );
    }

    // Tail rotor.
    const tailRotor = new THREE.Group();
    tailRotor.position.set(3.15, 0.2, 0);
    tailRotor.rotation.y = Math.PI / 2;
    helicopter.add(tailRotor);

    helicopterPart(materials.lightMetal, 0, 0, 0, 0.4, 0.25, 0.55, tailRotor);

    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Group();
      blade.rotation.y = (i * Math.PI) / 2;
      tailRotor.add(blade);

      helicopterPart(
        materials.black,
        0,
        0,
        0.8,
        0.1,
        0.1,
        1.6,
        blade
      );
    }

    // Landing skids.
    helicopterPart(materials.lightMetal, 0, -0.75, 0, 4.3, 0.14, 0.18);
    helicopterPart(materials.lightMetal, 0, -0.75, 0, 0.16, 0.14, 2.4);
    helicopterPart(materials.lightMetal, -1.1, -0.75, 0, 0.16, 0.14, 2.4);
    helicopterPart(materials.lightMetal, 1.1, -0.75, 0, 0.16, 0.14, 2.4);

    // Rotors in motion.
    const rotorAnimation = {
      main: rotorHub,
      tail: tailRotor
    };

    // -------------------------------------------------------------------------
    // Soldiers
    // -------------------------------------------------------------------------

    function makeSoldier(x, z, rotation = 0, color = 0x344049) {
      const soldier = new THREE.Group();
      soldier.position.set(x, 0, z);
      soldier.rotation.y = rotation;
      scene.add(soldier);

      const uniform = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.78,
        metalness: 0.18
      });

      const helmet = new THREE.MeshStandardMaterial({
        color: 0x9caab0,
        roughness: 0.55,
        metalness: 0.35
      });

      // Legs.
      voxelBox(0.36, 0.85, 0.4, materials.darkMetal, -0.2, 0.45, 0, soldier);
      voxelBox(0.36, 0.85, 0.4, materials.darkMetal, 0.2, 0.45, 0, soldier);

      // torso.
      voxelBox(0.78, 0.82, 0.48, uniform, 0, 1.25, 0, soldier);

      // shoulders.
      voxelBox(0.95, 0.25, 0.42, uniform, 0, 1.65, 0, soldier);

      // head and helmet.
      voxelBox(0.48, 0.32, 0.38, helmet, 0, 2.0, 0, soldier);
      voxelBox(0.58, 0.12, 0.42, helmet, 0, 2.18, 0, soldier);
      voxelBox(0.1, 0.25, 0.3, materials.black, 0, 2.0, 0.21, soldier);

      // arms.
      voxelBox(0.22, 0.72, 0.28, uniform, -0.58, 1.2, 0, soldier);
      voxelBox(0.22, 0.72, 0.28, uniform, 0.58, 1.2, 0, soldier);

      // weapon.
      voxelBox(0.14, 0.14, 1.15, materials.black, 0.25, 1.0, 0.3, soldier);
      voxelBox(0.2, 0.2, 0.35, materials.red, 0.25, 0.85, 0.8, soldier);

      // backpack.
      voxelBox(0.55, 0.65, 0.35, materials.darkMetal, 0, 1.3, -0.31, soldier);

      return soldier;
    }

    const soldierA = makeSoldier(5.8, 2.7, -0.8, 0x344049);
    const soldierB = makeSoldier(7.2, 2.3, -1.1, 0x42505a);
    const soldierC = makeSoldier(-7.6, 1.8, 0.5, 0x303b43);

    // Soldiers on the upper walkway.
    const soldierD = makeSoldier(8.5, -3.4, 0.2, 0x46535c);
    soldierD.position.y = 6.45;

    // -------------------------------------------------------------------------
    // Vehicles and Cargo
    // -------------------------------------------------------------------------

    // Pickup truck.
    const truck = new THREE.Group();
    truck.position.set(5.8, 0, -5.5);
    truck.rotation.y = -0.25;
    scene.add(truck);

    voxelBox(3.4, 1.0, 1.8, materials.darkMetal, 0, 0.85, 0, truck);
    voxelBox(1.6, 0.75, 1.55, materials.black, -0.25, 1.65, 0, truck);
    voxelBox(0.1, 0.55, 1.45, materials.cyan, 0.61, 1.65, 0, truck);
    voxelBox(0.16, 0.65, 0.16, materials.lightMetal, 1.6, 0.85, 0, truck);
    voxelBox(0.16, 0.65, 0.16, materials.lightMetal, -1.6, 0.85, 0, truck);

    // Cargo containers.
    for (const [x, z, rot] of [
      [-9.8, -4.5, 0.1],
      [9.2, -4.8, -0.15],
      [-8.5, 4.8, 0.2]
    ]) {
      container = new THREE.Group();
      container.position.set(x, 0, z);
      container.rotation.y = rot;
      scene.add(container);

      voxelBox(3.1, 2.2, 2.2, materials.mediumMetal, 0, 1.1, 0, container);
      voxelBox(3.2, 0.18, 2.3, materials.darkMetal, 0, 2.25, 0, container);

      for (let i = 0; i < 6; i++) {
        voxelBox(0.08, 2.1, 2.25, materials.lightMetal, -1.25 + i * 0.5, 1.1, 0, container);
      }
    }

    // Fuel tanks.
    for (const [x, z] of [[-10.5, 2.8], [10.5, 2.8]]) {
      voxelBox(2.3, 2.2, 2.3, materials.darkMetal, x, 1.1, z);
      voxelBox(2.5, 0.18, 2.5, materials.lightMetal, x, 2.25, z);
      voxelBox(0.12, 0.12, 2.4, materials.cyan, x + 0.95, 1.1, z);
    }

    // -------------------------------------------------------------------------
    // Barriers, lights, and details
    // -------------------------------------------------------------------------

    // Snow barriers.
    for (let x = -14; x <= 14; x += 2.2) {
      voxelBox(1.1, 0.45, 0.5, materials.snow, x, 0.2, 8.3);
      voxelBox(0.25, 0.7, 0.25, materials.darkMetal, x, 0.35, 8.05);
    }

    // Gate posts.
    for (const x of [-15, 15]) {
      voxelBox(0.8, 4.5, 0.8, materials.darkMetal, x, 2.25, 8.4);
      voxelBox(1.2, 0.4, 1.2, materials.lightMetal, x, 4.6, 8.4);
      voxelBox(0.15, 0.5, 0.15, materials.red, x, 4.9, 8.4);
    }

    voxelLine([
      [-15, 4.7, 8.4],
      [15, 4.7, 8.4]
    ], materials.black, 0.12);

    // Spotlights.
    for (const [x, z] of [[-13, 7.8], [13, 7.8]]) {
      voxelBox(0.5, 1.2, 0.5, materials.darkMetal, x, 1.0, z);
      const lamp = new THREE.Mesh(
        new THREE.ConeGeometry(0.55, 0.8, 12),
        materials.black
      );
      lamp.position.set(x, 1.8, z);
      scene.add(lamp);
    }

    // Hanging lights.
    for (const x of [-7.5, 0, 7.5]) {
      voxelBox(0.1, 1.2, 0.1, materials.lightMetal, x, 5.0, -4.2);
      voxelBox(0.55, 0.16, 0.55, materials.cyan, x, 4.4, -4.2);
    }

    // Small warning signs.
    for (const x of [-14.2, 14.2]) {
      voxelBox(0.12, 1.1, 0.12, materials.yellow, x, 1.0, 8.4);
      voxelBox(0.7, 0.35, 0.1, materials.red, x, 1.35, 8.4);
    }

    // -------------------------------------------------------------------------
    // Falling Snow
    // -------------------------------------------------------------------------

    const snowParticles = [];
    const particleCount = 320;

    for (let i = 0; i < particleCount; i++) {
      const particle = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.045, 0.045),
        materials.snow
      );

      const x = (Math.random() - 0.5) * 28;
      const y = Math.random() * 12;
      const z = (Math.random() - 0.5) * 22;

      particle.position.set(x, y, z);
      particle.userData.speed = 0.25 + Math.random() * 0.4;
      particle.userData.drift = (Math.random() - 0.5) * 0.08;

      scene.add(particle);
      snowParticles.push(particle);
    }

    // -------------------------------------------------------------------------
    // Metal Gear Solid Title
    // -------------------------------------------------------------------------

    const title = new THREE.Group();
    title.position.set(0, -2.55, 7.2);
    scene.add(title);

    const titleTextureCanvas = document.createElement("canvas");
    titleTextureCanvas.width = 1536;
    titleTextureCanvas.height = 320;

    const titleContext = titleTextureCanvas.getContext("2d");
    titleContext.clearRect(0, 0, 1536, 320);

    // Main METAL GEAR text.
    titleContext.fillStyle = "#d8e5e8";
    titleContext.font = "900 162px Arial";
    titleContext.textAlign = "center";
    titleContext.textBaseline = "middle";
    titleContext.fillText("METAL GEAR", 768, 115);

    // Subtitle.
    titleContext.fillStyle = "#bd506f";
    titleContext.font = "800 54px Arial";
    titleContext.fillText("SOLID", 768, 245);

    const titleTexture = new THREE.CanvasTexture(titleTextureCanvas);
    titleTexture.colorSpace = THREE.SRGBColorSpace;

    const titleMaterial = new THREE.SpriteMaterial({
      map: titleTexture,
      transparent: true,
      depthWrite: false
    });

    const titleSprite = new THREE.Sprite(titleMaterial);
    titleSprite.scale.set(11.8, 2.5, 1);
    title.add(titleSprite);

    // Purple lower accent behind the text.
    const accent = new THREE.Mesh(
      new THREE.PlaneGeometry(12.1, 0.42),
      new THREE.MeshBasicMaterial({
        color: 0x8f2546,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      })
    );
    accent.position.set(0, -2.82, 7.22);
    scene.add(accent);

    // -------------------------------------------------------------------------
    // Camera Controls implemented directly
    // -------------------------------------------------------------------------

    const controls = {
      yaw: 0.55,
      pitch: 0.38,
      distance: 31,
      target: new THREE.Vector3(0, 1.5, 0),
      dragging: false,
      lastX: 0,
      lastY: 0
    };

    function updateCamera() {
      const horizontal = Math.cos(controls.pitch) * controls.distance;
      camera.position.set(
        controls.target.x + Math.sin(controls.yaw) * horizontal,
        controls.target.y + Math.sin(controls.pitch) * controls.distance,
        controls.target.z + Math.cos(controls.yaw) * horizontal
      );
      camera.lookAt(controls.target);
    }

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;

      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.yaw -= dx * 0.006;
      controls.pitch = THREE.MathUtils.clamp(
        controls.pitch + dy * 0.0045,
        0.08,
        1.15
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      renderer.domElement.style.cursor = "grab";

      if (event.pointerId !== undefined && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    // Double-click resets the camera.
    renderer.domElement.addEventListener("dblclick", () => {
      controls.yaw = 0.55;
      controls.pitch = 0.38;
      controls.distance = 31;
      controls.target.set(0, 1.5, 0);
      updateCamera();
    });

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Rotor animation.
      rotorAnimation.main.rotation.z = elapsed * 3.2;
      rotorAnimation.tail.rotation.z = elapsed * 8.5;

      // Gentle snow movement.
      for (const particle of snowParticles) {
        particle.position.y -= particle.userData.speed * 0.016;
        particle.position.x += particle.userData.drift * 0.016;

        if (particle.position.y < 0) {
          particle.position.y = 12;
          particle.position.x = (Math.random() - 0.5) * 28;
          particle.position.z = (Math.random() - 0.5) * 22;
        }
      }

      // Very subtle light pulse.
      cyanLight.intensity = 17 + Math.sin(elapsed * 1.8) * 1.5;

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
    relic: { id: "generic", name: "Metal Gear Solid Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x020508, fogColor: 0x05090d, fogDensity: 0.018 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
