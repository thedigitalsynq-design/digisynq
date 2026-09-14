/**
 * DIGISYNQ — MASTER SYSTEM LOGIC & INTERACTIVITY
 * The Entertainment Ecosystem, Synchronized
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroNetworkCanvas();
  initMechanismTracker();
  initDomainFiltersAndSearch();
  initScenarioSwitcher();
  initStrategicIntake();
  initScrollSpyAndHeader();
  initMobileMenu();
  initBackToTop();
  initDropdownInteractivity();
  initBentoAnimations();
});

/* ==========================================================================
   01. HERO NETWORK CANVAS (LIVING ECOSYSTEM GRAPH WITH DPR SCALING)
   ========================================================================== */

function initHeroNetworkCanvas() {
  const canvas = document.getElementById('heroNetworkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let width = window.innerWidth;
  let height = window.innerHeight;

  function setCanvasSize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  setCanvasSize();

  let mouse = { x: -1000, y: -1000, radius: 180 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('resize', () => {
    setCanvasSize();
    initNodes();
  });

  const nodeLabels = [
    'Talent Node', 'Studio Lot', 'IP Rights', 'Slate Capital', 'FAST Platform',
    'VFX Render', 'Acoustic Stage', 'SVOD Buyer', 'Soundtrack Lab', 'Guild Legal',
    'Virtual Volume', 'Fandom Cohort', 'Broadcaster', 'Tax Rebate', 'Camera Fleet'
  ];

  let nodes = [];

  function initNodes() {
    nodes = [];
    const count = Math.min(Math.floor(width / 45), 36);
    for (let i = 0; i < count; i++) {
      const label = nodeLabels[i % nodeLabels.length];
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 2.5,
        label: label,
        isHub: i % 4 === 0,
        alpha: Math.random() * 0.4 + 0.35
      });
    }
  }

  initNodes();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 180;

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];

      // Movement
      n.x += n.vx;
      n.y += n.vy;

      // Bounce off walls
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Gentle mouse interaction
      const mdx = n.x - mouse.x;
      const mdy = n.y - mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < mouse.radius) {
        const force = (mouse.radius - mdist) / mouse.radius;
        n.x += (mdx / mdist) * force * 1.5;
        n.y += (mdy / mdist) * force * 1.5;
      }

      // Draw node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = n.isHub ? '#38bdf8' : 'rgba(125, 211, 252, 0.75)';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = n.isHub ? 12 : 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw node label on larger nodes
      if (n.isHub && width > 768) {
        ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = 'rgba(192, 211, 220, 0.65)';
        ctx.fillText(n.label, n.x + 8, n.y + 3);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   02. THE 12-STEP COORDINATION MECHANISM (TABS, KEYBOARD & AUTO-SCROLL)
   ========================================================================== */

function initMechanismTracker() {
  const stepsData = {
    1: {
      title: '01. MAP: Node Ontology & Profiling',
      desc: 'Ingests and indexes fragmented entertainment nodes across 10 structured dimensions including verified identity, capacity calendar, guild standing, track record, and compliance.',
      input: 'Verified identity, availability calendars, asset registries, union certifications.',
      output: 'Structured ecosystem graph presence with live readiness and verification score.'
    },
    2: {
      title: '02. DISCOVER: Semantic & Capability Search',
      desc: 'Enables high-resolution discovery across previously opaque silos, matching complex multi-disciplinary requirements with precision parameters.',
      input: 'Natural-language queries, technical project briefs, resource constraints.',
      output: 'Instant ranked shortlist of candidate nodes meeting exact threshold criteria.'
    },
    3: {
      title: '03. CONNECT: Protocol & Handshake',
      desc: 'Establishes secure, authenticated communication channels between disparate stakeholders with standardized non-disclosure and credential exchange.',
      input: 'Mutual connection request, cryptographic identity verification.',
      output: 'Active handshake protocol with encrypted communication channel.'
    },
    4: {
      title: '04. MATCH: Algorithmic Fit & Compatibility',
      desc: 'Evaluates mutual fit across creative vision, commercial parameters, guild compliance, scheduling overlap, and bonding qualifications.',
      input: 'Project budget model, timeline bounds, creative parameters, jurisdiction rules.',
      output: 'Compatibility index score and optimized multi-node pairing recommendations.'
    },
    5: {
      title: '05. COORDINATE: Dependency Sequencing',
      desc: 'Maps multi-stakeholder dependencies, aligning talent contracts, studio availability, and financing tranches into a synchronized critical path.',
      input: 'Multi-party deliverables, milestone triggers, contingency models.',
      output: 'Deterministic project execution graph with automated milestone dependencies.'
    },
    6: {
      title: '06. SYNCHRONIZE: Multi-Node Alignment',
      desc: 'Locks schedules, milestones, and resource allocation across independent production entities to prevent idle latency and costly bottlenecks.',
      input: 'Real-time production calendars, gear availability, travel logistics.',
      output: 'Unified synchronized operational timeline with automated alert triggers.'
    },
    7: {
      title: '07. COLLABORATE: Workspace & Workflow',
      desc: 'Provides unified operational surfaces where cross-domain teams review assets, verify dailies, approve contract modifications, and track deliverables.',
      input: 'Shared assets, review notes, milestone approvals, contract addenda.',
      output: 'Frictionless execution cadence with single source of project truth.'
    },
    8: {
      title: '08. MONITOR: Real-Time Telemetry',
      desc: 'Tracks project velocity, burn rate, schedule variance, and compliance integrity using live telemetry indicators.',
      input: 'Daily production reports, call sheets, vendor invoices, escrow milestones.',
      output: 'Continuous project health score and early-warning bottleneck detection.'
    },
    9: {
      title: '09. OPTIMIZE: Dynamic Reallocation',
      desc: 'Identifies unexpected delays or weather/logistics disruptions and automatically computes alternate schedules, routing, or substitute nodes.',
      input: 'Disruption signals, delay telemetry, contingency reserves.',
      output: 'Optimized mitigation paths with minimal budget and schedule impact.'
    },
    10: {
      title: '10. LEVERAGE: Cross-Domain Compounding',
      desc: 'Connects completed production assets and derivative rights to secondary revenue streams, brand integrations, and ancillary monetization.',
      input: 'Asset libraries, territory clearance, derivative rights windows.',
      output: 'Multi-window monetization unlock without incremental overhead.'
    },
    11: {
      title: '11. MEASURE: Economic & ROI Audit',
      desc: 'Quantifies total project yield, leakage recaptured, cost-per-minute efficiency, and node performance against benchmark historical data.',
      input: 'Final cost accounts, delivery certificates, revenue reports.',
      output: 'Comprehensive economic audit report with verified ROI benchmarks.'
    },
    12: {
      title: '12. LEARN: Model Refinement & Compounding',
      desc: 'Feeds completed project performance data back into DigiSynq algorithms, improving future matchmaking accuracy and velocity.',
      input: 'Stakeholder satisfaction ratings, milestone delivery performance.',
      output: 'Compounding network intelligence and increased matching precision.'
    }
  };

  const timeline = document.getElementById('mechanismTimeline');
  const stepBtns = Array.from(document.querySelectorAll('.mechanism-step-btn'));
  const titleEl = document.getElementById('mechStepTitle');
  const descEl = document.getElementById('mechStepDesc');
  const inputEl = document.getElementById('mechStepInput');
  const outputEl = document.getElementById('mechStepOutput');

  function selectStep(btn) {
    if (!btn) return;
    stepBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
      b.setAttribute('tabindex', '-1');
    });

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    btn.setAttribute('tabindex', '0');
    btn.focus();

    // Auto-scroll the button into view in the horizontal timeline
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    const stepNum = btn.getAttribute('data-step');
    const data = stepsData[stepNum];

    if (data && titleEl && descEl && inputEl && outputEl) {
      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
      inputEl.textContent = data.input;
      outputEl.textContent = data.output;
    }
  }

  stepBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => selectStep(btn));

    // Keyboard navigation (ArrowLeft, ArrowRight)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const next = stepBtns[(index + 1) % stepBtns.length];
        selectStep(next);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prev = stepBtns[(index - 1 + stepBtns.length) % stepBtns.length];
        selectStep(prev);
      }
    });
  });
}

