/**
 * ============================================================
 * GESTIÓN INTEGRAL CÍA. LTDA.
 * script.js — Premium Interactions v2.0
 * ============================================================
 */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ============================================================
   1. PAGE LOADER
   ============================================================ */
function initLoader() {
  const loader = $('#pageLoader');
  const progress = $('#loaderProgress');
  if (!loader || !progress) return;

  let w = 0;
  const interval = setInterval(() => {
    w += Math.random() * 18 + 5;
    if (w >= 95) { w = 95; clearInterval(interval); }
    progress.style.width = w + '%';
  }, 80);

  window.addEventListener('load', () => {
    clearInterval(interval);
    progress.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
      initCounters();
      initHeroCounters();
    }, 400);
  });

  document.body.style.overflow = 'hidden';
}

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  const cursor = $('#cursor');
  const follower = $('#cursorFollower');
  if (!cursor || !follower) return;
  if (!window.matchMedia('(hover: hover)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function follow() {
    fx += (mx - fx) * .12;
    fy += (my - fy) * .12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    rafId = requestAnimationFrame(follow);
  }
  follow();

  const hoverEls = $$('a, button, .scard, .rcard, .tbn, .pcard, .citem, .logo-pill');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor--hover');
      follower.classList.add('cursor-follower--hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor--hover');
      follower.classList.remove('cursor-follower--hover');
    });
  });

  document.addEventListener('mouseleave', () => { follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { follower.style.opacity = '1'; });
}

/* ============================================================
   3. NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = $('#navbar');
  const toggle = $('#navToggle');
  const overlay = $('#mobileOverlay');
  if (!navbar) return;

  let lastY = 0, ticking = false;

  function onScroll() {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', lastY > 30);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMobile() {
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('open');
    overlay.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  $$('.mobile-link').forEach(a => a.addEventListener('click', closeMobile));

  document.addEventListener('click', e => {
    if (overlay.classList.contains('open') && !overlay.contains(e.target) && !toggle.contains(e.target)) closeMobile();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeMobile();
  });
}

/* ============================================================
   4. SCROLL REVEAL — IntersectionObserver
   ============================================================ */
