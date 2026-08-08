(() => {
  const metadataRequests = new Map();
  const metadataQueue = [];
  const cacheKey = "abk-rich-link-metadata-v2";
  let activeRequests = 0;
  let metadataCache = {};
  try { metadataCache = JSON.parse(localStorage.getItem(cacheKey) || "{}"); } catch { metadataCache = {}; }

  const runQueue = () => {
    while (activeRequests < 2 && metadataQueue.length) {
      const { task, resolve } = metadataQueue.shift();
      activeRequests += 1;
      task().then(resolve, () => resolve(null)).finally(() => {
        activeRequests -= 1;
        runQueue();
      });
    }
  };

  const schedule = (task) => new Promise((resolve) => {
    metadataQueue.push({ task, resolve });
    runQueue();
  });

  const storeMetadata = (key, metadata) => {
    metadataCache[key] = { time: Date.now(), metadata };
    metadataCache = Object.fromEntries(Object.entries(metadataCache)
      .sort(([, first], [, second]) => second.time - first.time)
      .slice(0, 40));
    try { localStorage.setItem(cacheKey, JSON.stringify(metadataCache)); } catch { /* Cards still work without caching. */ }
  };

  const cleanAssetUrl = (value) => {
    try {
      const asset = new URL(value);
      return /^https?:$/.test(asset.protocol) ? asset.href : "";
    } catch { return ""; }
  };

  const fetchMetadata = (url, kind) => {
    const requestKey = `${kind}:${url}`;
    const cached = metadataCache[requestKey];
    if (cached && Date.now() - cached.time < 7 * 24 * 60 * 60 * 1000) return Promise.resolve(cached.metadata);
    if (metadataRequests.has(requestKey)) return metadataRequests.get(requestKey);

    const request = schedule(async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 10000);
      try {
        const endpoint = new URL("https://api.microlink.io");
        endpoint.searchParams.set("url", url);
        if (kind === "document") endpoint.searchParams.set("screenshot", "true");
        const response = await fetch(endpoint, { signal: controller.signal });
        if (!response.ok) throw new Error(`Link preview request failed: ${response.status}`);
        const payload = await response.json();
        if (payload.status !== "success" || !payload.data) throw new Error("Link preview metadata was unavailable.");
        const data = payload.data;
        const cleanText = (value, length) => String(value || "").trim().slice(0, length);
        const image = cleanAssetUrl(typeof data.image === "string" ? data.image : data.image?.url);
        const logo = cleanAssetUrl(typeof data.logo === "string" ? data.logo : data.logo?.url);
        const screenshot = cleanAssetUrl(typeof data.screenshot === "string" ? data.screenshot : data.screenshot?.url);
        const metadata = {
          title: cleanText(data.title, 240),
          description: cleanText(data.description, 520),
          siteName: cleanText(data.publisher || data.siteName, 100),
          image: screenshot || image || logo,
          imageType: screenshot || image ? "image" : "logo"
        };
        storeMetadata(requestKey, metadata);
        return metadata;
      } finally { window.clearTimeout(timeout); }
    }).catch((error) => { console.warn("Rich link preview could not be loaded.", error); return null; });
    metadataRequests.set(requestKey, request);
    return request;
  };

  const youtubeVideoId = (url) => {
    const host = url.hostname.replace(/^www\./, "");
    let id = "";
    if (host === "youtu.be") id = url.pathname.split("/").filter(Boolean)[0] || "";
    if (["youtube.com", "m.youtube.com"].includes(host)) {
      id = url.searchParams.get("v") || "";
      if (!id) {
        const parts = url.pathname.split("/").filter(Boolean);
        if (["embed", "shorts", "live"].includes(parts[0])) id = parts[1] || "";
      }
    }
    return /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : "";
  };

  const googleDriveFileId = (url) => {
    if (url.hostname !== "drive.google.com") return "";
    return url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get("id") || "";
  };

  const addImage = (media, source, className, onError) => {
    if (!source) return;
    const doc = media.ownerDocument;
    const image = doc.createElement("img");
    image.className = className;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.referrerPolicy = "no-referrer";
    image.addEventListener("load", () => media.classList.add("has-image"), { once: true });
    image.addEventListener("error", () => { image.remove(); onError?.(); }, { once: true });
    image.src = source;
    media.append(image);
  };

  const applyMetadata = (card, metadata) => {
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
    card.classList.toggle(
      "has-description",
      Boolean(description.textContent.trim())
    );
    if (metadata.siteName) siteName.textContent = metadata.siteName;
    if (media && metadata.image && card.dataset.hasAuthoredImage !== "true" && card.dataset.lockPreviewImage !== "true") {
      media.querySelectorAll(".rich-link-card-image,.rich-link-card-logo").forEach((image) => image.remove());
      media.classList.remove("has-image");
      addImage(media, metadata.image, metadata.imageType === "logo" ? "rich-link-card-logo" : "rich-link-card-image");
    }
  };

  const createCard = (sourceLink) => {
    let url;
    try { url = new URL(sourceLink.href, sourceLink.ownerDocument.location.href); } catch { return null; }
    if (!/^https?:$/.test(url.protocol)) return null;
    const doc = sourceLink.ownerDocument;
    const hostname = url.hostname.replace(/^www\./, "");
    const authoredImage = sourceLink.querySelector("img");
    const suppliedLabel = sourceLink.textContent.trim() || authoredImage?.alt?.trim() || "";
    const labelLooksLikeUrl = !suppliedLabel || /^https?:\/\//i.test(suppliedLabel) || suppliedLabel === sourceLink.href;
    const titleText = labelLooksLikeUrl ? hostname : suppliedLabel;
    const videoId = youtubeVideoId(url);
    const driveId = googleDriveFileId(url);
    const isDocument = Boolean(driveId || /\.pdf(?:$|[?#])/i.test(url.href) || /\.pdf\b/i.test(suppliedLabel));

    const card = doc.createElement("a");
    card.className = "rich-link-card";
    card.href = url.href;
    card.setAttribute("aria-busy", "true");
    card.dataset.useMetadataTitle = String(labelLooksLikeUrl);
    card.dataset.hasAuthoredImage = String(Boolean(authoredImage));
    card.dataset.lockPreviewImage = String(Boolean(authoredImage || videoId));
    card.dataset.previewKind = isDocument ? "document" : "page";
    if (sourceLink.target) card.target = sourceLink.target;
    if (sourceLink.rel) card.rel = sourceLink.rel;
    if (sourceLink.download) card.download = sourceLink.download;

    const media = doc.createElement("span");
    media.className = "rich-link-card-media";
    media.dataset.richLinkMedia = "";
    const fallback = doc.createElement("span");
    fallback.className = "rich-link-card-fallback";
    fallback.textContent = (hostname[0] || "↗").toUpperCase();
    media.append(fallback);
    if (authoredImage?.src) addImage(media, authoredImage.src, "rich-link-card-image");
    else if (videoId) addImage(media, `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`, "rich-link-card-image", () => { card.dataset.lockPreviewImage = "false"; });
    else if (driveId) addImage(media, `https://drive.google.com/thumbnail?id=${encodeURIComponent(driveId)}&sz=w1200`, "rich-link-card-image");

    const content = doc.createElement("span");
    content.className = "rich-link-card-content";
    const site = doc.createElement("span");
    site.className = "rich-link-card-site";
    site.dataset.richLinkSite = "";
    site.textContent = hostname;
    const title = doc.createElement("strong");
    title.className = "rich-link-card-title";
    title.dataset.richLinkTitle = "";
    title.textContent = titleText;
    const description = doc.createElement("span");
    description.className = "rich-link-card-description";
    description.dataset.richLinkDescription = "";
    description.textContent = sourceLink.title || "";
    description.hidden = !description.textContent;
    card.classList.toggle(
      "has-description",
      Boolean(description.textContent.trim())
    );
    const action = doc.createElement("span");
    action.className = "rich-link-card-action";
    action.innerHTML = '<span data-lang="en">Open link</span><span data-lang="ur">لنک کھولیں</span><span aria-hidden="true">↗</span>';
    content.append(site, title, description, action);
    card.append(media, content);
    return card;
  };

  const standaloneLinks = (paragraph) => {
    if (paragraph.tagName !== "P") return [];
    const allowed = [...paragraph.childNodes].every((node) => {
      if (node.nodeType === 3) return !node.textContent.trim();
      if (node.nodeType === 8) return true;
      return node.nodeType === 1 && ["A", "BR"].includes(node.tagName);
    });
    if (!allowed) return [];
    const links = [...paragraph.children].filter((element) => element.tagName === "A");
    if (!links.length) return [];
    return links.every((link) => { try { return /^https?:$/.test(new URL(link.href, link.ownerDocument.location.href).protocol); } catch { return false; } }) ? links : [];
  };

  const layoutGrid = (grid) => {
    const cards = [...grid.querySelectorAll(".rich-link-card")];
    const rowSizes = [];
    let remaining = cards.length;

    while (remaining > 0) {
      // Avoid leaving one card alone: 4 becomes 2+2,
      // 7 becomes 3+2+2, 10 becomes 3+3+2+2, etc.
      if (remaining === 4) {
        rowSizes.push(2, 2);
        break;
      }

      const rowSize = Math.min(3, remaining);
      rowSizes.push(rowSize);
      remaining -= rowSize;
    }

    grid.replaceChildren();

    let cardIndex = 0;

    rowSizes.forEach((rowSize) => {
      const row = grid.ownerDocument.createElement("div");
      row.className = `rich-link-row cards-${rowSize}`;
      row.append(...cards.slice(cardIndex, cardIndex + rowSize));
      grid.append(row);
      cardIndex += rowSize;
    });
  };

  const enhanceContainer = (container, observer) => {
    let currentGrid = null;

    [...container.children].forEach((block) => {
      const links = standaloneLinks(block);

      if (!links.length) {
        currentGrid = null;
        return;
      }

      if (!currentGrid) {
        currentGrid = container.ownerDocument.createElement("div");
        currentGrid.className = "rich-link-grid";
        block.before(currentGrid);
      }

      links.forEach((link) => {
        const card = createCard(link);
        if (!card) return;

        currentGrid.append(card);

        if (observer) {
          observer.observe(card);
        } else {
          fetchMetadata(card.href, card.dataset.previewKind)
            .then((metadata) => applyMetadata(card, metadata));
        }
      });

      layoutGrid(currentGrid);
      block.remove();
    });
};

  const enhance = (root) => {
    if (!root) return;
    const view = root.ownerDocument.defaultView || window;
    const observer = "IntersectionObserver" in view ? new view.IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        instance.unobserve(entry.target);
        fetchMetadata(entry.target.href, entry.target.dataset.previewKind).then((metadata) => applyMetadata(entry.target, metadata));
      });
    }, { rootMargin: "240px 0px" }) : null;
    const languageContainers = [...root.querySelectorAll(":scope > [data-lang]")];
    (languageContainers.length ? languageContainers : [root]).forEach((container) => enhanceContainer(container, observer));
  };

  window.ABKRichLinks = { enhance };
})();
