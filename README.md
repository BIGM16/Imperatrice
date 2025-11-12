# 🍹 Clarisse Bar - Application de Gestion de Bar

Application Django complète pour gérer les ventes, les stocks et les statistiques d'un bar.

## 🎯 Fonctionnalités

- **Dashboard Admin** : Gestion des produits, stocks et statistiques
- **Dashboard Vendeur** : Interface simplifiée pour enregistrer les ventes
- **Historique des Ventes** : Filtrage par boisson, date, avec calculs de totaux
- **Système de Thème** : Mode clair/sombre avec CSS variables
- **Interface Responsive** : Mobile-first avec Tailwind CSS v4
- **API AJAX** : Opérations CRUD sans rechargement de page
- **Authentification** : Système de roles (admin/vendeur)

## 🛠️ Stack Technique

- **Backend** : Django 5.2.4
- **Frontend** : Tailwind CSS v4 (local)
- **Database** : SQLite3 (développement) / SQLite3 ou PostgreSQL (production)
- **Build** : PostCSS + npm scripts
- **Deployment** : PythonAnywhere

## 📦 Installation Locale

### Prérequis

- Python 3.11+
- Node.js 18+
- Git

### Setup

1. **Cloner le dépôt**

```bash
git clone https://github.com/<your-username>/clarisse_bar.git
cd clarisse_bar
```

2. **Créer virtualenv et installer dépendances Python**

```bash
python -m venv venv
# Sous Windows :
venv\Scripts\activate
# Sous macOS/Linux :
source venv/bin/activate

pip install -r requirements.txt
```

3. **Installer dépendances Node.js**

```bash
npm install
```

4. **Générer le CSS Tailwind**

```bash
npm run build:css
```

5. **Migrations & Superuser**

```bash
python manage.py migrate
python manage.py createsuperuser
```

6. **Démarrer le serveur de développement**

```bash
python manage.py runserver
```

Accédez à `http://localhost:8000`

## 👨‍💻 Développement

### Mode Watch CSS (Regénère automatiquement le CSS)

```bash
npm run watch:css
```

### Runserver Django

```bash
python manage.py runserver
```

### Créer des migrations après modification des modèles

```bash
python manage.py makemigrations
python manage.py migrate
```

## 📁 Structure du Projet

```
clarisse_bar/
├── clarisse_bar/              # Configuration Django
│   ├── settings.py            # Paramètres (à adapter pour production)
│   ├── urls.py                # Routes principales
│   ├── wsgi.py                # WSGI pour déploiement
│   └── asgi.py
│
├── core/                       # Application principale
│   ├── static/
│   │   ├── css/
│   │   │   └── tailwind.css   # ⚠️ GÉNÉRÉ (ne pas commiter)
│   │   └── js/
│   ├── templates/
│   │   ├── base.html          # Template principal
│   │   ├── admin_dashboard.html
│   │   ├── seller_dashboard.html
│   │   └── sales_history.html
│   ├── migrations/            # Migrations DB
│   ├── models.py              # ORM models
│   ├── views.py               # Logique métier
│   ├── urls.py                # Routes de l'app
│   ├── forms.py               # Formulaires
│   └── admin.py               # Config admin Django
│
├── assets/
│   └── styles.css             # Source Tailwind (point d'entrée)
│
├── staticfiles/               # ⚠️ GÉNÉRÉ (collectstatic)
├── db.sqlite3                 # ⚠️ GÉNÉRÉ (ne pas commiter)
│
├── package.json               # Dépendances Node.js
├── postcss.config.cjs         # Config PostCSS
├── tailwind.config.cjs        # Config Tailwind
├── requirements.txt           # Dépendances Python
├── manage.py
│
├── DEPLOYMENT.md              # Guide de déploiement PythonAnywhere
└── README.md                  # Ce fichier
```

## 🌐 Déploiement

Voir [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet de déploiement sur PythonAnywhere.

**Résumé rapide :**

1. `npm run build:css` (générer le CSS final)
2. `python manage.py collectstatic` (rassembler les assets)
3. `git push` vers GitHub
4. Cloner sur PythonAnywhere et configurer la Web App

## 🔧 Configuration Production

Avant déploiement, vérifier/modifier :

- `SECRET_KEY` → Variable d'environnement
- `DEBUG = False` ✓
- `ALLOWED_HOSTS` = `['jonathan16.pythonanywhere.com']`
- `STATIC_ROOT` configuré ✓
- Database : SQLite3 pour testing, PostgreSQL recommandé pour production

## 📊 Endpoints Principaux

### Authentification

- `GET /` → Login
- `POST /logout/` → Logout

### Dashboards

- `GET /seller/` → Interface vendeur
- `GET /admin_dashboard/` → Dashboard admin
- `GET /sales/history/` → Historique avec filtres

### API AJAX

- `POST /api/sale/` → Enregistrer une vente
- `POST /ajax/drinks/add/` → Créer une boisson
- `POST /ajax/drinks/<id>/edit/` → Modifier une boisson
- `POST /ajax/drinks/<id>/delete/` → Supprimer une boisson
- `POST /ajax/drinks/<id>/update_stock/` → Mettre à jour le stock

## 🎨 Personnalisation Tailwind

Modifiez `assets/styles.css` ou `tailwind.config.cjs` puis régénérez :

```bash
npm run build:css
```

## 📝 Logs & Debugging

### En développement

- Logs Django dans le terminal
- Console du navigateur (F12)

### En production (PythonAnywhere)

- Logs : `/var/log/jonathan16.pythonanywhere.com.error.log`
- Accès via Dashboard PythonAnywhere → Web App → Log files

## 🤝 Support & Contribution

Pour des issues ou suggestions :

1. Ouvrir une issue GitHub
2. Ou contacter directement

## 📜 License

Projet personnel - Tous droits réservés.

---

**Dernière mise à jour :** 12 novembre 2025
**Version Django :** 5.2.4
**Version Tailwind :** v4.1.17
