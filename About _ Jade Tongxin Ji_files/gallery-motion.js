((root, factory) => {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }

  root.jadeGalleryMotion = factory();
})(typeof globalThis !== "undefined" ? globalThis : window, () => {
  const createGalleryMotion = ({
    track,
    getTotal,
    getIndex,
    setIndex,
    getSlideLeft,
    getNearestIndex,
    windowObject = typeof window !== "undefined" ? window : globalThis,
    settleDelay = 140,
  }) => {
    let scrollFrame = 0;
    let settleTimer = 0;
    let isBound = false;

    const total = () => Math.max(0, Number(getTotal?.() || 0));
    const clampIndex = (index) => Math.max(0, Math.min(index, Math.max(total() - 1, 0)));
    const nearestIndex = () => clampIndex(getNearestIndex());
    const clearSettleTimer = () => windowObject.clearTimeout(settleTimer);

    const syncFromNativeScroll = () => {
      scrollFrame = 0;
      setIndex(nearestIndex());
    };

    const scheduleScrollSync = () => {
      if (scrollFrame) return;
      scrollFrame = windowObject.requestAnimationFrame(syncFromNativeScroll);
    };

    const settleToNearestSlide = (behavior = "smooth") => {
      if (!track || total() <= 1) return;
      const targetIndex = nearestIndex();
      setIndex(targetIndex);
      track.scrollTo({
        left: getSlideLeft(targetIndex),
        behavior,
      });
    };

    const scheduleSettle = () => {
      if (total() <= 1) return;
      clearSettleTimer();
      settleTimer = windowObject.setTimeout(() => {
        settleToNearestSlide("smooth");
      }, settleDelay);
    };

    const handleScroll = () => {
      scheduleScrollSync();
      scheduleSettle();
    };

    const handleScrollEnd = () => {
      clearSettleTimer();
      settleToNearestSlide("smooth");
    };

    const scrollToIndex = (index, behavior = "smooth") => {
      if (!track || total() <= 0) return;
      clearSettleTimer();
      const targetIndex = clampIndex(index);
      setIndex(targetIndex);
      track.scrollTo({
        left: getSlideLeft(targetIndex),
        behavior,
      });
    };

    const bind = () => {
      if (!track || isBound) return;
      track.addEventListener("scroll", handleScroll, { passive: true });
      track.addEventListener("scrollend", handleScrollEnd, { passive: true });
      isBound = true;
    };

    const destroy = () => {
      if (!track || !isBound) return;
      track.removeEventListener("scroll", handleScroll);
      track.removeEventListener("scrollend", handleScrollEnd);
      if (scrollFrame) {
        windowObject.cancelAnimationFrame?.(scrollFrame);
      }
      clearSettleTimer();
      scrollFrame = 0;
      isBound = false;
    };

    return {
      bind,
      destroy,
      scrollToIndex,
      settleToNearestSlide,
    };
  };

  return {
    createGalleryMotion,
  };
});
