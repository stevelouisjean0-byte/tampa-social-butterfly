/* Card-fan carousel — native port of the React/GSAP fan pattern */
(function () {
  "use strict";

  var stage = document.querySelector("[data-fan]");
  if (!stage) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cards = Array.prototype.slice.call(stage.querySelectorAll(".fan-card"));
  var total = cards.length;
  if (!total) return;

  var MAX_VISIBLE = 7;
  var HALF = 3;
  var needsPagination = total > MAX_VISIBLE;
  var center = needsPagination ? HALF : total >> 1;

  var FAN = [
    { rot: -21, scale: 0.7756, x: -30, y: 7.3, z: 1 },
    { rot: -14, scale: 0.8498, x: -22, y: 4.0, z: 2 },
    { rot: -7,  scale: 0.9346, x: -11, y: 1.3, z: 3 },
    { rot: 0,   scale: 1.0,    x: 0,   y: 0.0, z: 10 },
    { rot: 7,   scale: 0.9346, x: 11,  y: 1.3, z: 3 },
    { rot: 14,  scale: 0.8498, x: 22,  y: 4.0, z: 2 },
    { rot: 21,  scale: 0.7756, x: 30,  y: 7.3, z: 1 }
  ];

  function mult() {
    var w = window.innerWidth;
    if (w < 480) return 0.28;
    if (w < 640) return 0.38;
    if (w < 768) return 0.5;
    if (w < 1024) return 0.75;
    return 1.0;
  }

  function slotConfig(slot) {
    var count = needsPagination ? MAX_VISIBLE : total;
    if (count >= MAX_VISIBLE) return FAN[slot];
    var c = count >> 1;
    var d = count > 1 ? (slot - c) / c : 0;
    var a = Math.abs(d);
    return { rot: d * 21, scale: 1 - 0.2244 * a * a, x: d * 30, y: a * a * 7.3, z: 10 - Math.abs(slot - c) };
  }

  function visibleMap(centerIdx) {
    var map = {};
    if (!needsPagination) {
      cards.forEach(function (_, i) { map[i] = i; });
      return map;
    }
    for (var slot = 0; slot < MAX_VISIBLE; slot++) {
      map[((centerIdx + slot - HALF) % total + total) % total] = slot;
    }
    return map;
  }

  function applyTransform(el, x, y, rot, scale, opacity, z, instant) {
    if (instant) el.style.transition = "none";
    el.style.transform = "translate(calc(-50% + " + x + "rem), calc(-50% + " + y + "rem)) rotate(" + rot + "deg) scale(" + scale + ")";
    el.style.opacity = String(opacity);
    el.style.zIndex = String(z);
    if (instant) {
      void el.offsetWidth;
      el.style.transition = "";
    }
  }

  var hovered = null;
  var animating = false;

  function layout(hoveredSlot) {
    var m = mult();
    var vm = visibleMap(center);
    var entries = [];
    cards.forEach(function (el, i) {
      if (vm[i] !== undefined) entries.push({ el: el, slot: vm[i] });
    });
    entries.sort(function (a, b) { return a.slot - b.slot; });
    var centerSlot = entries.length >> 1;

    entries.forEach(function (e) {
      var base = slotConfig(e.slot);
      var x = base.x * m, y = base.y, rot = base.rot, scale = base.scale;
      if (hoveredSlot !== null && hoveredSlot !== undefined) {
        var dist = Math.abs(e.slot - hoveredSlot);
        if (e.slot === hoveredSlot) {
          y -= 2.5; scale *= 1.08;
        } else {
          var norm = centerSlot > 0 ? (e.slot - centerSlot) / centerSlot : 0;
          var push = 8 * (1 - Math.abs(norm)) * (1 + 0.2 * Math.max(0, 3 - dist));
          if (e.slot < hoveredSlot) { x -= push * m; rot -= 3 / (dist + 1); }
          else { x += push * m; rot += 3 / (dist + 1); }
        }
      }
      applyTransform(e.el, x, y, rot, scale, 1, base.z);
    });
  }

  function cycle(direction) {
    if (animating || !needsPagination) return;
    animating = true;
    var prevVm = visibleMap(center);
    center = direction === "right" ? (center + 1) % total : (center - 1 + total) % total;
    var vm = visibleMap(center);
    var m = mult();

    cards.forEach(function (el, i) {
      var slot = vm[i];
      var wasVisible = prevVm[i] !== undefined;
      if (slot !== undefined) {
        var c = slotConfig(slot);
        if (!wasVisible && !reduceMotion) {
          applyTransform(el, direction === "right" ? 40 : -40, c.y, direction === "right" ? 30 : -30, 0.5, 0, 0, true);
        }
        applyTransform(el, c.x * m, c.y, c.rot, c.scale, 1, c.z);
      } else if (wasVisible) {
        applyTransform(el, direction === "right" ? -40 : 40, 4, direction === "right" ? -30 : 30, 0.5, 0, 0);
      }
    });
    paintDots();
    window.setTimeout(function () { animating = false; }, reduceMotion ? 0 : 620);
  }

  /* dots + arrows */
  var dotsWrap = document.querySelector("[data-fan-dots]");
  var dots = [];
  if (dotsWrap && needsPagination) {
    cards.forEach(function () {
      var d = document.createElement("span");
      d.className = "fan-dot";
      dotsWrap.appendChild(d);
      dots.push(d);
    });
  }
  function paintDots() {
    dots.forEach(function (d, i) { d.classList.toggle("on", i === center); });
  }
  var prevBtn = document.querySelector("[data-fan-prev]");
  var nextBtn = document.querySelector("[data-fan-next]");
  if (prevBtn) prevBtn.addEventListener("click", function () { cycle("left"); });
  if (nextBtn) nextBtn.addEventListener("click", function () { cycle("right"); });
  document.addEventListener("keydown", function (e) {
    if (!stage.closest("section") || !stageInView) return;
    if (e.key === "ArrowLeft") cycle("left");
    if (e.key === "ArrowRight") cycle("right");
  });

  /* hover spread */
  var leaveTimer = null;
  cards.forEach(function (el) {
    el.addEventListener("mouseenter", function () {
      if (animating || reduceMotion) return;
      var vm = visibleMap(center);
      var idx = cards.indexOf(el);
      if (vm[idx] === undefined) return;
      if (leaveTimer) { clearTimeout(leaveTimer); leaveTimer = null; }
      if (hovered !== vm[idx]) { hovered = vm[idx]; layout(hovered); }
    });
  });
  stage.addEventListener("mouseleave", function () {
    if (animating || reduceMotion) return;
    if (leaveTimer) clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(function () { hovered = null; layout(null); }, 60);
  });

  window.addEventListener("resize", function () { if (!animating) layout(hovered); });

  /* entry: rise from below with stagger when scrolled into view */
  var stageInView = false;
  var vm0 = visibleMap(center);
  cards.forEach(function (el, i) {
    if (vm0[i] !== undefined && !reduceMotion) {
      applyTransform(el, 0, 12, 0, 0.5, 0, slotConfig(vm0[i]).z, true);
    } else if (vm0[i] === undefined) {
      applyTransform(el, 0, 0, 0, 0.3, 0, 0, true);
    }
  });
  paintDots();

  function enter() {
    if (reduceMotion) { layout(null); return; }
    animating = true;
    var m = mult();
    var entries = [];
    cards.forEach(function (el, i) { if (vm0[i] !== undefined) entries.push({ el: el, slot: vm0[i] }); });
    entries.forEach(function (e) {
      var c = slotConfig(e.slot);
      window.setTimeout(function () {
        applyTransform(e.el, c.x * m, c.y, c.rot, c.scale, 1, c.z);
      }, 150 + e.slot * 70);
    });
    window.setTimeout(function () { animating = false; }, 150 + MAX_VISIBLE * 70 + 650);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) {
        stageInView = true;
        enter();
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(stage);
  } else {
    stageInView = true;
    enter();
  }
})();
