/* GitHub Pages cannot send COOP/COEP headers, which the threaded emulator needs. A tiny service worker adds them. */
(async () => {
  if (self.crossOriginIsolated || !("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register(new URL("../sw.js", document.currentScript.src));
    if (reg.active && !navigator.serviceWorker.controller) location.reload();
    else reg.addEventListener("updatefound", () => reg.installing.addEventListener("statechange", e => { if (e.target.state === "activated") location.reload(); }));
  } catch (e) { console.warn("service worker failed", e); }
})();
