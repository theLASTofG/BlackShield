// Manus Test: GitHub Connector Modification Test
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    // 1. Mobile Menu Toggle
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenu.querySelector('i').classList.replace('fa-times', 'fa-bars');
            });
        });
    }

    // 2. Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(0, 0, 0, 0.9)';
        }
    });

    // 3. Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Chat Widget Functionality
    const chatInput = document.querySelector('.chat-widget input');
    const sendButton = document.querySelector('.btn-send');

    if (sendButton && chatInput) {
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                const whatsappUrl = `https://wa.me/61401803255?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                chatInput.value = '';
            }
        };

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // 6. Video Optimization (Auto-pause when not in view)
    const videos = document.querySelectorAll('video');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play().catch(() => {}); // Catch browser block
            } else {
                entry.target.pause();
            }
        });
    }, { threshold: 0.25 });

    videos.forEach(v => videoObserver.observe(v));
});
