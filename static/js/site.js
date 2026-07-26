/* static/js/site.js
   ARÁKÙNRIN : site-wide interaction layer.
   Handles: sticky nav scroll state, mobile menu, scroll-reveal
   animations, and a lightweight lightbox for the Gallery page.
   Minimal by design : per the Brand Guide's "minimal animation"
   direction for the digital experience.
*/
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. Sticky nav : adds .is-scrolled past a small threshold
     --------------------------------------------------------- */
  function initNav() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var THRESHOLD = 40;
    var ticking = false;

    function update() {
      nav.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     2. Mobile menu toggle
     --------------------------------------------------------- */
  function initMobileMenu() {
    var toggle = document.querySelector(".nav__toggle");
    var menu = document.querySelector(".nav__links");
    if (!toggle || !menu) return;

    function close() {
      toggle.classList.remove("is-open");
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function open() {
      toggle.classList.add("is-open");
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      menu.classList.contains("is-open") ? close() : open();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) close();
    });
  }

  /* ---------------------------------------------------------
     3. Scroll reveal : [data-reveal] fades up once in view
     --------------------------------------------------------- */
  function initReveal() {
    var targets = document.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

    targets.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 40, 240) + "ms";
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------
     4. Gallery lightbox : click a .gallery__item to enlarge
     --------------------------------------------------------- */
  function initLightbox() {
    var items = document.querySelectorAll(".gallery__item[data-lightbox]");
    if (!items.length) return;

    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.innerHTML = '<button class="lightbox__close" aria-label="Close">&times;</button><img class="lightbox__img" alt="">';
    document.body.appendChild(overlay);

    var style = document.createElement("style");
    style.textContent =
      ".lightbox{position:fixed;inset:0;background:rgba(7,24,46,0.96);display:none;align-items:center;justify-content:center;z-index:2000;padding:2rem;}" +
      ".lightbox.is-open{display:flex;}" +
      ".lightbox__img{max-width:90vw;max-height:86vh;object-fit:contain;border:1px solid rgba(200,154,46,0.3);}" +
      ".lightbox__close{position:absolute;top:1.5rem;right:1.5rem;background:none;border:1px solid rgba(200,154,46,0.4);color:#C89A2E;width:44px;height:44px;font-size:1.5rem;line-height:1;}";
    document.head.appendChild(style);

    var img = overlay.querySelector(".lightbox__img");
    var closeBtn = overlay.querySelector(".lightbox__close");

    function closeLightbox() {
      overlay.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    items.forEach(function (item) {
      item.addEventListener("click", function () {
        var src = item.getAttribute("data-lightbox");
        var caption = item.querySelector(".gallery__caption");
        img.src = src;
        img.alt = caption ? caption.textContent : "";
        overlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });
    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  function init() {
    initNav();
    initMobileMenu();
    initReveal();
    initLightbox();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
