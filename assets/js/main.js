/**
 * DIGISYNQ — THE NETWORK BETWEEN THE DOTS
 * Interactive Systems Engine v3.0
 * Institutional Operating System Core JS
 */

document.addEventListener('DOMContentLoaded', () => {
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
    initInteractiveContinuityToggle();
    initInteractiveABCDEF();
    initProducerScopeMapper();
    initProblemDiagnosticModal();
    initCounters();
    initIcons();
    initScrollProgress();
    initMagnetic();
    initGlobalPlexus();
    initCardTilt();
  });

/* ==========================================================================
   MOTION UTILITIES — rAF throttling for scroll & resize (60fps guarantee)
   ========================================================================== */
function rafThrottle(fn) {
  let ticking = false;
  return function (...args) {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      fn.apply(this, args);
    });
  };
}

function rafDebounce(fn) {
  let frameId = null;
  return function (...args) {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => {
      frameId = null;
      fn.apply(this, args);
    });
  };
}

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

  window.addEventListener('scroll', rafThrottle(updateProgress), { passive: true });
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

  window.addEventListener('scroll', rafThrottle(toggleBtn), { passive: true });
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

  window.addEventListener('scroll', rafThrottle(onScroll), { passive: true });
  onScroll();
}

/* ==========================================================================
   4. SMOOTH SCROLL WITH HEADER OFFSET
   ========================================================================== */
