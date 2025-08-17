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
        modalTermesContent: `
Bienvenue sur notre serveur ! Avant de participer, merci de lire et de respecter les règles ci-dessous afin de garantir une bonne ambiance pour tous.<br><br>
<b>Respect :</b> Le respect mutuel est essentiel. Aucune insulte, discrimination, harcèlement ou comportement toxique ne sera toléré.<br><br>
<b>Pas de Spam :</b> Évitez de spammer les salons, les messages privés ou les mentions. Le spam inutile perturbe la communauté.<br><br>
<b>Contenu Inapproprié :</b> Tout contenu inapproprié (NSFW, violence, etc.) est strictement interdit. Restez dans le cadre des règles de Discord.<br><br>
<b>Publicité :</b> Aucune publicité pour d'autres serveurs, produits ou services n'est autorisée sans l'accord préalable de l'administration.<br><br>
<b>Utilisation des salons :</b> Chaque salon a un but précis. Merci de respecter les thématiques des canaux et d'utiliser le bon salon pour chaque discussion.<br><br>
<b>Aide et Tickets :</b> Si tu as un problème ou une question, utilise le système de tickets (PAS DE MP AUX ADMINS OU AU FONDATEUR). Nous sommes là pour t'aider !<br><br>
<b>Cheats et Hacks :</b> L'utilisation ou le partage d'outils non autorisés en dehors du cadre du serveur est strictement interdit. Toute violation est sous ta responsabilité.<br><br>
<b>Respect des Modérateurs :</b> Les décisions des modérateurs doivent être respectées. En cas de désaccord, discutez-en calmement.<br><br>
<b>Sanctions :</b> Le non-respect des règles peut entraîner un avertissement, un kick, ou un ban, selon la gravité de l'infraction.
        `,
        download: "Télécharger",
        update: "Mettre à jour",
        down: "HORS LIGNE",
        price: "Prix : <b>Gratuit</b>",
        modalTermes: "📜 Règlement du Serveur Discord 📜",
        modalAvis: "Les avis des utilisateurs",
        avisPseudo: "Votre pseudo",
        avisText: "Votre avis...",
        avisEnvoyer: "Envoyer",
        discordLogin: "Connexion Discord",
        discordLogout: "Déconnexion",
        discordLink: "Discord Link",
        avisNote: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"],
        popupConnect: "Tu dois être connecté avec Discord pour télécharger.",
        popupBtn: "Se connecter",
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
        modalTermesContent: `
Welcome to our server! Before participating, please read and follow the rules below to ensure a good atmosphere for everyone.<br><br>
<b>Respect:</b> Mutual respect is essential. No insults, discrimination, harassment, or toxic behavior will be tolerated.<br><br>
<b>No Spam:</b> Avoid spamming channels, private messages, or mentions. Unnecessary spam disrupts the community.<br><br>
<b>Inappropriate Content:</b> Any inappropriate content (NSFW, violence, etc.) is strictly prohibited. Stay within Discord's rules.<br><br>
<b>Advertising:</b> No advertising for other servers, products, or services is allowed without prior admin approval.<br><br>
<b>Channel Usage:</b> Each channel has a specific purpose. Please respect the topics and use the correct channel for each discussion.<br><br>
<b>Help & Tickets:</b> If you have a problem or question, use the ticket system (NO DMs TO ADMINS OR THE FOUNDER). We're here to help!<br><br>
<b>Cheats & Hacks:</b> Using or sharing unauthorized tools outside the server is strictly prohibited. Any violation is your responsibility.<br><br>
<b>Respect Moderators:</b> Moderator decisions must be respected. If you disagree, discuss calmly.<br><br>
<b>Sanctions:</b> Breaking the rules may result in a warning, kick, or ban, depending on the severity.
        `,
        download: "Download",
        update: "Update",
        down: "DOWN",
        price: "Price: <b>Free</b>",
        modalTermes: "📜 Discord Server Rules 📜",
        modalAvis: "User Reviews",
        avisPseudo: "Your nickname",
        avisText: "Your review...",
        avisEnvoyer: "Send",
        discordLogin: "Discord Login",
        discordLogout: "Logout",
        discordLink: "Discord Link",
        avisNote: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"],
        popupConnect: "You must be connected with Discord to download.",
        popupBtn: "Login",
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
        modalTermesContent: `
欢迎加入我们的服务器！在参与之前，请阅读并遵守以下规则，以确保大家有良好的氛围。<br><br>
<b>尊重：</b> 相互尊重至关重要。禁止任何侮辱、歧视、骚扰或有害行为。<br><br>
<b>禁止刷屏：</b> 请勿在频道、私信或@中刷屏。无意义的刷屏会扰乱社区。<br><br>
<b>不当内容：</b> 严禁发布任何不当内容（NSFW、暴力等）。请遵守Discord规则。<br><br>
<b>广告：</b> 未经管理员许可，禁止宣传其他服务器、产品或服务。<br><br>
<b>频道使用：</b> 每个频道有特定用途。请尊重主题并在正确频道讨论。<br><br>
<b>帮助与工单：</b> 如有问题请使用工单系统（不要私信管理员或创始人）。我们会帮助你！<br><br>
<b>作弊与破解：</b> 严禁在服务器外使用或分享未授权工具。违规后果自负。<br><br>
<b>尊重管理员：</b> 必须尊重管理员决定。如有异议请冷静讨论。<br><br>
<b>处罚：</b> 违反规则可能被警告、踢出或封禁，视情况而定。
        `,
        download: "下载",
        update: "更新",
        down: "关闭",
        price: "价格: <b>免费</b>",
        modalTermes: "📜 Discord服务器规则 📜",
        modalAvis: "用户评论",
        avisPseudo: "你的昵称",
        avisText: "你的评论...",
        avisEnvoyer: "发送",
        discordLogin: "Discord 登录",
        discordLogout: "退出",
        discordLink: "Discord链接",
        avisNote: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"],
        popupConnect: "你必须用 Discord 登录才能下载。",
        popupBtn: "登录",
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
        modalTermesContent: `
Добро пожаловать на наш сервер! Перед участием ознакомьтесь с правилами ниже для поддержания хорошей атмосферы.<br><br>
<b>Уважение:</b> Взаимное уважение обязательно. Оскорбления, дискриминация, травля и токсичное поведение запрещены.<br><br>
<b>Без спама:</b> Не спамьте в каналах, личных сообщениях или упоминаниях. Спам мешает сообществу.<br><br>
<b>Неприемлемый контент:</b> Любой неприемлемый контент (NSFW, насилие и т.д.) строго запрещен. Соблюдайте правила Discord.<br><br>
<b>Реклама:</b> Реклама других серверов, продуктов или услуг без разрешения администрации запрещена.<br><br>
<b>Использование каналов:</b> Каждый канал имеет свою тему. Соблюдайте тематику и используйте правильный канал.<br><br>
<b>Помощь и тикеты:</b> Если есть вопрос или проблема, используйте систему тикетов (НЕ ПИШИТЕ В ЛС АДМИНАМ ИЛИ ОСНОВАТЕЛЮ). Мы поможем!<br><br>
<b>Читы и хаки:</b> Использование или распространение неразрешённых инструментов вне сервера запрещено. Нарушения на вашей ответственности.<br><br>
<b>Уважение к модераторам:</b> Решения модераторов должны уважаться. В случае несогласия обсуждайте спокойно.<br><br>
<b>Санкции:</b> Нарушение правил может привести к предупреждению, кику или бану в зависимости от тяжести.
        `,
        download: "Скачать",
        update: "Обновить",
        down: "НЕ РАБОТАЕТ",
        price: "Цена: <b>Бесплатно</b>",
        modalTermes: "📜 Правила Discord сервера 📜",
        modalAvis: "Отзывы пользователей",
        avisPseudo: "Ваш ник",
        avisText: "Ваш отзыв...",
        avisEnvoyer: "Отправить",
        discordLogin: "Войти через Discord",
        discordLogout: "Выйти",
        discordLink: "Ссылка Discord",
        avisNote: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"],
        popupConnect: "Чтобы скачать, нужно войти через Discord.",
        popupBtn: "Войти",
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
        modalTermesContent: `
Willkommen auf unserem Server! Bitte lies und beachte die folgenden Regeln, um eine gute Atmosphäre für alle zu gewährleisten.<br><br>
<b>Respekt:</b> Gegenseitiger Respekt ist wichtig. Beleidigungen, Diskriminierung, Belästigung oder toxisches Verhalten sind verboten.<br><br>
<b>Kein Spam:</b> Spam in Kanälen, privaten Nachrichten oder Erwähnungen ist zu vermeiden. Unnötiger Spam stört die Community.<br><br>
<b>Unangemessene Inhalte:</b> Jegliche unangemessenen Inhalte (NSFW, Gewalt usw.) sind streng verboten. Halte dich an die Discord-Regeln.<br><br>
<b>Werbung:</b> Werbung für andere Server, Produkte oder Dienstleistungen ist ohne vorherige Zustimmung der Admins nicht erlaubt.<br><br>
<b>Kanalnutzung:</b> Jeder Kanal hat einen bestimmten Zweck. Bitte respektiere die Themen und nutze den richtigen Kanal.<br><br>
<b>Hilfe & Tickets:</b> Bei Problemen oder Fragen nutze das Ticketsystem (KEINE DMs AN ADMINS ODER DEN GRÜNDER). Wir helfen dir!<br><br>
<b>Cheats & Hacks:</b> Die Nutzung oder Weitergabe nicht genehmigter Tools außerhalb des Servers ist streng verboten. Verstöße liegen in deiner Verantwortung.<br><br>
<b>Respekt gegenüber Moderatoren:</b> Entscheidungen der Moderatoren sind zu respektieren. Bei Meinungsverschiedenheiten diskutiere ruhig.<br><br>
<b>Sanktionen:</b> Regelverstöße können je nach Schwere zu einer Verwarnung, einem Kick oder einem Bann führen.
        `,
        download: "Herunterladen",
        update: "Update",
        down: "DOWN",
        price: "Preis: <b>Kostenlos</b>",
        modalTermes: "📜 Discord-Server Regeln 📜",
        modalAvis: "Nutzerbewertungen",
        avisPseudo: "Dein Name",
        avisText: "Deine Bewertung...",
        avisEnvoyer: "Senden",
        discordLogin: "Discord Anmeldung",
        discordLogout: "Abmelden",
        discordLink: "Discord Link",
        avisNote: ["⭐⭐⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐", "⭐⭐", "⭐"],
        popupConnect: "Du musst mit Discord verbunden sein, um herunterzuladen.",
        popupBtn: "Anmelden",
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
    const modalTermesContent = document.querySelector('#modal-termes .modal-content p');
    if (modalTermesContent) modalTermesContent.innerHTML = langData[lang].modalTermesContent;
    const modalAvisTitle = document.querySelector('#modal-avis .modal-content h2');
    if (modalAvisTitle) modalAvisTitle.textContent = langData[lang].modalAvis;

    // Traduction formulaire avis
    const avisPseudo = document.getElementById('avis-nom');
    if (avisPseudo) avisPseudo.placeholder = langData[lang].avisPseudo;
    const avisText = document.getElementById('avis-text');
    if (avisText) avisText.placeholder = langData[lang].avisText;
    const avisEnvoyer = document.querySelector('#avis-form button[type="submit"]');
    if (avisEnvoyer) avisEnvoyer.textContent = langData[lang].avisEnvoyer;

    // Traduction Discord login/logout
    const discordLoginBtn = document.getElementById('discord-login');
    if (discordLoginBtn) discordLoginBtn.textContent = langData[lang].discordLogin;
    const discordLogoutBtn = document.getElementById('discord-logout');
    if (discordLogoutBtn) discordLogoutBtn.textContent = langData[lang].discordLogout;

    // Traduction Discord link
    const discordLink = document.querySelector('.discord-link');
    if (discordLink) discordLink.textContent = langData[lang].discordLink;

    // Traduction des options de note dans le formulaire avis
    const avisNoteSelect = document.getElementById('avis-note');
    if (avisNoteSelect) {
        Array.from(avisNoteSelect.options).forEach((opt, idx) => {
            opt.textContent = langData[lang].avisNote[idx];
        });
    }

    // Traduction du popup connexion
    const popupText = document.getElementById('connect-popup-text');
    if (popupText) popupText.textContent = langData[lang].popupConnect;
    const popupBtn = document.getElementById('connect-popup-btn');
    if (popupBtn) popupBtn.textContent = langData[lang].popupBtn;
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
const OAUTH_URL = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${OAUTH_SCOPE}`;

const discordLoginBtn = document.getElementById('discord-login');
const discordLogoutBtn = document.getElementById('discord-logout');
const discordUserContainer = document.getElementById('discord-user-container');
const discordAvatar = document.getElementById('discord-avatar');
const discordUsername = document.getElementById('discord-username');

function showDiscordLogin() {
    // N'affiche le bouton de connexion que si aucun user n'est stocké
    const userStr = localStorage.getItem('discord_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            showDiscordUser(user);
            return;
        } catch {
            // Si parsing échoue, on affiche le bouton
        }
    }
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
    // Cherche access_token dans le hash (pour implicit grant)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    if (accessToken) {
        localStorage.setItem('discord_token', accessToken);
        window.location.hash = ""; // Nettoie l'URL
        await fetchAndShowDiscordUser(accessToken);
        return;
    }
    // Si user déjà stocké, affiche-le immédiatement
    const userStr = localStorage.getItem('discord_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            showDiscordUser(user);
            return;
        } catch {}
    }
    // Sinon, si token déjà stocké, tente de récupérer l'utilisateur
    const token = localStorage.getItem('discord_token');
    if (token) {
        await fetchAndShowDiscordUser(token);
    } else {
        showDiscordLogin();
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
    }
}

// Au chargement, gère l'auth Discord
window.addEventListener('DOMContentLoaded', () => {
    const introLogo = document.getElementById('intro-logo');
    if (introLogo) {
        setTimeout(() => {
            introLogo.style.display = 'none';
        }, 5000); // 5s
    }
    handleDiscordOAuth();
});

// Ajoute le popup HTML au body
function createConnectPopup() {
    if (document.getElementById('connect-popup')) return;
    const popup = document.createElement('div');
    popup.id = 'connect-popup';
    popup.innerHTML = `
        <div class="connect-popup-content">
            <span class="close" id="connect-popup-close">&times;</span>
            <div id="connect-popup-text"></div>
            <button id="connect-popup-btn" class="modern-btn"></button>
        </div>
    `;
    document.body.appendChild(popup);
    document.getElementById('connect-popup-close').onclick = () => {
        popup.classList.remove('show');
    };
    document.getElementById('connect-popup-btn').onclick = () => {
        popup.classList.remove('show');
        document.getElementById('discord-login').click();
    };
}
createConnectPopup();

function showConnectPopup(lang) {
    const popup = document.getElementById('connect-popup');
    if (!popup) return;
    document.getElementById('connect-popup-text').textContent = langData[lang].popupConnect;
    document.getElementById('connect-popup-btn').textContent = langData[lang].popupBtn;
    popup.classList.add('show');
}

// Bloque le téléchargement si non connecté (empêche tout accès)
document.querySelectorAll('#cheat-list .download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const userStr = localStorage.getItem('discord_user');
        if (!userStr) {
            e.preventDefault();
            showConnectPopup(langSwitcher ? langSwitcher.value : 'fr');
            return false;
        }
    });
    // Désactive le lien si pas connecté (empêche clic droit, copier, etc.)
    btn.addEventListener('mousedown', function(e) {
        const userStr = localStorage.getItem('discord_user');
        if (!userStr) {
            e.preventDefault();
            showConnectPopup(langSwitcher ? langSwitcher.value : 'fr');
            return false;
        }
    });
    btn.addEventListener('contextmenu', function(e) {
        const userStr = localStorage.getItem('discord_user');
        if (!userStr) {
            e.preventDefault();
            showConnectPopup(langSwitcher ? langSwitcher.value : 'fr');
            return false;
        }
    });
});
