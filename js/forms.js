/**
 * School Setup - Form Validation & Formspree Lead Submission
 * Integrates directly with Formspree (https://formspree.io/f/mkjogypy)
 * Provides instant feedback, client-side validation, error handling, and optional WhatsApp follow-up.
 */

const FORMSPREE_ENDPOINT = window.BUSINESS_CONFIG?.formspreeEndpoint || "https://formspree.io/f/mkjogypy";

document.addEventListener("DOMContentLoaded", () => {
  initQuoteForm();
  initContactForm();
  initModalQuoteForm();
  initQuickQuoteForms();
});

/**
 * Main Quotation Page Form (request-a-quote/)
 */
function initQuoteForm() {
  const quoteForm = document.getElementById("mainQuoteForm");
  if (!quoteForm) return;

  const successBanner = document.getElementById("quoteSuccessBanner");
  const submitBtn = quoteForm.querySelector('button[type="submit"]');

  quoteForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm(quoteForm)) {
      return;
    }

    clearFormError(quoteForm);
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : "Get My Quote";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-submitting");
      submitBtn.innerHTML = "Submitting Your Quote Request...";
    }

    const formData = new FormData(quoteForm);
    const formValues = Object.fromEntries(formData.entries());

    formData.set("_subject", `School Setup Quote Request: ${formValues.requirementType || "General"} (${formValues.city || "UP"})`);
    formData.set("_page", window.location.href);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        if (window.trackEvent) {
          window.trackEvent("quote_form_submit", {
            requirement: formValues.requirementType,
            city: formValues.city
          });
        }

        quoteForm.style.display = "none";
        if (successBanner) {
          successBanner.classList.add("is-active");
        }

        // WhatsApp redirect button
        const waSuccessBtn = document.getElementById("successWhatsAppBtn");
        if (waSuccessBtn) {
          const summaryText = `*New Quote Request (School Setup)*\n*Name:* ${formValues.fullName}\n*Organization:* ${formValues.orgName || "N/A"}\n*Phone:* ${formValues.phone}\n*City:* ${formValues.city}\n*Requirement:* ${formValues.requirementType}\n*Quantity:* ${formValues.quantity || "N/A"}\n*Details:* ${formValues.message || "Please share quotation."}`;
          const waNumber = window.BUSINESS_CONFIG?.whatsappNumber || "919580659559";
          waSuccessBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(summaryText)}`;
        }
      } else {
        throw new Error("Formspree response not OK");
      }
    } catch (err) {
      console.error("Quote submission error:", err);
      showFormError(quoteForm, "We could not submit your quote request due to a network issue. Please try again or connect directly on WhatsApp (+91 9580659559).");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-submitting");
        submitBtn.innerHTML = origBtnHtml;
      }
    }
  });
}

/**
 * Main Contact Page Form (contact/)
 */
function initContactForm() {
  const contactForm = document.getElementById("mainContactForm");
  if (!contactForm) return;

  const successBanner = document.getElementById("contactSuccessBanner");
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm(contactForm)) {
      return;
    }

    clearFormError(contactForm);
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : "Submit Message";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-submitting");
      submitBtn.innerHTML = "Sending Your Message...";
    }

    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());

    formData.set("_subject", `School Setup Contact Message: ${formValues.name || "Enquiry"} (${formValues.city || "UP"})`);
    formData.set("_page", window.location.href);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        if (window.trackEvent) {
          window.trackEvent("contact_form_submit", {
            city: formValues.city || "Not specified"
          });
        }

        contactForm.style.display = "none";
        if (successBanner) {
          successBanner.classList.add("is-active");
        }
      } else {
        throw new Error("Formspree response not OK");
      }
    } catch (err) {
      console.error("Contact submission error:", err);
      showFormError(contactForm, "We could not send your message right now. Please try again or call us directly at +91 9580659559.");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-submitting");
        submitBtn.innerHTML = origBtnHtml;
      }
    }
  });
}

/**
 * Quick Quote Interactive Modal Form (index.html, product hubs)
 */
function initModalQuoteForm() {
  const modalForm = document.getElementById("modalQuoteForm");
  if (!modalForm) return;

  const successBanner = document.getElementById("modalSuccessBanner");
  const submitBtn = modalForm.querySelector('button[type="submit"]');

  modalForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm(modalForm)) {
      return;
    }

    clearFormError(modalForm);
    const origBtnHtml = submitBtn ? submitBtn.innerHTML : "Submit Price Request";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("is-submitting");
      submitBtn.innerHTML = "Submitting Request...";
    }

    const formData = new FormData(modalForm);
    const formValues = Object.fromEntries(formData.entries());

    formData.set("_subject", `School Setup Quick Price Request: ${formValues.requirementType || "Product"} (${formValues.city || "UP"})`);
    formData.set("_page", window.location.href);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        if (window.trackEvent) {
          window.trackEvent("modal_quote_submit", {
            requirement: formValues.requirementType,
            city: formValues.city
          });
        }

        modalForm.style.display = "none";

        // Update modal title to celebratory state
        const modalTitle = document.getElementById("modalQuoteTitle") || modalForm.closest('.modal-dialog')?.querySelector('.modal-header h3');
        if (modalTitle) {
          modalTitle.textContent = "Enquiry Received!";
        }

        if (successBanner) {
          successBanner.classList.add("is-active");

          // Ensure a dismiss / close button is available inside the thank you banner
          if (!successBanner.querySelector(".btn-close-modal")) {
            const actionsWrap = successBanner.querySelector(".form-success-actions") || successBanner.querySelector(".form-success-text");
            if (actionsWrap) {
              const closeBtn = document.createElement("button");
              closeBtn.type = "button";
              closeBtn.className = "btn btn-close-modal js-modal-close";
              closeBtn.style.marginTop = "0.5rem";
              closeBtn.textContent = "Done / Close Window";
              closeBtn.addEventListener("click", () => {
                const overlay = modalForm.closest('.modal-overlay');
                if (overlay) {
                  overlay.classList.remove('is-active');
                  overlay.setAttribute('aria-hidden', 'true');
                  document.body.style.overflow = '';
                }
              });
              actionsWrap.appendChild(closeBtn);
            }
          }
        }

        const modalWaBtn = document.getElementById("modalSuccessWhatsAppBtn");
        if (modalWaBtn) {
          const summary = `*Quick Price Enquiry (School Setup)*\n*Name:* ${formValues.name}\n*Phone:* ${formValues.phone}\n*City:* ${formValues.city || "UP"}\n*Requirement:* ${formValues.requirementType || "General"}\n*Notes:* ${formValues.notes || "Please share price quotation."}`;
          const waNumber = window.BUSINESS_CONFIG?.whatsappNumber || "919580659559";
          modalWaBtn.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(summary)}`;
        }
      } else {
        throw new Error("Formspree response not OK");
      }
    } catch (err) {
      console.error("Modal quote submission error:", err);
      showFormError(modalForm, "Unable to submit your price request. Please try again or chat with us on WhatsApp (+91 9580659559).");
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-submitting");
        submitBtn.innerHTML = origBtnHtml;
      }
    }
  });
}

