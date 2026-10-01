/**
 * School Setup - WhatsApp Integration Controller
 * Generates context-aware WhatsApp links and tracking
 */

const BUSINESS_WHATSAPP = window.BUSINESS_CONFIG?.whatsappNumber || "919580659559";

document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppLinks();
});

function initWhatsAppLinks() {
  // Update all WhatsApp buttons across the DOM
  document.querySelectorAll(".js-whatsapp-link").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      
      const type = btn.getAttribute("data-wa-type") || "general";
      const product = btn.getAttribute("data-wa-product") || "";
      const city = btn.getAttribute("data-wa-city") || "";
      const service = btn.getAttribute("data-wa-service") || "";

      let message = "";

      switch (type) {
        case "product":
          message = `Hello, I am interested in ${product || "School Setup products"}. Please share price and details.`;
          break;
        case "city":
          message = `Hello, I need ${service || "school setup solutions"} in ${city || "Uttar Pradesh"}. Please share details and quotation.`;
          break;
        case "project":
          message = `Hello, I need a quotation for a complete school/project setup. Please contact me.`;
          break;
        case "general":
        default:
          message = `Hello, I am interested in School Setup products. Please share details and pricing.`;
          break;
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodedMessage}`;

      if (window.trackEvent) {
        window.trackEvent("whatsapp_click", {
          type,
          product,
          city,
          service
        });
      }

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  });

  // Direct floating button binding if not using .js-whatsapp-link class
  const floatingBtn = document.querySelector(".floating-whatsapp");
  if (floatingBtn && !floatingBtn.classList.contains("js-whatsapp-link")) {
    floatingBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const message = encodeURIComponent("Hello, I am interested in School Setup products. Please share details and pricing.");
      if (window.trackEvent) {
        window.trackEvent("whatsapp_click", { type: "floating" });
      }
      window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${message}`, "_blank", "noopener,noreferrer");
    });
  }
}
