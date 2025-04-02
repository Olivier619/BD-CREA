<script>
    // Simulation de génération d'histoire en français
    // Dans un environnement de production, ceci serait remplacé par l'appel à l'API Transformers.js

    document.addEventListener('DOMContentLoaded', function() {
        // Gestion des onglets
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');

                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                this.classList.add('active');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });

        // Gestion des sessions
        const newSessionBtn = document.getElementById('new-session');
        const saveSessionBtn = document.getElementById('save-session');
        const loadSessionBtn = document.getElementById('load-session');

        newSessionBtn.addEventListener('click', function() {
            if (confirm('Êtes-vous sûr de vouloir créer une nouvelle session ? Toutes les données non sauvegardées seront perdues.')) {
                document.getElementById('keywords').value = '';
                document.getElementById('scenario-content').innerHTML = '<h3>Votre scénario</h3><p>Générez d\'abord un scénario depuis l\'onglet Accueil.</p>';
                document.getElementById('storyboard-content').innerHTML = '<h3>Votre storyboard</h3><p>Générez d\'abord un scénario pour voir le storyboard correspondant.</p>';
                document.getElementById('prompts-content').innerHTML = '<h3>Vos prompts Midjourney</h3><p>Générez d\'abord un scénario pour voir les prompts correspondants.</p>';

                // Activer l'onglet Accueil
                const homeTabBtn = document.querySelector('[data-tab="home"]');
                if (homeTabBtn) {
                     homeTabBtn.click();
                }
            }
        });

        saveSessionBtn.addEventListener('click', function() {
            const sessionData = {
                keywords: document.getElementById('keywords').value,
                scenario: document.getElementById('scenario-content').innerHTML,
                storyboard: document.getElementById('storyboard-content').innerHTML,
                prompts: document.getElementById('prompts-content').innerHTML
            };

            const sessionName = prompt('Donnez un nom à cette session:');
            if (sessionName) {
                try {
                    localStorage.setItem(`bdcreator_session_${sessionName.trim()}`, JSON.stringify(sessionData));
                    alert(`Session "${sessionName}" sauvegardée avec succès!`);
                } catch (e) {
                    console.error("Erreur lors de la sauvegarde de la session:", e);
                    alert("Erreur lors de la sauvegarde de la session. L'espace de stockage est peut-être plein.");
                }
            }
        });

        loadSessionBtn.addEventListener('click', function() {
            const sessions = [];
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('bdcreator_session_')) {
                        sessions.push(key.replace('bdcreator_session_', ''));
                    }
                }
            } catch (e) {
                console.error("Erreur lors de l'accès à localStorage:", e);
                alert("Impossible d'accéder aux sessions sauvegardées. Le stockage local est peut-être désactivé ou inaccessible.");
                return;
            }

            if (sessions.length === 0) {
                alert('Aucune session sauvegardée trouvée.');
                return;
            }

            const sessionName = prompt(`Choisissez une session à charger (${sessions.join(', ')}):`, sessions[0]);
            if (sessionName && sessions.includes(sessionName.trim())) {
                try {
                    const sessionDataString = localStorage.getItem(`bdcreator_session_${sessionName.trim()}`);
                    if (sessionDataString) {
                        const sessionData = JSON.parse(sessionDataString);

                        document.getElementById('keywords').value = sessionData.keywords || ''; // Fallback
                        document.getElementById('scenario-content').innerHTML = sessionData.scenario || '<h3>Votre scénario</h3><p>Erreur lors du chargement du scénario.</p>';
                        document.getElementById('storyboard-content').innerHTML = sessionData.storyboard || '<h3>Votre storyboard</h3><p>Erreur lors du chargement du storyboard.</p>';
                        document.getElementById('prompts-content').innerHTML = sessionData.prompts || '<h3>Vos prompts Midjourney</h3><p>Erreur lors du chargement des prompts.</p>';

                        alert(`Session "${sessionName}" chargée avec succès!`);
                         // Optionnel: aller sur l'onglet scénario si du contenu existe
                         if(sessionData.scenario && !sessionData.scenario.includes("Générez d'abord")) {
                             const scenarioTabBtn = document.querySelector('[data-tab="scenario"]');
                              if (scenarioTabBtn) {
                                 scenarioTabBtn.click();
                              }
                         }

                    } else {
                         alert(`Données non trouvées pour la session "${sessionName}".`);
                    }
                } catch (e) {
                    console.error("Erreur lors du chargement ou du parsing de la session:", e);
                    alert(`Erreur lors du chargement de la session "${sessionName}". Les données sont peut-être corrompues.`);
                }
            } else if (sessionName) {
                 alert(`La session "${sessionName}" n'existe pas.`);
            }
        });

        // Correction du lien "Create my website"
        const createWebsiteBtn = document.getElementById('create-website-btn');
        if (createWebsiteBtn) {
            createWebsiteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                alert('Cette fonctionnalité sera bientôt disponible!');
            });
        }

        // Génération de scénario
        const generateScenarioBtn = document.getElementById('generate-scenario');
        const loadingIndicator = document.getElementById('loading-indicator');
        const keywordsInput = document.getElementById('keywords');
        const scenarioContent = document.getElementById('scenario-content');
        const storyboardContent = document.getElementById('storyboard-content');
        const promptsContent = document.getElementById('prompts-content');

        if (generateScenarioBtn && loadingIndicator && keywordsInput && scenarioContent && storyboardContent && promptsContent) {
            generateScenarioBtn.addEventListener('click', function() {
                const keywords = keywordsInput.value.trim();
                if (!keywords) {
                    alert('Veuillez entrer des mots-clés pour générer un scénario.');
                    return;
                }

                // Afficher l'indicateur de chargement
                loadingIndicator.style.display = 'block';
                generateScenarioBtn.disabled = true; // Désactiver le bouton pendant la génération

                // Simuler un délai de traitement
                setTimeout(() => {
                    try {
                        // Générer le contenu
                        const content = generateStory(keywords);

                        // Mettre à jour les onglets avec le contenu généré
                        scenarioContent.innerHTML = content.scenario;
                        storyboardContent.innerHTML = content.storyboard;
                        promptsContent.innerHTML = content.prompts;

                        // Passer à l'onglet Scénario
                         const scenarioTabBtn = document.querySelector('[data-tab="scenario"]');
                          if (scenarioTabBtn) {
                             scenarioTabBtn.click();
                          }

                    } catch (error) {
                        console.error("Erreur lors de la génération de l'histoire:", error);
                        alert("Une erreur est survenue lors de la génération du contenu.");
                         scenarioContent.innerHTML = '<h3>Erreur</h3><p>Impossible de générer le scénario.</p>';
                         storyboardContent.innerHTML = '<h3>Erreur</h3><p>Impossible de générer le storyboard.</p>';
                         promptsContent.innerHTML = '<h3>Erreur</h3><p>Impossible de générer les prompts.</p>';
                    } finally {
                         // Masquer l'indicateur de chargement et réactiver le bouton
                         loadingIndicator.style.display = 'none';
                         generateScenarioBtn.disabled = false;
                    }

                }, 2000); // Délai de simulation de 2 secondes
            });
        } else {
            console.error("Un ou plusieurs éléments nécessaires à la génération de scénario sont manquants.");
        }

        // --- Fonctions de génération (inchangées, car elles sont le cœur de la simulation) ---

        // Fonction de génération d'histoire
        function generateStory(keywords) {
            const randomSeed = Date.now() + Math.floor(Math.random() * 1000000);
            const keywordsList = keywords.split(',').map(k => k.trim()).filter(k => k !== ''); // Filtrer les mots-clés vides
             if (keywordsList.length === 0) {
                 keywordsList.push("aventure"); // Mot-clé par défaut si aucun fourni
             }

            const titles = [
                `Les Chroniques de ${getRandomElement(keywordsList, randomSeed)}`, `Le Secret de ${getRandomElement(keywordsList, randomSeed)}`,
                `${getRandomElement(keywordsList, randomSeed)} : Une Aventure Extraordinaire`, `La Quête de ${getRandomElement(keywordsList, randomSeed)}`,
                `${getRandomElement(keywordsList, randomSeed)} et le Mystère de ${getRandomElement(keywordsList, randomSeed + 1)}`, // +1 pour éviter répétition immédiate si 1 seul keyword
                `L'Odyssée de ${getRandomElement(keywordsList, randomSeed)}`, `Le Monde de ${getRandomElement(keywordsList, randomSeed)}`
            ];
            const title = getRandomElement(titles, randomSeed);

            const characterTypes = ['un héros courageux', 'une héroïne intrépide', 'un scientifique brillant', 'une détective perspicace', 'un enfant curieux', 'une artiste talentueuse', 'un voyageur du temps', 'une guerrière redoutable', 'un magicien puissant', 'une exploratrice audacieuse', 'un robot sensible', 'une créature mystérieuse'];
            const mainCharacter = getRandomElement(characterTypes, randomSeed);
            const secondaryCharacter = getRandomElement(characterTypes, randomSeed + 1);

            const locations = ['une cité futuriste', 'un village médiéval', 'une forêt enchantée', 'une planète lointaine', 'un laboratoire secret', 'une école de magie', 'un monde parallèle', 'une métropole grouillante', 'un désert infini', 'une île mystérieuse', 'un vaisseau spatial', 'un royaume oublié'];
            const mainLocation = getRandomElement(locations, randomSeed + 2);

            const themes = ['l\'amitié', 'la trahison', 'la rédemption', 'la découverte de soi', 'le courage face à l\'adversité', 'la lutte contre l\'injustice', 'la préservation de la nature', 'l\'exploration de l\'inconnu', 'la réconciliation', 'le pouvoir de l\'imagination', 'la famille', 'le dépassement de soi'];
            const mainTheme = getRandomElement(themes, randomSeed + 3);
            const secondaryTheme = getRandomElement(themes, randomSeed + 4);

            const introduction = `
            <div class="scenario-section">
                <h3>Introduction</h3>
                <p>Dans ${mainLocation} où ${getRandomElement(keywordsList, randomSeed)} et ${getRandomElement(keywordsList, randomSeed + 5)} se côtoient, nous suivons l'histoire de ${mainCharacter} qui va vivre une aventure extraordinaire. Cette histoire explore les thèmes de ${mainTheme} et ${secondaryTheme}, tout en nous plongeant dans un univers où l'imagination n'a pas de limites.</p>
                <p>Notre récit commence par une journée qui semblait ordinaire, mais qui allait changer à jamais le destin de notre protagoniste. Un événement inattendu lié à ${getRandomElement(keywordsList, randomSeed + 6)} bouleverse sa vie paisible, le forçant à quitter sa zone de confort pour se lancer dans une quête périlleuse.</p>
            </div>`;

            const mainIdea = `
            <div class="scenario-section">
                <h3>Développement de l'idée principale</h3>
                <p>${title} raconte l'histoire de ${mainCharacter} qui vit dans ${mainLocation}. Un jour, un événement extraordinaire impliquant ${getRandomElement(keywordsList, randomSeed + 7)} vient perturber sa vie quotidienne. Notre protagoniste découvre qu'il possède un lien spécial avec ${getRandomElement(keywordsList, randomSeed + 8)}, ce qui le place au centre d'un conflit plus grand que lui.</p>
                <p>Accompagné de ${secondaryCharacter}, il devra surmonter de nombreux obstacles, affronter ses peurs les plus profondes et découvrir la vérité sur ${getRandomElement(keywordsList, randomSeed + 9)}. Au cours de son voyage, il explorera des lieux fascinants, rencontrera des personnages hauts en couleur et apprendra d'importantes leçons sur ${mainTheme}.</p>
                <p>Cette histoire explore comment les choix que nous faisons définissent qui nous sommes, et comment le courage peut naître dans les moments les plus inattendus. Elle nous rappelle que même dans les situations les plus désespérées, l'espoir et la persévérance peuvent triompher.</p>
            </div>`;

            const synopsis = `
            <div class="scenario-section">
                <h3>Synopsis</h3>
                <p>Dans un monde où ${getRandomElement(keywordsList, randomSeed + 10)} est omniprésent, ${mainCharacter} mène une existence tranquille jusqu'au jour où un mystérieux artefact lié à ${getRandomElement(keywordsList, randomSeed + 11)} entre en sa possession. Cet objet attire l'attention de forces obscures qui convoitent son pouvoir pour des raisons néfastes.</p>
                <p>Contraint de fuir, notre héros rencontre ${secondaryCharacter} qui détient des connaissances cruciales sur l'artefact et son histoire. Ensemble, ils entreprennent un périple à travers ${mainLocation} et au-delà, poursuivis par un antagoniste redoutable déterminé à s'emparer de l'artefact à tout prix.</p>
                <p>Au fil de leur voyage, ils découvrent que l'artefact est en réalité une clé permettant d'accéder à un pouvoir ancien lié à ${getRandomElement(keywordsList, randomSeed + 12)}. Ils comprennent également que leur rencontre n'est pas due au hasard, mais fait partie d'une prophétie ancienne qui prédit que seule leur alliance peut sauver le monde d'une catastrophe imminente.</p>
                <p>Après de nombreuses épreuves qui mettent à l'épreuve leur courage et leur amitié, ils parviennent à déjouer les plans du villain et à utiliser l'artefact pour restaurer l'équilibre. Cependant, cette victoire a un prix, et notre héros doit faire un choix déchirant qui changera à jamais le cours de sa vie.</p>
            </div>`;

            const chapters = [];
            const numChapters = 3 + Math.floor(Math.abs(Math.sin(randomSeed + 20)) * 10000) % 3; // Entre 3 et 5 chapitres

            for (let i = 1; i <= numChapters; i++) {
                const chapterEvents = [
                    `la découverte d'un secret lié à ${getRandomElement(keywordsList, randomSeed + i * 10)}`, `une confrontation avec un adversaire qui maîtrise ${getRandomElement(keywordsList, randomSeed + i * 10 + 1)}`,
                    `l'exploration d'un lieu mystérieux où ${getRandomElement(keywordsList, randomSeed + i * 10 + 2)} règne en maître`, `une alliance inattendue avec un personnage lié à ${getRandomElement(keywordsList, randomSeed + i * 10 + 3)}`,
                    `la résolution d'une énigme ancienne concernant ${getRandomElement(keywordsList, randomSeed + i * 10 + 4)}`, `un sacrifice nécessaire pour protéger ${getRandomElement(keywordsList, randomSeed + i * 10 + 5)}`
                ];
                const chapterLocations = ['un temple abandonné', 'une cité souterraine', 'une forteresse imprenable', 'un marché grouillant de vie', 'un palais somptueux', 'une bibliothèque ancienne', 'un laboratoire secret', 'une arène de combat', 'un navire volant', 'une prison de haute sécurité', 'un jardin enchanté', 'une tour qui touche les nuages'];
                const chapterEvent = getRandomElement(chapterEvents, randomSeed + i * 20);
                const chapterLocation = getRandomElement(chapterLocations, randomSeed + i * 20 + 5);

                const chapter = `
                <div class="scenario-chapter">
                    <h4>Chapitre ${i}: ${getRandomChapterTitle(keywordsList, randomSeed + i * 30)}</h4>
                    <p><strong>Synopsis:</strong> Ce chapitre se concentre sur ${chapterEvent}. Nos héros se retrouvent dans ${chapterLocation} où ils doivent faire face à de nouveaux défis et découvrir des indices cruciaux pour leur quête.</p>
                    <p><strong>Séquencier:</strong> Le chapitre commence par l'arrivée des protagonistes à ${chapterLocation}, où ils sont immédiatement confrontés à un obstacle inattendu. Après avoir surmonté cette première difficulté, ils explorent les lieux et découvrent des informations importantes. Une rencontre avec un personnage mystérieux leur révèle de nouvelles perspectives sur leur quête. Le chapitre culmine avec ${chapterEvent}, qui change leur compréhension de la situation et les pousse à prendre une décision importante pour la suite de leur aventure.</p>
                    <p><strong>Découpage:</strong> Ce chapitre se déroule sur 6 pages, avec une moyenne de 5 cases par page. Les moments clés incluent l'arrivée spectaculaire à ${chapterLocation} (page 1), la découverte d'indices cachés (page 3), une confrontation tendue avec un adversaire ou un allié potentiel (page 4-5), et une révélation surprenante qui conclut le chapitre (page 6).</p>
                    <p><strong>Dialogues clés:</strong></p>
                    <ul>
                        <li>"Je n'aurais jamais cru que ${getRandomElement(keywordsList, randomSeed + i * 40)} puisse être lié à tout ceci..."</li>
                        <li>"La prophétie parlait de ${getRandomElement(keywordsList, randomSeed + i * 40 + 1)}, mais pas de ce que nous venons de découvrir!"</li>
                        <li>"Si nous ne trouvons pas ${getRandomElement(keywordsList, randomSeed + i * 40 + 2)} avant le prochain cycle, tout sera perdu."</li>
                        <li>"Je commence à croire que notre rencontre n'était pas un hasard, mais plutôt le début d'une histoire écrite bien avant notre naissance."</li>
                    </ul>
                </div>`;
                chapters.push(chapter);
            }

            const conclusion = `
            <div class="scenario-section">
                <h3>Conclusion</h3>
                <p>Au terme de cette aventure extraordinaire, notre héros a non seulement accompli sa quête initiale, mais a également découvert des vérités profondes sur lui-même et sur le monde qui l'entoure. La confrontation finale avec l'antagoniste révèle que le véritable enjeu n'était pas tant l'artefact lui-même, mais ce qu'il représente: le pouvoir de ${getRandomElement(keywordsList, randomSeed + 100)}.</p>
                <p>Après un combat épique où toutes les forces en présence donnent leur maximum, notre héros parvient à triompher grâce à sa compréhension nouvellement acquise de ${getRandomElement(keywordsList, randomSeed + 101)} et à l'aide précieuse de ses alliés. L'équilibre est restauré, mais le monde ne sera plus jamais le même.</p>
                <p>Dans les dernières pages, nous voyons notre protagoniste contemplant l'horizon, transformé par son voyage. Il a appris que ${mainTheme} et ${secondaryTheme} sont des forces qui peuvent changer le monde, et que chaque individu a le pouvoir de faire une différence. L'histoire se termine sur une note d'espoir, suggérant que de nouvelles aventures attendent nos héros, mais qu'ils sont désormais prêts à y faire face ensemble.</p>
                <p>Cette conclusion rappelle au lecteur que les véritables trésors ne sont pas les objets que nous cherchons, mais les leçons que nous apprenons et les liens que nous tissons en chemin. ${title} est ainsi une célébration de l'esprit humain et de sa capacité à surmonter les obstacles les plus insurmontables.</p>
            </div>`;

            const fullScenario = `
            <h2>Scénario: ${title}</h2>
            ${introduction}
            ${mainIdea}
            ${synopsis}
             <div class="scenario-section"><h3>Chapitres</h3>${chapters.join('')}</div>
            ${conclusion}`;

            const storyboard = generateStoryboard(title, keywordsList, randomSeed);
            const prompts = generatePrompts(title, keywordsList, randomSeed);

            return { scenario: fullScenario, storyboard: storyboard, prompts: prompts };
        }

        // Fonction pour générer un titre de chapitre aléatoire
        function getRandomChapterTitle(keywords, seed) {
            const titles = [
                `La Découverte de ${getRandomElement(keywords, seed)}`, `Le Secret de ${getRandomElement(keywords, seed + 1)}`, `La Confrontation`, `L'Alliance Inattendue`,
                `La Trahison`, `La Révélation`, `Le Voyage vers ${getRandomElement(keywords, seed + 2)}`, `L'Épreuve du ${getRandomElement(keywords, seed + 3)}`,
                `La Prophétie Accomplie`, `Le Choix Impossible`, `La Dernière Chance`, `L'Héritage de ${getRandomElement(keywords, seed + 4)}`
            ];
            return getRandomElement(titles, seed);
        }

        // Fonction pour générer le storyboard
        function generateStoryboard(title, keywords, seed) {
            let storyboard = `<h2>Storyboard pour "${title}"</h2>`;
            const numPages = 6 + Math.floor(Math.abs(Math.sin(seed + 30)) * 10000) % 3; // Entre 6 et 8 pages

            for (let i = 1; i <= numPages; i++) {
                const numCases = 3 + Math.floor(Math.abs(Math.sin(seed + i * 50)) * 10000) % 5; // Entre 3 et 7 cases par page
                storyboard += `
                <div class="storyboard-page">
                    <h3>Page ${i}</h3>
                    <p><strong>Description générale:</strong> ${getRandomPageDescription(keywords, seed + i * 100)}</p>
                    <p><strong>Ambiance:</strong> ${getRandomAmbiance(seed + i * 100 + 50)}</p>
                    <h4>Cases:</h4>
                    <ol>`;
                for (let j = 1; j <= numCases; j++) {
                    storyboard += `
                        <li>
                            <p><strong>Case ${j}:</strong> ${getRandomCaseDescription(keywords, seed + i * 1000 + j * 10)}</p>
                            <p><strong>Personnages / Action:</strong> ${getRandomCharacterDescription(seed + i * 1000 + j * 10 + 5)}</p>
                            <p><strong>Dialogue / Texte:</strong> "${getRandomDialogue(keywords, seed + i * 1000 + j * 10 + 7)}"</p>
                        </li>`;
                }
                storyboard += `</ol></div>`;
            }
            return storyboard;
        }

        // Fonction pour générer les prompts Midjourney
        function generatePrompts(title, keywords, seed) {
            let promptsHTML = `<h2>Prompts Midjourney pour "${title}"</h2>`;
            const numPrompts = 5 + Math.floor(Math.abs(Math.sin(seed + 40)) * 10000) % 4; // Entre 5 et 8 prompts

            for (let i = 1; i <= numPrompts; i++) {
                const promptKeyword = getRandomElement(keywords, seed + i * 300);
                const promptScene = getRandomPromptScene(keywords, seed + i * 200);
                const promptStyle = getRandomPromptStyle(seed + i * 200 + 50);
                const promptMood = getRandomPromptMood(seed + i * 200 + 100);
                const englishPrompt = `${promptScene}, ${promptStyle}, ${promptMood}, detailed comic panel, high quality, 4k --ar 16:9`; // Ajout style et aspect ratio

                promptsHTML += `
                <div class="prompt-item">
                    <h3>Prompt ${i}: Scène avec "${promptKeyword}"</h3>
                    <p><strong>Description (FR):</strong> Une illustration montrant ${promptScene}, avec un style ${promptStyle} et une ambiance ${promptMood}.</p>
                    <p><strong>Prompt Midjourney (EN):</strong></p>
                    <div class="prompt-code">
                        <pre>${escapeHtml(englishPrompt)}</pre>
                        <button class="copy-prompt-btn" title="Copier le prompt">Copier</button>
                    </div>
                </div>`;
            }
             // Ajouter le gestionnaire d'événements pour les boutons Copier après avoir généré les prompts
             setTimeout(attachCopyPromptHandlers, 0);
            return promptsHTML;
        }

         // Fonction pour attacher les gestionnaires d'événements aux boutons "Copier"
         function attachCopyPromptHandlers() {
            document.querySelectorAll('.copy-prompt-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const preElement = this.previousElementSibling; // Sélectionne l'élément <pre> juste avant le bouton
                    const promptText = preElement.textContent;
                    navigator.clipboard.writeText(promptText).then(() => {
                        const originalText = this.textContent;
                         this.textContent = 'Copié!';
                         setTimeout(() => { this.textContent = originalText; }, 1500); // Réinitialise le texte après 1.5s
                    }).catch(err => {
                        console.error('Erreur lors de la copie du prompt: ', err);
                        alert('Erreur lors de la copie. Veuillez copier manuellement.');
                    });
                });
            });
         }

        // Fonctions utilitaires pour la génération aléatoire
        function getRandomElement(array, seed) {
             if (!array || array.length === 0) return ""; // Sécurité
             // Utilisation d'une fonction de hachage simple pour une meilleure distribution basée sur la seed
             let hash = seed;
             for (let i = 0; i < array.join('').length; i++) { // Utilise la longueur totale des chaînes pour varier
                 hash = (hash << 5) - hash + array.join('').charCodeAt(i);
                 hash |= 0; // Convertit en entier 32 bits
             }
             const index = Math.abs(hash) % array.length;
             return array[index];
        }

        function getRandomPageDescription(keywords, seed) {
            const descriptions = [ /* ... Contenu inchangé ... */ ];
            return getRandomElement(descriptions, seed);
        }
        // ... autres fonctions getRandom... (contenu inchangé) ...
         function getRandomAmbiance(seed) { /* ... Contenu inchangé ... */ }
         function getRandomCaseDescription(keywords, seed) { /* ... Contenu inchangé ... */ }
         function getRandomCharacterDescription(seed) { /* ... Contenu inchangé ... */ }
         function getRandomDialogue(keywords, seed) { /* ... Contenu inchangé ... */ }
         function getRandomPromptScene(keywords, seed) { /* ... Contenu inchangé ... */ }
         function getRandomPromptStyle(seed) { /* ... Contenu inchangé ... */ }
         function getRandomPromptMood(seed) { /* ... Contenu inchangé ... */ }

        // Fonction simple de traduction (simulation) - Inchangée
        function translateToEnglish(word) {
             const translations = { /* ... Contenu inchangé ... */ };
            return translations[word.toLowerCase().trim()] || word;
        }

         // Fonction pour échapper le HTML (sécurité simple pour l'affichage dans <pre>)
         function escapeHtml(unsafe) {
            return unsafe
                 .replace(/&/g, "&")
                 .replace(/</g, "<")
                 .replace(/>/g, ">")
                 .replace(/"/g, """)
                 .replace(/'/g, "'");
         }

    });
</script>
