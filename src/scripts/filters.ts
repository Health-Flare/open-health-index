// Client-side filtering for the index page. The page is fully usable without
// this: it only hides things and swaps views.
import { activeCount, emptyState, isFiltering, matches, parseQuery, toQuery, type FilterState, type ToolFacts, type View } from '../lib/filter';

const VIEW_KEY = 'ohi:view';

const facts = (el: HTMLElement): ToolFacts => ({
  category: el.dataset.category ?? '',
  platforms: (el.dataset.platforms ?? '').split(' ').filter(Boolean),
  setup: el.dataset.setup as ToolFacts['setup'],
  data: el.dataset.data ?? '',
  account: el.dataset.account as ToolFacts['account'],
  offline: el.dataset.offline as ToolFacts['offline'],
});

function storedView(): View | null {
  try {
    const v = localStorage.getItem(VIEW_KEY);
    return v === 'list' || v === 'cards' ? v : null;
  } catch {
    return null; // storage blocked; fine
  }
}

function rememberView(v: View) {
  try {
    localStorage.setItem(VIEW_KEY, v);
  } catch {
    /* storage blocked; fine */
  }
}

export function initFilters() {
  const form = document.querySelector<HTMLFormElement>('#filters');
  const cardsView = document.querySelector<HTMLElement>('#cards-view');
  const listView = document.querySelector<HTMLElement>('#list-view');
  const empty = document.querySelector<HTMLElement>('#no-results');
  if (!form || !cardsView || !listView || !empty) return;

  const cards = [...cardsView.querySelectorAll<HTMLElement>('[data-tool]')];
  const tbody = listView.querySelector('tbody')!;
  const rows = [...tbody.querySelectorAll<HTMLTableRowElement>('tr[data-tool]')];
  const groups = [...cardsView.querySelectorAll<HTMLElement>('[data-group]')];
  const jumps = [...cardsView.querySelectorAll<HTMLElement>('[data-jump]')];
  const listBanner = listView.querySelector<HTMLElement>('[data-safety-banner]');
  const countEl = form.querySelector<HTMLElement>('[data-count]')!;
  const clearButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-clear]')];
  const viewButtons = [...form.querySelectorAll<HTMLButtonElement>('[data-view]')];
  const more = form.querySelector<HTMLDetailsElement>('details.more')!;
  const activeBadge = form.querySelector<HTMLElement>('[data-active]')!;
  const categorySelect = form.elements.namedItem('category') as HTMLSelectElement;
  const setupSelect = form.elements.namedItem('setup') as HTMLSelectElement;
  const boxes = (name: string) => [...form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`)];

  const known = {
    categories: [...categorySelect.options].map((o) => o.value).filter(Boolean),
    platforms: boxes('platform').map((b) => b.value),
    data: boxes('data').map((b) => b.value),
  };

  const initial = parseQuery(location.search, known);
  let state: FilterState = initial.state;
  let view: View = initial.view ?? storedView() ?? 'cards';

  function readForm(): FilterState {
    const checked = (name: string) => boxes(name).filter((b) => b.checked).map((b) => b.value);
    return {
      category: categorySelect.value || null,
      platforms: checked('platform'),
      setup: (setupSelect.value || null) as FilterState['setup'],
      data: checked('data'),
      noAccount: checked('account').length > 0,
      offline: checked('offline').length > 0,
    };
  }

  function writeForm(s: FilterState) {
    categorySelect.value = s.category ?? '';
    setupSelect.value = s.setup ?? '';
    boxes('platform').forEach((b) => (b.checked = s.platforms.includes(b.value)));
    boxes('data').forEach((b) => (b.checked = s.data.includes(b.value)));
    boxes('account').forEach((b) => (b.checked = s.noAccount));
    boxes('offline').forEach((b) => (b.checked = s.offline));
  }

  function render() {
    let shown = 0;
    for (const el of cards) el.hidden = !matches(facts(el), state);
    for (const row of rows) {
      const ok = matches(facts(row), state);
      row.hidden = !ok;
      if (ok) shown++;
    }

    for (const g of groups) {
      const any = [...g.querySelectorAll<HTMLElement>('[data-tool]')].some((c) => !c.hidden);
      g.hidden = !any;
      jumps.find((j) => j.dataset.jump === g.dataset.group)?.toggleAttribute('hidden', !any);
    }
    if (listBanner) listBanner.hidden = !rows.some((r) => !r.hidden && r.dataset.safety === 'true');

    cardsView!.hidden = view !== 'cards' || shown === 0;
    listView!.hidden = view !== 'list' || shown === 0;
    empty!.hidden = shown !== 0;
    for (const b of viewButtons) b.setAttribute('aria-pressed', String(b.dataset.view === view));
    for (const b of clearButtons) if (form!.contains(b)) b.hidden = !isFiltering(state);
    const n = activeCount(state);
    activeBadge.hidden = n === 0;
    activeBadge.textContent = `${n} on`;

    countEl.textContent = String(shown);

    const q = toQuery(state, view);
    const url = `${location.pathname}${q ? `?${q}` : ''}${location.hash}`;
    if (url !== `${location.pathname}${location.search}${location.hash}`) history.replaceState(null, '', url);
  }

  form.addEventListener('change', () => {
    state = readForm();
    render();
  });
  form.addEventListener('submit', (e) => e.preventDefault());

  for (const b of viewButtons) {
    b.addEventListener('click', () => {
      view = b.dataset.view as View;
      rememberView(view);
      render();
    });
  }

  for (const b of clearButtons) {
    b.addEventListener('click', () => {
      state = emptyState();
      writeForm(state);
      render();
      categorySelect.focus();
    });
  }

  // List sorting. Name and category only: the other columns are short enums where sorting adds little.
  const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
  const sortValue = (row: HTMLElement, key: string) =>
    key === 'category' ? `${row.querySelector('td')?.textContent ?? ''}\u0000${row.dataset.name}` : (row.dataset.name ?? '');
  for (const btn of listView.querySelectorAll<HTMLButtonElement>('[data-sort]')) {
    btn.addEventListener('click', () => {
      const th = btn.closest('th')!;
      const dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      listView.querySelectorAll('th[aria-sort]').forEach((h) => h.setAttribute('aria-sort', 'none'));
      th.setAttribute('aria-sort', dir);
      const key = btn.dataset.sort!;
      const sorted = [...rows].sort((a, b) => collator.compare(sortValue(a, key), sortValue(b, key)));
      if (dir === 'descending') sorted.reverse();
      tbody.append(...sorted);
    });
  }

  // On small screens the filters would push every tool below the fold. Start collapsed there.
  if (matchMedia('(max-width: 720px)').matches) more.open = false;

  writeForm(state);
  form.hidden = false;
  render();
}
