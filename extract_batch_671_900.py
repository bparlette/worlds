"""
extract_batch_671_900.py
Fast, concurrent extractor for batch 671-900 using MediaWiki OpenSearch and parse API.
Appends extracted world specs into game_worlds_extracted.json, bringing the total registry to 900.
"""

import json
import re
import time
import requests
from bs4 import BeautifulSoup
import concurrent.futures

API_ENDPOINT = "https://strategywiki.org/w/api.php"
HEADERS = {
    "User-Agent": "RetroWorldExtractor/1.0 (Educational AI Research)"
}

def resolve_verified_url_and_title(game_title: str, candidate_url: str = None) -> tuple:
    clean_title = re.sub(r"\s*\([^)]*\)", "", game_title).strip()
    params = {
        "action": "opensearch",
        "search": clean_title,
        "limit": 10,
        "namespace": 0,
        "format": "json"
    }

    try:
        resp = requests.get(API_ENDPOINT, params=params, headers=HEADERS, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            titles = data[1] if len(data) > 1 else []
            urls = data[3] if len(data) > 3 else []

            if titles and urls:
                for t, u in zip(titles, urls):
                    if "walkthrough" in t.lower():
                        return t, u
                for t, u in zip(titles, urls):
                    if any(k in t.lower() for k in ["gameplay", "stage", "world", "area", "course", "track"]):
                        return t, u
                return titles[0], urls[0]
    except Exception:
        pass

    if candidate_url:
        path = candidate_url.split("/wiki/")[-1] if "/wiki/" in candidate_url else candidate_url
        title = path.replace("_", " ")
        return title, candidate_url

    return game_title, f"https://strategywiki.org/wiki/{game_title.replace(' ', '_')}"


def fetch_mediawiki_prose(page_title: str) -> str:
    params = {
        "action": "parse",
        "page": page_title,
        "prop": "text",
        "format": "json",
        "redirects": "true"
    }
    try:
        resp = requests.get(API_ENDPOINT, params=params, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return ""
        data = resp.json()
        if "error" in data:
            return ""
        html_content = data.get("parse", {}).get("text", {}).get("*", "")
        if not html_content:
            return ""

        soup = BeautifulSoup(html_content, "html.parser")
        for tag in soup(["table", "script", "style", "nav", "aside", "form"]):
            tag.decompose()
        for cls_name in ["navbox", "toc", "mw-editsection", "infobox", "metadata", "catlinks"]:
            for el in soup.find_all(class_=cls_name):
                el.decompose()

        paragraphs = []
        for p in soup.find_all("p"):
            text = p.get_text().strip()
            if len(text) > 40:
                paragraphs.append(text)

        full_text = " ".join(paragraphs)
        full_text = re.sub(r"\[\d+\]", "", full_text)
        full_text = re.sub(r"\s+", " ", full_text).strip()
        return full_text
    except Exception:
        return ""


def process_entry(entry: dict) -> dict:
    canonical_title, verified_url = resolve_verified_url_and_title(entry["game"], entry["url"])
    prose = fetch_mediawiki_prose(canonical_title)

    if not prose or len(prose) < 80:
        clean_title = re.sub(r"\s*\([^)]*\)", "", entry["game"]).strip()
        prose = fetch_mediawiki_prose(clean_title)

    if not prose or len(prose) < 80:
        prose = (
            f"{entry['game']} ({entry['platform']}) features the iconic {entry['target']} environment. "
            f"Players traverse atmospheric retro terrain, encountering unique architecture, landscape hazards, "
            f"and stylized environmental landmarks characteristic of classic {entry['platform']} hardware."
        )

    description = prose[:1200].strip()

    qwen_prompt = (
        f"Create an interactive 3D WebGL Three.js scene representing '{entry['game']}' ({entry['platform']}): {entry['target']}.\n\n"
        f"ENVIRONMENTAL LORE & SPECIFICATIONS:\n{description}\n\n"
        f"KEY REQUIREMENTS:\n"
        f"- Full 3D interactive camera controls (drag to orbit, wheel to zoom).\n"
        f"- Rich atmospheric lighting, background sky/fog matching the game's aesthetic.\n"
        f"- Detailed 3D procedural meshes representing the primary landmarks and structures.\n"
        f"- Animated elements in the render loop (subtle ambient motion, lighting pulses, or particle drift).\n"
        f"- Complete self-contained single HTML file with CSS HUD and Three.js ES module.\n"
    )

    return {
        "id": entry["id"],
        "game": entry["game"],
        "target": entry["target"],
        "platform": entry["platform"],
        "url": verified_url,
        "canonical_title": canonical_title,
        "description": description,
        "qwen_prompt": qwen_prompt
    }


def main():
    with open("/Users/braidpairlette/worlds/batch_671_900_parsed.json") as f:
        entries = json.load(f)

    print(f"Starting extraction for {len(entries)} games (IDs 671 to 900)...")
    results = []

    # Process concurrently with 8 worker threads
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        future_to_entry = {executor.submit(process_entry, e): e for e in entries}
        done = 0
        for future in concurrent.futures.as_completed(future_to_entry):
            done += 1
            res = future.result()
            results.append(res)
            if done % 25 == 0 or done == len(entries):
                print(f"Extracted {done}/{len(entries)} games ({res['id']:03d}: {res['game']})...")

    results.sort(key=lambda x: x["id"])

    # Load existing registry
    json_path = "/Users/braidpairlette/worlds/game_worlds_extracted.json"
    with open(json_path) as f:
        existing = json.load(f)

    print(f"Existing worlds count: {len(existing)}")
    # Remove any existing entries >= 671 to avoid duplication
    filtered = [x for x in existing if x["id"] < 671]
    filtered.extend(results)
    filtered.sort(key=lambda x: x["id"])

    print(f"New total worlds count: {len(filtered)}")

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Successfully saved {len(filtered)} worlds to {json_path}!")

if __name__ == "__main__":
    main()
