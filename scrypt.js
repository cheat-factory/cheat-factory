document.querySelectorAll('.cheat-title span').forEach(span => {
    span.addEventListener('click', () => {
        span.style.transform = 'scale(1.4) rotate(-16deg)';
        setTimeout(() => {
            span.style.transform = '';
        }, 350);
    });
});

const btn = document.querySelector('.modern-btn');
if (btn) {
    btn.addEventListener('click', () => {
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
    });
}

const canvas = document.getElementById('stars-bg');
const ctx = canvas.getContext('2d');
let w, h;
function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
}
window.addEventListener('resize', resize);
resize();

const colors = ['#e879f9', '#a855f7', '#ec4899', '#fff'];
const stars = Array.from({length: 80}, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 2 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    dx: (Math.random() - 0.5) * 0.15,
    dy: (Math.random() - 0.5) * 0.15
}));

function animateStars() {
    ctx.clearRect(0, 0, w, h);
    for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1;
        star.x += star.dx;
        star.y += star.dy;
        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;
    }
    requestAnimationFrame(animateStars);
}
animateStars();

// Modal logic
function openModal(id) {
    document.getElementById(id).classList.add('show');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}
document.getElementById('btn-termes').onclick = () => openModal('modal-termes');
document.getElementById('btn-avis').onclick = () => openModal('modal-avis');
document.querySelectorAll('.close').forEach(btn => {
    btn.onclick = () => closeModal(btn.dataset.close);
});
window.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => modal.classList.remove('show'));
    }
});

// Avis logic via Discord Webhook
const avisForm = document.getElementById('avis-form');
const avisList = document.getElementById('avis-list');

// Remplace par ton URL de webhook Discord
const WEBHOOK_URL = "https://discord.com/api/webhooks/1406420197707087973/dzE0YA2IVj0w6rdRTLh4bf0NY1Lu6vTp3o-Hg2wTNSaqxHvykj0bco33smiUnVk7_M2o";
const AVIS_COOLDOWN_MS = 60 * 60 * 1000; // 1 heure

function canSendAvis() {
    const last = localStorage.getItem('avis-last');
    if (!last) return true;
    return (Date.now() - parseInt(last, 10)) > AVIS_COOLDOWN_MS;
}

function setAvisSentNow() {
    localStorage.setItem('avis-last', Date.now().toString());
}

avisForm.onsubmit = async function(e) {
    e.preventDefault();
    const nom = document.getElementById('avis-nom').value.trim();
    const text = document.getElementById('avis-text').value.trim();
    const note = parseInt(document.getElementById('avis-note').value, 10);

    if (!canSendAvis()) {
        avisList.innerHTML = `<div style="color:#ff1f1f;margin-top:1em;">⏳ Tu as déjà envoyé un avis récemment.<br>Merci de patienter 1h avant d'en envoyer un autre.</div>`;
        return;
    }

    if (nom && text && note) {
        // Embed Discord pour un message joli
        const embed = {
            title: "Nouvel avis utilisateur",
            color: 0xa855f7,
            fields: [
                { name: "👤 Pseudo", value: nom, inline: true },
                { name: "⭐ Note", value: "★".repeat(note), inline: true },
                { name: "💬 Avis", value: text }
            ],
            timestamp: new Date().toISOString()
        };
        try {
            await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    embeds: [embed]
                })
            });
            setAvisSentNow();
            avisForm.reset();
            avisList.innerHTML = `<div style="color:#a855f7;margin-top:1em;">✅ Merci pour ton avis ! Il a bien été envoyé.<br><span style="font-size:0.95em;opacity:0.7;">(Tu pourras en envoyer un autre dans 1h)</span></div>`;
        } catch (err) {
            avisList.innerHTML = `<div style="color:#ff1f1f;margin-top:1em;">❌ Erreur lors de l'envoi de l'avis.</div>`;
        }
    }
}

// Animation curseur souris
const mouseCursor = document.getElementById('mouse-cursor');
window.addEventListener('mousemove', e => {
    mouseCursor.style.left = e.clientX + 'px';
    mouseCursor.style.top = e.clientY + 'px';
});

