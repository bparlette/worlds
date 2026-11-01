#!/bin/bash
MODEL_DIR="$HOME/.models/Qwen3.5-4B-3D-Coder"
PORT="${PORT:-8082}"

echo "Starting Qwen3.5-4B-3D-Coder server (ctx-size 20480, FlashAttn, N-gram Speculative Decoding, Vision mmproj enabled) on 0.0.0.0:$PORT..."
exec /opt/homebrew/bin/llama-server \
  -m "$MODEL_DIR/Qwen3.5-4B-3D-Coder-Q4_K_M.gguf" \
  --mmproj "$MODEL_DIR/mmproj-Qwen3.5-4B-BF16.gguf" \
  --image-min-tokens 1024 \
  --reasoning off \
  --n-gpu-layers all \
  --flash-attn on \
  --ctx-size 20480 \
  --spec-type ngram-simple \
  --spec-ngram-simple-size-n 4 \
  --spec-ngram-simple-size-m 8 \
  --parallel 1 \
  --port "$PORT" \
  --host 0.0.0.0