/**
 * City Landing Page & Location Quote Forms (.quote-form.js-quote-form)
 */
function initQuickQuoteForms() {
  const forms = document.querySelectorAll(".quote-form.js-quote-form");
  if (!forms.length) return;

  forms.forEach(form => {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateForm(form)) {
        return;
      }

      clearFormError(form);
      const origBtnHtml = submitBtn ? submitBtn.innerHTML : "Get Latest Factory Price";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add("is-submitting");
        submitBtn.innerHTML = "Submitting...";
      }

      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      formData.set("_subject", `School Setup Price Enquiry (${formValues.city || "UP"}): ${formValues.product_name || "Factory Price"}`);
      formData.set("_page", window.location.href);

      try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });

        if (response.ok) {
          if (window.trackEvent) {
            window.trackEvent("city_quote_submit", {
              product: formValues.product_name,
              city: formValues.city
            });
          }

          const waNumber = window.BUSINESS_CONFIG?.whatsappNumber || "919580659559";
          const summary = `*Product Price Enquiry (${formValues.city || "UP"})*\n*Name:* ${formValues.name}\n*Phone:* ${formValues.phone}\n*Product:* ${formValues.product_name || "School Equipment"}\n*Quantity / Scope:* ${formValues.quantity || "N/A"}`;
          const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(summary)}`;

          // Update modal title
          const modalTitle = form.closest('.modal-container, .modal-dialog')?.querySelector('.modal-title, .modal-header h3');
          if (modalTitle) {
            modalTitle.textContent = "Price Request Received!";
          }

          // Replace form with success confirmation card
          form.innerHTML = `
            <div class="form-success-banner is-active" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.75rem; padding: 1.5rem 1rem;">
              <div class="form-success-icon" style="width: 48px; height: 48px; font-size: 1.25rem;">✓</div>
              <div class="form-success-text" style="width: 100%;">
                <h4 style="font-size: 1.2rem; margin-bottom: 0.35rem; color: #14532D;">Price Request Submitted!</h4>
                <p style="margin-bottom: 1.15rem; font-size: 0.875rem; color: #166534; line-height: 1.5;">Thank you! Our institutional coordinator for ${formValues.city || "your area"} will contact you with exact wholesale specifications and delivery estimates.</p>
                <div class="form-success-actions" style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">
                  <a href="${waUrl}" target="_blank" rel="noopener" class="btn btn-whatsapp" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 0.75rem 1rem; font-size: 0.9rem;">
                    <span>Forward Details on WhatsApp</span> &rarr;
                  </a>
                  <button type="button" class="btn btn-close-modal js-modal-close" style="width: 100%; padding: 0.65rem 1rem; font-size: 0.85rem; border: 1px solid #CBD5E1; background: transparent; border-radius: var(--radius-md); cursor: pointer;">Done / Close Window</button>
                </div>
              </div>
            </div>
          `;

          // Bind newly added close button
          const newCloseBtn = form.querySelector('.btn-close-modal');
          if (newCloseBtn) {
            newCloseBtn.addEventListener('click', () => {
              const overlay = form.closest('.modal-overlay');
              if (overlay) {
                overlay.classList.remove('is-active');
                overlay.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
              }
            });
          }
        } else {
          throw new Error("Formspree response not OK");
        }
      } catch (err) {
        console.error("City quote submission error:", err);
        showFormError(form, "Could not submit your request. Please try again or contact us directly on WhatsApp (+91 9580659559).");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-submitting");
          submitBtn.innerHTML = origBtnHtml;
        }
      }
    });
  });
}

/**
 * Helper to display clean error banner within a form
 */
function showFormError(form, message) {
  let errBanner = form.querySelector(".form-error-banner");
  if (!errBanner) {
    errBanner = document.createElement("div");
    errBanner.className = "form-error-banner";
    errBanner.innerHTML = `
      <div class="form-error-icon">!</div>
      <div class="form-error-text">
        <h4>Submission Notice</h4>
        <p class="err-msg-text"></p>
      </div>
    `;
    form.prepend(errBanner);
  }
  const textEl = errBanner.querySelector(".err-msg-text");
  if (textEl) textEl.textContent = message;
  errBanner.classList.add("is-active");
}

function clearFormError(form) {
  const errBanner = form.querySelector(".form-error-banner");
  if (errBanner) {
    errBanner.classList.remove("is-active");
  }
}

/**
 * Universal Form Validation Helper
 */
function validateForm(form) {
  let isValid = true;
  let firstInvalid = null;
  const requiredInputs = form.querySelectorAll("[required]");

  requiredInputs.forEach(input => {
    const value = input.value.trim();
    let fieldValid = true;

    if (!value) {
      fieldValid = false;
    } else if (input.type === "tel") {
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
      if (!firstInvalid) firstInvalid = input;
    } else {
      input.classList.remove("is-invalid");
    }

    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    }, { once: true });
  });

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return isValid;
}
