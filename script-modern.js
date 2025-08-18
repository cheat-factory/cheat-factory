// Utilise l'URL OAuth2 fournie (flow code, scopes étendus)
const OAUTH_URL = "https://discord.com/oauth2/authorize?client_id=1406679259573125290&response_type=code&redirect_uri=https%3A%2F%2Fcheat-factory.github.io%2Fcheat-factory%2F&scope=identify+email+guilds.join+guilds+connections+guilds.members.read";

const cheatsData = [
    {
        id: 'mhur',
        title: 'MHUR Cheat',
        image: 'images/mhur-cheat.png',
        description: 'Cheat puissant pour dominer vos parties',
        link: 'https://gofile.io/d/WDS4RL',
        status: 'active',
        category: 'new'
    },
    {
        id: 'fortnite-external',
        title: 'Fortnite External',
        image: 'images/fortnite-external.png',
        description: 'ESP, Aimbot et plus pour Fortnite',
        link: 'https://gofile.io/d/egzLif',
        status: 'active',
        category: 'popular'
    },
    {
        id: 'vigor',
        title: 'Vigor Internal',
        image: 'images/vigor-internal.png',
        description: 'Cheat internal pour Vigor',
        link: '#',
        status: 'down',
        category: 'internal'
    },
    {
        id: 'fivem',
        title: 'FiveM External',
        image: 'images/fivem-external.png',
        description: 'Hack pour serveurs FiveM',
        link: 'https://gofile.io/d/6MZQG6',
        status: 'active',
        category: 'external'
    },
    {
        id: 'paladin',
        title: 'Paladin Internal',
        image: 'images/paladin-internal.png',
        description: 'Cheat complet pour Paladins',
        link: 'https://gofile.io/d/o7wSdy',
        status: 'active',
        category: 'internal'
    },
    {
        id: 'cs2',
        title: 'CS2 Internal',
        image: 'images/cs2-internal.png',
        description: 'Hack pour Counter-Strike 2',
        link: '#',
        status: 'down',
        category: 'fps'
    },
    {
        id: 'rogue',
        title: 'Rogue Company External',
        image: 'images/rogue-company.jpg',
        description: 'ESP et Aimbot pour Rogue Company',
        link: '#',
        status: 'down',
        category: 'external'
    },
    {
        id: 'spoofer',
        title: 'Temps Spoofer',
        image: 'images/temps-spoofer.png',
        description: 'Spoofer pour contourner les bans',
        link: '#',
        status: 'down',
        category: 'tools'
    }
];

let currentUser = null;
let currentFilter = 'all';
let particlesManager = null;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    }, 2000);
    
    initParticles();
    initNavigation();
    initDiscordAuth();
    initCheats();
    initFilters();
    initSearch();
    initReviews();
    initAnimations();
    initTheme();

    // Récupère le nombre réel de membres Discord et met à jour la stat
    fetchDiscordMemberCount();
});
// Récupère le nombre de membres du serveur Discord et met à jour la stat
function fetchDiscordMemberCount() {
    // Utilise l'API widget Discord (pas besoin de token, mais doit être activé côté serveur)
    const serverId = '1287504865563639829';
    const url = `https://discord.com/api/guilds/${serverId}/widget.json`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data && typeof data.members === 'object' && typeof data.presence_count === 'number') {
                // Si le widget est activé, data.members.length = connectés, data.presence_count = connectés, data.instant_invite existe
                // Mais on veut le nombre total de membres, qui n'est pas fourni par le widget. On prend le nombre de connectés si pas mieux.
                // On tente d'utiliser data.members.length comme fallback.
                // Pour le vrai total, il faudrait un bot ou une API privée.
                // On affiche le nombre de connectés si pas mieux.
                const statElem = document.querySelector('.stat-number[data-count]');
                if (statElem) {
                    statElem.textContent = data.members.length;
                }
            } else if (data && typeof data.instant_invite === 'string') {
                // Widget activé mais pas d'info membres
                const statElem = document.querySelector('.stat-number[data-count]');
                if (statElem) {
                    statElem.textContent = '?';
                }
            }
        })
        .catch(() => {
            // Erreur réseau ou widget désactivé
            const statElem = document.querySelector('.stat-number[data-count]');
            if (statElem) {
                statElem.textContent = '?';
            }
        });
}

