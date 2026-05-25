export function initFleetSwiper() {
  const swiperEl = document.querySelector(".fleet-swiper");

  if (!swiperEl || typeof Swiper === "undefined") return;

  /* Swiper 11 loop mode repositions (not clones) slides, so it needs
     at least  ceil(slidesPerView) * 2  physical DOM slides to fill
     both sides of the centred active card.  Duplicate the original
     set until we meet that minimum. */
  const wrapper = swiperEl.querySelector(".swiper-wrapper");
  const origSlides = [...wrapper.children];
  const minNeeded = 6; // 2.5 × 2 = 5, +1 buffer
  let i = 0;
  while (wrapper.children.length < minNeeded) {
    wrapper.appendChild(origSlides[i % origSlides.length].cloneNode(true));
    i++;
  }

  const uniqueCount = origSlides.length;

  new Swiper(".fleet-swiper", {
    slidesPerView: 1,
    spaceBetween: 8,
    centeredSlides: true,
    loop: true,
    loopedSlides: uniqueCount,
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
