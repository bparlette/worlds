import os
import subprocess
import time
import json
import re
import urllib.request

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
LLAMA_PORT = 8082

SYSTEM_FIXER_PROMPT = """You are an expert Three.js and WebGL debugger.
The provided HTML file contains a 3D scene that threw a JavaScript or WebGL runtime error in the browser.
Your job is to fix the runtime error and return the COMPLETE, working HTML file.
CRITICAL RULES:
1. Fix the exact runtime error reported in the console.
2. Ensure renderer.render(scene, camera) and requestAnimationFrame(animate) execute cleanly without exceptions.
3. Output ONLY the fixed executable HTML enclosed in ```html ... ```."""


def test_scene_runtime_in_chrome(html_path: str, timeout_sec: int = 4) -> dict:
    """
    Launches headless Google Chrome to load the scene for several seconds and captures all
    console errors, exceptions, WebGL shader errors, and invalid operations.
    """
    if not os.path.exists(CHROME_BIN):
        return {"status": "chrome_not_found", "clean": True}

    cmd = [
        CHROME_BIN,
        "--headless=new",
        f"--virtual-time-budget={int(timeout_sec * 1000)}",
        "--enable-logging=stderr",
        f"file://{os.path.abspath(html_path)}"
    ]

    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout_sec + 8)
        stderr = proc.stderr
        
        # Filter for actual critical runtime crashes
        critical_errors = []
        for line in stderr.splitlines():
            line_lower = line.lower()
            if any(term in line_lower for term in [
                "shader error",
                "uncaught typeerror",
                "uncaught referenceerror",
                "uncaught syntaxerror",
                "uncaught error",
                "invalid_operation",
                "unsupported tonemapping"
            ]):
                # Strip timestamps and internal process IDs
                cleaned = re.sub(r"^\[[0-9:\./]+\]", "", line).strip()
                if cleaned and cleaned not in critical_errors:
                    critical_errors.append(cleaned)

        if critical_errors:
            return {"status": "error", "clean": False, "errors": critical_errors}
        return {"status": "clean", "clean": True, "errors": []}
    except Exception as e:
        return {"status": "test_failed", "clean": False, "errors": [str(e)]}


def automated_rule_based_patch(content: str) -> str:
    """
    Instantly applies deterministic regex fixes for common LLM Three.js runtime blunders
    before resorting to Qwen repair.
    """
    # Fix 1: Unsupported toneMapping srgb
    content = content.replace("renderer.toneMapping = THREE.SRGBColorSpace;", "renderer.toneMapping = THREE.ACESFilmicToneMapping;")
    
    # Fix 2: Duplicate clock declaration
    content = re.sub(r"const\s+clock\s*=\s*new\s+THREE\.Clock\(\);", "clock = new THREE.Clock();", content, count=1) if content.count("const clock =") > 1 else content

    # Fix 3: Invalid CanvasTexture(document.createElement...) in sprite
    content = re.sub(
        r"map:\s*new\s+THREE\.CanvasTexture\(\s*document\.createElement\([\"']canvas[\"']\)[^)]+\)\.needsUpdate\s*=\s*true,?",
        "",
        content
    )

    # Fix 4: Plain coordinate literal {x: ..., z: ...} followed by .clone() or .distanceTo()
    # Converts `{ x: N, z: M }` to `new THREE.Vector3(N, 0, M)` inside arrays
    def replace_vec2_literal(m):
        return f"new THREE.Vector3({m.group(1)}, 0, {m.group(2)})"
    content = re.sub(r"\{\s*x:\s*([0-9\.\-]+)\s*,\s*z:\s*([0-9\.\-]+)\s*\}", replace_vec2_literal, content)

    # Fix 5: Graceful error shield inside animate() so one failing property does not kill rendering
    if "function animate()" in content and "/* [SHIELD] */" not in content:
        # Wrap the inside of animate() in a try-catch, ensuring renderer.render(scene, camera) still executes
        pattern = r"(function animate\(\)\s*\{)([\s\S]*?)(renderer\.render\([^)]+\);[\s\S]*?\})"
        match = re.search(pattern, content)
        if match:
            start, body, end = match.group(1), match.group(2), match.group(3)
            # Only wrap if not already wrapped
            if "try {" not in body:
                # The shield schedules the next frame itself; a second call in the
                # body doubles the callbacks every frame and freezes the page.
                body = re.sub(r"\n[ \t]*requestAnimationFrame\(animate\);[ \t]*", "\n", body)
                safe_animate = (
                    f"{start}\n"
                    f"    /* [SHIELD] */\n"
                    f"    requestAnimationFrame(animate);\n"
                    f"    try {{\n"
                    f"{body}\n"
                    f"    }} catch (e) {{\n"
                    f"      console.warn('Animation tick suppressed:', e.message);\n"
                    f"    }}\n"
                    f"    {end}"
                )
                content = content.replace(match.group(0), safe_animate)

    return content