function initScrollReveal() {
  const targets = $$('[data-aos]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.aosDelay || 0;
        e.target.style.transitionDelay = delay + 'ms';
        e.target.classList.add('aos-in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   5. COUNTERS — hero card
   ============================================================ */
function initHeroCounters() {
  const els = $$('.hcard-num[data-count]');
  els.forEach(el => animateCount(el, parseInt(el.dataset.count)));
}

function initCounters() {
  const els = $$('[data-count]');
  const seen = new Set();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !seen.has(e.target)) {
        seen.add(e.target);
        const target = parseInt(e.target.dataset.count);
        animateCount(e.target, target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .4 });

  els.forEach(el => observer.observe(el));
}

function animateCount(el, target) {
  const dur = 1800;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const start = performance.now();

  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(ease(p) * target);
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   6. HERO WORD SWAP
   ============================================================ */
function initWordSwap() {
  const el = $('#wordSwap');
  if (!el) return;
  const words = ['estrategia', 'resultados', 'crecimiento', 'innovación', 'seguridad'];
  let i = 0;

  setInterval(() => {
    el.classList.add('changing');
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('changing');
    }, 350);
  }, 2400);
}

/* ============================================================
   7. TABS — sliding indicator
   ============================================================ */
function initTabs() {
  const tabBtns = $$('.tbn');
  const tabPanes = $$('.tab-pane');
  const slider = $('#tabSlider');
  if (!tabBtns.length) return;

  function moveSlider(btn) {
    if (!slider) return;
    const nav = btn.closest('.tab-nav');
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    slider.style.left   = (btnRect.left - navRect.left + 4) + 'px';
    slider.style.width  = (btnRect.width - 8) + 'px';
  }

  function activate(btn) {
    const tab = btn.dataset.tab;
    tabBtns.forEach(b => { b.classList.toggle('tbn--active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
    tabPanes.forEach(p => { p.classList.toggle('tab-pane--active', p.id === 'pane-' + tab); });
    moveSlider(btn);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activate(btn));
    btn.addEventListener('keydown', e => {
      const i = tabBtns.indexOf(btn);
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabBtns.length;
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   next = (i - 1 + tabBtns.length) % tabBtns.length;
      if (next >= 0) { tabBtns[next].focus(); activate(tabBtns[next]); e.preventDefault(); }
    });
  });

  // Initial slider position
  const active = tabBtns.find(b => b.classList.contains('tbn--active'));
  if (active) setTimeout(() => moveSlider(active), 100);
  window.addEventListener('resize', () => {
    const a = tabBtns.find(b => b.classList.contains('tbn--active'));
    if (a) moveSlider(a);
  });
}

/* ============================================================
   8. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const submitBtn = $('#submitBtn');
  const notice    = $('#formNotice');

  const rules = {
    nombre:  { required: true, minLen: 2,  msg: 'Por favor ingrese su nombre completo.' },
    correo:  { required: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: 'Ingrese un correo válido.' },
    mensaje: { required: true, minLen: 10, msg: 'El mensaje debe tener al menos 10 caracteres.' },
  };

  function getField(n) { return form.querySelector(`[name="${n}"]`); }
  function getErr(f)    { return f.parentElement.querySelector('.ferror'); }

  function validateField(name) {
    const rule = rules[name]; if (!rule) return true;
    const f    = getField(name);
    const err  = getErr(f);
    const val  = f.value.trim();
    let msg = '';
    if (rule.required && !val) msg = rule.msg;
    else if (rule.minLen && val.length < rule.minLen) msg = rule.msg;
    else if (rule.regex && !rule.regex.test(val)) msg = rule.msg;

    if (msg) { f.classList.add('error'); f.classList.remove('valid'); if (err) err.textContent = msg; return false; }
    else      { f.classList.remove('error'); f.classList.add('valid'); if (err) err.textContent = ''; return true; }
  }

  Object.keys(rules).forEach(n => {
    const f = getField(n); if (!f) return;
    f.addEventListener('blur', () => validateField(n));
    f.addEventListener('input', () => { if (f.classList.contains('error')) validateField(n); });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const valid = Object.keys(rules).every(n => validateField(n));
    if (!valid) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    notice.className = 'form-notice';
    notice.style.display = 'none';

    try {
      await new Promise(r => setTimeout(r, 1600));
      notice.textContent = '✓ Mensaje enviado. Nos comunicaremos con usted muy pronto.';
      notice.className = 'form-notice success';
      form.reset();
      $$('input, textarea', form).forEach(f => f.classList.remove('valid', 'error'));
    } catch {
      notice.textContent = '✗ Error al enviar. Contáctenos por WhatsApp.';
      notice.className = 'form-notice error-msg';
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ============================================================
   9. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ============================================================
   10. ACTIVE NAV LINKS
   ============================================================ */
function initActiveLinks() {
  const sections = $$('section[id]');
  const links    = $$('.nav-link');
  if (!sections.length || !links.length) return;
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;

  function update() {
    const scrollY = window.scrollY + navH + 100;
    let current = '';
    sections.forEach(s => { if (scrollY >= s.offsetTop) current = s.id; });
    links.forEach(l => {
      const href = l.getAttribute('href')?.slice(1) || '';
      l.classList.toggle('active', href === current);
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================================
   11. CARD TILT
   ============================================================ */
function initCardTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const cards = $$('.scard, .rcard, .vbento, .pcard, .hcard--main');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) / (r.width  / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      const tx = dy * 3.5;
      const ty = -dx * 3.5;
      card.style.transform = `translateY(-5px) perspective(800px) rotateX(${tx}deg) rotateY(${ty}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ============================================================
   12. PARALLAX HERO ORBS
   ============================================================ */
function initParallax() {
  const orbs = $$('.hero-orb');
  if (!orbs.length) return;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs[0]?.style && (orbs[0].style.transform = `translateY(${y * .15}px) scale(1)`);
        orbs[1]?.style && (orbs[1].style.transform = `translateY(${-y * .1}px) scale(1)`);
        orbs[2]?.style && (orbs[2].style.transform = `translateY(${y * .2}px) scale(1)`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================
   13. FOOTER YEAR
   ============================================================ */
function initYear() {
  const el = $('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   14. LUCIDE ICONS
   ============================================================ */
function initIcons() {
  if (window.lucide) lucide.createIcons();
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initIcons();
  initNavbar();
  initScrollReveal();
  initWordSwap();
  initTabs();
  initContactForm();
  initSmoothScroll();
  initActiveLinks();
  initYear();
  initCardTilt();
  initParallax();

  // Init cursor after a tick (avoids jitter on load)
  setTimeout(initCursor, 200);
});

window.addEventListener('load', () => {
  if (window.lucide) lucide.createIcons();
  initCounters();
  initCardTilt();
});
