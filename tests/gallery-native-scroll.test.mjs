import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const assetsDir = path.join(root, "About _ Jade Tongxin Ji_files");
const motionPath = path.join(assetsDir, "gallery-motion.js");
const seriesPath = path.join(assetsDir, "series.js");
const exhibitionsPath = path.join(assetsDir, "exhibitions.js");
const stylesPath = path.join(assetsDir, "styles.css");
const exhibitionGalleryPath = path.join(root, "exhibition-gallery.html");

const timers = [];
const animationFrames = [];
const sandbox = {
  module: { exports: {} },
  setTimeout: (callback, delay = 0) => {
    timers.push({ callback, delay });
    return timers.length;
  },
  clearTimeout: () => {},
  requestAnimationFrame: (callback) => {
    animationFrames.push(callback);
    return animationFrames.length;
  },
  cancelAnimationFrame: () => {},
  Math,
};
sandbox.exports = sandbox.module.exports;
sandbox.window = sandbox;
sandbox.globalThis = sandbox;

assert.ok(fs.existsSync(motionPath), "shared gallery motion helper should exist");
vm.runInNewContext(fs.readFileSync(motionPath, "utf8"), sandbox, { filename: motionPath });

const { createGalleryMotion } = sandbox.module.exports;
assert.equal(typeof createGalleryMotion, "function");

const createClassList = () => {
  const values = new Set();
  return {
    add: (...names) => names.forEach((name) => values.add(name)),
    remove: (...names) => names.forEach((name) => values.delete(name)),
    contains: (name) => values.has(name),
  };
};

const listeners = new Map();
const removed = [];
const viewport = {
  getBoundingClientRect: () => ({ width: 320, left: 0 }),
};
const track = {
  clientWidth: 320,
  style: {},
  classList: createClassList(),
  closest(selector) {
    return selector === ".gallery-viewport" ? viewport : null;
  },
  getBoundingClientRect: () => ({ width: 320, left: 0 }),
  addEventListener(type, handler, options) {
    listeners.set(type, { handler, options });
  },
  removeEventListener(type, handler) {
    removed.push({ type, handler });
  },
  setPointerCapture() {},
  releasePointerCapture() {},
};

let activeIndex = 0;
const activeHistory = [];
const motion = createGalleryMotion({
  track,
  getTotal: () => 5,
  getIndex: () => activeIndex,
  setIndex: (index) => {
    activeIndex = index;
    activeHistory.push(index);
  },
  windowObject: sandbox,
  wheelGestureDelay: 120,
});

const makeEvent = (overrides = {}) => {
  const event = {
    cancelable: true,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true;
    },
    ...overrides,
  };
  return event;
};

const runTimers = () => {
  timers.splice(0).forEach(({ callback }) => callback());
};

const runAnimationFrames = () => {
  animationFrames.splice(0).forEach((callback) => callback());
};

const swipe = ({ from = 300, to, y = 80, pointerId = 1, pointerType = "touch" }) => {
  listeners.get("pointerdown").handler(makeEvent({ pointerId, pointerType, button: 0, clientX: from, clientY: y }));
  const move = makeEvent({ pointerId, pointerType, button: 0, clientX: to, clientY: y + 4 });
  listeners.get("pointermove").handler(move);
  const up = makeEvent({ pointerId, pointerType, button: 0, clientX: to, clientY: y + 4 });
  listeners.get("pointerup").handler(up);
  return { move, up };
};

motion.bind();
runAnimationFrames();

assert.deepEqual(
  [...listeners.keys()].sort(),
  ["pointercancel", "pointerdown", "pointermove", "pointerup", "wheel"],
  "gallery helper should own only transform gesture listeners"
);
assert.equal(listeners.get("wheel").options.passive, false);
assert.equal(listeners.get("pointermove").options.passive, false);
assert.equal(track.style.transform, "translate3d(0px, 0, 0)");

const bigSwipe = swipe({ pointerId: 1, to: -180 });
assert.equal(bigSwipe.move.defaultPrevented, true, "horizontal touch movement should prevent native horizontal momentum");
assert.equal(bigSwipe.up.defaultPrevented, true, "horizontal touch release should stay inside the gallery");
assert.equal(activeIndex, 1, "one large left swipe should advance by exactly one image");
assert.equal(track.style.transform, "translate3d(-320px, 0, 0)");

swipe({ pointerId: 2, to: -180 });
assert.equal(activeIndex, 2, "a second gesture immediately after transition should be accepted");

swipe({ pointerId: 3, to: -900 });
assert.equal(activeIndex, 3, "one very large swipe should still advance by only one image");

swipe({ pointerId: 4, from: 100, to: 125 });
assert.equal(activeIndex, 3, "short swipe below threshold should stay on current image");

swipe({ pointerId: 5, from: 100, to: 260 });
assert.equal(activeIndex, 2, "one right swipe should go back by exactly one image");

motion.scrollToIndex(0, "auto");
runAnimationFrames();
swipe({ pointerId: 6, from: 100, to: 280 });
assert.equal(activeIndex, 0, "first image should clamp at the left edge");
assert.equal(track.style.transform, "translate3d(0px, 0, 0)");

