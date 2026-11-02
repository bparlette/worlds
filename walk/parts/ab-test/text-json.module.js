// @world {"id": "t100-002", "title": "Warp World", "sub": "Brick Warp Plaza", "system": ""}
// Built from text-json.json by make_parts_module.py (JSON parts pipeline — prompts/PARTS-PIPELINE.md).
// Parts: 37 entries -> 18 kept, 19 dropped, 20 repair(s) logged.
// Analytic bounds: 36.00 x 36.00 x 10.30 (w x d x h); normalization scale applied: 0.8333.

import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js";
import { buildParts } from "../parts.js";

const PARTS_DATA = {
 "fog": "#c9e3ee",
 "game": "Warp World",
 "ground": "#6a7157",
 "id": "t100-002",
 "parts": [
  {
   "c": "#59624e",
   "p": [
    0.0,
    -1.1,
    0.0
   ],
   "s": "gnd",
   "z": [
    34.0,
    2.2,
    34.0
   ]
  },
  {
   "c": "#6b3d2b",
   "p": [
    0.0,
    0.0,
    0.0
   ],
   "s": "box",
   "z": [
    32.0,
    0.28,
    32.0
   ]
  },
  {
   "c": "#718064",
   "p": [
    0.0,
    0.18,
    0.0
   ],
   "s": "box",
   "z": [
    32.0,
    0.055,
    32.0
   ]
  },
  {
   "c": "#8b3e2b",
   "p": [
    -14.0,
    3.2,
    -2.0
   ],
   "role": "wall",
   "s": "box",
   "z": [
    8.0,
    6.4,
    8.0
   ]
  },
  {
   "c": "#8b3e2b",
   "p": [
    14.0,
    3.2,
    -2.0
   ],
   "role": "wall",
   "s": "box",
   "z": [
    8.0,
    6.4,
    8.0
   ]
  },
  {
   "c": "#8b3e2b",
   "p": [
    0.0,
    3.2,
    -15.0
   ],
   "role": "wall",
   "s": "box",
   "z": [
    8.0,
    6.4,
    8.0
   ]
  },
  {
   "c": "#7f3929",
   "p": [
    0.0,
    3.2,
    14.0
   ],
   "role": "wall",
   "s": "box",
   "z": [
    4.0,
    3.2,
    4.0
   ]
  },
  {
   "c": "#d6b26b",
   "p": [
    0.0,
    6.4,
    -15.0
   ],
   "s": "box",
   "z": [
    0.6,
    0.6,
    0.6
   ]
  },
  {
   "a": "spin",
   "c": "#e8d29a",
   "p": [
    0.0,
    6.75,
    -15.0
   ],
   "s": "box",
   "z": [
    0.5,
    0.5,
    0.5
   ]
  },
  {
   "a": "sway",
   "c": "#d3a852",
   "p": [
    0.0,
    1.2,
    2.5
   ],
   "s": "box",
   "z": [
    1.5,
    1.5,
    1.5
   ]
  },
  {
   "a": "sway",
   "c": "#f0cf68",
   "p": [
    0.0,
    2.25,
    2.5
   ],
   "s": "box",
   "z": [
    0.75,
    0.75,
    0.75
   ]
  },
  {
   "a": "sway",
   "c": "#ffe08a",
   "p": [
    0.0,
    3.3,
    2.5
   ],
   "s": "box",
   "z": [
    0.55,
    0.55,
    0.55
   ]
  },
  {
   "a": "sway",
   "c": "#8a4933",
   "p": [
    -9.4,
    1.25,
    -3.7
   ],
   "s": "box",
   "z": [
    1.1,
    1.1,
    1.1
   ]
  },
  {
   "a": "sway",
   "c": "#b66a46",
   "p": [
    -9.4,
    2.35,
    -3.7
   ],
   "s": "box",
   "z": [
    0.9,
    0.9,
    0.9
   ]
  },
  {
   "a": "sway",
   "c": "#d98a62",
   "p": [
    -9.4,
    3.45,
    -3.7
   ],
   "s": "box",
   "z": [
    0.7,
    0.7,
    0.7
   ]
  },
  {
   "a": "sway",
   "c": "#8a4933",
   "p": [
    9.4,
    1.25,
    -3.7
   ],
   "s": "box",
   "z": [
    1.1,
    1.1,
    1.1
   ]
  },
  {
   "a": "sway",
   "c": "#b66a46",
   "p": [
    9.4,
    2.35,
    -3.7
   ],
   "s": "box",
   "z": [
    0.9,
    0.9,
    0.9
   ]
  },
  {
   "a": "sway",
   "c": "#d98a62",
   "p": [
    9.4,
    3.45,
    -3.7
   ],
   "s": "box",
   "z": [
    0.7,
    0.7,
    0.7
   ]
  }
 ],
 "sky": "#65b8e8",
 "title": "Brick Warp Plaza"
};

export function createWorld(THREE) {
  const built = buildParts(THREE, PARTS_DATA);
  const group = new THREE.Group();
  built.group.scale.setScalar(0.8333333333333334);
  group.add(built.group);

  function update(t, dt) {
    built.tickers.forEach((f) => { try { f(t); } catch (e) {} });
  }

  return {
    group,
    update,
    spawn: { x: 0.0, z: 12.9, yaw: 0 },
    relic: { id: "generic", name: "Warp World Relic", x: -8.3, z: -10.0 },
    env:   { background: 0x65b8e8, fogColor: 0xc9e3ee, fogDensity: 0.02 },
    doors: {
      next: { x: 0.0, z: -14.8 },
      prev: { x: 0.0, z: 14.8 }
    }
  };
}
