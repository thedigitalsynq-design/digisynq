/**
 * DIGISYNQ — Master Interactive Engine
 * Liquid Glass UI · Scroll-driven Reveal Animations · Sticky Nav · Performance-First
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initScrollReveal();
  initSmoothScroll();
  initNodeFilters();
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
    '.ins-card', '.subpage-card', '.cdc-pcr-card', '.cdc-loop-item', '.cdc-eco-card',
    '.wp-card', '.data-viz-card', '.principle-card', '.investor-card', '.stream-card',
    '[data-reveal]'
  ].join(', ');

  const targets = document.querySelectorAll(SELECTOR);

  // Add class BEFORE paint so browser never shows them uncollapsed
  targets.forEach((el, i) => {
    el.classList.add('reveal-hidden');
    el.style.transitionDelay = `${(i % 5) * 70}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.remove('reveal-hidden');
        el.classList.add('reveal-visible');
        // Clean up delay after animation completes to free memory
        el.addEventListener('transitionend', () => {
          el.style.transitionDelay = '';
          el.style.willChange = 'auto';
        }, { once: true });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ===========================================================
   SUBTLE HERO PARALLAX (RAF-throttled, GPU-only)
   =========================================================== */
function initParallaxHero() {
  const hero = document.querySelector('.ins-hero, .hero-section');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        hero.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ===========================================================
   SMOOTH SCROLL ANCHORS
   =========================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ===========================================================
   PAGE TRANSITION LINKS (soft fade-out on navigate only)
   =========================================================== */
function initPageTransitionLinks() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || href.startsWith('http') || href.startsWith('//')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const appCard = document.querySelector('.app-card');
      if (appCard) {
        appCard.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
        appCard.style.opacity = '0';
        appCard.style.transform = 'scale(0.99)';
      }
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });
}

/* ===========================================================
   INTERACTIVE NODE CATEGORY FILTERS (network.html)
   =========================================================== */
function initNodeFilters() {
  const filterBtns = document.querySelectorAll('.node-filter-btn');
  const nodeCards = document.querySelectorAll('.subpage-card[data-node-category]');
  if (!filterBtns.length || !nodeCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      nodeCards.forEach((card, i) => {
        const cat = card.getAttribute('data-node-category');
        const visible = filter === 'all' || cat === filter;
        card.style.transition = `opacity 0.3s ease ${i * 30}ms, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${i * 30}ms`;
        if (visible) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
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