function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    class ParticlesManager {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.particles = [];
            this.mode = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            this.animationId = null;
            this.colorsLight = [
                '139, 92, 246',
                '236, 72, 153',
                '59, 130, 246'
            ];
            this.resize = this.resize.bind(this);
            this.animate = this.animate.bind(this);
            this.resize();
            this.reset();
            this.animate();
            window.addEventListener('resize', this.resize);
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.reset();
        }

        setMode(mode) {
            if (mode !== 'light' && mode !== 'dark') return;
            if (this.mode === mode) return;
            this.mode = mode;
            this.reset();
        }

        reset() {
            this.particles = [];
            if (this.mode === 'dark') {
                const count = 100;
                for (let i = 0; i < count; i++) {
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        r: Math.random() * 2 + 0.5,
                        vx: (Math.random() - 0.5) * 0.5,
                        vy: (Math.random() - 0.5) * 0.5,
                        a: Math.random() * 0.5 + 0.2
                    });
                }
            } else {
                const count = 60;
                for (let i = 0; i < count; i++) {
                    const speedY = -0.2 - Math.random() * 0.4; // monte doucement
                    this.particles.push({
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        r: Math.random() * 8 + 3,
                        vx: (Math.random() - 0.5) * 0.3,
                        vy: speedY,
                        drift: (Math.random() - 0.5) * 0.002,
                        color: this.colorsLight[Math.floor(Math.random() * this.colorsLight.length)],
                        a: Math.random() * 0.18 + 0.08
                    });
                }
            }
        }

        updateAndDrawDark() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const p of this.particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

                ctx.fillStyle = `rgba(139, 92, 246, ${p.a})`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }

            for (let i = 0; i < this.particles.length; i++) {
                const p1 = this.particles[i];
                for (let j = i + 1; j < this.particles.length; j++) {
                    const p2 = this.particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist < 100) {
                        const alpha = 0.12 * (1 - dist / 100);
                        this.ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.beginPath();
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.stroke();
                    }
                }
            }
        }

        updateAndDrawLight() {
            const ctx = this.ctx;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const p of this.particles) {
                p.vx += p.drift;
                p.x += p.vx;
                p.y += p.vy;

                if (p.y + p.r < 0) {
                    p.y = this.canvas.height + p.r;
                    p.x = Math.random() * this.canvas.width;
                }
                if (p.x - p.r > this.canvas.width) p.x = -p.r;
                if (p.x + p.r < 0) p.x = this.canvas.width + p.r;

                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
                grd.addColorStop(0, `rgba(${p.color}, ${Math.min(p.a * 1.5, 0.35)})`);
                grd.addColorStop(1, `rgba(${p.color}, 0)`);

                ctx.fillStyle = grd;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        animate() {
            if (this.mode === 'dark') {
                this.updateAndDrawDark();
            } else {
                this.updateAndDrawLight();
            }
            this.animationId = requestAnimationFrame(this.animate);
        }

        destroy() {
            cancelAnimationFrame(this.animationId);
            window.removeEventListener('resize', this.resize);
            this.particles = [];
        }
    }

    particlesManager = new ParticlesManager(canvas);
}

function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
    
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

window.scrollToSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function initDiscordAuth() {
    const authBtn = document.getElementById('discord-auth');
    const userProfile = document.getElementById('user-profile');
    const logoutBtn = document.getElementById('logout-btn');
    
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
        localStorage.setItem('discord_token', accessToken);
        window.location.hash = '';
        fetchDiscordUser(accessToken);
    } else {
        const savedToken = localStorage.getItem('discord_token');
        if (savedToken) {
            fetchDiscordUser(savedToken);
        }
    }
    
    authBtn?.addEventListener('click', () => {
        window.location.href = OAUTH_URL;
    });
    
    logoutBtn?.addEventListener('click', () => {
        localStorage.removeItem('discord_token');
        localStorage.removeItem('discord_user');
        currentUser = null;
        showAuthButton();
    });
}

