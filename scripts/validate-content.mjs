import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const readFrontMatter = async (file) => {
  const source = await readFile(file, "utf8");
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  return { source, frontMatter: match?.[1] || "" };
};
const field = (frontMatter, name) => frontMatter.match(new RegExp(`^${name}:\\s*["']?([^\\r\\n"']+)`, "m"))?.[1]?.trim();
const listField = (frontMatter, name) => {
  const lines = frontMatter.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${name}:`);
  if (start < 0) return [];
  const values = [];
  for (const line of lines.slice(start + 1)) {
    const item = line.match(/^\s+-\s+(.+)$/);
    if (item) values.push(item[1].trim().replace(/^(["'])(.*)\1$/, "$2"));
    else if (/^\S/.test(line) && line.trim()) break;
  }
  return values;
};
const requireField = (frontMatter, name, file, errors) => {
  if (!new RegExp(`^${name}:`, "m").test(frontMatter)) errors.push(`${file}: missing ${name}`);
};

const categoryDirectory = "_data/categories";
const categoryFiles = (await readdir(categoryDirectory)).filter((name) => /\.ya?ml$/i.test(name));
const categorySlugs = new Set();
const categoryOrders = new Set();
const errors = [];

for (const name of categoryFiles) {
  const source = await readFile(path.join(categoryDirectory, name), "utf8");
  const slug = field(source, "slug");
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`${name}: invalid category slug`);
  else if (categorySlugs.has(slug)) errors.push(`${name}: duplicate category slug ${slug}`);
  else categorySlugs.add(slug);
  for (const required of ["name_en", "name_ur", "order"]) requireField(source, required, name, errors);
  const order = Number(field(source, "order"));
  if (!Number.isInteger(order) || order < 1) errors.push(`${name}: category order must be a positive integer`);
  else if (categoryOrders.has(order)) errors.push(`${name}: duplicate category order ${order}`);
  else categoryOrders.add(order);
}

const postFiles = (await readdir("_posts")).filter((name) => /\.md$/i.test(name));
const posts = await Promise.all(postFiles.map(async (name) => {
  const { source, frontMatter } = await readFrontMatter(path.join("_posts", name));
  const filenameSlug = name.replace(/\.md$/i, "");
  const jekyllSlug = filenameSlug.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  return { name, source, frontMatter, filenameSlug, jekyllSlug };
}));
const availablePostKeys = new Set(posts.flatMap(({ filenameSlug, jekyllSlug }) => [filenameSlug, jekyllSlug]));

for (const { name, source, frontMatter, filenameSlug, jekyllSlug } of posts) {
  const category = field(frontMatter, "category");
  if (!categorySlugs.has(category)) errors.push(`${name}: category '${category || "missing"}' does not exist`);
  for (const required of ["title", "title_ur", "description", "description_ur", "author", "author_ur", "body_ur"]) requireField(frontMatter, required, name, errors);
  const englishTags = listField(frontMatter, "tags");
  const urduTags = listField(frontMatter, "tags_ur");
  if (englishTags.length !== urduTags.length) errors.push(`${name}: English and Urdu tag counts must match`);
  const relatedArticles = listField(frontMatter, "related_articles");
  if (relatedArticles.length > 3) errors.push(`${name}: related_articles must contain at most three articles`);
  if (new Set(relatedArticles).size !== relatedArticles.length) errors.push(`${name}: related_articles contains duplicate entries`);
  for (const relatedArticle of relatedArticles) {
    if (!availablePostKeys.has(relatedArticle)) errors.push(`${name}: related article '${relatedArticle}' does not exist`);
    if (relatedArticle === filenameSlug || relatedArticle === jekyllSlug) errors.push(`${name}: an article cannot relate to itself`);
  }
  if (!source.replace(/^---[\s\S]*?---/, "").trim()) errors.push(`${name}: missing English article body`);
}

if (errors.length) {
  console.error(`Content validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`Validated ${categorySlugs.size} categories and ${postFiles.length} bilingual articles.`);
