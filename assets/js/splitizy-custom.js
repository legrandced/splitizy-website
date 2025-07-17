// Splitizy Custom Functions
// Newsletter and Contact forms with reCAPTCHA integration

// Global functions called by reCAPTCHA
function onSubmit(token) {
    const form = document.getElementById('mc-form');
    const email = document.getElementById('mc-email').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    if (!email || email === 'Entrez votre email') {
        showMailchimpMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
    }

    // Afficher l'indicateur de chargement
    showMailchimpMessage('Traitement en cours...', 'loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Traitement en cours... <i class="icofont-spinner-alt-4"></i>';

    const formData = new FormData();
    formData.append('email', email);
    formData.append('g-recaptcha-response', token || '');

    fetch('https://script.google.com/macros/s/AKfycbyi3evGSI4OwhakQnN7xI6HKjACRVayn3U7ANJ4R4X0e2nYXhNwqPpG41P-vMs5LXzh/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes('success')) {
            showMailchimpMessage('Merci ! Vous êtes maintenant inscrit à notre newsletter.', 'success');
            document.getElementById('mc-email').value = 'Entrez votre email';
        } else {
            throw new Error('Réponse inattendue du serveur');
        }
    })
    .catch(error => {
        showMailchimpMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
    })
    .finally(() => {
        // Restaurer le bouton
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

function onContactSubmit(token) {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Récupérer les valeurs des champs
    const name = form.querySelector('input[name="con_name"]').value;
    const email = form.querySelector('input[name="con_email"]').value;
    const subject = form.querySelector('input[name="con_subject"]').value;
    const message = form.querySelector('textarea[name="con_message"]').value;
    
    // Validation côté client
    if (!name || !email || !subject || !message) {
        showContactMessage('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
    }
    
    // Afficher l'indicateur de chargement
    showContactMessage('Traitement en cours...', 'loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Traitement en cours... <i class="icofont-spinner-alt-4"></i>';
    
    // Préparer les données en FormData avec les noms que le script Apps Script attend
    const formData = new FormData();
    formData.append('type', 'contact');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    formData.append('g-recaptcha-response', token || '');

    fetch('https://script.google.com/macros/s/AKfycbyi3evGSI4OwhakQnN7xI6HKjACRVayn3U7ANJ4R4X0e2nYXhNwqPpG41P-vMs5LXzh/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        if (data.includes('success')) {
            showContactMessage('Merci ! Votre message a été envoyé avec succès.', 'success');
            form.reset();
        } else {
            throw new Error('Réponse inattendue du serveur');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showContactMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
    })
    .finally(() => {
        // Restaurer le bouton
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// Helper function to show mailchimp messages
function showMailchimpMessage(message, type) {
    const successDiv = document.querySelector('.mailchimp-success');
    const errorDiv = document.querySelector('.mailchimp-error');
    const submittingDiv = document.querySelector('.mailchimp-submitting');
    
    // Cacher tous les messages d'abord
    if (successDiv) successDiv.style.display = 'none';
    if (errorDiv) errorDiv.style.display = 'none';
    if (submittingDiv) submittingDiv.style.display = 'none';
    
    if (type === 'success' && successDiv) {
        successDiv.innerHTML = message;
        successDiv.style.display = 'block';
    } else if (type === 'error' && errorDiv) {
        errorDiv.innerHTML = message;
        errorDiv.style.display = 'block';
    } else if (type === 'loading') {
        // Utiliser submittingDiv s'il existe, sinon successDiv avec une classe spéciale
        if (submittingDiv) {
            submittingDiv.innerHTML = message;
            submittingDiv.style.display = 'block';
            submittingDiv.style.color = 'var(--splitizy-primary)';
        } else if (successDiv) {
            successDiv.innerHTML = message;
            successDiv.style.display = 'block';
            successDiv.style.color = 'var(--splitizy-primary)';
        }
    }
}

// Helper function to show contact messages
function showContactMessage(message, type) {
    const messageDiv = document.querySelector('.form-messege');
    if (messageDiv) {
        messageDiv.innerHTML = message;
        let className = 'form-messege ';
        if (type === 'success') {
            className += 'alert-success';
        } else if (type === 'error') {
            className += 'alert-danger';
        } else if (type === 'loading') {
            className += 'alert-info';
        }
        messageDiv.className = className;
        messageDiv.style.display = 'block';
    }
}

// Fallback system for when reCAPTCHA doesn't load
function enableFallbackMode() {
    // Convert newsletter button
    const newsletterBtn = document.querySelector('#mc-form button[type="submit"]');
    if (newsletterBtn && newsletterBtn.classList.contains('g-recaptcha')) {
        newsletterBtn.classList.remove('g-recaptcha');
        newsletterBtn.removeAttribute('data-sitekey');
        newsletterBtn.removeAttribute('data-callback');
        newsletterBtn.removeAttribute('data-badge');
        newsletterBtn.removeAttribute('data-size');
        
        newsletterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            onSubmit(null);
        });
    }

    // Convert contact button
    const contactBtn = document.querySelector('#contact-form button[type="submit"]');
    if (contactBtn && contactBtn.classList.contains('g-recaptcha')) {
        contactBtn.classList.remove('g-recaptcha');
        contactBtn.removeAttribute('data-sitekey');
        contactBtn.removeAttribute('data-callback');
        contactBtn.removeAttribute('data-badge');
        contactBtn.removeAttribute('data-size');
        
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
            onContactSubmit(null);
        });
    }
}

// Auto-enable fallback mode if reCAPTCHA doesn't load within 3 seconds
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        if (typeof grecaptcha === 'undefined') {
            enableFallbackMode();
        }
    }, 3000);
    
    // Initialiser le lecteur vidéo YouTube
    initYouTubePlayer();
}); 