motion.scrollToIndex(4, "auto");
runAnimationFrames();
swipe({ pointerId: 7, from: 300, to: -180 });
assert.equal(activeIndex, 4, "last image should clamp at the right edge");
assert.equal(track.style.transform, "translate3d(-1280px, 0, 0)");

const verticalMove = makeEvent({ pointerId: 8, pointerType: "touch", button: 0, clientX: 120, clientY: 210 });
listeners.get("pointerdown").handler(makeEvent({ pointerId: 8, pointerType: "touch", button: 0, clientX: 100, clientY: 80 }));
listeners.get("pointermove").handler(verticalMove);
listeners.get("pointerup").handler(makeEvent({ pointerId: 8, pointerType: "touch", button: 0, clientX: 120, clientY: 210 }));
assert.equal(verticalMove.defaultPrevented, false, "vertical page scrolling should not be hijacked");
assert.equal(activeIndex, 4);

motion.scrollToIndex(0, "auto");
runAnimationFrames();
const verticalWheel = makeEvent({ deltaX: 8, deltaY: 140 });
listeners.get("wheel").handler(verticalWheel);
assert.equal(verticalWheel.defaultPrevented, false, "vertical wheel scrolling should not be hijacked");
assert.equal(activeIndex, 0);

const firstWheel = makeEvent({ deltaX: 600, deltaY: 30 });
listeners.get("wheel").handler(firstWheel);
assert.equal(firstWheel.defaultPrevented, true, "horizontal wheel gesture should be handled inside the gallery");
assert.equal(activeIndex, 1, "one horizontal wheel gesture should advance one image");
listeners.get("wheel").handler(makeEvent({ deltaX: 600, deltaY: 10 }));
listeners.get("wheel").handler(makeEvent({ deltaX: 600, deltaY: 10 }));
assert.equal(activeIndex, 1, "wheel inertia during one gesture should not advance additional images");
assert.ok(timers.every(({ delay }) => delay <= 120), "wheel gesture lock should stay short");

runTimers();
listeners.get("wheel").handler(makeEvent({ deltaX: 600, deltaY: 10 }));
assert.equal(activeIndex, 2, "a later separate wheel gesture can advance one more image");

motion.destroy();
assert.deepEqual(
  removed.map((item) => item.type).sort(),
  ["pointercancel", "pointerdown", "pointermove", "pointerup", "wheel"],
  "destroy should remove all gallery-local listeners"
);

const motionSource = fs.readFileSync(motionPath, "utf8");
assert.doesNotMatch(motionSource, /\.scrollTo\s*\(/, "gallery motion should not drive native scrollTo");
assert.doesNotMatch(motionSource, /\.scrollLeft\b/, "gallery motion should not drive scrollLeft");
assert.doesNotMatch(motionSource, /scrollend/, "gallery motion should not wait for native scrollend");
assert.doesNotMatch(motionSource, /gestureLockDuration/, "gallery motion should not keep a long animation lock");

const seriesSource = fs.readFileSync(seriesPath, "utf8");
const exhibitionsSource = fs.readFileSync(exhibitionsPath, "utf8");

for (const [label, source] of [["series", seriesSource], ["exhibitions", exhibitionsSource]]) {
  assert.doesNotMatch(source, /addEventListener\("wheel"/, `${label} should delegate wheel handling to gallery-motion`);
  assert.doesNotMatch(source, /addEventListener\("pointer(?:down|move|up|cancel)"/, `${label} should delegate pointer handling to gallery-motion`);
  assert.doesNotMatch(source, /touchmove/, `${label} should not add separate touchmove handling`);
  assert.doesNotMatch(source, /\.scrollLeft\b/, `${label} should not use native horizontal scroll state`);
}

assert.match(seriesSource, /gallery-viewport/, "series galleries should render a transform viewport");
assert.match(seriesSource, /loading = "lazy"/, "series gallery images should lazy-load");
assert.match(seriesSource, /decoding = "async"/, "series gallery images should decode async");
assert.match(exhibitionsSource, /loading = "lazy"/, "exhibition gallery images should lazy-load");
assert.match(exhibitionsSource, /decoding = "async"/, "exhibition gallery images should decode async");
assert.match(fs.readFileSync(exhibitionGalleryPath, "utf8"), /class="gallery-viewport"[^>]*data-gallery-viewport/, "exhibition gallery should wrap the track in a transform viewport");

const stylesSource = fs.readFileSync(stylesPath, "utf8");
assert.match(stylesSource, /\.gallery-viewport\s*\{[^}]*overflow:\s*hidden;/s);
assert.match(stylesSource, /\.gallery-viewport\s*\{[^}]*touch-action:\s*pan-y;/s);
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*transition:\s*transform\s+260ms/s);
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*will-change:\s*transform;/s);
assert.match(stylesSource, /\.gallery-track\.is-dragging\s*\{[^}]*transition:\s*none;/s);
assert.doesNotMatch(stylesSource, /scroll-snap/, "gallery CSS should not use scroll snap with transform control");
assert.doesNotMatch(stylesSource, /\.gallery-track\s*\{[^}]*overflow-x:\s*auto;/s);
assert.doesNotMatch(stylesSource, /\.gallery-track\s*\{[^}]*-webkit-overflow-scrolling:\s*touch;/s);
