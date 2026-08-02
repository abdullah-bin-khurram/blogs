import { mkdir, writeFile } from "node:fs/promises";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA4_PROPERTY_ID;
if (!propertyId) {
  console.log("GA4_PROPERTY_ID is not configured; keeping the default article order.");
  process.exit(0);
}

const client = new BetaAnalyticsDataClient();
const [report] = await client.runReport({
  property: `properties/${propertyId}`,
  dateRanges: [{ startDate: "30daysAgo", endDate: "yesterday" }],
  dimensions: [{ name: "pagePath" }],
  metrics: [{ name: "screenPageViews" }],
  dimensionFilter: {
    filter: {
      fieldName: "pagePath",
      stringFilter: { matchType: "BEGINS_WITH", value: "/blogs/articles/" }
    }
  },
  orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  limit: 24
});

const seen = new Set();
const articles = [];
for (const row of report.rows || []) {
  const reportedPath = row.dimensionValues?.[0]?.value || "";
  const normalizedPath = reportedPath.replace(/^\/blogs/, "").replace(/\?.*$/, "");
  if (!normalizedPath.startsWith("/articles/") || seen.has(normalizedPath)) continue;
  seen.add(normalizedPath);
  articles.push({
    url: normalizedPath,
    views: Number(row.metricValues?.[0]?.value || 0),
    rank: articles.length + 1
  });
}

await mkdir("_data", { recursive: true });
await writeFile("_data/top_articles.json", `${JSON.stringify({
  generated_at: new Date().toISOString(),
  window: "30daysAgo to yesterday",
  articles
}, null, 2)}\n`);

console.log(`Wrote ${articles.length} ranked article paths.`);
