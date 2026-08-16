/* ============================================================
   DIGISYNQ — app.js
   Interactive Ecosystem, Node Network, ABCDEF & Navigation Logic
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Sticky Navigation ─────────────────────────────────── */
  const navWrapper = document.querySelector('.nav-wrapper');
  const NAV_SCROLL_THRESHOLD = 40;

  function handleNavScroll() {
    if (!navWrapper) return;
    if (window.scrollY > NAV_SCROLL_THRESHOLD) {
      navWrapper.classList.add('scrolled');
    } else {
      navWrapper.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ── 2. Mobile Menu ────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  function toggleMenu(open) {
    if (!hamburger || !navLinks) return;
    const isOpen = open !== undefined ? open : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => toggleMenu());
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
    document.addEventListener('click', (e) => {
      if (!navWrapper.contains(e.target)) toggleMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(false);
    });
  }

  /* ── 3. Smooth Scrolling ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 4. Scroll Reveal Animations ───────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* ── 5. Active Nav Link on Scroll ──────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href*="#"]');

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href').includes(current));
    });
  }
  if (sections.length && navAnchors.length) {
    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  /* ── 6. Interactive Ecosystem Node Switcher ────────────────── */
  const ecoData = {
    brands: {
      title: "BRANDS",
      desc: "Connects with creators for product storytelling, studios for high-end production, influencers for niche reach, photographers for catalog shoots, and campaign teams for full digital launches."
    },
    creators: {
      title: "CREATORS & TALENT",
      desc: "Connects with relevant brands for paid collaborations, studios for professional equipment & space, video editors for post-production speed, and campaign managers for scale."
    },
    studios: {
      title: "STUDIOS & SPACES",
      desc: "Connects with brands requiring product shoots, creators looking for rental sets, production crews needing soundstages, and technicians ready to operate gear."
    },
    technicians: {
      title: "TECHNICIANS & OPERATORS",
      desc: "Connects with high-production studio bookings, brand commercial shoots, creative directors, and independent agencies needing specialized execution skills."
    },
    editors: {
      title: "EDITORS & POST-PRODUCTION",
      desc: "Connects with creators needing high-velocity short-form reels, agencies running multi-platform campaigns, and brands wanting broadcast-quality promotional cuts."
    },
    photographers: {
      title: "PHOTOGRAPHERS & DESIGNERS",
      desc: "Connects with brands needing visual identity & e-commerce catalogs, creators needing thumbnail & cover art, and businesses launching promotional campaigns."
    },
    businesses: {
      title: "BUSINESSES & STARTUPS",
      desc: "Connects with end-to-end digital launch teams, content strategists, performance marketers, and creator networks to gain market presence without overhead."
    },
    professionals: {
      title: "DIGITAL PROFESSIONALS",
      desc: "Connects with high-impact collaborative projects, consultancy mandates, client campaigns, and cross-functional teams looking for specialized problem solving."
    }
  };

  const ecoPills = document.querySelectorAll('.eco-pill');
  const previewTitle = document.getElementById('eco-preview-title');
  const previewDesc = document.getElementById('eco-preview-desc');

  if (ecoPills.length && previewTitle && previewDesc) {
    ecoPills.forEach(pill => {
      pill.addEventListener('click', () => {
        ecoPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const key = pill.getAttribute('data-node');
        if (ecoData[key]) {
          previewTitle.textContent = ecoData[key].title;
          previewDesc.textContent = ecoData[key].desc;
        }
      });

      pill.addEventListener('mouseenter', () => {
        const key = pill.getAttribute('data-node');
        if (ecoData[key]) {
          previewTitle.textContent = ecoData[key].title;
          previewDesc.textContent = ecoData[key].desc;
        }
      });
    });
  }

  /* ── 7. Interactive Hub Nodes Hover (The Gap Visualizer) ───── */
  const hubNodes = document.querySelectorAll('.hub-node');
  const hubCenter = document.querySelector('.hub-center');

  if (hubNodes.length && hubCenter) {
    hubNodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const text = node.textContent.trim();
        hubCenter.innerHTML = `<span style="font-size:0.75rem; color:#050507; font-weight:800;">CONNECT</span><small style="font-size:0.6rem; color:#444;">${text}</small>`;
      });
      node.addEventListener('mouseleave', () => {
        hubCenter.innerHTML = `DIGISYNQ<small>Connection Layer</small>`;
      });
    });
  }

  /* ── 8. Back to Top Button ─────────────────────────────────── */
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 9. Contact Form Handling ──────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn   = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const intentInput = document.getElementById('intent');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill in all required fields.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Sending…';
      }

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { 'Accept': 'application/json' },
        });

        if (response.ok) {
          contactForm.reset();
          if (formSuccess) {
            formSuccess.hidden = false;
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          throw new Error('Server response was not ok');
        }
      } catch {
        // Fallback to mailto
        const name = nameInput.value;
        const email = emailInput.value;
        const intent = intentInput ? intentInput.value : 'General Inquiry';
        const msg = messageInput.value;
        const subject = encodeURIComponent(`DIGISYNQ Connection — ${intent}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPathway: ${intent}\n\nMessage:\n${msg}`);
        window.open(`mailto:thedigitalsynq@gmail.com?subject=${subject}&body=${body}`, '_blank');
        if (formSuccess) {
          formSuccess.textContent = '✅ Opening your email client to complete the connection…';
          formSuccess.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Start a Conversation';
        }
      }
    });
  }

})();
