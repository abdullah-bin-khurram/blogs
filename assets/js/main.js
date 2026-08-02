(() => {
  const root = document.documentElement;
  const body = document.body;
  const languageButtons = [...document.querySelectorAll("[data-language-button]")];
  const preferredLanguage = localStorage.getItem("abk-portal-language") || "en";
  let activeLanguage = preferredLanguage === "ur" ? "ur" : "en";

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
    refreshLanguageDependentViews();
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

  const initializeCarousels = () => {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      const track = carousel.querySelector("[data-carousel-track]");
      const previous = carousel.querySelector("[data-carousel-prev]");
      const next = carousel.querySelector("[data-carousel-next]");
      if (!track) return;
      const move = (direction) => track.scrollBy({ left: direction * Math.max(track.clientWidth * .82, 260), behavior: "smooth" });
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
  uniqueFilterButtons.forEach((button) => button.addEventListener("click", () => {
    activeFilter = button.dataset.articleFilter || "all";
    uniqueFilterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    applyArticleFilters();
  }));
  searchInput?.addEventListener("input", applyArticleFilters);

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

  const readingProgress = document.querySelector("[data-reading-progress]");
  const articleBody = document.querySelector("[data-article-body]");
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