function initSmoothNavScroll() {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const currentFile = location.pathname.split('/').pop();
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const hashIndex = href.indexOf('#');
      const targetId = href.slice(hashIndex);
      if (targetId.length < 2) return;
      const pathPart = href.slice(0, hashIndex);
      const samePage = pathPart === '' || pathPart === currentFile;
      const targetEl = document.querySelector(targetId);
      if (samePage && targetEl) {
        e.preventDefault();
        const headerHeight = document.getElementById('site-header')?.offsetHeight || 80;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight + 10;
        window.scrollTo({
          top: targetPos,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
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
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  window.addEventListener('resize', rafDebounce(setSize), { passive: true });

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
      ctx.fillStyle = '#34d399';
      ctx.shadowColor = '#34d399';
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
    ctx.fillText('ENTERTAINMENT INDUSTRY', cx, cy + 30);

    if (isCanvasVisible && !prefersReducedMotion) {
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
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  window.addEventListener('resize', rafDebounce(setSize), { passive: true });

  const pulseOffsets = Array.from({ length: total }, (_, i) => i / total);
  let orbitRotation = 0;
  let orbitFrameId = null;
  let isOrbitVisible = true;

  function drawOrbit() {
    if (!width || !height) {
      orbitFrameId = requestAnimationFrame(drawOrbit);
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
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.1)';
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
      ctx.strokeStyle = isActive ? 'rgba(52, 211, 153, 0.35)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = isActive ? 1.5 : 1;
      ctx.stroke();

      // Traveling signal pulse
      pulseOffsets[i] = (pulseOffsets[i] + 0.006) % 1;
      const prog = pulseOffsets[i];
      const px = cx + (x - cx) * prog;
      const py = cy + (y - cy) * prog;

      ctx.beginPath();
      ctx.arc(px, py, isActive ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#34d399' : 'rgba(52, 211, 153, 0.7)';
      if (isActive) {
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (isOrbitVisible && !prefersReducedMotion) {
      orbitFrameId = requestAnimationFrame(drawOrbit);
    }
  }

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const orbitObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isOrbitVisible = entry.isIntersecting;
        if (isOrbitVisible) {
          cancelAnimationFrame(orbitFrameId);
          orbitFrameId = requestAnimationFrame(drawOrbit);
        } else {
          cancelAnimationFrame(orbitFrameId);
        }
      });
    }, { threshold: 0 });
    orbitObserver.observe(canvas.parentElement || canvas);
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
    { title: "01 — Discover", badge: "Visibility layer", desc: "Make assets, talent, specialized craft, capabilities, facilities and project opportunities universally searchable and contextually discoverable across the entertainment industry." },
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
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  window.addEventListener('resize', rafDebounce(setSize), { passive: true });

  const colors = [
    'rgba(52, 211, 153, 0.65)',
    'rgba(52, 211, 153, 0.55)',
    'rgba(14, 165, 233, 0.45)',
    'rgba(52, 211, 153, 0.4)',
    'rgba(52, 211, 153, 0.35)',
    'rgba(14, 165, 233, 0.3)',
    'rgba(52, 211, 153, 0.5)'
  ];

  let flywheelFrameId = null;
  let isFlywheelVisible = true;

  function animateFlywheel() {
    if (!width || !height) {
      flywheelFrameId = requestAnimationFrame(animateFlywheel);
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

      ctx.fillStyle = isActive ? 'rgba(52, 211, 153, 0.22)' : colors[i] || 'rgba(52, 211, 153, 0.06)';
      ctx.strokeStyle = isActive ? '#34d399' : 'rgba(52, 211, 153, 0.15)';
      ctx.lineWidth = isActive ? 2 : 0.6;

      if (isActive) {
        ctx.shadowColor = '#34d399';
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
      ctx.fillStyle = isActive ? '#34d399' : 'rgba(255, 255, 255, 0.4)';
      if (isActive) {
        ctx.shadowColor = '#34d399';
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Auto advance when not hovered
    if (!isHovered && !prefersReducedMotion && Date.now() - lastAutoSwitch > 2400) {
      activeIndex = (activeIndex + 1) % total;
      items.forEach((it, idx) => it.classList.toggle('active', idx === activeIndex));
      lastAutoSwitch = Date.now();
    }

    if (isFlywheelVisible && !prefersReducedMotion) {
      flywheelFrameId = requestAnimationFrame(animateFlywheel);
    }
  }

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const flywheelObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isFlywheelVisible = entry.isIntersecting;
        if (isFlywheelVisible) {
          cancelAnimationFrame(flywheelFrameId);
          flywheelFrameId = requestAnimationFrame(animateFlywheel);
        } else {
          cancelAnimationFrame(flywheelFrameId);
        }
      });
    }, { threshold: 0 });
    flywheelObserver.observe(canvas.parentElement || canvas);
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
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(52,211,153,0.08); border: 1px solid #34d399; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #34d399; font-size: 1.5rem; box-shadow: 0 0 20px rgba(52,211,153,0.3);">✓</div>
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

  // Run initial check for above-the-fold content
  checkInitialVisibility();
}

/* ==========================================================================
   MOTION — ANIMATED METRIC COUNTERS
   ========================================================================== */
function initCounters() {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nums = document.querySelectorAll('.metric .num');
  if (!nums.length || prefersReducedMotion) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const text = el.textContent.trim();
      const m = text.match(/^([^\d]*)([\d.,]+)(.*)$/);
      if (!m) return;
      const prefix = m[1], suffix = m[3];
      const target = parseFloat(m[2].replace(/,/g, ''));
      const decimals = (m[2].split('.')[1] || '').length;
      const duration = 1200;
      const startTime = performance.now();
      function tick(now) {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = (target * eased).toFixed(decimals);
        el.textContent = prefix + val + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = prefix + (decimals ? target.toFixed(decimals) : target) + suffix;
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });

  nums.forEach(n => io.observe(n));
}

/* ==========================================================================
   ICON SYSTEM — inject on-brand line icons into card titles by keyword
   ========================================================================== */
