# Clarisse Bar - Deployment Guide

## 🎯 Checkup Pré-Déploiement

### ✅ État du Projet

**Structure générale :** ✓ OK

- Django 5.2.4 configuré correctement
- App `core` bien intégrée
- URLs configurées (`clarisse_bar/urls.py`)
- Templates dans `core/templates/`
- Static files bien organisés

**Base de données :** ✓ SQLite3

- Actuellement : `db.sqlite3` en développement
- Migrations propres regénérées

**Frontend :** ✓ Tailwind CSS v4 intégré localement

- Configuration : `tailwind.config.cjs` + `postcss.config.cjs`
- Entrée : `assets/styles.css`
- Sortie : `core/static/css/tailwind.css`
- Buildé via `npm run build:css`

**Dependencies :** ✓ À jour

- Python : requirements.txt valide
- Node.js : package.json avec Tailwind + PostCSS

**Configuration Django :** ⚠️ À ajuster pour la production

- `DEBUG = False` ✓ (déjà configuré pour production)
- `ALLOWED_HOSTS = ['jonathan16.pythonanywhere.com']` ✓
- `SECRET_KEY` : À mettre en variable d'environnement
- `STATIC_ROOT` : À configurer pour collectstatic

---

## 📋 Checklist Avant Déploiement

### 1. **Préparation Local (À faire AVANT de pusher)**

- [ ] Générer le CSS Tailwind final : `npm run build:css`
- [ ] Vérifier que `core/static/css/tailwind.css` est à jour
- [ ] Exécuter les migrations : `python manage.py migrate`
- [ ] Collecter les static files : `python manage.py collectstatic --noinput`
- [ ] Tester localement en mode production : `DEBUG=False python manage.py runserver`

### 2. **Git & GitHub**

- [ ] Vérifier `.gitignore` (mis à jour) ✓
- [ ] Ajouter les fichiers : `git add .`
- [ ] Commit : `git commit -m "Final deployment ready"`
- [ ] Push vers GitHub : `git push origin main`

### 3. **Configuration Django**

- [ ] Mettre `SECRET_KEY` en variable d'environnement (PythonAnywhere)
- [ ] Ajouter `STATIC_ROOT` dans settings.py
- [ ] Configurer `STATIC_FILES_DIRS` pour servir les assets

### 4. **PythonAnywhere Setup**

- [ ] Créer un compte PythonAnywhere
- [ ] Configurer le domaine (`jonathan16.pythonanywhere.com`)
- [ ] Cloner le dépôt GitHub
- [ ] Créer un virtualenv Python 3.11+
- [ ] Installer les dépendances : `pip install -r requirements.txt`
- [ ] Installer Node.js et regénérer le CSS
- [ ] Configurer la Web App Django
- [ ] Collectstatic sur le serveur
- [ ] Recharger la Web App

---

## 🚀 Guide Détaillé PythonAnywhere

### Étape 1 : Configuration PythonAnywhere Web App

1. **Aller dans Web** → Ajouter une nouvelle Web App
2. **Framework** : Django
3. **Python** : 3.11 (ou plus récent)
4. **Directory** : `/home/jonathan16/clarisse_bar`
5. PythonAnywhere va créer une configuration WSGI automatiquement

### Étape 2 : Cloner le Code

```bash
# Via console PythonAnywhere (Bash)
cd /home/jonathan16
git clone https://github.com/<your-username>/clarisse_bar.git
cd clarisse_bar
```

### Étape 3 : Virtualenv & Dependencies

```bash
# Créer un virtualenv
mkvirtualenv --python=/usr/bin/python3.11 clarisse_env

# Activer et installer
source /home/jonathan16/.virtualenvs/clarisse_env/bin/activate
pip install -r requirements.txt

# Installer Node.js (optionnel, si regénération du CSS est nécessaire)
# Ou utiliser le CSS pré-généré du dépôt
```

### Étape 4 : Configuration Django Settings

Modifier `clarisse_bar/settings.py` pour la production :

