/* ==========================================================================
   DIGISYNQ — Creative Industry Intelligence & Orchestration Platform Engine
   Ecosystem Canvas, Role Switcher, Project Room, Holographic Tilt & Simulator
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

  /* ── 2. Scroll Reveal Observer ─────────────────────────────────────────── */
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

  /* ── 3. Kinetic Title Word Rotator ─────────────────────────────────────── */
  const dynamicTag = document.getElementById('hero-dynamic-tag');
  if (dynamicTag) {
    const words = ['SEARCHABLE.', 'MATCHABLE.', 'COORDINATED.', 'SMARTER.', 'CONNECTED.'];
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % words.length;
      dynamicTag.style.opacity = '0';
      dynamicTag.style.transform = 'translateY(8px)';
      setTimeout(() => {
        dynamicTag.textContent = words[idx];
        dynamicTag.style.opacity = '1';
        dynamicTag.style.transform = 'translateY(0)';
      }, 300);
    }, 2600);
  }

  /* ── 4. Living Photonic Ecosystem Canvas (Hero Section) ─────────────────── */
  const canvas = document.getElementById('ecosystem-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let packets = [];
    const labels = [
      'PEOPLE', 'SKILLS', 'EQUIPMENT', 'LOCATIONS',
      'STUDIOS', 'CAPITAL', 'CONTENT', 'MARKETS', 'AUDIENCES'
    ];
    let mouse = { x: null, y: null, radius: 170 };

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
      initNodes();
    }

    function initNodes() {
      nodes = [];
      packets = [];
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
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: 3.5,
          pulse: Math.random() * Math.PI * 2
        });

        // Initialize traveling photonic packet
        packets.push({
          nodeIndex: i,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004,
          direction: Math.random() > 0.5 ? 1 : -1
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

      // Draw Center DIGISYNQ Intelligence Hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Update and draw nodes
      nodes.forEach((node, i) => {
        node.pulse += 0.03;
        node.x += node.vx;
        node.y += node.vy;

        if (Math.abs(node.x - node.baseX) > 25) node.vx *= -1;
        if (Math.abs(node.y - node.baseY) > 25) node.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            node.x -= (dx / dist) * force * 4;
            node.y -= (dy / dist) * force * 4;
          }
        }

        // Radiating laser link to center hub
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Polygon perimeter link to next node
        const nextNode = nodes[(i + 1) % nodes.length];
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(nextNode.x, nextNode.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.stroke();

        // Node circle
        const currentRadius = node.radius + Math.sin(node.pulse) * 1.2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Label typography
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 16);
      });

      // Draw Photonic Data Packets travelling between Center and Nodes
      packets.forEach(pkt => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) {
          pkt.progress = 0;
          pkt.nodeIndex = Math.floor(Math.random() * nodes.length);
        }
        const targetNode = nodes[pkt.nodeIndex];
        const px = centerX + (targetNode.x - centerX) * pkt.progress;
        const py = centerY + (targetNode.y - centerY) * pkt.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ── 5. Role-Based Entry Portal Switcher (I'M A...) ────────────────────── */
  const roleData = {
    creator: {
      tag: "FOR CREATORS & DIRECTORS",
      title: "Validate, Package, and Execute Your Project on Merit.",
      desc: "Turn your creative vision into an orchestrated production. Access validated genre demand data, assemble Grade-A crew packages, and secure pre-screened locations without agency middlemen.",
      cta: "Explore Creator Opportunities →",
      link: "contact.html",
      metrics: ["Verified Market Demand", "Talent Match Engine", "Downside Protection"]
    },
    producer: {
      tag: "FOR PRODUCERS & SHOWRUNNERS",
      title: "Build Scalable Production Units with Zero Idle Overhead.",
      desc: "Coordinate end-to-end commercial shoots and feature pipelines. Access real-time availability calendars for Grade-A talent, lock idle studio slots, and enforce Plan A/B/C operational resilience.",
      cta: "Initiate Production Mandate →",
      link: "contact.html",
      metrics: ["Real-Time Availability", "Plan A/B/C Standby", "Multi-Format Repurposing"]
    },
    technician: {
      tag: "FOR TECHNICIANS & CREW",
      title: "Turn Verified Skills & Calendar Availability into Recurring Work.",
      desc: "Stop relying on word-of-mouth and favoritism. Get your digital professional ID, benchmark your capability score, and get booked directly for high-value production mandates.",
      cta: "Register Talent Profile →",
      link: "register.html",
      metrics: ["Merit-Based Grade", "Automated Wrap Payouts", "Calendar Monetization"]
    },
    resource: {
      tag: "FOR SOUNDSTAGES, CAMERAS & RENTALS",
      title: "Monetize Idle Soundstage Slots and Camera Bodies.",
      desc: "Convert dormant soundstage days and idle camera/lighting packages into productive utilization. List verified technical specifications and receive pre-screened production bookings.",
      cta: "List Asset Capacity →",
      link: "register.html",
      metrics: ["Zero Balance Sheet Debt", "Verified Client Screenings", "Guaranteed Milestone Payouts"]
    },
    brand: {
      tag: "FOR BRANDS & ADVERTISING AGENCIES",
      title: "High-Impact Commercials with Guaranteed Timelines & 12+ Cuts.",
      desc: "Commission high-velocity brand films and creator campaigns. One orchestrated shoot yields 12+ derived vertical reels, BTS cutdowns, and localized social assets with guaranteed wrap delivery.",
      cta: "Commission Brand Campaign →",
      link: "contact.html",
      metrics: ["12+ Derived Assets", "Guaranteed Delivery Dates", "Audience Trend Matching"]
    }
  };

  const roleTabBtns = document.querySelectorAll('.role-tab-btn');
  const roleTagEl   = document.getElementById('role-tag');
  const roleTitleEl = document.getElementById('role-title');
  const roleDescEl  = document.getElementById('role-desc');
  const roleCtaEl   = document.getElementById('role-cta');
  const roleMetricsEl = document.getElementById('role-metrics');

  if (roleTabBtns.length && roleTagEl) {
    roleTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        roleTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.getAttribute('data-role');
        const data = roleData[key];
        if (data) {
          roleTagEl.textContent = data.tag;
          roleTitleEl.textContent = data.title;
          roleDescEl.textContent = data.desc;
          roleCtaEl.textContent = data.cta;
          roleCtaEl.setAttribute('href', data.link);
          if (roleMetricsEl) {
            roleMetricsEl.innerHTML = data.metrics.map(m => `<span class="badge-tag" style="margin-bottom:0; font-size:0.68rem;">✓ ${m}</span>`).join('');
          }
        }
      });
    });
  }

  /* ── 6. Interactive Silo Connectivity Visualizer ─────────────────────────── */
  const siloBtns = document.querySelectorAll('.silo-switch-btn');
  const siloBoxes = document.querySelectorAll('.silo-box');
  const siloStatusText = document.getElementById('silo-status-text');

  if (siloBtns.length && siloBoxes.length) {
    siloBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        siloBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');

        if (mode === 'orchestrated') {
          siloBoxes.forEach(box => box.classList.add('connected'));
          if (siloStatusText) {
            siloStatusText.innerHTML = '✨ <strong style="color:var(--accent-cyan);">DIGISYNQ ORCHESTRATED:</strong> Real-time connected intelligence removes friction, aligns calendar availability, and coordinates execution.';
          }
        } else {
          siloBoxes.forEach(box => box.classList.remove('connected'));
          if (siloStatusText) {
            siloStatusText.innerHTML = '⚠️ <strong style="color:var(--accent-amber);">FRAGMENTED STATE:</strong> Disconnected silos cause idle gear, scheduling conflicts, delayed deliverables, and blown budgets.';
          }
        }
      });
    });
  }

  /* ── 7. ABCDEF Engine Stepper ────────────────────────────────────────────── */
  const engineStages = {
    A: {
      tagline: '“Know what exists.”',
      title: 'A — ACCESS',
      desc: 'Instant continuous visibility across verified ecosystem assets without unnecessary ownership overhead.',
      items: [
        'People & Verified Specialized Skills',
        'Camera, Lighting & Grip Equipment Pools',
        'Soundstages, Virtual Production & Location Inventories',
        'Post-Production Facilities & Color Suites',
        'Emerging Technologies & Production Toolsets'
      ]
    },
    B: {
      tagline: '“Deploy without ownership liability.”',
      title: 'B — BANDWIDTH',
      desc: 'Flexible, elastic capacity that scales with project demands and contracts when inactive.',
      items: [
        'Zero fixed balance sheet debt or depreciation',
        'Rapid crew scaling from 3-person unit to 120-person feature',
        'Peak capacity absorption without ongoing payroll',
        'Dynamic regional multi-unit deployment'
      ]
    },
    C: {
      tagline: '“Assemble the exact right unit.”',
      title: 'C — COMPOSE',
      desc: 'Intelligent pairing of verified talent, hardware, locations, and vendors based on project parameters.',
      items: [
        'Evidence-based talent matching (Grade + Rating)',
        'Budget-proportional camera and lighting pairing',
        'Geography-optimized location and studio routing',
        'Co-working compatibility graph pairing'
      ]
    },
    D: {
      tagline: '“Execute with synchronized precision.”',
      title: 'D — ORCHESTRATE',
      desc: 'End-to-end coordinated workflow management from development through master release.',
      items: [
        'Unified production communication protocols',
        'Standardized daily capture handoff pipelines',
        'Concurrent BTS & vertical promo harvesting',
        'Integrated milestone escrow payments'
      ]
    },
    E: {
      tagline: '“Decide with real-time evidence.”',
      title: 'E — INTELLIGENCE',
      desc: 'Continuous market signals, genre performance trends, and risk management algorithms.',
      items: [
        'Real-time genre sentiment & release window indexing',
        'Predictive schedule risk mitigation (Plan A/B/C)',
        'Regional studio capacity & ad CPM forecasting',
        'Audience response & retention analytics'
      ]
    },
    F: {
      tagline: '“Every project teaches the next.”',
      title: 'F — FLYWHEEL ↺',
      desc: 'A compounding knowledge graph where every wrap refines matching accuracy, pricing, and outcomes.',
      items: [
        'Automatic talent performance & reliability rating updates',
        'Hardware reliability and maintenance feedback logs',
        'Budget-to-actual efficiency learning loops',
        'Compounding ecosystem network effects'
      ]
    }
  };

  const engineBtns = document.querySelectorAll('.engine-step-btn');
  const engineTitle = document.getElementById('engine-title');
  const engineTagline = document.getElementById('engine-tagline');
  const engineDesc = document.getElementById('engine-desc');
  const engineList = document.getElementById('engine-list');

  if (engineBtns.length && engineTitle) {
    engineBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        engineBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const stage = btn.getAttribute('data-stage');
        const data = engineStages[stage];
        if (data) {
          engineTitle.textContent = data.title;
          engineTagline.textContent = data.tagline;
          engineDesc.textContent = data.desc;
          engineList.innerHTML = data.items.map(item => `<li class="engine-list-item">${item}</li>`).join('');
        }
      });
    });
  }

  /* ── 8. Interactive Feature: Project Room Plan Switcher ─────────────────── */
  const planBtns = document.querySelectorAll('.plan-toggle-btn');
  const planStatusTitle = document.getElementById('room-plan-title');
  const planStatusDesc = document.getElementById('room-plan-desc');
  const riskWeatherPill = document.getElementById('risk-weather');
  const riskStudioPill = document.getElementById('risk-studio');

  const planConfigs = {
    A: {
      title: "PLAN A // Primary Unit Locked",
      desc: "Scheduled Primary DOP, RED V-Raptor package, outdoor Mysuru forest location, and scheduled Stage 2 booking.",
      weather: "🟡 Weather Advisory (Standby)",
      weatherClass: "risk-pill--amber",
      studio: "🟢 Stage 2 Booked",
      studioClass: "risk-pill--green"
    },
    B: {
      title: "PLAN B // Standby Alternate Activated",
      desc: "Verified backup DOP confirmed on standby rate. Virtual production bay locked for rain fallback with zero rescheduling fee.",
      weather: "🟢 Virtual Stage Ready",
      weatherClass: "risk-pill--green",
      studio: "🟢 VP Bay Swapped",
      studioClass: "risk-pill--green"
    },
    C: {
      title: "PLAN C // Modular Contingency",
      desc: "Emergency modular unit shift. Second unit shoot concurrent execution with localized crew package in Bengaluru hub.",
      weather: "🟢 Studio Protected",
      weatherClass: "risk-pill--green",
      studio: "🟢 Indoor Unit Active",
      studioClass: "risk-pill--green"
    }
  };

  if (planBtns.length && planStatusTitle) {
    planBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        planBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const plan = btn.getAttribute('data-plan');
        const cfg = planConfigs[plan];
        if (cfg) {
          planStatusTitle.textContent = cfg.title;
          planStatusDesc.textContent = cfg.desc;
          if (riskWeatherPill) {
            riskWeatherPill.textContent = cfg.weather;
            riskWeatherPill.className = `risk-pill ${cfg.weatherClass}`;
          }
          if (riskStudioPill) {
            riskStudioPill.textContent = cfg.studio;
            riskStudioPill.className = `risk-pill ${cfg.studioClass}`;
          }
        }
      });
    });
  }

  /* ── 9. Multi-Format Aspect Ratio Switcher ──────────────────────────────── */
  const aspectBtns = document.querySelectorAll('.aspect-btn');
  const aspectFrame = document.getElementById('aspect-frame');
  const aspectText = document.getElementById('aspect-text');
  const aspectRes = document.getElementById('aspect-res');

  const aspectData = {
    '16-9':  { label: '16:9 CINEMA MASTER', res: '3840 × 2160 • OTT & Theatrical' },
    '9-16':  { label: '9:16 VERTICAL REEL', res: '1080 × 1920 • Instagram & Shorts' },
    '1-1':   { label: '1:1 SOCIAL PROMO', res: '1080 × 1080 • Square Feed Cut' },
    '239-1': { label: '2.39:1 THEATRICAL SCOPE', res: '4096 × 1716 • Anamorphic Master' }
  };

  if (aspectBtns.length && aspectFrame) {
    aspectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        aspectBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const ratio = btn.getAttribute('data-ratio');
        aspectFrame.setAttribute('data-ratio', ratio);
        const data = aspectData[ratio];
        if (data) {
          aspectText.textContent = data.label;
          aspectRes.textContent = data.res;
        }
      });
    });
  }

  /* ── 10. 3D Holographic Tilt Physics ────────────────────────────────────── */
  const idCards = document.querySelectorAll('.id-card-preview');
  idCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  /* ── 11. Upgraded Real-World Project Simulator ─────────────────────────── */
  const simType     = document.getElementById('sim-type');
  const simGenre    = document.getElementById('sim-genre');
  const simBudget   = document.getElementById('sim-budget');
  const simLocation = document.getElementById('sim-location');

  const outCrew        = document.getElementById('out-crew');
  const outGear        = document.getElementById('out-gear');
  const outEfficiency  = document.getElementById('out-efficiency');
  const outPlanB       = document.getElementById('out-planb');
  const outDerived     = document.getElementById('out-derived');
  const outSummary     = document.getElementById('out-summary');

  function calculateSimulation() {
    if (!simType || !simBudget) return;
    const typeVal = simType.value;
    const budgetVal = simBudget.value;

    let crew = 18;
    let gear = 6;
    let eff = "+11%";
    let planB = "90%";
    let derived = "12 Assets";
    let summary = "Local Hybrid Crew + Studio Slot";

    if (typeVal === 'creator') {
      crew = budgetVal === 'tier1' ? 6 : (budgetVal === 'tier2' ? 12 : 20);
      gear = 4;
      eff = "+18%";
      planB = "96%";
      derived = "24 Derived Cuts";
      summary = "High-Velocity Creator Unit + Rapid Multi-Format Pipeline";
    } else if (typeVal === 'commercial') {
      crew = budgetVal === 'tier1' ? 18 : (budgetVal === 'tier2' ? 32 : 48);
      gear = budgetVal === 'tier1' ? 8 : 14;
      eff = "+15%";
      planB = "94%";
      derived = "16 Derived Cuts";
      summary = "Commercial Grade-A DOP + Anamorphic Package + Stage 1";
    } else if (typeVal === 'ott') {
      crew = budgetVal === 'tier1' ? 28 : (budgetVal === 'tier2' ? 52 : 78);
      gear = 18;
      eff = "+14%";
      planB = "92%";
      derived = "32 Multi-Platform Deliverables";
      summary = "Multi-Episode Production Grid + DI Suite + Local Units";
    } else if (typeVal === 'feature') {
      crew = budgetVal === 'tier1' ? 36 : (budgetVal === 'tier2' ? 64 : 110);
      gear = 24;
      eff = "+16%";
      planB = "95%";
      derived = "40+ Theatrical & Social Packages";
      summary = "Feature Unit Orchestration + Dual Camera + Standby Contingency";
    }

    if (outCrew) outCrew.textContent = crew;
    if (outGear) outGear.textContent = `${gear} Pkgs`;
    if (outEfficiency) outEfficiency.textContent = eff;
    if (outPlanB) outPlanB.textContent = planB;
    if (outDerived) outDerived.textContent = derived;
    if (outSummary) outSummary.textContent = summary;
  }

  [simType, simGenre, simBudget, simLocation].forEach(el => {
    if (el) {
      el.addEventListener('change', calculateSimulation);
    }
  });

  /* ── 12. Talent Live Registration Card Engine ───────────────────────────── */
  const talentForm = document.getElementById('talent-reg-form');
  if (talentForm) {
    const regName       = document.getElementById('reg-name');
    const regRole       = document.getElementById('reg-role');
    const regCity       = document.getElementById('reg-city');
    const regEmail      = document.getElementById('reg-email');
    const regPhone      = document.getElementById('reg-phone');
    const regSpecialty  = document.getElementById('reg-specialty');
    const regExp        = document.getElementById('reg-exp');
    const regGear       = document.getElementById('reg-gear');
    const regPortfolio  = document.getElementById('reg-portfolio');
    const regAvail      = document.getElementById('reg-avail');
    const regRate       = document.getElementById('reg-rate');

    const cardName      = document.getElementById('card-name');
    const cardRole      = document.getElementById('card-role');
    const cardSpecialty = document.getElementById('card-specialty');
    const cardExpBadge  = document.getElementById('card-exp-badge');
    const cardCityBadge = document.getElementById('card-city-badge');
    const cardAvailBadge= document.getElementById('card-avail-badge');
    const regSuccess    = document.getElementById('reg-success');
    const regSubmitBtn  = document.getElementById('reg-submit-btn');

    function updateCardPreview() {
      if (cardName && regName) {
        cardName.textContent = regName.value.trim() ? regName.value.trim() : 'Your Full Name';
      }
      if (cardRole && regRole) {
        cardRole.textContent = regRole.value;
      }
      if (cardSpecialty && regSpecialty) {
        cardSpecialty.textContent = regSpecialty.value.trim() ? regSpecialty.value.trim() : 'Specialized Craft & Technical Proficiency';
      }
      if (cardExpBadge && regExp) {
        cardExpBadge.textContent = regExp.value;
      }
      if (cardCityBadge && regCity) {
        cardCityBadge.textContent = regCity.value.trim() ? regCity.value.trim() : 'Bangalore';
      }
      if (cardAvailBadge && regAvail) {
        cardAvailBadge.textContent = `● ${regAvail.value}`;
      }
    }

    [regName, regRole, regCity, regSpecialty, regExp, regAvail].forEach(el => {
      if (el) el.addEventListener('input', updateCardPreview);
      if (el) el.addEventListener('change', updateCardPreview);
    });

    talentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!regName.value.trim() || !regEmail.value.trim() || !regPhone.value.trim() || !regPortfolio.value.trim()) {
        alert('Please fill in all mandatory fields (Name, Email, WhatsApp, and Portfolio/Reel link).');
        return;
      }

      if (regSubmitBtn) {
        regSubmitBtn.disabled = true;
        regSubmitBtn.innerHTML = '<span>Registering Profile…</span>';
      }

      setTimeout(() => {
        if (regSuccess) {
          regSuccess.hidden = false;
          regSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        if (regSubmitBtn) {
          regSubmitBtn.disabled = false;
          regSubmitBtn.innerHTML = '<span>Profile Registered ✓</span>';
          regSubmitBtn.style.background = 'var(--accent-green)';
          regSubmitBtn.style.color = '#030305';
        }

        const summary = `*DIGISYNQ Talent Registration*\nName: ${regName.value}\nCraft: ${regRole.value}\nCity: ${regCity.value}\nPhone: ${regPhone.value}\nEmail: ${regEmail.value}\nExperience: ${regExp.value}\nGear: ${regGear ? regGear.value : 'N/A'}\nSpecialty: ${regSpecialty.value}\nReel: ${regPortfolio.value}\nAvailability: ${regAvail.value}\nRate: ${regRate ? regRate.value : 'Flexible'}`;
        const waUrl = `https://wa.me/917996548969?text=${encodeURIComponent(summary)}`;
        
        const waLinkBtn = document.createElement('a');
        waLinkBtn.href = waUrl;
        waLinkBtn.target = '_blank';
        waLinkBtn.className = 'btn btn--outline btn--sm';
        waLinkBtn.style.marginTop = '1rem';
        waLinkBtn.style.display = 'inline-block';
        waLinkBtn.textContent = '💬 Confirm via WhatsApp Desk →';
        if (regSuccess && !regSuccess.querySelector('a')) {
          regSuccess.appendChild(document.createElement('br'));
          regSuccess.appendChild(waLinkBtn);
        }
      }, 600);
    });
  }

})();
