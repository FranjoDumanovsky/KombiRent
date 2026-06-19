export function initFleetSwiper() {
  const swiperEl = document.querySelector(".fleet-swiper");

  if (!swiperEl || typeof Swiper === "undefined") return;

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
