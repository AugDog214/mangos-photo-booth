/* ============================================================
   Mango's Photo Booth & Entertainment — site behavior
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
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paused = !!reduce;

    var syncSlideMedia = function () {
      slides.forEach(function (slide, k) {
        var video = slide.querySelector('video');
        if (!video) return;
        if (k !== i || paused || reduce) {
          video.pause();
          if (k !== i) video.currentTime = 0;
          return;
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(function () {});
      });
    };

    var show = function (n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      dots.forEach(function (d, k) {
        var on = k === i;
        d.classList.toggle('is-active', on);
        d.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      syncSlideMedia();
    };

    // Respect reduced-motion: don't auto-advance at all (dots still work).
    var timer = null;
    var start = function () { if (!reduce) timer = setInterval(function () { if (!paused) show(i + 1); }, 5200); };
    var restart = function () { if (timer) { clearInterval(timer); timer = null; } start(); };
    show(0);
    start();

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        show(parseInt(d.getAttribute('data-i'), 10) || 0);
        restart();
      });
    });

    // Pause auto-advance on hover/focus (WCAG 2.2.2 Pause, Stop, Hide).
    if (hero) {
      var setPaused = function (next) { paused = next || !!reduce; syncSlideMedia(); };
      hero.addEventListener('mouseenter', function () { setPaused(true); });
      hero.addEventListener('mouseleave', function () { setPaused(false); });
      hero.addEventListener('focusin', function () { setPaused(true); });
      hero.addEventListener('focusout', function () { setPaused(false); });
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

  /* ---------- Event videos: play only while visible ---------- */
  run('event-videos', function () {
    var videos = Array.prototype.slice.call(document.querySelectorAll('.brick-video video, .memory-feature video'));
    if (!videos.length) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var setPlaying = function (video, shouldPlay) {
      if (!shouldPlay || reduce) { video.pause(); return; }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') playPromise.catch(function () {});
    };
    if (!('IntersectionObserver' in window)) {
      videos.forEach(function (video) { setPlaying(video, true); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { setPlaying(entry.target, entry.isIntersecting); });
    }, { threshold: 0.25 });
    videos.forEach(function (video) { io.observe(video); });
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

  /* ---------- Analytics: send UI engagement and conversion intent to GA4 ---------- */
  run('analytics-events', function () {
    var track = function (name, params) {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    };

    var sectionFor = function (node) {
      var section = node && node.closest ? node.closest('[data-analytics-section]') : null;
      return section ? section.getAttribute('data-analytics-section') : 'site-wide';
    };

    var locationFor = function (link) {
      var explicit = link.getAttribute('data-loc');
      if (explicit) return explicit;
      if (link.closest('#site-header')) return 'header';
      if (link.closest('#contact')) return 'footer';
      return sectionFor(link);
    };

    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var location = locationFor(a);
      var sectionName = sectionFor(a);
      var action = a.getAttribute('data-analytics-action');

      if (action) {
        track('cta_click', {
          cta_name: action,
          location: location,
          section_name: sectionName
        });
      }

      if (href.indexOf('checkcherry.com') !== -1) {
        track('book_click', { location: location, section_name: sectionName });
      } else if (href.indexOf('tel:') === 0) {
        track('call_click', { location: location, section_name: sectionName });
      } else if (href.indexOf('mailto:') === 0) {
        track('email_click', { location: location, section_name: sectionName });
      }
    }, true);

    document.querySelectorAll('.faq-item').forEach(function (item, index) {
      item.addEventListener('toggle', function () {
        if (!item.open) return;
        var summary = item.querySelector('summary');
        track('faq_open', {
          faq_index: index + 1,
          faq_question: summary ? summary.textContent.trim().slice(0, 100) : 'unknown',
          section_name: sectionFor(item)
        });
      });
    });

    var scrollThresholds = [25, 50, 75, 90];
    var sentScrollDepths = {};
    var measureScrollDepth = function () {
      var root = document.documentElement;
      var scrollable = Math.max(0, root.scrollHeight - window.innerHeight);
      var percent = scrollable ? Math.round((window.scrollY / scrollable) * 100) : 100;
      scrollThresholds.forEach(function (threshold) {
        if (percent >= threshold && !sentScrollDepths[threshold]) {
          sentScrollDepths[threshold] = true;
          track('scroll_depth', { scroll_percent: threshold });
        }
      });
    };

    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-analytics-section]'));
    var sectionState = sections.map(function (element, index) {
      return {
        element: element,
        name: element.getAttribute('data-analytics-section'),
        position: index + 1,
        activeSince: null,
        exposureCount: 0,
        viewed: false
      };
    });

    var isMeaningfullyVisible = function (element) {
      var rect = element.getBoundingClientRect();
      var visiblePixels = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      var requiredPixels = Math.min(240, window.innerHeight * 0.35, rect.height * 0.5);
      return visiblePixels >= requiredPixels;
    };

    var stopSectionTimer = function (state, now) {
      if (state.activeSince === null) return;
      var seconds = Math.round(((now - state.activeSince) / 1000) * 10) / 10;
      state.activeSince = null;
      if (seconds < 1) return;
      state.exposureCount += 1;
      track('section_engagement', {
        section_name: state.name,
        section_position: state.position,
        section_time_seconds: seconds,
        exposure_index: state.exposureCount
      });
    };

    var measureSections = function () {
      var now = window.performance && performance.now ? performance.now() : Date.now();
      var pageVisible = document.visibilityState !== 'hidden';
      sectionState.forEach(function (state) {
        var visible = pageVisible && isMeaningfullyVisible(state.element);
        if (visible && state.activeSince === null) state.activeSince = now;
        else if (!visible) stopSectionTimer(state, now);
        if (visible && !state.viewed && now - state.activeSince >= 1000) {
          state.viewed = true;
          track('section_view', {
            section_name: state.name,
            section_position: state.position
          });
        }
      });
    };

    var framePending = false;
    var measurePage = function () {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(function () {
        framePending = false;
        measureScrollDepth();
        measureSections();
      });
    };

    window.addEventListener('scroll', measurePage, { passive: true });
    window.addEventListener('resize', measurePage);
    document.addEventListener('visibilitychange', measurePage);
    setInterval(measureSections, 250);
    window.addEventListener('pagehide', function () {
      var now = window.performance && performance.now ? performance.now() : Date.now();
      sectionState.forEach(function (state) { stopSectionTimer(state, now); });
    });
    measurePage();
  });

})();
