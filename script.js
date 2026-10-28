'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollReveal();
  initScrollSpy();
  initSmoothScroll();
});

/* ---- Theme ---- */
function initTheme() {
  const btn = document.getElementById('themeToggle');
  const moon = btn?.querySelector('.icon-moon');
  const sun = btn?.querySelector('.icon-sun');
  const html = document.documentElement;

  function apply(theme) {
    html.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#121212' : '#f6f2ea');
    if (moon && sun) {
      moon.style.display = theme === 'dark' ? 'none' : '';
      sun.style.display = theme === 'dark' ? '' : 'none';
    }
  }

  apply(html.dataset.theme || 'light');

  btn?.addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch {}
    apply(next);
  });
}

/* ---- Mobile Nav ---- */
function initMobileNav() {
  const menuBtn = document.getElementById('navMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const iconMenu = menuBtn?.querySelector('.icon-menu');
  const iconClose = menuBtn?.querySelector('.icon-close');

  function toggle(open) {
    menu?.classList.toggle('open', open);
    menuBtn?.setAttribute('aria-expanded', open);
    if (iconMenu && iconClose) {
      iconMenu.style.display = open ? 'none' : '';
      iconClose.style.display = open ? '' : 'none';
    }
  }

  menuBtn?.addEventListener('click', () => {
    toggle(!menu?.classList.contains('open'));
  });

  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggle(false));
  });
}

/* ---- Scroll Reveal (IntersectionObserver) ---- */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ---- Scroll Spy ---- */
function initScrollSpy() {
  const links = document.querySelectorAll('[data-spy]');
  if (!links.length) return;

  const sections = [];
  links.forEach(link => {
    const id = link.dataset.spy;
    const el = document.getElementById(id);
    if (el) sections.push({ id, el });
  });

  function update() {
    const y = window.scrollY + 160;
    let active = '';
    for (const s of sections) {
      if (s.el.offsetTop <= y) active = s.id;
    }
    links.forEach(l => l.classList.toggle('active', l.dataset.spy === active));
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---- Smooth Scroll ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
