/**
 * School Setup - Form Validation & Lead Submission
 * Validates inputs, handles client feedback, and offers instant WhatsApp submission option
 */

document.addEventListener("DOMContentLoaded", () => {
  initQuoteForm();
  initContactForm();
  initModalQuoteForm();
});

function initQuoteForm() {
  const quoteForm = document.getElementById("mainQuoteForm");
  if (!quoteForm) return;

  const successBanner = document.getElementById("quoteSuccessBanner");

  quoteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm(quoteForm)) {
      return;
    }

    const formData = new FormData(quoteForm);
    const formValues = Object.fromEntries(formData.entries());

    // Analytics event
    if (window.trackEvent) {
      window.trackEvent("quote_form_submit", {
        requirement: formValues.requirementType,
        city: formValues.city
      });
    }

    // Show success feedback
    quoteForm.style.display = "none";
    if (successBanner) {
      successBanner.classList.add("is-active");
    }

    // Set up WhatsApp redirect button in success message
    const waSuccessBtn = document.getElementById("successWhatsAppBtn");
    if (waSuccessBtn) {
      const summaryText = `*New Quote Request*\n*Name:* ${formValues.fullName}\n*Organization:* ${formValues.orgName || "N/A"}\n*Phone:* ${formValues.phone}\n*City:* ${formValues.city}\n*Requirement:* ${formValues.requirementType}\n*Details:* ${formValues.message || "Please share quotation."}`;
      const waNumber = window.BUSINESS_CONFIG?.whatsappNumber || "919580659559";
      waSuccessBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(summaryText)}`;
    }
  });
}

function initContactForm() {
  const contactForm = document.getElementById("mainContactForm");
  if (!contactForm) return;

  const successBanner = document.getElementById("contactSuccessBanner");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm(contactForm)) {
      return;
    }

    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());

    if (window.trackEvent) {
      window.trackEvent("contact_form_submit", {
        city: formValues.city || "Not specified"
      });
    }

    contactForm.style.display = "none";
    if (successBanner) {
      successBanner.classList.add("is-active");
    }
  });
}

function initModalQuoteForm() {
  const modalForm = document.getElementById("modalQuoteForm");
  if (!modalForm) return;

  const successBanner = document.getElementById("modalSuccessBanner");

  modalForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm(modalForm)) {
      return;
    }

    const formData = new FormData(modalForm);
    const formValues = Object.fromEntries(formData.entries());

    if (window.trackEvent) {
      window.trackEvent("modal_quote_submit", {
        product: formValues.product || "",
        requirement: formValues.requirementType
      });
    }

    modalForm.style.display = "none";
    if (successBanner) {
      successBanner.classList.add("is-active");
    }

    // Instant WhatsApp transfer option
    const modalWaBtn = document.getElementById("modalSuccessWhatsAppBtn");
    if (modalWaBtn) {
      const summary = `*Quick Quote Enquiry*\n*Name:* ${formValues.name}\n*Phone:* ${formValues.phone}\n*Requirement:* ${formValues.requirementType}\n*Notes:* ${formValues.notes || "Please share details."}`;
      const waNumber = window.BUSINESS_CONFIG?.whatsappNumber || "919580659559";
      modalWaBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(summary)}`;
    }
  });
}

/**
 * Universal Form Validation Helper
 */
function validateForm(form) {
  let isValid = true;
  const requiredInputs = form.querySelectorAll("[required]");

  requiredInputs.forEach(input => {
    const value = input.value.trim();
    let fieldValid = true;

    if (!value) {
      fieldValid = false;
    } else if (input.type === "tel") {
      // Basic 10-digit Indian phone validation
      const cleanPhone = value.replace(/[\s\-\(\)\+]/g, "");
      if (cleanPhone.length < 10) {
        fieldValid = false;
      }
    } else if (input.type === "email" && value.length > 0) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        fieldValid = false;
      }
    }

    if (!fieldValid) {
      input.classList.add("is-invalid");
      isValid = false;
    } else {
      input.classList.remove("is-invalid");
    }

    // Clear error on input
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    }, { once: true });
  });

  return isValid;
}
