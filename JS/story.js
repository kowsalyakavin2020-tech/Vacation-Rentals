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
    if (window.scrollY > 80) {
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
    originAnimations();
    beliefAnimations();
    timelineAnimations();
    founderAnimations();
    ethosAnimations();
    postcardAnimations();
    craftAnimations();
    pressAnimations();
    valuesAnimations();

    ScrollTrigger.refresh();
}

/* =========================================================
   HERO — masked line reveal, mosaic rise, tilt
   ========================================================= */

function heroAnimations() {
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
        .from('.st-hero-top', { opacity: 0, y: 24, duration: 0.9 })
        .from('.st-hero-line > span, .st-hero-line > em', {
            yPercent: 120,
            duration: 1.2,
            stagger: 0.12,
            ease: 'power4.out'
        }, '-=0.45')
        .from('.st-hero-card', {
            opacity: 0,
            y: 70,
            duration: 1.05,
            stagger: 0.13
        }, '-=0.7')
        .from('.st-hero-foot', { opacity: 0, y: 30, duration: 0.9 }, '-=0.6');

    gsap.fromTo('.st-hero-bg img',
        { scale: 1.18 },
        {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: '.st-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        }
    );

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        document.querySelectorAll('[data-tilt]').forEach((card) => {
            gsap.set(card, { transformPerspective: 900 });
            const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power2.out' });
            const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power2.out' });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                rotateX(((e.clientY - rect.top) / rect.height - 0.5) * -8);
                rotateY(((e.clientX - rect.left) / rect.width - 0.5) * 8);
            });

            card.addEventListener('mouseleave', () => {
                rotateX(0);
                rotateY(0);
            });
        });
    }
}

/* =========================================================
   ORIGIN — curtain reveal, drifting visual, copy stagger
   ========================================================= */

function originAnimations() {
    gsap.from('.st-origin-frame', {
        clipPath: 'inset(0 0 100% 0)',
        duration: 1.3,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.st-origin-visual', start: 'top 80%' }
    });

    gsap.from('.st-origin-stamp', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.35,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-origin-visual', start: 'top 75%' }
    });

    gsap.from('.st-origin-copy > *', {
        opacity: 0,
        y: 34,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-origin-copy', start: 'top 82%' }
    });

    gsap.fromTo('.st-origin-visual',
        { y: 36 },
        {
            y: -36,
            ease: 'none',
            scrollTrigger: {
                trigger: '.st-origin',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        }
    );
}

/* =========================================================
   BELIEFS — fanned cards on desktop, grid stagger on mobile
   ========================================================= */

function beliefAnimations() {
    gsap.from('.st-beliefs-head > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-beliefs-head', start: 'top 82%' }
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', () => {
        gsap.from('.st-belief-slot', {
            opacity: 0,
            y: 110,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: '.st-belief-stage', start: 'top 80%' }
        });
    });

    mm.add('(max-width: 900px)', () => {
        gsap.from('.st-belief-card', {
            opacity: 0,
            y: 50,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: '.st-belief-stage', start: 'top 85%' }
        });
    });

    gsap.from('.st-beliefs-hint', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-beliefs-hint', start: 'top 92%' }
    });
}

/* =========================================================
   TIMELINE — growing rail, alternating milestone arrivals
   ========================================================= */

