// Configuration de l'authentification sécurisée
const AUTH_CONFIG = {
    // Utilisateurs autorisés (à remplacer par une base de données sécurisée)
    users: [
        {
            id: 1,
            email: 'celine@jardindescolibris.fr',
            password: '***REDACTED-CREDENTIAL-REMOVED***', // À hasher avec bcrypt
            name: 'Céline',
            role: 'admin',
            permissions: ['dashboard', 'products', 'stock', 'blog', 'orders', 'analytics']
        },
        {
            id: 2,
            email: 'henrieta@jardindescolibris.fr',
            password: '***REDACTED-CREDENTIAL-REMOVED***', // À hasher avec bcrypt
            name: 'Henrieta',
            role: 'admin',
            permissions: ['dashboard', 'products', 'stock', 'blog', 'orders', 'analytics']
        }
    ],
    
    // Configuration de sécurité
    sessionTimeout: 3600000, // 1 heure en millisecondes
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    
    // Clés de session (à générer aléatoirement)
    sessionKey: 'colibris_session',
    userKey: 'colibris_user'
};

// Middleware d'authentification
class AuthMiddleware {
    constructor() {
        this.config = AUTH_CONFIG;
        this.attempts = new Map(); // Pour suivre les tentatives de connexion
    }
    
    // Vérification de l'authentification
    isAuthenticated() {
        const session = this.getSession();
        if (!session) return false;
        
        // Vérifier si la session est expirée
        const now = Date.now();
        if (now - session.timestamp > this.config.sessionTimeout) {
            this.logout();
            return false;
        }
        
        // Rafraîchir la session
        session.timestamp = now;
        this.saveSession(session);
        return true;
    }
    
    // Connexion
    async login(email, password) {
        // Vérifier les tentatives de connexion
        if (this.isLockedOut(email)) {
            throw new Error('Compte temporairement bloqué. Veuillez réessayer plus tard.');
        }
        
        // Trouver l'utilisateur
        const user = this.config.users.find(u => u.email === email);
        if (!user) {
            this.recordFailedAttempt(email);
            throw new Error('Email ou mot de passe incorrect');
        }
        
        // Vérifier le mot de passe (à remplacer par bcrypt.compare)
        if (user.password !== password) {
            this.recordFailedAttempt(email);
            throw new Error('Email ou mot de passe incorrect');
        }
        
        // Créer la session
        const session = {
            userId: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
            timestamp: Date.now(),
            loginTime: new Date().toISOString()
        };
        
        this.saveSession(session);
        this.clearFailedAttempts(email);
        
        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        };
    }
    
    // Déconnexion
    logout() {
        sessionStorage.removeItem(this.config.sessionKey);
        sessionStorage.removeItem(this.config.userKey);
        window.location.href = 'login.html';
    }
    
    // Vérification des permissions
    hasPermission(permission) {
        const session = this.getSession();
        return session && session.permissions.includes(permission);
    }
    
    // Obtenir la session actuelle
    getSession() {
        try {
            const sessionData = sessionStorage.getItem(this.config.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('Erreur de lecture de session:', error);
            return null;
        }
    }
    
    // Sauvegarder la session
    saveSession(session) {
        try {
            sessionStorage.setItem(this.config.sessionKey, JSON.stringify(session));
        } catch (error) {
            console.error('Erreur de sauvegarde de session:', error);
        }
    }
    
    // Enregistrer une tentative de connexion échouée
    recordFailedAttempt(email) {
        const attempts = this.attempts.get(email) || { count: 0, lastAttempt: 0 };
        attempts.count++;
        attempts.lastAttempt = Date.now();
        this.attempts.set(email, attempts);
    }
    
    // Vérifier si le compte est bloqué
    isLockedOut(email) {
        const attempts = this.attempts.get(email);
        if (!attempts) return false;
        
        if (attempts.count >= this.config.maxLoginAttempts) {
            const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
            return timeSinceLastAttempt < this.config.lockoutDuration;
        }
        
        return false;
    }
    
    // Effacer les tentatives de connexion échouées
    clearFailedAttempts(email) {
        this.attempts.delete(email);
    }
    
    // Middleware pour les routes protégées
    protectRoute(requiredPermission = null) {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        
        if (requiredPermission && !this.hasPermission(requiredPermission)) {
            alert('Vous n\'avez pas les permissions nécessaires pour accéder à cette page.');
            window.location.href = 'dashboard.html';
            return false;
        }
        
        return true;
    }
}

