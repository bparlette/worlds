// @world {"id": "1069", "title": "Super Ghouls 'n Ghosts", "sub": "The Graveyard Diorama", "system": "3D Render"}
// Converted from 1069-super_ghouls_x27n_ghosts_the_graveyard_diorama.html into a Back Roms World Walker module.

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

    

    // ---------------------------------------------------------------------
    // Renderer and scene
    // ---------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x08070a);
    scene.fog = new THREE.FogExp2(0x08070a, 0.035);

    camera = dummyCamera();

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    document.body.prepend(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0x9bb4c8, 0x21140c, 1.45);
    scene.add(hemi);

    const key = new THREE.DirectionalLight(0xffd29b, 3.2);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -7;
    key.shadow.camera.right = 7;
    key.shadow.camera.top = 7;
    key.shadow.camera.bottom = -7;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 25;
    key.shadow.bias = -0.0004;
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x718dff, 1.8);
    rim.position.set(-5, 3, -4);
    scene.add(rim);

    const warmFill = new THREE.PointLight(0xff8a38, 18, 12, 2);
    warmFill.position.set(-2.3, 1.8, 2.4);
    scene.add(warmFill);

    // ---------------------------------------------------------------------
    // Materials
    // ---------------------------------------------------------------------

    const mat = {
      ground: new THREE.MeshStandardMaterial({
        color: 0x566b35,
        roughness: 0.95
      }),
      groundDark: new THREE.MeshStandardMaterial({
        color: 0x334726,
        roughness: 1
      }),
      dirt: new THREE.MeshStandardMaterial({
        color: 0x85502b,
        roughness: 1
      }),
      stone: new THREE.MeshStandardMaterial({
        color: 0x687074,
        roughness: 0.92
      }),
      stoneLight: new THREE.MeshStandardMaterial({
        color: 0x929998,
        roughness: 0.88
      }),
      stoneDark: new THREE.MeshStandardMaterial({
        color: 0x303a3d,
        roughness: 1
      }),
      grass: new THREE.MeshStandardMaterial({
        color: 0x647b3c,
        roughness: 0.95
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x82924c,
        roughness: 0.95
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x56331e,
        roughness: 0.95
      }),
      woodLight: new THREE.MeshStandardMaterial({
        color: 0x79502d,
        roughness: 0.9
      }),
      iron: new THREE.MeshStandardMaterial({
        color: 0x353d40,
        metalness: 0.65,
        roughness: 0.48
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xc9973d,
        metalness: 0.72,
        roughness: 0.3
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0x8f211f,
        roughness: 0.8
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x294c70,
        roughness: 0.72
      }),
      green: new THREE.MeshStandardMaterial({
        color: 0x355b48,
        roughness: 0.8
      }),
      skull: new THREE.MeshStandardMaterial({
        color: 0xe2d1aa,
        roughness: 0.9
      }),
      eye: new THREE.MeshStandardMaterial({
        color: 0xffd56b,
        emissive: 0xffa92e,
        emissiveIntensity: 1.7,
        roughness: 0.4
      }),
      flame: new THREE.MeshStandardMaterial({
        color: 0xffa23d,
        emissive: 0xff631f,
        emissiveIntensity: 2.4,
        roughness: 0.6
      })
    };

    // ---------------------------------------------------------------------
    // Voxel helpers
    // ---------------------------------------------------------------------

    const voxel = (x, y, z, sx, sy, sz, material, parent = scene) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(sx, sy, sz),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const voxBlock = (
      x, y, z,
      sx = 0.36,
      sy = 0.36,
      sz = 0.36,
      material = mat.stone,
      parent = scene
    ) => voxel(x, y, z, sx, sy, sz, material, parent);

    function makeSkull(parent, x, y, z, scale = 1, rotationY = 0) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = rotationY;
      group.scale.setScalar(scale);

      const skullShape = new THREE.Shape();
      skullShape.moveTo(-0.15, 0.15);
      skullShape.lineTo(0.15, 0.15);
      skullShape.lineTo(0.2, 0.42);
      skullShape.lineTo(0, 0.58);
      skullShape.lineTo(-0.2, 0.42);
      skullShape.closePath();

      const face = new THREE.Mesh(
        new THREE.ShapeGeometry(skullShape),
        mat.skull
      );
      face.position.z = 0.04;
      face.castShadow = true;
      group.add(face);

      voxBlock(-0.055, 0.11, 0.095, 0.055, 0.11, 0.055, mat.eye, group);
      voxBlock(0.055, 0.11, 0.095, 0.055, 0.11, 0.055, mat.eye, group);
      voxBlock(0, 0.16, 0.13, 0.24, 0.065, 0.07, mat.eye, group);

      voxel(-0.17, -0.04, 0, 0.14, 0.22, 0.2, mat.skull, group);
      voxel(0.17, -0.04, 0, 0.14, 0.22, 0.2, mat.skull, group);
      voxel(0, -0.23, 0, 0.27, 0.13, 0.25, mat.skull, group);

      parent.add(group);
      return group;
    }

    function makeCrown(parent, x, y, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);

      voxel(0, 0.18, 0, 0.72, 0.16, 0.42, mat.gold, group);
      voxel(-0.25, 0.42, 0, 0.16, 0.3, 0.18, mat.gold, group);
      voxel(0.25, 0.42, 0, 0.16, 0.3, 0.18, mat.gold, group);
      voxel(-0.1, 0.66, 0, 0.12, 0.24, 0.12, mat.gold, group);
      voxel(0.1, 0.66, 0, 0.12, 0.24, 0.12, mat.gold, group);

      parent.add(group);
      return group;
    }

    function makeShield(parent, x, y, z, scale = 1, rotationY = 0) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = rotationY;
      group.scale.setScalar(scale);

      const shape = new THREE.Shape();
      shape.moveTo(-0.42, -0.38);
      shape.lineTo(0.42, -0.38);
      shape.lineTo(0.42, -0.2);
      shape.quadraticCurveTo(0.42, 0.12, 0, 0.25);
      shape.quadraticCurveTo(-0.42, 0.12, -0.42, -0.2);
      shape.closePath();

      const shield = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, {
          depth: 0.16,
          bevelEnabled: true,
          bevelSize: 0.045,
          bevelThickness: 0.045,
          bevelSegments: 2
        }),
        mat.iron
      );
      shield.castShadow = true;
      shield.receiveShadow = true;
      group.add(shield);

      voxel(0, 0.02, 0.2, 0.13, 0.58, 0.08, mat.gold, group);
      voxel(0, 0.02, 0.27, 0.18, 0.08, 0.08, mat.gold, group);

      parent.add(group);
      return group;
    }

    function makeTorches(parent, x, y, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);

      voxel(0, 0.1, 0, 0.12, 0.2, 0.12, mat.wood, group);
      voxel(0.04, 0.31, 0, 0.05, 0.13, 0.05, mat.flame, group);
      voxel(-0.04, 0.31, 0, 0.05, 0.13, 0.05, mat.flame, group);

      parent.add(group);
      return group;
    }

    // ---------------------------------------------------------------------
    // Terrain: layered diorama slab with grass top and cliff sides
    // ---------------------------------------------------------------------

    const terrain = new THREE.Group();
    scene.add(terrain);

    const groundY = 0;
    const groundWidth = 11;
    const groundDepth = 8;

    // Lower earth slab.
    voxel(0, -0.55, 0, groundWidth + 0.6, 0.75, groundDepth + 0.6, mat.dirt, terrain);

    // Main top surface, tiled into visible voxel squares.
    const groundCell = 0.58;
    for (let x = -5; x <= 5; x++) {
      for (let z = -3; z <= 3; z++) {
        const edge = Math.max(
          0,
          Math.max(Math.abs(x), Math.abs(z))
        );
        const material = edge >= 2
          ? mat.groundDark
          : mat.ground;

        voxel(
          x * groundCell,
          0.02,
          z * groundCell,
          groundCell * 0.96,
          0.16,
          groundCell * 0.96,
          material,
          terrain
        );
      }
    }

    // Front and side cliff blocks.
    for (let x = -5; x <= 5; x++) {
      voxel(x * groundCell, -0.25, -4.05, 0.58, 0.6, 0.42, mat.stoneDark, terrain);
      voxel(x * groundCell, -0.25, 4.05, 0.58, 0.6, 0.42, mat.stoneDark, terrain);
    }

    for (let z = -3; z <= 3; z++) {
      voxel(-5.55, -0.25, z * groundCell, 0.42, 0.6, 0.58, mat.stoneDark, terrain);
      voxel(5.55, -0.25, z * groundCell, 0.42, 0.6, 0.58, mat.stoneDark, terrain);
    }

    // Irregular grass tufts around the perimeter.
    const grassPositions = [
      [-4.9, 0.14, -2.8], [-4.4, 0.14, 2.6], [-3.8, 0.14, -3.1],
      [-2.8, 0.14, 3.0], [-1.4, 0.14, -3.2], [0.2, 0.14, 3.2],
      [1.8, 0.14, -2.9], [3.2, 0.14, 2.7], [4.8, 0.14, -1.8],
      [-4.7, 0.14, 1.4], [4.6, 0.14, -1.5]
    ];

    for (const [x, y, z] of grassPositions) {
      voxel(x, y, z, 0.38, 0.18, 0.38, mat.grass, terrain);
      voxel(x + 0.18, y + 0.12, z, 0.22, 0.25, 0.22, mat.grassLight, terrain);
    }

    // ---------------------------------------------------------------------
    // Main fortress / tomb entrance
    // ---------------------------------------------------------------------

    const fortress = new THREE.Group();
    scene.add(fortress);

    // Rear cliff and arch.
    voxel(-0.2, 0.55, -3.1, 4.2, 1.35, 1.35, mat.stone, fortress);
    voxel(-1.8, 1.1, -3.2, 0.8, 1.65, 0.8, mat.stoneDark, fortress);
    voxel(1.8, 1.1, -3.2, 0.8, 1.65, 0.8, mat.stoneDark, fortress);

    // Stone arch made from wedge-like blocks.
    for (let i = 0; i < 7; i++) {
      const angle = Math.PI * (i / 6);
      const radius = 1.35;
      const x = Math.sin(angle) * radius;
      const y = 1.45 + Math.cos(angle) * radius;

      voxel(
        x,
        y,
        -2.25,
        0.52,
        0.52,
        0.72,
        i % 2 ? mat.stone : mat.stoneLight,
        fortress
      );
    }

    // Dark interior behind the gate.
    voxel(0, 0.2, -2.95, 2.6, 2.1, 0.5, mat.stoneDark, fortress);
    voxel(-0.65, 0.55, -2.95, 0.2, 1.2, 0.2, mat.eye, fortress);
    voxel(0.65, 0.55, -2.95, 0.2, 1.2, 0.2, mat.eye, fortress);

    // Iron gate rails.
    for (let x = -1.4; x <= 1.4; x += 0.35) {
      voxel(x, 0.8, -1.85, 0.14, 1.8, 0.14, mat.iron, fortress);
    }

    for (const y of [0.45, 1.15, 1.85]) {
      voxel(0, y, -1.85, 3.0, 0.14, 0.14, mat.iron, fortress);
    }

    // Iron crossbars.
    for (let z = -1.7; z <= -1.45; z += 0.18) {
      voxel(0, 1.1, z, 0.1, 0.1, 0.22, mat.iron, fortress);
    }

    // ---------------------------------------------------------------------
    // The armored warrior
    // ---------------------------------------------------------------------

    const warrior = new THREE.Group();
    fortress.position.set(-1.8, 0.16, 1.25);
    fortress.rotation.y = -0.38;
    scene.add(fortress);

    // Legs.
    voxel(-0.18, 0.2, 0, 0.34, 0.48, 0.34, mat.iron, warrior);
    voxel(0.18, 0.2, 0, 0.34, 0.48, 0.34, mat.iron, warrior);
    voxel(-0.18, 0.48, 0.03, 0.36, 0.18, 0.36, mat.blue, warrior);
    voxel(0.18, 0.48, 0.03, 0.36, 0.18, 0.36, mat.blue, warrior);

    // Torso and breastplate.
    voxel(0, 0.86, 0, 0.62, 0.78, 0.48, mat.blue, warrior);
    voxel(0, 0.87, 0.27, 0.55, 0.62, 0.08, mat.iron, warrior);
    voxel(0, 0.87, 0.33, 0.24, 0.36, 0.04, mat.gold, warrior);

    // Belt.
    voxel(0, 0.48, 0, 0.68, 0.15, 0.43, mat.wood, warrior);

    // Arms.
    voxel(-0.43, 0.85, -0.02, 0.28, 0.75, 0.32, mat.blue, warrior);
    voxel(-0.59, 0.84, -0.03, 0.12, 0.64, 0.18, mat.iron, warrior);
    voxel(0.43, 0.85, -0.02, 0.28, 0.75, 0.32, mat.blue, warrior);
    voxel(0.59, 0.84, -0.03, 0.12, 0.64, 0.18, mat.iron, warrior);

    // Head and helmet.
    voxel(0, 1.42, 0, 0.48, 0.46, 0.44, mat.blue, warrior);
    voxel(0, 1.61, 0, 0.5, 0.2, 0.48, mat.iron, warrior);
    voxel(0, 1.76, 0, 0.52, 0.14, 0.5, mat.gold, warrior);
    voxel(0, 1.82, 0.02, 0.34, 0.08, 0.32, mat.eye, warrior);
    voxel(-0.2, 1.43, 0.24, 0.12, 0.1, 0.05, mat.eye, warrior);
    voxel(0.2, 1.43, 0.24, 0.12, 0.1, 0.05, mat.eye, warrior);

    makeCrown(warrior, 0, 1.93, 0, 0.9);

    // Spear.
    const spear = new THREE.Group();
    spear.position.set(0.1, 0.1, 0.8);
    spear.rotation.z = -0.48;
    warrior.add(spear);

    voxel(0, 0, 0, 0.1, 1.8, 0.1, mat.wood, spear);
    voxel(0, 0.85, 0, 0.12, 0.18, 0.12, mat.gold, spear);
    voxel(0, 1.9, 0.05, 0.12, 0.25, 0.12, mat.gold, spear);

    // Shield.
    makeShield(warrior, -0.82, 0.95, -0.15, 0.9, 0.2);

    // Torch.
    makeTorches(warrior, 0.68, 1.15, -0.38, 0.75);

    // ---------------------------------------------------------------------
    // Zombie / undead defender on the right
    // ---------------------------------------------------------------------

    const zombie = new THREE.Group();
    zombie.position.set(2.0, 0.16, 0.35);
    zombie.rotation.y = 0.35;
    scene.add(zombie);

    // Rotted body.
    voxel(0, 0.45, 0, 0.5, 0.7, 0.46, mat.green, zombie);
    voxel(-0.18, 0.73, 0, 0.28, 0.5, 0.3, mat.eye, zombie);
    voxel(0.18, 0.73, 0, 0.28, 0.5, 0.3, mat.eye, zombie);

    // Head.
    voxel(0, 1.03, 0, 0.46, 0.45, 0.44, mat.eye, zombie);
    voxel(0, 1.24, 0, 0.48, 0.12, 0.46, mat.green, zombie);
    voxel(0, 1.32, 0.03, 0.25, 0.07, 0.24, mat.eye, zombie);
    voxel(-0.13, 1.05, 0.23, 0.07, 0.08, 0.04, mat.eye, zombie);
    voxel(0.13, 1.05, 0.23, 0.07, 0.08, 0.04, mat.eye, zombie);

    // Arms and claws.
    voxel(-0.38, 0.65, 0, 0.25, 0.55, 0.28, mat.eye, zombie);
    voxel(0.38, 0.65, 0, 0.25, 0.55, 0.28, mat.eye, zombie);
    voxel(-0.53, 0.48, 0.03, 0.12, 0.3, 0.12, mat.eye, zombie);
    voxel(0.53, 0.48, 0.03, 0.12, 0.3, 0.12, mat.eye, zombie);

    // Teeth.
    for (let i = 0; i < 4; i++) {
      voxel(0, 0.91 + i * 0.07, 0.25, 0.18, 0.06, 0.07, mat.skull, zombie);
    }

    // Spear.
    const zombieSpear = new THREE.Group();
    zombieSpear.position.set(0.1, 0.1, 0.85);
    zombieSpear.rotation.z = 0.52;
    zombie.add(zombieSpear);

    voxel(0, 0, 0, 0.1, 1.6, 0.1, mat.wood, zombieSpear);
    voxel(0, 0.75, 0, 0.12, 0.16, 0.12, mat.gold, zombieSpear);
    voxel(0, 1.75, 0.03, 0.12, 0.22, 0.12, mat.gold, zombieSpear);

    // Shield.
    makeShield(zombie, -0.78, 0.82, -0.2, 0.75, -0.25);

    // ---------------------------------------------------------------------
    // Coffins
    // ---------------------------------------------------------------------

    function makeCoffin(parent, x, y, z, scale = 1, rotationY = 0, open = false) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = rotationY;
      group.scale.setScalar(scale);

      const shape = new THREE.Shape();
      shape.moveTo(-0.48, -0.42);
      shape.quadraticCurveTo(-0.62, -0.2, -0.62, 0.12);
      shape.quadraticCurveTo(-0.62, 0.4, -0.35, 0.5);
      shape.lineTo(0.35, 0.5);
      shape.quadraticCurveTo(0.62, 0.4, 0.62, 0.12);
      shape.quadraticCurveTo(0.62, -0.2, 0.48, -0.42);
      shape.closePath();

      const lid = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, {
          depth: 0.18,
          bevelEnabled: true,
          bevelSize: 0.035,
          bevelThickness: 0.035,
          bevelSegments: 2
        }),
        mat.iron
      );
      lid.castShadow = true;
      lid.receiveShadow = true;
      group.add(lid);

      // Gold ankh.
      voxel(0, 0.02, 0.24, 0.12, 0.48, 0.08, mat.gold, group);
      voxel(0, 0.18, 0.27, 0.22, 0.08, 0.08, mat.gold, group);
      voxel(0, 0.18, 0.27, 0.08, 0.2, 0.08, mat.gold, group);

      if (open) {
        voxel(0, 0.48, 0, 0.72, 0.1, 0.48, mat.skull, group);
        voxel(-0.18, 0.62, 0.08, 0.18, 0.2, 0.18, mat.eye, group);
        voxel(0.18, 0.62, 0.08, 0.18, 0.2, 0.18, mat.eye, group);
      }

      parent.add(group);
      return group;
    }

    makeCoffin(scene, -2.35, 0.22, 1.75, 0.72, -0.25, false);
    makeCoffin(scene, 3.2, 0.22, 1.55, 0.66, 0.25, false);
    makeCoffin(scene, 3.4, 0.22, -0.65, 0.55, -0.35, true);

    // A skull resting at the entrance.
    makeSkull(scene, 1.45, 0.17, 1.72, 0.95, -0.4);

    // ---------------------------------------------------------------------
    // Treasure chest on the grass
    // ---------------------------------------------------------------------

    const chest = new THREE.Group();
    chest.position.set(-0.45, 0.75, -2.55);
    chest.rotation.y = 0.15;
    scene.add(chest);

    const chestShape = new THREE.Shape();
    chestShape.moveTo(-0.5, -0.28);
    chestShape.lineTo(0.5, -0.28);
    chestShape.lineTo(0.5, 0.25);
    chestShape.lineTo(-0.5, 0.25);
    chestShape.closePath();

    const chestBody = new THREE.Mesh(
      new THREE.ExtrudeGeometry(chestShape, {
        depth: 0.42,
        bevelEnabled: true,
        bevelSize: 0.055,
        bevelThickness: 0.055,
        bevelSegments: 2
      }),
      mat.wood
    );
    chestBody.castShadow = true;
    chestBody.receiveShadow = true;
    chest.add(chestBody);

    voxel(0, 0.15, 0.26, 0.13, 0.52, 0.08, mat.gold, chest);
    voxel(0, 0.15, 0.31, 0.22, 0.08, 0.08, mat.gold, chest);

    // Gold coins and a skull on top.
    for (let i = 0; i < 6; i++) {
      const coin = voxel(
        -0.28 + i * 0.1,
        0.52,
        0.08,
        0.08,
        0.035,
        0.08,
        mat.gold,
        chest
      );
      coin.rotation.y = i * 0.6;
    }

    makeSkull(chest, 0.1, 0.65, 0.05, 0.48, 0.2);

    // ---------------------------------------------------------------------
    // Skull decorations and torches
    // ---------------------------------------------------------------------

    makeSkull(scene, -3.45, 0.25, -2.45, 0.75, 0.2);
    makeSkull(scene, 3.75, 0.25, -2.25, 0.66, -0.2);
    makeSkull(scene, -3.7, 0.25, 2.25, 0.55, 0.3);

    makeTorches(scene, -3.05, 0.2, -2.65, 0.9);
    makeTorches(scene, 3.05, 0.2, -2.65, 0.9);
    makeTorches(scene, -3.1, 0.2, 2.55, 0.72);
    makeTorches(scene, 3.1, 0.2, 2.55, 0.72);

    // Small skull lanterns.
    for (const [x, y, z] of [
      [-3.05, 0.32, -2.65],
      [3.05, 0.32, -2.65]
    ]) {
      makeSkull(scene, x, y, z, 0.35, 0.1);
    }

    // ---------------------------------------------------------------------
    // Background tomb pillars
    // ---------------------------------------------------------------------

    const background = new THREE.Group();
    scene.add(background);

    for (const x of [-3.6, 3.6]) {
      voxel(x, 0.65, -4.7, 0.55, 1.3, 0.6, mat.stoneDark, background);
      voxel(x, 1.45, -4.7, 0.65, 0.35, 0.65, mat.stone, background);
      makeSkull(background, x, 1.72, -4.7, 0.62, 0.15);
    }

    // A distant floating skull.
    makeSkull(background, 0.4, 3.45, -4.8, 0.85, 0.2);

    // ---------------------------------------------------------------------
    // Floating dust particles
    // ---------------------------------------------------------------------

    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 12;
      particlePositions[i * 3 + 1] = Math.random() * 5.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0xe8c98b,
        size: 0.035,
        transparent: true,
        opacity: 0.55,
        depthWrite: false
      })
    );

    scene.add(particles);

    // ---------------------------------------------------------------------
    // Camera controls: custom orbit and keyboard movement
    // ---------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(0, 0.85, 0),
      theta: Math.PI * 0.24,
      phi: Math.PI * 0.28,
      radius: 11.8,
      dragging: false,
      previousX: 0,
      previousY: 0
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

    renderer.domElement.addEventListener("pointerdown", (event) => {
      controls.dragging = true;
      controls.previousX = event.clientX;
      controls.previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.previousX;
      const dy = event.clientY - controls.previousY;

      controls.previousX = event.clientX;
      controls.previousY = event.clientY;

      controls.theta -= dx * 0.006;
      controls.phi = THREE.MathUtils.clamp(
        controls.phi - dy * 0.005,
        0.18,
        Math.PI * 0.48
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      if (event.pointerId !== undefined &&
          renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);

    renderer.domElement.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        controls.radius = THREE.MathUtils.clamp(
          controls.radius + event.deltaY * 0.008,
          6.5,
          18
        );
        updateCamera();
      },
      { passive: false }
    );

    const keys = new Set();

    addEventListener("keydown", (event) => {
      keys.add(event.code.toLowerCase());
      if (event.code === "Space") {
        event.preventDefault();
      }
    });

    addEventListener("keyup", (event) => {
      keys.delete(event.code.toLowerCase());
    });

    function updateKeyboardMovement() {
      const speed = 0.75;
      const forward = new THREE.Vector3();
      const right = new THREE.Vector3();

      camera.getWorldDirection(forward);
      right.crossVectors(forward, camera.up).normalize();

      const move = new THREE.Vector3();

      if (keys.has("w") || keys.has("arrowup")) move.add(forward);
      if (keys.has("s") || keys.has("arrowdown")) move.sub(forward);
      if (keys.has("d") || keys.has("arrowright")) move.add(right);
      if (keys.has("a") || keys.has("arrowleft")) move.sub(right);

      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed);
        camera.position.add(move);
        updateCamera();
      }
    }

    // ---------------------------------------------------------------------
    // Resize and animation
    // ---------------------------------------------------------------------

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Gentle flame movement.
      warmFill.intensity = 16 + Math.sin(elapsed * 3.1) * 3;

      // Slow drifting dust.
      particles.rotation.y = elapsed * 0.025;
      particles.position.y = Math.sin(elapsed * 0.35) * 0.12;

      // Subtle zombie breathing.
      zombie.scale.y = 1 + Math.sin(elapsed * 1.8) * 0.012;

      updateKeyboardMovement();
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
    relic: { id: "generic", name: "Super Ghouls 'n Ghosts Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x08070a, fogColor: 0x08070a, fogDensity: 0.035 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
