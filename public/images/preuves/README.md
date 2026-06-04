# Dossier des preuves (captures d'écran clients)

Place ici les images de preuves (loubards de ventes, dashboards Shopify, captures de gains, etc.)
référencées par `data/testimonials.ts` (champ `image`).

## Convention de nommage

```
prenom-typedepreuve.png
```

Exemples :

| Fichier | Description |
|---|---|
| `youssef-dashboard.png` | Dashboard Shopify de Youssef |
| `amina-ventes.png` | Capture des ventes d'Amina |
| `khalid-stripe.png` | Paiement Stripe reçu par Khalid |

## Règles

- **Minuscules**, sans accents ni espaces (utiliser `-` comme séparateur).
- Formats : `.png`, `.jpg` ou `.webp` (préférer `.webp` pour le poids).
- Le chemin à mettre dans `data/testimonials.ts` est : `/images/preuves/nom-du-fichier.png`
  (le dossier `public/` n'apparaît PAS dans le chemin).
- Anonymiser / flouter toute donnée sensible (email, nom complet, n° de carte) avant publication.
