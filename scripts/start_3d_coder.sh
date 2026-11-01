#!/bin/bash
MODEL_DIR="$HOME/.models/Qwen3.5-4B-3D-Coder"
PORT="${PORT:-8082}"

echo "Starting Qwen3.5-4B-3D-Coder server (ctx-size 32768) on 0.0.0.0:$PORT..."
exec /opt/homebrew/bin/llama-server \
  -m "$MODEL_DIR/Qwen3.5-4B-3D-Coder-Q4_K_M.gguf" \
  --mmproj "$MODEL_DIR/mmproj-Qwen3.5-4B-BF16.gguf" \
  --reasoning off \
  --n-gpu-layers all \
  --ctx-size 32768 \
  --parallel 1 \
  --port "$PORT" \
  --host 0.0.0.0
