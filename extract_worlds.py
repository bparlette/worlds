"""
extract_worlds.py
Automated StrategyWiki / Retro Walkthrough Extractor.
Uses StrategyWiki's MediaWiki API to bypass Cloudflare challenge bot blocks,
resolves guide subpages / stage routes, and extracts clean, rich prose descriptions
for all 100 video game worlds.
"""

import concurrent.futures
import json
import re
import time
from urllib.parse import unquote, urlparse
from bs4 import BeautifulSoup
import requests

API_ENDPOINT = "https://strategywiki.org/w/api.php"
HEADERS = {
    "User-Agent": "RetroWorldExtractor/1.0 (Educational AI Research; contact: developer@example.com)"
}

WORLD_SPECS = [
    # Atari 2600
    {"id": 1, "platform": "Atari 2600", "game": "Adventure", "target": "Castles & Mazes", "url": "https://strategywiki.org/wiki/Adventure_(Atari_2600)/Walkthrough"},
    {"id": 2, "platform": "Atari 2600", "game": "Pitfall!", "target": "Jungle & Underworld", "url": "https://strategywiki.org/wiki/Pitfall!/Walkthrough"},
    {"id": 3, "platform": "Atari 2600", "game": "Haunted House", "target": "Ghost Mansion", "url": "https://strategywiki.org/wiki/Haunted_House/Walkthrough"},
    {"id": 4, "platform": "Atari 2600", "game": "Yars' Revenge", "target": "Neutral Zone & Shield", "url": "https://strategywiki.org/wiki/Yars%27_Revenge"},
    {"id": 5, "platform": "Atari 2600", "game": "River Raid", "target": "Canyon Riverway", "url": "https://strategywiki.org/wiki/River_Raid"},
    {"id": 6, "platform": "Atari 2600", "game": "Solaris", "target": "Stellar Quadrants & Canyons", "url": "https://strategywiki.org/wiki/Solaris_(Atari_2600)/Walkthrough"},
    {"id": 7, "platform": "Atari 2600", "game": "Mountain King", "target": "Diamond Caverns", "url": "https://strategywiki.org/wiki/Mountain_King"},
    {"id": 8, "platform": "Atari 2600", "game": "Berzerk", "target": "Electrified Neon Maze", "url": "https://strategywiki.org/wiki/Berzerk"},
    {"id": 9, "platform": "Atari 2600", "game": "Warlords", "target": "Quadrant Fortresses", "url": "https://strategywiki.org/wiki/Warlords_(1980)"},

    # NES
    {"id": 10, "platform": "NES", "game": "Super Mario Bros.", "target": "World 1-1", "url": "https://strategywiki.org/wiki/Super_Mario_Bros./Walkthrough"},
    {"id": 11, "platform": "NES", "game": "Super Mario Bros. 3", "target": "Dark Land Airships", "url": "https://strategywiki.org/wiki/Super_Mario_Bros._3/Walkthrough"},
    {"id": 12, "platform": "NES", "game": "The Legend of Zelda", "target": "Underworld Dungeons", "url": "https://strategywiki.org/wiki/The_Legend_of_Zelda/Walkthrough"},
    {"id": 13, "platform": "NES", "game": "Zelda II: The Adventure of Link", "target": "Palace Temples", "url": "https://strategywiki.org/wiki/Zelda_II:_The_Adventure_of_Link/Walkthrough"},
    {"id": 14, "platform": "NES", "game": "Metroid", "target": "Norfair Volcanic Caverns", "url": "https://strategywiki.org/wiki/Metroid/Walkthrough"},
    {"id": 15, "platform": "NES", "game": "Castlevania", "target": "Clock Tower", "url": "https://strategywiki.org/wiki/Castlevania/Walkthrough"},
    {"id": 16, "platform": "NES", "game": "Mega Man 2", "target": "Bubble Man's Underwater Lair", "url": "https://strategywiki.org/wiki/Mega_Man_2/Walkthrough"},
    {"id": 17, "platform": "NES", "game": "Contra", "target": "Jungle Waterfall", "url": "https://strategywiki.org/wiki/Contra/Walkthrough"},
    {"id": 18, "platform": "NES", "game": "Ninja Gaiden", "target": "Downtown Neon Rooftops", "url": "https://strategywiki.org/wiki/Ninja_Gaiden_(NES)/Walkthrough"},
    {"id": 19, "platform": "NES", "game": "Blaster Master", "target": "Area 1 Underworld", "url": "https://strategywiki.org/wiki/Blaster_Master/Walkthrough"},
    {"id": 20, "platform": "NES", "game": "Bionic Commando", "target": "Neutral Area Military Base", "url": "https://strategywiki.org/wiki/Bionic_Commando_(NES)/Walkthrough"},
    {"id": 21, "platform": "NES", "game": "DuckTales", "target": "The Moon Base", "url": "https://strategywiki.org/wiki/DuckTales/Walkthrough"},
    {"id": 22, "platform": "NES", "game": "Kid Icarus", "target": "Sky World Floating Palace", "url": "https://strategywiki.org/wiki/Kid_Icarus/Walkthrough"},
    {"id": 23, "platform": "NES", "game": "StarTropics", "target": "Submerged Coral Caverns", "url": "https://strategywiki.org/wiki/StarTropics/Walkthrough"},
    {"id": 24, "platform": "NES", "game": "Kirby's Adventure", "target": "Rainbow Resort", "url": "https://strategywiki.org/wiki/Kirby%27s_Adventure/Walkthrough"},
    {"id": 25, "platform": "NES", "game": "EarthBound Beginnings", "target": "Magicant", "url": "https://strategywiki.org/wiki/EarthBound_Beginnings/Walkthrough"},
    {"id": 26, "platform": "NES", "game": "Final Fantasy", "target": "Flying Fortress", "url": "https://strategywiki.org/wiki/Final_Fantasy/Walkthrough"},
    {"id": 27, "platform": "NES", "game": "Dragon Warrior", "target": "Charlock Castle", "url": "https://strategywiki.org/wiki/Dragon_Warrior/Walkthrough"},
    {"id": 28, "platform": "NES", "game": "Batman", "target": "Axis Chemical Factory", "url": "https://strategywiki.org/wiki/Batman:_The_Video_Game_(NES)/Walkthrough"},
    {"id": 29, "platform": "NES", "game": "Rygar", "target": "Lapis Valley", "url": "https://strategywiki.org/wiki/Rygar_(NES)/Walkthrough"},
    {"id": 30, "platform": "NES", "game": "Shadowgate", "target": "Castle Crypt", "url": "https://strategywiki.org/wiki/Shadowgate/Walkthrough"},
    {"id": 31, "platform": "NES", "game": "Crystalis", "target": "Floating Tower of Babylon", "url": "https://strategywiki.org/wiki/Crystalis/Walkthrough"},
    {"id": 32, "platform": "NES", "game": "A Boy and His Blob", "target": "Blobolonia", "url": "https://strategywiki.org/wiki/A_Boy_and_His_Blob:_Trouble_on_Blobolonia/Walkthrough"},
    {"id": 33, "platform": "NES", "game": "Little Samson", "target": "Molten Volcanic Caverns", "url": "https://strategywiki.org/wiki/Little_Samson"},

    # SNES
    {"id": 34, "platform": "SNES", "game": "Super Mario World", "target": "Forest of Illusion", "url": "https://strategywiki.org/wiki/Super_Mario_World/Walkthrough"},
    {"id": 35, "platform": "SNES", "game": "Yoshi's Island", "target": "Pastel Crayon Hills", "url": "https://strategywiki.org/wiki/Super_Mario_World_2:_Yoshi%27s_Island/Walkthrough"},
    {"id": 36, "platform": "SNES", "game": "A Link to the Past", "target": "Dark World Pyramid", "url": "https://strategywiki.org/wiki/The_Legend_of_Zelda:_A_Link_to_the_Past/Walkthrough"},
    {"id": 37, "platform": "SNES", "game": "Super Metroid", "target": "Maridia Submerged Depths", "url": "https://strategywiki.org/wiki/Super_Metroid/Walkthrough"},
    {"id": 38, "platform": "SNES", "game": "Chrono Trigger", "target": "2300 A.D. Ruined Domes", "url": "https://strategywiki.org/wiki/Chrono_Trigger/Walkthrough"},
    {"id": 39, "platform": "SNES", "game": "Chrono Trigger", "target": "65,000,000 B.C. Tyrano Lair", "url": "https://strategywiki.org/wiki/Chrono_Trigger/Walkthrough/Chapter_19"},
    {"id": 40, "platform": "SNES", "game": "Final Fantasy VI", "target": "Magitek Research Facility", "url": "https://strategywiki.org/wiki/Final_Fantasy_VI/Walkthrough"},
    {"id": 41, "platform": "SNES", "game": "EarthBound", "target": "Moonside Neon Grid", "url": "https://strategywiki.org/wiki/EarthBound/Walkthrough"},
    {"id": 42, "platform": "SNES", "game": "Donkey Kong Country", "target": "Mine Cart Carnage", "url": "https://strategywiki.org/wiki/Donkey_Kong_Country/Walkthrough"},
    {"id": 43, "platform": "SNES", "game": "Donkey Kong Country 2", "target": "Bramble Scramble", "url": "https://strategywiki.org/wiki/Donkey_Kong_Country_2:_Diddy%27s_Kong_Quest/Walkthrough"},
    {"id": 44, "platform": "SNES", "game": "Mega Man X", "target": "Central Highway", "url": "https://strategywiki.org/wiki/Mega_Man_X/Walkthrough"},
    {"id": 45, "platform": "SNES", "game": "Super Castlevania IV", "target": "Rotating Stone Room", "url": "https://strategywiki.org/wiki/Super_Castlevania_IV/Walkthrough"},
    {"id": 46, "platform": "SNES", "game": "Contra III", "target": "Neo City Streets", "url": "https://strategywiki.org/wiki/Contra_III:_The_Alien_Wars/Walkthrough"},
    {"id": 47, "platform": "SNES", "game": "Secret of Mana", "target": "The Mana Fortress", "url": "https://strategywiki.org/wiki/Secret_of_Mana/Walkthrough"},
    {"id": 48, "platform": "SNES", "game": "Trials of Mana", "target": "Crystal Forest", "url": "https://strategywiki.org/wiki/Trials_of_Mana/Walkthrough"},
    {"id": 49, "platform": "SNES", "game": "Super Mario RPG", "target": "Booster's Tower", "url": "https://strategywiki.org/wiki/Super_Mario_RPG:_Legend_of_the_Seven_Stars/Walkthrough"},
    {"id": 50, "platform": "SNES", "game": "Super Ghouls 'n Ghosts", "target": "Sea of Despair", "url": "https://strategywiki.org/wiki/Super_Ghouls_%27n_Ghosts/Walkthrough"},
    {"id": 51, "platform": "SNES", "game": "ActRaiser", "target": "Bloodpool Marshlands", "url": "https://strategywiki.org/wiki/ActRaiser/Walkthrough"},
    {"id": 52, "platform": "SNES", "game": "Soul Blazer", "target": "GreenWood Forest Sanctuary", "url": "https://strategywiki.org/wiki/Soul_Blazer/Walkthrough"},
    {"id": 53, "platform": "SNES", "game": "Illusion of Gaia", "target": "Sky-High Nazca Lines", "url": "https://strategywiki.org/wiki/Illusion_of_Gaia/Walkthrough"},
    {"id": 54, "platform": "SNES", "game": "Terranigma", "target": "Underworld Crystalline Core", "url": "https://strategywiki.org/wiki/Terranigma/Walkthrough"},
    {"id": 55, "platform": "SNES", "game": "Demon's Crest", "target": "Cemetery of the Undead", "url": "https://strategywiki.org/wiki/Demon%27s_Crest/Walkthrough"},
    {"id": 56, "platform": "SNES", "game": "F-Zero", "target": "Mute City Anti-Gravity Track", "url": "https://strategywiki.org/wiki/F-Zero/Tracks"},
    {"id": 57, "platform": "SNES", "game": "Star Fox", "target": "Orbital Asteroid Belt", "url": "https://strategywiki.org/wiki/Star_Fox/Walkthrough"},
    {"id": 58, "platform": "SNES", "game": "Zombies Ate My Neighbors", "target": "Suburban Hedge Maze", "url": "https://strategywiki.org/wiki/Zombies_Ate_My_Neighbors/Stages"},
    {"id": 59, "platform": "SNES", "game": "TMNT IV: Turtles in Time", "target": "Neon Night-Riders", "url": "https://strategywiki.org/wiki/Teenage_Mutant_Ninja_Turtles_IV:_Turtles_in_Time/Walkthrough"},
    {"id": 60, "platform": "SNES", "game": "Lufia II", "target": "The Ancient Cave", "url": "https://strategywiki.org/wiki/Lufia_II:_Rise_of_the_Sinistrals/Walkthrough"},
    {"id": 61, "platform": "SNES", "game": "SimCity", "target": "Megalopolis Grid", "url": "https://strategywiki.org/wiki/SimCity_(SNES)/Walkthrough"},
    {"id": 62, "platform": "SNES", "game": "Pilotwings", "target": "Skydiving Target Archipelago", "url": "https://strategywiki.org/wiki/Pilotwings/Skydiving"},
    {"id": 63, "platform": "SNES", "game": "Super Mario Kart", "target": "Rainbow Road", "url": "https://strategywiki.org/wiki/Super_Mario_Kart/Rainbow_Road"},

    # Sega Genesis & Master System
    {"id": 64, "platform": "Genesis", "game": "Sonic the Hedgehog", "target": "Green Hill Zone", "url": "https://strategywiki.org/wiki/Sonic_the_Hedgehog_(16-bit)/Walkthrough"},
    {"id": 65, "platform": "Genesis", "game": "Sonic the Hedgehog 2", "target": "Chemical Plant Zone", "url": "https://strategywiki.org/wiki/Sonic_the_Hedgehog_2/Chemical_Plant_Zone"},
    {"id": 66, "platform": "Genesis", "game": "Sonic the Hedgehog 2", "target": "Casino Night Zone", "url": "https://strategywiki.org/wiki/Sonic_the_Hedgehog_2/Casino_Night_Zone"},
    {"id": 67, "platform": "Genesis", "game": "Sonic 3 & Knuckles", "target": "Lava Reef Zone", "url": "https://strategywiki.org/wiki/Sonic_the_Hedgehog_3_%26_Knuckles/Walkthrough"},
    {"id": 68, "platform": "Genesis", "game": "Streets of Rage 2", "target": "Rain-Slicked Downtown", "url": "https://strategywiki.org/wiki/Streets_of_Rage_2/Walkthrough"},
    {"id": 69, "platform": "Genesis", "game": "Phantasy Star IV", "target": "Dezoris Ice Continent", "url": "https://strategywiki.org/wiki/Phantasy_Star_IV:_The_End_of_the_Millennium/Walkthrough"},
    {"id": 70, "platform": "Genesis", "game": "Shinobi III", "target": "Bamboo Forest", "url": "https://strategywiki.org/wiki/Shinobi_III:_Return_of_the_Ninja_Master/Walkthrough"},
    {"id": 71, "platform": "Genesis", "game": "Gunstar Heroes", "target": "Flying Battleship Megasys", "url": "https://strategywiki.org/wiki/Gunstar_Heroes/Walkthrough"},
    {"id": 72, "platform": "Genesis", "game": "Golden Axe", "target": "Turtle Village", "url": "https://strategywiki.org/wiki/Golden_Axe/Walkthrough"},
    {"id": 73, "platform": "Genesis", "game": "Castlevania: Bloodlines", "target": "Sunken Atlantis Ruins", "url": "https://strategywiki.org/wiki/Castlevania:_Bloodlines/Walkthrough"},
    {"id": 74, "platform": "Genesis", "game": "Landstalker", "target": "Greenmaze Labyrinth", "url": "https://strategywiki.org/wiki/Landstalker:_The_Treasures_of_King_Nole/Walkthrough"},
    {"id": 75, "platform": "Genesis", "game": "Beyond Oasis", "target": "Water Temple Aqueducts", "url": "https://strategywiki.org/wiki/Beyond_Oasis/Walkthrough"},
    {"id": 76, "platform": "Genesis", "game": "ToeJam & Earl", "target": "Layered Surreal Islands", "url": "https://strategywiki.org/wiki/ToeJam_%26_Earl"},
    {"id": 77, "platform": "Genesis", "game": "Ristar", "target": "Planet Flora", "url": "https://strategywiki.org/wiki/Ristar/Walkthrough"},
    {"id": 78, "platform": "Genesis", "game": "Crusader of Centy", "target": "Animal Village", "url": "https://strategywiki.org/wiki/Crusader_of_Centy/Walkthrough"},
    {"id": 79, "platform": "Genesis", "game": "Comix Zone", "target": "Mutant Drainage Sewers", "url": "https://strategywiki.org/wiki/Comix_Zone/Walkthrough"},
    {"id": 80, "platform": "Genesis", "game": "Disney's Aladdin", "target": "Agrabah Rooftops", "url": "https://strategywiki.org/wiki/Disney%27s_Aladdin_(Sega)/Walkthrough"},
    {"id": 81, "platform": "Genesis", "game": "Vectorman", "target": "Terraforming Junkyard", "url": "https://strategywiki.org/wiki/Vectorman/Walkthrough"},
    {"id": 82, "platform": "Genesis", "game": "Ecco the Dolphin", "target": "Open Ocean & Sunken Temples", "url": "https://strategywiki.org/wiki/Ecco_the_Dolphin/Walkthrough"},
    {"id": 83, "platform": "Genesis", "game": "Flashback", "target": "Titan Cyber-Jungle", "url": "https://strategywiki.org/wiki/Flashback:_The_Quest_for_Identity/Walkthrough"},
    {"id": 84, "platform": "Master System", "game": "Wonder Boy III", "target": "Desert Sandstone Pyramid", "url": "https://strategywiki.org/wiki/Wonder_Boy_III:_The_Dragon%27s_Trap/Walkthrough"},
    {"id": 85, "platform": "Master System", "game": "Alex Kidd in Miracle World", "target": "Mt. Eternal", "url": "https://strategywiki.org/wiki/Alex_Kidd_in_Miracle_World/Walkthrough"},
    {"id": 86, "platform": "Master System", "game": "Phantasy Star", "target": "Camineet Spaceport City", "url": "https://strategywiki.org/wiki/Phantasy_Star/Walkthrough"},
    {"id": 87, "platform": "Genesis", "game": "Another World", "target": "Alien Wasteland", "url": "https://strategywiki.org/wiki/Out_of_This_World/Walkthrough"},

    # Arcade
    {"id": 88, "platform": "Arcade", "game": "Pac-Man", "target": "The Neon Labyrinth", "url": "https://strategywiki.org/wiki/Pac-Man/Walkthrough"},
    {"id": 89, "platform": "Arcade", "game": "Donkey Kong", "target": "25m Construction Site", "url": "https://strategywiki.org/wiki/Donkey_Kong/Walkthrough"},
    {"id": 90, "platform": "Arcade", "game": "Gauntlet", "target": "Infinite Dungeon Maze", "url": "https://strategywiki.org/wiki/Gauntlet_(1985)"},
    {"id": 91, "platform": "Arcade", "game": "Smash TV", "target": "Arena Studio 1", "url": "https://strategywiki.org/wiki/Smash_T.V./Walkthrough"},
    {"id": 92, "platform": "Arcade", "game": "Bubble Bobble", "target": "Cave of Monsters", "url": "https://strategywiki.org/wiki/Bubble_Bobble/Walkthrough"},
    {"id": 93, "platform": "Arcade", "game": "Gradius", "target": "Moai Head Graveyard", "url": "https://strategywiki.org/wiki/Gradius/Walkthrough"},
    {"id": 94, "platform": "Arcade", "game": "R-Type", "target": "Biomechanical Core", "url": "https://strategywiki.org/wiki/R-Type/Walkthrough"},
    {"id": 95, "platform": "Arcade", "game": "OutRun", "target": "Coconut Beach", "url": "https://strategywiki.org/wiki/OutRun/Routes"},
    {"id": 96, "platform": "Arcade", "game": "Space Harrier", "target": "The Fantasy Zone", "url": "https://strategywiki.org/wiki/Space_Harrier/Stages"},
    {"id": 97, "platform": "Arcade", "game": "Marble Madness", "target": "Practice & Intermediate Grid", "url": "https://strategywiki.org/wiki/Marble_Madness/Courses"},
    {"id": 98, "platform": "Arcade", "game": "Defender", "target": "Cylindrical City Horizon", "url": "https://strategywiki.org/wiki/Defender"},
    {"id": 99, "platform": "Arcade", "game": "Battlezone", "target": "Green Wireframe Moonscape", "url": "https://strategywiki.org/wiki/Battlezone"},
    {"id": 100, "platform": "Arcade", "game": "Bad Dudes vs. DragonNinja", "target": "Speeding Semi-Trucks", "url": "https://strategywiki.org/wiki/Bad_Dudes_Vs._DragonNinja/Walkthrough"}
]


