// Lenis
const lenis = new Lenis({
    lerp: 0.08,
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

// Active navigation
function syncActiveNav() {
    const page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const hash = window.location.hash;
    const links = document.querySelectorAll('.nav-link, .mobile-link');
    let matched = false;

    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        let active = false;

        if (href.startsWith('#')) {
            active = page === 'index.html' && (hash ? href === hash : href === '#home');
        } else {
            active = href.split('#')[0].split('/').pop().toLowerCase() === page;
        }

        if (active) matched = true;
        link.classList.toggle('is-active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    if (!matched && page === 'index.html') {
        links.forEach((link) => {
            const isHome = link.getAttribute('href') === '#home';
            link.classList.toggle('is-active', isHome);
            if (isHome) {
                link.setAttribute('aria-current', 'page');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }
}

syncActiveNav();
window.addEventListener('hashchange', syncActiveNav);

// Header
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 90) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        lenis.stop();
    });
}

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
    lenis.start();
}

if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
}

mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
});

// Preloader
window.addEventListener('load', () => {
    gsap.to('#preloader', {
        opacity: 0,
        duration: 1,
        delay: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.style.display = 'none';
            initAnimations();
        }
    });
});

function initAnimations() {
    heroAnimations();
    introAnimations();
    ritualAnimations();
    seaAnimations();
    tableAnimations();
    darkAnimations();
    makerAnimations();
    seasonAnimations();
    notesAnimations();
    planAnimations();

    seaInteractions();
    noteInteractions();

    ScrollTrigger.refresh();
}

/* =========================================================
   HERO - layered reveal, floating collage, background drift
   ========================================================= */

function heroAnimations() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const compactHero = window.matchMedia('(max-width: 900px)').matches;

    heroTl
        .from('.ex-hero-bg img', { scale: 1.15, duration: 1.6, ease: 'power2.out' })
        .from('.ex-hero-copy > .section-subtitle', { opacity: 0, y: 24, duration: 0.8 }, '-=1.2')
        .from('.ex-hero-line > span, .ex-hero-line > em', {
            yPercent: 120,
            duration: 1.1,
            stagger: 0.1,
            ease: 'power4.out'
        }, '-=0.55')
        .from('.ex-hero-text', { opacity: 0, y: 26, duration: 0.8 }, '-=0.55')
        .from('.ex-hero-actions', { opacity: 0, y: 22, duration: 0.7 }, '-=0.5')
        .from('.ex-hero-card', {
            opacity: 0,
            y: compactHero ? 0 : 60,
            scale: compactHero ? 1 : 0.92,
            duration: 1,
            stagger: 0.12
        }, '-=0.75')
        .from('.ex-hero-foot > *', { opacity: 0, y: compactHero ? 0 : 16, duration: 0.7, stagger: 0.1 }, '-=0.5');

    gsap.to('.ex-hero-bg img', {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ex-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

/* =========================================================
   PHILOSOPHY - curtain strips and editorial copy
   ========================================================= */

function introAnimations() {
    gsap.from('.ex-intro-head > *', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-intro-head', start: 'top 84%' }
    });

    gsap.fromTo('.ex-strip-media', {
        clipPath: 'inset(0 0 100% 0)'
    }, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        stagger: 0.14,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.ex-intro-strips', start: 'top 82%' }
    });

    gsap.from('.ex-strip figcaption', {
        opacity: 0,
        y: 18,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-intro-strips', start: 'top 78%' }
    });

    gsap.from('.ex-intro-foot > *', {
        opacity: 0,
        y: 16,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-intro-foot', start: 'top 92%' }
    });
}

/* =========================================================
   RITUALS - expanding image panels
   ========================================================= */

function ritualAnimations() {
    gsap.from('.ex-rituals-head > *', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-rituals-head', start: 'top 84%' }
    });

    gsap.from('.ex-ritual', {
        opacity: 0,
        y: 60,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-ritual-row', start: 'top 82%' }
    });

    gsap.from('.ex-rituals-hint', {
        opacity: 0,
        y: 12,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-ritual-row', start: 'top 60%' }
    });
}

/* =========================================================
   SEA - split visual with hover-swapped routes
   ========================================================= */