// Barre de recherche cheat
const searchInput = document.getElementById('cheat-search');
const cheatBoxes = document.querySelectorAll('#cheat-list .download-box');
searchInput.addEventListener('input', function() {
    const val = this.value.toLowerCase();
    cheatBoxes.forEach(box => {
        const title = box.querySelector('.box-title').textContent.toLowerCase();
        if (title.includes(val)) {
            box.classList.remove('hide');
        } else {
            box.classList.add('hide');
        }
    });
});

const langData = {
    fr: {
        searchPlaceholder: "Rechercher des cheats...",
        btnTermes: "Termes",
        btnAvis: "Avis",
        watermark: "dev by jules",
        download: "Télécharger",
        update: "Update",
        down: "DOWN",
        price: "Prix : <b>Gratuit</b>",
        modalTermes: "📜 Règlement du Serveur Discord 📜",
        modalAvis: "Les avis des utilisateurs",
        avisPseudo: "Votre pseudo",
        avisText: "Votre avis...",
        avisEnvoyer: "Envoyer",
    },
    en: {
        searchPlaceholder: "Search cheats...",
        btnTermes: "Terms",
        btnAvis: "Reviews",
        watermark: "dev by jules",
        download: "Download",
        update: "Update",
        down: "DOWN",
        price: "Price: <b>Free</b>",
        modalTermes: "📜 Discord Server Rules 📜",
        modalAvis: "User Reviews",
        avisPseudo: "Your nickname",
        avisText: "Your review...",
        avisEnvoyer: "Send",
    },
    zh: {
        searchPlaceholder: "搜索作弊...",
        btnTermes: "条款",
        btnAvis: "评论",
        watermark: "由 jules 开发",
        download: "下载",
        update: "更新",
        down: "关闭",
        price: "价格: <b>免费</b>",
        modalTermes: "📜 Discord服务器规则 📜",
        modalAvis: "用户评论",
        avisPseudo: "你的昵称",
        avisText: "你的评论...",
        avisEnvoyer: "发送",
    },
    ru: {
        searchPlaceholder: "Поиск читов...",
        btnTermes: "Правила",
        btnAvis: "Отзывы",
        watermark: "разработано jules",
        download: "Скачать",
        update: "Обновить",
        down: "НЕ РАБОТАЕТ",
        price: "Цена: <b>Бесплатно</b>",
        modalTermes: "📜 Правила Discord сервера 📜",
        modalAvis: "Отзывы пользователей",
        avisPseudo: "Ваш ник",
        avisText: "Ваш отзыв...",
        avisEnvoyer: "Отправить",
    },
    de: {
        searchPlaceholder: "Cheats suchen...",
        btnTermes: "Regeln",
        btnAvis: "Bewertungen",
        watermark: "entwickelt von jules",
        download: "Herunterladen",
        update: "Update",
        down: "DOWN",
        price: "Preis: <b>Kostenlos</b>",
        modalTermes: "📜 Discord-Server Regeln 📜",
        modalAvis: "Nutzerbewertungen",
        avisPseudo: "Dein Name",
        avisText: "Deine Bewertung...",
        avisEnvoyer: "Senden",
    }
};

function setLang(lang) {
    document.getElementById('cheat-search').placeholder = langData[lang].searchPlaceholder;
    document.getElementById('btn-termes').textContent = langData[lang].btnTermes;
    document.getElementById('btn-avis').textContent = langData[lang].btnAvis;
    const watermark = document.querySelector('.watermark');
    if (watermark) watermark.textContent = langData[lang].watermark;

    // Traduction dynamique des box
    document.querySelectorAll('#cheat-list .download-box').forEach(box => {
        const btn = box.querySelector('.download-btn');
        if (btn) btn.textContent = langData[lang].download;
        const price = box.querySelector('.box-price');
        if (price) price.innerHTML = langData[lang].price;
        const stock = box.querySelector('.box-stock');
        if (stock) {
            if (box.classList.contains('down')) {
                stock.textContent = langData[lang].down;
            } else {
                stock.textContent = langData[lang].update;
            }
        }
    });

    // Traduction modals
    const modalTermesTitle = document.querySelector('#modal-termes .modal-content h2');
    if (modalTermesTitle) modalTermesTitle.textContent = langData[lang].modalTermes;
    const modalAvisTitle = document.querySelector('#modal-avis .modal-content h2');
    if (modalAvisTitle) modalAvisTitle.textContent = langData[lang].modalAvis;

    // Traduction formulaire avis
    const avisPseudo = document.getElementById('avis-nom');
    if (avisPseudo) avisPseudo.placeholder = langData[lang].avisPseudo;
    const avisText = document.getElementById('avis-text');
    if (avisText) avisText.placeholder = langData[lang].avisText;
    const avisEnvoyer = document.querySelector('#avis-form button[type="submit"]');
    if (avisEnvoyer) avisEnvoyer.textContent = langData[lang].avisEnvoyer;
}

