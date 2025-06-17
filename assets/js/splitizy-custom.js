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

    fetch('https://script.google.com/macros/s/AKfycbxJluY2P_xc8zxPhJa1i4YL9Y38C21_gotAFDE_GPmPdsG0AY2AM0HFQt4n1mF2IIdU/exec', {
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

    fetch('https://script.google.com/macros/s/AKfycbxJluY2P_xc8zxPhJa1i4YL9Y38C21_gotAFDE_GPmPdsG0AY2AM0HFQt4n1mF2IIdU/exec', {
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
}); 