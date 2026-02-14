/**
 * Scrammio – minimal vanilla JS
 * - Mobile nav toggle
 * - Smooth scroll for anchor links (handled by CSS scroll-behavior: smooth; fallback for older browsers here if needed)
 */

(function () {
  "use strict";

  var navToggle = document.getElementById("nav-toggle");
  var navLinks = document.getElementById("nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Optional: close menu when a link is clicked (helps on mobile after navigation)
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Smooth scroll for anchor links (enhancement; CSS scroll-behavior: smooth already does this in supported browsers)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Horizontal card scroll: arrow buttons + peek effect (runs on load and after products.js injects cards)
  function initCardScrolls() {
    var scrollAmount = 340;
    document.querySelectorAll(".cards-scroll-wrapper").forEach(function (wrapper) {
    var scrollEl = wrapper.querySelector(".cards-scroll");
    var leftBtn = wrapper.querySelector(".scroll-arrow-left");
    var rightBtn = wrapper.querySelector(".scroll-arrow-right");
    if (!scrollEl || !leftBtn || !rightBtn) return;

    var cards = scrollEl.querySelectorAll(".card-scroll-item");
    var visibleCenterOffset = scrollEl.clientWidth / 2;
    var minOpacity = 0.5;
    var minScale = 0.88;

    function updatePeek() {
      var scrollCenter = scrollEl.scrollLeft + visibleCenterOffset;
      cards.forEach(function (card) {
        var cardCenter = card.offsetLeft + card.offsetWidth / 2;
        var distance = Math.abs(cardCenter - scrollCenter);
        var maxDistance = scrollEl.clientWidth * 0.6;
        var t = Math.min(1, distance / maxDistance);
        var opacity = 1 - t * (1 - minOpacity);
        var scale = 1 - t * (1 - minScale);
        card.style.opacity = String(opacity);
        card.style.setProperty("--peek-scale", String(scale));
      });
    }

    function updateArrows() {
      leftBtn.disabled = scrollEl.scrollLeft <= 0;
      rightBtn.disabled = scrollEl.scrollLeft >= scrollEl.scrollWidth - scrollEl.clientWidth - 1;
      updatePeek();
    }

    leftBtn.addEventListener("click", function () {
      scrollEl.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
    rightBtn.addEventListener("click", function () {
      scrollEl.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });
    scrollEl.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    updateArrows();
  });
  }
  initCardScrolls();
  window.addEventListener("productsInjected", initCardScrolls);
})();
