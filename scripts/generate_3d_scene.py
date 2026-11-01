#!/usr/bin/env python3
import sys, os, json, urllib.request, argparse

DEFAULT_SYSTEM_PROMPT = """Use only the Three.js core ES module from
https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js.
Do not import addons or legacy examples/js paths;
implement any camera controls directly inside the HTML."""

def main():
    parser = argparse.ArgumentParser(description="Generate 3D Three.js scenes using local Qwen3.5-4B-3D-Coder")
    parser.add_argument("prompt", help="Text prompt for the 3D scene")
    parser.add_argument("-o", "--output", default="scene.html", help="Output HTML file path (default: scene.html)")
    parser.add_argument("-p", "--port", type=int, default=8082, help="llama-server port (default: 8082)")
    parser.add_argument("-t", "--tokens", type=int, default=2500, help="Max output tokens (default: 2500)")
    parser.add_argument("--temp", type=float, default=0.7, help="Temperature (default: 0.7)")
    args = parser.parse_args()

    url = f"http://127.0.0.1:{args.port}/v1/chat/completions"
    payload = {
        "messages": [
            {"role": "system", "content": DEFAULT_SYSTEM_PROMPT},
            {"role": "user", "content": args.prompt}
        ],
        "max_tokens": args.tokens,
        "temperature": args.temp
    }

    print(f"Generating 3D scene from prompt: \"{args.prompt}\"...")
    req = urllib.request.Request(url, data=json.dumps(payload).encode(), headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            msg = data["choices"][0]["message"]
            content = msg.get("content", "")
            
            # Extract HTML from markdown code fence if present
            if "```html" in content:
                html = content.split("```html")[1].split("```")[0].strip()
            elif "```" in content:
                html = content.split("```")[1].split("```")[0].strip()
            else:
                html = content.strip()
                
            with open(args.output, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"✓ Saved 3D Three.js scene to: {os.path.abspath(args.output)} ({len(html)} bytes)")
    except Exception as e:
        print(f"Error querying model server on port {args.port}: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
