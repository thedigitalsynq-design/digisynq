/**
 * DIGISYNQ — The Entertainment Ecosystem, Synchronized
 * Interaction, Visualization, Health Monitoring & Living Pipeline Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================================
  // 1. SYSTEM LIVING PROCESS SEQUENCER (12-STEPS)
  // ========================================================================
  const systemSteps = [
    {
      num: '01',
      tag: 'MAP',
      title: 'MAP',
      desc: 'Catalog and structure every active node across the ecosystem: facilities, talent capabilities, rights availability, distribution pipelines, and technical infrastructure.',
      telemetry: ['Telemetry: 99.4% Graph Density', 'Latency: Real-time Ingestion', 'Active Nodes: 18,400+']
    },
    {
      num: '02',
      tag: 'DISCOVER',
      title: 'DISCOVER',
      desc: 'Surface latent capacity, idle production blocks, unexploited IP rights, and emergent creator capabilities previously locked in isolated industry silos.',
      telemetry: ['Discovery Index: 94.2%', 'Cross-Domain Signals: High', 'Coverage: Global']
    },
    {
      num: '03',
      tag: 'CONNECT',
      title: 'CONNECT',
      desc: 'Establish secure, permissioned, bilateral and multilateral communication and capability links across historically siloed entertainment verticals.',
      telemetry: ['Network Mesh: Verified', 'Security: Zero-Knowledge Graph', 'Protocol: DigiSynq Mesh']
    },
    {
      num: '04',
      tag: 'MATCH',
      title: 'MATCH',
      desc: 'Algorithmically pair unmet platform mandates, creative visions, and slate capital with high-affinity physical and creative capabilities.',
      telemetry: ['Match Precision: 98.7%', 'Affinity Score: 0.94', 'Friction: Minimized']
    },
    {
      num: '05',
      tag: 'COORDINATE',
      title: 'COORDINATE',
      desc: 'Orchestrate multi-party execution pipelines: locking schedules, orchestrating complex approval chains, tracking critical dependencies, and synchronizing distributed contributors.',
      telemetry: ['Dependency Graph: Active', 'Conflict Detection: Auto-Resolve', 'Pipeline: Multi-Party']
    },
    {
      num: '06',
      tag: 'SYNCHRONIZE',
      title: 'SYNCHRONIZE',
      desc: 'Align production timelines, guild compliances, international tax incentive windows, and delivery dates into a synchronized operational rhythm.',
      telemetry: ['Clock Sync: <10ms Jitter', 'Milestone Drift: 0.0%', 'State: Locked']
    },
    {
      num: '07',
      tag: 'COLLABORATE',
      title: 'COLLABORATE',
      desc: 'Provide shared situational awareness across creators, financiers, platforms, and crew without bureaucratic drag or fragmented communication channels.',
      telemetry: ['Channel Sync: Unified', 'Handoff Drag: -78%', 'Participants: Verified']
    },
    {
      num: '08',
      tag: 'MONITOR',
      title: 'MONITOR',
      desc: 'Continuously track schedule variances, budget utilization velocity, equipment throughput, and external risks across concurrent entertainment assets.',
      telemetry: ['Telemetry: 24/7 Continuous', 'Anomaly Alerting: Live', 'Health: Nominal']
    },
    {
      num: '09',
      tag: 'OPTIMIZE',
      title: 'OPTIMIZE',
      desc: 'Dynamically reallocate idle capacity, shift stage blocks, and balance rendering or shooting schedules to prevent costly downtime or budget overruns.',
      telemetry: ['Capacity Lift: +34%', 'Downtime Reclaimed: 92%', 'Yield: Optimized']
    },
    {
      num: '10',
      tag: 'LEVERAGE',
      title: 'LEVERAGE',
      desc: 'Multiply the yield of existing assets: license secondary rights, syndicate unused physical builds, and leverage cross-platform audience momentum.',
      telemetry: ['Asset Multiplier: 2.8x', 'Downstream Monetization: Active', 'Ownership: Pure Leverage']
    },
    {
      num: '11',
      tag: 'MEASURE',
      title: 'MEASURE',
      desc: 'Quantify actual speed-to-market compression, cost leakage reduction, return on creative investment, and net ecosystem value delivered.',
      telemetry: ['Leakage Reduced: 28.4%', 'Cycle Compression: 42 Days', 'ROI Vector: Verified']
    },
    {
      num: '12',
      tag: 'LEARN',
      title: 'LEARN',
      desc: 'Feed empirical execution data back into the DigiSynq Intelligence Engine to refine future matching algorithms and strengthen ecosystem coordination.',
      telemetry: ['Model Iteration: v4.9', 'Predictive Accuracy: +19%', 'Compounding: Self-Reinforcing']
    }
  ];

  let currentStepIdx = 0;
  let sequencerPlaying = true;
  let sequencerTimer = null;
  const STEP_INTERVAL = 3800; // ms per step

  const stepTrack = document.getElementById('stepsTrack');
  const currentStepName = document.getElementById('currentStepName');
  const stepIndexDisplay = document.getElementById('stepIndexDisplay');
  const stepTitleDisplay = document.getElementById('stepTitleDisplay');
  const stepDescDisplay = document.getElementById('stepDescDisplay');
  const stepTelemetryDisplay = document.getElementById('stepTelemetryDisplay');
  const togglePlayBtn = document.getElementById('togglePlayBtn');
  const playStateText = document.getElementById('playStateText');
  const prevStepBtn = document.getElementById('prevStepBtn');
  const nextStepBtn = document.getElementById('nextStepBtn');

  function renderStep(idx) {
    currentStepIdx = (idx + systemSteps.length) % systemSteps.length;
    const step = systemSteps[currentStepIdx];

    if (stepTrack) {
      const stepButtons = stepTrack.querySelectorAll('.progress-step');
      stepButtons.forEach((btn, i) => {
        btn.classList.toggle('active', i === currentStepIdx);
      });
    }

    if (currentStepName) currentStepName.textContent = step.tag;
    if (stepIndexDisplay) stepIndexDisplay.textContent = `STAGE ${step.num} / 12`;
    if (stepTitleDisplay) stepTitleDisplay.textContent = step.title;
    if (stepDescDisplay) stepDescDisplay.textContent = step.desc;

    if (stepTelemetryDisplay) {
      stepTelemetryDisplay.innerHTML = step.telemetry
        .map(t => `<span class="metric-pill">${t}</span>`)
        .join('');
    }
  }

  function startSequencer() {
    stopSequencer();
    sequencerTimer = setInterval(() => {
      renderStep(currentStepIdx + 1);
    }, STEP_INTERVAL);
    sequencerPlaying = true;
    if (playStateText) playStateText.textContent = 'PAUSE';
  }

  function stopSequencer() {
    if (sequencerTimer) clearInterval(sequencerTimer);
    sequencerPlaying = false;
    if (playStateText) playStateText.textContent = 'PLAY';
  }

  if (togglePlayBtn) {
    togglePlayBtn.addEventListener('click', () => {
      if (sequencerPlaying) {
        stopSequencer();
      } else {
        startSequencer();
      }
    });
  }

  if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
      stopSequencer();
      renderStep(currentStepIdx - 1);
    });
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      stopSequencer();
      renderStep(currentStepIdx + 1);
    });
  }

  if (stepTrack) {
    stepTrack.querySelectorAll('.progress-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const stepNum = parseInt(btn.getAttribute('data-step'), 10);
        stopSequencer();
        renderStep(stepNum);
      });
    });
  }

  startSequencer();

  // ========================================================================
  // 2. 20-NODE DOMAIN MATRIX FILTERING & RELATIONAL INTERACTION
  // ========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const nodeCards = document.querySelectorAll('.node-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      nodeCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  nodeCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const currentCategory = card.getAttribute('data-category');
      nodeCards.forEach(other => {
        if (other !== card && other.getAttribute('data-category') === currentCategory) {
          other.style.borderColor = 'rgba(77, 227, 250, 0.4)';
        }
      });
    });
    card.addEventListener('mouseleave', () => {
      nodeCards.forEach(other => {
        other.style.borderColor = '';
      });
    });
  });

  // ========================================================================
  // 3. INTERACTIVE OPPORTUNITY GRAPH (CANVAS ENGINE)
  // ========================================================================
  const canvas = document.getElementById('opportunityCanvas');
  const graphViewport = document.getElementById('graphViewport');
  const graphStatusLabel = document.getElementById('graphStatusLabel');

  if (canvas && graphViewport) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = graphViewport.clientWidth);
    let height = (canvas.height = graphViewport.clientHeight);

    window.addEventListener('resize', () => {
      if (graphViewport) {
        width = canvas.width = graphViewport.clientWidth;
        height = canvas.height = graphViewport.clientHeight;
        initNodes();
      }
    });

    let nodes = [];
    const nodeDefs = [
      { id: 'studio', label: 'AVAILABLE STUDIO', relX: 0.16, relY: 0.22, state: 'CAPACITY' },
      { id: 'creator', label: 'CREATOR CAPABILITY', relX: 0.84, relY: 0.20, state: 'TALENT' },
      { id: 'ip', label: 'UNUSED IP', relX: 0.14, relY: 0.76, state: 'RIGHTS' },
      { id: 'capital', label: 'CAPITAL NODE', relX: 0.86, relY: 0.78, state: 'CAPITAL' },
      { id: 'audience', label: 'AUDIENCE DEMAND', relX: 0.50, relY: 0.12, state: 'DEMAND' },
      { id: 'platform', label: 'PLATFORM NEED', relX: 0.50, relY: 0.88, state: 'DISTRIBUTION' }
    ];

    function initNodes() {
      nodes = nodeDefs.map(def => ({
        id: def.id,
        label: def.label,
        x: def.relX * width,
        y: def.relY * height,
        baseX: def.relX * width,
        baseY: def.relY * height,
        state: def.state
      }));
    }

    initNodes();

    const packets = [];
    const MAX_PACKETS = 24;

    function spawnPacket() {
      if (packets.length >= MAX_PACKETS || nodes.length === 0) return;
      const sourceNode = nodes[Math.floor(Math.random() * nodes.length)];
      const targetCenter = { x: width / 2, y: height / 2 };
      
      packets.push({
        sourceX: sourceNode.x,
        sourceY: sourceNode.y,
        targetX: targetCenter.x,
        targetY: targetCenter.y,
        progress: 0,
        speed: 0.006 + Math.random() * 0.008,
        color: Math.random() > 0.3 ? '#4de3fa' : '#9d87ff',
        size: 2.2 + Math.random() * 1.8
      });
    }

    let mouse = { x: width / 2, y: height / 2, active: false };
    graphViewport.addEventListener('mousemove', e => {
      const rect = graphViewport.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    graphViewport.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    const badges = document.querySelectorAll('.c-badge');
    badges.forEach(badge => {
      badge.addEventListener('mouseenter', () => {
        const nodeId = badge.getAttribute('data-node');
        if (graphStatusLabel) {
          graphStatusLabel.textContent = `ANALYZING: ${nodeId.toUpperCase()} INTEGRATION MATRIX`;
        }
      });
      badge.addEventListener('mouseleave', () => {
        if (graphStatusLabel) {
          graphStatusLabel.textContent = 'SYNCHRONIZING ACTIVE NODES';
        }
      });
    });

    function animateGraph() {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      if (Math.random() < 0.1) {
        spawnPacket();
      }

      nodes.forEach(node => {
        if (mouse.active) {
          const dx = mouse.x - node.baseX;
          const dy = mouse.y - node.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180;
            node.x = node.baseX - (dx / dist) * force * 15;
            node.y = node.baseY - (dy / dist) * force * 15;
          } else {
            node.x += (node.baseX - node.x) * 0.05;
            node.y += (node.baseY - node.y) * 0.05;
          }
        } else {
          node.x += (node.baseX - node.x) * 0.05;
          node.y += (node.baseY - node.y) * 0.05;
        }

        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(centerX, centerY);
        ctx.strokeStyle = 'rgba(77, 227, 250, 0.16)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4de3fa';
        ctx.shadowColor = '#4de3fa';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const curX = p.sourceX + (p.targetX - p.sourceX) * p.progress;
        const curY = p.sourceY + (p.targetY - p.sourceY) * p.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        const tailX = p.sourceX + (p.targetX - p.sourceX) * Math.max(0, p.progress - 0.06);
        const tailY = p.sourceY + (p.targetY - p.sourceY) * Math.max(0, p.progress - 0.06);
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      requestAnimationFrame(animateGraph);
    }

    requestAnimationFrame(animateGraph);
  }

  // ========================================================================
  // 4. REAL-TIME PROJECT HEALTH MONITOR SIMULATOR (SECTION 19)
  // ========================================================================
  const healthBtns = document.querySelectorAll('.health-toggle-btn');
  const healthBanner = document.getElementById('healthBanner');
  const healthStateTitle = document.getElementById('healthStateTitle');
  const healthStateDesc = document.getElementById('healthStateDesc');
  const driftVal = document.getElementById('driftVal');
  const driftFill = document.getElementById('driftFill');
  const depVal = document.getElementById('depVal');
  const depFill = document.getElementById('depFill');
  const riskVal = document.getElementById('riskVal');
  const riskFill = document.getElementById('riskFill');
  const logMessage = document.getElementById('logMessage');

  const healthData = {
    green: {
      title: 'SYSTEM STATE: ALL SYSTEMS ON TRACK',
      desc: 'Milestone variance < 1.2%. Critical path clear. Budget burn nominal.',
      drift: '0.0 Days',
      driftPct: '3%',
      driftColor: '#4de3fa',
      dep: '99.8% Synchronized',
      depPct: '98%',
      depColor: '#34d399',
      risk: '0 Actions Needed',
      riskPct: '5%',
      riskColor: '#34d399',
      log: 'All 14 linked dependencies operating within target tolerance. Stage 4 lock confirmed. Tax equity filing verified.'
    },
    yellow: {
      title: 'SYSTEM STATE: ATTENTION REQUIRED (SCHEDULE DRIFT DETECTED)',
      desc: 'VFX turnover variance at +3.5 days. Downstream international master delivery milestone impacted.',
      drift: '+3.5 Days',
      driftPct: '45%',
      driftColor: '#fbbf24',
      dep: '86.4% Synchronized',
      depPct: '86%',
      depColor: '#fbbf24',
      risk: '2 Adjustments Needed',
      riskPct: '48%',
      riskColor: '#fbbf24',
      log: '⚠️ WARNING: Lead actor 4-day schedule slip threatens Stage 4 teardown. DigiSynq Sync has automatically alerted sound stage and downstream colorist.'
    },
    red: {
      title: 'SYSTEM STATE: CRITICAL ANOMALY (BOTTLENECK ACTIVE)',
      desc: 'Chain of title territory holdback conflict detected. Production schedule blocked pending legal synchronization.',
      drift: '+8.2 Days',
      driftPct: '85%',
      driftColor: '#f87171',
      dep: '64.1% Synchronized',
      depPct: '64%',
      depColor: '#f87171',
      risk: '5 Critical Actions Required',
      riskPct: '90%',
      riskColor: '#f87171',
      log: '🚨 CRITICAL: Latin America territory holdback breach identified by Rights Graph. Autonomous mitigation route proposed: re-carve VOD window.'
    }
  };

  healthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      healthBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const state = btn.getAttribute('data-state');
      const d = healthData[state];

      if (healthBanner) {
        healthBanner.className = `health-status-banner state-${state}`;
      }
      if (healthStateTitle) healthStateTitle.textContent = d.title;
      if (healthStateDesc) healthStateDesc.textContent = d.desc;

      if (driftVal) driftVal.textContent = d.drift;
      if (driftFill) {
        driftFill.style.width = d.driftPct;
        driftFill.style.backgroundColor = d.driftColor;
      }

      if (depVal) depVal.textContent = d.dep;
      if (depFill) {
        depFill.style.width = d.depPct;
        depFill.style.backgroundColor = d.depColor;
      }

      if (riskVal) riskVal.textContent = d.risk;
      if (riskFill) {
        riskFill.style.width = d.riskPct;
        riskFill.style.backgroundColor = d.riskColor;
      }

      if (logMessage) logMessage.textContent = d.log;
    });
  });

  // ========================================================================
  // 5. OPERATIONAL SCENARIO WALKTHROUGH TABS (SECTIONS 22-25)
  // ========================================================================
  const scenTabs = document.querySelectorAll('.scen-tab');
  const scenIdBadge = document.getElementById('scenIdBadge');
  const scenTitle = document.getElementById('scenTitle');
  const scenChallenge = document.getElementById('scenChallenge');
  const scenStepsList = document.getElementById('scenStepsList');
  const scenMetric1 = document.getElementById('scenMetric1');
  const scenMetric2 = document.getElementById('scenMetric2');
  const scenMetric3 = document.getElementById('scenMetric3');

  const scenarioData = {
    alpha: {
      id: 'BLUEPRINT SECTION 22 // COMPLETE FILM WALKTHROUGH',
      title: 'Project Alpha ($25M Independent Tentpole)',
      challenge: 'A high-concept sci-fi feature requires packaging an A-list director, 3 lead actors, a 45-day LED volume stage block, multi-state tax credit filings, and $25M slate debt financing without bloated brokerage fees.',
      steps: [
        '<strong>01. Mapping:</strong> Scans real-time availability windows for director, talent, and LED volume stages.',
        '<strong>02. Capacity Sync:</strong> Detects a 45-day gap at an advanced LED volume stage; secures a 25% dark-calendar discount.',
        '<strong>03. Dependency Lock:</strong> Synchronizes tax credit milestones with guild contracts and shoot schedules.',
        '<strong>04. Monitoring:</strong> Tracks daily VFX turnaround rates with early warnings avoiding schedule drift.'
      ],
      m1: '42 Days Saved',
      m2: '28.4% Cost Avoided',
      m3: 'Pure Coordination Layer (0% Asset Ownership)'
    },
    studio: {
      id: 'BLUEPRINT SECTION 23 // IDLE CAPACITY MONETIZATION',
      title: 'Stage 4 Sound Stage Reclamation (20 Dark Days)',
      challenge: 'A premier European studio facility has an unexpected 20-day dark window following a studio postponement. Every unbooked dark day represents 100% perishable economic loss.',
      steps: [
        '<strong>01. Detection:</strong> Studio Stage 4 availability instantly registers in DigiSynq Network Engine as dark capacity.',
        '<strong>02. Matching:</strong> Surfaces an agile commercial episodic production with matching technical footprint seeking rapid stage lock.',
        '<strong>03. Contract Lock:</strong> Generates automated pre-cleared guild-compliant stage agreements within 48 hours.',
        '<strong>04. Yield:</strong> 100% stage utilization achieved with $380K reclaimed revenue for the studio facility.'
      ],
      m1: '48h Discovery-to-Lock',
      m2: '$380K Value Reclaimed',
      m3: 'Zero Dark Days for Facility'
    },
    ip: {
      id: 'BLUEPRINT SECTION 24 // UNUSED IP RIGHTS ACTIVATION',
      title: 'Archived Sci-Fi Novel Adaptation',
      challenge: 'A literary estate controls dormant film and series rights for an acclaimed 1990s cyberpunk novel. Rights have sat unexploited for 12 years with zero inbound offers.',
      steps: [
        '<strong>01. Rights Ingestion:</strong> Chain of title and territory holdback terms mapped into the DigiSynq Rights Graph.',
        '<strong>02. Signal Correlation:</strong> Intelligence Engine correlates +280% audience surge for cyberpunk themes with a major streamer mandate.',
        '<strong>03. Packaging:</strong> Simultaneously pairs the IP with a verified showrunner, attached indie producer, and regional tax fund.',
        '<strong>04. Greenlight:</strong> Series development room funded and option deal executed in under 30 days.'
      ],
      m1: '12-Year Stagnation Broken',
      m2: '30-Day Development Lock',
      m3: 'Zero Agency Intermediary Skim'
    },
    brand: {
      id: 'BLUEPRINT SECTION 25 // CROSS-DOMAIN SYNTHESIS',
      title: 'Global Tech Brand + Creator + Live Fandom Tour',
      challenge: 'A Fortune 500 consumer tech brand requires authentic connection to regional gaming audiences without generic static banner sponsorships or unvetted influencer agencies.',
      steps: [
        '<strong>01. Ecosystem Pairing:</strong> Pairs brand with 4 regional streamers, an esports arena tour operator, and music artists.',
        '<strong>02. Coordination:</strong> Synchronizes live experiential tour dates with digital content drops and brand hardware integrations.',
        '<strong>03. Shared Risk:</strong> Structures co-sponsorship model reducing tour overhead while maximizing direct creator equity.',
        '<strong>04. Impact:</strong> 4.8M direct community impressions with verifiable ticket and device conversion telemetry.'
      ],
      m1: '4 Domains Synthesized',
      m2: '4.8M Fandom Reach',
      m3: 'Cross-Domain Ecosystem Alpha'
    }
  };

  scenTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scenTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const key = tab.getAttribute('data-scenario');
      const d = scenarioData[key];

      if (scenIdBadge) scenIdBadge.textContent = d.id;
      if (scenTitle) scenTitle.textContent = d.title;
      if (scenChallenge) scenChallenge.textContent = d.challenge;

      if (scenStepsList) {
        scenStepsList.innerHTML = d.steps.map(s => `<li>${s}</li>`).join('');
      }

      if (scenMetric1) scenMetric1.textContent = d.m1;
      if (scenMetric2) scenMetric2.textContent = d.m2;
      if (scenMetric3) scenMetric3.textContent = d.m3;
    });
  });

  // ========================================================================
  // 6. SCROLL REVEALS & ACTIVE NAVIGATION
  // ========================================================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  const mainHeader = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  });

  // ========================================================================
  // 7. MAGNETIC BUTTONS
  // ========================================================================
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.16}px, ${y * 0.16}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ========================================================================
  // 8. STRATEGIC CHALLENGE INTAKE FORM
  // ========================================================================
  const challengeForm = document.getElementById('challengeForm');
  const formFeedback = document.getElementById('formFeedback');

  if (challengeForm) {
    challengeForm.addEventListener('submit', e => {
      e.preventDefault();
      const domain = document.getElementById('userDomain').value;
      const friction = document.getElementById('frictionType').value;
      const description = document.getElementById('challengeDescription').value;
      const email = document.getElementById('contactEmail').value;

      const subject = encodeURIComponent(`Strategic Conversation: [${domain}] - ${friction}`);
      const body = encodeURIComponent(
        `Domain: ${domain}\nFriction Type: ${friction}\nContact: ${email}\n\nStrategic Challenge Description:\n${description}\n\n-- Submitted via DigiSynq Network Console`
      );
      const mailtoUrl = `mailto:hello@digisynq.com?subject=${subject}&body=${body}`;

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `✓ Strategic challenge registered for <strong>${email}</strong>. Opening secure transmission channel...`;
      }

      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 750);
    });
  }

  // ========================================================================
  // 9. MOBILE DRAWER MENU
  // ========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ========================================================================
  // 10. APPLE PRO CARD SPOTLIGHT TRACKING
  // ========================================================================
  const spotlightCards = document.querySelectorAll(
    '.principle-card, .node-card, .arch-module-card, .scenario-panel, .state-card, .engine-spec-card, .level-card, .manifesto-card, .telemetry-card'
  );

  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--spotlight-x', `${x}px`);
      card.style.setProperty('--spotlight-y', `${y}px`);
    });
  });

  // ========================================================================
  // 11. PROCEDURAL ACOUSTIC UI FEEDBACK ENGINE (WEB AUDIO API)
  // ========================================================================
  let soundEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playUiTone(freq, type = 'sine', duration = 0.1, gainVal = 0.04) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  const btnAudioToggle = document.getElementById('btnAudioToggle');
  const audioToast = document.getElementById('audioToast');

  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      btnAudioToggle.classList.toggle('active', soundEnabled);
      if (soundEnabled) {
        initAudio();
        playUiTone(660, 'sine', 0.15, 0.08);
      }
      if (audioToast) {
        audioToast.textContent = `Acoustic Feedback: ${soundEnabled ? 'ON' : 'OFF'}`;
        audioToast.classList.add('show');
        setTimeout(() => audioToast.classList.remove('show'), 1800);
      }
    });
  }

  // ========================================================================
  // 12. HERO LIVING CONSTELLATION NETWORK CANVAS
  // ========================================================================
  const heroCanvas = document.getElementById('heroNetworkCanvas');
  if (heroCanvas) {
    const hCtx = heroCanvas.getContext('2d');
    let hWidth = (heroCanvas.width = heroCanvas.clientWidth || window.innerWidth);
    let hHeight = (heroCanvas.height = heroCanvas.clientHeight || window.innerHeight);

    window.addEventListener('resize', () => {
      if (heroCanvas) {
        hWidth = heroCanvas.width = heroCanvas.clientWidth || window.innerWidth;
        hHeight = heroCanvas.height = heroCanvas.clientHeight || window.innerHeight;
      }
    });

    const heroNodeLabels = [
      'STUDIO', 'CREATOR', 'IP RIGHTS', 'PLATFORM', 'AUDIENCE', 
      'CAPITAL', 'INFRASTRUCTURE', 'TAX EQUITY', 'DISTRIBUTION', 'MUSIC'
    ];

    const heroNodes = [];
    const NUM_HERO_NODES = Math.min(24, Math.floor(window.innerWidth / 55));

    for (let i = 0; i < NUM_HERO_NODES; i++) {
      heroNodes.push({
        x: Math.random() * hWidth,
        y: Math.random() * hHeight,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: 2 + Math.random() * 2.5,
        label: heroNodeLabels[i % heroNodeLabels.length],
        pulse: Math.random() * Math.PI * 2
      });
    }

    // Reference 2: Atmospheric Volumetric Dust Particles
    const dustParticles = [];
    const NUM_DUST = 50;
    for (let i = 0; i < NUM_DUST; i++) {
      dustParticles.push({
        x: Math.random() * hWidth,
        y: Math.random() * hHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.12 - Math.random() * 0.28,
        radius: 0.7 + Math.random() * 1.6,
        alpha: 0.15 + Math.random() * 0.4,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        phase: Math.random() * Math.PI * 2,
        colorBase: Math.random() > 0.45 ? 'rgba(244, 232, 220, ' : 'rgba(45, 212, 191, '
      });
    }

    let heroMouse = { x: -1000, y: -1000, active: false };
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      heroSection.addEventListener('mousemove', e => {
        const rect = heroSection.getBoundingClientRect();
        heroMouse.x = e.clientX - rect.left;
        heroMouse.y = e.clientY - rect.top;
        heroMouse.active = true;
      });
      heroSection.addEventListener('mouseleave', () => {
        heroMouse.active = false;
        heroMouse.x = -1000;
        heroMouse.y = -1000;
      });
    }

    function animateHeroNetwork() {
      hCtx.clearRect(0, 0, hWidth, hHeight);

      // Render Volumetric Atmospheric Dust Layer
      dustParticles.forEach(dust => {
        dust.x += dust.vx;
        dust.y += dust.vy;
        dust.phase += dust.pulseSpeed;

        if (heroMouse.active) {
          const dx = heroMouse.x - dust.x;
          const dy = heroMouse.y - dust.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            dust.x -= (dx / dist) * 0.5;
            dust.y -= (dy / dist) * 0.5;
          }
        }

        if (dust.y < -10) {
          dust.y = hHeight + 10;
          dust.x = Math.random() * hWidth;
        }
        if (dust.x < -10) dust.x = hWidth + 10;
        if (dust.x > hWidth + 10) dust.x = -10;

        const currentAlpha = Math.max(0.08, dust.alpha + Math.sin(dust.phase) * 0.12);
        hCtx.beginPath();
        hCtx.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
        hCtx.fillStyle = `${dust.colorBase}${currentAlpha.toFixed(2)})`;
        hCtx.fill();
      });

      // Update positions
      heroNodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += 0.025;

        if (node.x < 0 || node.x > hWidth) node.vx *= -1;
        if (node.y < 0 || node.y > hHeight) node.vy *= -1;

        // Mouse attraction
        if (heroMouse.active) {
          const dx = heroMouse.x - node.x;
          const dy = heroMouse.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 10) {
            node.x += (dx / dist) * 0.4;
            node.y += (dy / dist) * 0.4;
          }
        }
      });

      // Draw connections
      for (let i = 0; i < heroNodes.length; i++) {
        for (let j = i + 1; j < heroNodes.length; j++) {
          const a = heroNodes[i];
          const b = heroNodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.18;
            hCtx.beginPath();
            hCtx.moveTo(a.x, a.y);
            hCtx.lineTo(b.x, b.y);
            hCtx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
            hCtx.lineWidth = 1;
            hCtx.stroke();
          }
        }
      }

      // Draw nodes & micro labels
      heroNodes.forEach(node => {
        const pulseSize = Math.sin(node.pulse) * 1.2;

        hCtx.beginPath();
        hCtx.arc(node.x, node.y, node.radius + pulseSize, 0, Math.PI * 2);
        hCtx.fillStyle = 'rgba(45, 212, 191, 0.75)';
        hCtx.shadowColor = '#4ade80';
        hCtx.shadowBlur = 10;
        hCtx.fill();
        hCtx.shadowBlur = 0;

        // Micro label
        hCtx.font = '9px "JetBrains Mono", monospace';
        hCtx.fillStyle = 'rgba(226, 232, 240, 0.75)';
        hCtx.fillText(node.label, node.x + 8, node.y + 3);
      });

      requestAnimationFrame(animateHeroNetwork);
    }

    requestAnimationFrame(animateHeroNetwork);
  }

  // ========================================================================
  // 13. INTERACTIVE OPPORTUNITY FORMULA SIMULATOR
  // ========================================================================
  const simButtons = document.querySelectorAll('.sim-opt');
  const simValDisplay = document.getElementById('simValDisplay');
  const simDaysDisplay = document.getElementById('simDaysDisplay');
  const simLeakDisplay = document.getElementById('simLeakDisplay');
  const simEfficiencyDisplay = document.getElementById('simEfficiencyDisplay');

  function calculateSimulation() {
    let capacityYield = 3.8;
    let needYield = 5.2;
    let daysSaved = 42;
    let networkMult = 1.4;
    let intelMult = 1.35;

    const activeCapacity = document.querySelector('.sim-button-group[data-factor="capacity"] .sim-opt.active');
    if (activeCapacity) {
      capacityYield = parseFloat(activeCapacity.getAttribute('data-yield')) || 3.8;
      daysSaved = parseInt(activeCapacity.getAttribute('data-days'), 10) || 20;
    }

    const activeNeed = document.querySelector('.sim-button-group[data-factor="need"] .sim-opt.active');
    if (activeNeed) {
      needYield = parseFloat(activeNeed.getAttribute('data-yield')) || 5.2;
      daysSaved += parseInt(activeNeed.getAttribute('data-days'), 10) || 22;
    }

    const activeNetwork = document.querySelector('.sim-button-group[data-factor="network"] .sim-opt.active');
    if (activeNetwork) {
      networkMult = parseFloat(activeNetwork.getAttribute('data-mult')) || 1.4;
    }

    const activeIntel = document.querySelector('.sim-button-group[data-factor="intel"] .sim-opt.active');
    if (activeIntel) {
      intelMult = parseFloat(activeIntel.getAttribute('data-mult')) || 1.35;
    }

    const totalValue = (capacityYield + needYield) * networkMult * intelMult;
    const formattedVal = `$${totalValue.toFixed(1)}M`;

    if (simValDisplay) simValDisplay.textContent = formattedVal;
    if (simDaysDisplay) simDaysDisplay.textContent = `-${daysSaved} Days`;
    if (simLeakDisplay) {
      const leakAverted = (24 + (networkMult * 4)).toFixed(1);
      simLeakDisplay.textContent = `${leakAverted}%`;
    }
  }

  simButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentGroup = btn.closest('.sim-button-group');
      if (parentGroup) {
        parentGroup.querySelectorAll('.sim-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        playUiTone(580, 'sine', 0.08, 0.03);
        calculateSimulation();
      }
    });
  });

  calculateSimulation();

  // ========================================================================
  // 14. 20-NODE DOMAIN INSPECTOR DRAWER
  // ========================================================================
  const domainInspectorModal = document.getElementById('domainInspectorModal');
  const btnCloseInspector = document.getElementById('btnCloseInspector');
  const inspDomainId = document.getElementById('inspDomainId');
  const inspDomainCategory = document.getElementById('inspDomainCategory');
  const inspDomainTitle = document.getElementById('inspDomainTitle');
  const inspDomainDesc = document.getElementById('inspDomainDesc');
  const inspDimensionsGrid = document.getElementById('inspDimensionsGrid');
  const inspAffinityList = document.getElementById('inspAffinityList');

  const domainDetails = {
    '01': {
      title: 'Creative',
      cat: 'CREATIVE & TALENT DOMAIN',
      desc: 'Actors, actresses, directors, writers, screenwriters, composers, lyricists, choreographers, creators, animators, and voice artists.',
      dims: [
        { name: '01. Identity', val: 'SAG / WGA / Guild Verified Talent Network' },
        { name: '02. Capability', val: 'Multi-genre directing, screenwriting & performance' },
        { name: '03. Availability', val: 'Q3-Q4 calendar booking windows' },
        { name: '04. Assets', val: 'Original pitch bibles, treatments & scripts' },
        { name: '05. Needs', val: 'Attached director, producer & slate financing' },
        { name: '06. Relationships', val: 'Multi-hop manager, agent & collaborator edges' },
        { name: '07. Opportunities', val: 'Cross-border co-production mandates' },
        { name: '08. Rights', val: 'Underlying story options & creator participations' },
        { name: '09. Workflow', val: 'Agile writers rooms & table read turnovers' },
        { name: '10. Intelligence', val: '98.4% Genre-affinity match score' }
      ],
      affinities: ['Production', 'Distribution', 'Platform', 'Capital', 'Music']
    },
    '02': {
      title: 'Production',
      cat: 'PRODUCTION & EXECUTION DOMAIN',
      desc: 'Film production houses, TV & OTT production companies, digital-content studios, animation and VFX houses.',
      dims: [
        { name: '01. Identity', val: 'Registered production entities & studio credits' },
        { name: '02. Capability', val: 'High-end episodic, feature & virtual production' },
        { name: '03. Availability', val: 'Immediate pipeline capacity & crew attachments' },
        { name: '04. Assets', val: 'Proprietary VFX render pipelines & equipment' },
        { name: '05. Needs', val: 'Co-financing, completion bonds & slate distribution' },
        { name: '06. Relationships', val: 'Active vendor networks & physical crews' },
        { name: '07. Opportunities', val: 'Tax-credit territory packaging' },
        { name: '08. Rights', val: 'Co-production & master production rights' },
        { name: '09. Workflow', val: 'Daily hot costs & call-sheet telemetry' },
        { name: '10. Intelligence', val: 'Zero-variance milestone tracking' }
      ],
      affinities: ['Production Management', 'Infrastructure', 'Creative', 'Capital']
    },
    '03': {
      title: 'Production Management',
      cat: 'ORCHESTRATION & LOGISTICS DOMAIN',
      desc: 'Producers, line producers, executive producers, production managers, coordinators, accountants, and location managers.',
      dims: [
        { name: '01. Identity', val: 'PGA & Guild certified production managers' },
        { name: '02. Capability', val: 'Complex line production, multi-location logistics' },
        { name: '03. Availability', val: 'Pre-production & principal photography windows' },
        { name: '04. Assets', val: 'Historical budget models & location agreements' },
        { name: '05. Needs', val: 'Qualified crew rosters & equipment packages' },
        { name: '06. Relationships', val: 'Direct linkages to department heads & guilds' },
        { name: '07. Opportunities', val: 'Schedule optimization & dependency hedging' },
        { name: '08. Rights', val: 'Employment & production compliance master contracts' },
        { name: '09. Workflow', val: 'Automated call sheets & wrap reports' },
        { name: '10. Intelligence', val: 'Schedule slippage predictive warnings' }
      ],
      affinities: ['Production', 'Infrastructure', 'Regulatory', 'Operational']
    },
    '04': {
      title: 'Infrastructure',
      cat: 'PHYSICAL & TECHNICAL ASSETS DOMAIN',
      desc: 'Film studios, sound stages, recording suites, virtual-production facilities, camera/lighting rental houses, and post suites.',
      dims: [
        { name: '01. Identity', val: 'Acoustic stages, green-screen & LED volume complexes' },
        { name: '02. Capability', val: 'Large-scale sound stages & virtual production' },
        { name: '03. Availability', val: 'Dark calendar blocks & idle capacity windows' },
        { name: '04. Assets', val: 'Silent HVAC, 40ft clear heights, Arri/RED packages' },
        { name: '05. Needs', val: 'Episodic or feature tenant locks' },
        { name: '06. Relationships', val: 'Active bookings with studios & streamers' },
        { name: '07. Opportunities', val: 'Perishable idle capacity monetization' },
        { name: '08. Rights', val: 'Master stage lease & facility agreements' },
        { name: '09. Workflow', val: 'Automated stage dispatch & load-in schedules' },
        { name: '10. Intelligence', val: 'Capacity demand forecasting' }
      ],
      affinities: ['Production', 'Production Management', 'Technology', 'Operational']
    },
    '05': {
      title: 'Distribution',
      cat: 'COMMERCIAL REACH & EXHIBITION DOMAIN',
      desc: 'Film distributors, TV distributors, theatrical cinema chains, multiplexes, satellite networks, syndicators, and international sales.',
      dims: [
        { name: '01. Identity', val: 'Licensed theatrical, satellite & syndication distributors' },
        { name: '02. Capability', val: 'Cross-territory exhibition, screen allocation' },
        { name: '03. Availability', val: 'Quarterly theatrical & festival release slates' },
        { name: '04. Assets', val: 'Direct exhibition screen networks & buyer relationships' },
        { name: '05. Needs', val: 'Pre-cleared content slates with attached talent' },
        { name: '06. Relationships', val: 'Exhibitor chains, theater owners & aggregators' },
        { name: '07. Opportunities', val: 'Day-and-date international windowing' },
        { name: '08. Rights', val: 'Theatrical, satellite & regional remake rights' },
        { name: '09. Workflow', val: 'DCP delivery, box office reporting & settlements' },
        { name: '10. Intelligence', val: 'Territorial theatrical yield modeling' }
      ],
      affinities: ['Platform', 'Television', 'Rights', 'Marketing']
    },
    '06': {
      title: 'Platform',
      cat: 'STREAMING & DIGITAL ECOSYSTEM DOMAIN',
      desc: 'OTT, streaming, YouTube, short-video, podcast, FAST channels, digital publishing, and content marketplaces.',
      dims: [
        { name: '01. Identity', val: 'Global and regional streaming platforms' },
        { name: '02. Capability', val: 'Algorithmic distribution, multi-device CDN streaming' },
        { name: '03. Availability', val: 'Quarterly content acquisition windows' },
        { name: '04. Assets', val: 'Millions of active paying subscribers' },
        { name: '05. Needs', val: 'High-affinity local and global originals' },
        { name: '06. Relationships', val: 'Direct creator programs & studio output deals' },
        { name: '07. Opportunities', val: 'FAST channel co-licensing' },
        { name: '08. Rights', val: 'SVOD, AVOD & TVOD global licensing' },
        { name: '09. Workflow', val: 'IMF ingest, automated subtitle QA & encoding' },
        { name: '10. Intelligence', val: 'Subscriber churn & completion telemetry' }
      ],
      affinities: ['Distribution', 'Television', 'Audience', 'Technology']
    },
    '07': {
      title: 'Television',
      cat: 'BROADCAST & NETWORK DOMAIN',
      desc: 'TV channels, network broadcasters, daily-show producers, reality-show producers, programming and acquisition teams.',
      dims: [
        { name: '01. Identity', val: 'Terrestrial, cable & satellite broadcast networks' },
        { name: '02. Capability', val: 'Daily linear broadcasting & live event coverage' },
        { name: '03. Availability', val: 'Prime-time and daytime programming slots' },
        { name: '04. Assets', val: 'Broadcast spectrum, satellite uplink & studios' },
        { name: '05. Needs', val: 'High-engagement non-fiction and daily drama formats' },
        { name: '06. Relationships', val: 'Media buyers, advertisers & audience rating agencies' },
        { name: '07. Opportunities', val: 'Simulcast & digital catch-up syndication' },
        { name: '08. Rights', val: 'Linear broadcast, rerun & regional language feeds' },
        { name: '09. Workflow', val: 'Master control room scheduling & ad-insertion' },
        { name: '10. Intelligence', val: 'TRP & Nielsen ratings analytics' }
      ],
      affinities: ['Distribution', 'Brand', 'Audience', 'Production']
    },
    '08': {
      title: 'Music',
      cat: 'AUDIO & COMPOSITION DOMAIN',
      desc: 'Record labels, independent publishers, artists, singers, songwriters, composers, streaming channels, concert promoters, and royalty societies.',
      dims: [
        { name: '01. Identity', val: 'PRO & MLC verified composers and publishers' },
        { name: '02. Capability', val: 'Original scoring, sync licensing & master production' },
        { name: '03. Availability', val: 'Studio scoring windows & tour dates' },
        { name: '04. Assets', val: 'Catalog masters & publishing copyrights' },
        { name: '05. Needs', val: 'Film/TV sync placements & streaming discovery' },
        { name: '06. Relationships', val: 'Labels, music supervisors & artists' },
        { name: '07. Opportunities', val: 'Cross-platform soundtrack releases' },
        { name: '08. Rights', val: 'Master rights, sync rights & mechanical royalties' },
        { name: '09. Workflow', val: 'Stem delivery, cue sheets & automated splits' },
        { name: '10. Intelligence', val: 'Streaming velocity & viral TikTok sound signals' }
      ],
      affinities: ['Creative', 'Brand', 'Live', 'Platform']
    },
    '09': {
      title: 'Brand',
      cat: 'COMMERCIAL & SPONSORSHIP DOMAIN',
      desc: 'Brands, corporate advertisers, creative agencies, media buyers, product-placement partners, and experiential marketers.',
      dims: [
        { name: '01. Identity', val: 'Global brands, FMCG, tech & consumer advertisers' },
        { name: '02. Capability', val: 'Integrated brand narratives & large ad-spend deployment' },
        { name: '03. Availability', val: 'Fiscal media budget deployment quarters' },
        { name: '04. Assets', val: 'Marketing budgets, retail reach & customer affinity' },
        { name: '05. Needs', val: 'Authentic cultural IP integration & creator alignment' },
        { name: '06. Relationships', val: 'Media agencies, PR houses & studio partnerships' },
        { name: '07. Opportunities', val: 'Pre-production organic product placement' },
        { name: '08. Rights', val: 'Commercial tie-ins, co-branding & image rights' },
        { name: '09. Workflow', val: 'Script clearance, rough cut review & ROI tracking' },
        { name: '10. Intelligence', val: 'Attribution & cultural sentiment resonance' }
      ],
      affinities: ['Creative', 'Platform', 'Television', 'Audience']
    },
    '10': {
      title: 'Audience',
      cat: 'COMMUNITY & CONSUMPTION DOMAIN',
      desc: 'Audiences, fan communities, fandoms, gaming clans, subscribers, theatregoers, and regional niche cultures.',
      dims: [
        { name: '01. Identity', val: 'Verified consumer communities and superfan cohorts' },
        { name: '02. Capability', val: 'Grassroots virality, crowd-supported box office' },
        { name: '03. Availability', val: 'Prime leisure, weekend & holiday consumption' },
        { name: '04. Assets', val: 'Attention, subscription capital & social engagement' },
        { name: '05. Needs', val: 'Compelling stories, interactive experiences & merchandise' },
        { name: '06. Relationships', val: 'Creator fan clubs, Reddit communities & Discord servers' },
        { name: '07. Opportunities', val: 'Early screening feedback & co-creation' },
        { name: '08. Rights', val: 'User-generated content licenses & privacy protections' },
        { name: '09. Workflow', val: 'Social sharing, ticketing & community discussions' },
        { name: '10. Intelligence', val: 'Sentiment momentum & organic demand signals' }
      ],
      affinities: ['Creative', 'Brand', 'Platform', 'Live']
    },
    '11': {
      title: 'Representation',
      cat: 'TALENT ADVOCACY & MANAGEMENT DOMAIN',
      desc: 'Talent agencies, artist managers, casting directors, booking agents, entertainment attorneys, career advisors, and publicists.',
      dims: [
        { name: '01. Identity', val: 'ATA, PMA & guild-affiliated talent agencies' },
        { name: '02. Capability', val: 'Talent packaging, contract negotiation & career strategy' },
        { name: '03. Availability', val: 'Continuous client mandate tracking' },
        { name: '04. Assets', val: 'Elite talent rosters & deep industry relationships' },
        { name: '05. Needs', val: 'High-caliber project attachments & brand endorsements' },
        { name: '06. Relationships', val: 'Direct access to studio heads, producers & buyers' },
        { name: '07. Opportunities', val: 'Multi-hyphenate packaging & equity participations' },
        { name: '08. Rights', val: 'Agency agreements, representation exclusivity' },
        { name: '09. Workflow', val: 'Audition self-tapes, contract drafting & settlements' },
        { name: '10. Intelligence', val: 'Talent market value & quoting intelligence' }
      ],
      affinities: ['Creative', 'Production', 'Brand', 'Rights']
    },
    '12': {
      title: 'Growth',
      cat: 'MARKETING & PUBLICITY DOMAIN',
      desc: 'PR firms, digital marketing agencies, SEO, trailer houses, campaign managers, fan engagement teams, and reputation managers.',
      dims: [
        { name: '01. Identity', val: 'Entertainment marketing & PR agencies' },
        { name: '02. Capability', val: 'Key art, viral trailer cuts, red carpet junkets' },
        { name: '03. Availability', val: 'Launch sprint & theatrical release windows' },
        { name: '04. Assets', val: 'Proprietary press networks & influencer contacts' },
        { name: '05. Needs', val: 'Exclusive film assets, actor access & media spend' },
        { name: '06. Relationships', val: 'Trade press, critics & social media algorithms' },
        { name: '07. Opportunities', val: 'Cross-brand guerrilla marketing activations' },
        { name: '08. Rights', val: 'Marketing asset copyright & promotional clearances' },
        { name: '09. Workflow', val: 'Trailer testing, asset delivery & press drops' },
        { name: '10. Intelligence', val: 'Tracking survey metrics & trailer view velocity' }
      ],
      affinities: ['Brand', 'Platform', 'Audience', 'Distribution']
    },
    '13': {
      title: 'Technology',
      cat: 'ENGINEERING & INFRASTRUCTURE DOMAIN',
      desc: 'Streaming tech, CDN, cloud infrastructure, AI/GenAI, recommendation engines, CMS, DAM, DRM, cybersecurity, and virtual production.',
      dims: [
        { name: '01. Identity', val: 'Cloud hyperscalers, SaaS & entertainment tech providers' },
        { name: '02. Capability', val: 'Low-latency video encoding, AI tooling & spatial mocap' },
        { name: '03. Availability', val: '99.99% Cloud SLA & technical integration support' },
        { name: '04. Assets', val: 'Proprietary neural models, edge compute nodes & DAM' },
        { name: '05. Needs', val: 'Studio enterprise adoption & platform integrations' },
        { name: '06. Relationships', val: 'Broadcasters, post houses & streaming networks' },
        { name: '07. Opportunities', val: 'Generative pre-visualization & virtual set pipelines' },
        { name: '08. Rights', val: 'Software IP, patent portfolios & API access tiers' },
        { name: '09. Workflow', val: 'CI/CD pipeline builds, telemetry streaming & cloud sync' },
        { name: '10. Intelligence', val: 'Automated bottleneck detection & performance telemetry' }
      ],
      affinities: ['Infrastructure', 'Production', 'Platform', 'Rights']
    },
    '14': {
      title: 'Capital',
      cat: 'FINANCE & INVESTMENT DOMAIN',
      desc: 'Banks, NBFCs, fintech, venture capital, private equity, family offices, film financiers, completion bonders, and insurance underwriters.',
      dims: [
        { name: '01. Identity', val: 'Accredited film funds, debt lenders & slate equity' },
        { name: '02. Capability', val: 'Senior debt, mezzanine finance, tax credit discounting' },
        { name: '03. Availability', val: 'Fund allocation cycles & annual capital calls' },
        { name: '04. Assets', val: 'Deployable capital reserves & completion bond lines' },
        { name: '05. Needs', val: 'De-risked packaged slates with guaranteed distribution' },
        { name: '06. Relationships', val: 'Financiers, legal counsels & escrow agents' },
        { name: '07. Opportunities', val: 'Multi-party risk sharing & recoupment waterfall optimization' },
        { name: '08. Rights', val: 'First-lien security interests, revenue collection agreements' },
        { name: '09. Workflow', val: 'Escrow disbursements, milestone audits & CAMA' },
        { name: '10. Intelligence', val: 'Portfolio IRR modeling & counterparty risk scoring' }
      ],
      affinities: ['Production', 'Rights', 'Distribution', 'Platform']
    },
    '15': {
      title: 'Rights',
      cat: 'IP & LEGAL ARCHITECTURE DOMAIN',
      desc: 'IP owners, copyright lawyers, trademark attorneys, licensing agencies, rights aggregators, royalty administrators, and anti-piracy firms.',
      dims: [
        { name: '01. Identity', val: 'Copyright attorneys, IP owners & rights registries' },
        { name: '02. Capability', val: 'Chain of title auditing, multi-territory clearance' },
        { name: '03. Availability', val: 'Active licensing windows & secondary rights terms' },
        { name: '04. Assets', val: 'Literary IP, remake rights & character trademarks' },
        { name: '05. Needs', val: 'Monetization partners, adaptation producers & licensees' },
        { name: '06. Relationships', val: 'Publishers, estates, studios & collection societies' },
        { name: '07. Opportunities', val: 'Dormant remake discovery & foreign territory monetization' },
        { name: '08. Rights', val: 'Theatrical, digital, publishing, gaming & merchandise rights' },
        { name: '09. Workflow', val: 'Chain of title verification & royalty waterfall management' },
        { name: '10. Intelligence', val: 'Rights expiration alerts & licensing opportunity detection' }
      ],
      affinities: ['Creative', 'Capital', 'Distribution', 'Platform']
    },
    '16': {
      title: 'Regulatory',
      cat: 'GOVERNANCE & COMPLIANCE DOMAIN',
      desc: 'Film certification boards, broadcasting authorities, copyright offices, tax authorities, film commissions, and municipal police/fire.',
      dims: [
        { name: '01. Identity', val: 'State film commissions, censorship boards & tax bodies' },
        { name: '02. Capability', val: 'Permit approvals, age rating certification, tax rebates' },
        { name: '03. Availability', val: 'Official statutory review & permit filing calendars' },
        { name: '04. Assets', val: 'Location incentive schemes & public land permissions' },
        { name: '05. Needs', val: 'Compliance filings, local crew hiring quotas & safety audits' },
        { name: '06. Relationships', val: 'Local government bodies, unions & legal counsel' },
        { name: '07. Opportunities', val: 'Maximizing regional tax credit optimization (up to 40%)' },
        { name: '08. Rights', val: 'Statutory exhibition certificates & filming permits' },
        { name: '09. Workflow', val: 'Permit application workflows & certified expenditure audits' },
        { name: '10. Intelligence', val: 'Regulatory policy changes & incentive shifts tracking' }
      ],
      affinities: ['Production Management', 'Infrastructure', 'Capital', 'Operational']
    },
    '17': {
      title: 'Operational',
      cat: 'SUPPORT & SERVICE LOGISTICS DOMAIN',
      desc: 'Catering, unit transportation, drivers, security, cleaning, hospitality, hotels, costume suppliers, props, set suppliers, and printing.',
      dims: [
        { name: '01. Identity', val: 'Vetted set logistics, equipment & hospitality suppliers' },
        { name: '02. Capability', val: 'Mass unit catering, convoy logistics & 24/7 set security' },
        { name: '03. Availability', val: '24/7 On-demand production call readiness' },
        { name: '04. Assets', val: 'Mobile kitchen trucks, honeywagons & prop warehouses' },
        { name: '05. Needs', val: 'Confirmed long-term shoot schedules & purchase orders' },
        { name: '06. Relationships', val: 'Line producers, unit production managers & local vendors' },
        { name: '07. Opportunities', val: 'Multi-production bulk equipment & hotel rate leverage' },
        { name: '08. Rights', val: 'Commercial vendor agreements & insurance certificates' },
        { name: '09. Workflow', val: 'Daily dispatch, equipment check-in/out & meal count logs' },
        { name: '10. Intelligence', val: 'Supply-chain availability & price index modeling' }
      ],
      affinities: ['Production Management', 'Infrastructure', 'Live', 'Production']
    },
    '18': {
      title: 'Live',
      cat: 'EVENTS & EXPERIENTIAL DOMAIN',
      desc: 'Event producers, concert promoters, festival organizers, award shows, exhibitions, arenas, convention centers, and stage crews.',
      dims: [
        { name: '01. Identity', val: 'Live event promoters, festival organizers & arena operators' },
        { name: '02. Capability', val: 'Stadium tours, multi-day festivals & broadcast award shows' },
        { name: '03. Availability', val: 'Seasonal festival dates & tour itinerary stops' },
        { name: '04. Assets', val: 'Arena venues, concert sound/lighting rigs & ticketing engines' },
        { name: '05. Needs', val: 'Headline talent bookings, brand sponsorships & crowd security' },
        { name: '06. Relationships', val: 'Booking agents, city councils & ticket aggregators' },
        { name: '07. Opportunities', val: 'Hybrid virtual/live broadcast event extensions' },
        { name: '08. Rights', val: 'Live performance rights, merchandising & broadcast recording' },
        { name: '09. Workflow', val: 'Stage rigging, soundchecks & crowd flow management' },
        { name: '10. Intelligence', val: 'Real-time ticket sellout curves & attendance tracking' }
      ],
      affinities: ['Music', 'Brand', 'Audience', 'Operational']
    },
    '19': {
      title: 'Learning',
      cat: 'EDUCATION & WORKFORCE DOMAIN',
      desc: 'Film schools, acting institutes, dance/music conservatories, animation/VFX academies, masterclasses, and apprentice programs.',
      dims: [
        { name: '01. Identity', val: 'Accredited film conservatories & vocational arts colleges' },
        { name: '02. Capability', val: 'Professional craft training, mentoring & skill certification' },
        { name: '03. Availability', val: 'Annual academic semesters & summer masterclass cohorts' },
        { name: '04. Assets', val: 'Training studios, student film catalogs & equipment labs' },
        { name: '05. Needs', val: 'Industry placement pipelines, guest faculty & apprenticeships' },
        { name: '06. Relationships', val: 'Studios, guild alumni & creative directors' },
        { name: '07. Opportunities', val: 'Emerging talent incubation & thesis film financing' },
        { name: '08. Rights', val: 'Educational IP, student work licensing & training rights' },
        { name: '09. Workflow', val: 'Curriculum delivery, portfolio reviews & showcase screenings' },
        { name: '10. Intelligence', val: 'Industry skill shortage & craft demand mapping' }
      ],
      affinities: ['Creative', 'Production', 'Technology', 'Representation']
    },
    '20': {
      title: 'Ecosystem Intelligence',
      cat: 'RESEARCH & METRICS DOMAIN',
      desc: 'Consultants, researchers, trade analysts, publications, critics, review aggregators, awards academies, and accessibility providers.',
      dims: [
        { name: '01. Identity', val: 'Trade publications, research firms & academy voting bodies' },
        { name: '02. Capability', val: 'Macroeconomic market analysis, critical review aggregation' },
        { name: '03. Availability', val: 'Continuous weekly publishing & annual award seasons' },
        { name: '04. Assets', val: 'Historical box office databases & cultural trend indices' },
        { name: '05. Needs', val: 'Verified platform streaming telemetry & production stats' },
        { name: '06. Relationships', val: 'Studio executives, festival directors & journalists' },
        { name: '07. Opportunities', val: 'Macro ecosystem utilization & friction reduction benchmarking' },
        { name: '08. Rights', val: 'Editorial copyrights, trademarked award logos & database rights' },
        { name: '09. Workflow', val: 'Data aggregation, survey sampling & research publication' },
        { name: '10. Intelligence', val: 'Long-term predictive modeling & ecosystem sentiment tracking' }
      ],
      affinities: ['Capital', 'Distribution', 'Platform', 'Regulatory']
    }
  };

  function openDomainInspector(nodeId, nodeTitle, nodeDesc, nodeCat) {
    initAudio();
    playUiTone(740, 'triangle', 0.15, 0.05);

    const details = domainDetails[nodeId] || {
      title: nodeTitle,
      cat: nodeCat || 'ENTERTAINMENT ECOSYSTEM DOMAIN',
      desc: nodeDesc,
      dims: [
        { name: '01. Identity', val: 'Verified Entity Node' },
        { name: '02. Capability', val: 'Specialized Domain Competency' },
        { name: '03. Availability', val: 'Live Operational Windows' },
        { name: '04. Assets', val: 'Hardware, Catalog & IP Resources' },
        { name: '05. Needs', val: 'Complementary Node Pairing' },
        { name: '06. Relationships', val: 'Active DigiSynq Mesh Links' },
        { name: '07. Opportunities', val: 'Latent Value Activation' },
        { name: '08. Rights', val: 'Jurisdictional Clearances' },
        { name: '09. Workflow', val: 'Synchronized Milestones' },
        { name: '10. Intelligence', val: 'Continuous Telemetry Ingestion' }
      ],
      affinities: ['Creative', 'Production', 'Capital', 'Platforms', 'Audience']
    };

    if (inspDomainId) inspDomainId.textContent = `DOMAIN ${nodeId}`;
    if (inspDomainCategory) inspDomainCategory.textContent = details.cat;
    if (inspDomainTitle) inspDomainTitle.textContent = details.title;
    if (inspDomainDesc) inspDomainDesc.textContent = details.desc;

    if (inspDimensionsGrid) {
      inspDimensionsGrid.innerHTML = details.dims
        .map(d => `<div class="dim-card"><span class="dim-name">${d.name}</span><span class="dim-val">${d.val}</span></div>`)
        .join('');
    }

    if (inspAffinityList) {
      inspAffinityList.innerHTML = details.affinities
        .map(a => `<span class="affinity-chip">↔ ${a}</span>`)
        .join('');
    }

    if (domainInspectorModal) {
      domainInspectorModal.classList.add('open');
      domainInspectorModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeDomainInspector() {
    if (domainInspectorModal) {
      domainInspectorModal.classList.remove('open');
      domainInspectorModal.setAttribute('aria-hidden', 'true');
    }
  }

  nodeCards.forEach(card => {
    card.addEventListener('click', () => {
      const nodeId = card.getAttribute('data-node') || '01';
      const titleEl = card.querySelector('.node-title');
      const descEl = card.querySelector('.node-desc');
      const cat = card.getAttribute('data-category');

      openDomainInspector(
        nodeId,
        titleEl ? titleEl.textContent : 'Domain',
        descEl ? descEl.textContent : '',
        cat
      );
    });
  });

  if (btnCloseInspector) {
    btnCloseInspector.addEventListener('click', closeDomainInspector);
  }

  if (domainInspectorModal) {
    domainInspectorModal.addEventListener('click', e => {
      if (e.target === domainInspectorModal) {
        closeDomainInspector();
      }
    });
  }

  // ========================================================================
  // 15. COMMAND PALETTE (CMD+K / CTRL+K) SEARCH ENGINE
  // ========================================================================
  const cmdPaletteModal = document.getElementById('cmdPaletteModal');
  const btnOpenCmd = document.getElementById('btnOpenCommandPalette');
  const cmdInput = document.getElementById('cmdInput');
  const cmdResultsList = document.getElementById('cmdResultsList');

  const searchableItems = [
    // Core Sections
    { type: 'section', badge: 'SECTION', title: '01 // The Strategic Premise', desc: 'The fundamental thesis and ecosystem transformation.', target: '#the-idea' },
    { type: 'section', badge: 'SECTION', title: '03 // The 11 Guiding Principles', desc: 'The fundamental DigiSynq philosophy.', target: '#philosophy' },
    { type: 'section', badge: 'SECTION', title: '04 // The 12-Step Living Flow', desc: 'Map to Learn master operating flow.', target: '#system' },
    { type: 'section', badge: 'SECTION', title: '05 // 20 Node Domains & 10 Dimensions', desc: 'Ontology, living graph, and ecosystem taxonomy.', target: '#network' },
    { type: 'section', badge: 'SECTION', title: '06 // System Mechanics & Opportunity Graph', desc: 'Idle capacity, dependency trees & opportunity simulator.', target: '#mechanism' },
    { type: 'section', badge: 'SECTION', title: '07 // Trust & Live Monitoring', desc: 'Multilateral trust signals & traffic-light project telemetry.', target: '#trust-monitoring' },
    { type: 'section', badge: 'SECTION', title: '08 // Operational Scenarios', desc: 'Project Alpha, Idle Studio, Unused IP, Brand + Creator.', target: '#scenarios' },
    { type: 'section', badge: 'SECTION', title: '09 // 13 Product Modules & Architecture', desc: 'Modular platform suite, data anatomy & execution pipeline.', target: '#platform-suite' },
    { type: 'section', badge: 'SECTION', title: '10 // Business Model & 7 Moats', desc: '9 revenue streams, 7 defensibility moats & flywheel.', target: '#business-model' },
    { type: 'section', badge: 'SECTION', title: '11 // Position & Value Matrix', desc: 'The Space, 10 value systems, 4 levels & 9 stakeholders.', target: '#position' },
    { type: 'section', badge: 'SECTION', title: '12 // The DigiSynq Manifesto', desc: 'Poetic manifesto, final definitions & one-line axioms.', target: '#manifesto' },
    { type: 'section', badge: 'SECTION', title: '13 // Start a Strategic Conversation', desc: 'Engage the network with a coordination challenge.', target: '#strategic-conversation' },

    // The 5 Core Engines
    { type: 'engine', badge: 'ENGINE', title: 'Network Engine', desc: 'Dynamic maps of active nodes and availability across domains.', target: '#platform-suite' },
    { type: 'engine', badge: 'ENGINE', title: 'Opportunity Engine', desc: 'Simulates cross-domain combinations and idle capacity matches.', target: '#platform-suite' },
    { type: 'engine', badge: 'ENGINE', title: 'Coordination Engine', desc: 'Aligns schedules, approval chains, and dependencies.', target: '#platform-suite' },
    { type: 'engine', badge: 'ENGINE', title: 'Intelligence Engine', desc: 'Predictive signals, risk modeling, and market recommendations.', target: '#platform-suite' },
    { type: 'engine', badge: 'ENGINE', title: 'Value Engine', desc: 'Tracks utilization lift, time compression, and EVC alpha.', target: '#platform-suite' },

    // The 13 Platform Modules
    { type: 'module', badge: 'MODULE', title: 'MOD-01 DigiSynq Network', desc: 'Global ecosystem graph topology and node directory.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-02 DigiSynq Node', desc: 'Verified identity, guild compliance, and reputation index.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-03 DigiSynq Profile', desc: 'Dynamic capability vectors and active need mandates.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-04 DigiSynq Graph', desc: 'Multi-dimensional relationship mapping and collaborator edges.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-05 DigiSynq Discover', desc: 'Multi-attribute query engine searching capacity and talent.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-06 DigiSynq Match', desc: 'High-affinity algorithmic pairing between needs and capabilities.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-07 DigiSynq Opportunity', desc: 'Continuous simulation engine surfacing latent combinations.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-08 DigiSynq Sync', desc: 'Automated dependency synchronization preventing schedule drift.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-09 DigiSynq Collab', desc: 'Secure multi-stakeholder project chambers.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-10 DigiSynq Monitor', desc: 'Real-time traffic-light health tracking (Green/Yellow/Red).', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-11 DigiSynq Rights', desc: 'Multi-territorial chain of title and secondary licensing.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-12 DigiSynq Intel', desc: 'Predictive analytics, demand telemetry, and risk models.', target: '#platform-suite' },
    { type: 'module', badge: 'MODULE', title: 'MOD-13 DigiSynq Value', desc: 'Quantitative EVC attribution and leakage reduction auditing.', target: '#platform-suite' },

    // The 20 Node Domains
    { type: 'domain', badge: 'DOMAIN 01', title: '01 Creative Nodes', desc: 'Actors, directors, writers, composers, creators, animators.', target: '#network', domainId: '01' },
    { type: 'domain', badge: 'DOMAIN 02', title: '02 Production Nodes', desc: 'Film & TV production houses, OTT studios, animation & VFX.', target: '#network', domainId: '02' },
    { type: 'domain', badge: 'DOMAIN 03', title: '03 Production Management Nodes', desc: 'Producers, line producers, managers, accountants, location heads.', target: '#network', domainId: '03' },
    { type: 'domain', badge: 'DOMAIN 04', title: '04 Infrastructure Nodes', desc: 'Studios, sound stages, virtual production, rental packages.', target: '#network', domainId: '04' },
    { type: 'domain', badge: 'DOMAIN 05', title: '05 Distribution Nodes', desc: 'Theatrical cinema chains, exhibitors, syndicators, sales.', target: '#network', domainId: '05' },
    { type: 'domain', badge: 'DOMAIN 06', title: '06 Platform Nodes', desc: 'Streaming, OTT, YouTube, short-video, podcasts, FAST channels.', target: '#network', domainId: '06' },
    { type: 'domain', badge: 'DOMAIN 07', title: '07 Television Nodes', desc: 'Broadcasters, linear networks, daily shows, reality series.', target: '#network', domainId: '07' },
    { type: 'domain', badge: 'DOMAIN 08', title: '08 Music Nodes', desc: 'Record labels, publishers, artists, composers, sync licensing.', target: '#network', domainId: '08' },
    { type: 'domain', badge: 'DOMAIN 09', title: '09 Brand Nodes', desc: 'Advertisers, agencies, sponsorships, product placement.', target: '#network', domainId: '09' },
    { type: 'domain', badge: 'DOMAIN 10', title: '10 Audience Nodes', desc: 'Fans, communities, subscribers, niche regional audiences.', target: '#network', domainId: '10' },
    { type: 'domain', badge: 'DOMAIN 11', title: '11 Representation Nodes', desc: 'Talent agencies, managers, casting, booking agents, legal.', target: '#network', domainId: '11' },
    { type: 'domain', badge: 'DOMAIN 12', title: '12 Growth Nodes', desc: 'PR, digital marketing, trailer promotion, fan engagement.', target: '#network', domainId: '12' },
    { type: 'domain', badge: 'DOMAIN 13', title: '13 Technology Nodes', desc: 'Cloud, AI, CDN, recommendation engines, DRM, virtual production.', target: '#network', domainId: '13' },
    { type: 'domain', badge: 'DOMAIN 14', title: '14 Capital Nodes', desc: 'Financiers, banks, VC/PE, completion bonds, insurance, slate debt.', target: '#network', domainId: '14' },
    { type: 'domain', badge: 'DOMAIN 15', title: '15 Rights Nodes', desc: 'IP owners, copyright lawyers, licensing agencies, anti-piracy.', target: '#network', domainId: '15' },
    { type: 'domain', badge: 'DOMAIN 16', title: '16 Regulatory Nodes', desc: 'Film certification, commissions, tax rebates, police & municipal.', target: '#network', domainId: '16' },
    { type: 'domain', badge: 'DOMAIN 17', title: '17 Operational Nodes', desc: 'Catering, transport, security, props, costumes, logistics.', target: '#network', domainId: '17' },
    { type: 'domain', badge: 'DOMAIN 18', title: '18 Live Nodes', desc: 'Event producers, festivals, arena venues, ticketing, live crews.', target: '#network', domainId: '18' },
    { type: 'domain', badge: 'DOMAIN 19', title: '19 Learning Nodes', desc: 'Film schools, conservatories, masterclasses, apprenticeships.', target: '#network', domainId: '19' },
    { type: 'domain', badge: 'DOMAIN 20', title: '20 Ecosystem Intelligence Nodes', desc: 'Consultants, researchers, trade analysts, critics, awards.', target: '#network', domainId: '20' }
  ];

  let selectedCmdIdx = 0;

  function renderCmdResults(query = '') {
    const q = query.toLowerCase().trim();
    const filtered = q
      ? searchableItems.filter(item => item.title.toLowerCase().includes(q) || item.badge.toLowerCase().includes(q))
      : searchableItems;

    selectedCmdIdx = 0;

    if (filtered.length === 0) {
      cmdResultsList.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-tertiary); font-size: 13px;">No matching ecosystem nodes or sections found.</div>`;
      return;
    }

    cmdResultsList.innerHTML = filtered
      .map((item, idx) => `
        <a class="cmd-item ${idx === 0 ? 'selected' : ''}" data-target="${item.target}" data-node="${item.nodeId || item.domainId || ''}" href="${item.target}">
          <div class="cmd-item-left">
            <span class="cmd-item-badge badge-${item.type}">${item.badge}</span>
            <span class="cmd-item-title">${item.title}</span>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
      `)
      .join('');

    const items = cmdResultsList.querySelectorAll('.cmd-item');
    items.forEach((itemEl, idx) => {
      itemEl.addEventListener('click', e => {
        e.preventDefault();
        executeCmdItem(itemEl);
      });
      itemEl.addEventListener('mouseenter', () => {
        items.forEach(i => i.classList.remove('selected'));
        itemEl.classList.add('selected');
        selectedCmdIdx = idx;
      });
    });
  }

  function executeCmdItem(itemEl) {
    const target = itemEl.getAttribute('data-target');
    const nodeId = itemEl.getAttribute('data-node');
    closeCmdPalette();

    if (nodeId) {
      setTimeout(() => {
        const card = document.querySelector(`.node-card[data-node="${nodeId}"]`);
        if (card) {
          card.click();
        }
      }, 100);
    } else if (target) {
      const dest = document.querySelector(target);
      if (dest) {
        dest.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  function openCmdPalette() {
    initAudio();
    playUiTone(620, 'sine', 0.1, 0.05);
    cmdPaletteModal.classList.add('open');
    cmdPaletteModal.setAttribute('aria-hidden', 'false');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    renderCmdResults('');
  }

  function closeCmdPalette() {
    cmdPaletteModal.classList.remove('open');
    cmdPaletteModal.setAttribute('aria-hidden', 'true');
  }

  if (btnOpenCmd) {
    btnOpenCmd.addEventListener('click', openCmdPalette);
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', e => {
      renderCmdResults(e.target.value);
    });

    cmdInput.addEventListener('keydown', e => {
      const items = cmdResultsList.querySelectorAll('.cmd-item');
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCmdIdx = (selectedCmdIdx + 1) % items.length;
        items.forEach((item, i) => item.classList.toggle('selected', i === selectedCmdIdx));
        items[selectedCmdIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCmdIdx = (selectedCmdIdx - 1 + items.length) % items.length;
        items.forEach((item, i) => item.classList.toggle('selected', i === selectedCmdIdx));
        items[selectedCmdIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (items[selectedCmdIdx]) {
          executeCmdItem(items[selectedCmdIdx]);
        }
      }
    });
  }

  if (cmdPaletteModal) {
    cmdPaletteModal.addEventListener('click', e => {
      if (e.target === cmdPaletteModal) {
        closeCmdPalette();
      }
    });
  }

  // Keyboard shortcut: Cmd+K / Ctrl+K & ESC
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPaletteModal.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    } else if (e.key === 'Escape') {
      closeCmdPalette();
      closeDomainInspector();
    }
  });

  // ========================================================================
  // 12. REFERENCE 1 & 4: 3D STACKED FROSTED GLASS CARDS CONTROLLER
  // ========================================================================
  const stackedDeck = document.getElementById('stackedDeck');
  const deckContainer = document.getElementById('heroStackedDeckContainer');
  const deckCards = stackedDeck ? Array.from(stackedDeck.querySelectorAll('.deck-card')) : [];
  const btnNextDeck = document.getElementById('btnNextDeckCard');
  const btnPrevDeck = document.getElementById('btnPrevDeckCard');
  const btnShuffleDeck = document.getElementById('btnShuffleDeck');
  const deckActiveLabel = document.getElementById('deckActiveLabel');

  let deckOrder = [0, 1, 2, 3];

  const cardLabels = [
    '01 / 04 // OPPORTUNITY ENGINE',
    '02 / 04 // UNIVERSAL RIGHTS VAULT',
    '03 / 04 // VIRTUAL STAGES & RIGS',
    '04 / 04 // SYNDICATED CAPITAL MESH'
  ];

  function applyDeckPositions() {
    deckCards.forEach((card, originalIdx) => {
      const currentPos = deckOrder.indexOf(originalIdx);
      card.className = `deck-card deck-card-${currentPos}`;
      if (currentPos === 0) {
        card.classList.add('active');
      }
    });

    if (deckActiveLabel) {
      const topIdx = deckOrder[0];
      deckActiveLabel.textContent = cardLabels[topIdx] || `01 / 04 // ECOSYSTEM LAYER`;
    }
  }

  function advanceDeck(direction = 1) {
    initAudio();
    playUiTone(540 + direction * 60, 'sine', 0.08, 0.04);
    if (direction === 1) {
      const front = deckOrder.shift();
      deckOrder.push(front);
    } else {
      const back = deckOrder.pop();
      deckOrder.unshift(back);
    }
    applyDeckPositions();
  }

  function bringCardToFront(cardIdx) {
    initAudio();
    playUiTone(620, 'sine', 0.09, 0.05);
    const pos = deckOrder.indexOf(cardIdx);
    if (pos > 0) {
      for (let i = 0; i < pos; i++) {
        deckOrder.push(deckOrder.shift());
      }
      applyDeckPositions();
    }
  }

  if (btnNextDeck) {
    btnNextDeck.addEventListener('click', e => {
      e.stopPropagation();
      advanceDeck(1);
    });
  }

  if (btnPrevDeck) {
    btnPrevDeck.addEventListener('click', e => {
      e.stopPropagation();
      advanceDeck(-1);
    });
  }

  if (btnShuffleDeck) {
    btnShuffleDeck.addEventListener('click', e => {
      e.stopPropagation();
      initAudio();
      playUiTone(720, 'sine', 0.12, 0.06);
      // Random shuffle that ensures top card changes
      const currentTop = deckOrder[0];
      let remaining = deckOrder.filter(x => x !== currentTop);
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      deckOrder = [remaining[0], currentTop, ...remaining.slice(1)];
      applyDeckPositions();
    });
  }

  deckCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      bringCardToFront(idx);
    });
  });

  // Dynamic 3D perspective mouse tracking on hero deck
  if (deckContainer && stackedDeck) {
    deckContainer.addEventListener('mousemove', e => {
      const rect = deckContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 14;
      const rotateY = (x / rect.width) * 16;
      stackedDeck.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    deckContainer.addEventListener('mouseleave', () => {
      stackedDeck.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  // ========================================================================
  // AUTOMATIC BACKGROUND LUMINANCE & CONTRAST ADAPTER
  // Automatically detects element background luminance and adapts text color
  // ========================================================================
  function parseRgb(colorStr) {
    if (!colorStr) return null;
    const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return null;
    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
  }

  function getLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  function adaptContrastToBackground() {
    const cardsAndSurfaces = document.querySelectorAll(
      '.glass-card, .feature-card, .scenario-card, .stat-card, .deck-card, .system-card, .modal-card, .badge, .tag, [class*="card"], [class*="surface"], .nav-pill, .btn'
    );
    cardsAndSurfaces.forEach(el => {
      const style = window.getComputedStyle(el);
      const bg = style.backgroundColor;
      if (bg && bg !== 'transparent' && !bg.includes('rgba(0, 0, 0, 0)')) {
        const rgb = parseRgb(bg);
        if (rgb) {
          const lum = getLuminance(rgb.r, rgb.g, rgb.b);
          if (lum > 0.48) {
            el.setAttribute('data-surface', 'light');
            el.classList.add('surface-light');
            el.classList.remove('surface-dark');
          } else {
            el.setAttribute('data-surface', 'dark');
            el.classList.add('surface-dark');
            el.classList.remove('surface-light');
          }
        }
      }
    });
  }

  // Initial execution & debounced observer
  adaptContrastToBackground();
  window.addEventListener('resize', adaptContrastToBackground);
});

