// ===== Countdown Timer =====
function initCountdown() {
    const now = new Date();
    let endTime;
    
    // Check localStorage for saved end time
    const saved = localStorage.getItem('ljCountdownEnd');
    if (saved && new Date(saved) > now) {
        endTime = new Date(saved);
    } else {
        // Set 24 hours from now
        endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        localStorage.setItem('ljCountdownEnd', endTime.toISOString());
    }
    
    function update() {
        const now = new Date();
        let diff = endTime - now;
        
        if (diff <= 0) {
            // Reset
            endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            localStorage.setItem('ljCountdownEnd', endTime.toISOString());
            diff = 24 * 60 * 60 * 1000;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    update();
    setInterval(update, 1000);
}

// ===== Spots Left Counter (Random-ish) =====
function initSpotsCounter() {
    const spotsEl = document.getElementById('spots-left');
    if (!spotsEl) return;
    
    // Generate a "random" but consistent number based on date
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
        hash = ((hash << 5) - hash) + today.charCodeAt(i);
    }
    const spots = 15 + Math.abs(hash % 20); // Between 15-34
    spotsEl.textContent = spots;
}

// ===== Smooth Scroll =====
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

// ===== Mobile Menu =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navbar = document.querySelector('.navbar');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        // Could add a mobile menu dropdown here if needed
    });
}

// ===== Navbar Background on Scroll =====
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
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

// ===== Live Member Counter Animation =====
function initLiveMemberCounter() {
    const memberCountEl = document.getElementById('member-count');
    const liveMembersEl = document.getElementById('live-members');
    
    // Simulate live members fluctuation
    if (liveMembersEl) {
        let baseOnline = 847;
        setInterval(() => {
            // Random fluctuation between -5 and +5
            const fluctuation = Math.floor(Math.random() * 11) - 5;
            baseOnline = Math.max(800, Math.min(900, baseOnline + fluctuation));
            liveMembersEl.textContent = baseOnline;
        }, 3000);
    }
    
    // Animate member count on scroll
    if (memberCountEl) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small increment animation to show "live" feel
                    const current = parseInt(memberCountEl.textContent.replace(',', ''));
                    const target = current + Math.floor(Math.random() * 3);
                    memberCountEl.textContent = target.toLocaleString();
                }
            });
        }, { threshold: 0.5 });
        observer.observe(memberCountEl);
    }
}

// ===== Bet Slip Carousel =====
function initBetSlipCarousel() {
    const carousel = document.querySelector('.betslip-carousel');
    const track = document.querySelector('.betslip-track');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (!carousel || !track || dots.length === 0) return;
    
    let currentIndex = 0;
    const cards = track.querySelectorAll('.betslip-card');
    
    // Update dots based on scroll position
    carousel.addEventListener('scroll', () => {
        const scrollLeft = carousel.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 16; // card width + gap
        const newIndex = Math.round(scrollLeft / cardWidth);
        
        if (newIndex !== currentIndex && newIndex < dots.length) {
            currentIndex = newIndex;
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
    });
    
    // Make dots clickable
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 16;
            carousel.scrollTo({
                left: cardWidth * i,
                behavior: 'smooth'
            });
        });
    });
}

// ===== Animate Stats on Scroll =====
function initStatAnimations() {
    const statElements = document.querySelectorAll('.stat-value[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNumber(entry.target, 0, target, 1500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statElements.forEach(el => observer.observe(el));
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ===== Animate Elements on Scroll =====
function initScrollAnimations() {
    const animateElements = document.querySelectorAll(
        '.problem-card, .step, .result-card, .testimonial-card, .feature-card, .pricing-card, .faq-item, .betslip-card, .todays-pick-card, .discord-preview'
    );
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initSpotsCounter();
    initStickyCTA();
    initScrollAnimations();
    initLiveMemberCounter();
    initBetSlipCarousel();
    initStatAnimations();
});

// ===== Add Mobile Menu Styles =====
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    .mobile-menu-btn.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    .mobile-menu-btn.active span:nth-child(2) {
        opacity: 0;
    }
    .mobile-menu-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }
`;
document.head.appendChild(mobileStyles);
