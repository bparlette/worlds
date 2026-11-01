"""
extract_worlds.py
Automated StrategyWiki / Retro Walkthrough Extractor.

v2 (2026-11-01, Moth): image-led extraction.
Measured on the first 36 generated worlds: long walkthrough-prose descriptions
verified at 23%, short templated briefs at 45% — the poison is length plus
irrelevance (gameplay steps fed as "environmental details"). v2 therefore:
  1. Resolves the PLACE page for the target area (e.g. Metroid/Norfair),
     not the game's walkthrough page.
  2. Extracts place text only: lead + target-section paragraphs, list items and
     Tips/Strategy/Enemies/Items/Notation sections dropped, sentences filtered
     to declarative place description (imperatives / second person removed).
  3. Distills a short brief (target, game, system + place sentences, whole
     sentences only, never truncated mid-sentence). Raw place text is kept in
     description_raw for audit; the brief is what reaches the generator.
  4. Attaches the area's best reference image (map > screenshot) as image_url;
     the generator leads with the image and falls back to the brief alone.
Run with --enrich [path] to upgrade an existing game_worlds_extracted.json
in place (fills brief / image fields for every entry).
"""

import concurrent.futures
import json
import re
import sys
import time
from urllib.parse import unquote, urlparse
from bs4 import BeautifulSoup
import requests

API_ENDPOINT = "https://strategywiki.org/w/api.php"
HEADERS = {
    "User-Agent": "RetroWorldExtractor/1.0 (Educational AI Research; contact: developer@example.com)"
}

# ---------------------------------------------------------------------------
# v1 helpers (kept — other tooling imports these)
# ---------------------------------------------------------------------------


def resolve_verified_url_and_title(game_title: str, candidate_url: str = None) -> tuple:
    """
    Uses MediaWiki OpenSearch to dynamically verify page existence on StrategyWiki.
    Checks for walkthrough/stage/gameplay subpages, or falls back to root article.
    Guarantees 100% valid MediaWiki pages with zero 404s.
    """
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
                # 1. Prefer Walkthrough subpage if exists
                for t, u in zip(titles, urls):
                    if "walkthrough" in t.lower():
                        return t, u
                # 2. Prefer Gameplay, Stages, or Levels subpage
                for t, u in zip(titles, urls):
                    if any(k in t.lower() for k in ["gameplay", "stage", "world", "area", "course", "track"]):
                        return t, u
                # 3. Fallback to the root article
                return titles[0], urls[0]
    except Exception:
        pass

    # Fallback from provided candidate url
    if candidate_url:
        path = urlparse(candidate_url).path
        title = unquote(path.split("/wiki/")[-1])
        return title, candidate_url

    return game_title, f"https://strategywiki.org/wiki/{game_title.replace(' ', '_')}"


def fetch_mediawiki_parse(page_title: str) -> str:
    params = {
        "action": "parse",
        "page": page_title,
        "format": "json"
    }
    try:
        resp = requests.get(API_ENDPOINT, params=params, headers=HEADERS, timeout=12)
        if resp.status_code == 200:
            data = resp.json()
            return data.get("parse", {}).get("text", {}).get("*", "")
    except Exception:
        pass
    return ""


def parse_clean_sections(html: str) -> list:
    if not html:
        return []
    soup = BeautifulSoup(html, "html.parser")
    content = soup.find("div", class_="mw-parser-output") or soup

    for tag in content.find_all(
        ["table", "script", "style", "noscript", "nav", "aside", "form", "header", "footer"]
    ):
        tag.decompose()
    for tag in content.find_all(
        class_=re.compile(r"(toc|navbox|infobox|mw-editsection|metadata|catlinks|portal|nav_box|guide_nav)")
    ):
        tag.decompose()

    sections = []
    current_heading = "Overview"
    current_paragraphs = []

    for el in content.find_all(["h2", "h3", "h4", "p", "li"]):
        if el.name in ["h2", "h3", "h4"]:
            heading = el.get_text(strip=True)
            if heading.lower() in ["contents", "references", "external links", "see also", "navigation"]:
                continue
            if current_paragraphs:
                combined = " ".join(current_paragraphs).strip()
                if len(combined) > 40:
                    sections.append({"heading": current_heading, "text": combined})
                current_paragraphs = []
            current_heading = heading
        elif el.name in ["p", "li"]:
            text = re.sub(r"\s+", " ", el.get_text(strip=True))
            if len(text) > 30 and not text.startswith("Jump to:"):
                current_paragraphs.append(text)

    if current_paragraphs:
        combined = " ".join(current_paragraphs).strip()
        if len(combined) > 40:
            sections.append({"heading": current_heading, "text": combined})

    return sections


