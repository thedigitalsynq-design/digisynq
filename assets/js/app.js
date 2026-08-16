/* ==========================================================================
   DIGISYNQ — Interaction & Kinetic Engine v11.0
   Features:
   - Living Neural Cinema Graph (Physics Particles & Gravitational Cursor)
   - Interactive Live Orchestration Simulator
   - 10-Step Mechanism State Engine
   - Plan A/B/C Resilience Sandbox
   - Mouse Spotlight Physics
   - RAF Throttled Scroll & Lenis Momentum Integration
   ========================================================================== */

(function () {
  'use strict';

  /* ── 0. Anti-FOUC & Initial Load Transition ────────────────────────────── */
  function revealPage() {
    document.documentElement.classList.add('ready');
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(revealPage);
  } else {
    window.addEventListener('load', revealPage);
  }
  setTimeout(revealPage, 1000); // Safety fallback

  /* ── Ambient Background Aurora Orbs ─────────────────────────────────────── */
  const auroraContainer = document.createElement('div');
  auroraContainer.className = 'aurora-mesh';
  auroraContainer.setAttribute('aria-hidden', 'true');
  auroraContainer.innerHTML = `
    <div class="aurora-orb aurora-orb-1"></div>
    <div class="aurora-orb aurora-orb-2"></div>
    <div class="aurora-orb aurora-orb-3"></div>
  `;
  document.body.prepend(auroraContainer);

  /* ── Fluid Interactive Magnetic Cursor (Pointer Devices Only) ──────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const dot = document.createElement('div');
    dot.className = 'custom-cursor-dot';

    const follower = document.createElement('div');
    follower.className = 'custom-cursor-follower';

    document.body.appendChild(dot);
    document.body.appendChild(follower);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderCursor() {
      followerX += (mouseX - followerX) * 0.18;
      followerY += (mouseY - followerY) * 0.18;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Magnetic hover trigger on interactive elements
    const hoverTargets = 'a, button, .card, .spotlight-card, .sim-tab, .mech-step, .plan-tab, input, select, textarea';
    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener('mouseenter', () => follower.classList.add('hovering'));
      el.addEventListener('mouseleave', () => follower.classList.remove('hovering'));
    });
  }

  /* ── 1. Lenis Momentum Smooth Scroll ────────────────────────────────────── */
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.75
    });

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ── 2. Top Scroll Progress Indicator ───────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; z-index: 9999;
    height: 2px; width: 0%;
    background: linear-gradient(90deg, #38bdf8, #818cf8);
    box-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
    pointer-events: none;
    transition: width 80ms linear;
  `;
  document.body.appendChild(progressBar);

  /* ── 3. Throttled Navigation, Scroll Spy & FAB ─────────────────────────── */
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const fabTop = document.getElementById('fab-top');

  let isScrolling = false;

  function onScroll() {
    const y = window.scrollY;

    // Progress Bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      progressBar.style.width = `${(y / docHeight) * 100}%`;
    }

    // Nav Background Glass
    if (nav) nav.classList.toggle('scrolled', y > 40);

    // Back to Top Button
    if (fabTop) fabTop.classList.toggle('visible', y > 500);

    // Scroll Spy
    let currentId = '';
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 150) {
        currentId = sec.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });

    isScrolling = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      requestAnimationFrame(onScroll);
      isScrolling = true;
    }
  }, { passive: true });

  // FAB Back to Top Click
  if (fabTop) {
    fabTop.addEventListener('click', () => {
      if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 4. Mobile Drawer Navigation ────────────────────────────────────────── */
  const menuBtn = document.getElementById('menu-btn');
  const drawer  = document.getElementById('nav-drawer');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    drawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── 5. Smooth Anchor Jump Interceptor ──────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.0 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenisInstance) {
          lenisInstance.scrollTo(targetEl, { duration: 1.05, offset: -75 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ── 6. IntersectionObserver Scroll Reveal ──────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('in'));
  }

  /* ── 7. Dynamic Cursor Spotlight Physics on Glass Cards ─────────────────── */
  const interactiveCards = document.querySelectorAll('.card, .spotlight-card, .capability-card');
  interactiveCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    });
  });

  /* ── 8. Living Neural Cinema Graph Engine ───────────────────────────────── */
  const canvas = document.getElementById('dot-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let dots = [];
    let pulses = [];
    let mouse = { x: null, y: null, radius: 220 };
    let activeCluster = 'all';
    let animFrame;
    let isCanvasActive = true;

    const NODE_TYPES = [
      { label: 'DOP Grade A',   color: '#7dd3fc', cluster: 'people' },
      { label: 'ARRI Alexa 35', color: '#38bdf8', cluster: 'assets' },
      { label: 'Stage 02 (8K)',  color: '#bae6fd', cluster: 'assets' },
      { label: 'ACES Color DI',  color: '#60c8f0', cluster: 'work'   },
      { label: 'Director',       color: '#93c5fd', cluster: 'people' },
      { label: 'Plan B LED',     color: '#a5d8f5', cluster: 'assets' },
      { label: 'Mandate 04',     color: '#7dd3fc', cluster: 'work'   },
      { label: 'Gaffer',         color: '#38bdf8', cluster: 'people' },
      { label: 'Location',       color: '#bae6fd', cluster: 'assets' },
      { label: 'Distribution',   color: '#e0f2fe', cluster: 'intel'  }
    ];

    function resizeCanvas() {
      W = canvas.width  = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
      initNetwork();
    }

    function initNetwork() {
      dots = [];
      pulses = [];
      const numDots = Math.min(Math.floor((W * H) / 11500), 55);

      for (let i = 0; i < numDots; i++) {
        const t = NODE_TYPES[i % NODE_TYPES.length];
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          baseRadius: 2.2 + Math.random() * 2.0,
          label: t.label,
          color: t.color,
          cluster: t.cluster,
          pulsePhase: Math.random() * Math.PI * 2
        });
      }

      for (let p = 0; p < 8; p++) {
        pulses.push({
          source: Math.floor(Math.random() * numDots),
          target: Math.floor(Math.random() * numDots),
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.005
        });
      }
    }

    let resizeDebounce;
    window.addEventListener('resize', () => {
      clearTimeout(resizeDebounce);
      resizeDebounce = setTimeout(resizeCanvas, 120);
    });
    resizeCanvas();

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Node Category Filter Pills
    const clusterPills = document.querySelectorAll('.hero-node-pill');
    clusterPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        clusterPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        activeCluster = pill.getAttribute('data-cluster') || 'all';
      });
    });

    // Pause canvas render when tab is inactive to preserve battery
    document.addEventListener('visibilitychange', () => {
      isCanvasActive = !document.hidden;
      if (isCanvasActive) drawNetwork();
      else cancelAnimationFrame(animFrame);
    });

    function drawNetwork() {
      if (!isCanvasActive) return;
      ctx.clearRect(0, 0, W, H);

      const time = performance.now() * 0.001;

      // Draw Connection Edges
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const d1 = dots[i], d2 = dots[j];
          const dx = d1.x - d2.x, dy = d1.y - d2.y;
          const dist = Math.hypot(dx, dy);
          const isMatch = (activeCluster === 'all' || d1.cluster === activeCluster || d2.cluster === activeCluster);
          const maxDist = isMatch ? 165 : 85;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isMatch ? 0.20 : 0.04);
            ctx.beginPath();
            ctx.moveTo(d1.x, d1.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.strokeStyle = isMatch ? `rgba(56,189,248,${alpha})` : `rgba(255,255,255,${alpha * 0.5})`;
            ctx.lineWidth = (d1.cluster === d2.cluster && isMatch) ? 1.1 : 0.45;
            ctx.stroke();
          }
        }
      }

      // Update & Draw Nodes
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < 12 || d.x > W - 12) d.vx *= -1;
        if (d.y < 12 || d.y > H - 12) d.vy *= -1;

        // Gravitational Interaction with Cursor
        if (mouse.x !== null) {
          const dx = mouse.x - d.x;
          const dy = mouse.y - d.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            d.x -= (dx / dist) * force * 3.0;
            d.y -= (dy / dist) * force * 3.0;
          }
        }

        const isHighlighted = (activeCluster === 'all' || d.cluster === activeCluster);
        const radius = isHighlighted ? (d.baseRadius + Math.sin(time * 2.5 + d.pulsePhase) * 0.9) : 1.6;

        ctx.beginPath();
        ctx.arc(d.x, d.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? d.color : 'rgba(255,255,255,0.08)';

        if (isHighlighted) {
          ctx.shadowBlur = 14;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw HUD Node Label on Desktop
        if (W > 768 && isHighlighted) {
          ctx.font = '8.5px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(125, 211, 252, 0.45)';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, d.x, d.y + 14);
        }
      });

      // Traveling Photon Packets
      pulses.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) {
          pkt.progress = 0;
          pkt.source = Math.floor(Math.random() * dots.length);
          pkt.target = Math.floor(Math.random() * dots.length);
        }

        const s = dots[pkt.source], t = dots[pkt.target];
        if (s && t) {
          const px = s.x + (t.x - s.x) * pkt.progress;
          const py = s.y + (t.y - s.y) * pkt.progress;
          const fadeAlpha = Math.sin(pkt.progress * Math.PI);

          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${fadeAlpha})`;
          ctx.shadowBlur = 16;
          ctx.shadowColor = `rgba(56, 189, 248, ${fadeAlpha * 0.8})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animFrame = requestAnimationFrame(drawNetwork);
    }
    drawNetwork();
  }

  /* ── 9. Interactive Live Orchestration Simulator Engine ─────────────────── */
  const simPresets = {
    feature: {
      crew: '68 Units',
      gear: '26 Pkgs',
      efficiency: '+18%',
      coverage: '96%'
    },
    indie: {
      crew: '14 Units',
      gear: '8 Pkgs',
      efficiency: '+26%',
      coverage: '92%'
    },
    commercial: {
      crew: '24 Units',
      gear: '14 Pkgs',
      efficiency: '+21%',
      coverage: '98%'
    },
    creator: {
      crew: '6 Units',
      gear: '4 Pkgs',
      efficiency: '+31%',
      coverage: '89%'
    }
  };

  const simTabs = document.querySelectorAll('.sim-tab');
  const simCrew = document.getElementById('sim-crew');
  const simGear = document.getElementById('sim-gear');
  const simEff  = document.getElementById('sim-efficiency');
  const simCov  = document.getElementById('sim-coverage');

  if (simTabs.length && simCrew) {
    simTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        simTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        const preset = simPresets[tab.getAttribute('data-scale')];
        if (preset) {
          simCrew.textContent = preset.crew;
          simGear.textContent = preset.gear;
          simEff.textContent  = preset.efficiency;
          simCov.textContent  = preset.coverage;

          // Subtle pulse animation on update
          [simCrew, simGear, simEff, simCov].forEach((el) => {
            el.style.transform = 'scale(1.08)';
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 180);
          });
        }
      });
    });
  }

  /* ── 10. 10-Step Mechanism Carousel Controller ──────────────────────────── */
  const mechData = {
    '1': {
      num: '01 // Define',
      title: 'Define the Production Mandate',
      desc: 'Input script parameters, technical specifications, camera preferences, schedule windows, and budget constraints into DIGISYNQ.',
      example: 'Scenario: Period narrative thriller requires low-light anamorphic package, 14-person crew, and 12 soundstage shoot days in Bengaluru.',
      chain: ['Parse Technical Spec', 'Establish Budget Boundaries', 'Set Milestone Schedule']
    },
    '2': {
      num: '02 // Discover',
      title: 'Discover Available Ecosystem Capacity',
      desc: 'Index hidden, idle, and distributed industry capacity. Map talent, unbooked soundstages, specialty camera packages, and verified skills across regional hubs.',
      example: 'Scenario: 3 Soundstages in Bengaluru have 14 open calendar days next month. 6 Cinematographers are between projects.',
      chain: ['Map Raw Capacity', 'Index Hardware & Spaces', 'Identify Availability Windows']
    },
    '3': {
      num: '03 // Match',
      title: 'Match Compatible Talent & Hardware',
      desc: 'Traverse the capability graph to match creative chemistry, equipment compatibility, and calendar availability across traditional industry silos.',
      example: 'Scenario: Producer seeking specialized anamorphic lenses connects directly to an owner whose package is sitting idle.',
      chain: ['Traverse Network Graph', 'Match Compatibility Score', 'Confirm Calendar Sync']
    },
    '4': {
      num: '04 // Assemble',
      title: 'Assemble the Right-Sized Unit',
      desc: 'Build the precise combination tailored for the mandate instead of standard bloated packages. Right-sized crews, hardware, and locations.',
      example: 'Scenario: Low-budget period thriller composed with agile 14-person crew, vintage prime set, and negotiated off-peak stage rate.',
      chain: ['Assess Mandate Needs', 'Right-Size Crew & Gear', 'Calculate Synergies']
    },
    '5': {
      num: '05 // Execute',
      title: 'Execute with Plan A/B/C Resilience',
      desc: 'Run active shoots with real-time operational support and pre-matched backup options ready to deploy without stopping the production clock.',
      example: 'Scenario: Rain halts outdoor shoot. Virtual production LED bay activates under pre-negotiated Plan B terms seamlessly.',
      chain: ['Monitor Live Milestones', 'Deploy Hot-Swap Standbys', 'Maintain Production Rhythm']
    },
    '6': {
      num: '06 // Track',
      title: 'Track Performance & Flow in Real Time',
      desc: 'Capture wrap logs, time efficiency, equipment integrity, and budget adherence objectively at every stage.',
      example: 'Scenario: Wrap sheet logs: 100% on-time call sheets, zero gear damage, +18% schedule time savings achieved.',
      chain: ['Record Wrap Logs', 'Audit Budget-to-Actual', 'Monitor Daily Handoffs']
    },
    '7': {
      num: '07 // Wrap',
      title: 'Wrap with Integrity & Milestone Escrow',
      desc: 'Close shoot cycles with verified asset handoffs, equipment check-in inspections, and automated milestone fund releases.',
      example: 'Scenario: All camera packages returned undamaged, raw footage checksums verified, post-production escrow released.',
      chain: ['Inspect Equipment Integrity', 'Verify Data Checksums', 'Release Milestone Contracts']
    },
    '8': {
      num: '08 // Verify',
      title: 'Verify Project Evidence & Logs',
      desc: 'Authenticate capability through actual wrap sheets, portfolio breakdowns, peer confirmations, and equipment maintenance history.',
      example: 'Scenario: DOP low-light narrative competency authenticated via verified feature film wrap logs and colorist feedback.',
      chain: ['Review Project Wraps', 'Validate Equipment Handoffs', 'Certify Capability Profile']
    },
    '9': {
      num: '09 // Learn',
      title: 'Learn Before You Blame (Post-Mortem)',
      desc: 'Conduct blameless post-mortems on delays and successes. Translate every production friction point into institutional network memory.',
      example: 'Scenario: Post-wrap analysis uncovers audio interference pattern in location X, automatically flagging it for future productions.',
      chain: ['Conduct Blameless Review', 'Extract Operational Insights', 'Update Matching Algorithms']
    },
    '10': {
      num: '10 // Reuse',
      title: 'Reuse & Redeploy for Next Best Use ↺',
      desc: 'Resources and content immediately flow to their next highest value activity — talent to mentoring, idle gear to rental, master footage to platform cuts.',
      example: 'Scenario: DOP completes shoot and immediately leads a 2-day lighting workshop while camera package moves to commercial shoot.',
      chain: ['Harvest Content Formats', 'Identify Next-Best-Use', 'Compound Network Value ↺']
    }
  };

  const mechBtns        = document.querySelectorAll('.mech-step');
  const mechDetailNum   = document.getElementById('mech-detail-num');
  const mechDetailTitle = document.getElementById('mech-detail-title');
  const mechDetailDesc  = document.getElementById('mech-detail-desc');
  const mechDetailEx    = document.getElementById('mech-detail-ex');
  const mechChainEl     = document.getElementById('mech-chain');
  const mechDetailBox   = document.querySelector('.mech-detail');

  function updateMechanismView(data) {
    if (!mechDetailTitle) return;

    if (mechDetailBox) {
      mechDetailBox.style.opacity = '0';
      mechDetailBox.style.transform = 'translateY(8px)';
    }

    setTimeout(() => {
      if (mechDetailNum)   mechDetailNum.textContent   = data.num;
      if (mechDetailTitle) mechDetailTitle.textContent = data.title;
      if (mechDetailDesc)  mechDetailDesc.textContent  = data.desc;
      if (mechDetailEx)    mechDetailEx.textContent    = data.example;
      if (mechChainEl) {
        mechChainEl.innerHTML = data.chain.map((c) =>
          `<div class="mech-chain-step current">${c}</div>`
        ).join('');
      }

      if (mechDetailBox) {
        mechDetailBox.style.transition = 'opacity 250ms cubic-bezier(0.16, 1, 0.3, 1), transform 250ms cubic-bezier(0.16, 1, 0.3, 1)';
        mechDetailBox.style.opacity = '1';
        mechDetailBox.style.transform = 'translateY(0)';
      }
    }, 120);
  }

  if (mechBtns.length) {
    mechBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        mechBtns.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const data = mechData[btn.getAttribute('data-step')];
        if (data) updateMechanismView(data);
      });
    });
  }

  /* ── 11. Plan A/B/C Resilience Hot-Swap Switcher ────────────────────────── */
  const planTabs   = document.querySelectorAll('.plan-tab');
  const planPanels = document.querySelectorAll('.plan-panel');

  if (planTabs.length && planPanels.length) {
    planTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const plan = tab.getAttribute('data-plan');
        planTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        planPanels.forEach((p) => p.classList.remove('active'));

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        const targetPanel = document.getElementById(`panel-plan-${plan.toLowerCase()}`);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  /* ── 12. Hero Depth Parallax ────────────────────────────────────────────── */
  const heroHeading = document.querySelector('.hero-h1');
  const heroSubtitle = document.querySelector('.hero-sub');

  let parallaxRaf;
  if (heroHeading) {
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(parallaxRaf);
      parallaxRaf = requestAnimationFrame(() => {
        const y = window.scrollY;
        heroHeading.style.transform = `translateY(${y * 0.10}px)`;
        if (heroSubtitle) heroSubtitle.style.transform = `translateY(${y * 0.06}px)`;
      });
    }, { passive: true });
  }

})();
