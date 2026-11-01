"""
extract_batch_901_1000.py
Extracts games 901 through 1000 (Arcade: Neo Geo/SNK, Psikyo/Toaplan/Raizing/Video System, Taito/Irem)
from StrategyWiki via MediaWiki OpenSearch and Parse API, and appends them to game_worlds_extracted.json,
bringing the total registry to 1,000 retro game worlds.
"""

import json
import re
import requests
from bs4 import BeautifulSoup
import concurrent.futures

RAW_BATCH_901_1000 = """
Arcade (Neo Geo / SNK):
901. Fatal Fury: King of Fighters - Southtown Street Corners, Pao Pao Cafe & Rooftops: https://strategywiki.org/wiki/Fatal_Fury:_King_of_Fighters/Walkthrough
902. Fatal Fury 2 - Train Car Roofs, Rafts & Mount Rushmore Arenas: https://strategywiki.org/wiki/Fatal_Fury_2/Walkthrough
903. Fatal Fury 3: Road to the Final Victory - Southtown Port, Aquarium & Dream Amusement: https://strategywiki.org/wiki/Fatal_Fury_3:_Road_to_the_Final_Victory/Walkthrough
904. Real Bout Fatal Fury - Waterfront Piers, Geese Tower & Sound Beach: https://strategywiki.org/wiki/Real_Bout_Fatal_Fury/Walkthrough
905. Real Bout Fatal Fury Special - Night Harbor Docks & Pagoda Courtyards: https://strategywiki.org/wiki/Real_Bout_Fatal_Fury_Special/Walkthrough
906. Real Bout Fatal Fury 2: The Newcomers - Sunset Rail Bridges & Neon Streets: https://strategywiki.org/wiki/Real_Bout_Fatal_Fury_2:_The_Newcomers/Walkthrough
907. Art of Fighting - Downtown Slums, Kabuki Grills & Airfield Runways: https://strategywiki.org/wiki/Art_of_Fighting/Walkthrough
908. Art of Fighting 3: The Path of the Warrior - Mexican Pueblos & Desert Ruins: https://strategywiki.org/wiki/Art_of_Fighting_3:_The_Path_of_the_Warrior/Walkthrough
909. The King of Fighters '95 - Neo Geo Factory, Mediterranean Shores & Rugal's Silo: https://strategywiki.org/wiki/The_King_of_Fighters_%2795/Walkthrough
910. The King of Fighters '96 - High-Rise Helipads, Shinto Temples & Coliseum Rings: https://strategywiki.org/wiki/The_King_of_Fighters_%2796/Walkthrough
911. The King of Fighters '97 - Live Broadcast Stages, Bali Shrines & Orochi Void: https://strategywiki.org/wiki/The_King_of_Fighters_%2797/Walkthrough
912. The King of Fighters '98: The Slugfest - Spanish Courtyards, US Riverbanks & China Canals: https://strategywiki.org/wiki/The_King_of_Fighters_%2798:_The_Slugfest/Walkthrough
913. The King of Fighters '99: Millennium Battle - Rainy Airport Aprons, Sewers & NESTS Silo: https://strategywiki.org/wiki/The_King_of_Fighters_%2799:_Millennium_Battle/Walkthrough
914. Samurai Shodown - Edo Japan Shorelines, Gale Shrines & Onigami Isle: https://strategywiki.org/wiki/Samurai_Shodown/Walkthrough
915. Samurai Shodown III: Blades of Blood - Bloodstained Cherry Blossom Clearings & Battlefields: https://strategywiki.org/wiki/Samurai_Shodown_III/Walkthrough
916. Samurai Shodown IV: Amakusa's Revenge - Burning Shimabara Castles & Ruined Villages: https://strategywiki.org/wiki/Samurai_Shodown_IV:_Amakusa%27s_Revenge/Walkthrough
917. The Last Blade 2 - Burning Hells Gate, Cemetery Mist & Willow Tree Bridges: https://strategywiki.org/wiki/The_Last_Blade_2/Walkthrough
918. World Heroes - Prehistoric Tar Pits, Medieval Castle Rings & Future Domes: https://strategywiki.org/wiki/World_Heroes/Walkthrough
919. World Heroes Perfect - Jurassic Jungles, Babylonian Ziggurats & Ring Arenas: https://strategywiki.org/wiki/World_Heroes_Perfect/Walkthrough
920. Karnov's Revenge - Kremlin Squares & Amazon Docks: https://strategywiki.org/wiki/Karnov%27s_Revenge/Walkthrough
921. Savage Reign - Future Jipang Skyways & Dual-Level Street Corridors: https://strategywiki.org/wiki/Savage_Reign/Walkthrough
922. Kizuna Encounter: Super Tag Battle - Cyberpunk Neon Rooftops & Colosseum Pits: https://strategywiki.org/wiki/Kizuna_Encounter:_Super_Tag_Battle/Walkthrough
923. Aggressors of Dark Kombat - City Basketball Courts, School Rooftops & Park Benches: https://strategywiki.org/wiki/Aggressors_of_Dark_Kombat/Walkthrough
924. Ninja Master's: Haoh Ninpo Cho - Rainswept Shinto Pagodas & Bamboo Thickets: https://strategywiki.org/wiki/Ninja_Master%27s:_Haoh_Ninpo_Cho/Walkthrough
925. Windjammers - Sunny Beachfront Courts, Clay Pitches & Stadium Turf: https://strategywiki.org/wiki/Windjammers/Walkthrough
926. Neo Turf Masters - Baden National Glades, Fujiyama Cliffs & Grand Canyon Fairways: https://strategywiki.org/wiki/Neo_Turf_Masters/Courses
927. Super Sidekicks - International Soccer Pitch Stadiums & Illuminated Fields: https://strategywiki.org/wiki/Super_Sidekicks/Walkthrough
928. Super Sidekicks 2: The World Championship - Global Championship Stadium Bleachers: https://strategywiki.org/wiki/Super_Sidekicks_2:_The_World_Championship/Walkthrough
929. Baseball Stars Professional - Domed AstroTurf Ballparks & Open-Air Stadiums: https://strategywiki.org/wiki/Baseball_Stars_Professional/Walkthrough
930. Baseball Stars 2 - High-Tech City Ballparks, Dugouts & Jumbotron Outfields: https://strategywiki.org/wiki/Baseball_Stars_2/Walkthrough
931. 2020 Super Baseball - Futuristic Cybernetic Ballpark Grids & Jump Zones: https://strategywiki.org/wiki/2020_Super_Baseball/Walkthrough
932. Street Hoop (Street Slam) - Urban Streetball Half-Courts, Fences & Graffiti Walls: https://strategywiki.org/wiki/Street_Hoop/Walkthrough
933. Top Hunter: Roddy & Cathy - Planet Forest, Ice, Wind & Fire Biomes: https://strategywiki.org/wiki/Top_Hunter:_Roddy_%26_Cathy/Walkthrough
934. Spinmaster - Madrid Museum Halls, Mayan Temples & Steamboat Decks: https://strategywiki.org/wiki/Spinmaster/Walkthrough
935. Blue's Journey - Raguy Planet Insect Jungles & Mechanical Castles: https://strategywiki.org/wiki/Blue%27s_Journey/Walkthrough
936. Magician Lord - Cursed Palace of Gal Agiese & Subterranean Hell Pits: https://strategywiki.org/wiki/Magician_Lord/Walkthrough
937. Cyber-Lip - Alien Military Platforms, Elevator Cores & Bio-Vats: https://strategywiki.org/wiki/Cyber-Lip/Walkthrough
938. NAM-1975 - Rainswept Jungle Outposts, Landing Zones & Enemy Bunkers: https://strategywiki.org/wiki/NAM-1975/Walkthrough
939. Robo Army - Ruined Robot Arcologies, Factory Conveyors & Sky Bridges: https://strategywiki.org/wiki/Robo_Army/Walkthrough
940. Mutation Nation - Bio-Mutant Slum Streets, Subways & Genetic Labs: https://strategywiki.org/wiki/Mutation_Nation/Walkthrough
941. Sengoku - Feudal Ghost Metropolises & Spirit Realm Castles: https://strategywiki.org/wiki/Sengoku/Walkthrough
942. Sengoku 2 - Feudal Japan Castles, Medieval European Keeps & WWII Trenches: https://strategywiki.org/wiki/Sengoku_2/Walkthrough
943. Sengoku 3 - Mystic Japanese Bamboo Groves, Torii Shrines & Burning Palaces: https://strategywiki.org/wiki/Sengoku_3/Walkthrough
944. Burning Fight - Downtown Osaka Street Alleys, Nightclubs & Ocean Ferries: https://strategywiki.org/wiki/Burning_Fight/Walkthrough
945. Eight Man - Cybernetic Highway Chaseways & High-Altitude Skyscraper Rooftops: https://strategywiki.org/wiki/Eight_Man/Walkthrough
946. Ninja Combat - Ninja Compound Fortresses, Shadow Dojos & Spire Towers: https://strategywiki.org/wiki/Ninja_Combat/Walkthrough
947. Ninja Commando - Prehistoric Jungles, Ancient Egypt & WWII Battlefields: https://strategywiki.org/wiki/Ninja_Commando/Walkthrough
948. The Super Spy - Six-Story Terrorist Megacomplex Corridors & Bomb Rooms: https://strategywiki.org/wiki/The_Super_Spy/Walkthrough
949. Crossed Swords - Medieval Fortress Moats, Castle Ramparts & Demon Citadels: https://strategywiki.org/wiki/Crossed_Swords/Walkthrough
950. Crossed Swords II - Sunken Crypt Vaults & Dragon Spire Battlements: https://strategywiki.org/wiki/Crossed_Swords_II/Walkthrough
951. King of the Monsters - Destroyable Tokyo Bay Skylines & High-Voltage Grids: https://strategywiki.org/wiki/King_of_the_Monsters/Walkthrough
952. King of the Monsters 2 - Next-Gen City Metropolises, Underwater Trenches & Alien Hives: https://strategywiki.org/wiki/King_of_the_Monsters_2:_The_Next_Thing/Walkthrough
953. Shock Troopers: 2nd Squad - Corporate Arcology Runways, Missile Silos & Trains: https://strategywiki.org/wiki/Shock_Troopers:_2nd_Squad/Walkthrough
954. Prehistoric Isle in 1930 - Lost Island Dinosaur Skies, Volcanic Chasms & Ocean Coasts: https://strategywiki.org/wiki/Prehistoric_Isle_in_1930/Walkthrough
955. Prehistoric Isle 2 - Invaded Urban High-Rises & Pterodactyl-Infested Skies: https://strategywiki.org/wiki/Prehistoric_Isle_2/Walkthrough

Arcade (Psikyo / Toaplan / Raizing / Video System):
956. Aero Fighters 3 - Shinto Shrines, Desert Pyramids & Deep Sea Hangar Bases: https://strategywiki.org/wiki/Aero_Fighters_3/Walkthrough
957. Strikers 1945 II - North Sea Icebergs, Mountain Silos & Secret Space Platforms: https://strategywiki.org/wiki/Strikers_1945_II/Walkthrough
958. Strikers 1945 III (Strikers 1999) - Supersonic Stratosphere Flight & Nanotech Hives: https://strategywiki.org/wiki/Strikers_1945_III/Walkthrough
959. 1945k III - Alternate WWII Coastal Strongholds & Heavily Fortified Islets: https://strategywiki.org/wiki/1945k_III/Walkthrough
960. Gunbird 2 - Steampunk European Skyways, Ancient Shrines & Floating Castles: https://strategywiki.org/wiki/Gunbird_2/Walkthrough
961. Tengai (Sengoku Ace Episode II) - Feudal Japanese Cloudscapes & Submerged Forts: https://strategywiki.org/wiki/Tengai/Walkthrough
962. Sol Divide - Dark Fantasy Dungeon Vaults, Lava Keeps & Flying Demon Skies: https://strategywiki.org/wiki/Sol_Divide/Walkthrough
963. Dragon Blaze - Mythological Dragon Skies, Sunken Temples & Desert Tombs: https://strategywiki.org/wiki/Dragon_Blaze/Walkthrough
964. Space Bomber - Whimsical Comic Deep Space Arenas & Fleet Hulls: https://strategywiki.org/wiki/Space_Bomber/Walkthrough
965. Zero Wing (Arcade) - Deep Space Sector Docks & Bio-Mechanical Mother Ships: https://strategywiki.org/wiki/Zero_Wing/Walkthrough
966. Hellfire - Planetary Mining Caverns, Magma Shafts & Star Fortress Cores: https://strategywiki.org/wiki/Hellfire/Walkthrough
967. Out Zone - Alien Labyrinth Battle Trenches, Energy Grids & Blast Silos: https://strategywiki.org/wiki/Out_Zone/Walkthrough
968. FixEight - Galactic Mining Colonies, High-Tech Laboratories & Alien Vaults: https://strategywiki.org/wiki/FixEight/Walkthrough
969. Dogyuun - Hyper-Industrial Outer Space Refineries & Giant Mech Gantries: https://strategywiki.org/wiki/Dogyuun/Walkthrough
970. Truxton II (Tatsujin Ou) - Dense Asteroid Mining Belts & Fortress Cores: https://strategywiki.org/wiki/Truxton_II/Walkthrough
971. Batsugun - Orbital Space Defense Rings, Subsea Hangars & Base Superstructures: https://strategywiki.org/wiki/Batsugun/Walkthrough
972. Battle Bakraid - Heavily Armored Naval Shipyards, Coastal Forts & Airfields: https://strategywiki.org/wiki/Battle_Bakraid/Walkthrough
973. Battle Garegga - Dieselpunk Military Airbases, Industrial Smelters & Canyons: https://strategywiki.org/wiki/Battle_Garegga/Walkthrough
974. Armed Police Batrider - Dystopian Cyber-Metropolis Highways & Megacorporate Plazas: https://strategywiki.org/wiki/Armed_Police_Batrider/Walkthrough
975. Kingdom Grandprix - Medieval Fantasy Castle Tracks, Cloud Basins & Dragon Caverns: https://strategywiki.org/wiki/Kingdom_Grandprix/Walkthrough
976. Dimahoo (Great Mahou Daisakusen) - Steampunk Airship Fleets & Mythic Temples: https://strategywiki.org/wiki/Dimahoo/Walkthrough
977. Cybattler - Top-Down Mecha Space Station Corridors & Asteroid Belts: https://strategywiki.org/wiki/Cybattler/Walkthrough
978. In the Hunt (Kaitei Daisensou) - Sunken Dystopian Metropolises & Underwater Seabeds: https://strategywiki.org/wiki/In_the_Hunt/Walkthrough
979. GunForce - Fortified Island Jungle Outposts, Rail Bridges & Gunboat Harbors: https://strategywiki.org/wiki/GunForce/Walkthrough
980. GunForce II (Geostorm) - Industrial Wasteland Complexes, Armored Trains & Bio-Vats: https://strategywiki.org/wiki/GunForce_II/Walkthrough

Arcade (Taito / Irem):
981. The NewZealand Story - Pastel Maze Caverns, Cloud Tiers & Underwater Cages: https://strategywiki.org/wiki/The_NewZealand_Story/Walkthrough
982. Liquid Kids - Fairytale Water Pump Castles, Toyland Clouds & Garden Canals: https://strategywiki.org/wiki/Liquid_Kids/Walkthrough
983. Parasol Stars - Whimsical Cloud Worlds, Rainbow Bridges & Starlight Platforms: https://strategywiki.org/wiki/Parasol_Stars/Walkthrough
984. Rainbow Islands - Vertical Pastel Sea Towers, Rainbow Bridges & Toy Islands: https://strategywiki.org/wiki/Rainbow_Islands/Walkthrough
985. Darius - Deep Sea Cephalopod Mechanical Arenas & Planetary Ocean Tubes: https://strategywiki.org/wiki/Darius/Walkthrough
986. Darius II - Sunken Venusian Oceans, Submerged Cities & Core Chasms: https://strategywiki.org/wiki/Darius_II/Walkthrough
987. Darius Gaiden - Silver Hawk Cosmic Oceans & Giant Mechanical Crustacean Cores: https://strategywiki.org/wiki/Darius_Gaiden/Walkthrough
988. G-Darius - Proto-Cosmic Digital Void Corridors & Fossilized Motherships: https://strategywiki.org/wiki/G-Darius/Walkthrough
989. The Ninja Warriors (Arcade) - Triple-Screen Invaded City Boulevards & Capitol Stairs: https://strategywiki.org/wiki/The_Ninja_Warriors/Walkthrough
990. The Ninja Warriors Again (SNES) - Dystopian Arcologies, Rail Yards & High-Rise Penthouses: https://strategywiki.org/wiki/The_Ninja_Warriors_Again/Walkthrough
991. Rastan - Ancient Barbarian Fire Trenches, Spiked Castle Halls & Vine Forests: https://strategywiki.org/wiki/Rastan/Walkthrough
992. Nastar Warrior (Rastan Saga II) - Mythic Desert Altars & Crumbling Stone Keeps: https://strategywiki.org/wiki/Nastar_Warrior/Walkthrough
993. Warrior Blade: Rastan Saga III - Dual-Screen Monster Plains & Citadel Arenas: https://strategywiki.org/wiki/Warrior_Blade:_Rastan_Saga_Episode_III/Walkthrough
994. Cadash - Subterranean Kingdom Caverns, Dwarf Mines & Castle Keep: https://strategywiki.org/wiki/Cadash/Walkthrough
995. Runark (Growl Arcade) - Savannah Train Tops, Animal Rescue Enclosures & Caves: https://strategywiki.org/wiki/Growl/Walkthrough
996. Cameltry - Rotating Maze Mazes, Bouncing Rubber Bumpers & Speed Tiles: https://strategywiki.org/wiki/Cameltry/Walkthrough
997. Puzznic - Symmetrical Block Elimination Chambers & Japanese Garden Layouts: https://strategywiki.org/wiki/Puzznic/Walkthrough
998. Plotting (Flipull) - Geometric Block Match Grid Arenas: https://strategywiki.org/wiki/Plotting/Walkthrough
999. Elevator Action Returns - High-Rise Missile Facilities, Airport Runways & Subways: https://strategywiki.org/wiki/Elevator_Action_Returns/Walkthrough
1000. Night Striker - Cyberpunk Neo Tokyo Neon Skylines, Tunnels & Overpasses: https://strategywiki.org/wiki/Night_Striker/Walkthrough
"""

