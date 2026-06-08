Produis le prochain lot d'articles du blog :
1. Lis content/editorial/plan.csv et prends les 3 premières lignes en statut "a_faire"
2. Lis content/editorial/GUIDE-REDACTION.md + les 2 articles déjà publiés comme modèles de style
3. Rédige les 3 articles complets en .mdx dans content/blog/ en respectant CHAQUE règle du guide, carrousels avec ids réels de data/testimonials.ts
4. Passe leur statut à "apercu", lance le serveur de dev et donne-moi les 3 URLs locales à vérifier
5. STOP : attends ma validation explicite ("OK" ou corrections article par article)
6. Après mon OK : statut "publie", npm run build (doit passer), commit "feat(blog): lot articles SEO" et push
