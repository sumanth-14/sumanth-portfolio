'use strict';

/* =============================================
   Portfolio Script — Sai Sumanth Reddy Kachi
   GSAP-powered animations + portfolio logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initNavbarScroll();
  initTypewriter();
  initActiveNav();
  initSkillsTabs();
  initSmoothScroll();

  // GSAP initialisation (GSAP loaded before this script)
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initHeroAnimation();
    initScrollReveal();
    initCursorGlow();
    initMagneticButtons();
    initParticles();
    initTimelineLineDraw();
    initProjectTilt();
    initCounters();

    // Refresh ScrollTrigger after all assets load
    window.addEventListener('load', () => ScrollTrigger.refresh());
  }
});

/* ---- Theme Toggle ---- */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('i');
  const html = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }

  applyTheme(localStorage.getItem('theme') || 'light');

  themeToggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

/* ---- Mobile Navigation ---- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks?.classList.toggle('open');
  });

  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });
}

/* ---- Navbar Scroll ---- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ---- Typewriter ---- */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  const roles = [
    'AI Engineer',
    'Full-Stack Developer',
    'Multi-Agent Architect',
    'RAG Pipeline Engineer',
    'LLM Systems Builder',
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false, delay = 100;

  function tick() {
    if (!el) return;
    const current = roles[roleIdx];
    if (!isDeleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) { isDeleting = true; delay = 2200; }
      else delay = 80;
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) { isDeleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400; }
      else delay = 40;
    }
    setTimeout(tick, delay);
  }
  tick();
}

