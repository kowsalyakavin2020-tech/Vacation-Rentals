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
    let matched = false;

    links.forEach((link) => {
        const href = link.getAttribute('href') || '';
        const active = href.split('#')[0].split('/').pop().toLowerCase() === page;

        if (active) matched = true;
        link.classList.toggle('is-active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    if (!matched && page === 'journal.html') {
        const journalLinks = document.querySelectorAll('a[href="journal.html"]');
        journalLinks.forEach((link) => {
            link.classList.add('is-active');
            link.setAttribute('aria-current', 'page');
        });
    }
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
    lenis.stop();
}

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    document.body.style.overflow = 'auto';
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

// Newsletter
const journalForm = document.getElementById('jrForm');
const journalFormNote = document.getElementById('jrFormNote');

if (journalForm) {
    const emailInput = document.getElementById('jrEmail');
    const defaultNote = journalFormNote ? journalFormNote.textContent : '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const setFormState = (state, message) => {
        journalForm.classList.toggle('has-error', state === 'error');
        if (journalFormNote) {
            journalFormNote.classList.toggle('has-error', state === 'error');
            journalFormNote.classList.toggle('is-success', state === 'success');
            journalFormNote.textContent = message;
        }
    };

    journalForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const value = emailInput ? emailInput.value.trim() : '';

        if (!value) {
            if (emailInput) {
                emailInput.setAttribute('aria-invalid', 'true');
                emailInput.focus();
            }
            setFormState('error', 'Please enter your email address.');
            return;
        }

        if (!emailPattern.test(value)) {
            if (emailInput) {
                emailInput.setAttribute('aria-invalid', 'true');
                emailInput.focus();
            }
            setFormState('error', 'Please enter a valid email address.');
            return;
        }

        if (emailInput) emailInput.removeAttribute('aria-invalid');
        window.location.href = '404.html';
    });

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (!journalForm.classList.contains('has-error')) return;
            emailInput.removeAttribute('aria-invalid');
            setFormState('idle', defaultNote);
        });
    }
}

// Slow list interactions
function initSlowList() {
    const listItems = document.querySelectorAll('.jr-list-item');
    const listImage = document.getElementById('jrListImage');
    const listPlace = document.getElementById('jrListPlace');
    const listTitle = document.getElementById('jrListTitle');

    if (!listItems.length) return;

    listItems.forEach((item) => {
        item.addEventListener('click', () => {
            listItems.forEach((entry) => {
                entry.classList.remove('is-active');
                entry.setAttribute('aria-pressed', 'false');
            });

            item.classList.add('is-active');
            item.setAttribute('aria-pressed', 'true');

            if (listPlace) listPlace.textContent = item.dataset.place || '';
            if (listTitle) listTitle.textContent = item.dataset.title || '';

            if (!listImage) return;

            const nextSource = item.dataset.img;
            if (!nextSource || listImage.getAttribute('src') === nextSource) return;

            if (reduceMotion) {
                listImage.setAttribute('src', nextSource);
                listImage.setAttribute('alt', item.dataset.title || '');
                return;
            }

            gsap.to(listImage, {
                autoAlpha: 0,
                scale: 1.03,
                duration: 0.24,
                ease: 'power2.in',
                onComplete: () => {
                    listImage.setAttribute('src', nextSource);
                    listImage.setAttribute('alt', item.dataset.title || '');
                    gsap.fromTo(listImage,
                        { autoAlpha: 0, scale: 1.06 },
                        { autoAlpha: 1, scale: 1, duration: 0.55, ease: 'power3.out' }
                    );
                }
            });
        });

        item.setAttribute('aria-pressed', item.classList.contains('is-active') ? 'true' : 'false');
    });
}

// The Conversation accordion
function initConversation() {
    const items = document.querySelectorAll('.jr-qa-item');
    if (!items.length) return;

    const setItem = (index) => {
        items.forEach((item, i) => {
            const button = item.querySelector('.jr-qa-question');
            const answer = item.querySelector('.jr-qa-answer');
            const open = i === index && !item.classList.contains('is-open');

            item.classList.toggle('is-open', open);
            if (button) button.setAttribute('aria-expanded', String(open));

            if (answer) {
                gsap.to(answer, {
                    height: open ? 'auto' : 0,
                    opacity: open ? 1 : 0,
                    duration: reduceMotion ? 0 : (open ? 0.5 : 0.35),
                    ease: open ? 'power3.out' : 'power2.inOut'
                });
            }
        });
    };

    items.forEach((item, i) => {
        const button = item.querySelector('.jr-qa-question');
        if (button) {
            button.addEventListener('click', () => setItem(i));
        }
    });
}

