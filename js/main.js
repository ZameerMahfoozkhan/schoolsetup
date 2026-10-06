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
  email: "info@schoolsetup.in",
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
 * Sticky Header on scroll
 */
function initStickyHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
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

