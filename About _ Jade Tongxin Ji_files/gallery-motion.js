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
    getSlideWidth,
    windowObject = typeof window !== "undefined" ? window : globalThis,
    settleDelay = 140,
    gestureLockDuration = 560,
    wheelThreshold = 18,
  }) => {
    let settleTimer = 0;
    let gestureLockTimer = 0;
    let isGestureLocked = false;
    let snapTargetIndex = null;
    let pointerTracking = false;
    let pointerIsHorizontal = false;
    let pointerId = null;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerLastX = 0;
    let pointerLastY = 0;
    let pointerStartIndex = 0;
    let isBound = false;

    const total = () => Math.max(0, Number(getTotal?.() || 0));
    const clampIndex = (index) => Math.max(0, Math.min(index, Math.max(total() - 1, 0)));
    const currentIndex = () => clampIndex(getIndex());
    const slideWidth = () => Math.max(Number(getSlideWidth?.() || track?.clientWidth || 1), 1);
    const swipeThreshold = () => Math.max(40, slideWidth() * 0.15);
    const clearSettleTimer = () => windowObject.clearTimeout(settleTimer);
    const clearGestureLockTimer = () => windowObject.clearTimeout(gestureLockTimer);
    const canPrevent = (event) => event?.cancelable !== false;
    const preventIfPossible = (event) => {
      if (canPrevent(event)) {
        event.preventDefault();
      }
    };

    const unlockGesture = () => {
      if (track && snapTargetIndex !== null) {
        const targetIndex = clampIndex(snapTargetIndex);
        setIndex(targetIndex);
        track.scrollTo({
          left: getSlideLeft(targetIndex),
          behavior: "auto",
        });
      }
      snapTargetIndex = null;
      isGestureLocked = false;
    };

    const lockGesture = (targetIndex) => {
      isGestureLocked = true;
      snapTargetIndex = clampIndex(targetIndex);
      clearGestureLockTimer();
      gestureLockTimer = windowObject.setTimeout(unlockGesture, gestureLockDuration);
    };

    const alignToIndex = (index, behavior = "smooth", shouldLock = behavior === "smooth") => {
      if (!track || total() <= 0) return false;
      const targetIndex = clampIndex(index);
      clearSettleTimer();
      setIndex(targetIndex);
      track.scrollTo({
        left: getSlideLeft(targetIndex),
        behavior,
      });
      if (shouldLock) {
        lockGesture(targetIndex);
      }
      return true;
    };

    const settleToCurrentSlide = (behavior = "smooth") => {
      if (total() <= 1) return;
      clearSettleTimer();
      alignToIndex(currentIndex(), behavior, false);
    };

    const scheduleSettle = () => {
      if (total() <= 1) return;
      clearSettleTimer();
      settleTimer = windowObject.setTimeout(() => {
        settleToCurrentSlide("smooth");
      }, settleDelay);
    };

    const handleScroll = () => {
      if (isGestureLocked) return;
      scheduleSettle();
    };

    const handleScrollEnd = () => {
      clearSettleTimer();
      settleToCurrentSlide("smooth");
    };

    const scrollToIndex = (index, behavior = "smooth") => {
      if (isGestureLocked && behavior !== "auto") return false;
      return alignToIndex(index, behavior, behavior === "smooth");
    };

    const resetPointerGesture = () => {
      pointerTracking = false;
      pointerIsHorizontal = false;
      pointerId = null;
    };

    const handlePointerDown = (event) => {
      if (!track || total() <= 1 || isGestureLocked || event.pointerType === "mouse") return;
      pointerTracking = true;
      pointerIsHorizontal = false;
      pointerId = event.pointerId;
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerLastX = event.clientX;
      pointerLastY = event.clientY;
      pointerStartIndex = currentIndex();
      clearSettleTimer();
    };

    const handlePointerMove = (event) => {
      if (!pointerTracking || event.pointerId !== pointerId) return;
      pointerLastX = event.clientX;
      pointerLastY = event.clientY;
      const deltaX = pointerLastX - pointerStartX;
      const deltaY = pointerLastY - pointerStartY;
      if (!pointerIsHorizontal && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) + 6) {
        pointerIsHorizontal = true;
        try {
          track.setPointerCapture?.(event.pointerId);
        } catch (error) {
          // Pointer capture is best-effort; pointerup still resolves the gesture.
        }
      }
      if (pointerIsHorizontal) {
        preventIfPossible(event);
      }
    };

    const finishPointerGesture = (event) => {
      if (!pointerTracking || event.pointerId !== pointerId) return;
      const deltaX = pointerLastX - pointerStartX;
      const deltaY = pointerLastY - pointerStartY;
      const shouldMove = (
        pointerIsHorizontal &&
        Math.abs(deltaX) >= swipeThreshold() &&
        Math.abs(deltaX) > Math.abs(deltaY)
      );
      const targetIndex = shouldMove
        ? pointerStartIndex + (deltaX < 0 ? 1 : -1)
        : pointerStartIndex;

      if (pointerIsHorizontal) {
        preventIfPossible(event);
      }
      try {
        track.releasePointerCapture?.(event.pointerId);
      } catch (error) {
        // Pointer capture may not have been set if the gesture stayed below threshold.
      }
      resetPointerGesture();
      alignToIndex(targetIndex, "smooth", true);
    };

    const cancelPointerGesture = (event) => {
      const targetIndex = pointerTracking ? pointerStartIndex : currentIndex();
      if (pointerIsHorizontal) {
        preventIfPossible(event);
      }
      resetPointerGesture();
      alignToIndex(targetIndex, "smooth", true);
    };

    const handleWheel = (event) => {
      if (!track || total() <= 1 || event.ctrlKey) return;
      const deltaX = Number(event.deltaX || 0);
      const deltaY = Number(event.deltaY || 0);
      const isHorizontalWheel = Math.abs(deltaX) > Math.abs(deltaY);
      if (!isHorizontalWheel) return;

      preventIfPossible(event);
      if (isGestureLocked || Math.abs(deltaX) < wheelThreshold) return;

      const direction = deltaX > 0 ? 1 : -1;
      alignToIndex(currentIndex() + direction, "smooth", true);
    };

    const bind = () => {
      if (!track || isBound) return;
      track.addEventListener("scroll", handleScroll, { passive: true });
      track.addEventListener("scrollend", handleScrollEnd, { passive: true });
      track.addEventListener("wheel", handleWheel, { passive: false });
      track.addEventListener("pointerdown", handlePointerDown);
      track.addEventListener("pointermove", handlePointerMove, { passive: false });
      track.addEventListener("pointerup", finishPointerGesture);
      track.addEventListener("pointercancel", cancelPointerGesture);
      isBound = true;
    };

    const destroy = () => {
      if (!track || !isBound) return;
      track.removeEventListener("scroll", handleScroll);
      track.removeEventListener("scrollend", handleScrollEnd);
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("pointerdown", handlePointerDown);
      track.removeEventListener("pointermove", handlePointerMove);
      track.removeEventListener("pointerup", finishPointerGesture);
      track.removeEventListener("pointercancel", cancelPointerGesture);
      clearSettleTimer();
      clearGestureLockTimer();
      resetPointerGesture();
      unlockGesture();
      isBound = false;
    };

    return {
      bind,
      destroy,
      scrollToIndex,
      settleToNearestSlide: settleToCurrentSlide,
    };
  };

  return {
    createGalleryMotion,
  };
});