/* ==========================================================================
   03. THE 20 ENTERTAINMENT NODE DOMAINS (FILTER TABS & REAL-TIME SEARCH)
   ========================================================================== */

function initDomainFiltersAndSearch() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const domainCards = document.querySelectorAll('.domain-card');
  const searchInput = document.getElementById('domainSearchInput');
  const emptyState = document.getElementById('domainEmptyState');

  let activeCategory = 'all';
  let activeSearchQuery = '';

  function applyFilter() {
    let visibleCount = 0;

    domainCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = (!activeSearchQuery || cardText.includes(activeSearchQuery));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        card.style.opacity = '1';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });

    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.add('visible');
      } else {
        emptyState.classList.remove('visible');
      }
    }
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      activeCategory = btn.getAttribute('data-category') || 'all';
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.trim().toLowerCase();
      applyFilter();
    });
  }
}

/* ==========================================================================
   04. OPPORTUNITY SCENARIO SWITCHER (WITH PULSE FEEDBACK)
   ========================================================================== */

function initScenarioSwitcher() {
  const scenarios = {
    1: {
      title: 'Complete Film Project: Script-to-Screen Packaging',
      desc: 'An independent sci-fi feature synchronizes an unbooked LED volume stage in London with idle GPU render clusters in Montreal and unallocated UK tax incentives, compressing packaging and greenlight from 14 months down to 45 days.',
      cycle: '-68%',
      leakage: '$4.2M',
      nodes: '14'
    },
    2: {
      title: 'Idle Studio & Stage Capacity Downtime Optimization',
      desc: 'An 8-week production hiatus on an A-list stage facility is converted into $3.4M in high-margin production yield by dynamically routing a commercial campaign and virtual production test shoot.',
      cycle: '-82%',
      leakage: '$3.4M',
      nodes: '9'
    },
    3: {
      title: 'Dormant Franchise IP & Rights Revival',
      desc: 'A legacy literary estate with unexploited sci-fi rights is algorithmically cross-referenced with a European animation unit, an episodic showrunner, and an SVOD territorial presale window.',
      cycle: '-55%',
      leakage: '$12.8M',
      nodes: '22'
    },
    4: {
      title: 'Brand + Creator Co-Production Pipeline',
      desc: 'A direct-to-consumer lifestyle brand co-funds a narrative docuseries with a creator collective, synchronizing live tour venues, retail shelf placement, and digital streaming release.',
      cycle: '-65%',
      leakage: '$5.8M',
      nodes: '16'
    }
  };

  const scenarioBtns = document.querySelectorAll('.scenario-btn');
  const titleEl = document.getElementById('scenarioTitle');
  const descEl = document.getElementById('scenarioDesc');
  const cycleEl = document.getElementById('scenarioCycle');
  const leakageEl = document.getElementById('scenarioLeakage');
  const nodesEl = document.getElementById('scenarioNodes');

  scenarioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      scenarioBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const id = btn.getAttribute('data-scenario');
      const sc = scenarios[id];

      if (sc && titleEl && descEl && cycleEl && leakageEl && nodesEl) {
        titleEl.textContent = sc.title;
        descEl.textContent = sc.desc;
        cycleEl.textContent = sc.cycle;
        leakageEl.textContent = sc.leakage;
        nodesEl.textContent = sc.nodes;

        // Apply tactile pulse feedback to stats
        [cycleEl, leakageEl, nodesEl].forEach((el) => {
          el.classList.remove('stat-highlight');
          void el.offsetWidth; // Trigger reflow
          el.classList.add('stat-highlight');
        });
      }
    });
  });
}

