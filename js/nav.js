export function initNav() {
  const toggle = document.querySelector('[data-action="toggle-nav"]');
  const menu = document.querySelector('[data-nav="menu"]');

  function closeMenu() {
    toggle?.setAttribute("aria-expanded", "false");
    menu?.classList.remove("nav__menu--open");
    document.body.classList.remove("body--nav-open");
  }

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
    menu?.classList.toggle("nav__menu--open");
    document.body.classList.toggle("body--nav-open");
  });

  menu?.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });
}
