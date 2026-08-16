/* ==========================================================================
   DIGISYNQ — Creative Industry Intelligence & Orchestration Platform Engine
   Progressive Stepper, Living Graph Canvas, Project Room OS, and Simulator
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

  /* ── 3. Living Photonic Ecosystem Canvas (Hero Section) ─────────────────── */
  const canvas = document.getElementById('ecosystem-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let nodes = [];
    let packets = [];
    const labels = [
      'PEOPLE', 'EQUIPMENT', 'STUDIOS', 'LOCATIONS',
      'POST', 'DISTRIBUTION', 'DATA'
    ];
    let mouse = { x: null, y: null, radius: 160 };

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
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 3.5,
          pulse: Math.random() * Math.PI * 2
        });

        packets.push({
          nodeIndex: i,
          progress: Math.random(),
          speed: 0.003 + Math.random() * 0.004
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

      // Draw Center Hub
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowBlur = 16;
      ctx.shadowColor = '#00f0ff';
      ctx.fill();
      ctx.shadowBlur = 0;

      nodes.forEach((node, i) => {
        node.pulse += 0.03;
        node.x += node.vx;
        node.y += node.vy;

        if (Math.abs(node.x - node.baseX) > 20) node.vx *= -1;
        if (Math.abs(node.y - node.baseY) > 20) node.vy *= -1;

        if (mouse.x !== null) {
          const dx = mouse.x - node.x;
          const dy = mouse.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            node.x -= (dx / dist) * force * 3;
            node.y -= (dy / dist) * force * 3;
          }
        }

        // Ray to center hub
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Polygon perimeter link
        const nextNode = nodes[(i + 1) % nodes.length];
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(nextNode.x, nextNode.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.stroke();

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + Math.sin(node.pulse) * 1.1, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 16);
      });

      // Traveling Photonic Packets
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

  /* ── 4. How DIGISYNQ Works (01–08 Progressive Stepper) ─────────────────── */
  const stepperData = {
    '1': {
      num: "STAGE 01",
      title: "01 — Define the Requirement",
      desc: "The producer, director, or brand inputs project parameters: format, target geography, shooting timeline, budget parameters, and creative ambitions.",
      example: "Mandate: “Kannada commercial, ₹25L budget, 3 shooting days, Bengaluru.”",
      details: ["Format & Genre Classification", "Budget Tier & Timeline Window", "Specific Technical Requirements"]
    },
    '2': {
      num: "STAGE 02",
      title: "02 — Understand Scope & Risk Points",
      desc: "DIGISYNQ analyzes the mandate to calculate required crew size, camera packages, lighting rigs, soundstages, post schedule, and potential operational bottlenecks.",
      example: "System isolates: Grade-A Low-Light DOP needed, 8000 sq.ft Soundstage, rain risk fallback.",
      details: ["Crew & Hardware Tiering", "Geography & Location Logistics", "Weather & Schedule Risk Analysis"]
    },
    '3': {
      num: "STAGE 03",
      title: "03 — Match via Verified Graph",
      desc: "The system queries the active ecosystem graph based on demonstrated capability (Grade), wrap performance (Rating), real-time calendar availability, and reliability.",
      example: "Queries verified DOPs in Bengaluru with open 3-day window and 90%+ reliability score.",
      details: ["Grade (Capability) + Rating (Performance)", "Real-Time Calendar Availability", "Past Project Reliability Index"]
    },
    '4': {
      num: "STAGE 04",
      title: "04 — Compose the Production Unit",
      desc: "Assembles right-sized talent, hardware packages, and unutilized studio slots with pre-screened rates and guaranteed co-working compatibility.",
      example: "Primary unit composed: DOP, RED V-Raptor package, Soundstage 02 booked during off-peak slot.",
      details: ["Right-Sized Resource Sizing", "Idle Capacity Discount Locking", "Co-Working Network Compatibility"]
    },
    '5': {
      num: "STAGE 05",
      title: "05 — Execute with Plan A/B/C Resilience",
      desc: "Production runs on synchronized capture protocols with hot-swap standby units and virtual stage failovers locked before call sheet wrap.",
      example: "Plan B standby camera package and alternate lighting unit confirmed on standby.",
      details: ["Synchronized Daily Capture Hand-off", "Pre-Matched Standby Crew / Gear", "Concurrent Vertical Promo Harvesting"]
    },
    '6': {
      num: "STAGE 06",
      title: "06 — Measure Performance & Delivery",
      desc: "Wrap logs, milestone deliveries, budget-to-actual variances, and equipment handoff checklists are recorded upon shoot completion.",
      example: "Master wrapped on schedule, 16 derived assets delivered, zero equipment damage.",
      details: ["Wrap Log & Delivery Verification", "Budget Variance Benchmarking", "Escrow Milestone Payout Release"]
    },
    '7': {
      num: "STAGE 07",
      title: "07 — Update Professional Reputation",
      desc: "Verified credits and performance ratings update on each participant's DIGISYNQ Professional ID based on evidence, not personal favors.",
      example: "DOP receives verified wrap credit, updating reliability to 95% and on-time score to 98%.",
      details: ["Evidence-Based Reputation Update", "Verified Wrap Credit Inscription", "Repeat Hire Metric Increment"]
    },
    '8': {
      num: "STAGE 08",
      title: "08 — Learn & Feed the Flywheel ↺",
      desc: "Every completed project feeds data back into the network, refining matching algorithms, pricing models, and scheduling predictions for the next project.",
      example: "Flywheel feeds back: Future Kannada commercials in Bengaluru match 3x faster with tighter cost efficiency.",
      details: ["Algorithmic Pricing Calibration", "Compounding Network Intelligence", "Next Project Recommendations"]
    }
  };

  const stepBtns = document.querySelectorAll('.step-nav-btn');
  const stepNumEl = document.getElementById('step-num');
  const stepTitleEl = document.getElementById('step-title');
  const stepDescEl = document.getElementById('step-desc');
  const stepExampleEl = document.getElementById('step-example');
  const stepDetailsEl = document.getElementById('step-details');

  if (stepBtns.length && stepTitleEl) {
    stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        stepBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const step = btn.getAttribute('data-step');
        const data = stepperData[step];
        if (data) {
          stepNumEl.textContent = data.num;
          stepTitleEl.textContent = data.title;
          stepDescEl.textContent = data.desc;
          stepExampleEl.textContent = data.example;
          if (stepDetailsEl) {
            stepDetailsEl.innerHTML = data.details.map(d => `<span class="badge-tag" style="margin-bottom:0; font-size:0.68rem;">✓ ${d}</span>`).join('');
          }
        }
      });
    });
  }

  /* ── 5. Project Room Plan A/B/C Switcher ────────────────────────────────── */
  const planBtns = document.querySelectorAll('.plan-btn');
  const planTitle = document.getElementById('room-plan-title');
  const planDesc = document.getElementById('room-plan-desc');
  const barLocation = document.getElementById('bar-loc');
  const barLocVal = document.getElementById('bar-loc-val');

  const planMatrix = {
    A: {
      title: "PLAN A // Primary Unit Locked",
      desc: "Scheduled Primary DOP, RED V-Raptor package, outdoor Mysuru forest location, and scheduled Stage 2 booking.",
      locPct: "82%",
      locStatus: "82% (Weather Dependent)"
    },
    B: {
      title: "PLAN B // Standby Alternate Activated",
      desc: "Pre-matched backup DOP confirmed on standby. Virtual Production LED Bay swapped for rain fallback with zero rescheduling fee.",
      locPct: "100%",
      locStatus: "100% (Virtual Bay Locked)"
    },
    C: {
      title: "PLAN C // Modular Contingency",
      desc: "Emergency modular unit shift. Second unit shoot concurrent execution in Bengaluru studio hub.",
      locPct: "95%",
      locStatus: "95% (Indoor Unit Active)"
    }
  };

  if (planBtns.length && planTitle) {
    planBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        planBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const plan = btn.getAttribute('data-plan');
        const data = planMatrix[plan];
        if (data) {
          planTitle.textContent = data.title;
          planDesc.textContent = data.desc;
          if (barLocation) barLocation.style.width = data.locPct;
          if (barLocVal) barLocVal.textContent = data.locStatus;
        }
      });
    });
  }

  /* ── 6. 3D Holographic ID Card Tilt ─────────────────────────────────────── */
  const idCards = document.querySelectorAll('.id-card-preview');
  idCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  });

  /* ── 7. Upgraded Real-World Project Simulator ─────────────────────────── */
  const simType   = document.getElementById('sim-type');
  const simGenre  = document.getElementById('sim-genre');
  const simBudget = document.getElementById('sim-budget');

  const outCrew   = document.getElementById('out-crew');
  const outGear   = document.getElementById('out-gear');
  const outPlanB  = document.getElementById('out-planb');
  const outCuts   = document.getElementById('out-cuts');
  const outEff    = document.getElementById('out-eff');
  const outSum    = document.getElementById('out-summary');

  function calculateSimulation() {
    if (!simType || !simBudget) return;
    const type = simType.value;
    const budget = simBudget.value;

    let crew = 32;
    let gear = 14;
    let planB = "94%";
    let cuts = "16 Cuts";
    let eff = "+15%";
    let summary = "Commercial Grade-A DOP + Anamorphic Package + Stage 1 Slot";

    if (type === 'creator') {
      crew = budget === 'tier1' ? 6 : 14;
      gear = 4;
      planB = "96%";
      cuts = "24 Cuts";
      eff = "+22%";
      summary = "High-Velocity Creator Unit + Rapid Multi-Format Pipeline";
    } else if (type === 'feature') {
      crew = budget === 'tier1' ? 38 : (budget === 'tier2' ? 64 : 110);
      gear = 26;
      planB = "95%";
      cuts = "40+ Cuts";
      eff = "+18%";
      summary = "Feature Unit Orchestration + Dual Camera + Standby Contingency";
    } else if (type === 'ott') {
      crew = budget === 'tier1' ? 28 : 56;
      gear = 18;
      planB = "92%";
      cuts = "32 Cuts";
      eff = "+14%";
      summary = "Multi-Episode Production Grid + DI Suite + Local Units";
    }

    if (outCrew) outCrew.textContent = `${crew} Pros`;
    if (outGear) outGear.textContent = `${gear} Pkgs`;
    if (outPlanB) outPlanB.textContent = planB;
    if (outCuts) outCuts.textContent = cuts;
    if (outEff) outEff.textContent = eff;
    if (outSum) outSum.textContent = summary;
  }

  [simType, simGenre, simBudget].forEach(el => {
    if (el) el.addEventListener('change', calculateSimulation);
  });

})();
