// JSON-LD graph for every page. The RoofingContractor node is this business's OWN entity
// (its own @id on this domain). It is linked to the SouthernGent parent, never to the
// Construction site's entity, so search engines see two distinct businesses in one family.
import { SITE, BRAND, PHONE, LOGO, CITIES } from '../data/site';

export interface Crumb { name: string; href: string }
export interface ServiceInfo { serviceType: string; name: string; description: string }

const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&#8217;/g, '’').replace(/&amp;/g, '&').replace(/&#8220;|&#8221;/g, '"').replace(/\s+/g, ' ').trim();

/** FAQPage built from the visible .faq-item markup so the schema can never drift from the page. */
export function faqFromHtml(html: string) {
  const items = [...html.matchAll(/<button class="faq-q"[^>]*>(?:<span>\+<\/span>)?(.*?)<\/button>\s*<div class="faq-a">(.*?)<\/div>/gs)];
  if (!items.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${SITE}/#faq`,
    mainEntity: items.map((m) => ({
      '@type': 'Question',
      name: strip(m[1]),
      acceptedAnswer: { '@type': 'Answer', text: strip(m[2]) },
    })),
  };
}

export function buildGraph(o: { path: string; title: string; description: string; hero: string; html: string; service?: ServiceInfo; breadcrumbs?: Crumb[]; crumb?: string }) {
  const url = SITE + (o.path === '/' ? '/' : o.path);
  const biz = {
    '@type': ['RoofingContractor', 'LocalBusiness'],
    '@id': `${SITE}/#business`,
    name: BRAND,
    url: SITE + '/',
    telephone: PHONE,
    image: `${SITE}/images/${o.hero}`,
    logo: `${SITE}/images/${LOGO}`,
    priceRange: '$$',
    areaServed: CITIES.map((c) => ({ '@type': 'City', name: c, containedInPlace: { '@type': 'State', name: 'Alabama' } })),
    parentOrganization: { '@type': 'Organization', name: 'SouthernGent' },
    sameAs: [],
  };
  const page: any = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: o.title,
    description: o.description,
    isPartOf: { '@id': `${SITE}/#website` },
    about: { '@id': `${SITE}/#business` },
    primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/images/${o.hero}` },
  };
  const site = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE + '/', name: BRAND, publisher: { '@id': `${SITE}/#business` } };
  const graph: any[] = [biz, site, page];
  if (o.service) graph.push({ '@type': 'Service', '@id': `${url}#service`, serviceType: o.service.serviceType, name: o.service.name, description: o.service.description, provider: { '@id': `${SITE}/#business` }, areaServed: biz.areaServed });
  if (o.crumb) graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' }, ...(o.breadcrumbs ?? []).map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: c.name, item: SITE + c.href })), { '@type': 'ListItem', position: (o.breadcrumbs?.length ?? 0) + 2, name: o.crumb }] });
  const faq = faqFromHtml(o.html);
  if (faq) graph.push(faq);
  return { '@context': 'https://schema.org', '@graph': graph };
}