```python
# Ajouter à settings.py :
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Production settings
STATIC_ROOT = BASE_DIR / 'staticfiles'  # Important pour collectstatic
STATIC_FILES_DIRS = [
    BASE_DIR / 'core' / 'static',  # Dossier des assets générés
]

# Sécurité
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-fallback-for-dev')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = ['jonathan16.pythonanywhere.com', 'localhost']
```

### Étape 5 : Générer les Static Files

```bash
# Dans le virtualenv PythonAnywhere
cd /home/jonathan16/clarisse_bar
python manage.py collectstatic --noinput
```

### Étape 6 : Migrations Finales

```bash
python manage.py migrate
```

### Étape 7 : Configurer WSGI

Éditer le fichier WSGI généré par PythonAnywhere :
`/var/www/jonathan16_pythonanywhere_com_wsgi.py`

```python
import os
import sys
from pathlib import Path

path = '/home/jonathan16/clarisse_bar'
if path not in sys.path:
    sys.path.insert(0, path)

os.environ['DJANGO_SETTINGS_MODULE'] = 'clarisse_bar.settings'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### Étape 8 : Recharger la Web App

- Allez dans l'onglet **Web**
- Cliquez sur **Reload** pour appliquer les modifications

### Étape 9 : Vérifier les Logs

- Allez dans **Web** → **Log files**
- Vérifiez les logs d'erreur : `/var/log/jonathan16.pythonanywhere.com.error.log`

---

## 📦 Structure Attendue sur PythonAnywhere

```
/home/jonathan16/clarisse_bar/
├── clarisse_bar/          # Django project
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── core/                  # Django app
│   ├── static/
│   │   └── css/tailwind.css  (généré)
│   ├── templates/
│   ├── migrations/
│   ├── models.py
│   ├── views.py
│   └── urls.py
├── assets/               # Source CSS
│   └── styles.css
├── staticfiles/          # Collectstatic output (généré)
├── db.sqlite3           # Base de données
├── manage.py
├── requirements.txt
├── package.json
├── postcss.config.cjs
├── tailwind.config.cjs
└── .env                 # Variables d'environnement (à créer)
```

---

## 🔐 Variables d'Environnement

Créer un fichier `.env` sur PythonAnywhere :

```bash
# /home/jonathan16/clarisse_bar/.env
SECRET_KEY=your-production-secret-key-here
DEBUG=False
ALLOWED_HOSTS=jonathan16.pythonanywhere.com
```

Puis modifiez settings.py pour les charger :

```python
from decouple import config

SECRET_KEY = config('SECRET_KEY', default='django-insecure-fallback')
DEBUG = config('DEBUG', default=False, cast=bool)
```

Installez `python-decouple` :

```bash
pip install python-decouple
```

---

## 🔧 Troubleshooting

### Les CSS ne s'appliquent pas

- Vérifiez que `npm run build:css` a été exécuté
- Vérifiez que `core/static/css/tailwind.css` existe et est non-vide
- Lancez `python manage.py collectstatic --clear --noinput`
- Rechargez la Web App

### Page "Not Found" 404

- Vérifiez `ALLOWED_HOSTS` dans settings.py
- Vérifiez `ROOT_URLCONF` pointe vers `clarisse_bar.urls`

### Erreur Database

- Vérifiez que `db.sqlite3` est writable (permissions)
- Lancez `python manage.py migrate`

### Erreur d'import ou module

- Vérifiez que le virtualenv est activé
- Vérifiez que `pip install -r requirements.txt` a réussi

---

## ✨ Après Déploiement

1. **Tester l'app** : Allez sur `https://jonathan16.pythonanywhere.com`
2. **Créer un superuser** (si première fois) :
   ```bash
   python manage.py createsuperuser
   ```
3. **Vérifier les logs** en continu si besoin

---

## 📞 Support & Notes

- **Domaine** : `jonathan16.pythonanywhere.com`
- **Email support PythonAnywhere** : support@pythonanywhere.com
- **Django Docs** : https://docs.djangoproject.com/
