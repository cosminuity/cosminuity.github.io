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
  const baseEl = document.querySelector("base[href]");
  if (baseEl) return baseEl.getAttribute("href") || "";

  const p = window.location.pathname;

  // If we're inside /products/, go up one level.
  if (p.includes("/products/")) return "../";

  // Same folder as nav.html for root pages in the repo.
  return "";
}

async function injectNav() {
  const mount = document.getElementById("siteNav");
  if (!mount) return;

  const base = getBaseHref();
  const html = await fetch(`${base}nav.html`).then(r => r.text());
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