// Seamless hero marquee
function initHeroMarquee() {
    const marquee = document.querySelector('.jr-hero-marquee');
    const track = document.querySelector('.jr-hero-track');

    if (!marquee || !track || reduceMotion) return;

    const originals = Array.from(track.children);
    if (originals.length < 8) return;

    const loopWidth = originals[originals.length / 2].offsetLeft - originals[0].offsetLeft;
    if (!loopWidth) return;

    let safety = 0;
    while (track.scrollWidth - loopWidth < window.innerWidth * 1.25 && safety < 4) {
        originals.forEach((item) => {
            const clone = item.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            track.appendChild(clone);
        });
        safety += 1;
    }

    const tween = gsap.to(track, {
        x: -loopWidth,
        duration: loopWidth / 60,
        ease: 'none',
        repeat: -1
    });

    marquee.addEventListener('mouseenter', () => tween.pause());
    marquee.addEventListener('mouseleave', () => tween.resume());
}

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
    initSlowList();
    initConversation();
    initHeroMarquee();
    initAnchors();

    if (!reduceMotion) {
        heroAnimations();
        noteAnimations();
        latestAnimations();
        essayAnimations();
        interviewAnimations();
        slowListAnimations();
        objectAnimations();
        recipeAnimations();
        contributorAnimations();
        letterAnimations();
    }

    window.setTimeout(() => ScrollTrigger.refresh(), 300);
}

function heroAnimations() {
    const compactHero = window.matchMedia('(max-width: 900px)').matches;
    const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    timeline
        .from('.jr-hero-line > span', {
            yPercent: 112,
            duration: 1.2,
            stagger: 0.09
        })
        .from('.jr-hero-bg img', {
            scale: 1.14,
            duration: 1.7
        }, 0)
        .from('.jr-hero-copy .section-subtitle', {
            autoAlpha: 0,
            y: 18,
            duration: 0.7
        }, '-=0.9')
        .from('.jr-hero-text', {
            autoAlpha: 0,
            y: 22,
            duration: 0.8
        }, '-=0.55')
        .from('.jr-hero-meta', {
            autoAlpha: 0,
            y: 18,
            duration: 0.7
        }, '-=0.5')
        .from('.jr-hero-cover', {
            autoAlpha: 0,
            x: compactHero ? 0 : 46,
            duration: 1
        }, '-=1')
        .from('.jr-hero-marquee', {
            autoAlpha: 0,
            y: 18,
            duration: 0.8
        }, '-=0.55');
}

function noteAnimations() {
    gsap.from('.jr-note-copy > *', {
        y: 28,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-note',
            start: 'top 72%'
        }
    });

    gsap.fromTo('.jr-note-main',
        { clipPath: 'inset(0 0 100% 0)' },
        {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: '.jr-note-visual',
                start: 'top 80%'
            }
        }
    );

    gsap.from('.jr-note-inset', {
        autoAlpha: 0,
        scale: 0.82,
        rotate: -4,
        duration: 0.95,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-note-visual',
            start: 'top 68%'
        }
    });

    gsap.from('.jr-note-stamp', {
        autoAlpha: 0,
        scale: 0.65,
        rotate: -25,
        duration: 0.9,
        delay: 0.25,
        ease: 'back.out(1.4)',
        scrollTrigger: {
            trigger: '.jr-note-visual',
            start: 'top 68%'
        }
    });
}

function latestAnimations() {
    gsap.from('.jr-latest-head > *', {
        y: 30,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-latest',
            start: 'top 72%'
        }
    });

    gsap.from('.jr-story-card', {
        y: 55,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-story-grid',
            start: 'top 80%'
        }
    });

    gsap.fromTo('.jr-story-card--feature .jr-story-media',
        { clipPath: 'inset(0 0 100% 0)' },
        {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: '.jr-story-card--feature',
                start: 'top 78%'
            }
        }
    );
}

function essayAnimations() {
    gsap.from('.jr-essay-head > *', {
        y: 30,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-essay',
            start: 'top 72%'
        }
    });

    const directions = [
        'inset(100% 0 0 0)',
        'inset(0 100% 0 0)',
        'inset(0 0 100% 0)',
        'inset(0 0 0 100%)'
    ];

    gsap.utils.toArray('.jr-essay-img').forEach((figure, index) => {
        gsap.fromTo(figure,
            { clipPath: directions[index % directions.length] },
            {
                clipPath: 'inset(0 0 0 0)',
                duration: 1.15,
                ease: 'power3.inOut',
                scrollTrigger: {
                    trigger: figure,
                    start: 'top 84%'
                }
            }
        );
    });

    gsap.from('.jr-essay-copy > *', {
        y: 26,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-essay-copy',
            start: 'top 82%'
        }
    });
}

