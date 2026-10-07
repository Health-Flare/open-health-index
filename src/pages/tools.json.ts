import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CC0, REPO, toolRecord } from '../lib/structured-data';

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
    tools: tools.map((t) => toolRecord(t, site!)),
  };
  return new Response(JSON.stringify(body, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
