export function initLightbox() {
  const gallery = document.querySelector("[data-lightbox-gallery]");
  if (!gallery) return;

  const items = [...gallery.querySelectorAll("[data-lightbox-item]")];
  if (!items.length) return;

  let currentIndex = 0;
  let lightbox = null;
  let imgEl = null;
  let counterEl = null;

  function build() {
    lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image gallery");

    lightbox.innerHTML = `
      <div class="lightbox__overlay" data-lightbox-close></div>
      <button class="lightbox__btn lightbox__btn--close" data-lightbox-close aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <button class="lightbox__btn lightbox__btn--prev" data-lightbox-prev aria-label="Previous image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="lightbox__content">
        <img class="lightbox__img" src="" alt="" />
      </div>
      <button class="lightbox__btn lightbox__btn--next" data-lightbox-next aria-label="Next image">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div class="lightbox__counter" aria-live="polite"></div>
    `;

    document.body.appendChild(lightbox);

    imgEl = lightbox.querySelector(".lightbox__img");
    counterEl = lightbox.querySelector(".lightbox__counter");

    lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) =>
      el.addEventListener("click", close)
    );
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", prev);
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", next);
  }

  function getFullSrc(item) {
    const img = item.querySelector("img");
    return img?.dataset.full || img?.src || "";
  }

  function getAlt(item) {
    return item.querySelector("img")?.alt || "";
  }

  function show(index) {
    currentIndex = index;
    const src = getFullSrc(items[currentIndex]);
    const alt = getAlt(items[currentIndex]);
    imgEl.src = src;
    imgEl.alt = alt;
    counterEl.textContent = `${currentIndex + 1} / ${items.length}`;
  }

  function open(index) {
    if (!lightbox) build();
    show(index);
    lightbox.classList.add("lightbox--open");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    lightbox.querySelector("[data-lightbox-close]").focus();
  }

  function close() {
    if (!lightbox) return;
    lightbox.classList.remove("lightbox--open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKey);
    items[currentIndex]?.focus();
  }

  function prev() {
    show((currentIndex - 1 + items.length) % items.length);
  }

  function next() {
    show((currentIndex + 1) % items.length);
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  items.forEach((item, i) => {
    item.addEventListener("click", () => open(i));
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(i);
      }
    });
  });
}
