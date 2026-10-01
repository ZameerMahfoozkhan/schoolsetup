/**
 * School Setup - FAQ Accordion Controller
 * Manages accessible accordion opening, closing, and ARIA attributes
 */

document.addEventListener("DOMContentLoaded", () => {
  initFAQAccordions();
});

function initFAQAccordions() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const header = item.querySelector(".faq-header, .faq-question");
    const body = item.querySelector(".faq-body, .faq-answer");

    if (!header || !body) return;

    header.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      // Optional: Close other open FAQs if needed (uncomment for single-open behavior)
      // faqItems.forEach(other => {
      //   if (other !== item) {
      //     other.classList.remove("is-open");
      //     other.querySelector(".faq-header")?.setAttribute("aria-expanded", "false");
      //   }
      // });

      if (isOpen) {
        item.classList.remove("is-open");
        header.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("is-open");
        header.setAttribute("aria-expanded", "true");
      }
    });
  });
}
