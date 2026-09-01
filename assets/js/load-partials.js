/**
 * DIGISYNQ — Partial Loader
 * Injects shared header and footer partials into every page,
 * then marks the correct nav link as active based on the current URL.
 *
 * Must be loaded BEFORE main.js so that the DOM is ready for main.js
 * to attach event listeners to the injected elements.
 */

(function () {
  /**
   * Fetch an HTML partial and inject it into the target element.
   * Returns a Promise that resolves when the injection is complete.
   */
  function loadPartial(selector, url) {
    var el = document.getElementById(selector);
    if (!el) return Promise.resolve();

    return fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load partial: ' + url);
        return res.text();
      })
      .then(function (html) {
        el.outerHTML = html;
      })
      .catch(function (err) {
        console.warn('[DigiSynq partials]', err);
      });
  }

  /**
   * Determine which nav-link should be active based on the current filename.
   * e.g. "about.html" → data-page="about"
   */
  function setActiveNavLink() {
    var path = window.location.pathname;
    var filename = path.substring(path.lastIndexOf('/') + 1).replace('.html', '') || 'index';

    document.querySelectorAll('[data-page]').forEach(function (el) {
      if (el.getAttribute('data-page') === filename) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });
  }

  /**
   * Re-run any initialisation that depends on the injected partials.
   * main.js already attaches these on DOMContentLoaded, but since partials
   * are injected asynchronously we call them again after injection.
   */
  function reinitAfterPartials() {
    setActiveNavLink();

    // Re-init mobile menu toggle (injected header contains the button)
    var toggle = document.querySelector('.nav-mobile-toggle');
    var mobileMenu = document.querySelector('.nav-mobile-menu');
    if (toggle && mobileMenu) {
      // Remove any stale listeners by cloning
      var newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      newToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
      });
    }

    // Re-wire modal open buttons injected via the footer partial
    document.querySelectorAll('[data-open-synq-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var modal = document.getElementById('synqModal');
        if (modal) modal.classList.add('active');
      });
    });

    // Re-wire modal close button
    var closeBtn = document.getElementById('closeSynqModal');
    var modal = document.getElementById('synqModal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', function () {
        modal.classList.remove('active');
      });
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  }

  // Resolve the base path to the partials directory so this works
  // regardless of whether the site is served from root or a sub-folder.
  function partialsBase() {
    // Walk back to the site root by finding the script tag
    var scripts = document.querySelectorAll('script[src]');
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute('src');
      if (src && src.indexOf('load-partials') !== -1) {
        // e.g. "assets/js/load-partials.js" → root is two levels up
        var parts = src.split('/');
        parts.splice(-2); // remove "js/load-partials.js"
        return parts.join('/'); // e.g. "assets"
      }
    }
    return 'assets';
  }

  var base = partialsBase();
  var headerUrl = base + '/partials/header.html';
  var footerUrl = base + '/partials/footer.html';

  // Load both partials in parallel, then reinit
  Promise.all([
    loadPartial('header', headerUrl),
    loadPartial('footer', footerUrl)
  ]).then(reinitAfterPartials);
})();
