(function () {
  'use strict';

  var CONTACT_EMAIL = 'info@jovaingenieria.com.ar';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LANG = document.documentElement.lang.indexOf('en') === 0 ? 'en' : 'es';

  // Textos que genera el script, en ambos idiomas
  var TEXT = {
    es: {
      locale: 'es-AR',
      openMenu: 'Abrir menú',
      closeMenu: 'Cerrar menú',
      invalid: 'Revise los campos marcados.',
      opening: 'Abriendo su correo para enviar la consulta…',
      subject: 'Consulta web: ',
      name: 'Nombre', company: 'Empresa', email: 'Email', phone: 'Teléfono', type: 'Tipo de proyecto'
    },
    en: {
      locale: 'en-US',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      invalid: 'Please check the highlighted fields.',
      opening: 'Opening your email app to send the inquiry…',
      subject: 'Website inquiry: ',
      name: 'Name', company: 'Company', email: 'Email', phone: 'Phone', type: 'Project type'
    }
  }[LANG];

  // Equivalencia de secciones entre idiomas, para conservar la posición al cambiar
  var SECTION_MAP = {
    inicio: 'home', servicios: 'services', sectores: 'sectors', trayectoria: 'track-record',
    equipo: 'team', 'por-que': 'why-jova', suministros: 'supplies', contacto: 'contact'
  };

  // Selector de idioma: guarda la elección y mantiene la sección actual
  document.querySelectorAll('[data-lang]').forEach(function (link) {
    link.addEventListener('click', function () {
      var target = link.dataset.lang;
      try { localStorage.setItem('jova-lang', target); } catch (e) { /* almacenamiento no disponible */ }
      var hash = location.hash.slice(1);
      if (!hash) return;
      var mapped = hash;
      Object.keys(SECTION_MAP).forEach(function (es) {
        if (target === 'en' && hash === es) mapped = SECTION_MAP[es];
        if (target === 'es' && hash === SECTION_MAP[es]) mapped = es;
      });
      link.href = link.href.split('#')[0] + '#' + mapped;
    });
  });

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
    toggle.setAttribute('aria-label', open ? TEXT.closeMenu : TEXT.openMenu);
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
  var revealTargets = document.querySelectorAll('.section__head, .service, .sector, .project, .reason, .supplies li, .member__copy, .founder__photo, .form');
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
  var formatter = new Intl.NumberFormat(TEXT.locale);
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
      status.textContent = TEXT.invalid;
      return;
    }
    var d = new FormData(form);
    var subject = TEXT.subject + d.get('tipo') + (d.get('empresa') ? ' — ' + d.get('empresa') : '');
    var body = [
      TEXT.name + ': ' + d.get('nombre'),
      TEXT.company + ': ' + (d.get('empresa') || '-'),
      TEXT.email + ': ' + d.get('email'),
      TEXT.phone + ': ' + (d.get('telefono') || '-'),
      TEXT.type + ': ' + d.get('tipo'),
      '',
      d.get('mensaje')
    ].join('\n');
    window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = TEXT.opening;
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
