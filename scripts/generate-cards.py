#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génération des 6 visuels de fond des cartes de la landing ECOMY via l'API
images d'OpenAI. Même mécanique que scripts/generate-covers.py.

Lit content/editorial/cards.csv (colonnes : numero, slug, prompt) et génère
une image par ligne :
  - modèle gpt-image-2 (fallback gpt-image-1), qualité "high", paysage 16:9
  - recadrage intelligent final en 1280x720 (format aspect-video des cartes)
  - enregistrement dans public/images/cards/<slug>.png
  - si le PNG existe déjà -> saute (reprise possible)
  - 3 réessais par image, erreurs loguées dans cards-errors.log, on continue
  - coût total estimé affiché à la fin

DIFFÉRENCE avec generate-covers.py : ces images n'ont PAS de texte (le texte,
les prix et les avis sont en HTML par-dessus). On N'AJOUTE donc PAS le suffixe
de framing « safe zone for text » — juste un recadrage propre au format carte.

Lancement :
    1) Colle ta clé dans le fichier .env à la racine (OPENAI_API_KEY=...)
    2) pip install openai pillow numpy
    3) python scripts/generate-cards.py
"""

import base64
import csv
import os
import sys
import time
import traceback
from pathlib import Path

# Console Windows : force l'UTF-8 pour les emojis/arabe (évite cp1252).
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(encoding="utf-8")
    except (AttributeError, ValueError):
        pass

# --- Config -----------------------------------------------------------------
MODEL = "gpt-image-2"
FALLBACK_MODEL = "gpt-image-1"

API_SIZE = "1536x1024"          # paysage natif supporté (3:2), qualité haute
QUALITY = "high"
TARGET_W, TARGET_H = 1280, 720  # 16:9 final (= aspect-video des cartes)
MAX_RETRIES = 3

# NOTE : pas de FRAMING_SUFFIX ici. Les cartes n'ont pas de texte dans l'image,
# donc on n'impose pas de « safe zone for text » — on laisse le visuel respirer.

ROOT = Path(__file__).resolve().parents[1]


def _resolve(arg, default):
    """Résout un chemin CLI (relatif -> depuis la racine du projet)."""
    if arg is None:
        return default
    p = Path(arg)
    return p if p.is_absolute() else ROOT / p


# Surcouche CLI optionnelle pour réutiliser le même pipeline sur un autre lot :
#   python scripts/generate-cards.py [csv] [out_dir] [error_log]
# Sans argument -> comportement par défaut (les 6 cartes de la landing).
_argv = sys.argv[1:]
CSV_FILE = _resolve(_argv[0] if len(_argv) > 0 else None,
                    ROOT / "content" / "editorial" / "cards.csv")
OUT_DIR = _resolve(_argv[1] if len(_argv) > 1 else None,
                   ROOT / "public" / "images" / "cards")
ERROR_LOG = _resolve(_argv[2] if len(_argv) > 2 else None,
                     ROOT / "cards-errors.log")

# Tarifs publics gpt-image-1 (USD) : output image $40/Mtok, input texte $5/Mtok.
COST_OUT = 40e-6
COST_IN_TEXT = 5e-6
# Repère statique si l'API ne renvoie pas d'usage.
FALLBACK_COST_PER_IMAGE = 0.22


# --- .env loader (sans dépendance) ------------------------------------------
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


def image_cost(usage) -> float:
    """Coût indicatif (USD) à partir des tokens renvoyés."""
    if not usage:
        return FALLBACK_COST_PER_IMAGE
    out = getattr(usage, "output_tokens", 0) or 0
    inp_text = getattr(usage, "input_tokens", 0) or 0
    if out == 0 and inp_text == 0:
        return FALLBACK_COST_PER_IMAGE
    return out * COST_OUT + inp_text * COST_IN_TEXT


def log_error(slug: str, msg: str) -> None:
    with ERROR_LOG.open("a", encoding="utf-8") as f:
        f.write(f"[{slug}] {msg}\n")


def best_crop_top(img, crop_h: int) -> int:
    """Choisit l'offset vertical (0..h-crop_h, pas de 8, plafond 160) dont la
    fenêtre de crop_h px MAXIMISE la luminosité contenue (le contenu doré est
    lumineux). Repli sur le centre si numpy est absent."""
    w, h = img.size
    max_top = h - crop_h
    if max_top <= 0:
        return 0
    try:
        import numpy as np
    except ImportError:
        return max_top // 2

    gray = np.asarray(img.convert("L"), dtype=np.float64)  # (h, w)
    row_sum = gray.sum(axis=1)                              # luminosité par ligne
    cum = np.concatenate(([0.0], np.cumsum(row_sum)))       # somme préfixe

    best_top, best_score = 0, -1.0
    offsets = list(range(0, min(160, max_top) + 1, 8))
    if max_top not in offsets:
        offsets.append(max_top)
    for top in offsets:
        score = cum[top + crop_h] - cum[top]               # luminosité fenêtre
        if score > best_score:
            best_score, best_top = score, top
    return best_top


def content_rows(img):
    """Renvoie (top, bottom) des lignes « à contenu » : une ligne compte si plus
    de 2% de sa largeur a une luminance > 60. (top, bottom) inclusifs, ou None
    si aucune ligne ne contient de contenu (image entièrement sombre)."""
    import numpy as np
    gray = np.asarray(img.convert("L"))            # (h, w) uint8
    w = gray.shape[1]
    bright_per_row = (gray > 60).sum(axis=1)       # nb de pixels lumineux / ligne
    is_content = bright_per_row > (0.02 * w)       # seuil 2% de la largeur
    idx = np.where(is_content)[0]
    if idx.size == 0:
        return None
    return int(idx[0]), int(idx[-1])


def widen_to_ratio(img):
    """CAS B : ne coupe pas. Garde toute la hauteur et élargit les côtés jusqu'au
    ratio 16:9 (ex. 1536x1024 -> 1820x1024). Remplissage propre des marges :
      - couleur MÉDIANE unie des 10 colonnes de bord (gauche/droite séparément),
      - fondu linéaire de 80px entre le bord de l'image et le remplissage,
      - léger grain (±3 niveaux) sur la zone remplie pour matcher la texture."""
    import numpy as np
    from PIL import Image

    arr = np.asarray(img, dtype=np.float64)          # (h, w, 3)
    h, w, _ = arr.shape
    target_w = round(h * TARGET_W / TARGET_H)        # 1024 * 1280/720 = 1820
    if target_w <= w:
        return img
    pad = target_w - w
    left_pad = pad // 2
    right_pad = pad - left_pad
    fade = 80

    # Couleur médiane unie des 10 colonnes de bord (gauche / droite).
    left_med = np.median(arr[:, :10, :].reshape(-1, 3), axis=0)    # (3,)
    right_med = np.median(arr[:, -10:, :].reshape(-1, 3), axis=0)  # (3,)
    edge_left = arr[:, 0, :]                          # colonne de bord image (h,3)
    edge_right = arr[:, -1, :]

    canvas = np.empty((h, target_w, 3), dtype=np.float64)
    canvas[:, left_pad:left_pad + w, :] = arr        # original net au centre
    if left_pad > 0:
        canvas[:, :left_pad, :] = left_med           # remplissage uni
    if right_pad > 0:
        canvas[:, left_pad + w:, :] = right_med

    # Fondu gauche : sur les 80px de marge collés à l'image.
    fl = min(fade, left_pad)
    if fl > 0:
        a = ((np.arange(fl) + 1) / fl)[None, :, None]          # 0->1 vers le raccord
        band = a * edge_left[:, None, :] + (1 - a) * left_med  # (h, fl, 3)
        canvas[:, left_pad - fl:left_pad, :] = band

    # Fondu droit : sur les 80px de marge collés à l'image.
    fr = min(fade, right_pad)
    if fr > 0:
        a = ((np.arange(fr, 0, -1)) / fr)[None, :, None]       # 1->0 en s'éloignant
        band = a * edge_right[:, None, :] + (1 - a) * right_med
        canvas[:, left_pad + w:left_pad + w + fr, :] = band

    # Grain léger ±3 niveaux uniquement sur les marges remplies.
    if pad > 0:
        noise = np.random.default_rng(0).integers(-3, 4, size=(h, target_w, 3))
        if left_pad > 0:
            canvas[:, :left_pad, :] += noise[:, :left_pad, :]
        if right_pad > 0:
            canvas[:, left_pad + w:, :] += noise[:, left_pad + w:, :]

    canvas = np.clip(canvas, 0, 255).astype(np.uint8)
    return Image.fromarray(canvas, "RGB")


def save_cropped(raw: bytes, out_file: Path) -> None:
    """CAS A — le contenu tient dans 864px : recadrage intelligent (fenêtre la plus
    lumineuse). CAS B — le contenu dépasse 864px : on n'ampute pas, on élargit les
    côtés jusqu'au 16:9. Dans les deux cas resize final en 1280x720.
    Repli centré si numpy absent ; repli image native si Pillow absent."""
    try:
        import io
        from PIL import Image
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        w, h = img.size
        crop_h = round(w * TARGET_H / TARGET_W)      # 864

        try:
            import numpy  # noqa: F401
            rows = content_rows(img)
        except ImportError:
            rows = None                              # pas de numpy -> CAS A centré

        content_h = (rows[1] - rows[0] + 1) if rows else 0

        if rows is not None and content_h > crop_h and crop_h <= h:
            # CAS B : contenu trop haut -> élargir sans couper
            img = widen_to_ratio(img)
        elif crop_h <= h:
            # CAS A : contenu compact -> garder la fenêtre la plus lumineuse
            top = best_crop_top(img, crop_h)
            img = img.crop((0, top, w, top + crop_h))

        img = img.resize((TARGET_W, TARGET_H), Image.LANCZOS)
        img.save(out_file, "PNG")
    except ImportError:
        out_file.write_bytes(raw)
        print("   ⚠️ Pillow absent : image native enregistrée sans recadrage.")


def main() -> int:
    load_env(ROOT / ".env")
    api_key = os.environ.get("OPENAI_API_KEY", "").strip()
    if not api_key:
        print("❌ OPENAI_API_KEY vide. Colle ta clé dans le fichier .env à la racine.")
        return 1

    if not CSV_FILE.exists():
        print(f"❌ CSV introuvable : {CSV_FILE}")
        return 1

    try:
        from openai import OpenAI
    except ImportError:
        print("❌ SDK manquant. Installe-le :  pip install openai pillow numpy")
        return 1

    client = OpenAI(api_key=api_key)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # État du modèle : on bascule définitivement sur le fallback dès qu'on
    # constate que gpt-image-2 est indisponible (évite de réessayer à chaque image).
    state = {"model": MODEL}

    def generate(prompt: str):
        # PAS de suffixe de framing : visuels sans texte intégré.
        def call(model: str):
            return client.images.generate(
                model=model, prompt=prompt, size=API_SIZE, quality=QUALITY, n=1,
            )
        try:
            return call(state["model"])
        except Exception as e:
            msg = str(e).lower()
            indispo = "model" in msg and ("not" in msg or "404" in msg or "exist" in msg)
            if state["model"] != FALLBACK_MODEL and indispo:
                print(f"   ⚠️ '{state['model']}' indisponible. Bascule définitive sur '{FALLBACK_MODEL}'.")
                state["model"] = FALLBACK_MODEL
                return call(FALLBACK_MODEL)
            raise

    with CSV_FILE.open(encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))

    total = len(rows)
    done = skipped = failed = 0
    total_cost = 0.0

    print(f"📋 {total} lignes dans {CSV_FILE.name} | modèle={state['model']} | sortie={OUT_DIR}")

    for i, row in enumerate(rows, 1):
        slug = (row.get("slug") or "").strip()
        prompt = (row.get("prompt") or "").strip()
        numero = (row.get("numero") or "").strip()
        if not slug or not prompt:
            print(f"[{i}/{total}] ⏭️  ligne ignorée (slug/prompt vide)")
            continue

        out_file = OUT_DIR / f"{slug}.png"
        if out_file.exists():
            print(f"[{i}/{total}] ⏭️  {slug} — existe déjà, saut.")
            skipped += 1
            continue

        ok = False
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                print(f"[{i}/{total}] #{numero} {slug} — génération (essai {attempt}/{MAX_RETRIES})…")
                resp = generate(prompt)
                raw = base64.b64decode(resp.data[0].b64_json)
                save_cropped(raw, out_file)
                cost = image_cost(getattr(resp, "usage", None))
                total_cost += cost
                print(f"   ✅ {out_file.name}  (~${cost:.4f})")
                ok = True
                break
            except Exception as e:
                first = str(e).splitlines()[0] if str(e) else repr(e)
                print(f"   ⚠️ erreur essai {attempt} : {first}")
                log_error(slug, f"essai {attempt} : {traceback.format_exc()}")
                if attempt < MAX_RETRIES:
                    time.sleep(2 * attempt)  # backoff

        if ok:
            done += 1
        else:
            failed += 1
            print(f"   ❌ {slug} — échec après {MAX_RETRIES} essais (voir {ERROR_LOG.name}).")

    print("\n" + "=" * 60)
    print(f"✅ Générées : {done} | ⏭️ Sautées : {skipped} | ❌ Échecs : {failed} | Total lignes : {total}")
    print(f"💰 Coût total estimé : ~${total_cost:.2f} (modèle={state['model']})")
    if failed:
        print(f"⚠️  Détails des erreurs dans : {ERROR_LOG}")
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
