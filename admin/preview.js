(() => {
  CMS.registerPreviewStyle("/blogs/assets/css/style.css");
  CMS.registerPreviewStyle("/blogs/admin/preview.css");

  const h = window.h;
  const createClass = window.createClass;
  const value = (entry, field, fallback = "") => entry.getIn(["data", field]) || fallback;

  const ArticlePreview = createClass({
    getInitialState() { return { language: "en" }; },
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
          h("div", { className: "cms-preview-visual", key: "visual" }, imageUrl
            ? h("img", { src: imageUrl, alt: value(entry, urdu ? "image_alt_ur" : "image_alt", title) })
            : h("img", { src: "/blogs/assets/images/portal-pic.webp", alt: "" })),
          h("div", { className: "cms-preview-details", key: "details" }, [
            h("strong", { key: "author" }, author),
            h("div", { className: "tag-list", key: "tags" }, (tags || []).map((tag, index) => h("span", { key: `${tag}-${index}` }, tag)))
          ]),
          h("div", { className: "prose cms-preview-prose", key: "body" }, this.props.widgetFor(urdu ? "body_ur" : "body"))
        ])
      ]);
    }
  });

  CMS.registerPreviewTemplate("posts", ArticlePreview);
})();
