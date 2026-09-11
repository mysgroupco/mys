/* Pet Content - interactions
   - Mobile nav toggle
   - Sticky header scroll state (IntersectionObserver sentinel, no scroll listener)
   - Scroll-reveal on entry (IntersectionObserver)
   All motion honors prefers-reduced-motion.
*/
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile navigation ---- */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");

  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    // Close the menu after tapping a link
    nav.querySelectorAll(".nav__links a, .nav__cta a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  /* ---- Sticky header shadow via a sentinel at the top of the page ---- */
  var header = document.querySelector(".header");
  var sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:0;left:0;height:1px;width:1px;";
  document.body.prepend(sentinel);

  if (header && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      header.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }

  /* ---- Scroll reveal ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Sample play button feedback (no real video wired up) ---- */
  var play = document.querySelector(".hero__play");
  if (play) {
    play.addEventListener("click", function () {
      var frame = document.querySelector(".hero__frame");
      if (frame) {
        frame.animate(
          [{ transform: "scale(1)" }, { transform: "scale(0.985)" }, { transform: "scale(1)" }],
          { duration: 240, easing: "cubic-bezier(0.16,1,0.3,1)" }
        );
      }
    });
  }
})();
