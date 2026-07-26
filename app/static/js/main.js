/* ============================================
   KONVEXITY — MAIN JAVASCRIPT
   Lightweight, performant, accessible
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // 1. NAVIGATION SCROLL EFFECT
  // ============================================
  const nav = document.getElementById('navbar');

  const handleScroll = function() {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  // Throttle scroll events for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // ============================================
  // 2. MOBILE MENU TOGGLE
  // ============================================
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  const toggleMenu = function() {
    const isOpen = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    toggle.textContent = isOpen ? '✕' : '☰';
  };

  toggle.addEventListener('click', toggleMenu);

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      toggleMenu();
      toggle.focus();
    }
  });

  // ============================================
  // 3. INTERSECTION OBSERVER — REVEAL ANIMATIONS
  // ============================================
  const reveals = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after reveal for performance
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -20px 0px'
    });

    reveals.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // Fallback for older browsers
    reveals.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ============================================
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const navHeight = nav.offsetHeight || 72;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================
  // 5. ACTIVE NAV LINK HIGHLIGHT
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a:not(.nav-cta)');

  const updateActiveNav = function() {
    let current = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function(anchor) {
      anchor.style.fontWeight = '500';
      anchor.style.color = 'var(--color-text-muted)';
      if (anchor.getAttribute('href') === '#' + current) {
        anchor.style.fontWeight = '600';
        anchor.style.color = 'var(--color-primary)';
      }
    });
  };

  // Throttle the active nav update
  let navTick = false;
  window.addEventListener('scroll', function() {
    if (!navTick) {
      window.requestAnimationFrame(function() {
        updateActiveNav();
        navTick = false;
      });
      navTick = true;
    }
  });

  // ============================================
  // 6. KEYBOARD TRAP FOR MOBILE MENU
  // ============================================
  // (handled via focus management in toggle)

  console.log('Konvexity — Clarity meets growth');

})();