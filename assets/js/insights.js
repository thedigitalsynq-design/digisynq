(function () {
  function pad(n) { return String(n).padStart(2, "0"); }

  var clockEl = document.getElementById("ins-clock-time");
  function tickClock() {
    if (!clockEl) return;
    var now = new Date();
    var ist = new Date(now.getTime() + (5 * 60 + 30) * 60000);
    clockEl.textContent = pad(ist.getUTCHours()) + ":" + pad(ist.getUTCMinutes()) + ":" + pad(ist.getUTCSeconds()) + " IST";
  }
  tickClock();
  setInterval(tickClock, 1000);

  function animateCount(el, target) {
    target = target == null ? parseInt(el.getAttribute("data-count"), 10) : target;
    if (isNaN(target)) return;
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-IN");
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function inView(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight - 40 && r.bottom > 0;
  }

  var counted = false;
  function checkCount() {
    if (counted) return;
    var kpis = document.querySelectorAll(".ins-kpi-value[data-count]");
    var anyVisible = false;
    kpis.forEach(function (el) { if (inView(el)) anyVisible = true; });
    if (anyVisible) {
      counted = true;
      kpis.forEach(animateCount);
    }
  }
  window.addEventListener("scroll", checkCount, { passive: true });
  checkCount();

  var feed = document.getElementById("ins-feed");
  var feedEls = [];
  function pushFeedItem(title, text, time) {
    if (!feed) return;
    var el = document.createElement("div");
    el.className = "ins-feed-item";
    el.style.opacity = "0";
    el.innerHTML =
      '<span class="ins-feed-dot"></span>' +
      '<div class="ins-feed-body">' +
      '<div class="ins-feed-title"></div>' +
      '<div class="ins-feed-text"></div>' +
      '<div class="ins-feed-time"></div></div>';
    el.querySelector(".ins-feed-title").textContent = title;
    el.querySelector(".ins-feed-text").textContent = text;
    el.querySelector(".ins-feed-time").textContent = time;
    feed.insertBefore(el, feed.firstChild);
    feedEls.push(el);
    while (feedEls.length > 8) {
      var old = feedEls.shift();
      if (old.parentNode) old.parentNode.removeChild(old);
    }
    requestAnimationFrame(function () { el.style.opacity = "1"; });
  }
  function ageFeed() {
    feedEls.forEach(function (el) {
      var s = el.querySelector(".ins-feed-time");
      if (!s) return;
      var m = parseInt(s.getAttribute("data-m") || "0", 10);
      if (m > 0) s.setAttribute("data-m", String(m + 1));
      s.textContent = s.getAttribute("data-m") === "1" ? "1 min ago" : m > 1 ? m + " min ago" : "just now";
    });
  }

  var simulationItems = [
    ["Wrap verified", "Mallige Lane wrapped in 41 shoot days. Wrap log written to the operating graph."],
    ["Box office tick", "Weekend collections updated for 217 releases. 42% occupancy in Bengaluru."],
    ["Status change", "Hero Vijay Ponnappa flagged on hiatus — no active pipeline for 14 months."],
    ["Hit verified", "Namma Kade crossed the hit threshold. 11th hit of FY26."],
    ["House flagged", "Swarnalatha Cine Arts dormant — no activity for 24 months. Archive retained."],
    ["Capacity match", "Stage + camera + crew matched for a 34-day schedule."],
    ["Screens added", "+12 multiplex screens across 3 Bengaluru centres. Regional total 404."]
  ];
  var simIdx = 0;
  function pushSimulation() {
    var item = simulationItems[simIdx % simulationItems.length];
    simIdx++;
    pushFeedItem(item[0], item[1], "just now");
    ageFeed();
  }

  function applySnapshot(snap) {
    if (!snap || !snap.kpis) return false;

    var kpiMap = {
      releases: snap.kpis.releases,
      boxOfficeCr: snap.kpis.boxOfficeCr,
      hits: snap.kpis.hits,
      average: snap.kpis.average,
      flops: snap.kpis.flops,
      screens: snap.kpis.screens
    };
    document.querySelectorAll(".ins-kpi-value[data-count]").forEach(function (el) {
      var key = el.getAttribute("data-kpi");
      if (key && kpiMap[key] != null) animateCount(el, kpiMap[key]);
    });

    var screenNote = document.querySelector(".ins-kpi-note");
    if (screenNote && snap.kpis.multiplex != null) {
      var notes = document.querySelectorAll(".ins-kpi-note");
      if (notes.length >= 6) {
        notes[5].textContent = snap.kpis.multiplex + " multiplex / " + snap.kpis.single + " single";
      }
    }

    if (snap.feed && snap.feed.length) {
      feedEls = [];
      feed.innerHTML = "";
      snap.feed.slice(0, 6).forEach(function (item, i) {
        pushFeedItem(item.title, item.text, item.time || (i === 0 ? "just now" : (i * 15) + " min ago"));
      });
    }

    var chip = document.querySelector(".ins-chip--live .ins-chip-dot");
    if (chip) {
      chip.style.background = snap.source === "seed" ? "#fbbf24" : "#34d399";
    }

    var liveChip = document.getElementById("ins-live-status");
    if (liveChip) {
      liveChip.textContent = snap.source === "live"
        ? "Live data · " + (snap.provider || "AI")
        : "Seed data · live API offline";
    }
    return true;
  }

  var live = false;
  var simTimer = null;
  function startSimulation() {
    if (simTimer) return;
    if (feed) {
      feed.querySelectorAll(".ins-feed-time").forEach(function (s, i) {
        var m = i + 1;
        s.setAttribute("data-m", String(m));
        s.textContent = m + " min ago";
      });
    }
    simTimer = setInterval(pushSimulation, 9000);
  }
  function fetchLive() {
    fetch("/api/insights", { headers: { Accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (res) {
        if (res && res.success && res.snapshot) {
          live = true;
          if (simTimer) { clearInterval(simTimer); simTimer = null; }
          applySnapshot(res.snapshot);
        }
      })
      .catch(function () { /* API offline — simulation continues */ });
  }

  startSimulation();
  fetchLive();
  setInterval(fetchLive, 60000);
})();