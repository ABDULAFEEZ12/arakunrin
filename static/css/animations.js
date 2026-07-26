/* static/js/animations.js
   Konvexity — site-wide interaction layer.
   Handles: sticky navbar scroll state, mobile menu toggle,
   IntersectionObserver-driven [data-reveal] animations, toast auto-dismiss.
*/
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* -----------------------------------------------------------
     1. Sticky navbar — toggles .is-scrolled past a small threshold
     ----------------------------------------------------------- */
  function initNavbarScrollState() {
    var navbar = document.querySelector(".navbar");
    if (!navbar) return;

    var THRESHOLD = 24;
    var ticking = false;

    function update() {
      if (window.scrollY > THRESHOLD) {
        navbar.classList.add("is-scrolled");
      } else {
        navbar.classList.remove("is-scrolled");
      }
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -----------------------------------------------------------
     2. Mobile menu toggle
     ----------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.querySelector(".navbar__toggle");
    var menu = document.querySelector(".navbar__mobile-menu");
    if (!toggle || !menu) return;

    function closeMenu() {
      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }

    function openMenu() {
      toggle.classList.add("is-open");
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close on link click (mobile nav should not persist after navigation)
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        closeMenu();
      }
    });

    // Close if viewport grows past mobile breakpoint
    window.addEventListener("resize", function () {
      if (window.innerWidth > 768 && menu.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* -----------------------------------------------------------
     3. Scroll reveal — [data-reveal] elements fade/slide/scale in
        once they enter the viewport. Honors reduced-motion.
     ----------------------------------------------------------- */
  function initScrollReveal() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -----------------------------------------------------------
     4. Toast auto-dismiss — any .toast in .toast-stack fades
        itself out after a delay unless it has [data-persist]
     ----------------------------------------------------------- */
  function initToastAutoDismiss() {
    var toasts = document.querySelectorAll(".toast:not([data-persist])");
    toasts.forEach(function (toast) {
      var delay = parseInt(toast.getAttribute("data-duration"), 10) || 5000;
      window.setTimeout(function () {
        toast.style.transition = "opacity 300ms ease, transform 300ms ease";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(8px)";
        window.setTimeout(function () {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 320);
      }, delay);
    });
  }

  /* -----------------------------------------------------------
     5. Active nav link — marks the link matching the current path
        with .is-active, in case server-side rendering doesn't.
     ----------------------------------------------------------- */
  function initActiveNavLink() {
    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    document.querySelectorAll(".navbar__link, .navbar__mobile-link").forEach(function (link) {
      var linkPath = link.getAttribute("href");
      if (!linkPath) return;
      linkPath = linkPath.replace(/\/+$/, "") || "/";
      if (linkPath === path) {
        link.classList.add("is-active");
      }
    });
  }

  /* -----------------------------------------------------------
     Init on DOM ready
     ----------------------------------------------------------- */
  function init() {
    initNavbarScrollState();
    initMobileMenu();
    initScrollReveal();
    initToastAutoDismiss();
    initActiveNavLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();