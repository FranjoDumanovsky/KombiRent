// Below-the-fold photos keep their real source in data-src / data-srcset so they
// don't compete with the hero image. They get it once the page has loaded and the
// browser is idle; native loading="lazy" still decides when each one downloads.
export function whenIdleAfterLoad(callback) {
  const idle = () =>
    "requestIdleCallback" in window
      ? requestIdleCallback(callback, { timeout: 1500 })
      : setTimeout(callback, 200);

  if (document.readyState === "complete") {
    idle();
  } else {
    window.addEventListener("load", idle, { once: true });
  }
}

export function loadDeferredImages(root = document) {
  root.querySelectorAll("img[data-src]").forEach((img) => {
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
    img.removeAttribute("data-srcset");
  });
}

export function initDeferredImages() {
  whenIdleAfterLoad(() => loadDeferredImages());
}
