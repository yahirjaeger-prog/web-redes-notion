/* 07 · Sitio web y redes sociales — navegación circular del carrusel */

(() => {
  const root = document.querySelector('[data-channels]');
  if (!root) return;

  const media = [...root.querySelectorAll('.media')];
  const info = [...root.querySelectorAll('.info')];
  const current = root.querySelector('[data-current]');
  const total = root.querySelector('[data-total]');
  const count = media.length;
  const pad = n => String(n).padStart(2, '0');

  let index = 0;

  total.textContent = pad(count);

  function show(next, dir) {
    next = (next + count) % count; // circular: último ↔ primero
    if (next === index) return;

    // Fija la dirección antes de cambiar de clase para que el slide entrante parta del lado correcto
    root.style.setProperty('--dir', dir);
    void root.offsetWidth;

    [media, info].forEach(group => {
      group.forEach(el => el.classList.remove('is-leaving'));
      group[index].classList.replace('is-active', 'is-leaving');
      group[next].classList.add('is-active');
    });

    media[index].classList.remove('is-revealed');
    index = next;
    sync();
  }

  function sync() {
    [media, info].forEach(group =>
      group.forEach((el, i) => {
        el.inert = i !== index;
        el.setAttribute('aria-hidden', i !== index);
      })
    );
    current.textContent = pad(index + 1);
  }

  root.querySelector('[data-prev]').addEventListener('click', () => show(index - 1, -1));
  root.querySelector('[data-next]').addEventListener('click', () => show(index + 1, 1));

  // Teclado
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') show(index - 1, -1);
    if (e.key === 'ArrowRight') show(index + 1, 1);
  });

  // Móvil: tap sobre la imagen muestra / oculta la información
  const touch = window.matchMedia('(hover: none)');
  media.forEach(el =>
    el.addEventListener('click', () => {
      if (touch.matches) el.classList.toggle('is-revealed');
    })
  );

  // Móvil: deslizar horizontalmente
  let startX = null;
  const stack = root.querySelector('.media-stack');
  stack.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  stack.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) dx < 0 ? show(index + 1, 1) : show(index - 1, -1);
  });

  sync();
})();
