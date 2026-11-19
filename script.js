/* ══════════════════════════════════════════════════════════
   PORTFOLIO — vanilla JS
══════════════════════════════════════════════════════════ */

/* ── Theme Switcher (Light & Dark) ── */
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      themeToggle.setAttribute('title', 'Switch to dark theme');
    }
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
      themeToggle.setAttribute('title', 'Switch to light theme');
    }
  }
  try { localStorage.setItem('theme', theme); } catch {}
}

// Initialize theme from storage
let currentStoredTheme = 'dark';
try { currentStoredTheme = localStorage.getItem('theme') || 'dark'; } catch {}
applyTheme(currentStoredTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const targetTheme = isLight ? 'dark' : 'light';
    applyTheme(targetTheme);
  });
}

/* ── Navbar: scroll class & active link ── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function onScroll() {
  // Sticky glass style after 40px
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  // Highlight active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile nav toggle ── */
const navToggle   = document.getElementById('navToggle');
const navLinkList = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const open = navLinkList.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

// Close on link click (mobile)
navLinkList.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinkList.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinkList.classList.contains('open')) {
    navLinkList.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

/* ── Project filter ── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('#projectsGrid .project-card');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function filterProjects(filter) {
  filterBtns.forEach(btn => {
    const active = btn.dataset.filter === filter;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach(card => {
    card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
  });
}

filterProjects('all');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => filterProjects(btn.dataset.filter));
});

document.querySelector('.explore-work')?.addEventListener('click', () => {
  filterProjects('all');
});

/* The HTML Projects grid is the single source of project content and links.
   Keeping it in HTML also makes the full portfolio usable without JavaScript. */
const projects = Array.from(projectCards, (card, index) => {
  if (!card.id) {
    let id = `project-${index + 1}`;
    while (document.getElementById(id)) id += '-card';
    card.id = id;
  }
  card.tabIndex = -1;
  const heading = card.querySelector('.project-title').cloneNode(true);
  heading.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove());
  const image = card.querySelector('.project-preview-img');
  return {
    card,
    title: heading.textContent.trim(),
    description: card.querySelector('.project-desc')?.textContent.trim() || '',
    image: image?.getAttribute('src'),
    href: `#${card.id}`
  };
});

/* ── Manual hero project showcase ── */
(function () {
  const container = document.getElementById('showcaseSlides');
  if (!container || !projects.length) return;
  const counter = document.getElementById('showcaseCounter');
  const status = document.getElementById('showcaseStatus');
  const previous = document.getElementById('previousProject');
  const next = document.getElementById('nextProject');
  let current = 0;
  let transition;

  const slides = projects.map((project, index) => {
    const slide = document.createElement('div');
    slide.className = 'showcase-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${index + 1} of ${projects.length}`);

    if (project.image) {
      const image = document.createElement('img');
      image.className = 'showcase-thumbnail';
      image.src = project.image;
      image.alt = ''; // The adjacent title identifies this decorative thumbnail.
      image.width = 80;
      image.height = 56;
      image.decoding = 'async';
      image.addEventListener('error', () => image.remove(), { once: true });
      slide.append(image);
    }

    const heading = document.createElement('h2');
    heading.className = 'showcase-title';
    const link = document.createElement('a');
    link.href = project.href;
    link.textContent = project.title;
    link.addEventListener('click', () => {
      if (project.card.classList.contains('hidden')) filterProjects('all');
      project.card.focus({ preventScroll: true });
    });
    heading.append(link);
    const description = document.createElement('p');
    description.className = 'showcase-description';
    description.textContent = project.description;
    slide.append(heading, description);
    return slide;
  });
  container.replaceChildren(...slides);

  function showProject(index, direction = 0) {
    transition?.cancel();
    current = (index + projects.length) % projects.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.inert = !active;
      slide.setAttribute('aria-hidden', String(!active));
    });
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(projects.length).padStart(2, '0')}`;
    if (direction) status.textContent = `${projects[current].title}, project ${current + 1} of ${projects.length}`;
    if (direction && !reducedMotion.matches) {
      transition = slides[current].animate([
        { opacity: 0, transform: `translateX(${-direction * 8}px)` },
        { opacity: 1, transform: 'translateX(0)' }
      ], { duration: 220, easing: 'ease-out' });
    }
  }

  previous.addEventListener('click', () => showProject(current - 1, -1));
  next.addEventListener('click', () => showProject(current + 1, 1));
  // Native buttons support Tab, Enter and Space. Focus stays on the used control.
  previous.disabled = next.disabled = projects.length < 2;
  container.closest('.project-showcase').querySelector('.showcase-controls').hidden = false;
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) transition?.cancel();
  });
  showProject(0);
})();

// Portrait outline and CTA motion are CSS-only, with reduced-motion fallbacks.

/* ── Contact form ── */
const form         = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

form.addEventListener('submit', e => {
  e.preventDefault();

  // Basic client-side validation
  let valid = true;
  ['name', 'email', 'message'].forEach(id => {
    const field = document.getElementById(id);
    if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    } else {
      field.classList.remove('error');
    }
  });

  const emailField = document.getElementById('email');
  const emailRe    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailField.value.trim() && !emailRe.test(emailField.value.trim())) {
    emailField.classList.add('error');
    valid = false;
  }

  if (!valid) {
    showFeedback('Please fill in all fields correctly.', 'error-msg');
    return;
  }

  const name = document.getElementById('name').value.trim();
  const email = emailField.value.trim();
  const message = document.getElementById('message').value.trim();
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:dcurtivo15@gmail.com?subject=${subject}&body=${body}`;
  showFeedback('Your email draft is ready. Send it in your email app, or email dcurtivo15@gmail.com directly.', 'success');
});

