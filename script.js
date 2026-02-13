/* ============================================
   PORTFOLIO - Sai Sumanth Reddy Kachi
   JavaScript Interactions & Animations
   ============================================ */

// ---------- Cursor Glow Effect ----------
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  if (cursorGlow) {
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
  }
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ---------- Navbar Scroll Effect ----------
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---------- Mobile Navigation ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ---------- Typewriter Effect ----------
const typewriterEl = document.getElementById('typewriter');
const roles = [
  'Full-Stack Engineer',
  'MERN Stack Developer',
  'AI Integration Specialist',
  'Cloud Architecture Enthusiast',
  'System Design Thinker'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typeWriter() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    typewriterEl.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else {
      typeSpeed = 80;
    }
  } else {
    typewriterEl.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 400; // Pause before next word
    } else {
      typeSpeed = 40;
    }
  }

  setTimeout(typeWriter, typeSpeed);
}

// Start typewriter after initial animation
setTimeout(typeWriter, 1500);

// ---------- Scroll Reveal Animation ----------
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation for siblings
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((sibling, i) => {
        if (sibling === entry.target) {
          delay = i * 100;
        }
      });
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ---------- Counter Animation ----------
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const start = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - start;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function (ease-out-expo)
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = Math.floor(eased * target);

          counter.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        }

        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

animateCounters();

// ---------- Active Nav Link on Scroll ----------
const sections = document.querySelectorAll('.section, .hero');
const navLinksAll = document.querySelectorAll('.nav-link:not(.nav-link--cta)');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--text-primary)';
        } else {
          link.style.color = '';
        }
      });
    }
  });
}, {
  threshold: 0.3,
  rootMargin: '-100px 0px -50% 0px'
});

sections.forEach(section => sectionObserver.observe(section));

// ---------- Smooth Scroll for Nav Links ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ---------- Skill Pill Hover Tilt ----------
document.querySelectorAll('.skill-pill').forEach(pill => {
  pill.addEventListener('mouseenter', function() {
    const randomRotate = (Math.random() - 0.5) * 4;
    this.style.transform = `translateY(-2px) rotate(${randomRotate}deg)`;
  });
  pill.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// ---------- Project Card Parallax Glow ----------
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

// ---------- Prefer Reduced Motion ----------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('revealed');
  });
  // Disable cursor glow
  if (cursorGlow) cursorGlow.style.display = 'none';
}

// ---------- Console Easter Egg ----------
console.log(
  '%c🚀 Hey there! Looking at the code? Nice! Reach out at saisumanthreddy216@gmail.com',
  'color: #6c63ff; font-size: 14px; font-weight: bold;'
);