function initIcons() {
  const ICONS = {
    // Original Apple-inspired glyphs — ultrathin, rounded, no SF copy
    search:  '<circle cx="11" cy="11" r="6.8"/><path d="M20.2 20.2L16.1 16.1"/>',
    nodes:   '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="12" r="2.2"/><path d="M8 7L16 11M8 17L16 13"/>',
    bolt:    '<path d="M12.8 2.5L5.2 13.8H11L10.2 21.5L18.8 10.2H13z"/>',
    arrow:   '<path d="M5 12h13.2M12.8 6.2L19 12 12.8 17.8"/>',
    user:    '<circle cx="12" cy="7.8" r="3.8"/><path d="M4.8 20.5c0-3.6 3.4-5.6 7.2-5.6s7.2 2 7.2 5.6"/>',
    users:   '<circle cx="9" cy="7.8" r="3.2"/><path d="M3.2 20.6c0-3.1 2.6-4.9 5.8-4.9S14.8 17.5 14.8 20.6"/><circle cx="17.2" cy="8.8" r="2.4"/><path d="M16 20.6c0-2.6 1.8-4.1 4.2-4.2"/>',
    building:'<rect x="5.2" y="3.5" width="13.6" height="17" rx="1.8"/><path d="M9.2 7.5h1.8M12.8 7.5h1.8M9.2 11h1.8M12.8 11h1.8M9.2 14.5h1.8M12.8 14.5h1.8"/>',
    clapper: '<rect x="3.2" y="6.5" width="17.6" height="12.2" rx="1.8"/><path d="M3.2 10.2h17.6M7.8 6.5L6 10.2M12.6 6.5L10.8 10.2M17.4 6.5L15.6 10.2"/>',
    film:    '<rect x="3.2" y="4.2" width="17.6" height="15.6" rx="1.8"/><path d="M7.8 4.2v15.6M15.8 4.2v15.6M3.2 8.8h4.6M3.2 14.6h4.6M16 8.8h4.6M16 14.6h4.6"/>',
    mega:    '<path d="M3.2 11.2v1.6a1 1 0 0 0 1 1h1.8l7.6 4.8V5.4L6 10.2H4.2a1 1 0 0 0-1 1z"/><path d="M15.6 9.2a3 3 0 0 1 0 5.6"/>',
    tag:     '<path d="M3.2 12L11 4h6.6a1.8 1.8 0 0 1 1.8 1.8V12L11.4 20z"/><circle cx="15.2" cy="8.2" r="1.1"/>',
    chart:   '<path d="M4.2 19.5V4.2M4.2 19.5h15.6"/><path d="M7.8 15.5l2.8-3.8 2.8 1.9 3.8-5.6"/>',
    bulb:    '<path d="M9 17.5h6M10 20.5h4"/><path d="M12 3.5a5.8 5.8 0 0 0-3.8 10c.6.6.9 1.3.9 2.2h5.8c0-.9.3-1.6.9-2.2A5.8 5.8 0 0 0 12 3.5z"/>',
    drop:    '<path d="M12 3.2s5.6 6.2 5.6 10.4a5.6 5.6 0 0 1-11.2 0c0-4.2 5.6-10.4 5.6-10.4z"/>',
    coin:    '<circle cx="12" cy="12" r="8.6"/><path d="M12 8.2v7.6M9.6 10.4h3.6a1.4 1.4 0 0 1 0 2.8H10a1.4 1.4 0 0 0 0 2.8h3.6"/>'
  };

  const MAP = [
    [['find','audit','search'], 'search'],
    [['connect','network','synchron','link'], 'nodes'],
    [['activate','deploy','extract','activ'], 'bolt'],
    [['build','feed'], 'arrow'],
    [['talent','people','crew','technician','specialist'], 'user'],
    [['capacity','facility','studio','place','location','space','util'], 'building'],
    [['production','company','service'], 'clapper'],
    [['content','film','video','ip','asset'], 'film'],
    [['media','amplification','creator','voice','channel'], 'mega'],
    [['brand','partner','sponsor'], 'tag'],
    [['audience','community'], 'users'],
    [['data','signal','intelligence'], 'chart'],
    [['insight','learn'], 'bulb'],
    [['leakage','loss','risk'], 'drop'],
    [['revenue','value','fee','money'], 'coin'],
    [['coordination'], 'nodes'],
    [['execution'], 'bolt'],
    [['project'], 'clapper'],
    [['captur'], 'coin'],
    [['silo'], 'nodes'],
    [['bottleneck'], 'drop'],
    [['invest'], 'coin'],
    [['own'], 'tag'],
    [['gradu'], 'user']
  ];

  function pick(text) {
    const t = text.toLowerCase();
    for (const [keys, ic] of MAP) {
      if (keys.some(k => t.includes(k))) return ic;
    }
    return null;
  }

  const targets = document.querySelectorAll(
    '.tile h3, .help-card h3, .participate .tile h3, .flow .step h3, ' +
    '.belief .tile h3, .value-flow .stage h3, .entry-points .tile h3'
  );

  targets.forEach(el => {
    if (el.dataset.iconReady) return;
    const ic = pick(el.textContent);
    if (!ic) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'ico');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = ICONS[ic];
      el.insertBefore(svg, el.firstChild);
      el.dataset.iconReady = '1';
    });
}

