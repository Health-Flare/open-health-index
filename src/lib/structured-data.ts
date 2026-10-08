// schema.org JSON-LD built from tool entries. One mapping, no hand-written JSON
// in templates. Pure: no Astro imports, so it runs under `node --test`.
//
// Rules (Google structured data guidelines + this index's own):
// - Only mark up facts that are visible on the page.
// - `unknown` / `null` facts are left out, never guessed.
// - No aggregateRating or review. We don't rate tools.

import { CATEGORIES, DATA_LOCATION, PLATFORMS, type Category } from './labels.ts';

export const SITE_NAME = 'Open Health Index';
export const SITE_DESCRIPTION =
  'Free and open-source health tools for people managing their own health, rated on privacy, platform and ease of setup.';

type Platform = keyof typeof PLATFORMS;

/** The subset of a tool entry the mapping needs. Matches the content schema. */
export interface ToolData {
  name: string;
  summary: string;
  category: Category;
  platforms: Platform[];
  license: string | null;
  links: {
    source: string;
    website?: string;
    fdroid?: string;
    play?: string;
    appstore?: string;
  };
  status?: 'active' | 'watchlist' | 'archived';
  // Optional so callers (and tests) only pass what they have. Absent = not marked up.
  privacy?: {
    data_location: keyof typeof DATA_LOCATION;
    account_required: boolean | 'unknown';
    works_offline: boolean | 'unknown';
  };
  exports?: string[];
  affiliated?: boolean;
  reviewed_on?: Date | null;
}

export interface ToolEntry {
  id: string;
  data: ToolData;
}

type JsonLd = Record<string, unknown>;

const abs = (site: string | URL, path: string) => new URL(path, site).href;

export const toolPath = (id: string) => `/tools/${id}/`;

// The people who run the index. Named the way the site names them ("Part of
// the Health Flare family"), and given a stable @id so every page points at
// the same entity.
export const ORGANIZATION_ID = 'https://healthflare.org/#organization';
export function organization(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: 'Health Flare',
    url: 'https://healthflare.org',
    sameAs: ['https://github.com/Health-Flare'],
  };
}

const websiteId = (site: string | URL) => `${abs(site, '/')}#website`;
const appId = (site: string | URL, id: string) => `${abs(site, toolPath(id))}#app`;
const breadcrumbId = (site: string | URL, id: string) => `${abs(site, toolPath(id))}#breadcrumb`;

/**
 * Privacy facts as a schema.org featureList. Only confirmed facts: an
 * `unknown` or a "no" is left out, because a feature list can't say "no".
 */
export function featureList(d: ToolData): string[] {
  const out: string[] = [];
  if (d.privacy) {
    out.push(DATA_LOCATION[d.privacy.data_location]);
    if (d.privacy.account_required === false) out.push('No account needed');
    if (d.privacy.works_offline === true) out.push('Works offline');
  }
  if (d.exports?.length) out.push(`Export to ${d.exports.join(', ')}`);
  return out;
}
export const categoryPath = (category: Category) => `/#${category}`;

// schema.org operatingSystem is free text. Only real OSes go here; "web" and
// "self-hosted" are expressed through the type instead.
const OS: Partial<Record<Platform, string>> = {
  android: 'Android',
  ios: 'iOS',
};

/**
 * MobileApplication when it only runs on phones, WebApplication when it only
 * runs in a browser or on your own server, SoftwareApplication otherwise.
 */
export function applicationType(platforms: readonly Platform[]): string {
  const mobile = platforms.every((p) => p === 'android' || p === 'ios');
  const web = platforms.every((p) => p === 'web' || p === 'self-hosted');
  if (mobile) return 'MobileApplication';
  if (web) return 'WebApplication';
  return 'SoftwareApplication';
}

export function spdxUrl(id: string): string {
  return `https://spdx.org/licenses/${encodeURIComponent(id)}.html`;
}

