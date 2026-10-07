# SouthernGent Roofing & Gutters — site handoff notes

Astro static site for southerngentroofing.com. Same stack and workflow as southerngent-construction:
GitHub repo -> Cloudflare Workers (static assets) auto-build on push. All edits by Claude via the GitHub connector.

## Separate business, separate everything (SEO intent)
This is a distinct business from SouthernGent Construction, under the same SouthernGent parent. Keep it that way in
everything a search engine or AI engine can see:
- Own repo, own Cloudflare Worker, own domain. Nothing is served from or fetched from the construction domain, ever (no hotlinked images, fonts, CSS). Fonts come straight from Google Fonts and are stored here.
- Own copy. Never fork construction pages or boilerplate (About, FAQ, footer, service blurbs). Write roofing's own.
- Own NAP: own phone number now, own address and own Google Business Profile when available.
- Own schema entity: `RoofingContractor` with `@id` on this domain, `parentOrganization: SouthernGent`. Never reference the construction site's `@id`.
- Own GA4 property, GTM container, Search Console property.
- Cross-links: at most one contextual "sister company" mention. No sitewide footer links between the two sites.
- Code reuse under the hood (Astro layout pattern, SEO dashboard integration) is fine; Google does not see repos.

## Layout
- `src/pages/index.astro` — homepage, 1:1 port of the Unbounce roofing homepage variant A (Oct 7, 2026). Sections kept verbatim; Mike plans heavy tweaks.
- `src/layouts/Base.astro` — head (SEO meta, OG, JSON-LD, fonts, GTM), header, slot, footer, main.js.
- `src/components/Header.astro`, `Footer.astro` — nav links are in-page anchors until service pages exist.
- `src/lib/schema.ts` — JSON-LD graph; FAQPage is generated from the visible `.faq-item` markup.
- `src/data/site.ts` — SITE, BRAND, PHONE, NOINDEX, GTM_ID, LOGO, hero, CITIES. Edit here, never per page.
- `public/css/styles.css` — the Unbounce page CSS, image URLs rewritten to `/images/`, Google Fonts import removed (fonts self-hosted).
- `public/js/main.js` — calculator, FAQ, before/after cycler, reviews carousel, lookbook, lead-form -> webhook -> thank-you.
- `integrations/seo-dashboard.mjs` — builds `/seo` (noindex) on every build. Update CLUSTER_MAP / DONE / PENDING when SEO state changes.
- `scripts/task.sh` + `.github/workflows/run-task.yml` — server-side task runner. Any push to `scripts/task.sh` runs it on GitHub Actions and commits the result. The GitHub app Claude uses cannot create workflow files; Mike pastes those via the GitHub web UI.

## Standards (from the construction site, apply here too)
- SEO everything: descriptive filenames, alt text, schema where it fits. Strip AI markup from files and metadata; nothing should indicate AI/Claude/Runway made it.
- Card grids fill full rows (no orphan tiles). Vary section layouts page to page. Long-form content sections on key pages.
- No "New" badges in nav. No arrows on hero / form / FAQ CTA buttons. Subtle banners, minimal copy in price/CTA areas.
- Never touch the viewport meta via JS. Width overflow on mobile comes from unconstrained fixed-width decorative elements.
- Don't send screenshots; Mike checks live links.
- Ask Mike for photo/image input before image-led design changes.

## Pre-launch / cutover checklist
1. Mike: paste `.github/workflows/run-task.yml` (content in `.github_workflows_run-task.yml` at repo root), then re-push `scripts/task.sh` (or run the workflow manually) so images + fonts land in `public/`.
2. Mike: Cloudflare -> Workers -> create from this repo. Build `npm run build`, deploy `npx wrangler deploy`, root `/`.
3. Real phone number: replace (555)555-5555 / tel:+15555555555 in Header.astro, Footer.astro, index.astro (and PHONE in site.ts for schema).
4. Instagram / Facebook / YouTube URLs (currently placeholders `https://www.instagram.com/` and `#top`).
5. Favicon set + `site.webmanifest`; verify og:image renders.
6. GTM container (NEW, roofing-only) -> `GTM_ID`. GA4 + Meta pixel inside GTM.
7. CRM webhook -> `WEBHOOK_URL` in main.js (Jobber later; none yet).
8. Domain cutover: point southerngentroofing.com at the Worker, unpublish the Unbounce page, set `NOINDEX = false`, open `public/robots.txt`, submit sitemap in a NEW Search Console property.
9. Then build out service pages: roofing, gutters, drainage hub-and-spoke; city pages on the construction "Huntsville layout".
