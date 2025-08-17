# Cheat Factory — Site statique

Ce dépôt contient un site HTML/CSS/JS statique prêt pour GitHub Pages, avec authentification Discord (OAuth2 Implicit Grant) et thèmes clair/sombre avec animations.

## Publier sur GitHub Pages

1. Pousse tout le dossier à la racine du repo (index.html, style-modern.css, script-modern.js, images/)
2. Assure-toi que ce fichier `.nojekyll` est présent à la racine (déjà ajouté ici)
3. Dans GitHub → Settings → Pages:
   - Source: Deploy from a branch
   - Branch: `main`
   - Folder: `/` (root)
   - Save
4. L’URL publique sera: `https://<ton-user>.github.io/<nom-du-repo>/`

> Astuce: si le repo s’appelle exactement `<ton-user>.github.io`, l’URL publique sera `https://<ton-user>.github.io/`.

## Configuration OAuth2 Discord

1. Va sur https://discord.com/developers/applications → New Application
2. Copie le Client ID et remplace dans `script-modern.js` si nécessaire.
3. Dans OAuth2 → General:
   - Redirects: ajoute exactement `https://<ton-user>.github.io/<nom-du-repo>/index.html`
   - Grant Types: coche `Implicit Grant`
   - Scopes: `identify` (et `email` si besoin)
4. Enregistre.

Le code front utilise `REDIRECT_URI = window.location.origin + window.location.pathname;` donc la redirection pointera automatiquement vers la page en cours, ce qui est compatible GitHub Pages.

## Tester en local

- Utilise un serveur local (pas `file://`). Par exemple avec Node:

```powershell
npx http-server -p 8080
```

- Ouvre `http://localhost:8080/index.html` et ajoute cette URL aux Redirects du portail Discord si tu veux tester l’OAuth en local.

## Dépannage

- Page blanche: vérifie que `index.html` est bien à la racine du repo et que Pages est activé.
- Assets 404: vérifie chemins et casse (`images/logo.png` doit exister et respecter la casse).
- OAuth `Invalid Redirect URI`: l’URL configurée dans Discord ne correspond pas exactement à l’URL de la page.
- Rien après login: vérifie que tu n’es pas en `file://` et que la redirection renvoie bien sur ta page GitHub Pages.

## Licence

Ce projet est fourni tel quel pour un hébergement statique.
