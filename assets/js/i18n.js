/**
 * Système de traduction multilingue pour Splitizy
 * Compatible avec GitHub Pages
 */

class I18nManager {
    constructor() {
        this.currentLanguage = 'fr';
        this.translations = {};
        this.supportedLanguages = ['fr', 'en', 'nl'];
        this.defaultLanguage = 'fr';
        
        this.init();
    }

    async init() {
        // Détecter la langue depuis l'URL, localStorage ou navigateur
        this.detectLanguage();
        
        // Charger les traductions
        await this.loadTranslations();
        
        // Appliquer les traductions
        this.applyTranslations();
        
        // Ajouter le sélecteur de langue
        this.addLanguageSelector();
        
        // Mettre à jour l'URL
        this.updateURL();
    }

    detectLanguage() {
        // 1. Vérifier si la langue est dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            this.currentLanguage = urlLang;
            return;
        }

        // 2. Vérifier localStorage
        const savedLang = localStorage.getItem('splitizy_language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return;
        }

        // 3. Détecter depuis le navigateur
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        
        if (this.supportedLanguages.includes(langCode)) {
            this.currentLanguage = langCode;
        } else {
            this.currentLanguage = this.defaultLanguage;
        }
    }

    async loadTranslations() {
        try {
            const response = await fetch(`translations/${this.currentLanguage}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error('Erreur lors du chargement des traductions:', error);
            // Fallback vers le français si erreur
            if (this.currentLanguage !== this.defaultLanguage) {
                const fallbackResponse = await fetch(`translations/${this.defaultLanguage}.json`);
                this.translations = await fallbackResponse.json();
            }
        }
    }

    applyTranslations() {
        // Mettre à jour l'attribut lang du HTML
        document.documentElement.lang = this.currentLanguage;
        
        // Appliquer les traductions par section
        this.translateNavigation();
        this.translateHero();
        this.translateFeatures();
        this.translateTrial();
        this.translateDistribution();
        this.translateVideo();
        this.translatePricing();
        this.translateTestimonials();
        this.translateFAQ();
        this.translateNewsletter();
        this.translateFooter();
        this.translateBreadcrumb();
        this.translateContact();
        this.translate404();
        this.translatePrivacyPolicy();
        this.translateDataRemoval();
        this.translateTerms();
        this.translateGroup();
        this.translateAboutUsPage();
        
        // Traduire les images selon la langue
        this.translateImages();
        
        // Injecter le CSS dynamique pour les images avec !important
        this.injectLocalizedCSS();
        
        // Mettre à jour les liens pro.splitizy.com avec la langue actuelle
        this.updateProSplitiziyLinks();
        
        // Mettre à jour les titres de page
        this.updatePageTitle();
    }

    translateNavigation() {
        const nav = this.translations.nav;
        if (!nav) return;

        // Navigation principale
        document.querySelectorAll('a[href*="feature"], a[href*="#feature"]').forEach(el => {
            el.textContent = nav.features;
        });
        
        document.querySelectorAll('a[href*="repartition"], a[href*="#repartition"]').forEach(el => {
            el.textContent = nav.distribution;
        });
        
        document.querySelectorAll('a[href*="pricing"], a[href*="#pricing"]').forEach(el => {
            el.textContent = nav.pricing;
        });
        
        document.querySelectorAll('a[href*="faq"], a[href*="#faq"]').forEach(el => {
            el.textContent = nav.faq;
        });
        
        document.querySelectorAll('a[href*="contact"]').forEach(el => {
            el.textContent = nav.contact;
        });

        document.querySelectorAll('a[href*="qui-sommes-nous"]').forEach(el => {
            el.textContent = nav.about;
        });

        // Boutons header
        document.querySelectorAll('a[href*="type=individual"]').forEach(el => {
            el.textContent = nav.individual;
        });
        
        document.querySelectorAll('a[href*="type=pro"]').forEach(el => {
            el.textContent = nav.professional;
        });
    }

    translateHero() {
        const hero = this.translations.hero;
        if (!hero) return;

        const titleEl = document.querySelector('.hero-content .title');
        if (titleEl) titleEl.innerHTML = hero.title;

        const descEl = document.querySelector('.hero-content .desc');
        if (descEl) descEl.textContent = hero.subtitle;

        // Alterner les attributs alt des boutons de téléchargement
        document.querySelectorAll('img[alt*="Google Play"]').forEach(el => {
            el.alt = hero.downloadGooglePlay;
        });
        
        document.querySelectorAll('img[alt*="App Store"]').forEach(el => {
            el.alt = hero.downloadAppStore;
        });
    }

    translateFeatures() {
        const features = this.translations.features;
        if (!features) return;

        const titleEl = document.querySelector('.feature-list-content .feature-title');
        if (titleEl) titleEl.textContent = features.title;

        const descEl = document.querySelector('.feature-list-content .feature-desc');
        if (descEl) descEl.textContent = features.subtitle;

        // Fonctionnalités individuelles
        const featureItems = document.querySelectorAll('.feature-item');
        const featureData = [
            features.intelligentInventory,
            features.professionalExpertise,
            features.fairDistribution
        ];

        featureItems.forEach((item, index) => {
            if (featureData[index]) {
                const titleEl = item.querySelector('.title');
                const descEl = item.querySelector('.desc');
                
                if (titleEl) titleEl.textContent = featureData[index].title;
                if (descEl) descEl.textContent = featureData[index].description;
            }
        });
    }

    translateTrial() {
        const trial = this.translations.trial;
        if (!trial) return;

        const titleEl = document.querySelector('.trial-title');
        if (titleEl) titleEl.textContent = trial.title;

        const descEl = document.querySelector('.trial-desc');
        if (descEl) descEl.textContent = trial.description;
    }

    translateDistribution() {
        const distribution = this.translations.distribution;
        if (!distribution) return;

        const titleEl = document.querySelector('.banner-style-8 .banner-title');
        if (titleEl) titleEl.textContent = distribution.title;

        const descEl = document.querySelector('.banner-style-8 .banner-desc');
        if (descEl) descEl.textContent = distribution.description;

        const btnEl = document.querySelector('.banner-style-8 .banner-btn-wrap a');
        if (btnEl) btnEl.textContent = distribution.learnMore;
    }

    translateVideo() {
        const video = this.translations.video;
        if (!video) return;

        const titleEl = document.querySelector('.banner-style-9 .banner-title');
        if (titleEl) titleEl.textContent = video.title;

        const descEl = document.querySelector('.banner-style-9 .banner-desc');
        if (descEl) descEl.textContent = video.description;

        const btnEl = document.querySelector('.banner-style-9 .banner-btn-wrap a');
        if (btnEl) btnEl.textContent = video.button;
    }

    translatePricing() {
        const pricing = this.translations.pricing;
        if (!pricing) return;

        // Titre principal
        const titleEl = document.querySelector('.pricing-area .section-title');
        if (titleEl) titleEl.textContent = pricing.title;

        const descEl = document.querySelector('.pricing-area .section-desc');
        if (descEl) descEl.textContent = pricing.description;

        // Onglets
        const tabEls = document.querySelectorAll('.pricing-tab-nav a');
        if (tabEls.length >= 2) {
            tabEls[0].textContent = pricing.premiumLicense;
            tabEls[1].textContent = pricing.expertise;
        }

        // Cartes de pricing
        const pricingCards = document.querySelectorAll('.pricing-item');
        const pricingData = [
            pricing.freeVersion,
            pricing.premium,
            pricing.expertiseService
        ];

        pricingCards.forEach((card, index) => {
            if (pricingData[index]) {
                const titleEl = card.querySelector('.pricing-title');
                const priceEl = card.querySelector('.price');
                const monthEl = card.querySelector('.month');
                const btnEl = card.querySelector('.pricing-btn-wrap a');
                const features = card.querySelectorAll('.pricing-list li a');

                if (titleEl) titleEl.textContent = pricingData[index].title;
                if (priceEl) priceEl.textContent = pricingData[index].price;
                if (monthEl && pricingData[index].priceUnit) monthEl.textContent = pricingData[index].priceUnit;
                if (btnEl) btnEl.textContent = pricingData[index].button;

                features.forEach((feature, featureIndex) => {
                    if (pricingData[index].features[featureIndex]) {
                        feature.textContent = pricingData[index].features[featureIndex];
                    }
                });
            }
        });
    }

    translateTestimonials() {
        const testimonials = this.translations.testimonials;
        if (!testimonials) return;

        const titleEl = document.querySelector('.testimonial-area .section-title');
        if (titleEl) titleEl.textContent = testimonials.title;

        const testimonialItems = document.querySelectorAll('.testimonial-item');
        const testimonialData = [
            testimonials.testimonial1,
            testimonials.testimonial2,
            testimonials.testimonial3
        ];

        testimonialItems.forEach((item, index) => {
            if (testimonialData[index]) {
                const commentEl = item.querySelector('.user-comment');
                if (commentEl) commentEl.innerHTML = testimonialData[index].text;
            }
        });
    }

    translateFAQ() {
        const faq = this.translations.faq;
        if (!faq) return;

        // Si on est sur la page FAQ complète, utiliser la traduction complète
        if (window.location.pathname.includes('faq.html')) {
            this.translateFAQPage();
            return;
        }

        // Sinon, utiliser la traduction basique pour les autres pages (index.html par exemple)
        const titleEl = document.querySelector('.faq-area .section-title');
        if (titleEl) titleEl.textContent = faq.title;

        const descEl = document.querySelector('.faq-area .section-desc');
        if (descEl) descEl.textContent = faq.subtitle;

        const btnEl = document.querySelector('.faq-btn-wrap a');
        if (btnEl) btnEl.textContent = faq.otherQuestions;

        // FAQ individuelles basiques (pour page d'accueil)
        const faqItems = document.querySelectorAll('.faq-item');
        if (faq.sections && faq.sections.general) {
            faqItems.forEach((item, index) => {
                if (faq.sections.general[index]) {
                    const titleEl = item.querySelector('.faq-title');
                    const descEl = item.querySelector('.faq-desc');

                    if (titleEl) titleEl.textContent = faq.sections.general[index].question;
                    if (descEl) descEl.innerHTML = faq.sections.general[index].answer;
                }
            });
        }
    }

    translateFAQPage() {
        const faq = this.translations.faq;
        if (!faq) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle) breadcrumbTitle.textContent = faq.breadcrumbTitle;

        // Titre et description principaux
        const titleEl = document.querySelector('.faq-area .section-title');
        if (titleEl) titleEl.textContent = faq.title;

        const descEl = document.querySelector('.faq-area .section-desc');
        if (descEl) descEl.textContent = faq.subtitle;

        // Traduire les onglets de catégories
        if (faq.categories) {
            const categoryButtons = document.querySelectorAll('.faq-category-nav .nav-link');
            const categoryKeys = Object.keys(faq.categories);
            
            categoryButtons.forEach((button, index) => {
                if (categoryKeys[index] && faq.categories[categoryKeys[index]]) {
                    button.textContent = faq.categories[categoryKeys[index]];
                }
            });
        }

        // Traduire le contenu des sections FAQ
        if (faq.sections) {
            Object.keys(faq.sections).forEach(sectionKey => {
                const sectionData = faq.sections[sectionKey];
                const sectionContainer = document.querySelector(`#${sectionKey}`);
                
                if (sectionContainer && sectionData) {
                    const faqItems = sectionContainer.querySelectorAll('.faq-item');
                    
                    faqItems.forEach((item, index) => {
                        if (sectionData[index]) {
                            const titleEl = item.querySelector('.faq-title');
                            const descEl = item.querySelector('.faq-desc');

                            if (titleEl) titleEl.textContent = sectionData[index].question;
                            if (descEl) descEl.innerHTML = sectionData[index].answer;
                        }
                    });
                }
            });
        }

        // Bouton "Autres Questions"
        const btnEl = document.querySelector('.faq-btn-wrap a');
        if (btnEl) btnEl.textContent = faq.otherQuestions;
    }

    translateNewsletter() {
        const newsletter = this.translations.newsletter;
        if (!newsletter) return;

        const titleEl = document.querySelector('.newsletter-title');
        if (titleEl) titleEl.textContent = newsletter.title;

        const descEl = document.querySelector('.newsletter-desc');
        if (descEl) descEl.textContent = newsletter.description;

        const inputEl = document.querySelector('.newsletter-form input');
        if (inputEl) {
            inputEl.placeholder = newsletter.placeholder;
            inputEl.setAttribute('value', newsletter.placeholder);
        }

        const btnEl = document.querySelector('.newsletter-form button');
        if (btnEl) btnEl.textContent = newsletter.button;
    }

    translateFooter() {
        const footer = this.translations.footer;
        if (!footer) return;

        // Titre "Contact Us" / "Nous contacter"
        const contactTitle = document.querySelector('.contact-list .title');
        if (contactTitle) contactTitle.textContent = footer.contactUs;

        // Titre "Légal" / "Legal"
        const legalTitles = document.querySelectorAll('.footer-list .title');
        legalTitles.forEach(title => {
            if (title.textContent.includes('Légal') || title.textContent.includes('Legal') || title.textContent.includes('Juridisch')) {
                title.textContent = footer.legal;
            }
        });

        // Liens légaux
        const termsLink = document.querySelector('a[href*="conditions-licences-utilisation"]');
        if (termsLink) termsLink.textContent = footer.termsOfUse;

        const privacyLink = document.querySelector('a[href*="politique-de-vie-privee"]');
        if (privacyLink) privacyLink.textContent = footer.privacyPolicy;

        const dataRemovalLink = document.querySelector('a[href*="suppression-donnees"]');
        if (dataRemovalLink) dataRemovalLink.textContent = footer.dataRemoval;

        // Copyright
        const copyright = document.querySelector('.footer-copyright span');
        if (copyright) copyright.innerHTML = footer.copyright;

        // Boutons de téléchargement (alt des images)
        const googlePlayImg = document.querySelector('.footer-btn-wrap img[alt*="Google Play"]');
        if (googlePlayImg) googlePlayImg.alt = this.translations.hero?.downloadGooglePlay || googlePlayImg.alt;

        const appStoreImg = document.querySelector('.footer-btn-wrap img[alt*="App Store"]');
        if (appStoreImg) appStoreImg.alt = this.translations.hero?.downloadAppStore || appStoreImg.alt;
    }

    translateBreadcrumb() {
        const breadcrumb = this.translations.breadcrumb;
        if (!breadcrumb) return;

        const homeLinks = document.querySelectorAll('.breadcrumb-list a');
        homeLinks.forEach(link => {
            if (link.textContent.includes('Accueil') || link.textContent.includes('Home')) {
                link.textContent = breadcrumb.home;
            }
        });
    }

    translateContact() {
        const contact = this.translations.contact;
        if (!contact) return;

        // Breadcrumb title (spécifique à la page contact)
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle && window.location.pathname.includes('contact')) {
            breadcrumbTitle.textContent = contact.breadcrumbTitle;
        }

        // Formulaire de contact
        const nameInput = document.querySelector('input[name="con_name"]');
        if (nameInput) nameInput.placeholder = contact.form.name;

        const emailInput = document.querySelector('input[name="con_email"]');
        if (emailInput) emailInput.placeholder = contact.form.email;

        const subjectInput = document.querySelector('input[name="con_subject"]');
        if (subjectInput) subjectInput.placeholder = contact.form.subject;

        const messageTextarea = document.querySelector('textarea[name="con_message"]');
        if (messageTextarea) messageTextarea.placeholder = contact.form.message;

        const submitBtn = document.querySelector('.form-btn[name="submit"]');
        if (submitBtn) submitBtn.firstChild.textContent = contact.form.submit + ' ';

        // Informations de contact
        const emailLink = document.querySelector('.contact-info a[href*="mailto"]');
        if (emailLink) emailLink.textContent = contact.info.email;

        const locationSpan = document.querySelector('.contact-info span');
        if (locationSpan && (locationSpan.textContent.trim() === 'Belgique' || 
            locationSpan.textContent.trim() === 'Belgium' || 
            locationSpan.textContent.trim() === 'België')) {
            locationSpan.textContent = contact.info.location;
        }
    }

    translate404() {
        const error404 = this.translations.error404;
        if (!error404) return;

        // Vérifier si nous sommes sur la page 404
        if (!window.location.pathname.includes('404')) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle) breadcrumbTitle.textContent = error404.breadcrumbTitle;

        // Titre principal de l'erreur
        const errorTitle = document.querySelector('.error-404-content .title');
        if (errorTitle) errorTitle.textContent = error404.errorTitle;

        // Description de l'erreur
        const errorDesc = document.querySelector('.error-404-content .desc');
        if (errorDesc) errorDesc.textContent = error404.errorDescription;

        // Bouton de retour
        const backBtn = document.querySelector('.error-404-content .btn');
        if (backBtn) {
            // Chercher le nœud texte dans les enfants
            let textNode = null;
            for (let node of backBtn.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    textNode = node;
                    break;
                }
            }
            
            if (textNode) {
                textNode.textContent = ` ${error404.backButton}`;
            } else {
                // Si pas de nœud texte trouvé, remplacer tout le contenu en gardant l'icône
                backBtn.innerHTML = `<i class="icofont-long-arrow-left"></i> ${error404.backButton}`;
            }
        }
    }

    translatePrivacyPolicy() {
        const privacy = this.translations.privacy;
        if (!privacy) return;

        // Vérifier si nous sommes sur la page de politique de vie privée
        if (!window.location.pathname.includes('politique-de-vie-privee')) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle) breadcrumbTitle.textContent = privacy.breadcrumbTitle;

        // Breadcrumb span
        const breadcrumbSpan = document.querySelector('.breadcrumb-list span');
        if (breadcrumbSpan) breadcrumbSpan.textContent = privacy.breadcrumbTitle;

        // Date de mise à jour dans le header
        const lastUpdatedElement = document.querySelector('.legal-header .text-muted');
        if (lastUpdatedElement) {
            lastUpdatedElement.innerHTML = `<strong>${privacy.lastUpdated}</strong>`;
        }

        // Date de mise à jour en bas de page
        const lastUpdatedBottom = document.querySelector('.text-center .text-muted small strong');
        if (lastUpdatedBottom) {
            lastUpdatedBottom.textContent = privacy.lastUpdated;
        }

        // Traduire les titres des sections principales
        const sectionTitles = document.querySelectorAll('.legal-content h2');
        const sections = privacy.sections;
        
        if (sections) {
            sectionTitles.forEach((title, index) => {
                const titleText = title.textContent.trim();
                
                // Identifier et traduire chaque section par son contenu
                if (titleText.includes('DÉFINITIONS') && sections.definitions) {
                    title.textContent = sections.definitions.title;
                } else if (titleText.includes('RESPONSABLE DU TRAITEMENT') && sections.dataController) {
                    title.textContent = sections.dataController.title;
                } else if (titleText.includes('DONNÉES SONT COLLECTÉES') && sections.dataCollection) {
                    title.textContent = sections.dataCollection.title;
                } else if (titleText.includes('COMBIEN DE TEMPS') && sections.dataRetention) {
                    title.textContent = sections.dataRetention.title;
                } else if (titleText.includes('AVEC QUI') && sections.dataSharing) {
                    title.textContent = sections.dataSharing.title;
                } else if (titleText.includes('VOS DROITS') && sections.userRights) {
                    title.textContent = sections.userRights.title;
                } else if (titleText.includes('MESURES DE SÉCURITÉ') && sections.security) {
                    title.textContent = sections.security.title;
                } else if (titleText.includes('MODIFICATIONS') && sections.modifications) {
                    title.textContent = sections.modifications.title;
                } else if (titleText.includes('DROIT APPLICABLE') && sections.applicableLaw) {
                    title.textContent = sections.applicableLaw.title;
                }
            });

            // Traduire les sous-sections H3
            const subsectionTitles = document.querySelectorAll('.legal-content h3');
            subsectionTitles.forEach((title) => {
                const titleText = title.textContent.trim();
                
                // Sections 3.x - Collecte des données
                if (sections.dataCollection && sections.dataCollection.subsections) {
                    Object.keys(sections.dataCollection.subsections).forEach(key => {
                        const subsection = sections.dataCollection.subsections[key];
                        if (titleText.includes(key)) {
                            title.textContent = subsection.title;
                            
                            // Traduire les paragraphes suivants de cette sous-section
                            let nextElement = title.nextElementSibling;
                            let contentIndex = 0;
                            
                            while (nextElement && nextElement.tagName === 'P' && contentIndex < subsection.content.length) {
                                nextElement.innerHTML = subsection.content[contentIndex];
                                nextElement = nextElement.nextElementSibling;
                                contentIndex++;
                            }
                        }
                    });
                }
                
                // Sections 5.x - Partage des données
                if (sections.dataSharing && sections.dataSharing.subsections) {
                    Object.keys(sections.dataSharing.subsections).forEach(key => {
                        const subsection = sections.dataSharing.subsections[key];
                        if (titleText.includes(key)) {
                            title.textContent = subsection.title;
                            
                            // Traduire les paragraphes suivants de cette sous-section
                            let nextElement = title.nextElementSibling;
                            let contentIndex = 0;
                            
                            while (nextElement && nextElement.tagName === 'P' && contentIndex < subsection.content.length) {
                                nextElement.innerHTML = subsection.content[contentIndex];
                                nextElement = nextElement.nextElementSibling;
                                contentIndex++;
                            }
                        }
                    });
                }
            });

            // Traduire le contenu des paragraphes principaux (hors sous-sections)
            const paragraphs = document.querySelectorAll('.legal-content p');
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                
                // Éviter de traduire les paragraphes qui ont déjà été traduits dans les sous-sections
                // Vérifier si le paragraphe fait partie d'une sous-section déjà traduite
                let isInSubsection = false;
                let prevElement = p.previousElementSibling;
                
                // Remonter jusqu'à trouver un H3 ou un H2
                while (prevElement && prevElement.tagName !== 'H2') {
                    if (prevElement.tagName === 'H3') {
                        const h3Text = prevElement.textContent.trim();
                        // Vérifier si ce H3 correspond à une sous-section traduite
                        if (h3Text.includes('3.') || h3Text.includes('5.')) {
                            isInSubsection = true;
                            break;
                        }
                    }
                    prevElement = prevElement.previousElementSibling;
                }
                
                // Si le paragraphe fait partie d'une sous-section déjà traduite, ne pas le traduire à nouveau
                if (isInSubsection) {
                    return;
                }
                
                // Section 1 - Définitions
                if (text.startsWith('Pour l\'application de la présente') && sections.definitions) {
                    p.textContent = sections.definitions.intro;
                } else if (text.startsWith('Tous les termes utilisés') && sections.definitions) {
                    p.textContent = sections.definitions.conclusion;
                }
                
                // Section 2 - Responsable du traitement
                else if (text.includes('SPLITIZY SRL') && sections.dataController) {
                    p.innerHTML = sections.dataController.content;
                } else if (text.includes('grande importance') && sections.dataController) {
                    p.innerHTML = sections.dataController.commitment;
                } else if (text.includes('privacy@splitizy.com') && sections.dataController) {
                    p.innerHTML = sections.dataController.contact;
                }
                
                // Section 3 - Collecte des données (paragraphes principaux seulement)
                else if (text.includes('collecter et traiter') && sections.dataCollection) {
                    p.textContent = sections.dataCollection.intro;
                } else if (text.includes('traitement automatisé') && sections.dataCollection) {
                    p.textContent = sections.dataCollection.noAutomation;
                }
                
                // Section 4 - Conservation
                else if (text.includes('conservation de vos données') && sections.dataRetention) {
                    p.textContent = sections.dataRetention.content;
                } else if (text.includes('trois ans') && sections.dataRetention) {
                    p.textContent = sections.dataRetention.retention;
                } else if (text.includes('détruira') && sections.dataRetention) {
                    p.textContent = sections.dataRetention.deletion;
                }
                
                // Section 5 - Partage (paragraphes principaux seulement)
                else if (text.includes('prestataires tiers') && sections.dataSharing) {
                    p.textContent = sections.dataSharing.intro;
                } else if (text.includes('Union européenne') && sections.dataSharing) {
                    p.textContent = sections.dataSharing.noInternationalTransfer;
                }
                
                // Section 6 - Droits
                else if (text.includes('conformément au RGPD') && sections.userRights) {
                    p.textContent = sections.userRights.intro;
                } else if (text.includes('gratuitement') && sections.userRights) {
                    p.innerHTML = sections.userRights.contact;
                }
                
                // Section 7 - Sécurité
                else if (text.includes('mesures techniques') && sections.security) {
                    p.textContent = sections.security.content;
                }
                
                // Section 8 - Modifications
                else if (text.includes('temps à autre') && sections.modifications) {
                    p.textContent = sections.modifications.content;
                }
                
                // Section 9 - Droit applicable
                else if (text.includes('droit belge') && sections.applicableLaw) {
                    p.innerHTML = sections.applicableLaw.content;
                }
            });

            // Traduire la liste des définitions
            if (sections.definitions && sections.definitions.items) {
                const definitionsList = document.querySelector('.legal-content ul');
                if (definitionsList) {
                    const listItems = definitionsList.querySelectorAll('li');
                    listItems.forEach((item, index) => {
                        if (sections.definitions.items[index]) {
                            item.innerHTML = `• ${sections.definitions.items[index]}`;
                        }
                    });
                }
            }

            // Traduire la liste des droits
            if (sections.userRights && sections.userRights.rights) {
                const allLists = document.querySelectorAll('.legal-content ul');
                allLists.forEach(list => {
                    const listItems = list.querySelectorAll('li');
                    listItems.forEach(item => {
                        const text = item.textContent.trim();
                        
                        if (text.includes('Droit d\'accès') && sections.userRights.rights[0]) {
                            item.innerHTML = sections.userRights.rights[0];
                        } else if (text.includes('Droit de rectification') && sections.userRights.rights[1]) {
                            item.innerHTML = sections.userRights.rights[1];
                        } else if (text.includes('Droit d\'opposition') && sections.userRights.rights[2]) {
                            item.innerHTML = sections.userRights.rights[2];
                        } else if (text.includes('Droit à l\'oubli') && sections.userRights.rights[3]) {
                            item.innerHTML = sections.userRights.rights[3];
                        } else if (text.includes('Droit de retirer') && sections.userRights.rights[4]) {
                            item.innerHTML = sections.userRights.rights[4];
                        } else if (text.includes('portabilité') && sections.userRights.rights[5]) {
                            item.innerHTML = sections.userRights.rights[5];
                        } else if (text.includes('porter plainte') && sections.userRights.rights[6]) {
                            item.innerHTML = sections.userRights.rights[6];
                        }
                    });
                });
            }
        }

        // Mettre à jour le titre de la page
        document.title = privacy.title + ' - Splitizy';
    }

    translateDataRemoval() {
        const dataRemoval = this.translations.dataRemoval;
        if (!dataRemoval) return;

        // Vérifier si nous sommes sur la page de suppression des données
        if (!window.location.pathname.includes('suppression-donnees')) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle) breadcrumbTitle.textContent = dataRemoval.breadcrumbTitle;

        // Breadcrumb span
        const breadcrumbSpan = document.querySelector('.breadcrumb-list span');
        if (breadcrumbSpan) breadcrumbSpan.textContent = dataRemoval.breadcrumbTitle;

        // Sous-titre principal - remplacer tout le contenu du paragraphe
        const subtitle = document.querySelector('.legal-header .text-muted');
        if (subtitle) subtitle.innerHTML = `<strong>${dataRemoval.subtitle}</strong>`;

        // Date de mise à jour en bas de page
        const lastUpdatedBottom = document.querySelector('.text-center .text-muted small strong');
        if (lastUpdatedBottom && this.currentLanguage === 'fr') {
            lastUpdatedBottom.textContent = 'Guide mis à jour : Juin 2025';
        } else if (lastUpdatedBottom && this.currentLanguage === 'en') {
            lastUpdatedBottom.textContent = 'Guide updated: June 2025';
        } else if (lastUpdatedBottom && this.currentLanguage === 'nl') {
            lastUpdatedBottom.textContent = 'Gids bijgewerkt: Juni 2025';
        }

        // Traduire les titres des sections principales
        const sectionTitles = document.querySelectorAll('.legal-content h2');
        const sections = dataRemoval.sections;
        
        if (sections) {
            sectionTitles.forEach((title, index) => {
                const titleText = title.textContent.trim();
                
                // Identifier et traduire chaque section par son contenu
                if (titleText.includes('droit à la suppression') && sections.yourRight) {
                    title.textContent = sections.yourRight.title;
                } else if (titleText.includes('Comment supprimer') && sections.howToDelete) {
                    title.textContent = sections.howToDelete.title;
                } else if (titleText.includes('se passe-t-il après') && sections.afterDeletion) {
                    title.textContent = sections.afterDeletion.title;
                } else if (titleText.includes('Délai de suppression') && sections.deletionTime) {
                    title.textContent = sections.deletionTime.title;
                } else if (titleText.includes('Besoin d\'aide') && sections.needHelp) {
                    title.textContent = sections.needHelp.title;
                } else if (titleText.includes('Autres droits') && sections.otherRights) {
                    title.textContent = sections.otherRights.title;
                }
            });

            // Traduire les titres H3 (étapes)
            const h3Titles = document.querySelectorAll('.legal-content h3');
            if (sections.howToDelete && sections.howToDelete.steps) {
                h3Titles.forEach((title, index) => {
                    const titleText = title.textContent.trim();
                    
                    if (titleText.includes('Étape 1') && sections.howToDelete.steps[0]) {
                        title.textContent = sections.howToDelete.steps[0].title;
                    } else if (titleText.includes('Étape 2') && sections.howToDelete.steps[1]) {
                        title.textContent = sections.howToDelete.steps[1].title;
                    } else if (titleText.includes('Étape 3') && sections.howToDelete.steps[2]) {
                        title.textContent = sections.howToDelete.steps[2].title;
                    }
                });
            }

            // Traduire le contenu des paragraphes
            const paragraphs = document.querySelectorAll('.legal-content p');
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                
                // Section 1 - Votre droit
                if (text.includes('Conformément au Règlement Général') && sections.yourRight) {
                    p.textContent = sections.yourRight.content;
                }
                
                // Section Important
                else if (text.includes('suppression de votre compte entraînera') && sections.important) {
                    p.textContent = sections.important.content;
                }
                
                // Section Comment supprimer
                else if (text.includes('supprimer définitivement votre compte') && sections.howToDelete) {
                    p.textContent = sections.howToDelete.intro;
                }
                
                // Section Après suppression
                else if (text.includes('Lorsque vous supprimez votre compte') && sections.afterDeletion) {
                    p.textContent = sections.afterDeletion.intro;
                }
                
                // Section Délai
                else if (text.includes('suppression de vos données est effective') && sections.deletionTime) {
                    p.textContent = sections.deletionTime.content;
                }
                
                // Section Besoin d'aide
                else if (text.includes('difficultés pour supprimer') && sections.needHelp) {
                    p.textContent = sections.needHelp.content;
                } else if (text.includes('Notre équipe vous répondra') && sections.needHelp) {
                    p.textContent = sections.needHelp.response;
                }
                
                // Section Autres droits
                else if (text.includes('En plus du droit à la suppression') && sections.otherRights) {
                    p.innerHTML = sections.otherRights.content.replace('Politique de Vie Privée', `<a href="politique-de-vie-privee.html" style="color: var(--splitizy-primary);">${this.translations.footer?.privacyPolicy || 'Politique de Vie Privée'}</a>`);
                }
            });

            // Traduire les listes ordonnées (étapes)
            if (sections.howToDelete && sections.howToDelete.steps) {
                const orderedLists = document.querySelectorAll('.legal-content ol');
                orderedLists.forEach(list => {
                    const listItems = list.querySelectorAll('li');
                    
                    // Étape 1
                    if (listItems.length >= 2 && sections.howToDelete.steps[0]) {
                        listItems[0].textContent = sections.howToDelete.steps[0].content[0];
                        listItems[1].textContent = sections.howToDelete.steps[0].content[1];
                    }
                    
                    // Étape 2
                    if (list.previousElementSibling && list.previousElementSibling.textContent.includes('Étape 2')) {
                        if (sections.howToDelete.steps[1]) {
                            listItems.forEach((item, index) => {
                                if (sections.howToDelete.steps[1].content[index]) {
                                    item.textContent = sections.howToDelete.steps[1].content[index];
                                }
                            });
                        }
                    }
                    
                    // Étape 3
                    else if (list.previousElementSibling && list.previousElementSibling.textContent.includes('Étape 3')) {
                        if (sections.howToDelete.steps[2]) {
                            listItems.forEach((item, index) => {
                                if (sections.howToDelete.steps[2].content[index]) {
                                    item.textContent = sections.howToDelete.steps[2].content[index];
                                }
                            });
                        }
                    }
                });
            }

            // Traduire la liste "Que se passe-t-il après suppression"
            if (sections.afterDeletion && sections.afterDeletion.items) {
                const unorderedLists = document.querySelectorAll('.legal-content ul');
                unorderedLists.forEach(list => {
                    const listItems = list.querySelectorAll('li');
                    if (listItems.length === sections.afterDeletion.items.length) {
                        listItems.forEach((item, index) => {
                            if (sections.afterDeletion.items[index]) {
                                item.textContent = sections.afterDeletion.items[index];
                            }
                        });
                    }
                });
            }

            // Traduire les informations de contact
            if (sections.needHelp && sections.needHelp.contact) {
                const emailLabels = document.querySelectorAll('.legal-content p strong');
                emailLabels.forEach(label => {
                    if (label.textContent.includes('Email')) {
                        if (this.currentLanguage === 'en') {
                            label.textContent = 'Email:';
                        } else if (this.currentLanguage === 'nl') {
                            label.textContent = 'E-mail:';
                        }
                    } else if (label.textContent.includes('Objet')) {
                        if (this.currentLanguage === 'en') {
                            label.textContent = 'Subject:';
                        } else if (this.currentLanguage === 'nl') {
                            label.textContent = 'Onderwerp:';
                        }
                    }
                });

                // Traduire le texte de l'objet de l'email
                const subjectText = document.querySelector('.legal-content p');
                if (subjectText && subjectText.textContent.includes('Demande de suppression de données')) {
                    const strongElements = subjectText.querySelectorAll('strong');
                    if (strongElements.length >= 2) {
                        strongElements[1].nextSibling.textContent = ` ${sections.needHelp.contact.subject}`;
                    }
                }
            }

            // Traduire les alertes importantes
            const importantBox = document.querySelector('.legal-content div[style*="background-color: #fff3cd"]');
            if (importantBox && sections.important) {
                const strongElement = importantBox.querySelector('strong');
                if (strongElement) {
                    strongElement.textContent = sections.important.title;
                    strongElement.nextSibling.textContent = ` ${sections.important.content}`;
                }
            }

            const warningBox = document.querySelector('.legal-content div[style*="background-color: #f8d7da"]');
            if (warningBox) {
                const strongElement = warningBox.querySelector('strong');
                if (strongElement && this.currentLanguage === 'en') {
                    strongElement.textContent = 'Warning:';
                    strongElement.nextSibling.textContent = ' Once deletion is confirmed, your account will be permanently deleted and you will no longer be able to recover your data. Make sure you have backed up any important information before proceeding.';
                } else if (strongElement && this.currentLanguage === 'nl') {
                    strongElement.textContent = 'Waarschuwing:';
                    strongElement.nextSibling.textContent = ' Zodra de verwijdering is bevestigd, wordt uw account permanent verwijderd en kunt u uw gegevens niet meer herstellen. Zorg ervoor dat u alle belangrijke informatie heeft opgeslagen voordat u doorgaat.';
                }
            }
        }

        // Mettre à jour le titre de la page
        document.title = dataRemoval.title + ' - Splitizy';
    }

    translateTerms() {
        const terms = this.translations.terms;
        if (!terms) return;

        // Vérifier si nous sommes sur la page des conditions d'utilisation
        if (!window.location.pathname.includes('conditions-licences-utilisation')) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle) breadcrumbTitle.textContent = terms.breadcrumbTitle;

        // Breadcrumb span
        const breadcrumbSpan = document.querySelector('.breadcrumb-list span');
        if (breadcrumbSpan) breadcrumbSpan.textContent = terms.breadcrumbSpan;

        // Date de mise à jour dans le header - remplacer tout le contenu du paragraphe
        const lastUpdatedElement = document.querySelector('.legal-header .text-muted');
        if (lastUpdatedElement) {
            lastUpdatedElement.innerHTML = `<strong>${terms.lastUpdated}</strong>`;
        }

        // Date de mise à jour en bas de page (seulement l'élément strong dans small)
        const lastUpdatedBottom = document.querySelector('.text-center .text-muted small strong');
        if (lastUpdatedBottom) {
            lastUpdatedBottom.textContent = terms.lastUpdated;
        }

        // Traduire les titres des sections principales
        const sectionTitles = document.querySelectorAll('.legal-content h2');
        const sections = terms.sections;
        
        if (sections) {
            sectionTitles.forEach((title, index) => {
                const titleText = title.textContent.trim();
                
                // Identifier et traduire chaque section par son contenu
                if (titleText.includes('1. DÉFINITIONS') && sections.definitions) {
                    title.textContent = sections.definitions.title;
                } else if (titleText.includes('2. LICENCE') && sections.license) {
                    title.textContent = sections.license.title;
                } else if (titleText.includes('3. REDEVANCES') && sections.royalties) {
                    title.textContent = sections.royalties.title;
                } else if (titleText.includes('4. SERVICES ADDITIONNELS') && sections.additionalServices) {
                    title.textContent = sections.additionalServices.title;
                } else if (titleText.includes('5. RÉSILIATION') && sections.termination) {
                    title.textContent = sections.termination.title;
                } else if (titleText.includes('6. DROIT DE RÉTRACTATION') && sections.withdrawal) {
                    title.textContent = sections.withdrawal.title;
                } else if (titleText.includes('7. RESPONSABILITÉ') && sections.responsibility) {
                    title.textContent = sections.responsibility.title;
                } else if (titleText.includes('8. OBLIGATIONS') && sections.obligations) {
                    title.textContent = sections.obligations.title;
                } else if (titleText.includes('9. TRAITEMENT DES DONNÉES') && sections.dataProcessing) {
                    title.textContent = sections.dataProcessing.title;
                } else if (titleText.includes('10. DISPOSITIONS DIVERSES') && sections.miscellaneous) {
                    title.textContent = sections.miscellaneous.title;
                } else if (titleText.includes('11. DROIT APPLICABLE') && sections.applicableLaw) {
                    title.textContent = sections.applicableLaw.title;
                }
            });

            // Traduire les sous-sections H3
            const subsectionTitles = document.querySelectorAll('.legal-content h3');
            subsectionTitles.forEach((title) => {
                const titleText = title.textContent.trim();
                
                // Sections licence (2.x)
                if (sections.license && sections.license.subsections) {
                    Object.keys(sections.license.subsections).forEach(key => {
                        const subsection = sections.license.subsections[key];
                        if (titleText.includes(key)) {
                            title.textContent = subsection.title;
                        }
                    });
                }
                
                // Sections services additionnels (4.x)
                if (sections.additionalServices && sections.additionalServices.subsections) {
                    Object.keys(sections.additionalServices.subsections).forEach(key => {
                        const subsection = sections.additionalServices.subsections[key];
                        if (titleText.includes(key)) {
                            title.textContent = subsection.title;
                        }
                    });
                }
                
                // Sections responsabilité (7.x)
                if (sections.responsibility && sections.responsibility.subsections) {
                    Object.keys(sections.responsibility.subsections).forEach(key => {
                        const subsection = sections.responsibility.subsections[key];
                        if (titleText.includes(key)) {
                            title.textContent = subsection.title;
                        }
                    });
                }
                
                // Sections obligations (8.x)
                if (sections.obligations && sections.obligations.subsections) {
                    Object.keys(sections.obligations.subsections).forEach(key => {
                        const subsection = sections.obligations.subsections[key];
                        if (titleText.includes(key)) {
                            title.textContent = subsection.title;
                        }
                    });
                }
                
                // Sections dispositions diverses (10.x)
                if (sections.miscellaneous && sections.miscellaneous.subsections) {
                    Object.keys(sections.miscellaneous.subsections).forEach(key => {
                        const subsection = sections.miscellaneous.subsections[key];
                        if (titleText.includes(key)) {
                            title.textContent = subsection.title;
                        }
                    });
                }
            });

            // Traduire le contenu des paragraphes
            const paragraphs = document.querySelectorAll('.legal-content p');
            paragraphs.forEach((p, index) => {
                const text = p.textContent.trim();
                
                // Éviter de traduire les paragraphes qui ont déjà été traduits dans les sous-sections
                let isInSubsection = false;
                let prevElement = p.previousElementSibling;
                
                // Remonter jusqu'à trouver un H3 ou un H2
                while (prevElement && prevElement.tagName !== 'H2') {
                    if (prevElement.tagName === 'H3') {
                        isInSubsection = true;
                        break;
                    }
                    prevElement = prevElement.previousElementSibling;
                }
                
                // Si le paragraphe fait partie d'une sous-section, ne pas le traduire à nouveau
                if (isInSubsection) {
                    return;
                }
                
                // Section 1 - Définitions
                if (text.includes('Pour l\'application du présent Contrat') && sections.definitions) {
                    p.textContent = sections.definitions.intro;
                } else if (text.includes('Le Contrat régit la licence') && sections.definitions) {
                    p.textContent = sections.definitions.conclusion[0];
                } else if (text.includes('Les présentes dispositions') && sections.definitions) {
                    p.textContent = sections.definitions.conclusion[1];
                }
                
                // Section 3 - Redevances
                else if (text.includes('droit d\'utilisation de l\'Application') && sections.royalties) {
                    p.textContent = sections.royalties.content[0];
                } else if (text.includes('En cas de vente directe par SPLITIZY à l\'Utilisateur') && text.includes('le prix de l\'Application') && sections.royalties) {
                    p.innerHTML = sections.royalties.content[1];
                } else if (text.includes('Toutes les factures') && sections.royalties) {
                    p.textContent = sections.royalties.content[2];
                } else if (text.includes('A défaut de paiement') && sections.royalties) {
                    p.textContent = sections.royalties.content[3];
                } else if (text.includes('Toute réclamation') && sections.royalties) {
                    p.textContent = sections.royalties.content[4];
                } else if (text.includes('A l\'expiration') && sections.royalties) {
                    p.textContent = sections.royalties.content[5];
                } else if (text.includes('Aucun remboursement') && sections.royalties) {
                    p.textContent = sections.royalties.content[6];
                }
                

                
                // Section 5 - Résiliation
                else if (text.includes('présent Contrat peut être résilié') && sections.termination) {
                    p.textContent = sections.termination.content;
                }
                
                // Section 6 - Droit de rétractation
                else if (text.includes('Sauf si conformément') && sections.withdrawal) {
                    p.textContent = sections.withdrawal.content;
                }
                
                // Section 9 - Traitement des données
                else if (text.includes('données personnelles des Utilisateurs') && sections.dataProcessing) {
                    p.innerHTML = sections.dataProcessing.content;
                }
                
                // Section 11 - Droit applicable
                else if (text.includes('Contrat est soumis au droit belge') && sections.applicableLaw) {
                    p.textContent = sections.applicableLaw.content;
                }
            });

            // Traduire la section 7.1 complète (4 paragraphes)
            const allElements = document.querySelectorAll('.legal-content *');
            allElements.forEach((element) => {
                if (element.tagName === 'H3' && element.textContent.includes('7.1')) {
                    let nextElement = element.nextElementSibling;
                    let paragraphIndex = 0;
                    
                    while (nextElement && nextElement.tagName === 'P' && paragraphIndex < 4) {
                        if (sections.responsibility && sections.responsibility.subsections['7.1'] && sections.responsibility.subsections['7.1'].content[paragraphIndex]) {
                            nextElement.textContent = sections.responsibility.subsections['7.1'].content[paragraphIndex];
                        }
                        nextElement = nextElement.nextElementSibling;
                        paragraphIndex++;
                    }
                }
            });

            // Traduire les listes
            const lists = document.querySelectorAll('.legal-content ul');
            lists.forEach((list, listIndex) => {
                const listItems = list.querySelectorAll('li');
                
                // Vérifier si c'est la liste des définitions (section 1)
                if (sections.definitions && sections.definitions.items) {
                    // Chercher si la liste est précédée par un H2 contenant "1." ou si elle est dans la section 1
                    let prevElement = list.previousElementSibling;
                    let isDefinitionsList = false;
                    
                    // Remonter jusqu'à trouver un H2
                    while (prevElement) {
                        if (prevElement.tagName === 'H2') {
                            if (prevElement.textContent.includes('1.') || prevElement.textContent.includes('DÉFINITIONS')) {
                                isDefinitionsList = true;
                            }
                            break;
                        }
                        prevElement = prevElement.previousElementSibling;
                    }
                    
                    if (isDefinitionsList) {
                        listItems.forEach((item, index) => {
                            if (sections.definitions.items[index]) {
                                item.innerHTML = sections.definitions.items[index];
                            }
                        });
                    }
                }
                
                // Vérifier si c'est une liste de sous-section
                let parentH3 = list.previousElementSibling;
                while (parentH3 && parentH3.tagName !== 'H3' && parentH3.tagName !== 'H2') {
                    parentH3 = parentH3.previousElementSibling;
                }
                
                if (parentH3 && parentH3.tagName === 'H3') {
                    const h3Text = parentH3.textContent.trim();
                    
                    // Listes dans les sous-sections
                    if (h3Text.includes('4.1') && sections.additionalServices && sections.additionalServices.subsections['4.1']) {
                        listItems.forEach((item, index) => {
                            if (sections.additionalServices.subsections['4.1'].items[index]) {
                                item.textContent = sections.additionalServices.subsections['4.1'].items[index];
                            }
                        });
                    }
                    
                    if (h3Text.includes('7.4') && sections.responsibility && sections.responsibility.subsections['7.4']) {
                        listItems.forEach((item, index) => {
                            if (sections.responsibility.subsections['7.4'].items[index]) {
                                item.textContent = sections.responsibility.subsections['7.4'].items[index];
                            }
                        });
                    }
                    
                    if (h3Text.includes('7.5') && sections.responsibility && sections.responsibility.subsections['7.5']) {
                        listItems.forEach((item, index) => {
                            if (sections.responsibility.subsections['7.5'].items[index]) {
                                item.textContent = sections.responsibility.subsections['7.5'].items[index];
                            }
                        });
                    }
                    
                    if (h3Text.includes('8.1') && sections.obligations && sections.obligations.subsections['8.1']) {
                        listItems.forEach((item, index) => {
                            if (sections.obligations.subsections['8.1'].items[index]) {
                                item.textContent = sections.obligations.subsections['8.1'].items[index];
                            }
                        });
                    }
                    
                    if (h3Text.includes('8.2') && sections.obligations && sections.obligations.subsections['8.2']) {
                        listItems.forEach((item, index) => {
                            if (sections.obligations.subsections['8.2'].items[index]) {
                                item.innerHTML = sections.obligations.subsections['8.2'].items[index];
                            } else if (sections.obligations.subsections['8.2'].features && sections.obligations.subsections['8.2'].features[index - sections.obligations.subsections['8.2'].items.length]) {
                                item.textContent = sections.obligations.subsections['8.2'].features[index - sections.obligations.subsections['8.2'].items.length];
                            }
                        });
                    }
                }
            });

            // Traduire les paragraphes des sous-sections
            const allParagraphs = document.querySelectorAll('.legal-content p');
            allParagraphs.forEach(p => {
                const text = p.textContent.trim();
                
                // Trouver le H3 parent
                let parentH3 = p.previousElementSibling;
                while (parentH3 && parentH3.tagName !== 'H3' && parentH3.tagName !== 'H2') {
                    parentH3 = parentH3.previousElementSibling;
                }
                
                if (parentH3 && parentH3.tagName === 'H3') {
                    const h3Text = parentH3.textContent.trim();
                    
                    // Paragraphes des sous-sections licence
                    if (h3Text.includes('2.1') && sections.license && sections.license.subsections['2.1']) {
                        p.textContent = sections.license.subsections['2.1'].content;
                    } else if (h3Text.includes('2.2') && sections.license && sections.license.subsections['2.2']) {
                        if (p.textContent.includes('Après paiement du prix')) {
                            p.textContent = sections.license.subsections['2.2'].content[0];
                        } else if (p.innerHTML.includes('<u>En cas de vente directe par SPLITIZY à l\'Utilisateur</u>')) {
                            p.innerHTML = sections.license.subsections['2.2'].content[1];
                        }
                    } else if (h3Text.includes('2.3') && sections.license && sections.license.subsections['2.3']) {
                        p.textContent = sections.license.subsections['2.3'].content;
                    } else if (h3Text.includes('2.4') && sections.license && sections.license.subsections['2.4']) {
                        p.textContent = sections.license.subsections['2.4'].content;
                    } else if (h3Text.includes('2.5') && sections.license && sections.license.subsections['2.5']) {
                        p.textContent = sections.license.subsections['2.5'].content;
                    }
                    
                    // Paragraphes des services additionnels
                    else if (h3Text.includes('4.1') && sections.additionalServices && sections.additionalServices.subsections['4.1']) {
                        p.textContent = sections.additionalServices.subsections['4.1'].content;
                    } else if (h3Text.includes('4.2') && sections.additionalServices && sections.additionalServices.subsections['4.2']) {
                        if (text.includes('Services faisant intervenir')) {
                            p.textContent = sections.additionalServices.subsections['4.2'].content[0];
                        } else if (text.includes('SPLITIZY n\'endosse')) {
                            p.textContent = sections.additionalServices.subsections['4.2'].content[1];
                        }
                    }
                    
                    // Paragraphes des responsabilités
                    else if (h3Text.includes('7.1') && sections.responsibility && sections.responsibility.subsections['7.1']) {
                        const paragraphIndex = Array.from(p.parentElement.querySelectorAll('p')).indexOf(p);
                        const h3Index = Array.from(p.parentElement.querySelectorAll('h3')).findIndex(h3 => h3.textContent.includes('7.1'));
                        
                        if (sections.responsibility.subsections['7.1'].content[paragraphIndex]) {
                            p.textContent = sections.responsibility.subsections['7.1'].content[paragraphIndex];
                        }
                    } else if (h3Text.includes('7.2') && sections.responsibility && sections.responsibility.subsections['7.2']) {
                        p.textContent = sections.responsibility.subsections['7.2'].content;
                    } else if (h3Text.includes('7.3') && sections.responsibility && sections.responsibility.subsections['7.3']) {
                        p.textContent = sections.responsibility.subsections['7.3'].content;
                    } else if (h3Text.includes('7.4') && sections.responsibility && sections.responsibility.subsections['7.4']) {
                        p.textContent = sections.responsibility.subsections['7.4'].content;
                    } else if (h3Text.includes('7.5') && sections.responsibility && sections.responsibility.subsections['7.5']) {
                        p.textContent = sections.responsibility.subsections['7.5'].content;
                    }
                    
                    // Paragraphes des obligations
                    else if (h3Text.includes('8.1') && sections.obligations && sections.obligations.subsections['8.1']) {
                        if (text.includes('L\'Utilisateur s\'interdit')) {
                            p.textContent = sections.obligations.subsections['8.1'].content;
                        } else if (text.includes('En cas d\'infraction')) {
                            p.textContent = sections.obligations.subsections['8.1'].conclusion;
                        }
                    } else if (h3Text.includes('8.2') && sections.obligations && sections.obligations.subsections['8.2']) {
                        if (text.includes('SPLITIZY s\'engage')) {
                            p.textContent = sections.obligations.subsections['8.2'].content;
                        } else if (text.includes('Pour pouvoir l\'utiliser')) {
                            p.textContent = sections.obligations.subsections['8.2'].conclusion;
                        }
                    }
                    
                    // Paragraphes des dispositions diverses
                    else if (h3Text.includes('10.1') && sections.miscellaneous && sections.miscellaneous.subsections['10.1']) {
                        p.textContent = sections.miscellaneous.subsections['10.1'].content;
                    } else if (h3Text.includes('10.2') && sections.miscellaneous && sections.miscellaneous.subsections['10.2']) {
                        p.textContent = sections.miscellaneous.subsections['10.2'].content;
                    }
                }
            });

            // Traduire le lien vers la politique de vie privée
            const privacyLink = document.querySelector('.legal-content a[href*="politique-de-vie-privee"]');
            if (privacyLink && this.translations.footer?.privacyPolicy) {
                privacyLink.textContent = this.translations.footer.privacyPolicy;
            }
        }

        // Mettre à jour le titre de la page
        document.title = terms.title + ' - Splitizy';
    }

    translateGroup() {
        const group = this.translations.group;
        if (!group) return;

        // Vérifier si nous sommes sur la page group.html
        if (!window.location.pathname.includes('group.html')) return;

        // Exposer les traductions à l'objet global pour le JavaScript de la page
        window.i18nManager = {
            translations: this.translations
        };

        // Traduire les boutons de téléchargement (alt text)
        const downloadButtons = document.querySelectorAll('.download-btn img');
        downloadButtons.forEach(img => {
            if (img.alt.includes('Google Play')) {
                img.alt = this.translations.hero?.downloadGooglePlay || img.alt;
            } else if (img.alt.includes('App Store')) {
                img.alt = this.translations.hero?.downloadAppStore || img.alt;
            }
        });

        // Traduire le bouton "Retour à l'accueil"
        const backButton = document.querySelector('#back-to-home');
        if (backButton) {
            const iconElement = backButton.querySelector('i');
            if (iconElement) {
                backButton.innerHTML = iconElement.outerHTML + ' ' + group.backToHome;
            } else {
                backButton.textContent = group.backToHome;
            }
        }

        // Traduire les éléments HTML statiques
        const mainTitle = document.querySelector('#main-title');
        if (mainTitle && mainTitle.textContent.includes('Redirection vers l\'application')) {
            mainTitle.textContent = group.redirecting;
        }

        const mainDescription = document.querySelector('#main-description');
        if (mainDescription && mainDescription.textContent.includes('Vous allez être redirigé')) {
            mainDescription.textContent = group.redirectingDescription;
        }

        // Mettre à jour le titre de la page
        document.title = group.title + ' - Splitizy';
        
        // Mettre à jour la meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', group.description);
        }
    }

    translateAboutUsPage() {
        if (!window.location.pathname.includes('qui-sommes-nous')) return;

        const about = this.translations.aboutUs;
        if (!about) return;

        document.title = about.pageTitle;

        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle) breadcrumbTitle.textContent = about.breadcrumbTitle;
        const breadcrumbSpan = document.querySelector('.breadcrumb-list span');
        if (breadcrumbSpan) breadcrumbSpan.textContent = about.breadcrumbTitle;

        const storyP1 = document.querySelector('.about-us-description p:first-child');
        if (storyP1) storyP1.textContent = about.storyP1;

        const storyP2 = document.querySelector('.about-us-description p:nth-child(2)');
        if (storyP2) storyP2.textContent = about.storyP2;

        const gatienName = document.querySelector('[data-profile="gatien"] .profile-name');
        if (gatienName) gatienName.textContent = about.gatienName;

        const cedricName = document.querySelector('[data-profile="cedric"] .profile-name');
        if (cedricName) cedricName.textContent = about.cedricName;

        const gatienStoryTitle = document.querySelector('#profile-description-gatien .story-title');
        if (gatienStoryTitle) gatienStoryTitle.textContent = about.gatienStoryTitle;

        const cedricStoryTitle = document.querySelector('#profile-description-cedric .story-title');
        if (cedricStoryTitle) cedricStoryTitle.textContent = about.cedricStoryTitle;
        
        const gatienRole = document.querySelector('#profile-description-gatien h4');
        if (gatienRole) gatienRole.textContent = about.gatienRole;
        
        const cedricRole = document.querySelector('#profile-description-cedric h4');
        if (cedricRole) cedricRole.textContent = about.cedricRole;
        
        const gatienDescription = document.querySelector('#profile-description-gatien p');
        if (gatienDescription) gatienDescription.textContent = about.gatienDescription;

        const cedricDescription = document.querySelector('#profile-description-cedric p');
        if (cedricDescription) cedricDescription.textContent = about.cedricDescription;
    }

    translateImages() {
        // Localiser les boutons de téléchargement
        this.localizeDownloadButtons();
        
        // Localiser les images d'arrière-plan via le CSS injecté
        this.injectLocalizedCSS();
    }

    localizeDownloadButtons() {
        // Boutons Google Play
        const googlePlayImages = document.querySelectorAll('img[src*="stores/google-play"]');
        googlePlayImages.forEach(img => {
            const localizedPath = `assets/images/stores/google-play_${this.currentLanguage}.png`;
            this.checkImageExists(localizedPath).then(exists => {
                if (exists) {
                    img.src = localizedPath;
                }
            });
        });

        // Boutons App Store
        const appStoreImages = document.querySelectorAll('img[src*="stores/app-store"]');
        appStoreImages.forEach(img => {
            const localizedPath = `assets/images/stores/app-store_${this.currentLanguage}.png`;
            this.checkImageExists(localizedPath).then(exists => {
                if (exists) {
                    img.src = localizedPath;
                }
            });
        });

        // Images de features
        const featureImages = document.querySelectorAll('.feature-img img[src*="feature_1"]');
        featureImages.forEach(img => {
            const localizedPath = `assets/images/index/feature_1_${this.currentLanguage}.png`;
            this.checkImageExists(localizedPath).then(exists => {
                if (exists) {
                    img.src = localizedPath;
                }
            });
        });
    }



    // Fonction helper pour vérifier si une image existe
    async checkImageExists(imagePath) {
        try {
            const response = await fetch(imagePath, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }



    updateProSplitiziyLinks() {
        // Mettre à jour tous les liens vers pro.splitizy.com avec la langue actuelle
        const proLinks = document.querySelectorAll('a[href*="pro.splitizy.com"]');
        
        proLinks.forEach(link => {
            const currentHref = link.getAttribute('href');
            const url = new URL(currentHref);
            
            // Mettre à jour ou ajouter le paramètre lang
            url.searchParams.set('lang', this.currentLanguage);
            
            // Mettre à jour le lien
            link.setAttribute('href', url.toString());
        });
    }

    updatePageTitle() {
        const siteName = 'Splitizy';
        const currentPath = window.location.pathname;
        
        // Déterminer le type de page et le titre approprié
        let pageTitle = '';
        
        if (currentPath.includes('contact')) {
            const contactTitles = {
                'fr': `${siteName} - Contact`,
                'en': `${siteName} - Contact`,
                'nl': `${siteName} - Contact`
            };
            pageTitle = contactTitles[this.currentLanguage];
        } else if (currentPath.includes('404')) {
            const errorTitles = {
                'fr': `${siteName} - Page non trouvée`,
                'en': `${siteName} - Page Not Found`,
                'nl': `${siteName} - Pagina Niet Gevonden`
            };
            pageTitle = errorTitles[this.currentLanguage];
        } else if (currentPath.includes('faq')) {
            const faqTitles = {
                'fr': `${siteName} - Questions Fréquentes`,
                'en': `${siteName} - Frequently Asked Questions`,
                'nl': `${siteName} - Veelgestelde Vragen`
            };
            pageTitle = faqTitles[this.currentLanguage];
        } else if (currentPath.includes('politique-de-vie-privee')) {
            const privacyTitles = {
                'fr': `${siteName} - Politique de Vie Privée`,
                'en': `${siteName} - Privacy Policy`,
                'nl': `${siteName} - Privacybeleid`
            };
            pageTitle = privacyTitles[this.currentLanguage];
        } else if (currentPath.includes('suppression-donnees')) {
            const dataTitles = {
                'fr': `${siteName} - Suppression de vos données`,
                'en': `${siteName} - Data Removal`,
                'nl': `${siteName} - Gegevensverwijdering`
            };
            pageTitle = dataTitles[this.currentLanguage];
        } else if (currentPath.includes('conditions-licences-utilisation')) {
            const termsTitles = {
                'fr': `${siteName} - Conditions des Licences d'Utilisation`,
                'en': `${siteName} - Terms of Use`,
                'nl': `${siteName} - Gebruiksvoorwaarden`
            };
            pageTitle = termsTitles[this.currentLanguage];
        } else if (currentPath.includes('group.html')) {
            const groupTitles = {
                'fr': `${siteName} - Rejoindre un groupe`,
                'en': `${siteName} - Join a group`,
                'nl': `${siteName} - Deelnemen aan een groep`
            };
            pageTitle = groupTitles[this.currentLanguage];
        } else {
            // Page d'accueil par défaut
            const homeTitles = {
                'fr': `${siteName} - Inventoriez, Gérez et Partagez vos biens en toute sérénité`,
                'en': `${siteName} - Inventory, Manage and Share your assets with peace of mind`,
                'nl': `${siteName} - Inventariseer, Beheer en Deel uw goederen met gemoedsrust`
            };
            pageTitle = homeTitles[this.currentLanguage];
        }

        if (pageTitle) {
            document.title = pageTitle;
        }
    }

    addLanguageSelector() {
        // Vérifier si le sélecteur existe déjà
        if (document.querySelector('.language-selector')) return;

        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector';
        languageSelector.innerHTML = `
            <div class="language-dropdown">
                <button class="language-btn" aria-label="Changer de langue">
                    <span class="current-lang">${this.currentLanguage.toUpperCase()}</span>
                    <i class="icofont-caret-down"></i>
                </button>
                <div class="language-menu">
                    <a href="#" data-lang="fr" class="${this.currentLanguage === 'fr' ? 'active' : ''}">
                        <span class="flag"><img src="assets/images/flags/fr.png" alt="Français"></span> Français
                    </a>
                    <a href="#" data-lang="en" class="${this.currentLanguage === 'en' ? 'active' : ''}">
                        <span class="flag"><img src="assets/images/flags/en.png" alt="English"></span> English
                    </a>
                    <a href="#" data-lang="nl" class="${this.currentLanguage === 'nl' ? 'active' : ''}">
                        <span class="flag"><img src="assets/images/flags/nl.png" alt="Nederlands"></span> Nederlands
                    </a>
                </div>
            </div>
        `;

        // Ajouter le sélecteur dans le header (desktop)
        const headerRight = document.querySelector('.header-right');
        if (headerRight) {
            const li = document.createElement('li');
            li.className = 'd-none d-lg-block';
            li.appendChild(languageSelector);
            headerRight.insertBefore(li, headerRight.firstChild);
        }

        // Ajouter le sélecteur dans le menu mobile
        this.addMobileLanguageSelector();

        // Ajouter le sélecteur dans le footer
        this.addFooterLanguageSelector();

        // Ajouter les styles
        this.addLanguageSelectorStyles();

        // Ajouter les event listeners
        this.addLanguageSelectorEvents();
    }

    addMobileLanguageSelector() {
        // Vérifier si le sélecteur mobile existe déjà
        if (document.querySelector('.mobile-language-selector')) return;

        const mobileLanguageSelector = document.createElement('div');
        mobileLanguageSelector.className = 'mobile-language-selector';
        mobileLanguageSelector.innerHTML = `
            <div class="mobile-lang-title">Langue / Language / Taal</div>
            <div class="mobile-lang-options">
                <a href="#" data-lang="fr" class="mobile-lang-option ${this.currentLanguage === 'fr' ? 'active' : ''}">
                    <span class="flag"><img src="assets/images/flags/fr.png" alt="Français"></span> Français
                </a>
                <a href="#" data-lang="en" class="mobile-lang-option ${this.currentLanguage === 'en' ? 'active' : ''}">
                    <span class="flag"><img src="assets/images/flags/en.png" alt="English"></span> English
                </a>
                <a href="#" data-lang="nl" class="mobile-lang-option ${this.currentLanguage === 'nl' ? 'active' : ''}">
                    <span class="flag"><img src="assets/images/flags/nl.png" alt="Nederlands"></span> Nederlands
                </a>
            </div>
        `;

        // Ajouter dans le menu mobile (offcanvas) juste avant la navigation
        const offcanvasNav = document.querySelector('.header-offcanvas-nav');
        if (offcanvasNav) {
            offcanvasNav.parentNode.insertBefore(mobileLanguageSelector, offcanvasNav);
        }

        // Ajouter les event listeners pour le mobile
        this.addMobileLanguageSelectorEvents();
    }

    addMobileLanguageSelectorEvents() {
        const mobileLinks = document.querySelectorAll('.mobile-lang-option');
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.getAttribute('data-lang');
                
                // Changer la langue
                this.changeLanguage(lang);
                
                // Fermer le menu mobile
                const offcanvas = document.querySelector('#offcanvasWithBothOptions');
                if (offcanvas) {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                }
            });
        });
    }

    addFooterLanguageSelector() {
        // Vérifier si le sélecteur footer existe déjà
        if (document.querySelector('.footer-language-selector')) return;

        const footerLanguageSelector = document.createElement('div');
        footerLanguageSelector.className = 'footer-language-selector';
        footerLanguageSelector.innerHTML = `
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="footer-language-wrapper">
                            <div class="footer-language-dropdown">
                                <button class="footer-language-btn" aria-label="Changer de langue">
                                    <span class="flag"><img src="assets/images/flags/${this.currentLanguage}.png" alt="${this.currentLanguage.toUpperCase()}"></span>
                                    <span class="current-lang">${this.currentLanguage.toUpperCase()}</span>
                                    <i class="icofont-caret-down"></i>
                                </button>
                                <div class="footer-language-menu">
                                    <a href="#" data-lang="fr" class="footer-lang-option ${this.currentLanguage === 'fr' ? 'active' : ''}">
                                        <span class="flag"><img src="assets/images/flags/fr.png" alt="Français"></span> Français
                                    </a>
                                    <a href="#" data-lang="en" class="footer-lang-option ${this.currentLanguage === 'en' ? 'active' : ''}">
                                        <span class="flag"><img src="assets/images/flags/en.png" alt="English"></span> English
                                    </a>
                                    <a href="#" data-lang="nl" class="footer-lang-option ${this.currentLanguage === 'nl' ? 'active' : ''}">
                                        <span class="flag"><img src="assets/images/flags/nl.png" alt="Nederlands"></span> Nederlands
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Ajouter dans le footer entre .footer-upper-top et .footer-top
        const footerUpperTop = document.querySelector('.footer-upper-top');
        const footerTop = document.querySelector('.footer-top');
        
        if (footerUpperTop && footerTop) {
            footerUpperTop.parentNode.insertBefore(footerLanguageSelector, footerTop);
        }

        // Ajouter les event listeners pour le footer
        this.addFooterLanguageSelectorEvents();
    }

    addFooterLanguageSelectorEvents() {
        const footerDropdown = document.querySelector('.footer-language-dropdown');
        const footerBtn = document.querySelector('.footer-language-btn');
        const footerMenu = document.querySelector('.footer-language-menu');
        const footerLinks = document.querySelectorAll('.footer-lang-option');

        if (footerDropdown && footerBtn && footerMenu) {
            let isMenuOpen = false;
            let hideTimeout = null;

            // Fonction pour afficher le menu
            const showMenu = () => {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                footerMenu.classList.add('active');
                isMenuOpen = true;
            };

            // Fonction pour cacher le menu avec délai
            const hideMenu = (delay = 150) => {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                }
                hideTimeout = setTimeout(() => {
                    footerMenu.classList.remove('active');
                    isMenuOpen = false;
                    hideTimeout = null;
                }, delay);
            };

            // Fonction pour cacher le menu immédiatement
            const hideMenuImmediately = () => {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                footerMenu.classList.remove('active');
                isMenuOpen = false;
            };

            // Ouverture au survol du bouton
            footerBtn.addEventListener('mouseenter', () => {
                showMenu();
            });

            // Maintenir ouvert quand la souris est sur le bouton
            footerBtn.addEventListener('mouseleave', () => {
                hideMenu();
            });

            // Maintenir ouvert quand la souris est sur le menu
            footerMenu.addEventListener('mouseenter', () => {
                showMenu();
            });

            // Cacher quand la souris quitte le menu
            footerMenu.addEventListener('mouseleave', () => {
                hideMenu();
            });

            // Clic sur le bouton
            footerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (isMenuOpen) {
                    hideMenuImmediately();
                } else {
                    showMenu();
                }
            });

            // Fermer le menu si on clique ailleurs
            document.addEventListener('click', (e) => {
                if (!footerDropdown.contains(e.target)) {
                    hideMenuImmediately();
                }
            });

            // Empêcher la fermeture du menu quand on clique dessus (sauf sur les liens)
            footerMenu.addEventListener('click', (e) => {
                if (!e.target.matches('a')) {
                    e.stopPropagation();
                }
            });
        }

        // Gestion des clics sur les liens
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const lang = link.getAttribute('data-lang');
                
                // Fermer le menu immédiatement après sélection
                if (footerMenu) {
                    footerMenu.classList.remove('active');
                }
                
                // Changer la langue
                this.changeLanguage(lang);
            });
        });
    }

    addLanguageSelectorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Styles pour le sélecteur de langue */
            .language-selector {
                position: relative;
                display: inline-block;
            }
            
            .language-btn {
                background: none;
                border: 1px solid var(--splitizy-primary);
                color: var(--splitizy-primary);
                padding: 8px 10px;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.3s ease;
                width: 60px;
                justify-content: center;
            }
            
            .language-btn:hover {
                background-color: var(--splitizy-primary);
                color: white;
            }
            
            .language-dropdown {
                position: relative;
            }
            
            .language-dropdown:hover .language-menu,
            .language-menu:hover {
                display: block;
            }
            
            .language-menu {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                min-width: 160px;
                z-index: 1000;
                display: none;
                margin-top: 2px;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.2s ease;
                pointer-events: none;
            }
            
            .language-menu.active {
                display: block;
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }
            
            .language-menu a {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 12px;
                color: #333 !important;
                text-decoration: none;
                transition: all 0.3s ease;
                font-size: 14px;
            }
            
            .language-menu a:hover {
                background-color: #f8f9fa;
                color: #333 !important;
            }
            
            .language-menu a.active {
                background-color: var(--splitizy-primary);
                color: white !important;
            }
            
            .language-menu a.active:hover {
                background-color: var(--splitizy-secondary);
                color: white !important;
            }
            
            .flag {
                font-size: 16px;
            }
            
            .flag img {
                width: 20px;
                height: 15px;
                object-fit: cover;
                border-radius: 2px;
            }
            
            .current-lang {
                font-size: 15px;
                font-weight: 600;
            }
            
            .language-btn i {
                font-size: 10px;
                margin-left: 2px;
            }
            
            /* Styles pour le sélecteur de langue mobile */
            .mobile-language-selector {
                padding: 20px 15px;
                border-bottom: 1px solid #eee;
                margin-bottom: 15px;
            }
            
            .mobile-lang-title {
                font-size: 14px;
                font-weight: 600;
                color: var(--splitizy-primary);
                margin-bottom: 12px;
                text-align: center;
            }
            
            .mobile-lang-options {
                display: flex;
                justify-content: space-around;
                gap: 10px;
            }
            
            .mobile-lang-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
                padding: 10px 8px;
                border-radius: 8px;
                text-decoration: none;
                color: #666 !important;
                transition: all 0.3s ease;
                font-size: 12px;
                min-width: 70px;
                text-align: center;
            }
            
            .mobile-lang-option:hover {
                background-color: #f8f9fa;
                color: #333 !important;
            }
            
            .mobile-lang-option.active {
                background-color: var(--splitizy-primary);
                color: white !important;
            }
            
            .mobile-lang-option .flag {
                font-size: 20px;
            }
            
            .mobile-lang-option .flag img {
                width: 24px;
                height: 18px;
                object-fit: cover;
                border-radius: 3px;
            }
            
            /* Styles pour le sélecteur de langue du footer */
            .footer-language-selector {
                padding: 20px 0;
                border-top: 1px solid rgba(255,255,255,0.1);
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .footer-language-wrapper {
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            
            .footer-language-dropdown {
                position: relative;
                display: inline-block;
            }
            
            .footer-language-btn {
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                color: #333;
                padding: 12px 16px;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.3s ease;
                min-width: 120px;
                justify-content: center;
            }
            
            .footer-language-btn:hover {
                background: rgba(255,255,255,0.2);
                border-color: rgba(255,255,255,0.3);
                color: #333;
            }
            
            .footer-language-dropdown:hover .footer-language-menu {
                display: block;
            }
            
            .footer-language-menu {
                position: absolute;
                bottom: 100%;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                box-shadow: 0 -4px 15px rgba(0,0,0,0.15);
                min-width: 160px;
                z-index: 1000;
                display: none;
                margin-bottom: 5px;
            }
            
            .footer-language-menu.active {
                display: block;
            }
            
            .footer-lang-option {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 14px;
                color: #333 !important;
                text-decoration: none;
                transition: all 0.3s ease;
                font-size: 14px;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .footer-lang-option:last-child {
                border-bottom: none;
            }
            
            .footer-lang-option:hover {
                background-color: #f8f9fa;
                color: #333 !important;
            }
            
            .footer-lang-option.active {
                background-color: var(--splitizy-primary);
                color: white !important;
            }
            
            .footer-lang-option.active:hover {
                background-color: var(--splitizy-secondary);
                color: white !important;
            }
            
            .footer-language-btn .flag img {
                width: 20px;
                height: 15px;
                object-fit: cover;
                border-radius: 2px;
            }
            
            .footer-lang-option .flag img {
                width: 20px;
                height: 15px;
                object-fit: cover;
                border-radius: 2px;
            }
            
            .footer-language-btn .current-lang {
                font-size: 14px;
                font-weight: 600;
            }
            
            .footer-language-btn i {
                font-size: 11px;
                margin-left: 2px;
            }
            
            @media (max-width: 768px) {
                .footer-language-wrapper {
                    justify-content: center;
                }
                
                .footer-language-btn {
                    min-width: 100px;
                    padding: 10px 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addLanguageSelectorEvents() {
        const dropdown = document.querySelector('.language-dropdown');
        const btn = document.querySelector('.language-btn');
        const menu = document.querySelector('.language-menu');
        const links = document.querySelectorAll('.language-menu a');

        if (dropdown && btn && menu) {
            let isMenuOpen = false;
            let hideTimeout = null;

            // Fonction pour afficher le menu
            const showMenu = () => {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                menu.classList.add('active');
                isMenuOpen = true;
            };

            // Fonction pour cacher le menu avec délai
            const hideMenu = (delay = 150) => {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                }
                hideTimeout = setTimeout(() => {
                    menu.classList.remove('active');
                    isMenuOpen = false;
                    hideTimeout = null;
                }, delay);
            };

            // Fonction pour cacher le menu immédiatement
            const hideMenuImmediately = () => {
                if (hideTimeout) {
                    clearTimeout(hideTimeout);
                    hideTimeout = null;
                }
                menu.classList.remove('active');
                isMenuOpen = false;
            };

            // Ouverture au survol du bouton
            btn.addEventListener('mouseenter', () => {
                showMenu();
            });

            // Maintenir ouvert quand la souris est sur le bouton
            btn.addEventListener('mouseleave', () => {
                hideMenu();
            });

            // Maintenir ouvert quand la souris est sur le menu
            menu.addEventListener('mouseenter', () => {
                showMenu();
            });

            // Cacher quand la souris quitte le menu
            menu.addEventListener('mouseleave', () => {
                hideMenu();
            });

            // Clic sur le bouton (pour mobile et desktop)
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (isMenuOpen) {
                    hideMenuImmediately();
                } else {
                    showMenu();
                }
            });

            // Fermer le menu si on clique ailleurs
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    hideMenuImmediately();
                }
            });

            // Empêcher la fermeture du menu quand on clique dessus (sauf sur les liens)
            menu.addEventListener('click', (e) => {
                if (!e.target.matches('a')) {
                    e.stopPropagation();
                }
            });
        }

        // Gestion des clics sur les liens
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const lang = link.getAttribute('data-lang');
                
                // Fermer le menu immédiatement après sélection
                const menu = document.querySelector('.language-menu');
                if (menu) {
                    menu.classList.remove('active');
                }
                
                // Changer la langue
                this.changeLanguage(lang);
            });
        });
    }

    async changeLanguage(lang) {
        if (lang === this.currentLanguage) return;

        this.currentLanguage = lang;
        
        // Sauvegarder la préférence
        localStorage.setItem('splitizy_language', lang);
        
        // Charger les nouvelles traductions
        await this.loadTranslations();
        
        // Forcer la réapplication de toutes les traductions
        this.forceApplyTranslations();
        
        // Mettre à jour le sélecteur
        this.updateLanguageSelector();
        
        // Mettre à jour l'URL
        this.updateURL();
        
        // Réappliquer la localisation des images après changement de langue
        this.translateImages();
    }

    updateLanguageSelector() {
        // Mettre à jour le sélecteur desktop
        const currentLangSpan = document.querySelector('.current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = this.currentLanguage.toUpperCase();
        }

        const desktopLinks = document.querySelectorAll('.language-menu a');
        desktopLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-lang') === this.currentLanguage) {
                link.classList.add('active');
            }
        });

        // Mettre à jour le sélecteur mobile
        const mobileLinks = document.querySelectorAll('.mobile-lang-option');
        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-lang') === this.currentLanguage) {
                link.classList.add('active');
            }
        });

        // Mettre à jour le sélecteur footer
        const footerCurrentLangSpan = document.querySelector('.footer-language-btn .current-lang');
        if (footerCurrentLangSpan) {
            footerCurrentLangSpan.textContent = this.currentLanguage.toUpperCase();
        }

        const footerFlag = document.querySelector('.footer-language-btn .flag img');
        if (footerFlag) {
            footerFlag.src = `assets/images/flags/${this.currentLanguage}.png`;
            footerFlag.alt = this.currentLanguage.toUpperCase();
        }

        const footerLinks = document.querySelectorAll('.footer-lang-option');
        footerLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-lang') === this.currentLanguage) {
                link.classList.add('active');
            }
        });
    }

    updateURL() {
        const url = new URL(window.location);
        url.searchParams.set('lang', this.currentLanguage);
        window.history.replaceState({}, '', url);
    }

    forceApplyTranslations() {
        // Mettre à jour l'attribut lang du HTML
        document.documentElement.lang = this.currentLanguage;
        
        // Appliquer les traductions par section - version forcée sans conditions de pathname
        this.translateNavigation();
        this.translateHero();
        this.translateFeatures();
        this.translateTrial();
        this.translateDistribution();
        this.translateVideo();
        this.translatePricing();
        this.translateTestimonials();
        this.translateFAQ();
        this.translateNewsletter();
        this.translateFooter();
        this.translateBreadcrumb();
        this.translateContact();
        this.forceTranslate404();
        this.forceTranslatePrivacyPolicy();
        this.forceTranslateDataRemoval();
        this.forceTranslateTerms();
        this.forceTranslateFAQ();
        this.translateGroup();
        this.translateAboutUsPage();
        
        // Traduire les images selon la langue
        this.translateImages();
        
        // Injecter le CSS dynamique pour les images avec !important
        this.injectLocalizedCSS();
        
        // Mettre à jour les liens pro.splitizy.com avec la langue actuelle
        this.updateProSplitiziyLinks();
        
        // Mettre à jour les titres de page
        this.updatePageTitle();
    }

    forceTranslate404() {
        const error404 = this.translations.error404;
        if (!error404) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle && (breadcrumbTitle.textContent.includes('404') || breadcrumbTitle.textContent.includes('non trouvé') || breadcrumbTitle.textContent.includes('Not Found') || breadcrumbTitle.textContent.includes('Niet Gevonden'))) {
            breadcrumbTitle.textContent = error404.breadcrumbTitle;
        }

        // Titre principal de l'erreur
        const errorTitle = document.querySelector('.error-404-content .title');
        if (errorTitle) errorTitle.textContent = error404.errorTitle;

        // Description de l'erreur
        const errorDesc = document.querySelector('.error-404-content .desc');
        if (errorDesc) errorDesc.textContent = error404.errorDescription;

        // Bouton de retour
        const backBtn = document.querySelector('.error-404-content .btn');
        if (backBtn) {
            // Chercher le nœud texte dans les enfants
            let textNode = null;
            for (let node of backBtn.childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                    textNode = node;
                    break;
                }
            }
            
            if (textNode) {
                textNode.textContent = ` ${error404.backButton}`;
            } else {
                // Si pas de nœud texte trouvé, remplacer tout le contenu en gardant l'icône
                backBtn.innerHTML = `<i class="icofont-long-arrow-left"></i> ${error404.backButton}`;
            }
        }
    }

    forceTranslatePrivacyPolicy() {
        const privacy = this.translations.privacy;
        if (!privacy) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle && (breadcrumbTitle.textContent.includes('Politique') || breadcrumbTitle.textContent.includes('Privacy') || breadcrumbTitle.textContent.includes('Privacybeleid'))) {
            breadcrumbTitle.textContent = privacy.breadcrumbTitle;
        }

        // Breadcrumb span
        const breadcrumbSpan = document.querySelector('.breadcrumb-list span');
        if (breadcrumbSpan && (breadcrumbSpan.textContent.includes('Politique') || breadcrumbSpan.textContent.includes('Privacy') || breadcrumbSpan.textContent.includes('Privacybeleid'))) {
            breadcrumbSpan.textContent = privacy.breadcrumbTitle;
        }

        // Date de mise à jour dans le header
        const lastUpdatedElement = document.querySelector('.legal-header .text-muted');
        if (lastUpdatedElement) {
            lastUpdatedElement.innerHTML = `<strong>${privacy.lastUpdated}</strong>`;
        }

        // Date de mise à jour en bas de page
        const lastUpdatedBottom = document.querySelector('.text-center .text-muted small strong');
        if (lastUpdatedBottom) {
            lastUpdatedBottom.textContent = privacy.lastUpdated;
        }

        // Appliquer toutes les traductions de sections si on est sur la page privacy
        if (window.location.pathname.includes('politique-de-vie-privee')) {
            this.translatePrivacyPolicy();
        }

        // Mettre à jour le titre de la page
        if (document.title.includes('Politique') || document.title.includes('Privacy') || document.title.includes('Privacybeleid')) {
            document.title = privacy.title + ' - Splitizy';
        }
    }

    forceTranslateDataRemoval() {
        const dataRemoval = this.translations.dataRemoval;
        if (!dataRemoval) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle && (breadcrumbTitle.textContent.includes('Suppression') || breadcrumbTitle.textContent.includes('Removal') || breadcrumbTitle.textContent.includes('verwijdering'))) {
            breadcrumbTitle.textContent = dataRemoval.breadcrumbTitle;
        }

        // Breadcrumb span
        const breadcrumbSpan = document.querySelector('.breadcrumb-list span');
        if (breadcrumbSpan && (breadcrumbSpan.textContent.includes('Suppression') || breadcrumbSpan.textContent.includes('Removal') || breadcrumbSpan.textContent.includes('verwijdering'))) {
            breadcrumbSpan.textContent = dataRemoval.breadcrumbTitle;
        }

        // Sous-titre principal
        const subtitle = document.querySelector('.legal-header .text-muted');
        if (subtitle) subtitle.innerHTML = `<strong>${dataRemoval.subtitle}</strong>`;

        // Date de mise à jour en bas de page
        const lastUpdatedBottom = document.querySelector('.text-center .text-muted small strong');
        if (lastUpdatedBottom) {
            if (this.currentLanguage === 'fr') {
                lastUpdatedBottom.textContent = 'Guide mis à jour : Juin 2025';
            } else if (this.currentLanguage === 'en') {
                lastUpdatedBottom.textContent = 'Guide updated: June 2025';
            } else if (this.currentLanguage === 'nl') {
                lastUpdatedBottom.textContent = 'Gids bijgewerkt: Juni 2025';
            }
        }

        // Appliquer toutes les traductions de sections si on est sur la page data removal
        if (window.location.pathname.includes('suppression-donnees')) {
            this.translateDataRemoval();
        }

        // Mettre à jour le titre de la page
        if (document.title.includes('Suppression') || document.title.includes('Removal') || document.title.includes('verwijdering')) {
            document.title = dataRemoval.title + ' - Splitizy';
        }
    }

    forceTranslateTerms() {
        const terms = this.translations.terms;
        if (!terms) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle && (breadcrumbTitle.textContent.includes('Conditions') || breadcrumbTitle.textContent.includes('Terms') || breadcrumbTitle.textContent.includes('Gebruiksvoorwaarden'))) {
            breadcrumbTitle.textContent = terms.breadcrumbTitle;
        }

        // Breadcrumb span
        const breadcrumbSpan = document.querySelector('.breadcrumb-list span');
        if (breadcrumbSpan && (breadcrumbSpan.textContent.includes('Conditions') || breadcrumbSpan.textContent.includes('Terms') || breadcrumbSpan.textContent.includes('Gebruiksvoorwaarden'))) {
            breadcrumbSpan.textContent = terms.breadcrumbSpan;
        }

        // Date de mise à jour dans le header
        const lastUpdatedElement = document.querySelector('.legal-header .text-muted');
        if (lastUpdatedElement) {
            lastUpdatedElement.innerHTML = `<strong>${terms.lastUpdated}</strong>`;
        }

        // Date de mise à jour en bas de page
        const lastUpdatedBottom = document.querySelector('.text-center .text-muted small strong');
        if (lastUpdatedBottom) {
            lastUpdatedBottom.textContent = terms.lastUpdated;
        }

        // Appliquer toutes les traductions de sections si on est sur la page terms
        if (window.location.pathname.includes('conditions-licences-utilisation')) {
            this.translateTerms();
        }

        // Mettre à jour le titre de la page
        if (document.title.includes('Conditions') || document.title.includes('Terms') || document.title.includes('Gebruiksvoorwaarden')) {
            document.title = terms.title + ' - Splitizy';
        }
    }

    forceTranslateFAQ() {
        const faq = this.translations.faq;
        if (!faq) return;

        // Breadcrumb title
        const breadcrumbTitle = document.querySelector('.breadcrumb-title');
        if (breadcrumbTitle && (breadcrumbTitle.textContent.includes('FAQ') || breadcrumbTitle.textContent.includes('Questions') || breadcrumbTitle.textContent.includes('Vragen'))) {
            breadcrumbTitle.textContent = faq.breadcrumbTitle;
        }

        // Appliquer toutes les traductions de sections si on est sur la page FAQ
        if (window.location.pathname.includes('faq.html')) {
            this.translateFAQPage();
        }

        // Mettre à jour le titre de la page
        if (document.title.includes('FAQ') || document.title.includes('Questions') || document.title.includes('Vragen')) {
            document.title = faq.title + ' - Splitizy';
        }
    }

    // Méthode pour injecter du CSS dynamique pour les images hero selon la langue
    injectLocalizedCSS() {
        const lang = this.currentLanguage;
        
        // Supprimer le CSS précédent s'il existe
        if (this.lastInjectedCSS) {
            this.lastInjectedCSS.remove();
            this.lastInjectedCSS = null;
        }
        
        // Créer le nouveau CSS
        const style = document.createElement('style');
        style.id = 'splitizy-localized-css';
        
        const css = `
            /* CSS dynamique pour les images hero localisées */
            .hero-bg.hero-style-4 {
                background-image: url('assets/images/index/header_1_${lang}.png') !important;
            }
            
            @media (max-width: 363px) {
                .hero-bg.hero-style-4 {
                    background-image: url('assets/images/index/header_1_mobile_${lang}.png') !important;
                }
            }
            
            /* CSS pour la section de répartition */
            .banner-style-8 {
                background-image: url('assets/images/index/feature_2_${lang}.png') !important;
            }
            
            /* CSS pour les newsletters */
            .newsletter-bg {
                background-image: url('assets/images/newsletter_1_${lang}.png') !important;
            }
        `;
        
        style.textContent = css;
        document.head.appendChild(style);
        this.lastInjectedCSS = style;
        
        // Fallback vers les images par défaut si les versions localisées n'existent pas
        this.checkAndFallbackImages(lang);
    }
    
    // Vérifier l'existence des images et utiliser les versions par défaut si nécessaire
    async checkAndFallbackImages(lang) {
        const imagesToCheck = [
            { path: `assets/images/index/header_1_${lang}.png`, fallback: 'assets/images/index/header_1.png' },
            { path: `assets/images/index/header_1_mobile_${lang}.png`, fallback: 'assets/images/index/header_1_mobile.png' },
            { path: `assets/images/index/feature_2_${lang}.png`, fallback: 'assets/images/index/feature_2.png' },
            { path: `assets/images/newsletter_1_${lang}.png`, fallback: 'assets/images/newsletter_1.png' }
        ];
        
        for (const image of imagesToCheck) {
            const exists = await this.checkImageExists(image.path);
            if (!exists) {
                // Utiliser l'image par défaut
                const fallbackCSS = this.lastInjectedCSS.textContent.replace(image.path, image.fallback);
                this.lastInjectedCSS.textContent = fallbackCSS;
            }
        }
    }
}

// Initialiser le système de traduction quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new I18nManager();
});