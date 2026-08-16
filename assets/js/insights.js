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

  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
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

  var feedItems = [
    ["Wrap verified", "Mallige Lane wrapped in 41 shoot days. Wrap log written to the operating graph."],
    ["Box office tick", "Weekend collections updated for 217 releases. 42% occupancy in Bengaluru."],
    ["Status change", "Hero Vijay Ponnappa flagged on hiatus — no active pipeline for 14 months."],
    ["Hit verified", "Namma Kade crossed the hit threshold. 11th hit of FY26."],
    ["House flagged", "Swarnalatha Cine Arts dormant — no activity for 24 months. Archive retained."],
    ["Capacity match", "Stage + camera + crew matched for a 34-day schedule."],
    ["Screens added", "+12 multiplex screens across 3 Bengaluru centres. Regional total 404."]
  ];
  var feed = document.getElementById("ins-feed");
  var feedIdx = 0;
  function pushFeed() {
    if (!feed) return;
    var item = feedItems[feedIdx % feedItems.length];
    feedIdx++;
    var el = document.createElement("div");
    el.className = "ins-feed-item";
    el.style.opacity = "0";
    el.innerHTML =
      '<span class="ins-feed-dot"></span>' +
      '<div class="ins-feed-body">' +
      '<div class="ins-feed-title">' + item[0] + "</div>" +
      '<div class="ins-feed-text">' + item[1] + "</div>" +
      '<div class="ins-feed-time">just now</div></div>';
    feed.insertBefore(el, feed.firstChild);
    var items = feed.querySelectorAll(".ins-feed-item");
    if (items.length > 8) feed.removeChild(items[items.length - 1]);
    requestAnimationFrame(function () { el.style.opacity = "1"; });
    feed.querySelectorAll(".ins-feed-time").forEach(function (s) {
      var m = parseInt(s.getAttribute("data-m") || "0", 10);
      if (m > 0) s.setAttribute("data-m", String(m + 1));
      s.textContent = s.getAttribute("data-m") === "1" ? "1 min ago" : m > 1 ? m + " min ago" : "just now";
    });
  }
  if (feed) {
    setInterval(pushFeed, 9000);
    feed.querySelectorAll(".ins-feed-time").forEach(function (s, i) {
      var m = i + 1;
      s.setAttribute("data-m", String(m));
      s.textContent = m + " min ago";
    });
  }
})();