/* ==========================================================================
   DIGISYNQ — Dynamic Posts Renderer
   Fetches /api/posts and renders into #posts-feed
   Supports auto-refresh every 60s
   ========================================================================== */

(function () {
  'use strict';

  const FEED_ID   = 'posts-feed';
  const REFRESH_MS = 60_000; // auto refresh every 60 seconds

  function renderPost(post, delay) {
    const card = document.createElement('article');
    card.className = 'card post-card';
    card.style.animationDelay = `${delay}ms`;
    card.setAttribute('data-id', post.id || '');

    const date = post.date ? new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
    card.innerHTML = `
      <div class="post-card-tag">
        <span class="ticker-dot"></span>
        ${escHtml(post.tag || 'Network Update')}
      </div>
      <h3 class="post-card-title">${escHtml(post.title)}</h3>
      <p class="post-card-body">${escHtml(post.body)}</p>
      <div class="post-card-meta">
        ${date ? `<span>${date}</span>` : ''}
        ${post.author ? `<span>— ${escHtml(post.author)}</span>` : ''}
      </div>
    `;

    // Spotlight card mouse tracking
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });

    return card;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  async function loadPosts(feed) {
    try {
      const res = await fetch('/api/posts', { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error('Non-200');
      const posts = await res.json();

      if (!Array.isArray(posts) || posts.length === 0) {
        feed.innerHTML = '<p class="posts-empty">No updates yet — check back soon.</p>';
        return;
      }

      feed.innerHTML = '';
      posts.slice(0, 9).forEach((post, i) => {
        feed.appendChild(renderPost(post, i * 70));
      });
    } catch {
      // Fallback to static seed data
      const fallback = getFallback();
      feed.innerHTML = '';
      fallback.forEach((post, i) => feed.appendChild(renderPost(post, i * 70)));
    }
  }

  function getFallback() {
    return [
      {
        id: '1', tag: 'Network activity',
        title: 'DOP × studio sync confirmed',
        body: 'Aryan Sharma (Grade A DOP) successfully matched with Ciné Studio Block B for a 12-day feature shoot. Anamorphic package secured.',
        author: 'DIGISYNQ Ops', date: new Date().toISOString()
      },
      {
        id: '2', tag: 'Capability added',
        title: 'ACES color suite now available',
        body: 'Vikramaditya Roy\'s post-production suite upgraded with DaVinci Resolve Advanced Panel. Theatrical HDR DI capacity now bookable.',
        author: 'Network registry', date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3', tag: 'Knowledge event',
        title: 'Workshop: low-light cinematography',
        body: 'Open masterclass by Karthik R. on LED-based lighting systems. 32 seats available. Register through the capability graph.',
        author: 'DIGISYNQ Events', date: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }

  /* Init when DOM ready */
  function init() {
    const feed = document.getElementById(FEED_ID);
    if (!feed) return;

    feed.innerHTML = '<p class="posts-loading">Loading network updates…</p>';
    loadPosts(feed);

    // Auto-refresh
    let timer = setInterval(() => loadPosts(feed), REFRESH_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { clearInterval(timer); }
      else { loadPosts(feed); timer = setInterval(() => loadPosts(feed), REFRESH_MS); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
