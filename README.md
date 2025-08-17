# Bot Discord - Authentification & Contrôle du Site

## Installation

1. **Créer une application Discord**
   - Va sur https://discord.com/developers/applications
   - Clique sur "New Application"
   - Donne un nom à ton application
   - Va dans "Bot" et clique sur "Add Bot"
   - Copie le token du bot

2. **Inviter le bot sur ton serveur**
   - Dans "OAuth2" > "URL Generator"
   - Coche "bot" et "applications.commands"
   - Dans les permissions, coche "Administrator"
   - Copie l'URL générée et ouvre-la pour inviter le bot

3. **Configurer le fichier .env**
   ```env
   BOT_TOKEN=ton_token_bot
   CLIENT_ID=1406428707681472612
   CLIENT_SECRET=ton_client_secret
   GUILD_ID=id_de_ton_serveur
   ADMIN_ROLES=role_id_1,role_id_2
   PORT=3000
   ```

4. **Installer les dépendances**
   ```bash
   npm install
   ```

5. **Démarrer le bot**
   ```bash
   npm start
   ```

## Commandes Discord

### Gestion des Admins
- `/addadmin @user` - Ajouter un admin
- `/removeadmin @user` - Retirer un admin
- `/listadmins` - Lister tous les admins

### Gestion des Cheats
- `/cheatlist` - Voir tous les cheats
- `/cheatstatus <id> <status>` - Changer le statut d'un cheat
- `/addcheat <title> <image> <link>` - Ajouter un nouveau cheat
- `/removecheat <id>` - Supprimer un cheat
- `/stats` - Voir les statistiques du site

## API Endpoints

### Authentification
- `POST /api/check-admin` - Vérifier si un utilisateur est admin
  ```json
  {
    "userId": "123456789",
    "token": "discord_token"
  }
  ```

### Gestion des Cheats
- `GET /api/cheats` - Obtenir tous les cheats
- `GET /api/cheats/:id` - Obtenir un cheat spécifique
- `PUT /api/cheats/:id` - Mettre à jour un cheat (auth requise)
  ```json
  {
    "token": "discord_token",
    "title": "Nouveau titre",
    "image": "url_image",
    "link": "url_download",
    "status": true
  }
  ```
- `POST /api/cheats` - Ajouter un nouveau cheat (auth requise)
- `DELETE /api/cheats/:id` - Supprimer un cheat (auth requise)

### Informations
- `GET /api/server-info` - Infos du serveur Discord
- `GET /api/stats` - Statistiques du site

## Utilisation depuis le Site Web

```javascript
// Exemple d'utilisation de l'API
const API_URL = 'http://localhost:3000';

// Récupérer tous les cheats
fetch(`${API_URL}/api/cheats`)
  .then(res => res.json())
  .then(data => console.log(data.cheats));

// Mettre à jour un cheat (avec auth)
fetch(`${API_URL}/api/cheats/mhur`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    token: localStorage.getItem('discord_token'),
    status: false
  })
});
```

## Déploiement

### Sur Heroku
1. Créer un compte Heroku
2. Installer Heroku CLI
3. Dans le dossier du bot:
   ```bash
   heroku create ton-bot-name
   heroku config:set BOT_TOKEN=ton_token
   heroku config:set GUILD_ID=ton_guild_id
   git push heroku main
   ```

### Sur un VPS
1. Cloner le repo sur le VPS
2. Installer Node.js et npm
3. Configurer PM2:
   ```bash
   npm install -g pm2
   pm2 start bot.js --name "cheat-bot"
   pm2 save
   pm2 startup
   ```

## Sécurité

- Ne jamais partager ton token bot
- Utiliser HTTPS en production
- Limiter les CORS aux domaines autorisés
- Vérifier toujours les tokens Discord côté serveur
