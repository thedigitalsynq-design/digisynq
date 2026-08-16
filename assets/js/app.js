/* ==========================================================================
   DIGISYNQ — Creative Industry Intelligence & Orchestration Platform Engine
   Ecosystem Canvas, ABCDEF Engine, Real-Time Project Simulator & Navigation
   ========================================================================== */

(function () {
  'use strict';

  /* ── 1. Sticky Navigation & Scroll Spy ─────────────────────────────────── */
  const navWrapper = document.querySelector('.nav-wrapper');
  const sections   = document.querySelectorAll('section[id]');
  const navLinks   = document.querySelectorAll('.nav__links a[href*="#"]');
  const backToTop  = document.getElementById('back-to-top-btn');

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

    if (backToTop) {
      if (window.scrollY > 450) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 2. Scroll Reveal Animations ───────────────────────────────────────── */
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

  /* ── 3. Living Ecosystem Graph Canvas (Hero Section) ───────────────────── */
  const canvas = document.getElementById('ecosystem-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    const labels = [
      'PEOPLE', 'SKILLS', 'EQUIPMENT', 'LOCATIONS',
      'STUDIOS', 'CAPITAL', 'CONTENT', 'MARKETS', 'AUDIENCES'
    ];
    let mouse = { x: null, y: null, radius: 160 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      initNodes();
    }

    function initNodes() {
      nodes = [];
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.38;

      labels.forEach((label, i) => {
        const angle = (i / labels.length) * Math.PI * 2;
        nodes.push({
          label: label,
          baseX: centerX + Math.cos(angle) * radius,
          baseY: centerY + Math.sin(angle) * radius,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: 4,
          pulse: Math.random() * Math.PI * 2
        });
      });
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

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Center Hub (DIGISYNQ Orchestration Core)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw connection lines to center and adjacent nodes
      nodes.forEach((node, i) => {
        node.pulse += 0.025;
        node.x += node.vx;
        node.y += node.vy;

        // Bounded oscillation
        if (Math.abs(node.x - node.baseX) > 25) node.vx *= -1;
        if (Math.abs(node.y - node.baseY) > 25) node.vy *= -1;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            node.x -= (dx / dist) * force * 2;
            node.y -= (dy / dist) * force * 2;
          }
        }

        // Line to DIGISYNQ center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.12 + Math.sin(node.pulse) * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Line to next node in ring
        const nextNode = nodes[(i + 1) % nodes.length];
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(nextNode.x, nextNode.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Draw node point
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Draw node label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - 10);
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ── 4. ABCDEF Engine Stepper ───────────────────────────────────────────── */
  const engineData = {
    A: {
      letter: "A",
      name: "ACCESS",
      tagline: "Know what exists.",
      desc: "Instant continuous visibility across verified ecosystem assets without unnecessary ownership overhead.",
      items: [
        "People & Verified Specialized Skills",
        "Camera, Lighting & Grip Equipment Pools",
        "Soundstages, Virtual Production & Location Inventories",
        "Post-Production Facilities & Color Suites",
        "Emerging Technologies & Production Toolsets"
      ]
    },
    B: {
      letter: "B",
      name: "BANDWIDTH",
      tagline: "Know what is available.",
      desc: "Real-time verification of capacity, timing, geo-location, verified day rates, and operational readiness.",
      items: [
        "Verified Crew Calendar Availability",
        "Studio Slot & Stage Utilization Windows",
        "Gear Transit Times & Location Readiness",
        "Transparent Budgetary & Rate Parameters",
        "Production Shift & Overtime Management"
      ]
    },
    C: {
      letter: "C",
      name: "COMPOSE",
      tagline: "Build the right combination.",
      desc: "Algorithmically matching requirements with suitability, budget, reliability, and creative intent.",
      items: [
        "Merit-Based Talent & Crew Assembly",
        "Right-Sized Camera & Technical Packages",
        "Schedule-Budget-Location Optimization",
        "Collaborative Resource Bundling",
        "Pre-Emptive Plan A / B / C Resilience Paths"
      ]
    },
    D: {
      letter: "D",
      name: "ORCHESTRATE",
      tagline: "Make it work in reality.",
      desc: "Synchronized project workflow coordination from pre-pro call sheets to daily rushes and final master handoff.",
      items: [
        "Multi-Party Timeline & Milestone Tracking",
        "On-Set Resource & Vendor Coordination",
        "Post-Production Pipeline Asset Hand-off",
        "Multi-Format Content Delivery Automation",
        "Downside Risk & Bottleneck Mitigation"
      ]
    },
    E: {
      letter: "E",
      name: "INTELLIGENCE",
      tagline: "Understand what is happening.",
      desc: "Real-time and post-project analytics across costs, production efficiency, content engagement, and market signals.",
      items: [
        "Granular Budget & Cost Variance Tracking",
        "Audience Cluster Response & Engagement Signals",
        "Seasonal & Competitive Market Trends",
        "Multi-Format Content Performance & Retention",
        "Verified Professional Reliability Metrics"
      ]
    },
    F: {
      letter: "F",
      name: "FLYWHEEL",
      tagline: "Make the next project smarter.",
      desc: "Project → Data → Intelligence → Better Decision → Lower Waste → Next Project. A compounding advantage.",
      items: [
        "Historical Workflow Benchmark Ingestion",
        "Reputation System Credit & Performance Ledger",
        "Reusable Content & Production Asset Catalog",
        "Tighter Budget Forecasting on Next Mandate",
        "Continuous Flywheel Loop Restarts at Stage A ↺"
      ]
    }
  };

  const stepBtns = document.querySelectorAll('.engine-step-btn');
  const engineTitle = document.getElementById('engine-title');
  const engineTagline = document.getElementById('engine-tagline');
  const engineDesc = document.getElementById('engine-desc');
  const engineList = document.getElementById('engine-list');

  function renderEngineStep(key) {
    const data = engineData[key];
    if (!data) return;

    stepBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-stage') === key);
    });

    if (engineTitle) engineTitle.textContent = `${data.letter} — ${data.name}`;
    if (engineTagline) engineTagline.textContent = `"${data.tagline}"`;
    if (engineDesc) engineDesc.textContent = data.desc;

    if (engineList) {
      engineList.innerHTML = data.items.map(item => `
        <li class="engine-list-item">${item}</li>
      `).join('');
    }
  }

  if (stepBtns.length) {
    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stage = btn.getAttribute('data-stage');
        renderEngineStep(stage);
      });
    });
  }

  /* ── 5. Interactive Project Simulator ──────────────────────────────────── */
  const simType = document.getElementById('sim-type');
  const simGenre = document.getElementById('sim-genre');
  const simBudget = document.getElementById('sim-budget');
  const simLocation = document.getElementById('sim-location');

  const outMatch = document.getElementById('out-match');
  const outUtilization = document.getElementById('out-utilization');
  const outResilience = document.getElementById('out-resilience');
  const outRepurposing = document.getElementById('out-repurposing');
  const outRecommendation = document.getElementById('out-recommendation');

  function updateSimulation() {
    if (!simType || !simBudget) return;

    const type = simType.value;
    const budget = simBudget.value;
    const genre = simGenre ? simGenre.value : '';

    let matchScore = 94;
    let utilScore = '78%';
    let resilience = 'High (Plan A/B Active)';
    let repurposing = '8 Derived Assets';
    let recommendation = 'Orchestrated Local Hybrid Crew + Tier-1 Studio Slot';

    if (type === 'feature') {
      matchScore = 96;
      utilScore = '91%';
      resilience = 'Robust (Plan A/B/C Multi-unit)';
      repurposing = '14 Multi-Format Assets';
      recommendation = 'Compose verified Cinematographer (Grade A) with pre-matched soundstage booking and regional location permits.';
    } else if (type === 'ott') {
      matchScore = 95;
      utilScore = '88%';
      resilience = 'Continuous Pipeline';
      repurposing = '24 Social/Trailer Cuts';
      recommendation = 'Deploy modular production pods with parallel post-production editing pipelines.';
    } else if (type === 'creator') {
      matchScore = 98;
      utilScore = '95%';
      resilience = 'Rapid Swap';
      repurposing = '12 Reels / Shorts / Stills';
      recommendation = 'Zero fixed asset overhead. Connect creator audience with pre-lit virtual production studio for 1-day multi-asset capture.';
    } else if (type === 'commercial') {
      matchScore = 97;
      utilScore = '89%';
      resilience = 'Tight Delivery Buffer';
      repurposing = '10 Platform Cutdowns';
      recommendation = 'High-velocity commercial crew pairing with real-time rights-cleared music and same-day color pass.';
    }

    if (outMatch) outMatch.textContent = `${matchScore}%`;
    if (outUtilization) outUtilization.textContent = utilScore;
    if (outResilience) outResilience.textContent = resilience;
    if (outRepurposing) outRepurposing.textContent = repurposing;
    if (outRecommendation) outRecommendation.textContent = recommendation;
  }

  if (simType) {
    [simType, simGenre, simBudget, simLocation].forEach(ctrl => {
      if (ctrl) ctrl.addEventListener('change', updateSimulation);
    });
    updateSimulation();
  }

  /* ── 6. Contact & Interaction Handlers ──────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn   = document.getElementById('submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      const roleInput = document.getElementById('role');

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
          throw new Error('Server returned error');
        }
      } catch {
        const name = nameInput.value;
        const email = emailInput.value;
        const role = roleInput ? roleInput.value : 'Creative Ecosystem Participant';
        const msg = messageInput.value;
        const subject = encodeURIComponent(`DIGISYNQ Ecosystem Connection — ${role}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nRole/Category: ${role}\n\nMessage/Mandate:\n${msg}`);
        window.open(`mailto:thedigitalsynq@gmail.com?subject=${subject}&body=${body}`, '_blank');
        if (formSuccess) {
          formSuccess.textContent = '✅ Opening your email client to complete the connection…';
          formSuccess.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          const btnText = submitBtn.querySelector('.btn-text');
          if (btnText) btnText.textContent = 'Join the Ecosystem →';
        }
      }
    });
  }

})();
