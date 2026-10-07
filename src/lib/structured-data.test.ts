import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  applicationType,
  breadcrumbList,
  dataset,
  itemList,
  serialize,
  softwareApplication,
  spdxUrl,
  toolRecord,
  webSite,
  type ToolEntry,
} from './structured-data.ts';

const SITE = 'https://openhealthindex.org';

const medtimer: ToolEntry = {
  id: 'medtimer',
  data: {
    name: 'MedTimer',
    summary: 'Medication reminders with a dose log.',
    category: 'medications',
    platforms: ['android'],
    license: 'MIT',
    links: {
      source: 'https://github.com/Futsch1/medTimer',
      fdroid: 'https://f-droid.org/packages/com.futsch1.medtimer/',
    },
  },
};

const tool = (over: Partial<ToolEntry['data']> = {}, id = 'x'): ToolEntry => ({
  id,
  data: { ...medtimer.data, ...over },
});

test('tool page describes the app', () => {
  const ld = softwareApplication(medtimer, SITE);
  assert.equal(ld['@context'], 'https://schema.org');
  assert.equal(ld['@type'], 'MobileApplication');
  assert.equal(ld.name, 'MedTimer');
  assert.equal(ld.url, 'https://openhealthindex.org/tools/medtimer/');
  assert.equal(ld.applicationCategory, 'HealthApplication');
  assert.equal(ld.operatingSystem, 'Android');
  assert.equal(ld.isAccessibleForFree, true);
  assert.deepEqual(ld.offers, { '@type': 'Offer', price: 0, priceCurrency: 'USD' });
  assert.equal(ld.license, 'https://spdx.org/licenses/MIT.html');
  assert.deepEqual(ld.sameAs, [
    'https://github.com/Futsch1/medTimer',
    'https://f-droid.org/packages/com.futsch1.medtimer/',
  ]);
});

test('unconfirmed license is left out', () => {
  const ld = softwareApplication(tool({ license: null }), SITE);
  assert.equal('license' in ld, false);
});

test('no operatingSystem when the tool runs on no named OS', () => {
  const ld = softwareApplication(tool({ platforms: ['self-hosted', 'web'] }), SITE);
  assert.equal('operatingSystem' in ld, false);
  assert.equal(ld['@type'], 'WebApplication');
});

test('operatingSystem lists every OS', () => {
  assert.equal(softwareApplication(tool({ platforms: ['android', 'ios'] }), SITE).operatingSystem, 'Android, iOS');
});

test('type follows platforms', () => {
  assert.equal(applicationType(['android']), 'MobileApplication');
  assert.equal(applicationType(['ios', 'android']), 'MobileApplication');
  assert.equal(applicationType(['web']), 'WebApplication');
  assert.equal(applicationType(['self-hosted']), 'WebApplication');
  assert.equal(applicationType(['android', 'desktop']), 'SoftwareApplication');
  assert.equal(applicationType(['desktop']), 'SoftwareApplication');
});

test('SPDX ids become license URLs', () => {
  assert.equal(spdxUrl('GPL-3.0-or-later'), 'https://spdx.org/licenses/GPL-3.0-or-later.html');
});

test('no fake ratings anywhere', () => {
  const all = serialize([
    softwareApplication(medtimer, SITE),
    breadcrumbList(medtimer, SITE),
    webSite(SITE),
    itemList([medtimer], SITE),
    dataset(SITE),
  ]);
  assert.doesNotMatch(all, /aggregateRating|"review"/);
});

test('breadcrumb is Home > category > tool', () => {
  const ld = breadcrumbList(medtimer, SITE);
  assert.equal(ld['@type'], 'BreadcrumbList');
  assert.deepEqual(ld.itemListElement, [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://openhealthindex.org/' },
    { '@type': 'ListItem', position: 2, name: 'Medications', item: 'https://openhealthindex.org/#medications' },
    { '@type': 'ListItem', position: 3, name: 'MedTimer', item: 'https://openhealthindex.org/tools/medtimer/' },
  ]);
});

test('home page lists tool URLs in order', () => {
  const ld = itemList([medtimer, tool({}, 'drip')], SITE);
  assert.equal(ld.numberOfItems, 2);
  assert.deepEqual(
    (ld.itemListElement as { position: number; url: string }[]).map((i) => [i.position, i.url]),
    [
      [1, 'https://openhealthindex.org/tools/medtimer/'],
      [2, 'https://openhealthindex.org/tools/drip/'],
    ],
  );
  assert.equal(webSite(SITE).name, 'Open Health Index');
});

test('dataset is CC0 with a JSON download', () => {
  const ld = dataset(SITE);
  assert.equal(ld['@type'], 'Dataset');
  assert.equal(ld.license, 'https://creativecommons.org/publicdomain/zero/1.0/');
  assert.deepEqual(ld.distribution, [
    { '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: 'https://openhealthindex.org/tools.json' },
  ]);
  // Google requires description of 50–5000 characters.
  assert.ok((ld.description as string).length >= 50);
});

test('records keep YAML keys and a plain date', () => {
  const r = toolRecord({ id: 'medtimer', data: { ...medtimer.data, reviewed_on: new Date('2026-10-01') } }, SITE);
  assert.equal(r.id, 'medtimer');
  assert.equal(r.url, 'https://openhealthindex.org/tools/medtimer/');
  assert.equal(r.reviewed_on, '2026-10-01');
  assert.equal(r.license, 'MIT');
  assert.equal(toolRecord({ id: 'x', data: { ...medtimer.data, reviewed_on: null } }, SITE).reviewed_on, null);
});

test('serialised JSON-LD cannot close its script tag', () => {
  const s = serialize({ name: '</script><script>alert(1)</script>' });
  assert.doesNotMatch(s, /<\/script>/i);
  assert.equal(JSON.parse(s).name, '</script><script>alert(1)</script>');
});