# ---------------------------------------------------------------------------
# v2: place-page resolution, place-text filtering, brief, images
# ---------------------------------------------------------------------------

STOP_HEADINGS = {
    "tips", "strategy", "enemies", "enemy", "items", "item", "notation",
    "controls", "cheats", "secrets", "glitches", "references", "see also",
    "external links", "navigation", "contents", "walkthrough", "appendix",
}
TARGET_STOPWORDS = {
    "the", "of", "a", "an", "and", "in", "on", "to", "from", "part", "level",
}
IMPERATIVE_STARTS = {
    "go", "take", "head", "jump", "run", "shoot", "defeat", "collect",
    "grab", "avoid", "use", "press", "enter", "climb", "swim", "destroy",
    "kill", "hit", "open", "unlock", "get", "watch", "note", "make",
    "be", "do", "try", "keep", "move", "stand", "turn", "return", "cross",
    "fall", "drop", "push", "pull", "break", "ride", "follow", "look",
}
META_PHRASES = [
    "walkthrough", "this guide", "mandatory task", "optional task",
    "notation", "the player", "you must", "you will", "you can", "you'll",
    "your ", " you ", "1-up", "game over",
    "the game is", "can be played", "players", "status bar", "sub-screen",
    "mario or luigi", "must run", "in each level", "two-player",
    "the top of the", "the bottom of the", "is the heroine", "is the hero",
    "video game series", "miraculously survived",
]
SPATIAL_WORDS = {
    "above", "across", "around", "below", "beneath", "between", "beyond",
    "covered", "dotted", "features", "filled", "inside", "leads", "lined",
    "located", "near", "outside", "overlooks", "region", "rises", "sits",
    "stretches", "surrounded", "through", "under", "within", "consists",
    "contains", "home", "area", "cavern", "castle", "forest", "dungeon",
    "town", "village", "mountain", "river", "lake", "sea", "desert",
    "palace", "temple", "tower", "bridge", "cave", "island", "valley",
}
IMAGE_SKIP_WORDS = [
    "logo", "boxart", "box_art", "_box", "cover", "icon", "sprite", "controller",
    "cartridge", "manual", "flyer", "poster", "artwork", "portrait",
    "character", "enemy", "boss", "title_screen", "titlescreen",
    "_title", "title_", "marquee", "status", "enter_name", "name_screen",
]
IMAGE_MAP_WORDS = ["map", "layout", "diagram"]
IMAGE_SCREEN_WORDS = [
    "screenshot", "screen", "level", "area", "world", "stage", "course",
    "room", "scene",
]


def target_tokens(target: str) -> set:
    toks = set(re.findall(r"[a-z0-9]+", target.lower()))
    keep = {t for t in toks if t not in TARGET_STOPWORDS and len(t) > 1}
    keep |= {t for t in toks if re.fullmatch(r"\d+(-\d+)?", t)}
    return keep


def probe_existing_titles(titles: list) -> set:
    """One API call: which of these page titles actually exist?"""
    try:
        resp = requests.get(API_ENDPOINT, params={
            "action": "query", "titles": "|".join(titles), "format": "json",
        }, headers=HEADERS, timeout=12)
        if resp.status_code == 200:
            pages = resp.json().get("query", {}).get("pages", {})
            return {p["title"] for p in pages.values() if "missing" not in p}
    except Exception:
        pass
    return set()


