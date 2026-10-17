/**
 * Colour block for cards without a screenshot. Each tool gets its own soft
 * two-hue gradient.
 *
 * Hues step round the wheel by the golden angle, indexed by the tool's place in
 * the alphabetical list of all tools. That keeps neighbouring hues far apart for
 * any number of tools (at least 20 degrees up to 12 tools, 12 up to 20), which a
 * hash of the id can't: with a dozen ids, hashing already put four in the same
 * reds. Trade-off: adding a tool shifts the colours of tools after it in the
 * list. They're decoration, so that's fine. Adding a screenshot doesn't shift
 * anything, because every tool holds its place whether or not it has one.
 *
 * End hue and angle also vary by position, so two blocks with similar start
 * hues still look different once the list grows.
 */

const GOLDEN_ANGLE = 137.50776;

export interface PlaceholderColours {
  /** Start hue, 0-359. */
  from: number;
  /** End hue: 40-80 degrees on from the start, so the pair reads as one family. */
  to: number;
  /** Gradient angle in degrees, 100-170. */
  angle: number;
}

export function placeholderColours(index: number): PlaceholderColours {
  const i = Math.max(0, Math.trunc(index));
  const from = Math.round(i * GOLDEN_ANGLE) % 360;
  const to = (from + 40 + ((i * 37) % 41)) % 360;
  const angle = 100 + ((i * 53) % 71);
  return { from, to, angle };
}

/** Position of `id` among all tool ids, alphabetically. */
export function placeholderIndex(id: string, allIds: readonly string[]): number {
  return [...allIds].sort().indexOf(id);
}

/** Inline custom properties for the card. The colours live in CSS so dark mode can adjust them. */
export function placeholderStyle(index: number): string {
  const c = placeholderColours(index);
  return `--ph-from: ${c.from}; --ph-to: ${c.to}; --ph-angle: ${c.angle}deg`;
}
