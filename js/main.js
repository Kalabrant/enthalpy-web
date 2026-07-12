/* ============================================================
   ENTHALPY, C.A. — interacciones
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: sombra al hacer scroll ---------- */
  var nav = document.getElementById('nav');
  var onScroll = function () {
    nav.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Nav móvil ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Lente térmica del héroe ---------- */
  var hero = document.querySelector('.hero');
  var media = document.getElementById('heroMedia');
  var lensRaf = null;

  function setLens(xPct, yPct) {
    media.style.setProperty('--lx', xPct + '%');
    media.style.setProperty('--ly', yPct + '%');
  }

  if (!reduceMotion) {
    var hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (hasFinePointer) {
      hero.addEventListener('pointermove', function (e) {
        if (lensRaf) return;
        lensRaf = requestAnimationFrame(function () {
          var r = hero.getBoundingClientRect();
          setLens(
            Math.round(((e.clientX - r.left) / r.width) * 1000) / 10,
            Math.round(((e.clientY - r.top) / r.height) * 1000) / 10
          );
          lensRaf = null;
        });
      });
    } else {
      /* Táctil: deriva ambiental lenta de la lente */
      var t = 0;
      (function drift() {
        t += 0.004;
        setLens(62 + Math.sin(t) * 18, 40 + Math.cos(t * 0.8) * 12);
        requestAnimationFrame(drift);
      })();
    }
  }

  /* ---------- Reveal on scroll (con escalonado por grupo) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var parent = el.parentElement;
        var siblings = parent
          ? Array.prototype.filter.call(parent.children, function (c) {
              return c.classList && c.classList.contains('reveal');
            })
          : [el];
        var idx = siblings.indexOf(el);
        el.style.setProperty('--reveal-delay', Math.min(idx > 0 ? idx * 60 : 0, 360) + 'ms');
        el.classList.add('in');
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Filtros de galería ---------- */
  var filterBtns = Array.prototype.slice.call(document.querySelectorAll('.filter'));
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');

      tiles.forEach(function (tile) {
        var show = f === 'all' || tile.getAttribute('data-cat') === f;
        if (show && tile.classList.contains('is-hidden')) {
          tile.classList.remove('is-hidden');
          if (!reduceMotion) {
            tile.classList.add('is-entering');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () { tile.classList.remove('is-entering'); });
            });
          }
        } else if (!show) {
          tile.classList.add('is-hidden');
        }
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCaption = document.getElementById('lbCaption');
  var current = 0;

  function visibleTiles() {
    return tiles.filter(function (t) { return !t.classList.contains('is-hidden'); });
  }

  function openLightbox(tile) {
    var vis = visibleTiles();
    current = vis.indexOf(tile);
    showTile(vis[current]);
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  }

  function showTile(tile) {
    if (!tile) return;
    var img = tile.querySelector('img');
    var title = tile.querySelector('.tile__title');
    var cat = tile.querySelector('.tile__cat');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = (cat ? cat.textContent + ' — ' : '') + (title ? title.textContent : '');
  }

  function step(dir) {
    var vis = visibleTiles();
    current = (current + dir + vis.length) % vis.length;
    showTile(vis[current]);
  }

  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () { openLightbox(tile); });
    tile.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(tile);
      }
    });
  });

  document.getElementById('lbClose').addEventListener('click', function () { lightbox.close(); });
  document.getElementById('lbPrev').addEventListener('click', function () { step(-1); });
  document.getElementById('lbNext').addEventListener('click', function () { step(1); });
  lightbox.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
  /* Cerrar al hacer clic fuera de la imagen */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) lightbox.close();
  });

  /* ---------- Chips de cotización → enlace de WhatsApp ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var waQuote = document.getElementById('waQuote');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('is-active'); });
      chip.classList.add('is-active');
      var service = chip.getAttribute('data-service');
      waQuote.href = 'https://wa.me/584246741108?text=' +
        encodeURIComponent('Hola Enthalpy, quiero una cotización de: ' + service + '.');
    });
  });

  /* ---------- Barra de progreso térmica ---------- */
  var progress = document.getElementById('progress');
  var progressRaf = null;
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
  }
  window.addEventListener('scroll', function () {
    if (progressRaf) return;
    progressRaf = requestAnimationFrame(function () {
      updateProgress();
      /* Parallax del héroe: la escena se queda atrás a 1/3 de la velocidad */
      if (!reduceMotion && window.scrollY < window.innerHeight * 1.2) {
        media.style.setProperty('--parallax', (window.scrollY * 0.33).toFixed(1) + 'px');
      }
      progressRaf = null;
    });
  }, { passive: true });
  updateProgress();

  /* ---------- Reel de clientes: arrastrar para explorar ---------- */
  var reel = document.getElementById('reel');
  if (reel) {
    var dragging = false, startX = 0, startScroll = 0, moved = 0;
    reel.addEventListener('pointerdown', function (e) {
      dragging = true; moved = 0;
      startX = e.clientX;
      startScroll = reel.scrollLeft;
      reel.setPointerCapture(e.pointerId);
      reel.classList.add('is-dragging');
    });
    reel.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      reel.scrollLeft = startScroll - dx;
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      reel.addEventListener(ev, function () {
        dragging = false;
        reel.classList.remove('is-dragging');
      });
    });
    /* Teclado: flechas desplazan el reel */
    reel.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { reel.scrollBy({ left: 300, behavior: 'smooth' }); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { reel.scrollBy({ left: -300, behavior: 'smooth' }); e.preventDefault(); }
    });

    /* El video se reproduce solo mientras está a la vista */
    var reelVideo = reel.querySelector('video');
    if (reelVideo && 'IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = reelVideo.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            reelVideo.pause();
          }
        });
      }, { threshold: 0.35 });
      vio.observe(reelVideo);
    }
  }

  /* ---------- Resaltar sección activa en el nav ---------- */
  var sections = ['servicios', 'proyectos', 'clientes', 'nosotros', 'contacto']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);
  var navAnchors = Array.prototype.slice.call(links.querySelectorAll('a:not(.btn)'));

  if ('IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { navIo.observe(s); });
  }
})();
