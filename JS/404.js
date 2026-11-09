document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('errBack');
    const homeUrl = '../index.html';

    if (backButton) {
        backButton.addEventListener('click', () => {
            if (window.history.length > 1 && document.referrer) {
                window.history.back();
            } else {
                window.location.href = homeUrl;
            }
        });
    }

    if (!window.gsap) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    timeline
        .from('.err-logo', {
            y: -18,
            autoAlpha: 0,
            duration: 0.8
        })
        .from('.err-digit', {
            yPercent: 32,
            autoAlpha: 0,
            rotate: (index) => (index === 0 ? -8 : 8),
            stagger: 0.12,
            duration: 1
        }, '-=0.45')
        .from('.err-mark', {
            scale: 0.55,
            autoAlpha: 0,
            rotate: -40,
            duration: 0.9,
            ease: 'back.out(1.7)'
        }, '-=0.72')
        .from('.err-kicker', {
            y: 16,
            autoAlpha: 0,
            duration: 0.6
        }, '-=0.4')
        .from('.err-title', {
            y: 24,
            autoAlpha: 0,
            duration: 0.8
        }, '-=0.38')
        .from('.err-text', {
            y: 18,
            autoAlpha: 0,
            duration: 0.7
        }, '-=0.5')
        .from('.err-actions > *', {
            y: 18,
            autoAlpha: 0,
            stagger: 0.12,
            duration: 0.7
        }, '-=0.45')
        .from('.err-note', {
            autoAlpha: 0,
            duration: 0.6
        }, '-=0.3');

    gsap.to('.err-mark', {
        y: -8,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 1.2
    });

    const canHover = window.matchMedia('(pointer: fine)').matches;
    const main = document.querySelector('.err-main');
    const decor = document.querySelector('.err-decor');
    const code = document.querySelector('.err-code');

    if (canHover && main && decor && code) {
        main.addEventListener('pointermove', (event) => {
            const x = event.clientX / window.innerWidth - 0.5;
            const y = event.clientY / window.innerHeight - 0.5;

            gsap.to(decor, {
                x: x * 26,
                y: y * 26,
                duration: 1.3,
                ease: 'power2.out'
            });

            gsap.to(code, {
                x: x * 12,
                y: y * 10,
                rotateY: x * 4,
                rotateX: y * -4,
                duration: 1.1,
                ease: 'power2.out'
            });
        });
    }
});
