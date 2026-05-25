export function initForms() {
  const forms = document.querySelectorAll('[data-form="validate"]');

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const inputs = form.querySelectorAll("input, textarea, select");
      let isValid = true;

      inputs.forEach((input) => {
        const group = input.closest(".form__group");
        const error = group?.querySelector(".form__error");

        if (!input.checkValidity()) {
          isValid = false;
          group?.classList.add("form__group--error");
          if (error) error.textContent = input.validationMessage;
        } else {
          group?.classList.remove("form__group--error");
          if (error) error.textContent = "";
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });

    form.querySelectorAll("input, textarea, select").forEach((input) => {
      input.addEventListener("input", () => {
        const group = input.closest(".form__group");
        if (input.checkValidity()) {
          group?.classList.remove("form__group--error");
        }
      });
    });
  });
}