/** Tool page: SoftwareApplication (or Mobile/WebApplication). */
export function softwareApplication(tool: ToolEntry, site: string | URL, images: readonly string[] = []): JsonLd {
  const d = tool.data;
  const url = abs(site, toolPath(tool.id));
  const os = [...new Set(d.platforms.map((p) => OS[p]).filter((v): v is string => Boolean(v)))];
  const sameAs = [d.links.source, d.links.website, d.links.fdroid, d.links.play, d.links.appstore].filter(
    (v): v is string => Boolean(v),
  );

  const out: JsonLd = {
    '@context': 'https://schema.org',
    '@type': applicationType(d.platforms),
    '@id': appId(site, tool.id),
    name: d.name,
    description: d.summary,
    url,
    applicationCategory: 'HealthApplication',
    applicationSubCategory: CATEGORIES[d.category].label,
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
    sameAs,
  };
  if (os.length) out.operatingSystem = os.join(', ');
  if (d.license) out.license = spdxUrl(d.license);
  if (images.length) out.screenshot = [...images];
  const features = featureList(d);
  if (features.length) out.featureList = features;
  // Only for our own apps, where the page shows the disclosure. We don't know
  // (or claim) who publishes third-party tools.
  if (d.affiliated) out.publisher = organization();
  return out;
}

/**
 * Tool page: the page itself. Ties the app, breadcrumb and site together and
 * carries the human review date, which is what makes a health listing
 * trustworthy. No MedicalWebPage: these pages describe software, not medical
 * conditions or treatments.
 */
export function toolWebPage(tool: ToolEntry, site: string | URL): JsonLd {
  const d = tool.data;
  const url = abs(site, toolPath(tool.id));
  const out: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: `${d.name} · ${SITE_NAME}`,
    description: d.summary,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId(site) },
    mainEntity: { '@id': appId(site, tool.id) },
    breadcrumb: { '@id': breadcrumbId(site, tool.id) },
  };
  if (d.reviewed_on) out.lastReviewed = d.reviewed_on.toISOString().slice(0, 10);
  return out;
}

/** Tool page: Home → category → tool. */
export function breadcrumbList(tool: ToolEntry, site: string | URL): JsonLd {
  const d = tool.data;
  const items: [string, string][] = [
    ['Home', abs(site, '/')],
    [CATEGORIES[d.category].label, abs(site, categoryPath(d.category))],
    [d.name, abs(site, toolPath(tool.id))],
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId(site, tool.id),
    itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
  };
}

/** Home page: the site itself. */
export function webSite(site: string | URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(site),
    name: SITE_NAME,
    url: abs(site, '/'),
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: organization(),
  };
}

/** Home page: every listed tool's page, in display order. */
export function itemList(tools: readonly ToolEntry[], site: string | URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(site, toolPath(t.id)),
    })),
  };
}

export const DATASET_PATH = '/tools.json';
export const CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/';
export const REPO = 'https://github.com/Health-Flare/open-health-index';

/** About page: the index as an open dataset. */
export function dataset(site: string | URL): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: SITE_NAME,
    description:
      'A people-first index of free and open-source health tools. Each entry records the platforms a tool runs on, how hard it is to set up, where your data lives, whether you need an account, whether it works offline, its license and links to its source.',
    url: abs(site, '/about/'),
    license: CC0,
    isAccessibleForFree: true,
    keywords: ['open source', 'health', 'patients', 'privacy', 'self-tracking', 'software'],
    creator: organization(),
    publisher: organization(),
    sameAs: REPO,
    distribution: [
      {
        '@type': 'DataDownload',
        encodingFormat: 'application/json',
        contentUrl: abs(site, DATASET_PATH),
      },
    ],
  };
}

/** Public JSON shape for one entry in /tools.json. Keys mirror the YAML files. */
export function toolRecord<D extends { reviewed_on: Date | null }>(tool: { id: string; data: D }, site: string | URL) {
  const { reviewed_on, ...rest } = tool.data;
  return {
    id: tool.id,
    url: abs(site, toolPath(tool.id)),
    ...rest,
    reviewed_on: reviewed_on ? reviewed_on.toISOString().slice(0, 10) : null,
  };
}

/** Serialise for a <script type="application/ld+json"> block. Escapes `<` so content can't close the tag. */
export function serialize(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