function seaAnimations() {
    gsap.from('.ex-sea-head > *', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-sea-head', start: 'top 84%' }
    });

    gsap.fromTo('.ex-sea-main', {
        clipPath: 'inset(0 0 0 100%)'
    }, {
        clipPath: 'inset(0 0 0 0%)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.ex-sea-visual', start: 'top 82%' }
    });

    gsap.from('.ex-sea-small', {
        opacity: 0,
        scale: 0.82,
        duration: 0.9,
        stagger: 0.14,
        delay: 0.2,
        ease: 'back.out(1.5)',
        scrollTrigger: { trigger: '.ex-sea-visual', start: 'top 78%' }
    });

    gsap.from('.ex-sea-item', {
        opacity: 0,
        x: 32,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-sea-list', start: 'top 82%' }
    });

    gsap.to('.ex-sea-main > img', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ex-sea-visual',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

function seaInteractions() {
    const items = Array.from(document.querySelectorAll('.ex-sea-item'));
    const image = document.getElementById('exSeaImage');
    const place = document.getElementById('exSeaPlace');
    const title = document.getElementById('exSeaTitle');

    if (!items.length || !image || !place || !title) return;

    let current = 0;

    const selectRoute = (item) => {
        const index = items.indexOf(item);
        if (index === current) return;
        current = index;

        items.forEach((entry) => entry.classList.toggle('is-active', entry === item));

        gsap.to(image, {
            opacity: 0,
            scale: 1.05,
            duration: 0.28,
            ease: 'power2.in',
            onComplete: () => {
                const nextImage = item.getAttribute('data-img');
                const nextPlace = item.getAttribute('data-place') || '';
                const nextTitle = item.getAttribute('data-title') || '';

                image.setAttribute('src', nextImage);
                image.setAttribute('alt', nextTitle);
                place.textContent = nextPlace;
                title.textContent = nextTitle;

                gsap.fromTo(image,
                    { opacity: 0, scale: 1.08 },
                    { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
                );
            }
        });

        gsap.fromTo([place, title],
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.12 }
        );
    };

    items.forEach((item) => {
        item.addEventListener('mouseenter', () => selectRoute(item));
        item.addEventListener('click', () => selectRoute(item));
    });
}

/* =========================================================
   TABLE - editorial long-lunch ledger
   ========================================================= */

function tableAnimations() {
    gsap.from('.ex-table-head > *', {
        opacity: 0,
        y: 34,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-table-head', start: 'top 84%' }
    });

    gsap.fromTo('.ex-table-hero', {
        clipPath: 'inset(0 100% 0 0)'
    }, {
        clipPath: 'inset(0 0 0 0)',
        duration: 1.25,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.ex-table-hero', start: 'top 82%' }
    });

    gsap.from('.ex-table-hero img', {
        scale: 1.12,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-table-hero', start: 'top 82%' }
    });

    gsap.from('.ex-dish', {
        opacity: 0,
        x: 42,
        duration: 0.8,
        stagger: 0.11,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-table-menu', start: 'top 82%' }
    });

    gsap.from('.ex-dish-thumb', {
        opacity: 0,
        scale: 0.82,
        duration: 0.7,
        stagger: 0.1,
        delay: 0.25,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.ex-table-menu', start: 'top 78%' }
    });

    gsap.from('.ex-table-foot > *', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-table-foot', start: 'top 92%' }
    });

    gsap.to('.ex-table-hero img', {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ex-table',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

/* =========================================================
   AFTER DARK - image curtain reveal
   ========================================================= */

function darkAnimations() {
    gsap.fromTo('.ex-dark-visual', {
        clipPath: 'inset(0 0 100% 0)'
    }, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.ex-dark-visual', start: 'top 82%' }
    });

    gsap.from('.ex-dark-copy > *', {
        opacity: 0,
        y: 34,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-dark-copy', start: 'top 82%' }
    });

    gsap.to('.ex-dark-img--day', {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ex-dark',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.ex-dark-img--night', {
        yPercent: 5,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ex-dark',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

/* =========================================================
   MAKERS - staggered mosaic
   ========================================================= */

function makerAnimations() {
    gsap.from('.ex-makers-head > *', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-makers-head', start: 'top 84%' }
    });

    gsap.from('.ex-maker', {
        opacity: 0,
        y: 80,
        rotation: (index) => (index % 2 === 0 ? -3 : 3),
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.ex-maker-grid', start: 'top 82%' }
    });
}

/* =========================================================
   SEASONS - horizontal rail and chapter reveals
   ========================================================= */

function seasonAnimations() {
    gsap.from('.ex-seasons-head > *', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-seasons-head', start: 'top 84%' }
    });

    gsap.to('.ex-season-line span', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ex-season-rail',
            start: 'top 82%',
            end: 'bottom 55%',
            scrub: 1
        }
    });

    gsap.from('.ex-season', {
        opacity: 0,
        y: 60,
        duration: 0.95,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-season-rail', start: 'top 82%' }
    });

    gsap.fromTo('.ex-season figure', {
        clipPath: 'inset(0 0 100% 0)'
    }, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1,
        stagger: 0.13,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.ex-season-rail', start: 'top 80%' }
    });
}

/* =========================================================
   GUEST NOTES - photo stack and quote switching
   ========================================================= */

function notesAnimations() {
    gsap.from('.ex-notes-stack', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-notes-stack', start: 'top 82%' }
    });

    gsap.from('.ex-note-photo', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.ex-notes-stack', start: 'top 80%' }
    });

    gsap.from('.ex-notes-copy > *', {
        opacity: 0,
        y: 30,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-notes-copy', start: 'top 82%' }
    });
}

function noteInteractions() {
    const tabs = Array.from(document.querySelectorAll('.ex-note-tab'));
    const photos = Array.from(document.querySelectorAll('.ex-note-photo'));
    const quote = document.getElementById('exNoteQuote');

    if (!tabs.length || !photos.length || !quote) return;

    let current = 0;

    const selectNote = (tab) => {
        const index = Number(tab.getAttribute('data-index'));
        if (index === current) return;
        current = index;

        tabs.forEach((entry) => entry.classList.toggle('is-active', entry === tab));
        photos.forEach((photo) => {
            photo.classList.toggle('is-active', Number(photo.getAttribute('data-photo')) === index);
        });

        quote.textContent = tab.getAttribute('data-quote') || '';

        gsap.fromTo(quote,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
    };

    tabs.forEach((tab) => {
        tab.addEventListener('mouseenter', () => selectNote(tab));
        tab.addEventListener('click', () => selectNote(tab));
    });
}

/* =========================================================
   PLAN - closing image, soft parallax, floating chips
   ========================================================= */

function planAnimations() {
    gsap.from('.ex-plan-inner > *', {
        opacity: 0,
        y: 36,
        duration: 0.95,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-plan-inner', start: 'top 82%' }
    });

    gsap.from('.ex-plan-chip', {
        opacity: 0,
        y: 24,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.ex-plan-chips', start: 'top 88%' }
    });

    gsap.to('.ex-plan-bg img', {
        yPercent: 6,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
            trigger: '.ex-plan',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        closeMobileMenu();
        lenis.scrollTo(target, { offset: -70, duration: 1.2 });
    });
});

document.fonts.ready.then(() => {
    ScrollTrigger.refresh();
});