/* ==========================================================================
   PREMIUM MOTION — scroll progress bar
   ========================================================================== */
function initScrollProgress() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  let ticking = false;
  function update() {
    const h = document.documentElement;
    const max = (h.scrollHeight - h.clientHeight) || 1;
    bar.style.width = (Math.min(h.scrollTop / max, 1) * 100).toFixed(2) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ==========================================================================
   PREMIUM MOTION — magnetic CTAs / brand
   ========================================================================== */
function initMagnetic() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  const els = document.querySelectorAll('.btn, .nav-brand');
  els.forEach(el => {
    el.style.transition = 'transform .25s cubic-bezier(.2,.8,.2,1), box-shadow var(--transition-smooth)';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const mx = (e.clientX - (r.left + r.width / 2)) * 0.18;
      const my = (e.clientY - (r.top + r.height / 2)) * 0.28;
      el.style.transform = `translate(${mx}px, ${my}px) scale(1.03)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}



/* ==========================================================================
   PREMIUM — GLOBAL PLEXUS CANVAS (Canva-style network bg)
   ========================================================================== */
function initGlobalPlexus() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;
  let canvas = document.getElementById('plexus-bg');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'plexus-bg';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = window.devicePixelRatio || 1;
  const mouse = { x: null, y: null };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  const particles = [];
  function setSize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(55, Math.max(30, Math.floor(w * h / 32000)));
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.28, vy: (Math.random()-0.5)*0.28, r: Math.random()*1.0+0.7 });
    }
  }
  setSize();
  window.addEventListener('resize', rafDebounce(setSize), { passive: true });
  let raf = null;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0.1) { const f = (120 - d) / 120 * 0.22; p.x += dx/d*f*1.2; p.y += dy/d*f*1.2; }
      }
    }
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.11;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
          ctx.lineWidth = 0.9; ctx.stroke();
        }
      }
    }
    for (const p of particles) {
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(52,211,153,0.55)'; ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  if (!prefersReduced) raf = requestAnimationFrame(tick);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else raf = requestAnimationFrame(tick);
  });
}


/* Premium: subtle 3D card tilt */
function initCardTilt() {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced || window.innerWidth < 900) return;
  const cards = document.querySelectorAll('.tile, .help-card, .founder');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = ((y / r.height) - 0.5) * -6;
      const ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ==========================================================================
   17. SCROLL SPY
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  // Cache section positions — refreshed on resize, not on every scroll
  let sectionBounds = [];

  function measureSections() {
    sectionBounds = Array.from(sections).map(section => ({
      id: section.id,
      top: section.offsetTop,
      bottom: section.offsetTop + section.offsetHeight
    }));
  }

  measureSections();
  window.addEventListener('resize', rafDebounce(measureSections), { passive: true });
  window.addEventListener('load', measureSections);

  function updateSpy() {
    let current = '';
    const scrollPos = window.scrollY + 220;

    for (const bounds of sectionBounds) {
      if (scrollPos >= bounds.top && scrollPos < bounds.bottom) {
        current = bounds.id;
      }
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const lh = link.getAttribute('href') || '';
      const lhHash = lh.includes('#') ? '#' + lh.split('#')[1] : '';
      if (lhHash === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', rafThrottle(updateSpy), { passive: true });
  updateSpy();
}

/* ==========================================================================
   19. INTERACTIVE CONTINUITY MODEL TOGGLE
   ========================================================================== */
function initInteractiveContinuityToggle() {
  const btnTrad = document.getElementById('toggle-continuity-trad');
  const btnLoop = document.getElementById('toggle-continuity-loop');
  const cardTrad = document.querySelector('.continuity-card.traditional');
  const cardLoop = document.querySelector('.continuity-card.digisynq-loop');

  if (!btnTrad || !btnLoop || !cardTrad || !cardLoop) return;

  btnTrad.addEventListener('click', () => {
    btnTrad.classList.add('active');
    btnLoop.classList.remove('active');
    cardTrad.style.opacity = '1';
    cardTrad.style.transform = 'scale(1.02)';
    cardLoop.style.opacity = '0.45';
    cardLoop.style.transform = 'scale(0.98)';
  });

  btnLoop.addEventListener('click', () => {
    btnLoop.classList.add('active');
    btnTrad.classList.remove('active');
    cardLoop.style.opacity = '1';
    cardLoop.style.transform = 'scale(1.02)';
    cardTrad.style.opacity = '0.45';
    cardTrad.style.transform = 'scale(0.98)';
  });
}

/* ==========================================================================
   20. INTERACTIVE ABCDEF STEPPER
   ========================================================================== */
const abcdefData = {
  A: {
    letter: 'A',
    name: 'Audit',
    subtitle: 'Pre-production forensic analysis',
    desc: 'Identify requirements, gaps, duplication, underutilization and potential economic leakage before capital is committed.',
    checklist: [
      'Deconstruct script and technical requirements across departments',
      'Audit existing client assets and archival footage',
      'Identify equipment and studio facility overlap',
      'Quantify potential leakage and downtime risks'
    ],
    metric: 'Estimated leakage prevention: up to ~22% (illustrative)',
    engine: 'Engine 01 Capacity + Engine 05 Intelligence'
  },
  B: {
    letter: 'B',
    name: 'Build',
    subtitle: 'Asset-light architecture synthesis',
    desc: 'Assemble the required resources, people, content workflows, and execution structure without capital-intensive ownership.',
    checklist: [
      'Structure specialized crew pods and workshop talent',
      'Draft secondary BTS and short-form capture schedules',
      'Establish cloud workflows and dailies turnaround protocols',
      'Formulate transparent risk-sharing or fee models'
    ],
    metric: 'Setup velocity: up to ~3x faster deployment (illustrative)',
    engine: 'Engine 01 Capacity + Engine 02 Talent'
  },
  C: {
    letter: 'C',
    name: 'Connect',
    subtitle: 'Ecosystem & partner synchronization',
    desc: 'Connect the right technicians, creators, studios, production teams, brands, and specialized media partners.',
    checklist: [
      'Pair contextual creators with specific character narratives',
      'Book verified studio downtime windows',
      'Align co-branded brand integration parameters',
      'Harmonize distributor and PR release timelines'
    ],
    metric: 'Connected reach: fully contextual (matched, not blanket)',
    engine: 'Engine 04 Amplification + Capacity Network'
  },
  D: {
    letter: 'D',
    name: 'Deploy',
    subtitle: 'Real-time set & production execution',
    desc: 'Put the right people, resources, and collaborations into action across live shooting schedules.',
    checklist: [
      'Embed verified Talent Lab assistants with senior department heads',
      'Execute multi-format content capture concurrently with principal photography',
      'Monitor optical and camera package utilization in real time',
      'Manage creator set visits and organic BTS moments'
    ],
    metric: 'Execution fidelity: Zero idle days',
    engine: 'Engine 01 Capacity + Engine 03 Content'
  },
  E: {
    letter: 'E',
    name: 'Extract value',
    subtitle: 'Content multiplication & distribution',
    desc: 'Increase useful output from people, content, resources, audiences, and commercial relationships.',
    checklist: [
      'Publish dozens of micro-assets, character capsules, and reels',
      'Activate regional fan communities and influencer discussions',
      'Monetize secondary assets and licensing where rights allow',
      'Convert campaign momentum into durable follower networks'
    ],
    metric: 'Content multiplication: multiple ancillary assets per production (illustrative)',
    engine: 'Engine 03 Content + Engine 04 Amplification'
  },
  F: {
    letter: 'F',
    name: 'Feed forward',
    subtitle: 'Compounding institutional memory',
    desc: 'Measure, learn, document, and feed operational intelligence back to make the next project smarter.',
    checklist: [
      'Aggregate post-wrap budget vs actual utilization data',
      'Record crew performance scores and skill growth badges',
      'Archive content performance benchmarks for sequels/slates',
      'Retain warm audience cohorts for subsequent releases'
    ],
    metric: 'Network compound rate: Smarter every cycle',
    engine: 'Engine 05 Intelligence + Project OS'
  }
};

function initInteractiveABCDEF() {
  const buttons = document.querySelectorAll('.abcdef-stepper-btn');
  const displayBox = document.getElementById('abcdef-live-detail-box');
  if (!buttons.length || !displayBox) return;

  function setStep(letter) {
    const data = abcdefData[letter];
    if (!data) return;

    buttons.forEach(b => b.classList.toggle('active', b.dataset.step === letter));

    displayBox.innerHTML = `
      <div>
        <div style="font-family: var(--font-display); font-size: 0.82rem; font-weight: 600; color: var(--accent-cyan); letter-spacing: 0.04em; margin-bottom: 0.5rem;">
          Stage ${data.letter} &bull; ${data.subtitle}
        </div>
        <h3 style="font-family: var(--font-serif); font-size: clamp(2rem, 3.5vw, 2.6rem); color: #ffffff; margin-bottom: 0.75rem;">
          ${data.letter} — ${data.name}
        </h3>
        <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
          ${data.desc}
        </p>
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
          <div class="engine-chip">${data.engine}</div>
          <div class="engine-chip" style="border-color: #34d399; color: #34d399; background: rgba(52, 211, 153, 0.1);">${data.metric}</div>
        </div>
      </div>
      <div>
        <div class="abcdef-checklist-title">Core execution deliverables</div>
        <ul class="abcdef-checklist">
          ${data.checklist.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      setStep(btn.dataset.step);
    });
  });

  // Default to step A
  setStep('A');
}