// Configuration de la base de données (Supabase simulation)
const DATABASE_CONFIG = {
    // Configuration Supabase (à remplacer par vos vraies clés)
    supabase: {
        url: 'https://your-project.supabase.co',
        anonKey: 'your-anon-key',
        serviceKey: 'your-service-key'
    },
    
    // Tables de la base de données
    tables: {
        products: 'products',
        articles: 'articles',
        orders: 'orders',
        users: 'users',
        analytics: 'analytics',
        stock: 'stock'
    }
};

// Service de base de données
class DatabaseService {
    constructor() {
        this.config = DATABASE_CONFIG;
        // En production, utiliser le client Supabase
        // this.supabase = createClient(this.config.supabase.url, this.config.supabase.anonKey);
    }
    
    // Simulation de connexion à la base de données
    async connect() {
        // En production: await this.supabase.auth.signIn()
        console.log('Connexion à la base de données...');
        return true;
    }
    
    // Opérations CRUD pour les produits
    async getProducts(filters = {}) {
        // En production: await this.supabase.from('products').select('*').eq(filters)
        return this.mockProducts;
    }
    
    async createProduct(product) {
        // En production: await this.supabase.from('products').insert(product)
        const newProduct = {
            id: Date.now(),
            ...product,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.mockProducts.push(newProduct);
        return newProduct;
    }
    
    async updateProduct(id, updates) {
        // En production: await this.supabase.from('products').update(updates).eq('id', id)
        const index = this.mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            this.mockProducts[index] = {
                ...this.mockProducts[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            return this.mockProducts[index];
        }
        return null;
    }
    
    async deleteProduct(id) {
        // En production: await this.supabase.from('products').delete().eq('id', id)
        this.mockProducts = this.mockProducts.filter(p => p.id !== id);
        return true;
    }
    
    // Mock data pour le développement
    mockProducts = [
        {
            id: 1,
            name: 'Tisane Digestion Légère',
            category: 'tisanes',
            description: 'Mélange de plantes pour faciliter la digestion',
            price: 12.90,
            stock: 45,
            status: 'active',
            image: 'https://example.com/tisane-digestion.jpg',
            createdAt: '2024-03-01T10:00:00Z',
            updatedAt: '2024-03-10T15:30:00Z'
        },
        {
            id: 2,
            name: 'Camomille Bio',
            category: 'plantes',
            description: 'Fleurs de camomille biologiques',
            price: 8.50,
            stock: 120,
            status: 'active',
            image: 'https://example.com/camomille.jpg',
            createdAt: '2024-03-01T10:00:00Z',
            updatedAt: '2024-03-10T15:30:00Z'
        }
    ];
    
    // Opérations pour les articles de blog
    async getArticles(filters = {}) {
        return this.mockArticles;
    }
    
    async createArticle(article) {
        const newArticle = {
            id: Date.now(),
            ...article,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.mockArticles.push(newArticle);
        return newArticle;
    }
    
    mockArticles = [
        {
            id: 1,
            title: 'Les bienfaits de la camomille sur le sommeil',
            slug: 'bienfaits-camomille-sommeil',
            category: 'conseils',
            author: 'Céline',
            excerpt: 'Découvrez comment la camomille peut vous aider à retrouver un sommeil naturel.',
            content: '<p>La camomille est une plante médicinale connue...</p>',
            image: 'https://example.com/camomille-sommeil.jpg',
            status: 'published',
            date: '2024-03-10',
            views: 456,
            comments: 12,
            createdAt: '2024-03-10T10:00:00Z',
            updatedAt: '2024-03-10T10:00:00Z'
        }
    ];
    
    // Opérations pour les stocks
    async getStockData() {
        return this.mockStockData;
    }
    
    async updateStock(productId, quantity, reason) {
        const stockItem = this.mockStockData.find(s => s.productId === productId);
        if (stockItem) {
            stockItem.currentStock = quantity;
            stockItem.lastUpdated = new Date().toISOString().split('T')[0];
            stockItem.lastReason = reason;
        }
        return stockItem;
    }
    
    mockStockData = [
        {
            id: 1,
            productId: 1,
            productName: 'Tisane Digestion Légère',
            category: 'tisanes',
            currentStock: 45,
            alertThreshold: 10,
            lastUpdated: '2024-03-10',
            lastReason: 'restock'
        }
    ];
    
    // Opérations pour les analytics
    async getAnalytics(period = '30d') {
        return this.mockAnalytics;
    }
    
    mockAnalytics = {
        visitors: {
            total: 1234,
            growth: 12,
            daily: [65, 89, 120, 110, 134, 123]
        },
        pageViews: {
            total: 5678,
            growth: 8,
            daily: [320, 450, 580, 520, 640, 590]
        },
        sales: {
            total: 2345,
            growth: 23,
            daily: [120, 180, 290, 260, 380, 340]
        },
        topPages: [
            { path: '/index.html', views: 1234 },
            { path: '/plantes-tisanes.html', views: 890 },
            { path: '/boutique.html', views: 678 }
        ],
        topProducts: [
            { name: 'Tisane Digestion Légère', views: 456, sales: 89 },
            { name: 'Camomille Bio', views: 234, sales: 45 }
        ]
    };
}

// Service d'analytics (alternative à Google Analytics)
class AnalyticsService {
    constructor() {
        this.db = new DatabaseService();
    }
    
    // Configuration pour Plausible Analytics (respectueux de la vie privée)
    async setupPlausible() {
        // Intégration de Plausible Analytics
        (function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
        p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
        };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
        n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","https://plausible.io/js/plausible.js","plausible"));
        
        // Configuration
        window.plausible('page', { props: { domain: 'jardindescolibris.fr' } });
    }
    
    // Configuration pour Matomo (auto-hébergé)
    async setupMatomo() {
        // Intégration de Matomo
        var _paq = window._paq = window._paq || [];
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function() {
            var u="https://your-matomo-domain.com/";
            _paq.push(['setTrackerUrl', u+'matomo.php']);
            _paq.push(['setSiteId', '1']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();
    }
    
    // Suivi des événements personnalisés
    trackEvent(category, action, name = null, value = null) {
        if (window.plausible) {
            window.plausible(category, { props: { action, name, value } });
        }
        
        if (window._paq) {
            _paq.push(['trackEvent', category, action, name, value]);
        }
        
        // Stockage local pour analytics
        this.storeEvent({ category, action, name, value, timestamp: Date.now() });
    }
    
    // Stockage local des événements
    storeEvent(event) {
        const events = JSON.parse(localStorage.getItem('colibris_events') || '[]');
        events.push(event);
        
        // Garder seulement les 1000 derniers événements
        if (events.length > 1000) {
            events.splice(0, events.length - 1000);
        }
        
        localStorage.setItem('colibris_events', JSON.stringify(events));
    }
    
    // Récupérer les statistiques
    async getStats(period = '30d') {
        const events = JSON.parse(localStorage.getItem('colibris_events') || '[]');
        const now = Date.now();
        const periodMs = this.getPeriodMs(period);
        
        const filteredEvents = events.filter(e => now - e.timestamp < periodMs);
        
        return {
            pageViews: filteredEvents.filter(e => e.category === 'pageview').length,
            events: filteredEvents.length,
            topPages: this.getTopPages(filteredEvents),
            topProducts: this.getTopProducts(filteredEvents)
        };
    }
    
    getPeriodMs(period) {
        const periods = {
            '7d': 7 * 24 * 60 * 60 * 1000,
            '30d': 30 * 24 * 60 * 60 * 1000,
            '90d': 90 * 24 * 60 * 60 * 1000
        };
        return periods[period] || periods['30d'];
    }
    
    getTopPages(events) {
        const pageViews = {};
        events.filter(e => e.category === 'pageview').forEach(e => {
            pageViews[e.name] = (pageViews[e.name] || 0) + 1;
        });
        
        return Object.entries(pageViews)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([page, views]) => ({ page, views }));
    }
    
    getTopProducts(events) {
        const productViews = {};
        events.filter(e => e.category === 'product').forEach(e => {
            productViews[e.name] = (productViews[e.name] || 0) + 1;
        });
        
        return Object.entries(productViews)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([product, views]) => ({ product, views }));
    }
}

// Export des services
window.AdminServices = {
    Auth: new AuthMiddleware(),
    Database: new DatabaseService(),
    Analytics: new AnalyticsService()
};

// Protection automatique des routes
document.addEventListener('DOMContentLoaded', () => {
    const auth = window.AdminServices.Auth;
    
    // Vérifier l'authentification sur toutes les pages admin
    if (window.location.pathname.includes('/admin/')) {
        auth.protectRoute();
    }
    
    // Afficher les informations de l'utilisateur dans l'interface
    const session = auth.getSession();
    if (session) {
        const userElements = document.querySelectorAll('[data-user-email]');
        userElements.forEach(el => {
            el.textContent = session.email;
        });
    }
});

// Configuration CORS et sécurité
const SECURITY_HEADERS = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://plausible.io;",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Application des headers de sécurité (côté serveur)
function applySecurityHeaders() {
    Object.entries(SECURITY_HEADERS).forEach(([header, value]) => {
        // En production, ces headers doivent être configurés côté serveur
        console.log(`Header: ${header}: ${value}`);
    });
}

export { AUTH_CONFIG, DATABASE_CONFIG, SecurityHeaders };
