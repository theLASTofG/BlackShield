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

        // Close menu when clicking a link (except dropdown parents)
        navMenu.querySelectorAll('a').forEach(link => {
            if (!link.closest('.dropdown') || link.getAttribute('href').startsWith('#')) {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenu.querySelector('i').classList.replace('fa-times', 'fa-bars');
                });
            }
        });
    }

    // 1.5. Dropdown Toggle for Mobile/Touch Devices
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        
        // Detect if device is touch-enabled or mobile
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobile = window.innerWidth <= 768;
        
        if (isTouchDevice || isMobile) {
            dropdownLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                
                // Toggle current dropdown
                dropdown.classList.toggle('active');
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });}

    // 2. Header Scroll Effect (with debounce)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                header.style.padding = '5px 0';
                header.style.background = 'rgba(0, 0, 0, 0.98)';
            } else {
                header.style.padding = '10px 0';
                header.style.background = 'rgba(0, 0, 0, 0.9)';
            }
        });
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

    // 5. Chat Widget Functionality (with validation)
    const chatInput = document.querySelector('.chat-widget input');
    const sendButton = document.querySelector('.btn-send');

    if (sendButton && chatInput) {
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                // Visual feedback
                sendButton.textContent = 'SENDING...';
                sendButton.disabled = true;
                
                const whatsappUrl = `https://wa.me/61401803255?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                
                // Reset after short delay
                setTimeout(() => {
                    chatInput.value = '';
                    sendButton.textContent = 'SEND';
                    sendButton.disabled = false;
                }, 1000);
            } else {
                // Shake animation for empty input
                chatInput.style.animation = 'shake 0.3s';
                setTimeout(() => {
                    chatInput.style.animation = '';
                }, 300);
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
