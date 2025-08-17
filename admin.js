// Configuration du serveur et de l'API du bot
const API_URL = "http://localhost:3000"; // Change en production (ex: https://ton-bot.herokuapp.com)
const DISCORD_SERVER_ID = "YOUR_GUILD_ID_HERE"; // Remplace par l'ID de ton serveur

// Configuration Discord OAuth2 avec les bons scopes
const DISCORD_CLIENT_ID = "1406428707681472612";
const REDIRECT_URI = window.location.origin + "/admin.html";
const OAUTH_SCOPE = "identify%20guilds%20guilds.members.read";
const OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${OAUTH_SCOPE}`;

// Données par défaut des cheats
const defaultCheats = [
    {
        id: 'mhur',
        title: 'MHUR Cheat',
        image: 'https://cdn.discordapp.com/attachments/1304446845057110088/1405611508116885666/image.png?ex=68a2183a&is=68a0c6ba&hm=82730c7dc8e5dc6f2e3a215108a6995a89af82110c7e9c5d39175370007377f2&',
        link: 'https://gofile.io/d/WDS4RL',
        status: true
    },
    {
        id: 'fortnite-external',
        title: 'Fortnite External',
        image: 'https://media.discordapp.net/attachments/1401989249238040626/1402311886141395024/image.png?ex=68a1f4b7&is=68a0a337&hm=b0696ee36c8abf7ac03262b42f6a16d7abae6bfff479c0d0667e7bf63aa8deff&=&format=webp&quality=lossless&width=1297&height=893',
        link: 'https://gofile.io/d/egzLif',
        status: true
    },
    {
        id: 'vigor',
        title: 'Vigor Internal',
        image: 'https://cdn.discordapp.com/attachments/1405298851367096451/1406403106039922780/image_2.png?ex=68a25676&is=68a104f6&hm=479d38c84a4df833afcbbf32015c340c260d9b5d7e7abdb34695be04464fab8d&',
        link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7XDbfc6TyxCCuPDsUCKP0WqbrrXfqQPWTGQ&s',
        status: false
    },
    {
        id: 'fivem',
        title: 'FiveM External',
        image: 'https://cdn.discordapp.com/attachments/1402237965366988800/1404577086492119120/image.png?ex=68a1a099&is=68a04f19&hm=15d85e0fdc8bbb846ab84d163bcf0f04e8e639fbb3eddf9b5fcfaeea25e5d551&',
        link: 'https://gofile.io/d/6MZQG6',
        status: true
    },
    {
        id: 'paladin',
        title: 'Paladin Internal',
        image: 'https://cdn.discordapp.com/attachments/1405298851367096451/1406404069412831273/Paladins_gkDfoniqKK.png?ex=68a2575b&is=68a105db&hm=337a7f741dfa480f85f4315de64180c3841c96b9192908f0b401b090e476349c&',
        link: 'https://gofile.io/d/o7wSdy',
        status: true
    },
    {
        id: 'cs2',
        title: 'CS2 Internal',
        image: 'https://media.discordapp.net/attachments/1293140235961761823/1405620771296116908/image.png?ex=68a220db&is=68a0cf5b&hm=775cb6a9da82791ac7109589ff621be0dce606b27c7422ae393261dd9de6f087&=&format=webp&quality=lossless',
        link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7XDbfc6TyxCCuPDsUCKP0WqbrrXfqQPWTGQ&s',
        status: false
    },
    {
        id: 'rogue',
        title: 'Rogue Company External',
        image: 'https://i.redd.it/keqvh7kc96wa1.jpg',
        link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7XDbfc6TyxCCuPDsUCKP0WqbrrXfqQPWTGQ&s',
        status: false
    },
    {
        id: 'spoofer',
        title: 'Temps Spoofer',
        image: 'https://media.discordapp.net/attachments/1401989249238040626/1402573155364765727/image.png?ex=68a23f4a&is=68a0edca&hm=a6dd8d7d5dd2a89f20b0efbc0754bf58f5b440ff49489fdfd0ef9f77068066a3&=&format=webp&quality=lossless&width=1254&height=894',
        link: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7XDbfc6TyxCCuPDsUCKP0WqbrrXfqQPWTGQ&s',
        status: false
    }
];

let currentUser = null;
let cheatsData = [];

// Charger les données depuis l'API
async function loadCheatsData() {
    try {
        const response = await fetch(`${API_URL}/api/cheats`);
        if (response.ok) {
            const data = await response.json();
            cheatsData = data.cheats;
        } else {
            // Fallback aux données locales
            const saved = localStorage.getItem('cheats_data');
            if (saved) {
                cheatsData = JSON.parse(saved);
            } else {
                cheatsData = [...defaultCheats];
            }
        }
    } catch (error) {
        console.error('Erreur chargement données API:', error);
        // Fallback aux données locales
        const saved = localStorage.getItem('cheats_data');
        if (saved) {
            cheatsData = JSON.parse(saved);
        } else {
            cheatsData = [...defaultCheats];
        }
    }
}

// Sauvegarder les données
function saveCheatsData() {
    localStorage.setItem('cheats_data', JSON.stringify(cheatsData));
    showStatus('✅ Modifications sauvegardées !');
}

// Traductions pour la page admin
const adminLangData = {
    fr: {
        authTitle: "🔒 Authentification Admin",
        authDesc: "Connectez-vous avec Discord pour accéder au panel admin",
        discordLogin: "Connexion Discord",
        adminError: "Vous n'avez pas les droits d'administration",
        backBtn: "← Retour au site",
        panelTitle: "Panel Administration",
        connectedAs: "Connecté en tant que:",
        title: "Titre:",
        imageUrl: "URL de l'image:",
        downloadLink: "Lien de téléchargement:",
        status: "Statut:",
        save: "Sauvegarder",
        update: "Update",
        down: "DOWN",
        saved: "✅ Modifications sauvegardées !"
    },
    en: {
        authTitle: "🔒 Admin Authentication",
        authDesc: "Login with Discord to access the admin panel",
        discordLogin: "Discord Login",
        adminError: "You don't have admin rights",
        backBtn: "← Back to site",
        panelTitle: "Admin Panel",
        connectedAs: "Connected as:",
        title: "Title:",
        imageUrl: "Image URL:",
        downloadLink: "Download link:",
        status: "Status:",
        save: "Save",
        update: "Update",
        down: "DOWN",
        saved: "✅ Changes saved!"
    },
    zh: {
        authTitle: "🔒 管理员认证",
        authDesc: "使用Discord登录以访问管理面板",
        discordLogin: "Discord 登录",
        adminError: "您没有管理员权限",
        backBtn: "← 返回网站",
        panelTitle: "管理面板",
        connectedAs: "登录为:",
        title: "标题:",
        imageUrl: "图片URL:",
        downloadLink: "下载链接:",
        status: "状态:",
        save: "保存",
        update: "更新",
        down: "关闭",
        saved: "✅ 更改已保存!"
    },
    ru: {
        authTitle: "🔒 Аутентификация администратора",
        authDesc: "Войдите через Discord для доступа к панели администратора",
        discordLogin: "Войти через Discord",
        adminError: "У вас нет прав администратора",
        backBtn: "← Вернуться на сайт",
        panelTitle: "Панель администратора",
        connectedAs: "Подключен как:",
        title: "Название:",
        imageUrl: "URL изображения:",
        downloadLink: "Ссылка для скачивания:",
        status: "Статус:",
        save: "Сохранить",
        update: "Обновить",
        down: "НЕ РАБОТАЕТ",
        saved: "✅ Изменения сохранены!"
    },
    de: {
        authTitle: "🔒 Admin-Authentifizierung",
        authDesc: "Mit Discord anmelden, um auf das Admin-Panel zuzugreifen",
        discordLogin: "Discord Anmeldung",
        adminError: "Sie haben keine Administratorrechte",
        backBtn: "← Zurück zur Seite",
        panelTitle: "Admin-Panel",
        connectedAs: "Verbunden als:",
        title: "Titel:",
        imageUrl: "Bild-URL:",
        downloadLink: "Download-Link:",
        status: "Status:",
        save: "Speichern",
        update: "Update",
        down: "DOWN",
        saved: "✅ Änderungen gespeichert!"
    }
};

let currentLang = 'fr';

// Fonction pour changer la langue
function setAdminLang(lang) {
    currentLang = lang;
    const data = adminLangData[lang];
    
    // Mettre à jour les textes
    const authTitle = document.getElementById('auth-title');
    if (authTitle) authTitle.textContent = data.authTitle;
    
    const authDesc = document.getElementById('auth-desc');
    if (authDesc) authDesc.textContent = data.authDesc;
    
    const discordLoginBtn = document.getElementById('admin-discord-login');
    if (discordLoginBtn) discordLoginBtn.textContent = data.discordLogin;
    
    const adminError = document.getElementById('admin-error');
    if (adminError) adminError.textContent = data.adminError;
    
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.textContent = data.backBtn;
    
    const panelTitle = document.getElementById('admin-panel-title');
    if (panelTitle) panelTitle.textContent = data.panelTitle;
    
    const connectedAs = document.getElementById('connected-as');
    if (connectedAs) connectedAs.textContent = data.connectedAs;
    
    // Sauvegarder la langue dans localStorage
    localStorage.setItem('admin_lang', lang);
}

// Créer les box admin avec traductions
function createAdminBoxes() {
    const container = document.getElementById('admin-boxes');
    container.innerHTML = '';
    const data = adminLangData[currentLang];
    
    cheatsData.forEach((cheat, index) => {
        const box = document.createElement('div');
        box.className = 'admin-box';
        box.style.opacity = '0';
        box.innerHTML = `
            <h3>${cheat.title}</h3>
            
            <label class="admin-label">${data.title}</label>
            <input type="text" class="admin-input" id="title-${index}" value="${cheat.title}" placeholder="${data.title}">
            
            <label class="admin-label">${data.imageUrl}</label>
            <input type="text" class="admin-input" id="image-${index}" value="${cheat.image}" placeholder="${data.imageUrl}">
            
            <label class="admin-label">${data.downloadLink}</label>
            <input type="text" class="admin-input" id="link-${index}" value="${cheat.link}" placeholder="${data.downloadLink}">
            
            <div class="toggle-status">
                <label class="admin-label" style="margin:0;">${data.status}</label>
                <div class="toggle-switch ${cheat.status ? 'active' : ''}" id="status-${index}">
                    <div class="toggle-slider"></div>
                </div>
                <span id="status-text-${index}" style="color:${cheat.status ? '#22c55e' : '#ff1f1f'}">${cheat.status ? data.update : data.down}</span>
            </div>
            
            <button class="admin-save-btn" onclick="saveCheat(${index})">${data.save}</button>
        `;
        container.appendChild(box);
        
        // Animation d'apparition
        setTimeout(() => {
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
            box.style.transition = 'all 0.5s ease-out';
        }, index * 100);
        
        // Ajouter l'événement pour le toggle
        document.getElementById(`status-${index}`).addEventListener('click', function() {
            this.classList.toggle('active');
            const span = document.getElementById(`status-text-${index}`);
            const isActive = this.classList.contains('active');
            span.textContent = isActive ? data.update : data.down;
            span.style.color = isActive ? '#22c55e' : '#ff1f1f';
            
            // Animation du toggle
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Afficher le statut avec animation
function showStatus(message) {
    const status = document.getElementById('admin-status');
    status.textContent = adminLangData[currentLang].saved;
    status.classList.add('show');
    status.style.animation = 'statusPop 0.5s ease-out';
    setTimeout(() => {
        status.classList.remove('show');
    }, 3000);
}

// Sauvegarder un cheat
async function saveCheat(index) {
    const title = document.getElementById(`title-${index}`).value;
    const image = document.getElementById(`image-${index}`).value;
    const link = document.getElementById(`link-${index}`).value;
    const status = document.getElementById(`status-${index}`).classList.contains('active');
    
    const token = localStorage.getItem('admin_discord_token');
    
    try {
        // Envoyer à l'API
        const response = await fetch(`${API_URL}/api/cheats/${cheatsData[index].id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token,
                title,
                image,
                link,
                status
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            cheatsData[index] = data.cheat;
            showStatus('✅ Modifications sauvegardées sur le serveur !');
        } else {
            throw new Error('Erreur API');
        }
    } catch (error) {
        console.error('Erreur sauvegarde API:', error);
        // Fallback sauvegarde locale
        cheatsData[index] = {
            ...cheatsData[index],
            title,
            image,
            link,
            status
        };
        localStorage.setItem('cheats_data', JSON.stringify(cheatsData));
        showStatus('⚠️ Sauvegarde locale (API non disponible)');
    }
}

