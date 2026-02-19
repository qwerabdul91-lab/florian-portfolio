// Audio untuk efek klik (opsional)
let clickSound = document.getElementById('clickSound');
let soundEnabled = true;

// Multi-page navigation tanpa reload
document.addEventListener('DOMContentLoaded', function() {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // Handle page navigation
    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });

        // Update active nav link
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        // Close mobile menu
        navLinksContainer.classList.remove('active');

        // Play click sound
        if (soundEnabled && clickSound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(() => {});
        }

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Add click handlers to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Add click handlers to buttons that have data-page
    document.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
        });
    });

    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navLinksContainer.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinksContainer.classList.remove('active');
        }
    });

    // Handle initial page load (check hash)
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (document.getElementById(hash)) {
            showPage(hash);
        }
    }

    // Smooth scroll untuk link internal
    document.querySelectorAll('a[href^="#"]:not([data-page])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animasi progress bars
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'progressFill 1.5s ease-out';
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill-progress').forEach(bar => {
        observer.observe(bar);
    });

    // Toggle sound (opsional)
    window.toggleSound = function() {
        soundEnabled = !soundEnabled;
    };

    // Prevent layout shift on mobile
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    // Add active class to current page on load
    const currentPage = document.querySelector('.page.active')?.id || 'home';
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Handle back/forward browser buttons
window.addEventListener('popstate', function() {
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (document.getElementById(hash)) {
            showPage(hash);
        }
    }
});