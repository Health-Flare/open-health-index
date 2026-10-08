# Open Health Index

A people-first index of free and open-source health tools for tracking symptoms, flares, mood, medications and your own records. Each listing shows where your data lives, whether you need an account, and how hard it is to set up.

**Live site:** https://openhealthindex.org

## Who it's for

Patients, caregivers and anyone who wants their health data to stay theirs. Clinical and health-IT software is out of scope; see [awesome-healthcare](https://github.com/kakoni/awesome-healthcare) for that.

## Suggest a tool

You don't need to write code. [Open an issue](../../issues/new?template=suggest-tool.yml) with the tool's name and source link, and someone will check it and add it.

To add it yourself, see [CONTRIBUTING.md](CONTRIBUTING.md).

## How it works

- Each tool is one YAML file in [`src/data/tools/`](src/data/tools/).
- [`src/content.config.ts`](src/content.config.ts) defines the schema. The build fails on a missing field, an unknown category, a bad URL or a typo'd key, so a broken entry can't reach the site.
- Display labels for categories, platforms and so on live in [`src/lib/labels.ts`](src/lib/labels.ts).
- Candidates waiting to be checked are in [`docs/backlog.md`](docs/backlog.md).
- The site is built with [Astro](https://astro.build) and deployed to GitHub Pages on every push to `main`.

## Development

Requires Node 22+.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # validates every entry and builds to dist/
npm test         # unit tests for the index page filters
```

## Licensing

- **Index content** (`src/data/`): [CC0 1.0](LICENSE-CONTENT). Reuse it however you like.
- **Site code**: [MIT](LICENSE).
- **Screenshots** (`src/assets/tools/`): **not CC0.** They show each project's own interface and are used under that project's license. Every screenshot's source and license is recorded in its tool's YAML file and shown under the image on the site.

## Disclosure

This index is run by the people behind [Health-Flare](https://github.com/Health-Flare), who also make health tracking apps. Those apps are marked `affiliated: true` and carry a visible disclosure on the site.

## Not medical advice

A listing means a tool meets the [inclusion criteria](CONTRIBUTING.md#what-gets-listed). It is not a recommendation, and it doesn't mean a tool is safe or right for you.
