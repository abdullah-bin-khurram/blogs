(() => {
  CMS.registerPreviewStyle("/blogs/assets/css/style.css");
  CMS.registerPreviewStyle("/blogs/admin/preview.css");

  const h = window.h;
  const createClass = window.createClass;
  const value = (entry, field, fallback = "") => entry.getIn(["data", field]) || fallback;

  const ArticlePreview = createClass({
    getInitialState() { return { language: "en" }; },
    componentDidMount() { this.scheduleRichLinks(); },
    componentDidUpdate() { this.scheduleRichLinks(); },
    componentWillUnmount() {
      const view = this.previewBody?.ownerDocument.defaultView || window;
      if (this.richLinkFrame) view.cancelAnimationFrame(this.richLinkFrame);
    },
    scheduleRichLinks() {
      const view = this.previewBody?.ownerDocument.defaultView || window;
      if (this.richLinkFrame) view.cancelAnimationFrame(this.richLinkFrame);
      this.richLinkFrame = view.requestAnimationFrame(() => {
        window.ABKRichLinks?.enhance(this.previewBody);
        this.richLinkFrame = 0;
      });
    },
    render() {
      const entry = this.props.entry;
      const urdu = this.state.language === "ur";
      const title = value(entry, urdu ? "title_ur" : "title", urdu ? "اردو عنوان" : "English article title");
      const description = value(entry, urdu ? "description_ur" : "description", urdu ? "اردو تعارف یہاں ظاہر ہوگا۔" : "Article description will appear here.");
      const author = value(entry, urdu ? "author_ur" : "author", urdu ? "عبداللہ بن خرم" : "Abdullah Bin Khurram");
      const category = value(entry, "category", "category");
      const readTime = value(entry, "read_time", 5);
      const tagsValue = value(entry, urdu ? "tags_ur" : "tags", []);
      const tags = typeof tagsValue.toJS === "function" ? tagsValue.toJS() : tagsValue;
      const image = value(entry, "image");
      let imageUrl = "";
      try { imageUrl = image ? this.props.getAsset(image).toString() : ""; } catch { imageUrl = ""; }

      return h("div", { className: `cms-preview-page ${urdu ? "is-urdu" : ""}`, dir: urdu ? "rtl" : "ltr" }, [
        h("header", { className: "cms-preview-header", key: "header" }, [
          h("div", { className: "cms-preview-brand", key: "brand" }, [
            h("img", { src: "/blogs/assets/images/portal-pic.webp", alt: "", key: "logo" }),
            h("strong", { key: "name" }, "ABK Lung Health Education Portal")
          ]),
          h("div", { className: "cms-language-buttons", key: "buttons" }, [
            h("button", { type: "button", className: urdu ? "" : "is-active", onClick: () => this.setState({ language: "en" }), key: "en" }, "EN"),
            h("button", { type: "button", className: urdu ? "is-active" : "", onClick: () => this.setState({ language: "ur" }), key: "ur" }, "اردو")
          ])
        ]),
        h("article", { className: "cms-preview-article", key: "article" }, [
          h("div", { className: "article-meta-top", key: "meta" }, [
            h("span", { className: "category-pill", key: "category" }, category),
            h("span", { key: "time" }, `${readTime} ${urdu ? "منٹ" : "min read"}`)
          ]),
          h("h1", { key: "title" }, title),
          h("p", { className: "article-deck", key: "description" }, description),
          h("div", { className: "cms-preview-author", key: "author" }, author),
          h("div", { className: "cms-preview-visual", key: "visual" }, imageUrl
            ? h("img", { src: imageUrl, alt: value(entry, urdu ? "image_alt_ur" : "image_alt", title) })
            : h("img", { src: "/blogs/assets/images/portal-pic.webp", alt: "" })),
          h("div", { className: "cms-preview-content", key: "content" }, [
            h("div", { className: "prose cms-preview-prose", key: "body", ref: (node) => { this.previewBody = node; } }, this.props.widgetFor(urdu ? "body_ur" : "body")),
            h("aside", { className: "cms-preview-details", key: "details" }, [
              h("strong", { key: "topics" }, urdu ? "موضوعات" : "Topics"),
              h("div", { className: "tag-list", key: "tags" }, (tags || []).map((tag, index) => h("span", { key: `${tag}-${index}` }, tag)))
            ])
          ])
        ])
      ]);
    }
  });

  const escapeMarkdownLinkPipes = (markdown) => String(markdown || "").replace(
    /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+(?:\s+"[^"]*")?)\)/g,
    (match, label, destination) => label.includes("|")
      ? `[${label.replace(/(^|[^\\])\|/g, "$1\\|")}](${destination})`
      : match
  );

  CMS.registerEventListener({
    name: "preSave",
    handler: ({ entry }) => {
      let data = entry.get("data");
      ["body", "body_ur"].forEach((field) => {
        const value = data.get(field);
        if (typeof value === "string") data = data.set(field, escapeMarkdownLinkPipes(value));
      });
      return data;
    }
  });

  CMS.registerPreviewTemplate("posts", ArticlePreview);
})();