def resolve_place_page(game: str, target: str) -> tuple:
    """Resolve the page ABOUT the target place. Returns (title, url).

    Primary: direct subpage probing — StrategyWiki names area pages
    Game/Area (Metroid/Norfair, The Legend of Zelda/Underworld,
    Super Mario Bros./World 1), and OpenSearch returns nothing for
    multi-word queries, so probing is the reliable route. Candidates are
    tried longest-first: the full target, then word prefixes, then the
    numeric head of a token like "1-1" (-> "World 1").
    """
    words = target.split()
    candidates = []
    for n in range(len(words), 0, -1):
        candidates.append(f"{game}/{' '.join(words[:n])}")
    if words and "-" in words[-1]:
        head = words[-1].split("-")[0]
        candidates.append(f"{game}/{' '.join(words[:-1] + [head])}".rstrip("/"))
    candidates.append(game)
    existing = probe_existing_titles(candidates)
    for cand in candidates:
        if cand in existing:
            return cand, f"https://strategywiki.org/wiki/{cand.replace(' ', '_')}"

    query = f"{game} {target}"
    params = {
        "action": "opensearch", "search": query, "limit": 10,
        "namespace": 0, "format": "json",
    }
    try:
        resp = requests.get(API_ENDPOINT, params=params, headers=HEADERS, timeout=8)
        if resp.status_code == 200:
            data = resp.json()
            titles = data[1] if len(data) > 1 else []
            urls = data[3] if len(data) > 3 else []
            toks = target_tokens(target)
            best, best_score = None, -10**9
            for t, u in zip(titles, urls):
                suffix = t.split("/", 1)[1] if "/" in t else ""
                suffix_toks = set(re.findall(r"[a-z0-9]+", suffix.lower()))
                title_toks = set(re.findall(r"[a-z0-9]+", t.lower()))
                score = 6 * len(toks & suffix_toks) + 3 * len(toks & title_toks)
                if "/" in t:
                    score += 2
                if "walkthrough" in t.lower():
                    score -= 5
                if score > best_score:
                    best, best_score = (t, u), score
            if best and best_score > -5:
                return best
    except Exception:
        pass
    return resolve_verified_url_and_title(game)


def parse_place_paragraphs(html: str) -> list:
    """Paragraph-only sections of a page (list items are instructions — dropped)."""
    if not html:
        return []
    soup = BeautifulSoup(html, "html.parser")
    content = soup.find("div", class_="mw-parser-output") or soup
    for tag in content.find_all(
        ["table", "script", "style", "noscript", "nav", "aside", "form", "header", "footer"]
    ):
        tag.decompose()
    for tag in content.find_all(
        class_=re.compile(r"(toc|navbox|infobox|mw-editsection|metadata|catlinks|portal|nav_box|guide_nav)")
    ):
        tag.decompose()

    sections = []
    heading = "Overview"
    paras = []

    def flush():
        if paras:
            sections.append({"heading": heading, "paragraphs": list(paras)})
            paras.clear()

    for el in content.find_all(["h2", "h3", "h4", "p"]):
        if el.name in ["h2", "h3", "h4"]:
            flush()
            heading = el.get_text(strip=True)
        else:
            text = re.sub(r"\s+", " ", el.get_text(strip=True))
            if len(text) > 30 and not text.startswith("Jump to:"):
                paras.append(text)
    flush()
    return sections


def split_sentences(text: str) -> list:
    parts = re.split(r"(?<=[.!?])\s+", text.replace("\n", " "))
    return [p.strip() for p in parts if len(p.strip()) > 15]


def filter_place_sentences(text: str, limit_chars: int = 420, max_sentences: int = 3) -> str:
    """Keep declarative place-describing sentences; drop imperatives/meta."""
    kept = []
    for sent in split_sentences(text):
        low = " " + sent.lower() + " "
        if any(m in low for m in META_PHRASES):
            continue
        first = re.findall(r"[a-z']+", sent.lower())
        if first and first[0] in IMPERATIVE_STARTS:
            continue
        words = set(re.findall(r"[a-z]+", sent.lower()))
        kept.append((len(words & SPATIAL_WORDS), sent))
    kept.sort(key=lambda kv: -kv[0])
    chosen = []
    total = 0
    for _, sent in kept:
        if len(chosen) >= max_sentences or total + len(sent) > limit_chars:
            continue
        chosen.append(sent)
        total += len(sent) + 1
    return " ".join(chosen).strip()


def extract_place_text(page_title: str, target: str) -> tuple:
    """Returns (place_text, raw_text): filtered brief material + audit raw."""
    html = fetch_mediawiki_parse(page_title)
    sections = parse_place_paragraphs(html)
    if not sections:
        return "", ""
    toks = target_tokens(target)
    lead = " ".join(sections[0]["paragraphs"])
    best_text, best_score = "", -1
    for s in sections:
        if any(h in s["heading"].lower() for h in STOP_HEADINGS):
            continue
        text = " ".join(s["paragraphs"])
        h_toks = set(re.findall(r"[a-z0-9]+", s["heading"].lower()))
        score = 4 * len(toks & h_toks) + len(toks & set(re.findall(r"[a-z0-9]+", text[:300].lower())))
        if score > best_score:
            best_score, best_text = score, text
    raw = best_text or lead
    place = filter_place_sentences(best_text) or filter_place_sentences(lead)
    return place, raw[:900]


