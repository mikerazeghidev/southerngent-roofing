// Private SEO dashboard, regenerated on every build from the rendered pages.
// Output: dist/seo.html (noindex, excluded from the sitemap). Nothing to maintain by hand:
// titles, descriptions, canonicals, schema types, headings, image alts and internal links are
// read straight out of dist/*.html after Astro writes them.
import fs from 'node:fs';
import path from 'node:path';

// Editorial bits that are not derivable from the HTML. Keep current.
const CLUSTER_MAP = [
  ['/', 'Homepage &middot; roofing + gutters + drainage Huntsville / Birmingham AL'],
  ['/roofing (planned)', 'Hub &middot; roof repair, roof replacement, storm &amp; insurance'],
  ['/gutters (planned)', 'Hub &middot; seamless gutters, guards, cleaning, repair'],
  ['/drainage (planned)', 'Hub &middot; yard drainage, underground drainage, French drains'],
];
const DONE = 'Ported from Unbounce variant A &middot; SEO title + meta description &middot; RoofingContractor/LocalBusiness + WebSite + WebPage + FAQ schema (own @id, parentOrganization SouthernGent) &middot; canonical &middot; single H1 &middot; SEO image filenames &middot; WebP &middot; self-hosted fonts and images &middot; XML sitemap (auto)';
const PENDING = 'Real phone number (PHONE in src/data/site.ts) &middot; favicon + og:image sizes &middot; GTM/GA4/pixels (own container, GTM_ID in src/data/site.ts) &middot; CRM webhook (WEBHOOK_URL in public/js/main.js) &middot; Instagram/Facebook URLs &middot; flip NOINDEX in src/data/site.ts + open robots.txt at domain cutover &middot; service pages (roofing, gutters, drainage) &middot; separate Search Console property';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
const grab = (rx, s, d = '') => { const m = rx.exec(s); return m ? m[1].trim() : d; };
const lenflag = (n, lo, hi) => (n >= lo && n <= hi ? '<span class="ok">good</span>' : `<span class="warn">${n > hi ? 'long' : 'short'}</span>`);

