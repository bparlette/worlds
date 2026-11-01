#!/usr/bin/env python3
import os, sys, json, time, uuid, re, threading
import urllib.request, urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8085
LLAMA_SERVER_PORT = 8082
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCENES_DIR = os.path.join(BASE_DIR, "scenes")
HISTORY_FILE = os.path.join(BASE_DIR, "history.json")
JOBS_FILE = os.path.join(BASE_DIR, "jobs.json")

os.makedirs(SCENES_DIR, exist_ok=True)

DEFAULT_SYSTEM_PROMPT = """Use only the Three.js core ES module from
https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.module.min.js.
Do not import addons or legacy examples/js paths;
implement any camera controls directly inside the HTML."""

def load_json(path, default):
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return default
    return default

def save_json(path, data):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, path)

# Initialize files
if not os.path.exists(HISTORY_FILE):
    # Check if there is an existing scene to populate
    initial_history = []
    for f in os.listdir(SCENES_DIR):
        if f.endswith(".html"):
            initial_history.append({
                "scene_id": f.replace(".html", ""),
                "title": "Rainy Amber Market",
                "filename": f,
                "scene_url": f"/scenes/{f}",
                "prompt": "Rainy amber market street",
                "created_at": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(os.path.getmtime(os.path.join(SCENES_DIR, f))))
            })
    save_json(HISTORY_FILE, initial_history)

def background_worker(job_id, prompt, image_data):
    jobs = load_json(JOBS_FILE, {})
    jobs[job_id] = {
        "status": "processing",
        "prompt": prompt,
        "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "result": None
    }
    save_json(JOBS_FILE, jobs)

    try:
        user_content = []
        if image_data:
            user_content.append({"type": "image_url", "image_url": {"url": image_data}})
        if prompt:
            user_content.append({"type": "text", "text": prompt})
        else:
            user_content.append({"type": "text", "text": "create this scene using voxels 3d"})

        payload = {
            "messages": [
                {"role": "system", "content": DEFAULT_SYSTEM_PROMPT},
                {"role": "user", "content": user_content if image_data else prompt}
            ],
            "max_tokens": 31500,
            "temperature": 0.7
        }

        llama_url = f"http://127.0.0.1:{LLAMA_SERVER_PORT}/v1/chat/completions"
        req = urllib.request.Request(
            llama_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )

        with urllib.request.urlopen(req, timeout=600) as resp:
            resp_json = json.loads(resp.read().decode("utf-8"))
            msg = resp_json["choices"][0]["message"]
            raw_content = msg.get("content", "")

        # Extract HTML
        if "```html" in raw_content:
            html_code = raw_content.split("```html")[1].split("```")[0].strip()
        elif "```" in raw_content:
            html_code = raw_content.split("```")[1].split("```")[0].strip()
        elif "<!DOCTYPE html>" in raw_content or "<html" in raw_content:
            html_code = raw_content.strip()
        else:
            html_code = f"<!DOCTYPE html><html><body><pre>{raw_content}</pre></body></html>"

        # Try to extract title from <title> tag
        title_match = re.search(r"<title>(.*?)</title>", html_code, re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else prompt[:30]

        scene_id = f"scene_{int(time.time())}_{uuid.uuid4().hex[:6]}"
        filename = f"{scene_id}.html"
        filepath = os.path.join(SCENES_DIR, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_code)

        result_item = {
            "scene_id": scene_id,
            "title": title,
            "filename": filename,
            "scene_url": f"/scenes/{filename}",
            "prompt": prompt,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S")
        }

        # Save to history
        history = load_json(HISTORY_FILE, [])
        history.insert(0, result_item)
        save_json(HISTORY_FILE, history)

        jobs = load_json(JOBS_FILE, {})
        jobs[job_id] = {
            "status": "completed",
            "prompt": prompt,
            "result": result_item
        }
        save_json(JOBS_FILE, jobs)

    except Exception as e:
        jobs = load_json(JOBS_FILE, {})
        jobs[job_id] = {
            "status": "failed",
            "prompt": prompt,
            "error": str(e)
        }
        save_json(JOBS_FILE, jobs)

class ThreeJSCoderHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean_path = path.split('?', 1)[0].split('#', 1)[0]
        if clean_path.startswith("/scenes/"):
            rel = clean_path[len("/scenes/"):]
            return os.path.join(SCENES_DIR, rel)
        elif clean_path == "/" or clean_path == "/index.html":
            return os.path.join(BASE_DIR, "index.html")
        return os.path.join(BASE_DIR, clean_path.lstrip("/"))

    def do_GET(self):
        clean_path = self.path.split('?', 1)[0]
        if clean_path == "/api/history":
            history = load_json(HISTORY_FILE, [])
            res_bytes = json.dumps(history).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(res_bytes)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(res_bytes)
            return
        elif clean_path.startswith("/api/job/"):
            job_id = clean_path[len("/api/job/"):]
            jobs = load_json(JOBS_FILE, {})
            job = jobs.get(job_id, {"status": "not_found"})
            res_bytes = json.dumps(job).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(res_bytes)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(res_bytes)
            return

        super().do_GET()

    def do_POST(self):
        if self.path == "/api/generate":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length).decode("utf-8")
            try:
                data = json.loads(body)
                prompt = data.get("prompt", "").strip()
                image_data = data.get("image", None)

                job_id = f"job_{int(time.time())}_{uuid.uuid4().hex[:6]}"
                
                # Launch thread so phone browser never times out or drops connection!
                t = threading.Thread(target=background_worker, args=(job_id, prompt, image_data), daemon=True)
                t.start()

                res_bytes = json.dumps({
                    "success": True,
                    "job_id": job_id,
                    "status": "processing"
                }).encode("utf-8")

                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(res_bytes)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(res_bytes)
            except Exception as e:
                err_bytes = json.dumps({"success": False, "error": str(e)}).encode("utf-8")
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(err_bytes)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(err_bytes)
        else:
            self.send_error(404, "Not Found")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", PORT), ThreeJSCoderHandler)
    print(f"Async 3D Coder Server with Persistent History running on http://0.0.0.0:{PORT}")
    server.serve_forever()