/* ==========================================================================
   05. STRATEGIC INTAKE FORM (VALIDATION & RESET)
   ========================================================================== */

function initStrategicIntake() {
  // Chip Selectors
  setupChipGroup('#challengeChips .chip-btn', '#challengeTypeInput');
  setupChipGroup('#roleChips .chip-btn', '#stakeholderRoleInput');

  function setupChipGroup(chipSelector, hiddenInputSelector) {
    const chips = document.querySelectorAll(chipSelector);
    const hiddenInput = document.querySelector(hiddenInputSelector);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        if (hiddenInput) {
          hiddenInput.value = chip.getAttribute('data-value');
        }
      });
    });
  }

  // Form Submission and Reset
  const form = document.getElementById('strategicIntakeForm');
  const confirmation = document.getElementById('intakeConfirmation');
  const resetBtn = document.getElementById('btnResetIntake');

  if (form && confirmation) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('intakeEmail');
      if (emailInput && !emailInput.value.includes('@')) {
        alert('Please enter a valid executive email address.');
        emailInput.focus();
        return;
      }

      const nameVal = document.getElementById('intakeName')?.value.trim() || 'Executive Partner';
      const orgVal = document.getElementById('intakeOrg')?.value.trim() || 'your organization';
      const challengeVal = document.getElementById('challengeTypeInput')?.value || 'Ecosystem Coordination';
      const roleVal = document.getElementById('stakeholderRoleInput')?.value || 'Stakeholder';
      const detailsVal = document.getElementById('intakeDetails')?.value.trim() || '';

      const descEl = confirmation.querySelector('.confirm-desc');
      if (descEl) {
        descEl.innerHTML = `Thank you, <strong>${nameVal}</strong>. Your strategic inquiry on behalf of <strong>${orgVal}</strong> (${roleVal}) regarding <strong>${challengeVal}</strong> has been routed to our architectural coordination team. We will review your node profile and respond with an ecosystem synchronization schematic within 24 business hours.`;
      }

      form.style.display = 'none';
      confirmation.classList.add('visible');
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = 'flex';
        confirmation.classList.remove('visible');
      });
    }
  }
}

