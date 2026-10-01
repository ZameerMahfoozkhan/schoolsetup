/**
 * School Setup - Navigation Controller
 * Handles mobile hamburger toggle, drawer state, and active navigation links
 */

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const drawer = document.querySelector(".mobile-nav-drawer");

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = toggleBtn.classList.contains("is-open");
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    // Close when clicking mobile nav links
    drawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        closeDrawer();
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggleBtn.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  function openDrawer() {
    toggleBtn.classList.add("is-open");
    toggleBtn.setAttribute("aria-expanded", "true");
    drawer.classList.add("is-active");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    toggleBtn.classList.remove("is-open");
    toggleBtn.setAttribute("aria-expanded", "false");
    drawer.classList.remove("is-active");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Active Link Highlighting
  highlightActiveNavLinks();
});

function highlightActiveNavLinks() {
  const currentPath = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "");
  
  const allNavLinks = document.querySelectorAll(".nav-link, .mobile-nav-link");
  allNavLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (!href) return;
    
    // Normalize href
    const linkPath = href.replace(/^\.\.\//, "/").replace(/^\.\//, "/").replace(/\/index\.html$/, "/").replace(/\/$/, "");
    
    if (currentPath === "" && (linkPath === "" || linkPath === "/")) {
      link.classList.add("is-active");
    } else if (linkPath !== "" && linkPath !== "/" && currentPath.includes(linkPath)) {
      link.classList.add("is-active");
    }
  });
}
