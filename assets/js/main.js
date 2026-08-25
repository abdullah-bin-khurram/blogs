(() => {
  const root = document.documentElement;
  const body = document.body;
  const languageButtons = [...document.querySelectorAll("[data-language-button]")];
  const preferredLanguage = localStorage.getItem("abk-portal-language") || "en";
  let activeLanguage = preferredLanguage === "ur" ? "ur" : "en";
  const portalEmbeds = [...document.querySelectorAll("[data-portal-embed]")];

  const sendPortalLanguage = (frame) => {
    frame.contentWindow?.postMessage({ type: "abk-language", language: activeLanguage }, "*");
  };
  const syncPortalEmbeds = () => portalEmbeds.forEach(sendPortalLanguage);
  portalEmbeds.forEach((frame) => {
    frame.addEventListener("load", () => sendPortalLanguage(frame));
    sendPortalLanguage(frame);
  });
  window.addEventListener("message", (event) => {
    const frame = portalEmbeds.find((item) => item.contentWindow === event.source);
    if (!frame || !event.data || typeof event.data !== "object") return;
    if (event.data.type === "abk-tool-ready") sendPortalLanguage(frame);
    if (event.data.type === "abk-tool-height" && frame.classList.contains("interactive-resource-frame")) {
      const height = Math.min(Math.max((Number(event.data.height) || 0) + 32, 560), 6000);
      frame.style.height = `${height}px`;
    }
  });

  const formatDates = () => {
    const locale = activeLanguage === "ur" ? "ur-PK" : "en-US";
    const formatter = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" });
    document.querySelectorAll("[data-localized-date]").forEach((element) => {
      const date = new Date(`${element.dataset.localizedDate}T12:00:00`);
      if (!Number.isNaN(date.valueOf())) element.textContent = formatter.format(date);
    });
  };

  const updateDocumentMetadata = () => {
    const title = activeLanguage === "ur" ? body.dataset.pageTitleUr : body.dataset.pageTitleEn;
    const description = activeLanguage === "ur" ? body.dataset.pageDescriptionUr : body.dataset.pageDescriptionEn;
    if (title) document.title = title === "ABK Lung Health Education Portal" ? title : `${title} · ABK Lung Health Education Portal`;
    const descriptionElement = document.querySelector('meta[name="description"]');
    if (descriptionElement && description) descriptionElement.content = description;
  };

  const searchInput = document.querySelector("[data-search-input]");
  const resourceSearch = document.querySelector("[data-resource-search]");
  const refreshLanguageDependentViews = () => {
    searchInput?.dispatchEvent(new Event("input"));
    resourceSearch?.dispatchEvent(new Event("input"));
  };
  const updateCarouselControls = () => {
    const isUrdu = activeLanguage === "ur";
    document.querySelectorAll("[data-carousel-prev]").forEach((button) => {
      button.textContent = isUrdu ? "→" : "←";
      button.setAttribute("aria-label", isUrdu ? "پچھلی اشیاء" : "Previous items");
    });
    document.querySelectorAll("[data-carousel-next]").forEach((button) => {
      button.textContent = isUrdu ? "←" : "→";
      button.setAttribute("aria-label", isUrdu ? "اگلی اشیاء" : "Next items");
    });
  };

  const setLanguage = (language) => {
    activeLanguage = language === "ur" ? "ur" : "en";
    root.dataset.language = activeLanguage;
    root.lang = activeLanguage;
    root.dir = activeLanguage === "ur" ? "rtl" : "ltr";
    localStorage.setItem("abk-portal-language", activeLanguage);
    languageButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.languageButton === activeLanguage)));
    if (searchInput) searchInput.placeholder = activeLanguage === "ur" ? "تمام مضامین تلاش کریں" : "Search all articles";
    if (resourceSearch) resourceSearch.placeholder = activeLanguage === "ur" ? "وسائل تلاش کریں" : "Search resources";
    formatDates();
    updateDocumentMetadata();
    updateCarouselControls();
    refreshLanguageDependentViews();
    syncPortalEmbeds();
  };

  languageButtons.forEach((button) => button.addEventListener("click", () => setLanguage(button.dataset.languageButton)));

  const menuButton = document.querySelector("[data-menu-toggle]");
  const sidebar = document.querySelector("[data-sidebar]");
  const backdrop = document.querySelector("[data-nav-backdrop]");
  const setMenu = (open) => {
    if (!menuButton || !sidebar || !backdrop) return;
    menuButton.setAttribute("aria-expanded", String(open));
    sidebar.classList.toggle("is-open", open);
    backdrop.hidden = !open;
    body.classList.toggle("menu-open", open);
  };
  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  backdrop?.addEventListener("click", () => setMenu(false));
  sidebar?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  window.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });

  const desktopSidebarQuery = window.matchMedia("(min-width: 1041px)");
  let sidebarFrame = 0;
  let sidebarCompact = false;
  const setSidebarCompact = (compact) => {
    sidebarCompact = compact;
    sidebar?.classList.toggle("is-compact", compact);
  };
  const updateSidebarNavigation = () => {
    sidebarFrame = 0;
    if (!desktopSidebarQuery.matches) {
      setSidebarCompact(false);
      return;
    }
    if (!sidebarCompact && window.scrollY >= 220) setSidebarCompact(true);
    if (sidebarCompact && window.scrollY <= 80) setSidebarCompact(false);
  };
  const queueSidebarNavigationUpdate = () => {
    if (!sidebarFrame) sidebarFrame = window.requestAnimationFrame(updateSidebarNavigation);
  };
  updateSidebarNavigation();
  window.addEventListener("scroll", queueSidebarNavigationUpdate, { passive: true });
  desktopSidebarQuery.addEventListener?.("change", updateSidebarNavigation);

  const initializeCarousels = () => {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector("[data-carousel-track]");
      const previous = carousel.querySelector("[data-carousel-prev]");
      const next = carousel.querySelector("[data-carousel-next]");
      if (!track) return;
      const move = (direction) => {
        const languageDirection = activeLanguage === "ur" ? -1 : 1;
        track.scrollBy({ left: direction * languageDirection * Math.max(track.clientWidth * .82, 260), behavior: "smooth" });
      };
      previous?.addEventListener("click", () => move(-1));
      next?.addEventListener("click", () => move(1));
    });
  };

  const topTrack = document.querySelector("[data-top-article-track]");
  if (topTrack) {
    try {
      const rankingData = JSON.parse(document.querySelector("#top-article-data")?.textContent || "{}");
      const rankings = rankingData.articles || rankingData || [];
      const rankMap = new Map(rankings.map((item, index) => [item.url, item.rank || index + 1]));
      [...topTrack.querySelectorAll("[data-post-card]")]
        .sort((first, second) => (rankMap.get(first.dataset.postUrl) || 10000) - (rankMap.get(second.dataset.postUrl) || 10000))
        .forEach((card) => topTrack.append(card));
    } catch (error) {
      console.warn("Article ranking data could not be read.", error);
    }
  }

  const categoryContainer = document.querySelector(".category-sections");
  if (categoryContainer) {
    [...categoryContainer.querySelectorAll("[data-category-order]")]
      .sort((first, second) => Number(first.dataset.categoryOrder) - Number(second.dataset.categoryOrder))
      .forEach((section) => categoryContainer.append(section));
  }

  const filterButtons = [...document.querySelectorAll("[data-article-filter]")];
  const seenFilters = new Set();
  filterButtons.forEach((button) => {
    const filter = button.dataset.articleFilter;
    if (seenFilters.has(filter)) button.remove(); else seenFilters.add(filter);
  });
  const uniqueFilterButtons = [...document.querySelectorAll("[data-article-filter]")];
  const topCards = [...document.querySelectorAll("[data-top-article-track] [data-post-card]")];
  const articleEmpty = document.querySelector("[data-article-empty]");
  let activeFilter = "all";
  const applyArticleFilters = () => {
    const query = (searchInput?.value || "").trim().toLowerCase();
    let visibleCount = 0;
    topCards.forEach((card) => {
      const searchText = activeLanguage === "ur" ? card.dataset.searchUr : card.dataset.searchEn;
      const matchesSearch = !query || (searchText || "").toLowerCase().includes(query);
      const matchesTag = activeFilter === "all" || (card.dataset.tags || "").split(/\s+/).includes(activeFilter);
      card.hidden = !(matchesSearch && matchesTag);
      if (!card.hidden) visibleCount += 1;
    });
    if (articleEmpty) articleEmpty.hidden = visibleCount > 0;
  };
  const normalizeFilter = (value) => (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const requestedFilter = normalizeFilter(new URLSearchParams(window.location.search).get("tag"));
  const filterExists = requestedFilter && topCards.some((card) => (card.dataset.tags || "").split(/\s+/).includes(requestedFilter));
  if (filterExists) {
    activeFilter = requestedFilter;
    uniqueFilterButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.articleFilter === requestedFilter));
  }
  uniqueFilterButtons.forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.articleFilter || "all";
    uniqueFilterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    applyArticleFilters();
    const url = new URL(window.location.href);
    if (activeFilter === "all") url.searchParams.delete("tag"); else url.searchParams.set("tag", activeFilter);
    url.hash = "articles";
    window.history.replaceState({}, "", url);
  }));
  searchInput?.addEventListener("input", applyArticleFilters);
  applyArticleFilters();

  const resourceCards = [...document.querySelectorAll("[data-resource-card]")];
  const applyResourceSearch = () => {
    const query = (resourceSearch?.value || "").trim().toLowerCase();
    resourceCards.forEach((card) => {
      const text = activeLanguage === "ur" ? card.dataset.searchUr : card.dataset.searchEn;
      card.hidden = Boolean(query) && !(text || "").toLowerCase().includes(query);
    });
  };
  resourceSearch?.addEventListener("input", applyResourceSearch);
  const resourcesSection = document.querySelector("[data-resources-section]");
  const showAllButton = document.querySelector("[data-resource-show-all]");
  showAllButton?.addEventListener("click", () => {
    const expanded = resourcesSection?.classList.toggle("is-expanded") || false;
    showAllButton.querySelector('[data-lang="en"]').textContent = expanded ? "Show carousel" : "Show all";
    showAllButton.querySelector('[data-lang="ur"]').textContent = expanded ? "کیروسل دکھائیں" : "سب دکھائیں";
  });

  const articleBody = document.querySelector("[data-article-body]");
  const linkMetadataRequests = new Map();
  const linkMetadataCacheKey = "abk-rich-link-metadata-v1";
  const linkMetadataQueue = [];
  let activeLinkMetadataRequests = 0;
  let linkMetadataCache = {};
  try { linkMetadataCache = JSON.parse(localStorage.getItem(linkMetadataCacheKey) || "{}"); } catch { linkMetadataCache = {}; }

  const runLinkMetadataQueue = () => {
    while (activeLinkMetadataRequests < 2 && linkMetadataQueue.length) {
      const { task, resolve } = linkMetadataQueue.shift();
      activeLinkMetadataRequests += 1;
      task().then(resolve, () => resolve(null)).finally(() => {
        activeLinkMetadataRequests -= 1;
        runLinkMetadataQueue();
      });
    }
  };
  const scheduleLinkMetadata = (task) => new Promise((resolve) => {
    linkMetadataQueue.push({ task, resolve });
    runLinkMetadataQueue();
  });

  const storeLinkMetadata = (url, metadata) => {
    linkMetadataCache[url] = { time: Date.now(), metadata };
    linkMetadataCache = Object.fromEntries(Object.entries(linkMetadataCache)
      .sort(([, first], [, second]) => second.time - first.time)
      .slice(0, 40));
    try { localStorage.setItem(linkMetadataCacheKey, JSON.stringify(linkMetadataCache)); } catch { /* Cards still work without caching. */ }
  };

  const fetchLinkMetadata = (url) => {
    const cached = linkMetadataCache[url];
    if (cached && Date.now() - cached.time < 7 * 24 * 60 * 60 * 1000) return Promise.resolve(cached.metadata);
    if (linkMetadataRequests.has(url)) return linkMetadataRequests.get(url);
    const request = scheduleLinkMetadata(async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`, { signal: controller.signal });
        if (!response.ok) throw new Error(`Link preview request failed: ${response.status}`);
        const payload = await response.json();
        if (payload.status !== "success" || !payload.data) throw new Error("Link preview metadata was unavailable.");
        const data = payload.data;
        const cleanText = (value, length) => String(value || "").trim().slice(0, length);
        const cleanAssetUrl = (value) => {
          try { const asset = new URL(value); return /^https?:$/.test(asset.protocol) ? asset.href : ""; } catch { return ""; }
        };
        const image = cleanAssetUrl(typeof data.image === "string" ? data.image : data.image?.url);
        const logo = cleanAssetUrl(typeof data.logo === "string" ? data.logo : data.logo?.url);
        const metadata = {
          title: cleanText(data.title, 240),
          description: cleanText(data.description, 520),
          siteName: cleanText(data.publisher || data.siteName, 100),
          image,
          logo
        };
        storeLinkMetadata(url, metadata);
        return metadata;
      } finally { window.clearTimeout(timeout); }
    }).catch((error) => { console.warn("Rich link preview could not be loaded.", error); return null; });
    linkMetadataRequests.set(url, request);
    return request;
  };

  const addRichLinkImage = (media, source, className) => {
    if (!source) return;
    const image = document.createElement("img");
    image.className = className;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    image.addEventListener("load", () => media.classList.add("has-image"), { once: true });
    image.addEventListener("error", () => image.remove(), { once: true });
    image.src = source;
    media.append(image);
  };

  const applyRichLinkMetadata = (card, metadata) => {
    card.removeAttribute("aria-busy");
    if (!metadata) return;
    const title = card.querySelector("[data-rich-link-title]");
    const description = card.querySelector("[data-rich-link-description]");
    const siteName = card.querySelector("[data-rich-link-site]");
    const media = card.querySelector("[data-rich-link-media]");
    if (card.dataset.useMetadataTitle === "true" && metadata.title) title.textContent = metadata.title;
    if (metadata.description && !description.textContent.trim()) {
      description.textContent = metadata.description;
      description.hidden = false;
    }
    if (metadata.siteName) siteName.textContent = metadata.siteName;
    if (media && card.dataset.hasAuthoredImage !== "true") addRichLinkImage(media, metadata.image || metadata.logo, metadata.image ? "rich-link-card-image" : "rich-link-card-logo");
  };

  const createRichLinkCard = (sourceLink) => {
    let url;
    try { url = new URL(sourceLink.href, window.location.href); } catch { return null; }
    if (!/^https?:$/.test(url.protocol)) return null;
    const hostname = url.hostname.replace(/^www\./, "");
    const authoredImage = sourceLink.querySelector("img");
    const suppliedLabel = sourceLink.textContent.trim() || authoredImage?.alt?.trim() || "";
    const labelLooksLikeUrl = !suppliedLabel || /^https?:\/\//i.test(suppliedLabel) || suppliedLabel === sourceLink.href;
    const titleText = labelLooksLikeUrl ? hostname : suppliedLabel;

    const card = document.createElement("a");
    card.className = "rich-link-card";
    card.href = url.href;
    card.setAttribute("aria-busy", "true");
    card.dataset.useMetadataTitle = String(labelLooksLikeUrl);
    card.dataset.hasAuthoredImage = String(Boolean(authoredImage));
    if (sourceLink.target) card.target = sourceLink.target;
    if (sourceLink.rel) card.rel = sourceLink.rel;

    const media = document.createElement("span");
    media.className = "rich-link-card-media";
    media.dataset.richLinkMedia = "";
    const fallback = document.createElement("span");
    fallback.className = "rich-link-card-fallback";
    fallback.textContent = (hostname[0] || "↗").toUpperCase();
    media.append(fallback);
    if (authoredImage?.src) addRichLinkImage(media, authoredImage.src, "rich-link-card-image");

    const content = document.createElement("span");
    content.className = "rich-link-card-content";
    const site = document.createElement("span");
    site.className = "rich-link-card-site";
    site.dataset.richLinkSite = "";
    site.textContent = hostname;
    const title = document.createElement("strong");
    title.className = "rich-link-card-title";
    title.dataset.richLinkTitle = "";
    title.textContent = titleText;
    const description = document.createElement("span");
    description.className = "rich-link-card-description";
    description.dataset.richLinkDescription = "";
    description.textContent = sourceLink.title || "";
    description.hidden = !description.textContent;
    const action = document.createElement("span");
    action.className = "rich-link-card-action";
    action.innerHTML = '<span data-lang="en">Open link</span><span data-lang="ur">لنک کھولیں</span><span aria-hidden="true">↗</span>';
    content.append(site, title, description, action);
    card.append(media, content);
    return card;
  };

  const previewObserver = "IntersectionObserver" in window ? new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      fetchLinkMetadata(entry.target.href).then((metadata) => applyRichLinkMetadata(entry.target, metadata));
    });
  }, { rootMargin: "240px 0px" }) : null;

  const standaloneLinks = (paragraph) => {
    if (paragraph.tagName !== "P") return [];
    const allowed = [...paragraph.childNodes].every((node) => {
      if (node.nodeType === Node.TEXT_NODE) return !node.textContent.trim();
      if (node.nodeType === Node.COMMENT_NODE) return true;
      return node.nodeType === Node.ELEMENT_NODE && ["A", "BR"].includes(node.tagName);
    });
    if (!allowed) return [];
    const links = [...paragraph.children].filter((element) => element.tagName === "A");
    if (!links.length) return [];
    return links.every((link) => { try { return /^https?:$/.test(new URL(link.href, window.location.href).protocol); } catch { return false; } }) ? links : [];
  };

  const enhanceRichLinks = () => {
    articleBody?.querySelectorAll(":scope > [data-lang]").forEach((languageBody) => {
      let currentGrid = null;
      [...languageBody.children].forEach((block) => {
        const links = standaloneLinks(block);
        if (!links.length) { currentGrid = null; return; }
        if (!currentGrid) {
          currentGrid = document.createElement("div");
          currentGrid.className = "rich-link-grid";
          block.before(currentGrid);
        }
        links.forEach((link) => {
          const card = createRichLinkCard(link);
          if (!card) return;
          currentGrid.append(card);
          if (previewObserver) previewObserver.observe(card);
          else fetchLinkMetadata(card.href).then((metadata) => applyRichLinkMetadata(card, metadata));
        });
        block.remove();
      });
    });
  };
  window.ABKRichLinks?.enhance(articleBody);

  const readingProgress = document.querySelector("[data-reading-progress]");
  if (readingProgress && articleBody) {
    const updateProgress = () => {
      const top = articleBody.getBoundingClientRect().top + window.scrollY;
      const total = Math.max(articleBody.offsetHeight - window.innerHeight * .45, 1);
      const progress = Math.min(Math.max((window.scrollY - top + window.innerHeight * .25) / total, 0), 1);
      readingProgress.style.transform = `scaleX(${progress})`;
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  document.querySelector("[data-copy-link]")?.addEventListener("click", async () => {
    const labels = [...document.querySelectorAll("[data-copy-label]")];
    try {
      await navigator.clipboard.writeText(window.location.href);
      labels.forEach((label) => { label.textContent = label.dataset.lang === "ur" ? "لنک کاپی ہو گیا" : "Link copied"; });
      window.setTimeout(() => labels.forEach((label) => { label.textContent = label.dataset.lang === "ur" ? "مضمون کا لنک کاپی کریں" : "Copy article link"; }), 1800);
    } catch { window.prompt("Copy this article link:", window.location.href); }
  });

  const aqiLabels = (value) => {
    if (value <= 50) return { level: "good", en: "Good", ur: "اچھا" };
    if (value <= 100) return { level: "moderate", en: "Moderate", ur: "درمیانہ" };
    if (value <= 150) return { level: "sensitive", en: "Unhealthy for sensitive groups", ur: "حساس افراد کے لیے غیر صحت بخش" };
    if (value <= 200) return { level: "unhealthy", en: "Unhealthy", ur: "غیر صحت بخش" };
    if (value <= 300) return { level: "very-unhealthy", en: "Very unhealthy", ur: "بہت غیر صحت بخش" };
    return { level: "hazardous", en: "Hazardous", ur: "خطرناک" };
  };

  const initializeAqiWidget = (widget) => {
    const city = widget.querySelector("[data-aqi-city]");
    const reading = widget.querySelector("[data-aqi-reading]");
    const valueElement = widget.querySelector("[data-aqi-value]");
    const labelElement = widget.querySelector("[data-aqi-label]");
    const pm25 = widget.querySelector("[data-aqi-pm25]");
    const pm10 = widget.querySelector("[data-aqi-pm10]");
    if (!city || !reading || !valueElement || !labelElement) return;

    const setError = () => {
      valueElement.textContent = "—";
      labelElement.innerHTML = '<span data-lang="en">Reading unavailable</span><span data-lang="ur">ریڈنگ دستیاب نہیں</span>';
    };
    const render = (data) => {
      const current = data.current || {};
      const aqi = Math.round(Number(current.us_aqi));
      if (!Number.isFinite(aqi)) { setError(); return; }
      const label = aqiLabels(aqi);
      valueElement.textContent = String(aqi);
      labelElement.innerHTML = `<span data-lang="en">${label.en}</span><span data-lang="ur">${label.ur}</span>`;
      reading.dataset.level = label.level;
      pm25.textContent = Number.isFinite(Number(current.pm2_5)) ? `${Number(current.pm2_5).toFixed(1)} µg/m³` : "—";
      pm10.textContent = Number.isFinite(Number(current.pm10)) ? `${Number(current.pm10).toFixed(1)} µg/m³` : "—";
    };
    const load = async () => {
      const option = city.selectedOptions[0];
      const latitude = option.dataset.lat;
      const longitude = option.dataset.lon;
      const cacheKey = `abk-aqi-${city.value}`;
      try {
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
        if (cached && Date.now() - cached.time < 30 * 60 * 1000) { render(cached.data); return; }
      } catch { /* Ignore damaged cache. */ }
      valueElement.textContent = "…";
      try {
        const endpoint = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=us_aqi,pm2_5,pm10&timezone=auto`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`AQI request failed: ${response.status}`);
        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), data }));
        render(data);
      } catch (error) { console.warn(error); setError(); }
    };
    const storedCity = localStorage.getItem("abk-aqi-city");
    if (storedCity && [...city.options].some((option) => option.value === storedCity)) city.value = storedCity;
    city.addEventListener("change", () => { localStorage.setItem("abk-aqi-city", city.value); load(); });
    load();
  };

  document.querySelectorAll("[data-aqi-widget]").forEach(initializeAqiWidget);
  document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = String(new Date().getFullYear()); });
  initializeCarousels();
  setLanguage(activeLanguage);
})();
