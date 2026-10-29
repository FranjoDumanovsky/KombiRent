import { whenIdleAfterLoad } from "./deferred-images.js?v=1";

export function initFleetSwiper() {
  const swiperEl = document.querySelector(".fleet-swiper");

  if (!swiperEl) return;

  // The fleet sits right under the hero, so Swiper would otherwise compete with the
  // hero image for bandwidth: it loads once the page is idle and the fleet is near
  // the viewport. (Slide photos are deferred by deferred-images.js.) Swiper's CSS
  // loads non-blocking (media="print" swap); slides are measured only after both
  // the script and the CSS are in.
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      Promise.all([loadSwiperScript(), swiperCssReady()]).then(createFleetSwiper);
    },
    { rootMargin: "600px 0px" },
  );

  whenIdleAfterLoad(() => observer.observe(swiperEl));
}

function loadSwiperScript() {
  if (typeof Swiper !== "undefined") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL("./vendor/swiper-bundle.min.js?v=4", import.meta.url).href;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

function swiperCssReady() {
  const swiperCss = document.getElementById("swiper-css");
  if (!swiperCss || swiperCss.media === "all") return Promise.resolve();

  return new Promise((resolve) => swiperCss.addEventListener("load", resolve, { once: true }));
}

function createFleetSwiper() {
  new Swiper(".fleet-swiper", {
    slidesPerView: 1,
    spaceBetween: 8,
    centeredSlides: true,
    loop: false,
    speed: 500,
    grabCursor: true,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    a11y: {
      prevSlideMessage: "Previous vehicle",
      nextSlideMessage: "Next vehicle",
    },
    pagination: {
      el: ".fleet-swiper .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".fleet-swiper .swiper-button-next",
      prevEl: ".fleet-swiper .swiper-button-prev",
    },
    breakpoints: {
      768: {
        slidesPerView: 1.5,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
    },
  });
}
