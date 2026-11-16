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
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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

// Load decorative background videos only when they are close to the viewport.
const hydrateVideo = (video) => {
  if (video.dataset.loaded === "true") return;
  video.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
  });
  video.dataset.loaded = "true";
  video.load();
};

const lazyVideos = document.querySelectorAll("[data-lazy-video]");
if (!prefersReducedMotion.matches && "IntersectionObserver" in window) {
  const videoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (entry.isIntersecting) {
          hydrateVideo(video);
          video.play().catch(() => {});
        } else if (video.dataset.loaded === "true") {
          video.pause();
        }
      });
    },
    { rootMargin: "300px 0px", threshold: 0.01 }
  );
  lazyVideos.forEach((video) => videoObserver.observe(video));
} else if (!prefersReducedMotion.matches) {
  lazyVideos.forEach((video) => {
    hydrateVideo(video);
    video.play().catch(() => {});
  });
} else {
  document.querySelectorAll("video").forEach((video) => video.pause());
}

// Car photo galleries
document.querySelectorAll("[data-car-gallery]").forEach((gallery) => {
  const photos = Array.from(gallery.querySelectorAll(".car-img"));
  const dotsContainer = gallery.querySelector(".gallery-dots");
  const previousButton = gallery.querySelector(".gallery-prev");
  const nextButton = gallery.querySelector(".gallery-next");
  let activeIndex = 0;

  const dots = photos.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = `gallery-dot${index === 0 ? " active" : ""}`;
    dot.setAttribute("aria-label", `Show photo ${index + 1} of ${photos.length}`);
    dot.setAttribute("aria-pressed", String(index === 0));
    dot.addEventListener("click", () => showPhoto(index));
    dotsContainer.appendChild(dot);
    return dot;
  });

  const showPhoto = (index) => {
    activeIndex = (index + photos.length) % photos.length;
    photos.forEach((photo, photoIndex) => {
      const isActive = photoIndex === activeIndex;
      photo.classList.toggle("active", isActive);
      photo.setAttribute("aria-hidden", String(!isActive));
      dots[photoIndex].classList.toggle("active", isActive);
      dots[photoIndex].setAttribute("aria-pressed", String(isActive));
    });
  };

  previousButton.addEventListener("click", () => showPhoto(activeIndex - 1));
  nextButton.addEventListener("click", () => showPhoto(activeIndex + 1));
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
    window.scrollTo({
      top: targetPosition,
      behavior: prefersReducedMotion.matches ? "auto" : "smooth",
    });
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

// FAQ accordion
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    document.querySelectorAll(".faq-question").forEach((b) => {
      b.setAttribute("aria-expanded", "false");
      b.nextElementSibling.classList.remove("open");
    });
    if (!isOpen) {
      btn.setAttribute("aria-expanded", "true");
      btn.nextElementSibling.classList.add("open");
    }
  });
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById("mobile-menu");
const navMenu = document.getElementById("nav-menu");
if (mobileMenu && navMenu) {
  const setMenuState = (isActive) => {
    mobileMenu.classList.toggle("active", isActive);
    navMenu.classList.toggle("active", isActive);
    mobileMenu.setAttribute("aria-expanded", String(isActive));
    mobileMenu.setAttribute(
      "aria-label",
      isActive ? "Close navigation menu" : "Open navigation menu"
    );
  };

  mobileMenu.addEventListener("click", () => {
    setMenuState(!mobileMenu.classList.contains("active"));
  });

  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navMenu.classList.contains("active")) {
      setMenuState(false);
      mobileMenu.focus();
    }
  });
}
