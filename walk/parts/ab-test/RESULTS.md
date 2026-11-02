# The 2x2 Build Test Results

**Test Target:** Super Mario Bros. — World 1-1 (Top-100 Rank 2)  
**Model:** Qwen3.5-4B-3D-Coder on :8082, temperature 0.6, max_tokens 14000  

| Run | Input | Format | Tokens | Characters | Seconds | Finish Reason | Conversion Outcome | Screenshot |
|---|---|---|---|---|---|---|---|---|
| `image-json` | image | json | 14000 | 19843 | 179.75s | `length` | FAIL: degenerate parts list (repair ratio 2.59: 363 exact duplicates removed of 140 raw entries, exceeds 0.35 limit) | `none` |
| `image-js` | image | js | 10170 | 29942 | 360.02s | `stop` | PASS: meshes=31, bbox min=[-14.62, -0.00, -14.62] max=[14.62, 12.65, 14.62], span=29.25x29.25x12.65 | `none` |
| `text-json` | text | json | 3364 | 4882 | 73.53s | `stop` | PASS: meshes=18/18, bbox 30.00 x 30.00 x 8.58, scale=0.8333, relic 'Warp World Relic' @ (-8.3, -10.0) | `text-json.png` |
| `text-js` | text | js | 6477 | 17697 | 223.47s | `stop` | FAIL: validation error: Cannot read properties of undefined (reading 'addScaledVector') | `none` |
