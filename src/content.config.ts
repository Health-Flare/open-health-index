import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES, PLATFORMS, SETUP, DATA_LOCATION, STATUS } from './lib/labels';

// A yes/no fact we may not have confirmed yet. "unknown" is shown to visitors
// as-is rather than guessed.
const tristate = z.union([z.boolean(), z.literal('unknown')]);

const keys = <T extends Record<string, unknown>>(o: T) =>
  Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

const tools = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/data/tools' }),
  schema: ({ image }) => z
    .object({
      name: z.string().min(1),
      // Written in our own words. Never paste store or README descriptions.
      summary: z.string().min(10).max(160),
      category: z.enum(keys(CATEGORIES)),
      platforms: z.array(z.enum(keys(PLATFORMS))).min(1),
      setup: z.enum(keys(SETUP)),

      privacy: z.object({
        data_location: z.enum(keys(DATA_LOCATION)),
        account_required: tristate,
        works_offline: tristate,
      }),
      exports: z.array(z.string()).default([]),

      // SPDX identifier, e.g. "GPL-3.0-or-later". null until someone checks.
      license: z.string().nullable(),

      links: z.object({
        source: z.url(),
        website: z.url().optional(),
        fdroid: z.url().optional(),
        play: z.url().optional(),
        appstore: z.url().optional(),
      }),

      status: z.enum(keys(STATUS)).default('active'),
      // Can affect treatment (e.g. insulin dosing). Shows a safety banner.
      safety_critical: z.boolean().default(false),
      // Maintained by the people who run this index. Shows a disclosure.
      affiliated: z.boolean().default(false),
      // Date a human last checked every field against the source. null = unreviewed.
      reviewed_on: z.coerce.date().nullable(),
      notes: z.string().max(280).optional(),

      // Screenshots are NOT CC0. Each one carries its own source and license.
      // `file` is relative to this YAML file: ../../assets/tools/<id>/<name>.png
      screenshots: z
        .array(
          z
            .object({
              file: image(),
              // Written by us. Describe what the screen shows.
              alt: z.string().trim().min(10).max(200),
              source: z.url(),
              license: z.string().trim().min(1),
            })
            .strict(),
        )
        .max(4)
        .default([]),
    })
    .strict(),
});

export const collections = { tools };
