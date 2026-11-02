// @world {"id": "1002", "title": "Super Mario Bros.", "sub": "World 1-1", "system": ""}
// Converted from image-js.html into a Back Roms World Walker module.

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
  // Converter repair: declared identifier(s) the scene used undeclared
  // (strict modules throw where sloppy scripts did not): solid
  let solid = 0;

    

    // scene redirect
    scene.background = new THREE.Color(0x9fc8ff);
    scene.fog = new THREE.Fog(0x9fc8ff, 28, 52);

    camera = dummyCamera();

    renderer = dummyRenderer();
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(innerWidth, innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    

    const clock = new THREE.Clock();
    const world = new THREE.Group();
    scene.add(world);

    const palette = {
      sky: 0x9fc8ff,
      deepSky: 0x6ea9ff,
      cloud: 0xf3f8ff,
      cloudShade: 0xdcecff,
      brick: 0x9f4f32,
      brickDark: 0x793928,
      brickLight: 0xc36a43,
      mortar: 0x4b281d,
      path: 0xd8b36a,
      pathDark: 0xa9783f,
      grass: 0x65a844,
      grassLight: 0x89c557,
      grassDark: 0x3f7838,
      leaf: 0x367c3e,
      leafLight: 0x55a350,
      leafDark: 0x285d37,
      shell: 0xf1c85a,
      mushroom: 0xd9573f,
      mushroomLight: 0xf17b54,
      mushroomStem: 0xe8c978,
      goomba: 0x8f5939,
      goombaDark: 0x67402b,
      pole: 0x736443,
      poleTop: 0x394d3c
    };

    const materials = {
      sky: new THREE.MeshStandardMaterial({ color: palette.sky, roughness: 1 }),
      deepSky: new THREE.MeshStandardMaterial({ color: palette.deepSky, roughness: 1 }),
      cloud: new THREE.MeshStandardMaterial({
        color: palette.cloud,
        roughness: 1,
        flatShading: true
      }),
      cloudShade: new THREE.MeshStandardMaterial({
        color: palette.cloudShade,
        roughness: 1,
        flatShading: true
      }),
      brick: new THREE.MeshStandardMaterial({
        color: palette.brick,
        roughness: .88,
        flatShading: true
      }),
      brickDark: new THREE.MeshStandardMaterial({
        color: palette.brickDark,
        roughness: .95,
        flatShading: true
      }),
      brickLight: new THREE.MeshStandardMaterial({
        color: palette.brickLight,
        roughness: .9,
        flatShading: true
      }),
      mortar: new THREE.MeshStandardMaterial({
        color: palette.mortar,
        roughness: 1
      }),
      path: new THREE.MeshStandardMaterial({
        color: palette.path,
        roughness: .95,
        flatShading: true
      }),
      pathDark: new THREE.MeshStandardMaterial({
        color: palette.pathDark,
        roughness: 1,
        flatShading: true
      }),
      grass: new THREE.MeshStandardMaterial({
        color: palette.grass,
        roughness: .95,
        flatShading: true
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: palette.grassLight,
        roughness: .95,
        flatShading: true
      }),
      grassDark: new THREE.MeshStandardMaterial({
        color: palette.grassDark,
        roughness: 1,
        flatShading: true
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: palette.leaf,
        roughness: .95,
        flatShading: true
      }),
      leafLight: new THREE.MeshStandardMaterial({
        color: palette.leafLight,
        roughness: .95,
        flatShading: true
      }),
      leafDark: new THREE.MeshStandardMaterial({
        color: palette.leafDark,
        roughness: 1,
        flatShading: true
      }),
      shell: new THREE.MeshStandardMaterial({
        color: palette.shell,
        roughness: .62,
        metalness: .08
      }),
      mushroom: new THREE.MeshStandardMaterial({
        color: palette.mushroom,
        roughness: .78,
        flatShading: true
      }),
      mushroomLight: new THREE.MeshStandardMaterial({
        color: palette.mushroomLight,
        roughness: .78,
        flatShading: true
      }),
      mushroomStem: new THREE.MeshStandardMaterial({
        color: palette.mushroomStem,
        roughness: .9
      }),
      goomba: new THREE.MeshStandardMaterial({
        color: palette.goomba,
        roughness: .95,
        flatShading: true
      }),
      goombaDark: new THREE.MeshStandardMaterial({
        color: palette.goombaDark,
        roughness: 1,
        flatShading: true
      }),
      pole: new THREE.MeshStandardMaterial({
        color: palette.pole,
        roughness: .95
      }),
      poleTop: new THREE.MeshStandardMaterial({
        color: palette.poleTop,
        roughness: .95
      })
    };

    function box(w, h, d, material, x, y, z, parent = world) {
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

    function cylinder(radius, height, material, x, y, z, parent = world, segments = 12) {
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

    function sphere(radius, material, x, y, z, parent = world, widthSegments = 12) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, widthSegments, 8),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function makeBrickBlock(x, z, width = 2.4, depth = 1.7, height = .8) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const brickCountX = Math.max(3, Math.floor(width / .62));
      const brickCountZ = Math.max(2, Math.floor(depth / .5));
      const brickCountY = Math.max(1, Math.floor(height / .48));

      for (let ix = 0; ix < brickCountX; ix++) {
        for (let iz = 0; iz < brickCountZ; iz++) {
          for (let iy = 0; iy < brickCountY; iy++) {
            const material = (ix + iy) % 4 === 0 ? materials.brickDark : materials.brick;
            const bx = -width / 2 + (ix + 1) * width / (brickCountX + 1);
            const bz = -depth / 2 + (iz + 1) * depth / (brickCountZ + 1);
            const by = .24 + iy * .48;
            const b = box(
              width / (brickCountX + 1) - .035,
              .43,
              depth / (brickCountZ + 1) - .035,
              material,
              bx,
              by,
              bz,
              group
            );
            b.rotation.y = (ix % 2 ? 1 : -1) * .025;
          }
        }
      }

      return group;
    }

    function makeCloud(x, y, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);

      const puff = (rx, ry, rz, material, px, py, pz) => {
        const puffMesh = new THREE.Mesh(
          new THREE.SphereGeometry(1, 10, 7),
          material
        );
        puffMesh.scale.set(rx, ry, rz);
        puffMesh.position.set(px, py, pz);
        puffMesh.castShadow = false;
        group.add(puffMesh);
      };

      puff(.72, .35, .48, materials.cloud, 0, 0, 0);
      puff(.58, .27, .42, materials.cloud, -.48, .12, .05);
      puff(.57, .27, .42, materials.cloud, .5, .13, .04);
      puff(.5, .23, .38, materials.cloud, .04, -.18, 0);
      puff(.43, .19, .34, materials.cloud, -.32, -.2, .02);

      return group;
    }

    function makeTree(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);

      cylinder(.22, 1.2, materials.wood || materials.pole, 0, .6, 0, group, 8);
      const trunk = materials.pole;
      const trunkTop = materials.poleTop;

      box(.42, 1.25, .42, trunk, 0, 1.45, 0, group);
      const crown = new THREE.Mesh(
        new THREE.ConeGeometry(.78, 2.25, 8),
        materials.leaf
      );
      crown.position.y = 2.75;
      crown.castShadow = true;
      group.add(crown);

      const crown2 = new THREE.Mesh(
        new THREE.ConeGeometry(.55, 1.8, 8),
        materials.leafLight
      );
      crown2.position.y = 3.65;
      crown2.castShadow = true;
      group.add(crown2);

      return group;
    }

    function makeMushroom(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);

      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(.22, .3, .75, 8),
        materials.mushroomStem
      );
      stem.position.y = .38;
      stem.castShadow = true;
      group.add(stem);

      const cap = new THREE.Mesh(
        new THREE.SphereGeometry(.48, 12, 7, 0, Math.PI * 2, 0, Math.PI / 2),
        materials.mushroom
      );
      cap.scale.y = .65;
      cap.position.y = .78;
      cap.castShadow = true;
      group.add(cap);

      const capTop = new THREE.Mesh(
        new THREE.SphereGeometry(.34, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2),
        materials.mushroomLight
      );
      capTop.scale.y = .55;
      capTop.position.y = 1.05;
      capTop.castShadow = true;
      group.add(capTop);

      return group;
    }

    function makeGardenPath(x, z, width = 2.2, length = 8) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      for (let i = 0; i < 9; i++) {
        const zLocal = -length / 2 + i * length / 8;
        const path = box(
          width,
          .18,
          length / 8 + .08,
          i % 3 === 0 ? materials.pathDark : materials.path,
          0,
          .09,
          zLocal,
          group
        );
        path.rotation.y = Math.sin(i * 1.7) * .035;
      }

      return group;
    }

    function makeLamp(x, z) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      cylinder(.09, 1.5, materials.pole, 0, .75, 0, group, 8);
      cylinder(.26, .18, materials.pole, 0, 1.55, 0, group, 10);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(.16, 10, 7),
        new THREE.MeshBasicMaterial({ color: 0xffe5a0 })
      );
      bulb.position.y = 1.72;
      group.add(bulb);

      return group;
    }

    function makeBush(x, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.scale.setScalar(scale);

      const pieces = [
        [-.35, .35, 0, .55, .55, .55],
        [.32, .38, .05, .6, .6, .58],
        [-.05, .68, -.1, .72, .7, .62],
        [.65, .25, .15, .48, .45, .5]
      ];

      for (const p of pieces) {
        const piece = new THREE.Mesh(
          new THREE.IcosahedronGeometry(p[3], 1),
          p[0] > .4 ? materials.leafLight : materials.leaf
        );
        piece.position.set(p[0], p[1], p[2]);
        piece.scale.set(p[3], p[3] * .8, p[3]);
        piece.castShadow = true;
        group.add(piece);
      }

      return group;
    }

    function makeFlag(x, z) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      cylinder(.07, 3.8, materials.pole, 0, 1.9, 0, group, 8);
      box(1.45, .72, .12, materials.brickLight, .7, 3.15, 0, group);
      box(.72, .38, .12, materials.brick, 1.12, 3.15, 0, group);

      const poleTop = new THREE.Mesh(
        new THREE.SphereGeometry(.13, 10, 7),
        materials.poleTop
      );
      poleTop.position.y = 3.8;
      group.add(poleTop);

      return group;
    }

    function makeGoomba(x, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotation;

      const body = new THREE.Mesh(
        new THREE.SphereGeometry(.55, 12, 8),
        materials.goomba
      );
      body.scale.y = .68;
      body.position.y = .55;
      body.castShadow = true;
      group.add(body);

      const left = new THREE.Mesh(
        new THREE.SphereGeometry(.24, 10, 7),
        materials.goombaDark
      );
      left.scale.set(1, .55, .72);
      left.position.set(-.25, .74, .02);
      group.add(left);

      const right = left.clone();
      right.position.x = .25;
      group.add(right);

      const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x17140f });
      const leftEye = new THREE.Mesh(
        new THREE.SphereGeometry(.095, 8, 6),
        eyeMaterial
      );
      leftEye.position.set(-.43, .79, .32);
      group.add(leftEye);

      const rightEye = leftEye.clone();
      rightEye.position.x = .43;
      group.add(rightEye);

      const eyebrowL = new THREE.Mesh(
        new THREE.BoxGeometry(.28, .13, .08),
        materials.goombaDark
      );
      eyebrowL.position.set(-.43, .91, .34);
      eyebrowL.rotation.z = -.35;
      group.add(eyebrowL);

      const eyebrowR = eyebrowL.clone();
      eyebrowR.position.x = .43;
      eyebrowR.rotation.z = .35;
      group.add(eyebrowR);

      return group;
    }

    function makeCockatoo(x, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 2.5, z);
      group.rotation.y = rotation;

      const body = new THREE.Mesh(
        new THREE.SphereGeometry(.34, 10, 7),
        materials.mushroomLight
      );
      body.scale.y = .7;
      group.add(body);

      const head = new THREE.Mesh(
        new THREE.SphereGeometry(.23, 10, 7),
        materials.mushroom
      );
      head.position.y = .31;
      group.add(head);

      const beak = new THREE.Mesh(
        new THREE.ConeGeometry(.08, .28, 5),
        materials.brickDark
      );
      beak.rotation.z = Math.PI / 2;
      beak.position.y = .45;
      group.add(beak);

      return group;
    }

    function makePipe(x, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotation;

      const outer = new THREE.Mesh(
        new THREE.CylinderGeometry(.5, .5, 1.4, 12),
        materials.brick
      );
      outer.rotation.z = Math.PI / 2;
      outer.position.y = .7;
      outer.castShadow = true;
      group.add(outer);

      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(.5, .5, .18, 12),
        materials.brickDark
      );
      top.rotation.z = Math.PI / 2;
      top.position.y = 1.42;
      group.add(top);

      const inner = new THREE.Mesh(
        new THREE.CylinderGeometry(.3, .3, 1.1, 10),
        materials.brickDark
      );
      inner.rotation.z = Math.PI / 2;
      inner.position.y = .6;
      group.add(inner);

      return group;
    }

    function makeCloudDust(x, y, z, scale = 1) {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: .32,
        depthWrite: false
      });
      const cloud = new THREE.Mesh(
        new THREE.SphereGeometry(1, 10, 7),
        material
      );
      cloud.scale.set(2.4, .65, 1.2);
      cloud.position.set(x, y, z);
      world.add(cloud);
      return cloud;
    }

    // Lighting: bright midday sun, soft fill, and warm lantern light.
    const hemi = new THREE.HemisphereLight(0xd9efff, 0x6b5b37, 2.1);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xfff1cf, 3.4);
    sun.position.set(12, 20, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 55;
    sun.shadow.bias = -.0005;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x8ebcff, 1.0);
    fill.position.set(-10, 8, -12);
    scene.add(fill);

    // Main ground plinth: a compact, 30 x 30 rectangular world.
    // The four walls remain plain, solid, and continuous.
    const outerWallHeight = 12.5;

    const northWall = box(29, outerWallHeight, .75, materials.wall || materials.brick, 0, outerWallHeight / 2, -14.25);
    const southWall = box(29, outerWallHeight, .75, materials.wall || materials.brick, 0, outerWallHeight / 2, 14.25);
    const westWall = box(.75, outerWallHeight, 29, materials.wall || materials.brick, -14.25, outerWallHeight / 2, 0);
    const eastWall = box(.75, outerWallHeight, 29, materials.wall || materials.brick, 14.25, outerWallHeight / 2, 0);

    // The wall material must be invisible from outside while remaining solid.
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: palette.brick,
      roughness: .95,
      side: THREE.BackSide
    });
    northWall.material = wallMaterial;
    southWall.material = wallMaterial;
    westWall.material = wallMaterial;
    eastWall.material = wallMaterial;

    // Main base and side retaining walls.
    box(29, 1.1, 29, materials.pathDark, 0, .55, 0);
    box(29, .35, .45, materials.path, 0, 1.2, 13.8);
    box(29, .35, .45, materials.path, 0, 1.2, -13.8);
    box(.45, .35, 27.6, materials.path, 13.8, 1.2, 0);
    box(.45, .35, 27.6, materials.path, -13.8, 1.2, 0);

    // Foreground main platform.
    box(16.8, .9, 8.2, materials.brick, -1.2, .45, 4.2);
    box(16.8, .12, 8.2, materials.path, -1.2, .96, 4.2);

    // Main upper brick platform.
    const upperPlatform = makeBrickBlock(-1.2, 5.0, 10.4, 3.5, 1.0);
    upperPlatform.position.y = 1.05;

    // A secondary floating brick block.
    const sidePlatform = makeBrickBlock(7.8, -3.6, 4.2, 3.0, .95);
    sidePlatform.position.y = .9;

    // Main path through the foreground.
    makeGardenPath(-1.2, 10.0, 2.2, 6.5);

    // Side path.
    makeGardenPath(8.2, 0.8, 1.8, 5.5);

    // Main foreground path.
    makeGardenPath(-1.2, -9.0, 2.2, 5.5);

    // Curved path segments.
    const curvePath = makeGardenPath(-6.8, 1.5, 1.7, 3.3);
    curvePath.rotation.y = -.48;

    const curvePath2 = makeGardenPath(3.8, -7.2, 1.7, 3.0);
    curvePath2.rotation.y = .52;

    // Clouds.
    const clouds = [
      makeCloud(-9.5, 8.5, -4.0, 1.25),
      makeCloud(8.2, 10.2, -6.0, 1.0),
      makeCloud(-5.0, 11.8, 5.8, .9),
      makeCloud(10.7, 8.0, 6.0, 1.1),
      makeCloud(-11.8, 6.7, 8.0, .9)
    ];

    // Distant cloud wisps.
    for (let i = 0; i < 7; i++) {
      const wisp = makeCloud(
        -13 + i * 3.1,
        11.5 + (i % 3) * .5,
        7 + (i % 2) * 1.3,
        .45 + (i % 2) * .16
      );
      wisp.scale.y = .55;
    }

    // Trees.
    makeTree(-11.4, 8.8, 1.05);
    makeTree(-10.8, 9.8, .82);
    makeTree(10.8, 8.7, .95);
    makeTree(11.5, 9.7, .78);
    makeTree(-11.7, -8.2, .85);
    makeTree(11.4, -8.3, .9);
    makeTree(-3.8, -11.7, .72);
    makeTree(3.8, -11.7, .78);

    // Bushes.
    makeBush(-8.5, 11.4, .85);
    makeBush(-6.8, 11.7, .72);
    makeBush(5.6, 11.6, .8);
    makeBush(7.2, 11.8, .68);
    makeBush(-12.4, -4.5, .75);
    makeBush(12.4, -4.5, .72);
    makeBush(-12.4, 4.5, .7);
    makeBush(12.4, 4.5, .75);

    // Small mushrooms.
    makeMushroom(-7.5, 10.0, .75);
    makeMushroom(-6.8, 10.6, .62);
    makeMushroom(5.5, 9.3, .68);
    makeMushroom(6.1, 9.7, .55);
    makeMushroom(-2.4, -11.2, .58);
    makeMushroom(2.5, -11.3, .62);

    // Pipe.
    makePipe(2.2, 8.3, .08);
    makePipe(2.2, 9.25, -.08);

    // Flags.
    makeFlag(-8.0, 10.4);
    makeFlag(8.0, -9.5);

    // Lanterns.
    makeLamp(-12.8, 11.8);
    makeLamp(12.8, 11.8);
    makeLamp(-12.8, -11.8);
    makeLamp(12.8, -11.8);

    // Goombas.
    const goombaA = makeGoomba(-5.0, 7.2, .3);
    const goombaB = makeGoomba(3.7, 4.0, -.55);
    const goombaC = makeGoomba(-9.2, -3.8, .8);
    const goombaD = makeGoomba(9.0, -5.2, -.35);

    // Cockatoos.
    const cockatooA = makeCockatoo(-7.0, 3.8, .4);
    const cockatooB = makeCockatoo(5.7, -4.6, -.8);

    // Small shell.
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(.3, 12, 8, 0, Math.PI * 2, Math.PI / 2, 0),
      materials.shell
    );
    shell.scale.y = .3;
    shell.rotation.z = -.6;
    shell.position.set(1.6, 1.05, 7.4);
    shell.castShadow = true;
    world.add(shell);

    // Relic: "The Crown of Clouds" — a pure 3D jewel resting on a small
    // stone pedestal in the middle of the world, well away from the spawn
    // route and all major landmarks.
    const relic = new THREE.Group();
    relic.position.set(0.0, 0, -1.8);
    world.add(relic);

    const relicPedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(.68, .95, .35, 16),
      materials.brickDark
    );
    relicPedestal.position.y = .18;
    relicPedestal.castShadow = true;
    relicPedestal.receiveShadow = true;
    relic.add(relicPedestal);

    const relicBase = new THREE.Mesh(
      new THREE.CylinderGeometry(.48, .62, .22, 16),
      materials.brickLight
    );
    relicBase.position.y = .42;
    relicBase.castShadow = true;
    relic.add(relicBase);

    const crownGroup = new THREE.Group();
    crownGroup.position.y = .58;
    relic.add(crownGroup);

    const crownRing = new THREE.Mesh(
      new THREE.TorusGeometry(.56, .12, 8, 24),
      materials.shell
    );
    crownRing.rotation.x = Math.PI / 2;
    crownGroup.add(crownRing);

    const upperRing = new THREE.Mesh(
      new THREE.TorusGeometry(.36, .09, 8, 20),
      materials.shell
    );
    upperRing.rotation.x = Math.PI / 2;
    upperRing.position.y = .48;
    crownGroup.add(upperRing);

    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(.34, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0xffe5a5,
        emissive: 0xffb83d,
        emissiveIntensity: .65,
        roughness: .18,
        metalness: .35
      })
    );
    gem.position.y = .95;
    gem.rotation.z = .3;
    crownGroup.add(gem);

    const gemCrown = new THREE.Mesh(
      new THREE.ConeGeometry(.2, .42, 8),
      materials.shell
    );
    gemCrown.position.y = 1.28;
    crownGroup.add(gemCrown);

    // Tiny animated particles around the relic.
    const relicParticles = [];
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xffe5a5,
      transparent: true,
      opacity: .75,
      depthWrite: false
    });

    for (let i = 0; i < 9; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(.035 + (i % 3) * .018, 7, 5),
        particleMaterial
      );
      relicParticles.push({
        mesh: particle,
        angle: (i / 9) * Math.PI * 2,
        radius: .9 + (i % 3) * .24,
        height: 1.2 + (i % 2) * .45,
        speed: .25 + (i % 4) * .07
      });
      world.add(particle);
    }

    // Subtle drifting cloud dust.
    const cloudDust = [
      makeCloudDust(-10.0, 7.8, -3.0, .8),
      makeCloudDust(8.0, 9.0, -4.0, .7),
      makeCloudDust(-3.0, 12.0, 4.0, .65),
      makeCloudDust(11.0, 7.0, 5.0, .75)
    ];

    // Camera control: orbit with pointer drag and wheel/pinch zoom.
    const controls = {
      target: new THREE.Vector3(0, 2.2, 0),
      radius: 20.5,
      theta: -0.72,
      phi: 1.08,
      dragging: false,
      pointerX: 0,
      pointerY: 0,
      pinchDistance: 0
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
      controls.pointerX = event.clientX;
      controls.pointerY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!controls.dragging) return;
      const dx = event.clientX - controls.pointerX;
      const dy = event.clientY - controls.pointerY;
      controls.pointerX = event.clientX;
      controls.pointerY = event.clientY;
      controls.theta -= dx * .006;
      controls.phi = THREE.MathUtils.clamp(
        controls.phi + dy * .005,
        .35,
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
        controls.radius + event.deltaY * .012,
        11,
        31
      );
      updateCamera();
    }, { passive: false });

    // Basic touch pinch zoom.
    const activePointers = new Map();
    let previousPinchDistance = 0;

    renderer.domElement.addEventListener("touchstart", (event) => {
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      if (activePointers.size === 2) {
        const points = [...activePointers.values()];
        previousPinchDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
      }
    }, { passive: true });

    renderer.domElement.addEventListener("touchmove", (event) => {
      if (!activePointers.has(event.pointerId)) return;
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      if (activePointers.size === 2) {
        const points = [...activePointers.values()];
        const distance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
        if (previousPinchDistance > 0) {
          controls.radius = THREE.MathUtils.clamp(
            controls.radius + (previousPinchDistance - distance) * .018,
            11,
            31
          );
          updateCamera();
        }
        previousPinchDistance = distance;
      }
    }, { passive: true });

    function removePointer(event) {
      activePointers.delete(event.pointerId);
      previousPinchDistance = 0;
    }

    renderer.domElement.addEventListener("touchend", removePointer);
    renderer.domElement.addEventListener("touchleave", removePointer);

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.setSize(innerWidth, innerHeight);
    });

    updateCamera();

    const loading = dummyEl();
    loading.style.opacity = "0";
    setTimeout(() => loading.remove(), 550);

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      for (const cloud of clouds) {
        cloud.position.x += Math.sin(elapsed * .08 + cloud.position.z) * .0008;
      }

      for (const particle of relicParticles) {
        particle.mesh.position.set(
          Math.cos(particle.angle + elapsed * particle.speed) * particle.radius,
          particle.height + Math.sin(elapsed * particle.speed * 1.7) * .12,
          Math.sin(particle.angle + elapsed * particle.speed) * particle.radius
        );
        particle.mesh.rotation.set(elapsed, elapsed * .7, elapsed * .4);
      }

      const gemPulse = 1 + Math.sin(elapsed * 2.2) * .08;
      gem.scale.setScalar(gemPulse);
      crownGroup.children[0].rotation.z = Math.sin(elapsed * .7) * .08;

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
    relic: { id: "generic", name: "Super Mario Bros. Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x9fc8ff, fogColor: 0x9fc8ff, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}