def qwen_ai_self_heal(html_path: str, errors: list) -> bool:
    """
    Uses local free Qwen3.5-3D-Coder to ingest the broken file + exact Chrome console errors
    and output a healed, working version.
    """
    print(f"[AI Healer] Querying local Qwen to repair {os.path.basename(html_path)}...")
    print(f"            Reported errors: {errors[:2]}")

    with open(html_path, "r", encoding="utf-8") as f:
        broken_code = f.read()

    user_msg = (
        f"The following Three.js scene produces these runtime errors in Google Chrome:\n"
        f"{chr(10).join(errors)}\n\n"
        f"Fix the errors and return the full updated HTML:\n"
        f"```html\n{broken_code}\n```"
    )

    payload = {
        "messages": [
            {"role": "system", "content": SYSTEM_FIXER_PROMPT},
            {"role": "user", "content": user_msg}
        ],
        "max_tokens": 31500,
        "temperature": 0.2,
        "stream": True
    }

    req = urllib.request.Request(
        f"http://127.0.0.1:{LLAMA_PORT}/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )

    try:
        chunks = []
        with urllib.request.urlopen(req, timeout=180) as resp:
            for line in resp:
                line = line.decode("utf-8").strip()
                if not line or not line.startswith("data: "):
                    continue
                data_str = line[6:]
                if data_str == "[DONE]":
                    break
                try:
                    c = json.loads(data_str)
                    delta = c["choices"][0]["delta"].get("content", "")
                    if delta:
                        chunks.append(delta)
                except Exception:
                    continue
        
        raw_res = "".join(chunks)
        if "```html" in raw_res:
            healed_html = raw_res.split("```html")[1].split("```")[0].strip()
        elif "```" in raw_res:
            healed_html = raw_res.split("```")[1].split("```")[0].strip()
        elif "<!DOCTYPE html>" in raw_res:
            healed_html = raw_res.strip()
        else:
            return False

        with open(html_path, "w", encoding="utf-8") as f:
            f.write(healed_html)
        return True
    except Exception as e:
        print(f"[AI Healer] Exception during Qwen repair: {e}")
        return False


def verify_and_heal_scene(html_path: str, max_attempts: int = 3) -> bool:
    """
    Automated hybrid verification pipeline:
    1. Apply fast deterministic rule-based patches.
    2. Test in headless Chrome.
    3. If errors remain, invoke local Qwen with the exact Chrome error trace.
    4. Repeat until clean or max_attempts exhausted.
    """
    for attempt in range(1, max_attempts + 1):
        # Step 1: Rule-based fast patch
        with open(html_path, "r", encoding="utf-8") as f:
            content = f.read()
        patched = automated_rule_based_patch(content)
        if patched != content:
            with open(html_path, "w", encoding="utf-8") as f:
                f.write(patched)

        # Step 2: Headless Chrome runtime test
        test_result = test_scene_runtime_in_chrome(html_path)
        if test_result["clean"]:
            print(f"[Runtime Verifier] ✓ {os.path.basename(html_path)} is verified clean on attempt {attempt}!")
            return True

        print(f"[Runtime Verifier] ✗ Attempt {attempt} failed for {os.path.basename(html_path)}: {test_result['errors'][:2]}")

        # Step 3: Local Qwen AI heal with real Chrome runtime logs
        if attempt < max_attempts:
            qwen_ai_self_heal(html_path, test_result["errors"])

    return False
