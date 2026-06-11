(() => {
  const content = window.jadeAboutContent;

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

  const appendFactEntry = (block, entry) => {
    const wrapper = make("div", "fact-entry");
    wrapper.append(make("p", "fact-line fact-line-zh", entry.zh));
    wrapper.append(make("p", "fact-line fact-line-en", entry.en));
    block.append(wrapper);
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

  const getFactGroup = (group) => {
    if (!Array.isArray(content.facts)) {
      return [];
    }
    if (group === "profile") {
      return content.facts.filter((item) => !item.title.includes("驻地") && !item.title.includes("Residency"));
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
  setText('[data-about="bioEnTitle"]', content.bio?.enTitle);
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
    facts.replaceChildren(...blocks.map(makeFactBlock));
  });

  const exhibitions = document.querySelector('[data-render="exhibitions"]');
  if (exhibitions && Array.isArray(content.exhibitions)) {
    exhibitions.replaceChildren(
      ...content.exhibitions.map((item) => {
        const row = make("li");
        row.append(make("span", "cv-year", item.year));
        row.append(make("span", "cv-text cv-text-zh", item.zh));
        row.append(make("span", "cv-text cv-text-en", item.en));
        return row;
      })
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
