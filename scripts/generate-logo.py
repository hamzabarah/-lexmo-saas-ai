#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère le logo ECOMY (sac shopping + flèche de croissance en découpe) via l'API
images d'OpenAI — réutilise la config de generate-covers.py (clé .env, client,
modèle gpt-image-2 + fallback gpt-image-1, qualité high).

Pour CHAQUE variante (4 par défaut) :
  1) génération carrée 1024x1024
  2) détourage propre du fond blanc -> transparent, SANS halo (recolore en aplati
     la couleur de marque + alpha dérivé de la distance au blanc)
  3) trim serré + mise au carré -> logo-vX-transparent.png (haute résolution)
Puis construit une planche comparative (4 variantes x 512px / rond 96px / 32px).

Lancement : python scripts/generate-logo.py
"""

import base64
import os
import sys
import time
import traceback
from pathlib import Path

for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

# --- Config (reprise de generate-covers.py) ---------------------------------
MODEL = "gpt-image-2"
FALLBACK_MODEL = "gpt-image-1"
API_SIZE = "1024x1024"          # carré natif pour une icône
QUALITY = "high"
N_VARIANTS = 4
MAX_RETRIES = 3

EMERALD = (46, 153, 102)        # #2E9966 — couleur de marque du logo

PROMPT = (
    "Minimal flat vector logo icon: a simple shopping bag with an upward trending "
    "growth arrow integrated inside it as a cutout. Single solid color: emerald "
    "green (#2E9966). Clean geometric shapes, bold thick strokes, perfectly "
    "balanced, centered. Pure flat design — no gradients, no shadows, no 3D, no "
    "text, no letters, no background scene. Plain white background. Professional "
    "brand mark, readable at very small sizes (favicon)."
)

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "logo-drafts"
ERROR_LOG = ROOT / "logo-errors.log"


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key, val = key.strip(), val.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = val


def log_error(tag: str, msg: str) -> None:
    with ERROR_LOG.open("a", encoding="utf-8") as f:
        f.write(f"[{tag}] {msg}\n")


def to_transparent(raw: bytes, color=EMERALD):
    """Fond blanc -> transparent, sans halo. Pour un logo monochrome : on aplatit
    toute la marque à `color` et on dérive l'alpha de la distance au blanc, donc
    aucun liseré blanc ne subsiste sur les bords anti-aliasés."""
    import io
    import numpy as np
    from PIL import Image
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    arr = np.asarray(img, dtype=np.float64)
    # Distance au blanc (0 = blanc pur, grand = encre).
    dist = np.sqrt(((255.0 - arr) ** 2).sum(axis=2))
    lo, hi = 45.0, 130.0           # rampe douce : <lo => transparent, >hi => opaque
    alpha = np.clip((dist - lo) / (hi - lo), 0.0, 1.0)
    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = color
    out[..., 3] = (alpha * 255).astype(np.uint8)
    return Image.fromarray(out, "RGBA")


def trim_square(img, margin_ratio=0.08):
    """Trim serré sur l'alpha puis mise au carré centré avec une petite marge."""
    import numpy as np
    from PIL import Image
    a = np.asarray(img)[..., 3]
    ys, xs = np.where(a > 16)
    if xs.size == 0:
        return img
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cropped = img.crop((int(x0), int(y0), int(x1) + 1, int(y1) + 1))
    w, h = cropped.size
    side = int(round(max(w, h) * (1 + 2 * margin_ratio)))
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(cropped, ((side - w) // 2, (side - h) // 2), cropped)
    return canvas


# ---------- planche comparative ----------
def _font(size):
    from PIL import ImageFont
    for p in (r"C:\Windows\Fonts\arialbd.ttf", r"C:\Windows\Fonts\arial.ttf"):
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


def _tile_on_white(logo, px, round_=False):
    """Logo composité sur une tuile blanche px×px (cercle si round_)."""
    from PIL import Image, ImageDraw
    tile = Image.new("RGBA", (px, px), (255, 255, 255, 255))
    inner = round(px * (0.78 if round_ else 0.86))
    lg = logo.copy()
    lg.thumbnail((inner, inner), Image.LANCZOS)
    tile.alpha_composite(lg, ((px - lg.width) // 2, (px - lg.height) // 2))
    if round_:
        mask = Image.new("L", (px, px), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, px - 1, px - 1), fill=255)
        out = Image.new("RGBA", (px, px), (0, 0, 0, 0))
        out.paste(tile, (0, 0), mask)
        return out
    return tile


def build_sheet(variant_imgs, dst):
    """variant_imgs : liste de (label, RGBA). Colonnes = variantes, lignes 512/96/32."""
    from PIL import Image, ImageDraw
    col_w, pad = 540, 40
    head_h, label_h = 70, 30
    big, mid, small = 512, 96, 32
    row_big = big + label_h
    row_mid = 160
    row_small = 110
    n = len(variant_imgs)
    W = pad + n * col_w
    H = head_h + row_big + row_mid + row_small + pad
    sheet = Image.new("RGBA", (W, H), (24, 24, 24, 255))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 24), "ECOMY — variantes du logo (512 / rond 96 / favicon 32)",
           font=_font(30), fill=(230, 230, 230, 255))

    flabel = _font(26)
    fsmall = _font(20)
    for i, (label, logo) in enumerate(variant_imgs):
        cx = pad + i * col_w + (col_w - big) // 2
        y = head_h
        # 512
        big_tile = _tile_on_white(logo, big)
        sheet.alpha_composite(big_tile, (cx, y))
        d.text((pad + i * col_w + col_w // 2, y + big + 4), label, font=flabel,
               fill=(220, 220, 220, 255), anchor="ma")
        # rond 96
        y2 = head_h + row_big + 20
        cxm = pad + i * col_w + (col_w - mid) // 2
        sheet.alpha_composite(_tile_on_white(logo, mid, round_=True), (cxm, y2))
        d.text((pad + i * col_w + col_w // 2, y2 + mid + 6), "rond 96", font=fsmall,
               fill=(150, 150, 150, 255), anchor="ma")
        # 32
        y3 = head_h + row_big + row_mid + 20
        cxs = pad + i * col_w + (col_w - small) // 2
        sheet.alpha_composite(_tile_on_white(logo, small), (cxs, y3))
        d.text((pad + i * col_w + col_w // 2, y3 + small + 6), "favicon 32",
               font=fsmall, fill=(150, 150, 150, 255), anchor="ma")
    sheet.convert("RGB").save(dst, "PNG")


def main() -> int:
    load_env(ROOT / ".env")
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        print("❌ OPENAI_API_KEY vide (.env).")
        return 1
    try:
        from openai import OpenAI
    except ImportError:
        print("❌ pip install openai pillow numpy")
        return 1

    client = OpenAI(api_key=api_key)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    state = {"model": MODEL}

    def generate():
        def call(model):
            return client.images.generate(model=model, prompt=PROMPT,
                                           size=API_SIZE, quality=QUALITY, n=1)
        try:
            return call(state["model"])
        except Exception as e:
            msg = str(e).lower()
            if state["model"] != FALLBACK_MODEL and "model" in msg and (
                    "not" in msg or "404" in msg or "exist" in msg):
                print(f"   ⚠️ '{state['model']}' indispo -> '{FALLBACK_MODEL}'.")
                state["model"] = FALLBACK_MODEL
                return call(FALLBACK_MODEL)
            raise

    variants = []
    total_cost = 0.0
    for v in range(1, N_VARIANTS + 1):
        ok = False
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                print(f"[v{v}/{N_VARIANTS}] génération (essai {attempt})…")
                resp = generate()
                raw = base64.b64decode(resp.data[0].b64_json)
                rgba = trim_square(to_transparent(raw))
                dst = OUT_DIR / f"logo-v{v}-transparent.png"
                rgba.save(dst, "PNG")
                variants.append((f"v{v}", rgba))
                total_cost += 0.17
                print(f"   ✅ {dst.name}  ({rgba.width}x{rgba.height})")
                ok = True
                break
            except Exception as e:
                print(f"   ⚠️ erreur essai {attempt}: {str(e).splitlines()[0]}")
                log_error(f"v{v}", traceback.format_exc())
                if attempt < MAX_RETRIES:
                    time.sleep(2 * attempt)
        if not ok:
            print(f"   ❌ v{v} échec.")

    if variants:
        sheet = OUT_DIR / "comparison.png"
        build_sheet(variants, sheet)
        print(f"\n🖼  Planche : {sheet}")
    print(f"💰 Coût estimé : ~${total_cost:.2f} ({len(variants)} variantes, {state['model']})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
