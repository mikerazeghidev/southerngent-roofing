// Site-wide constants. Edit here, never per page.
export const SITE = 'https://www.southerngentroofing.com';
export const BRAND = 'SouthernGent Roofing & Gutters';
export const PHONE = '(555)555-5555';        // TODO: real tracking number before cutover
export const PHONE_HREF = 'tel:+15555555555';

// Pre-launch flag: true = every page gets <meta name="robots" content="noindex, nofollow">.
// Flip to false at domain cutover (and open up public/robots.txt at the same time).
export const NOINDEX = true;

// Google Tag Manager container id. Leave empty until provided; the layout skips GTM when blank.
// Must be a DIFFERENT container from SouthernGent Construction.
export const GTM_ID = '';

// Brand images used in the RoofingContractor schema node on every page.
export const LOGO = 'southerngent-roofing-gutters-logo.webp';
export const INDEX_HERO = 'alabama-roofing-crew-hero.webp';

// Cities shown on the homepage service-area grid. Keep in sync with Service.areaServed.
export const CITIES = ['Huntsville', 'Birmingham', 'Madison', 'Homewood', 'Irondale', 'Vestavia Hills', 'Jasper', 'Meridianville'];