def extract_page_title(url: str) -> str:
    path = urlparse(url).path
    title = path.split("/wiki/")[-1]
    return unquote(title)


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


def search_subpages(base_title: str, query: str = "") -> list:
    prefix = base_title.split("/")[0] + "/"
    params = {
        "action": "query",
        "list": "prefixsearch",
        "pssearch": prefix + query,
        "format": "json",
        "pslimit": 15
    }
    try:
        resp = requests.get(API_ENDPOINT, params=params, headers=HEADERS, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            return [item["title"] for item in data.get("query", {}).get("prefixsearch", [])]
    except Exception:
        pass
    return []


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


def scrape_spec(spec: dict) -> dict:
    page_title = extract_page_title(spec["url"])
    target = spec["target"]
    game = spec["game"]
    platform = spec["platform"]

    # 1. Fetch main page
    html = fetch_mediawiki_parse(page_title)
    sections = parse_clean_sections(html)

    # 2. If main page is a hub/empty, search relevant subpages
    if len(sections) <= 1 or not any(len(s["text"]) > 100 for s in sections):
        # Look for candidate subpages using keywords from target
        sub_candidates = search_subpages(page_title)
        best_candidate = None
        target_words = set(re.findall(r"\w+", target.lower()))

        for sub in sub_candidates:
            sub_words = set(re.findall(r"\w+", sub.lower()))
            overlap = len(target_words.intersection(sub_words))
            if overlap > 0:
                best_candidate = sub
                break

        if not best_candidate and sub_candidates:
            # Pick first walkthrough or stage subpage
            for sub in sub_candidates:
                if any(k in sub.lower() for k in ["stage", "world", "area", "chapter", "level", "zone"]):
                    best_candidate = sub
                    break
            if not best_candidate and len(sub_candidates) > 0:
                best_candidate = sub_candidates[0]

        if best_candidate:
            sub_html = fetch_mediawiki_parse(best_candidate)
            sub_sections = parse_clean_sections(sub_html)
            if sub_sections:
                sections = sub_sections

    # 3. Choose the best matching section
    matched_text = ""
    target_words = set(re.findall(r"\w+", target.lower()))
    best_score = -1

    for s in sections:
        h_words = set(re.findall(r"\w+", s["heading"].lower()))
        t_words = set(re.findall(r"\w+", s["text"][:300].lower()))
        score = len(target_words.intersection(h_words)) * 4 + len(target_words.intersection(t_words))
        if score > best_score:
            best_score = score
            matched_text = f"[{s['heading']}] {s['text']}"

    if not matched_text and sections:
        matched_text = f"[{sections[0]['heading']}] {sections[0]['text']}"

    if not matched_text:
        matched_text = f"A classic 3D retro environment capturing {target} from {game} on {platform}."

    # Build concise 3D world generation prompt
    prompt = (
        f"Generate a fully interactive 3D WebGL Three.js world representing '{target}' from {game} ({platform}). "
        f"World environmental details: {matched_text[:600]}. "
        f"Include lighting, fog, textures/materials, animated environmental elements, and mouse/touch orbit camera controls."
    )

    return {
        "id": spec["id"],
        "platform": platform,
        "game": game,
        "target": target,
        "url": spec["url"],
        "section_count": len(sections),
        "description": matched_text[:900],
        "qwen_prompt": prompt
    }


def main():
    print(f"Scraping descriptions for all {len(WORLD_SPECS)} game worlds via MediaWiki API...")
    results = [None] * len(WORLD_SPECS)

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        future_to_idx = {executor.submit(scrape_spec, spec): i for i, spec in enumerate(WORLD_SPECS)}
        for future in concurrent.futures.as_completed(future_to_idx):
            idx = future_to_idx[future]
            try:
                data = future.result()
                results[idx] = data
                print(f"✓ [{data['id']:03d}/100] {data['game']} - {data['target']} ({data['section_count']} sections)")
            except Exception as e:
                print(f"✗ Failed index {idx}: {e}")
            time.sleep(0.05)

    output_path = "/Users/braidpairlette/worlds/game_worlds_extracted.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    print(f"\nExtraction complete! Saved 100 worlds to '{output_path}'.")


if __name__ == "__main__":
    main()