function interviewAnimations() {
    const quote = document.querySelector('.jr-interview-copy blockquote');
    if (quote) {
        const words = quote.textContent.trim().split(/\s+/);
        quote.innerHTML = words.map((word) => `<span class="jr-word">${word}</span>`).join(' ');
    }

    gsap.fromTo('.jr-interview-portrait',
        { clipPath: 'inset(0 0 100% 0)' },
        {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: '.jr-interview-portrait',
                start: 'top 82%'
            }
        }
    );

    gsap.from('.jr-word', {
        autoAlpha: 0,
        y: 18,
        duration: 0.65,
        stagger: 0.025,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-interview-copy',
            start: 'top 76%'
        }
    });

    gsap.from('.jr-interview-copy > *:not(blockquote)', {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-interview-copy',
            start: 'top 66%'
        }
    });
}

function slowListAnimations() {
    const listMedia = gsap.matchMedia();

    listMedia.add('(min-width: 901px)', () => {
        const pin = ScrollTrigger.create({
            trigger: '.jr-list',
            start: 'top 76px',
            end: () => '+=' + Math.round(window.innerHeight * 0.9),
            pin: '.jr-list-inner',
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true
        });

        return () => pin.kill();
    });

    gsap.from('.jr-list-head > *', {
        y: 30,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-list',
            start: 'top 64%'
        }
    });

    gsap.fromTo('.jr-list-visual',
        { clipPath: 'inset(100% 0 0 0)' },
        {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.15,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: '.jr-list',
                start: 'top 58%'
            }
        }
    );

    gsap.from('.jr-list-item', {
        x: 38,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-list-items',
            start: 'top 76%'
        }
    });

    gsap.fromTo('.jr-list-visual',
        { y: 18 },
        {
            y: -18,
            ease: 'none',
            scrollTrigger: {
                trigger: '.jr-list',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        }
    );
}

function objectAnimations() {
    gsap.from('.jr-objects-head > *', {
        y: 30,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-objects',
            start: 'top 72%'
        }
    });

    gsap.utils.toArray('.jr-object').forEach((object, index) => {
        const media = object.querySelector('.jr-object-media');
        const caption = object.querySelector('figcaption');

        if (media) {
            gsap.fromTo(media,
                {
                    clipPath: 'inset(100% 0 0 0)',
                    y: 44,
                    scale: 0.96,
                    rotate: index % 2 === 0 ? -2.5 : 2.5,
                    transformOrigin: 'center bottom'
                },
                {
                    clipPath: 'inset(0 0 0% 0)',
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    duration: 1.2,
                    delay: index * 0.1,
                    ease: 'power3.inOut',
                    scrollTrigger: {
                        trigger: object,
                        start: 'top 85%'
                    }
                }
            );
        }

        if (caption) {
            gsap.from(caption, {
                y: 26,
                autoAlpha: 0,
                duration: 0.8,
                delay: 0.2 + index * 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: object,
                    start: 'top 79%'
                }
            });
        }
    });
}

function recipeAnimations() {
    gsap.fromTo('.jr-recipe-visual',
        { clipPath: 'inset(0 100% 0 0)' },
        {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.25,
            ease: 'power3.inOut',
            scrollTrigger: {
                trigger: '.jr-recipe',
                start: 'top 74%'
            }
        }
    );

    gsap.from('.jr-recipe-inset', {
        autoAlpha: 0,
        scale: 0.8,
        rotate: 6,
        duration: 0.9,
        delay: 0.25,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-recipe',
            start: 'top 64%'
        }
    });

    gsap.from('.jr-recipe-copy > *', {
        y: 24,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-recipe-copy',
            start: 'top 76%'
        }
    });

    gsap.from('.jr-steps li', {
        x: 26,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.11,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-steps',
            start: 'top 82%'
        }
    });
}

function contributorAnimations() {
    gsap.from('.jr-contributors-head > *', {
        y: 30,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-contributors',
            start: 'top 72%'
        }
    });

    gsap.from('.jr-person', {
        y: 48,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-people',
            start: 'top 82%'
        }
    });
}

function letterAnimations() {
    gsap.fromTo('.jr-letters-bg img',
        { scale: 1.12 },
        {
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
                trigger: '.jr-letters',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            }
        }
    );

    gsap.from('.jr-letters-inner > *', {
        y: 30,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.11,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.jr-letters',
            start: 'top 66%'
        }
    });
}
