/**
 * Scrammio – product data from data/products.json
 * Renders cards into [data-products] containers and game detail on game.html?id=xxx
 */

(function () {
  "use strict";

  var DATA_URL = "data/products.json";

  function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function getCardLink(product, category) {
    if (category === "games") {
      return "game.html?id=" + encodeURIComponent(product.id);
    }
    if (product.linkUrl) return product.linkUrl;
    if (product.shopUrl) return product.shopUrl;
    return "#";
  }

  function renderCard(product, category, isScrollItem) {
    if (isScrollItem === undefined) isScrollItem = true;
    var link = getCardLink(product, category);
    var desc = product.shortDesc || product.tagline || "";
    var target = category === "games" ? "" : ' target="_blank" rel="noopener noreferrer"';
    var cardClass = "card" + (isScrollItem ? " card-scroll-item" : "") + (category === "badges" ? " badge-card" : "");
    return (
      '<a href="' + escapeHtml(link) + '" class="' + cardClass + '"' + target + '>' +
      '<img class="card-image" src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.title) + '">' +
      '<div class="card-body">' +
      '<h3 class="card-title">' + escapeHtml(product.title) + "</h3>" +
      '<p class="card-desc">' + escapeHtml(desc) + "</p>" +
      "</div>" +
      "</a>"
    );
  }

  function renderGameDetail(game) {
    var galleryHtml = (game.gallery || []).map(function (src, i) {
      return '<img src="' + escapeHtml(src) + '" alt="Gallery image ' + (i + 1) + '">';
    }).join("\n");
    var bulletsHtml = (game.gameplayBullets || []).map(function (b) {
      return "<li>" + escapeHtml(b) + "</li>";
    }).join("\n");
    return (
      '<section class="game-hero">' +
      '<img class="game-hero-image" src="' + escapeHtml(game.heroImage || game.image) + '" alt="' + escapeHtml(game.title) + '">' +
      '<div class="game-hero-content">' +
      '<h1 class="game-title">' + escapeHtml(game.title) + "</h1>" +
      '<p class="game-tagline">' + escapeHtml(game.tagline || "") + "</p>" +
      "</div>" +
      "</section>" +
      '<section class="game-about section">' +
      "<h2>About the game</h2>" +
      "<p>" + escapeHtml(game.about || "") + "</p>" +
      "</section>" +
      '<section class="game-gameplay section">' +
      "<h2>Gameplay</h2>" +
      "<p>" + escapeHtml(game.gameplay || "") + "</p>" +
      (bulletsHtml ? "<ul>" + bulletsHtml + "</ul>" : "") +
      "</section>" +
      '<section class="section">' +
      '<h2 class="section-title">Gallery</h2>' +
      '<div class="game-gallery">' + galleryHtml + "</div>" +
      "</section>" +
      '<div class="game-cta">' +
      '<a href="' + escapeHtml(game.shopUrl || "#") + '" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Buy Now</a>' +
      "</div>"
    );
  }

  function injectCards(container, products, category) {
    if (!products || !products.length) return;
    var isScrollItem = container.classList.contains("cards-scroll");
    var html = products.map(function (p) { return renderCard(p, category, isScrollItem); }).join("\n");
    container.innerHTML = html;
  }

  function loadAndInjectCards() {
    fetch(DATA_URL)
      .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error("Failed to load products")); })
      .then(function (data) {
        document.querySelectorAll("[data-products]").forEach(function (el) {
          var category = el.getAttribute("data-products");
          var list = data[category];
          var section = el.closest("section");
          var isHomeSection = section && section.classList.contains("home-section");
          if (list && list.length > 0) {
            injectCards(el, list, category);
            if (isHomeSection) section.classList.remove("product-section-empty");
          } else if (isHomeSection) {
            section.classList.add("product-section-empty");
          }
        });
        window.dispatchEvent(new CustomEvent("productsInjected"));
      })
      .catch(function () {
        document.querySelectorAll("[data-products]").forEach(function (el) {
          el.innerHTML = '<p class="card-desc">Products could not be loaded. Check data/products.json.</p>';
        });
      });
  }

  function initGamePage() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get("id");
    var container = document.getElementById("game-detail");
    if (!id || !container) return;
    fetch(DATA_URL)
      .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
      .then(function (data) {
        var game = (data.games || []).find(function (g) { return g.id === id; });
        if (game) {
          document.title = game.title + " – Scrammio";
          var meta = document.querySelector('meta[name="description"]');
          if (meta) meta.setAttribute("content", (game.tagline || "") + " " + (game.shortDesc || ""));
          container.innerHTML = renderGameDetail(game);
        } else {
          container.innerHTML = "<p>Game not found.</p>";
        }
      })
      .catch(function () {
        container.innerHTML = "<p>Could not load game details.</p>";
      });
  }

  if (document.getElementById("game-detail")) {
    initGamePage();
  } else {
    loadAndInjectCards();
  }
})();
