/**
 * School Setup - FAQ Accordion Controller
 * Manages accessible accordion opening, closing, keyboard interactions, and ARIA attributes
 */

(function() {
  if (window.__faqAccordionsInitialized) return;
  window.__faqAccordionsInitialized = true;

  function toggleFAQ(item, header) {
    if (!item) return;
    const isOpen = item.classList.contains("is-open");
    const btn = header || item.querySelector(".faq-header, .faq-question, button");

    if (isOpen) {
      item.classList.remove("is-open");
      if (btn) btn.setAttribute("aria-expanded", "false");
    } else {
      item.classList.add("is-open");
      if (btn) btn.setAttribute("aria-expanded", "true");
    }
  }

  // Delegated click handler on document
  document.addEventListener("click", function(e) {
    const header = e.target.closest(".faq-header, .faq-question");
    if (header) {
      const item = header.closest(".faq-item");
      if (item) {
        e.preventDefault();
        toggleFAQ(item, header);
      }
    }
  });

  // Keyboard accessibility: Enter or Space on non-button headers
  document.addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
      const header = e.target.closest(".faq-header, .faq-question");
      if (header && header.tagName.toLowerCase() !== "button") {
        const item = header.closest(".faq-item");
        if (item) {
          e.preventDefault();
          toggleFAQ(item, header);
        }
      }
    }
  });

  // Expose global initializer for explicit calls
  window.initFAQAccordions = function() {
    // Handled seamlessly via event delegation
  };
})();

