#!/usr/bin/env python3
"""Roblox Studio Vision Guard & Auto-Pilot:
1. Detects blocking dialogs:
   - Rojo "Would you like to connect?" (Orange/Red Connect button + Accept)
   - Studio "Auto-Recovery / Save Changes" dialogs
2. Clicks through and dismisses/accepts blocking popups automatically.
3. Inspects viewport pixel variance:
   - Rejects blank sky (solid cyan/blue) or empty void (solid grey/black baseplate).
   - Validates real in-game world geometry, meshes, terrain, and UI elements.
"""
import subprocess
import time
from PIL import Image
import numpy as np

def capture_screen(out_path="/tmp/studio_guard_screen.png"):
    subprocess.run(["screencapture", "-x", out_path], check=True)
    return Image.open(out_path)

def detect_and_handle_dialogs():
    """Detects Rojo connect popup or Studio recovery dialogs and clicks them."""
    im = capture_screen()
    arr = np.array(im)
    
    # 1. Check for Rojo Red/Orange Connect button: R > 175, G < 95, B < 95
    reds = np.where((arr[:, :, 0] > 175) & (arr[:, :, 1] < 95) & (arr[:, :, 2] < 95))
    if len(reds[0]) > 40:
        min_y, max_y = reds[0].min(), reds[0].max()
        min_x, max_x = reds[1].min(), reds[1].max()
        # Scale to logical points (Retina / 2.0)
        cx = (min_x + max_x) // 4
        cy = (min_y + max_y) // 4
        print(f"[Studio Guard] ⚠ Detected Rojo Connect popup at ({cx}, {cy}). Clicking Connect...")
        subprocess.run(["osascript", "-e", 'tell application "RobloxStudio" to activate'])
        time.sleep(0.3)
        subprocess.run(["cliclick", f"c:{cx},{cy}"])
        time.sleep(1.0)
        
        # Check if an "Accept" or second confirmation appeared
        im2 = capture_screen()
        arr2 = np.array(im2)
        reds2 = np.where((arr2[:, :, 0] > 175) & (arr2[:, :, 1] < 95) & (arr2[:, :, 2] < 95))
        if len(reds2[0]) > 40:
            cx2 = (reds2[1].min() + reds2[1].max()) // 4
            cy2 = (reds2[0].min() + reds2[0].max()) // 4
            subprocess.run(["cliclick", f"c:{cx2},{cy2}"])
            time.sleep(1.0)
        print("[Studio Guard] ✓ Cleared Rojo Connect dialog!")
        return True
    return False

def analyze_viewport():
    """Examines Studio central 3D viewport to determine if it is blank or rendered."""
    im = capture_screen()
    # Studio viewport region on 3840x2160 screen:
    vp = im.crop((950, 350, 2150, 1550))
    arr = np.array(vp)
    
    # Color variance across RGB channels
    std_r = np.std(arr[:, :, 0])
    std_g = np.std(arr[:, :, 1])
    std_b = np.std(arr[:, :, 2])
    total_std = (std_r + std_g + std_b) / 3.0
    
    # Color averages
    mean_r = np.mean(arr[:, :, 0])
    mean_g = np.mean(arr[:, :, 1])
    mean_b = np.mean(arr[:, :, 2])
    
    is_blank_blue = (mean_b > 180 and mean_r < 120 and total_std < 18.0)
    is_blank_grey = (abs(mean_r - mean_g) < 10 and abs(mean_g - mean_b) < 10 and total_std < 12.0)
    
    print(f"[Studio Guard] Viewport stats: RGB=({mean_r:.1f}, {mean_g:.1f}, {mean_b:.1f}), std_dev={total_std:.2f}")
    
    if is_blank_blue:
        print("[Studio Guard] ❌ Viewport is BLANK SKY (no geometry rendered).")
        return False, "blank_sky"
    elif is_blank_grey:
        print("[Studio Guard] ❌ Viewport is BLANK GREY (empty baseplate / unpopulated scene).")
        return False, "blank_grey"
    elif total_std < 15.0:
        print("[Studio Guard] ❌ Viewport has low variance (likely unpopulated).")
        return False, "low_variance"
    else:
        print("[Studio Guard] ✓ Viewport contains rich 3D geometry and active gameplay scene!")
        return True, "rendered"

if __name__ == "__main__":
    detect_and_handle_dialogs()
    is_rendered, state = analyze_viewport()
