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

// Preloader
window.addEventListener('load', () => {
    gsap.to('#preloader', {
        opacity: 0,
        duration: 1,
        delay: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
            document.getElementById('preloader').style.display = 'none';
            initAnimations();
        }
    });
});

// Header
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
    lenis.stop();
});

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
    lenis.start();
}

mobileClose.addEventListener('click', closeMobileMenu);

mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Animations
function initAnimations() {
    // Hero
    const heroTl = gsap.timeline();
    heroTl.from('.hero-kicker', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' })
        .from('.title-line span', { y: 120, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'power4.out' }, '-=0.5')
        .from('.hero-description', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' }, '-=0.6')
        .from('.hero-btn', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.4');
    
    gsap.to('.hero-slide img', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.hero-slide img', {
        scale: 1.07,
        duration: 14,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 2
    });

    const heroSlides = gsap.utils.toArray('.hero-slide');
    if (heroSlides.length > 1) {
        gsap.set(heroSlides, { opacity: 0 });
        gsap.set(heroSlides[0], { opacity: 1 });

        const heroCycle = gsap.timeline({ repeat: -1, delay: 1.5 });
        heroSlides.forEach((slide, i) => {
            const next = heroSlides[(i + 1) % heroSlides.length];
            heroCycle
                .to(slide, { opacity: 0, duration: 2, ease: 'power2.inOut' }, '+=4.5')
                .to(next, { opacity: 1, duration: 2, ease: 'power2.inOut' }, '<');
        });
    }
    
    // Story
    gsap.from('.story .section-subtitle, .story .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.story', start: 'top 80%' } });
    gsap.from('.text-lead, .story-text p', { opacity: 0, y: 30, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.story-text', start: 'top 80%' } });
    gsap.from('.stat-block', { opacity: 0, y: 30, stagger: 0.12, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '.story-stats', start: 'top 85%' } });
    gsap.from('.story-image-wrap', { opacity: 0, x: 60, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.story-visual', start: 'top 80%' } });
    
    // Standard
    gsap.from('.standard-intro .section-subtitle, .standard-intro .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.standard-intro', start: 'top 80%' } });
    gsap.from('.standard-lead', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.standard-intro', start: 'top 78%' } });

    const standardCards = document.querySelectorAll('.standard-card');
    standardCards.forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 92%' }
        });
        if (i === standardCards.length - 1) return;
        gsap.to(card, {
            scale: 0.95,
            ease: 'none',
            scrollTrigger: {
                trigger: standardCards[i + 1],
                start: 'top bottom',
                end: 'top 15%',
                scrub: true
            }
        });
    });

    // Collection
    gsap.from('.collection-top .section-subtitle, .collection-top .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.collection', start: 'top 85%' } });
    gsap.from('.collection-lead, .collection-progress', { opacity: 0, y: 30, stagger: 0.15, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.collection', start: 'top 80%' } });
    gsap.from('.collection-card', { opacity: 0, scale: 0.96, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.collection-track', start: 'top 90%' } });
    
    // Experiences
    gsap.from('.experiences .section-subtitle, .experiences .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.experiences', start: 'top 80%' } });
    gsap.from('.experience-item', { opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.experiences-grid', start: 'top 80%' } });
    gsap.to('.experiences-bg img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.experiences', start: 'top bottom', end: 'bottom top', scrub: true } });
    
    // Destinations
    gsap.from('.destinations .section-subtitle, .destinations .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.destinations', start: 'top 80%' } });
    gsap.from('.destination-item', { opacity: 0, x: -50, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.destinations-list', start: 'top 80%' } });

    // Travel by Mood
    gsap.from('.moods .section-subtitle, .moods .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.moods-header', start: 'top 80%' } });
    gsap.from('.moods-lead', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.moods-header', start: 'top 78%' } });
    gsap.from('.mood-panel', { opacity: 0, y: 60, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.moods-panels', start: 'top 82%' } });
    
    // Gallery
    gsap.from('.gallery .section-subtitle, .gallery .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.gallery', start: 'top 80%' } });
    gsap.from('.gallery-sub', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.gallery-sub', start: 'top 88%' } });
    gsap.from('.gallery-track--left', { opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.gallery', start: 'top 70%' } });
    gsap.from('.gallery-track--right', { opacity: 0, duration: 1.1, delay: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.gallery', start: 'top 60%' } });
    
    // Journal
    gsap.from('.journal .section-subtitle, .journal .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.journal', start: 'top 80%' } });
    gsap.from('.journal-all', { opacity: 0, x: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.journal-head', start: 'top 80%' } });
    gsap.from('.journal-feature', { opacity: 0, y: 70, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: '.journal-layout', start: 'top 78%' } });
    gsap.from('.journal-mini', { opacity: 0, x: 60, stagger: 0.15, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.journal-side', start: 'top 80%' } });
    
    // FAQ
    gsap.from('.faq .section-subtitle, .faq .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.faq', start: 'top 80%' } });
    gsap.from('.faq-lead, .faq-preview', { opacity: 0, y: 40, stagger: 0.15, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.faq-aside', start: 'top 80%' } });
    gsap.from('.faq-item', { opacity: 0, x: 60, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.faq-list', start: 'top 82%' } });

    // Testimonial
    gsap.from('.testimonial-quote', { opacity: 0, scale: 0.8, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.testimonial', start: 'top 80%' } });
    gsap.from('.testimonial-text', { opacity: 0, y: 40, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.testimonial-text', start: 'top 80%' } });
    gsap.from('.testimonial-author', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.testimonial-author', start: 'top 90%' } });
    
    // CTA
    gsap.from('.cta .section-subtitle, .cta .section-title', { opacity: 0, y: 50, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.cta', start: 'top 80%' } });
    gsap.from('.cta-text', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.cta-text', start: 'top 85%' } });
    gsap.from('.cta-btn', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.cta-btn', start: 'top 90%' } });
    gsap.to('.cta-background img', { scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true } });
    
    // Footer
    gsap.from('.footer-brand, .footer-column', { opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.footer-top', start: 'top 90%' } });

    ScrollTrigger.refresh();
}

// Collection horizontal scroll
const collectionTrack = document.querySelector('.collection-track');
const collectionViewport = document.querySelector('.collection-viewport');
const collectionProgressNum = document.querySelector('.collection-progress-num');
const collectionTotal = document.querySelectorAll('.collection-card').length;

if (collectionTrack && collectionViewport) {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 969px)', () => {
        const getDistance = () => Math.max(0, collectionTrack.scrollWidth - collectionViewport.clientWidth);

        gsap.to(collectionTrack, {
            x: () => -getDistance(),
            ease: 'none',
            scrollTrigger: {
                trigger: '.collection',
                start: 'top top',
                end: () => '+=' + (getDistance() + window.innerHeight * 0.6),
                pin: '.collection-pin',
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    if (!collectionProgressNum) return;
                    const active = Math.min(collectionTotal, Math.floor(self.progress * collectionTotal) + 1);
                    collectionProgressNum.textContent = String(active).padStart(2, '0');
                }
            }
        });

        return () => {
            gsap.set(collectionTrack, { x: 0 });
        };
    });

    mm.add('(max-width: 968px)', () => {
        gsap.set(collectionTrack, { x: 0 });
    });

    if (collectionProgressNum && collectionTotal) {
        collectionViewport.addEventListener('scroll', () => {
            const max = collectionViewport.scrollWidth - collectionViewport.clientWidth;
            const progress = max > 0 ? collectionViewport.scrollLeft / max : 0;
            const active = Math.min(collectionTotal, Math.floor(progress * collectionTotal) + 1);
            collectionProgressNum.textContent = String(active).padStart(2, '0');
        }, { passive: true });
    }
}

// Travel by Mood
const moodPanels = document.querySelectorAll('.mood-panel');

if (moodPanels.length) {
    const canHoverMood = window.matchMedia('(hover: hover)').matches;
    moodPanels.forEach((panel) => {
        const activate = () => {
            moodPanels.forEach((p) => p.classList.toggle('is-active', p === panel));
        };
        panel.addEventListener('click', activate);
        if (canHoverMood) {
            panel.addEventListener('mouseenter', activate);
        }
    });
}

// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
const faqPreviews = document.querySelectorAll('.faq-preview-img');

function setFaq(index, forceOpen) {
    const shouldOpen = typeof forceOpen === 'boolean'
        ? forceOpen
        : !faqItems[index].classList.contains('is-open');

    faqItems.forEach((item, i) => {
        const answer = item.querySelector('.faq-answer');
        const button = item.querySelector('.faq-question');
        const open = i === index && shouldOpen;
        item.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));
        gsap.to(answer, {
            height: open ? 'auto' : 0,
            opacity: open ? 1 : 0,
            duration: open ? 0.6 : 0.4,
            ease: open ? 'power3.out' : 'power2.inOut'
        });
    });

    faqPreviews.forEach((img, i) => {
        img.classList.remove('is-active');
        if (i === index) {
            img.classList.add('is-active');
            gsap.set(img, { zIndex: 2 });
            gsap.fromTo(img,
                { opacity: 0, scale: 1.06 },
                { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }
            );
        } else {
            gsap.to(img, {
                opacity: 0,
                duration: 0.35,
                ease: 'power2.out',
                onComplete: () => gsap.set(img, { zIndex: 1 })
            });
        }
    });
}

if (faqItems.length) {
    faqItems.forEach((item, i) => {
        item.querySelector('.faq-question').addEventListener('click', () => setFaq(i));
    });
    setFaq(0, true);
}

// Smooth scroll
document.querySelectorAll('.nav-link, .mobile-link, .hero-btn, .journal-read, .journal-mini-link, .mood-link, .collection-card-link, .cta-btn').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                if (link.matches('.nav-link, .mobile-link')) {
                    history.replaceState(null, '', href);
                    syncActiveNav();
                }
                lenis.scrollTo(target, { offset: -80, duration: 1.2 });
            }
        }
    });
});

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
}
