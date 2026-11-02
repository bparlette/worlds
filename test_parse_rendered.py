import re
import json

with open('/Users/braidpairlette/worlds/art/rendered.html') as f:
    html = f.read()

# Pattern for figure cards in rendered.html
# Example: <figure><a href="..."><img src="..." ...></a><figcaption><b>#1 — Sonic the Hedgehog · Green Hill Zone</b><br><span class="model">“Sonic The Hedgehog Green Hill Zone” by visahlly · ♥ 25 · <a href="...">view the 3D model</a></span></figcaption></figure>
figures = re.findall(r'<figure[\s\S]*?</figure>', html)
print(f"Found {len(figures)} figure cards in rendered.html:")
for fig in figures:
    m_rank = re.search(r'<b>#(\d+)[^<]*—\s*([^·<]+)\s*·\s*([^<]+)</b>', fig)
    m_img = re.search(r'<img[^>]+src="([^">]+)"', fig)
    if m_rank and m_img:
        rank = int(m_rank.group(1))
        game = m_rank.group(2).strip()
        name = m_rank.group(3).strip()
        img_url = m_img.group(1)
        print(f"Rank #{rank}: {game} — {name} | img: {img_url[:60]}...")
    else:
        # Check hunting cards if any
        m_simple_rank = re.search(r'<b>#(\d+)', fig)
        print(f"Other card: rank {m_simple_rank.group(1) if m_simple_rank else '?'}")

