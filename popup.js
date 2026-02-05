document.addEventListener('DOMContentLoaded', async () => {
    const listContainer = document.getElementById('cookies-list');
    const loadingState = document.getElementById('loading');
    const emptyState = document.getElementById('empty-state');
    const countDisplay = document.getElementById('count-display');

    // --- REGEX DE CLASSIFICATION ---
    
    // 1. CRITIQUE : Authentification explicite
    const REGEX_CRITICAL = /session|sess|token|auth|key|pass|login|user|uid|account|admin|bearer|jwt|connect\.sid/i;
    
    // 2. TRACKING : Pubs, analytics connus
    const REGEX_TRACKING = /_ga|_gid|_fbp|_gcl|utm_|ads|track|pixel|stats|mixpanel|optimiza/i;

    // Fonction pour déterminer le niveau de risque
    function classifyCookie(cookie) {
        // Si HttpOnly est TRUE, le cookie est sécurisé au niveau JS -> On l'ignore
        if (cookie.httpOnly) return null;

        const name = cookie.name;

        // Ordre de priorité : Tracking d'abord pour filtrer le bruit, puis Critique
        
        if (REGEX_TRACKING.test(name)) {
            return { level: 'tracking', label: 'TRACKING / PUB', colorClass: 'level-tracking' };
        }
        
        if (REGEX_CRITICAL.test(name)) {
            return { level: 'critical', label: 'EXPOSÉ (CRITIQUE)', colorClass: 'level-critical' };
        }

        // Si ce n'est ni tracking connu, ni auth connu, c'est SUSPECT (ex: "settings", "preference", "app_data")
        return { level: 'suspect', label: 'SUSPECT (CONFIG)', colorClass: 'level-suspect' };
    }

    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const activeTab = tabs[0];

        if (!activeTab || !activeTab.url.startsWith('http')) {
            loadingState.textContent = "URL NON SUPPORTÉE";
            return;
        }

        const cookies = await browser.cookies.getAll({ url: activeTab.url });
        loadingState.classList.add('hidden');

        // On analyse tous les cookies
        let vulnerabilities = [];

        cookies.forEach(cookie => {
            const classification = classifyCookie(cookie);
            if (classification) {
                vulnerabilities.push({ ...cookie, ...classification });
            }
        });

        // TRIER : Critiques en haut, puis Suspects, puis Tracking
        const priorityOrder = { 'critical': 1, 'suspect': 2, 'tracking': 3 };
        vulnerabilities.sort((a, b) => priorityOrder[a.level] - priorityOrder[b.level]);

        if (vulnerabilities.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        // Mise à jour du compteur
        countDisplay.textContent = `${vulnerabilities.length} COOKIES ACCESSIBLES JS`;

        // Génération des cartes
        listContainer.classList.remove('hidden');
        
        vulnerabilities.forEach(item => {
            const card = document.createElement('div');
            card.className = `cookie-card ${item.colorClass}`;

            // Entête : Nom + Badge
            const header = document.createElement('div');
            header.className = 'header-row';
            
            const nameEl = document.createElement('div');
            nameEl.className = 'domain-name';
            nameEl.textContent = item.name;

            const badgeEl = document.createElement('div');
            badgeEl.className = 'badge';
            badgeEl.textContent = item.label;

            header.appendChild(nameEl);
            header.appendChild(badgeEl);

            // Valeur masquée
            const details = document.createElement('div');
            details.className = 'cookie-detail';
            // Masquage sécurisé : 3 chars + étoiles
            const safeVal = item.value.length > 3 ? item.value.substring(0, 3) + '••••••' : '••••••';
            details.textContent = `${safeVal} (${item.domain})`;

            card.appendChild(header);
            card.appendChild(details);
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        loadingState.textContent = "ERREUR SCAN";
    }
});