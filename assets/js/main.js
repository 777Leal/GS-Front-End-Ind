/* StoreBooks – lógica da loja (catálogo, busca, filtros, carrinho, favoritos, checkout) */
const BOOKS = [
  { id:1,  title:"Harry Potter and the Sorcerer's Stone", author:"J.K. Rowling", cat:"Fantasia", price:59.9, rating:4.9, isbn:"9780590353427", desc:"Um menino descobre aos onze anos que é bruxo e é levado a Hogwarts, onde faz amigos, enfrenta perigos e começa a desvendar o mistério de seu passado." },
  { id:2,  title:"The Hobbit", author:"J.R.R. Tolkien", cat:"Fantasia", price:44.9, rating:4.8, isbn:"9780547928227", desc:"Bilbo Bolseiro vive uma aventura inesperada ao lado de treze anões e do mago Gandalf para recuperar um tesouro guardado pelo dragão Smaug." },
  { id:3,  title:"Dune", author:"Frank Herbert", cat:"Ficção Científica", price:64.9, rating:4.7, isbn:"9780441172719", desc:"No deserto do planeta Arrakis, o jovem Paul Atreides se envolve em política, religião e na disputa pela especiaria mais valiosa do universo." },
  { id:4,  title:"1984", author:"George Orwell", cat:"Ficção Científica", price:34.9, rating:4.8, isbn:"9780451524935", desc:"Em um Estado totalitário onde o Grande Irmão vigia tudo, Winston Smith ousa pensar por conta própria. Distopia clássica sobre poder e verdade." },
  { id:5,  title:"Rich Dad Poor Dad", author:"Robert T. Kiyosaki", cat:"Negócios", price:42.9, rating:4.4, isbn:"9781612680194", desc:"Duas visões opostas sobre dinheiro, ensinadas por dois pais, explicam como pensar em ativos, passivos e liberdade financeira." },
  { id:6,  title:"Sapiens", author:"Yuval Noah Harari", cat:"Ciência & Tech", price:54.9, rating:4.7, isbn:"9780062316110", desc:"Uma breve história da humanidade: da Revolução Cognitiva às revoluções agrícola, científica e tecnológica." },
  { id:7,  title:"Pride and Prejudice", author:"Jane Austen", cat:"Clássicos", price:29.9, rating:4.8, isbn:"9780141439518", desc:"Elizabeth Bennet e o orgulhoso Sr. Darcy protagonizam um dos romances mais amados da literatura inglesa." },
  { id:8,  title:"The Little Prince", author:"Antoine de Saint-Exupéry", cat:"Clássicos", price:27.9, rating:4.9, isbn:"9780156012195", desc:"Um piloto perdido no deserto encontra um pequeno príncipe de outro planeta. Uma fábula poética sobre amizade, amor e o essencial." },
  { id:9,  title:"The Da Vinci Code", author:"Dan Brown", cat:"Suspense", price:39.9, rating:4.3, isbn:"9780307474278", desc:"Um assassinato no Louvre leva o simbologista Robert Langdon a uma corrida por segredos escondidos na arte e na história." },
  { id:10, title:"Atomic Habits", author:"James Clear", cat:"Autoajuda", price:49.9, rating:4.8, isbn:"9780735211292", desc:"Um método prático para criar bons hábitos e abandonar os ruins com pequenas mudanças que geram resultados notáveis." },
  { id:11, title:"The Alchemist", author:"Paulo Coelho", cat:"Autoajuda", price:36.9, rating:4.6, isbn:"9780062315007", desc:"O pastor Santiago parte em busca de um tesouro no Egito e descobre que o verdadeiro tesouro está em seguir sua Lenda Pessoal." },
  { id:12, title:"Clean Code", author:"Robert C. Martin", cat:"Ciência & Tech", price:89.9, rating:4.7, isbn:"9780132350884", desc:"Guia clássico para escrever código legível, limpo e sustentável, com exemplos reais de refatoração." },
  { id:13, title:"The Midnight Library", author:"Matt Haig", cat:"Romance", price:49.9, rating:4.5, isbn:"9780525559474", desc:"Entre a vida e a morte existe uma biblioteca infinita, onde cada livro revela uma vida que você poderia ter vivido. Uma história sobre escolhas, arrependimentos e recomeços." },
];
const CATS = [
  ["Fantasia","bi-magic"],["Ficção Científica","bi-rocket-takeoff"],["Negócios","bi-briefcase"],["Ciência & Tech","bi-cpu"],
  ["Clássicos","bi-feather"],["Suspense","bi-incognito"],["Autoajuda","bi-sunrise"],["Romance","bi-heart"],
];
const FEATURED_ID = 13, COUPONS = { STORE10: 0.10 }, FREE_SHIP = 150, SHIP = 14.9;

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const brl = n => n.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
const byId = id => BOOKS.find(b => b.id === +id);
const cover = b => `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg?default=false`;
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
function placeholder(title) { // capa alternativa caso a imagem não carregue
  const words = esc(title).split(" "), lines = []; let cur = "";
  words.forEach(w => { if ((cur + " " + w).length > 14) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim(); });
  lines.push(cur);
  const t = lines.slice(0, 4).map((l, i) => `<text x='20' y='${150 + i * 34}' font-family='Georgia' font-size='26' font-weight='bold' fill='#0a0a0a'>${l}</text>`).join("");
  return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#facc15'/><stop offset='1' stop-color='#a16207'/></linearGradient></defs><rect width='300' height='450' fill='url(#g)'/><rect width='14' height='450' fill='rgba(0,0,0,.25)'/>${t}</svg>`);
}
const img = (b, cls = "") => `<img src="${cover(b)}" alt="Capa de ${esc(b.title)}" loading="lazy" class="${cls}" data-title="${esc(b.title)}">`;
document.addEventListener("error", e => { const el = e.target; if (el.tagName === "IMG" && el.dataset.title && !el.dataset.fb) { el.dataset.fb = 1; el.src = placeholder(el.dataset.title); } }, true);
document.addEventListener("load", e => { const el = e.target; if (el.tagName === "IMG" && el.dataset.title && !el.dataset.fb && el.naturalWidth <= 2) { el.dataset.fb = 1; el.src = placeholder(el.dataset.title); } }, true);
const stars = r => `<span class="text-brand-400"><i class="bi bi-star-fill"></i></span> <span class="text-sm text-ink-300">${r.toFixed(1)}</span>`;

