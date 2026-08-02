/* Tampa Social Butterfly — shared behavior */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- nav ---------------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var burger = document.querySelector(".nav-burger");
  var menu = document.querySelector(".menu");
  if (burger && menu) {
    var closeBtn = menu.querySelector(".menu-close");
    var setMenu = function (open) {
      menu.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        menu.querySelectorAll(".menu-link").forEach(function (a, i) {
          a.style.transitionDelay = (0.08 + i * 0.05) + "s";
        });
        var first = menu.querySelector(".menu-link");
        if (first) first.focus();
      } else {
        burger.focus();
      }
    };
    burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setMenu(false); });
    menu.addEventListener("click", function (e) {
      if (e.target.classList.contains("menu-link")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
    });
  }

  /* ---------------- scroll reveals ---------------- */
  var revealEls = document.querySelectorAll(".rv");
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          ro.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------- hero video ---------------- */
  var heroVideo = document.querySelector(".hero-media video");
  var heroToggle = document.querySelector(".video-toggle");
  var iconPause = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="1.5" y="1" width="3" height="10" rx="1"/><rect x="7.5" y="1" width="3" height="10" rx="1"/></svg>';
  var iconPlay = '<svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M2.5 1.6a1 1 0 0 1 1.52-.86l7 4.4a1 1 0 0 1 0 1.7l-7 4.4a1 1 0 0 1-1.52-.85V1.6z"/></svg>';
  if (heroVideo) {
    if (reduceMotion) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    }
    if (heroToggle) {
      var paintToggle = function () {
        var playing = !heroVideo.paused;
        heroToggle.innerHTML = playing ? iconPause : iconPlay;
        heroToggle.setAttribute("aria-label", playing ? "Pause background video" : "Play background video");
      };
      heroToggle.addEventListener("click", function () {
        if (heroVideo.paused) { heroVideo.play(); } else { heroVideo.pause(); }
      });
      heroVideo.addEventListener("play", paintToggle);
      heroVideo.addEventListener("pause", paintToggle);
      paintToggle();
    }
  }

  /* ---------------- phone reels ---------------- */
  var phones = document.querySelectorAll(".phone");
  if (phones.length) {
    var phoneIO = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var video = en.target.querySelector("video");
        if (!video) return;
        if (en.isIntersecting && !reduceMotion && !en.target.dataset.userPaused) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.45 }) : null;

    phones.forEach(function (phone) {
      var video = phone.querySelector("video");
      var tap = phone.querySelector(".phone-tap");
      var bar = phone.querySelector(".phone-progress i.active");
      if (!video) return;
      if (phoneIO) phoneIO.observe(phone);
      if (tap) {
        tap.addEventListener("click", function () {
          if (video.paused) {
            delete phone.dataset.userPaused;
            video.play().catch(function () {});
            tap.setAttribute("aria-label", "Pause reel");
          } else {
            phone.dataset.userPaused = "1";
            video.pause();
            tap.setAttribute("aria-label", "Play reel");
          }
        });
      }
      if (bar) {
        video.addEventListener("timeupdate", function () {
          if (video.duration) {
            bar.style.setProperty("--p", (video.currentTime / video.duration).toFixed(3));
          }
        });
      }
    });
  }

  /* ---------------- gallery filters ---------------- */
  var filterBar = document.querySelector(".filter-bar");
  if (filterBar) {
    var tiles = Array.prototype.slice.call(document.querySelectorAll(".masonry .tile"));
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      filterBar.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      var f = btn.dataset.filter;
      tiles.forEach(function (t) {
        t.classList.toggle("hidden", f !== "all" && t.dataset.cat !== f);
      });
    });
  }

  /* ---------------- lightbox ---------------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector("figcaption");
    var lbClose = lightbox.querySelector(".lightbox-close");
    var lbPrev = lightbox.querySelector(".lightbox-nav.prev");
    var lbNext = lightbox.querySelector(".lightbox-nav.next");
    var items = Array.prototype.slice.call(document.querySelectorAll(".masonry .tile"));
    var idx = -1;
    var lastFocus = null;

    var visible = function () {
      return items.filter(function (t) { return !t.classList.contains("hidden"); });
    };
    var show = function (list, i) {
      idx = (i + list.length) % list.length;
      var t = list[idx];
      var img = t.querySelector("img");
      lbImg.src = img.dataset.full || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
    };
    var open = function (t) {
      var list = visible();
      lastFocus = document.activeElement;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
      show(list, list.indexOf(t));
      lbClose.focus();
    };
    var close = function () {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    items.forEach(function (t) {
      t.addEventListener("click", function () { open(t); });
    });
    lbClose.addEventListener("click", close);
    if (lbPrev) lbPrev.addEventListener("click", function () { show(visible(), idx - 1); });
    if (lbNext) lbNext.addEventListener("click", function () { show(visible(), idx + 1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(visible(), idx - 1);
      if (e.key === "ArrowRight") show(visible(), idx + 1);
    });
  }

  /* ---------------- booking form (demo) ---------------- */
  var form = document.querySelector("form.booking-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll(".field[data-required]").forEach(function (field) {
        var input = field.querySelector("input, select, textarea");
        var bad = !input.value.trim();
        if (input.type === "email" && !bad) {
          bad = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        field.classList.toggle("invalid", bad);
        if (bad) ok = false;
      });
      if (!ok) {
        var firstBad = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }
      form.style.display = "none";
      var success = document.querySelector(".form-success");
      if (success) {
        success.classList.add("show");
        success.setAttribute("tabindex", "-1");
        success.focus();
      }
    });
    form.querySelectorAll(".field input, .field select, .field textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        input.closest(".field").classList.remove("invalid");
      });
    });
  }

  /* ---------------- phone carousel ---------------- */
  var pcar = document.querySelector("[data-pcar]");
  if (pcar) {
    var slides = JSON.parse(pcar.getAttribute("data-pcar"));
    var centerImg = pcar.querySelector(".pcar-center .phone-screen > img");
    var leftImg = pcar.querySelector(".pcar-left img");
    var rightImg = pcar.querySelector(".pcar-right img");
    var capEl = pcar.querySelector(".pcar-center .phone-ui .caption");
    var segs = pcar.querySelectorAll(".pcar-center .phone-progress i");
    var cur = 0, timer = null, inView = true;

    var mod = function (n) { return (n + slides.length) % slides.length; };
    var paint = function () {
      var s = slides[cur];
      centerImg.src = s.src;
      centerImg.alt = s.alt;
      if (capEl) capEl.textContent = s.cap;
      if (leftImg) leftImg.src = slides[mod(cur - 1)].src;
      if (rightImg) rightImg.src = slides[mod(cur + 1)].src;
      segs.forEach(function (seg, i) {
        seg.classList.toggle("active", i === cur % segs.length);
        if (i === cur % segs.length) seg.style.setProperty("--p", "1");
      });
    };
    var go = function (dir) {
      centerImg.classList.add("fading");
      window.setTimeout(function () {
        cur = mod(cur + dir);
        paint();
        centerImg.classList.remove("fading");
      }, 240);
    };
    var restart = function () {
      if (timer) window.clearInterval(timer);
      if (!reduceMotion && inView) timer = window.setInterval(function () { go(1); }, 4200);
    };
    pcar.querySelector(".pcar-btn.prev").addEventListener("click", function () { go(-1); restart(); });
    pcar.querySelector(".pcar-btn.next").addEventListener("click", function () { go(1); restart(); });
    var tapBtn = pcar.querySelector(".pcar-center .phone-tap");
    if (tapBtn) tapBtn.addEventListener("click", function () { go(1); restart(); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        restart();
      }, { threshold: 0.25 }).observe(pcar);
    }
    var touchX = null;
    pcar.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    pcar.addEventListener("touchend", function (e) {
      if (touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restart(); }
      touchX = null;
    }, { passive: true });
    paint();
    restart();
  }

  /* ---------------- footer year ---------------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
