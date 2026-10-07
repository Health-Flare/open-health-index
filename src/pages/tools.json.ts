import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CC0, REPO, toolRecord } from '../lib/structured-data';
import { screenshotRecords } from '../lib/screenshots';

// Every non-archived listing as one CC0 JSON file. Described by the Dataset
// markup on the About page.
export const GET: APIRoute = async ({ site }) => {
  const tools = (await getCollection('tools', ({ data }) => data.status !== 'archived')).sort((a, b) =>
    a.id.localeCompare(b.id),
  );
  const body = {
    name: 'Open Health Index',
    license: CC0,
    source: REPO,
    count: tools.length,
    // Screenshots are not CC0: each carries its own license.
    tools: await Promise.all(
      tools.map(async (t) => ({
        ...toolRecord(t, site!),
        screenshots: await screenshotRecords(t.data.screenshots, site!),
      })),
    ),
  };
  return new Response(JSON.stringify(body, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
