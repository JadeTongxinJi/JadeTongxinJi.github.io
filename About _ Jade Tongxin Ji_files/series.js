(() => {
  const series = window.jadeSeries || [];
  const exhibitions = window.jadeExhibitions || [];
  const presentationHistory = window.jadePresentationHistory || [];
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

  const galleryHref = (item) => `series-gallery.html#${item.id}`;
  const exhibitionHref = (item) => `exhibition-gallery.html#${item.id}`;
  const presentationHref = (item) => {
    if (item.detailId) return `exhibition-gallery.html#${item.detailId}`;
    if (item.href) return item.href;
    return "";
  };
  const cleanNavTriggerLabel = (text) => (
    text.trim()
      .replace(/\s+[↑↓]$/, "")
      .replace(/\s*\/\s*$/, "")
  );
  const seriesByRecent = [...series].sort((a, b) => Number(b.year) - Number(a.year));
  const menuLabelZh = (item) => `${item.year}-${item.titleZh}`;
  const menuLabelEn = (item) => `${item.year}-${item.titleEn}`;

  document.querySelectorAll("[data-render-series-menu]").forEach((menu) => {
    menu.replaceChildren(
      ...seriesByRecent.map((item) => {
        const link = make("a", "menu-link series-menu-link");
        link.href = galleryHref(item);
        link.append(
          make("span", "menu-title-zh", menuLabelZh(item)),
          make("small", "menu-title-en", menuLabelEn(item))
        );
        return link;
      })
    );
  });

  const closeSeriesMenus = (exceptMenu) => {
    document.querySelectorAll(".home-nav-menu.is-open, .page-nav-menu.is-open").forEach((navMenu) => {
      if (navMenu === exceptMenu) return;
      navMenu.classList.remove("is-open");
      const trigger = navMenu.querySelector(".home-nav-trigger, .page-nav-trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
        if (trigger.dataset.baseLabel) trigger.textContent = `${trigger.dataset.baseLabel} ↓`;
      }
    });
  };

  document.querySelectorAll("[data-render-series-menu]").forEach((menu) => {
    const navMenu = menu.closest(".home-nav-menu, .page-nav-menu");
    const trigger = navMenu?.querySelector(".home-nav-trigger, .page-nav-trigger");
    if (!navMenu || !trigger) return;

    trigger.dataset.baseLabel = cleanNavTriggerLabel(trigger.textContent);
    trigger.textContent = `${trigger.dataset.baseLabel} ↓`;
    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      const isOpen = navMenu.classList.toggle("is-open");
      closeSeriesMenus(isOpen ? navMenu : null);
      trigger.setAttribute("aria-expanded", String(isOpen));
      trigger.textContent = `${trigger.dataset.baseLabel} ${isOpen ? "↑" : "↓"}`;
    });

    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      navMenu.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      trigger.textContent = `${trigger.dataset.baseLabel} ↓`;
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest(".home-nav-menu, .page-nav-menu")) return;
    closeSeriesMenus(null);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeSeriesMenus(null);
  });

  const directory = document.querySelector("[data-render-series-directory]");
  if (directory) {
    const years = [...new Set(series.map((item) => item.year))].sort((a, b) => Number(b) - Number(a));
    directory.replaceChildren(
      ...years.map((year) => {
        const section = make("section", "series-year-block");
        const heading = make("h2", "series-year-title", year);
        const list = make("ol", "exhibition-list series-list");
        const items = series.filter((item) => item.year === year);
        list.replaceChildren(
          ...items.map((item, index) => {
            const listItem = make("li", "");
            const row = make("a", "exhibition-card series-card");
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
        section.append(heading, list);
        return section;
      })
    );
  }

  const detailRoot = document.querySelector("[data-render-series-gallery]");
  if (!detailRoot) {
    return;
  }

  const titleZh = document.querySelector("[data-series-title-zh]");
  const titleEn = document.querySelector("[data-series-title-en]");
  const meta = document.querySelector("[data-series-meta]");
  const medium = document.querySelector("[data-series-medium]");
  const statement = document.querySelector("[data-series-statement]");
  const statementBody = document.querySelector("[data-series-statement-body]");
  const sectionsRoot = document.querySelector("[data-series-sections]");
  let current = null;

  const getRoute = () => {
    const params = new URLSearchParams(window.location.search);
    const querySeries = params.get("series");
    const hash = decodeURIComponent(window.location.hash.replace("#", ""));
    if (querySeries) {
      return {
        seriesId: querySeries,
        anchor: hash,
      };
    }
    const [seriesId, anchor = ""] = hash.split("/");
    return {
      seriesId: seriesId || series[0]?.id,
      anchor,
    };
  };

  const getCurrent = () => {
    const route = getRoute();
    return series.find((item) => item.id === route.seriesId) || series[0];
  };

  const lockImageTouch = (target) => {
    if (!target) return;
    target.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  };

  const renderSectionPoem = (section) => {
    const poemZh = section.poemZh || [];
    const poemEn = section.poemEn || [];
    if (!poemZh.length && !poemEn.length) return null;

    const poem = make("div", "series-section-poem");
    if (poemZh.length) {
      const zhBlock = make("div", "series-section-poem-zh");
      zhBlock.replaceChildren(...poemZh.map((line) => make("p", "", line)));
      poem.append(zhBlock);
    }
    if (poemEn.length) {
      const enBlock = make("div", "series-section-poem-en");
      enBlock.replaceChildren(...poemEn.map((line) => make("p", "", line)));
      poem.append(enBlock);
    }
    return poem;
  };

  const renderImageSection = (section, sectionIndex) => {
    const imageTotal = section.images.length;
    const isSingleSection = current.sections.length === 1;
    const block = make("section", `series-gallery-section${isSingleSection ? " is-single" : ""}`);
    block.id = section.id;

    const header = make("div", "series-section-header");
    const title = make("div", "series-section-title");
    title.append(make("h3", "", section.titleZh), make("small", "", section.titleEn));
    const frame = make("div", "series-gallery-frame");
    const prev = make("button", "series-gallery-arrow series-gallery-prev", "←");
    const count = make("span", "series-gallery-count", `01 / ${String(imageTotal).padStart(2, "0")}`);
    const next = make("button", "series-gallery-arrow series-gallery-next", "→");
    const detailSlot = make("div", "series-image-detail-slot");
    prev.type = "button";
    next.type = "button";
    prev.setAttribute("aria-label", "Previous image");
    next.setAttribute("aria-label", "Next image");
    if (!isSingleSection) {
      header.append(title);
    }

    const track = make("div", "gallery-track");
    track.replaceChildren(
      ...section.images.map((imageItem, index) => {
        const src = typeof imageItem === "string" ? imageItem : imageItem.src;
        const captionZh = typeof imageItem === "string" ? section.titleZh : imageItem.captionZh || section.titleZh;
        const captionEn = typeof imageItem === "string" ? section.titleEn : imageItem.captionEn || section.titleEn;
        const figure = make("figure", "gallery-slide series-slide");
        if (index === 0) {
          figure.classList.add("is-active");
        }
        const imageWrap = make("div", "gallery-image-wrap");
        const image = document.createElement("img");
        image.src = src;
        image.alt = `${current.titleZh} ${section.titleZh} ${index + 1}`;
        image.draggable = false;
        const setImageOrientation = () => {
          const isPortrait = image.naturalHeight > image.naturalWidth;
          imageWrap.classList.toggle("is-portrait", isPortrait);
          imageWrap.classList.toggle("is-landscape", !isPortrait);
        };
        if (image.complete && image.naturalWidth) {
          setImageOrientation();
        } else {
          image.addEventListener("load", setImageOrientation, { once: true });
        }
        lockImageTouch(imageWrap);
        imageWrap.append(image);

        const caption = make("figcaption", "");
        caption.append(
          make("strong", "", captionZh),
          make("em", "", captionEn),
          make("span", "", current.year),
          make("small", "", `${String(index + 1).padStart(2, "0")} / ${String(imageTotal).padStart(2, "0")}`)
        );
        figure.append(imageWrap, caption);
        return figure;
      })
    );

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
    const clampIndex = (index) => Math.max(0, Math.min(index, imageTotal - 1));
    const getSlideWidth = () => Math.max((track.scrollWidth / imageTotal) || track.clientWidth || 1, 1);
    const getSlideLeft = (index) => clampIndex(index) * getSlideWidth();
    const getNearestIndex = () => {
      return clampIndex(Math.round(track.scrollLeft / getSlideWidth()));
    };

    const renderImageDetail = (imageItem) => {
      if (typeof imageItem === "string") return null;
      const hasTitle = imageItem.captionZh || imageItem.captionEn;
      const descriptionZh = imageItem.descriptionZh || [];
      const descriptionEn = imageItem.descriptionEn || [];
      const hasDescription = descriptionZh.length || descriptionEn.length;
      const isDescriptionOpen = Boolean(imageItem._detailOpen);
      if (!hasTitle && !hasDescription) return null;

      const detail = make("div", "series-image-detail");
      detail.classList.toggle("is-open", isDescriptionOpen);
      let toggle = null;
      let titleBlock = null;
      if (hasTitle) {
        titleBlock = make("div", "series-image-detail-title");
        const titleText = make("div", "series-image-detail-heading");
        if (imageItem.captionZh) titleText.append(make("strong", "", imageItem.captionZh));
        if (imageItem.captionEn) titleText.append(make("em", "", imageItem.captionEn));
        titleBlock.append(titleText);
        if (hasDescription) {
          titleBlock.classList.add("is-toggleable");
          toggle = make("button", "series-image-detail-toggle", "›");
          toggle.type = "button";
          toggle.setAttribute("aria-expanded", String(isDescriptionOpen));
          toggle.setAttribute("aria-label", isDescriptionOpen ? "收起作品简介" : "展开作品简介");
          titleBlock.append(toggle);
        }
        detail.append(titleBlock);
      }
      if (hasDescription) {
        const description = make("div", "series-image-detail-description");
        const descriptionId = `series-image-detail-${section.id}-${activeIndex}`;
        description.id = descriptionId;
        description.hidden = !isDescriptionOpen;
        if (descriptionZh.length) {
          description.append(renderStatementGroup(descriptionZh, "statement-zh"));
        }
        if (descriptionEn.length) {
          description.append(renderStatementGroup(descriptionEn, "statement-en"));
        }
        detail.append(description);
        if (toggle) {
          const setDescriptionOpen = (nextIsOpen) => {
            imageItem._detailOpen = nextIsOpen;
            toggle.setAttribute("aria-expanded", String(nextIsOpen));
            toggle.setAttribute("aria-label", nextIsOpen ? "收起作品简介" : "展开作品简介");
            description.hidden = !nextIsOpen;
            detail.classList.toggle("is-open", nextIsOpen);
          };
          toggle.setAttribute("aria-controls", descriptionId);
          toggle.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
            setDescriptionOpen(!imageItem._detailOpen);
          });
          titleBlock?.addEventListener("click", () => {
            setDescriptionOpen(!imageItem._detailOpen);
          });
        }
      }
      return detail;
    };
    const syncImageDetail = () => {
      const detail = renderImageDetail(section.images[activeIndex]);
      detailSlot.hidden = !detail;
      detailSlot.replaceChildren(...(detail ? [detail] : []));
    };
    const syncCount = () => {
      count.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(imageTotal).padStart(2, "0")}`;
    };
    const setActiveSlide = () => {
      track.querySelectorAll(".gallery-slide").forEach((slide, index) => {
        slide.classList.toggle("is-active", index === activeIndex);
      });
    };
    const syncFromScroll = () => {
      const nextIndex = getNearestIndex();
      if (nextIndex !== activeIndex) {
        activeIndex = nextIndex;
        setActiveSlide();
        syncImageDetail();
      }
      syncCount();
    };
    const scrollToIndex = (index, behavior = "smooth") => {
      window.clearTimeout(alignTimer);
      activeIndex = clampIndex(index);
      setActiveSlide();
      syncImageDetail();
      syncCount();
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
      if (imageTotal <= 1 || event.ctrlKey) return;
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
      if (imageTotal <= 1 || event.pointerType === "mouse") return;
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
      if (!touchTracking) return;
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
      if (!touchTracking) return;
      const deltaX = touchLastX - touchStartX;
      const deltaY = touchLastY - touchStartY;
      const shouldMove = touchIsHorizontal && Math.abs(deltaX) > 34 && Math.abs(deltaX) > Math.abs(deltaY);
      const nextIndex = shouldMove ? touchStartIndex + (deltaX < 0 ? 1 : -1) : activeIndex;
      resetTouchGesture();
      scrollToIndex(nextIndex);
    };

    prev.addEventListener("click", () => scrollToIndex(activeIndex - 1));
    next.addEventListener("click", () => scrollToIndex(activeIndex + 1));
    track.addEventListener("scroll", () => {
      syncFromScroll();
      if (!wheelGestureMoved && !touchTracking) {
        settleToNearestSlide();
      }
    }, { passive: true });
    track.addEventListener("wheel", handleTrackWheel, { passive: false });
    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointermove", handlePointerMove, { passive: false });
    track.addEventListener("pointerup", handlePointerEnd);
    track.addEventListener("pointercancel", () => {
      resetTouchGesture();
      scrollToIndex(activeIndex);
    });
    window.addEventListener("resize", () => {
      scrollToIndex(activeIndex, "auto");
    });

    frame.append(prev, track, next, count);
    if (!isSingleSection) {
      block.append(header);
    }
    block.append(frame);
    syncImageDetail();
    window.requestAnimationFrame(() => scrollToIndex(0, "auto"));
    block.append(detailSlot);
    const poem = renderSectionPoem(section);
    if (poem) {
      block.append(poem);
    }
    if (sectionIndex > 0) {
      block.setAttribute("aria-label", `${current.titleZh} ${section.titleZh}`);
    }
    return block;
  };

  const renderThumbnailSection = (section, sectionIndex) => {
    const isSingleSection = current.sections.length === 1;
    const block = make("section", `series-thumbnail-section is-${current.id}`);
    block.id = section.id;
    if (section.thumbnailGrid) {
      block.classList.add(`is-${section.thumbnailGrid}`);
    }

    if (!isSingleSection) {
      const header = make("div", "series-section-header");
      const title = make("div", "series-section-title");
      title.append(make("h3", "", section.titleZh), make("small", "", section.titleEn));
      header.append(title);
      block.append(header);
    }

    const grid = make("div", "series-thumbnail-grid");
    const showNumbers = section.showNumbers !== false;
    grid.replaceChildren(
      ...section.images.map((imageItem, index) => {
        const src = typeof imageItem === "string" ? imageItem : imageItem.src;
        const figure = make("figure", "series-thumbnail-item");
        const imageWrap = make("div", "series-thumbnail-image");
        const image = document.createElement("img");
        image.src = src;
        image.alt = `${current.titleZh} ${section.titleZh} ${index + 1}`;
        image.draggable = false;
        imageWrap.append(image);
        figure.append(imageWrap);
        if (showNumbers) {
          figure.append(make("figcaption", "", String(index + 1).padStart(2, "0")));
        }
        return figure;
      })
    );

    block.append(grid);
    if (sectionIndex > 0) {
      block.setAttribute("aria-label", `${current.titleZh} ${section.titleZh}`);
    }
    return block;
  };

  const createVideoElement = (videoData) => {
    const video = document.createElement("video");
    video.src = videoData.src;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.disablePictureInPicture = true;
    video.setAttribute("controlsList", "nodownload noplaybackrate");
    video.setAttribute("aria-label", `${current.titleZh} ${videoData.titleZh || "视频"}`);
    video.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });
    return video;
  };

  const createVideoEmbed = (videoData) => {
    const embed = make("div", "series-video-embed");
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", videoData.embedSrc);
    iframe.setAttribute("title", `${current.titleZh} ${videoData.titleZh || "视频"}`);
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
    iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    iframe.setAttribute("allowfullscreen", "");
    iframe.allowFullscreen = true;
    embed.append(iframe);
    return embed;
  };

  const createVideoMedia = (videoData) => (
    videoData.embedSrc ? createVideoEmbed(videoData) : createVideoElement(videoData)
  );

  const renderVideoCollaborator = (collaborator) => {
    if (!collaborator) return null;

    const block = make("aside", "series-video-collaborator");
    if (collaborator.image) {
      const media = make("figure", "series-video-collaborator-media");
      const image = document.createElement("img");
      image.src = collaborator.image;
      image.alt = collaborator.imageAlt || collaborator.name || "Collaborating artist";
      image.loading = "lazy";
      media.append(image);
      block.append(media);
    }

    const content = make("div", "series-video-collaborator-content");
    content.append(
      make(
        "small",
        "series-video-collaborator-kicker",
        `${collaborator.titleZh || "合作艺术家"} / ${collaborator.titleEn || "Collaborating Artist"}`
      ),
      make("h4", "", collaborator.name || "")
    );

    const bioZh = collaborator.bioZh || [];
    const bioEn = collaborator.bioEn || [];
    if (bioZh.length || bioEn.length) {
      const bio = make("div", "series-video-collaborator-bio");
      if (bioZh.length) {
        bio.append(renderStatementGroup(bioZh, "statement-zh"));
      }
      if (bioEn.length) {
        bio.append(renderStatementGroup(bioEn, "statement-en"));
      }
      content.append(bio);
    }

    if (collaborator.instagram) {
      const link = make("a", "series-video-collaborator-link", "Instagram / @akerlund_lars");
      link.href = collaborator.instagram;
      link.target = "_blank";
      link.rel = "noreferrer";
      content.append(link);
    }

    block.append(content);
    return block;
  };

  const renderVideoSection = (videoData) => {
    if (!videoData) return null;
    const videoItems = Array.isArray(videoData.items)
      ? videoData.items.filter((item) => item?.src || item?.embedSrc)
      : videoData.src || videoData.embedSrc
        ? [videoData]
        : [];
    if (!videoItems.length) return null;

    const block = make("section", "series-video-section");
    const posterSrc = videoItems.length === 1 ? videoItems[0].poster : "";
    if (!current.sections?.length) {
      block.classList.add("is-first-content");
    }
    if (videoItems.length > 1) {
      block.classList.add("is-video-pair");
    }
    if (posterSrc) {
      block.classList.add("has-video-poster");
    }
    const heading = make("div", "series-section-header series-video-header");
    const title = make("div", "series-section-title");
    title.append(
      make("h3", "", videoData.titleZh || videoItems[0].titleZh || "视频"),
      make("small", "", videoData.titleEn || videoItems[0].titleEn || "Video")
    );
    heading.append(title);

    const descriptionZh = videoData.descriptionZh || [];
    const descriptionEn = videoData.descriptionEn || [];
    const description = make("div", "series-video-description");
    if (descriptionZh.length) {
      description.append(renderStatementGroup(descriptionZh, "statement-zh"));
    }
    if (descriptionEn.length) {
      description.append(renderStatementGroup(descriptionEn, "statement-en"));
    }

    block.append(heading);
    if (descriptionZh.length || descriptionEn.length) {
      block.append(description);
    }
    if (videoItems.length === 1) {
      if (posterSrc) {
        const poster = make("figure", "series-video-poster");
        const posterImage = document.createElement("img");
        posterImage.src = posterSrc;
        posterImage.alt = `${current.titleZh} 海报`;
        posterImage.loading = "lazy";
        poster.append(posterImage);
        block.append(poster);
      }
      const videoWrap = make("div", "series-video-wrap");
      videoWrap.append(createVideoMedia(videoItems[0]));
      block.append(videoWrap);
    } else {
      const videoGrid = make("div", "series-video-grid");
      videoItems.forEach((item) => {
        const figure = make("figure", "series-video-item");
        const videoWrap = make("div", "series-video-wrap");
        videoWrap.append(createVideoMedia(item));
        figure.append(videoWrap);
        if (item.titleZh || item.titleEn) {
          const caption = make("figcaption", "series-video-caption");
          if (item.titleZh) caption.append(make("strong", "", item.titleZh));
          if (item.titleEn) caption.append(make("em", "", item.titleEn));
          figure.append(caption);
        }
        videoGrid.append(figure);
      });
      block.append(videoGrid);
    }
    const collaborator = renderVideoCollaborator(videoData.collaborator);
    if (collaborator) {
      block.append(collaborator);
    }
    return block;
  };

  const renderStatementGroup = (paragraphs, className) => {
    const group = make("div", className);
    group.replaceChildren(...paragraphs.map((text) => make("p", "", text)));
    return group;
  };

  const getSeriesExhibitions = (seriesId) => {
    const records = presentationHistory.length
      ? presentationHistory
      : exhibitions.map((item) => ({
          ...item,
          detailId: item.id,
          eventEn: item.titleEn,
        }));
    return records
      .filter((item) => {
        const ids = [item.seriesId, ...(item.seriesIds || [])].filter(Boolean);
        return ids.includes(seriesId);
      })
      .sort((a, b) => Number(b.year) - Number(a.year));
  };

  const renderSeriesExhibitions = () => {
    const relatedExhibitions = getSeriesExhibitions(current.id);
    if (!relatedExhibitions.length) return null;

    const block = make("section", "series-exhibitions");
    block.id = "exhibitions";
    block.setAttribute("aria-label", "Exhibitions and presentations");

    const header = make("div", "series-section-header series-exhibitions-header");
    const title = make("div", "series-section-title");
    title.append(make("h3", "", "展览 / 呈现经历"), make("small", "", "Exhibitions / Presentations"));
    header.append(title);

    const list = make("ol", "series-exhibitions-list");
    relatedExhibitions.forEach((item) => {
      const row = make("li", "series-exhibition-item");
      row.append(make("span", "series-exhibition-year", item.year));

      const body = make("div", "series-exhibition-body");
      const href = presentationHref(item);
      const titleLine = make(href ? "a" : "span", `series-exhibition-title${href ? " series-exhibition-link" : ""}`);
      if (href) {
        titleLine.href = href;
        titleLine.setAttribute("aria-label", `${item.eventZh || item.eventEn || item.titleZh || item.titleEn}, view exhibition`);
        row.classList.add("has-link");
      }
      titleLine.append(make("strong", "", item.eventZh || item.titleZh || item.eventEn || item.titleEn));
      if (item.eventEn || item.titleEn) {
        titleLine.append(make("em", "", item.eventEn || item.titleEn));
      }
      if (href) {
        titleLine.append(make("span", "series-exhibition-action", "View exhibition →"));
      }
      body.append(titleLine);

      row.append(body);
      list.append(row);
    });

    block.append(header, list);
    return block;
  };

  const scrollToRouteAnchor = () => {
    const { anchor } = getRoute();
    if (!anchor) return;
    const target = document.getElementById(anchor);
    if (!target) return;
    const scroll = () => {
      target.scrollIntoView({ block: "start" });
    };
    window.requestAnimationFrame(scroll);
    window.setTimeout(scroll, 260);
    window.setTimeout(scroll, 900);
    window.setTimeout(scroll, 1800);
  };

  const renderGallery = () => {
    current = getCurrent();
    if (!current) return;

    document.title = `${current.titleEn} / Series / Jade Tongxin Ji`;
    if (titleZh) titleZh.textContent = current.titleZh;
    if (titleEn) titleEn.textContent = current.titleEn;
    if (meta) meta.textContent = `${current.year} / Series`;
    if (medium) {
      medium.replaceChildren(
        make("span", "series-medium-zh", current.mediumZh),
        make("span", "series-medium-divider", "/"),
        make("span", "series-medium-en", current.mediumEn)
      );
    }

    const statementZh = current.statementZh || [];
    const statementEn = current.statementEn || [];
    const hasStatement = statementZh.length || statementEn.length;
    if (statement && statementBody) {
      statement.hidden = !hasStatement;
      statementBody.replaceChildren();
      if (hasStatement) {
        if (statementZh.length) {
          statementBody.append(renderStatementGroup(statementZh, "statement-zh"));
        }
        if (statementEn.length) {
          statementBody.append(renderStatementGroup(statementEn, "statement-en"));
        }
      }
    }

    if (sectionsRoot) {
      const renderSection = current.layout === "thumbnails" ? renderThumbnailSection : renderImageSection;
      const renderedSections = current.sections.map(renderSection);
      const videoSections = [current.video, current.videos].map(renderVideoSection).filter(Boolean);
      renderedSections.push(...videoSections);
      const exhibitionsSection = renderSeriesExhibitions();
      if (exhibitionsSection) {
        renderedSections.push(exhibitionsSection);
      }
      sectionsRoot.replaceChildren(...renderedSections);
      scrollToRouteAnchor();
    }
  };

  window.addEventListener("hashchange", renderGallery);
  renderGallery();
})();
