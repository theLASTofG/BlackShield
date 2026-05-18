// Header transparency (debounced via requestAnimationFrame)
const header = document.getElementById("main-header");
let rafScheduled = false;
window.addEventListener("scroll", () => {
  if (rafScheduled) return;
  rafScheduled = true;
  requestAnimationFrame(() => {
    header.classList.toggle("scrolled", window.scrollY > 50);
    rafScheduled = false;
  });
});

// Reveal animations using IntersectionObserver (replaces scroll listener)
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Stagger delay for benefit and A/C cards
document.querySelectorAll(".benefit-card, .ac-service-card").forEach((card, index) => {
  card.style.transitionDelay = `${index * 0.1}s`;
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#" || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  });
});

// Chat widget → WhatsApp redirect
const chatInput = document.querySelector(".chat-widget input");
const sendButton = document.querySelector(".btn-send");
if (sendButton && chatInput) {
  const sendMessage = () => {
    const message = chatInput.value.trim();
    if (message) {
      window.open(
        `https://wa.me/61401803255?text=${encodeURIComponent(message)}`,
        "_blank",
        "noopener,noreferrer"
      );
      chatInput.value = "";
    }
  };
  sendButton.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}

// Mobile Menu Toggle
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.getElementById("nav-menu");
if (mobileMenu && navMenu) {
  mobileMenu.addEventListener("click", () => {
    const isActive = mobileMenu.classList.toggle("active");
    navMenu.classList.toggle("active");
    mobileMenu.setAttribute("aria-expanded", String(isActive));
  });

  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      navMenu.classList.remove("active");
      mobileMenu.setAttribute("aria-expanded", "false");
    });
  });
}
