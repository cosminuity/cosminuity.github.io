document.addEventListener("DOMContentLoaded", () => {
  const items = window.products || []

  const grid = document.getElementById("grid")
  const q = document.getElementById("q")
  const seasonSel = document.getElementById("season")
  const statusSel = document.getElementById("status")
  const sortSel = document.getElementById("sort")

  if (!grid) {
    console.error("Grid not found")
    return
  }

  function uniqSeasons(list) {
    return Array.from(new Set(list.map(p => p.season).filter(Boolean))).sort()
  }

  function seasonScore(season) {
    const m = String(season || "").match(/(spring|summer|fall|winter)\s+(\d{4})/i)
    if (!m) return 0
    const year = Number(m[2])
    const order = { spring:1, summer:2, fall:3, winter:4 }[m[1].toLowerCase()] || 0
    return year * 10 + order
  }

  function buildSeasonOptions() {
    uniqSeasons(items).forEach(s => {
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
    let list = items.slice()

    const query = q.value.trim().toLowerCase()
    const season = seasonSel.value
    const status = statusSel.value
    const sort = sortSel.value

    if (query) {
      list = list.filter(p =>
        `${p.name||""} ${p.id||""} ${p.season||""} ${p.status||""}`
          .toLowerCase()
          .includes(query)
      )
    }

    if (season) list = list.filter(p => p.season === season)
    if (status) list = list.filter(p => p.status === status)

    if (sort === "name") {
      list.sort((a,b) => (a.name||"").localeCompare(b.name||""))
    } else {
      list.sort((a,b) => seasonScore(a.season) - seasonScore(b.season))
      if (sort === "new") list.reverse()
    }

    grid.innerHTML = ""
    list.forEach(p => grid.appendChild(card(p)))
  }

  buildSeasonOptions()

  q.addEventListener("input", apply)
  seasonSel.addEventListener("change", apply)
  statusSel.addEventListener("change", apply)
  sortSel.addEventListener("change", apply)

  apply()
})
