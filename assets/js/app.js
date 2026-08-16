/* ==========================================================================
   DIGISYNQ — Creative Industry Intelligence & Orchestration Platform Engine
   Living Photonic Canvas, Silo Circuitry, 3D Card Tilt, Aspect Morph & Simulator
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
    const words = ['CONNECTED.', 'ORCHESTRATED.', 'INTELLIGENT.', 'SYNCHRONIZED.'];
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
    }, 2800);
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

      // Draw Center Hub (DIGISYNQ Orchestration Core)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Connection Lines & Nodes
      nodes.forEach((node, i) => {
        node.pulse += 0.025;
        node.x += node.vx;
        node.y += node.vy;

        if (Math.abs(node.x - node.baseX) > 22) node.vx *= -1;
        if (Math.abs(node.y - node.baseY) > 22) node.vy *= -1;

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

        // Line to Center Hub
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 + Math.sin(node.pulse) * 0.06})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Line to Next Node
        const nextNode = nodes[(i + 1) % nodes.length];
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(nextNode.x, nextNode.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Node Point
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Node Label
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - 10);
      });

      // Animate Flowing Photonic Packets
      packets.forEach(pkt => {
        pkt.progress += pkt.speed;
        if (pkt.progress > 1) pkt.progress = 0;

        const targetNode = nodes[pkt.nodeIndex];
        const px = centerX + (targetNode.x - centerX) * pkt.progress;
        const py = centerY + (targetNode.y - centerY) * pkt.progress;

        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ── 5. Interactive Silos-to-Connected Circuit Visualizer ───────────────── */
  const siloSwitchBtns = document.querySelectorAll('.silo-switch-btn');
  const siloBoxes      = document.querySelectorAll('.silo-box');
  const siloStatusText = document.getElementById('silo-status-text');

  if (siloSwitchBtns.length) {
    siloSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        siloSwitchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-mode');

        if (mode === 'orchestrated') {
          siloBoxes.forEach(box => box.classList.add('connected'));
          if (siloStatusText) {
            siloStatusText.textContent = '✨ DIGISYNQ SYNCHRONIZED: Information, verified assets, and learning flow seamlessly across every division.';
            siloStatusText.style.color = 'var(--accent-cyan)';
          }
        } else {
          siloBoxes.forEach(box => box.classList.remove('connected'));
          if (siloStatusText) {
            siloStatusText.textContent = '⚠️ FRAGMENTED STATE: Broken lines of communication create delayed schedules, idle assets, and wasted budget.';
            siloStatusText.style.color = 'var(--text-muted)';
          }
        }
      });
    });
  }

  /* ── 6. 3D Holographic Tilt on ID Card ─────────────────────────────────── */
  const idCard = document.querySelector('.id-card-preview');
  if (idCard) {
    idCard.addEventListener('mousemove', (e) => {
      const rect = idCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      idCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    idCard.addEventListener('mouseleave', () => {
      idCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  /* ── 7. Multi-Format Aspect Ratio Switcher ─────────────────────────────── */
  const aspectBtns = document.querySelectorAll('.aspect-btn');
  const aspectFrame = document.getElementById('aspect-frame');
  const aspectText  = document.getElementById('aspect-text');
  const aspectRes   = document.getElementById('aspect-res');

  const aspectInfo = {
    '16-9':  { label: '16:9 CINEMA MASTER', res: '3840 &times; 2160 &bull; Theatrical &amp; OTT' },
    '9-16':  { label: '9:16 VERTICAL REEL', res: '1080 &times; 1920 &bull; Mobile Discovery' },
    '1-1':   { label: '1:1 SQUARE PROMO', res: '1080 &times; 1080 &bull; Social Feed' },
    '239-1': { label: '2.39:1 ANAMORPHIC', res: '4096 &times; 1716 &bull; Widescreen Scope' }
  };

  if (aspectBtns.length && aspectFrame) {
    aspectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        aspectBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const ratio = btn.getAttribute('data-ratio');
        aspectFrame.setAttribute('data-ratio', ratio);
        if (aspectText && aspectInfo[ratio]) aspectText.innerHTML = aspectInfo[ratio].label;
        if (aspectRes && aspectInfo[ratio]) aspectRes.innerHTML = aspectInfo[ratio].res;
      });
    });
  }

  /* ── 8. ABCDEF Engine Stepper ───────────────────────────────────────────── */
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

  /* ── 9. Interactive Project Simulator ──────────────────────────────────── */
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

  /* ── 10. Contact Form Submissions & Fallback ───────────────────────────── */
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

  /* ── 9. Talent & Technician Live Registration Card Engine ───────────────── */
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

        // WhatsApp Direct Sync Option
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
