/* ==========================================================================
   DIGISYNQ — Core Interaction Engine v10
   Performance: RAF-throttled scroll, canvas pause when hidden,
                lazy VanillaTilt, debounced resize
   ========================================================================== */

(function () {
  'use strict';

  /* ── Anti-FOUC: reveal page after fonts/DOM ready ───────────────────────── */
  function revealPage() {
    document.documentElement.classList.add('ready');
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(revealPage);
  } else {
    window.addEventListener('load', revealPage);
  }
  // Failsafe: reveal after 1.2s regardless
  setTimeout(revealPage, 1200);

  /* ── 1. Lenis Smooth Scroll ─────────────────────────────────────────────── */
  let lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.05,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.82,
      touchMultiplier: 1.65
    });
    function rafLoop(t) { lenis.raf(t); requestAnimationFrame(rafLoop); }
    requestAnimationFrame(rafLoop);
  }

  /* ── 2. Navigation ──────────────────────────────────────────────────────── */
  const nav     = document.querySelector('.nav');
  const menuBtn = document.getElementById('menu-btn');
  const drawer  = document.getElementById('nav-drawer');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const fabTop   = document.getElementById('fab-top');

  // Throttled scroll handler using RAF
  let scrollTicking = false;
  let lastScroll = 0;

  function onScrollUpdate() {
    const y = window.scrollY;
    lastScroll = y;

    // Nav scroll state
    if (nav) nav.classList.toggle('scrolled', y > 50);

    // FAB visibility
    if (fabTop) fabTop.classList.toggle('visible', y > 600);

    // Active nav link scroll spy
    let active = '';
    sections.forEach(s => { if (y >= s.offsetTop - 140) active = s.id; });
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${active}`));

    scrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(onScrollUpdate);
      scrollTicking = true;
    }
  }, { passive: true });

  // FAB back to top
  if (fabTop) {
    fabTop.addEventListener('click', () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.1 });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── 3. Mobile Drawer ───────────────────────────────────────────────────── */
  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.classList.toggle('open', open);
      // Prevent body scroll when drawer open
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── 4. Smooth Anchor Navigation ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#' || id === '#top') {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { duration: 1.0, offset: -80 });
        else target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /* ── 5. Scroll Reveal (IntersectionObserver) ────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => obs.observe(el));
  } else {
    // Fallback for old browsers
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ── 6. Card Spotlight (mouse follow) ───────────────────────────────────── */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ── 7. VanillaTilt (lazy-init on proximity) ────────────────────────────── */
  let tiltInit = false;
  if (typeof VanillaTilt !== 'undefined') {
    const tiltObs = new IntersectionObserver(entries => {
      if (tiltInit) return;
      if (entries.some(e => e.isIntersecting)) {
        tiltInit = true;
        VanillaTilt.init(document.querySelectorAll('.talent-card, .capability-card'), {
          max: 3.5, speed: 600, glare: true, 'max-glare': 0.08, scale: 1.01, perspective: 1400
        });
        tiltObs.disconnect();
      }
    }, { rootMargin: '200px' });
    document.querySelectorAll('.talent-card, .capability-card').forEach(el => tiltObs.observe(el));
  }

  /* ── 8. Stat Counter Animation ──────────────────────────────────────────── */
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.textContent.replace(/[\d.]/g, '');
        const isInt = Number.isInteger(target);
        const dur = 1100;
        const start = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (isInt ? Math.round(target * eased) : (target * eased).toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countObs.observe(el));
  }

  /* ── 9. Kinetic Dot Canvas ──────────────────────────────────────────────── */
  const canvas = document.getElementById('dot-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, dots = [], pulses = [], animId;
    let mouse = { x: null, y: null };
    let activeCluster = 'all';
    let canvasVisible = true;

    const TYPES = [
      { label: 'TALENT',    color: '#7dd3fc', cluster: 'people' },
      { label: 'PROJECT',   color: '#38bdf8', cluster: 'work'   },
      { label: 'EQUIPMENT', color: '#bae6fd', cluster: 'assets' },
      { label: 'STUDIO',    color: '#60c8f0', cluster: 'assets' },
      { label: 'KNOWLEDGE', color: '#a5d8f5', cluster: 'intel'  },
      { label: 'MENTOR',    color: '#7dd3fc', cluster: 'people' },
      { label: 'AUDIENCE',  color: '#38bdf8', cluster: 'intel'  },
      { label: 'LOCATION',  color: '#93c5fd', cluster: 'assets' },
      { label: 'DEAL',      color: '#bae6fd', cluster: 'work'   },
      { label: 'SIGNAL',    color: '#e0f2fe', cluster: 'work'   }
    ];

    function resize() {
      W = canvas.width  = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
      init();
    }

    function init() {
      const count = Math.min(Math.floor((W * H) / 12000), 55);
      dots = Array.from({ length: count }, (_, i) => {
        const t = TYPES[i % TYPES.length];
        return {
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.36,
          vy: (Math.random() - 0.5) * 0.36,
          r: 2.2 + Math.random() * 2,
          label: t.label, color: t.color, cluster: t.cluster,
          phase: Math.random() * Math.PI * 2
        };
      });
      pulses = Array.from({ length: 8 }, () => ({
        si: Math.floor(Math.random() * dots.length),
        ti: Math.floor(Math.random() * dots.length),
        p: Math.random(),
        sp: 0.003 + Math.random() * 0.005
      }));
    }

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    resize();

    // Mouse
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; });

    // Filter pills
    document.querySelectorAll('.node-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.node-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCluster = pill.dataset.cluster || 'all';
      });
    });

    // Pause canvas when tab hidden (saves CPU/battery)
    document.addEventListener('visibilitychange', () => {
      canvasVisible = !document.hidden;
      if (canvasVisible) frame();
      else cancelAnimationFrame(animId);
    });

    function frame() {
      if (!canvasVisible) return;
      ctx.clearRect(0, 0, W, H);

      // Connections
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i], b = dots[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          const match = activeCluster === 'all' || a.cluster === activeCluster || b.cluster === activeCluster;
          const maxD = match ? 160 : 85;
          if (d < maxD) {
            const alpha = (1 - d / maxD) * (match ? 0.18 : 0.04);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = match ? `rgba(56,189,248,${alpha})` : `rgba(255,255,255,${alpha * 0.4})`;
            ctx.lineWidth = match && a.cluster === b.cluster ? 1.0 : 0.45;
            ctx.stroke();
          }
        }
      }

      // Dots
      const now = performance.now() * 0.001;
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 10 || d.x > W - 10) d.vx *= -1;
        if (d.y < 10 || d.y > H - 10) d.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - d.x, dy = mouse.y - d.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const f = (200 - dist) / 200;
            d.x -= (dx / dist) * f * 2.8;
            d.y -= (dy / dist) * f * 2.8;
          }
        }

        const lit = activeCluster === 'all' || d.cluster === activeCluster;
        const r = lit ? (d.r + Math.sin(now * 2 + d.phase) * 0.9) : 1.6;

        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = lit ? d.color : 'rgba(255,255,255,0.07)';
        if (lit) { ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(56,189,248,0.65)'; }
        ctx.fill();
        ctx.shadowBlur = 0;

        if (W > 700 && lit) {
          ctx.font = '8.5px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(125,211,252,0.45)';
          ctx.textAlign = 'center';
          ctx.fillText(d.label, d.x, d.y + 13);
        }
      });

      // Traveling photon packets
      pulses.forEach(pk => {
        pk.p += pk.sp;
        if (pk.p > 1) {
          pk.p = 0;
          pk.si = Math.floor(Math.random() * dots.length);
          pk.ti = Math.floor(Math.random() * dots.length);
        }
        const s = dots[pk.si], t = dots[pk.ti];
        if (s && t) {
          const px = s.x + (t.x - s.x) * pk.p;
          const py = s.y + (t.y - s.y) * pk.p;
          const fade = Math.sin(pk.p * Math.PI);
          ctx.beginPath();
          ctx.arc(px, py, 2.0, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56,189,248,${fade})`;
          ctx.shadowBlur = 16;
          ctx.shadowColor = `rgba(56,189,248,${fade * 0.75})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animId = requestAnimationFrame(frame);
    }
    frame();
  }

  /* ── 10. Mechanism 10-Step ──────────────────────────────────────────────── */
  const STEPS = {
    '1': { title: 'Discover What Exists', desc: 'Index hidden, idle, and distributed industry capacity. Map talent, unbooked soundstages, specialty packages, and verified skills across regional hubs.', example: 'Scenario: 3 Soundstages in Bengaluru have 14 open calendar days. 6 DOPs are between projects.', chain: ['Map Raw Capacity', 'Index Hardware & Spaces', 'Identify Availability Windows'] },
    '2': { title: 'Verify Evidence, Not Claims', desc: 'Authenticate capability through actual wrap logs, portfolio breakdowns, peer confirmations, and equipment maintenance history.', example: 'Scenario: DOP\'s low-light competency authenticated via 4 verified feature film wrap logs.', chain: ['Review Project Wraps', 'Validate Equipment Handoffs', 'Certify Capability Profile'] },
    '3': { title: 'Connect the Disconnected', desc: 'Bridge resources that rarely talk across traditional silos: emerging directors with veteran gaffers, idle RED packages with indie shorts.', example: 'Scenario: Producer seeking anamorphic lenses connects to owner whose package is sitting idle.', chain: ['Traverse Network Graph', 'Bridge Siloed Vendors', 'Establish Direct Communication'] },
    '4': { title: 'Compose the Right Unit', desc: 'Build the precise combination tailored for the mandate — right-sized crews, hardware, and locations instead of bloated standard packages.', example: 'Scenario: Low-budget thriller composed with 14-person crew, vintage prime set, off-peak stage rate.', chain: ['Assess Mandate Needs', 'Right-Size Crew & Gear', 'Calculate Synergies'] },
    '5': { title: 'Synchronize Calendars & Protocols', desc: 'Align shooting schedules, daily handoffs, data pipelines, and standby failovers into one synchronized production pulse.', example: 'Scenario: Dual unit shoot synchronized with daily DaVinci raw color sync and real-time audio log handoffs.', chain: ['Lock Calendar Windows', 'Synchronize DIT & Post', 'Align Standby Failovers'] },
    '6': { title: 'Execute with Resilience', desc: 'Run active shoots with real-time operational support and pre-matched backup options ready to deploy without stopping the clock.', example: 'Scenario: Rain halts outdoor shoot. Virtual production LED bay activates under Plan B terms seamlessly.', chain: ['Monitor Live Milestones', 'Deploy Hot-Swap Standbys', 'Maintain Production Rhythm'] },
    '7': { title: 'Track Performance & Flow', desc: 'Capture wrap logs, time efficiency, equipment integrity, and budget adherence objectively at every stage.', example: 'Scenario: Wrap sheet logs: 100% on-time call sheets, zero gear damage, +16% schedule time savings.', chain: ['Record Wrap Logs', 'Audit Budget-to-Actual', 'Release Milestone Contracts'] },
    '8': { title: 'Learn Before You Blame', desc: 'Conduct blameless post-mortems on delays and successes. Translate every production friction into institutional network memory.', example: 'Scenario: Post-wrap analysis uncovers audio interference at location X, auto-flagging for future shoots.', chain: ['Conduct Blameless Review', 'Extract Operational Insights', 'Update Matching Algorithms'] },
    '9': { title: 'Reuse Content, Knowledge & Relationships', desc: 'Extract continuous value: master footage recycled into 16 derived assets; successful crew pairings bookmarked for next project.', example: 'Scenario: Feature B-roll recycled into masterclass workshops and localised trailer cuts.', chain: ['Harvest Content Multipliers', 'Document Workshop Knowledge', 'Bookmark High-Synergy Units'] },
    '10': { title: 'Redeploy for Next Best Use ↺', desc: 'Resources immediately flow to their next highest value activity — talent to mentoring, idle gear to rental, studios to rehearsals.', example: 'Scenario: DOP completes shoot and leads a 2-day lighting workshop while camera package moves to commercial.', chain: ['Identify Next-Best-Use', 'Activate New Mandates', 'Compound Network Value ↺'] }
  };

  const stepBtns   = document.querySelectorAll('.step-btn');
  const detailEl   = document.querySelector('.step-detail');
  const detTitle   = document.getElementById('step-detail-title');
  const detDesc    = document.getElementById('step-detail-desc');
  const detEx      = document.getElementById('step-detail-ex');
  const detChain   = document.getElementById('step-chain');
  const detCode    = document.getElementById('step-detail-code');

  function updateStep(data, num) {
    if (!detTitle) return;
    detailEl.style.opacity = '0';
    detailEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      if (detCode)  detCode.textContent  = `${String(num).padStart(2,'0')} // ${data.title.split(' ').slice(0,2).join(' ').toUpperCase()}`;
      if (detTitle) detTitle.textContent = data.title;
      if (detDesc)  detDesc.textContent  = data.desc;
      if (detEx)    detEx.textContent    = data.example;
      if (detChain) detChain.innerHTML   = data.chain.map(c => `<div class="chain-step on">${c}</div>`).join('');
      detailEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      detailEl.style.opacity = '1';
      detailEl.style.transform = 'none';
    }, 130);
  }

  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stepBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const d = STEPS[btn.dataset.step];
      if (d) updateStep(d, btn.dataset.step);
    });
  });

  /* ── 11. Plan A/B/C Switcher ────────────────────────────────────────────── */
  const planTabs   = document.querySelectorAll('.plan-tab');
  const planPanels = document.querySelectorAll('.plan-panel');
  planTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      planTabs.forEach(t => t.classList.remove('active'));
      planPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${tab.dataset.plan}`);
      if (panel) panel.classList.add('active');
    });
  });

  /* ── 12. Page Read Progress Bar ─────────────────────────────────────────── */
  const bar = Object.assign(document.createElement('div'), {
    style: 'position:fixed;top:0;left:0;z-index:9999;height:2px;width:0%;background:linear-gradient(90deg,#38bdf8,#7dd3fc);pointer-events:none;transition:width 80ms linear;'
  });
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  }, { passive: true });

  /* ── 13. Hero Parallax (lightweight) ────────────────────────────────────── */
  const heroH1  = document.querySelector('.hero-h1');
  const heroSub = document.querySelector('.hero-sub');
  let rafParallax;
  if (heroH1) {
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(rafParallax);
      rafParallax = requestAnimationFrame(() => {
        const y = window.scrollY;
        heroH1.style.transform = `translateY(${y * 0.1}px)`;
        if (heroSub) heroSub.style.transform = `translateY(${y * 0.06}px)`;
      });
    }, { passive: true });
  }

})();
