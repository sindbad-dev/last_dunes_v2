# 🎮 Comment Lancer Last Dunes

## ⚠️ IMPORTANT - Problème d'Ouverture Directe

**NE PAS** ouvrir `index.html` directement en double-cliquant dessus!

Le jeu utilise `fetch()` pour charger `data/level1.json`, ce qui nécessite un serveur HTTP. Si vous ouvrez le fichier directement (`file://`), le navigateur bloquera le chargement pour des raisons de sécurité (CORS).

## ✅ Solution 1: Serveur Python Intégré (RECOMMANDÉ)

### Sur Windows:
1. Double-cliquez sur `START_SERVER.bat`
2. Une fenêtre de terminal s'ouvre
3. Ouvrez votre navigateur et allez sur: **http://localhost:8000**

### Sur Linux/Mac:
1. Ouvrez un terminal dans le dossier du projet
2. Lancez: `./start_server.sh`
3. Ouvrez votre navigateur et allez sur: **http://localhost:8000**

### Manuellement (toutes plateformes):
```bash
python3 server.py
```
Puis ouvrez **http://localhost:8000** dans votre navigateur.

## ✅ Solution 2: Extension VS Code

Si vous utilisez **Visual Studio Code**:
1. Installez l'extension "Live Server" (par Ritwick Dey)
2. Faites un clic droit sur `index.html`
3. Sélectionnez "Open with Live Server"

## ✅ Solution 3: Autres Serveurs HTTP

### Node.js (http-server):
```bash
npx http-server -p 8000
```

### PHP:
```bash
php -S localhost:8000
```

## 🎮 Contrôles du Jeu

Une fois le jeu lancé:
- **ZQSD** ou **Flèches** : Déplacer l'avatar
- **Clic** sur les cartes pour faire vos choix

## 🐛 Dépannage

### Le canvas est noir / rien ne s'affiche:
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs dans l'onglet "Console"
3. Vérifiez que vous utilisez bien un serveur HTTP (l'URL doit commencer par `http://`, pas `file://`)

### Erreur "Failed to fetch":
- Vous n'utilisez pas de serveur HTTP
- Utilisez une des solutions ci-dessus

### L'avatar ne bouge pas:
- Cliquez d'abord sur le canvas pour lui donner le focus
- Utilisez ZQSD ou les flèches directionnelles

## 📍 Positions des Challenges

Pour tester rapidement:
1. **Le Gardien** : Position (16, 20) - Allez vers le bas depuis le spawn
2. **Le Puits** : Position (10, 8) - En haut à gauche
3. **Le Boss** : Position (11, 23) - En bas à gauche

Bon jeu! 🏜️
