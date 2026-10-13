(function () {
  'use strict';

  var CONTACT_EMAIL = 'info@jovaingenieria.com.ar';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header con fondo al hacer scroll
  var header = document.getElementById('header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // Enlace activo según la sección visible
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a:not(.btn)'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) {
      var section = document.querySelector(a.getAttribute('href'));
      if (section) spy.observe(section);
    });
  }

  // Aparición progresiva
  var revealTargets = document.querySelectorAll('.section__head, .service, .sector, .project, .reason, .supplies li, .founder__copy, .founder__photo, .form');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(function (el) { el.classList.add('reveal'); revealer.observe(el); });
  }

  // Contadores de indicadores
  var formatter = new Intl.NumberFormat('es-AR');
  function renderCount(el, value) {
    el.textContent = (el.dataset.prefix || '') + formatter.format(value) + (el.dataset.suffix || '');
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = Number(el.dataset.count);
        var start = performance.now();
        var duration = 1400;
        (function tick(now) {
          var t = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          renderCount(el, Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        })(start);
        counterObserver.unobserve(el);
      });
    }, { threshold: .6 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  // Filtro de trayectoria
  var filters = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.dataset.filter;
      filters.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      projects.forEach(function (p) {
        p.classList.toggle('is-hidden', value !== 'all' && p.dataset.sector !== value);
      });
    });
  });

  // Formulario: arma un email con los datos (sin servidor).
  // Para recibir los mensajes sin abrir el cliente de correo, conectar un servicio
  // como Formspree o un endpoint propio y reemplazar este bloque.
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      var ok = field.value.trim() !== '' && (field.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value.trim()));
      field.setAttribute('aria-invalid', String(!ok));
      if (!ok) valid = false;
    });
    if (!valid) {
      status.textContent = 'Revise los campos marcados.';
      return;
    }
    var d = new FormData(form);
    var subject = 'Consulta web: ' + d.get('tipo') + (d.get('empresa') ? ' — ' + d.get('empresa') : '');
    var body = [
      'Nombre: ' + d.get('nombre'),
      'Empresa: ' + (d.get('empresa') || '-'),
      'Email: ' + d.get('email'),
      'Teléfono: ' + (d.get('telefono') || '-'),
      'Tipo de proyecto: ' + d.get('tipo'),
      '',
      d.get('mensaje')
    ].join('\n');
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Abriendo su correo para enviar la consulta…';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
