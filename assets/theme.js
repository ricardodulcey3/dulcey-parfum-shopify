// ===== Menú móvil =====
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    navToggle.classList.toggle("open");
  });

  document.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.classList.remove("open");
    });
  });
}

// ===== Header: fondo sólido al hacer scroll =====
const header = document.getElementById("header");
function onScrollHeader() {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 40);
}
window.addEventListener("scroll", onScrollHeader, { passive: true });

// ===== Scroll reveal con IntersectionObserver =====
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-animate]");
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

  targets.forEach(t => observer.observe(t));
}

// ===== Contadores animados =====
function animateCounter(el) {
  const target = parseFloat(el.dataset.countTo);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const isK = el.dataset.format === "k";
  const duration = 1400;
  const start = performance.now();

  function formatValue(v) {
    if (isK) {
      return v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}K` : Math.round(v);
    }
    return Math.round(v);
  }

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${formatValue(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ===== Filtros de catálogo (filtra tarjetas ya renderizadas por Liquid, por data-category) =====
function initCatalogFilters() {
  document.querySelectorAll("[data-filters]").forEach(filterBar => {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      applyFilter(filterBar, btn.dataset.filter);
    });
  });
}

function applyFilter(filterBar, filter) {
  filterBar.querySelectorAll(".filter-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.filter === filter);
  });

  const gridId = filterBar.dataset.filters;
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const cards = grid.querySelectorAll(".product-card");
  let visibleCount = 0;
  cards.forEach(card => {
    const categories = (card.dataset.category || "").split(",");
    const show = filter === "todos" || categories.includes(filter);
    card.classList.toggle("is-hidden", !show);
    if (show) visibleCount++;
  });

  const emptyMsg = grid.parentElement.querySelector(".catalog__empty");
  if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? "block" : "none";
}

// ===== Tarjetas de colección -> filtran el catálogo de la home =====
function initCategoryCards() {
  document.querySelectorAll(".category-card[data-filter-target]").forEach(card => {
    card.addEventListener("click", () => {
      const filterBar = document.querySelector("[data-filters]");
      const target = document.getElementById("catalogo");
      if (filterBar) applyFilter(filterBar, card.dataset.filterTarget);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ===== Carrito: contador en el header =====
function updateCartCount(count) {
  const bubble = document.getElementById("CartCount");
  if (!bubble) return;
  bubble.textContent = count;
  bubble.style.display = count > 0 ? "flex" : "none";
}

function addToCart(id, quantity, button) {
  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = "Agregando…";
  }

  return fetch("/cart/add.js", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ id, quantity }),
  })
    .then(res => res.json())
    .then(() => fetch("/cart.js").then(res => res.json()))
    .then(cart => {
      updateCartCount(cart.item_count);
      if (button) button.textContent = "¡Agregado!";
      return cart;
    })
    .catch(() => {
      if (button) button.textContent = "Error, intenta de nuevo";
    })
    .finally(() => {
      if (button) {
        setTimeout(() => {
          button.disabled = false;
          button.textContent = button.dataset.originalText;
        }, 1600);
      }
    });
}

// ===== Botón "Comprar" en tarjetas de producto (variante por defecto) =====
function initQuickAdd() {
  document.querySelectorAll("[data-quick-add]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(btn.dataset.variantId, 1, btn);
    });
  });
}

// ===== Formulario de producto (página de producto) =====
function initProductForm() {
  const form = document.getElementById("ProductForm");
  if (!form) return;

  const submitBtn = form.querySelector("[data-add-to-cart]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const variantId = form.querySelector("[name='id']").value;
    const qtyInput = form.querySelector("[name='quantity']");
    const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;
    addToCart(variantId, quantity, submitBtn);
  });
}

// ===== Cambios de cantidad en la página de carrito =====
function initCartQuantity() {
  document.querySelectorAll("[data-cart-qty]").forEach(input => {
    input.addEventListener("change", () => {
      const line = input.dataset.cartQty;
      const quantity = parseInt(input.value, 10) || 0;

      fetch("/cart/change.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line, quantity }),
      }).then(() => window.location.reload());
    });
  });
}

// ===== Video del hero =====
// En móvil o con "reducir movimiento" quitamos el elemento por completo:
// ocultarlo con CSS no impide que el navegador descargue el archivo.
function initHeroVideo() {
  const video = document.querySelector(".hero__video");
  if (!video) return;

  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (isSmallScreen || prefersReducedMotion) {
    video.remove();
    return;
  }

  const playAttempt = video.play();
  if (playAttempt) playAttempt.catch(() => video.remove());
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initCounters();
  initCatalogFilters();
  initCategoryCards();
  initQuickAdd();
  initProductForm();
  initCartQuantity();
  onScrollHeader();
  initHeroVideo();
});
