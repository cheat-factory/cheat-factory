// Configuration publique (peut être uploadée sur GitHub)
const CONFIG = {
    // Discord OAuth2 - Application publique
    DISCORD_CLIENT_ID: "1406428707681472612",
    
    // URLs de redirection (change selon l'environnement)
    REDIRECT_URI: window.location.hostname === 'localhost' 
        ? "http://localhost:5500/index.html"
        : "https://ton-username.github.io/cheat-factory/", // Remplace ton-username par ton nom GitHub
    
    // Discord Server
    DISCORD_INVITE: "https://discord.gg/vT4XcxYj9t",
    
    // API Bot (si hébergé)
    API_URL: window.location.hostname === 'localhost'
        ? "http://localhost:3000"
        : "", // Laisse vide si pas d'API externe
    
    // Webhook pour les avis (ATTENTION: visible publiquement)
    // Il est recommandé d'utiliser une API proxy pour cacher le webhook
    WEBHOOK_PROXY: "/api/webhook" // Utilise une fonction serverless ou un proxy
};

// Export pour utilisation
window.APP_CONFIG = CONFIG;
