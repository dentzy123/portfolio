/* ══════════════════════════════════════════════════════════
   PORTFOLIO — vanilla JS
══════════════════════════════════════════════════════════ */

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

/* ── Typing effect ── */
const typedEl    = document.getElementById('typedText');
const phrases    = [
  'Frontend Developer.',
  'UI/UX Designer.',
  'Mobile App Builder.',
  'Problem Solver.',
];
let phraseIndex  = 0;
let charIndex    = 0;
let isDeleting   = false;
const TYPE_SPEED = 70;
const DEL_SPEED  = 40;
const PAUSE      = 1800;

function type() {
  const current = phrases[phraseIndex];

  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, PAUSE);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting   = false;
      phraseIndex  = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(type, isDeleting ? DEL_SPEED : TYPE_SPEED);
}

type();

/* ── Project filter ── */
const filterBtns  = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.classList.remove('hidden');
        // Tiny stagger re-entry animation
        card.style.animation = 'none';
        card.offsetHeight;                           // force reflow
        card.style.animation = 'revealCard 0.45s var(--ease) forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── Skill bars animate on scroll ── */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

/* ── Generic scroll-reveal ── */
const revealEls = document.querySelectorAll(
  '.section-heading, .section-label, .about-grid, .skill-category, ' +
  '.project-card, .contact-grid, .stats-row, .filter-bar'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings by DOM order within parent
      const siblings = Array.from(entry.target.parentElement.children)
        .filter(c => c.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Contact form ── */
const form         = document.getElementById('contactForm');
const submitBtn    = document.getElementById('submitBtn');
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

  // Simulate send
  submitBtn.disabled  = true;
  submitBtn.innerHTML = '<span class="btn-text">Sending…</span>';

  setTimeout(() => {
    form.reset();
    submitBtn.disabled  = false;
    submitBtn.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-icon">→</span>';
    showFeedback('Message sent! I\'ll get back to you soon.', 'success');
  }, 1400);
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

/* ── Card keyframe injection ── */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes revealCard {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
`;
document.head.appendChild(styleSheet);

/* Calculator modal + logic */
(function () {
  const openCalcBtns = document.querySelectorAll('.open-calculator');
  const calcModal = document.getElementById('calcModal');
  const calcOverlay = document.getElementById('calcOverlay');
  const calcClose = document.getElementById('calcClose');
  const calcDisplay = document.getElementById('calcDisplay');
  if (!calcModal) return;

  let calcEquation = '';

  function openCalc() {
    calcModal.classList.add('open');
    calcModal.setAttribute('aria-hidden', 'false');
    calcEquation = '';
    updateCalcDisplay();
    document.body.style.overflow = 'hidden';
  }

  function closeCalc() {
    calcModal.classList.remove('open');
    calcModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openCalcBtns.forEach(b => b.addEventListener('click', openCalc));
  calcClose.addEventListener('click', closeCalc);
  calcOverlay.addEventListener('click', closeCalc);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && calcModal.classList.contains('open')) closeCalc();
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
