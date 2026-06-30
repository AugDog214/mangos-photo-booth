/* ============================================================
   Mango's Photo Booth Company — site behavior
   Plain vanilla JS. No framework, no build step.
   Each feature is isolated so a failure in one can't break the rest,
   and the reveal failsafe guarantees content is always visible.
   ============================================================ */
(function () {
  'use strict';

  var run = function (label, fn) {
    try { fn(); } catch (err) {
      if (window.console && console.warn) console.warn('[mango] ' + label + ' failed:', err);
    }
  };

  /* ---------- Header: solid + blur after 40px ---------- */
  run('header', function () {
    var hdr = document.getElementById('site-header');
    if (!hdr) return;
    var onScroll = function () {
      hdr.classList.toggle('hdr-solid', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  /* ---------- Mobile menu (hamburger) ---------- */
  run('mobile-menu', function () {
    var burger = document.getElementById('hdr-burger');
    var menu = document.getElementById('hdr-mobile');
    if (!burger || !menu) return;

    var setOpen = function (open) {
      menu.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', function () {
      setOpen(!menu.classList.contains('is-open'));
    });
    // Close when a link inside the menu is tapped.
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    // Close on Escape.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  });

  /* ---------- Hero slideshow (crossfade + dots) ---------- */
  run('hero', function () {
    var hero = document.querySelector('.hero');
    var stage = document.querySelector('.hero-stage');
    if (!stage) return;
    var slides = stage.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('#hero-dots .hero-dot');

    // Staggered entrance on load (runs even with a single slide).
    var inner = document.getElementById('hero-inner');
    if (inner) requestAnimationFrame(function () { inner.classList.add('is-in'); });

    if (slides.length < 2) return;

    var i = 0;
    var show = function (n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) {
        var on = k === i;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    };

    // Respect reduced-motion: don't auto-advance at all (dots still work).
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paused = !!reduce;
    var timer = null;
    var start = function () { if (!reduce) timer = setInterval(function () { if (!paused) show(i + 1); }, 5200); };
    var restart = function () { if (timer) { clearInterval(timer); timer = null; } start(); };
    start();

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        show(parseInt(d.getAttribute('data-i'), 10) || 0);
        restart();
      });
    });

    // Pause auto-advance on hover/focus (WCAG 2.2.2 Pause, Stop, Hide).
    if (hero) {
      hero.addEventListener('mouseenter', function () { paused = true; });
      hero.addEventListener('mouseleave', function () { paused = false; });
      hero.addEventListener('focusin', function () { paused = true; });
      hero.addEventListener('focusout', function () { paused = false; });
    }
  });

  /* ---------- Marquee: duplicate the row for a seamless loop ---------- */
  run('marquee', function () {
    var track = document.getElementById('marquee-track');
    if (!track || track.dataset.cloned === '1') return;
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (node) {
      track.appendChild(node.cloneNode(true));
    });
    track.dataset.cloned = '1';
  });

  /* ---------- SmartImg: fade in on load, soft fallback on error ---------- */
  run('smart-images', function () {
    document.querySelectorAll('.simg').forEach(function (wrap) {
      var img = wrap.querySelector('.simg-img');
      var fb = wrap.querySelector('.simg-fallback');
      if (!img) return;
      var ok = function () {
        img.classList.add('simg-img-ok');
        if (fb) fb.classList.add('simg-ok');
      };
      var err = function () {
        img.classList.add('simg-img-err');
      };
      if (img.complete) {
        if (img.naturalWidth > 0) ok(); else err();
      }
      img.addEventListener('load', ok);
      img.addEventListener('error', err);
    });
  });

  /* ---------- Scroll reveals (IntersectionObserver) ---------- */
  run('reveals', function () {
    var selector = '.sec-head, .ev-row, .how-left, .how-media, .pkg2-card, .bd-cell, .foot-cta';
    var nodes = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!nodes.length) return;

    var revealAll = function () {
      nodes.forEach(function (n) { n.classList.add('is-shown'); });
    };

    // No observer support (very old browsers) → just show everything.
    if (!('IntersectionObserver' in window)) { revealAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-shown');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    nodes.forEach(function (n) {
      // Anything already in view on load (above the fold) shows immediately.
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) n.classList.add('is-shown');
      else io.observe(n);
    });

    // Last-resort failsafe: if something keeps content hidden, reveal after 4s.
    setTimeout(revealAll, 4000);
  });

  /* ---------- Sticky mobile booking bar (slides up past the hero) ---------- */
  run('bookbar', function () {
    var bar = document.getElementById('bookbar');
    if (!bar) return;
    var hero = document.querySelector('.hero') || document.querySelector('.page-hero');
    var onScroll = function () {
      var trigger = hero ? hero.offsetHeight * 0.6 : 480;
      bar.classList.toggle('is-on', window.scrollY > trigger);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });

  /* ---------- Analytics: fire GA4 events on booking / contact clicks ---------- */
  /* Safe no-op until a GA4 Measurement ID is activated in the page <head>. */
  run('analytics-events', function () {
    var track = function (name, params) {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    };
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('checkcherry.com') !== -1) track('book_click', { location: a.getAttribute('data-loc') || 'link' });
      else if (href.indexOf('tel:') === 0) track('call_click');
      else if (href.indexOf('mailto:') === 0) track('email_click');
    }, true);
  });

})();
