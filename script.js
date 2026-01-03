// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Countdown Timer
function startCountdown() {
    // Set to 24 hours from now (resets each session for urgency)
    const now = new Date();
    const endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Check if we have a saved end time in localStorage
    let savedEndTime = localStorage.getItem('countdownEnd');
    let targetTime;
    
    if (savedEndTime && new Date(savedEndTime) > now) {
        targetTime = new Date(savedEndTime);
    } else {
        targetTime = endTime;
        localStorage.setItem('countdownEnd', endTime.toISOString());
    }
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetTime - now;
        
        if (diff <= 0) {
            // Reset countdown
            const newEndTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            localStorage.setItem('countdownEnd', newEndTime.toISOString());
            targetTime = newEndTime;
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
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

startCountdown();

// Animate numbers on scroll
const animateNumbers = () => {
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateNumber = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target.toLocaleString();
            }
        };
        
        updateNumber();
    });
};

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            
            // Trigger number animation for stats
            if (entry.target.classList.contains('hero-stats')) {
                animateNumbers();
            }
        }
    });
}, observerOptions);

// Add fade-in animation to sections
document.querySelectorAll('.feature-card, .review-card, .pricing-card, .result-card, .hero-stats').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(el);
});

// Add visible class styles
const style = document.createElement('style');
style.textContent = `
    .fade-in-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Stagger animation for grids
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.features-grid, .reviews-grid, .results-grid, .pricing-grid').forEach(grid => {
    staggerObserver.observe(grid);
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
        mobileMenuBtn.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-open');
            mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Add mobile CTA button to nav-links if on mobile
if (window.innerWidth <= 768) {
    const navCta = document.querySelector('.nav-cta');
    if (navCta && navLinks) {
        const mobileCta = navCta.cloneNode(true);
        mobileCta.classList.add('mobile-nav-cta');
        navLinks.appendChild(mobileCta);
    }
}

// Add mobile menu styles
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .nav-links {
            display: none;
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(10, 10, 15, 0.98);
            backdrop-filter: blur(20px);
            flex-direction: column;
            padding: 40px 24px;
            gap: 0;
            z-index: 999;
        }
        
        .nav-links.mobile-open {
            display: flex;
        }
        
        .nav-links a {
            font-size: 22px;
            font-weight: 600;
            padding: 18px 0;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            color: var(--text-primary);
        }
        
        .nav-links a:last-child {
            border-bottom: none;
        }
        
        .mobile-nav-cta {
            display: flex !important;
            margin-top: 30px;
            padding: 18px 32px;
            font-size: 18px;
            font-weight: 700;
            border-radius: 14px;
            background: var(--gradient-primary);
            text-align: center;
            justify-content: center;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
        
        body.menu-open {
            overflow: hidden;
        }
    }
`;
document.head.appendChild(mobileStyles);

// Parallax effect for hero orbs
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    
    if (orb1 && orb2) {
        orb1.style.transform = `translateY(${scrolled * 0.3}px)`;
        orb2.style.transform = `translateY(${scrolled * -0.2}px)`;
    }
});

// Add hover effect for bet cards in phone mockup
const betCards = document.querySelectorAll('.bet-card');
betCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// Typing effect for hero (optional enhancement)
const createTypingEffect = (element, text, speed = 50) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Trigger hero stats animation immediately
    setTimeout(() => {
        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            heroStats.style.opacity = '1';
            heroStats.style.transform = 'translateY(0)';
            animateNumbers();
        }
    }, 500);
    
    // Add subtle floating animation delay to cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.5}s`;
    });
});

// Console Easter Egg
console.log('%c🎯 LJ Pickz', 'font-size: 24px; font-weight: bold; color: #6C5CE7;');
console.log('%cThe #1 Data-Driven Sports Investing Group', 'font-size: 14px; color: #00D9FF;');
console.log('%cJoin us at https://whop.com/lj-pickz', 'font-size: 12px; color: #A0A0B0;');

// Sticky CTA visibility
const stickyCta = document.querySelector('.sticky-cta');
const heroSection = document.querySelector('.hero');

if (stickyCta && heroSection) {
    window.addEventListener('scroll', () => {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        
        if (window.scrollY > heroBottom - 100) {
            stickyCta.classList.add('visible');
        } else {
            stickyCta.classList.remove('visible');
        }
    });
}

// Add scroll-triggered animations for engagement
const addScrollAnimations = () => {
    const elements = document.querySelectorAll('.feature-card, .review-card, .pricing-card, .result-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

addScrollAnimations();
