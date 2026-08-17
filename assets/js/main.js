/**
 * DIGISYNQ — THE NETWORK BETWEEN THE DOTS
 * Interactive Systems Engine v2.0
 * Institutional Operating System Core JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initBackToTop();
  initHeader();
  initMobileDrawer();
  initHeroNetwork();
  initProblemMatrix();
  initOrbitEcosystem();
  initSystemLoop();
  initPipeline();
  initFlywheel();
  initStakeholderTabs();
  initModals();
  initScrollReveal();
  initScrollSpy();
  initStatsCounter();
});

/* ==========================================================================
   1. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress-bar';
  bar.id = 'scroll-progress-bar';
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docHeight) * 100;
    bar.style.width = `${Math.min(scrolled, 100)}%`;
  }, { passive: true });
}

/* ==========================================================================
   2. BACK-TO-TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.id = 'back-to-top-btn';
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   3. HEADER & NAVIGATION (SCROLL STATE)
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('site-header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ==========================================================================
   4. MOBILE DRAWER (WITH HAMBURGER ANIMATION & OVERLAY)
   ========================================================================== */
function initMobileDrawer() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'drawer-overlay';
  overlay.id = 'drawer-overlay';
  document.body.appendChild(overlay);

  // Replace the SVG icon inside toggle with animated bars
  if (menuToggle) {
    menuToggle.innerHTML = `
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
      <span class="hamburger-bar"></span>
    `;
  }

  function openDrawer() {
    mobileDrawer.classList.add('open');
    overlay.classList.add('open');
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    overlay.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });

    overlay.addEventListener('click', closeDrawer);

    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }
}

/* ==========================================================================
   5. HERO NETWORK CANVAS (FRAGMENTED -> CONNECTED STATE)
   ========================================================================== */
function initHeroNetwork() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;

  function setSize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }

  setSize();
  window.addEventListener('resize', setSize, { passive: true });

  const nodeLabels = [
    'TALENT', 'CONTENT', 'BRANDS', 'MEDIA',
    'AUDIENCES', 'TECHNOLOGY', 'INFRASTRUCTURE', 'OPPORTUNITIES',
    'STORIES', 'DATA', 'CAPITAL', 'PLATFORMS'
  ];

  const nodes = nodeLabels.map(label => ({
    x: Math.random() * (window.innerWidth - 200) + 100,
    y: Math.random() * (window.innerHeight - 200) + 100,
    vx: (Math.random() - 0.5) * 0.55,
    vy: (Math.random() - 0.5) * 0.55,
    radius: 4.5,
    label,
    pulse: Math.random() * Math.PI * 2
  }));

  const mouse = { x: null, y: null, radius: 150 };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  let frame = 0;

  function render() {
    if (!width || !height) { requestAnimationFrame(render); return; }
    ctx.clearRect(0, 0, width, height);
    frame++;

    // Scroll-responsive connection threshold — expands as user scrolls into hero
    const connectionDist = 200 + Math.min(window.scrollY / 3, 60);

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < connectionDist) {
          const alpha = (1 - dist / connectionDist) * 0.3;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update & draw nodes
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      node.pulse += 0.04;

      if (node.x < 40 || node.x > width - 40) node.vx *= -1;
      if (node.y < 40 || node.y > height - 40) node.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x -= (dx / dist) * force * 2;
          node.y -= (dy / dist) * force * 2;
        }
      }

      // Pulsing glow radius
      const glowSize = 12 + Math.sin(node.pulse) * 4;

      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = glowSize;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00F0FF';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(node.label, node.x + 8, node.y + 3);
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   6. PROBLEM SECTION 10-NODE MATRIX TOGGLE
   ========================================================================== */
