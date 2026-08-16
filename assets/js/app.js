/* ==========================================================================
   DIGISYNQ — High-End Interactive Engine
   Constellation Canvas, ABCDEF Stepper, Ecosystem Switcher, Dynamic Navigation
   ========================================================================== */

(function () {
  'use strict';

  /* ── 1. Sticky Navigation & Scroll Spy ─────────────────────────────────── */
  const navWrapper = document.querySelector('.nav-wrapper');
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav__menu a[href*="#"]');

  function handleScroll() {
    if (navWrapper) {
      if (window.scrollY > 40) {
        navWrapper.classList.add('scrolled');
      } else {
        navWrapper.classList.remove('scrolled');
      }
    }

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href').includes(current));
    });

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ── 2. Mobile Menu Toggle ─────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  function toggleMobileMenu(force) {
    if (!hamburger || !navMenu) return;
    const open = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', open);
    navMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => toggleMobileMenu());
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleMobileMenu(false));
    });
    document.addEventListener('click', (e) => {
      if (!navWrapper.contains(e.target)) toggleMobileMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMobileMenu(false);
    });
  }

  /* ── 3. Smooth Anchor Scrolling ────────────────────────────────────────── */
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

  /* ── 4. Scroll Reveal Animations ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── 5. Back to Top Action ─────────────────────────────────────────────── */
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 6. Interactive Constellation Canvas (Hero Background) ─────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;
    let mouse = { x: null, y: null, maxDist: 140 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.6 + 1;
        this.baseAlpha = Math.random() * 0.4 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.maxDist) {
            const force = (mouse.maxDist - dist) / mouse.maxDist;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.baseAlpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ── 7. Interactive ABCDEF Stepper ──────────────────────────────────────── */
  const abcdefData = {
    A: {
      step: "STAGE A",
      name: "ANALYZE",
      title: "Understand the Core Problem",
      desc: "Before prescribing solutions, we evaluate brand positioning, product value, audience sentiment, market context, existing resources, and the clear strategic objective.",
      tags: ["Brand Audit", "Market Research", "Objective Alignment", "Resource Assessment"],
      steps: ["01. Identify friction points", "02. Map target audience", "03. Define measurable outcomes"]
    },
    B: {
      step: "STAGE B",
      name: "BUILD",
      title: "Construct the Digital Foundation",
      desc: "We lay down the core infrastructure: visual identity, content architecture, channel setup, launch timelines, and positioning systems that withstand scale.",
      tags: ["Brand Architecture", "Content Framework", "Digital Identity", "Channel Readiness"],
      steps: ["01. Design system creation", "02. Strategic narrative building", "03. Launch infrastructure"]
    },
    C: {
      step: "STAGE C",
      name: "CONNECT",
      title: "Connect the Exact Right People",
      desc: "We match brands with authentic creators, campaigns with targeted influencers, commercial shoots with fully-equipped studios, and projects with skilled technicians.",
      tags: ["Creator Matching", "Studio Sourcing", "Talent Coordination", "Influencer Strategy"],
      steps: ["01. Niche & audience alignment", "02. Crew & studio assembly", "03. Collaboration structuring"]
    },
    D: {
      step: "STAGE D",
      name: "DEVELOP",
      title: "Turn Opportunity into Execution",
      desc: "We transform abstract concepts into tangible storyboards, production schedules, partnership deliverables, promotional funnels, and creative assets.",
      tags: ["Storyboarding", "Creative Direction", "Campaign Playbooks", "Production Schedules"],
      steps: ["01. Scripting & concept finalization", "02. Partnership milestones", "03. Pre-production planning"]
    },
    E: {
      step: "STAGE E",
      name: "EXECUTE",
      title: "Make it Happen in the Real World",
      desc: "On-set production, professional video editing, multi-channel distribution, targeted advertising, community management, and live campaign delivery.",
      tags: ["Video Production", "Post-Production Editing", "Multi-Channel Launch", "Performance Ads"],
      steps: ["01. Commercial shoot & capture", "02. High-speed editing & color", "03. Multi-platform publishing"]
    },
    F: {
      step: "STAGE F",
      name: "FEEDBACK & FORWARD",
      title: "Measure, Learn & Loop Back to A",
      desc: "We track reach, conversion, engagement, and ROI. Every result informs the next move, creating an evolving, compounding growth cycle that loops continuously.",
      tags: ["Analytics Intelligence", "Performance Loop", "Growth Optimization", "Compounding Return ↺"],
      steps: ["01. Data extraction & analysis", "02. Bottleneck identification", "03. Cycle restart at Stage A"]
    }
  };

  const stepBtns = document.querySelectorAll('.timeline-step-btn');
  const stageTitle = document.getElementById('stage-title');
  const stageDesc  = document.getElementById('stage-desc');
  const stageTags  = document.getElementById('stage-tags');
  const stageList  = document.getElementById('stage-steps-list');

  function renderStage(key) {
    const data = abcdefData[key];
    if (!data) return;

    stepBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-stage') === key);
    });

    if (stageTitle) stageTitle.textContent = `${data.name} — ${data.title}`;
    if (stageDesc) stageDesc.textContent = data.desc;

    if (stageTags) {
      stageTags.innerHTML = data.tags.map(t => `<span class="framework-tag">${t}</span>`).join('');
    }

    if (stageList) {
      stageList.innerHTML = data.steps.map(s => `
        <div class="framework-mini-step">
          <span>${s.split('.')[0]}.</span>
          <p>${s.split('.').slice(1).join('.').trim()}</p>
        </div>
      `).join('');
    }
  }

  if (stepBtns.length) {
    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stageKey = btn.getAttribute('data-stage');
        renderStage(stageKey);
      });
    });
  }

  /* ── 8. Interactive Ecosystem Switcher ─────────────────────────────────── */
  const ecoData = {
    brands: {
      title: "BRANDS",
      desc: "Connect with creators for authentic storytelling, studios for commercial shoots, influencers for targeted reach, and execution teams for full launches."
    },
    creators: {
      title: "CREATORS & INFLUENCERS",
      desc: "Connect with high-intent brands for funded collaborations, studios for professional equipment & sets, editors for post-production speed, and campaign managers for scale."
    },
    studios: {
      title: "STUDIOS & SPACES",
      desc: "Connect with commercial brands requiring product shoots, creators looking for set rentals, production crews needing soundstages, and operators ready to work gear."
    },
    technicians: {
      title: "TECHNICIANS & OPERATORS",
      desc: "Connect with studio bookings, brand commercial sets, creative directors, and independent agencies needing specialized camera, drone, or lighting execution."
    },
    editors: {
      title: "EDITORS & POST-PRODUCTION",
      desc: "Connect with high-velocity creators needing fast short-form content, digital agencies running multi-platform campaigns, and brands wanting broadcast-grade cuts."
    },
    photographers: {
      title: "PHOTOGRAPHERS & DESIGNERS",
      desc: "Connect with brands needing visual identity and e-commerce shoots, creators needing thumbnail and cover art, and businesses launching product campaigns."
    },
    businesses: {
      title: "BUSINESSES & STARTUPS",
      desc: "Connect with end-to-end digital launch teams, content strategists, performance marketers, and creator networks to establish market presence without agency overhead."
    },
    professionals: {
      title: "DIGITAL PROFESSIONALS",
      desc: "Connect with high-impact collaborative projects, strategic consultancy mandates, client campaigns, and cross-functional teams looking for specialized problem solvers."
    }
  };

  const ecoBtns = document.querySelectorAll('.eco-node-btn');
  const ecoTitle = document.getElementById('eco-result-title');
  const ecoDesc  = document.getElementById('eco-result-desc');

  if (ecoBtns.length && ecoTitle && ecoDesc) {
    ecoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        ecoBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const node = btn.getAttribute('data-node');
        if (ecoData[node]) {
          ecoTitle.textContent = ecoData[node].title;
          ecoDesc.textContent = ecoData[node].desc;
        }
      });
    });
  }

  /* ── 9. Interactive Gap Visualizer Core Hover ──────────────────────────── */
  const orbitNodes = document.querySelectorAll('.orbit-node');
  const gapHubCore = document.querySelector('.gap-hub-core');

  if (orbitNodes.length && gapHubCore) {
    orbitNodes.forEach(node => {
      node.addEventListener('mouseenter', () => {
        const text = node.textContent.trim();
        gapHubCore.innerHTML = `<span style="font-size:0.8rem; font-weight:800;">SYNC</span><small>${text}</small>`;
      });
      node.addEventListener('mouseleave', () => {
        gapHubCore.innerHTML = `DIGISYNQ<small>Connection Layer</small>`;
      });
    });
  }

  /* ── 10. Contact Form Submissions & Fallback ────────────────────────────── */
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
        if (btnText) btnText.textContent = 'Connecting…';
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
          throw new Error('Server returned non-200 status');
        }
      } catch {
        // Mailto fallback
        const name = nameInput.value;
        const email = emailInput.value;
        const intent = intentInput ? intentInput.value : 'General Inquiry';
        const msg = messageInput.value;
        const subject = encodeURIComponent(`DIGISYNQ Connection — ${intent}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPathway: ${intent}\n\nProblem/Opportunity:\n${msg}`);
        window.open(`mailto:thedigitalsynq@gmail.com?subject=${subject}&body=${body}`, '_blank');
        if (formSuccess) {
          formSuccess.textContent = '✅ Opening your email client to complete the connection…';
          formSuccess.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Start a Conversation →';
        }
      }
    });
  }

})();