const langSwitcher = document.getElementById('lang-switcher');
if (langSwitcher) {
    langSwitcher.addEventListener('change', function() {
        setLang(this.value);
    });
    setLang(langSwitcher.value);
}

// === Discord OAuth2 Login ===
const DISCORD_CLIENT_ID = "1406428707681472612";
const REDIRECT_URI = "https://cheat-factory.github.io/cheat-factory/";
const OAUTH_SCOPE = "identify%20email%20guilds.join%20guilds";
const OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${OAUTH_SCOPE}`;

const discordLoginBtn = document.getElementById('discord-login');
const discordLogoutBtn = document.getElementById('discord-logout');
const discordUserContainer = document.getElementById('discord-user-container');
const discordAvatar = document.getElementById('discord-avatar');
const discordUsername = document.getElementById('discord-username');

function showDiscordLogin() {
    discordLoginBtn.style.display = '';
    discordUserContainer.style.display = 'none';
    discordLogoutBtn.style.display = 'none';
}
function showDiscordUser(user) {
    discordLoginBtn.style.display = 'none';
    discordUserContainer.style.display = 'flex';
    discordAvatar.src = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        : 'https://cdn.discordapp.com/embed/avatars/0.png';
    discordUsername.textContent = user.username + (user.discriminator ? '#' + user.discriminator : '');
    discordLogoutBtn.style.display = '';
}
function hideDiscordUser() {
    discordUserContainer.style.display = 'none';
    discordLoginBtn.style.display = '';
    discordLogoutBtn.style.display = 'none';
}

function logoutDiscord() {
    localStorage.removeItem('discord_token');
    localStorage.removeItem('discord_user');
    showDiscordLogin();
}

discordLoginBtn.onclick = () => {
    window.location.href = OAUTH_URL;
};
discordLogoutBtn.onclick = logoutDiscord;

async function handleDiscordOAuth() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
        try {
            // Utilisation d'un proxy CORS pour POST vers Discord (car CORS interdit côté client)
            // Remplacer par votre propre backend/proxy pour production
            const tokenRes = await fetch("https://corsproxy.io/?" + encodeURIComponent("https://discord.com/api/oauth2/token"), {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `client_id=${DISCORD_CLIENT_ID}&client_secret=&grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=identify%20email%20guilds.join%20guilds`
            });
            const tokenData = await tokenRes.json();
            // Ajout debug
            console.log("Discord tokenData:", tokenData);
            if (tokenData.access_token) {
                localStorage.setItem('discord_token', tokenData.access_token);
                // Nettoie l'URL
                window.history.replaceState({}, document.title, window.location.pathname);
                await fetchAndShowDiscordUser(tokenData.access_token);
            } else {
                showDiscordLogin();
                alert("Erreur Discord: Impossible de récupérer le token.");
            }
        } catch (e) {
            showDiscordLogin();
            alert("Erreur Discord: " + e.message);
        }
    } else {
        // Si token déjà stocké, tente de récupérer l'utilisateur
        const token = localStorage.getItem('discord_token');
        if (token) {
            await fetchAndShowDiscordUser(token);
        } else {
            // Fallback: si user déjà stocké, affiche-le (ex: refresh)
            const userStr = localStorage.getItem('discord_user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    showDiscordUser(user);
                } catch {
                    showDiscordLogin();
                }
            } else {
                showDiscordLogin();
            }
        }
    }
}

async function fetchAndShowDiscordUser(token) {
    try {
        const res = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: "Bearer " + token }
        });
        if (!res.ok) throw new Error("Impossible de récupérer l'utilisateur Discord");
        const user = await res.json();
        localStorage.setItem('discord_user', JSON.stringify(user));
        showDiscordUser(user);
    } catch (e) {
        logoutDiscord();
        alert("Erreur Discord: " + e.message);
    }
}

// Au chargement, gère l'auth Discord
window.addEventListener('DOMContentLoaded', handleDiscordOAuth);
