Production automatique continue du blog :
1. Lis content/editorial/plan.csv et prends les 3 premières lignes en statut "a_faire"
2. Lis content/editorial/GUIDE-REDACTION.md + 2 articles publiés récents comme modèles
3. Rédige les 3 articles complets (.mdx dans content/blog/) en respectant CHAQUE règle du guide, carrousels avec ids réels de data/testimonials.ts
4. AUTO-CONTRÔLE avant publication, pour chaque article vérifie : encadré réponse directe 40-60 mots ✓ format snippet conforme au plan.csv ✓ 1 tableau ✓ carrousels (jamais d'élément seul) ✓ FAQ 5-6 ✓ maillage interne ✓ 1500-2200 mots ✓ auteur "فريق أكاديمية إيكومي" ✓ aucune promesse de gains garantis ✓. Si un point échoue → corrige avant de continuer.
5. Statut → "publie", npm run build (doit passer sinon corrige), commit "feat(blog): lot auto" et push
6. ENCHAÎNE directement avec le lot de 3 suivant (retour à l'étape 1), sans me demander
7. Continue jusqu'à épuisement des "a_faire" du plan.csv OU jusqu'à ce que je t'arrête
8. À la fin, donne-moi un rapport : articles publiés (titres + URLs), points corrigés par l'auto-contrôle, et ce qui reste dans le plan
