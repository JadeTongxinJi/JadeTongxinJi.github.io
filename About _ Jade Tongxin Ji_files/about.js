(() => {
  const content = window.jadeAboutContent;
  const presentationHistory = window.jadePresentationHistory || [];

  if (!content) {
    return;
  }

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element && value) {
      element.textContent = value;
    }
  };

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

  const bindDisclosure = (root, toggle, panel, symbolSelector) => {
    if (!root || !toggle || !panel) {
      return;
    }

    const symbol = symbolSelector ? toggle.querySelector(symbolSelector) : null;
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      if (symbol) {
        symbol.textContent = isOpen ? "+" : "−";
      }
      panel.hidden = isOpen;
      root.classList.toggle("is-open", !isOpen);
    });
  };

  const appendFactEntry = (block, entry) => {
    const wrapper = make("div", "fact-entry");
    wrapper.append(make("p", "fact-line fact-line-zh", entry.zh));
    wrapper.append(make("p", "fact-line fact-line-en", entry.en));
    block.append(wrapper);
  };

  const exhibitionHref = (item) => {
    if (item.detailId) return `exhibition-gallery.html#${item.detailId}`;
    return item.href || "";
  };

  const makeCvEvent = (item) => {
    const href = exhibitionHref(item);
    const event = make(href ? "a" : "span", `cv-text cv-event${href ? " cv-event-link" : ""}`);
    const eventZh = item.eventZh || item.zh || "";
    const eventEn = item.eventEn || item.en || "";
    if (href) {
      event.href = href;
      event.setAttribute("aria-label", `${eventZh || eventEn}, view exhibition`);
    }
    if (eventZh) {
      event.append(make("span", "cv-event-title cv-event-title-zh", eventZh));
    }
    if (eventEn) {
      event.append(make("span", "cv-event-title-en", eventEn));
    }
    if (href) {
      event.append(make("span", "cv-link-cue", "View exhibition →"));
    }
    return event;
  };

  const getCvDisplay = (item) => {
    const eventZh = item.eventZh || item.zh || "";
    const eventEn = item.eventEn || item.en || "";
    const isSolo = /个展/.test(eventZh) || /solo exhibition/i.test(eventEn);
    return {
      titleZh: eventZh,
      titleEn: eventEn,
      work: !isSolo && item.workZh && item.workEn ? `作品｜${item.workZh} / ${item.workEn}` : "",
    };
  };

  const makeCvRecord = (item) => {
    const row = make("li", "cv-entry");
    const href = exhibitionHref(item);
    const display = getCvDisplay(item);
    const title = make(href ? "a" : "div", `cv-entry-title${href ? " cv-entry-title-link" : ""}`);
    if (href) {
      title.href = href;
      title.setAttribute("aria-label", `${display.titleZh || display.titleEn}, view exhibition`);
    }
    title.append(make("h3", "", display.titleZh), make("p", "", display.titleEn));
    row.append(title);

    if (display.work) {
      row.append(make("p", "cv-entry-work", display.work));
    }

    if (href) {
      const link = make("a", "cv-entry-link", "View exhibition →");
      link.href = href;
      row.append(link);
      row.classList.add("has-link");
    }

    return row;
  };

  const makeCvYearGroup = (year, items) => {
    const group = make("li", "cv-year-group");
    const toggle = make("button", "cv-year-toggle");
    const panel = make("div", "cv-year-panel");
    const list = make("ol", "cv-year-list");
    const panelId = `about-cv-${year}`;

    toggle.type = "button";
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", panelId);
    toggle.append(make("span", "cv-year-number", year), make("span", "cv-year-symbol", "+"));

    panel.id = panelId;
    panel.hidden = true;
    list.replaceChildren(...items.map(makeCvRecord));
    panel.append(list);

    bindDisclosure(group, toggle, panel, ".cv-year-symbol");

    group.append(toggle, panel);
    return group;
  };

  const makeCvWork = (item) => {
    const workText = item.workZh && item.workEn ? `${item.workZh} / ${item.workEn}` : item.zh || "";
    return make("span", "cv-text cv-work", workText);
  };

  const makeFactBlock = (item) => {
    const block = make("div", "fact-block");
    block.append(make("h2", "", item.title));
    if (Array.isArray(item.entries)) {
      item.entries.forEach((entry) => appendFactEntry(block, entry));
    } else if (Array.isArray(item.lines)) {
      item.lines.forEach((line) => block.append(make("p", "", line)));
    }
    return block;
  };

  const renderFactAccordion = (container, item) => {
    if (!item) {
      container.remove();
      return;
    }

    const title = container.querySelector(".about-accordion-title");
    const panel = container.querySelector(".about-accordion-panel");
    if (title) {
      title.textContent = item.title;
    }
    if (panel) {
      panel.replaceChildren();
      if (Array.isArray(item.entries)) {
        item.entries.forEach((entry) => appendFactEntry(panel, entry));
      } else if (Array.isArray(item.lines)) {
        item.lines.forEach((line) => panel.append(make("p", "", line)));
      }
    }
  };

  const getFactGroup = (group) => {
    if (!Array.isArray(content.facts)) {
      return [];
    }
    if (group === "profile") {
      return content.facts.filter((item) => item.title.includes("学历") || item.title.includes("Education"));
    }
    if (group === "residency") {
      return content.facts.filter((item) => item.title.includes("驻地") || item.title.includes("Residency"));
    }
    return content.facts;
  };

  const setMultilineTitle = (selector, value) => {
    const element = document.querySelector(selector);
    if (!element || !value) {
      return;
    }

    const lines = value.split("\n");
    element.replaceChildren();
    lines.forEach((line, index) => {
      if (index > 0) {
        element.append(document.createElement("br"));
      }
      element.append(document.createTextNode(line));
    });
  };

  document.title = content.meta?.title || document.title;
  const description = document.querySelector('meta[name="description"]');
  if (description && content.meta?.description) {
    description.setAttribute("content", content.meta.description);
  }

  setText('[data-about="siteName"]', content.siteName);
  setText('[data-about="eyebrow"]', content.eyebrow);
  setText('[data-about="nameZh"]', content.nameZh);
  setText('[data-about="nameEn"]', content.nameEn);
  const heroCaption = document.querySelector('[data-about="heroCaption"]');
  if (heroCaption) {
    const caption = content.heroImage?.caption || "";
    heroCaption.textContent = caption;
    heroCaption.hidden = !caption;
  }
  setText('[data-about="bioZhTitle"]', content.bio?.zhTitle);
  setText('[data-about="bioZh"]', content.bio?.zh);
  const bioEnTitle = document.querySelector('[data-about="bioEnTitle"]');
  if (bioEnTitle) {
    const value = content.bio?.enTitle || "";
    bioEnTitle.textContent = value;
    bioEnTitle.hidden = !value;
  }
  setText('[data-about="bioEn"]', content.bio?.en);
  setMultilineTitle('[data-about="exhibitionsTitle"]', content.exhibitionsTitle);

  const heroImage = document.querySelector('[data-about="heroImage"]');
  if (heroImage && content.heroImage) {
    heroImage.src = content.heroImage.src;
    heroImage.alt = content.heroImage.alt;
  }

  document.querySelectorAll('[data-render="facts"]').forEach((facts) => {
    const group = facts.dataset.factGroup;
    const blocks = getFactGroup(group);
    if (facts.classList.contains("about-accordion-item")) {
      renderFactAccordion(facts, blocks[0]);
    } else {
      facts.replaceChildren(...blocks.map(makeFactBlock));
    }
  });

  document.querySelectorAll(".about-accordion-item").forEach((item) => {
    bindDisclosure(
      item,
      item.querySelector(".about-accordion-toggle"),
      item.querySelector(".about-accordion-panel"),
      ".about-accordion-symbol"
    );
  });

  const exhibitions = document.querySelector('[data-render="exhibitions"]');
  const exhibitionItems = presentationHistory.length ? presentationHistory : content.exhibitions || [];
  if (exhibitions && Array.isArray(exhibitionItems)) {
    const years = [...new Set(exhibitionItems.map((item) => item.year))]
      .sort((a, b) => Number(b) - Number(a));
    exhibitions.replaceChildren(
      ...years.map((year) => makeCvYearGroup(
        year,
        exhibitionItems.filter((item) => item.year === year)
      ))
    );
  }

  const footer = document.querySelector('[data-render="footerLinks"]');
  if (footer && Array.isArray(content.footerLinks)) {
    footer.replaceChildren(
      ...content.footerLinks.map((item) => {
        const link = make("a", "", item.label);
        link.href = item.href;
        return link;
      })
    );
  }
})();
