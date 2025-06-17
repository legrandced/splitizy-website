// Splitizy Custom Functions
// Newsletter and Contact forms with reCAPTCHA integration

// Global functions called by reCAPTCHA
function onSubmit(token) {
    const form = document.getElementById('mc-form');
    const email = document.getElementById('mc-email').value;
    
    if (!email || email === 'Entrez votre email') {
        showMailchimpMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('email', email);

    fetch('https://script.google.com/macros/s/AKfycbyVWI4fYiXoR5sHDkKR1tjOcSh9_7paklY6IQXXQwkVxnATnb_0Npi6ZpUa38yh100u/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        showMailchimpMessage('Merci ! Vous êtes maintenant inscrit à notre newsletter.', 'success');
        document.getElementById('mc-email').value = 'Entrez votre email';
    })
    .catch(error => {
        showMailchimpMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
    });
}

function onContactSubmit(token) {
    const form = document.getElementById('contact-form');
    const formData = new FormData(form);
    formData.append('type', 'contact');

    fetch('https://script.google.com/macros/s/AKfycbx6xQBBYvukFmx_bUOs2bt7WYbN0bFyK_OxAFFn34mZucyaHccOfNUG_e0JiNbnCBKU/exec', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        showContactMessage('Merci ! Votre message a été envoyé avec succès.', 'success');
        form.reset();
    })
    .catch(error => {
        showContactMessage('Une erreur est survenue. Veuillez réessayer.', 'error');
    });
}

// Helper function to show mailchimp messages
function showMailchimpMessage(message, type) {
    const successDiv = document.querySelector('.mailchimp-success');
    const errorDiv = document.querySelector('.mailchimp-error');
    
    if (type === 'success' && successDiv) {
        successDiv.innerHTML = message;
        successDiv.style.display = 'block';
        if (errorDiv) errorDiv.style.display = 'none';
    } else if (type === 'error' && errorDiv) {
        errorDiv.innerHTML = message;
        errorDiv.style.display = 'block';
        if (successDiv) successDiv.style.display = 'none';
    }
}

// Helper function to show contact messages
function showContactMessage(message, type) {
    const messageDiv = document.querySelector('.form-messege');
    if (messageDiv) {
        messageDiv.innerHTML = message;
        messageDiv.className = 'form-messege ' + (type === 'success' ? 'alert-success' : 'alert-danger');
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