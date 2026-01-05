function esc(s) {
  return String(s ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function setActiveLink(root, page) {
  const links = root.querySelectorAll("[data-page]");
  links.forEach(a => a.classList.toggle("active", a.getAttribute("data-page") === page));
}

function injectNav() {
  const mount = document.getElementById("siteNav");
  if (!mount) return;

  mount.innerHTML = `
    <nav class="nav">
      <div class="navInner">
        <a class="brand" href="index.html" data-page="home">Cosminuity</a>
        <div class="navlinks">
            <a href="gallery.html" data-page="gallery">Gallery</a>
            <a href="plushie.html" data-page="plushie">Plushies Sold</a>
            <a href="store.html" data-page="store">Store</a>
            <a href="about.html" data-page="about">About</a>
        </div>
      </div>
    </nav>
  `;

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

