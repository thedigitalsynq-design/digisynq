/**
 * DIGISYNQ — Master Interactive Engine
 * Liquid Glass UI · Scroll-driven Reveal Animations · Sticky Nav · Performance-First
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollReveal();
  initSmoothScroll();
  initCopyButtons();
  initContactForm();
  initPageTransitionLinks();
});

/* ===========================================================
   STICKY LIQUID GLASS NAVIGATION
   =========================================================== */
function initStickyHeader() {
  const header = document.querySelector('.top-nav');
  if (!header) return;

  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 24);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ===========================================================
   SCROLL-DRIVEN REVEAL ANIMATIONS (IntersectionObserver)
   =========================================================== */
function initScrollReveal() {
  const SELECTOR = [
    '.tlc-prob-sol-card', '.tlc-node-card', '.solution-deep-card', '.pillar-plain-card',
    '.protocol-step-box', '.radar-timeline-box', '.revenue-stream-card', '.paper-deep-card',
    '.workshop-card', '.tlc-partner-card', '.tlc-compare-card', '.tlc-stat-card',
    '.tlc-pedestal-section', '.ins-card', '.subpage-card', '[data-reveal]'
  ].join(', ');

  const targets = document.querySelectorAll(SELECTOR);

  // Add class BEFORE paint with staggered delay
  targets.forEach((el, i) => {
    el.classList.add('reveal-hidden');
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.remove('reveal-hidden');
        el.classList.add('reveal-visible');
        el.addEventListener('transitionend', () => {
          el.style.transitionDelay = '';
          el.style.willChange = 'auto';
        }, { once: true });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ===========================================================
   SUBTLE HERO PARALLAX (RAF-throttled, GPU-only)
   =========================================================== */
function initParallaxHero() {
  const hero = document.querySelector('.ins-hero, .hero-section, .tlc-hero-stage');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 600) {
          hero.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ===========================================================
   SMOOTH SCROLL ANCHORS WITH NAV PILL OFFSET
   =========================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 95;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ===========================================================
   PAGE TRANSITION LINKS (Tactile navigation with quick fade)
   =========================================================== */
function initPageTransitionLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || href.startsWith('http') || href.startsWith('//') ||
        link.getAttribute('target') === '_blank') return;
    
    link.addEventListener('click', (e) => {
      // Allow user command/ctrl clicks for opening new tabs
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      
      e.preventDefault();
      const appCard = document.querySelector('.app-card');
      if (appCard) {
        appCard.style.transition = 'opacity 0.18s cubic-bezier(0.16, 1, 0.3, 1), transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)';
        appCard.style.opacity = '0';
        appCard.style.transform = 'scale(0.995)';
      }
      setTimeout(() => { window.location.href = href; }, 160);
    });
  });
}

/* ===========================================================
   COPY BUTTONS WITH GLASS TOAST
   =========================================================== */
function initCopyButtons() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      try {
        await navigator.clipboard.writeText(text);
        showToast('Copied to clipboard!');
      } catch (err) {
        showToast('Contact: ' + text);
      }
    });
  });
}