def fetch_page_images(page_title: str, limit: int = 2) -> list:
    """Best reference images on the page: best map + best screenshot.

    The model takes 1-3 images; the useful pair is one MAP (layout) and one
    SCREENSHOT (palette/mood) — they carry different information. Returns a
    list of (url, kind), map first, length 0..limit.
    """
    try:
        resp = requests.get(API_ENDPOINT, params={
            "action": "query", "prop": "images", "titles": page_title,
            "imlimit": 50, "format": "json",
        }, headers=HEADERS, timeout=10)
        if resp.status_code != 200:
            return []
        pages = resp.json().get("query", {}).get("pages", {})
        titles = []
        for pg in pages.values():
            for im in pg.get("images", []) or []:
                titles.append(im["title"])
        if not titles:
            return []
        resp = requests.get(API_ENDPOINT, params={
            "action": "query", "prop": "imageinfo", "titles": "|".join(titles[:50]),
            "iiprop": "url|size", "iiurlwidth": 800, "format": "json",
        }, headers=HEADERS, timeout=12)
        if resp.status_code != 200:
            return []
        pages = resp.json().get("query", {}).get("pages", {})
        cands = []
        for pg in pages.values():
            info = (pg.get("imageinfo") or [{}])[0]
            url = info.get("thumburl") or info.get("url") or ""
            name = pg.get("title", "").lower().replace(" ", "_")
            width = info.get("width", 0)
            if not url or width < 150:
                continue
            if any(w in name for w in IMAGE_SKIP_WORDS):
                continue
            if any(w in name for w in IMAGE_MAP_WORDS):
                cands.append((0, -width, url, "map"))
            elif any(w in name for w in IMAGE_SCREEN_WORDS) or name.endswith((".png", ".jpg", ".jpeg")):
                cands.append((1, -width, url, "screenshot"))
        if not cands:
            return []
        cands.sort()
        picked, seen_kinds = [], set()
        for _, _, url, kind in cands:
            if kind in seen_kinds:
                continue
            picked.append((url, kind))
            seen_kinds.add(kind)
            if len(picked) >= limit:
                break
        return picked
    except Exception:
        return []


def fetch_page_image(page_title: str) -> tuple:
    """Backwards-compatible single best image: (url, kind) or ("", "")."""
    imgs = fetch_page_images(page_title, limit=1)
    return imgs[0] if imgs else ("", "")


def collect_images(place_title: str, game: str, spec: dict = None) -> list:
    """The image set for a world: 1 good image by default, 2 when they
    complement. A place-page screenshot gets paired with the game article's
    map (layout) when one exists — e.g. Norfair's screenshot + the Zebes map.
    A map alone stays alone: it is the best single image there is.
    """
    images = fetch_page_images(place_title)
    if not images:
        for alt_title in (game, None):
            if alt_title is None:
                alt_title, _ = resolve_verified_url_and_title(game, (spec or {}).get("url"))
            if alt_title != place_title:
                images = fetch_page_images(alt_title)
                if images:
                    break
    elif len(images) == 1 and images[0][1] == "screenshot" and game != place_title:
        # Complete the pair with a map from the game article or its walkthrough
        for src_title in (game, f"{game}/Walkthrough"):
            if src_title == place_title:
                continue
            found = False
            for u, k in fetch_page_images(src_title):
                if k == "map":
                    images = [(u, k), images[0]]
                    found = True
                    break
            if found:
                break
    return images[:2]


def build_brief(game: str, target: str, platform: str, place_text: str) -> str:
    head = f"{target}, {game} ({platform})."
    if place_text:
        return f"{head} {place_text}"
    return f"{head} A vivid classic environment representing {target} from {game}."


def build_prompt(game: str, target: str, platform: str, brief: str, has_image: bool) -> str:
    if has_image:
        return (
            f"Generate a fully interactive 3D WebGL Three.js world representing '{target}' from {game} ({platform}). "
            f"The attached reference imagery is the primary guide: match its layout, landmarks, colors and mood. "
            f"World brief: {brief} "
            f"Include lighting, fog, textures/materials, animated environmental elements, and mouse/touch orbit camera controls."
        )
    return (
        f"Generate a fully interactive 3D WebGL Three.js world representing '{target}' from {game} ({platform}). "
        f"World brief: {brief} "
        f"Include lighting, fog, textures/materials, animated environmental elements, and mouse/touch orbit camera controls."
    )