/* ==========================================================================
   21. PRODUCER INTERACTIVE BLUEPRINT BUILDER
   ========================================================================== */
function initProducerScopeMapper() {
  const wrap = document.getElementById('blueprint-builder-wrap');
  if (!wrap) return;

  const formatPills = wrap.querySelectorAll('.format-pill');
  const frictionPills = wrap.querySelectorAll('.friction-pill');
  const outputBox = document.getElementById('blueprint-output-box');

  let selectedFormat = 'Feature Film';
  let selectedFriction = 'Crew Gap';

  const blueprints = {
    'Feature Film_Crew Gap': {
      title: 'Feature Film: Technical pod integration',
      engines: ['Engine 01 Capacity', 'Engine 02 Talent'],
      desc: 'Deploy verified department technicians (camera, lighting, audio) and Talent Lab assistant pods, reducing sourcing overhead (illustrative target: up to ~60%).',
      actionUrl: 'contact.html?problem=technicians&format=feature'
    },
    'Feature Film_Studio Downtime': {
      title: 'Feature Film: Facility capacity matching',
      engines: ['Engine 01 Capacity'],
      desc: 'Audit upcoming studio schedules to secure soundstage and DI post-pipeline windows with flexible commercial terms.',
      actionUrl: 'contact.html?problem=unused-capacity&format=feature'
    },
    'Feature Film_Content Wastage': {
      title: 'Feature Film: Content multiplier protocol',
      engines: ['Engine 03 Content', 'Engine 04 Amplification'],
      desc: 'Deploy a dedicated secondary unit on set to generate 30+ (illustrative) short-form capsules, character BTS, and creator collaborations.',
      actionUrl: 'contact.html?problem=content-utilization&format=feature'
    },
    'Feature Film_Audience Building': {
      title: 'Feature Film: Creator & community amplification',
      engines: ['Engine 04 Amplification'],
      desc: 'Synchronize 8+ contextual entertainment creators and regional fan communities 6 weeks prior to theatrical release.',
      actionUrl: 'contact.html?problem=audience-building&format=feature'
    },
    'Feature Film_Brand Alignment': {
      title: 'Feature Film: Organic commercial integration',
      engines: ['Engine 01 Capacity', 'Engine 04 Amplification'],
      desc: 'Structure authentic narrative product placements and co-branded digital distribution without compromising story integrity.',
      actionUrl: 'contact.html?problem=brand-integration&format=feature'
    },
    'OTT Series_Crew Gap': {
      title: 'OTT Series: Slate talent pipeline',
      engines: ['Engine 01 Capacity', 'Engine 02 Talent'],
      desc: 'Build dedicated multi-episode technical crew rotations with standardized workflows across shooting blocks.',
      actionUrl: 'contact.html?problem=technicians&format=series'
    },
    'OTT Series_Content Wastage': {
      title: 'OTT Series: Episodic digital campaign',
      engines: ['Engine 03 Content'],
      desc: 'Convert episodic footage and cast interviews into recurring weekly digital content drops.',
      actionUrl: 'contact.html?problem=content-utilization&format=series'
    },
    'Digital Production_Content Wastage': {
      title: 'Digital Production: Multi-platform scale',
      engines: ['Engine 03 Content', 'Engine 04 Amplification'],
      desc: 'Systematic vertical and horizontal content mapping with creator co-distribution.',
      actionUrl: 'contact.html?problem=content-utilization&format=digital'
    }
  };

  function updateBlueprint() {
    const key = `${selectedFormat}_${selectedFriction}`;
    const bp = blueprints[key] || {
      title: `${selectedFormat}: Custom operating architecture`,
      engines: ['Engine 01 Capacity', 'Engine 03 Content', 'Engine 05 Intelligence'],
      desc: `Comprehensive coordination audit mapping ${selectedFriction.toLowerCase()} across our asset-light network.`,
      actionUrl: `contact.html?format=${encodeURIComponent(selectedFormat)}&friction=${encodeURIComponent(selectedFriction)}`
    };

    if (outputBox) {
      outputBox.innerHTML = `
        <div class="blueprint-res-header">
          <div>
            <div style="font-family: var(--font-display); font-size: 0.82rem; font-weight: 600; color: var(--accent-cyan); letter-spacing: 0.04em; margin-bottom: 0.25rem;">
              Recommended blueprint
            </div>
            <div class="blueprint-res-title">${bp.title}</div>
          </div>
          <div class="blueprint-engine-chips">
            ${bp.engines.map(e => `<span class="engine-chip">${e}</span>`).join('')}
          </div>
        </div>
        <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
          ${bp.desc}
        </p>
        <a href="${bp.actionUrl}" class="btn btn-primary">
          Discuss this blueprint with Digisynq &rarr;
        </a>
      `;
    }
  }

  formatPills.forEach(pill => {
    pill.addEventListener('click', () => {
      formatPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedFormat = pill.dataset.format;
      updateBlueprint();
    });
  });

  frictionPills.forEach(pill => {
    pill.addEventListener('click', () => {
      frictionPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      selectedFriction = pill.dataset.friction;
      updateBlueprint();
    });
  });

  updateBlueprint();
}

