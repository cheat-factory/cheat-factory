# Guide de Configuration du Bot Discord

## 1. Activer les Intents sur Discord

1. Va sur https://discord.com/developers/applications
2. Sélectionne ton application
3. Va dans l'onglet "Bot"
4. Dans "Privileged Gateway Intents", active :
   - ❌ PRESENCE INTENT (pas nécessaire)
   - ✅ SERVER MEMBERS INTENT (si tu veux utiliser GuildMembers)
   - ❌ MESSAGE CONTENT INTENT (pas nécessaire)

## 2. Inviter le Bot avec les Bonnes Permissions

Utilise ce lien (remplace CLIENT_ID par ton ID) :
```
https://discord.com/api/oauth2/authorize?client_id=1406679259573125290&permissions=8&scope=bot%20applications.commands
```

Permissions nécessaires :
- Administrator (ou au minimum) :
  - Manage Roles
  - Read Messages/View Channels
  - Send Messages
  - Use Slash Commands
  - Embed Links

## 3. Vérifier la Configuration

Avant de lancer le bot, vérifie :

✅ Le bot est sur ton serveur Discord
✅ Le fichier .env est configuré
✅ Le token est valide (commence par MTQ...)
✅ Le GUILD_ID correspond à ton serveur
✅ Les rôles admin existent sur le serveur

## 4. Tester le Bot

```bash
# Installer les dépendances
npm install

# Lancer le bot
npm start
```

## 5. Erreurs Communes

### "Used disallowed intents"
→ Active les intents nécessaires sur Discord Developer Portal

### "Missing Access" 
→ Le bot n'est pas sur le serveur ou n'a pas les permissions

### "Token Invalid"
→ Le token dans .env est incorrect ou expiré

### "Unknown Guild"
→ Le GUILD_ID dans .env ne correspond pas à ton serveur

## 6. Commandes de Debug

Dans Discord, tape ces commandes pour tester :
- `/stats` - Voir si le bot répond
- `/cheatlist` - Lister les cheats
