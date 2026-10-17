import { test } from 'node:test';
import assert from 'node:assert/strict';
import { placeholderColours, placeholderIndex, placeholderStyle } from './placeholder.ts';

const hueGap = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));

function minStartGap(n: number) {
  let min = 360;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) min = Math.min(min, hueGap(placeholderColours(i).from, placeholderColours(j).from));
  return min;
}

test('same position, same colours', () => {
  assert.deepEqual(placeholderColours(3), placeholderColours(3));
});

test('values stay in range', () => {
  for (let i = 0; i < 500; i++) {
    const { from, to, angle } = placeholderColours(i);
    assert.ok(Number.isInteger(from) && from >= 0 && from < 360, `from ${from}`);
    assert.ok(Number.isInteger(to) && to >= 0 && to < 360, `to ${to}`);
    const spread = (to - from + 360) % 360;
    assert.ok(spread >= 40 && spread <= 80, `spread ${spread}`);
    assert.ok(angle >= 100 && angle <= 170, `angle ${angle}`);
  }
});

test('start hues stay well apart as the list grows', () => {
  assert.ok(minStartGap(12) >= 20, `12 tools: ${minStartGap(12)}`);
  assert.ok(minStartGap(20) >= 12, `20 tools: ${minStartGap(20)}`);
});

test('no two blocks match in start hue, end hue and angle', () => {
  const seen = new Set<string>();
  for (let i = 0; i < 100; i++) {
    const { from, to, angle } = placeholderColours(i);
    const key = `${from}/${to}/${angle}`;
    assert.ok(!seen.has(key), `duplicate at ${i}: ${key}`);
    seen.add(key);
  }
});

test('index is alphabetical and ignores input order', () => {
  const ids = ['xdrip', 'drip', 'medtimer'];
  assert.equal(placeholderIndex('drip', ids), 0);
  assert.equal(placeholderIndex('medtimer', ids), 1);
  assert.equal(placeholderIndex('xdrip', ids), 2);
  assert.deepEqual(ids, ['xdrip', 'drip', 'medtimer']);
});

test('bad input falls back to the first colour, not NaN', () => {
  assert.deepEqual(placeholderColours(-1), placeholderColours(0));
  assert.match(placeholderStyle(-1), /^--ph-from: \d+; --ph-to: \d+; --ph-angle: \d+deg$/);
});