/* ==========================================================================
   06. SCROLL SPY & STICKY HEADER
   ========================================================================== */

function initScrollSpyAndHeader() {
  const header = document.getElementById('mainHeader');
  const sections = document.querySelectorAll('section[id]');
  const dropdownItems = document.querySelectorAll('.nav-dropdown-item');
  const dropdownContainers = document.querySelectorAll('.nav-item-dropdown');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Header scrolled class
    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll spy for navigation
    let current = '';
    const spyThreshold = scrollPos + 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (spyThreshold >= sectionTop && spyThreshold < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    // Clear active triggers
    dropdownContainers.forEach((container) => {
      const trigger = container.querySelector('.nav-dropdown-trigger');
      if (trigger) trigger.classList.remove('active');
    });
    dropdownItems.forEach((item) => item.classList.remove('active'));

    // Highlight current item and parent dropdown trigger
    if (current) {
      dropdownItems.forEach((item) => {
        if (item.getAttribute('href') === `#${current}`) {
          item.classList.add('active');
          const parentContainer = item.closest('.nav-item-dropdown');
          if (parentContainer) {
            const trigger = parentContainer.querySelector('.nav-dropdown-trigger');
            if (trigger) trigger.classList.add('active');
          }
        }
      });
    }
  });
}

/* ==========================================================================
   07. MOBILE NAVIGATION MENU
   ========================================================================== */

function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      } else {
        drawer.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
      }
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
      });
    });
  }
}