from extract_batch_671_900 import process_entry

def parse_raw_entries(raw_text: str) -> list:
    entries = []
    current_platform = "Arcade"
    for line in raw_text.strip().splitlines():
        line = line.strip()
        if not line:
            continue
        if line.endswith(":") and not line[0].isdigit():
            current_platform = line[:-1].strip()
            continue
        m = re.match(r"^(\d+)\.\s+(.+?)\s+-\s+(.+?):\s+(https?://\S+)$", line)
        if m:
            idx = int(m.group(1))
            game = m.group(2).strip()
            target = m.group(3).strip()
            url = m.group(4).strip()
            entries.append({
                "id": idx,
                "game": game,
                "target": target,
                "platform": current_platform,
                "url": url
            })
    return entries


def main():
    entries = parse_raw_entries(RAW_BATCH_901_1000)
    print(f"Parsed {len(entries)} entries (IDs {entries[0]['id']}..{entries[-1]['id']}). Extracting prose...")

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        future_to_entry = {executor.submit(process_entry, e): e for e in entries}
        done = 0
        for future in concurrent.futures.as_completed(future_to_entry):
            done += 1
            res = future.result()
            results.append(res)
            if done % 20 == 0 or done == len(entries):
                print(f"Extracted {done}/{len(entries)} games ({res['id']:03d}: {res['game']})...")

    results.sort(key=lambda x: x["id"])

    json_path = "/Users/braidpairlette/worlds/game_worlds_extracted.json"
    with open(json_path, "r", encoding="utf-8") as f:
        existing = json.load(f)

    filtered = [x for x in existing if x["id"] < 901]
    filtered.extend(results)
    filtered.sort(key=lambda x: x["id"])

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)

    print(f"Successfully updated {json_path} with {len(filtered)} total worlds (1..1000)!")


if __name__ == "__main__":
    main()
