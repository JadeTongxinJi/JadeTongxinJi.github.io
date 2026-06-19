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
    windowObject = typeof window !== "undefined" ? window : globalThis,
    wheelGestureDelay = 120,
  }) => {
    let wheelTimer = 0;
    let wheelDelta = 0;
    let wheelDirection = 0;
    let wheelConsumed = false;
    let pointerState = null;
    let isBound = false;

    const total = () => Math.max(0, Number(getTotal?.() || 0));
    const clampIndex = (index) => Math.max(0, Math.min(index, Math.max(total() - 1, 0)));
    const currentIndex = () => clampIndex(getIndex());
    const viewport = () => track?.closest?.(".gallery-viewport") || track;
    const slideWidth = () => {
      const rect = viewport()?.getBoundingClientRect?.();
      return Math.max(Number(rect?.width || track?.clientWidth || 1), 1);
    };
    const swipeThreshold = () => Math.min(60, slideWidth() * 0.12);
    const clearWheelTimer = () => windowObject.clearTimeout(wheelTimer);
    const canPrevent = (event) => event?.cancelable !== false;
    const preventIfPossible = (event) => {
      if (canPrevent(event)) {
        event.preventDefault();
      }
    };

    const positionTrack = (offset = 0) => {
      if (!track) return;
      const x = (-currentIndex() * slideWidth()) + offset;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    };

    const setInstantPosition = () => {
      if (!track) return;
      track.classList.add("is-dragging");
      positionTrack();
      windowObject.requestAnimationFrame?.(() => {
        track.classList.remove("is-dragging");
      });
    };

    const goToIndex = (index, { animate = true } = {}) => {
      if (!track || total() <= 0) return false;
      const targetIndex = clampIndex(index);
      setIndex(targetIndex);
      if (animate) {
        track.classList.remove("is-dragging");
        positionTrack();
      } else {
        setInstantPosition();
      }
      return true;
    };

    const scrollToIndex = (index, behavior = "smooth") => {
      return goToIndex(index, { animate: behavior !== "auto" });
    };

    const resetWheelGesture = () => {
      wheelDirection = 0;
      wheelDelta = 0;
      wheelConsumed = false;
    };

    const getDragOffset = (state, clientX) => {
      let offset = clientX - state.startX;
      const width = slideWidth();
      offset = Math.max(-width, Math.min(width, offset));
      if (state.startIndex === 0 && offset > 0) return 0;
      if (state.startIndex === total() - 1 && offset < 0) return 0;
      return offset;
    };

    const handlePointerDown = (event) => {
      if (!track || total() <= 1) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      pointerState = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        lastX: event.clientX,
        lastY: event.clientY,
        startIndex: currentIndex(),
        axis: "",
      };
    };

    const handlePointerMove = (event) => {
      if (!pointerState || event.pointerId !== pointerState.pointerId) return;
      pointerState.lastX = event.clientX;
      pointerState.lastY = event.clientY;
      const deltaX = pointerState.lastX - pointerState.startX;
      const deltaY = pointerState.lastY - pointerState.startY;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);
      if (!pointerState.axis && absX > 8 && absX > absY + 6) {
        pointerState.axis = "x";
        track.classList.add("is-dragging");
        try {
          track.setPointerCapture?.(event.pointerId);
        } catch (error) {
          // Pointer capture is best-effort; pointerup still resolves the gesture.
        }
      }
      if (!pointerState.axis && absY > 8 && absY > absX + 6) {
        pointerState.axis = "y";
      }
      if (pointerState.axis === "x") {
        preventIfPossible(event);
        positionTrack(getDragOffset(pointerState, event.clientX));
      }
    };

    const finishPointerGesture = (event) => {
      if (!pointerState || event.pointerId !== pointerState.pointerId) return;
      const state = pointerState;
      pointerState = null;
      track.classList.remove("is-dragging");
      if (state.axis === "x") {
        preventIfPossible(event);
      }
      try {
        track.releasePointerCapture?.(event.pointerId);
      } catch (error) {
        // Pointer capture may not have been set if the gesture stayed below threshold.
      }
      if (state.axis !== "x") {
        positionTrack();
        return;
      }
      const offset = getDragOffset(state, state.lastX);
      const targetIndex = Math.abs(offset) >= swipeThreshold()
        ? state.startIndex + (offset < 0 ? 1 : -1)
        : state.startIndex;
      goToIndex(targetIndex);
    };

    const cancelPointerGesture = (event) => {
      const wasHorizontal = pointerState?.axis === "x";
      if (wasHorizontal) {
        preventIfPossible(event);
      }
      pointerState = null;
      track?.classList.remove("is-dragging");
      positionTrack();
    };

    const handleWheel = (event) => {
      if (!track || total() <= 1 || event.ctrlKey) return;
      const deltaX = Number(event.deltaX || 0);
      const deltaY = Number(event.deltaY || 0);
      const isHorizontalWheel = Math.abs(deltaX) > Math.abs(deltaY);
      if (!isHorizontalWheel) return;

      preventIfPossible(event);
      const direction = deltaX > 0 ? 1 : -1;
      if (wheelDirection && wheelDirection !== direction) {
        wheelDelta = 0;
        wheelConsumed = false;
      }
      wheelDirection = direction;
      wheelDelta += Math.abs(deltaX);

      clearWheelTimer();
      wheelTimer = windowObject.setTimeout(resetWheelGesture, wheelGestureDelay);
      if (wheelConsumed || wheelDelta < swipeThreshold()) return;

      wheelDelta = 0;
      wheelConsumed = true;
      goToIndex(currentIndex() + direction);
    };

    const bind = () => {
      if (!track || isBound) return;
      track.addEventListener("wheel", handleWheel, { passive: false });
      track.addEventListener("pointerdown", handlePointerDown);
      track.addEventListener("pointermove", handlePointerMove, { passive: false });
      track.addEventListener("pointerup", finishPointerGesture);
      track.addEventListener("pointercancel", cancelPointerGesture);
      isBound = true;
      scrollToIndex(currentIndex(), "auto");
    };

    const destroy = () => {
      if (!track || !isBound) return;
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("pointerdown", handlePointerDown);
      track.removeEventListener("pointermove", handlePointerMove);
      track.removeEventListener("pointerup", finishPointerGesture);
      track.removeEventListener("pointercancel", cancelPointerGesture);
      clearWheelTimer();
      pointerState = null;
      track.classList.remove("is-dragging");
      isBound = false;
    };

    return {
      bind,
      destroy,
      scrollToIndex,
      settleToNearestSlide: () => scrollToIndex(currentIndex(), "auto"),
    };
  };

  return {
    createGalleryMotion,
  };
});
