# GUIDE DE RÉDACTION — Blog SEO arabe ECOMY

> Le contrat de qualité de CHAQUE article. À lire avant de rédiger, à respecter règle par règle.

## Langue et ton

- Arabe fusha moderne, fluide, jamais de traduction mot à mot de l'anglais.
- Tutoiement direct du lecteur, phrases courtes, zéro remplissage.
- INTERDIT : mentionner le nom du propriétaire du site. L'auteur est toujours **"فريق أكاديمية إيكومي"**.
- Positionnement constant : le **"نظام الماركة"** est notre différenciateur vs le dropshipping bas de gamme.
- **SEO — graphie latine** : Termes techniques toujours avec graphie latine entre parenthèses à la 1re mention : الدروبشيبينغ (dropshipping), شوبيفاي (Shopify), الدفع عند الاستلام (COD)… — au Maghreb on cherche en lettres latines.

## Structure obligatoire (le moule des 2 articles de référence)

1. **Front-matter complet** : `title` (avec l'année en cours), `description` (≤160 car., contient la réponse), `slug` (translittération), `date`, `updated`, `author`, `category`, `cover: ""` (toujours vide), `keywords` (5), `faq` (5-6 paires question/réponse).
2. **Encadré réponse directe en haut** (cible : featured snippet) — 40 à 60 mots, réponse complète, chiffres en gras. Composant : `<DirectAnswer>`.
3. **Format selon le type de question** :
   - `كيف` → liste numérotée des étapes juste après l'encadré, puis un H3 par étape.
   - `هل` / `كم` → réponse directe nuancée en paragraphe court, puis développement.
4. **Un tableau de données concret** (coûts, comparaison, ou chiffres) par article — utiliser `<ComparisonTable>` si c'est le composant du projet (ou un tableau Markdown selon le besoin).
5. **Preuves** : 1 `<VideoCarousel ids={[...]} />` + 1-2 `<ProofCarousel ids={[...]} />` dans une section "شاهد نتائج..." aux 2/3 de l'article. Ids choisis dans `data/testimonials.ts` selon la pertinence (pays, profil, sujet). **JAMAIS d'élément seul** (pas de `<ClientVideo>`/`<ProofImage>` isolé).
6. **CTA** : `<BlogCTA variant="diagnostic" />` au premier tiers ; le CTA formation de fin est **automatique**, ne pas le dupliquer (ne pas ajouter de `<CTABox>` ni de second `<BlogCTA>` formation).
7. **Section localisation** quand pertinent : المغرب / الجزائر / أوروبا / الخليج (devises locales DH/DA/€).
8. **Maillage interne** : 1 à 2 liens vers les articles déjà publiés du blog (URLs relatives `/blog/...`).
9. **Longueur** : Rédige D'EMBLÉE 1600-2200 mots avec des sections de fond réelles (exemple chiffré concret, cas pratique étape par étape, mini étude de cas). Ne jamais rallonger artificiellement après coup — la longueur vient du fond, pas du remplissage.
10. **JAMAIS de promesses de revenus garantis** ; toujours "نتائج موثقة" + nuance "ليس للجميع".

## Composants disponibles (components/blog/)

- `<DirectAnswer>…</DirectAnswer>` — encadré doré "الجواب المباشر".
- `<TableOfContents />` — sommaire auto depuis les H2.
- `<ComparisonTable title rows={[[...]]} />` — tableau RTL, en-tête or.
- `<VideoCarousel ids={[...]} />` — carrousel de témoignages vidéo (façade YouTube lazy).
- `<ProofCarousel ids={[...]} />` — carrousel de captures/preuves (lightbox).
- `<HonestList items={[[titre, texte]]} />` · `<GeoTabs tabs={[[pays, texte]]} />` · `<Timeline steps={[[label, texte]]} />`.
- `<FAQ items={[[q, a]]} />` (in-content, génère JSON-LD) — OU `faq:` dans le front-matter (rendu auto en bas).
- `<BlogCTA variant="diagnostic" />` — CTA diagnostic.

Rappel : ids = clés réelles de `data/testimonials.ts`. Vérifier qu'ils existent avant de publier.

## Sélection des preuves (carrousels)

Les carrousels ne sont JAMAIS choisis au hasard. Pour chaque article :
- VIDÉOS = crédibilité : choisir des témoignages dont le profil colle au sujet/à l'audience de l'article (pays, genre, situation).
- SCREENS = résultats : montrer une GAMME (du petit chiffre au gros) et des PROFILS VARIÉS (hommes/femmes, plusieurs nationalités), pas toujours les mêmes.
- Sujets sensibles (halal, légal, taxes) : vidéos de crédibilité uniquement, aucune capture de gains.
- Sur l'ensemble du blog, répartir les preuves pour éviter qu'un même témoignage revienne sur trop d'articles.

> Champs utiles dans `data/testimonials.ts` pour appliquer cette règle : `gender` (homme/femme), `countryCode` (pays), `tags` (profil/situation), et `resultLevel` (petit/moyen/gros) pour doser la gamme des screens.
