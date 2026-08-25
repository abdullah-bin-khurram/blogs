# ABK Lung Health Education Portal

A bilingual Jekyll portal for lung-health articles, downloadable resources, appointments, and configurable sidebar tools.

## Publishing

In the GitHub repository, open **Settings → Pages** and set the source to **GitHub Actions**. The workflow in `.github/workflows/pages.yml` validates content, optionally refreshes the popular-article ranking, builds Jekyll, and deploys the Pages artifact.

The workflow deploys without Analytics reporting credentials. Until they are configured, the Top Articles carousel falls back to newest-first ordering.

## GA4 article ranking

Add these repository settings under **Settings → Secrets and variables → Actions**:

- Secret `GA4_PROPERTY_ID`: the numeric GA4 property ID.
- Secret `GA4_CREDENTIALS_B64`: a base64-encoded Google service-account JSON key with Viewer access to the property.

The scheduled workflow queries the preceding 30 completed days and ranks article paths by `screenPageViews` once per day.

## Content rules

- Category slugs are unique, lowercase identifiers. Treat them as immutable.
- A category cannot be removed while an article references its slug; the validation step will block deployment.
- Category display-order values must be unique positive integers.
- Each article requires English and Urdu titles, descriptions, author names, and bodies.
- English and Urdu tag lists must contain the same number of entries in matching order.
- Editors can select up to three related articles. If none are selected, the site chooses tag matches first and fills any remaining positions with recent articles.
- Resource files are committed under `downloads/`, excluded from the Pages artifact, and linked from their GitHub-hosted source.
- Custom widget HTML is rendered in a sandboxed iframe. The widget list, count, order, and enabled state are controlled from Decap CMS; widgets sit beneath the left navigation and remain inside the mobile menu.

Run the local content checks with:

```powershell
node scripts/validate-content.mjs
node --check assets/js/main.js
```
