# Dashboard Administrateur - Herboristerie de Dinan

## Architecture Complète

### 🏗️ Structure des Fichiers

```
admin/
├── login.html                    # Page de connexion sécurisée
├── dashboard.html                # Tableau de bord principal optimisé
├── products.html                 # Gestion des produits
├── stock.html                    # Gestion des stocks
├── blog.html                     # Gestion des articles
├── orders.html                   # Gestion des commandes clients
├── customers.html                # Gestion des clients
├── analytics.html                # Statistiques détaillées
├── settings.html                 # Paramètres complets
└── js/
    ├── auth-security.js          # Authentification et sécurité
    └── dashboard.js               # Fonctionnalités du dashboard
```

### 🔐 Sécurité

#### Authentification
- **Email + Mot de passe** pour Céline et Henrieta
- **Session sécurisée** avec timeout d'1 heure
- **Protection contre les tentatives** de connexion (max 5, blocage 15min)
- **Middleware de protection** des routes admin
- **Logout automatique** après inactivité

#### Configuration Utilisateurs
> ⚠️ Ne jamais documenter de vrais identifiants ici — ce fichier est versionné.
> Cet espace admin est une maquette statique sans backend réel ; la liste des
> utilisateurs doit rester vide tant qu'un vrai serveur d'authentification
> (mots de passe hachés, base de données) n'est pas en place.
```javascript
users: [] // à peupler uniquement côté serveur, une fois le backend construit
```

### 📊 Fonctionnalités Principales

#### 1. Tableau de Bord (dashboard.html)
- **Statistiques en temps réel** : visiteurs, pages vues, commandes, CA
- **Graphiques interactifs** : évolution des visiteurs, ventes par catégorie
- **Activité récente** : dernières commandes, nouveaux produits, articles
- **Quick Actions** : cartes cliquables avec gradients et animations
- **Header sticky** avec recherche, notifications et email utilisateur
- **Design optimisé** avec animations fluides et transitions
- **Actions rapides** : ajouter produit, nouvel article, exporter stats

#### 2. Gestion des Produits (products.html)
- **CRUD complet** : créer, modifier, supprimer des produits
- **Filtres avancés** : recherche, catégorie, statut
- **Modal d'édition** avec formulaire complet
- **Gestion des stocks** intégrée
- **Catégories** : tisanes, plantes médicinales, compléments, bien-être

#### 3. Gestion des Stocks (stock.html)
- **Alertes automatiques** : rupture, stock faible
- **Mise à jour rapide** : interface de modification instantanée
- **Historique des mouvements** : vente, réapprovisionnement, ajustement
- **Export CSV** des données de stock
- **Rafraîchissement automatique** toutes les 30 secondes

#### 4. Blog (blog.html)
- **Éditeur de texte** avec formatage
- **Gestion des articles** : créer, modifier, dupliquer, supprimer
- **Catégories** : conseils phytothérapie, plantes, recettes, bien-être
- **Auteurs** : Céline et Henrieta
- **Statistiques** : vues, commentaires, likes

### 🗄️ Base de Données

#### Structure Supabase (PostgreSQL)
```sql
-- Produits
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Articles
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    author VARCHAR(100) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stocks
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    reason VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 📈 Analytics Respectueux de la Vie Privée

#### Plausible Analytics (Recommandé)
- **Auto-hébergé** ou service cloud
- **Sans cookies** tracking
- **Respect de la vie privée** (RGPD compliant)
- **Statistiques essentielles** : visiteurs, pages vues, taux de rebond

#### Matomo (Alternative)
- **Auto-hébergé** possible
- **Contrôle total** des données
- **Analytics détaillés** avec heatmaps
- **Export des données**

### 🛡️ Mesures de Sécurité

#### Headers HTTP
```javascript
Content-Security-Policy: default-src 'self'...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

#### Session Management
- **Timeout** : 1 heure d'inactivité
- **Regénération** des tokens
- **Storage sécurisé** (sessionStorage)
- **Logout automatique**

#### Input Validation
- **Sanitization** des entrées utilisateur
- **XSS Prevention** avec CSP
- **SQL Injection Prevention** avec requêtes paramétrées
- **CSRF Protection** avec tokens

### 🎨 Interface Utilisateur

#### Design System
- **Responsive Design** : mobile-first
- **Accessible** : WCAG 2.1 AA
- **Thème cohérent** avec le site principal
- **Feedback visuel** : notifications, confirmations

#### Navigation
- **Sidebar fixe** avec navigation intuitive
- **Breadcrumb** pour la hiérarchie
- **Search globale** dans l'admin
- **Raccourcis clavier** pour les actions fréquentes

### 🔧 Technologies

#### Frontend
- **HTML5** sémantique
- **Tailwind CSS** pour le style
- **JavaScript ES6+** vanilla
- **Chart.js** pour les graphiques
- **Lucide Icons** pour les icônes

#### Backend
- **Node.js** avec Express (optionnel)
- **Supabase** pour la base de données
- **JWT** pour l'authentification
- **Bcrypt** pour le hashage des mots de passe

#### Déploiement
- **HTTPS obligatoire**
- **Domaine** : admin.jardindescolibris.fr
- **Backup quotidien** des données
- **Monitoring** des performances

### 📋 Déploiement

#### Étapes
1. **Configurer Supabase** et créer les tables
2. **Générer des mots de passe sécurisés** pour Céline et Henrieta
3. **Déployer les fichiers** sur le serveur
4. **Configurer le domaine** et SSL
5. **Tester toutes les fonctionnalités**
6. **Former Céline et Henrieta** à l'interface

#### Configuration Production
```bash
# Variables d'environnement
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
PLAUSIBLE_DOMAIN=jardindescolibris.fr
```

### 🚀 Évolutions Possibles

#### Phase 2
- **Commandes en ligne** avec Stripe/PayPal
- **Email automation** pour les clients
- **API publique** pour les partenaires
- **Mobile app** pour la gestion

#### Phase 3
- **IA pour les recommandations** produits
- **Chatbot** pour le support client
- **Analytics prédictifs** pour les ventes
- **Multi-boutique** pour l'expansion

### 📞 Support Formation

#### Pour Céline et Henrieta
1. **Session de formation** : 2 heures
2. **Guide utilisateur** détaillé
3. **Vidéos tutoriel** pour chaque fonction
4. **Support prioritaire** par email/téléphone
5. **Mises à jour mensuelles** avec nouvelles fonctionnalités

---

Ce dashboard administrateur offre une solution complète, sécurisée et évolutive pour gérer l'Herboristerie de Dinan, avec une interface intuitive adaptée à des utilisateurs non techniques.
