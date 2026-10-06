// Pure filter logic for the index page. No DOM, no imports, so it runs in the
// browser bundle and under `node --test` unchanged.

export type Tristate = 'true' | 'false' | 'unknown';
export type Setup = 'easy' | 'medium' | 'hard';
export type View = 'cards' | 'list';

/** Facts about one tool, as rendered into data-* attributes. */
export interface ToolFacts {
  category: string;
  platforms: string[];
  setup: Setup;
  data: string;
  account: Tristate;
  offline: Tristate;
}

export interface FilterState {
  category: string | null;
  /** Any-of: show a tool that runs on at least one of these. */
  platforms: string[];
  /** Maximum difficulty. "medium" includes easy. null = any. */
  setup: Exclude<Setup, 'hard'> | null;
  /** Any-of. */
  data: string[];
  /** Only tools confirmed to need no account. */
  noAccount: boolean;
  /** Only tools confirmed to work offline. */
  offline: boolean;
}

/** Allowed values, so a hand-edited URL can't put the page in a nonsense state. */
export interface Known {
  categories: readonly string[];
  platforms: readonly string[];
  data: readonly string[];
}

const SETUP_RANK: Record<Setup, number> = { easy: 0, medium: 1, hard: 2 };

export const emptyState = (): FilterState => ({
  category: null,
  platforms: [],
  setup: null,
  data: [],
  noAccount: false,
  offline: false,
});

export function matches(t: ToolFacts, s: FilterState): boolean {
  if (s.category && t.category !== s.category) return false;
  if (s.platforms.length && !s.platforms.some((p) => t.platforms.includes(p))) return false;
  if (s.setup && SETUP_RANK[t.setup] > SETUP_RANK[s.setup]) return false;
  if (s.data.length && !s.data.includes(t.data)) return false;
  // "unknown" never satisfies a yes/no filter: we don't claim what we haven't checked.
  if (s.noAccount && t.account !== 'false') return false;
  if (s.offline && t.offline !== 'true') return false;
  return true;
}

/** Number of selected options across all facets. */
export const activeCount = (s: FilterState): number =>
  (s.category ? 1 : 0) + s.platforms.length + (s.setup ? 1 : 0) + s.data.length + (s.noAccount ? 1 : 0) + (s.offline ? 1 : 0);

export const isFiltering = (s: FilterState): boolean => activeCount(s) > 0;

const list = (v: string | null, allowed: readonly string[]) =>
  (v ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter((x, i, a) => x && allowed.includes(x) && a.indexOf(x) === i);

export function parseQuery(search: string, known: Known): { state: FilterState; view: View | null } {
  const q = new URLSearchParams(search);
  const category = q.get('category');
  const setup = q.get('setup');
  const view = q.get('view');
  return {
    state: {
      category: category && known.categories.includes(category) ? category : null,
      platforms: list(q.get('platform'), known.platforms),
      setup: setup === 'easy' || setup === 'medium' ? setup : null,
      data: list(q.get('data'), known.data),
      noAccount: q.get('account') === 'no',
      offline: q.get('offline') === 'yes',
    },
    view: view === 'list' || view === 'cards' ? view : null,
  };
}

/** Query string without the leading "?". Empty when nothing is set. */
export function toQuery(s: FilterState, view: View | null): string {
  const q = new URLSearchParams();
  if (s.category) q.set('category', s.category);
  if (s.platforms.length) q.set('platform', s.platforms.join(','));
  if (s.setup) q.set('setup', s.setup);
  if (s.data.length) q.set('data', s.data.join(','));
  if (s.noAccount) q.set('account', 'no');
  if (s.offline) q.set('offline', 'yes');
  if (view === 'list') q.set('view', 'list');
  // Keep commas readable in shared links.
  return q.toString().replace(/%2C/g, ',');
}
