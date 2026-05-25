export function initAccordion() {
  const triggers = document.querySelectorAll("[data-accordion-trigger]");
  if (!triggers.length) return;

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".accordion__item");
      if (!item) return;

      const isOpen = item.classList.contains("accordion__item--open");
      const expanded = !isOpen;

      item.classList.toggle("accordion__item--open");
      trigger.setAttribute("aria-expanded", String(expanded));
    });
  });
}