function timelineAnimations() {
    gsap.from('.st-timeline-head > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-timeline-head', start: 'top 82%' }
    });

    gsap.fromTo('.st-timeline-rail span',
        { scaleY: 0 },
        {
            scaleY: 1,
            transformOrigin: 'top center',
            ease: 'none',
            scrollTrigger: {
                trigger: '.st-timeline',
                start: 'top 70%',
                end: 'bottom 62%',
                scrub: true
            }
        }
    );

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1201px)', () => {
        gsap.utils.toArray('.st-milestone').forEach((milestone) => {
            const fromRight = milestone.classList.contains('st-milestone--right');

            gsap.from(milestone, {
                opacity: 0,
                x: fromRight ? 80 : -80,
                duration: 1,
                ease: 'power3.out',
                clearProps: 'transform',
                scrollTrigger: { trigger: milestone, start: 'top 86%' }
            });
        });
    });

    mm.add('(max-width: 1200px)', () => {
        gsap.utils.toArray('.st-milestone').forEach((milestone) => {
            gsap.from(milestone, {
                opacity: 0,
                y: 46,
                duration: 0.9,
                ease: 'power3.out',
                clearProps: 'transform',
                scrollTrigger: { trigger: milestone, start: 'top 88%' }
            });
        });
    });

    gsap.utils.toArray('.st-milestone').forEach((milestone) => {
        gsap.from(milestone.querySelector('.st-mile-year'), {
            opacity: 0,
            scale: 0.5,
            duration: 0.7,
            delay: 0.2,
            ease: 'back.out(1.8)',
            clearProps: 'transform',
            scrollTrigger: { trigger: milestone, start: 'top 86%' }
        });

        gsap.from(milestone.querySelector('.st-mile-img'), {
            clipPath: 'inset(0 100% 0 0)',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: milestone, start: 'top 84%' }
        });
    });
}

/* =========================================================
   FOUNDERS — curtain portraits, opposed parallax, slow seal
   ========================================================= */

function founderAnimations() {
    gsap.from('.st-founders-head > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-founders-head', start: 'top 82%' }
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', () => {
        gsap.from('.st-founder-media', {
            clipPath: 'inset(100% 0 0 0)',
            duration: 1.3,
            stagger: 0.15,
            ease: 'power4.inOut',
            scrollTrigger: { trigger: '.st-founders-stage', start: 'top 78%' }
        });

        gsap.to('.st-founder-mark', {
            rotation: 300,
            ease: 'none',
            scrollTrigger: {
                trigger: '.st-founders',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    mm.add('(max-width: 900px)', () => {
        gsap.from('.st-founder', {
            opacity: 0,
            scale: 0.985,
            duration: 0.9,
            stagger: 0.14,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: '.st-founders-stage', start: 'top 82%' }
        });
    });

    gsap.from('.st-founder figcaption', {
        opacity: 0,
        y: 18,
        duration: 0.8,
        stagger: 0.12,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-founders-stage', start: 'top 72%' }
    });
}

/* =========================================================
   ETHOS — slow background drift, copy rise, swatch cascade
   ========================================================= */

function ethosAnimations() {
    gsap.fromTo('.st-ethos-bg img',
        { scale: 1.16 },
        {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: '.st-ethos',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        }
    );

    gsap.from('.st-ethos-copy > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-ethos-copy', start: 'top 78%' }
    });

    gsap.from('.st-swatch', {
        opacity: 0,
        y: 90,
        duration: 1.1,
        stagger: 0.14,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.st-ethos-swatches', start: 'top 85%' }
    });
}

/* =========================================================
   DESTINATIONS — rotating compass, node reveal, image swap
   ========================================================= */

function postcardAnimations() {
    gsap.from('.st-postcards-head > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-postcards-head', start: 'top 82%' }
    });

    gsap.from('.st-postcard', {
        opacity: 0,
        y: 70,
        rotation: 3,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.st-postcard-stage', start: 'top 82%' }
    });

    gsap.from('.st-postcards-foot > *', {
        opacity: 0,
        y: 18,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-postcards-foot', start: 'top 92%' }
    });

    const stage = document.querySelector('.st-postcard-stage');
    const track = document.querySelector('.st-postcard-track');

    if (stage && track) {
        const getDistance = () => Math.max(0, track.scrollWidth - stage.clientWidth);

        gsap.to(track, {
            x: () => -getDistance(),
            ease: 'none',
            scrollTrigger: {
                trigger: stage,
                start: 'top 76px',
                end: () => '+=' + (getDistance() + window.innerHeight * 0.15),
                pin: stage,
                pinSpacing: true,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true
            }
        });
    }
}

/* =========================================================
   CRAFT — deck spreads from a single stack on scroll
   ========================================================= */