// Remove error state on input
form.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('input', () => {
    field.classList.remove('error');
    formFeedback.textContent = '';
    formFeedback.className   = 'form-feedback';
  });
});

function showFeedback(msg, cls) {
  formFeedback.textContent = msg;
  formFeedback.className   = 'form-feedback ' + cls;
  setTimeout(() => {
    formFeedback.textContent = '';
    formFeedback.className   = 'form-feedback';
  }, 5000);
}

/* Calculator modal + logic */
(function () {
  const openCalcBtns = document.querySelectorAll('.open-calculator');
  const calcModal = document.getElementById('calcModal');
  const calcOverlay = document.getElementById('calcOverlay');
  const calcClose = document.getElementById('calcClose');
  const calcDisplay = document.getElementById('calcDisplay');
  if (!calcModal) return;

  let calcEquation = '';
  let previousFocus;

  function openCalc() {
    previousFocus = document.activeElement;
    calcModal.classList.add('open');
    calcModal.setAttribute('aria-hidden', 'false');
    calcEquation = '';
    updateCalcDisplay();
    document.body.style.overflow = 'hidden';
    calcClose.focus();
    document.querySelector('main').inert = true;
    document.querySelector('nav').inert = true;
    document.querySelector('footer').inert = true;
  }

  function closeCalc() {
    calcModal.classList.remove('open');
    calcModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.querySelector('main').inert = false;
    document.querySelector('nav').inert = false;
    document.querySelector('footer').inert = false;
    previousFocus?.focus();
  }

  openCalcBtns.forEach(b => b.addEventListener('click', openCalc));
  calcClose.addEventListener('click', closeCalc);
  calcOverlay.addEventListener('click', closeCalc);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && calcModal.classList.contains('open')) closeCalc();
    if (e.key === 'Tab' && calcModal.classList.contains('open')) {
      const buttons = [...calcModal.querySelectorAll('button')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  function updateCalcDisplay() {
    calcDisplay.textContent = calcEquation || '0';
  }

  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => handleCalc(btn.dataset.value));
  });

  function handleCalc(val) {
    if (val === 'C') {
      calcEquation = '';
    } else if (val === '±') {
      if (calcEquation.startsWith('-')) calcEquation = calcEquation.slice(1);
      else if (calcEquation) calcEquation = '-' + calcEquation;
    } else if (val === '%') {
      try {
        let v = Function('"use strict";return (' + (calcEquation || '0') + ')')();
        calcEquation = String(v / 100);
      } catch (e) {
        calcEquation = 'Error';
      }
    } else if (val === '=') {
      try {
        // Allow only safe characters
        const safe = calcEquation.replace(/[^0-9+\-*/().%]/g, '');
        let result = Function('"use strict";return (' + safe + ')')();
        calcEquation = Number.isFinite(result) ? String(result) : 'Error';
      } catch (e) {
        calcEquation = 'Error';
      }
    } else {
      if (calcEquation === 'Error' || calcEquation === '0') calcEquation = '';
      calcEquation += val;
    }
    updateCalcDisplay();
  }
})();
