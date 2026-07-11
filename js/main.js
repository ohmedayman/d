/* ========================================
   خليك مكانك - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    initPreloader();
    
    // AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 50
    });

    // Navbar
    initNavbar();

    // Smooth Scroll
    initSmoothScroll();

    // Swiper
    initSwiper();

    // Counter Animation
    initCounters();

    // Back to Top
    initBackToTop();

    // Active Nav Link
    initActiveNav();
});

/* ========================================
   Preloader
   ======================================== */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('loaded');
            setTimeout(() => preloader.remove(), 500);
        }, 800);
    });
}

/* ========================================
   Navbar
   ======================================== */
function initNavbar() {
    const nav = document.getElementById('mainNav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('#mainNav').offsetHeight;
                window.scrollTo({
                    top: target.offsetTop - navHeight,
                    behavior: 'smooth'
                });
                // Close mobile menu
                const collapse = document.querySelector('.navbar-collapse.show');
                if (collapse) bootstrap.Collapse.getInstance(collapse)?.hide();
            }
        });
    });
}

/* ========================================
   Swiper Slider
   ======================================== */
function initSwiper() {
    new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: { delay: 4000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        }
    });
}

/* ========================================
   Counter Animation
   ======================================== */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                if (isNaN(target)) return;
                
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current);
                    }
                }, 30);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(c => observer.observe(c));
}

/* ========================================
   Active Nav
   ======================================== */
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.navbar-nav .nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 200) current = s.id;
        });
        links.forEach(l => {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + current) l.classList.add('active');
        });
    });
}

/* ========================================
   Back to Top
   ======================================== */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