function initProblemMatrix() {
  const cards = document.querySelectorAll('.asset-node-card');
  const btnFragmented = document.getElementById('btn-view-fragmented');
  const btnConnected = document.getElementById('btn-view-connected');

  if (!btnFragmented || !btnConnected) return;

  function setMode(mode) {
    if (mode === 'connected') {
      btnConnected.classList.add('active');
      btnFragmented.classList.remove('active');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.remove('disconnected');
          card.classList.add('connected');
        }, idx * 50);
      });
    } else {
      btnFragmented.classList.add('active');
      btnConnected.classList.remove('active');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.remove('connected');
          card.classList.add('disconnected');
        }, idx * 40);
      });
    }
  }

  btnFragmented.addEventListener('click', () => setMode('fragmented'));
  btnConnected.addEventListener('click', () => setMode('connected'));
}

/* ==========================================================================
   7. CENTRAL CONNECTIVE LAYER (ORBIT ECOSYSTEM CANVAS)
   ========================================================================== */
function initOrbitEcosystem() {
  const canvas = document.getElementById('orbit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;

  function setSize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    positionSatellites();
  }

  setSize();
  window.addEventListener('resize', setSize, { passive: true });

  const satelliteNodes = document.querySelectorAll('.orbit-satellite-node');
  const total = satelliteNodes.length;

  function positionSatellites() {
    if (!width || !height) return;
    const rx = Math.min(width * 0.40, 360);
    const ry = Math.min(height * 0.38, 240);
    const cx = width / 2;
    const cy = height / 2;

    satelliteNodes.forEach((node, i) => {
      const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.dataset.x = x;
      node.dataset.y = y;
    });
  }

  // Signal pulse positions (one per connection, traveling along line)
  const pulseOffsets = Array.from({ length: total }, (_, i) => (i / total));

  let step = 0;
  function drawOrbitLines() {
    if (!width || !height) { requestAnimationFrame(drawOrbitLines); return; }
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    step += 0.015;

    satelliteNodes.forEach((node, i) => {
      const x = parseFloat(node.dataset.x || cx);
      const y = parseFloat(node.dataset.y || cy);

      // Draw subtle background line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = node.classList.contains('active')
        ? 'rgba(0, 240, 255, 0.25)'
        : 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = node.classList.contains('active') ? 1.5 : 1;
      ctx.stroke();

      // Pulsing signal dot
      pulseOffsets[i] = (pulseOffsets[i] + 0.007) % 1;
      const progress = pulseOffsets[i];
      const px = cx + (x - cx) * progress;
      const py = cy + (y - cy) * progress;

      const glowAlpha = node.classList.contains('active') ? 1 : 0.6;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${glowAlpha})`;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = node.classList.contains('active') ? 10 : 5;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(drawOrbitLines);
  }

  drawOrbitLines();

  satelliteNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => {
      satelliteNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
    });
  });
}

/* ==========================================================================
   8. HOW THE SYSTEM WORKS (10-STAGE LOOP STEPPER)
   ========================================================================== */
function initSystemLoop() {
  const stageCards = document.querySelectorAll('.loop-stage-card');
  const inspectorTitle = document.getElementById('inspector-stage-title');
  const inspectorDesc = document.getElementById('inspector-stage-desc');
  const inspectorBadge = document.getElementById('inspector-stage-badge');

  const stageData = [
    { title: "01 — Discover", badge: "Visibility layer", desc: "Make assets, talent, specialized craft, capabilities, facilities and project opportunities universally searchable and contextually discoverable across the entertainment spectrum." },
    { title: "02 — Register", badge: "Ingestion layer", desc: "Bring participants into a structured ecosystem with standardized metadata, capability vectors, portfolio assets, and technical specifications that the system can reason over." },
    { title: "03 — Verify", badge: "Trust protocol", desc: "Establish baseline trust and credentials through track-record audit, verified screen credits, peer validation, and operational capability vetting before any connection is made." },
    { title: "04 — Classify", badge: "TAG 1–10 matrix", desc: "Use functional TAG 1–10 classification to define operational capability, discipline, and specialization. TAG defines function, not hierarchy — TAG 10 is not superior to TAG 01." },
    { title: "05 — Profile", badge: "Identity layer", desc: "Create structured professional identities capturing dynamic availability windows, geographic proximity, technical toolchains, stylistic range, and multi-project collaborative context." },
    { title: "06 — Connect", badge: "Synchronization", desc: "Connect complementary participants across production layers, bridging creators with producers, infrastructure with projects, brands with narrative architects, and communities with creators." },
    { title: "07 — Match", badge: "Precision signals", desc: "Apply multi-dimensional matching signals including availability, budget constraints, stylistic synergy, geographic proximity, collaboration history, and verified execution records." },
    { title: "08 — Execute", badge: "Collaboration flow", desc: "Transition digital connections into streamlined real-world production workflows with synchronized milestones, frictionless communications, and zero economic leakage." },
    { title: "09 — Record", badge: "Signal capture", desc: "Capture verified execution outputs, performance signals, timeline adherence, milestone completion, and community feedback to enrich ecosystem intelligence for future matching." },
    { title: "10 — Reconnect", badge: "Compounding loop", desc: "Feed accumulated project intelligence back into the network to generate faster, higher-conviction matches for future initiatives — making every collaboration smarter than the last." }
  ];

  stageCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      stageCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      if (stageData[index] && inspectorTitle && inspectorDesc && inspectorBadge) {
        const inspector = inspectorTitle.closest('.loop-inspector-box');
        if (inspector) { inspector.style.opacity = '0.4'; }

        setTimeout(() => {
          inspectorTitle.textContent = stageData[index].title;
          inspectorDesc.textContent = stageData[index].desc;
          inspectorBadge.textContent = stageData[index].badge;
          if (inspector) { inspector.style.opacity = '1'; }
        }, 150);
      }
    });
  });
}

/* ==========================================================================
   9. ABCDEF PIPELINE (HOVER HIGHLIGHT CHAIN)
   ========================================================================== */
function initPipeline() {
  const pipelineCards = document.querySelectorAll('.pipeline-stage-card');
  pipelineCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      pipelineCards.forEach(c => { c.style.opacity = '0.5'; c.style.borderColor = ''; });
      card.style.opacity = '1';
      card.style.borderColor = 'var(--accent-cyan)';
    });
    card.addEventListener('mouseleave', () => {
      pipelineCards.forEach(c => { c.style.opacity = '1'; c.style.borderColor = ''; });
    });
  });
}

/* ==========================================================================
   10. COMPOUNDING FLYWHEEL ENGINE
   ========================================================================== */
function initFlywheel() {
  const canvas = document.getElementById('flywheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function setSize() {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  }
  setSize();
  window.addEventListener('resize', setSize, { passive: true });

  const flywheelItems = document.querySelectorAll('.flywheel-node-item');
  const total = flywheelItems.length;
  let angle = 0;
  let activeIndex = 0;
  let lastSwitch = Date.now();

  const segmentColors = [
    'rgba(0, 240, 255, 0.6)',
    'rgba(56, 189, 248, 0.5)',
    'rgba(14, 165, 233, 0.4)',
    'rgba(0, 240, 255, 0.35)',
    'rgba(56, 189, 248, 0.3)',
    'rgba(14, 165, 233, 0.25)',
    'rgba(0, 240, 255, 0.4)',
  ];

  function animateFlywheel() {
    if (!width || !height) { requestAnimationFrame(animateFlywheel); return; }
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const outerR = Math.min(width, height) * 0.44;
    const innerR = outerR * 0.45;
    const gap = 0.025;

    angle += 0.006;

    for (let i = 0; i < total; i++) {
      const startAngle = angle + (i / total) * Math.PI * 2 + gap;
      const endAngle = angle + ((i + 1) / total) * Math.PI * 2 - gap;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();

      const isActive = i === activeIndex;
      ctx.fillStyle = isActive
        ? 'rgba(0, 240, 255, 0.18)'
        : segmentColors[i] || 'rgba(0, 240, 255, 0.08)';
      ctx.strokeStyle = isActive ? 'rgba(0, 240, 255, 0.8)' : 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = isActive ? 1.5 : 0.5;

      if (isActive) {
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 12;
      }
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      const midAngle = angle + ((i + 0.5) / total) * Math.PI * 2;
      const dotX = cx + Math.cos(midAngle) * ((outerR + innerR) / 2);
      const dotY = cy + Math.sin(midAngle) * ((outerR + innerR) / 2);

      ctx.beginPath();
      ctx.arc(dotX, dotY, isActive ? 5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#00F0FF' : 'rgba(255, 255, 255, 0.4)';
      if (isActive) { ctx.shadowColor = '#00F0FF'; ctx.shadowBlur = 10; }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    if (Date.now() - lastSwitch > 2400) {
      activeIndex = (activeIndex + 1) % total;
      flywheelItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === activeIndex);
      });
      lastSwitch = Date.now();
    }

    requestAnimationFrame(animateFlywheel);
  }

  animateFlywheel();

  flywheelItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      activeIndex = idx;
      flywheelItems.forEach((it, i) => it.classList.toggle('active', i === idx));
      lastSwitch = Date.now();
    });
  });
}

/* ==========================================================================
   11. STAKEHOLDER SECTION TABS
   ========================================================================== */
function initStakeholderTabs() {
  const tabs = document.querySelectorAll('.stakeholder-tab-btn');
  const titleEl = document.getElementById('stakeholder-title');
  const descEl = document.getElementById('stakeholder-desc-p');
  const listEl = document.getElementById('stakeholder-benefits');

  const stakeholderData = {
    talent: {
      title: "Talent & Creators",
      desc: "Artists, technicians, cinematographers, writers, sound engineers, editors, VFX specialists, and directors. DIGISYNQ gives verified talent structured identity and direct access to high-conviction productions without opaque middlemen.",
      benefits: [
        "Verified credit graph and immutable track-record portfolio",
        "Direct synchronization with active project requirements",
        "Dynamic availability matching to minimize downtime between productions",
        "Transparent compensation terms and milestone-based execution"
      ]
    },
    producers: {
      title: "Producers & Studios",
      desc: "Production companies, showrunners, and project owners. DIGISYNQ eliminates weeks of fragmented crew assembly, stage booking, and logistical friction through instant capability matching.",
      benefits: [
        "Instant assembly of verified, pre-vetted multi-disciplinary crews",
        "Stage, gear, and location capacity discovery with transparent scheduling",
        "Zero economic leakage through synchronized pipeline workflows",
        "Live progress signals from pre-production through post-mastering"
      ]
    },
    brands: {
      title: "Brands & Partners",
      desc: "Forward-thinking enterprises seeking authentic cultural participation and narrative integration rather than superficial product placement.",
      benefits: [
        "Contextual alignment with culturally resonant narrative projects",
        "Structured co-financing and distribution rights orchestration",
        "Audience synchronization and campaign activation measurement",
        "Direct collaboration with world-class narrative architects"
      ]
    },
    media: {
      title: "Media & Channels",
      desc: "Publishers, streaming services, broadcast networks, and digital communication ecosystems seeking verified content pipelines.",
      benefits: [
        "Predictable, high-quality content supply chains at scale",
        "Early discovery of co-production and licensing opportunities",
        "Audience intelligence and cross-platform distribution coordination",
        "Frictionless verified asset delivery and rights verification"
      ]
    },
    audiences: {
      title: "Audiences & Communities",
      desc: "Fan communities, cultural tastemakers, and engaged audiences who amplify, participate in, and sustain creative universes.",
      benefits: [
        "Direct connection to project evolutions and creator universes",
        "Community-driven cultural validation and signal feedback loops",
        "Early access opportunities and participatory storytelling formats",
        "Recognition for cultural advocacy and community stewardship"
      ]
    },
    infrastructure: {
      title: "Infrastructure & Facilities",
      desc: "Soundstages, post-production suites, virtual production volumes, camera rental houses, and equipment facilities seeking smarter capacity utilization.",
      benefits: [
        "Maximized stage and gear utilization between project cycles",
        "Real-time calendar synchronization with incoming production slates",
        "Automated qualification and insurance verification of operators",
        "Predictable multi-project booking pipelines with advance visibility"
      ]
    },
    technology: {
      title: "Technology & Platforms",
      desc: "Rendering engines, virtual production toolchains, workflow platforms, and post software suites seeking deeper integration into active productions.",
      benefits: [
        "Native integration into verified production workflows",
        "Standardized API connectivity for asset tracking and telemetry",
        "Adoption acceleration across active ecosystem projects",
        "Direct feedback loops from industry-leading operators"
      ]
    },
    associations: {
      title: "Associations & Guilds",
      desc: "Professional guilds, unions, industry councils, and creative federations protecting craft standards and career sustainability.",
      benefits: [
        "Transparent craft standards and fair operational protocols",
        "Standardized functional classification through TAG 1–10",
        "Support for continuous professional development and visibility",
        "Systemic data insights on industry health and employment patterns"
      ]
    }
  };

  function renderStakeholder(key) {
    const data = stakeholderData[key];
    if (!data || !titleEl || !descEl || !listEl) return;

    // Transition effect
    const card = listEl.closest('.stakeholder-detail-card');
    if (card) { card.style.opacity = '0.5'; card.style.transition = 'opacity 0.2s ease'; }

    setTimeout(() => {
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      listEl.innerHTML = data.benefits.map(b => `
        <div class="stakeholder-benefit-item">
          <span class="benefit-bullet">/</span>
          <span>${b}</span>
        </div>
      `).join('');
      if (card) { card.style.opacity = '1'; }
    }, 180);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderStakeholder(tab.dataset.stakeholder);
    });
  });
}

/* ==========================================================================
   12. MODALS & COORDINATION INTAKE
   ========================================================================== */
function initModals() {
  const modalBackdrop = document.getElementById('connect-modal');
  const openBtns = document.querySelectorAll('.open-connect-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const form = document.getElementById('intake-form');

  if (!modalBackdrop) return;

  function openModal() {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Transmitting to Coordination Layer...';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(0,240,255,0.08); border: 1px solid #00F0FF; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #00F0FF; font-size: 1.5rem; box-shadow: 0 0 20px rgba(0,240,255,0.3);">✓</div>
            <h3 style="font-size: 1.6rem; margin-bottom: 0.75rem; color: #ffffff; letter-spacing: -0.02em;">Signal Registered</h3>
            <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 420px; margin: 0 auto 2rem; line-height: 1.6;">Your profile has been ingested into the DIGISYNQ coordination pipeline. Our system orchestrators will synchronize with you within 24 hours.</p>
            <button type="button" class="btn btn-secondary btn-sm" id="modal-done-btn">Close Console</button>
          </div>
        `;
        document.getElementById('modal-done-btn')?.addEventListener('click', closeModal);
      }, 900);
    });
  }
}

