// Wildwood web player: mGBA (WebAssembly). Uses ./vendor/ if you add the emulator files there, else the jsDelivr CDN.
const CDN = "https://cdn.jsdelivr.net/npm/@thenick775/mgba-wasm@2.6.0/dist/";
const ROM_URL = "roms/Wildwood_v0.6.gba";
const $ = id => document.getElementById(id), msg = $("msg"), stage = $("stage"), canvas = $("canvas");
const say = t => { msg.textContent = t; msg.style.display = t ? "" : "none"; };
let M = null, paused = false, muted = false;

async function boot(bytes, name) {
  say("Starting " + name + "...");
  await new Promise(r => M.uploadRom(new File([bytes], name), r));
  const path = M.listRoms().find(p => p.endsWith(name)) || M.listRoms()[0];
  if (!M.loadGame(path)) throw new Error("The emulator refused the ROM: " + path);
  if (M.toggleInput) M.toggleInput(true);
  say(""); canvas.focus();
}
async function haveLocal() { try { return (await fetch("vendor/mgba.js", { method: "HEAD" })).ok; } catch { return false; } }

try {
  const base = (await haveLocal()) ? "vendor/" : CDN;
  // a Worker cannot start from a cross-origin script, so run the emulator from a same-origin blob
  const code = await (await fetch(base + "mgba.js")).text();
  const blob = URL.createObjectURL(new Blob([code], { type: "text/javascript" }));
  const mod = await import(blob);
  M = await (mod.default || mod)({ canvas, mainScriptUrlOrBlob: blob, locateFile: p => new URL(p, new URL(base, location.href)).href });
  await M.FSInit();
  const rom = new Uint8Array(await (await fetch(ROM_URL)).arrayBuffer());
  await boot(rom, "Wildwood_v0.6.gba");
} catch (e) {
  console.error(e);
  say("The emulator could not start.\n" + (e && e.message || e) + "\n(cross-origin isolated: " + (self.crossOriginIsolated ? "yes" : "no") + ")\nIf this is the first visit, reload once so the service worker can take over.");
}

const goFull = () => document.fullscreenElement ? document.exitFullscreen() : stage.requestFullscreen().catch(() => say("Full screen was blocked by the browser."));
$("fs").onclick = goFull;
addEventListener("keydown", e => { if ((e.key === "f" || e.key === "F") && !e.ctrlKey && !e.metaKey) goFull(); });
$("pause").onclick = () => { if (!M) return; paused = !paused; paused ? M.pauseGame() : M.resumeGame(); $("pause").textContent = paused ? "Resume" : "Pause"; };
$("mute").onclick = () => { if (!M) return; muted = !muted; M.setVolume(muted ? 0 : 100); $("mute").textContent = muted ? "Unmute" : "Mute"; };
$("pick").onclick = () => $("rom").click();
$("rom").onchange = async e => { const f = e.target.files[0]; if (!f || !M) return; try { M.quitGame(); await boot(new Uint8Array(await f.arrayBuffer()), f.name); } catch (err) { say(String(err.message || err)); } };
canvas.addEventListener("click", () => { canvas.focus(); if (M && M.resumeAudio) M.resumeAudio(); });
