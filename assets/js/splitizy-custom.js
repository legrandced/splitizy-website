// Splitizy Custom Functions
// Newsletter and Contact forms with reCAPTCHA integration

// Texte traduit d'un message de formulaire (bloc "forms" de translations/*.json, exposé par i18n.js
// via window.splitizyI18n), avec repli en français si les traductions ne sont pas chargées.
function formText(key, fallback) {
    const forms = window.splitizyI18n && window.splitizyI18n.translations && window.splitizyI18n.translations.forms;
    return (forms && forms[key]) || fallback;
}

// Global functions called by reCAPTCHA
function onSubmit(token) {
    const form = document.getElementById('mc-form');
    const emailInput = document.getElementById('mc-email');
    const email = emailInput.value.trim();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Adresse vide ou invalide (le champ n'a plus de valeur pré-remplie : seul le placeholder est affiché)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMailchimpMessage(formText('newsletterInvalidEmail', 'Veuillez entrer une adresse email valide.'), 'error');
        return;
    }

    // Afficher l'indicateur de chargement
    const processingText = formText('processing', 'Traitement en cours...');
    showMailchimpMessage(processingText, 'loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = processingText + ' <i class="icofont-spinner-alt-4"></i>';

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
            showMailchimpMessage(formText('newsletterSuccess', 'Merci ! Vous êtes maintenant inscrit à notre newsletter.'), 'success');
            emailInput.value = '';
        } else {
            throw new Error('Réponse inattendue du serveur');
        }
    })
    .catch(error => {
        showMailchimpMessage(formText('error', 'Une erreur est survenue. Veuillez réessayer.'), 'error');
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
        showContactMessage(formText('contactRequired', 'Veuillez remplir tous les champs obligatoires.'), 'error');
        return;
    }
    
    // Afficher l'indicateur de chargement
    const processingText = formText('processing', 'Traitement en cours...');
    showContactMessage(processingText, 'loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = processingText + ' <i class="icofont-spinner-alt-4"></i>';
    
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
            showContactMessage(formText('contactSuccess', 'Merci ! Votre message a été envoyé avec succès.'), 'success');
            form.reset();
        } else {
            throw new Error('Réponse inattendue du serveur');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        showContactMessage(formText('error', 'Une erreur est survenue. Veuillez réessayer.'), 'error');
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

// ---------------------------------------------------------------------------------------------------------
// reCAPTCHA invisible chargé À LA DEMANDE
// Le script de Google (~350 Ko, JavaScript tiers) n'est plus chargé avec la page : il l'est dès que le visiteur
// s'approche d'un formulaire (focus, survol, toucher, ou défilement jusqu'au formulaire) ou clique sur « Envoyer ».
// Les boutons gardent leurs attributs data-sitekey / data-callback / data-badge / data-size : le rendu est fait
// ici de manière explicite (render=explicit) une fois l'API disponible.
// ---------------------------------------------------------------------------------------------------------
const RECAPTCHA_API_URL = 'https://www.google.com/recaptcha/api.js?onload=splitizyRecaptchaReady&render=explicit';
const RECAPTCHA_TIMEOUT_MS = 10000;
let recaptchaPromise = null;
let recaptchaRendered = false;

// Affiche (rend) le widget invisible sur chaque bouton « .g-recaptcha » de la page
function renderRecaptchaButtons() {
    document.querySelectorAll('button.g-recaptcha[data-sitekey]').forEach(button => {
        grecaptcha.render(button, {
            sitekey: button.dataset.sitekey,
            callback: window[button.dataset.callback],
            size: button.dataset.size || 'invisible',
            badge: button.dataset.badge || 'bottomleft'
        });
    });
}

// Charge l'API reCAPTCHA une seule fois. La promesse est toujours résolue (jamais rejetée) :
// `recaptchaRendered` indique ensuite si reCAPTCHA est utilisable (sinon : bloqueur de publicités, réseau, délai dépassé).
function loadRecaptcha() {
    if (recaptchaPromise) return recaptchaPromise;

    recaptchaPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('délai dépassé')), RECAPTCHA_TIMEOUT_MS);

        window.splitizyRecaptchaReady = function () {
            clearTimeout(timer);
            try {
                renderRecaptchaButtons();
                recaptchaRendered = true;
                resolve();
            } catch (error) {
                reject(error);
            }
        };

        const script = document.createElement('script');
        script.src = RECAPTCHA_API_URL;
        script.async = true;
        script.defer = true;
        script.onerror = function () {
            clearTimeout(timer);
            reject(new Error('chargement impossible'));
        };
        document.head.appendChild(script);
    }).catch(error => {
        console.warn('reCAPTCHA indisponible, envoi sans vérification côté navigateur :', error.message);
    });

    return recaptchaPromise;
}

