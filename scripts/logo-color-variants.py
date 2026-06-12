#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Déclinaisons de couleur d'une variante de logo ECOMY déjà détourée.

Usage : python scripts/logo-color-variants.py v1
  - lit logo-drafts/logo-<v>-transparent.png (émeraude + alpha)
  - produit logo-<v>-dark.png  (#0F3C2D) et logo-<v>-gold.png (#C5A029)
    (simple remplacement de couleur, alpha conservé -> aucun halo)
  - construit color-strip-<v>.png : émeraude / vert foncé / doré,
    chacun en 512 (fond clair) + rond 96 (clair & sombre) + 32 (clair & sombre)
    pour valider la lisibilité sur fonds clair ET sombre (#0A0A0A du site).
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

EMERALD = (46, 153, 102)    # #2E9966
DARK = (15, 60, 45)         # #0F3C2D
GOLD = (197, 160, 41)       # #C5A029

LIGHT_BG = (255, 255, 255, 255)
DARK_BG = (10, 10, 10, 255)  # #0A0A0A — fond réel du site


def recolor(img, rgb):
    import numpy as np
    from PIL import Image
    a = np.asarray(img.convert("RGBA")).copy()
    a[..., 0], a[..., 1], a[..., 2] = rgb
    return Image.fromarray(a, "RGBA")


def _font(size):
    from PIL import ImageFont
    for p in (r"C:\Windows\Fonts\arialbd.ttf", r"C:\Windows\Fonts\arial.ttf"):
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


def tile(logo, px, bg, round_=False):
    from PIL import Image, ImageDraw
    t = Image.new("RGBA", (px, px), bg)
    inner = round(px * (0.78 if round_ else 0.86))
    lg = logo.copy()
    lg.thumbnail((inner, inner), Image.LANCZOS)
    t.alpha_composite(lg, ((px - lg.width) // 2, (px - lg.height) // 2))
    if round_:
        mask = Image.new("L", (px, px), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, px - 1, px - 1), fill=255)
        out = Image.new("RGBA", (px, px), (0, 0, 0, 0))
        out.paste(t, (0, 0), mask)
        return out
    return t


def main() -> int:
    v = sys.argv[1] if len(sys.argv) > 1 else "v1"
    src = DRAFTS / f"logo-{v}-transparent.png"
    if not src.exists():
        print(f"❌ introuvable : {src}")
        return 1
    from PIL import Image, ImageDraw
    base = Image.open(src).convert("RGBA")

    rows = [("émeraude #2E9966", EMERALD), ("vert foncé #0F3C2D", DARK),
            ("doré #C5A029", GOLD)]

    # Sauvegarde des déclinaisons transparentes (dark + gold).
    recolor(base, DARK).save(DRAFTS / f"logo-{v}-dark.png", "PNG")
    recolor(base, GOLD).save(DRAFTS / f"logo-{v}-gold.png", "PNG")
    print(f"  ✅ logo-{v}-dark.png  +  logo-{v}-gold.png")

    # Planche couleurs : 1 ligne par couleur, colonnes = aperçu / 96clair / 96sombre / 32clair / 32sombre.
    col_specs = [("aperçu", 180, LIGHT_BG, False), ("96 clair", 96, LIGHT_BG, True),
                 ("96 sombre", 96, DARK_BG, True), ("32 clair", 32, LIGHT_BG, False),
                 ("32 sombre", 32, DARK_BG, False)]
    pad, head_h, row_h, lab_w = 30, 80, 230, 240
    col_x = [lab_w]
    for _, px, _, _ in col_specs:
        col_x.append(col_x[-1] + max(px, 130) + 30)
    W = col_x[-1] + pad
    H = head_h + len(rows) * row_h + pad
    sheet = Image.new("RGBA", (W, H), (24, 24, 24, 255))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 22), f"ECOMY — déclinaisons couleur ({v})", font=_font(28),
           fill=(235, 235, 235, 255))
    # En-têtes de colonnes.
    for i, (name, *_rest) in enumerate(col_specs):
        cx = (col_x[i] + col_x[i + 1]) // 2
        d.text((cx, head_h - 24), name, font=_font(18), fill=(160, 160, 160, 255), anchor="ma")
    for r, (label, rgb) in enumerate(rows):
        cy = head_h + r * row_h
        logo = recolor(base, rgb)
        d.text((pad, cy + row_h // 2), label, font=_font(20), fill=(220, 220, 220, 255),
               anchor="lm")
        for i, (_, px, bg, rnd) in enumerate(col_specs):
            t = tile(logo, px, bg, round_=rnd)
            x = col_x[i] + ((col_x[i + 1] - col_x[i]) - px) // 2
            sheet.alpha_composite(t, (x, cy + (row_h - px) // 2))
    dst = DRAFTS / f"color-strip-{v}.png"
    sheet.convert("RGB").save(dst, "PNG")
    print(f"  🖼  {dst}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
