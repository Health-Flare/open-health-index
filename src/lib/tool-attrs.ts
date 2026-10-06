import type { CollectionEntry } from 'astro:content';

const tri = (v: boolean | 'unknown') => (v === 'unknown' ? 'unknown' : String(v));

/** data-* attributes the filter script reads. Shared by cards and list rows so both views always agree. */
export function filterAttrs(tool: CollectionEntry<'tools'>) {
  const d = tool.data;
  return {
    'data-tool': tool.id,
    'data-name': d.name,
    'data-category': d.category,
    'data-platforms': d.platforms.join(' '),
    'data-setup': d.setup,
    'data-data': d.privacy.data_location,
    'data-account': tri(d.privacy.account_required),
    'data-offline': tri(d.privacy.works_offline),
    'data-safety': d.safety_critical ? 'true' : 'false',
  };
}
