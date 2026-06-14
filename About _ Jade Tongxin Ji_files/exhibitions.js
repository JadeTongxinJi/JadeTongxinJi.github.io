(() => {
  const exhibitions = window.jadeExhibitions || [];
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (text) {
      element.textContent = text;
    }
    return element;
  };

  const galleryHref = (item, source = "exhibitions") => `exhibition-gallery.html?from=${source}#${item.id}`;
  const exhibitionsByRecent = [...exhibitions].sort((a, b) => Number(b.year) - Number(a.year));
  const menuLabelZh = (item) => ({
    main: `${item.year}-${item.workZh}`,
    sub: item.venueZh,
  });
  const menuLabelEn = (item) => ({
    main: `${item.year}-${item.workEn}`,
    sub: item.venueEn,
  });
  const makeMenuTitle = (className, label) => {
    const title = make(className === "menu-title-en" ? "small" : "span", className);
    title.append(
      make("span", "menu-line menu-line-main", label.main),
      make("span", "menu-line menu-line-sub", label.sub)
    );
    return title;
  };

  document.querySelectorAll("[data-render-exhibition-menu]").forEach((menu) => {
    menu.replaceChildren(
      ...exhibitionsByRecent.map((item) => {
        const link = make("a", "menu-link exhibition-menu-link");
        link.href = galleryHref(item);
        link.append(
          makeMenuTitle("menu-title-zh", menuLabelZh(item)),
          makeMenuTitle("menu-title-en", menuLabelEn(item))
        );
        return link;
      })
    );
  });

  const directory = document.querySelector("[data-render-exhibition-directory]");
  if (directory) {
    directory.replaceChildren(
      ...exhibitionsByRecent.map((item, index) => {
        const listItem = make("li", "");
        const row = make("a", "exhibition-card");
        row.href = galleryHref(item);
        row.style.setProperty("--cover", `url("${item.cover}")`);

        const number = make("span", "exhibition-index", String(index + 1).padStart(2, "0"));
        const text = make("div", "exhibition-name");
        text.append(make("span", "exhibition-year", item.year));
        text.append(make("h2", "", item.titleZh));
        text.append(make("p", "", item.titleEn));
        row.append(number, text);
        listItem.append(row);
        return listItem;
      })
    );
  }

  const detailRoot = document.querySelector("[data-render-gallery]");
  if (!detailRoot) {
    return;
  }

  const titleZh = document.querySelector("[data-gallery-title-zh]");
  const titleEn = document.querySelector("[data-gallery-title-en]");
  const meta = document.querySelector("[data-gallery-meta]");
  const facts = document.querySelector("[data-gallery-facts]");
  const sourcesTitle = document.querySelector("[data-gallery-sources-title]");
  const sources = document.querySelector("[data-gallery-sources]");
  const returnSourceLink = document.querySelector("[data-exhibition-return-source]");
  const track = document.querySelector("[data-gallery-track]");
  const toolbar = document.querySelector(".gallery-toolbar");
  const count = document.querySelector("[data-gallery-count]");
  let current = null;
  let activeIndex = 0;
  let alignTimer = 0;
  let snapTimer = 0;
  let wheelDelta = 0;
  let wheelDirection = 0;
  let wheelGestureTimer = 0;
  let wheelGestureMoved = false;
  let wheelLastTime = 0;
  let wheelLastMagnitude = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchLastX = 0;
  let touchLastY = 0;
  let touchStartIndex = 0;
  let touchTracking = false;
  let touchIsHorizontal = false;

  const getCurrent = () => {
    const currentId = decodeURIComponent(window.location.hash.replace("#", "")) || exhibitions[0]?.id;
    return exhibitions.find((item) => item.id === currentId) || exhibitions[0];
  };

  const setReturnSourceLink = () => {
    if (!returnSourceLink) return;
    const from = new URLSearchParams(window.location.search).get("from");
    const returnMap = {
      about: {
        text: "← 返回 About / BACK TO ABOUT",
        href: "About _ Jade Tongxin Ji.html",
      },
      work: {
        text: "← 返回作品 / BACK TO WORK",
        href: "series-gallery.html",
      },
      exhibitions: {
        text: "← 返回展览列表 / BACK TO EXHIBITIONS",
        href: "exhibitions.html",
      },
    };
    const config = returnMap[from] || returnMap.exhibitions;
    returnSourceLink.textContent = config.text;
    returnSourceLink.href = config.href;
  };

  const lockImageTouch = (target) => {
    if (!target) return;
    target.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  };

  const clampIndex = (index) => {
    if (!current) return 0;
    return Math.max(0, Math.min(index, current.images.length - 1));
  };

  const getSlideWidth = () => Math.max(track?.clientWidth || 1, 1);

  const getSlideLeft = (index) => {
    if (!track) return index * getSlideWidth();
    const slide = track.querySelectorAll(".gallery-slide")[clampIndex(index)];
    if (!slide) return index * getSlideWidth();
    return track.scrollLeft + slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
  };

  const getNearestIndex = () => {
    if (!track || !current) return 0;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    track.querySelectorAll(".gallery-slide").forEach((slide, index) => {
      const slideLeft = track.scrollLeft + slide.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const distance = Math.abs(track.scrollLeft - slideLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    return clampIndex(nearestIndex);
  };

  const updateCount = () => {
    if (!count || !current) return;
    count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(current.images.length).padStart(2, "0")}`;
  };

  const setActiveSlide = () => {
    if (!track) return;
    track.querySelectorAll(".gallery-slide").forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });
  };

  const syncFromScroll = () => {
    if (!track || !current) return;
    const nextIndex = getNearestIndex();
    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
      setActiveSlide();
    }
    updateCount();
  };

  const scrollToIndex = (index, behavior = "smooth") => {
    if (!track || !current) return;
    window.clearTimeout(alignTimer);
    activeIndex = clampIndex(index);
    setActiveSlide();
    updateCount();
    track.scrollTo({
      left: getSlideLeft(activeIndex),
      behavior,
    });
    if (behavior === "smooth") {
      alignTimer = window.setTimeout(() => {
        track.scrollTo({
          left: getSlideLeft(activeIndex),
          behavior: "auto",
        });
      }, 360);
    }
  };

  const settleToNearestSlide = () => {
    window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(() => {
      scrollToIndex(getNearestIndex(), "smooth");
    }, 140);
  };

  const handleTrackWheel = (event) => {
    if (!track || !current || current.images.length <= 1 || event.ctrlKey) return;
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 1) return;

    event.preventDefault();
    window.clearTimeout(snapTimer);
    const direction = event.deltaX > 0 ? 1 : -1;
    const magnitude = Math.abs(event.deltaX);
    const now = event.timeStamp || Date.now();
    const elapsed = wheelLastTime ? now - wheelLastTime : Infinity;
    const startsNewWheelGesture = wheelGestureMoved && (
      (direction !== wheelDirection && magnitude >= 12) ||
      (elapsed > 110 && magnitude >= 32) ||
      (elapsed > 60 && magnitude >= Math.max(16, wheelLastMagnitude * 1.8))
    );
    if (startsNewWheelGesture) {
      wheelGestureMoved = false;
      wheelDelta = 0;
    }
    if (!wheelGestureMoved && wheelDirection && wheelDirection !== direction) {
      wheelDelta = 0;
    }
    wheelDirection = direction;
    wheelLastTime = now;
    wheelLastMagnitude = magnitude;

    window.clearTimeout(wheelGestureTimer);
    const resetWheelGesture = () => {
      wheelGestureMoved = false;
      wheelDirection = 0;
      wheelDelta = 0;
      wheelLastTime = 0;
      wheelLastMagnitude = 0;
    };
    const scheduleWheelReset = () => {
      wheelGestureTimer = window.setTimeout(resetWheelGesture, 220);
    };

    if (wheelGestureMoved) {
      scheduleWheelReset();
      return;
    }

    wheelDelta += magnitude;
    if (wheelDelta < 30) {
      scheduleWheelReset();
      return;
    }

    wheelDelta = 0;
    wheelGestureMoved = true;
    scrollToIndex(activeIndex + direction);
    scheduleWheelReset();
  };

  const resetTouchGesture = () => {
    touchTracking = false;
    touchIsHorizontal = false;
  };

  const handlePointerDown = (event) => {
    if (!track || !current || current.images.length <= 1 || event.pointerType === "mouse") return;
    touchStartX = event.clientX;
    touchStartY = event.clientY;
    touchLastX = event.clientX;
    touchLastY = event.clientY;
    touchStartIndex = activeIndex;
    touchTracking = true;
    touchIsHorizontal = false;
    window.clearTimeout(snapTimer);
  };

  const handlePointerMove = (event) => {
    if (!touchTracking || !track) return;
    touchLastX = event.clientX;
    touchLastY = event.clientY;
    const deltaX = touchLastX - touchStartX;
    const deltaY = touchLastY - touchStartY;
    if (!touchIsHorizontal && Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY) + 6) {
      touchIsHorizontal = true;
      try {
        track.setPointerCapture(event.pointerId);
      } catch (error) {
        // Pointer capture is best-effort; the swipe still resolves on pointerup.
      }
    }
    if (touchIsHorizontal) {
      event.preventDefault();
    }
  };

  const handlePointerEnd = () => {
    if (!touchTracking || !current) return;
    const deltaX = touchLastX - touchStartX;
    const deltaY = touchLastY - touchStartY;
    const shouldMove = touchIsHorizontal && Math.abs(deltaX) > 34 && Math.abs(deltaX) > Math.abs(deltaY);
    const nextIndex = shouldMove ? touchStartIndex + (deltaX < 0 ? 1 : -1) : activeIndex;
    resetTouchGesture();
    scrollToIndex(nextIndex);
  };

  const renderGallery = () => {
    current = getCurrent();
    if (!current) return;
    const hasMultipleImages = current.images.length > 1;

    document.title = `${current.titleEn} / Jade Tongxin Ji`;
    if (titleZh) titleZh.textContent = current.titleZh;
    if (titleEn) titleEn.textContent = current.titleEn;
    if (meta) meta.textContent = `${current.year} / ${current.venueZh}`;
    if (toolbar) {
      toolbar.hidden = !hasMultipleImages;
      toolbar.style.display = hasMultipleImages ? "" : "none";
    }

    if (facts) {
      facts.replaceChildren();
      [
        ["艺术家 / Artist", current.artist],
        ["作品 / Work", `${current.workZh} / ${current.workEn}`],
        ["地点 / Venue", `${current.venueZh} / ${current.venueEn}`],
        ["年份 / Year", current.year]
      ].forEach(([label, value]) => {
        const row = make("div", "gallery-fact");
        row.append(make("span", "", label), make("strong", "", value));
        facts.append(row);
      });
    }

    if (sources) {
      sources.replaceChildren();
      if (sourcesTitle) {
        sourcesTitle.hidden = !current.sources.length;
      }
      sources.classList.toggle(
        "is-button-row",
        current.sources.length > 1
      );
      if (current.sources.length) {
        current.sources.forEach((source) => {
          const link = make("a", "");
          link.href = source.href;
          link.target = "_blank";
          link.rel = "noreferrer";
          link.append(make("span", "source-title-zh", source.label));
          if (source.labelEn && source.labelEn !== source.label) {
            link.append(make("small", "source-title-en", source.labelEn));
          }
          sources.append(link);
        });
      }
    }

    if (track) {
      track.replaceChildren(
        ...current.images.map((imageItem, index) => {
          const src = typeof imageItem === "string" ? imageItem : imageItem.src;
          const captionZh = typeof imageItem === "string" ? "展览现场" : imageItem.captionZh || "展览现场";
          const captionEn = typeof imageItem === "string" ? "Exhibition Site" : imageItem.captionEn || "Exhibition Site";
          const figure = make("figure", "gallery-slide");
          if (index === 0) {
            figure.classList.add("is-active");
          }
          const imageWrap = make("div", "gallery-image-wrap");
          const image = document.createElement("img");
          image.src = src;
          image.alt = `${current.titleZh} ${index + 1}`;
          image.draggable = false;
          lockImageTouch(imageWrap);
          imageWrap.append(image);

          const caption = make("figcaption", "");
          caption.append(
            make("strong", "", captionZh),
            make("em", "", captionEn),
            make("span", "", current.year)
          );
          if (hasMultipleImages) {
            caption.append(make("small", "", `${String(index + 1).padStart(2, "0")} / ${String(current.images.length).padStart(2, "0")}`));
          }
          figure.append(imageWrap, caption);
          return figure;
        })
      );
      activeIndex = 0;
      setActiveSlide();
      updateCount();
      track.scrollLeft = 0;
      window.requestAnimationFrame(() => scrollToIndex(0, "auto"));
    }
  };

  const goTo = (index) => {
    scrollToIndex(index);
  };

  document.querySelector("[data-gallery-prev]")?.addEventListener("click", () => {
    goTo(activeIndex - 1);
  });

  document.querySelector("[data-gallery-next]")?.addEventListener("click", () => {
    goTo(activeIndex + 1);
  });

  track?.addEventListener("scroll", () => {
    syncFromScroll();
    if (!wheelGestureMoved && !touchTracking) {
      settleToNearestSlide();
    }
  }, { passive: true });
  track?.addEventListener("wheel", handleTrackWheel, { passive: false });
  track?.addEventListener("pointerdown", handlePointerDown);
  track?.addEventListener("pointermove", handlePointerMove, { passive: false });
  track?.addEventListener("pointerup", handlePointerEnd);
  track?.addEventListener("pointercancel", () => {
    resetTouchGesture();
    scrollToIndex(activeIndex);
  });

  window.addEventListener("resize", () => {
    scrollToIndex(activeIndex, "auto");
  });

  window.addEventListener("hashchange", renderGallery);
  setReturnSourceLink();
  renderGallery();
})();