// Mode de secours historique : si reCAPTCHA ne peut pas être chargé, on appelle directement le callback sans jeton
// (la décision finale revient au script Google Apps Script côté serveur).
function submitWithoutRecaptcha(button) {
    const callback = window[button.dataset.callback];
    if (typeof callback === 'function') {
        callback(null);
    }
}

// Clic sur « Envoyer » : tant que reCAPTCHA n'est pas prêt, on met le clic en attente, on charge l'API,
// puis on rejoue le clic (ou on bascule sur le mode de secours si le chargement échoue).
function handleRecaptchaButtonClick(event) {
    if (recaptchaRendered) return; // reCAPTCHA a pris le relais : son propre écouteur lance la vérification

    event.preventDefault();
    event.stopImmediatePropagation();

    const button = event.currentTarget;
    if (button.dataset.captchaPending) return;
    button.dataset.captchaPending = '1';

    loadRecaptcha().then(() => {
        delete button.dataset.captchaPending;
        if (recaptchaRendered) {
            button.click();
        } else {
            submitWithoutRecaptcha(button);
        }
    });
}

function initRecaptchaLazyLoad() {
    const buttons = document.querySelectorAll('button.g-recaptcha[data-sitekey]');
    if (buttons.length === 0) return;

    const forms = new Set();
    buttons.forEach(button => {
        button.addEventListener('click', handleRecaptchaButtonClick);
        const form = button.closest('form');
        if (form) forms.add(form);
    });

    const start = () => { loadRecaptcha(); };
    forms.forEach(form => {
        ['focusin', 'pointerenter', 'touchstart'].forEach(eventName => {
            form.addEventListener(eventName, start, { once: true, passive: true });
        });
    });

    // Formulaire proche de la zone visible (ex. newsletter en bas de page) : on précharge un peu avant
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                observer.disconnect();
                start();
            }
        }, { rootMargin: '200px' });
        forms.forEach(form => observer.observe(form));
    }
}

// ---------------------------------------------------------------------------------------------------------
// Fonds d'image lourds situés loin sous le pli (bandeau « Répartition », bandeau newsletter, ≈ 0,9 Mo en qualité
// d'origine) : ils ne sont plus téléchargés au chargement de la page mais quand l'élément s'approche de l'écran.
// Mêmes fichiers, même qualité : seul le moment du téléchargement change. Le HTML porte l'URL française dans
// `data-bg-lazy` ; en EN/NL, i18n.js applique la version localisée via la classe `.bg-loaded`.
// ---------------------------------------------------------------------------------------------------------
function initLazyBackgrounds() {
    const targets = document.querySelectorAll('[data-bg-lazy]');
    if (targets.length === 0) return;

    const load = (element) => {
        element.style.backgroundImage = `url('${element.getAttribute('data-bg-lazy')}')`;
        element.classList.add('bg-loaded');
    };

    if (!('IntersectionObserver' in window)) {
        targets.forEach(load);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                load(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '600px 0px' });
    targets.forEach((element) => observer.observe(element));
}

// Images « différées » : <img src="(pixel transparent)" data-src="vraie-image.webp" width height>. L'URL réelle n'est
// utilisée que lorsque l'image s'approche de l'écran (le navigateur ne la juge « proche » qu'à ~1 250 px avec
// loading="lazy", ce qui la télécharge dès l'ouverture de la page). Les dimensions width/height réservent la place
// (pas de décalage de mise en page) ; un <noscript> fournit l'image sans JavaScript.
function initLazyImages() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    const load = (img) => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
    };

    if (!('IntersectionObserver' in window)) {
        images.forEach(load);
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                load(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '100px 0px' });
    images.forEach((img) => observer.observe(img));
}
document.addEventListener('DOMContentLoaded', function() {
    initLazyBackgrounds();
    initLazyImages();
    initRecaptchaLazyLoad();
    initYouTubePlayer();
    initTeamProfileSelector();
    initStoreLinks();
});