/* ==========================================================================
   08. BACK TO TOP FLOATING BUTTON
   ========================================================================== */

function initBackToTop() {
  const btn = document.getElementById('backToTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   09. ACCESSIBLE DROPDOWN INTERACTIVITY (CLICK, TOUCH & KEYBOARD)
   ========================================================================== */

function initDropdownInteractivity() {
  const dropdowns = document.querySelectorAll('.nav-item-dropdown');

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    const items = dropdown.querySelectorAll('.nav-dropdown-item');

    if (!trigger || !menu) return;

    // Toggle on trigger click (for touch devices and click navigation)
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.contains('open');

      // Close all other dropdowns
      dropdowns.forEach((d) => {
        if (d !== dropdown) {
          d.classList.remove('open');
          const t = d.querySelector('.nav-dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Close when clicking an item
    items.forEach((item) => {
      item.addEventListener('click', () => {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Close all dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        const trigger = dropdown.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove('open');
        const trigger = dropdown.querySelector('.nav-dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
}


/* ==========================================================================
   10. ANIMATED BENTO GRIDS (INTERACTIVE SPOTLIGHT, MAGNETIC 3D TILT & STAGGER)
   ========================================================================== */

function initBentoAnimations() {
  const bentoGridSelectors = [
    '.engines-bento',
    '.business-model-grid',
    '.taglines-bento-grid',
    '.maturity-moat-grid',
    '.equations-grid',
    '.bottlenecks-grid',
    '.principles-grid',
    '.dimensions-grid',
    '.platform-modules-grid'
  ];

  const containers = document.querySelectorAll(bentoGridSelectors.join(', '));
  if (!containers.length) return;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  containers.forEach((container) => {
    // Select all immediate or primary card children
    const cards = container.querySelectorAll(
      '.engine-card, .revenue-card, .tagline-bento-card, .evolution-card, .equation-card, .bottleneck-card, .principle-card, .dimension-card, .module-card, .positioning-card'
    );

    cards.forEach((card, index) => {
      card.classList.add('bento-stagger-ready');
      card.style.setProperty('--bento-idx', index);

      // Mouse tracking for spotlight & 3D tilt (Desktop only)
      if (!isTouchDevice) {
        let rafId = null;

        card.addEventListener('mousemove', (e) => {
          if (rafId) cancelAnimationFrame(rafId);

          rafId = requestAnimationFrame(() => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set spotlight coordinates
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Compute magnetic 3D perspective tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (((y - centerY) / centerY) * -3.2).toFixed(2);
            const rotateY = (((x - centerX) / centerX) * 3.2).toFixed(2);

            card.style.setProperty('--tilt-x', `${rotateX}deg`);
            card.style.setProperty('--tilt-y', `${rotateY}deg`);
            card.style.setProperty('--elevate-y', '-4px');
          });
        });

        card.addEventListener('mouseleave', () => {
          if (rafId) cancelAnimationFrame(rafId);
          card.style.setProperty('--mouse-x', '-1000px');
          card.style.setProperty('--mouse-y', '-1000px');
          card.style.setProperty('--tilt-x', '0deg');
          card.style.setProperty('--tilt-y', '0deg');
          card.style.setProperty('--elevate-y', '0px');
        });
      }
    });
  });

  // IntersectionObserver for Staggered Scroll Reveals
  if ('IntersectionObserver' in window) {
    const bentoObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('bento-in-view');
            const readyCards = entry.target.querySelectorAll('.bento-stagger-ready');
            readyCards.forEach((c) => c.classList.add('is-revealed'));
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    containers.forEach((grid) => bentoObserver.observe(grid));
  } else {
    containers.forEach((grid) => {
      grid.classList.add('bento-in-view');
      grid.querySelectorAll('.bento-stagger-ready').forEach((c) => c.classList.add('is-revealed'));
    });
  }
}
