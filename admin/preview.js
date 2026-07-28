(() => {
  /*
   * Apply the public website stylesheet inside
   * Decap's isolated preview iframe.
   */
  CMS.registerPreviewStyle(
    "/blogs/assets/css/style.css"
  );

  /*
   * Preview-specific adjustments.
   * This file is loaded after the main stylesheet.
   */
  CMS.registerPreviewStyle(
    "/blogs/admin/preview.css"
  );

  const h = window.h;
  const createClass = window.createClass;

  function getValue(entry, field, fallback = "") {
    const value = entry.getIn(["data", field]);

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return fallback;
    }

    return value;
  }

  function formatDate(value) {
    if (!value) {
      return "Publication date";
    }

    const date =
      value instanceof Date
        ? value
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    ).format(date);
  }

  function getTags(entry) {
    const value = entry.getIn(["data", "tags"]);

    if (!value) {
      return [];
    }

    if (typeof value.toJS === "function") {
      return value.toJS();
    }

    if (Array.isArray(value)) {
      return value;
    }

    return [];
  }

  function getImageUrl(getAsset, image) {
    if (!image) {
      return "";
    }

    try {
      const asset = getAsset(image);

      return asset
        ? asset.toString()
        : "";
    } catch (error) {
      console.warn(
        "Could not resolve preview image:",
        error
      );

      return "";
    }
  }

  function createFallbackLungArt() {
    return h(
      "div",
      {
        className: "preview-lung-art",
        "aria-hidden": "true"
      },
      [
        h("div", {
          className:
            "preview-breath-ring preview-ring-one",
          key: "ring-one"
        }),

        h("div", {
          className:
            "preview-breath-ring preview-ring-two",
          key: "ring-two"
        }),

        h(
          "div",
          {
            className: "preview-lung-symbol",
            key: "lungs"
          },
          [
            h("span", {
              className: "preview-trachea",
              key: "trachea"
            }),

            h("span", {
              className:
                "preview-lung preview-lung-left",
              key: "left-lung"
            }),

            h("span", {
              className:
                "preview-lung preview-lung-right",
              key: "right-lung"
            }),

            h("span", {
              className:
                "preview-leaf preview-leaf-left",
              key: "left-leaf"
            }),

            h("span", {
              className:
                "preview-leaf preview-leaf-right",
              key: "right-leaf"
            })
          ]
        ),

        h(
          "div",
          {
            className: "preview-art-caption",
            key: "caption"
          },
          [
            h("span", {
              className: "preview-pulse-dot",
              key: "dot"
            }),

            h(
              "strong",
              { key: "text" },
              "Pause. Inhale. Learn."
            )
          ]
        )
      ]
    );
  }

  const PostPreview = createClass({
    render() {
      const entry = this.props.entry;
      const widgetFor = this.props.widgetFor;
      const getAsset = this.props.getAsset;

      const title = getValue(
        entry,
        "title",
        "Your article title"
      );

      const description = getValue(
        entry,
        "description",
        "Your article description will appear here."
      );

      const author = getValue(
        entry,
        "author",
        "Abdullah Bin Khurram"
      );

      const category = getValue(
        entry,
        "category",
        "Lung wellbeing"
      );

      const readTime = getValue(
        entry,
        "read_time",
        5
      );

      const date = formatDate(
        getValue(entry, "date")
      );

      const image = getValue(
        entry,
        "image"
      );

      const imageAlt = getValue(
        entry,
        "image_alt",
        title
      );

      const imageUrl = getImageUrl(
        getAsset,
        image
      );

      const tags = getTags(entry);

      const visual = imageUrl
        ? h(
            "img",
            {
              src: imageUrl,
              alt: imageAlt
            }
          )
        : createFallbackLungArt();

      const tagElements = tags.map(
        (tag, index) =>
          h(
            "span",
            {
              key: `${tag}-${index}`
            },
            tag
          )
      );

      return h(
        "div",
        {
          className: "cms-preview-page"
        },
        [
          /*
           * Small preview-only brand header.
           */
          h(
            "header",
            {
              className: "cms-preview-header",
              key: "preview-header"
            },
            h(
              "div",
              {
                className:
                  "cms-preview-header-inner"
              },
              [
                h(
                  "div",
                  {
                    className:
                      "cms-preview-brand",
                    key: "brand"
                  },
                  [
                    h("img", {
                      src:
                        "/blogs/assets/images/logo.svg",
                      alt: "",
                      key: "logo"
                    }),

                    h(
                      "div",
                      { key: "brand-copy" },
                      [
                        h(
                          "strong",
                          { key: "name" },
                          "Lung Health Journal"
                        ),

                        h(
                          "span",
                          { key: "author" },
                          "Article preview"
                        )
                      ]
                    )
                  ]
                ),

                h(
                  "span",
                  {
                    className:
                      "cms-preview-badge",
                    key: "badge"
                  },
                  "Live editor preview"
                )
              ]
            )
          ),

          h(
            "article",
            {
              className:
                "article-wrap cms-article-preview",
              key: "article"
            },
            [
              h(
                "header",
                {
                  className: "article-hero",
                  key: "hero"
                },
                h(
                  "div",
                  {
                    className:
                      "container article-hero-inner"
                  },
                  [
                    h(
                      "div",
                      {
                        className:
                          "article-heading",
                        key: "heading"
                      },
                      [
                        h(
                          "div",
                          {
                            className:
                              "article-meta-top",
                            key: "meta"
                          },
                          [
                            h(
                              "span",
                              {
                                className:
                                  "category-pill",
                                key: "category"
                              },
                              category
                            ),

                            h(
                              "span",
                              { key: "date" },
                              date
                            ),

                            h(
                              "span",
                              { key: "read-time" },
                              `${readTime} min read`
                            )
                          ]
                        ),

                        h(
                          "h1",
                          { key: "title" },
                          title
                        ),

                        h(
                          "p",
                          {
                            className:
                              "article-deck",
                            key: "description"
                          },
                          description
                        ),

                        h(
                          "div",
                          {
                            className:
                              "article-byline",
                            key: "byline"
                          },
                          [
                            h(
                              "div",
                              {
                                className:
                                  "author-avatar",
                                "aria-hidden":
                                  "true",
                                key: "avatar"
                              },
                              "AK"
                            ),

                            h(
                              "div",
                              {
                                key:
                                  "author-details"
                              },
                              [
                                h(
                                  "strong",
                                  {
                                    key:
                                      "author-name"
                                  },
                                  author
                                ),

                                h(
                                  "span",
                                  {
                                    key:
                                      "author-role"
                                  },
                                  "Author, Lung Health Journal"
                                )
                              ]
                            )
                          ]
                        )
                      ]
                    ),

                    h(
                      "div",
                      {
                        className:
                          imageUrl
                            ? "article-visual has-image"
                            : "article-visual",
                        key: "visual"
                      },
                      visual
                    )
                  ]
                )
              ),

              h(
                "div",
                {
                  className:
                    "container article-content-grid",
                  key: "content"
                },
                [
                  h(
                    "aside",
                    {
                      className:
                        "article-aside",
                      "aria-label":
                        "Article details",
                      key: "aside"
                    },
                    h(
                      "div",
                      {
                        className:
                          "aside-card"
                      },
                      [
                        h(
                          "span",
                          {
                            className:
                              "eyebrow",
                            key:
                              "aside-heading"
                          },
                          "In this article"
                        ),

                        tags.length
                          ? h(
                              "div",
                              {
                                className:
                                  "tag-list",
                                key: "tags"
                              },
                              tagElements
                            )
                          : h(
                              "div",
                              {
                                className:
                                  "tag-list preview-empty-tags",
                                key: "no-tags"
                              },
                              h(
                                "span",
                                null,
                                "Add article tags"
                              )
                            ),

                        h(
                          "div",
                          {
                            className:
                              "preview-category-note",
                            key:
                              "category-note"
                          },
                          [
                            h(
                              "span",
                              {
                                className:
                                  "eyebrow",
                                key: "label"
                              },
                              "Category"
                            ),

                            h(
                              "strong",
                              {
                                key: "value"
                              },
                              category
                            )
                          ]
                        )
                      ]
                    )
                  ),

                  h(
                    "div",
                    {
                      className:
                        "prose cms-preview-prose",
                      key: "body"
                    },
                    widgetFor("body")
                  )
                ]
              )
            ]
          )
        ]
      );
    }
  });

  /*
   * "posts" must match the collection name
   * in admin/config.yml.
   */
  CMS.registerPreviewTemplate(
    "posts",
    PostPreview
  );
})();