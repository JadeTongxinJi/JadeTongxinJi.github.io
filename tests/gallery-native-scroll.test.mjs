import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const assetsDir = path.join(root, "About _ Jade Tongxin Ji_files");
const motionPath = path.join(assetsDir, "gallery-motion.js");
const seriesPath = path.join(assetsDir, "series.js");
const exhibitionsPath = path.join(assetsDir, "exhibitions.js");
const stylesPath = path.join(assetsDir, "styles.css");

assert.ok(fs.existsSync(motionPath), "shared native gallery scroll helper should exist");

const timers = [];
const animationFrames = [];
const sandbox = {
  module: { exports: {} },
  setTimeout: (callback) => {
    timers.push(callback);
    return timers.length;
  },
  clearTimeout: () => {},
  requestAnimationFrame: (callback) => {
    animationFrames.push(callback);
    return animationFrames.length;
  },
  cancelAnimationFrame: () => {},
};
sandbox.exports = sandbox.module.exports;
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

vm.runInNewContext(fs.readFileSync(motionPath, "utf8"), sandbox, { filename: motionPath });

const { createGalleryMotion } = sandbox.module.exports;
assert.equal(typeof createGalleryMotion, "function");

const listeners = [];
const removed = [];
const track = {
  scrollLeft: 0,
  scrollToCalls: [],
  addEventListener(type, handler, options) {
    listeners.push({ type, handler, options });
  },
  removeEventListener(type, handler) {
    removed.push({ type, handler });
  },
  scrollTo(options) {
    this.scrollToCalls.push(options);
    this.scrollLeft = options.left;
  },
};

let activeIndex = 0;
const activeHistory = [];
const motion = createGalleryMotion({
  track,
  getTotal: () => 4,
  getIndex: () => activeIndex,
  setIndex: (index) => {
    activeIndex = index;
    activeHistory.push(index);
  },
  getSlideLeft: (index) => index * 320,
  getNearestIndex: () => Math.round(track.scrollLeft / 320),
  windowObject: sandbox,
  settleDelay: 120,
});

motion.bind();
assert.deepEqual(
  listeners.map((item) => item.type).sort(),
  ["scroll", "scrollend"],
  "gallery helper should only observe native scroll and scrollend"
);
assert.equal(
  listeners.some((item) => /touch|pointer|wheel/.test(item.type)),
  false,
  "gallery helper must not intercept touch, pointer, or wheel input"
);

track.scrollLeft = 480;
listeners.find((item) => item.type === "scroll").handler();
assert.equal(track.scrollToCalls.length, 0, "scrolling should not be forced during active user movement");

animationFrames.splice(0).forEach((callback) => callback());
assert.equal(activeIndex, 2, "active image can sync from native scroll without forcing position");
assert.equal(track.scrollToCalls.length, 0, "syncing active image should not trigger layout-forcing scrollTo");

timers.splice(0).forEach((callback) => callback());
assert.equal(track.scrollToCalls.length, 1, "helper may lightly align only after scrolling has ended");
assert.equal(track.scrollToCalls[0].left, 640);
assert.equal(track.scrollToCalls[0].behavior, "smooth");

motion.destroy();
assert.deepEqual(
  removed.map((item) => item.type).sort(),
  ["scroll", "scrollend"],
  "destroy should remove the same passive native scroll listeners"
);

const seriesSource = fs.readFileSync(seriesPath, "utf8");
const exhibitionsSource = fs.readFileSync(exhibitionsPath, "utf8");

for (const [label, source] of [["series", seriesSource], ["exhibitions", exhibitionsSource]]) {
  assert.doesNotMatch(source, /addEventListener\("wheel"/, `${label} gallery should not hijack wheel input`);
  assert.doesNotMatch(source, /addEventListener\("pointer(?:down|move|up|cancel)"/, `${label} gallery should not hijack pointer input`);
  assert.doesNotMatch(source, /touchmove/, `${label} gallery should not hijack touchmove input`);
}

assert.match(seriesSource, /loading = "lazy"/, "series gallery images should lazy-load");
assert.match(seriesSource, /decoding = "async"/, "series gallery images should decode async");
assert.match(exhibitionsSource, /loading = "lazy"/, "exhibition gallery images should lazy-load");
assert.match(exhibitionsSource, /decoding = "async"/, "exhibition gallery images should decode async");

const stylesSource = fs.readFileSync(stylesPath, "utf8");
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*overflow-x:\s*auto;/s);
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*overflow-y:\s*hidden;/s);
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*scroll-snap-type:\s*x proximity;/s);
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*overscroll-behavior-x:\s*contain;/s);
