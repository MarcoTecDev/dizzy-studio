(() => {
  const $ = (s) => document.querySelector(s);
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) {
      try {
        return JSON.parse(localStorage.getItem(k));
      } catch (e) {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {}
    },
  };

  /* ---------- idioma ---------- */
  // Idiomas disponibles. El inglés es el idioma por defecto.
  const LANGS = {
    en: { html: "en", locale: "en-IE" },
    es: { html: "es", locale: "es-ES" },
    zh: { html: "zh-Hans", locale: "zh-CN" },
  };
  let LANG = LANGS[store.get("dizzy-lang")] ? store.get("dizzy-lang") : "en";
  const t = (key, vars) => {
    let s = window.I18N[LANG][key] ?? window.I18N.en[key] ?? key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  };
  const eur = (n) =>
    new Intl.NumberFormat(LANGS[LANG].locale, { style: "currency", currency: "EUR" }).format(n);
  const dec = (n) => new Intl.NumberFormat(LANGS[LANG].locale, { maximumFractionDigits: 1 }).format(n);

  /* ---------- tema: claro por defecto ---------- */
  function setLook(l) {
    if (l === "dark") root.setAttribute("data-look", "dark");
    else root.removeAttribute("data-look");
    $("#themeBtn").setAttribute("aria-label", t(l === "dark" ? "a.light" : "a.dark"));
  }
  const currentLook = () => (root.getAttribute("data-look") === "dark" ? "dark" : "light");
  setLook(store.get("dizzy-look") === "dark" ? "dark" : "light");
  $("#themeBtn").addEventListener("click", () => {
    const next = currentLook() === "dark" ? "light" : "dark";
    setLook(next);
    store.set("dizzy-look", next);
  });

  /* ---------- avisos rotativos ---------- */
  // la fecha del drop de lana (n.2) no sale en Rodeo
  const NOTES = ["n.1", "n.2", "n.3", "n.4"];
  const notesNow = () => (root.classList.contains("theme-west") ? NOTES.filter((k) => k !== "n.2") : NOTES);
  const nb = $("#notice");
  let ni = 0;
  function showNote(first) {
    const s = document.createElement("span");
    const list = notesNow();
    ni = ni % list.length;
    s.textContent = t(list[ni]);
    if (!first && !reduce) s.className = "in";
    nb.appendChild(s);
    requestAnimationFrame(() => requestAnimationFrame(() => s.classList.remove("in")));
    const old = [...nb.children].slice(0, -1);
    old.forEach((o) => {
      o.classList.add("out");
      setTimeout(() => o.remove(), 700);
    });
    ni = (ni + 1) % list.length;
  }
  setInterval(() => showNote(false), 3800);

  /* ---------- ticker ---------- */
  function renderTicker() {
    const words = [t("tk.1"), t("tk.2"), t("tk.3"), t("tk.4"), "Dizzy Studio"];
    $("#ticker").innerHTML = Array(4)
      .fill(words)
      .flat()
      .map((w) => `<span>${w}</span>`)
      .join("");
  }

  function renderWestBand() {
    const words = [t("w.b1"), t("w.b2"), t("w.b3"), t("w.b4"), "Rodeo"];
    $("#wBand").innerHTML = Array(4)
      .fill(words)
      .flat()
      .map((w) => `<span>${w}</span>`)
      .join("");
  }

  /* ---------- catálogo ----------
     Los nombres, colores, categorías y descripciones se traducen en js/i18n.js:
     nombre → "p.<id>", descripción → "d.<id>", color → "c.<color>", categoría → "cat.<cat>". */
  const ONE = "ONE"; // talla única
  const INITIALS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // letras para los charms personalizados
  const P = [
    { id: "jersey", cat: "sweaters", color: "magenta", hex: "#B5195F", price: 89, flag: "best", hot: true, sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "cardigan", cat: "cardigans", color: "black", hex: "#161314", price: 95, sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "gorro", cat: "accessories", color: "magenta", hex: "#B5195F", price: 29, flag: "new", sizes: [ONE] },
    { id: "bufanda", cat: "accessories", color: "blackMagenta", hex: "linear-gradient(90deg,#161314 50%,#B5195F 50%)", price: 45, sizes: [ONE] },
    { id: "chaleco", cat: "cardigans", color: "pearl", hex: "#C9CACC", price: 59, sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "cuello", cat: "sweaters", color: "offwhite", hex: "#F3EFE7", price: 79, flag: "new", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "rayas", cat: "sweaters", color: "blackEcru", hex: "linear-gradient(180deg,#161314 50%,#F3EFE7 50%)", price: 75, flag: "new", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "cardicorto", cat: "cardigans", color: "magenta", hex: "#B5195F", price: 79, sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "pantalon", cat: "trousers", color: "black", hex: "#161314", price: 85, sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "guantes", cat: "accessories", color: "magenta", hex: "#B5195F", price: 25, sizes: [ONE] },
    { id: "calcetines", cat: "accessories", color: "pearl", hex: "#C9CACC", price: 15, sizes: ["35-38", "39-42", "43-46"] },
    {
      id: "pasamontanas",
      cat: "accessories",
      color: "offwhite",
      hex: "#F3EFE7",
      // colores: el primero usa las imágenes base; el resto añade "-<v>" al nombre del archivo
      variants: [
        { v: "", color: "offwhite", hex: "#F3EFE7" },
        { v: "negro", color: "black", hex: "#161314" },
      ],
      price: 35,
      flag: "limited",
      hot: true,
      sizes: [ONE],
    },
    { id: "polo", cat: "tops", color: "magenta", hex: "#B5195F", price: 69, flag: "new", sizes: ["XS", "S", "M", "L", "XL"] },
    // pick: "initial" → en vez de tallas se elige la letra del charm personalizado
    { id: "charms-lana", cat: "accessories", color: "magenta", hex: "#B5195F", price: 19, flag: "custom", pick: "initial", sizes: INITIALS },
    /* ----- Drop 02 · Rodeo (cápsula del oeste). drop: "west" las saca de la tienda de lana ----- */
    { id: "vaquero", drop: "west", cat: "denim", color: "midBlue", hex: "#4A6FA5", price: 95, flag: "wanted", hot: true, sizes: ["W26", "W28", "W30", "W32", "W34", "W36"] },
    { id: "sombrero", drop: "west", cat: "hats", color: "sand", hex: "#D4B48C", price: 69, flag: "wanted", sizes: ["S", "M", "L"] },
    { id: "botas", drop: "west", cat: "boots", color: "tan", hex: "#7A4A2A", price: 189, flag: "wanted", hot: true, sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"] },
    { id: "chaqueta", drop: "west", cat: "denim", color: "classicBlue", hex: "#3A5C8F", price: 119, flag: "wanted", sizes: ["XS", "S", "M", "L", "XL"] },
    {
      id: "cinturon",
      drop: "west",
      cat: "belts",
      color: "brown",
      hex: "#7B4325",
      variants: [
        { v: "", color: "brown", hex: "#7B4325" },
        { v: "negro", color: "black", hex: "#161314" },
      ],
      price: 49,
      flag: "wanted",
      sizes: ["75", "85", "95", "105"],
    },
    { id: "camisa", drop: "west", cat: "shirts", color: "ecru", hex: "#EFE6D2", price: 79, flag: "new", sizes: ["XS", "S", "M", "L", "XL"] },
    { id: "bandana", drop: "west", cat: "accessories", color: "terracotta", hex: "#B4532A", price: 22, flag: "new", sizes: [ONE] },
    { id: "charms-rodeo", drop: "west", cat: "accessories", color: "sand", hex: "#D4B48C", price: 19, flag: "custom", pick: "initial", sizes: INITIALS },
  ];
  const KNIT = P.filter((p) => !p.drop); // colección de punto (tienda principal)
  const WEST = P.filter((p) => p.drop === "west"); // cápsula Rodeo
  const groupOf = (p) => (p.drop === "west" ? WEST : KNIT);
  const nameOf = (p) => t("p." + p.id);
  const colourName = (c) => t("c." + c);
  const sizeLabel = (s) => (s === ONE ? t("oneSize") : s);
  const VARS = (p) => p.variants || [{ v: "", color: p.color, hex: p.hex }];
  const varOf = (p, v) => VARS(p).find((x) => x.v === (v || "")) || VARS(p)[0];
  const suf = (v) => (v ? "-" + v : "");
  const prodImg = (p, v) => `img/productos/${p.id}${suf(v)}.webp`;
  // versiones pequeñas (carpeta sm/) para que cada pantalla cargue solo el tamaño que necesita
  const small = (src) => src.replace(/\/([^/]+)$/, "/sm/$1");
  const prodSet = (p, v) => `srcset="${small(prodImg(p, v))} 520w, ${prodImg(p, v)} 1000w"`;
  const CARD_SIZES = 'sizes="(max-width: 900px) 50vw, 420px"';
  const poseImgs = (p, v) => [1, 2, 3, 4].map((n) => `img/poses/${p.id}${suf(v)}-${n}.webp`);
  const hashFor = (p, v) => p.id + suf(v);
  const swatches = (p, v, cls) =>
    VARS(p)
      .map((x) => {
        const c = colourName(x.color);
        return `<button class="${cls}" data-v="${x.v}" aria-pressed="${x.v === (v || "")}" aria-label="${t("a.colour", { c })}" title="${c}" style="--sw:${x.hex}"></button>`;
      })
      .join("");
  const heart =
    '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';

  /* ---------- favoritos ---------- */
  let favs = new Set((store.get("dizzy-favs") || []).filter((id) => P.some((p) => p.id === id)));
  function syncFavBadge() {
    const b = $("#favBadge");
    b.textContent = favs.size;
    b.hidden = favs.size === 0;
  }
  function toggleFav(p, btn) {
    const on = !favs.has(p.id);
    on ? favs.add(p.id) : favs.delete(p.id);
    store.set("dizzy-favs", [...favs]);
    syncFavBadge();
    document
      .querySelectorAll(`.fav[data-id="${p.id}"], #pdpFav[data-id="${p.id}"]`)
      .forEach((b) => b.setAttribute("aria-pressed", on));
    if (on && !reduce && btn)
      btn.animate([{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }], {
        duration: 400,
      });
    toast(t(on ? "t.favAdd" : "t.favDel", { name: nameOf(p) }));
  }
  $("#favBtn").addEventListener("click", () => {
    if (!favs.size) return toast(t("t.noFav"));
    toast(t("t.favList", { list: P.filter((p) => favs.has(p.id)).map(nameOf).join(", ") }));
  });

  /* ---------- tarjetas de la tienda ---------- */
  const grid = $("#grid");
  function renderGrid() {
    renderCards(grid, KNIT);
    setFilter(currentCat, true);
  }
  /* página Rodeo: tarjetas en mosaico (al pasar el ratón se ve la prenda puesta) y lookbook horizontal */
  const WEST_LOOKS = [
    ["vaquero", "", 2],
    ["sombrero", "", 1],
    ["chaqueta", "", 1],
    ["botas", "", 2],
    ["cinturon", "", 1],
    ["cinturon", "negro", 2],
    ["camisa", "", 1],
    ["bandana", "", 2],
    ["chaqueta", "", 3],
    ["charms-rodeo", "", 2],
    ["sombrero", "", 3],
    ["camisa", "", 3],
  ];
  function renderWest() {
    const el = $("#westGrid");
    renderCards(el, WEST);
    [...el.children].forEach((c, i) => {
      const p = WEST[i],
        pic = c.querySelector(".pic"),
        on = document.createElement("img");
      c.classList.add("wb");
      on.className = "on";
      on.alt = "";
      on.loading = "lazy";
      on.decoding = "async";
      const setOn = (v) => {
        const src = poseImgs(p, v)[0];
        on.srcset = `${small(src)} 640w, ${src} 1200w`;
        on.sizes = i === 0 ? "(max-width: 900px) 100vw, 640px" : "(max-width: 900px) 50vw, 320px";
        on.src = src;
      };
      setOn("");
      pic.querySelector("img").after(on);
      if (i === 0) pic.querySelector("img").sizes = "(max-width: 900px) 100vw, 640px";
      c.querySelectorAll(".vsw").forEach((b) => b.addEventListener("click", () => setOn(b.dataset.v)));
    });
    // tarjeta final: personaliza tus zuecos (lleva al pack de charms)
    const cp = P.find((x) => x.id === "charms-rodeo");
    el.insertAdjacentHTML(
      "beforeend",
      `<a class="card w-cust" id="custom" href="#${cp.id}" data-reveal><span class="w-cust-k">${t("w.custK")}</span><span class="w-cust-h">${t("w.custH")}</span><span class="w-cust-p">${t("w.custP")}</span><span class="w-cust-letters" aria-hidden="true">${["D", "R", "M", "S"].map((l) => `<i>${l}</i>`).join("")}</span><span class="w-cust-go">${t("w.custCta")} <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>`,
    );
    const two = (n) => String(n).padStart(2, "0");
    $("#wCount").textContent = two(WEST.length);
    $("#wAcc").textContent = two(WEST.filter((p) => ["hats", "belts", "accessories"].includes(p.cat)).length);
    $("#wFrom").textContent = eur(Math.min(...WEST.map((p) => p.price))).replace(/[.,]00(?=\D|$)/, "");
    $("#wTrack").innerHTML = WEST_LOOKS.map(([id, v, k], n) => {
      const p = P.find((x) => x.id === id),
        src = poseImgs(p, v)[k - 1],
        name = nameOf(p);
      return `<a class="w-look" href="#${hashFor(p, v)}"><span class="w-look-img"><img src="${src}" srcset="${small(src)} 640w, ${src} 1200w" sizes="(max-width: 900px) 72vw, 30vw" alt="${name}" width="1200" height="1200" loading="lazy" decoding="async"></span><span class="w-look-c"><b>${String(n + 1).padStart(2, "0")}</b>${name}</span></a>`;
    }).join("");
  }
  function renderCards(el, list) {
    el.innerHTML = "";
    list.forEach((p, i) => {
      const c = document.createElement("article");
      c.className = "card";
      c.dataset.cat = p.cat;
      c.setAttribute("data-reveal", "");
      c.style.setProperty("--d", (i % 3) * 0.08 + "s");
      const one = p.sizes.length === 1;
      const name = nameOf(p);
      const quick = p.pick
        ? `<div class="quick"><span class="t">${t("f.custom")}</span><div class="sizes"><button class="one go" data-go="1">${t("personalise")}</button></div></div>`
        : `<div class="quick"><span class="t">${one ? t("oneSize") : t("addSize")}</span><div class="sizes">${p.sizes
            .map(
              (s) =>
                `<button class="${one ? "one" : ""}" data-size="${s}" aria-label="${t("a.addSize", { name, s: sizeLabel(s) })}">${one ? t("addToBag") : s}</button>`,
            )
            .join("")}</div></div>`;
      c.innerHTML = `
   <div class="pic">
     ${p.flag ? `<span class="flag ${p.hot ? "hot" : ""}">${t("f." + p.flag)}</span>` : ""}
     <button class="fav" data-id="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="${t("a.saveFav", { name })}">${heart}</button>
     <img src="${prodImg(p)}" ${prodSet(p)} ${CARD_SIZES} alt="${t("imgAlt", { name, color: colourName(p.color).toLowerCase() })}" width="1000" height="1000" loading="lazy" decoding="async">
     ${quick}
   </div>
   <div class="info"><div><a class="plink" href="#${p.id}"><h3>${name}</h3></a>${
     VARS(p).length > 1
       ? `<span class="c"><span class="vsws">${swatches(p, "", "vsw")}</span><span class="cn">${colourName(p.color)}</span></span>`
       : `<span class="c"><i style="background:${p.hex}"></i>${colourName(p.color)}</span>`
   }</div><span class="price">${eur(p.price)}</span></div>`;
      el.appendChild(c);
      let cv = "";
      c.querySelectorAll(".quick button").forEach((b) =>
        b.addEventListener("click", () => (b.dataset.go ? (location.hash = hashFor(p, cv)) : addToCart(p, b.dataset.size, false, cv))),
      );
      c.querySelector(".pic").addEventListener("click", (e) => {
        if (e.target.closest("button")) return;
        location.hash = hashFor(p, cv);
      });
      c.querySelector(".fav").addEventListener("click", (e) => toggleFav(p, e.currentTarget));
      c.querySelectorAll(".vsw").forEach((b) =>
        b.addEventListener("click", () => {
          cv = b.dataset.v;
          const col = colourName(varOf(p, cv).color);
          c.querySelectorAll(".vsw").forEach((o) => o.setAttribute("aria-pressed", o === b));
          const img = c.querySelector(".pic img");
          img.srcset = `${small(prodImg(p, cv))} 520w, ${prodImg(p, cv)} 1000w`;
          img.src = prodImg(p, cv);
          img.alt = t("imgAlt", { name, color: col.toLowerCase() });
          c.querySelector(".cn").textContent = col;
          c.querySelector(".plink").href = "#" + hashFor(p, cv);
        }),
      );
    });
  }

  /* ---------- filtros ---------- */
  const CATS = ["all", ...new Set(KNIT.map((p) => p.cat))];
  const fwrap = $("#filters");
  let currentCat = "all";
  function setFilter(cat, silent) {
    currentCat = cat;
    fwrap.querySelectorAll(".chip").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === cat));
    grid.querySelectorAll(".card").forEach((c) => {
      const show = cat === "all" || c.dataset.cat === cat;
      if (show && c.classList.contains("hide")) {
        c.classList.remove("hide", "pre");
        if (!reduce && !silent)
          c.animate(
            [
              { opacity: 0, transform: "translateY(24px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 550, easing: "cubic-bezier(.2,.7,.1,1)" },
          );
      } else if (!show) c.classList.add("hide");
    });
  }
  function renderFilters() {
    fwrap.innerHTML = "";
    CATS.forEach((cat) => {
      const b = document.createElement("button");
      b.className = "chip";
      b.dataset.cat = cat;
      b.setAttribute("aria-pressed", cat === currentCat);
      const n = cat === "all" ? KNIT.length : KNIT.filter((p) => p.cat === cat).length;
      b.innerHTML = `${cat === "all" ? t("all") : t("cat." + cat)}<small>${n}</small>`;
      b.addEventListener("click", () => setFilter(cat));
      fwrap.appendChild(b);
    });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-jump]");
    if (a) setFilter(a.dataset.jump);
  });

  /* ---------- tarjeta flotante de la portada ---------- */
  function renderPick() {
    $("#pickImg").src = small(prodImg(P[0]));
    $("#pickMeta").textContent = `${colourName(P[0].color)} · ${eur(P[0].price)}`;
  }
  $("#pickAdd").addEventListener("click", () => addToCart(P[0], "M"));

  /* ---------- lookbook ---------- */
  const LOOKS = [
    { img: "img/lookbook/look1.webp", n: "Look 01", alt: "look.1", items: [["cardigan", "M"], ["gorro", ONE], ["pantalon", "M"]] },
    { img: "img/lookbook/look2.webp", n: "Look 02", alt: "look.2", items: [["rayas", "M"], ["guantes", ONE]] },
    { img: "img/lookbook/look3.webp", n: "Look 03", alt: "look.3", items: [["chaleco", "M"], ["bufanda", ONE], ["pantalon", "M"]] },
  ];
  const looksEl = $("#looks");
  function renderLooks() {
    looksEl.innerHTML = "";
    LOOKS.forEach((L, i) => {
      const items = L.items.map(([id, sz]) => ({ p: P.find((x) => x.id === id), sz }));
      const total = items.reduce((a, b) => a + b.p.price, 0);
      const el = document.createElement("article");
      el.className = "look";
      el.setAttribute("data-reveal", "");
      el.style.setProperty("--d", i * 0.1 + "s");
      el.innerHTML = `<div class="ph"><img src="${L.img}" srcset="${small(L.img)} 720w, ${L.img} 1073w" sizes="(max-width: 900px) 78vw, 420px" alt="${t(L.alt)}" width="1073" height="1600" loading="lazy" decoding="async"><span class="tag">${L.n}</span></div>
    <ul>${items.map((x) => `<li><a href="#${x.p.id}">${nameOf(x.p)}</a><span>${eur(x.p.price)}</span></li>`).join("")}</ul>
    <button class="btn">${t("look.add", { total: eur(total) })}</button>`;
      el.querySelector(".btn").addEventListener("click", () => {
        items.forEach((x) => addToCart(x.p, x.sz, true));
        toast(t("t.look", { look: L.n, n: items.length }));
      });
      looksEl.appendChild(el);
    });
  }

  /* ---------- cesta ---------- */
  let cart = (store.get("dizzy-cart2") || [])
    .filter((it) => P.some((p) => p.id === it.id))
    .map((it) => (it.size === "Única" ? { ...it, size: ONE, key: it.id + suf(it.v) + ONE } : it));
  const FREE = 80,
    SHIP = 4.95;
  function itemLabel(p, size, v) {
    return [
      nameOf(p),
      VARS(p).length > 1 ? colourName(varOf(p, v).color).toLowerCase() : null,
      size === ONE ? null : p.pick ? t("letterLong", { s: size }).toLowerCase() : t("sizeShort", { s: size }),
    ]
      .filter(Boolean)
      .join(" · ");
  }
  function addToCart(p, size, silent, v = "") {
    const key = p.id + suf(v) + size;
    const ex = cart.find((it) => it.key === key);
    if (ex) ex.qty++;
    else cart.push({ key, id: p.id, v, size, qty: 1 });
    renderCart();
    if (!silent) toast(t("t.added", { item: itemLabel(p, size, v) }));
    const b = $("#badge");
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
  }
  const LOGO =
    '<span class="logo" aria-hidden="true"><i class="lb"></i><i class="ltail"></i><span class="ltw"><i class="lt"></i></span></span>';
  function renderCart() {
    store.set("dizzy-cart2", cart);
    const count = cart.reduce((a, b) => a + b.qty, 0);
    const badge = $("#badge");
    badge.textContent = count;
    badge.hidden = count === 0;
    const items = $("#items");
    items.innerHTML = "";
    if (!cart.length) {
      items.innerHTML = `<div class="empty">${LOGO}<p>${t("cart.empty")}</p><a class="btn ghost" href="#novedades" id="emptyGo">${t("cart.browse")}</a></div>`;
      $("#emptyGo").addEventListener("click", closeCart);
    }
    cart.forEach((it) => {
      const p = P.find((x) => x.id === it.id);
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `<img src="${small(prodImg(p, it.v))}" alt="" width="72" height="72" decoding="async">
     <div><h4>${nameOf(p)}</h4><div class="sub">${colourName(varOf(p, it.v).color)} · ${it.size === ONE ? t("oneSize") : t(p.pick ? "letterLong" : "sizeLong", { s: it.size })}</div>
     <div class="qty"><button aria-label="${t("a.minus")}">−</button><span>${it.qty}</span><button aria-label="${t("a.plus")}">+</button></div></div>
     <div class="right"><span class="price">${eur(p.price * it.qty)}</span><button class="rm">${t("cart.remove")}</button></div>`;
      const [minus, plus] = el.querySelectorAll(".qty button");
      minus.addEventListener("click", () => {
        it.qty--;
        if (it.qty < 1) cart = cart.filter((x) => x !== it);
        renderCart();
      });
      plus.addEventListener("click", () => {
        it.qty++;
        renderCart();
      });
      el.querySelector(".rm").addEventListener("click", () => {
        cart = cart.filter((x) => x !== it);
        renderCart();
      });
      items.appendChild(el);
    });
    const sub = cart.reduce((a, it) => a + P.find((p) => p.id === it.id).price * it.qty, 0);
    const ship = sub === 0 || sub >= FREE ? 0 : SHIP;
    const left = Math.max(0, FREE - sub);
    $("#totals").innerHTML = cart.length
      ? `
    <div class="freebar"><i style="width:${Math.min(100, (sub / FREE) * 100)}%"></i></div>
    <div class="freenote">${left > 0 ? t("cart.left", { x: eur(left) }) : t("cart.free")}</div>
    <div class="r"><span>${t("cart.sub")}</span><span>${eur(sub)}</span></div>
    <div class="r"><span>${t("cart.ship")}</span><span>${ship ? eur(ship) : t("cart.freeShip")}</span></div>
    <div class="r t"><span>${t("cart.total")}</span><span>${eur(sub + ship)}</span></div>
    <button class="btn checkout" id="checkout">${t("cart.checkout")}</button>`
      : "";
    $("#checkout")?.addEventListener("click", () => toast(t("t.demo")));
  }
  const drawer = $("#drawer"),
    scrim = $("#scrim");
  function openCart() {
    drawer.classList.add("open");
    scrim.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    $("#closeCart").focus();
  }
  function closeCart() {
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
  }
  $("#cartBtn").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });
  let tt;
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------- muestra de punto (se teje con el scroll) ---------- */
  const sw = $("#swatch");
  const COLS = 12,
    ROWS = 6,
    CW = 40,
    RH = 50;
  const ns = "http://www.w3.org/2000/svg";
  const stitches = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const x = c * CW + 20,
        y = r * RH + 25;
      const path = document.createElementNS(ns, "path");
      path.setAttribute(
        "d",
        `M${x - 14} ${y - 14} Q${x - 8} ${y + 10} ${x} ${y + 16} Q${x + 8} ${y + 10} ${x + 14} ${y - 14}`,
      );
      path.setAttribute("class", "st");
      sw.appendChild(path);
      stitches.push({ el: path, order: (ROWS - 1 - r) * COLS + (r % 2 ? COLS - 1 - c : c) });
    }
  stitches.sort((a, b) => a.order - b.order);
  $("#knitTotal").textContent = stitches.length;
  const knitSec = $(".knit-sec");
  let lastKnit = -1;
  function knit(r) {
    const p = reduce
      ? 1
      : Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.25)));
    const n = Math.round(p * stitches.length);
    if (n === lastKnit) return;
    lastKnit = n;
    stitches.forEach((s, i) => s.el.classList.toggle("on", i < n));
    $("#knitNum").textContent = n;
  }

  /* ---------- cuenta atrás (6 nov 2026, 20:00 en Madrid) ---------- */
  const DROP = Date.UTC(2026, 10, 6, 19, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    let s = Math.max(0, Math.floor((DROP - Date.now()) / 1000));
    const d = Math.floor(s / 86400);
    s -= d * 86400;
    const h = Math.floor(s / 3600);
    s -= h * 3600;
    const m = Math.floor(s / 60);
    s -= m * 60;
    $("#cd-d").textContent = pad(d);
    $("#cd-h").textContent = pad(h);
    $("#cd-m").textContent = pad(m);
    $("#cd-s").textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- tallas ---------- */
  const SZ = [
    ["XS", [84, 88], [66, 70], 60],
    ["S", [88, 94], [70, 76], 61],
    ["M", [94, 100], [76, 82], 62],
    ["L", [100, 106], [82, 88], 63],
    ["XL", [106, 112], [88, 94], 64],
  ];
  let unit = "cm";
  function renderSizes(u = unit) {
    unit = u;
    const f = (v) => (unit === "cm" ? v : dec(Math.round((v / 2.54) * 10) / 10));
    const r = (a) => `${f(a[0])} – ${f(a[1])}`;
    $("#sizeBody").innerHTML = SZ.map(
      (s) => `<tr><td>${s[0]}</td><td>${r(s[1])}</td><td>${r(s[2])}</td><td>${f(s[3])}</td></tr>`,
    ).join("");
    $("#u-cm").setAttribute("aria-pressed", unit === "cm");
    $("#u-in").setAttribute("aria-pressed", unit === "in");
  }
  $("#u-cm").addEventListener("click", () => renderSizes("cm"));
  $("#u-in").addEventListener("click", () => renderSizes("in"));

  /* ---------- newsletter ---------- */
  $("#newsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $("#email").value.trim();
    const m = $("#newsMsg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      m.textContent = t("news.err");
      return;
    }
    m.textContent = t("news.ok", { email: v });
    $("#email").value = "";
  });

  /* ---------- revelado al hacer scroll ---------- */
  const io =
    !reduce && "IntersectionObserver" in window
      ? new IntersectionObserver(
          (es) =>
            es.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.remove("pre");
                io.unobserve(e.target);
              }
            }),
          { rootMargin: "0px 0px -8% 0px" },
        )
      : null;
  function revealIn(rootEl) {
    if (!io) return;
    rootEl.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add("pre");
        io.observe(el);
      }
    });
  }

  /* ---------- fichas de prenda ---------- */
  function fitText(p) {
    if (p.pick === "initial") return t("fit.charms");
    const own = {
      vaquero: "fit.jeans",
      sombrero: "fit.hat",
      botas: "fit.boots",
      chaqueta: "fit.jacket",
      cinturon: "fit.belt",
      camisa: "fit.shirt",
      bandana: "fit.bandana",
      polo: "fit.polo",
    }[p.id];
    if (own) return t(own);
    if (p.id === "calcetines") return t("fit.socks");
    if (p.sizes.length === 1) return t("fit.one");
    if (p.cat === "trousers") return t("fit.trousers");
    return t("fit.default");
  }
  function relatedFor(p) {
    if (p.drop) return groupOf(p).filter((x) => x !== p).slice(0, 3);
    const look = LOOKS.find((L) => L.items.some(([id]) => id === p.id));
    let ids = look ? look.items.map(([id]) => id).filter((id) => id !== p.id) : [];
    KNIT.filter((x) => x.id !== p.id && !ids.includes(x.id) && x.cat !== p.cat).forEach((x) => ids.push(x.id));
    return ids.slice(0, 3).map((id) => P.find((x) => x.id === id));
  }
  const storeMain = $("#inicio"),
    pdpMain = $("#pdp"),
    pdpWrap = $("#pdpWrap");
  let pdpState = null; // { p, v } de la ficha abierta
  function renderPDP(p, v = "") {
    pdpState = { p, v };
    const list = groupOf(p),
      i = list.indexOf(p),
      prev = list[(i - 1 + list.length) % list.length],
      next = list[(i + 1) % list.length];
    const one = p.sizes.length === 1;
    const name = nameOf(p);
    let sel = one ? p.sizes[0] : p.pick ? "D" : p.sizes.includes("M") ? "M" : p.sizes[1];
    const galleryFor = (cv) => [
      ...poseImgs(p, cv).map((src, k) => ({ src, cap: t("pose." + (k + 1)) })),
      { src: prodImg(p, cv), cap: t("pose.5") },
    ];
    const imgs = galleryFor(v);
    const multi = VARS(p).length > 1;
    pdpWrap.innerHTML = `
   <nav class="crumbs" aria-label="${t("a.crumbs")}"><a class="back" href="${p.drop ? "#w-shop" : "#novedades"}"><svg viewBox="0 0 24 24"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>${t("pdp.back")}</a><a href="${p.drop ? "#w-shop" : "#novedades"}">${t("pdp.shop")}</a><span>/</span>${
     p.drop ? `<a href="#rodeo">Rodeo</a>` : `<a href="#novedades" data-jump="${p.cat}">${t("cat." + p.cat)}</a>`
   }<span>/</span><span>${name}</span></nav>
   <div class="pdp-grid">
     <div><div class="gallery" id="gal">${imgs.map((m, k) => `<figure ${k ? "data-reveal" : ""} style="--d:${(k % 2) * 0.08}s"><img src="${m.src}" srcset="${small(m.src)} ${k === 4 ? 520 : 640}w, ${m.src} ${k === 4 ? 1000 : 1200}w" sizes="${k ? "(max-width: 900px) 86vw, 380px" : "(max-width: 900px) 86vw, 760px"}" alt="${name}, ${m.cap.toLowerCase()}" width="1200" height="1200" decoding="async" ${k > 1 ? 'loading="lazy"' : ""}><figcaption>${m.cap}</figcaption></figure>`).join("")}</div>
       <div class="dots" id="dots">${imgs.map((_, k) => `<i class="${k ? "" : "on"}"></i>`).join("")}</div></div>
     <aside class="buy">
       ${p.flag ? `<span class="flag ${p.hot ? "hot" : ""}">${t("f." + p.flag)}</span>` : ""}
       <h1>${name}</h1>
       <div class="pr">${eur(p.price)}</div>
       <div class="col">${multi ? "" : `<i style="background:${p.hex}"></i>`}${t("pdp.colour")} <b id="pdpColor">${colourName(varOf(p, v).color)}</b></div>
       ${multi ? `<div class="vpick" id="vPick">${swatches(p, v, "vsw big")}</div>` : ""}
       <p class="desc">${t("d." + p.id)}</p>
       <div><div class="sz-head"><b>${one ? t("oneSize") : p.pick ? t("pdp.initial") : t("pdp.choose")}</b>${p.sizes.length > 3 && !p.drop && !p.pick ? `<a href="#tallas">${t("pdp.guide")}</a>` : ""}</div></div>
       <div class="sz-pick${p.pick ? " letters" : ""}" id="szPick">${p.sizes.map((s) => `<button data-size="${s}" aria-pressed="${s === sel}">${sizeLabel(s)}</button>`).join("")}</div>
       <div class="buy-row"><button class="btn" id="pdpAdd">${t("pdp.add", { price: eur(p.price) })}</button>
         <button class="icon-btn" id="pdpFav" data-id="${p.id}" aria-pressed="${favs.has(p.id)}" aria-label="${t("pdp.fav")}">${heart}</button></div>
       <div class="mini-perks"><span>${t("pdp.perk1")}</span><span>${t("pdp.perk2")}</span><span>${t("pdp.perk3")}</span></div>
       <div class="acc">
         <details open><summary>${t("pdp.fit")}</summary><p>${fitText(p)}</p></details>
         <details><summary>${t("pdp.shipT")}</summary><p>${t("pdp.shipP")}</p></details>
       </div>
     </aside>
   </div>
   <div class="related"><div class="sec-head" data-reveal><div class="l"><span class="kicker">${t("rel.kicker")}</span><h2>${t("rel.h2")}</h2></div></div><div class="grid" id="relGrid"></div></div>
   <div class="pn"><a href="#${prev.id}"><img src="${small(prodImg(prev))}" alt="" width="56" height="56"><span><small>${t("prev")}</small><b>${nameOf(prev)}</b></span></a><a class="next" href="#${next.id}"><img src="${small(prodImg(next))}" alt="" width="56" height="56"><span><small>${t("next")}</small><b>${nameOf(next)}</b></span></a></div>`;
    const szBtns = [...pdpWrap.querySelectorAll("#szPick button")];
    szBtns.forEach((b) =>
      b.addEventListener("click", () => {
        sel = b.dataset.size;
        szBtns.forEach((x) => x.setAttribute("aria-pressed", x === b));
      }),
    );
    pdpWrap.querySelectorAll("#vPick .vsw").forEach((b) =>
      b.addEventListener("click", () => {
        v = b.dataset.v;
        pdpState.v = v;
        const col = colourName(varOf(p, v).color);
        pdpWrap.querySelectorAll("#vPick .vsw").forEach((o) => o.setAttribute("aria-pressed", o === b));
        $("#pdpColor").textContent = col;
        const list = galleryFor(v);
        pdpWrap.querySelectorAll("#gal img").forEach((img, k) => {
          img.srcset = `${small(list[k].src)} ${k === 4 ? 520 : 640}w, ${list[k].src} ${k === 4 ? 1000 : 1200}w`;
          img.src = list[k].src;
          img.alt = `${t("imgAlt", { name, color: col.toLowerCase() })}, ${list[k].cap.toLowerCase()}`;
          if (!reduce) img.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 450, delay: k * 40 });
        });
        try {
          history.replaceState(null, "", "#" + hashFor(p, v));
        } catch (e) {}
      }),
    );
    $("#pdpAdd").addEventListener("click", () => {
      addToCart(p, sel, false, v);
      const b = $("#pdpAdd");
      b.textContent = t("pdp.added");
      setTimeout(() => {
        b.textContent = t("pdp.add", { price: eur(p.price) });
      }, 1500);
    });
    $("#pdpFav").addEventListener("click", (e) => toggleFav(p, e.currentTarget));
    const rel = $("#relGrid");
    if (p.drop === "west") rel.classList.add("w-bento", "w-rel");
    relatedFor(p).forEach((r) => {
      rel.insertAdjacentHTML(
        "beforeend",
        `<article class="card" data-reveal><a class="pic" href="#${r.id}" style="display:block"><img src="${prodImg(r)}" ${prodSet(r)} ${CARD_SIZES} alt="${nameOf(r)}" width="1000" height="1000" loading="lazy" decoding="async"></a><div class="info"><div><a class="plink" href="#${r.id}"><h3>${nameOf(r)}</h3></a><span class="c"><i style="background:${r.hex}"></i>${colourName(r.color)}</span></div><span class="price">${eur(r.price)}</span></div></article>`,
      );
    });
    const gal = $("#gal"),
      dots = [...pdpWrap.querySelectorAll("#dots i")];
    gal.addEventListener(
      "scroll",
      () => {
        const k = Math.round(gal.scrollLeft / (gal.firstElementChild.offsetWidth + 10));
        dots.forEach((d, j) => d.classList.toggle("on", j === k));
      },
      { passive: true },
    );
    document.title = name + " · Dizzy Studio";
  }
  /* cuatro vistas en la misma página: la portada con los drops, la tienda de lana, Rodeo y la ficha de prenda */
  const westMain = $("#west"),
    homeMain = $("#home");
  const lastY = { store: 0, west: 0 };
  let view = "store";
  // direcciones de la página Rodeo (#high-noon se mantiene por si alguien guardó el enlace antiguo)
  const WEST_IDS = ["rodeo", "high-noon", "w-shop", "w-lb", "w-fit", "custom"];
  function showView(next, themeWest) {
    if (view === "store" || view === "west") lastY[view] = scrollY;
    homeMain.hidden = next !== "home";
    storeMain.hidden = next !== "store";
    westMain.hidden = next !== "west";
    pdpMain.hidden = next !== "pdp";
    root.classList.toggle("theme-west", !!themeWest);
    root.classList.toggle("view-home", next === "home");
    const from = view;
    view = next;
    return from;
  }
  function route() {
    const id = decodeURIComponent(location.hash.slice(1));
    let p = P.find((x) => x.id === id),
      v = "";
    if (!p) {
      p = P.find((x) => VARS(x).some((o) => o.v && id === x.id + "-" + o.v));
      if (p) v = id.slice(p.id.length + 1);
    }
    if (p) {
      renderPDP(p, v);
      showView("pdp", p.drop === "west");
      scrollTo({ top: 0, behavior: "instant" });
      revealIn(pdpMain);
      closeCart();
    } else if (!id || id === "home") {
      pdpState = null;
      showView("home", false);
      document.title = "Dizzy Studio";
      scrollTo({ top: 0, behavior: "instant" });
      closeCart();
    } else if (WEST_IDS.includes(id)) {
      pdpState = null;
      const wasWest = root.classList.contains("theme-west");
      const from = showView("west", true);
      if (!wasWest) playSheriff(); // la estrella sale al llegar desde la portada o la tienda de lana
      document.title = "Rodeo · Dizzy Studio";
      const target = id !== "rodeo" && id !== "high-noon" && document.getElementById(id);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: from === "west" ? "smooth" : "instant" }));
      else scrollTo({ top: from === "pdp" ? lastY.west : 0, behavior: "instant" });
      revealIn(westMain);
      closeCart();
    } else {
      pdpState = null;
      const from = showView("store", false);
      document.title = "Dizzy Studio";
      const target = id && document.getElementById(id);
      if (target)
        requestAnimationFrame(() => target.scrollIntoView({ behavior: from === "store" ? "smooth" : "instant" }));
      else if (from !== "store") scrollTo({ top: from === "pdp" ? lastY.store : 0, behavior: "instant" });
    }
    onScroll();
  }
  addEventListener("hashchange", route);

  /* ---------- aplicar idioma ---------- */
  function translateStatic() {
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    document.querySelectorAll("[data-i18n-html]").forEach((el) => (el.innerHTML = t(el.dataset.i18nHtml)));
    document.querySelectorAll("[data-i18n-attr]").forEach((el) =>
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        el.setAttribute(attr.trim(), t(key.trim()));
      }),
    );
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("meta.desc"));
  }
  function setLang(l, first) {
    LANG = l;
    store.set("dizzy-lang", l);
    root.lang = LANGS[l].html;
    document.querySelectorAll(".lang button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lang === l));
    translateStatic();
    setLook(currentLook());
    renderTicker();
    renderWestBand();
    renderFilters();
    renderGrid();
    renderLooks();
    renderPick();
    renderCart();
    renderSizes();
    $("#newsMsg").textContent = "";
    nb.innerHTML = "";
    ni = 0;
    showNote(true);
    renderWest();
    if (pdpState) renderPDP(pdpState.p, pdpState.v);
    else document.title = view === "west" ? "Rodeo · Dizzy Studio" : "Dizzy Studio";
    if (!first) onScroll();
  }
  document.querySelectorAll(".lang button").forEach((b) =>
    b.addEventListener("click", () => {
      if (b.dataset.lang !== LANG) setLang(b.dataset.lang);
    }),
  );

  /* ---------- scroll ---------- */
  const prog = $("#progress"),
    header = $("#top"),
    heroImg = $("#heroImg"),
    ticker = $("#ticker"),
    ws = $("#wsImg"),
    wCard = $("#wCard"),
    wHeroImg = $("#wHeroImg"),
    wTitle = [...$("#wTitle").children],
    wBand = $("#wBand"),
    wLb = $("#w-lb"),
    wTrack = $("#wTrack"),
    words = [...$("#heroTitle").children];
  function onScroll() {
    // 1) lecturas (medidas) primero, para no forzar al navegador a recalcular el diseño varias veces
    const y = scrollY,
      max = document.documentElement.scrollHeight - innerHeight,
      vh = innerHeight,
      onStore = !storeMain.hidden,
      knitRect = onStore ? knitSec.getBoundingClientRect() : null,
      lookRects =
        onStore && !reduce && innerWidth > 900
          ? [...looksEl.querySelectorAll(".look")].map((el) => [el, el.getBoundingClientRect()])
          : [],
      wsRect = onStore && !reduce ? ws.parentElement.getBoundingClientRect() : null,
      onWest = !westMain.hidden && !reduce,
      bandW = onWest ? wBand.scrollWidth / 4 : 0,
      cardRect = onWest ? wCard.getBoundingClientRect() : null,
      lbRect = onWest && innerWidth > 900 ? wLb.getBoundingClientRect() : null,
      lbMove = lbRect ? wTrack.scrollWidth - innerWidth : 0,
      tickW = ticker.scrollWidth / 4;
    // 2) escrituras
    prog.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    header.classList.toggle("scrolled", y > 10);
    if (knitRect) knit(knitRect);
    unravel(y);
    if (onWest) {
      // página Rodeo:
      // · las dos palabras del título se separan, la tarjeta del duelo se abre hasta ocupar su sitio
      // · la banda de denim corre con el scroll
      // · el lookbook se desplaza en horizontal mientras bajas (solo en pantallas grandes)
      if (y < vh * 1.5) {
        const k = Math.min(1, Math.max(0, 1 - (cardRect.top - vh * 0.12) / (vh * 0.75)));
        wCard.style.setProperty("--k", k.toFixed(3));
        wHeroImg.style.transform = `translate3d(0,${(y * 0.12).toFixed(1)}px,0) scale(${(1.12 - k * 0.06).toFixed(4)})`;
        wTitle[0].style.transform = `translate3d(${(-y * 0.18).toFixed(1)}px,0,0)`;
        wTitle[1].style.transform = `translate3d(${(y * 0.18).toFixed(1)}px,0,0)`;
      }
      if (bandW) wBand.style.transform = `translate3d(${(-((y * 0.5) % bandW)).toFixed(1)}px,0,0)`;
      if (lbRect && lbRect.bottom > 0 && lbRect.top < vh) {
        const k = Math.min(1, Math.max(0, -lbRect.top / (lbRect.height - vh)));
        wTrack.style.transform = `translate3d(${(-k * lbMove).toFixed(1)}px,0,0)`;
      } else if (!lbRect) wTrack.style.transform = "";
    }
    if (reduce || !onStore) return;
    if (y < vh * 1.3) {
      heroImg.style.transform = `translate3d(0,${(-y * 0.08).toFixed(1)}px,0)`;
      words[0].style.transform = `translate3d(${(-y * 0.25).toFixed(1)}px,0,0)`;
      words[2].style.transform = `translate3d(${(y * 0.18).toFixed(1)}px,0,0)`;
    }
    lookRects.forEach(([el, r], i) => {
      if (el.classList.contains("pre") || r.bottom < 0 || r.top > vh) return;
      const k = [0.06, -0.05, 0.09][i] || 0;
      el.style.transform = `translate3d(0,${((r.top + r.height / 2 - vh / 2) * k).toFixed(1)}px,0)`;
    });
    if (tickW) ticker.style.transform = `translate3d(${(-((y * 0.45) % tickW)).toFixed(1)}px,0,0)`;
    if (wsRect && wsRect.bottom > 0 && wsRect.top < vh) {
      ws.style.transform = `translate3d(0,${((wsRect.top - vh / 2) * -0.12).toFixed(1)}px,0) scale(1.12)`;
    }
  }
  /* logo: las letras se deshacen en hilo y el ovillo lo recoge */
  const hl = $("#headLogo"),
    hlText = hl.querySelector(".lt"),
    hlWrap = hl.querySelector(".ltw"),
    hlTail = hl.querySelector(".ltail"),
    hlPath = hl.querySelector(".yl path"),
    disp = $("#disp");
  const cl = (v) => Math.min(1, Math.max(0, v));
  let lastP = -1;
  function unravel(y) {
    const p = reduce ? (y > 60 ? 1 : 0) : cl(y / 300);
    if (Math.abs(p - lastP) < 0.002) return;
    lastP = p;
    /* 1. las letras se aplastan en una línea ondulada magenta */
    const melt = cl(p / 0.4);
    disp.setAttribute("scale", (melt * 18).toFixed(1));
    hlText.style.background = `color-mix(in srgb, #C2246D ${Math.round(melt * 100)}%, var(--ink))`;
    hlWrap.style.transform = `scaleY(${(1 - melt * 0.93).toFixed(3)})`;
    /* 2. esa línea pasa a ser el hilo */
    const swap = cl((p - 0.3) / 0.14);
    hlWrap.style.opacity = String(1 - swap);
    // el filtro de ondas es costoso: solo se aplica mientras las letras se están deshaciendo
    hlWrap.style.filter = melt > 0 && swap < 1 ? "url(#unravel)" : "none";
    hlWrap.style.visibility = swap >= 1 ? "hidden" : "visible";
    /* 3. el hilo se recoge y se mete dentro del ovillo */
    const reel = cl((p - 0.44) / 0.56);
    const len = 1 - reel;
    hlPath.style.opacity = (swap * (len > 0.002 ? 1 : 0)).toFixed(3);
    hlPath.style.strokeDasharray = `${len.toFixed(4)} 2`;
    hlTail.style.clipPath = `inset(0 ${(reel * 52).toFixed(2)}% 0 0)`;
  }
  words.forEach((w) =>
    w.addEventListener("animationend", () => {
      w.style.animation = "none";
    }),
  );
  let ticking = false;
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
      }
    },
    { passive: true },
  );
  addEventListener("resize", onScroll);

  /* ---------- entrada ----------
     1) La web aparece tapada por lana y los hilos se descosen solos (2 s), dejando "DIZZY STUDIO" en el centro.
     2) El nombre se enrolla en una bola de lana.
     3) La bola vuela hasta el logo pequeño de la cabecera.
     Un clic en cualquier sitio (o Escape) salta la entrada. */
  let intro = $("#intro");
  // copia intacta de la entrada: la bola de lana de la portada la vuelve a reproducir
  const introTpl = intro ? intro.cloneNode(true) : null;
  const LAYERS = 4;
  const UNRAVEL_MS = 2000; // duración del descosido
  function startIntro() {
    const holder = $("#introYarn"),
      brand = $("#introBrand"),
      ball = $("#introBall");
    const YARN = ["#B5195F", "#C42A6B", "#A3154F", "#D23C7E", "#B81F62"];
    // velo claro (para que el nombre no se mezcle con la portada) y fieltro magenta encima: están en el HTML
    // para que la pantalla salga magenta desde el primer instante
    const base = holder.querySelector(".intro-base");
    let W, H, DPR, layers, cvs, raf;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const rnd = (a, b) => a + Math.random() * (b - a);
    const ease = (x) => 1 - Math.pow(1 - x, 3);

    // un hilo: recorrido ondulado que entra por un borde y sale por otro
    function makeStrand(scale) {
      const edge = Math.floor(Math.random() * 4);
      const m = 60;
      let x, y;
      if (edge === 0) (x = rnd(0, W)), (y = -m);
      else if (edge === 1) (x = W + m), (y = rnd(0, H));
      else if (edge === 2) (x = rnd(0, W)), (y = H + m);
      else (x = -m), (y = rnd(0, H));
      const tx = rnd(W * 0.15, W * 0.85),
        ty = rnd(H * 0.15, H * 0.85);
      let a = Math.atan2(ty - y, tx - x),
        va = 0,
        total = 0;
      const step = 9;
      const w = rnd(20, 38) * scale;
      const path = new Path2D(); // eje del hilo
      const dark = new Path2D(); // vueltas de la hebra (sombra)
      const light = new Path2D(); // vueltas de la hebra (brillo)
      path.moveTo(x, y);
      let nextPly = 0;
      for (let i = 0; i < 1100; i++) {
        va += rnd(-0.045, 0.045);
        va *= 0.94;
        a += va;
        x += Math.cos(a) * step;
        y += Math.sin(a) * step;
        total += step;
        path.lineTo(x, y);
        if (total >= nextPly) {
          nextPly = total + w * 0.42;
          const pa = a + 1.05,
            cx = Math.cos(pa) * w * 0.5,
            cy = Math.sin(pa) * w * 0.5;
          dark.moveTo(x - cx, y - cy);
          dark.lineTo(x + cx * 0.9, y + cy * 0.9);
          light.moveTo(x - cx * 0.8 + 2, y - cy * 0.8);
          light.lineTo(x + cx * 0.6 + 2, y + cy * 0.6);
        }
        if (i > 30 && (x < -m * 1.5 || x > W + m * 1.5 || y < -m * 1.5 || y > H + m * 1.5)) break;
      }
      return { path, dark, light, total, w, c: YARN[Math.floor(Math.random() * YARN.length)] };
    }
    // dibuja un hilo completo como una cuerda trenzada
    function drawFull(g, s) {
      g.lineCap = "round";
      g.lineJoin = "round";
      g.save();
      g.translate(2, 4);
      g.lineWidth = s.w + 3;
      g.strokeStyle = "rgba(50,0,22,.35)";
      g.stroke(s.path);
      g.restore();
      g.lineWidth = s.w;
      g.strokeStyle = s.c;
      g.stroke(s.path);
      g.lineWidth = Math.max(1.4, s.w * 0.11);
      g.strokeStyle = "rgba(60,0,26,.42)";
      g.stroke(s.dark);
      g.strokeStyle = "rgba(255,190,220,.22)";
      g.stroke(s.light);
    }
    // cada capa es su propio lienzo: se dibuja una sola vez y la tarjeta gráfica las superpone
    function build() {
      W = innerWidth;
      H = innerHeight;
      DPR = Math.min(1.5, devicePixelRatio || 1);
      if (W * H * DPR * DPR > 2.2e6) DPR = Math.sqrt(2.2e6 / (W * H)); // límite de píxeles en pantallas grandes
      const cw = Math.round(W * DPR),
        ch = Math.round(H * DPR);
      const scale = Math.max(0.6, Math.min(1.25, Math.min(W, H) / 820));
      const per = Math.round(Math.max(10, Math.min(20, (W * H) / 56000)));
      layers = Array.from({ length: LAYERS }, () => Array.from({ length: per }, () => makeStrand(scale)));
      cvs = layers.map((layer) => {
        const c = document.createElement("canvas");
        c.width = cw;
        c.height = ch;
        const g = c.getContext("2d");
        g.setTransform(DPR, 0, 0, DPR, 0, 0);
        layer.forEach((st) => drawFull(g, st));
        holder.appendChild(c);
        // copia de la capa completa: se recorta con una máscara mientras se descose
        const src = document.createElement("canvas");
        src.width = cw;
        src.height = ch;
        src.getContext("2d").drawImage(c, 0, 0);
        return { c, src, t0: 0, dur: 0, done: false };
      });
    }
    // dibuja una capa con cada hilo recogido hacia el borde por el que entró
    function drawLayer(i, k) {
      const { c, src } = cvs[i],
        g = c.getContext("2d"),
        layer = layers[i];
      g.globalCompositeOperation = "source-over";
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, c.width, c.height);
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
      g.lineCap = "round";
      g.lineJoin = "round";
      g.strokeStyle = "#000";
      layer.forEach((st, si) => {
        const d = Math.min(1, Math.max(0, k * 1.4 - (si / layer.length) * 0.4));
        const vis = st.total * (1 - ease(d));
        if (vis < 2) return;
        g.lineWidth = st.w + 10;
        g.setLineDash([vis, st.total + 100]);
        g.stroke(st.path);
      });
      g.setLineDash([]);
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.globalCompositeOperation = "source-in";
      g.drawImage(src, 0, 0);
    }
    function frame(now) {
      raf = null;
      let busy = false;
      cvs.forEach((L, i) => {
        if (L.done || !L.t0 || now < L.t0) {
          if (!L.done && L.t0) busy = true;
          return;
        }
        const k = Math.min(1, (now - L.t0) / L.dur);
        drawLayer(i, k);
        if (k >= 1) {
          L.done = true;
          L.c.remove();
          L.src = null;
        } else busy = true;
      });
      if (busy) raf = requestAnimationFrame(frame);
    }
    // "DIZZY STUDIO" letra a letra, para poder enrollarlas en la bola
    brand.querySelectorAll("span").forEach((w) => {
      w.innerHTML = [...w.textContent].map((ch) => `<i>${ch}</i>`).join("");
    });

    function run() {
      const t = performance.now();
      // las capas se descosen escalonadas, de la de arriba a la de abajo, en UNRAVEL_MS
      const each = UNRAVEL_MS * 0.38,
        gap = (UNRAVEL_MS - each - 150) / (LAYERS - 1);
      for (let i = LAYERS - 1, n = 0; i >= 0; i--, n++) {
        cvs[i].t0 = t + 150 + n * gap;
        cvs[i].dur = each;
      }
      base.style.transitionDuration = UNRAVEL_MS + "ms";
      requestAnimationFrame(() => (base.style.opacity = "0"));
      intro.classList.add("unravel");
      raf = requestAnimationFrame(frame);
      later(windUp, UNRAVEL_MS + 150);
    }
    // el nombre se enrolla: las letras giran hacia el centro y aparece la bola de lana
    function windUp() {
      const r = brand.getBoundingClientRect(),
        cx = r.left + r.width / 2,
        cy = r.top + r.height / 2;
      [...brand.querySelectorAll("i")].forEach((el, n, all) => {
        const b = el.getBoundingClientRect();
        el.style.setProperty("--dx", `${(cx - (b.left + b.width / 2)).toFixed(1)}px`);
        el.style.setProperty("--dy", `${(cy - (b.top + b.height / 2)).toFixed(1)}px`);
        el.style.setProperty("--rot", `${n % 2 ? 300 : -300}deg`);
        el.style.transitionDelay = `${(Math.abs(n - all.length / 2) * 18).toFixed(0)}ms`;
      });
      // la bola se coloca para que su centro quede en el centro del nombre
      const bw = Math.min(260, innerWidth * 0.55),
        bh = bw * (590 / 760);
      ball.style.width = bw + "px";
      ball.style.left = cx - bw * 0.259 + "px";
      ball.style.top = cy - bh * 0.643 + "px";
      intro.classList.add("wind");
      later(flyHome, 700);
    }
    // la bola vuela hasta el logo de la cabecera (mismo dibujo, así que encaja exacto)
    function flyHome() {
      const target = $("#headLogo").getBoundingClientRect(),
        from = ball.getBoundingClientRect();
      const s = target.width / from.width;
      ball.style.transform = `translate(${(target.left - from.left).toFixed(1)}px, ${(target.top - from.top).toFixed(1)}px) scale(${s.toFixed(4)})`;
      intro.classList.add("fly");
      root.classList.remove("intro-hold"); // arranca la animación del titular de la portada
      later(finish, 760);
    }
    function finish() {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
      root.classList.remove("intro-hold", "intro-lock");
      intro.classList.add("done");
      setTimeout(() => intro.remove(), 450);
      layers = cvs = null;
      onScroll();
    }
    // saltar: clic en cualquier sitio o Escape
    intro.addEventListener("click", finish);
    addEventListener("keydown", function esc(e) {
      if (e.key === "Escape" && intro.isConnected) finish();
      if (!intro.isConnected) removeEventListener("keydown", esc);
    });
    build();
    // dos fotogramas para que la lana se pinte antes de empezar a moverse
    requestAnimationFrame(() => requestAnimationFrame(run));
  }

  /* ---------- estrella: entrada de Rodeo ----------
     Al entrar en la página Rodeo desde la portada o la tienda de lana, una estrella de sheriff de latón colgada de un clavo
     recibe cinco agujeros, se descuelga y cae; detrás aparece la página. Un clic (o Escape) la salta.
     Son 6 fotogramas (img/west/estrella/estrella-0 … -5.webp, de 0 a 5 agujeros) que se muestran en orden.
     HITS: momento de cada agujero (ms). HOLE_AT: dónde está cada agujero en la imagen (% de ancho y alto). */
  const sheriff = $("#sheriff");
  const HITS = [620, 860, 1080, 1270, 1440];
  const HOLE_AT = [
    [77.1, 45.3],
    [22.0, 45.0],
    [34.3, 75.8],
    [50.1, 28.2],
    [66.8, 77.1],
  ];
  let sheriffRun = null,
    starReady = null;
  // carga los fotogramas (en segundo plano al abrir la web, o al entrar en Rodeo si aún no estaban)
  function loadStar() {
    if (!starReady && sheriff)
      starReady = Promise.all(
        [...sheriff.querySelectorAll(".sh-f")].map((img) => {
          if (!img.src) img.src = img.dataset.src;
          return img.decode().catch(() => {});
        }),
      );
    return starReady || Promise.resolve();
  }
  function playSheriff() {
    if (reduce || !sheriff) return;
    if (sheriffRun) sheriffRun.stop();
    const stage = $("#shStage"),
      swing = $("#shSwing"),
      dust = $("#shDust"),
      frames = [...sheriff.querySelectorAll(".sh-f")],
      anims = [],
      timers = [];
    let started = false;
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    const A = (el, kf, o) => {
      const a = el.animate(kf, o);
      anims.push(a);
      return a;
    };
    const show = (n) => frames.forEach((f, j) => f.classList.toggle("on", j === n));
    sheriff.hidden = false;
    sheriff.classList.remove("out");
    root.classList.add("sheriff-on");
    show(0);
    stage.style.opacity = "0";
    // empieza cuando los fotogramas están listos (como mucho espera 1,2 s)
    Promise.race([loadStar(), new Promise((r) => setTimeout(r, 1200))]).then(() => {
      if (sheriffRun !== run || started) return;
      started = true;
      stage.style.opacity = "";
      A(stage, [{ transform: "translateY(-30px) scale(0.9)", opacity: 0 }, { transform: "none", opacity: 1 }], {
        duration: 520,
        easing: "cubic-bezier(.2,.8,.2,1.15)",
      });
      HITS.forEach((ms, i) => later(() => hit(i), ms));
      later(fall, HITS[HITS.length - 1] + 420);
    });

    // un agujero: pasa al siguiente fotograma, la estrella se sacude y salen chispas y polvo
    function hit(i) {
      show(i + 1);
      const dir = i % 2 ? 1 : -1;
      A(
        swing,
        [
          { transform: "none" },
          { transform: `translate(${dir * 9}px,-3px) rotate(${dir * 5}deg)` },
          { transform: `translate(${-dir * 3}px,1px) rotate(${-dir * 2}deg)` },
          { transform: "none" },
        ],
        { duration: 300, easing: "ease-out" },
      );
      const r = stage.getBoundingClientRect(),
        cx = r.left + (r.width * HOLE_AT[i][0]) / 100,
        cy = r.top + (r.height * HOLE_AT[i][1]) / 100;
      const flash = document.createElement("b");
      flash.style.cssText = `left:${cx}px;top:${cy}px`;
      dust.appendChild(flash);
      A(flash, [{ transform: "translate(-50%,-50%) scale(.2)", opacity: 0.95 }, { transform: "translate(-50%,-50%) scale(1.7)", opacity: 0 }], {
        duration: 360,
        easing: "ease-out",
        fill: "forwards",
      });
      for (let k = 0; k < 11; k++) {
        const d = document.createElement("i");
        if (k < 5) d.className = "spark";
        d.style.cssText = `left:${cx}px;top:${cy}px`;
        dust.appendChild(d);
        const ang = Math.random() * Math.PI * 2,
          dist = 30 + Math.random() * 80;
        A(
          d,
          [
            { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
            {
              transform: `translate(calc(-50% + ${(Math.cos(ang) * dist).toFixed(1)}px), calc(-50% + ${(Math.sin(ang) * dist + 20).toFixed(1)}px)) scale(.3)`,
              opacity: 0,
            },
          ],
          { duration: 480 + Math.random() * 360, easing: "cubic-bezier(.1,.6,.3,1)", fill: "forwards" },
        );
      }
    }
    // se suelta del clavo: se balancea un momento y cae
    function fall() {
      A(
        swing,
        [
          { transform: "none" },
          { transform: "rotate(-11deg)", offset: 0.15 },
          { transform: "rotate(6deg)", offset: 0.3 },
          { transform: "translateY(12px) rotate(-3deg)", offset: 0.38 },
          { transform: "translateY(120vh) rotate(42deg)" },
        ],
        { duration: 1050, easing: "cubic-bezier(.45,0,.8,.45)", fill: "forwards" },
      );
      later(() => sheriff.classList.add("out"), 620);
      later(done, 1120);
    }
    function done() {
      timers.forEach(clearTimeout);
      anims.forEach((a) => a.cancel());
      stage.style.opacity = "";
      show(0);
      sheriff.hidden = true;
      sheriff.classList.remove("out");
      root.classList.remove("sheriff-on");
      dust.innerHTML = "";
      sheriffRun = null;
      onScroll();
    }
    const run = { stop: done };
    sheriffRun = run;
  }
  if (sheriff) {
    // precarga discreta de los fotogramas cuando el navegador está libre
    (window.requestIdleCallback || ((f) => setTimeout(f, 2500)))(() => loadStar(), { timeout: 4000 });
    sheriff.addEventListener("click", () => sheriffRun && sheriffRun.stop());
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sheriffRun) sheriffRun.stop();
    });
  }

  /* ---------- portada: los dos drops ----------
     La bola de lana reproduce la entrada de lana y abre la tienda de punto;
     la estrella abre Rodeo (allí sale la entrada de la estrella). */
  function playYarn() {
    if (reduce || !introTpl) return;
    if (intro && intro.isConnected) intro.remove();
    intro = introTpl.cloneNode(true);
    intro.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    document.body.prepend(intro);
    root.classList.add("intro-lock", "intro-hold");
    startIntro();
  }
  $("#dropKnit").addEventListener("click", (e) => {
    e.preventDefault();
    playYarn();
    location.hash = "#inicio";
  });

  /* ---------- arranque ---------- */
  syncFavBadge();
  setLang(LANG, true);
  const startId = decodeURIComponent(location.hash.slice(1));
  // la entrada de lana sale sola solo si se abre directamente la tienda de lana
  const noYarn = !startId || startId === "home" || WEST_IDS.includes(startId);
  if (intro) {
    if (reduce || noYarn) {
      // con "reducir movimiento" no se muestra; en la portada espera a que pulses la bola; en Rodeo sale la estrella
      intro.remove();
      root.classList.remove("intro-lock", "intro-hold");
    } else startIntro();
  }
  revealIn(storeMain);
  onScroll();
  route();
})();
