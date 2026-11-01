// @world {"id": "019", "title": "Blaster Master", "sub": "Area 1 Underworld", "system": "NES"}
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

    renderer = dummyRenderer();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (renderer.domElement && renderer.domElement.nodeType === 1) document.body.appendChild(renderer.domElement); // Back Roms fix: dummy renderer has no real canvas to attach

    // scene redirect
    scene.background = new THREE.Color(0x050911);
    scene.fog = new THREE.FogExp2(0x071019, 0.026);

    camera = dummyCamera();

    const clock = new THREE.Clock();

    // -------------------------------------------------------------------------
    // Materials
    // -------------------------------------------------------------------------

    const materials = {
      wall: new THREE.MeshStandardMaterial({
        color: 0x18212b,
        roughness: 0.84,
        metalness: 0.38
      }),
      wallDark: new THREE.MeshStandardMaterial({
        color: 0x0b1119,
        roughness: 0.9,
        metalness: 0.25
      }),
      floor: new THREE.MeshStandardMaterial({
        color: 0x111923,
        roughness: 0.7,
        metalness: 0.55
      }),
      floorGrid: new THREE.MeshStandardMaterial({
        color: 0x273440,
        roughness: 0.55,
        metalness: 0.65
      }),
      cyan: new THREE.MeshStandardMaterial({
        color: 0x66eef7,
        emissive: 0x168ba3,
        emissiveIntensity: 2.4,
        roughness: 0.35,
        metalness: 0.2
      }),
      amber: new THREE.MeshStandardMaterial({
        color: 0xffb83d,
        emissive: 0x8a3d00,
        emissiveIntensity: 1.8,
        roughness: 0.4,
        metalness: 0.25
      }),
      red: new THREE.MeshStandardMaterial({
        color: 0xff3c3c,
        emissive: 0x7a0000,
        emissiveIntensity: 2.1,
        roughness: 0.45,
        metalness: 0.2
      }),
      black: new THREE.MeshStandardMaterial({
        color: 0x05070a,
        roughness: 0.75,
        metalness: 0.35
      }),
      white: new THREE.MeshStandardMaterial({
        color: 0xdcecf1,
        roughness: 0.5,
        metalness: 0.1
      }),
      gunMetal: new THREE.MeshStandardMaterial({
        color: 0x26333d,
        roughness: 0.35,
        metalness: 0.75
      }),
      orange: new THREE.MeshStandardMaterial({
        color: 0xe97524,
        roughness: 0.45,
        metalness: 0.45
      })
    };

    // -------------------------------------------------------------------------
    // Lighting
    // -------------------------------------------------------------------------

    scene.add(new THREE.HemisphereLight(0x8bc9df, 0x101018, 1.15));

    const ambient = new THREE.AmbientLight(0x6c8ca0, 0.5);
    scene.add(ambient);

    const cyanLight = new THREE.PointLight(0x49d8ef, 24, 18, 2);
    cyanLight.position.set(-4, 4, 3);
    scene.add(cyanLight);

    const amberLight = new THREE.PointLight(0xffa62c, 18, 14, 2);
    amberLight.position.set(5, 2, -3);
    scene.add(amberLight);

    const bossLight = new THREE.PointLight(0xff4d4d, 20, 16, 2);
    bossLight.position.set(3, 3, 5);
    scene.add(bossLight);

    // -------------------------------------------------------------------------
    // Geometry helpers
    // -------------------------------------------------------------------------

    function box(w, h, d, material, x = 0, y = 0, z = 0, parent = scene) {
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

    function cylinder(radius, height, material, x, y, z, parent = scene, radialSegments = 12) {
      const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius, height, radialSegments),
        material
      );
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    }

    function beamBetween(a, b, radius, material, parent = scene) {
      const direction = new THREE.Vector3().subVectors(b, a);
      const midpoint = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      const mesh = cylinder(radius, direction.length(), material, 0, 0, 0, parent);
      mesh.position.copy(midpoint);
      mesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.clone().normalize()
      );
      return mesh;
    }

    function makeGlow(material, intensity = 1) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
      mat.add(new THREE.AdditiveBlending());
      return mat;
    }

    // -------------------------------------------------------------------------
    // Level layout
    // -------------------------------------------------------------------------

    const level = new THREE.Group();
    scene.add(level);

    // Current chamber: a long, sloped corridor from the lake to the boss.
    const corridor = new THREE.Group();
    corridor.position.set(0, 0.1, 0);
    level.add(corridor);

    // Main floor.
    box(14, 0.35, 28, materials.floor, 0, 0, 0, corridor);

    // Floor grid.
    for (let z = -12; z <= 12; z += 2) {
      box(13.6, 0.025, 0.035, materials.floorGrid, 0, 0.19, z, corridor);
    }
    for (let x = -6; x <= 6; x += 1.5) {
      box(0.035, 0.025, 27.5, materials.floorGrid, x, 0.19, 0, corridor);
    }

    // Side walls.
    box(0.45, 5.5, 28, materials.wall, -6.7, 2.75, 0, corridor);
    box(0.45, 5.5, 28, materials.wall, 6.7, 2.75, 0, corridor);

    // Wall panels and structural ribs.
    for (let z = -13; z <= 13; z += 2.5) {
      box(0.18, 4.8, 0.22, materials.wallDark, -6.42, 2.7, z, corridor);
      box(0.18, 4.8, 0.22, materials.wallDark, 6.42, 2.7, z, corridor);

      box(0.12, 0.12, 1.4, materials.cyan, -6.3, 1.1, z, corridor);
      box(0.12, 0.12, 1.4, materials.cyan, 6.3, 1.1, z, corridor);
    }

    // Ceiling ribs.
    for (let z = -12; z <= 12; z += 4) {
      box(13.7, 0.18, 0.25, materials.wallDark, 0, 5.15, z, corridor);
    }

    // Ceiling light strips.
    for (let z = -10; z <= 10; z += 5) {
      box(0.12, 0.1, 2.2, materials.cyan, 0, 4.96, z, corridor);
    }

    // Upper walkway / ladder platform.
    box(3.1, 0.35, 7.5, materials.wallDark, 0, 3.2, -8.5, corridor);

    // Ladder rails.
    for (const x of [-1.15, 1.15]) {
      box(0.12, 4.3, 0.12, materials.orange, x, 5.15, -8.5, corridor);
    }

    // Ladder rungs.
    for (let i = 0; i < 13; i++) {
      box(2.45, 0.08, 0.08, materials.orange, 0, 3.55 + i * 0.31, -8.5, corridor);
    }

    // Upper observation ledge.
    box(12.8, 0.28, 1.3, materials.wallDark, 0, 4.05, -12.2, corridor);

    // Boss chamber at the end.
    const bossRoom = new THREE.Group();
    bossRoom.position.set(0, 0, 14);
    level.add(bossRoom);

    box(11.5, 0.35, 9, materials.floor, 0, 0.15, 0, bossRoom);
    box(0.5, 5.5, 9, materials.wall, -5.6, 2.75, 0, bossRoom);
    box(0.5, 5.5, 9, materials.wall, 5.6, 2.75, 0, bossRoom);
    box(11.5, 0.2, 0.5, materials.wall, 0, 5.1, 0, bossRoom);

    // Boss chamber arch and warning lights.
    for (const x of [-4.8, 4.8]) {
      box(0.28, 4.2, 0.35, materials.red, x, 2.1, 3.7, bossRoom);
      box(0.28, 4.2, 0.35, materials.red, x, 2.1, -3.7, bossRoom);
    }
    box(10.2, 0.3, 0.35, materials.red, 0, 4.15, 3.7, bossRoom);

    // Boss doorway.
    box(4.4, 4.1, 0.35, materials.black, 0, 2.05, 4.35, bossRoom);
    box(4.8, 0.2, 0.5, materials.red, 0, 4.15, 4.45, bossRoom);

    // Boss arena floor.
    box(7.4, 0.18, 5.4, materials.black, 0, 0.38, 0, bossRoom);
    for (const x of [-3.4, 3.4]) {
      for (const z of [-2.2, 2.2]) {
        cylinder(0.08, 0.12, materials.red, x, 0.5, z, bossRoom);
      }
    }

    // -------------------------------------------------------------------------
    // Security machines
    // -------------------------------------------------------------------------

    const securityMachines = [];
    const movingSecurity = [];

    function createSecurityMachine(x, z, side, type = "walker") {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      level.add(group);

      const body = new THREE.Group();
      group.add(body);

      if (type === "walker") {
        box(1.15, 0.75, 0.7, materials.gunMetal, 0, 0.85, 0, body);
        box(0.9, 0.28, 0.78, materials.black, 0, 1.25, 0, body);
        box(0.34, 0.55, 0.34, materials.orange, 0, 1.65, 0, body);
        box(0.48, 0.12, 0.18, materials.cyan, 0, 1.42, 0.05, body);
      } else {
        // Wall turret.
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.42, 0.52, 0.45, 12),
          materials.gunMetal
        );
        base.position.y = 0.7;
        body.add(base);

        const turret = new THREE.Mesh(
          new THREE.CylinderGeometry(0.28, 0.38, 0.75, 12),
          materials.orange
        );
        turret.rotation.z = side > 0 ? -0.25 : 0.25;
        turret.position.set(side * 0.35, 1.35, 0);
        body.add(turret);

        const barrel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.18, 1.1, 10),
          materials.gunMetal
        );
        barrel.rotation.z = side > 0 ? -0.95 : 0.95;
        barrel.position.set(side * 0.9, 1.35, 0);
        body.add(barrel);

        const lens = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 12, 8),
          materials.cyan
        );
        lens.scale.set(0.55, 0.65, 0.45);
        lens.position.set(side * 1.48, 1.35, 0);
        body.add(lens);
      }

      const scan = new THREE.Mesh(
        new THREE.SphereGeometry(1.25, 16, 8),
        new THREE.MeshBasicMaterial({
          color: 0x5be9f2,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      scan.scale.y = 0.18;
      body.add(scan);

      group.userData = {
        side,
        type,
        scan,
        body,
        originX: x,
        originZ: z,
        start: performance.now()
      };

      securityMachines.push(group);

      if (type === "walker") {
        movingSecurity.push({
          object: group,
          direction: side > 0 ? 1 : -1,
          lane: side > 0 ? 2.8 : -2.8,
          speed: 0.75 + Math.random() * 0.35
        });
      } else {
        movingSecurity.push({
          object: group,
          direction: side > 0 ? 1 : -1,
          speed: 0.48 + Math.random() * 0.25
        });
      }

      return group;
    }

    // Left wall turrets face the corridor.
    createSecurityMachine(-6.15, -4.2, -1, "turret");
    createSecurityMachine(-6.15, 3.6, -1, "turret");

    // Right wall turrets face the corridor.
    createSecurityMachine(6.15, -7.4, 1, "turret");
    createSecurityMachine(6.15, 8.7, 1, "turret");

    // Mobile interceptors.
    createSecurityMachine(-2.7, -2.4, -1, "walker");
    createSecurityMachine(3.2, 5.8, 1, "walker");

    // -------------------------------------------------------------------------
    // Maze in the next room
    // -------------------------------------------------------------------------

    const mazeRoom = new THREE.Group();
    mazeRoom.position.set(0, 0, 25);
    level.add(mazeRoom);

    box(11, 0.35, 11, materials.floor, 0, 0.15, 0, mazeRoom);

    // Maze walls generated from a simple grid.
    const mazeCells = [
      [0, 0, 1],
      [1, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
      [0, 2, 1],
      [1, 2, 0],
      [1, 3, 1],
      [0, 3, 0],
      [1, 4, 1],
      [0, 4, 0],
      [0, 5, 1],
      [1, 5, 0],
      [1, 6, 1],
      [0, 6, 0],
      [1, 7, 1],
      [0, 7, 0],
      [0, 8, 1],
      [1, 8, 0],
      [1, 9, 1],
      [0, 9, 0]
    ];

    for (let row = 0; row < mazeCells.length; row++) {
      const [x, z, wall] = mazeCells[row];
      const cell = new THREE.Group();
      cell.position.set(x, 0, z);
      mazeRoom.add(cell);

      box(1.05, 2.2, 1.05, materials.wall, 0, 1.1, 0, cell);

      if (wall === 1) {
        box(0.16, 1.75, 0.16, materials.wallDark, 0.5, 1.05, 0, cell);
        box(0.16, 1.75, 0.16, materials.wallDark, -0.5, 1.05, 0, cell);
      } else {
        box(0.16, 1.75, 0.16, materials.wallDark, 0.5, 1.05, 0, cell);
        box(0.16, 1.75, 0.16, materials.wallDark, -0.5, 1.05, 0, cell);
      }
    }

    // Passage on the right.
    box(0.22, 3.2, 5.5, materials.wallDark, 5.2, 1.6, 2.1, mazeRoom);
    box(0.16, 2.7, 4.8, materials.cyan, 5.34, 1.45, 2.1, mazeRoom);

    // Passage floor.
    box(1.05, 0.08, 5.2, materials.floorGrid, 5.25, 0.37, 2.1, mazeRoom);

    // Room pillars and ceiling.
    for (const x of [-5.2, 5.2]) {
      for (const z of [-4.8, 4.8]) {
        box(0.45, 4.3, 0.45, materials.wallDark, x, 2.15, z, mazeRoom);
      }
    }
    box(11, 0.25, 11, materials.wallDark, 0, 4.35, 0, mazeRoom);

    // -------------------------------------------------------------------------
    // Boss: Chlameatle
    // -------------------------------------------------------------------------

    const boss = new THREE.Group();
    boss.position.set(0, 0.4, 1.1);
    bossRoom.add(boss);

    // Low, bulky chameleon-like robot.
    const bossBody = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 20, 12),
      new THREE.MeshStandardMaterial({
        color: 0x5b2416,
        emissive: 0x3b0800,
        emissiveIntensity: 0.75,
        roughness: 0.45,
        metalness: 0.5
      })
    );
    bossBody.scale.set(1.25, 0.72, 1.05);
    bossBody.position.y = 1.05;
    boss.add(bossBody);

    const bossHead = new THREE.Mesh(
      new THREE.SphereGeometry(0.72, 16, 10),
      materials.orange
    );
    bossHead.position.set(0, 1.75, 0.15);
    boss.add(bossHead);

    const bossEyeLeft = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 12, 8),
      materials.red
    );
    bossEyeLeft.position.set(-0.25, 1.9, 0.72);
    boss.add(bossEyeLeft);

    const bossEyeRight = bossEyeLeft.clone();
    bossEyeRight.position.x = 0.25;
    boss.add(bossEyeRight);

    // Arms.
    const bossArmLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.28, 1.2, 10),
      materials.orange
    );
    bossArmLeft.rotation.z = -0.75;
    bossArmLeft.position.set(-1.05, 1.1, 0);
    boss.add(bossArmLeft);

    const bossArmRight = bossArmLeft.clone();
    bossArmRight.rotation.z = 0.75;
    boss.add(bossArmRight);

    // Horns / antennas.
    for (const x of [-0.45, 0.45]) {
      const horn = new THREE.Mesh(
        new THREE.ConeGeometry(0.16, 0.85, 8),
        materials.red
      );
      horn.position.set(x, 2.45, 0.1);
      horn.rotation.z = x < 0 ? -0.35 : 0.35;
      boss.add(horn);

      const antenna = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 1.1, 6),
        materials.cyan
      );
      antenna.position.set(-x * 0.65, 2.65, -0.4);
      boss.add(antenna);
    }

    // Boss aura.
    const bossAura = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 24, 12),
      new THREE.MeshBasicMaterial({
        color: 0xff3344,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    bossAura.scale.y = 0.45;
    boss.add(bossAura);

    // Boss attack particles.
    const bossParticles = [];
    const particleMaterial = new THREE.MeshBasicMaterial({
      color: 0xff5555,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    for (let i = 0; i < 12; i++) {
      const particle = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + Math.random() * 0.12, 6, 4),
        particleMaterial
      );
      boss.add(particle);
      bossParticles.push({
        object: particle,
        start: performance.now() + Math.random() * 1500,
        phase: Math.random() * Math.PI * 2
      });
    }

    // -------------------------------------------------------------------------
    // Small tracking robots
    // -------------------------------------------------------------------------

    const trackerRobots = [];

    function createTrackerRobot(x, z, color = 0x86d9ff) {
      const group = new THREE.Group();
      group.position.set(x, 0.35, z);
      level.add(group);

      const bodyMaterial = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.45,
        roughness: 0.35,
        metalness: 0.55
      });

      const body = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 12, 8),
        bodyMaterial
      );
      body.scale.set(1, 0.7, 1.25);
      group.add(body);

      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.085, 8, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      eye.position.set(0, 0.12, 0.37);
      group.add(eye);

      const arm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.07, 0.09, 0.55, 8),
        materials.gunMetal
      );
      arm.rotation.x = Math.PI / 2;
      arm.position.set(0.32, 0.05, 0);
      group.add(arm);

      group.userData = {
        x,
        z,
        start: performance.now(),
        phase: Math.random() * Math.PI * 2
      };

      trackerRobots.push(group);
      return group;
    }

    createTrackerRobot(-3.6, 22, 0x7bdfff);
    createTrackerRobot(4.1, 27, 0xffc25c);
    createTrackerRobot(-4.8, 29, 0x8a7dff);

    // -------------------------------------------------------------------------
    // Environmental details
    // -------------------------------------------------------------------------

    // Hanging lights.
    for (const z of [-10, -4, 2, 8]) {
      const light = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 10, 6),
        materials.amber
      );
      light.position.set(0, 4.55, z);
      level.add(light);

      beamBetween(
        new THREE.Vector3(0, 5.1, z),
        new THREE.Vector3(0, 4.7, z),
        0.025,
        materials.black
      );
    }

    // Wall conduits.
    for (const z of [-11, -6, -1, 4, 9, 14]) {
      box(0.12, 4.4, 0.12, materials.gunMetal, -6.35, 2.6, z, corridor);
      box(0.12, 4.4, 0.12, materials.gunMetal, 6.35, 2.6, z, corridor);
    }

    // Suspended cables.
    for (let i = 0; i < 4; i++) {
      const cable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.025, 3.5, 6),
        materials.black
      );
      cable.position.set(-4.8 + i * 1.2, 3.9, 18);
      level.add(cable);
    }

    // -------------------------------------------------------------------------
    // Animated elements
    // -------------------------------------------------------------------------

    const animated = [];
    const clockForAnimations = new THREE.Clock();

    function registerAnimation(object, type, parameters) {
      animated.push({ object, type, parameters });
    }

    for (const machine of securityMachines) {
      registerAnimation(machine, "scan", {
        baseOpacity: Math.random() * 0.25,
        speed: 0.45 + Math.random() * 0.4
      });
    }

    registerAnimation(bossAura, "aura", {
      baseOpacity: 0.06,
      speed: 1.2
    });

    for (const particle of bossParticles) {
      registerAnimation(particle.object, "particle", {
        phase: particle.phase,
        speed: 0.75
      });
    }

    function animateAnimations(time) {
      for (const item of animated) {
        if (item.type === "scan") {
          const machine = item.object;
          const machineData = machine.userData;
          const cycle = (time + 1800) % 1800;
          machineData.scan.material.opacity =
            machineData.baseOpacity * (0.55 + 0.45 * Math.sin(cycle * item.parameters.speed));
          machineData.scan.scale.x = 1.05 + Math.sin(cycle * 0.001) * 0.08;
        }

        if (item.type === "aura") {
          const boss = item.object;
          const pulse = 0.05 + 0.055 * Math.sin(time * 0.0015 + item.parameters.speed);
          bossAura.material.opacity = pulse;
          bossAura.scale.setScalar(1 + Math.sin(time * 0.001) * 0.08);
        }

        if (item.type === "particle") {
          const particle = item.object;
          const age = (time - particle.start) / 1000;
          const angle = time * 0.0018 + particle.phase;
          particle.position.set(
            Math.sin(angle) * age * 2.2,
            2.2 + age * 1.1,
            Math.cos(angle) * age * 1.4
          );
          particle.scale.setScalar(0.8 + age * 2.2);
          particle.material.opacity = Math.max(0, 0.85 - age * 0.65);
        }
      }
    }

    // -------------------------------------------------------------------------
    // Custom orbit camera controls
    // -------------------------------------------------------------------------

    const cameraState = {
      target: new THREE.Vector3(0, 2.2, 0),
      radius: 16.5,
      theta: 0.48,
      phi: 1.18,
      minRadius: 5.5,
      maxRadius: 28,
      minPhi: 0.35,
      maxPhi: 1.48
    };

    const initialCamera = {
      target: cameraState.target.clone(),
      radius: cameraState.radius,
      theta: cameraState.theta,
      phi: cameraState.phi
    };

    function updateCamera() {
      const sinPhi = Math.sin(cameraState.phi);
      camera.position.set(
        cameraState.target.x + cameraState.radius * sinPhi * Math.sin(cameraState.theta),
        cameraState.target.y + cameraState.radius * Math.cos(cameraState.phi),
        cameraState.target.z + cameraState.radius * sinPhi * Math.cos(cameraState.theta)
      );
      camera.lookAt(cameraState.target);
    }

    updateCamera();

    let dragging = false;
    let previousPointer = { x: 0, y: 0 };
    let touchPointer = null;
    let lastPointer = { x: 0, y: 0 };

    renderer.domElement.addEventListener("pointerdown", (event) => {
      dragging = true;
      touchPointer = event.pointerId;
      previousPointer = { x: event.clientX, y: event.clientY };
      lastPointer = { x: event.clientX, y: event.clientY };
      renderer.domElement.setPointerCapture(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
      if (!dragging || event.pointerId !== touchPointer) return;

      const dx = event.clientX - lastPointer.x;
      const dy = event.clientY - lastPointer.y;
      lastPointer = { x: event.clientX, y: event.clientY };

      cameraState.theta -= dx * 0.006;
      cameraState.phi = THREE.MathUtils.clamp(
        cameraState.phi - dy * 0.005,
        cameraState.minPhi,
        cameraState.maxPhi
      );

      updateCamera();
    });

    function endPointer(event) {
      if (event.pointerId !== touchPointer) return;
      dragging = false;
      touchPointer = null;
      renderer.domElement.style.cursor = "grab";
    }

    renderer.domElement.addEventListener("pointerup", endPointer);
    renderer.domElement.addEventListener("pointercancel", endPointer);
    renderer.domElement.style.cursor = "grab";

    // Pinch zoom.
    const activePointers = new Map();
    let pinchDistance = 0;

    renderer.domElement.addEventListener("pointerdown", (event) => {
      activePointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY
      });

      if (activePointers.size === 2) {
        const points = [...activePointers.values()];
        pinchDistance = Math.hypot(
          points[0].x - points[1].x,
          points[0].y - points[1].y
        );
      }
    });

    renderer.domElement.addEventListener("pointermove", (event) => {
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

        if (pinchDistance > 0) {
          cameraState.radius = THREE.MathUtils.clamp(
            cameraState.radius * (pinchDistance / Math.max(distance, 1)),
            cameraState.minRadius,
            cameraState.maxRadius
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

    // -------------------------------------------------------------------------
    // Interaction: mouse and touch gun controls
    // -------------------------------------------------------------------------

    const gun = new THREE.Group();
    gun.position.set(0.28, 0.85, 0.05);
    gun.rotation.z = -0.18;
    scene.add(gun);

    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.18, 1.15, 12),
      materials.gunMetal
    );
    barrel.rotation.x = Math.PI / 2;
    barrel.position.x = 0.48;
    gun.add(barrel);

    const grip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.2, 0.35, 12),
      materials.orange
    );
    grip.rotation.x = Math.PI / 2;
    grip.position.x = 0.2;
    gun.add(grip);

    const scope = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.24, 12),
      materials.black
    );
    scope.rotation.x = Math.PI / 2;
    scope.position.set(0.72, 0.1, 0);
    gun.add(scope);

    const muzzle = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 12, 8),
      materials.cyan
    );
    muzzle.scale.set(1, 0.75, 0.55);
    muzzle.position.x = 1.36;
    gun.add(muzzle);

    // Simple raycast-based shooting.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const gunBurst = [];

    let lastGunClick = 0;
    let bullets = [];

    function createBullets() {
      for (let i = 0; i < 5; i++) {
        const bullet = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 6, 4),
          new THREE.MeshBasicMaterial({ color: 0xffe6a3 })
        );
        scene.add(bullet);

        gunBurst.push({
          object: bullet,
          start: performance.now(),
          phase: i / 5 * Math.PI * 2
        });
      }
    }

    renderer.domElement.addEventListener("click", (event) => {
      if (performance.now() - lastGunClick < 250) return;
      lastGunClick = performance.now();

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(trackerRobots, false);
      if (hits.length) {
        const hit = hits[0].object;
        hit.position.x += 0.8;
        hit.position.z += 0.5;
        hit.rotation.y += 1;
      }

      createBullets();
    });

    // -------------------------------------------------------------------------
    // Animation loop
    // -------------------------------------------------------------------------

    function animate() {
    /* [SHIELD] */
    requestAnimationFrame(animate);
    try {

      requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      clockForAnimations.update();

      animateAnimations(time);

      // Security machine patrol.
      for (const item of movingSecurity) {
        const machine = item.object;
        const data = machine.userData;
        const travel = Math.sin(time * item.speed + data.start * 0.001) * 4.2;
        machine.position.x = data.originX + data.direction * travel;
        machine.position.z = data.originZ + Math.sin(time * item.speed * 0.7 + data.phase) * 0.25;
        machine.rotation.y = data.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
      }

      // Boss movement and attack cycles.
      boss.position.x = Math.sin(time * 0.55) * 0.28;
      boss.rotation.y = Math.sin(time * 0.35) * 0.18;
      bossBody.rotation.y = Math.sin(time * 0.45) * 0.12;

      const bossPulse = time * 0.001;
      bossAura.material.opacity = 0.045 + Math.sin(bossPulse) * 0.035;

      // Boss particle bursts.
      for (const particle of bossParticles) {
        if (time - particle.start > 7) {
          particle.object.visible = false;
        } else {
          particle.object.visible = true;
          const age = (time - particle.start) / 1000;
          const angle = time * 0.0022 + particle.phase;
          particle.object.position.set(
            Math.sin(angle) * age * 2.1,
            2.1 + age * 1.05,
            Math.cos(angle) * age * 1.35
          );
          particle.object.scale.setScalar(0.8 + age * 2.1);
          particle.object.material.opacity = Math.max(0, 0.85 - age * 0.65);
        }
      }

      // Tracker robots follow Jason and then attack.
      for (const robot of trackerRobots) {
        const data = robot.userData;
        const t = performance.now();
        const angle = t * 0.19 + data.phase;
        const distance = 2.8 + Math.sin(t * 0.08 + data.phase) * 0.7;

        robot.position.x += Math.cos(angle) * 0.0016;
        robot.position.z += Math.sin(angle) * 0.0016;
        robot.rotation.y = -angle;

        if (t > data.start + 4500) {
          robot.rotation.y += 0.12;
        }
      }

      // Small environmental movement.
      for (const item of animated) {
        if (item.type === "scan") {
          const machine = item.object;
          const machineData = machine.userData;
          const cycle = (time + 1800) % 1800;
          machineData.scan.material.opacity =
            machineData.baseOpacity * (0.55 + 0.45 * Math.sin(cycle * item.parameters.speed));
          machineData.scan.scale.x = 1.05 + Math.sin(cycle * 0.001) * 0.08;
        }

        if (item.type === "aura") {
          const boss = item.object;
          const pulse = 0.05 + 0.055 * Math.sin(time * 0.0015 + item.parameters.speed);
          bossAura.material.opacity = pulse;
          bossAura.scale.setScalar(1 + Math.sin(time * 0.001) * 0.08);
        }

        if (item.type === "particle") {
          const particle = item.object;
          const age = (time - particle.start) / 1000;
          const angle = time * 0.0018 + particle.phase;
          particle.position.set(
            Math.sin(angle) * age * 2.2,
            2.2 + age * 1.1,
            Math.cos(angle) * age * 1.4
          );
          particle.scale.setScalar(0.8 + age * 2.2);
          particle.material.opacity = Math.max(0, 0.85 - age * 0.65);
        }
      }

      
    } catch (e) {
      console.warn('Animation tick suppressed:', e.message);
    }
    renderer.render(scene, camera);
    }

    animate();

    // -------------------------------------------------------------------------
    // Resize
    // -------------------------------------------------------------------------

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Remove loader after the first rendered frame.
    requestAnimationFrame(() => {
      const loading = document.getElementById("loading");
      loading?.classList.add("hidden");
      setTimeout(() => loading?.remove(), 900);
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
    relic: { name: "Blaster Master Relic", x: -10.0, z: -12.0 },
    env:   { background: 0x050911, fogColor: 0x071019, fogDensity: 0.026 },
    doors: {
      next: { x: 12.0, z: -10.0 },
      prev: { x: -12.0, z: 10.0 }
    }
  };
}
