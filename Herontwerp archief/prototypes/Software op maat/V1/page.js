/* =============================================================
   Software op maat V1: het menu, de navigatie die licht wordt na de hero, het binnenkomen van de
   secties en de FAQ. Gewoon scrollen: geen stappen zoals op de homepage.
   ============================================================= */
(function () {
  'use strict';
  const body = document.body;

  // ---------- Het menu ----------
  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    if (open) menu.querySelector('a').focus({ preventScroll: true });
  }
  menuBtn.addEventListener('click', () => setMenu(!body.classList.contains('menu-open')));
  document.getElementById('menuScrim').addEventListener('click', () => setMenu(false));
  menu.querySelector('a[href="#top"]').addEventListener('click', () => setMenu(false));
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); }
  });

  // ---------- De navigatie: donker op de hero, licht zodra de hero voorbij is ----------
  const nav = document.getElementById('nav'), intro = document.getElementById('intro');
  const navOnLight = () => nav.classList.toggle('on-light', intro.getBoundingClientRect().bottom < 60);
  addEventListener('scroll', navOnLight, { passive: true });
  navOnLight();

  // ---------- De secties komen één keer binnen, zacht na elkaar ----------
  const settle = el => el.addEventListener('animationend', e => { if (e.target === el) el.classList.remove('reveal', 'in'); });
  const groups = [
    ['.intro-copy', '.video'],
    ['#wat .section-title', '.cat'],
    ['.statement-line', '.statement-sub'],
    ['.how .section-title', '.step'],
    ['.proof .section-title', '.case'],
    ['.faq .section-title', '.faq-index'],
    ['.close-title', '.close-actions'],
  ];
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    io.unobserve(en.target);
    en.target.classList.add('in');
  }), { threshold: 0.15 });
  groups.forEach(sel => {
    document.querySelectorAll(sel.join(',')).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${Math.min(i, 4) * 120}ms`);
      settle(el);
      io.observe(el);
    });
  });

  // ---------- De FAQ: rechts groot het antwoord op de gekozen vraag ----------
  const shown = document.getElementById('faqShown');
  function drawFaq(swap) {
    const on = document.querySelector('.faq-item.is-on');
    shown.querySelector('.faq-shown-q').textContent = on.querySelector('.faq-q').textContent;
    shown.querySelector('.faq-shown-a').textContent = on.querySelector('.faq-a').textContent;
    if (!swap) return;
    shown.classList.remove('swap');
    void shown.offsetWidth;
    shown.classList.add('swap');
  }
  document.querySelector('.faq-list').addEventListener('click', e => {
    const pick = e.target.closest('.faq-pick');
    if (!pick || pick.parentElement.classList.contains('is-on')) return;
    document.querySelectorAll('.faq-item').forEach(li => {
      const on = li === pick.parentElement;
      li.classList.toggle('is-on', on);
      li.querySelector('.faq-pick').setAttribute('aria-expanded', String(on));
    });
    drawFaq(true);
  });
  drawFaq(false);
})();