def scrape_world_v2(spec: dict) -> dict:
    game = spec["game"]
    target = spec["target"]
    platform = spec.get("platform", "Retro")

    place_title, place_url = resolve_place_page(game, target)
    place_text, raw_text = extract_place_text(place_title, target)
    images = collect_images(place_title, game, spec)
    image_url, image_kind = images[0] if images else ("", "")

    brief = build_brief(game, target, platform, place_text)
    prompt = build_prompt(game, target, platform, brief, bool(images))

    return {
        "id": spec["id"],
        "platform": platform,
        "game": game,
        "target": target,
        "url": place_url,
        "page_title": place_title,
        "section_count": 0,
        "description": brief,
        "description_raw": raw_text,
        "brief": brief,
        "image_url": image_url,
        "image_kind": image_kind,
        "image_urls": [u for u, _ in images],
        "image_kinds": [k for _, k in images],
        "qwen_prompt": prompt,
    }


# Backwards-compatible name: the pipeline driver calls scrape_world.
def scrape_world(spec: dict) -> dict:
    return scrape_world_v2(spec)


# ---------------------------------------------------------------------------
# --enrich: upgrade an existing catalog in place
# ---------------------------------------------------------------------------


def enrich_catalog(path: str):
    with open(path, "r", encoding="utf-8") as f:
        specs = json.load(f)
    todo = [s for s in specs if not s.get("brief")]
    print(f"[enrich] {len(specs)} entries, {len(todo)} need v2 extraction", flush=True)
    done = {"n": 0, "img": 0}

    def work(spec):
        try:
            return scrape_world_v2(spec)
        except Exception as e:
            print(f"[enrich] #{spec.get('id')} failed: {e}", flush=True)
            return None

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        futures = {ex.submit(work, s): s for s in todo}
        by_id = {s["id"]: s for s in specs}
        for fut in concurrent.futures.as_completed(futures):
            res = fut.result()
            if res:
                by_id[res["id"]].update(res)
                done["n"] += 1
                if res.get("image_url"):
                    done["img"] += 1
            if done["n"] and done["n"] % 100 == 0:
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(specs, f, indent=1)
                print(f"[enrich] checkpoint {done['n']}/{len(todo)} (images: {done['img']})", flush=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(specs, f, indent=1)
    print(f"[enrich] DONE: {done['n']} enriched, {done['img']} with images", flush=True)




def enrich_images(path: str):
    """Pass 2: populate image_urls/image_kinds from each entry's stored
    page_title (no re-resolution, no re-parse — just the images query)."""
    with open(path, "r", encoding="utf-8") as f:
        specs = json.load(f)
    todo = [s for s in specs if not s.get("image_urls")]
    print(f"[enrich-images] {len(specs)} entries, {len(todo)} need image sets", flush=True)
    done = {"n": 0, "img": 0}

    def work(spec):
        title = spec.get("page_title") or spec.get("game", "")
        return spec["id"], collect_images(title, spec.get("game", ""), spec)

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        futures = {ex.submit(work, s): s for s in todo}
        by_id = {s["id"]: s for s in specs}
        for fut in concurrent.futures.as_completed(futures):
            try:
                sid, imgs = fut.result()
            except Exception:
                continue
            if imgs:
                e = by_id[sid]
                e["image_urls"] = [u for u, _ in imgs]
                e["image_kinds"] = [k for _, k in imgs]
                e["image_url"], e["image_kind"] = imgs[0]
                e["qwen_prompt"] = build_prompt(
                    e["game"], e["target"], e.get("platform", "Retro"),
                    e.get("brief") or e.get("description", ""), True)
                done["img"] += 1
            done["n"] += 1
            if done["n"] % 200 == 0:
                with open(path, "w", encoding="utf-8") as f:
                    json.dump(specs, f, indent=1)
                print(f"[enrich-images] checkpoint {done['n']}/{len(todo)} (sets: {done['img']})", flush=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(specs, f, indent=1)
    print(f"[enrich-images] DONE: {done['n']} processed, {done['img']} with image sets", flush=True)


if __name__ == "__main__":
    if len(sys.argv) >= 2 and sys.argv[1] == "--enrich":
        enrich_catalog(sys.argv[2] if len(sys.argv) > 2 else "game_worlds_extracted.json")
    elif len(sys.argv) >= 2 and sys.argv[1] == "--enrich-images":
        enrich_images(sys.argv[2] if len(sys.argv) > 2 else "game_worlds_extracted.json")
    else:
        print("Usage: extract_worlds.py --enrich|--enrich-images [game_worlds_extracted.json]")
