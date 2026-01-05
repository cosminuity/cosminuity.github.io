function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function setActiveLink(root, page) {
  const links = root.querySelectorAll("[data-page]");
  links.forEach(a => a.classList.toggle("active", a.getAttribute("data-page") === page));
}

function getBaseHref() {
  const baseEl = document.querySelector('base[href]');
  if (baseEl) return baseEl.getAttribute('href') || '';

  const p = window.location.pathname.replace(/\\/g, '/');
  const file = p.split('/').filter(Boolean).pop() || '';

  // If we're at a file in a subfolder (not the root), go up one level.
  // Example: /REPO/products/item.html => ../
  // Example: /REPO/store.html => ''
  const parts = p.split('/').filter(Boolean);

  // Heuristic: if the last part contains a dot it's a file.
  // If there are more than 2 parts (USER, REPO, maybe folder, file), we might be nested.
  // Safer: look for "products" anywhere, case insensitive.
  if (parts.some(seg => seg.toLowerCase() === 'products')) return '../';

  return '';
}

async function injectNav() {
  const mount = document.getElementById("siteNav");
  if (!mount) return;

  const tryFetch = async (url) => {
    const r = await fetch(url, { cache: "no-store" });
    if (!r.ok) throw new Error(url);
    return r.text();
  };

  const base = getBaseHref();

  let html = "";
  try {
    html = await tryFetch(`${base}nav.html`);
  } catch {
    html = await tryFetch("nav.html");
  }

  mount.innerHTML = html;

  const page = document.body.dataset.page || "";
  setActiveLink(mount, page);
}

function injectHero() {
  const mount = document.getElementById("siteHero");
  if (!mount) return;

  const title = esc(document.body.dataset.heroTitle || "COSMINUITY");
  const bg = document.body.dataset.heroBg || "";

  mount.innerHTML = `
    <header class="heroPoster ${bg ? "heroCustom" : ""}" ${bg ? `style="background-image:url('${bg}')"` : ""}>
      <div class="posterOverlay">
        <h1 class="posterTitle">${title}</h1>
      </div>
    </header>
  `;
}

function setYear() {
  const y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
}

injectNav();
injectHero();
setYear();
