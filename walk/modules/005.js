// ============================================================================
// @world {"id":"005","title":"RIVER RAID","sub":"Canyon Riverway","system":"Atari 2600"}
// World 005 — RIVER RAID · Canyon Riverway (Atari 2600)
// Converted from scenes/005_river_raid_canyon_riverway.html into a World
// Walker module. The original added its content directly to the scene (no
// world group); the conversion creates the group and adds everything to it.
// Geometry/materials/lights and the animated water shader preserved;
// renderer/orbit camera/HUD removed; per-frame animation moved to update().
//
// Conversion notes:
//  * makeNoiseTexture() read renderer.capabilities for anisotropy; the
//    module uses a fixed anisotropy of 4 instead.
//  * The duplicate `black` key in the original material table is kept once
//    (identical values).
//  * The sky dome (radius 100, BackSide) is part of the group; the host
//    camera far plane accommodates it.
//
// Door choices (the river runs north–south through the canyon):
//   next — the north end of the river run, mesas ahead: door at (0, -33).
//   prev — the south end of the river run: door at (0, 37).
// Spawn: east bank of the river at the south end, facing up-canyon.
// Relic: Ace's Medal lies in the open desert on the WEST bank at
//        (-22, -26), mid-canyon — across the river from the spawn bank
//        and far from both river-end doors.
// ============================================================================

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();
  const scene = group; // original code adds everything to "scene"

  // -------------------------------------------------------------------------
  // Lighting
  // -------------------------------------------------------------------------
  scene.add(new THREE.HemisphereLight(0xffd7a0, 0x4e392d, 2.0));

  const sun = new THREE.DirectionalLight(0xffe4aa, 3.2);
  sun.position.set(-22, 32, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -35;
  sun.shadow.camera.right = 35;
  sun.shadow.camera.top = 35;
  sun.shadow.camera.bottom = -35;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 90;
  sun.shadow.bias = -0.0004;
  scene.add(sun);

  const rim = new THREE.DirectionalLight(0xff8a42, 1.1);
  rim.position.set(25, 12, -25);
  scene.add(rim);

  // -------------------------------------------------------------------------
  // Materials
  // -------------------------------------------------------------------------
  const mat = {
    ground: new THREE.MeshStandardMaterial({ color: 0x8f5229, roughness: 1 }),
    groundDark: new THREE.MeshStandardMaterial({ color: 0x5b321d, roughness: 1 }),
    cliff: new THREE.MeshStandardMaterial({ color: 0xa85f2d, roughness: 0.98 }),
    cliffLight: new THREE.MeshStandardMaterial({ color: 0xc4783f, roughness: 0.95 }),
    cliffDark: new THREE.MeshStandardMaterial({ color: 0x63351f, roughness: 1 }),
    rock: new THREE.MeshStandardMaterial({ color: 0x9b6031, roughness: 1, flatShading: true }),
    rockLight: new THREE.MeshStandardMaterial({ color: 0xc07b45, roughness: 1, flatShading: true }),
    river: new THREE.MeshStandardMaterial({ color: 0x287c83, roughness: 0.28, metalness: 0.18 }),
    riverGlow: new THREE.MeshBasicMaterial({ color: 0x4bc4c1 }),
    cactus: new THREE.MeshStandardMaterial({ color: 0x3d7843, roughness: .85, flatShading: true }),
    cactusLight: new THREE.MeshStandardMaterial({ color: 0x568d4d, roughness: .85, flatShading: true }),
    cactusDark: new THREE.MeshStandardMaterial({ color: 0x28543a, roughness: .9, flatShading: true }),
    desert: new THREE.MeshStandardMaterial({ color: 0xc58a4c, roughness: 1, flatShading: true }),
    sky: new THREE.MeshBasicMaterial({ color: 0x9c552c, side: THREE.BackSide }),
    hot: new THREE.MeshBasicMaterial({ color: 0xff7a35 }),
    cool: new THREE.MeshBasicMaterial({ color: 0x75e0d0 }),
    white: new THREE.MeshStandardMaterial({ color: 0xf4e4b6, roughness: .85 }),
    black: new THREE.MeshStandardMaterial({ color: 0x201a15, roughness: .9 }),
    red: new THREE.MeshStandardMaterial({ color: 0xa92720, roughness: .7, flatShading: true }),
    yellow: new THREE.MeshStandardMaterial({ color: 0xf3b92f, roughness: .65, flatShading: true }),
    green: new THREE.MeshStandardMaterial({ color: 0x3d7743, roughness: .75, flatShading: true }),
    blue: new THREE.MeshStandardMaterial({ color: 0x315b75, roughness: .75, flatShading: true }),
    purple: new THREE.MeshStandardMaterial({ color: 0x7154a7, roughness: .75, flatShading: true }),
    orange: new THREE.MeshStandardMaterial({ color: 0xe57c28, roughness: .75, flatShading: true }),
    pink: new THREE.MeshStandardMaterial({ color: 0xd65b8a, roughness: .75, flatShading: true }),
    cream: new THREE.MeshStandardMaterial({ color: 0xf0dfb1, roughness: .8, flatShading: true })
  };

  // -------------------------------------------------------------------------
  // Procedural noise textures
  // -------------------------------------------------------------------------
  function makeNoiseTexture(base, fleck, count, size = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < count; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 1 + Math.random() * 5;
      ctx.fillStyle = fleck;
      ctx.globalAlpha = 0.08 + Math.random() * 0.25;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 4; // was renderer.capabilities.getMaxAnisotropy()
    return texture;
  }

  const groundTexture = makeNoiseTexture("#a86838", "#57351f", 1800);
  groundTexture.repeat.set(18, 18);
  mat.ground.map = groundTexture;

  const cliffTexture = makeNoiseTexture("#9b582f", "#d08a4b", 1200);
  cliffTexture.repeat.set(3, 3);
  mat.cliff.map = cliffTexture;

  // -------------------------------------------------------------------------
  // Sky dome, distant mesas, and sun disk
  // -------------------------------------------------------------------------
  const sky = new THREE.Mesh(new THREE.SphereGeometry(100, 32, 18), mat.sky);
  scene.add(sky);

  const sunDisk = new THREE.Mesh(
    new THREE.SphereGeometry(4.2, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0xffd18a, fog: false })
  );
  sunDisk.position.set(-38, 27, -60);
  scene.add(sunDisk);

  const mesaGroup = new THREE.Group();
  scene.add(mesaGroup);

  function addMesa(x, z, width, depth, height, rotation = 0) {
    const mesa = new THREE.Group();
    mesa.position.set(x, 0, z);
    mesa.rotation.y = rotation;

    const layers = [
      { y: height * .42, h: height * .55, w: width * 1.25, d: depth * 1.15, mat: mat.cliffDark },
      { y: height * .72, h: height * .34, w: width * .92, d: depth * .92, mat: mat.cliff },
      { y: height, h: height * .18, w: width * .65, d: depth * .65, mat: mat.cliffLight }
    ];

    for (const layer of layers) {
      const layerMesh = new THREE.Mesh(new THREE.CylinderGeometry(layer.w, layer.w * 1.12, layer.h, 11, 1, false), layer.mat);
      layerMesh.position.y = layer.y;
      layerMesh.castShadow = true;
      layerMesh.receiveShadow = true;
      mesa.add(layerMesh);
    }

    mesaGroup.add(mesa);
  }

  addMesa(-42, -38, 19, 15, 17, .12);
  addMesa(-18, -55, 15, 12, 13, -.2);
  addMesa(22, -50, 17, 14, 15, .25);
  addMesa(48, -40, 13, 10, 11, -.15);
  addMesa(-62, -20, 11, 9, 9, .4);
  addMesa(65, 2, 9, 8, 8, -.3);

  // -------------------------------------------------------------------------
  // Canyon terrain and river
  // -------------------------------------------------------------------------
  const terrain = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150, 70, 70),
    mat.ground
  );
  terrain.rotation.x = -Math.PI / 2;
  terrain.receiveShadow = true;
  scene.add(terrain);

  const river = new THREE.Mesh(new THREE.PlaneGeometry(18, 82, 1, 1), mat.river);
  river.rotation.x = -Math.PI / 2;
  river.position.set(0, .08, 2);
  river.receiveShadow = true;
  scene.add(river);

  const riverGlow = new THREE.Mesh(new THREE.PlaneGeometry(13, 76, 1, 1), mat.riverGlow);
  riverGlow.rotation.x = -Math.PI / 2;
  riverGlow.position.set(0, .1, 2);
  scene.add(riverGlow);

  // Water shader for animated highlights (duplicated keys in the original
  // object literal collapsed — values were identical).
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      deep: { value: new THREE.Color(0x174f55) },
      shallow: { value: new THREE.Color(0x4bb6ae) }
    },
    transparent: true,
    side: THREE.DoubleSide,
    vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        vUv = uv;
        vec2 p = (uv - .5) * 60.;
        float wave = sin(p.x * 1.8 + time * 1.4) * .055
                   + sin(p.y * 2.1 - time * 1.1) * .035;
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z + wave, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 deep;
      uniform vec3 shallow;
      varying vec2 vUv;
      varying float vWave;
      void main() {
        float shimmer = sin(vUv.y * 18. + time * 1.7) * .5 + .5;
        float stripe = smoothstep(.88, 1., sin(vUv.x * 12. + vUv.y * 5. + time) * .5 + .5);
        vec3 color = mix(deep, shallow, clamp(vWave * 2. + .5, 0., 1.));
        color += stripe * .18;
        gl_FragColor = vec4(color, .86);
      }
    `
  });

  const animatedRiver = new THREE.Mesh(new THREE.PlaneGeometry(17, 82, 1, 1), waterMaterial);
  animatedRiver.rotation.x = -Math.PI / 2;
  animatedRiver.position.set(0, .15, 2);
  scene.add(animatedRiver);

  // -------------------------------------------------------------------------
  // Jagged canyon rocks
  // -------------------------------------------------------------------------
  function addRock(x, z, scale, rotation = 0, light = false) {
    const rockGroup = new THREE.Group();
    rockGroup.position.set(x, 0, z);
    rockGroup.rotation.y = rotation;
    rockGroup.scale.setScalar(scale);

    const geometry = new THREE.DodecahedronGeometry(1, 0);
    const rockMesh = new THREE.Mesh(geometry, light ? mat.rockLight : mat.rock);
    rockMesh.position.y = .45;
    rockMesh.rotation.set(Math.random(), Math.random(), Math.random());
    rockMesh.castShadow = true;
    rockMesh.receiveShadow = true;
    rockGroup.add(rockMesh);

    const cap = new THREE.Mesh(new THREE.ConeGeometry(.7, .9, 5), mat.cliffDark);
    cap.position.y = 1.2;
    cap.rotation.y = Math.random();
    cap.castShadow = true;
    rockGroup.add(cap);

    scene.add(rockGroup);
  }

  for (let i = 0; i < 44; i++) {
    const side = Math.random() > .5 ? 1 : -1;
    const x = side * (7 + Math.random() * 29);
    const z = -35 + Math.random() * 75;
    addRock(x, z, .5 + Math.random() * 1.8, Math.random() * Math.PI, Math.random() > .65);
  }

  // -------------------------------------------------------------------------
  // Cacti
  // -------------------------------------------------------------------------
  function addCactus(x, z, scale = 1, color = mat.cactus) {
    const cactusGroup = new THREE.Group();
    cactusGroup.position.set(x, 0, z);
    cactusGroup.scale.setScalar(scale);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.22, .3, 1.4, 7), color);
    stem.position.y = .7;
    stem.castShadow = true;
    cactusGroup.add(stem);

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(.12, .16, .85, 6), color);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(.28, .85, 0);
    arm.castShadow = true;
    cactusGroup.add(arm);

    const armTip = new THREE.Mesh(new THREE.CylinderGeometry(.12, .16, .85, 6), color);
    armTip.rotation.z = -Math.PI / 2;
    armTip.position.set(.56, .85, 0);
    armTip.castShadow = true;
    cactusGroup.add(armTip);

    for (const y of [.35, .72, 1.1]) {
      const bud = new THREE.Mesh(new THREE.ConeGeometry(.12, .22, 5), mat.cactusLight);
      bud.position.set(0, y + .1, 0);
      cactusGroup.add(bud);
    }

    scene.add(cactusGroup);
  }

  const cactusSpots = [
    [-10, -8, 1.2], [11, -12, .9], [-13, 4, 1.4], [13, 11, 1.1],
    [-8, 25, .8], [8, 31, 1.2], [-16, 36, 1.5], [16, 38, 1.0],
    [-2, -30, .7], [2, -34, 1.1], [-18, -16, 1.3], [18, -18, .8]
  ];

  cactusSpots.forEach((spot, i) => {
    addCactus(spot[0], spot[1], spot[2], i % 2 ? mat.cactusLight : mat.cactus);
  });

  // -------------------------------------------------------------------------
  // Desert plants
  // -------------------------------------------------------------------------
  const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x6b8b45, roughness: 1, flatShading: true });
  const flowerMaterial = new THREE.MeshBasicMaterial({ color: 0xf1a347 });

  function addPlant(x, z, scale = 1) {
    const plantGroup = new THREE.Group();
    plantGroup.position.set(x, 0, z);
    plantGroup.scale.setScalar(scale);

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(.025, .035, .35 + Math.random() * .18, 4), plantMaterial);
      stem.position.set(Math.cos(angle) * .18, .18, Math.sin(angle) * .18);
      stem.rotation.z = Math.cos(angle) * .18;
      stem.rotation.x = Math.sin(angle) * .18;
      stem.castShadow = true;
      plantGroup.add(stem);
    }

    for (let i = 0; i < 5; i++) {
      const petal = new THREE.Mesh(new THREE.ConeGeometry(.055, .11, 4), flowerMaterial);
      petal.position.set(Math.cos((i/5)*2.4)*.11, .39, Math.sin((i/5)*2.4)*.11);
      petal.rotation.z = Math.cos((i/5)*2.4)*.45;
      plantGroup.add(petal);
    }

    scene.add(plantGroup);
  }

  for (let i = 0; i < 45; i++) {
    addPlant((Math.random() - .5) * 52, (Math.random() - .5) * 65, .45 + Math.random() * .8);
  }

  // -------------------------------------------------------------------------
  // Road and route markers
  // -------------------------------------------------------------------------
  const road = new THREE.Mesh(new THREE.PlaneGeometry(5, 105), mat.black);
  road.rotation.x = -Math.PI / 2;
  road.position.set(-2.5, .05, 1);
  scene.add(road);

  const routePoints = [
    new THREE.Vector3(-2.5, 0, -45), new THREE.Vector3(-2.5, 0, -20), new THREE.Vector3(-2.5, 0, 5), new THREE.Vector3(-2.5, 0, 30),
    new THREE.Vector3(-2.5, 0, 55), new THREE.Vector3(8, 0, 55), new THREE.Vector3(22, 0, 55), new THREE.Vector3(38, 0, 55)
  ];

  for (let i = 0; i < routePoints.length - 1; i++) {
    const a = routePoints[i];
    const b = routePoints[i + 1];
    const midpoint = a.clone().add(b).multiplyScalar(.5);
    const length = a.distanceTo(b);
    const roadSegment = new THREE.Mesh(new THREE.PlaneGeometry(length, 3.2), mat.black);
    roadSegment.rotation.x = -Math.PI / 2;
    roadSegment.position.copy(midpoint);
    roadSegment.position.y = .055;
    scene.add(roadSegment);
  }

  for (let i = 0; i < 8; i++) {
    const marker = new THREE.Group();
    marker.position.set(-2.5, 0, -38 + i * 10);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(.06, .08, 1.2, 6), mat.yellow);
    post.position.y = .6;
    marker.add(post);
    const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(.85, .45), mat.yellow);
    signMesh.position.set(0, 1.18, .01);
    marker.add(signMesh);
    scene.add(marker);
  }

  // -------------------------------------------------------------------------
  // Animated birds
  // -------------------------------------------------------------------------
  const birds = [];
  const birdMaterial = new THREE.MeshBasicMaterial({ color: 0x342c27 });

  function addBird(x, y, z, scale = 1) {
    const bird = new THREE.Group();
    bird.position.set(x, y, z);
    bird.scale.setScalar(scale);

    const body = new THREE.Mesh(new THREE.SphereGeometry(.12, 6, 4), birdMaterial);
    body.scale.set(.7, 1.25, .45);
    bird.add(body);

    const wingLeft = new THREE.Mesh(new THREE.ConeGeometry(.1, .24, 3), birdMaterial);
    wingLeft.rotation.z = Math.PI / 2;
    wingLeft.position.set(.1, 0, 0);
    bird.add(wingLeft);

    const wingRight = new THREE.Mesh(new THREE.ConeGeometry(.1, .24, 3), birdMaterial);
    wingRight.rotation.z = -Math.PI / 2;
    wingRight.position.set(-.1, 0, 0);
    bird.add(wingRight);

    scene.add(bird);
    birds.push({ group: bird, phase: Math.random() * Math.PI * 2, speed: .7 + Math.random() * .5 });
  }

  addBird(-10, 13, -20, 1.2);
  addBird(8, 16, -30, .9);
  addBird(-4, 12, 10, .8);
  addBird(15, 18, -5, 1.1);

  // -------------------------------------------------------------------------
  // Animated butterflies / fireflies
  // -------------------------------------------------------------------------
  const fireflies = [];
  const fireflyMaterial = new THREE.MeshBasicMaterial({ color: 0xffd35c });

  for (let i = 0; i < 24; i++) {
    const firefly = new THREE.Mesh(new THREE.SphereGeometry(.06, 5, 4), fireflyMaterial);
    const x = (Math.random() - .5) * 38;
    const z = (Math.random() - .5) * 55;
    firefly.position.set(x, .4 + Math.random() * 2.4, z);
    scene.add(firefly);
    fireflies.push({ mesh: firefly, phase: Math.random() * Math.PI * 2, speed: .4 + Math.random() * .5 });
  }

  // -------------------------------------------------------------------------
  // Animation — original per-frame expressions, moved here.
  // -------------------------------------------------------------------------

  function update(t, dt) {
    const elapsed = t;

    waterMaterial.uniforms.time.value = elapsed;

    birds.forEach(bird => {
      bird.group.position.x += Math.sin(elapsed * bird.speed + bird.phase) * .0015;
      bird.group.position.y += Math.cos(elapsed * bird.speed * .7 + bird.phase) * .0008;
      bird.group.rotation.y = Math.sin(elapsed * bird.speed + bird.phase) * .7;
      bird.group.rotation.z = Math.sin(elapsed * bird.speed * 1.4 + bird.phase) * .18;
    });

    fireflies.forEach(item => {
      item.mesh.position.x += Math.sin(elapsed * item.speed + item.phase) * .0008;
      item.mesh.position.y += Math.cos(elapsed * item.speed * .8 + item.phase) * .0006;
      item.mesh.position.z += Math.sin(elapsed * item.speed * .6 + item.phase) * .0005;
      item.mesh.scale.setScalar(.7 + Math.sin(elapsed * 2.4 + item.phase) * .35);
    });
  }

  return {
    group,
    update,
    spawn: { x: 7, z: 30, yaw: 0 },
    env: { background: 0x9d5c2e, fogColor: 0x9d5c2e, fogDensity: 0.016 },
    doors: {
      next: { x: 0, z: -33 },
      prev: { x: 0, z: 37 }
    },
    relic: { name: "Ace's Medal", x: -22, z: -26 }
  };
}