/* ==========================================================================
   22. INTERACTIVE PROBLEM DIAGNOSTIC MODAL
   ========================================================================== */
const problemDiagData = {
  'technicians': {
    title: 'Technician sourcing & availability friction',
    quote: '“I need technicians for my project.”',
    rootCause: 'Crew scheduling operates on word-of-mouth without structured visibility into technician windows between productions.',
    digisynqSolution: 'Digisynq activates our verified technician network and Talent Lab practitioners to assemble project-ready crew pods within an illustrative ~48-hour target window.',
    activatedEngines: ['Engine 01 Capacity', 'Engine 02 Talent'],
    expectedGain: 'Up to ~40% reduction in staffing turnaround (illustrative); verified technical competence.'
  },
  'content-utilization': {
    title: 'Underutilized production content',
    quote: '“We have strong content that isn’t being fully utilized.”',
    rootCause: 'Productions allocate the vast majority of focus to the master cut, treating BTS and ancillary assets as an afterthought.',
    digisynqSolution: 'Digisynq audits the shoot inventory and deploys a secondary capture/editing pipeline to create 30+ (illustrative) short-form, creator, and archival assets.',
    activatedEngines: ['Engine 03 Content', 'Engine 04 Amplification'],
    expectedGain: 'A multiple-fold expansion in organic impressions (illustrative) without increasing principal production budget.'
  },
  'audience-building': {
    title: 'Disconnected pre-release community building',
    quote: '“We need help building an audience around our project.”',
    rootCause: 'Marketing campaigns launch 3 weeks before release without warm, invested fan communities.',
    digisynqSolution: 'Digisynq engages dedicated entertainment communities and tastemakers early in production to foster genuine organic word-of-mouth.',
    activatedEngines: ['Engine 04 Amplification'],
    expectedGain: 'Higher organic opening-weekend conversion and enduring audience retention.'
  },
  'creators': {
    title: 'Creator & community collaboration',
    quote: '“We want creator collaborations.”',
    rootCause: 'Traditional agencies treat creators as ad banners instead of creative co-distributors.',
    digisynqSolution: 'Digisynq pairs creators contextual to the project’s genre with on-set access and exclusive story elements.',
    activatedEngines: ['Engine 04 Amplification', 'Engine 03 Content'],
    expectedGain: 'Authentic engagement with zero commercial cringe.'
  },
  'unused-capacity': {
    title: 'Studio & facility downtime leakage',
    quote: '“We have unused capacity.”',
    rootCause: 'Physical floors and post suites sit empty during lull periods between major client bookings.',
    digisynqSolution: 'Digisynq routes matching upcoming independent productions to fill available studio days.',
    activatedEngines: ['Engine 01 Capacity'],
    expectedGain: 'Monetized downtime and higher annual facility return on investment.'
  },
  'leakage-audit': {
    title: 'Economic leakage & coordination inefficiency',
    quote: '“We don’t know where the leakage is.”',
    rootCause: 'Redundant sourcing, excessive markups, and uncoordinated workflows siphon a meaningful share (up to ~20%) of project budgets (illustrative).',
    digisynqSolution: 'Digisynq conducts a forensic Stage A (Audit) across all departments to pinpoint duplication before shooting starts.',
    activatedEngines: ['Engine 01 Capacity', 'Engine 05 Intelligence'],
    expectedGain: 'Clear cost reduction and streamlined resource allocation.'
  }
};