function craftAnimations() {
    gsap.from('.st-craft-head > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.13,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-craft-head', start: 'top 82%' }
    });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 901px)', () => {
        const deck = document.querySelector('.st-craft-deck');
        const slots = gsap.utils.toArray('.st-craft-slot');
        const spread = [
            { fraction: -0.33, lift: 22, rotation: -7 },
            { fraction: -0.11, lift: -22, rotation: -2 },
            { fraction: 0.11, lift: -22, rotation: 2 },
            { fraction: 0.33, lift: 22, rotation: 7 }
        ];

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.st-craft-deck',
                start: 'top 88%',
                end: 'top 28%',
                scrub: 1,
                invalidateOnRefresh: true
            }
        });

        slots.forEach((slot, i) => {
            const spec = spread[i];
            tl.fromTo(slot,
                { xPercent: -50, yPercent: -50, x: 0, y: 0, rotation: 0 },
                {
                    xPercent: -50,
                    yPercent: -50,
                    x: () => deck.clientWidth * spec.fraction,
                    y: spec.lift,
                    rotation: spec.rotation,
                    ease: 'power2.out'
                },
                i * 0.12
            );
        });

        return () => gsap.set(slots, { clearProps: 'transform' });
    });

    mm.add('(max-width: 900px)', () => {
        gsap.from('.st-craft-card', {
            opacity: 0,
            y: 46,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: '.st-craft-deck', start: 'top 85%' }
        });
    });

    gsap.from('.st-craft-note', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-craft-deck', start: 'top 55%' }
    });
}

/* =========================================================
   PRESS — cards tilt in from alternating sides
   ========================================================= */

function pressAnimations() {
    gsap.from('.st-press-head > *', {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-press-head', start: 'top 84%' }
    });

    gsap.utils.toArray('.st-press-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 70,
            rotationX: 10,
            transformPerspective: 1100,
            duration: 1,
            delay: (i % 2) * 0.1,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: '.st-press-grid', start: 'top 82%' }
        });

        gsap.from(card.querySelector('blockquote'), {
            opacity: 0,
            y: 18,
            duration: 0.8,
            delay: 0.2 + (i % 2) * 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.st-press-grid', start: 'top 82%' }
        });
    });
}

/* =========================================================
   VALUES — curtain visual, mouse porthole, animated counters
   ========================================================= */

function valuesAnimations() {
    gsap.from('.st-values-visual', {
        clipPath: 'inset(0 100% 0 0)',
        duration: 1.3,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: '.st-values-visual', start: 'top 82%' }
    });

    gsap.from('.st-values-tag', {
        opacity: 0,
        y: -14,
        duration: 0.8,
        delay: 0.3,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: '.st-values-visual', start: 'top 78%' }
    });

    gsap.from('.st-values-copy > *', {
        opacity: 0,
        y: 38,
        duration: 0.95,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.st-values-copy', start: 'top 82%' }
    });

    const visual = document.getElementById('stValuesVisual');
    const hole = visual ? visual.querySelector('.st-values-hole') : null;

    if (visual && hole && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const moveX = gsap.quickTo(hole, 'x', { duration: 0.75, ease: 'power3.out' });
        const moveY = gsap.quickTo(hole, 'y', { duration: 0.75, ease: 'power3.out' });

        visual.addEventListener('mousemove', (e) => {
            const rect = visual.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            const limitX = rect.width * 0.2;
            const limitY = rect.height * 0.2;
            moveX(gsap.utils.clamp(-limitX, limitX, relX * 0.55));
            moveY(gsap.utils.clamp(-limitY, limitY, relY * 0.55));
        });

        visual.addEventListener('mouseleave', () => {
            moveX(0);
            moveY(0);
        });
    }

    document.querySelectorAll('.st-stat strong').forEach((stat) => {
        const target = parseFloat(stat.getAttribute('data-count')) || 0;
        const suffix = stat.getAttribute('data-suffix') || '';
        const counter = { value: 0 };

        ScrollTrigger.create({
            trigger: stat,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    value: target,
                    duration: 1.9,
                    ease: 'power2.out',
                    onUpdate: () => {
                        stat.textContent = Math.round(counter.value) + suffix;
                    },
                    onComplete: () => {
                        stat.textContent = target + suffix;
                    }
                });
            }
        });
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

if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
}
