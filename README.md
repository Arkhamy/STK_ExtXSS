# STK Cookie Audit 🛡️

STK Cookie Audit est une extension Firefox axée sur la sécurité offensive et défensive (Purple Team / DevSecOps). Elle permet d'auditer instantanément la sécurité des cookies d'une page web, en se concentrant spécifiquement sur l'attribut HttpOnly.

## 🚨 Le Problème

Les cookies de session ou d'authentification qui ne possèdent pas l'attribut HttpOnly sont accessibles via JavaScript. Cela signifie qu'en cas de faille XSS (Cross-Site Scripting) sur le site, un attaquant peut voler ces cookies et usurper l'identité de l'utilisateur.

## ✨ Fonctionnalités

Détection Heuristique : Identifie les cookies critiques (session, token, auth, jwt...) exposés au JavaScript.

Classification des Risques :

🔴 CRITIQUE : Authentification exposée.

🟠 SUSPECT : Cookies de configuration manipulables.

🟡 TRACKING : Pisteurs publicitaires.

Secure by Design :

Masquage des secrets : Les valeurs des cookies sont automatiquement obfusquées (tok••••••) pour éviter les fuites lors de captures d'écran ou de partages.

Sanitization : Protection contre les injections XSS au sein même de l'extension.

Interface STK : Mode sombre contrasté pour une lisibilité optimale lors des audits.

## 📂 Structure du Projet

STK_ExtXSS/

├── manifest.json   # Configuration de l'extension (Manifest V3)

├── popup.html      # Interface utilisateur (Structure)

├── styles.css      # Design System (Thème Sombre/Orange)

├── popup.js        # Logique d'analyse et de classification

└── logoxss.png     # Icône de l'extension


## 🚀 Installation

### Depuis le Store (Utilisateurs)

Installez la version stable et vérifiée directement depuis le store Mozilla :

🔗 https://addons.mozilla.org/fr/firefox/addon/stk-cookie-audit-xss

### Depuis le Code Source (Développeurs)

Clonez ce dépôt ou téléchargez les fichiers.

Ouvrez Firefox et accédez à about:debugging.

Cliquez sur "Ce Firefox" dans le menu latéral.

Cliquez sur "Charger un module complémentaire temporaire...".

Sélectionnez le fichier manifest.json du projet.

## 📖 Utilisation

Naviguez sur le site web que vous souhaitez auditer.

Cliquez sur l'icône STK dans la barre d'outils.

L'extension analyse instantanément les cookies :

Si un panneau ROUGE apparaît : Une faille potentielle d'usurpation de session existe.

Si le panneau est VERT : Aucun cookie sensible n'est exposé au JavaScript.

## 🛠️ Stack Technique

JavaScript (ES6+) : Utilisation de l'API browser.cookies.

CSS3 : Variables CSS et Flexbox pour le layout.

Manifest V3 : Conforme aux derniers standards de sécurité Mozilla (2026+).

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier "LicenseMIT.md" pour plus de détails.
