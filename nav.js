(async function () {
  const mount = document.querySelector('[data-nav]');
  if (!mount) return;

  const normalizePath = (urlLike) => {
    try {
      const u = new URL(urlLike, window.location.origin);
      let p = u.pathname || '/';
      // Add trailing slash for directory routes (GitHub Pages friendly)
      if (!p.endsWith('/')) {
        const last = p.split('/').pop() || '';
        if (!last.includes('.')) p += '/';
      }
      return p;
    } catch (e) {
      return '/';
    }
  };

  try {
    const res = await fetch('/nav.html', { cache: 'no-cache' });
    if (!res.ok) throw new Error('nav.html introuvable');
    mount.innerHTML = await res.text();

    const links = mount.querySelectorAll('.nav-links a, .nav-brand');
    const current = normalizePath(window.location.href);

    links.forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      const target = normalizePath(href);
      const isActive = target === current || (target !== '/' && current.startsWith(target));
      a.classList.toggle('active', isActive);
    });
  } catch (e) {
    console.warn(e);
  }
})();
