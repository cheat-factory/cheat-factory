const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Configuration
const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const GUILD_ID = process.env.GUILD_ID;
const ADMIN_ROLE_IDS = process.env.ADMIN_ROLES ? process.env.ADMIN_ROLES.split(',') : [];
const PORT = process.env.PORT || 3000;

// Vérification de la configuration
if (!BOT_TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error('❌ Configuration manquante ! Vérifie ton fichier .env');
    console.error('BOT_TOKEN:', BOT_TOKEN ? '✅' : '❌');
    console.error('CLIENT_ID:', CLIENT_ID ? '✅' : '❌');
    console.error('GUILD_ID:', GUILD_ID ? '✅' : '❌');
    process.exit(1);
}

// Initialisation du bot Discord avec les bons intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers, // Active cet intent
        // GatewayIntentBits.GuildMessages, // Pas nécessaire pour ce bot
    ]
});

// Initialisation du serveur Express pour l'API
const app = express();
app.use(cors());
app.use(express.json());

// Fonction pour vérifier si un utilisateur a un rôle admin
async function checkAdminRole(userId) {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        const member = await guild.members.fetch(userId);
        
        if (!member) {
            return { isAdmin: false, error: 'Membre non trouvé sur le serveur' };
        }
        
        const hasAdminRole = member.roles.cache.some(role => 
            ADMIN_ROLE_IDS.includes(role.id)
        );
        
        return {
            isAdmin: hasAdminRole,
            username: member.user.username,
            nickname: member.nickname || member.user.username,
            roles: member.roles.cache.map(role => ({
                id: role.id,
                name: role.name,
                color: role.hexColor
            }))
        };
    } catch (error) {
        console.error('Erreur lors de la vérification des rôles:', error);
        return { isAdmin: false, error: error.message };
    }
}

