// Submits the contact form with fetch so the page never reloads and the visitor
// never gets thrown back to the top and scrolled down again. The result lands in
// #form-status: success fades away on its own, an error stays until the next try.
//
// send.php still redirects back with ?sent=1/0 when JavaScript is off, so that
// flag is read here too and the banner behaves the same way.

const HIDE_AFTER = 6000;
// Keep in sync with --duration-normal in tokens.css.
const FADE_MS = 250;

export function initFormStatus() {
  const el = document.getElementById("form-status");
  if (!el) return;

  const isEn = document.documentElement.lang === "en";
  const messages = {
    ok: isEn
      ? "Thank you! Your inquiry has been sent — we will get back to you shortly."
      : "Hvala! Vaš upit je poslan — javit ćemo se u najkraćem roku.",
    err: isEn
      ? "Sending failed. Please try again, or call / email us."
      : "Slanje nije uspjelo. Pokušajte ponovno ili nas nazovite / pošaljite e-mail.",
    sending: isEn ? "Sending…" : "Šaljem…",
  };

  let hideTimer;
  let fadeTimer;

  function show(ok) {
    clearTimeout(hideTimer);
    clearTimeout(fadeTimer);

    el.textContent = ok ? messages.ok : messages.err;
    el.classList.toggle("form-status--ok", ok);
    el.classList.toggle("form-status--error", !ok);
    el.hidden = false;

    // Force a reflow: without it the class lands in the same frame as the
    // unhide, the element goes straight to its end state and nothing animates.
    void el.offsetWidth;
    el.classList.add("form-status--visible");

    // Errors stay put — the visitor needs them to decide what to do next.
    if (ok) hideTimer = setTimeout(hide, HIDE_AFTER);
  }

  function hide() {
    el.classList.remove("form-status--visible");
    fadeTimer = setTimeout(() => {
      el.hidden = true;
    }, FADE_MS);
  }

  // No-JS fallback path: send.php redirected back with the flag in the query.
  const sent = new URLSearchParams(location.search).get("sent");
  if (sent !== null) {
    show(sent === "1");
    // Strip the query so a refresh does not re-display a stale message.
    history.replaceState(null, "", location.pathname + location.hash);
  }

  const form = document.querySelector('form[data-form="validate"]');
  if (!form) return;

  const button = form.querySelector('button[type="submit"]');

  form.addEventListener("submit", async (e) => {
    // forms.js runs its validation listener first and cancels the event when a
    // field is invalid; let that stand instead of sending anyway.
    if (e.defaultPrevented) return;

    e.preventDefault();

    const label = button ? button.textContent : "";
    if (button) {
      button.disabled = true;
      button.textContent = messages.sending;
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const data = await response.json().catch(() => null);
      const ok = response.ok && data !== null && data.ok === true;

      show(ok);
      if (ok) form.reset();
    } catch {
      show(false);
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = label;
      }
    }
  });
}
