// Navegación · menú de pantalla completa, accesible por teclado y tacto.
(() => {
  const trigger = document.querySelector('#menu-button');
  const panel = document.querySelector('#menu-panel');
  const closeButton = document.querySelector('#menu-close');

  function syncMenu(returnFocus = false) {
    const open = panel.classList.contains('open');
    document.body.classList.toggle('menu-open', open);
    trigger.setAttribute('aria-expanded', String(open));
    trigger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    if (open) closeButton.focus();
    else if (returnFocus) trigger.focus();
  }

  trigger.addEventListener('click', () => requestAnimationFrame(() => syncMenu()));
  closeButton.addEventListener('click', () => {
    panel.classList.remove('open');
    syncMenu(true);
  });
  panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    requestAnimationFrame(() => syncMenu());
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && panel.classList.contains('open')) {
      panel.classList.remove('open');
      syncMenu(true);
    }
  });
})();