// Route API pour vérifier les droits admin
app.post('/api/check-admin', async (req, res) => {
    const { userId, token } = req.body;
    
    if (!userId || !token) {
        return res.status(400).json({ error: 'userId et token requis' });
    }
    
    try {
        // Vérifier le token avec l'API Discord
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!userResponse.ok) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        
        const userData = await userResponse.json();
        
        if (userData.id !== userId) {
            return res.status(401).json({ error: 'Token ne correspond pas à l\'utilisateur' });
        }
        
        // Vérifier les rôles
        const roleCheck = await checkAdminRole(userId);
        
        res.json({
            success: true,
            ...roleCheck
        });
        
    } catch (error) {
        console.error('Erreur API:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour obtenir les infos du serveur
app.get('/api/server-info', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        res.json({
            name: guild.name,
            memberCount: guild.memberCount,
            icon: guild.iconURL(),
            adminRoles: ADMIN_ROLE_IDS
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Stockage des données des cheats (synchronisé avec le site)
let cheatsData = [];

// Charger les données des cheats
async function loadCheatsData() {
    try {
        const dataPath = path.join(__dirname, 'cheats.json');
        const data = await fs.readFile(dataPath, 'utf8');
        cheatsData = JSON.parse(data);
    } catch (error) {
        // Utiliser les données par défaut si le fichier n'existe pas
        cheatsData = [
            {
                id: 'mhur',
                title: 'MHUR Cheat',
                image: 'https://cdn.discordapp.com/attachments/1304446845057110088/1405611508116885666/image.png',
                link: 'https://gofile.io/d/WDS4RL',
                status: true
            },
            // ...ajoute les autres cheats par défaut
        ];
        await saveCheatsData();
    }
}

// Sauvegarder les données des cheats
async function saveCheatsData() {
    try {
        const dataPath = path.join(__dirname, 'cheats.json');
        await fs.writeFile(dataPath, JSON.stringify(cheatsData, null, 2));
    } catch (error) {
        console.error('Erreur sauvegarde données:', error);
    }
}

// === NOUVELLES ROUTES API ===

// Route pour obtenir tous les cheats
app.get('/api/cheats', (req, res) => {
    res.json({
        success: true,
        cheats: cheatsData
    });
});

// Route pour obtenir un cheat spécifique
app.get('/api/cheats/:id', (req, res) => {
    const cheat = cheatsData.find(c => c.id === req.params.id);
    if (!cheat) {
        return res.status(404).json({ error: 'Cheat non trouvé' });
    }
    res.json({ success: true, cheat });
});

// Route pour mettre à jour un cheat (requiert auth admin)
app.put('/api/cheats/:id', async (req, res) => {
    const { token, title, image, link, status } = req.body;
    
    // Vérifier l'authentification
    if (!token) {
        return res.status(401).json({ error: 'Token requis' });
    }
    
    try {
        // Vérifier le token Discord
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!userResponse.ok) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        
        const userData = await userResponse.json();
        const roleCheck = await checkAdminRole(userData.id);
        
        if (!roleCheck.isAdmin) {
            return res.status(403).json({ error: 'Droits admin requis' });
        }
        
        // Mettre à jour le cheat
        const cheatIndex = cheatsData.findIndex(c => c.id === req.params.id);
        if (cheatIndex === -1) {
            return res.status(404).json({ error: 'Cheat non trouvé' });
        }
        
        cheatsData[cheatIndex] = {
            ...cheatsData[cheatIndex],
            title: title || cheatsData[cheatIndex].title,
            image: image || cheatsData[cheatIndex].image,
            link: link || cheatsData[cheatIndex].link,
            status: status !== undefined ? status : cheatsData[cheatIndex].status
        };
        
        await saveCheatsData();
        
        res.json({
            success: true,
            cheat: cheatsData[cheatIndex]
        });
        
    } catch (error) {
        console.error('Erreur mise à jour cheat:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour ajouter un nouveau cheat
app.post('/api/cheats', async (req, res) => {
    const { token, id, title, image, link, status } = req.body;
    
    // Vérifier l'authentification admin
    if (!token) {
        return res.status(401).json({ error: 'Token requis' });
    }
    
    try {
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!userResponse.ok) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        
        const userData = await userResponse.json();
        const roleCheck = await checkAdminRole(userData.id);
        
        if (!roleCheck.isAdmin) {
            return res.status(403).json({ error: 'Droits admin requis' });
        }
        
        // Ajouter le nouveau cheat
        const newCheat = {
            id: id || Date.now().toString(),
            title,
            image,
            link,
            status: status !== undefined ? status : true
        };
        
        cheatsData.push(newCheat);
        await saveCheatsData();
        
        res.json({
            success: true,
            cheat: newCheat
        });
        
    } catch (error) {
        console.error('Erreur ajout cheat:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour supprimer un cheat
app.delete('/api/cheats/:id', async (req, res) => {
    const { token } = req.body;
    
    if (!token) {
        return res.status(401).json({ error: 'Token requis' });
    }
    
    try {
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!userResponse.ok) {
            return res.status(401).json({ error: 'Token invalide' });
        }
        
        const userData = await userResponse.json();
        const roleCheck = await checkAdminRole(userData.id);
        
        if (!roleCheck.isAdmin) {
            return res.status(403).json({ error: 'Droits admin requis' });
        }
        
        // Supprimer le cheat
        cheatsData = cheatsData.filter(c => c.id !== req.params.id);
        await saveCheatsData();
        
        res.json({ success: true });
        
    } catch (error) {
        console.error('Erreur suppression cheat:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Route pour obtenir les statistiques
app.get('/api/stats', async (req, res) => {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        
        res.json({
            success: true,
            stats: {
                totalCheats: cheatsData.length,
                activeCheats: cheatsData.filter(c => c.status).length,
                downCheats: cheatsData.filter(c => !c.status).length,
                serverMembers: guild.memberCount,
                serverName: guild.name
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Commandes slash pour gérer les cheats depuis Discord
const commands = [
    new SlashCommandBuilder()
        .setName('addadmin')
        .setDescription('Ajouter un utilisateur comme admin du panel')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur à ajouter')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('removeadmin')
        .setDescription('Retirer un utilisateur des admins du panel')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur à retirer')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('listadmins')
        .setDescription('Lister tous les admins du panel'),
    new SlashCommandBuilder()
        .setName('cheatlist')
        .setDescription('Afficher la liste des cheats'),
    new SlashCommandBuilder()
        .setName('cheatstatus')
        .setDescription('Changer le statut d\'un cheat')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID du cheat')
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('status')
                .setDescription('Nouveau statut (true = actif, false = down)')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('addcheat')
        .setDescription('Ajouter un nouveau cheat')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Titre du cheat')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('image')
                .setDescription('URL de l\'image')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('link')
                .setDescription('Lien de téléchargement')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('removecheat')
        .setDescription('Supprimer un cheat')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('ID du cheat')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Voir les statistiques du site')
].map(command => command.toJSON());

// Enregistrer les commandes
const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

(async () => {
    try {
        console.log('📝 Enregistrement des commandes slash...');
        
        // Vérifier que le bot est dans le serveur
        await rest.get(Routes.guild(GUILD_ID)).catch(err => {
            console.error('❌ Le bot n\'est pas dans le serveur ou GUILD_ID incorrect');
            console.error('GUILD_ID configuré:', GUILD_ID);
            throw err;
        });
        
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('✅ Commandes enregistrées avec succès!');
    } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement des commandes:');
        if (error.code === 50001) {
            console.error('Le bot n\'a pas accès au serveur. Vérifie que:');
            console.error('1. Le bot est bien invité sur le serveur');
            console.error('2. Le GUILD_ID est correct:', GUILD_ID);
            console.error('3. Le bot a les permissions nécessaires');
        } else if (error.code === 0) {
            console.error('Token invalide ou CLIENT_ID incorrect');
        } else {
            console.error(error);
        }
    }
})();

// Gérer les interactions (commandes slash)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    const { commandName } = interaction;
    
    // Commandes qui ne nécessitent PAS d'être admin
    if (commandName === 'cheatlist' || commandName === 'stats') {
        // Ces commandes sont accessibles à tous
        
        if (commandName === 'cheatlist') {
            const embed = new EmbedBuilder()
                .setTitle('📋 Liste des Cheats')
                .setColor(0xa855f7)
                .setTimestamp();
            
            cheatsData.forEach(cheat => {
                embed.addFields({
                    name: `${cheat.status ? '✅' : '❌'} ${cheat.title}`,
                    value: `ID: \`${cheat.id}\`\nStatut: ${cheat.status ? 'Actif' : 'Down'}`,
                    inline: true
                });
            });
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
        
        if (commandName === 'stats') {
            const guild = await client.guilds.fetch(GUILD_ID);
            
            const embed = new EmbedBuilder()
                .setTitle('📊 Statistiques du Site')
                .setColor(0xec4899)
                .addFields(
                    { name: '📦 Total Cheats', value: `${cheatsData.length}`, inline: true },
                    { name: '✅ Actifs', value: `${cheatsData.filter(c => c.status).length}`, inline: true },
                    { name: '❌ Down', value: `${cheatsData.filter(c => !c.status).length}`, inline: true },
                    { name: '👥 Membres Discord', value: `${guild.memberCount}`, inline: true },
                    { name: '🎮 Serveur', value: guild.name, inline: true }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [embed], ephemeral: true });
            return;
        }
    }
    
    // Pour toutes les autres commandes, vérifier les permissions admin
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
            content: '❌ Vous devez être administrateur pour utiliser cette commande.',
            ephemeral: true
        });
    }
    
    if (commandName === 'addadmin') {
        const user = interaction.options.getUser('user');
        const guild = await client.guilds.fetch(GUILD_ID);
        const member = await guild.members.fetch(user.id);
        
        // Ajouter le rôle admin (tu dois créer ce rôle sur ton serveur)
        const adminRole = guild.roles.cache.find(role => ADMIN_ROLE_IDS.includes(role.id));
        if (adminRole) {
            await member.roles.add(adminRole);
            await interaction.reply({
                content: `✅ ${user.tag} a été ajouté comme admin du panel.`,
                ephemeral: true
            });
        } else {
            await interaction.reply({
                content: '❌ Rôle admin introuvable.',
                ephemeral: true
            });
        }
    }
    
    if (commandName === 'removeadmin') {
        const user = interaction.options.getUser('user');
        const guild = await client.guilds.fetch(GUILD_ID);
        const member = await guild.members.fetch(user.id);
        
        const adminRole = guild.roles.cache.find(role => ADMIN_ROLE_IDS.includes(role.id));
        if (adminRole) {
            await member.roles.remove(adminRole);
            await interaction.reply({
                content: `✅ ${user.tag} n'est plus admin du panel.`,
                ephemeral: true
            });
        }
    }
    
    if (commandName === 'listadmins') {
        const guild = await client.guilds.fetch(GUILD_ID);
        const adminRoles = guild.roles.cache.filter(role => ADMIN_ROLE_IDS.includes(role.id));
        
        let adminList = [];
        for (const role of adminRoles.values()) {
            const members = role.members.map(m => m.user.tag);
            adminList.push(`**${role.name}:**\n${members.join('\n') || 'Aucun membre'}`);
        }
        
        await interaction.reply({
            content: `📋 **Liste des admins du panel:**\n\n${adminList.join('\n\n')}`,
            ephemeral: true
        });
    }
    
    if (commandName === 'cheatstatus') {
        const id = interaction.options.getString('id');
        const status = interaction.options.getBoolean('status');
        
        const cheatIndex = cheatsData.findIndex(c => c.id === id);
        if (cheatIndex === -1) {
            return interaction.reply({
                content: '❌ Cheat non trouvé.',
                ephemeral: true
            });
        }
        
        cheatsData[cheatIndex].status = status;
        await saveCheatsData();
        
        await interaction.reply({
            content: `✅ Statut du cheat **${cheatsData[cheatIndex].title}** changé en: ${status ? 'Actif' : 'Down'}`,
            ephemeral: true
        });
    }
    
    if (commandName === 'addcheat') {
        // Pas besoin de re-vérifier les permissions
        const newCheat = {
            id: Date.now().toString(),
            title: interaction.options.getString('title'),
            image: interaction.options.getString('image'),
            link: interaction.options.getString('link'),
            status: true
        };
        
        cheatsData.push(newCheat);
        await saveCheatsData();
        
        const embed = new EmbedBuilder()
            .setTitle('✅ Nouveau Cheat Ajouté')
            .setColor(0x22c55e)
            .addFields(
                { name: 'Titre', value: newCheat.title, inline: true },
                { name: 'ID', value: newCheat.id, inline: true },
                { name: 'Statut', value: 'Actif', inline: true }
            )
            .setThumbnail(newCheat.image)
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    
    if (commandName === 'removecheat') {
        // Pas besoin de re-vérifier les permissions
        const id = interaction.options.getString('id');
        const cheat = cheatsData.find(c => c.id === id);
        
        if (!cheat) {
            return interaction.reply({
                content: '❌ Cheat non trouvé.',
                ephemeral: true
            });
        }
        
        cheatsData = cheatsData.filter(c => c.id !== id);
        await saveCheatsData();
        
        await interaction.reply({
            content: `✅ Cheat **${cheat.title}** supprimé avec succès.`,
            ephemeral: true
        });
    }
});

// Events du bot
client.once('ready', async () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
    console.log(`📊 Serveur surveillé: ${GUILD_ID}`);
    console.log(`🔐 Rôles admin: ${ADMIN_ROLE_IDS.join(', ')}`);
    
    // Charger les données des cheats
    await loadCheatsData();
    console.log(`📦 ${cheatsData.length} cheats chargés`);
    
    // Démarrer le serveur API
    app.listen(PORT, () => {
        console.log(`🚀 API démarrée sur http://localhost:${PORT}`);
        console.log(`📡 Routes API disponibles:`);
        console.log(`   - GET  /api/cheats`);
        console.log(`   - GET  /api/cheats/:id`);
        console.log(`   - PUT  /api/cheats/:id`);
        console.log(`   - POST /api/cheats`);
        console.log(`   - DELETE /api/cheats/:id`);
        console.log(`   - GET  /api/stats`);
        console.log(`   - POST /api/check-admin`);
        console.log(`   - GET  /api/server-info`);
    });
});

// Connexion du bot avec gestion d'erreur
client.login(BOT_TOKEN).catch(err => {
    console.error('❌ Impossible de se connecter avec ce token');
    console.error('Vérifie que le token dans .env est correct');
    process.exit(1);
});