/* ---- Active Nav on Scroll ---- */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link[href^="#"]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 140;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + section.offsetHeight) {
        links.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${id}`) l.classList.add('active');
        });
      }
    });
  }, { passive: true });
}

/* ---- Skills Tabs ---- */
function initSkillsTabs() {
  const btns = document.querySelectorAll('.skills-tab-btn');
  const panels = document.querySelectorAll('.skills-tab-panel');

  function activateTab(targetId) {
    btns.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    const btn = document.querySelector(`.skills-tab-btn[data-tab="${targetId}"]`);
    const panel = document.getElementById(`tab-${targetId}`);

    btn?.classList.add('active');
    if (panel) {
      panel.classList.add('active');
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(panel.querySelectorAll('.skill-icon-card'), {
          opacity: 0,
          y: 20,
          scale: 0.88,
        }, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: 'back.out(1.4)',
          clearProps: 'transform',
        });
      }
    }
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // Animate initial tab on load
  if (typeof gsap !== 'undefined') {
    const initial = document.querySelector('.skills-tab-panel.active');
    if (initial) {
      gsap.fromTo(initial.querySelectorAll('.skill-icon-card'), {
        opacity: 0, y: 16, scale: 0.9,
      }, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.35, stagger: 0.04, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: '.skills-tabs', start: 'top 80%', once: true },
      });
    }
  }
}

/* ---- Smooth Scroll ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

/* ================================================
   GSAP ANIMATIONS
   ================================================ */

/* ---- Hero Entrance Animation ---- */
function initHeroAnimation() {
  // Set initial states (hero elements not using .reveal class)
  gsap.set(['.hero-badge', '.hero-title', '.hero-roles', '.hero-desc', '.hero-actions', '.hero-socials'], {
    opacity: 0,
    y: 40,
  });
  gsap.set('.hero-image', { opacity: 0, scale: 0.82 });
  gsap.set('.scroll-indicator', { opacity: 0, y: 16 });
  gsap.set('.navbar', { opacity: 0, y: -60 });

  const tl = gsap.timeline({ delay: 0.15 });

  tl.to('.navbar', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' })
    .to('.hero-badge', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.25')
    .to('.hero-title', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .to('.hero-roles', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.35')
    .to('.hero-desc', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.3')
    .to('.hero-actions', { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, '-=0.25')
    .to('.hero-socials .social-link', {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out',
    }, '-=0.2')
    .to('.hero-image', { opacity: 1, scale: 1, duration: 0.85, ease: 'back.out(1.5)' }, '-=0.55')
    .to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.15');

  // Social links initial state
  gsap.set('.hero-socials .social-link', { opacity: 0, y: 20 });
}

/* ---- Scroll Reveal for Sections ---- */
function initScrollReveal() {
  const defaults = { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' };

  // Generic .reveal elements (section headers, cards, etc.)
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      ...defaults,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
    });
  });

  // About grid — slide from sides
  ScrollTrigger.create({
    trigger: '.about-grid',
    start: 'top 82%',
    onEnter: () => {
      gsap.fromTo('.about-text', { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo('.stat-card', {
        opacity: 0, y: 40, scale: 0.9,
      }, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.55, stagger: 0.1, ease: 'back.out(1.3)',
        delay: 0.2,
      });
    },
    once: true,
  });

  // Timeline items — slide from left
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: item,
          start: 'top 87%',
          toggleActions: 'play none none none',
        },
      });
  });

  // Project cards — stagger upward
  ScrollTrigger.create({
    trigger: '.projects-grid',
    start: 'top 82%',
    onEnter: () => {
      gsap.fromTo('.project-card', {
        opacity: 0, y: 60,
      }, {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      });
    },
    once: true,
  });

  // Education cards
  ScrollTrigger.create({
    trigger: '.education-grid',
    start: 'top 83%',
    onEnter: () => {
      gsap.fromTo('.edu-card', {
        opacity: 0, y: 50, scale: 0.96,
      }, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65, stagger: 0.15, ease: 'power3.out',
      });
    },
    once: true,
  });

  // Recommendation cards
  ScrollTrigger.create({
    trigger: '.recommendations-grid',
    start: 'top 83%',
    onEnter: () => {
      gsap.fromTo('.recommendation-card', {
        opacity: 0, y: 50,
      }, {
        opacity: 1, y: 0, duration: 0.65, stagger: 0.15, ease: 'power3.out',
      });
    },
    once: true,
  });

  // Contact cards
  ScrollTrigger.create({
    trigger: '.contact-cards',
    start: 'top 85%',
    onEnter: () => {
      gsap.fromTo('.contact-card', {
        opacity: 0, y: 30,
      }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out',
      });
    },
    once: true,
  });

  // Hero orb subtle parallax
  gsap.to('.hero-orb--1', {
    y: -80,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2,
    },
  });
  gsap.to('.hero-orb--2', {
    y: -50,
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 3,
    },
  });
}

/* ---- Timeline Line Draw Animation ---- */
function initTimelineLineDraw() {
  const fill = document.getElementById('timelineLineFill');
  if (!fill) return;

  gsap.to(fill, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 65%',
      end: 'bottom 55%',
      scrub: 1.2,
    },
  });
}

/* ---- GSAP Stat Counters ---- */
function initCounters() {
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = target % 1 !== 0
              ? this.targets()[0].val.toFixed(1)
              : Math.floor(this.targets()[0].val);
          },
        });
      },
    });
  });
}

/* ---- Custom Cursor Glow ---- */
function initCursorGlow() {
  const cursor = document.getElementById('cursorGlow');
  if (!cursor) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  cursor.style.display = 'block';

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  gsap.ticker.add(() => {
    gsap.set(cursor, { x: mx - 14, y: my - 14 });
  });

  document.querySelectorAll('a, button, .project-card, .skill-icon-card, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(cursor, { scale: 2.2, opacity: 0.5, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
    });
  });
}

/* ---- Magnetic Button Effect ---- */
function initMagneticButtons() {
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.45,
        ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.55)',
      });
    });
  });
}

/* ---- Floating Particles in Hero ---- */
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = window.innerWidth > 768 ? 28 : 12;

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('div');
    dot.classList.add('particle');
    container.appendChild(dot);

    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 3 + 1.5;
    const dur = Math.random() * 6 + 5;
    const driftX = (Math.random() - 0.5) * 120;
    const driftY = -(Math.random() * 140 + 60);

    gsap.set(dot, {
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      opacity: Math.random() * 0.35 + 0.08,
    });

    gsap.to(dot, {
      x: driftX,
      y: driftY,
      opacity: 0,
      duration: dur,
      ease: 'power1.inOut',
      delay: Math.random() * dur,
      repeat: -1,
      onRepeat: function () {
        gsap.set(dot, {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 30 + 70}%`,
          x: 0,
          y: 0,
          opacity: Math.random() * 0.35 + 0.08,
        });
      },
    });
  }
}

/* ---- Project Card 3D Tilt (GSAP) ---- */
function initProjectTilt() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        translateZ: 20,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000,
        transformOrigin: 'center center',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        translateZ: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.6)',
        clearProps: 'transform',
      });
    });
  });

  // Skill card subtle tilt
  document.querySelectorAll('.skill-icon-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 12,
        rotateX: -y * 12,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 600,
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.6)',
        clearProps: 'transform',
      });
    });
  });
}
