/**
 * DIGISYNQ — THE NETWORK BETWEEN THE DOTS
 * Interactive Systems Engine v3.0
 * Institutional Operating System Core JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initBackToTop();
  initHeader();
  initMobileDrawer();
  initSmoothNavScroll();
  initHeroNetwork();
  initProblemMatrix();
  initOrbitEcosystem();
  initSystemLoop();
  initPipeline();
  initTagMatrix();
  initFlywheel();
  initStakeholderTabs();
  initModelSteps();
  initModals();
  initScrollReveal();
  initScrollSpy();
  initStatsCounter();
});

/* ==========================================================================
   1. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  let bar = document.getElementById('scroll-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    bar.id = 'scroll-progress-bar';
    document.body.prepend(bar);
  }

  function updateProgress() {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const scrolled = (window.scrollY / docHeight) * 100;
    bar.style.width = `${Math.min(Math.max(scrolled, 0), 100)}%`;
  }

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

/* ==========================================================================
   2. FLOATING BACK-TO-TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  let btn = document.getElementById('back-to-top-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.id = 'back-to-top-btn';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    `;
    document.body.appendChild(btn);
  }

  function toggleBtn() {
    btn.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', toggleBtn, { passive: true });
  toggleBtn();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   3. HEADER & NAVIGATION
   ========================================================================== */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   4. SMOOTH SCROLL WITH HEADER OFFSET
   ========================================================================== */
function initSmoothNavScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 10;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE DRAWER WITH ANIMATED HAMBURGER
   ========================================================================== */
