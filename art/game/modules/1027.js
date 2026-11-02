// @world {"id": "1027", "title": "Chrono Trigger", "sub": "The Kingdom of Zeal", "system": "3D Render"}
// Converted from 1027-chrono_trigger_the_kingdom_of_zeal.html into a Back Roms World Walker module.

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();

  let scene = {
    add: (...objs) => objs.forEach(o => o && group.add(o)),
    remove: (...objs) => objs.forEach(o => o && group.remove(o)),
    traverse: (cb) => group.traverse(cb),
    getObjectByName: (n) => group.getObjectByName(n),
    updateMatrixWorld: () => {},
    background: null,
    fog: null
  };
  Object.defineProperty(scene, "children", { get: () => group.children });

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
  let window = typeof globalThis.window !== "undefined" ? globalThis.window : {
    innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, addEventListener: () => {}
  };
  let document = typeof globalThis.document !== "undefined" ? globalThis.document : {
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

    

    // scene redirect
    scene.background = new THREE.Color(0x9ddcff);
    scene.fog = new THREE.Fog(0x9ddcff, 26, 65);

    camera = dummyCamera();

    renderer = dummyRenderer();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    

    // Materials
    const mat = {
      rock: new THREE.MeshStandardMaterial({
        color: 0xb87843, roughness: 0.95, flatShading: true
      }),
      rockLight: new THREE.MeshStandardMaterial({
        color: 0xd39a62, roughness: 0.95, flatShading: true
      }),
      rockDark: new THREE.MeshStandardMaterial({
        color: 0x85502f, roughness: 1, flatShading: true
      }),
      grass: new THREE.MeshStandardMaterial({
        color: 0x79b85f, roughness: 0.95, flatShading: true
      }),
      grassLight: new THREE.MeshStandardMaterial({
        color: 0x95cf73, roughness: 0.95, flatShading: true
      }),
      path: new THREE.MeshStandardMaterial({
        color: 0xe5b96d, roughness: 0.95, flatShading: true
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xf3eee0, roughness: 0.75, flatShading: true
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xf38a36, roughness: 0.8, flatShading: true
      }),
      blue: new THREE.MeshStandardMaterial({
        color: 0x4c91c2, roughness: 0.7, flatShading: true
      }),
      purple: new THREE.MeshStandardMaterial({
        color: 0x8b65b5, roughness: 0.85, flatShading: true
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xd95e45, roughness: 0.8, flatShading: true
      }),
      wood: new THREE.MeshStandardMaterial({
        color: 0x9b6239, roughness: 0.9, flatShading: true
      }),
      roof: new THREE.MeshStandardMaterial({
        color: 0x547f9b, roughness: 0.85, flatShading: true
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x65b9d4, roughness: 0.25, metalness: 0.05,
        transparent: true, opacity: 0.82
      })
    };

    const hemisphere = new THREE.HemisphereLight(0xe9f8ff, 0x765039, 2.2);
    scene.add(hemisphere);

    const sun = new THREE.DirectionalLight(0xfff2cf, 3.4);
    sun.position.set(14, 22, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -25;
    sun.shadow.camera.right = 25;
    sun.shadow.camera.top = 25;
    sun.shadow.camera.bottom = -25;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 65;
    sun.shadow.bias = -0.00035;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0x91cfff, 0.75);
    fill.position.set(-15, 8, -12);
    scene.add(fill);

    function box(w, h, d, material, x = 0, y = 0, z = 0, parent = scene) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function cylinder(rt, rb, h, material, x, y, z, parent = scene, segments = 8) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(rt, rb, h, segments),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function cone(rt, rb, h, material, x, y, z, parent = scene, segments = 8) {
      const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(rt, h, segments),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function makeRockBlob(parent, center, scale, seed) {
      const group = new THREE.Group();
      group.position.copy(center);
      group.scale.setScalar(scale);
      parent.add(group);

      const count = 30;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 1.25 + Math.random() * 1.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = -1.25 + Math.random() * 1.1;

        const rock = box(
          0.75 + Math.random() * 0.8,
          0.55 + Math.random() * 0.8,
          0.75 + Math.random() * 0.8,
          Math.random() > 0.6 ? mat.rockLight : mat.rock,
          x,
          y,
          z,
          group
        );
        rock.rotation.y = Math.random() * Math.PI;
      }

      const top = box(
        scale * 1.8,
        scale * 0.38,
        scale * 1.65,
        mat.grass,
        0,
        scale * 0.12,
        0,
        group
      );
      top.receiveShadow = true;

      return group;
    }

    function makeTree(parent, x, y, z, size = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(size);
      parent.add(group);

      box(0.28, 0.55, 0.28, mat.wood, 0, 0.25, 0, group);
      box(0.36, 0.65, 0.36, mat.wood, 0, 0.75, 0, group);
      box(0.48, 0.55, 0.48, mat.wood, 0, 1.2, 0, group);

      const leaves = new THREE.Mesh(
        new THREE.ConeGeometry(0.68, 1.05, 8),
        mat.grassLight
      );
      leaves.position.y = 1.65;
      leaves.castShadow = true;
      group.add(leaves);
    }

    function makeHouse(parent, x, y, z, color = mat.white, roofMat = mat.roof) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      parent.add(group);

      box(1.15, 0.75, 1.05, color, 0, 0.38, 0, group);
      box(1.32, 0.18, 1.2, roofMat, 0, 0.85, 0, group);
      box(0.35, 0.38, 0.08, color, 0, 0.48, 0.56, group);
      box(0.38, 0.08, 0.08, mat.orange, 0, 0.68, 0.59, group);
      box(0.16, 0.16, 0.08, mat.wood, 0, 0.28, 0.56, group);
      return group;
    }

    function makeLighthouse(parent, x, y, z, scale = 1) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);
      parent.add(group);

      cylinder(0.36, 0.43, 1.2, mat.white, 0, 0.6, 0, group);
      cylinder(0.47, 0.47, 0.2, mat.orange, 0, 1.2, 0, group);
      cylinder(0.43, 0.43, 0.18, mat.white, 0, 1.35, 0, group);
      cylinder(0.28, 0.42, 0.75, mat.white, 0, 1.85, 0, group);
      cylinder(0.48, 0.48, 0.18, mat.orange, 0, 2.2, 0, group);
      cylinder(0.24, 0.24, 0.65, mat.white, 0, 2.6, 0, group);
      cylinder(0.36, 0.36, 0.12, mat.orange, 0, 2.95, 0, group);
      return group;
    }

    function makeTent(parent, x, y, z, color = mat.white) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      parent.add(group);

      const fabric = new THREE.Mesh(
        new THREE.ConeGeometry(0.38, 0.85, 4),
        color
      );
      fabric.position.y = 0.42;
      fabric.rotation.y = Math.PI / 4;
      fabric.castShadow = true;
      group.add(fabric);

      box(0.22, 0.08, 0.08, mat.wood, 0, 0.22, 0.38, group);
      return group;
    }

    function makeBridge(parent, x1, z1, x2, z2, width = 1.2) {
      const group = new THREE.Group();
      parent.add(group);

      const dx = x2 - x1;
      const dz = z2 - z1;
      const length = Math.hypot(dx, dz);
      const angle = Math.atan2(dx, dz);

      const bridge = box(
        length,
        0.24,
        width,
        mat.wood,
        (x1 + x2) / 2,
        0.3,
        (z1 + z2) / 2,
        group
      );
      bridge.rotation.y = -angle;

      for (let i = 0; i < 5; i++) {
        const t = i / 4;
        const rail = box(
          length,
          0.12,
          0.1,
          mat.wood,
          0,
          0.58,
          0,
          group
        );
        rail.position.x = dx * t;
        rail.position.z = dz * t;
        rail.rotation.y = -angle;
      }
    }

    function makeWaterfall(parent, x, y, z, height = 8) {
      const group = new THREE.Group();
      group.position.set(x, y, z);
      parent.add(group);

      const fall = cylinder(
        0.16,
        0.22,
        height,
        mat.water,
        0,
        height / 2,
        0,
        group,
        10
      );
      fall.rotation.z = -0.08;

      for (let i = 0; i < 7; i++) {
        const droplet = box(
          0.08,
          0.2,
          0.08,
          mat.white,
          Math.sin(i * 1.7) * 0.12,
          height * (0.72 - i * 0.07),
          Math.cos(i * 1.3) * 0.1,
          group
        );
        droplet.rotation.z = Math.sin(i * 2.2) * 0.35;
      }
    }

    function makeIsland(config) {
      const group = new THREE.Group();
      scene.add(group);

      const {
        position,
        scale,
        buildings = [],
        trees = [],
        details = []
      } = config;

      makeRockBlob(group, new THREE.Vector3(0, 0, 0), scale, Math.random());

      const terrain = box(
        scale * 1.75,
        scale * 0.24,
        scale * 1.55,
        mat.grass,
        0,
        scale * 0.18,
        0,
        group
      );
      terrain.receiveShadow = true;

      // Decorative front grass patches.
      for (let i = 0; i < 5; i++) {
        const patch = box(
          scale * (0.35 + Math.random() * 0.35),
          scale * 0.08,
          scale * 0.3,
          i % 2 ? mat.grassLight : mat.grass,
          (Math.random() - 0.5) * scale * 1.25,
          scale * 0.31,
          (Math.random() - 0.5) * scale * 1.1,
          group
        );
        patch.rotation.y = Math.random() * Math.PI;
      }

      for (const b of buildings) {
        const house = makeHouse(
          group,
          b.x,
          b.y || scale * 0.35,
          b.z,
          b.color || mat.white,
          b.roof || mat.roof
        );
        house.rotation.y = b.rotation || Math.random() * Math.PI;
      }

      for (const t of trees) {
        makeTree(group, t.x, scale * 0.34, t.z, t.size || 0.75);
      }

      for (const d of details) {
        if (d.type === "tent") {
          makeTent(group, d.x, scale * 0.34, d.z, d.color || mat.white);
        } else if (d.type === "lamp") {
          cylinder(
            0.08, 0.1, 0.4, mat.wood,
            d.x, scale * 0.38, d.z, group
          );
          const light = new THREE.Mesh(
            new THREE.SphereGeometry(0.13, 8, 6),
            new THREE.MeshStandardMaterial({
              color: 0xffd77a,
              emissive: 0xff9c35,
              emissiveIntensity: 0.8,
              roughness: 0.5
            })
          );
          light.position.set(d.x, scale * 0.62, d.z);
          group.add(light);
        } else if (d.type === "flower") {
          cylinder(
            0.035, 0.045, 0.18, mat.wood,
            d.x, scale * 0.44, d.z, group
          );
          const flower = new THREE.Mesh(
            new THREE.ConeGeometry(0.11, 0.18, 6),
            d.color || mat.orange
          );
          flower.position.set(d.x, scale * 0.56, d.z);
          flower.castShadow = true;
          group.add(flower);
        }
      }

      return group;
    }

    // Main island
    const main = makeIsland({
      position: new THREE.Vector3(0, 4.6, 0),
      scale: 1.4,
      buildings: [
        { x: -0.75, z: 0.15 },
        { x: 0.35, z: 0.45, rotation: 0.2 },
        { x: 0.75, z: -0.55, rotation: -0.35 },
        { x: 0.1, z: -0.72, rotation: 0.4 }
      ],
      trees: [
        { x: -1.15, z: -0.65, size: 0.8 },
        { x: 1.2, z: -0.55, size: 0.72 },
        { x: -0.35, z: 0.95, size: 0.62 }
      ],
      details: [
        { x: 0.45, z: 0.9, type: "tent", color: mat.blue },
        { x: -1.2, z: 0.7, type: "lamp" },
        { x: 1.3, z: 0.8, type: "flower", color: mat.orange },
        { x: -0.65, z: -0.95, type: "flower", color: mat.purple }
      ],
      waterfall: true
    });

    // Left island
    const left = makeIsland({
      position: new THREE.Vector3(-6.2, 2.7, 1.5),
      scale: 0.88,
      buildings: [
        { x: 0.05, z: 0.05, rotation: 0.15 },
        { x: -0.35, z: -0.45, rotation: -0.2 }
      ],
      trees: [
        { x: 0.85, z: 0.35, size: 0.65 },
        { x: -0.75, z: 0.45, size: 0.55 }
      ],
      details: [
        { x: 0.55, z: 0.4, type: "tent", color: mat.orange },
        { x: -0.25, z: 0.3, type: "lamp" },
        { x: 0.7, z: -0.45, type: "flower", color: mat.red }
      ]
    });

    // Right upper small island
    const upperRight = makeIsland({
      position: new THREE.Vector3(5.7, 7.1, -2.1),
      scale: 0.48,
      buildings: [
        { x: 0, z: 0, rotation: 0.4 }
      ],
      trees: [
        { x: 0.3, z: 0.15, size: 0.55 },
        { x: -0.25, z: -0.15, size: 0.48 }
      ],
      details: [
        { x: 0.05, z: 0.12, type: "tent", color: mat.purple }
      ]
    });

    // Right lower camp island
    const lowerRight = makeIsland({
      position: new THREE.Vector3(6.2, 1.2, 3.4),
      scale: 0.78,
      buildings: [
        { x: 0.25, z: -0.2, rotation: -0.25 },
        { x: -0.35, z: 0.45, rotation: 0.35 }
      ],
      trees: [
        { x: 0.75, z: 0.15, size: 0.68 },
        { x: -0.65, z: -0.35, size: 0.55 }
      ],
      details: [
        { x: -0.05, z: 0.2, type: "tent", color: mat.white },
        { x: 0.4, z: -0.45, type: "lamp" },
        { x: -0.45, z: 0.45, type: "flower", color: mat.blue }
      ]
    });

    // Connect main to left island
    makeBridge(scene, -2.7, 0.15, -4.35, 1.25, 0.9);

    // Connect main to right upper island
    makeBridge(scene, 2.55, -0.55, 4.35, -3.1, 0.85);

    // Connect main to right lower island
    makeBridge(scene, 2.85, 0.35, 4.75, 2.15, 0.85);

    // A few small path details on the main island.
    box(0.12, 0.035, 2.2, mat.path, -1.55, 0.32, 0.35, main);
    box(1.6, 0.035, 0.12, mat.path, 0.35, 0.32, 0.55, main);
    box(0.12, 0.035, 1.5, mat.path, 0.8, 0.32, -0.35, main);

    // Glowing lanterns around the main island.
    for (const p of [
      [-1.85, 0.4, 0.75],
      [1.85, 0.4, 0.75],
      [-1.85, 0.4, -0.75],
      [1.85, 0.4, -0.75]
    ]) {
      cylinder(0.06, 0.08, 0.35, mat.wood, p[0], 0.48, p[2], main);
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 6),
        new THREE.MeshStandardMaterial({
          color: 0xffd984,
          emissive: 0xff9a35,
          emissiveIntensity: 1.2,
          roughness: 0.45
        })
      );
      lamp.position.set(p[0], 0.69, p[2]);
      main.add(lamp);
    }

    // Massive translucent energy pillars below the main island.
    for (const x of [-2.25, 2.25]) {
      const pillar = cylinder(
        0.48, 0.62, 12,
        mat.water,
        x,
        -5.5,
        0,
        scene,
        12
      );
      pillar.material = mat.water.clone();
      pillar.material.transparent = true;
      pillar.material.opacity = 0.58;
      pillar.material.depthWrite = false;

      const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.75, 12, 8),
        new THREE.MeshBasicMaterial({
          color: 0x70d5ff,
          transparent: true,
          opacity: 0.12,
          depthWrite: false
        })
      );
      glow.position.set(x, -11.5, 0);
      scene.add(glow);
    }

    // A small floating crystal above the main peak.
    const crystal = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.65, 0),
      new THREE.MeshStandardMaterial({
        color: 0x9ee7ff,
        emissive: 0x2e9dcc,
        emissiveIntensity: 1.4,
        roughness: 0.25,
        metalness: 0.15
      })
    );
    crystal.position.set(0, 10.2, 0);
    crystal.rotation.y = Math.PI / 4;
    scene.add(crystal);

    // Tiny flying voxel aircraft.
    const aircraft = new THREE.Group();
    aircraft.position.set(-1, 5.8, 4.5);
    aircraft.rotation.y = -0.6;
    scene.add(aircraft);

    const fuselage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.26, 0.8, 6),
      mat.orange
    );
    fuselage.rotation.z = Math.PI / 2;
    aircraft.add(fuselage);

    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.12, 0.18),
      mat.white
    );
    wing.position.x = 0.4;
    aircraft.add(wing);

    const tail = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.12, 0.55),
      mat.blue
    );
    tail.position.x = -0.45;
    aircraft.add(tail);

    window = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.12, 0.08),
      mat.blue
    );
    window.position.set(0.25, 0.12, 0.2);
    aircraft.add(window);

    // Camera controls implemented directly.
    let azimuth = 0.72;
    let polar = 1.18;
    let radius = 24;
    const target = new THREE.Vector3(0, 4.5, 0);

    function updateCamera() {
      camera.position.set(
        target.x + radius * Math.sin(polar) * Math.sin(azimuth),
        target.y + radius * Math.cos(polar),
        target.z + radius * Math.sin(polar) * Math.cos(azimuth)
      );
      camera.lookAt(target);
    }

    updateCamera();

    let dragging = false;
    let previousX = 0;
    let previousY = 0;

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      previousX = event.clientX;
      previousY = event.clientY;

      azimuth -= dx * 0.006;
      polar = THREE.MathUtils.clamp(polar - dy * 0.005, 0.35, 1.48);
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

    renderer.domElement.addEventListener("wheel", (event) => {
      event.preventDefault();
      radius = THREE.MathUtils.clamp(radius + event.deltaY * 0.012, 13, 38);
      updateCamera();
    }, { passive: false });

    window.addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    // Gentle floating animation.
    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      aircraft.position.y = 5.8 + Math.sin(t * 1.4) * 0.35;
      aircraft.rotation.z = Math.sin(t * 1.1) * 0.08;
      crystal.rotation.y = t * 0.35;
      crystal.position.y = 10.2 + Math.sin(t * 1.2) * 0.12;

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
    relic: { id: "generic", name: "Chrono Trigger Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x9ddcff, fogColor: 0x9ddcff, fogDensity: 0.025 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 },
      east: { x: 12.0, z: 10.0 },
      west: { x: -12.0, z: -10.0 }
    }
  };
}
