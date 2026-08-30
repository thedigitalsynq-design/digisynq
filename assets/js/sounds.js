/**
 * DIGISYNQ — UI Sound Engine
 * Synthetic sounds via Web Audio API — zero file dependencies.
 * Respectful: muted by default, honors prefers-reduced-motion.
 */

(function () {
  // Respect user preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ── Core Synth Primitives ───────────────────────────────────────────────

  function playTone({ freq = 440, type = 'sine', gain = 0.12, attack = 0.005, decay = 0.08, pitch2 = null }) {
    if (!enabled) return;
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gainNode = ac.createGain();
      const now = ac.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (pitch2) osc.frequency.exponentialRampToValueAtTime(pitch2, now + decay);

      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + attack);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

      osc.connect(gainNode);
      gainNode.connect(ac.destination);
      osc.start(now);
      osc.stop(now + attack + decay + 0.02);
    } catch (_) {}
  }

  function playNoise({ gain = 0.06, duration = 0.04, highpass = 800 }) {
    if (!enabled) return;
    try {
      const ac = getCtx();
      const bufferSize = ac.sampleRate * duration;
      const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const source = ac.createBufferSource();
      source.buffer = buffer;

      const filter = ac.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = highpass;

      const gainNode = ac.createGain();
      const now = ac.currentTime;
      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ac.destination);
      source.start(now);
    } catch (_) {}
  }

  // ── Named Sounds ────────────────────────────────────────────────────────

  const sounds = {
    // Soft nav hover — barely audible tick
    hover() {
      playTone({ freq: 1100, type: 'sine', gain: 0.04, attack: 0.002, decay: 0.04, pitch2: 1200 });
    },

    // Pill button click — confident but soft thud
    click() {
      playTone({ freq: 520, type: 'triangle', gain: 0.13, attack: 0.003, decay: 0.09, pitch2: 440 });
      playNoise({ gain: 0.04, duration: 0.025, highpass: 2000 });
    },

    // CTA primary button — more authority
    ctaClick() {
      playTone({ freq: 660, type: 'triangle', gain: 0.16, attack: 0.004, decay: 0.12, pitch2: 520 });
      playNoise({ gain: 0.06, duration: 0.035, highpass: 1800 });
    },

    // Nav link — crisp minimal tap
    navTap() {
      playTone({ freq: 880, type: 'sine', gain: 0.08, attack: 0.002, decay: 0.06, pitch2: 920 });
    },

    // Toast appear — quick ping
    ping() {
      playTone({ freq: 1320, type: 'sine', gain: 0.1, attack: 0.003, decay: 0.15, pitch2: 1500 });
    },

    // Page transition — soft whoosh
    transition() {
      playNoise({ gain: 0.07, duration: 0.18, highpass: 400 });
      playTone({ freq: 320, type: 'sine', gain: 0.08, attack: 0.01, decay: 0.18, pitch2: 200 });
    },

    // Card hover — very subtle shimmer
    cardHover() {
      playTone({ freq: 960, type: 'sine', gain: 0.03, attack: 0.005, decay: 0.06 });
    },

    // Filter button switch
    filterSwitch() {
      playTone({ freq: 740, type: 'triangle', gain: 0.1, attack: 0.003, decay: 0.08, pitch2: 820 });
    }
  };

  // ── Bind Sound Events ───────────────────────────────────────────────────

  function bind() {
    // Nav links — tap sound
    document.querySelectorAll('.nav-links-center li a').forEach(el => {
      el.addEventListener('mouseenter', () => sounds.hover(), { passive: true });
      el.addEventListener('click', () => sounds.navTap(), { passive: true });
    });

    // Primary CTA buttons
    document.querySelectorAll('.btn-pill-solid').forEach(el => {
      el.addEventListener('mouseenter', () => sounds.hover(), { passive: true });
      el.addEventListener('click', () => sounds.ctaClick(), { passive: true });
    });

    // Outline / secondary buttons
    document.querySelectorAll('.btn-pill-outline, .btn-login').forEach(el => {
      el.addEventListener('mouseenter', () => sounds.hover(), { passive: true });
      el.addEventListener('click', () => sounds.click(), { passive: true });
    });

    // Card hover shimmer
    document.querySelectorAll('.ins-card, .subpage-card, .cdc-pcr-card, .cdc-eco-card, .cdc-loop-item').forEach(el => {
      el.addEventListener('mouseenter', () => sounds.cardHover(), { passive: true });
    });

    // Filter buttons
    document.querySelectorAll('.node-filter-btn, .c3d-mode-btn').forEach(el => {
      el.addEventListener('click', () => sounds.filterSwitch(), { passive: true });
    });

    // Marquee partner items
    document.querySelectorAll('.mono-trust-logo-item').forEach(el => {
      el.addEventListener('mouseenter', () => sounds.hover(), { passive: true });
    });

    // Page transition links (hook before navigation)
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') ||
          href.startsWith('tel') || href.startsWith('http') || href.startsWith('//')) return;
      link.addEventListener('click', () => sounds.transition(), { passive: true });
    });

    // Toast ping (override showToast to add ping)
    if (window.__digisynqSoundPingToast !== true) {
      window.__digisynqSoundPingToast = true;
      const origToast = window.showToast;
      if (typeof origToast === 'function') {
        window.showToast = function (msg) {
          origToast(msg);
          sounds.ping();
        };
      }
    }
  }

  // ── Mute Toggle (keyboard shortcut M) ──────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'm' || e.key === 'M') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      enabled = !enabled;
      // Brief visual feedback
      const badge = document.createElement('div');
      badge.textContent = enabled ? '🔊 Sounds On' : '🔇 Sounds Off';
      badge.style.cssText = `
        position:fixed;bottom:2rem;right:2rem;
        font-family:monospace;font-size:0.75rem;letter-spacing:0.08em;
        background:rgba(9,9,11,0.88);color:#fff;
        padding:0.5rem 1.1rem;border-radius:9999px;
        border:1px solid rgba(255,255,255,0.15);
        z-index:99999;pointer-events:none;
        animation:fadeInBadge 0.25s ease both;
      `;
      document.body.appendChild(badge);
      setTimeout(() => badge.remove(), 1800);
    }
  });

  // Add keyframe for mute badge
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeInBadge { from { opacity:0;transform:translateY(8px); } to { opacity:1;transform:translateY(0); } }`;
  document.head.appendChild(style);

  // ── Init on first interaction ───────────────────────────────────────────
  // AudioContext must be created after a user gesture (browser policy)
  function onFirstGesture() {
    bind();
    document.removeEventListener('click', onFirstGesture);
    document.removeEventListener('keydown', onFirstGesture);
    document.removeEventListener('touchstart', onFirstGesture);
  }

  document.addEventListener('click', onFirstGesture, { once: true });
  document.addEventListener('keydown', onFirstGesture, { once: true });
  document.addEventListener('touchstart', onFirstGesture, { once: true, passive: true });

})();
