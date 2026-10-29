// The Google Maps embed pulls ~500 KB of third-party script, so it gets its src
// (kept in data-src) only when the iframe comes near the viewport.
export function initLazyEmbeds() {
  const frames = document.querySelectorAll("iframe[data-src]");

  if (!frames.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "800px 0px" },
  );

  frames.forEach((frame) => observer.observe(frame));
}
