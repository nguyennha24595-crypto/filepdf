/* FileCustom — hiệu ứng header:
 * 1) Logo lớn ở hero (.fp-hero-logo) bay lên và thu nhỏ dần về đúng chỗ logo header khi cuộn xuống.
 * 2) Nút "lên đầu trang" hiện khi đã cuộn xuống, ẩn khi về tới đầu trang.
 * ES5 thuần, không phụ thuộc thư viện. */
(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  function reduced() { return !!(reduce && reduce.matches); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  // easeInOutCubic: bắt đầu và kết thúc êm, không giật
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* ---------- 1. Logo bay lên header ---------- */
  function initLogo() {
    var slot = document.querySelector(".fp-hero-logo");
    var fly = slot && slot.querySelector("img");
    var small = document.querySelector(".fp-header .fp-logo-img");
    if (!slot || !fly || !small) return;

    doc.classList.add("fx-logo-on");
    var cur = -1, target = 0, raf = 0, last = 0;
    var bigW = 0, bigH = 0, dist = 1;

    function measure() {
      var s = small.getBoundingClientRect();
      var r = slot.getBoundingClientRect();
      var ratio = s.width && s.height ? s.width / s.height : 418 / 128;
      // Logo lớn cao bằng khung .fp-hero-logo (CSS quyết định, ~2.5 lần logo header), không tràn ngang màn hình
      bigH = r.height;
      bigW = bigH * ratio;
      if (bigW > r.width) { bigW = r.width; bigH = bigW / ratio; }
      fly.style.width = bigW + "px";
      fly.style.height = bigH + "px";
      // Quãng cuộn để logo bay hết: từ vị trí trong hero tới header, cộng thêm một chút cho chuyển động chậm, mềm
      var sy = window.pageYOffset || 0;
      dist = Math.max(120, (r.top + sy) - (s.top + (isFixed() ? 0 : sy)) + bigH * 0.6);
    }

    // Header có dính (sticky/fixed) khi cuộn không: nếu có thì vị trí logo header không đổi theo cuộn
    function isFixed() {
      var p = getComputedStyle(small.closest ? small.closest(".fp-header") : small.parentNode).position;
      return p === "sticky" || p === "fixed";
    }

    function progress() { return clamp((window.pageYOffset || 0) / dist, 0, 1); }

    function paint(p) {
      var e = ease(p);
      var s = small.getBoundingClientRect();
      var r = slot.getBoundingClientRect();
      var fromX = r.left + (r.width - bigW) / 2;
      // Không để logo bị kéo lên cao hơn header (khi cuộn nhanh khung hero đã trôi khỏi màn hình)
      var fromY = Math.max(r.top + (r.height - bigH) / 2, s.top);
      var x = lerp(fromX, s.left, e);
      var y = lerp(fromY, s.top, e);
      var k = lerp(1, s.width / bigW, e);
      fly.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0) scale(" + k.toFixed(4) + ")";
      doc.classList.toggle("fx-logo-docked", p >= 0.995);
    }

    function tick(now) {
      raf = 0;
      var dt = last ? Math.min(64, now - last) : 16;
      last = now;
      target = progress();
      if (cur < 0 || reduced()) cur = target;
      // Đuổi theo vị trí cuộn có quán tính nhẹ (độc lập tốc độ khung hình)
      else cur += (target - cur) * (1 - Math.pow(1 - 0.2, dt / 16.7));
      if (Math.abs(target - cur) < 0.001) cur = target;
      paint(cur);
      if (cur !== target) raf = requestAnimationFrame(tick);
      else last = 0;
    }

    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    function relayout() { measure(); kick(); }

    measure();
    cur = -1;
    tick(0);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", relayout);
    window.addEventListener("load", relayout);
    if (fly.complete === false) fly.addEventListener("load", relayout);
  }

  /* ---------- 2. Nút lên đầu trang ---------- */
  function initToTop() {
    var en = (doc.lang || "").indexOf("en") === 0;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fx-totop";
    btn.setAttribute("aria-label", en ? "Back to top" : "Lên đầu trang");
    btn.title = btn.getAttribute("aria-label");
    btn.tabIndex = -1;
    btn.innerHTML =
      '<svg class="fx-totop-ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22"/><circle class="fx-totop-bar" cx="24" cy="24" r="22" pathLength="100"/></svg>' +
      '<svg class="fx-totop-ico" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>';
    document.body.appendChild(btn);
    var bar = btn.querySelector(".fx-totop-bar");
    var shown = false, raf = 0;

    function update() {
      raf = 0;
      var y = window.pageYOffset || 0;
      var max = Math.max(1, doc.scrollHeight - window.innerHeight);
      // Hiện khi đã cuộn quá ~ nửa màn hình; về tới đầu trang thì ẩn
      var show = y > Math.min(480, window.innerHeight * 0.6);
      if (show !== shown) {
        shown = show;
        btn.classList.toggle("is-on", show);
        btn.tabIndex = show ? 0 : -1;
      }
      bar.style.strokeDashoffset = (100 - clamp(y / max, 0, 1) * 100).toFixed(2);
    }

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
      btn.blur();
    });
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- 3. Hiện dần các khối [data-fx-reveal] khi cuộn tới ---------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-fx-reveal]");
    if (!els.length || !("IntersectionObserver" in window)) return;
    doc.classList.add("fx-reveal-on");
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        var el = entries[i].target;
        el.classList.add("is-in");
        io.unobserve(el);
        // Hiện xong thì bỏ độ trễ so le, để hiệu ứng rê chuột phản hồi ngay
        setTimeout(function (x) { return function () { x.style.removeProperty("--fx-delay"); }; }(el), 900);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    for (var i = 0; i < els.length; i++) {
      // Các thẻ cùng một lưới hiện so le nhau một chút
      var sib = els[i].parentNode ? Array.prototype.indexOf.call(els[i].parentNode.children, els[i]) : 0;
      if (els[i].tagName === "LI") els[i].style.setProperty("--fx-delay", (sib % 3) * 0.08 + "s");
      io.observe(els[i]);
    }
  }

  function init() { initLogo(); initToTop(); initReveal(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
