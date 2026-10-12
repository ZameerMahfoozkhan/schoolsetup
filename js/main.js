/**
 * School Setup - Main JavaScript Configuration & Global Functions
 * Handles business configuration, sticky header, quick quote modal, and global events
 */

const BUSINESS_CONFIG = {
  brandName: "School Setup",
  tagline: "Complete School & Outdoor Solutions",
  whatsappNumber: "919580659559",
  phoneNumber: "+919580659559",
  displayPhone: "+91 9580659559",
  email: "info@school-setup.com",
  formspreeEndpoint: "https://formspree.io/f/mkjogypy",
  serviceAreas: ["Ayodhya", "Sultanpur", "Lucknow"]
};

// Expose globally
window.BUSINESS_CONFIG = BUSINESS_CONFIG;

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initDynamicContactLinks();
  initQuickQuoteModal();
  initAnalyticsTracking();
  initTrustStripTrain();
});

/**
 * Smart Auto-Hiding Sticky Header on Scroll
 * Automatically slides up on scroll-down to maximize viewport on mobile/tablet,
 * and slides smoothly down on scroll-up for immediate navigation access.
 */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const updateHeader = () => {
    const currentScrollY = window.scrollY;
    const isMobile = window.innerWidth <= 1080;

    // Shadow & compact header styling on scroll sitewide
    if (currentScrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    // DESKTOP / PC VIEW: Navbar is ALWAYS fixed and visible, never smart-hidden
    if (!isMobile) {
      header.classList.remove("is-hidden");
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    // MOBILE VIEW: Smart auto-hide on slide-down, instant reveal on slide-up
    const toggleBtn = document.querySelector(".mobile-toggle");
    const drawer = document.querySelector(".mobile-nav-drawer");
    const isMenuOpen = (toggleBtn && toggleBtn.classList.contains("is-open")) ||
                       (drawer && drawer.classList.contains("is-active")) ||
                       header.classList.contains("is-menu-open") ||
                       document.body.classList.contains("menu-open");

    // If mobile menu is open or near page top, header must stay visible
    if (isMenuOpen || currentScrollY <= 60) {
      header.classList.remove("is-hidden");
      lastScrollY = Math.max(0, currentScrollY);
      ticking = false;
      return;
    }

    // Avoid misfiring during iOS rubber-band overscroll at page bottom
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (currentScrollY >= maxScroll - 15) {
      ticking = false;
      return;
    }

    const scrollDiff = currentScrollY - lastScrollY;

    // Ultra-responsive threshold: immediately reacts to finger drag
    if (scrollDiff > 2) {
      // Sliding down -> hide header
      header.classList.add("is-hidden");
      lastScrollY = currentScrollY;
    } else if (scrollDiff < -2) {
      // Sliding up -> immediately reveal header
      header.classList.remove("is-hidden");
      lastScrollY = currentScrollY;
    }
    // If |scrollDiff| <= 2, do not update lastScrollY so subpixel motion accumulates

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      header.classList.remove("is-hidden");
    }
  }, { passive: true });

  // Initial call on mount
  updateHeader();
}

/**
 * Dynamically binds verified phone and whatsapp variables to tel: links and contact spans
 */
function initDynamicContactLinks() {
  // Bind tel links
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.href = `tel:${BUSINESS_CONFIG.phoneNumber}`;
  });

  // Bind display phone text where placeholder is used
  document.querySelectorAll(".dynamic-phone-display").forEach(el => {
    el.textContent = BUSINESS_CONFIG.displayPhone;
  });

  document.querySelectorAll(".dynamic-email-display").forEach(el => {
    el.textContent = BUSINESS_CONFIG.email;
  });
}

/**
 * Interactive Quick Quote Modal System
 */
function initQuickQuoteModal() {
  const modalOverlay = document.getElementById("quickQuoteModal") || document.getElementById("quoteModal") || document.querySelector(".modal-overlay");
  if (!modalOverlay) return;

  const modalTitle = document.getElementById("modalQuoteTitle") || modalOverlay.querySelector(".modal-title");
  const modalRequirementSelect = document.getElementById("modalRequirement");
  const modalNotes = document.getElementById("modalNotes") || modalOverlay.querySelector('input[name="quantity"]') || modalOverlay.querySelector('#modalQty');
  const modalProductInput = document.getElementById("modalProductInput") || modalOverlay.querySelector('#modalProductInput');
  const closeBtns = modalOverlay.querySelectorAll(".js-modal-close, .modal-close-btn, .modal-close");

  // Open modal trigger
  document.addEventListener("click", (e) => {
    const trigger = e.target.closest(".js-open-quote-modal");
    if (!trigger) return;

    e.preventDefault();
    const productTitle = trigger.getAttribute("data-product-title") || trigger.getAttribute("data-product") || "";
    const category = trigger.getAttribute("data-category") || "";

    if (modalTitle) {
      modalTitle.textContent = productTitle ? `Request Price: ${productTitle}` : "Request a Quick Quotation";
    }

    if (modalRequirementSelect && category) {
      modalRequirementSelect.value = category;
    }

    if (modalProductInput && productTitle) {
      modalProductInput.value = productTitle;
    }

    if (modalNotes && productTitle) {
      if (modalNotes.tagName.toLowerCase() === 'textarea') {
        modalNotes.value = `I am interested in pricing and details for: ${productTitle}`;
      } else {
        modalNotes.value = productTitle;
      }
    }

    modalOverlay.classList.add("is-active");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });

  // Close handlers
  const closeModal = () => {
    modalOverlay.classList.remove("is-active");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  closeBtns.forEach(btn => btn.addEventListener("click", closeModal));

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("is-active")) {
      closeModal();
    }
  });
}

/**
 * Analytics Tracking Hook
 */
function initAnalyticsTracking() {
  window.trackEvent = function(eventName, eventData = {}) {
    // Console audit in development; hooks seamlessly into GTM / Google Analytics
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...eventData
      });
    }
    // Debug log for QA
    // console.log(`[Analytics Event]: ${eventName}`, eventData);
  };

  // Bind clicks on phone
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener("click", () => {
      window.trackEvent("phone_click", { destination: BUSINESS_CONFIG.phoneNumber });
    });
  });
}

/**
 * Trust Strip Mobile Train Interaction
 * Handles touch pause/resume smoothly without preventing vertical page scrolls
 */
function initTrustStripTrain() {
  const track = document.querySelector(".trust-train-track");
  if (!track) return;

  track.addEventListener("touchstart", () => {
    track.classList.add("is-paused");
  }, { passive: true });

  track.addEventListener("touchend", () => {
    track.classList.remove("is-paused");
  }, { passive: true });

  track.addEventListener("touchcancel", () => {
    track.classList.remove("is-paused");
  }, { passive: true });
}