function showToast(msg) {
  let toast = document.querySelector('.glass-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'glass-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ===========================================================
   CONTACT FORM QUERY PARAM HANDLER
   =========================================================== */
function initContactForm() {
  const select = document.getElementById('contact-type');
  if (select) {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type');
    if (type) {
      const map = { talent: 'join', join: 'join', capacity: 'capacity', discuss: 'discuss', content: 'content', brand: 'brand', radar: 'radar' };
      if (map[type]) select.value = map[type];
    }
  }

  const form = document.getElementById('main-contact-form');
  if (form) {
    form.addEventListener('submit', () => showToast('Transmitting to SYNQ Operating Desk...'));
  }
}

/* ===========================================================
   HERO COMMAND CONSOLE INTERACTIVE FORMAT SWITCHER
   =========================================================== */
const HERO_FORMATS = [
  {
    tag: "SETUP 01 // FEATURE CINEMA & MOVIES",
    title: "Acoustic Soundstages & Top Cinema Camera Packages",
    desc: "Book certified soundstages and camera packages with zero middleman markups. We match you with vetted cinematographers, gaffers, and sound recordists with 100% escrow protection.",
    specs: ["✓ ARRI ALEXA MINI LF", "✓ 12,000 SQFT SOUNDSTAGE", "✓ 100% ESCROW PROTECTED", "✓ 72H MOVIE DEFENSE"],
    cta: "Start Your Film Brief &rarr;",
    href: "contact.html?type=project",
    sla: "< 48 Hours",
    stages: "14 Stages Available",
    payment: "100% Safe Escrow",
    protocol: "Zero Hidden Markups"
  },
  {
    tag: "SETUP 02 // OTT STREAMING SERIES",
    title: "Long-Term Stage Schedules & Complete Crew Teams",
    desc: "Keep your multi-episode series on track. Lock soundstage schedules, hire experienced unit directors, and guarantee smooth post-production and edit deliveries.",
    specs: ["✓ MULTI-CAMERA RIGS", "✓ 45-DAY STAGE LOCK", "✓ DIRECT POST & EDIT PIPELINE", "✓ CLEAR COPYRIGHT GUARANTEE"],
    cta: "Start Series Production &rarr;",
    href: "contact.html?type=project",
    sla: "< 72 Hours",
    stages: "9 Stages Available",
    payment: "Milestone Escrow",
    protocol: "Turnkey Crew Teams"
  },
  {
    tag: "SETUP 03 // YOUTUBE & DIGITAL CREATORS",
    title: "Flexible Studio Rentals & Fast Crew Booking",
    desc: "Level up your digital shows, sketches, podcasts, and docuseries. Rent soundstages for flexible 1-to-3 day shoots and hire camera operators who are paid the day you wrap.",
    specs: ["✓ 1-DAY STAGE RENTALS", "✓ PRO WIRELESS AUDIO", "✓ SAME-DAY WRAP PAY", "✓ FAST EDIT DISPATCH"],
    cta: "Book Creator Studio &rarr;",
    href: "contact.html?type=project",
    sla: "< 24 Hours",
    stages: "18 Studios Ready",
    payment: "Paid on Wrap Day",
    protocol: "No Long Leases"
  },
  {
    tag: "SETUP 04 // COMMERCIALS & AD AGENCIES",
    title: "48-Hour Turnkey Crew & Stage Setups for Ad Agencies",
    desc: "Ad agencies and brand teams get high-speed Phantom cameras, tabletop stages, and top cinematographers confirmed in 48 hours with single-invoice billing.",
    specs: ["✓ 48H CREW DISPATCH", "✓ PHANTOM HIGH-SPEED", "✓ PRO TABLETOP STAGES", "✓ SINGLE INVOICE BILLING"],
    cta: "Send Commercial Brief &rarr;",
    href: "contact.html?type=project",
    sla: "< 48 Hours",
    stages: "8 Tabletop Stages",
    payment: "Single-Invoice Escrow",
    protocol: "Direct DP Attachment"
  },
  {
    tag: "SETUP 05 // PRACTICAL WORKSHOPS",
    title: "Hands-On Soundstage Workshops & Practical Training",
    desc: "We host practical training on partner soundstages during empty days. Learn cinematography and lighting from industry veterans and get verified for paid shoots.",
    specs: ["✓ REAL SOUNDSTAGE SESSIONS", "✓ ARRI & RED CAMERA RIGS", "✓ VIRTUAL LED STAGES", "✓ PAID CREW VERIFICATION"],
    cta: "See Upcoming Workshops &rarr;",
    href: "workshops.html",
    sla: "Weekly Cohorts",
    stages: "Partner Stages",
    payment: "Transparent Pricing",
    protocol: "On-Set Certification"
  }
];

window.switchHeroFormat = function(index) {
  const f = HERO_FORMATS[index];
  if (!f) return;

  // Update tabs
  const tabs = document.querySelectorAll('.tlc-format-tab-btn');
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
    tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
  });

  // Update text with soft animation
  const tagEl = document.getElementById('heroFormatTag');
  const titleEl = document.getElementById('heroFormatTitle');
  const descEl = document.getElementById('heroFormatDesc');
  const specsEl = document.getElementById('heroFormatSpecs');
  const ctaEl = document.getElementById('heroFormatCta');
  const hudSla = document.getElementById('hudSla');
  const hudStages = document.getElementById('hudStages');
  const hudPayment = document.getElementById('hudPayment');
  const hudProtocol = document.getElementById('hudProtocol');

  if (tagEl) tagEl.textContent = f.tag;
  if (titleEl) titleEl.textContent = f.title;
  if (descEl) descEl.textContent = f.desc;
  if (ctaEl) {
    ctaEl.innerHTML = f.cta;
    ctaEl.setAttribute('href', f.href);
  }
  if (specsEl) {
    specsEl.innerHTML = f.specs.map(s => `<span class="tlc-console-spec-tag">${s}</span>`).join('');
  }
  if (hudSla) hudSla.textContent = f.sla;
  if (hudStages) hudStages.textContent = f.stages;
  if (hudPayment) hudPayment.textContent = f.payment;
  if (hudProtocol) hudProtocol.textContent = f.protocol;
};
