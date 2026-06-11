#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Exporte les miniatures WebP des cartes latérales des pages de vente.

Source : les 3 petites images dédiées (générées spécialement pour le petit
format, un seul élément fort + fond propre) dans public/images/sales/.
Sortie : WebP optimisé sous 80 Ko, au ratio EXACT de la carte (aspect-video 16:9).

Comme ces images sont déjà composées pour la miniature, on NE recadre PAS (pas de
zoom) : on les ramène simplement au 16:9 exact de la carte puis on encode en WebP.

Sans coût API : lit les PNG déjà générés, ne régénère rien.
Lancement : python scripts/make-sales-thumbs.py
"""

import sys
from pathlib import Path

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

ROOT = Path(__file__).resolve().parents[1]
SALES_DIR = ROOT / "public" / "images" / "sales"

# (png source dédiée petit format, webp de sortie câblé dans la carte).
PAIRS = [
    ("petite-formation.png", "petite-formation.webp"),
    ("petite-accompagnement.png", "petite-accompagnement.webp"),
    ("petite-diagnostic.png", "petite-diagnostic.webp"),
]

OUT_W, OUT_H = 640, 360   # 16:9 EXACT = aspect-video de la carte
MAX_BYTES = 80 * 1024     # < 80 Ko


def make_thumb(src: Path, dst: Path) -> None:
    from PIL import Image
    img = Image.open(src).convert("RGB")
    w, h = img.size
    # Sécurité : si la source n'est pas déjà en 16:9, on recadre au CENTRE
    # au ratio 16:9 (sans zoom) pour garantir le ratio exact de la carte.
    target_ratio = OUT_W / OUT_H
    if abs((w / h) - target_ratio) > 0.001:
        if (w / h) > target_ratio:                 # trop large -> rogner les côtés
            new_w = round(h * target_ratio)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:                                      # trop haut -> rogner haut/bas
            new_h = round(w / target_ratio)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
    img = img.resize((OUT_W, OUT_H), Image.LANCZOS)

    # Descend la qualité jusqu'à passer sous 80 Ko.
    for q in range(82, 39, -6):
        img.save(dst, "WEBP", quality=q, method=6)
        size = dst.stat().st_size
        if size <= MAX_BYTES:
            print(f"  ✅ {dst.name}  ({size/1024:.1f} Ko, q={q})")
            return
    print(f"  ⚠️ {dst.name}  ({dst.stat().st_size/1024:.1f} Ko, qualité min atteinte)")


def main() -> int:
    missing = [s for s, _ in PAIRS if not (SALES_DIR / s).exists()]
    if missing:
        print(f"❌ Source(s) manquante(s) : {missing}. Génère-les d'abord.")
        return 1
    print(f"🖼  Miniatures WebP ({OUT_W}x{OUT_H} = 16:9 carte, <80 Ko) -> {SALES_DIR}")
    for src_name, dst_name in PAIRS:
        make_thumb(SALES_DIR / src_name, SALES_DIR / dst_name)
    return 0


if __name__ == "__main__":
    sys.exit(main())
