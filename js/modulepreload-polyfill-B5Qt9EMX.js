/*
  This file was missing from the scraped bundle. main.js / gallery.js both do
  `import "./modulepreload-polyfill-B5Qt9EMX.js"` at the very top of the file.
  A missing static import fails the ENTIRE module load in the browser, which is
  why nothing on the page was working (not just images) — no gold rate, no
  WhatsApp popup, no reveal animations, no gallery grid, no reel lightbox.

  This restores the standard Vite "modulepreload" polyfill behavior.
*/
(function () {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload") {
          processPreload(node);
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });

  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") {
      fetchOpts.credentials = "include";
    } else if (link.crossOrigin === "anonymous") {
      fetchOpts.credentials = "omit";
    } else {
      fetchOpts.credentials = "same-origin";
    }
    return fetchOpts;
  }

  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts).catch(() => {});
  }
})();
