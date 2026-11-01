// @world {"id": "020", "title": "Bionic Commando", "sub": "Neutral Area Military Base", "system": "NES"}
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
    // Renderer and scene
    // -------------------------------------------------------------------------

    // scene redirect
    scene.background = new THREE.Color(0x07141c);
    scene.fog = new THREE.FogExp2(0x0b202a, 0.018);

    camera = dummyCamera();

    renderer = dummyRenderer();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-label", "Interactive 3D military base");
    document.body.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xb8e8e8, 0x17211d, 1.7);
    scene.add(hemi);

    const sun = new THREE.DirectionalLight(0xffe6bd, 3.1);
    sun.position.set(-35, 48, 22);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -55;
    sun.shadow.camera.right = 55;
    sun.shadow.camera.top = 55;
    sun.shadow.camera.bottom = -55;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 140;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const rim = new THREE.DirectionalLight(0x7ee9df, 1.25);
    rim.position.set(30, 18, -35);
    scene.add(rim);

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const mat = {
      concrete: new THREE.MeshStandardMaterial({
        color: 0x56605f, roughness: 0.92, metalness: 0.08
      }),
      concreteDark: new THREE.MeshStandardMaterial({
        color: 0x303838, roughness: 0.95
      }),
      road: new THREE.MeshStandardMaterial({
        color: 0x263033, roughness: 0.95
      }),
      grass: new THREE.MeshStandardMaterial({
        color: 0x263c2b, roughness: 1
      }),
      forest: new THREE.MeshStandardMaterial({
        color: 0x203c2c, roughness: 1
      }),
      tree: new THREE.MeshStandardMaterial({
        color: 0x31543b, roughness: 1
      }),
      treeLight: new THREE.MeshStandardMaterial({
        color: 0x426747, roughness: 1
      }),
      mountain: new THREE.MeshStandardMaterial({
        color: 0x465054, roughness: 1, flatShading: true
      }),
      mountainHigh: new THREE.MeshStandardMaterial({
        color: 0x718084, roughness: 1, flatShading: true
      }),
      snow: new THREE.MeshStandardMaterial({
        color: 0xd8e4df, roughness: 0.9, flatShading: true
      }),
      water: new THREE.MeshStandardMaterial({
        color: 0x245d72, roughness: 0.28, metalness: 0.22
      }),
      waterShallow: new THREE.MeshStandardMaterial({
        color: 0x478294, roughness: 0.34, metalness: 0.15
      }),
      metal: new THREE.MeshStandardMaterial({
        color: 0x9aa9a7, roughness: 0.45, metalness: 0.72
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: 0x263235, roughness: 0.5, metalness: 0.75
      }),
      yellow: new THREE.MeshStandardMaterial({
        color: 0xe6b84b, roughness: 0.55, metalness: 0.25
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xd96c3d, roughness: 0.62
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xb63e36, roughness: 0.65
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xe4e8df, roughness: 0.75
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x101719, roughness: 0.8
      })
    };

    // -------------------------------------------------------------------------
    // Map layout and terrain
    // -------------------------------------------------------------------------

    const world = new THREE.Group();
    scene.add(world);

    const areas = [
      { id: 0, name: "Area 0", color: 0x385a47, label: "Forest / Field Kit" },
      { id: 1, name: "Area 1", color: 0x6b6670, label: "Mountain Pass" },
      { id: 2, name: "Area 2", color: 0x304d68, label: "River Crossing" },
      { id: 3, name: "Area 3", color: 0x776b5d, label: "Highland Ridge" },
      { id: 4, name: "Area 4", color: 0x405348, label: "Recon Outpost" }
    ];

    const areaCenters = [
      new THREE.Vector3(-12, 0, 8),
      new THREE.Vector3(0, 0, -14),
      new THREE.Vector3(15, 0, -10),
      new THREE.Vector3(13, 0, 17),
      new THREE.Vector3(-19, 0, -20)
    ];

    function terrainHeight(x, z) {
      let h = 0;

      for (const area of areas) {
        const dx = x - areaCenters[area.id].x;
        const dz = z - areaCenters[area.id].z;
        const r = Math.max(1, Math.hypot(dx, dz) / 4.2);
        const influence = Math.exp(-r * r * 0.75) * 1.8;

        if (area.id === 1) h += influence * 6.4;
        if (area.id === 3) h += influence * 4.2;
        if (area.id === 4) h += influence * 2.7;
      }

      h += Math.sin(x * 0.18) * 0.35 + Math.cos(z * 0.21) * 0.35;
      return h;
    }

    const terrainGeometry = new THREE.PlaneGeometry(130, 130, 120, 120);
    terrainGeometry.rotateX(-Math.PI / 2);

    const terrainPositions = terrainGeometry.attributes.position;
    const terrainColors = [];

    for (let i = 0; i < terrainPositions.count; i++) {
      const x = terrainPositions.getX(i);
      const z = terrainPositions.getZ(i);
      const h = terrainHeight(x, z);
      terrainPositions.setY(i, h);

      const areaIndex = Math.min(
        areas.length - 1,
        Math.round(Math.max(-0.5, Math.min(0.5, (x + z) * 0.025)))
      );
      const color = new THREE.Color(areas[areaIndex].color);
      color.offsetHSL(
        Math.sin(x * 0.35 + z * 0.2) * 0.015,
        0,
        Math.sin(z * 0.4) * 0.035
      );
      terrainColors.push(color.r, color.g, color.b);
    }

    terrainGeometry.setAttribute("color", new THREE.Float32BufferAttribute(terrainColors, 3));
    terrainGeometry.computeVertexNormals();

    const terrain = new THREE.Mesh(
      terrainGeometry,
      new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 1
      })
    );
    terrain.receiveShadow = true;
    world.add(terrain);

    // -------------------------------------------------------------------------
    // Roads and paths
    // -------------------------------------------------------------------------

    function makeRoad(points, width = 2.2) {
      const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], 0.18, p[1])));
      const segments = 48;
      const positions = [];
      const normals = [];
      const uvs = [];
      const indices = [];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const p = curve.getPoint(t);
        const tangent = curve.getTangent(t);
        const side = new THREE.Vector3(tangent.z, 0, -tangent.x).normalize();
        const half = width * (0.85 + Math.sin(t * Math.PI) * 0.15);

        positions.push(p.x - side.x * half, 0.18, p.z - side.z * half);
        positions.push(p.x + side.x * half, 0.18, p.z + side.z * half);

        normals.push(0, 1, 0, 0, 1, 0);
        uvs.push(0, t * 8, 1, t * 8);

        if (i < segments) {
          const a = i * 2;
          indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
      geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
      geometry.setIndex(indices);
      geometry.computeBoundingSphere();

      const mesh = new THREE.Mesh(geometry, mat.road);
      mesh.receiveShadow = true;
      world.add(mesh);

      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const mark = new THREE.Mesh(
          new THREE.PlaneGeometry(0.6, Math.min(0.65, length * 0.13)),
          mat.yellow
        );
        mark.rotation.x = -Math.PI / 2;
        mark.rotation.z = Math.atan2(b[0] - a[0], b[1] - a[1]);
        mark.position.set((a[0] + b[0]) / 2, 0.205, (a[1] + b[1]) / 2);
        world.add(mark);
      }
    }

    makeRoad([
      [-12, 8], [-10, 3], [-6, -1], [1, -5], [5, -12], [-1, -20]
    ]);
    makeRoad([
      [-6, -1], [-2, -3], [5, -12], [10, -16], [15, -10]
    ], 1.7);
    makeRoad([
      [-1, -20], [-10, -25], [-19, -20]
    ], 1.7);
    makeRoad([
      [5, -12], [12, -8], [13, 17]
    ], 1.7);

    // -------------------------------------------------------------------------
    // Buildings and structures
    // -------------------------------------------------------------------------

    function addBuilding(x, z, w, d, h, color = mat.concrete, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, terrainHeight(x, z), z);
      group.rotation.y = rotation;

      const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), color);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(Math.max(w, d) * 0.72, 1.4, 4),
        mat.metal
      );
      roof.rotation.y = Math.PI / 4;
      roof.position.y = h + 0.65;
      roof.castShadow = true;
      group.add(roof);

      const windowMat = new THREE.MeshStandardMaterial({
        color: 0x173c48,
        emissive: 0x184b58,
        emissiveIntensity: 0.5,
        roughness: 0.25,
        metalness: 0.3
      });

      for (const side of [-1, 1]) {
        const wx = side * (w / 2 - 0.35);
        const wz = side * (d / 2 - 0.35);
        const win = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, 0.08), windowMat);
        win.position.set(wx, h * 0.55, wz);
        group.add(win);
      }

      world.add(group);
      return group;
    }

    addBuilding(-6, 5, 5.4, 4.2, 3.2, mat.concrete, 0.08);
    addBuilding(1, -17, 4.5, 3.8, 2.7, mat.concreteDark, -0.12);
    addBuilding(12, 1, 4.2, 3.2, 2.4, mat.metal, 0.2);
    addBuilding(-20, -15, 3.5, 2.8, 2.1, mat.concreteDark, 0.15);

    function addAntenna(x, z, height = 5) {
      const group = new THREE.Group();
      group.position.set(x, terrainHeight(x, z), z);

      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.11, height, 8), mat.metal);
      mast.position.y = height / 2;
      mast.castShadow = true;
      group.add(mast);

      const dish = new THREE.Mesh(
        new THREE.SphereGeometry(0.55, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
        mat.orange
      );
      dish.position.set(0.45, height * 0.7, 0);
      dish.rotation.z = -0.7;
      group.add(dish);

      world.add(group);
    }

    addAntenna(-11, -3, 6);
    addAntenna(9, -22, 5.5);
    addAntenna(21, 11, 4.5);

    function addTank(x, z, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, terrainHeight(x, z), z);
      group.rotation.y = rotation;

      const track = new THREE.Mesh(
        new THREE.BoxGeometry(2.1, 0.65, 3.2),
        mat.black
      );
      track.castShadow = true;
      group.add(track);

      const hull = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.1, 1.65), mat.metal);
      hull.position.y = 0.95;
      hull.castShadow = true;
      group.add(hull);

      const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.7, 12), mat.orange);
      turret.position.y = 1.95;
      turret.castShadow = true;
      group.add(turret);

      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 2.2, 12), mat.darkMetal);
      barrel.rotation.z = Math.PI / 2;
      barrel.position.set(0, 2.15, 0.9);
      barrel.castShadow = true;
      group.add(barrel);

      world.add(group);
    }

    addTank(-15, 10, -0.45);
    addTank(18, -20, 0.5);

    // -------------------------------------------------------------------------
    // Trees
    // -------------------------------------------------------------------------

    const treeTrunks = [];
    const treeCrowns = [];

    function addTree(x, z, scale = 1, light = false) {
      const y = terrainHeight(x, z);
      const group = new THREE.Group();
      group.position.set(x, y, z);
      group.scale.setScalar(scale);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.2, 2.1, 7),
        mat.metal
      );
      trunk.position.y = 1.05;
      trunk.castShadow = true;
      group.add(trunk);

      const crown = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.25, 1),
        light ? mat.treeLight : mat.tree
      );
      crown.position.y = 2.8;
      crown.scale.set(1, 1.15, 0.9);
      crown.castShadow = true;
      crown.receiveShadow = true;
      group.add(crown);

      world.add(group);
      treeCrowns.push({ mesh: crown, phase: Math.random() * Math.PI * 2, baseY: y });
    }

    function treeCluster(cx, cz, count) {
      for (let i = 0; i < count; i++) {
        const x = cx + (Math.random() - 0.5) * 8;
        const z = cz + (Math.random() - 0.5) * 8;
        addTree(x, z, 0.75 + Math.random() * 0.45, Math.random() > 0.55);
      }
    }

    treeCluster(-17, 14, 12);
    treeCluster(-27, 1, 10);
    treeCluster(-29, -12, 9);
    treeCluster(24, 18, 11);
    treeCluster(29, 3, 9);
    treeCluster(-2, 28, 10);
    treeCluster(19, 28, 8);

    // -------------------------------------------------------------------------
    // Mountain peaks
    // -------------------------------------------------------------------------

    function addMountain(x, z, scale = 1, high = false) {
      const group = new THREE.Group();
      group.position.set(x, terrainHeight(x, z) - 0.2, z);
      group.scale.setScalar(scale);

      const geometry = new THREE.ConeGeometry(5.5, 11, 7);
      const mountain = new THREE.Mesh(
        geometry,
        high ? mat.mountainHigh : mat.mountain
      );
      mountain.position.y = 5.5;
      mountain.rotation.y = Math.random() * Math.PI;
      mountain.castShadow = true;
      mountain.receiveShadow = true;
      group.add(mountain);

      if (high) {
        const cap = new THREE.Mesh(
          new THREE.ConeGeometry(3.4, 3.2, 7),
          mat.snow
        );
        cap.position.y = 10.2;
        cap.rotation.y = Math.random() * Math.PI;
        group.add(cap);
      }

      world.add(group);
    }

    addMountain(-31, -25, 1.15, true);
    addMountain(35, -29, 1.35, true);
    addMountain(39, 18, 1.05, false);
    addMountain(-38, 29, 0.9, false);
    addMountain(2, 39, 0.75, false);

    // -------------------------------------------------------------------------
    // Water
    // -------------------------------------------------------------------------

    const water = new THREE.Mesh(new THREE.PlaneGeometry(56, 34, 1, 1), mat.water);
    water.rotation.x = -Math.PI / 2;
    water.position.set(23, terrainHeight(23, 3) - 0.08, 3);
    water.receiveShadow = true;
    world.add(water);

    const shallowWater = new THREE.Mesh(new THREE.PlaneGeometry(24, 16, 1, 1), mat.waterShallow);
    shallowWater.rotation.x = -Math.PI / 2;
    shallowWater.position.set(15, terrainHeight(15, 5) - 0.065, 5);
    shallowWater.receiveShadow = true;
    world.add(shallowWater);

    // -------------------------------------------------------------------------
    // Military vehicles
    // -------------------------------------------------------------------------

    function addVehicle(x, z, color = mat.metal, rotation = 0) {
      const group = new THREE.Group();
      group.position.set(x, terrainHeight(x, z), z);
      group.rotation.y = rotation;

      const body = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.75, 4.2), color);
      body.position.y = 0.65;
      body.castShadow = true;
      group.add(body);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.75, 1.45), mat.darkMetal);
      cabin.position.set(0, 1.35, -0.15);
      cabin.castShadow = true;
      group.add(cabin);

      const wheelGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.25, 12);
      const wheelPositions = [
        [-1.05, 0.38, 1.2], [1.05, 0.38, 1.2],
        [-1.05, 0.38, -1.2], [1.05, 0.38, -1.2]
      ];

      for (const [wx, wy, wz] of wheelPositions) {
        const wheel = new THREE.Mesh(wheelGeometry, mat.black);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(wx, wy, wz);
        wheel.castShadow = true;
        group.add(wheel);
      }

      world.add(group);
    }

    addVehicle(-8, 10, mat.orange, 0.2);
    addVehicle(8, -13, mat.darkMetal, -0.3);
    addVehicle(23, 13, mat.metal, 0.8);

    // -------------------------------------------------------------------------
    // Flags, lights, and small details
    // -------------------------------------------------------------------------

    const flags = [];

    function addFlag(x, z, color = mat.orange) {
      const group = new THREE.Group();
      group.position.set(x, terrainHeight(x, z), z);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 4.2, 8), mat.metal);
      pole.position.y = 2.1;
      pole.castShadow = true;
      group.add(pole);

      const flag = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 0.8, 4, 2),
        color
      );
      flag.position.set(0.8, 4.05, 0);
      flag.castShadow = true;
      group.add(flag);

      world.add(group);
      flags.push({ mesh: flag, phase: Math.random() * Math.PI * 2 });
    }

    addFlag(-10, 11);
    addFlag(15, -19, mat.yellow);
    addFlag(25, 20, mat.red);

    const beaconLights = [];

    function addBeacon(x, z, color = 0xffa23d) {
      const y = terrainHeight(x, z);
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 12, 8),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 1.5,
          roughness: 0.35
        })
      );
      light.position.set(x, y + 1.1, z);
      world.add(light);
      beaconLights.push(light);
    }

    addBeacon(-10, 11);
    addBeacon(15, -19, 0x75e6df);
    addBeacon(25, 20, 0xff6845);

    // Small crates and supply barrels.
    function addCrate(x, z, color = mat.orange) {
      const y = terrainHeight(x, z);
      const crate = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.65, 0.8), color);
      crate.position.set(x, y + 0.33, z);
      crate.castShadow = true;
      crate.receiveShadow = true;
      world.add(crate);
    }

    for (let i = 0; i < 12; i++) {
      addCrate(-14 + i * 0.65, 12, i % 3 === 0 ? mat.yellow : mat.orange);
    }

    for (let i = 0; i < 5; i++) {
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32, 0.32, 0.8, 12),
        mat.darkMetal
      );
      barrel.position.set(19 + i * 0.55, terrainHeight(19 + i * 0.55, 17) + 0.4, 17);
      barrel.castShadow = true;
      world.add(barrel);
    }

    // -------------------------------------------------------------------------
    // Atmospheric particles
    // -------------------------------------------------------------------------

    const particleCount = 700;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 110;
      particlePositions[i * 3 + 1] = 0.5 + Math.random() * 35;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 110;

      const c = new THREE.Color().setHSL(
        0.52 + Math.random() * 0.08,
        0.15,
        0.62 + Math.random() * 0.25
      );
      particleColors[i * 3] = c.r;
      particleColors[i * 3 + 1] = c.g;
      particleColors[i * 3 + 2] = c.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        sizeAttenuation: true
      })
    );
    world.add(particles);

    // -------------------------------------------------------------------------
    // Camera controls: custom orbit with pointer and touch
    // -------------------------------------------------------------------------

    const controls = {
      target: new THREE.Vector3(-2, 0, -3),
      yaw: 0.72,
      pitch: 0.58,
      distance: 42,
      dragging: false,
      pointerX: 0,
      pointerY: 0,
      lastX: 0,
      lastY: 0
    };

    function updateCamera() {
      const horizontal = Math.cos(controls.pitch) * controls.distance;
      camera.position.set(
        controls.target.x + Math.sin(controls.yaw) * horizontal,
        controls.target.y + Math.sin(controls.pitch) * controls.distance,
        controls.target.z - Math.cos(controls.yaw) * horizontal
      );
      camera.lookAt(controls.target);
    }

    renderer.domElement.addEventListener("pointerdown", event => {
      controls.dragging = true;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!controls.dragging) return;

      const dx = event.clientX - controls.lastX;
      const dy = event.clientY - controls.lastY;
      controls.lastX = event.clientX;
      controls.lastY = event.clientY;

      controls.yaw -= dx * 0.006;
      controls.pitch = THREE.MathUtils.clamp(
        controls.pitch + dy * 0.0045,
        0.12,
        1.42
      );

      updateCamera();
    });

    function endDrag(event) {
      controls.dragging = false;
      renderer.domElement.style.cursor = "grab";
      if (event && renderer.domElement.hasPointerCapture(event.pointerId)) {
        renderer.domElement.releasePointerCapture(event.pointerId);
      }
    }

    renderer.domElement.addEventListener("pointerup", endDrag);
    renderer.domElement.addEventListener("pointercancel", endDrag);
    renderer.domElement.style.cursor = "grab";

    renderer.domElement.addEventListener("wheel", event => {
      event.preventDefault();
      controls.distance = THREE.MathUtils.clamp(
        controls.distance + event.deltaY * 0.025,
        16,
        82
      );
      updateCamera();
    }, { passive: false });

    // Pinch zoom for touch devices.
    const activePointers = new Map();
    let pinchDistance = 0;

    renderer.domElement.addEventListener("pointerdown", event => {
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      if (activePointers.size === 2) {
        const points = [...activePointers.values()];
        pinchDistance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
      }
    });

    renderer.domElement.addEventListener("pointermove", event => {
      if (!activePointers.has(event.pointerId)) return;

      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      if (activePointers.size === 2) {
        const points = [...activePointers.values()];
        const distance = Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);

        if (pinchDistance > 0) {
          controls.distance = THREE.MathUtils.clamp(
            controls.distance + (pinchDistance - distance) * 0.035,
            16,
            82
          );
          updateCamera();
        }

        pinchDistance = distance;
      }
    });

    function removePointer(event) {
      activePointers.delete(event.pointerId);
      if (activePointers.size < 2) pinchDistance = 0;
    }

    renderer.domElement.addEventListener("pointerup", removePointer);
    renderer.domElement.addEventListener("pointercancel", removePointer);

    updateCamera();

    // -------------------------------------------------------------------------
    // Animation
    // -------------------------------------------------------------------------

    const clock = new THREE.Clock();

    function animate() {
    /* [SHIELD] */
    requestAnimationFrame(animate);
    try {

      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      for (const crown of treeCrowns) {
        crown.mesh.rotation.z = Math.sin(elapsed * 0.7 + crown.phase) * 0.025;
      }

      for (const flag of flags) {
        flag.mesh.rotation.y = Math.sin(elapsed * 1.4 + flag.phase) * 0.08;
        flag.mesh.rotation.z = Math.sin(elapsed * 2.1 + flag.phase) * 0.035;
      }

      for (let i = 0; i < beaconLights.length; i++) {
        const material = beaconLights[i].material;
        material.emissiveIntensity = 1.1 + Math.max(0, Math.sin(elapsed * 2.2 + i)) * 1.2;
      }

      particles.rotation.y = elapsed * 0.008;
      particles.position.y = Math.sin(elapsed * 0.16) * 0.3;

      
    } catch (e) {
      console.warn('Animation tick suppressed:', e.message);
    }
    renderer.render(scene, camera);
    }

    animate();

    addEventListener("resize", () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    });

    requestAnimationFrame(() => {
      document.getElementById("loading").classList.add("hidden");
      setTimeout(() => document.getElementById("loading").remove(), 600);
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
    spawn: { x: -2.0, z: 11.0, yaw: 0 },
    relic: { name: "Bionic Commando Relic", x: -12.0, z: -15.0 },
    env:   { background: 0x07141c, fogColor: 0x0b202a, fogDensity: 0.018 },
    doors: {
      next: { x: 10.0, z: -13.0 },
      prev: { x: -14.0, z: 7.0 }
    }
  };
}
