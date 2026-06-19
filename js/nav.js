export function initNav() {
  const toggle = document.querySelector('[data-action="toggle-nav"]');
  const menu = document.querySelector('[data-nav="menu"]');
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  const dropdownLink = menu?.querySelector(".nav__link--has-dropdown");
  const dropdownItem = dropdownLink?.closest(".nav__item--dropdown");

  function closeDropdown() {
    dropdownItem?.classList.remove("nav__item--dropdown--open");
    dropdownLink?.setAttribute("aria-expanded", "false");
  }

  function closeMenu() {
    toggle?.setAttribute("aria-expanded", "false");
    menu?.classList.remove("nav__menu--open");
    document.body.classList.remove("body--nav-open");
    closeDropdown();
  }

  toggle?.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
    menu?.classList.toggle("nav__menu--open");
    document.body.classList.toggle("body--nav-open");
    if (isOpen) closeDropdown();
  });

  // On mobile, tapping "Vozila" toggles the sub-dropdown instead of navigating/closing.
  dropdownLink?.setAttribute("aria-haspopup", "true");
  dropdownLink?.setAttribute("aria-expanded", "false");
  dropdownLink?.addEventListener("click", (e) => {
    if (!mobileQuery.matches) return;
    e.preventDefault();
    const isOpen = dropdownItem?.classList.toggle("nav__item--dropdown--open");
    dropdownLink.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  menu
    ?.querySelectorAll(".nav__link:not(.nav__link--has-dropdown)")
    .forEach((link) => link.addEventListener("click", closeMenu));

  // Vehicle links inside the dropdown close the whole menu.
  menu
    ?.querySelectorAll(".nav__dropdown-link")
    .forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      closeMenu();
    }
  });
}
