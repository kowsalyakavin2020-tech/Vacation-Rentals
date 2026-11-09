// Lenis
const lenis = new Lenis({
    lerp: 0.09,
    smoothWheel: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP
gsap.registerPlugin(ScrollTrigger);
lenis.on('scroll', ScrollTrigger.update);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Active navigation
function syncActiveNav() {
    const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const links = document.querySelectorAll('.nav-link, .mobile-link');

    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const active = href.split('#')[0].split('/').pop().toLowerCase() === page;

        link.classList.toggle('is-active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

syncActiveNav();
window.addEventListener('hashchange', syncActiveNav);

// Header
const header = document.querySelector('.header');

function updateHeader() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 80);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    lenis.stop();
}

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    lenis.start();
}

if (hamburger) {
    hamburger.addEventListener('click', openMobileMenu);
}

if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
}

mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
});

// Enquiry form
const enquiryForm = document.getElementById('ctForm');

if (enquiryForm) {
    const formNote = document.getElementById('ctFormNote');
    const defaultNote = formNote ? formNote.textContent : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const fieldError = (field, message) => {
        const wrapper = field.type === 'checkbox' ? field.closest('.ct-consent') : field.closest('.ct-field');
        const error = enquiryForm.querySelector(`[data-error-for="${field.id}"]`);

        field.setAttribute('aria-invalid', 'true');
        if (wrapper) wrapper.classList.add('has-error');
        if (error) error.textContent = message;
    };

    const clearFieldError = (field) => {
        const wrapper = field.type === 'checkbox' ? field.closest('.ct-consent') : field.closest('.ct-field');
        const error = enquiryForm.querySelector(`[data-error-for="${field.id}"]`);

        field.removeAttribute('aria-invalid');
        if (wrapper) wrapper.classList.remove('has-error');
        if (error) error.textContent = '';
    };

    const setFormNote = (state, message) => {
        if (!formNote) return;
        formNote.classList.toggle('has-error', state === 'error');
        formNote.classList.toggle('is-success', state === 'success');
        formNote.textContent = message;
    };

    const namePattern = /^[A-Za-z]+$/;
    const emptyMessages = {
        ctName: 'Please enter your name.',
        ctEmail: 'Please enter your email address.',
        ctDestination: 'Please select an option.',
        ctDates: 'Please tell us when you are thinking of travelling.',
        ctMessage: 'Please tell us a little more.'
    };

    const validateField = (field) => {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();

        if (field.type === 'checkbox') {
            if (!value) {
                fieldError(field, 'Please tick the consent checkbox to continue.');
                return false;
            }

            clearFieldError(field);
            return true;
        }

        if (!value) {
            fieldError(field, emptyMessages[field.id] || 'This field is required.');
            return false;
        }

        if (field.dataset.type === 'name' && !namePattern.test(value)) {
            fieldError(field, 'Please enter your name using alphabets only.');
            return false;
        }

        if (field.dataset.type === 'email' && !emailPattern.test(value)) {
            fieldError(field, 'Please enter a valid email address.');
            return false;
        }

        clearFieldError(field);
        return true;
    };

    enquiryForm.querySelectorAll('[data-required]').forEach((field) => {
        const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';

        field.addEventListener(eventName, () => {
            if (field.getAttribute('aria-invalid') === 'true') {
                clearFieldError(field);
            }
        });
    });

    enquiryForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let firstInvalid = null;

        enquiryForm.querySelectorAll('[data-required]').forEach((field) => {
            if (!validateField(field) && !firstInvalid) {
                firstInvalid = field;
            }
        });

        if (firstInvalid) {
            firstInvalid.focus({ preventScroll: false });
            setFormNote('error', 'Please check the highlighted details and try again.');
            return;
        }

        window.location.href = '404.html';
    });

    if (formNote) {
        formNote.dataset.default = defaultNote;
    }
}

// FAQ accordion
const faqItems = document.querySelectorAll('.ct-faq-item');

faqItems.forEach((item) => {
    const button = item.querySelector('button');
    if (!button) return;

    button.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');

        faqItems.forEach((entry) => {
            entry.classList.remove('is-open');
            const entryButton = entry.querySelector('button');
            if (entryButton) entryButton.setAttribute('aria-expanded', 'false');
        });

        if (willOpen) {
            item.classList.add('is-open');
            button.setAttribute('aria-expanded', 'true');
        }
    });
});

// Smooth anchors
function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            closeMobileMenu();
            lenis.scrollTo(target, {
                offset: -72,
                duration: 1.2
            });
        });
    });
}

// Preloader
window.addEventListener('load', () => {
    gsap.to('#preloader', {
        opacity: 0,
        duration: 0.9,
        delay: 1.1,
        ease: 'power2.inOut',
        onComplete: () => {
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.style.display = 'none';
            initAnimations();
        }
    });
});

function initAnimations() {
    initAnchors();

    if (!reduceMotion) {
        heroAnimations();
        sectionAnimations();
    }

    window.setTimeout(() => ScrollTrigger.refresh(), 300);
}

function heroAnimations() {
    const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    timeline
        .from('.ct-hero-inner > *', {
            y: 34,
            autoAlpha: 0,
            duration: 1,
            stagger: 0.12
        });

    gsap.to('.ct-hero-bg img', {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ct-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

function sectionAnimations() {
    document.querySelectorAll('[data-reveal]').forEach((element) => {
        if (element.closest('.ct-hero')) return;

        gsap.from(element, {
            y: 34,
            autoAlpha: 0,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 86%'
            }
        });
    });

    document.querySelectorAll('[data-reveal-img]').forEach((element) => {
        gsap.from(element, {
            y: 38,
            autoAlpha: 0,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: element,
                start: 'top 88%'
            }
        });
    });

    gsap.from('.ct-line-card', {
        y: 44,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.ct-line-grid',
            start: 'top 82%'
        }
    });

    gsap.from('.ct-step', {
        y: 50,
        autoAlpha: 0,
        duration: 0.95,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.ct-process-grid',
            start: 'top 82%'
        }
    });

    gsap.from('.ct-dest', {
        y: 40,
        autoAlpha: 0,
        duration: 0.95,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.ct-dest-mosaic',
            start: 'top 84%'
        }
    });

    gsap.to('.ct-cta-bg img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ct-cta',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}
