// Header transparency effect on scroll
const header = document.getElementById('main-header');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
});

// Video playback management for performance
const videos = document.querySelectorAll('video');
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.play();
        } else {
            entry.target.pause();
        }
    });
}, {
    threshold: 0.25
});

videos.forEach(video => {
    videoObserver.observe(video);
});

// Re-select all videos after DOM update
const allVideos = document.querySelectorAll('video');
allVideos.forEach(video => {
    videoObserver.observe(video);
});

// Intersection Observer for reveal animations
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

/* ======================================================
   ✅ SMOOTH SCROLL CORRIGIDO (ÚNICA ALTERAÇÃO REAL)
   ====================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // ignora links inválidos
        if (!href || href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Chat widget functionality (basic)
const chatInput = document.querySelector('.chat-widget input');
const sendButton = document.querySelector('.btn-send');

if (sendButton && chatInput) {
    sendButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            const whatsappUrl = `https://wa.me/61401803255?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
}

// Add hover effect to car cards
const carCards = document.querySelectorAll('.car-card');
carCards.forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add stagger animation to benefit cards
const benefitCards = document.querySelectorAll('.benefit-card');
benefitCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Add stagger animation to A/C service cards
const acServiceCards = document.querySelectorAll('.ac-service-card');
acServiceCards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Console log for debugging
console.log('Black Shield Website - Scripts Loaded Successfully');
console.log('Features: Header transparency, Video backgrounds, Scroll animations, Smooth navigation, WhatsApp integration, A/C Services');
