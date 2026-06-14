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
      .replace(/\s*[↑↓]$/, "")
      .replace(/\s*\/\s*$/, "")
  );
  const setNavTriggerState = (trigger, isOpen) => {
    const label = trigger.dataset.baseLabel || cleanNavTriggerLabel(trigger.textContent);
    trigger.replaceChildren(
      make("span", "nav-trigger-label", label),
      make("span", "nav-trigger-arrow", isOpen ? "↑" : "↓")
    );
  };
  const homeSeriesEntrypoints = [
    {
      href: "recent-works.html",
      zh: "近期作品",
      en: "RECENT WORKS",
    },
    {
      href: "early-works.html",
      zh: "早期尝试",
      en: "EARLY WORKS",
    },
  ];
  const workNavigationGroups = [
    {
      type: "recent",
      backHref: "recent-works.html",
      backLabel: "← 返回近期作品 / BACK TO RECENT WORKS",
      ids: [
        "dandelion-has-not-decided",
        "hesitation",
        "new-year-elevator",
        "epitaph",
      ],
    },
    {
      type: "early",
      backHref: "early-works.html",
      backLabel: "← 返回早期尝试 / BACK TO EARLY WORKS",
      ids: [
        "tiao-zhi-hua",
        "upstream-wind",
        "nature-of-nature",
        "whale-eggs",
        "zero-twenty",
      ],
    },
  ];

  document.querySelectorAll("[data-render-series-menu]").forEach((menu) => {
    const links = homeSeriesEntrypoints.map((item) => {
      const link = make("a", "menu-link series-directory-entry");
      link.href = item.href;
      link.setAttribute("aria-label", `${item.zh} / ${item.en} →`);
      link.append(
        make("span", "series-directory-entry-zh", item.zh),
        make("span", "series-directory-entry-slash", "/"),
        make("span", "series-directory-entry-en", item.en),
        make("span", "series-directory-entry-arrow", "→")
      );
      return link;
    });
    menu.replaceChildren(...links);
  });

  const setNavMenuOpen = (navMenu, trigger, isOpen) => {
    navMenu.classList.toggle("is-open", isOpen);
    trigger.setAttribute("aria-expanded", String(isOpen));
    setNavTriggerState(trigger, isOpen);
  };

  const closeSeriesMenus = (exceptMenu) => {
    document.querySelectorAll(".home-nav-menu.is-open, .page-nav-menu.is-open").forEach((navMenu) => {
      if (navMenu === exceptMenu) return;
      const trigger = navMenu.querySelector(".home-nav-trigger, .page-nav-trigger");
      if (trigger) {
        setNavMenuOpen(navMenu, trigger, false);
      }
    });
  };

  document.querySelectorAll("[data-render-series-menu]").forEach((menu) => {
    const navMenu = menu.closest(".home-nav-menu, .page-nav-menu");
    const trigger = navMenu?.querySelector(".home-nav-trigger, .page-nav-trigger");
    if (!navMenu || !trigger) return;

    trigger.dataset.baseLabel = cleanNavTriggerLabel(trigger.textContent);
    setNavMenuOpen(navMenu, trigger, navMenu.classList.contains("is-open"));

    if (navMenu.dataset.seriesMenuBound === "true") return;
    navMenu.dataset.seriesMenuBound = "true";

    const toggleNavMenu = () => {
      const nextIsOpen = !navMenu.classList.contains("is-open");
      if (nextIsOpen) {
        closeSeriesMenus(navMenu);
      }
      setNavMenuOpen(navMenu, trigger, nextIsOpen);
    };

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleNavMenu();
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target.closest("[data-render-series-menu]")) return;
      if (event.target.closest(".home-nav-trigger, .page-nav-trigger")) return;
      event.preventDefault();
      toggleNavMenu();
    });

    menu.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      setNavMenuOpen(navMenu, trigger, false);
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
  const directoryBackNav = document.querySelector("[data-series-directory-back-nav]");
  const workNav = document.querySelector("[data-series-work-nav]");
  const galleryInfo = detailRoot.querySelector(".gallery-info");
  const statement = document.querySelector("[data-series-statement]");
  const statementToggle = document.querySelector("[data-series-statement-toggle]");
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

  const findWorkNavigation = (seriesId) => {
    for (const group of workNavigationGroups) {
      const index = group.ids.indexOf(seriesId);
      if (index === -1) continue;
      return {
        group,
        previous: series.find((item) => item.id === group.ids[index - 1]) || null,
        next: series.find((item) => item.id === group.ids[index + 1]) || null,
      };
    }
    return null;
  };

  const getWorkNavTitle = (target) => `${target.titleZh} / ${target.titleEn}`;

  const renderWorkNavLink = (className, href, label) => {
    const link = make("a", `series-work-nav-link ${className}`);
    link.href = href;
    link.append(make("span", "series-work-nav-label", label));
    return link;
  };

  const renderWorkNav = () => {
    if (!workNav || !current) return;
    const nav = findWorkNavigation(current.id);
    if (directoryBackNav) {
      directoryBackNav.replaceChildren();
      directoryBackNav.hidden = !nav;
    }
    workNav.replaceChildren();
    workNav.hidden = !nav;
    if (!nav) return;

    if (directoryBackNav) {
      directoryBackNav.append(renderWorkNavLink("series-work-nav-back", nav.group.backHref, nav.group.backLabel));
    }

    const pagerRow = make("div", "series-work-nav-row series-work-nav-pager");
    if (nav.previous) {
      pagerRow.append(
        renderWorkNavLink(
          "series-work-nav-previous",
          galleryHref(nav.previous),
          `← ${getWorkNavTitle(nav.previous)}`
        )
      );
    }
    if (nav.next) {
      pagerRow.append(
        renderWorkNavLink(
          "series-work-nav-next",
          galleryHref(nav.next),
          `${getWorkNavTitle(nav.next)} →`
        )
      );
    }

    workNav.append(pagerRow);
  };

  const lockImageTouch = (target) => {
    if (!target) return;
    target.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  };

  const setDisclosureOpen = (root, toggle, panel, isOpen, labels = {}) => {
    if (!root || !toggle || !panel) return;
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? labels.close || "收起作品简介" : labels.open || "展开作品简介");
    panel.hidden = !isOpen;
    root.classList.toggle("is-open", isOpen);
  };

  const bindDisclosure = (root, toggle, panel, getOpen, setOpen, labels) => {
    if (!root || !toggle || !panel) return;
    setDisclosureOpen(root, toggle, panel, Boolean(getOpen()), labels);
    if (toggle.dataset.disclosureBound === "true") return;
    toggle.dataset.disclosureBound = "true";
    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const nextIsOpen = !Boolean(getOpen());
      setOpen(nextIsOpen);
      setDisclosureOpen(root, toggle, panel, nextIsOpen, labels);
    });
  };

  const makeDisclosureIcon = () => make("span", "series-disclosure-icon");

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
        image.loading = index === 0 ? "eager" : "lazy";
        image.decoding = "async";
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
    let scrollSyncFrame = 0;
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
    const scheduleScrollSync = () => {
      if (scrollSyncFrame) return;
      scrollSyncFrame = window.requestAnimationFrame(() => {
        scrollSyncFrame = 0;
        syncFromScroll();
      });
    };

    prev.addEventListener("click", () => scrollToIndex(activeIndex - 1));
    next.addEventListener("click", () => scrollToIndex(activeIndex + 1));
    track.addEventListener("scroll", scheduleScrollSync, { passive: true });
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
    const heading = make("div", "series-video-collaborator-heading");
    const titleGroup = make("div", "series-video-collaborator-title");
    titleGroup.append(
      make(
        "small",
        "series-video-collaborator-kicker",
        `${collaborator.titleZh || "合作艺术家"} / ${collaborator.titleEn || "Collaborating Artist"}`
      ),
      make("h4", "", collaborator.name || "")
    );
    heading.append(titleGroup);

    const bioZh = collaborator.bioZh || [];
    const bioEn = collaborator.bioEn || [];
    const hasCollaboratorDetail = bioZh.length || bioEn.length || collaborator.instagram;
    let panel = null;
    if (hasCollaboratorDetail) {
      panel = make("div", "series-video-collaborator-panel");
      const panelId = `series-collaborator-${current.id}-${collaborator.name || "artist"}`.replace(/[^a-z0-9_-]+/gi, "-");
      panel.id = panelId;
      const toggle = make("button", "series-collaborator-toggle series-disclosure-trigger");
      toggle.type = "button";
      toggle.setAttribute("aria-controls", panelId);
      toggle.append(makeDisclosureIcon());
      heading.classList.add("is-toggleable");
      heading.append(toggle);
      heading.addEventListener("click", (event) => {
        if (event.target.closest("button, a")) return;
        toggle.click();
      });
      bindDisclosure(
        block,
        toggle,
        panel,
        () => collaborator._detailOpen,
        (nextIsOpen) => {
          collaborator._detailOpen = nextIsOpen;
        },
        {
          open: "展开合作艺术家简介",
          close: "收起合作艺术家简介",
        }
      );
    }
    content.append(heading);

    if (bioZh.length || bioEn.length) {
      const bio = make("div", "series-video-collaborator-bio");
      if (bioZh.length) {
        bio.append(renderStatementGroup(bioZh, "statement-zh"));
      }
      if (bioEn.length) {
        bio.append(renderStatementGroup(bioEn, "statement-en"));
      }
      (panel || content).append(bio);
    }

    if (collaborator.instagram) {
      const link = make("a", "series-video-collaborator-link", "Instagram / @akerlund_lars");
      link.href = collaborator.instagram;
      link.target = "_blank";
      link.rel = "noreferrer";
      (panel || content).append(link);
    }

    if (panel) {
      content.append(panel);
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
    const hasDescription = descriptionZh.length || descriptionEn.length;
    const description = make("div", "series-video-description");
    const descriptionId = `series-video-description-${current.id}-${videoData.titleEn || videoData.titleZh || "video"}`.replace(/[^a-z0-9_-]+/gi, "-");
    if (descriptionZh.length) {
      description.append(renderStatementGroup(descriptionZh, "statement-zh"));
    }
    if (descriptionEn.length) {
      description.append(renderStatementGroup(descriptionEn, "statement-en"));
    }
    description.id = descriptionId;

    if (hasDescription) {
      const toggle = make("button", "series-description-toggle series-disclosure-trigger");
      toggle.type = "button";
      toggle.setAttribute("aria-controls", descriptionId);
      toggle.append(makeDisclosureIcon());
      heading.classList.add("is-toggleable");
      heading.append(toggle);
      heading.addEventListener("click", (event) => {
        if (event.target.closest("button, a")) return;
        toggle.click();
      });
      bindDisclosure(
        block,
        toggle,
        description,
        () => videoData._descriptionOpen,
        (nextIsOpen) => {
          videoData._descriptionOpen = nextIsOpen;
        }
      );
    }

    block.append(heading);
    if (hasDescription) {
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
        titleLine.append(make("span", "series-exhibition-action", "VIEW EXHIBITION ↗"));
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
    if (galleryInfo) {
      const atmosphereImage = current.atmosphereImage || "";
      galleryInfo.classList.toggle("has-series-atmosphere", Boolean(atmosphereImage));
      if (atmosphereImage) {
        const atmosphereUrl = new URL(atmosphereImage, window.location.href).href;
        galleryInfo.style.setProperty("--series-atmosphere-image", `url("${atmosphereUrl}")`);
      } else {
        galleryInfo.style.removeProperty("--series-atmosphere-image");
      }
    }
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
    renderWorkNav();

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
        bindDisclosure(
          statement,
          statementToggle,
          statementBody,
          () => current._statementOpen,
          (nextIsOpen) => {
            current._statementOpen = nextIsOpen;
          }
        );
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
