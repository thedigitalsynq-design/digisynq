/* ==========================================================================
   DIGISYNQ — THE NETWORK BETWEEN THE DOTS.
   Interaction Engine v9.0 — Material Design 3 × High-Kinetic Motion
   Plugins: Lenis (Smooth Scroll) · Lucide (Icons) · VanillaTilt (3D Physics)
   ========================================================================== */

(function () {
  'use strict';

  /* ── 0. Open-Source Plugin Init ─────────────────────────────────────────── */

  // 1. Lenis Momentum Scroll
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

  // 2. Lucide Icons
  function initIcons() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIcons);
  } else {
    initIcons();
  }

  // 3. VanillaTilt 3D Physics
  function initTilt() {
    if (typeof VanillaTilt !== 'undefined') {
      const tiltEls = document.querySelectorAll(
        '.spotlight-card, .idle-card, .capability-card, .abc-card, .bm-card'
      );
      VanillaTilt.init(tiltEls, {
        max: 4,
        speed: 600,
        glare: true,
        'max-glare': 0.10,
        scale: 1.012,
        perspective: 1400
      });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTilt);
  } else {
    initTilt();
  }

  /* ── 1. M3 Ripple Effect on Buttons ───────────────────────────────────── */
  function createRipple(btn, e) {
    const rect = btn.getBoundingClientRect();
    const x = e ? e.clientX - rect.left : rect.width / 2;
    const y = e ? e.clientY - rect.top  : rect.height / 2;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:${size}px; height:${size}px;
      top:${y - size/2}px; left:${x - size/2}px;
      background: rgba(255,255,255,0.15);
      transform:scale(0); animation:md-ripple 500ms cubic-bezier(0.2,0,0,1) forwards;
    `;
    if (!document.getElementById('md-ripple-style')) {
      const style = document.createElement('style');
      style.id = 'md-ripple-style';
      style.textContent = '@keyframes md-ripple { to { transform:scale(1); opacity:0; } }';
      document.head.appendChild(style);
    }
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }

  document.querySelectorAll('.btn').forEach(btn => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.addEventListener('click', (e) => createRipple(btn, e));
  });

  /* ── 2. Sticky Navigation & Scroll Spy ──────────────────────────────────── */
  const nav = document.querySelector('.nav');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const fabTop = document.getElementById('fab-top');

  function handleScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 40);
    if (fabTop) fabTop.classList.toggle('visible', y > 500);

    let current = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 150) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (fabTop) {
    fabTop.addEventListener('click', () => {
      if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 3. Mobile Menu Drawer ────────────────────────────────────────────── */
  const menuBtn = document.getElementById('menu-btn');
  const drawer  = document.getElementById('nav-drawer');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open);
      menuBtn.classList.toggle('open', open);
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.classList.remove('open');
      });
    });
  }

  /* ── 4. M3 Scroll Reveal — Stagger Groups ─────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -28px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ── 5. Mouse-Following Spotlight Physics ─────────────────────────────── */
  const spotlightCards = document.querySelectorAll(
    '.spotlight-card, .idle-card, .abc-card, .bm-card, .recycle-card, .shift-col, .not-col'
  );
  spotlightCards.forEach(card => {
    card.classList.add('spotlight-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    });
  });

  /* ── 6. Number Counter Animation (Stats) ─────────────────────────────── */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count || el.textContent.replace(/[^\d.]/g, ''));
    const suffix = el.textContent.replace(/[\d.]/g, '');
    const dur = 1200;
    const start = performance.now();
    const isInt = Number.isInteger(target);

    function step(now) {
      const progress = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      el.textContent = (isInt ? Math.round(current) : current.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && countEls.length) {
    const countObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countObs.observe(el));
  }

  /* ── 7. Living Kinetic Dot Canvas (Hero Network) ─────────────────────── */
  const canvas = document.getElementById('dot-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    let dots = [];
    let pulses = [];
    let mouse = { x: null, y: null, radius: 230 };
    let activeCluster = 'all';
    let animFrame;

    const DOT_TYPES = [
      { label: 'TALENT',       color: '#7dd3fc', cluster: 'people' },
      { label: 'PROJECT',      color: '#38bdf8', cluster: 'work'   },
      { label: 'EQUIPMENT',    color: '#bae6fd', cluster: 'assets' },
      { label: 'STUDIO',       color: '#60c8f0', cluster: 'assets' },
      { label: 'LOCATION',     color: '#93c5fd', cluster: 'assets' },
      { label: 'KNOWLEDGE',    color: '#a5d8f5', cluster: 'intel'  },
      { label: 'MENTOR',       color: '#7dd3fc', cluster: 'people' },
      { label: 'AUDIENCE',     color: '#38bdf8', cluster: 'intel'  },
      { label: 'DISTRIBUTION', color: '#bae6fd', cluster: 'work'   },
      { label: 'OPPORTUNITY',  color: '#e0f2fe', cluster: 'work'   }
    ];

    function resize() {
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
      initDots();
    }

    function initDots() {
      dots = []; pulses = [];
      const numDots = Math.min(Math.floor((W * H) / 11000), 60);

      for (let i = 0; i < numDots; i++) {
        const t = DOT_TYPES[i % DOT_TYPES.length];
        dots.push({
          id: i,
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          baseRadius: 2.5 + Math.random() * 2.2,
          radius: 3,
          label: t.label,
          color: t.color,
          cluster: t.cluster,
          pulse: Math.random() * Math.PI * 2,
          opacity: 0.6 + Math.random() * 0.4
        });
      }

      for (let p = 0; p < 10; p++) {
        pulses.push({
          sourceIndex: Math.floor(Math.random() * numDots),
          targetIndex: Math.floor(Math.random() * numDots),
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.005
        });
      }
    }

    window.addEventListener('resize', resize);
    resize();

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    const pills = document.querySelectorAll('.hero-node-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCluster = pill.getAttribute('data-cluster');
      });
    });

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const d1 = dots[i], d2 = dots[j];
          const dx = d1.x - d2.x, dy = d1.y - d2.y;
          const dist = Math.hypot(dx, dy);
          const isMatch = (activeCluster === 'all' || d1.cluster === activeCluster || d2.cluster === activeCluster);
          const maxDist = isMatch ? 165 : 90;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * (isMatch ? 0.2 : 0.04);
            ctx.beginPath();
            ctx.moveTo(d1.x, d1.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.strokeStyle = isMatch
              ? `rgba(56,189,248,${alpha})`
              : `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = (d1.cluster === d2.cluster && isMatch) ? 1.1 : 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      dots.forEach(d => {
        d.pulse += 0.03;
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 12 || d.x > W - 12) d.vx *= -1;
        if (d.y < 12 || d.y > H - 12) d.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - d.x, dy = mouse.y - d.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            d.x -= (dx / dist) * force * 3.2;
            d.y -= (dy / dist) * force * 3.2;
          }
        }

        const isHighlighted = (activeCluster === 'all' || d.cluster === activeCluster);
        const r = isHighlighted ? (d.baseRadius + Math.sin(d.pulse) * 1.1) : 1.8;

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? d.color : 'rgba(255,255,255,0.08)';
        if (isHighlighted) {
          ctx.shadowBlur = 16;
          ctx.shadowColor = 'rgba(56,189,248,0.7)';
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        if (W > 768 && isHighlighted) {
          ctx.font = '9px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(125,211,252,0.5)';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, d.x, d.y + 15);
        }
      });

      // Traveling photon packets
      pulses.forEach(pkt => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) {
          pkt.progress = 0;
          pkt.sourceIndex = Math.floor(Math.random() * dots.length);
          pkt.targetIndex = Math.floor(Math.random() * dots.length);
        }
        const s = dots[pkt.sourceIndex], t = dots[pkt.targetIndex];
        if (s && t) {
          const px = s.x + (t.x - s.x) * pkt.progress;
          const py = s.y + (t.y - s.y) * pkt.progress;
          // Fade in/out at edges of travel
          const fadeAlpha = Math.sin(pkt.progress * Math.PI);
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56,189,248,${fadeAlpha})`;
          ctx.shadowBlur = 18;
          ctx.shadowColor = `rgba(56,189,248,${fadeAlpha * 0.8})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animFrame = requestAnimationFrame(draw);
    }
    draw();
  }

  /* ── 8. 10-Step Mechanism Interactive Engine ─────────────────────────── */
  const mechData = {
    '1': {
      num: "01 // DISCOVER",
      title: "Discover What Exists",
      desc: "Index hidden, idle, and distributed industry capacity. Map talent, unbooked soundstages, specialty camera packages, and verified skills across regional hubs.",
      example: "Scenario: 3 Soundstages in Bengaluru have 14 open calendar days next month. 6 Cinematographers are between projects.",
      chain: ["Map Raw Capacity", "Index Hardware & Spaces", "Identify Availability Windows"]
    },
    '2': {
      num: "02 // VERIFY",
      title: "Verify Evidence, Not Claims",
      desc: "Authenticate capability through actual wrap logs, portfolio breakdowns, peer confirmations, and equipment maintenance history.",
      example: "Scenario: DOP's low-light narrative competency authenticated via 4 verified feature film wrap logs and colorist feedback.",
      chain: ["Review Project Wraps", "Validate Equipment Handoffs", "Certify Capability Profile"]
    },
    '3': {
      num: "03 // CONNECT",
      title: "Connect the Disconnected",
      desc: "Bridge resources that rarely talk across traditional silos: emerging directors with veteran gaffers, idle RED packages with indie shorts.",
      example: "Scenario: Producer seeking specialized anamorphic lenses connects directly to an owner whose package is sitting idle.",
      chain: ["Traverse Network Graph", "Bridge Siloed Vendors", "Establish Direct Communication"]
    },
    '4': {
      num: "04 // COMPOSE",
      title: "Compose the Right Unit",
      desc: "Build the precise combination tailored for the mandate instead of standard bloated packages. Right-sized crews, hardware, and locations.",
      example: "Scenario: Low-budget period thriller composed with agile 14-person crew, vintage prime set, and negotiated off-peak stage rate.",
      chain: ["Assess Mandate Needs", "Right-Size Crew & Gear", "Calculate Synergies"]
    },
    '5': {
      num: "05 // SYNCHRONIZE",
      title: "Synchronize Calendars & Protocols",
      desc: "Align shooting schedules, daily handoffs, data pipelines, and standby failovers into one synchronized production pulse.",
      example: "Scenario: Dual unit shoot synchronized with daily DaVinci raw color sync and real-time audio log handoffs.",
      chain: ["Lock Calendar Windows", "Synchronize DIT & Post", "Align Standby Failovers"]
    },
    '6': {
      num: "06 // EXECUTE",
      title: "Execute with Resilience (Plan A/B/C)",
      desc: "Run active shoots with real-time operational support and pre-matched backup options ready to deploy without stopping the clock.",
      example: "Scenario: Rain halts outdoor shoot. Virtual production LED bay activates under pre-negotiated Plan B terms seamlessly.",
      chain: ["Monitor Live Milestones", "Deploy Hot-Swap Standbys", "Maintain Production Rhythm"]
    },
    '7': {
      num: "07 // TRACK",
      title: "Track Performance & Flow",
      desc: "Capture wrap logs, time efficiency, equipment integrity, and budget adherence objectively at every stage.",
      example: "Scenario: Wrap sheet logs: 100% on-time call sheets, zero gear damage, +16% schedule time savings achieved.",
      chain: ["Record Wrap Logs", "Audit Budget-to-Actual", "Release Milestone Contracts"]
    },
    '8': {
      num: "08 // LEARN",
      title: "Learn Before You Blame",
      desc: "Conduct blameless post-mortems on delays and successes. Translate every production friction point into institutional network memory.",
      example: "Scenario: Post-wrap analysis uncovers audio interference pattern in location X, automatically flagging it for future productions.",
      chain: ["Conduct Blameless Review", "Extract Operational Insights", "Update Matching Algorithms"]
    },
    '9': {
      num: "09 // REUSE",
      title: "Reuse Content, Knowledge & Relationships",
      desc: "Extract continuous value: master footage recycled into 16 derived assets; successful crew pairings bookmarked for future projects.",
      example: "Scenario: Feature shoot B-roll and rehearsals recycled into masterclass educational workshops and localized trailer cuts.",
      chain: ["Harvest Content Multipliers", "Document Workshop Knowledge", "Bookmark High-Synergy Units"]
    },
    '10': {
      num: "10 // REDEPLOY",
      title: "Redeploy for Next Best Use ↺",
      desc: "Resources immediately flow to their next highest value activity — talent to mentoring, idle gear to rental, studios to rehearsals.",
      example: "Scenario: DOP completes shoot and immediately leads a 2-day lighting workshop while camera package moves to commercial shoot.",
      chain: ["Identify Next-Best-Use", "Activate New Mandates", "Compound Network Value ↺"]
    }
  };

  const mechBtns       = document.querySelectorAll('.mech-step');
  const mechDetailNum  = document.getElementById('mech-detail-num');
  const mechDetailTitle= document.getElementById('mech-detail-title');
  const mechDetailDesc = document.getElementById('mech-detail-desc');
  const mechDetailEx   = document.getElementById('mech-detail-ex');
  const mechChainEl    = document.getElementById('mech-chain');
  const mechDetail     = document.querySelector('.mech-detail');

  function updateMechDetail(data) {
    if (!mechDetailTitle) return;
    // Animate out
    if (mechDetail) {
      mechDetail.style.opacity = '0';
      mechDetail.style.transform = 'translateY(8px)';
    }
    setTimeout(() => {
      if (mechDetailNum)   mechDetailNum.textContent   = data.num;
      if (mechDetailTitle) mechDetailTitle.textContent = data.title;
      if (mechDetailDesc)  mechDetailDesc.textContent  = data.desc;
      if (mechDetailEx)    mechDetailEx.textContent    = data.example;
      if (mechChainEl) {
        mechChainEl.innerHTML = data.chain.map(c =>
          `<div class="mech-chain-step current">${c}</div>`
        ).join('');
      }
      if (mechDetail) {
        mechDetail.style.transition = 'opacity 300ms, transform 300ms cubic-bezier(0.05,0.7,0.1,1)';
        mechDetail.style.opacity = '1';
        mechDetail.style.transform = 'translateY(0)';
      }
    }, 150);
  }

  if (mechBtns.length && mechDetailTitle) {
    mechBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        mechBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const data = mechData[btn.getAttribute('data-step')];
        if (data) updateMechDetail(data);
      });
    });
  }

  /* ── 9. Plan A/B/C Switcher ──────────────────────────────────────────── */
  const planTabs   = document.querySelectorAll('.plan-tab');
  const planPanels = document.querySelectorAll('.plan-panel');

  if (planTabs.length && planPanels.length) {
    planTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const plan = tab.getAttribute('data-plan');
        planTabs.forEach(t => t.classList.remove('active'));
        planPanels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(`panel-plan-${plan.toLowerCase()}`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ── 10. Smooth Internal Anchor Navigation ───────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        if (lenisInstance) lenisInstance.scrollTo(0, { duration: 1.1 });
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenisInstance) lenisInstance.scrollTo(targetEl, { duration: 1.1, offset: -82 });
        else targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── 11. Section Progress Indicator ─────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position:fixed; top:0; left:0; z-index:9999;
    height:1.5px; width:0%;
    background:linear-gradient(90deg,#38bdf8,#7dd3fc);
    transition:width 100ms linear;
    pointer-events:none;
  `;
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress  = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ── 12. Parallax Depth on Hero Text ────────────────────────────────── */
  const heroPara = document.querySelector('.hero-h1');
  const heroSub  = document.querySelector('.hero-sub');

  function onScrollParallax() {
    if (!heroPara) return;
    const y = window.scrollY;
    heroPara.style.transform = `translateY(${y * 0.12}px)`;
    if (heroSub) heroSub.style.transform = `translateY(${y * 0.07}px)`;
  }
  window.addEventListener('scroll', onScrollParallax, { passive: true });

})();
