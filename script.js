
'use strict';

/* ============================================================
   1. HELPERS
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   2. PAGE LOADER
   ============================================================ */
(function initLoader() {
  const loader = $('#pageLoader');
  const progress = $('#loaderProgress');
  if (!loader || !progress) return;

  let pct = 0;

  function animate() {
    pct += (90 - pct) * 0.08; // easing
    progress.style.width = pct + '%';

    if (pct < 89.5) {
      requestAnimationFrame(animate);
    }
  }

  animate();

  window.addEventListener('load', () => {
    progress.style.width = '100%';
    setTimeout(() => loader.classList.add('hidden'), 250);
  });
})();
/* ============================================================
   3. NAVBAR — scroll y estado
   ============================================================ */
(function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Estado inicial
})();

/* ============================================================
   4. MOBILE MENU
   ============================================================ */
(function initMobileMenu() {
  const toggle = $('#navToggle');
  const menu = $('#navMobile');
  if (!toggle || !menu) return;

  const open = () => {
    menu.classList.add('active');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    menu.classList.remove('active');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', () => {
    menu.classList.contains('active') ? close() : open();
  });

  // Cerrar al hacer clic en un enlace
  $$('a', menu).forEach(link => link.addEventListener('click', close));

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('active')) close();
  });
})();

/* ============================================================
   5. SCROLL REVEAL
   ============================================================ */
(function initReveal() {
  const opts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible', 'active');
        observer.unobserve(entry.target);
      }
    });
  }, opts);

  $$('.reveal-up, .reveal').forEach(el => observer.observe(el));

  // data-aos básico
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  $$('[data-aos]').forEach(el => {
    const delay = el.dataset.aosDelay || '0';
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`;
    aosObserver.observe(el);
  });
})();

/* ============================================================
   6. HERO — texto dinámico con typewriter
   ============================================================ */
(function initHeroType() {
  const el = $('#dynamicText');
  if (!el) return;

  const words = ['estrategias', 'capacitación', 'consultoría', 'resultados', 'seguridad'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let paused = false;

  const PAUSE_AFTER_WORD = 1800;
  const TYPE_SPEED = 80;
  const DELETE_SPEED = 45;

  function type() {
    if (paused) return;

    const word = words[wordIndex];

    if (!deleting) {
      el.textContent = word.slice(0, ++charIndex);
      if (charIndex === word.length) {
        paused = true;
        setTimeout(() => {
          paused = false;
          deleting = true;
          type();
        }, PAUSE_AFTER_WORD);
        return;
      }
    } else {
      el.textContent = word.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    setTimeout(type, deleting ? DELETE_SPEED : TYPE_SPEED);
  }

  type();
})();

/* ============================================================
   7. TABS — Seguridad & Salud
   ============================================================ */
(function initTabs() {
  const tabBtns = $$('[role="tab"]');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      const targetPanel = $(`#tab-${targetId}`);
      if (!targetPanel) return;

      // Desactivar todos
      tabBtns.forEach(b => {
        b.classList.remove('tab-btn--active');
        b.setAttribute('aria-selected', 'false');
      });

      $$('.tab-panel').forEach(panel => {
        panel.classList.remove('tab-panel--active');
        panel.hidden = true;
      });

      // Activar el seleccionado
      btn.classList.add('tab-btn--active');
      btn.setAttribute('aria-selected', 'true');
      targetPanel.classList.add('tab-panel--active');
      targetPanel.hidden = false;

      // FIX: re-inicializar íconos Lucide dentro del panel recién activado
      if (window.lucide) {
        lucide.createIcons({ nodes: [targetPanel] });
      }
    });
  });

  // Navegación por teclado (flechas)
  tabBtns.forEach((btn, i) => {
    btn.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = tabBtns[(i + 1) % tabBtns.length];
      if (e.key === 'ArrowLeft') next = tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
      if (next) { next.focus(); next.click(); }
    });
  });
})();

/* ============================================================
   8. CAROUSEL — pausa en touch
   ============================================================ */
(function initCarousel() {
  const track = $('#carouselTrack');
  if (!track) return;

  // FIX: pausa al tocar en móviles
  track.addEventListener('touchstart', () => {
    track.style.animationPlayState = 'paused';
  }, { passive: true });

  track.addEventListener('touchend', () => {
    track.style.animationPlayState = 'running';
  }, { passive: true });
})();

/* ============================================================
   9. FORMULARIO DE CONTACTO
   ============================================================ */
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const submitBtn = $('#submitBtn');
  const notice = $('#formNotice');

  // Validación individual de campo
  function validateField(input) {
    const group = input.closest('.form-group');
    const error = group ? group.querySelector('.form-error') : null;
    let msg = '';

    if (input.required && !input.value.trim()) {
      msg = 'Este campo es obligatorio.';
    } else if (input.type === 'email' && input.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(input.value.trim())) msg = 'Ingresa un correo válido.';
    } else if (input.type === 'tel' && input.value.trim()) {
      const telRe = /^[\d\s\+\-\(\)]{7,15}$/;
      if (!telRe.test(input.value.trim())) msg = 'Ingresa un teléfono válido.';
    }

    if (error) error.textContent = msg;
    input.classList.toggle('error', !!msg);
    input.classList.toggle('valid', !msg && !!input.value.trim());
    return !msg;
  }

  // Validar al perder el foco
  $$('input, textarea', form).forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  // Envío
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = $$('input[required], textarea[required]', form);
    const valid = fields.map(f => validateField(f)).every(Boolean);
    if (!valid) return;

    // Estado loading
    submitBtn.classList.add('btn--loading');
    submitBtn.disabled = true;
    notice.className = 'form-notice';
    notice.textContent = '';

    try {
      // Simulación de envío (reemplazar con tu endpoint real)
      await new Promise(resolve => setTimeout(resolve, 1800));

      // Éxito
      notice.textContent = '¡Mensaje enviado! Nos pondremos en contacto pronto.';
      notice.classList.add('success');
      form.reset();
      $$('input, textarea', form).forEach(f => f.classList.remove('valid', 'error'));

    } catch {
      notice.textContent = 'Ocurrió un error. Por favor, inténtalo de nuevo.';
      notice.classList.add('error-msg');
    } finally {
      // FIX: siempre re-habilitar el botón
      submitBtn.classList.remove('btn--loading');
      submitBtn.disabled = false;
    }
  });
})();

/* ============================================================
   10. AÑO ACTUAL EN FOOTER
   ============================================================ */
(function initYear() {
  const el = $('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   11. SMOOTH SCROLL para anclas
   ============================================================ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ============================================================
   12. FIX CRÍTICO: Inicializar Lucide Icons
   ============================================================ */
(function initLucide() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    // Fallback: esperar a que cargue
    window.addEventListener('load', () => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  }
})();


const track = document.getElementById("carouselTrack");

let position = 0;
const speed = 0.3; // velocidad (puedes ajustar)

function animate() {
  position -= speed;

  // cuando llega a la mitad, reinicia sin salto
  if (Math.abs(position) >= track.scrollWidth / 2) {
    position = 0;
  }

  track.style.transform = `translateX(${position}px)`;
  requestAnimationFrame(animate);
}

animate();