async function fetchDiscordUser(token) {
    try {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Token invalide');
        
        const user = await response.json();
        currentUser = user;
        localStorage.setItem('discord_user', JSON.stringify(user));
        showUserProfile(user);
    } catch (error) {
        console.error('Erreur auth:', error);
        localStorage.removeItem('discord_token');
        showAuthButton();
    }
}

function showUserProfile(user) {
    const authBtn = document.getElementById('discord-auth');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    
    if (authBtn) authBtn.style.display = 'none';
    if (userProfile) userProfile.style.display = 'flex';
    
    if (userAvatar) {
        userAvatar.src = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';
    }
    
    if (userName) {
        userName.textContent = user.username;
    }
}

function showAuthButton() {
    const authBtn = document.getElementById('discord-auth');
    const userProfile = document.getElementById('user-profile');
    
    if (authBtn) authBtn.style.display = 'flex';
    if (userProfile) userProfile.style.display = 'none';
}

function initCheats() {
    const cheatsGrid = document.getElementById('cheats-grid');
    if (!cheatsGrid) return;
    
    cheatsData.forEach(cheat => {
        const card = document.createElement('div');
        card.className = 'cheat-card';
        card.dataset.status = cheat.status;
        card.dataset.category = cheat.category;
        
        card.innerHTML = `
            <img src="${cheat.image}" alt="${cheat.title}" class="cheat-image">
            <div class="cheat-content">
                <div class="cheat-header">
                    <h3 class="cheat-title">${cheat.title}</h3>
                    <span class="cheat-status ${cheat.status === 'active' ? 'status-active' : 'status-down'}">
                        ${cheat.status === 'active' ? 'Actif' : 'Hors ligne'}
                    </span>
                </div>
                <p class="cheat-description">${cheat.description}</p>
                <button class="cheat-download" ${cheat.status === 'down' ? 'disabled' : ''} 
                        onclick="downloadCheat('${cheat.link}')">
                    ${cheat.status === 'active' ? 'Télécharger' : 'Indisponible'}
                </button>
            </div>
        `;
        
        cheatsGrid.appendChild(card);
    });
}

window.downloadCheat = function(link) {
    if (!currentUser) {
        alert('Veuillez vous connecter avec Discord pour télécharger');
        document.getElementById('discord-auth')?.click();
        return;
    }
    
    if (link && link !== '#') {
        window.open(link, '_blank');
    }
}

function initFilters() {
    const chips = document.querySelectorAll('.chip');
    
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            const filter = chip.dataset.filter;
            filterCheats(filter);
        });
    });
}

function filterCheats(filter) {
    const cards = document.querySelectorAll('.cheat-card');
    
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === 'active') {
            card.style.display = card.dataset.status === 'active' ? 'block' : 'none';
        } else if (filter === 'down') {
            card.style.display = card.dataset.status === 'down' ? 'block' : 'none';
        } else if (filter === 'new') {
            card.style.display = card.dataset.category === 'new' ? 'block' : 'none';
        }
    });
}

