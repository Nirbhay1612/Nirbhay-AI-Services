
document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ========================================
  // 1. FOOTER YEAR
  // ========================================

  const footerCopyright = document.querySelector(".footer > span");

  if (footerCopyright) {
    footerCopyright.textContent =
      `© ${new Date().getFullYear()} Nirbhay AI Services`;
  }


  // ========================================
  // 2. NAVBAR SCROLL EFFECT
  // ========================================

  const navbar = document.querySelector(".navbar");

  function updateNavbar() {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 30);
  }

  updateNavbar();

  window.addEventListener("scroll", updateNavbar, {
    passive: true
  });


  // ========================================
  // 3. SMOOTH INTERNAL NAVIGATION
  // ========================================

  const internalLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches ? "auto" : "smooth",
        block: "start"
      });

      // Update the URL hash without an extra jump.
      history.replaceState(null, "", targetId);
    });
  });


  // ========================================
  // 4. REVEAL ANIMATIONS
  // ========================================

  const revealElements = document.querySelectorAll(".reveal");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  // ========================================
  // 5. ACTIVE NAVIGATION LINKS
  // ========================================

  const sections = document.querySelectorAll(
    "section[id]"
  );

  const navLinks = document.querySelectorAll(
    '.nav-links a[href^="#"]'
  );

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const currentId = `#${entry.target.id}`;

          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === currentId;

            link.classList.toggle("active", isActive);

            if (isActive) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0
      }
    );

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }


  // ========================================
  // 6. BACK-TO-TOP BUTTON
  // ========================================

  let backToTop = document.querySelector(".back-to-top");

  if (!backToTop) {
    backToTop = document.createElement("button");
    backToTop.type = "button";
    backToTop.className = "back-to-top";
    backToTop.textContent = "↑";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.setAttribute("title", "Back to top");

    document.body.appendChild(backToTop);
  }

  // Basic styles are provided here so the button works
  // even if its CSS has not been added separately.
  Object.assign(backToTop.style, {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    width: "46px",
    height: "46px",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "14px",
    background: "#7565f5",
    color: "#ffffff",
    fontSize: "24px",
    cursor: "pointer",
    zIndex: "999",
    opacity: "0",
    visibility: "hidden",
    transform: "translateY(10px)",
    transition: "opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease"
  });

  function updateBackToTop() {
    const isVisible = window.scrollY > 400;

    backToTop.style.opacity = isVisible ? "1" : "0";
    backToTop.style.visibility = isVisible ? "visible" : "hidden";
    backToTop.style.transform = isVisible
      ? "translateY(0)"
      : "translateY(10px)";
  }

  updateBackToTop();

  window.addEventListener("scroll", updateBackToTop, {
    passive: true
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });


  // ========================================
  // 7. PROJECT CARD INTERACTIONS
  // ========================================

  const projectCards = document.querySelectorAll(
    ".project-card"
  );

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
    });
  });


  // ========================================
  // 8. CLIENT INQUIRY FORM
  // ========================================

  const inquiryForm = document.getElementById("inquiryForm");
  const formStatus = document.getElementById("formStatus");

  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Browser validation for required fields and email.
      if (!inquiryForm.reportValidity()) {
        return;
      }

      const formData = new FormData(inquiryForm);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const projectType = String(
        formData.get("projectType") || "Not specified"
      ).trim();
      const budget = String(
        formData.get("budget") || "Not specified"
      ).trim();
      const opportunity = String(
        formData.get("opportunity") || "Not specified"
      ).trim();
      const details = String(
        formData.get("details") || ""
      ).trim();

      const subject = `Project Inquiry: ${projectType}`;

      const body = [
        "Hello Nirbhay,",
        "",
        "I would like to discuss a project.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Project Type: ${projectType}`,
        `Budget: ${budget}`,
        `Opportunity: ${opportunity}`,
        "",
        "Project Details:",
        details,
        "",
        "Sent from Nirbhay AI Services website."
      ].join("\n");

      const mailtoURL =
        `mailto:nirbhaytembhurne01@gmail.com` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      if (formStatus) {
        formStatus.textContent =
          "Opening your email app. Please review and send the message there.";

        formStatus.setAttribute("role", "status");
        formStatus.setAttribute("aria-live", "polite");
      }

      // Opens the visitor's default email application.
      // This does NOT send the email automatically.
      window.location.href = mailtoURL;
    });
  }


  // ========================================
  // 9. CONSOLE MESSAGE
  // ========================================

  console.log(
    "%cNirbhay AI Services",
    "font-size: 20px; font-weight: bold; color: #8b7cff;"
  );

  console.log(
    "Portfolio website initialized successfully."
  );

});