function initProblemDiagnosticModal() {
  const modal = document.getElementById('problem-diagnosis-modal');
  if (!modal) return;

  const promptCards = document.querySelectorAll('.problem-prompt-card[data-problem]');
  const closeBtn = modal.querySelector('.problem-diag-close');
  const titleEl = document.getElementById('diag-title');
  const quoteEl = document.getElementById('diag-quote');
  const rootEl = document.getElementById('diag-root');
  const solEl = document.getElementById('diag-sol');
  const enginesEl = document.getElementById('diag-engines');
  const gainEl = document.getElementById('diag-gain');
  const actionBtn = document.getElementById('diag-action-btn');

  function openDiag(problemKey) {
    const data = problemDiagData[problemKey] || {
      title: 'Operational project consultation',
      quote: '“Tell us the project.”',
      rootCause: 'Custom bottlenecks requiring coordinated diagnostic mapping.',
      digisynqSolution: 'Digisynq maps the requirement across our 5 connected operating engines.',
      activatedEngines: ['Engine 01 Capacity', 'Engine 05 Intelligence'],
      expectedGain: 'Customized operating blueprint.'
    };

    if (titleEl) titleEl.textContent = data.title;
    if (quoteEl) quoteEl.textContent = data.quote;
    if (rootEl) rootEl.textContent = data.rootCause;
    if (solEl) solEl.textContent = data.digisynqSolution;
    if (gainEl) gainEl.textContent = data.expectedGain;
    if (enginesEl) {
      enginesEl.innerHTML = data.activatedEngines.map(e => `<span class="engine-chip">${e}</span>`).join('');
    }
    if (actionBtn) {
      actionBtn.href = `contact.html?problem=${encodeURIComponent(problemKey)}`;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDiag() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  promptCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      openDiag(card.dataset.problem);
    });
  });

  closeBtn?.addEventListener('click', closeDiag);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeDiag();
  });
}