function initMobileDrawer() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (!menuToggle || !mobileDrawer) return;

  let overlay = document.getElementById('drawer-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.id = 'drawer-overlay';
    document.body.appendChild(overlay);
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

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    mobileDrawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  overlay.addEventListener('click', closeDrawer);

  mobileDrawer.querySelectorAll('.mobile-nav-link, .btn').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   6. HERO NETWORK CANVAS (CENTRAL PROJECT NODE + 12 CONNECTED RESOURCES)
   ========================================================================== */
function initHeroNetwork() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0, dpr = window.devicePixelRatio || 1;

  function setSize() {
    if (!canvas.parentElement) return;
    dpr = window.devicePixelRatio || 1;
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  setSize();
  window.addEventListener('resize', setSize, { passive: true });

  // 12 Connected Resource Nodes around Central Project Node
  const resourceNames = [
    'TALENT', 'TECHNICIANS', 'STUDIOS', 'CONTENT',
    'CREATORS', 'SOCIAL', 'PR', 'MEDIA',
    'BRANDS', 'AUDIENCE', 'ANALYTICS', 'MONETIZATION'
  ];

  const ripples = [];
  const mouse = { x: null, y: null, radius: 180 };

  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Click energy ripple
  canvas.parentElement.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    ripples.push({ x: clickX, y: clickY, r: 5, maxR: 220, alpha: 0.9 });
  });

  let time = 0;

  function render() {
    if (!width || !height) {
      requestAnimationFrame(render);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    time += 0.015;

    // Central Project Coordinates
    const cx = width / 2;
    const cy = height * 0.44;

    // Draw ripples
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rip = ripples[r];
      rip.r += 3.5;
      rip.alpha -= 0.018;
      if (rip.alpha <= 0 || rip.r >= rip.maxR) {
        ripples.splice(r, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(52, 211, 153, ${rip.alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Dynamic radius for satellite orbit
    const rx = Math.min(width * 0.42, 480);
    const ry = Math.min(height * 0.36, 260);

    // Draw elliptical orbit guide
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.restore();

    // Resource Nodes positions & connections
    const nodePositions = [];
    const count = resourceNames.length;

    for (let i = 0; i < count; i++) {
      const baseAngle = (i / count) * Math.PI * 2 + time * 0.15;
      // Slight floating motion
      const floatOffset = Math.sin(time * 2 + i) * 6;
      const nx = cx + Math.cos(baseAngle) * (rx + floatOffset);
      const ny = cy + Math.sin(baseAngle) * (ry + floatOffset);

      nodePositions.push({ x: nx, y: ny, label: resourceNames[i], index: i });

      // Connecting line between Central Project Node and Resource
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.14)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Flowing energy pulses (inward and outward)
      const pulsePhaseIn = (time * 0.6 + i * 0.12) % 1;
      const pxIn = nx + (cx - nx) * pulsePhaseIn;
      const pyIn = ny + (cy - ny) * pulsePhaseIn;

      ctx.beginPath();
      ctx.arc(pxIn, pyIn, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      const pulsePhaseOut = (time * 0.5 + i * 0.18 + 0.5) % 1;
      const pxOut = cx + (nx - cx) * pulsePhaseOut;
      const pyOut = cy + (ny - cy) * pulsePhaseOut;

      ctx.beginPath();
      ctx.arc(pxOut, pyOut, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Satellite Node
      ctx.beginPath();
      ctx.arc(nx, ny, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#34d399';
      ctx.fill();

      // Satellite Label
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.textAlign = nx > cx ? 'left' : 'right';
      const labelOffset = nx > cx ? 10 : -10;
      ctx.fillText(resourceNames[i], nx + labelOffset, ny + 3);
    }

    // Connect adjacent resources to create network mesh
    for (let i = 0; i < count; i++) {
      const nextIdx = (i + 1) % count;
      ctx.beginPath();
      ctx.moveTo(nodePositions[i].x, nodePositions[i].y);
      ctx.lineTo(nodePositions[nextIdx].x, nodePositions[nextIdx].y);
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw Central Project Node
    const centerPulse = Math.sin(time * 3) * 4;
    ctx.save();
    ctx.shadowColor = 'rgba(52, 211, 153, 0.6)';
    ctx.shadowBlur = 24 + centerPulse;

    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#34d399';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#060709';
    ctx.fill();
    ctx.restore();

    // Central Label Badge
    ctx.font = '700 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.fillText('FILM / SERIAL / DIGITAL PROJECT', cx, cy + 30);

    if (isCanvasVisible) {
      animFrameId = requestAnimationFrame(render);
    }
  }

  let animFrameId = null;
  let isCanvasVisible = true;

  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isCanvasVisible = entry.isIntersecting;
        if (isCanvasVisible) {
          cancelAnimationFrame(animFrameId);
          animFrameId = requestAnimationFrame(render);
        } else {
          cancelAnimationFrame(animFrameId);
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(canvas.parentElement || canvas);
  }

  animFrameId = requestAnimationFrame(render);
}

/* ==========================================================================
   7. PROBLEM MATRIX (TOGGLE & INDIVIDUAL CARD CLICKS)
   ========================================================================== */
function initProblemMatrix() {
  const cards = document.querySelectorAll('.asset-node-card');
  const btnFragmented = document.getElementById('btn-view-fragmented');
  const btnConnected = document.getElementById('btn-view-connected');

  function setMode(mode) {
    if (mode === 'connected') {
      btnConnected?.classList.add('active');
      btnFragmented?.classList.remove('active');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.remove('disconnected');
          card.classList.add('connected');
        }, idx * 45);
      });
    } else {
      btnFragmented?.classList.add('active');
      btnConnected?.classList.remove('active');
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.remove('connected');
          card.classList.add('disconnected');
        }, idx * 35);
      });
    }
  }

  btnFragmented?.addEventListener('click', () => setMode('fragmented'));
  btnConnected?.addEventListener('click', () => setMode('connected'));

  // Allow clicking any individual card to toggle its status
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('disconnected')) {
        card.classList.remove('disconnected');
        card.classList.add('connected');
      } else {
        card.classList.remove('connected');
        card.classList.add('disconnected');
      }
    });
  });
}

/* ==========================================================================
   8. CENTRAL CONNECTIVE LAYER (ORBIT CANVAS & SATELLITES)
   ========================================================================== */
