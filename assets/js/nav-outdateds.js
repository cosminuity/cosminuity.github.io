function setActive(page) {
  document.querySelectorAll("#siteNav [data-page]").forEach(a => {
    a.classList.toggle("active", a.dataset.page === page);
  });
}

fetch("nav.html")
  .then(r => r.text())
  .then(html => {
    const mount = document.getElementById("siteNav");
    if (!mount) return;
    mount.innerHTML = html;

    const page = document.body.dataset.page || "";
    setActive(page);
  });
