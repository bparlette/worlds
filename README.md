# Worlds & Back Roms — Complete Run & Deploy Guide

This repository hosts 900 retro game 3D WebGL diorama scenes and the **Back Roms** interactive first-person portal walkthrough.

- **Live Gallery**: [https://bparlette.github.io/worlds/](https://bparlette.github.io/worlds/)
- **Live Walker (Back Roms)**: [https://bparlette.github.io/worlds/walk/walker.html](https://bparlette.github.io/worlds/walk/walker.html)

---

## 1. Architecture & Pipeline

```
extract → generate → heal → lint → [ make_walker_module ] → registry + manifest
```

1. **Extraction (`extract_worlds.py`, `game_worlds_extracted.json`)**:
   - 900 canonical retro games extracted across Atari 2600/5200/7800, NES, SNES, Sega Genesis, Sega CD, and Classic Arcade.
   - Generates structured Three.js prompt briefs (`qwen_prompt`) specifying palette, geometry, and key gameplay landmarks.

2. **Autonomous Generation (`generate_worlds.py`)**:
   - Connects to local `llama-server` (running `Qwen3.5-4B-3D-Coder` on port 8082).
   - Generates standalone Three.js WebGL scenes in `scenes/<id>_<slug>.html` with up to 31,500 token completion budget.
   - Enforces strict constraints: ACESFilmicToneMapping, native orbit controls, Relic specification, and Glitch hygiene.

3. **AST Syntax Lint & Healer (`scene_linter.py`, `scene_healer.py`)**:
   - Parses code via Node.js AST and automatically repairs duplicate identifiers (`const clock`, `const renderer`), malformed canvas textures, and syntax errors.
   - Runs headless Google Chrome against each scene to confirm 0 console errors and verified WebGL execution.

4. **Walker Module Compiler (`make_walker_module.py`)**:
   - Converts diorama HTML into an exportable ES module: `walk/modules/<id>.js`.
   - Contract: `createWorld(THREE)` returning `{ group, update, spawn, relic, env, doors }`.
   - Runs headless Node §4 validation gate (mesh count > 0, non-throwing `update(t, dt)`, valid R8 relic placement).
   - Upserts into `walk/worlds.json` using `walk/tools/build-walk-manifest.mjs`.

5. **Continuous Deployment (`git_commit_and_push`)**:
   - Commits each completed world, gallery update, and walker module incrementally and pushes to `origin/main` on GitHub Pages.

---

## 2. Working with Local Qwen 3D-Coder

All runner scripts and server files are stored in `scripts/` and `qwen_studio/`.

### Prerequisites
- macOS (Apple Silicon recommended for Metal acceleration)
- `llama.cpp` (`llama-server`) installed via Homebrew or compiled with Metal support:
  ```bash
  brew install llama.cpp
  ```
- Node.js $\ge 18$ and Python $\ge 3.10$

### Starting the Model Daemon
Run the server launcher in `scripts/start_3d_coder.sh`:
```bash
./scripts/start_3d_coder.sh
```
Or directly:
```bash
MODEL_DIR="$HOME/.models/Qwen3.5-4B-3D-Coder"
llama-server \
  -m "$MODEL_DIR/Qwen3.5-4B-3D-Coder-Q4_K_M.gguf" \
  --mmproj "$MODEL_DIR/mmproj-Qwen3.5-4B-BF16.gguf" \
  --reasoning off \
  --n-gpu-layers all \
  --ctx-size 32768 \
  --parallel 1 \
  --port 8082 \
  --host 0.0.0.0
```

### Running 3D Coder Studio UI
Start the web studio UI server:
```bash
python3 qwen_studio/server.py
```
Open [http://localhost:8085](http://localhost:8085) to interactively generate and preview scenes.

---

## 3. Running the Worlds Pipeline

### Launch Continuous Batch Generation
To run the automated generation loop across the 900-game registry:
```bash
python3 generate_worlds.py 100
```
This runs continuously:
- Queries Qwen for the next uncompleted game.
- Heals and lints the output scene.
- Tests execution in headless Chrome.
- Compiles the Back Roms walker module and verifies §4 & R8 gates.
- Rebuilds `walk/worlds.json` and `index.html`.
- Commits and pushes to GitHub.

### Converting Existing Scenes to Walker Modules
To re-run walker conversion and relic placement on all completed scenes without using any AI tokens:
```bash
python3 make_walker_module.py
```

### Fallback Relic Placer
To place or inspect a relic for an individual module:
```bash
# Dry run candidate search
node walk/tools/add-relic.mjs walk/modules/007.js

# Insert relic
node walk/tools/add-relic.mjs walk/modules/007.js --write --name "Crown of the Mountain King"
```

### Regenerating Walker Manifest
```bash
node walk/tools/build-walk-manifest.mjs
```