function initOrbitEcosystem() {
  const canvas = document.getElementById('orbit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0, dpr = window.devicePixelRatio || 1;
  const satelliteNodes = document.querySelectorAll('.orbit-satellite-node');
  const centerNode = document.querySelector('.orbit-center-node');
  const total = satelliteNodes.length;

  function positionSatellites() {
    if (!width || !height) return;
    const isMobile = width < 600;
    const maxPillHalf = isMobile ? 50 : 80;
    const rx = Math.min(width * 0.42, (width / 2) - maxPillHalf, 360);
    const ry = Math.min(height * 0.40, (height / 2) - 35, 230);
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

  function setSize() {
    if (!canvas.parentElement) return;
    dpr = window.devicePixelRatio || 1;
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    positionSatellites();
  }

  setSize();
  window.addEventListener('resize', setSize, { passive: true });

  const pulseOffsets = Array.from({ length: total }, (_, i) => i / total);
  let orbitRotation = 0;

  function drawOrbit() {
    if (!width || !height) {
      requestAnimationFrame(drawOrbit);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    orbitRotation += 0.003;

    // Draw dashed orbit ring
    const rx = Math.min(width * 0.42, 360);
    const ry = Math.min(height * 0.40, 230);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.restore();

    // Draw lines to satellites + energy packets
    satelliteNodes.forEach((node, i) => {
      const x = parseFloat(node.dataset.x || cx);
      const y = parseFloat(node.dataset.y || cy);
      const isActive = node.classList.contains('active');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = isActive ? 'rgba(0, 240, 255, 0.35)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = isActive ? 1.5 : 1;
      ctx.stroke();

      // Traveling signal pulse
      pulseOffsets[i] = (pulseOffsets[i] + 0.006) % 1;
      const prog = pulseOffsets[i];
      const px = cx + (x - cx) * prog;
      const py = cy + (y - cy) * prog;

      ctx.beginPath();
      ctx.arc(px, py, isActive ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#00F0FF' : 'rgba(0, 240, 255, 0.7)';
      if (isActive) {
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(drawOrbit);
  }

  drawOrbit();

  // Satellite clicks & hover
  satelliteNodes.forEach((node) => {
    function activate() {
      satelliteNodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');
    }
    node.addEventListener('mouseenter', activate);
    node.addEventListener('click', activate);
  });

  // Center node pulse click
  centerNode?.addEventListener('click', () => {
    satelliteNodes.forEach((node, idx) => {
      setTimeout(() => {
        node.classList.add('active');
        setTimeout(() => node.classList.remove('active'), 600);
      }, idx * 60);
    });
  });
}

/* ==========================================================================
   9. HOW THE SYSTEM WORKS (10-STAGE INTERACTIVE STEPPER)
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

  function selectStage(index) {
    stageCards.forEach((c, i) => c.classList.toggle('active', i === index));

    if (stageData[index] && inspectorTitle && inspectorDesc && inspectorBadge) {
      const inspector = inspectorTitle.closest('.loop-inspector-box');
      if (inspector) inspector.style.opacity = '0.35';

      setTimeout(() => {
        inspectorTitle.textContent = stageData[index].title;
        inspectorDesc.textContent = stageData[index].desc;
        inspectorBadge.textContent = stageData[index].badge;
        if (inspector) inspector.style.opacity = '1';
      }, 120);
    }
  }

  stageCards.forEach((card, index) => {
    card.addEventListener('click', () => selectStage(index));
  });
}

/* ==========================================================================
   10. ABCDEF PIPELINE (HOVER & CLICK FOCUS)
   ========================================================================== */
function initPipeline() {
  const cards = document.querySelectorAll('.pipeline-stage-card');
  cards.forEach((card) => {
    function highlight() {
      cards.forEach(c => {
        c.style.opacity = (c === card) ? '1' : '0.45';
        c.style.borderColor = (c === card) ? 'var(--accent-cyan)' : '';
      });
    }
    function reset() {
      cards.forEach(c => {
        c.style.opacity = '1';
        c.style.borderColor = '';
      });
    }
    card.addEventListener('mouseenter', highlight);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('click', highlight);
  });
}

/* ==========================================================================
   11. TAG 1–10 MATRIX CLICKS
   ========================================================================== */
function initTagMatrix() {
  const cards = document.querySelectorAll('.tag-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active-tag'));
      card.classList.add('active-tag');
    });
  });
}

/* ==========================================================================
   12. COMPOUNDING FLYWHEEL ENGINE (ROTATING CANVAS + CLICKABLE NODES)
   ========================================================================== */
function initFlywheel() {
  const canvas = document.getElementById('flywheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0, height = 0, dpr = window.devicePixelRatio || 1;
  const items = document.querySelectorAll('.flywheel-node-item');
  const total = items.length;
  let angle = 0;
  let activeIndex = 0;
  let lastAutoSwitch = Date.now();
  let isHovered = false;

  function setSize() {
    if (!canvas.parentElement) return;
    dpr = window.devicePixelRatio || 1;
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  setSize();
  window.addEventListener('resize', setSize, { passive: true });

  const colors = [
    'rgba(0, 240, 255, 0.65)',
    'rgba(56, 189, 248, 0.55)',
    'rgba(14, 165, 233, 0.45)',
    'rgba(0, 240, 255, 0.4)',
    'rgba(56, 189, 248, 0.35)',
    'rgba(14, 165, 233, 0.3)',
    'rgba(0, 240, 255, 0.5)'
  ];

  function animateFlywheel() {
    if (!width || !height) {
      requestAnimationFrame(animateFlywheel);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;
    const outerR = Math.min(width, height) * 0.44;
    const innerR = outerR * 0.48;
    const gap = 0.025;

    angle += 0.007;

    for (let i = 0; i < total; i++) {
      const startAngle = angle + (i / total) * Math.PI * 2 + gap;
      const endAngle = angle + ((i + 1) / total) * Math.PI * 2 - gap;
      const isActive = i === activeIndex;

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, startAngle, endAngle);
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true);
      ctx.closePath();

      ctx.fillStyle = isActive ? 'rgba(0, 240, 255, 0.22)' : colors[i] || 'rgba(0, 240, 255, 0.06)';
      ctx.strokeStyle = isActive ? '#00F0FF' : 'rgba(0, 240, 255, 0.15)';
      ctx.lineWidth = isActive ? 2 : 0.6;

      if (isActive) {
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 15;
      }
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Outer dot
      const midAngle = angle + ((i + 0.5) / total) * Math.PI * 2;
      const dotX = cx + Math.cos(midAngle) * ((outerR + innerR) / 2);
      const dotY = cy + Math.sin(midAngle) * ((outerR + innerR) / 2);

      ctx.beginPath();
      ctx.arc(dotX, dotY, isActive ? 5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#00F0FF' : 'rgba(255, 255, 255, 0.4)';
      if (isActive) {
        ctx.shadowColor = '#00F0FF';
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Auto advance when not hovered
    if (!isHovered && Date.now() - lastAutoSwitch > 2400) {
      activeIndex = (activeIndex + 1) % total;
      items.forEach((it, idx) => it.classList.toggle('active', idx === activeIndex));
      lastAutoSwitch = Date.now();
    }

    requestAnimationFrame(animateFlywheel);
  }

  animateFlywheel();

  items.forEach((item, idx) => {
    item.addEventListener('click', () => {
      activeIndex = idx;
      items.forEach((it, i) => it.classList.toggle('active', i === idx));
      lastAutoSwitch = Date.now();
    });
    item.addEventListener('mouseenter', () => { isHovered = true; });
    item.addEventListener('mouseleave', () => { isHovered = false; });
  });
}

/* ==========================================================================
   13. STAKEHOLDER SECTION TABS
   ========================================================================== */
function initStakeholderTabs() {
  const tabs = document.querySelectorAll('.stakeholder-tab-btn');
  const titleEl = document.getElementById('stakeholder-title');
  const descEl = document.getElementById('stakeholder-desc-p');
  const listEl = document.getElementById('stakeholder-benefits');

  const stakeholderData = {
    talent: {
      title: "Talent & creators",
      desc: "Artists, technicians, cinematographers, writers, sound engineers, editors, VFX specialists, and directors. DIGISYNQ gives verified talent structured identity and direct access to high-conviction productions without opaque middlemen.",
      benefits: [
        "Verified credit graph and immutable track-record portfolio",
        "Direct synchronization with active project requirements",
        "Dynamic availability matching to minimize downtime between productions",
        "Transparent compensation terms and milestone-based execution"
      ]
    },
    producers: {
      title: "Producers & studios",
      desc: "Production companies, showrunners, and project owners. DIGISYNQ eliminates weeks of fragmented crew assembly, stage booking, and logistical friction through instant capability matching.",
      benefits: [
        "Instant assembly of verified, pre-vetted multi-disciplinary crews",
        "Stage, gear, and location capacity discovery with transparent scheduling",
        "Zero economic leakage through synchronized pipeline workflows",
        "Live progress signals from pre-production through post-mastering"
      ]
    },
    brands: {
      title: "Brands & partners",
      desc: "Forward-thinking enterprises seeking authentic cultural participation and narrative integration rather than superficial product placement.",
      benefits: [
        "Contextual alignment with culturally resonant narrative projects",
        "Structured co-financing and distribution rights orchestration",
        "Audience synchronization and campaign activation measurement",
        "Direct collaboration with world-class narrative architects"
      ]
    },
    media: {
      title: "Media & channels",
      desc: "Publishers, streaming services, broadcast networks, and digital communication ecosystems seeking verified content pipelines.",
      benefits: [
        "Predictable, high-quality content supply chains at scale",
        "Early discovery of co-production and licensing opportunities",
        "Audience intelligence and cross-platform distribution coordination",
        "Frictionless verified asset delivery and rights verification"
      ]
    },
    audiences: {
      title: "Audiences & communities",
      desc: "Fan communities, cultural tastemakers, and engaged audiences who amplify, participate in, and sustain creative universes.",
      benefits: [
        "Direct connection to project evolutions and creator universes",
        "Community-driven cultural validation and signal feedback loops",
        "Early access opportunities and participatory storytelling formats",
        "Recognition for cultural advocacy and community stewardship"
      ]
    },
    infrastructure: {
      title: "Infrastructure & facilities",
      desc: "Soundstages, post-production suites, virtual production volumes, camera rental houses, and equipment facilities seeking smarter capacity utilization.",
      benefits: [
        "Maximized stage and gear utilization between project cycles",
        "Real-time calendar synchronization with incoming production slates",
        "Automated qualification and insurance verification of operators",
        "Predictable multi-project booking pipelines with advance visibility"
      ]
    },
    technology: {
      title: "Technology & platforms",
      desc: "Rendering engines, virtual production toolchains, workflow platforms, and post software suites seeking deeper integration into active productions.",
      benefits: [
        "Native integration into verified production workflows",
        "Standardized API connectivity for asset tracking and telemetry",
        "Adoption acceleration across active ecosystem projects",
        "Direct feedback loops from industry-leading operators"
      ]
    },
    associations: {
      title: "Associations & guilds",
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

    const card = listEl.closest('.stakeholder-detail-card');
    if (card) {
      card.style.opacity = '0.4';
      card.style.transform = 'translateY(8px)';
      card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    }

    setTimeout(() => {
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      listEl.innerHTML = data.benefits.map(b => `
        <div class="stakeholder-benefit-item">
          <span class="benefit-bullet">/</span>
          <span>${b}</span>
        </div>
      `).join('');
      if (card) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }
    }, 140);
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
   14. ASSET-LIGHT MODEL STEP CLICKS
   ========================================================================== */
function initModelSteps() {
  const cards = document.querySelectorAll('.model-step-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active-layer'));
      card.classList.add('active-layer');
    });
  });
}

/* ==========================================================================
   15. MODALS & COORDINATION INTAKE
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
      if (submitBtn) {
        submitBtn.textContent = 'Transmitting coordination signal...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        form.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(0,240,255,0.08); border: 1px solid #00F0FF; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #00F0FF; font-size: 1.5rem; box-shadow: 0 0 20px rgba(0,240,255,0.3);">✓</div>
            <h3 style="font-size: 1.6rem; margin-bottom: 0.75rem; color: #ffffff; letter-spacing: -0.02em;">Signal registered</h3>
            <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 420px; margin: 0 auto 2rem; line-height: 1.6;">Your profile has been ingested into the DIGISYNQ coordination pipeline. Our system orchestrators will synchronize with you within 24 hours.</p>
            <button type="button" class="btn btn-secondary btn-sm" id="modal-done-btn">Close console</button>
          </div>
        `;
        document.getElementById('modal-done-btn')?.addEventListener('click', closeModal);
      }, 800);
    });
  }

  // Main Contact Page Form Handler
  const contactPageForm = document.getElementById('coordination-intake-form');
  if (contactPageForm) {
    contactPageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactPageForm.querySelector('#form-submit-btn') || contactPageForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Transmitting coordination signal...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        contactPageForm.innerHTML = `
          <div style="text-align: center; padding: 3rem 1.5rem; background: rgba(52, 211, 153, 0.06); border: 1px solid rgba(52, 211, 153, 0.3); border-radius: 12px;">
            <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(52, 211, 153, 0.15); border: 2px solid #34d399; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #34d399; font-size: 1.75rem; box-shadow: 0 0 25px rgba(52, 211, 153, 0.35);">✓</div>
            <h3 style="font-size: 1.8rem; margin-bottom: 0.75rem; color: #ffffff; letter-spacing: -0.02em;">Coordination Request Received</h3>
            <p style="font-size: 1.05rem; color: #f1f5f9; max-width: 480px; margin: 0 auto 2rem; line-height: 1.65;">Your request has been logged into the DIGISYNQ network. A coordination lead will review your requirements and reach out within 24 hours.</p>
            <a href="index.html" class="btn btn-secondary btn-sm">Return to homepage</a>
          </div>
        `;
      }, 750);
    });
  }
}

/* ==========================================================================
   16. SCROLL REVEAL (FAIL-SAFE OBSERVER)
   ========================================================================== */
function initScrollReveal() {
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

  const elements = [];
  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
      elements.push(el);
    });
  });

  // Stagger grid elements
  ['asset-nodes-grid', 'breakdowns-grid', 'pipeline-grid', 'tag-matrix-grid', 'signals-grid', 'comparison-grid', 'value-multiplier-diagram', 'loop-stages-timeline'].forEach(gridClass => {
    const grid = document.querySelector(`.${gridClass}`);
    if (!grid) return;
    grid.querySelectorAll('.reveal').forEach((child, i) => {
      child.classList.add(`reveal-delay-${Math.min(i + 1, 6)}`);
    });
  });

  function revealElement(el) {
    el.classList.add('revealed');
  }

  // Check initial viewport
  function checkInitialVisibility() {
    const winHeight = window.innerHeight;
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < winHeight - 30) {
        revealElement(el);
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Run initial check
  checkInitialVisibility();
  window.addEventListener('scroll', checkInitialVisibility, { passive: true });

  // Fail-safe: ensure all elements become visible after 1.2s regardless of viewport
  setTimeout(() => {
    elements.forEach(el => revealElement(el));
  }, 1200);
}

/* ==========================================================================
   17. SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function updateSpy() {
    let current = '';
    const scrollPos = window.scrollY + 220;

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
  }

  window.addEventListener('scroll', updateSpy, { passive: true });
  updateSpy();
}

/* ==========================================================================
   18. STATS COUNTER ANIMATION
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
      const duration = 1600;
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
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}