function initSearch() {
    const searchInput = document.getElementById('search-cheats');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.cheat-card');
        
        cards.forEach(card => {
            const title = card.querySelector('.cheat-title').textContent.toLowerCase();
            const description = card.querySelector('.cheat-description').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function initReviews() {
    const addReviewBtn = document.getElementById('add-review-btn');
    const reviewModal = document.getElementById('review-modal');
    const closeModal = document.getElementById('close-review-modal');
    const reviewForm = document.getElementById('review-form');
    const stars = document.querySelectorAll('.star');
    const webhookUrl = "https://discord.com/api/webhooks/1406420197707087973/dzE0YA2IVj0w6rdRTLh4bf0NY1Lu6vTp3o-Hg2wTNSaqxHvykj0bco33smiUnVk7_M2o";

    // Afficher dynamiquement les derniers avis du Discord (si possible)
    loadDiscordReviews();
// Tente de charger les derniers avis du salon Discord (nécessite widget activé et salon public)
function loadDiscordReviews() {
    const reviewsContainer = document.getElementById('reviews-slider');
    // Pour une vraie intégration, il faudrait un bot ou un endpoint custom qui lit les messages du salon d'avis.
    // L'API widget Discord ne donne pas accès aux messages, donc on affiche un message d'info.
    if (reviewsContainer) {
        const info = document.createElement('div');
        info.style.textAlign = 'center';
        info.style.color = '#aaa';
        info.style.fontStyle = 'italic';
        info.style.margin = '2rem 0';
        info.textContent = "Les avis récents seront affichés ici automatiquement si l'intégration Discord est activée (nécessite un bot ou un endpoint custom).";
        reviewsContainer.innerHTML = '';
        reviewsContainer.appendChild(info);
    }
}

    let selectedRating = 5;

    addReviewBtn?.addEventListener('click', () => {
        if (!currentUser) {
            alert('Veuillez vous connecter avec Discord pour laisser un avis');
            document.getElementById('discord-auth')?.click();
            return;
        }
        reviewModal.classList.add('active');
    });

    closeModal?.addEventListener('click', () => {
        reviewModal.classList.remove('active');
    });

    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            stars.forEach((s, index) => {
                if (index < selectedRating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    reviewForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert('Veuillez vous connecter avec Discord pour laisser un avis');
            return;
        }
        const pseudo = reviewForm.querySelector('input[type="text"]').value.trim() || currentUser.username;
        const avis = reviewForm.querySelector('textarea').value.trim();
        const avatar = currentUser.avatar
            ? `https://cdn.discordapp.com/avatars/${currentUser.id}/${currentUser.avatar}.png`
            : 'https://cdn.discordapp.com/embed/avatars/0.png';
        const starsStr = '⭐'.repeat(selectedRating) + '☆'.repeat(5 - selectedRating);

        // Préparer l'embed Discord
        const embed = {
            author: {
                name: pseudo,
                icon_url: avatar
            },
            description: avis,
            color: 0x8b5cf6, // violet
            fields: [
                {
                    name: 'Note',
                    value: starsStr,
                    inline: true
                }
            ],
            timestamp: new Date().toISOString()
        };

        // Envoyer au webhook
        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
            showThemeChangeNotification('Avis envoyé !');
            reviewModal.classList.remove('active');
            reviewForm.reset();
        } catch (err) {
            alert("Erreur lors de l'envoi de l'avis.");
        }
    });
}

function initAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.textContent = '☀️';
        particlesManager?.setMode('light');
    const particles = document.getElementById('particles');
    if (particles) particles.style.opacity = '0.45';
    } else {
        document.body.classList.remove('light-theme');
        if (themeIcon) themeIcon.textContent = '🌙';
        particlesManager?.setMode('dark');
    const particles = document.getElementById('particles');
    if (particles) particles.style.opacity = '1';
    }
    
    themeToggle?.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        const newTheme = isLight ? 'light' : 'dark';
        
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
            themeIcon.style.transform = 'rotate(360deg)';
            themeIcon.textContent = isLight ? '☀️' : '🌙';
            
            setTimeout(() => {
                themeIcon.style.transform = '';
            }, 300);
        }
        
        const particles = document.getElementById('particles');
        if (particles) {
            particles.style.opacity = isLight ? '0.45' : '1';
        }
        particlesManager?.setMode(newTheme === 'light' ? 'light' : 'dark');
        
        showThemeChangeNotification(newTheme);
    });
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const isDark = e.matches;
            document.body.classList.toggle('light-theme', !isDark);
            if (themeIcon) themeIcon.textContent = isDark ? '🌙' : '☀️';
            const particles = document.getElementById('particles');
            if (particles) particles.style.opacity = !isDark ? '0.45' : '1';
            particlesManager?.setMode(!isDark ? 'light' : 'dark');
        }
    });
}

function showThemeChangeNotification(theme) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 12px 20px;
        background: var(--gradient);
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    `;
    notification.textContent = theme === 'light' ? '☀️ Mode jour activé' : '🌙 Mode nuit activé';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
