// @world {"id": "1002", "title": "Super Mario Bros.", "sub": "World 1-1", "system": ""}
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
      position: { set: () => {}, copy: () => {} },
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

    

    // -------------------------------------------------------------------------
    // Renderer, scene, camera, lighting
    // -------------------------------------------------------------------------
    renderer = dummyRenderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    

    // scene redirect
    scene.background = new THREE.Color(0x8fb9e8);
    scene.fog = new THREE.Fog(0x8fb9e8, 23, 43);

    camera = dummyCamera();
    camera.position.set(10, 7.2, 12);

    const hemi = new THREE.HemisphereLight(0xcce9ff, 0x6a3818, 2.0);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffe8b0, 3.0);
    sun.position.set(-8, 16, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 45;
    sun.shadow.bias = -0.00035;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x8ebcff, 0.7);
    fill.position.set(10, 7, -12);
    scene.add(fill);

    // -------------------------------------------------------------------------
    // Shared materials
    // -------------------------------------------------------------------------
    const mats = {
      ground: new THREE.MeshStandardMaterial({
        color: 0x8e3f18, roughness: 0.95
      }),
      groundTop: new THREE.MeshStandardMaterial({
        color: 0xb96424, roughness: 0.95
      }),
      darkGround: new THREE.MeshStandardMaterial({
        color: 0x683216, roughness: 1
      }),
      brick: new THREE.MeshStandardMaterial({
        color: 0xa94d25, roughness: 0.92
      }),
      brickDark: new THREE.MeshStandardMaterial({
        color: 0x71351c, roughness: 1
      }),
      brickLight: new THREE.MeshStandardMaterial({
        color: 0xc15b30, roughness: 0.9
      }),
      cream: new THREE.MeshStandardMaterial({
        color: 0xf0d79b, roughness: 0.85
      }),
      gold: new THREE.MeshStandardMaterial({
        color: 0xf3bd32,
        metalness: 0.35,
        roughness: 0.34
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x9a5825, roughness: 0.95
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: 0x4f8f32, roughness: 0.95
      }),
      leafLight: new THREE.MeshStandardMaterial({
        color: 0x78aa3c, roughness: 0.95
      }),
      leafDark: new THREE.MeshStandardMaterial({
        color: 0x316b2c, roughness: 1
      }),
      rock: new THREE.MeshStandardMaterial({
        color: 0x777b78, roughness: 1
      }),
      rockLight: new THREE.MeshStandardMaterial({
        color: 0x9a9b91, roughness: 1
      }),
      sky: new THREE.MeshStandardMaterial({
        color: 0x8fb9e8,
        side: THREE.BackSide
      }),
      cloud: new THREE.MeshStandardMaterial({
        color: 0xf4fbff,
        roughness: 1,
        side: THREE.BackSide
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x3998c7,
        roughness: 0.28,
        metalness: 0.12,
        side: THREE.BackSide
      })
    };

    // -------------------------------------------------------------------------
    // Small helper functions
    // -------------------------------------------------------------------------
    function box(w, h, d, material, x, y, z, parent = scene) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function cylinder(radius, height, material, x, y, z, parent = scene, segments = 12) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, height, segments),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function sphere(radius, material, x, y, z, parent = scene, segments = 14) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, Math.max(8, segments / 2)),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function makeBrickTexture() {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 128;
      const ctx = c.getContext("2d");

      ctx.fillStyle = "#9a4924";
      ctx.fillRect(0, 0, 256, 128);

      for (let row = 0; row < 4; row++) {
        const offset = row % 2 ? -20 : 0;
        for (let col = -1; col < 4; col++) {
          const x = col * 64 + offset;
          const y = row * 32;
          const shade = 118 + ((row + col) % 3) * 8;
          ctx.fillStyle = `rgb(${shade + 18},${shade - 20},${shade - 35})`;
          ctx.fillRect(x + 2, y + 2, 60, 28);
          ctx.fillStyle = "rgba(255,255,255,.12)";
          ctx.fillRect(x + 3, y + 3, 58, 4);
        }
      }

      const texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(3, 2);
      return texture;
    }

    function makeTileTexture() {
      const c = document.createElement("canvas");
      c.width = 256;
      c.height = 256;
      const ctx = c.getContext("2d");

      ctx.fillStyle = "#a95c2b";
      ctx.fillRect(0, 0, 256, 256);

      for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
          const v = 130 + ((x + y * 2) % 5) * 6;
          ctx.fillStyle = `rgb(${v + 14},${v - 20},${v - 39})`;
          ctx.fillRect(x * 32 + 2, y * 32 + 2, 28, 28);
          ctx.fillStyle = "rgba(255,255,255,.10)";
          ctx.fillRect(x * 32 + 3, y * 32 + 3, 26, 3);
        }
      }

      const texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 2);
      return texture;
    }

    const brickTexture = makeBrickTexture();
    const tileTexture = makeTileTexture();
    mats.brick.map = brickTexture;
    mats.brickDark.map = brickTexture;
    mats.brickLight.map = brickTexture;
    mats.groundTop.map = tileTexture;

    // -------------------------------------------------------------------------
    // World dimensions: fully contained inside [-14.5, 14.5] x [-14.5, 14.5]
    // -------------------------------------------------------------------------
    const world = new THREE.Group();
    scene.add(world);

    const WALL_Y = 7.2;
    const WALL_H = 13.4;

    // Four continuous, inward-facing walls. Their plain surfaces are exits.
    const northWall = box(28.8, WALL_H, 1.2, mats.sky, 0, WALL_Y, -14.1);
    const southWall = box(28.8, WALL_H, 1.2, mats.sky, 0, WALL_Y, 14.1);
    const westWall = box(1.2, WALL_H, 27.8, mats.sky, -14.1, WALL_Y, 0);
    const eastWall = box(1.2, WALL_H, 27.8, mats.sky, 14.1, WALL_Y, 0);

    // Outer wall caps, kept low and continuous.
    box(28.8, 0.55, 1.65, mats.rockLight, 0, WALL_H + 0.1, -14.1);
    box(28.8, 0.55, 1.65, mats.rockLight, 0, WALL_H + 0.1, 14.1);
    box(1.65, 0.55, 27.8, mats.rockLight, -14.1, WALL_H + 0.1, 0);
    box(1.65, 0.55, 27.8, mats.rockLight, 14.1, WALL_H + 0.1, 0);

    // -------------------------------------------------------------------------
    // Main foreground platform and side platforms
    // -------------------------------------------------------------------------
    box(27.5, 2.0, 10.8, mats.ground, 0, 1.0, 1.2);
    box(10.8, 2.0, 27.5, mats.ground, 1.2, 1.0, 1.2);

    // Main platform top surface.
    box(27.3, 0.12, 10.6, mats.groundTop, 0, 2.08, 1.2);
    box(10.6, 0.12, 27.3, mats.groundTop, 1.2, 2.08, 1.2);

    // Brick border around the main platform.
    for (let x = -12.8; x <= 12.8; x += 1.6) {
      box(1.35, 0.38, 0.32, mats.brick, x, 2.42, -4.05);
      box(1.35, 0.38, 0.32, mats.brick, x, 2.42, 6.45);
    }
    for (let z = -3.3; z <= 5.8; z += 1.6) {
      box(0.32, 0.38, 1.35, mats.brick, -12.9, 2.42, z);
      box(0.32, 0.38, 1.35, mats.brick, 13.9, 2.42, z);
    }

    // Side platforms.
    box(5.4, 1.8, 5.4, mats.ground, -10.6, 1.0, -8.3);
    box(5.4, 1.8, 5.4, mats.ground, 10.6, 1.0, -8.3);
    box(0.32, 0.35, 5.2, mats.brick, -8.45, 2.18, -8.3);
    box(0.32, 0.35, 5.2, mats.brick, 8.45, 2.18, -8.3);

    // Upper side platform.
    box(7.8, 1.6, 4.5, mats.ground, -8.8, 4.1, -10.8);
    box(0.32, 0.35, 4.3, mats.brick, -5.95, 5.05, -10.8);

    // Right-side elevated block.
    box(4.8, 1.7, 4.0, mats.ground, 11.2, 4.0, 7.0);
    box(0.32, 0.35, 3.8, mats.brick, 8.8, 4.95, 7.0);

    // -------------------------------------------------------------------------
    // Brick platforms and question blocks
    // -------------------------------------------------------------------------
    const questionBlocks = [];

    function questionBlock(x, y, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = rotation;
      world.add(group);

      box(1.35, 1.35, 1.35, mats.brick, 0, 0, 0, group);
      box(1.05, 0.78, 0.08, mats.cream, 0, 0.08, 0.70, group);

      const symbol = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.23, 0.28, 4, 8),
        mats.cream
      );
      symbol.rotation.z = Math.PI / 2;
      symbol.position.set(0, 0.08, 0.76);
      group.add(symbol);

      questionBlocks.push(group);
      return group;
    }

    questionBlock(-3.6, 3.0, 2.2, 0.12);
    questionBlock(3.6, 3.0, 2.2, -0.12);
    questionBlock(-10.2, 4.75, -10.5, 0.15);
    questionBlock(10.2, 4.75, -10.5, -0.15);

    // Brick bridge / walkway on the left.
    for (let i = 0; i < 8; i++) {
      const x = -12.8 + i * 1.45;
      box(1.28, 0.32, 2.6, mats.brick, x, 2.48, -1.7);
      box(1.05, 0.18, 2.35, mats.brickLight, x, 2.72, -1.7);
    }

    // Right-side elevated brick walkway.
    for (let i = 0; i < 6; i++) {
      const z = 4.2 + i * 1.35;
      box(2.5, 0.32, 1.22, mats.brick, 11.2, 5.2, z);
      box(2.25, 0.18, 1.0, mats.brickLight, 11.2, 5.48, z);
    }

    // -------------------------------------------------------------------------
    // Trees
    // -------------------------------------------------------------------------
    const treeGroups = [];

    function tree(x, z, scale = 1, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 2.15, z);
      group.rotation.y = rotation;
      group.scale.setScalar(scale);
      world.add(group);

      cylinder(0.28, 2.1, mats.wood, 0, 1.05, 0, group, 8);

      const crown = new THREE.Mesh(
        new THREE.ConeGeometry(1.55, 3.6, 8),
        mats.leaf
      );
      crown.position.y = 3.55;
      crown.castShadow = true;
      crown.receiveShadow = true;
      group.add(crown);

      const crown2 = new THREE.Mesh(
        new THREE.ConeGeometry(1.15, 2.8, 8),
        mats.leafLight
      );
      crown2.position.y = 4.75;
      crown2.castShadow = true;
      group.add(crown2);

      treeGroups.push(group);
      return group;
    }

    tree(-11.8, -3.2, 0.9, 0.3);
    tree(-11.4, -4.1, 0.72, -0.2);
    tree(11.4, -3.0, 0.88, 0.4);
    tree(11.8, -4.0, 0.68, -0.3);
    tree(-7.0, 7.0, 0.78, 0.8);
    tree(7.0, 7.0, 0.72, -0.7);
    tree(-13.0, 6.0, 0.62, 0.1);
    tree(13.0, 6.0, 0.58, -0.1);

    // -------------------------------------------------------------------------
    // Clouds and sky decorations
    // -------------------------------------------------------------------------
    const cloudGroups = [];

    function cloud(x, y, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      world.add(group);

      const puffs = [
        [-1.15, 0.0, 0, 0.78],
        [-0.35, 0.28, 0, 1.05],
        [0.55, 0.18, 0, 0.9],
        [1.25, -0.02, 0, 0.68],
        [0.25, -0.18, 0.1, 0.85]
      ];

      for (const [px, py, pz, r] of puffs) {
        const puff = sphere(r, mats.cloud, px, py, pz, group, 10);
        puff.scale.y = 0.62;
      }

      cloudGroups.push(group);
      return group;
    }

    cloud(-7.0, 11.7, -8.0, 1.35);
    cloud(4.0, 12.7, -10.0, 1.05);
    cloud(9.0, 10.8, 3.0, 0.9);
    cloud(-12.0, 10.2, 8.0, 0.75);

    // Small hanging cloud below the upper wall.
    cloud(0.0, 8.2, 12.3, 0.55);

    // -------------------------------------------------------------------------
    // Decorative props: barrels, crates, pots, rocks
    // -------------------------------------------------------------------------
    const props = [];

    function barrel(x, y, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = rotation;
      world.add(group);

      const body = cylinder(0.48, 0.9, mats.wood, 0, 0.45, 0, group, 12);
      body.scale.z = 0.88;

      for (const yy of [0.16, 0.45, 0.75]) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.49, 0.055, 6, 16),
          mats.wood
        );
        ring.rotation.x = Math.PI / 2;
        ring.position.y = yy;
        group.add(ring);
      }

      props.push(group);
      return group;
    }

    function crate(x, y, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.rotation.y = rotation;
      world.add(group);

      box(1.15, 0.9, 1.15, mats.wood, 0, 0.45, 0, group);
      box(1.22, 0.10, 1.22, mats.wood, 0, 0.22, 0, group);
      box(1.22, 0.10, 1.22, mats.wood, 0, 0.68, 0, group);
      box(0.10, 0.9, 1.22, mats.wood, 0, 0.45, 0, group);

      props.push(group);
      return group;
    }

    function bush(x, y, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      world.add(group);

      const leaf = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.85, 1),
        mats.leafDark
      );
      leaf.position.y = 0.65;
      leaf.scale.y = 0.7;
      leaf.castShadow = true;
      group.add(leaf);

      const leaf2 = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.55, 1),
        mats.leaf
      );
      leaf2.position.set(0.45, 1.05, 0.1);
      leaf2.castShadow = true;
      group.add(leaf2);

      props.push(group);
      return group;
    }

    barrel(-5.3, 2.18, -1.7, 0.2);
    barrel(-4.65, 2.18, -1.7, -0.2);
    crate(4.8, 2.18, -1.65, 0.35);
    crate(5.45, 2.18, -1.65, -0.25);
    barrel(8.4, 2.18, 9.1, 0.4);
    bush(-8.0, 2.18, 8.7, 0.85);
    bush(8.0, 2.18, 8.7, 0.72);
    bush(-11.8, 2.18, -11.8, 0.75);
    bush(11.8, 2.18, -11.8, 0.68);

    // Rocks around the edges.
    const rockData = [
      [-13.3, 2.25, -11.7, 0.8],
      [-12.7, 2.35, -10.5, 0.55],
      [13.2, 2.25, -11.5, 0.75],
      [12.6, 2.35, -10.4, 0.5],
      [-12.8, 2.25, 10.8, 0.65],
      [12.8, 2.25, 10.8, 0.7],
      [-6.0, 2.25, 11.6, 0.45],
      [5.8, 2.25, 11.6, 0.48]
    ];

    for (const [x, y, z, s] of rockData) {
      const rock = sphere(s, mats.rock, x, y, z, world, 10);
      rock.scale.set(1.2, 0.75, 0.9);
    }

    // -------------------------------------------------------------------------
    // The iconic treasure: the Mushroom Kingdom's "Treasure Chest"
    //
    // This is a Three.js-only primitive construction. It is placed on
    // walkable ground, off the direct beeline, and is the single required relic.
    // -------------------------------------------------------------------------
    const relic = new THREE.Group();
    relic.position.set(-6.7, 2.2, 7.3);
    relic.rotation.y = 0.45;
    world.add(relic);

    // Chest base.
    box(3.6, 0.45, 2.65, mats.wood, 0, 0.23, 0, relic);

    // Chest body.
    const chestBody = box(3.45, 2.45, 2.5, mats.wood, 0, 1.55, 0, relic);
    chestBody.rotation.x = -0.025;

    // Front panel.
    box(3.2, 2.18, 0.16, mats.wood, 0, 1.55, 1.32, relic);

    // Gold trim.
    box(3.65, 0.18, 0.25, mats.gold, 0, 0.82, 1.43, relic);
    box(3.65, 0.18, 0.25, mats.gold, 0, 2.28, 1.43, relic);
    box(0.18, 2.55, 0.25, mats.gold, -1.72, 1.55, 1.43, relic);
    box(0.18, 2.55, 0.25, mats.gold, 1.72, 1.55, 1.43, relic);

    // Corner bolts.
    for (const x of [-1.42, 1.42]) {
      for (const y of [0.92, 2.18]) {
        const bolt = sphere(0.11, mats.gold, x, y, 1.49, relic, 10);
        bolt.scale.z = 0.45;
      }
    }

    // Center medallion.
    const medallion = sphere(0.43, mats.gold, 0, 1.58, 1.56, relic, 16);
    medallion.scale.z = 0.38;

    // Open lid.
    const lid = box(3.8, 0.28, 2.9, mats.gold, 0, 2.78, -0.05, relic);
    lid.rotation.x = -0.12;
    lid.rotation.z = -0.08;

    // Lid handle.
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.11, 8, 20, Math.PI),
      mats.gold
    );
    handle.position.set(0, 3.03, -0.05);
    handle.rotation.z = Math.PI;
    relic.add(handle);

    // Shiny treasure inside.
    const gem = sphere(0.38, mats.gold, 0, 2.35, 0.05, relic, 16);
    gem.scale.y = 1.25;

    // Small crown on top.
    const crownBase = sphere(0.38, mats.gold, 0, 3.12, -0.05, relic, 14);
    crownBase.scale.y = 0.65;

    for (const x of [-0.18, 0, 0.18]) {
      const spike = new THREE.Mesh(
        new THREE.ConeGeometry(0.13, 0.55, 8),
        mats.gold
      );
      spike.position.set(x, 3.42, -0.05);
      relic.add(spike);
    }

    // A tiny glowing point makes the relic easy to spot without textures.
    const relicGlow = new THREE.PointLight(0xffc75c, 1.4, 5.5, 2);
    relicGlow.position.set(0, 2.6, 0.8);
    relic.add(relicGlow);

    // -------------------------------------------------------------------------
    // Animated flags
    // -------------------------------------------------------------------------
    const flags = [];

    function flag(x, y, z, color) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      world.add(group);

      cylinder(0.07, 2.2, mats.wood, 0, 1.1, 0, group, 8);

      const poleTop = new THREE.Mesh(
        new THREE.SphereGeometry(0.13, 10, 8),
        mats.gold
      );
      poleTop.position.y = 2.25;
      group.add(poleTop);

      const cloth = new THREE.Mesh(
        new THREE.PlaneGeometry(1.35, 0.68, 8, 2),
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.85,
          side: THREE.DoubleSide
        })
      );
      cloth.position.set(0.68, 2.05, 0);
      cloth.castShadow = true;
      group.add(cloth);

      flags.push({ group, cloth, phase: Math.random() * Math.PI * 2 });
      return group;
    }

    flag(-3.0, 2.18, 4.6, 0xdc4e37);
    flag(3.0, 2.18, 4.6, 0xe5ad32);

    // -------------------------------------------------------------------------
    // Small animated elements
    // -------------------------------------------------------------------------
    const particles = [];

    function particle(x, y, z, color, size) {
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.75 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 6), material);
      mesh.position.set(x, y, z);
      scene.add(mesh);
      particles.push({ mesh, phase: Math.random() * Math.PI * 2, speed: 0.25 + Math.random() * 0.2 });
    }

    particle(-8.5, 10.5, 5.0, 0xffe6a0, 0.18);
    particle(8.0, 9.2, 6.0, 0xffc85b, 0.14);
    particle(2.0, 8.0, -8.0, 0xffffff, 0.12);

    // -------------------------------------------------------------------------
    // Camera controls: native orbit, no external controls
    // -------------------------------------------------------------------------
    const controls = {
      target: new THREE.Vector3(0, 4.0, 0),
      radius: 21,
      theta: 0.72,
      phi: 1.18,
      minRadius: 11,
      maxRadius: 30,
      minPhi: 0.35,
      maxPhi: 1.48,
      dragging: false,
      lastX: 0,
      lastY: 0
    };

    function updateCamera() {
      controls.phi = THREE.MathUtils.clamp(controls.phi, controls.minPhi, controls.maxPhi);
      controls.radius = THREE.MathUtils.clamp(controls.radius, controls.minRadius, controls.maxRadius);

      camera.position.set(
        controls.target.x + controls.radius * Math.sin(controls.phi) * Math.sin(controls.theta),
        controls.target.y + controls.radius * Math.cos(controls.phi),
        controls.target.z + controls.radius * Math.sin(controls.phi) * Math.cos(controls.theta)
      );

      camera.lookAt(controls.target);
    }

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
      controls.phi -= dy * 0.005;
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
      controls.radius += event.deltaY * 0.012;
      updateCamera();
    }, { passive: false });

    // Pinch-to-zoom for touch.
    const touches = new Map();
    let pinchDistance = 0;

    renderer.domElement.addEventListener("touchstart", (event) => {
      for (const touch of event.changedTouches) {
        touches.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY
        });
      }

      if (touches.size === 2) {
        const [a, b] = [...touches.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    }, { passive: true });

    renderer.domElement.addEventListener("touchmove", (event) => {
      for (const touch of event.changedTouches) {
        if (!touches.has(touch.identifier)) continue;
        touches.set(touch.identifier, {
          x: touch.clientX,
          y: touch.clientY
        });
      }

      if (touches.size === 2) {
        const [a, b] = [...touches.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDistance > 0) {
          controls.radius = THREE.MathUtils.clamp(
            controls.radius + (pinchDistance - distance) * 0.018,
            controls.minRadius,
            controls.maxRadius
          );
          updateCamera();
        }
        pinchDistance = distance;
      }
    }, { passive: true });

    renderer.domElement.addEventListener("touchend", (event) => {
      for (const touch of event.changedTouches) touches.delete(touch.identifier);
      if (touches.size < 2) pinchDistance = 0;
    }, { passive: true });

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
    /* [SHIELD] */
    requestAnimationFrame(animate);
    try {



      const t = clock.getElapsedTime();

      // Gentle cloud drift.
      for (const cloud of cloudGroups) {
        cloud.position.x += Math.sin(t * 0.08 + cloud.position.z) * 0.0018;
      }

      // Flag flutter.
      for (const item of flags) {
        item.cloth.rotation.y = Math.sin(t * 2.1 + item.phase) * 0.22;
        item.cloth.rotation.z = Math.sin(t * 3.0 + item.phase) * 0.055;
        item.group.rotation.z = Math.sin(t * 1.4 + item.phase) * 0.025;
      }

      // Subtle relic shimmer and glow.
      relic.rotation.y = 0.45 + Math.sin(t * 0.72) * 0.06;
      relicGlow.intensity = 1.25 + Math.sin(t * 2.1) * 0.25;

      // Rising motes.
      for (const p of particles) {
        p.mesh.position.y += 0.0018;
        p.mesh.rotation.x += 0.003;
        p.mesh.rotation.z += 0.002;
        if (p.mesh.position.y > 12) {
          p.mesh.position.y = 3.0;
        }
      }

      
    } catch (e) {
      console.warn('Animation tick suppressed:', e.message);
    }
    renderer.render(scene, camera);
    }

    updateCamera();
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
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
    relic: { name: "Super Mario Bros. Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x8fb9e8, fogColor: 0x8fb9e8, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}