// Ajouter une fonction pour synchroniser avec l'API
async function syncWithAPI() {
    const token = localStorage.getItem('admin_discord_token');
    if (!token) return;
    
    try {
        // Récupérer les stats
        const statsResponse = await fetch(`${API_URL}/api/stats`);
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            console.log('📊 Stats synchronisées:', stats.stats);
            
            // Afficher les stats dans le panel (optionnel)
            const statsDiv = document.getElementById('server-stats');
            if (statsDiv) {
                statsDiv.innerHTML = `
                    <span>📦 Cheats: ${stats.stats.totalCheats}</span>
                    <span>✅ Actifs: ${stats.stats.activeCheats}</span>
                    <span>❌ Down: ${stats.stats.downCheats}</span>
                    <span>👥 Membres: ${stats.stats.serverMembers}</span>
                `;
            }
        }
    } catch (error) {
        console.error('Erreur sync API:', error);
    }
}

// Vérifier l'authentification Discord et les rôles via l'API du bot
async function checkDiscordAuth() {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
        localStorage.setItem('admin_discord_token', accessToken);
        window.location.hash = "";
    }
    
    const token = localStorage.getItem('admin_discord_token');
    if (!token) {
        return false;
    }
    
    try {
        // Récupérer les infos de l'utilisateur
        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: "Bearer " + token }
        });
        if (!userRes.ok) throw new Error("Token invalide");
        const user = await userRes.json();
        
        // Vérifier les rôles via l'API du bot
        const roleCheckRes = await fetch(`${API_URL}/api/check-admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                token: token
            })
        });
        
        if (!roleCheckRes.ok) {
            const error = await roleCheckRes.json();
            throw new Error(error.error || "Erreur de vérification");
        }
        
        const roleData = await roleCheckRes.json();
        
        if (!roleData.isAdmin) {
            showError("Vous n'avez pas les droits d'administration sur le serveur Discord");
            localStorage.removeItem('admin_discord_token');
            return false;
        }
        
        currentUser = {
            ...user,
            roles: roleData.roles,
            nickname: roleData.nickname || user.username
        };
        
        // Afficher l'indicateur de rôle vérifié
        const indicator = document.getElementById('role-indicator');
        if (indicator) {
            indicator.style.display = 'block';
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    indicator.style.display = 'none';
                    indicator.style.opacity = '1';
                }, 500);
            }, 3000);
        }
        
        return true;
        
    } catch (e) {
        console.error("Erreur d'authentification:", e);
        showError(e.message || "Erreur lors de la vérification de vos droits");
        localStorage.removeItem('admin_discord_token');
        return false;
    }
}

// Fonction pour afficher les erreurs
function showError(message) {
    const errorDiv = document.getElementById('admin-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.animation = 'shake 0.5s';
        }, 100);
    }
}

// Vérification périodique des droits via l'API du bot
function startRoleCheckInterval() {
    setInterval(async () => {
        const token = localStorage.getItem('admin_discord_token');
        if (!token || !currentUser) return;
        
        try {
            const roleCheckRes = await fetch(`${API_URL}/api/check-admin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: currentUser.id,
                    token: token
                })
            });
            
            const roleData = await roleCheckRes.json();
            
            if (!roleData.isAdmin) {
                alert("Vos droits d'administration ont été révoqués. Vous allez être redirigé.");
                window.location.href = "index.html";
            }
        } catch (e) {
            console.error("Erreur de vérification périodique:", e);
        }
    }, 5 * 60 * 1000); // 5 minutes
}

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    // Charger la langue sauvegardée
    const savedLang = localStorage.getItem('admin_lang') || 'fr';
    setAdminLang(savedLang);
    
    // Gérer le changement de langue
    const langSwitcher = document.getElementById('lang-switcher-admin');
    if (langSwitcher) {
        langSwitcher.value = savedLang;
        langSwitcher.addEventListener('change', function() {
            setAdminLang(this.value);
            if (currentUser) {
                createAdminBoxes();
            }
        });
    }
    
    // Animation étoiles améliorée
    const canvas = document.getElementById('stars-bg');
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    const stars = Array.from({length: 150}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        color: ['#e879f9', '#a855f7', '#ec4899', '#fff', '#22c55e'][Math.floor(Math.random() * 5)],
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        pulse: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 2
    }));
    
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Créer un effet de gradient de fond
        const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
        gradient.addColorStop(0, 'rgba(168,85,247,0.02)');
        gradient.addColorStop(1, 'rgba(236,72,153,0.02)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (const star of stars) {
            const pulseR = star.r + Math.sin(Date.now() / 350 + star.pulse) * 0.7;
            const twinkle = 0.5 + Math.sin(Date.now() / 200 * star.twinkle) * 0.5;
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, pulseR, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = twinkle * (0.85 + Math.sin(Date.now() / 400 + star.pulse) * 0.15);
            ctx.shadowColor = star.color;
            ctx.shadowBlur = 15 + Math.abs(Math.sin(Date.now() / 300 + star.pulse)) * 15;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;
            
            star.x += star.dx;
            star.y += star.dy;
            
            // Rebond avec effet élastique
            if (star.x < 0 || star.x > canvas.width) {
                star.dx *= -0.9;
                star.x = Math.max(0, Math.min(canvas.width, star.x));
            }
            if (star.y < 0 || star.y > canvas.height) {
                star.dy *= -0.9;
                star.y = Math.max(0, Math.min(canvas.height, star.y));
            }
        }
        requestAnimationFrame(animateStars);
    }
    animateStars();
    
    // Vérifier l'authentification
    const isAuth = await checkDiscordAuth();
    
    if (isAuth) {
        document.getElementById('admin-auth').style.display = 'none';
        document.querySelector('.admin-container').style.display = 'block';
        document.getElementById('admin-name').textContent = currentUser.nickname || currentUser.username;
        
        await loadCheatsData(); // Charger depuis l'API
        createAdminBoxes();
        
        // Synchroniser avec l'API toutes les 30 secondes
        syncWithAPI();
        setInterval(syncWithAPI, 30000);
        
        // Démarrer la vérification périodique des rôles
        startRoleCheckInterval();
    } else {
        document.getElementById('admin-discord-login').onclick = () => {
            window.location.href = OAUTH_URL;
        };
    }
});

// Ajouter des styles pour l'animation shake
const style = document.createElement('style');
style.textContent = `
    @keyframes statusPop {
        0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
        50% { transform: translateY(0) scale(1.1); }
        100% { transform: translateY(0) scale(1); opacity: 1; }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
