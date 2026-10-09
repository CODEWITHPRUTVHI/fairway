import zlib
import struct
import math
import os

def create_png(width, height, get_pixel, filename):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # filter byte 0 (None)
        for x in range(width):
            r, g, b, a = get_pixel(x, y, width, height)
            raw_data.extend([r, g, b, a])
    
    compressed = zlib.compress(bytes(raw_data), 9)
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(c) & 0xffffffff)
        return struct.pack('>I', len(data)) + c + crc

    png = b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', compressed) + chunk(b'IEND', b'')
    os.makedirs(os.path.dirname(os.path.abspath(filename)), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png)
    print(f"Generated {filename} ({width}x{height})")

def rickshaw_pixel(x, y, w, h):
    # Normalized coords 0..1
    nx = x / float(w)
    ny = y / float(h)
    
    # Rounded squircle background (#FCC016 with subtle gradient)
    # Check rounded rectangle
    radius = 0.22
    # Distance to corner
    dx = max(abs(nx - 0.5) - (0.5 - radius), 0)
    dy = max(abs(ny - 0.5) - (0.5 - radius), 0)
    dist = math.sqrt(dx*dx + dy*dy)
    if dist > radius:
        return (0, 0, 0, 0) # transparent outer
    
    # Base background: #FCC016 gold (252, 192, 22)
    # Subtle top highlight
    bg_r = int(252 - ny * 15)
    bg_g = int(192 - ny * 15)
    bg_b = int(22)
    
    # Auto rickshaw graphic in center (#1E1E1E: 30, 30, 30)
    # Let's define the rickshaw silhouette:
    # Roof: nx from 0.22 to 0.78, ny from 0.24 to 0.36 (curved front)
    # Windshield: nx from 0.24 to 0.40, ny from 0.36 to 0.52
    # Cabin / body: nx from 0.24 to 0.78, ny from 0.50 to 0.68
    # Wheels: rear wheel (0.64, 0.74, r=0.10), front wheel (0.34, 0.74, r=0.08)
    # Headlight: (0.22, 0.56, r=0.04) in bright white/yellow
    
    is_dark = False
    is_accent = False
    is_window = False
    
    # Roof (curved yellow/black auto hood)
    if 0.22 <= nx <= 0.78 and 0.24 <= ny <= 0.36:
        # curved front
        if nx < 0.35 and (nx - 0.35)**2 / (0.13**2) + (ny - 0.36)**2 / (0.12**2) > 1:
            pass
        else:
            is_dark = True

    # Main cabin body
    if 0.28 <= nx <= 0.76 and 0.36 <= ny <= 0.67:
        is_dark = True
        
    # Front slant / hood
    if 0.20 <= nx <= 0.36 and 0.44 <= ny <= 0.67:
        is_dark = True

    # Windows (bright cutout)
    # Front windshield
    if 0.26 <= nx <= 0.38 and 0.38 <= ny <= 0.48:
        is_window = True
    # Side passenger window
    if 0.44 <= nx <= 0.70 and 0.38 <= ny <= 0.50:
        is_window = True

    # Rear wheel (0.65, 0.72)
    dw_r = math.sqrt((nx - 0.65)**2 + (ny - 0.72)**2)
    if dw_r < 0.09:
        is_dark = True
        if dw_r < 0.04:
            is_accent = True

    # Front wheel (0.32, 0.72)
    dw_f = math.sqrt((nx - 0.32)**2 + (ny - 0.72)**2)
    if dw_f < 0.075:
        is_dark = True
        if dw_f < 0.035:
            is_accent = True

    # Front yellow headlamp
    if math.sqrt((nx - 0.20)**2 + (ny - 0.53)**2) < 0.03:
        return (255, 255, 255, 255)

    # Green CNG strip (Nashik green/eco auto bar)
    if 0.28 <= nx <= 0.76 and 0.56 <= ny <= 0.60:
        return (16, 185, 129, 255) # Emerald green

    if is_window:
        return (220, 240, 255, 240) # light windshield tint
    elif is_accent:
        return (200, 200, 200, 255) # silver rim
    elif is_dark:
        return (30, 30, 30, 255) # deep auto dark

    # Green text or badge: "MH-15" bar at bottom
    if 0.34 <= nx <= 0.66 and 0.83 <= ny <= 0.89:
        return (30, 30, 30, 230)

    return (bg_r, bg_g, bg_b, 255)

create_png(192, 192, rickshaw_pixel, "public/icon-192.png")
create_png(512, 512, rickshaw_pixel, "public/icon-512.png")
create_png(180, 180, rickshaw_pixel, "public/apple-touch-icon.png")
