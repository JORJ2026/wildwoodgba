# Wildwood web player (GitHub Pages)

Files: `index.html`, `css/style.css`, `js/app.js`, `js/coi.js`, `sw.js`, `roms/Wildwood_v0.6.gba`.

Publish: push this folder to a repo, then Settings > Pages > deploy from the branch root. Visit the page; the first load registers a
service worker (adds the headers the emulator needs) and reloads once. Press F for full screen.

Emulator: mGBA compiled to WebAssembly (`@thenick775/mgba-wasm` 2.6.0), loaded from the jsDelivr CDN. To host it yourself (offline use),
run `npm i @thenick775/mgba-wasm@2.6.0` and copy `node_modules/@thenick775/mgba-wasm/dist/mgba.js` and `mgba.wasm` into a `vendor/` folder here.

Status: not tested in a browser by the author. If the page shows an error, the message includes whether cross-origin isolation is active.