// Variables globales pour le lecteur YouTube
let youtubePlayer = null;
let playerReady = false;
let hasPlayed = false;

// Initialisation du lecteur vidéo YouTube
function initYouTubePlayer() {
    const playerContainer = document.getElementById('youtube-player');
    if (!playerContainer) {
        console.log('Conteneur youtube-player non trouvé');
        return;
    }

    // En production, utiliser directement le fallback iframe qui est plus fiable
    // L'API YouTube iframe peut avoir des problèmes avec GitHub Pages et les CSP strictes
    const isProduction = window.location.hostname === 'splitizy.com' || 
                        window.location.hostname.includes('github.io');

    if (isProduction) {
        console.log('Environnement de production détecté, utilisation du fallback iframe optimisé');
        createFallbackPlayer();
        return;
    }

    // Détecter si nous sommes en local
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.protocol === 'file:';

    if (isLocalhost) {
        console.log('Environnement local détecté, utilisation du fallback iframe');
        createFallbackPlayer();
        return;
    }

    // Charger l'API YouTube iframe seulement pour les autres environnements
    if (!window.YT) {
        console.log('Chargement de l\'API YouTube');
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.onerror = function() {
            console.error('Erreur lors du chargement de l\'API YouTube, utilisation du fallback');
            createFallbackPlayer();
        };
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Attendre que l'API soit prête
    window.onYouTubeIframeAPIReady = function() {
        console.log('API YouTube prête');
        createYouTubePlayer();
    };
    
    // Si l'API est déjà chargée
    if (window.YT && window.YT.Player) {
        console.log('API YouTube déjà chargée');
        createYouTubePlayer();
    }

    // Fallback en cas d'échec après 3 secondes (réduit pour une meilleure UX)
    setTimeout(() => {
        if (!playerReady) {
            console.log('Timeout de l\'API YouTube, utilisation du fallback');
            createFallbackPlayer();
        }
    }, 3000);
}

function createFallbackPlayer() {
    const playerContainer = document.getElementById('youtube-player');
    if (!playerContainer) return;

    const videoId = 'AqkZSZJeOMs';
    
    // Obtenir l'origine actuelle pour éviter les erreurs cross-origin
    const currentOrigin = window.location.origin;
    
    // Paramètres YouTube optimisés pour la production
    const youtubeParams = [
        'autoplay=0',
        'mute=1',
        'controls=1',
        'modestbranding=1',
        'rel=0',
        'showinfo=0',
        'fs=1',
        'cc_load_policy=0',
        'iv_load_policy=3',
        'autohide=1',
        'playsinline=1',
        'enablejsapi=1',
        `origin=${encodeURIComponent(currentOrigin)}`
    ].join('&');
    
    // Afficher d'abord un indicateur de chargement
    playerContainer.innerHTML = `
        <div id="video-loading-overlay" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
            z-index: 10;
            transition: opacity 0.3s ease-in-out;
        ">
            <div style="text-align: center;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 15px;
                "></div>
                <p style="margin: 0; font-size: 14px;">Chargement de la vidéo...</p>
            </div>
        </div>
        <iframe 
            id="youtube-fallback-iframe"
            src="https://www.youtube.com/embed/${videoId}?${youtubeParams}" 
            frameborder="0" 
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
            referrerpolicy="strict-origin-when-cross-origin"
            loading="lazy"
            style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; border: none; opacity: 0; transition: opacity 0.3s ease-in-out;"
            onload="
                console.log('Iframe YouTube chargé avec succès');
                setTimeout(() => {
                    this.style.opacity = '1';
                    const overlay = document.getElementById('video-loading-overlay');
                    if (overlay) overlay.style.opacity = '0';
                    setTimeout(() => {
                        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                    }, 300);
                }, 100);
            "
            onerror="console.error('Erreur lors du chargement de l\'iframe YouTube')"
            title="Vidéo de démonstration Splitizy"
        ></iframe>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    console.log('Fallback player créé avec succès');
    
    // Simuler playerReady pour les autres fonctions
    playerReady = true;
    setupIntersectionObserver();
    
    // Ajouter un gestionnaire d'erreur pour l'iframe
    const iframe = playerContainer.querySelector('iframe');
    if (iframe) {
        iframe.addEventListener('error', function(e) {
            console.error('Erreur iframe YouTube:', e);
            // En cas d'erreur, afficher un message d'erreur élégant
            playerContainer.innerHTML = `
                <div style="
                    width: 100%; 
                    height: 100%; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-align: center;
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    box-sizing: border-box;
                ">
                    <div>
                        <h3 style="margin: 0 0 10px 0;">Vidéo temporairement indisponible</h3>
                        <p style="margin: 0; opacity: 0.8;">Veuillez recharger la page ou visiter notre chaîne YouTube</p>
                        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener noreferrer" 
                           style="color: #ffffff; text-decoration: underline; margin-top: 10px; display: inline-block;">
                           Voir sur YouTube
                        </a>
                    </div>
                </div>
            `;
        });
    }
}

function createYouTubePlayer() {
    const playerContainer = document.getElementById('youtube-player');
    if (!playerContainer) {
        console.error('Conteneur youtube-player non trouvé');
        return;
    }
    
    // Afficher l'indicateur de chargement
    playerContainer.innerHTML = '<div class="video-loading">Chargement de la vidéo...</div>';
    
    // Extraire l'ID de la vidéo YouTube
    const videoUrl = 'https://www.youtube.com/watch?v=AqkZSZJeOMs';
    const videoId = extractYouTubeVideoId(videoUrl);
    
    if (!videoId) {
        console.error('ID de vidéo YouTube invalide');
        playerContainer.innerHTML = '<div class="video-loading">Erreur: ID de vidéo invalide</div>';
        return;
    }
    
    console.log('Création du lecteur YouTube avec l\'ID:', videoId);
    
    try {
        // Créer le lecteur YouTube avec configuration améliorée
        youtubePlayer = new YT.Player('youtube-player', {
            height: '360',
            width: '640',
            videoId: videoId,
            host: 'https://www.youtube.com',
            playerVars: {
                autoplay: 0, // Désactivé par défaut, contrôlé par l'intersection observer
                mute: 1, // Muet pour permettre l'autoplay
                controls: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                fs: 1,
                cc_load_policy: 0,
                iv_load_policy: 3,
                autohide: 1,
                playsinline: 1,
                enablejsapi: 1,
                origin: window.location.origin,
                widget_referrer: window.location.origin
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
                onError: onPlayerError
            }
        });
    } catch (error) {
        console.error('Erreur lors de la création du lecteur YouTube:', error);
        createFallbackPlayer();
    }
}

function onPlayerReady(event) {
    playerReady = true;
    console.log('Lecteur YouTube prêt');
    
    // Configurer l'Intersection Observer pour l'autoplay
    setupIntersectionObserver();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
        hasPlayed = true;
        console.log('Vidéo en cours de lecture');
    } else if (event.data === YT.PlayerState.PAUSED) {
        console.log('Vidéo en pause');
    } else if (event.data === YT.PlayerState.ENDED) {
        console.log('Vidéo terminée');
    }
}

function onPlayerError(event) {
    console.error('Erreur du lecteur YouTube:', event.data);
    console.log('Basculement vers le fallback iframe');
    createFallbackPlayer();
}

function setupIntersectionObserver() {
    // Vérifier si l'Intersection Observer est supporté
    if (!window.IntersectionObserver) {
        console.log('Intersection Observer non supporté');
        return;
    }
    
    const playerContainer = document.querySelector('.video-player-container');
    if (!playerContainer) {
        console.log('Conteneur .video-player-container non trouvé');
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log('Intersection Observer - Ratio de visibilité:', entry.intersectionRatio);
            
            if (entry.isIntersecting && playerReady && !hasPlayed) {
                // L'utilisateur peut voir la vidéo et elle n'a pas encore été lue
                console.log('Vidéo visible, tentative de démarrage automatique');
                
                setTimeout(() => {
                    if (youtubePlayer && youtubePlayer.playVideo) {
                        try {
                            youtubePlayer.playVideo();
                            hasPlayed = true;
                            console.log('Lecture automatique lancée (API YouTube)');
                        } catch (error) {
                            console.error('Erreur lors du lancement de la lecture automatique:', error);
                        }
                    } else {
                        // Mode fallback iframe - ne peut pas contrôler l'autoplay via JS
                        // Mais on peut marquer comme "vu" pour éviter les tentatives répétées
                        console.log('Mode fallback iframe - pas d\'autoplay JavaScript disponible');
                        hasPlayed = true; // Éviter les tentatives répétées
                        
                        // Optionnel: ajouter une indication visuelle que la vidéo est prête
                        const iframe = document.getElementById('youtube-fallback-iframe');
                        if (iframe) {
                            iframe.style.opacity = '1';
                            iframe.style.transition = 'opacity 0.3s ease-in-out';
                        }
                    }
                }, 500); // Petit délai pour s'assurer que tout est prêt
            }
        });
    }, {
        threshold: 0.3, // Réduit à 30% pour déclencher plus tôt
        rootMargin: '50px' // Marge pour commencer le chargement un peu avant que la vidéo soit visible
    });
    
    observer.observe(playerContainer);
    console.log('Intersection Observer configuré');
}

function extractYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}