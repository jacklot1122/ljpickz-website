// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Sticky CTA Visibility =====
function initStickyCTA() {
    const stickyCTA = document.querySelector('.sticky-cta');
    const hero = document.querySelector('.hero');
    
    if (!stickyCTA || !hero) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                stickyCTA.style.transform = 'translateY(100%)';
            } else {
                stickyCTA.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(hero);
    
    // Initial state
    stickyCTA.style.transition = 'transform 0.3s ease';
    stickyCTA.style.transform = 'translateY(100%)';
}

// ===== Animate Stats on Scroll =====
function initStatAnimations() {
    const statElements = document.querySelectorAll('.stat-number, .stat-value[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.5 });
    
    statElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });
}

// ===== Animate Elements on Scroll =====
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.step-card, .feature-item, .pricing-card, .faq-item, .sport-card'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(15px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });
}

// ===== Navbar Background on Scroll =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initStickyCTA();
    initStatAnimations();
    initScrollAnimations();
    initNavbarScroll();
});
