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

const listeners = new Map();
const removed = [];
const track = {
  clientWidth: 320,
  scrollLeft: 0,
  scrollToCalls: [],
  addEventListener(type, handler, options) {
    listeners.set(type, { handler, options });
  },
  removeEventListener(type, handler) {
    removed.push({ type, handler });
  },
  setPointerCapture() {},
  releasePointerCapture() {},
  scrollTo(options) {
    this.scrollToCalls.push(options);
    this.scrollLeft = options.left;
  },
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
  getSlideLeft: (index) => index * 320,
  getNearestIndex: () => Math.round(track.scrollLeft / 320),
  getSlideWidth: () => 320,
  windowObject: sandbox,
  gestureLockDuration: 560,
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

motion.bind();

assert.deepEqual(
  [...listeners.keys()].sort(),
  ["pointercancel", "pointerdown", "pointermove", "pointerup", "scroll", "scrollend", "wheel"],
  "gallery helper should own only gallery-local gesture listeners"
);
assert.equal(listeners.get("scroll").options.passive, true);
assert.equal(listeners.get("wheel").options.passive, false);
assert.equal(listeners.get("pointermove").options.passive, false);

listeners.get("pointerdown").handler(makeEvent({ pointerId: 1, pointerType: "touch", clientX: 300, clientY: 80 }));
const bigSwipeMove = makeEvent({ pointerId: 1, pointerType: "touch", clientX: -180, clientY: 84 });
listeners.get("pointermove").handler(bigSwipeMove);
listeners.get("pointerup").handler(makeEvent({ pointerId: 1, pointerType: "touch", clientX: -180, clientY: 84 }));
assert.equal(bigSwipeMove.defaultPrevented, true, "horizontal touch movement should prevent native momentum");
assert.equal(activeIndex, 1, "one large left swipe should advance by exactly one image");
assert.equal(track.scrollToCalls.at(-1).left, 320);

listeners.get("pointerdown").handler(makeEvent({ pointerId: 2, pointerType: "touch", clientX: 300, clientY: 80 }));
listeners.get("pointermove").handler(makeEvent({ pointerId: 2, pointerType: "touch", clientX: -180, clientY: 84 }));
listeners.get("pointerup").handler(makeEvent({ pointerId: 2, pointerType: "touch", clientX: -180, clientY: 84 }));
assert.equal(activeIndex, 1, "gesture lock should ignore repeated touch gestures during snap animation");

track.scrollLeft = 1280;
listeners.get("scroll").handler(makeEvent());
listeners.get("scrollend").handler(makeEvent());
assert.equal(activeIndex, 1, "native momentum must not update active index across multiple images");
assert.equal(track.scrollToCalls.at(-1).left, 320, "escaped native momentum should be pulled back to the locked active image");

runTimers();
listeners.get("pointerdown").handler(makeEvent({ pointerId: 3, pointerType: "touch", clientX: 100, clientY: 80 }));
listeners.get("pointermove").handler(makeEvent({ pointerId: 3, pointerType: "touch", clientX: 132, clientY: 82 }));
listeners.get("pointerup").handler(makeEvent({ pointerId: 3, pointerType: "touch", clientX: 132, clientY: 82 }));
assert.equal(activeIndex, 1, "short swipe below threshold should stay on current image");
assert.equal(track.scrollToCalls.at(-1).left, 320);

runTimers();
listeners.get("pointerdown").handler(makeEvent({ pointerId: 4, pointerType: "touch", clientX: 100, clientY: 80 }));
listeners.get("pointermove").handler(makeEvent({ pointerId: 4, pointerType: "touch", clientX: 260, clientY: 80 }));
listeners.get("pointerup").handler(makeEvent({ pointerId: 4, pointerType: "touch", clientX: 260, clientY: 80 }));
assert.equal(activeIndex, 0, "one right swipe should go back by exactly one image");
assert.equal(track.scrollToCalls.at(-1).left, 0);

runTimers();
const verticalWheel = makeEvent({ deltaX: 8, deltaY: 140 });
listeners.get("wheel").handler(verticalWheel);
assert.equal(verticalWheel.defaultPrevented, false, "vertical page scrolling should not be hijacked");
assert.equal(activeIndex, 0);

const firstWheel = makeEvent({ deltaX: 600, deltaY: 30 });
listeners.get("wheel").handler(firstWheel);
assert.equal(firstWheel.defaultPrevented, true, "horizontal wheel gesture should be handled inside the gallery");
assert.equal(activeIndex, 1, "one horizontal wheel gesture should advance one image");
listeners.get("wheel").handler(makeEvent({ deltaX: 600, deltaY: 10 }));
listeners.get("wheel").handler(makeEvent({ deltaX: 600, deltaY: 10 }));
assert.equal(activeIndex, 1, "wheel inertia during lock should not advance additional images");

runTimers();
listeners.get("wheel").handler(makeEvent({ deltaX: 600, deltaY: 10 }));
assert.equal(activeIndex, 2, "a later separate wheel gesture can advance one more image");

motion.destroy();
assert.deepEqual(
  removed.map((item) => item.type).sort(),
  ["pointercancel", "pointerdown", "pointermove", "pointerup", "scroll", "scrollend", "wheel"],
  "destroy should remove all gallery-local listeners"
);

const seriesSource = fs.readFileSync(seriesPath, "utf8");
const exhibitionsSource = fs.readFileSync(exhibitionsPath, "utf8");

for (const [label, source] of [["series", seriesSource], ["exhibitions", exhibitionsSource]]) {
  assert.doesNotMatch(source, /addEventListener\("wheel"/, `${label} should delegate wheel handling to gallery-motion`);
  assert.doesNotMatch(source, /addEventListener\("pointer(?:down|move|up|cancel)"/, `${label} should delegate pointer handling to gallery-motion`);
  assert.doesNotMatch(source, /touchmove/, `${label} should not add separate touchmove handling`);
}

assert.match(seriesSource, /loading = "lazy"/, "series gallery images should lazy-load");
assert.match(seriesSource, /decoding = "async"/, "series gallery images should decode async");
assert.match(exhibitionsSource, /loading = "lazy"/, "exhibition gallery images should lazy-load");
assert.match(exhibitionsSource, /decoding = "async"/, "exhibition gallery images should decode async");

const stylesSource = fs.readFileSync(stylesPath, "utf8");
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*overflow-x:\s*auto;/s);
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*overflow-y:\s*hidden;/s);
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*overscroll-behavior-x:\s*contain;/s);
assert.match(stylesSource, /\.gallery-track\s*\{[^}]*touch-action:\s*pan-y;/s);