/* ==========================================================================
   13. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  // Add reveal classes to major elements
  const revealSelectors = [
    '.section-header',
    '.asset-node-card',
    '.breakdown-card',
    '.asset-light-statement-card',
    '.loop-stage-card',
    '.pipeline-stage-card',
    '.tag-card',
    '.signal-card',
    '.flywheel-node-item',
    '.comparison-column',
    '.stakeholder-tabs',
    '.stakeholder-detail-card',
    '.model-step-card',
    '.problem-conclusion-banner',
    '.big-idea-text-1',
    '.big-idea-text-2',
    '.big-idea-pause-copy',
    '.final-cta-title',
    '.intel-flow-bar'
  ];

  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Stagger children inside grids
  ['asset-nodes-grid', 'breakdowns-grid', 'pipeline-grid', 'tag-matrix-grid', 'signals-grid', 'comparison-grid', 'value-multiplier-diagram', 'loop-stages-timeline'].forEach(gridClass => {
    const grid = document.querySelector(`.${gridClass}`);
    if (!grid) return;
    grid.querySelectorAll('.reveal').forEach((child, i) => {
      child.classList.add(`reveal-delay-${Math.min(i + 1, 6)}`);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ==========================================================================
   14. SCROLL SPY & ACTIVE NAV LINKS
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   15. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const counters = document.querySelectorAll('.stat-value[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = Date.now();

      function tick() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
