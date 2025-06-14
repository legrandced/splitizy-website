const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');

const targetDate = new Date("June 16 2025 00:00:00").getTime();

// Check if all timer elements exist before running timer logic
if (Days && Hours && Minutes && Seconds) {
    function timer () {
        const currentDate = new Date().getTime();
        const distance = targetDate - currentDate;

        const days = Math.floor(distance / 1000 / 60 / 60 / 24);
        const hours = Math.floor(distance / 1000 / 60 / 60) % 24;
        const minutes = Math.floor(distance / 1000 / 60) % 60;
        const seconds = Math.floor(distance / 1000) % 60;

        Days.innerHTML = days;
        Hours.innerHTML = hours;
        Minutes.innerHTML = minutes;
        Seconds.innerHTML = seconds;

        if(distance < 0){
            Days.innerHTML = "00";
            Hours.innerHTML = "00";
            Minutes.innerHTML = "00";
            Seconds.innerHTML = "00";
        }
    }

    setInterval(timer, 1000);
}

// Update copyright year
// Check if copyright element exists before trying to update it
const copyrightElement = document.getElementById('copyright-notice');
if (copyrightElement) {
    copyrightElement.textContent = new Date().getFullYear();
}

const newsletterForm = document.getElementById('newsletter-form');
const newsletterMessage = document.getElementById('newsletter-message');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        grecaptcha.execute(); // Lance le reCAPTCHA invisible
    });
}

function onSubmit(token) {
    // Simule la soumission du formulaire avec le token reCAPTCHA invisible
    const newsletterForm = document.getElementById('newsletter-form');
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    const email = document.getElementById('newsletter-email').value;

    submitButton.textContent = "Envoi en cours...";
    submitButton.disabled = true;

    fetch('https://script.google.com/macros/s/AKfycbyVWI4fYiXoR5sHDkKR1tjOcSh9_7paklY6IQXXQwkVxnATnb_0Npi6ZpUa38yh100u/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'email=' + encodeURIComponent(email) + '&g-recaptcha-response=' + encodeURIComponent(token)
    }).then(() => {
        submitButton.textContent = "Merci ! Vous serez tenu au courant.";
        newsletterForm.reset();
        grecaptcha.reset(); // Réinitialise le reCAPTCHA
        setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 3000);
    }).catch(() => {
        submitButton.textContent = "Erreur, réessayez.";
        setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 3000);
    });
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
const contactMessageStatus = document.getElementById('contact-message-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        grecaptcha.execute(); // Lance le reCAPTCHA invisible pour le formulaire de contact
    });
}

function onContactSubmit(token) {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    const messageStatus = document.getElementById('contact-message-status');
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    submitButton.textContent = "Envoi en cours...";
    submitButton.disabled = true;

    // Envoi du formulaire
    fetch('https://script.google.com/macros/s/AKfycbx6xQBBYvukFmx_bUOs2bt7WYbN0bFyK_OxAFFn34mZucyaHccOfNUG_e0JiNbnCBKU/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'type=contact&name=' + encodeURIComponent(name) + 
              '&email=' + encodeURIComponent(email) + 
              '&subject=' + encodeURIComponent(subject) + 
              '&message=' + encodeURIComponent(message) + 
              '&g-recaptcha-response=' + encodeURIComponent(token)
    }).then(() => {
        submitButton.textContent = "Message envoyé !";
        messageStatus.innerHTML = '<p style="color: #4CAF50;">✓ Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.</p>';
        contactForm.reset();
        grecaptcha.reset();
        setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            messageStatus.innerHTML = '';
        }, 5000);
    }).catch(() => {
        submitButton.textContent = "Erreur, réessayez";
        messageStatus.innerHTML = '<p style="color: #f44336;">✗ Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.</p>';
        setTimeout(() => {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }, 3000);
    });
}