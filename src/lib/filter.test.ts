import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeCount, emptyState, isFiltering, matches, parseQuery, toQuery, type FilterState, type ToolFacts } from './filter.ts';

const known = {
  categories: ['symptoms', 'diabetes', 'cycle'],
  platforms: ['android', 'ios', 'web', 'desktop', 'self-hosted'],
  data: ['device', 'self-hosted', 'cloud', 'mixed'],
};

const tool = (over: Partial<ToolFacts> = {}): ToolFacts => ({
  category: 'cycle',
  platforms: ['android', 'ios'],
  setup: 'easy',
  data: 'device',
  account: 'false',
  offline: 'true',
  ...over,
});
const state = (over: Partial<FilterState> = {}): FilterState => ({ ...emptyState(), ...over });

test('no filters matches everything', () => {
  assert.equal(matches(tool({ setup: 'hard', account: 'unknown' }), emptyState()), true);
  assert.equal(isFiltering(emptyState()), false);
});

test('platform is any-of', () => {
  assert.equal(matches(tool({ platforms: ['android'] }), state({ platforms: ['ios', 'android'] })), true);
  assert.equal(matches(tool({ platforms: ['web'] }), state({ platforms: ['ios', 'android'] })), false);
});

test('setup is a maximum difficulty', () => {
  const medium = state({ setup: 'medium' });
  assert.equal(matches(tool({ setup: 'easy' }), medium), true);
  assert.equal(matches(tool({ setup: 'medium' }), medium), true);
  assert.equal(matches(tool({ setup: 'hard' }), medium), false);
  assert.equal(matches(tool({ setup: 'medium' }), state({ setup: 'easy' })), false);
});

test('category and data location', () => {
  assert.equal(matches(tool(), state({ category: 'diabetes' })), false);
  assert.equal(matches(tool(), state({ data: ['device', 'mixed'] })), true);
  assert.equal(matches(tool({ data: 'cloud' }), state({ data: ['device', 'mixed'] })), false);
});

test('unknown never satisfies a yes/no filter', () => {
  assert.equal(matches(tool({ offline: 'unknown' }), state({ offline: true })), false);
  assert.equal(matches(tool({ offline: 'false' }), state({ offline: true })), false);
  assert.equal(matches(tool({ account: 'unknown' }), state({ noAccount: true })), false);
  assert.equal(matches(tool({ account: 'true' }), state({ noAccount: true })), false);
  assert.equal(matches(tool(), state({ offline: true, noAccount: true })), true);
});

test('parses a shared link', () => {
  const { state: s, view } = parseQuery('?platform=android,ios&account=no&setup=medium&data=device&view=list', known);
  assert.deepEqual(s, state({ platforms: ['android', 'ios'], noAccount: true, setup: 'medium', data: ['device'] }));
  assert.equal(view, 'list');
});

test('ignores unknown or hostile values', () => {
  const { state: s, view } = parseQuery('?category=nope&platform=android,windows,android&setup=hard&account=yes&view=grid', known);
  assert.deepEqual(s, state({ platforms: ['android'] }));
  assert.equal(view, null);
});

test('round-trips through the query string', () => {
  const s = state({ category: 'diabetes', platforms: ['android', 'ios'], setup: 'easy', data: ['device'], noAccount: true, offline: true });
  const q = toQuery(s, 'list');
  assert.equal(q, 'category=diabetes&platform=android,ios&setup=easy&data=device&account=no&offline=yes&view=list');
  assert.deepEqual(parseQuery(q, known), { state: s, view: 'list' });
});

test('counts active options', () => {
  assert.equal(activeCount(emptyState()), 0);
  assert.equal(activeCount(state({ category: 'cycle', platforms: ['android', 'ios'], offline: true })), 4);
  assert.equal(isFiltering(state({ setup: 'easy' })), true);
});

test('empty state and card view produce an empty query', () => {
  assert.equal(toQuery(emptyState(), 'cards'), '');
  assert.equal(toQuery(emptyState(), null), '');
});