function toast(msg, icon = "bi-check-circle-fill") {
  const el = document.createElement("div");
  el.className = "toast align-items-center border border-warning text-bg-dark";
  el.setAttribute("role", "status");
  el.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi ${icon} text-warning me-2"></i>${esc(msg)}</div><button class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Fechar"></button></div>`;
  $("#toasts").appendChild(el);
  const t = new bootstrap.Toast(el, { delay: 2600 }); t.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

/* ---------- estado ---------- */
const state = {
  q: "", cat: "Todos", sort: "rel", onlyWish: false,
  cart: store.get("sb_cart", {}),    // { id: qty }
  wish: store.get("sb_wish", []),    // [id]
  coupon: store.get("sb_coupon", ""),
};
const save = () => { store.set("sb_cart", state.cart); store.set("sb_wish", state.wish); store.set("sb_coupon", state.coupon); };

/* ---------- render: hero, destaque, categorias ---------- */
function renderHero() {
  const rot = ["-rotate-6 mb-0", "scale-110 -mt-6 z-10", "rotate-6 mb-0"];
  $("#heroCovers").innerHTML = [13, 1, 3].map((id, i) => `
    <button data-action="view" data-id="${id}" class="w-28 sm:w-36 lg:w-40 shadow-glow rounded-lg transition duration-300 hover:scale-110 hover:z-20 animate-float ${rot[i]}" style="animation-delay:${i * .4}s" aria-label="Ver ${esc(byId(id).title)}">
      <div class="cover-box">${img(byId(id))}</div></button>`).join("");
}
function renderFeatured() {
  const b = byId(FEATURED_ID);
  $("#featured").innerHTML = `
    <h3 class="area-title font-display text-3xl lg:text-4xl text-white self-end mb-0">${esc(b.title)}<br><small class="text-brand-400 text-lg font-sans">${esc(b.author)}</small></h3>
    <div class="area-image mx-auto w-48 sm:w-56 md:w-full max-w-xs"><div class="cover-box shadow-book animate-float transition duration-300 hover:scale-105 hover:shadow-glow">${img(b)}</div></div>
    <div class="area-desc">
      <p class="text-ink-300 lg:text-lg">${esc(b.desc)}</p>
      <p class="mt-3 mb-2">${stars(b.rating)}</p>
      <p class="text-3xl font-semibold text-brand-400">${brl(b.price)}</p>
      <div class="flex flex-wrap gap-2 mt-3">
        <button class="btn-yellow" data-action="add" data-id="${b.id}"><i class="bi bi-bag-plus"></i> Adicionar ao carrinho</button>
        <button class="btn-dark" data-action="view" data-id="${b.id}">Ver detalhes</button>
      </div>
    </div>`;
}
function renderCats() {
  $("#cats").innerHTML = CATS.map(([name, icon]) => {
    const n = BOOKS.filter(b => b.cat === name).length;
    return `<button data-action="cat" data-cat="${esc(name)}" class="reveal opacity-0 p-4 sm:p-6 rounded-2xl bg-ink-900 border border-ink-700 text-center transition duration-300 hover:scale-105 hover:border-brand-400 hover:shadow-glow active:scale-95">
      <i class="bi ${icon} text-4xl text-brand-400"></i><h3 class="mt-2 mb-0 text-lg font-semibold text-white">${name}</h3><span class="text-sm text-ink-400">${n} livro${n > 1 ? "s" : ""}</span></button>`;
  }).join("");
  observeReveal();
}
function observeReveal() {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.remove("opacity-0"); en.target.classList.add("animate-slideIn"); io.unobserve(en.target); }
  }), { threshold: .2 });
  document.querySelectorAll(".reveal").forEach((el, i) => { el.style.animationDelay = `${(i % 4) * 120}ms`; io.observe(el); });
}

/* ---------- render: catálogo ---------- */
function filtered() {
  const q = state.q.trim().toLowerCase();
  let list = BOOKS.filter(b => (state.cat === "Todos" || b.cat === state.cat)
    && (!q || (b.title + " " + b.author + " " + b.cat).toLowerCase().includes(q))
    && (!state.onlyWish || state.wish.includes(b.id)));
  const s = state.sort;
  if (s === "asc") list.sort((a, b) => a.price - b.price);
  else if (s === "desc") list.sort((a, b) => b.price - a.price);
  else if (s === "az") list.sort((a, b) => a.title.localeCompare(b.title));
  else if (s === "rating") list.sort((a, b) => b.rating - a.rating);
  return list;
}
function bookCard(b) {
  const fav = state.wish.includes(b.id);
  return `<article class="animate-fadeIn flex flex-col rounded-2xl bg-ink-900 border border-ink-700 p-2 sm:p-3 shadow-book transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:border-brand-400 hover:animate-shadowPulse">
    <div class="relative">
      <button data-action="view" data-id="${b.id}" class="block w-full" aria-label="Ver detalhes de ${esc(b.title)}"><div class="cover-box">${img(b)}</div></button>
      <button data-action="wish" data-id="${b.id}" aria-label="Favoritar" class="absolute top-2 right-2 h-9 w-9 rounded-full bg-ink-950/80 text-white transition hover:scale-110 active:scale-90 ${fav ? "wish-on" : ""}"><i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}"></i></button>
      <span class="absolute bottom-2 left-2 rounded-full bg-ink-950/80 px-2 py-0.5 text-xs">${stars(b.rating)}</span>
    </div>
    <h3 class="mt-3 mb-0 text-sm sm:text-base font-semibold text-white line-clamp-2">${esc(b.title)}</h3>
    <p class="text-xs sm:text-sm text-ink-400 mb-1">${esc(b.author)}</p>
    <p class="mt-auto mb-2 text-lg font-semibold text-brand-400">${brl(b.price)}</p>
    <button class="btn-yellow w-full !py-2 text-sm" data-action="add" data-id="${b.id}"><i class="bi bi-bag-plus"></i> Comprar</button>
  </article>`;
}
function renderCatalog() {
  const list = filtered();
  $("#grid").innerHTML = list.map(bookCard).join("");
  $("#empty").classList.toggle("hidden", list.length > 0);
  $("#resultInfo").textContent = `${list.length} livro${list.length !== 1 ? "s" : ""}` + (state.cat !== "Todos" ? ` em ${state.cat}` : "") + (state.q ? ` para “${state.q}”` : "") + (state.onlyWish ? " (favoritos)" : "");
  $("#chips").innerHTML = ["Todos", ...CATS.map(c => c[0])].map(c =>
    `<button data-action="cat" data-cat="${esc(c)}" class="rounded-full border border-ink-600 px-4 py-1.5 text-sm text-ink-100 transition hover:border-brand-400 hover:text-brand-400 active:scale-95 ${state.cat === c ? "cat-active" : ""}">${c}</button>`).join("");
  $("#btnWishNav i").className = "bi fs-5 " + (state.onlyWish ? "bi-heart-fill text-warning" : "bi-heart");
}

/* ---------- carrinho ---------- */
function totals() {
  const sub = Object.entries(state.cart).reduce((s, [id, q]) => s + byId(id).price * q, 0);
  const disc = sub * (COUPONS[state.coupon] || 0);
  const ship = sub === 0 || sub - disc >= FREE_SHIP ? 0 : SHIP;
  return { sub, disc, ship, total: sub - disc + ship };
}
function renderCart() {
  const entries = Object.entries(state.cart);
  const count = entries.reduce((s, [, q]) => s + q, 0);
  const badge = $("#cartCount"); badge.textContent = count;
  badge.classList.remove("animate-bump"); void badge.offsetWidth; badge.classList.add("animate-bump");
  const wc = $("#wishCount"); wc.textContent = state.wish.length; wc.classList.toggle("d-none", !state.wish.length);
  $("#cartFooter").classList.toggle("d-none", !count);
  $("#cartItems").innerHTML = count ? entries.map(([id, q]) => { const b = byId(id); return `
    <div class="flex gap-3 py-3 border-bottom border-ink-700 animate-fadeIn">
      <div class="cover-box" style="width:64px;flex:none">${img(b)}</div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-white text-sm">${esc(b.title)}</div>
        <div class="text-xs text-ink-400">${esc(b.author)}</div>
        <div class="flex items-center gap-2 mt-2">
          <button class="h-7 w-7 rounded-full border border-ink-600 transition hover:border-brand-400 active:scale-90" data-action="dec" data-id="${id}" aria-label="Diminuir">−</button>
          <span class="w-6 text-center">${q}</span>
          <button class="h-7 w-7 rounded-full border border-ink-600 transition hover:border-brand-400 active:scale-90" data-action="inc" data-id="${id}" aria-label="Aumentar">+</button>
          <button class="ml-auto text-ink-400 transition hover:text-red-400" data-action="remove" data-id="${id}" aria-label="Remover"><i class="bi bi-trash"></i></button>
        </div>
      </div>
      <div class="text-brand-400 font-semibold text-sm">${brl(b.price * q)}</div>
    </div>`; }).join("")
    : `<div class="text-center text-ink-400 py-5"><i class="bi bi-bag-x fs-1"></i><p class="mt-2">Seu carrinho está vazio.</p><button class="btn-yellow" data-bs-dismiss="offcanvas" data-action="goto-books">Ver livros</button></div>`;
  const t = totals();
  $("#tSub").textContent = brl(t.sub);
  $("#tDisc").textContent = t.disc ? "− " + brl(t.disc) : "—";
  $("#tShip").textContent = t.ship ? brl(t.ship) : (t.sub ? "Grátis" : "—");
  $("#tTotal").textContent = brl(t.total);
  $("#couponInput").value = state.coupon;
  save();
}
function addToCart(id, n = 1) { state.cart[id] = (state.cart[id] || 0) + n; renderCart(); toast(`“${byId(id).title}” adicionado ao carrinho`, "bi-bag-check-fill"); }
function setQty(id, q) { if (q <= 0) delete state.cart[id]; else state.cart[id] = Math.min(q, 20); renderCart(); }
function toggleWish(id) {
  id = +id; const i = state.wish.indexOf(id);
  if (i >= 0) { state.wish.splice(i, 1); toast("Removido dos favoritos", "bi-heartbreak"); } else { state.wish.push(id); toast("Adicionado aos favoritos", "bi-heart-fill"); }
  renderCart(); renderCatalog();
}

/* ---------- modais ---------- */
function openView(id) {
  const b = byId(id), fav = state.wish.includes(b.id);
  $("#viewBody").innerHTML = `
    <div class="modal-header border-ink-700"><h5 class="modal-title font-display text-brand-400">${esc(b.title)}</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>
    <div class="modal-body"><div class="row gy-3">
      <div class="col-sm-4"><div class="cover-box shadow-book">${img(b)}</div></div>
      <div class="col-sm-8">
        <p class="text-ink-400 mb-1">${esc(b.author)} · <span class="text-brand-400">${esc(b.cat)}</span></p>
        <p>${stars(b.rating)}</p><p class="text-ink-300">${esc(b.desc)}</p>
        <p class="text-3xl font-semibold text-brand-400">${brl(b.price)}</p>
        <div class="flex flex-wrap gap-2">
          <button class="btn-yellow" data-action="add" data-id="${b.id}"><i class="bi bi-bag-plus"></i> Adicionar ao carrinho</button>
          <button class="btn-dark" data-action="wish" data-id="${b.id}"><i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}"></i> Favoritar</button>
        </div>
      </div></div></div>`;
  bootstrap.Modal.getOrCreateInstance("#viewModal").show();
}
function openCheckout() {
  if (!Object.keys(state.cart).length) return toast("Seu carrinho está vazio", "bi-exclamation-circle");
  bootstrap.Offcanvas.getOrCreateInstance("#cartCanvas").hide();
  const t = totals();
  $("#checkoutBody").innerHTML = `
    <div class="modal-header border-ink-700"><h5 class="modal-title font-display text-brand-400">Finalizar compra</h5><button class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>
    <form id="checkoutForm" novalidate><div class="modal-body">
      <div class="mb-3"><label class="form-label">Nome completo</label><input name="name" class="form-control" required minlength="3"><div class="invalid-feedback">Informe seu nome.</div></div>
      <div class="mb-3"><label class="form-label">E-mail</label><input name="email" type="email" class="form-control" required><div class="invalid-feedback">Informe um e-mail válido.</div></div>
      <div class="mb-3"><label class="form-label">Endereço de entrega</label><input name="addr" class="form-control" required minlength="6"><div class="invalid-feedback">Informe o endereço.</div></div>
      <div class="mb-3"><label class="form-label">Pagamento</label><select name="pay" class="form-select" required><option value="">Selecione...</option><option>Pix</option><option>Cartão de crédito</option><option>Boleto</option></select><div class="invalid-feedback">Escolha uma forma de pagamento.</div></div>
      <div class="flex justify-between text-xl font-semibold"><span>Total</span><span class="text-brand-400">${brl(t.total)}</span></div>
    </div>
    <div class="modal-footer border-ink-700"><button type="button" class="btn-dark" data-bs-dismiss="modal">Cancelar</button><button class="btn-yellow">Confirmar pedido</button></div></form>`;
  bootstrap.Modal.getOrCreateInstance("#checkoutModal").show();
}
document.addEventListener("submit", e => {
  if (e.target.id === "checkoutForm") {
    e.preventDefault(); const f = e.target;
    if (!f.checkValidity()) { f.classList.add("was-validated"); return; }
    const order = "SB" + Date.now().toString().slice(-6), name = f.name.value.split(" ")[0];
    state.cart = {}; state.coupon = ""; renderCart();
    $("#checkoutBody").innerHTML = `<div class="modal-body text-center py-5"><i class="bi bi-check-circle-fill text-brand-400" style="font-size:4rem"></i>
      <h4 class="font-display mt-3 text-white">Obrigado, ${esc(name)}!</h4><p class="text-ink-300">Pedido <b class="text-brand-400">#${order}</b> confirmado. Enviamos os detalhes para ${esc(f.email.value)}.</p>
      <button class="btn-yellow" data-bs-dismiss="modal">Continuar comprando</button></div>`;
  }
  if (e.target.id === "newsForm") {
    e.preventDefault(); const i = $("#newsEmail");
    if (!i.checkValidity() || !i.value) { i.classList.add("is-invalid"); return toast("Digite um e-mail válido", "bi-exclamation-circle"); }
    i.classList.remove("is-invalid"); i.value = ""; toast("Inscrição confirmada! Use o cupom STORE10");
  }
  if (e.target.id === "searchForm") { e.preventDefault(); scrollToBooks(); }
});

/* ---------- eventos ---------- */
const scrollToBooks = () => $("#livros").scrollIntoView({ behavior: "smooth" });
document.addEventListener("click", e => {
  const el = e.target.closest("[data-action]"); if (!el) return;
  const { action, id, cat } = el.dataset;
  switch (action) {
    case "add": addToCart(+id); break;
    case "inc": setQty(id, state.cart[id] + 1); break;
    case "dec": setQty(id, state.cart[id] - 1); break;
    case "remove": setQty(id, 0); break;
    case "clear": state.cart = {}; renderCart(); toast("Carrinho esvaziado", "bi-trash"); break;
    case "wish": toggleWish(id); if ($("#viewModal.show")) openView(id); break;
    case "view": openView(id); break;
    case "cat": state.cat = cat; state.onlyWish = false; renderCatalog(); scrollToBooks(); break;
    case "toggle-wish-filter": state.onlyWish = !state.onlyWish; renderCatalog(); scrollToBooks(); if (state.onlyWish && !state.wish.length) toast("Você ainda não tem favoritos", "bi-heart"); break;
    case "reset": Object.assign(state, { q: "", cat: "Todos", onlyWish: false }); $("#searchInput").value = ""; renderCatalog(); break;
    case "coupon": {
      const c = $("#couponInput").value.trim().toUpperCase();
      if (COUPONS[c]) { state.coupon = c; renderCart(); toast(`Cupom ${c} aplicado: ${COUPONS[c] * 100}% de desconto`); }
      else toast("Cupom inválido", "bi-x-circle-fill");
      break; }
    case "checkout": openCheckout(); break;
    case "goto-books": setTimeout(scrollToBooks, 300); break;
    case "top": window.scrollTo({ top: 0, behavior: "smooth" }); break;
  }
});
$("#searchInput").addEventListener("input", e => { state.q = e.target.value; state.onlyWish = false; renderCatalog(); });
$("#sortSelect").addEventListener("change", e => { state.sort = e.target.value; renderCatalog(); });
document.querySelectorAll("#menu .nav-link").forEach(a => a.addEventListener("click", () => bootstrap.Collapse.getInstance("#menu")?.hide()));

// botão "voltar ao topo" + destaque do link ativo (scroll spy)
addEventListener("scroll", () => $("#toTop").classList.toggle("hidden", scrollY < 500), { passive: true });
const spy = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) document.querySelectorAll("#menu .nav-link").forEach(a => a.classList.toggle("active-link", a.getAttribute("href") === "#" + en.target.id));
}), { rootMargin: "-40% 0px -55% 0px" });
["destaques", "livros", "categorias", "contato"].forEach(id => spy.observe(document.getElementById(id)));

/* ---------- início ---------- */
renderHero(); renderFeatured(); renderCats(); renderCatalog(); renderCart();
