/* ============================================================
   DIGISYNQ — app.js
   Handles: Sticky nav, mobile menu, scroll reveals, form
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky Nav ──────────────────────────────────────────── */
  const navWrapper = document.querySelector('.nav-wrapper');
  const NAV_SCROLL_THRESHOLD = 40;

  function handleNavScroll() {
    if (window.scrollY > NAV_SCROLL_THRESHOLD) {
      navWrapper.classList.add('scrolled');
    } else {
      navWrapper.classList.remove('scrolled');
    }
  }

  if (navWrapper) {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();
  }

  /* ── Mobile Menu ─────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => toggleMenu());

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navWrapper.contains(e.target)) toggleMenu(false);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(false);
    });
  }

  /* ── Scroll Reveal (IntersectionObserver) ─────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger cards in a grid
            const delay = entry.target.closest('.services__grid, .about__cards, .ecosystem__nodes')
              ? Array.from(entry.target.parentElement.children).indexOf(entry.target) * 60
              : 0;
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── Smooth Scroll for anchor links ──────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Active Nav Link on Scroll ───────────────────────────── */
  const sections   = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href*="#"]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href').includes(current));
    });
  }

  if (sections.length && navAnchors.length) {
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  /* ── Contact Form Validation & UX ────────────────────────── */
  const contactForm  = document.getElementById('contact-form');
  const formSuccess  = document.getElementById('form-success');
  const submitBtn    = document.getElementById('submit-btn');

  if (contactForm) {
    const fields = {
      name:    { el: document.getElementById('name'),    err: document.getElementById('name-error')    },
      email:   { el: document.getElementById('email'),   err: document.getElementById('email-error')   },
      message: { el: document.getElementById('message'), err: document.getElementById('message-error') },
    };

    function validateField(name) {
      const { el, err } = fields[name];
      let msg = '';
      if (name === 'name'    && !el.value.trim())              msg = 'Name is required.';
      if (name === 'email'   && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) msg = 'Enter a valid email.';
      if (name === 'message' && el.value.trim().length < 20)  msg = 'Message must be at least 20 characters.';
      err.textContent = msg;
      el.classList.toggle('input-error', !!msg);
      return !msg;
    }

    Object.keys(fields).forEach(name => {
      fields[name].el.addEventListener('blur', () => validateField(name));
      fields[name].el.addEventListener('input', () => {
        if (fields[name].err.textContent) validateField(name);
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const valid = Object.keys(fields).every(validateField);
      if (!valid) return;

      const btnText = submitBtn.querySelector('.btn-text');
      btnText.textContent = 'Sending…';
      submitBtn.disabled = true;

      // Try Formspree or simulate success
      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          contactForm.reset();
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          throw new Error('Server error');
        }
      } catch {
        // Fallback: open mailto
        const name    = fields.name.el.value;
        const email   = fields.email.el.value;
        const msg     = fields.message.el.value;
        const service = document.getElementById('service')?.value || '';
        const subject = encodeURIComponent(`DIGISYNQ Inquiry — ${service || 'General'}`);
        const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${msg}`);
        window.open(`mailto:hello@digisynq.com?subject=${subject}&body=${body}`, '_blank');
        formSuccess.textContent = '✅ Opening your email client…';
        formSuccess.hidden = false;
      } finally {
        btnText.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
    });
  }

  /* ── Ecosystem Nodes Micro-animation ──────────────────────── */
  const ecoNodes = document.querySelectorAll('.eco-node:not(.eco-node--center)');
  ecoNodes.forEach((node, i) => {
    node.style.animationDelay = `${i * 0.15}s`;
    node.style.animation = `float ${4 + (i % 3)}s ease-in-out infinite`;
    node.style.animationDelay = `${i * -0.8}s`;
  });

  /* ── Stats Counter Animation ──────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    const isSpecial = ['∞', '°', '+'].some(c => target.includes(c));
    if (isSpecial) { el.textContent = target; return; }
    const num = parseFloat(target);
    const suffix = target.replace(/[\d.]/g, '');
    let start = null;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(num * ease) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.stat__num');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, entry.target.textContent);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  /* ── Back to Top Button ───────────────────────────────────── */
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();

