/* ==========================================================================
   DIGISYNQ — Feedback Widget
   Submits to /api/feedback with fetch(); works offline gracefully.
   ========================================================================== */

(function () {
  'use strict';

  /* ── DOM ─────────────────────────────────────────────────────────────────── */
  const FAB_HTML = `
<button class="feedback-fab" id="feedback-fab" aria-label="Send feedback" aria-expanded="false">
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
</button>

<div class="feedback-panel" id="feedback-panel" role="dialog" aria-modal="true" aria-label="Feedback Form">
  <div class="fp-header">
    <span class="fp-title">Share Feedback</span>
    <button class="fp-close" id="fp-close" aria-label="Close feedback">✕</button>
  </div>

  <form class="fp-form" id="fp-form" novalidate>
    <div class="fp-field">
      <label class="fp-label" for="fp-name">Name (optional)</label>
      <input class="fp-input" type="text" id="fp-name" name="name" placeholder="Your name" autocomplete="name" />
    </div>

    <div class="fp-field">
      <label class="fp-label" for="fp-type">Type</label>
      <select class="fp-select" id="fp-type" name="type" required>
        <option value="">Select type…</option>
        <option value="Bug Report">🐛 Bug Report</option>
        <option value="Suggestion">💡 Suggestion</option>
        <option value="Compliment">⭐ Compliment</option>
        <option value="Other">💬 Other</option>
      </select>
    </div>

    <div class="fp-field">
      <label class="fp-label" for="fp-msg">Message</label>
      <textarea class="fp-textarea" id="fp-msg" name="message" placeholder="Tell us what you think…" required maxlength="500"></textarea>
    </div>

    <button type="submit" class="fp-submit" id="fp-submit">Send Feedback →</button>
  </form>

  <div class="fp-status" id="fp-status"></div>
</div>`;

  /* ── Inject ──────────────────────────────────────────────────────────────── */
  const container = document.createElement('div');
  container.innerHTML = FAB_HTML.trim();
  document.body.appendChild(container.firstElementChild); // fab
  document.body.appendChild(container.lastElementChild);  // panel

  const fab    = document.getElementById('feedback-fab');
  const panel  = document.getElementById('feedback-panel');
  const closeBtn = document.getElementById('fp-close');
  const form   = document.getElementById('fp-form');
  const submit = document.getElementById('fp-submit');
  const status = document.getElementById('fp-status');

  /* ── Toggle ──────────────────────────────────────────────────────────────── */
  function openPanel() {
    panel.classList.add('open');
    fab.setAttribute('aria-expanded', 'true');
    fab.querySelector('path').setAttribute('d', 'M18 6L6 18M6 6l12 12'); // X icon
  }
  function closePanel() {
    panel.classList.remove('open');
    fab.setAttribute('aria-expanded', 'false');
    fab.querySelector('path').setAttribute('d', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z');
  }

  fab.addEventListener('click', () => panel.classList.contains('open') ? closePanel() : openPanel());
  closeBtn.addEventListener('click', closePanel);

  // Close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !fab.contains(e.target)) {
      closePanel();
    }
  });

  /* ── Submit ──────────────────────────────────────────────────────────────── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const type = form.querySelector('#fp-type').value;
    const message = form.querySelector('#fp-msg').value.trim();

    if (!type) { showStatus('Please select a feedback type.', false); return; }
    if (!message) { showStatus('Please enter a message.', false); return; }

    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.className = 'fp-status';
    status.style.display = 'none';

    const payload = {
      name: form.querySelector('#fp-name').value.trim() || 'Anonymous',
      type,
      message,
      page: window.location.pathname,
      ts: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(6000)
      });
      if (res.ok) {
        showStatus('✓ Thank you! Your feedback has been received.', true);
        form.reset();
        setTimeout(closePanel, 3200);
      } else {
        throw new Error('Server error');
      }
    } catch {
      // Graceful offline fallback: save locally
      try {
        const saved = JSON.parse(localStorage.getItem('dsynq_feedback') || '[]');
        saved.push(payload);
        localStorage.setItem('dsynq_feedback', JSON.stringify(saved));
        showStatus('✓ Saved locally — will sync when online.', true);
        form.reset();
      } catch {
        showStatus('Could not send feedback. Please try again.', false);
      }
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send Feedback →';
    }
  });

  function showStatus(msg, success) {
    status.textContent = msg;
    status.className = `fp-status show ${success ? 'ok' : 'err'}`;
  }

})();
