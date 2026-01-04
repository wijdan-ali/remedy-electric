document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Navigation Logic (Sticky & Scroll Direction)
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('footer.footer');

    const getHideOffsetPx = () => {
        if (!navbar) return -120;
        const h = navbar.getBoundingClientRect().height || 80;
        // Clear the top inset and fully move the pill out of view
        return -(h + 24);
    };

    const updateNavbarPosition = () => {
        if (!navbar) return;

        // If mobile menu is open, keep nav visible for usability
        const menuOpen = !!document.querySelector('.nav-menu.active');
        const hideY = getHideOffsetPx();

        // Only hide as footer approaches the viewport (requested behavior)
        // When footer top is within `rangePx` from bottom of viewport, start sliding nav up.
        let footerYTarget = 0;
        if (!menuOpen && footer) {
            const rangePx = 220;
            const footerTop = footer.getBoundingClientRect().top;
            const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
            const distanceFromBottom = footerTop - viewportH; // <= 0 means footer is on screen

            // Map distanceFromBottom: [rangePx .. 0 .. -rangePx] -> t: [0 .. 1 .. 1]
            const t = Math.min(1, Math.max(0, 1 - (distanceFromBottom / rangePx)));
            footerYTarget = hideY * t;
        }

        // Keep nav visible during regular scrolling; only footer influences Y.
        navbar.style.setProperty('--nav-scroll-y', `0px`);
        navbar.style.setProperty('--nav-footer-y', `${footerYTarget}px`);
    };

    window.addEventListener('scroll', updateNavbarPosition, { passive: true });
    window.addEventListener('resize', updateNavbarPosition, { passive: true });

    // Ensure correct initial position on load
    if (navbar) {
        navbar.style.setProperty('--nav-scroll-y', `0px`);
        navbar.style.setProperty('--nav-footer-y', `0px`);
    }
    updateNavbarPosition();

    // 2. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Keep nav visible while the menu is open
        if (navbar) {
            navbar.style.setProperty('--nav-scroll-y', `0px`);
            navbar.style.setProperty('--nav-footer-y', `0px`);
        }
    });

    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .fade-right');
    animatedElements.forEach(el => observer.observe(el));

    // 4. Form Submission Handling (Visual only)
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Sent!';
            btn.style.backgroundColor = '#fff';
            btn.style.color = '#000';
            
            setTimeout(() => {
                form.reset();
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 3000);
        });
    }

    // 5. Dynamic Stats Counter (Simple implementation)
    // Runs when stats section comes into view
    // (Optional enhancement based on brief)
});