// Boutons « Télécharger / Essayer l'app / C'est parti ! » de l'accueil (attribut data-store-cta) :
// ils ouvrent le store correspondant à l'appareil (Google Play sur Android, App Store sur iOS).
// Par défaut (desktop, ou JavaScript désactivé) ils font défiler jusqu'à la section #download,
// qui présente les deux stores.
function initStoreLinks() {
    const links = document.querySelectorAll('[data-store-cta]');
    if (links.length === 0) return;

    const userAgent = navigator.userAgent || navigator.vendor || window.opera || '';
    const isAndroid = /android/i.test(userAgent);
    const isIos = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    if (!isAndroid && !isIos) return;

    const storeSelector = isAndroid ? 'a[href*="play.google.com"]' : 'a[href*="apps.apple.com"]';
    const storeLink = document.querySelector(storeSelector + ':not([data-store-cta])');
    if (!storeLink) return;

    links.forEach(link => {
        link.setAttribute('href', storeLink.getAttribute('href'));
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

// ---------------------------------------------------------------------------------------------------------
// Vidéo YouTube : « façade ». La page affiche une affiche locale (WebP) et un bouton de lecture ; l'iframe YouTube
// (plusieurs centaines de Ko de JavaScript tiers) n'est créée qu'au clic. Avant cela : aucune requête vers YouTube.
// Le HTML (index.html) contient déjà <button class="video-facade"> dans #youtube-player.
// ---------------------------------------------------------------------------------------------------------
const YOUTUBE_VIDEO_ID = 'AqkZSZJeOMs';

// Libellé d'accessibilité traduit (clé `a11y.*` de translations/*.json), avec repli en français
function a11yText(key, fallback) {
    const a11y = window.splitizyI18n && window.splitizyI18n.translations && window.splitizyI18n.translations.a11y;
    return (a11y && a11y[key]) || fallback;
}

function initYouTubePlayer() {
    const container = document.getElementById('youtube-player');
    if (!container) return;

    const facade = container.querySelector('.video-facade');
    if (!facade) return;

    // Au survol / focus, on ouvre à l'avance la connexion vers YouTube pour que la lecture démarre plus vite
    const warmUp = () => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = 'https://www.youtube-nocookie.com';
        document.head.appendChild(link);
    };
    facade.addEventListener('pointerenter', warmUp, { once: true, passive: true });
    facade.addEventListener('focus', warmUp, { once: true });

    facade.addEventListener('click', () => playYouTubeVideo(container));
}

function playYouTubeVideo(container) {
    const params = new URLSearchParams({
        autoplay: '1',
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
        hl: document.documentElement.lang || 'fr'
    });

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?${params.toString()}`;
    iframe.title = a11yText('videoTitle', 'Vidéo de démonstration Splitizy');
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox');
    iframe.setAttribute('frameborder', '0');

    container.replaceChildren(iframe);
    iframe.focus();
}

function initTeamProfileSelector() {
    const profileItems = document.querySelectorAll('.team-profile-item');
    const descriptionContents = document.querySelectorAll('.profile-description');

    if (profileItems.length === 0) {
        return; // Do nothing if the elements are not on the page
    }

    const switchProfile = (profileToShow) => {
        // Hide all descriptions and remove active class from all items
        descriptionContents.forEach(desc => desc.classList.remove('active'));
        profileItems.forEach(item => item.classList.remove('active'));

        // Show the target description and set the corresponding item to active
        const targetDescription = document.querySelector(`#profile-description-${profileToShow}`);
        const targetProfileItem = document.querySelector(`.team-profile-item[data-profile="${profileToShow}"]`);

        if (targetDescription && targetProfileItem) {
            targetDescription.classList.add('active');
            targetProfileItem.classList.add('active');
        }
    };

    profileItems.forEach(item => {
        item.addEventListener('mouseover', () => {
            const profileId = item.getAttribute('data-profile');
            switchProfile(profileId);
        });

        // Keep it switchable on click for mobile/touch devices
        item.addEventListener('click', () => {
            const profileId = item.getAttribute('data-profile');
            switchProfile(profileId);
        });
    });
}