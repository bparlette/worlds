// ============================================================================
// @world {"id":"001","title":"ADVENTURE","sub":"Castles & Mazes","system":"Atari 2600"}
// World 001 — ADVENTURE · Castles & Mazes (Atari 2600)
// Converted from scenes/001_adventure_castles_mazes.html (Qwen3.5-3D-Coder
// diorama) into a World Walker module. All geometry, materials, textures and
// ambient animation from the original are preserved; the renderer / orbit
// camera / HUD / animate-loop boilerplate was removed and the per-frame
// animation expressions moved into update(t, dt).
//
// Door choices:
//   next — in front of the castle gatehouse (castle at (15,-31), gate faces
//          the winding path). Door at (13.1, -20.7), just outside the gate.
//   prev — at the maze / enchanted-grove altar clearing (maze at (-18,-23)).
//          Door at (-17, -17.2), on the clearing's south approach.
// Spawn: start of the winding path, looking toward the castle.
// Relic: the Enchanted Chalice hides BEHIND the castle at (20, -43), in the
//        north woods — well off both door beelines; you have to circle the
//        castle to find it. (Deliberately NOT the maze altar.)
// ============================================================================

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";

export function createWorld(THREE) {
  const group = new THREE.Group();
  const animated = [];

  // -------------------------------------------------------------------------
  // Materials
  // -------------------------------------------------------------------------

  const materials = {
    earth: new THREE.MeshStandardMaterial({ color: 0x3c2817, roughness: 1 }),
    earthDark: new THREE.MeshStandardMaterial({ color: 0x21170f, roughness: 1 }),
    path: new THREE.MeshStandardMaterial({ color: 0x9b7846, roughness: 1 }),
    pathLight: new THREE.MeshStandardMaterial({ color: 0xb9955d, roughness: 1 }),
    stone: new THREE.MeshStandardMaterial({ color: 0x665646, roughness: .96 }),
    stoneLight: new THREE.MeshStandardMaterial({ color: 0x918068, roughness: .94 }),
    stoneDark: new THREE.MeshStandardMaterial({ color: 0x39332d, roughness: 1 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xd9a43b, roughness: .55, metalness: .25 }),
    leaf: new THREE.MeshStandardMaterial({ color: 0x345c2b, roughness: .95 }),
    leafLight: new THREE.MeshStandardMaterial({ color: 0x527a35, roughness: .95 }),
    leafDark: new THREE.MeshStandardMaterial({ color: 0x203c20, roughness: 1 }),
    trunk: new THREE.MeshStandardMaterial({ color: 0x493220, roughness: 1 }),
    moss: new THREE.MeshStandardMaterial({ color: 0x506736, roughness: 1 }),
    water: new THREE.MeshStandardMaterial({
      color: 0x173c45,
      roughness: .25,
      metalness: .15,
      transparent: true,
      opacity: .84
    }),
    candle: new THREE.MeshStandardMaterial({
      color: 0xe2b969,
      emissive: 0x7b3500,
      emissiveIntensity: .8,
      roughness: .65
    }),
    fire: new THREE.MeshBasicMaterial({ color: 0xff9b26 }),
    glow: new THREE.MeshBasicMaterial({ color: 0xffc45c })
  };

  // -------------------------------------------------------------------------
  // Lighting (folded into the group so it streams/disposes with the world)
  // -------------------------------------------------------------------------

  group.add(new THREE.HemisphereLight(0x7e8965, 0x24150d, 1.5));

  const sun = new THREE.DirectionalLight(0xffc878, 3.1);
  sun.position.set(25, 35, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -35;
  sun.shadow.camera.right = 35;
  sun.shadow.camera.top = 35;
  sun.shadow.camera.bottom = -35;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 90;
  sun.shadow.bias = -.0004;
  group.add(sun);

  const rim = new THREE.DirectionalLight(0x6d879a, 1.25);
  rim.position.set(-20, 15, -25);
  group.add(rim);

  const fireLight = new THREE.PointLight(0xff7a22, 2.4, 18, 2);
  fireLight.position.set(0, 3.5, 0);
  group.add(fireLight);

  // -------------------------------------------------------------------------
  // Procedural canvas textures
  // -------------------------------------------------------------------------

  function makeTexture(type) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d");

    if (type === "stone") {
      ctx.fillStyle = "#71624c";
      ctx.fillRect(0, 0, 256, 256);

      for (let i = 0; i < 900; i++) {
        const shade = 70 + Math.random() * 65;
        ctx.fillStyle = `rgba(${shade},${shade - 8},${shade - 16},${.05 + Math.random()*.2})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 3, 1 + Math.random() * 3);
      }

      ctx.strokeStyle = "rgba(35,28,22,.25)";
      ctx.lineWidth = 2;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const x = col * 32 + (row % 2) * 16;
          ctx.strokeRect(x, row * 32, 30, 30);
        }
      }
    } else {
      ctx.fillStyle = "#243a24";
      ctx.fillRect(0, 0, 256, 256);

      for (let i = 0; i < 1500; i++) {
        const light = Math.random() > .55;
        ctx.fillStyle = light ? "rgba(135,170,95,.12)" : "rgba(8,25,10,.18)";
        const r = 1 + Math.random() * 4;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, r, r);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const stoneTexture = makeTexture("stone");
  stoneTexture.repeat.set(3, 3);
  materials.stone.map = stoneTexture;

  const leafTexture = makeTexture("leaf");
  leafTexture.repeat.set(12, 12);
  materials.leaf.map = leafTexture;
  materials.leafLight.map = leafTexture;
  materials.leafDark.map = leafTexture;

  // -------------------------------------------------------------------------
  // Terrain and winding path
  // -------------------------------------------------------------------------

  const terrainGeometry = new THREE.PlaneGeometry(110, 110, 110, 110);
  terrainGeometry.rotateX(-Math.PI / 2);

  const terrainPosition = terrainGeometry.attributes.position;
  const terrainColors = [];

  for (let i = 0; i < terrainPosition.count; i++) {
    const x = terrainPosition.getX(i);
    const z = terrainPosition.getZ(i);
    const edge = Math.max(Math.abs(x) / 48, Math.abs(z) / 48);
    const noise = Math.sin(x * .24) * .35 + Math.cos(z * .21) * .35 + Math.sin((x+z)*.11)*.25;
    const h = Math.max(-.5, Math.min(3.2, noise + edge * 1.4));
    terrainPosition.setY(i, h);

    const color = new THREE.Color();
    if (h > 2.2) color.set(0x34251a);
    else if (h < -1.2) color.set(0x251b12);
    else color.set(0x49331f);
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
  group.add(terrain);

  // A hand-carved path through the forest, with gentle elevation.
  const pathPoints = [
    new THREE.Vector3(-23, 0, 28),
    new THREE.Vector3(-14, 0, 20),
    new THREE.Vector3(-7, 0, 13),
    new THREE.Vector3(0, 0, 7),
    new THREE.Vector3(7, 0, 0),
    new THREE.Vector3(13, 0, -8),
    new THREE.Vector3(18, 0, -18)
  ];

  const pathCurve = new THREE.CatmullRomCurve3(pathPoints, false, "catmullrom", .45);
  const pathSegments = 180;
  const pathGeometry = new THREE.BufferGeometry();
  const pathPositions = [];
  const pathUVs = [];

  for (let i = 0; i <= pathSegments; i++) {
    const t = i / pathSegments;
    const p = pathCurve.getPoint(t);
    const side = Math.sin(t * Math.PI * 3.2) * .5 + .5;
    const width = .7 + side * 1.25;
    const y = 0.02 + Math.sin(t * Math.PI * 2) * .12;

    const left = p.clone().add(new THREE.Vector3(-width, 0, 0));
    const right = p.clone().add(new THREE.Vector3(width, 0, 0));
    pathPositions.push(left.x, y, left.z, right.x, y, right.z);
    pathUVs.push(0, t * 12, 1, t * 12);
  }

  pathGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pathPositions, 3));
  pathGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(pathUVs, 2));
  pathGeometry.computeVertexNormals();

  const path = new THREE.Mesh(
    pathGeometry,
    new THREE.MeshStandardMaterial({
      color: 0xb58b50,
      roughness: 1,
      side: THREE.DoubleSide
    })
  );
  path.receiveShadow = true;
  group.add(path);

  // -------------------------------------------------------------------------
  // Castle
  // -------------------------------------------------------------------------

  const castle = new THREE.Group();
  castle.position.set(15, 0, -31);
  castle.rotation.y = -.18;
  group.add(castle);

  function castleBox(w, h, d, x, y, z, material = materials.stone) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    castle.add(mesh);
    return mesh;
  }

  castleBox(12, 5, 12, 0, 2.5, 0);
  castleBox(16, 1.2, 16, 0, 5.1, 0, materials.stoneLight);
  castleBox(8, 4.5, 8, -4.2, 7.3, 1.3, materials.stone);
  castleBox(8, 4.5, 8, 4.2, 7.3, 1.3, materials.stone);
  castleBox(3.2, 2.8, 3.2, 0, 10.7, -1.2, materials.stoneLight);
  castleBox(7, 2.1, 7, 0, 12.3, -1.2, materials.stoneLight);

  // Towers and crenellations.
  const towerPositions = [
    [-7.2, 1.6, -4.4, 3.2],
    [7.2, 1.6, -4.4, 3.2],
    [-7.2, 1.6, 4.4, 3.2],
    [7.2, 1.6, 4.4, 3.2]
  ];

  for (const [x, y, z, size] of towerPositions) {
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(size, size * 1.08, y * 2, 8), materials.stone);
    tower.position.set(x, y, z);
    tower.castShadow = true;
    tower.receiveShadow = true;
    castle.add(tower);

    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const merlon = new THREE.Mesh(new THREE.BoxGeometry(.55, .75, .55), materials.stoneLight);
      merlon.position.set(
        Math.cos(a) * (size * .72),
        y * 2 + .35,
        Math.sin(a) * (size * .72)
      );
      merlon.rotation.y = -a;
      merlon.castShadow = true;
      castle.add(merlon);
    }
  }

  // Arched windows.
  function archWindow(x, y, z, width = 1.2) {
    const group2 = new THREE.Group();
    group2.position.set(x, y, z);

    const dark = new THREE.Mesh(new THREE.BoxGeometry(width, width * .65, .12), materials.earthDark);
    dark.position.y = width * .25;
    group2.add(dark);

    const arch = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape()), materials.stoneDark);
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, 0);
    shape.lineTo(width / 2, 0);
    shape.lineTo(width / 2, width * .35);
    shape.absarc(0, width * .35, width / 2, 0, Math.PI, false);
    shape.lineTo(-width / 2, 0);
    arch.position.y = width * .35;
    group2.add(arch);

    const glowDisc = new THREE.Mesh(new THREE.CircleGeometry(width * .22, 16), materials.glow);
    glowDisc.position.set(0, width * .25, .09);
    group2.add(glowDisc);

    group2.traverse(o => { if (o.isMesh) o.castShadow = true; });
    castle.add(group2);
  }

  archWindow(-3.6, 3.3, 6.07, 1.2);
  archWindow(3.6, 3.3, 6.07, 1.2);
  archWindow(-7.2, 2.5, 0, 1.4);
  archWindow(7.2, 2.5, 0, 1.4);
  archWindow(0, 11.7, 4.67, 1.4);
  archWindow(0, 11.7, -6.61, 1.4);

  // Gatehouse.
  const gate = new THREE.Group();
  gate.position.set(0, 0, 7.4);
  castle.add(gate);

  const gatePillars = [
    new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.4, 2.2), materials.stoneLight),
    new THREE.Mesh(new THREE.BoxGeometry(1.8, 5.4, 2.2), materials.stoneLight)
  ];
  gatePillars.forEach(m => {
    m.position.x = m === gatePillars[0] ? -1.05 : 1.05;
    m.castShadow = true;
    m.receiveShadow = true;
    gate.add(m);
  });

  const gateLintel = new THREE.Mesh(new THREE.BoxGeometry(4.4, .8, 2.6), materials.stoneLight);
  gateLintel.position.set(0, 5.3, 0);
  gateLintel.castShadow = true;
  gate.add(gateLintel);

  const gateSign = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, .65),
    new THREE.MeshBasicMaterial({ color: 0x9b6b25, side: THREE.DoubleSide })
  );
  gateSign.position.set(0, 4.85, .03);
  gate.add(gateSign);

  // -------------------------------------------------------------------------
  // Maze / enchanted grove
  // -------------------------------------------------------------------------

  const maze = new THREE.Group();
  maze.position.set(-18, 0, -23);
  maze.rotation.y = .22;
  group.add(maze);

  function mazeWall(x, z, w, d, material = materials.leafDark) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w, 1.2 + Math.random() * .5, d), material);
    wall.position.set(x, .55, z);
    wall.rotation.y = (Math.random() - .5) * .18;
    wall.castShadow = true;
    wall.receiveShadow = true;
    maze.add(wall);
    return wall;
  }

  // Curved maze walls around the central clearing.
  mazeWall(-6, -2, 5.2, 1.1);
  mazeWall(-1.8, -2, 4.2, 1.1);
  mazeWall(2.5, -2, 5.2, 1.1);
  mazeWall(6.2, -2, 4.2, 1.1);
  mazeWall(-6, 2, 5.2, 1.1);
  mazeWall(-1.8, 2, 4.2, 1.1);
  mazeWall(2.5, 2, 5.2, 1.1);
  mazeWall(6.2, 2, 4.2, 1.1);

  // Inner maze.
  mazeWall(-2.5, -3.5, 3.5, .8);
  mazeWall(-.5, -3.5, 2.8, .8);
  mazeWall(1.5, -3.5, 3.5, .8);
  mazeWall(3.5, -3.5, 2.8, .8);
  mazeWall(-2.5, 3.5, 3.5, .8);
  mazeWall(-.5, 3.5, 2.8, .8);
  mazeWall(1.5, 3.5, 3.5, .8);
  mazeWall(3.5, 3.5, 2.8, .8);

  // Central altar.
  const altar = new THREE.Group();
  altar.position.set(0, 0, 0);
  maze.add(altar);

  const altarBase = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.5, .55, 8), materials.stoneDark);
  altarBase.position.y = .25;
  altarBase.castShadow = true;
  altar.add(altarBase);

  const altarStem = new THREE.Mesh(new THREE.CylinderGeometry(.38, .55, 2.2, 8), materials.stoneLight);
  altarStem.position.y = 1.45;
  altarStem.castShadow = true;
  altar.add(altarStem);

  const altarBowl = new THREE.Mesh(new THREE.CylinderGeometry(1.0, .45, .35, 12), materials.gold);
  altarBowl.position.y = 2.7;
  altarBowl.castShadow = true;
  altar.add(altarBowl);

  // Candle flames.
  const flames = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const x = Math.cos(angle) * .62;
    const z = Math.sin(angle) * .62;

    const candle = new THREE.Mesh(
      new THREE.CylinderGeometry(.055, .065, .55, 8),
      materials.candle
    );
    candle.position.set(x, 3.05, z);
    altar.add(candle);

    const flame = new THREE.Mesh(new THREE.SphereGeometry(.12, 8, 8), materials.fire);
    flame.scale.y = 1.8;
    flame.position.set(x, 3.43, z);
    altar.add(flame);
    flames.push(flame);
  }

  // -------------------------------------------------------------------------
  // Trees
  // -------------------------------------------------------------------------

  const trunkGeometry = new THREE.CylinderGeometry(.22, .38, 1, 7);
  const crownGeometry = new THREE.IcosahedronGeometry(1, 1);

  function createTree(x, z, scale = 1, variant = 0) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.rotation.y = Math.random() * Math.PI * 2;
    tree.scale.setScalar(scale);

    const trunk = new THREE.Mesh(trunkGeometry, materials.trunk);
    trunk.position.y = .55;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    const crown = new THREE.Mesh(crownGeometry, variant % 2 ? materials.leaf : materials.leafLight);
    crown.position.y = 2.25;
    crown.scale.set(1.25, 1.55, 1.15);
    crown.rotation.set(Math.random(), Math.random(), Math.random());
    crown.castShadow = true;
    crown.receiveShadow = true;
    tree.add(crown);

    const lowerCrown = new THREE.Mesh(crownGeometry, materials.leafDark);
    lowerCrown.position.set(.35, 1.65, -.1);
    lowerCrown.scale.set(.85, 1.05, .85);
    lowerCrown.castShadow = true;
    tree.add(lowerCrown);

    group.add(tree);
    animated.push({
      type: "tree",
      object: tree,
      phase: Math.random() * Math.PI * 2,
      amplitude: .035 + Math.random() * .05
    });
  }

  const treePositions = [
    [-29, -20, 1.15], [-25, -31, .95], [-35, -10, 1.05],
    [-31, 6, 1.2], [-25, 16, .9], [-36, 28, 1.1],
    [-12, -35, 1.1], [-8, -41, .9], [5, -37, 1.0],
    [12, -31, 1.15], [24, -34, .95], [31, -20, 1.1],
    [28, -9, 1.2], [34, 8, .95], [25, 22, 1.1],
    [10, 31, 1.0], [-4, 35, 1.15], [-18, 37, .9],
    [-30, 4, 1.0], [-20, -3, .9], [-10, -4, 1.15],
    [18, -1, .9], [28, 1, 1.1], [18, 12, 1.0]
  ];

  treePositions.forEach(([x, z, s], i) => {
    createTree(x, z, s, i);
  });

  // -------------------------------------------------------------------------
  // Water pool and rocks
  // -------------------------------------------------------------------------

  const pool = new THREE.Group();
  pool.position.set(-10, 0, 13);
  group.add(pool);

  const poolCircle = new THREE.Mesh(
    new THREE.CircleGeometry(6.5, 64),
    materials.water
  );
  poolCircle.rotation.x = -Math.PI / 2;
  poolCircle.position.y = .04;
  poolCircle.receiveShadow = true;
  pool.add(poolCircle);

  const poolRing = new THREE.Mesh(
    new THREE.RingGeometry(6.45, 6.8, 64),
    new THREE.MeshBasicMaterial({ color: 0x8f6937, side: THREE.DoubleSide })
  );
  poolRing.rotation.x = -Math.PI / 2;
  poolRing.position.y = .05;
  pool.add(poolRing);

  const rockGeometry = new THREE.DodecahedronGeometry(1, 0);
  for (let i = 0; i < 22; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 8 + Math.random() * 12;
    const rock = new THREE.Mesh(rockGeometry, materials.stoneDark);
    rock.position.set(
      Math.cos(angle) * radius,
      .25 + Math.random() * .3,
      Math.sin(angle) * radius
    );
    rock.scale.set(.5 + Math.random() * 1.4, .35 + Math.random() * .7, .5 + Math.random() * 1.2);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  }

  // -------------------------------------------------------------------------
  // Fire pit and ambient particles
  // -------------------------------------------------------------------------

  const fire = new THREE.Group();
  fire.position.set(-4, 0, 8);
  group.add(fire);

  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const log = new THREE.Mesh(new THREE.CylinderGeometry(.13, .18, 1.4, 6), materials.trunk);
    log.position.set(Math.cos(angle) * .55, .15, Math.sin(angle) * .55);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = angle;
    log.castShadow = true;
    fire.add(log);
  }

  const smoke = [];
  for (let i = 0; i < 12; i++) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(.25 + Math.random() * .25, 8, 6),
      new THREE.MeshBasicMaterial({
        color: 0x29211c,
        transparent: true,
        opacity: .18,
        depthWrite: false
      })
    );
    fire.add(puff);
    smoke.push({
      object: puff,
      phase: Math.random() * Math.PI * 2,
      speed: .18 + Math.random() * .12
    });
  }

  // Fireflies. (Original added these to the scene; folded into the group.)
  const fireflies = [];
  for (let i = 0; i < 28; i++) {
    const x = (Math.random() - .5) * 55;
    const y = 1.5 + Math.random() * 6;
    const z = (Math.random() - .5) * 55;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      color: 0xffd36b,
      transparent: true,
      opacity: .75,
      depthWrite: false
    }));
    sprite.position.set(x, y, z);
    group.add(sprite);
    fireflies.push({
      sprite,
      base: new THREE.Vector3(x, y, z),
      phase: Math.random() * Math.PI * 2,
      speed: .5 + Math.random() * .8
    });
  }

  // -------------------------------------------------------------------------
  // Interactive flags and banners
  // -------------------------------------------------------------------------

  const flags = [];

  function createFlag(x, y, z, color) {
    const flagGroup = new THREE.Group();
    flagGroup.position.set(x, y, z);

    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.055, .075, 4.2, 6), materials.gold);
    pole.position.y = 2.1;
    pole.castShadow = true;
    flagGroup.add(pole);

    const flag = new THREE.Mesh(
      new THREE.PlaneGeometry(1.65, .85),
      new THREE.MeshStandardMaterial({
        color,
        roughness: .85,
        side: THREE.DoubleSide
      })
    );
    flag.position.set(.82, 3.65, 0);
    flag.castShadow = true;
    flagGroup.add(flag);

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, 1.9, 6), materials.gold);
    rod.rotation.z = Math.PI / 2;
    rod.position.set(1.65, 3.65, 0);
    flagGroup.add(rod);

    group.add(flagGroup);
    flags.push({ group: flagGroup, flag, phase: Math.random() * Math.PI * 2 });
  }

  createFlag(-13, 5.5, 15, 0x8f3f2f);
  createFlag(13, 5.5, -15, 0x285b63);

  // -------------------------------------------------------------------------
  // Animation — the original scene's per-frame expressions, moved here.
  // -------------------------------------------------------------------------

  function update(t, dt) {
    const elapsed = t;

    flames.forEach((flame, i) => {
      const flicker = 1 + Math.sin(elapsed * 9 + i * 2.3) * .18 + Math.sin(elapsed * 15 + i) * .08;
      flame.scale.set(1, flicker, 1);
      flame.rotation.y = elapsed * 1.8 + i;
      fireLight.intensity = 2.1 + Math.sin(elapsed * 7.5) * .35 + Math.sin(elapsed * 11) * .15;
    });

    flags.forEach(flag => {
      flag.flag.rotation.y = Math.sin(elapsed * 2.2 + flag.phase) * .18;
      flag.flag.rotation.z = Math.sin(elapsed * 3.1 + flag.phase) * .05;
      flag.group.rotation.z = Math.sin(elapsed * 1.4 + flag.phase) * .018;
    });

    smoke.forEach(puff => {
      const life = (elapsed * puff.speed + puff.phase) % 1;
      puff.object.position.set(
        Math.cos(puff.phase) * (life * 1.2),
        .5 + life * 3.2,
        Math.sin(puff.phase) * (life * .9)
      );
      puff.object.scale.setScalar(.4 + life * 1.4);
      puff.object.material.opacity = Math.sin(life * Math.PI) * .18;
    });

    fireflies.forEach(firefly => {
      const angle = elapsed * firefly.speed + firefly.phase;
      firefly.sprite.position.set(
        firefly.base.x + Math.cos(angle) * 1.4,
        firefly.base.y + Math.sin(angle * 2) * .55,
        firefly.base.z + Math.sin(angle) * 1.2
      );
      firefly.sprite.material.opacity = .55 + Math.sin(angle * 2.4) * .25;
    });

    animated.forEach(item => {
      item.object.rotation.z = Math.sin(elapsed * .65 + item.phase) * item.amplitude;
      item.object.rotation.x = Math.cos(elapsed * .48 + item.phase) * item.amplitude * .6;
    });
  }

  return {
    group,
    update,
    spawn: { x: -21, z: 25, yaw: -0.6 },
    env: { background: 0x17120d, fogColor: 0x17120d, fogDensity: 0.025 },
    doors: {
      next: { x: 13.1, z: -20.7 },
      prev: { x: -17, z: -17.2 }
    },
    relic: { name: "Enchanted Chalice", x: 20, z: -43 }
  };
}
