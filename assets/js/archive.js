document.addEventListener("DOMContentLoaded", () => {
  const products = window.products || []

  const grid = document.getElementById("grid")
  const q = document.getElementById("q")
  const seasonSel = document.getElementById("season")
  const statusSel = document.getElementById("status")
  const sortSel = document.getElementById("sort")

  if (!grid || !q || !seasonSel || !statusSel || !sortSel) {
    console.error("Archive missing required elements", { grid, q, seasonSel, statusSel, sortSel })
    return
  }

  function uniqSeasons(items) {
    return Array.from(new Set(items.map(p => p.season).filter(Boolean))).sort()
  }

  function seasonScore(season) {
    const m = String(season || "").match(/(spring|summer|fall|winter)\s+(\d{4})/i)
    if (!m) return 0
    const year = Number(m[2])
    const order = { spring: 1, summer: 2, fall: 3, winter: 4 }[m[1].toLowerCase()] || 0
    return year * 10 + order
  }

  function buildSeasonOptions() {
    uniqSeasons(products).forEach(s => {
      const o = document.createElement("option")
      o.value = s
      o.textContent = s
      seasonSel.appendChild(o)
    })
  }

  function card(p) {
    const a = document.createElement("a")
    a.className = "sold-card sold-card--bg"
    a.href = p.href || "#"
    a.style.backgroundImage = `url(${p.image || ""})`
    if (p.heroPos) a.style.backgroundPosition = p.heroPos

    a.innerHTML = `
      <div class="sold-panel">
        <div class="sold-pill">${p.name || ""}</div>
      </div>
    `
    return a
  }

  function apply() {
    let items = products.slice()

    const query = q.value.trim().toLowerCase()
    const season = seasonSel.value
    const status = statusSel.value
    const sort = sortSel.value

    if (query) {
      items = items.filter(p => {
        const hay = `${p.name || ""} ${p.id || ""} ${p.season || ""} ${p.status || ""}`.toLowerCase()
        return hay.includes(query)
      })
    }

    if (season) items = items.filter(p => p.season === season)
    if (status) items = items.filter(p => p.status === status)

    if (sort === "name") {
      items.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))
    } else {
      items.sort((a, b) => seasonScore(a.season) - seasonScore(b.season))
      if (sort === "new") items.reverse()
    }

    grid.inner
