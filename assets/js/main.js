(() => {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen =
        menuButton.getAttribute("aria-expanded") === "true";

      menuButton.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      nav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  const searchInput =
    document.querySelector("[data-search-input]");

  const filterButtons = [
    ...document.querySelectorAll("[data-filter]")
  ];

  const cards = [
    ...document.querySelectorAll("[data-post-card]")
  ];

  const emptyState =
    document.querySelector("[data-empty-state]");

  let activeFilter = "all";

  const applyFilters = () => {
    if (!cards.length) {
      return;
    }

    const query = (searchInput?.value || "")
      .trim()
      .toLowerCase();

    let visibleCount = 0;

    cards.forEach((card) => {
      const matchesCategory =
        activeFilter === "all" ||
        card.dataset.category === activeFilter;

      const matchesSearch =
        !query ||
        (card.dataset.search || "").includes(query);

      const visible =
        matchesCategory && matchesSearch;

      card.hidden = !visible;

      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        item.classList.toggle(
          "is-active",
          item === button
        );
      });

      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);

  const progressBar =
    document.querySelector("[data-reading-progress]");

  const articleBody =
    document.querySelector("[data-article-body]");

  if (progressBar && articleBody) {
    const updateProgress = () => {
      const articleTop =
        articleBody.getBoundingClientRect().top +
        window.scrollY;

      const articleHeight =
        articleBody.offsetHeight;

      const viewportHeight =
        window.innerHeight;

      const distance =
        window.scrollY -
        articleTop +
        viewportHeight * 0.25;

      const total = Math.max(
        articleHeight - viewportHeight * 0.45,
        1
      );

      const progress = Math.min(
        Math.max(distance / total, 0),
        1
      );

      progressBar.style.transform =
        `scaleX(${progress})`;
    };

    updateProgress();

    window.addEventListener(
      "scroll",
      updateProgress,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      updateProgress
    );
  }

  const copyButton =
    document.querySelector("[data-copy-link]");

  const copyLabel =
    document.querySelector("[data-copy-label]");

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      if (copyLabel) {
        copyLabel.textContent = "Link copied";
      }

      window.setTimeout(() => {
        if (copyLabel) {
          copyLabel.textContent =
            "Copy article link";
        }
      }, 1800);
    } catch {
      window.prompt(
        "Copy this article link:",
        window.location.href
      );
    }
  });
})();