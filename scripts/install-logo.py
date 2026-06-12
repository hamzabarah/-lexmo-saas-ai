#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Installe les assets de marque ECOMY à partir de la variante choisie (v1).

Produit :
  - public/images/brand/logo.png        (512, émeraude, transparent)
  - public/images/brand/logo-gold.png   (512, doré, en réserve)
  - app/favicon.ico                      (16/32/48, émeraude transparent)
  - app/icon.png                         (512, émeraude transparent)
  - app/apple-icon.png                   (180, émeraude transparent)
  - public/images/brand/og-image.png     (1200x630, vert foncé + logo + texte AR doré)

Usage : python scripts/install-logo.py [v1]
"""

import sys
from pathlib import Path

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parents[1]
DRAFTS = ROOT / "logo-drafts"
BRAND = ROOT / "public" / "images" / "brand"
APP = ROOT / "app"

EMERALD = (46, 153, 102)     # #2E9966
GOLD = (197, 160, 41)        # #C5A029
DARKGREEN = (15, 60, 45)     # #0F3C2D

TAHOMA_BD = r"C:\Windows\Fonts\tahomabd.ttf"
TAHOMA = r"C:\Windows\Fonts\tahoma.ttf"


def recolor(img, rgb):
    import numpy as np
    from PIL import Image
    a = np.asarray(img.convert("RGBA")).copy()
    a[..., 0], a[..., 1], a[..., 2] = rgb
    return Image.fromarray(a, "RGBA")


def square_resize(img, px):
    """Logo (déjà carré ~tight) ramené proprement à px×px, transparent."""
    from PIL import Image
    out = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    lg = img.copy()
    inner = round(px * 0.92)
    lg.thumbnail((inner, inner), Image.LANCZOS)
    out.alpha_composite(lg, ((px - lg.width) // 2, (px - lg.height) // 2))
    return out


def ar(text: str) -> str:
    import arabic_reshaper
    from bidi.algorithm import get_display
    return get_display(arabic_reshaper.reshape(text))


def font(path, size):
    from PIL import ImageFont
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def build_og(logo_emerald, dst):
    """1200x630 — fond vert foncé, logo émeraude à droite, texte doré RTL à gauche,
    ecomy.ai en bas."""
    from PIL import Image, ImageDraw
    W, H = 1200, 630
    img = Image.new("RGBA", (W, H), (*DARKGREEN, 255))
    d = ImageDraw.Draw(img)

    # Léger halo plus clair derrière le logo pour le détacher du fond vert.
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((835, 150, 1155, 470), fill=(46, 153, 102, 60))
    from PIL import ImageFilter
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    img.alpha_composite(glow)

    # Logo émeraude à droite.
    lg = logo_emerald.copy()
    lg.thumbnail((300, 300), Image.LANCZOS)
    img.alpha_composite(lg, (995 - lg.width // 2, 315 - lg.height // 2))

    # Texte doré RTL à gauche (titre + tagline), aligné à droite du bloc texte.
    right_x = 770
    d.text((right_x, 232), ar("أكاديمية إيكومي"), font=font(TAHOMA_BD, 76),
           fill=(*GOLD, 255), anchor="ra")
    d.text((right_x, 338), ar("التجارة الإلكترونية بالعربي"), font=font(TAHOMA, 44),
           fill=(*GOLD, 235), anchor="ra")

    # ecomy.ai en bas (latin, LTR), doré discret centré.
    d.text((W // 2, 560), "ecomy.ai", font=font(TAHOMA_BD, 34),
           fill=(*GOLD, 220), anchor="mm")

    img.convert("RGB").save(dst, "PNG")


def main() -> int:
    v = sys.argv[1] if len(sys.argv) > 1 else "v1"
    src = DRAFTS / f"logo-{v}-transparent.png"
    if not src.exists():
        print(f"❌ introuvable : {src}")
        return 1
    from PIL import Image
    base = Image.open(src).convert("RGBA")          # émeraude tight square
    BRAND.mkdir(parents=True, exist_ok=True)

    emerald = recolor(base, EMERALD)
    gold = recolor(base, GOLD)

    # 1) Logos de marque (512).
    square_resize(emerald, 512).save(BRAND / "logo.png", "PNG")
    square_resize(gold, 512).save(BRAND / "logo-gold.png", "PNG")
    print("  ✅ brand/logo.png + brand/logo-gold.png")

    # 2) Favicon (16/32/48), icon 512, apple 180 — émeraude transparent.
    ico_src = square_resize(emerald, 256)
    ico_src.save(APP / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    square_resize(emerald, 512).save(APP / "icon.png", "PNG")
    square_resize(emerald, 180).save(APP / "apple-icon.png", "PNG")
    print("  ✅ app/favicon.ico (16/32/48) + app/icon.png (512) + app/apple-icon.png (180)")

    # 3) og-image.
    build_og(emerald, BRAND / "og-image.png")
    print("  ✅ brand/og-image.png (1200x630)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