function audit(file, html) {
  const name = file;
  const title = grab(/<title>(.*?)<\/title>/s, html);
  const desc = grab(/<meta name="description" content="(.*?)">/s, html);
  const canon = grab(/<link rel="canonical" href="(.*?)">/s, html);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)].map((m) => strip(m[1]));
  const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gs)].map((m) => strip(m[1]));
  const types = [...html.matchAll(/"@type":\s*"(Service|FAQPage|BreadcrumbList|RoofingContractor|WebSite|WebPage|AboutPage|CollectionPage|ContactPage|ItemList|ImageObject|City)"/g)].map((m) => m[1]);
  const nfaq = (html.match(/"@type":\s*"Question"/g) || []).length;
  const imgs = [...html.matchAll(/<img[^>]*src="\/images\/([^"]+)"[^>]*alt="([^"]*)"/g)].map((m) => [m[1], m[2]]);
  const links = [...new Set([...html.matchAll(/href="(\/[a-z0-9/-]+)(?:#[^"]*)?"/g)].map((m) => m[1]))].sort();
  const pathName = name === 'index.html' ? '/' : '/' + name.replace(/\.html$/, '');
  return { name, pathName, title, desc, canon, noindex, h1s, h2s, types, nfaq, imgs, links };
}

export default function seoDashboard() {
  return {
    name: 'seo-dashboard',
    hooks: {
      'astro:build:done': ({ dir, logger }) => {
        const dist = new URL(dir).pathname;
        const files = fs.readdirSync(dist, { recursive: true }).map(String).filter((f) => f.endsWith('.html') && f !== 'seo.html' && f !== '404.html');
        files.sort((a, b) => (a === 'index.html' ? -1 : b === 'index.html' ? 1 : a.localeCompare(b)));
        const pages = files.map((f) => audit(f, fs.readFileSync(path.join(dist, f), 'utf8')));
        const allImgs = new Map();
        const cards = pages.map((a) => {
          for (const [f, alt] of a.imgs) if (!allImgs.has(f)) allImgs.set(f, alt);
          const tl = unesc(a.title).length, dl = unesc(a.desc).length;
          const bits = [];
          for (const t of ['RoofingContractor', 'WebSite', 'Service', 'WebPage', 'AboutPage', 'CollectionPage', 'ContactPage', 'ItemList', 'ImageObject', 'City', 'FAQPage', 'BreadcrumbList']) {
            if (a.types.includes(t)) bits.push(`<span class="ok">${t}</span>${t === 'FAQPage' ? ` (${a.nfaq} Q)` : ''}`);
          }
          const h1ok = a.h1s.length === 1 ? '<span class="ok">1 H1</span>' : `<span class="bad">${a.h1s.length} H1s</span>`;
          return `<h2>${esc(unesc(a.title.split('|')[0]))} &mdash; ${a.pathName}</h2>
<div class="card"><table>
<tr><td class="k">Page title</td><td>${esc(unesc(a.title))} <span class="count">(${tl} chars &mdash; ${lenflag(tl, 30, 65)})</span></td></tr>
<tr><td class="k">Meta description</td><td>${esc(unesc(a.desc))} <span class="count">(${dl} chars &mdash; ${lenflag(dl, 110, 175)})</span></td></tr>
<tr><td class="k">Canonical</td><td><code>${a.canon}</code>${a.noindex ? ' <span class="pill w">noindex</span>' : ''}</td></tr>
<tr><td class="k">Schema</td><td>${bits.join(' &middot; ') || '<span class="warn">none</span>'}</td></tr>
<tr><td class="k">H1</td><td>${esc(a.h1s.join(' / '))} &nbsp;${h1ok}</td></tr>
<tr><td class="k">H2s</td><td>${a.h2s.map(esc).join(' &middot; ')}</td></tr>
<tr><td class="k">Internal links</td><td class="count">${a.links.map((l) => `<code>${l}</code>`).join(' ') || '<span class="warn">none yet (single page)</span>'}</td></tr>
</table></div>`;
        });
        const imgRows = [...allImgs.entries()].sort().map(([f, alt]) => `<tr><td><code>${f}</code></td><td>${alt ? esc(unesc(alt)) : '<span class="warn">decorative (empty alt)</span>'}</td></tr>`).join('\n');
        const nonWebp = [...allImgs.keys()].filter((f) => !/\.(webp|svg)$/.test(f));
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const anyNoindex = pages.some((p) => p.noindex);
        const out = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SEO Dashboard | SouthernGent Roofing &amp; Gutters</title>
<meta name="robots" content="noindex, nofollow">
<style>
:root{--bg:#14100c;--card:#1e1813;--line:#3a2f24;--ink:#ece4d1;--dim:#a89880;--blue:#29a6df;--gold:#c98a35;--good:#4caf7d;--warn:#e8a33c;--bad:#e06c5a}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 Arial,Helvetica,sans-serif;padding:32px 18px 80px}
.wrap{max-width:1060px;margin:0 auto}
h1{font-size:26px;margin:0 0 4px}
.sub{color:var(--dim);margin:0 0 28px;font-size:13px}
h2{font-size:15px;text-transform:uppercase;letter-spacing:2px;color:var(--gold);margin:34px 0 12px;border-bottom:1px solid var(--line);padding-bottom:8px}
.card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:18px 20px;margin-bottom:14px}
table{width:100%;border-collapse:collapse;font-size:13.5px}
th{text-align:left;color:var(--dim);font-weight:600;padding:7px 10px;border-bottom:1px solid var(--line);font-size:11px;text-transform:uppercase;letter-spacing:1.5px}
td{padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
tr:last-child td{border-bottom:0}
code{background:#0f0c09;border:1px solid var(--line);border-radius:4px;padding:1px 6px;font-size:12.5px;color:#9fd8f5;word-break:break-all}
.k{color:var(--dim);width:170px;font-size:12px;text-transform:uppercase;letter-spacing:1.2px}
.ok{color:var(--good);font-weight:700}
.warn{color:var(--warn);font-weight:700}
.bad{color:var(--bad);font-weight:700}
.pill{display:inline-block;border-radius:99px;padding:2px 10px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase}
.pill.g{background:rgba(76,175,125,.15);color:var(--good);border:1px solid rgba(76,175,125,.4)}
.pill.w{background:rgba(232,163,60,.12);color:var(--warn);border:1px solid rgba(232,163,60,.4)}
.count{color:var(--dim);font-weight:400;font-size:12px}
</style>
</head>
<body>
<div class="wrap">
<h1>SEO Dashboard</h1>
<p class="sub">southerngentroofing.com &middot; Astro static site &middot; regenerated automatically on every build &middot; Last built: ${today}</p>

<h2>Site Status</h2>
<div class="card"><table>
<tr><td class="k">Indexing</td><td>${anyNoindex ? '<span class="pill w">Pre-launch: noindex + robots.txt blocked</span> &nbsp;Flips to indexable at domain cutover (NOINDEX in src/data/site.ts).' : '<span class="pill g">Indexable</span>'}</td></tr>
<tr><td class="k">Hosting</td><td>Cloudflare Workers static assets (auto-build + deploy from GitHub) &middot; own repo, own Worker, own entity &mdash; nothing shared with the Construction site at the URL level</td></tr>
<tr><td class="k">Pages</td><td>${pages.length} pages</td></tr>
<tr><td class="k">Sitemap</td><td><span class="ok">Auto-generated</span> &middot; <code>/sitemap-index.xml</code> (this dashboard excluded)</td></tr>
<tr><td class="k">Images</td><td>${allImgs.size} unique &middot; ${nonWebp.length ? `<span class="warn">${nonWebp.length} not WebP</span>` : '<span class="ok">all WebP/SVG</span>'}</td></tr>
</table></div>

<h2>Cluster Map</h2>
<div class="card"><table>
<tr><th>Page</th><th>Primary intent</th></tr>
${CLUSTER_MAP.map(([p, i]) => `<tr><td><code>${p}</code></td><td>${i}</td></tr>`).join('\n')}
</table></div>

${cards.join('\n\n')}

<h2>Images &mdash; ${allImgs.size} unique in HTML</h2>
<div class="card"><table>
<tr><th>Filename</th><th>Alt text (first use)</th></tr>
${imgRows}
</table></div>

<h2>Pre-Launch Checklist</h2>
<div class="card"><table>
<tr><td class="k ok">Done</td><td>${DONE}</td></tr>
<tr><td class="k warn">Pending</td><td>${PENDING}</td></tr>
</table></div>

</div>
</body>
</html>
`;
        fs.writeFileSync(path.join(dist, 'seo.html'), out);
        logger.info(`seo.html regenerated (${pages.length} pages, ${allImgs.size} images)`);
      },
    },
  };
}
