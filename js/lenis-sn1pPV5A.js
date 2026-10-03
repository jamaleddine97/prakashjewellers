/*
  This file was missing from the scraped bundle. main.js does
  `import { L as Yl } from "./lenis-sn1pPV5A.js"` and gallery.js does the same
  (as `$`). A missing static import fails the whole module, which is why the
  page looked "static" with nothing loading.

  The real Lenis library isn't part of the scrape, so this is a small
  compatible shim covering just the API surface main.js/gallery.js actually
  call: the constructor, raf(), on()/off("scroll", cb), stop(), start().
  It deliberately does NOT hijack the mouse wheel / native scroll — it just
  reports native scroll position — so scrolling stays exactly as reliable as
  a normal page, just without Lenis's inertia easing.
*/
class L {
  constructor(options = {}) {
    this.options = options;
    this._listeners = {};
    this._stopped = false;

    this._onScroll = () => {
      if (this._stopped) return;
      this._emit("scroll", {
        scroll: window.scrollY,
        limit: Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          0
        ),
        velocity: 0,
        direction: 0,
        progress: 0,
      });
    };

    window.addEventListener("scroll", this._onScroll, { passive: true });
  }

  // Called every frame by a manual requestAnimationFrame loop in the app code.
  // Native scrolling is used instead of Lenis-driven smoothing, so this is a
  // safe no-op kept only so that loop keeps working without throwing.
  raf(_time) {}

  on(event, cb) {
    (this._listeners[event] || (this._listeners[event] = [])).push(cb);
    return this;
  }

  off(event, cb) {
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter((fn) => fn !== cb);
    return this;
  }

  _emit(event, payload) {
    (this._listeners[event] || []).forEach((fn) => fn(payload));
  }

  stop() {
    this._stopped = true;
  }

  start() {
    this._stopped = false;
  }

  destroy() {
    window.removeEventListener("scroll", this._onScroll);
    this._listeners = {};
  }

  scrollTo(target, opts = {}) {
    const behavior = opts.immediate ? "auto" : "smooth";
    if (typeof target === "number") {
      window.scrollTo({ top: target, behavior });
    } else if (target && typeof target.getBoundingClientRect === "function") {
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        (opts.offset || 0);
      window.scrollTo({ top, behavior });
    }
  }
}

export { L };
