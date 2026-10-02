# Contributing

Thanks for helping. The most useful contributions are new listings and corrections to existing ones.

## What gets listed

A tool must meet all of these:

1. **Open source.** The source is public under an [OSI-approved license](https://opensource.org/licenses).
2. **For people, not institutions.** Useful to an individual managing their own or a family member's health.
3. **Maintained.** A release or commit in the last 18 months. Otherwise set `status: watchlist` (promising but not ready) or `status: archived` (no longer maintained).
4. **Actually open.** The parts you need to use it day to day are open. Open-core tools whose usable product is proprietary aren't listed.

## Adding a tool

1. Copy an existing file in `src/data/tools/`. The filename becomes the URL, so use lowercase with hyphens: `my-tool.yaml`.
2. Fill in every field by checking the tool's **source repository**, not its app store page.
3. Run `npm run build`. It tells you exactly which field is wrong.
4. Open a pull request.

### Fields

```yaml
name: MedTimer
summary: One or two sentences, 10–160 characters, in your own words.
category: medications        # symptoms | mood | medications | cycle | diabetes | records | body | communication | harm-reduction
platforms: [android]         # android | ios | web | desktop | self-hosted
setup: easy                  # easy = app store | medium = F-Droid/sideload | hard = build it or run a server
privacy:
  data_location: device      # device | self-hosted | cloud | mixed
  account_required: false    # true | false | unknown
  works_offline: true        # true | false | unknown
exports: [CSV]               # optional
license: MIT                 # SPDX id, or null if you couldn't confirm it
links:
  source: https://...        # required
  website: https://...       # optional
  fdroid: https://...        # optional
  play: https://...          # optional
  appstore: https://...      # optional
status: active               # optional: active (default) | watchlist | archived
safety_critical: false       # optional: true if it can affect treatment, e.g. insulin dosing
affiliated: false            # optional: true if made by the people who run this index
reviewed_on: 2026-10-01      # date you checked every field, or null
notes: Optional, up to 280 characters.
```

### Rules

- **Write descriptions yourself.** Don't paste from app stores, F-Droid or READMEs; those are under their own licenses, and this index's content is CC0.
- **Don't guess.** If you can't confirm something, use `unknown` or `null`. The site shows these as "Not yet checked", which is more useful than a wrong answer.
- **Use plain language.** The audience is patients and caregivers. Say "stays on your phone", not "local-first persistence".
- **Mark anything that can change treatment** with `safety_critical: true`.

## Corrections

Every tool page has a "Suggest a correction" link that opens the file for editing on GitHub. Or open an issue.

## Licensing of contributions

By contributing, you agree that content under `src/data/` is released under [CC0 1.0](LICENSE-CONTENT) and code under [MIT](LICENSE).
