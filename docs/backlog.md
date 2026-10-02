# Backlog — candidates not yet in the index

Entries move from here into `src/data/tools/` once someone has checked the source repo. Already added: MedTimer, drip., Mooneva Cycle, Loop Habit Tracker, Gadgetbridge, Fasten, Nightscout, xDrip+, AndroidAPS, Trio.

For people managing their own health: tracking symptoms, flares, mood, and medications, and keeping their own records. Clinical and health-IT software is out of scope for now. Point developers to kakoni/awesome-healthcare.

Researched 2026-09-26. `verify` = license or status not confirmed; check the repo before publishing.

**Platform key:** 🤖 Android · 🍎 iOS · 🌐 web · 🖥 self-hosted server
**Setup:** Easy = install from a store · Medium = F-Droid or sideload · Hard = build it yourself or run a server

---

## 1. Track symptoms, flares & patterns

| Name | Helps you… | Platform | Setup | Data | License | Notes |
|---|---|---|---|---|---|---|
| Perfice | Track anything and find patterns in it | 🤖 | Medium | On device | verify | Closest to a general flare tracker |
| Vibecheck | Log mood and symptoms together | 🤖 | Medium | On device, no account | verify | Same dev as Mooneva |
| Albi | General health tracking | 🤖 | Medium | verify | verify | |
| MediLog | Log blood pressure, weight, other vitals | 🤖 | Medium | On device | verify | F-Droid marks build non-reproducible |
| Medical Calendar Log | Log medical events in your phone's calendar | 🤖 | Medium | Your calendar | GPL-3.0-or-later (verify) | |
| Medic Log | Keep simple personal medical notes | 🤖 | Medium | On device | verify | |
| OpenVitals | Dashboard over Android Health Connect data | 🤖 | Medium | On device | verify | |
| Baseline | Gentle self-care for depression, disability, chronic illness, burnout | 🤖 | Medium | verify | verify | Explicitly for chronic illness; strong fit |

## 2. Mood & mental health

| Name | Helps you… | Platform | Setup | Data | License | Notes |
|---|---|---|---|---|---|---|
| Mood Cairns | Track mood with tags and charts | 🤖 | Medium | On device, **no network access** | verify | |
| FeelS | Name emotions with a feelings wheel | 🤖 | Medium | On device | verify | |
| MyMood | Minimal daily mood page | 🤖 | Medium | On device, passcode | MIT | |
| Daily You | Daily journal | 🤖 | Medium | On device | verify | |
| CBTAndroid | Seven-column CBT thought record | 🤖 | Medium | On device | verify | |
| moreDays | Motivation + journaling | 🤖 | Medium | On device | verify | |
| Loop Habit Tracker | Build and track habits | 🤖 | Easy | On device | GPL-3.0 | Mature, well-known |
| Medito | Free meditation, nonprofit | 🤖 🍎 | Easy | Account optional (verify) | verify | One of the few with iOS |

## 3. Medications

| Name | Helps you… | Platform | Setup | Data | License | Notes |
|---|---|---|---|---|---|---|
| MedTimer | Reminders, adherence log, CSV export for your doctor | 🤖 | Easy | On device, offline | MIT | Best-in-class; Play + F-Droid builds |
| Did I Take My Meds? | Log doses | 🤖 | Medium | On device | GPL-3.0-or-later (verify) | |
| Pill Time | Track **as-needed (PRN)** meds and time since last dose | 🤖 | Medium | On device | verify | Useful during flares |
| Featherline | HRT plans, reminders, logs | 🤖 | Medium | On device | GPL-3.0 (verify) | |
| Home Medkit | Track what's in your medicine cabinet + reminders | 🤖 | Medium | On device | GPL-3.0 (verify) | |
| RxDroid | Reminders + pill count / refills | 🤖 | Medium | On device | verify | F-Droid flags anti-features |
| Dosezy | Reminders | 🤖 | Medium | verify | MIT (verify) | Newer |

## 4. Cycle & reproductive health

| Name | Helps you… | Platform | Setup | Data | License | Notes |
|---|---|---|---|---|---|---|
| drip. | Track cycle, fertility, pain, mood | 🤖 🍎 | Easy | On device | GPL-3.0 | Gender-inclusive design |
| Mooneva Cycle | Period tracking with no internet permission | 🤖 🍎 | Easy | On device, encrypted | GPL-3.0-or-later | Single small company |
| OpenPillReminder | Birth control pill tracker | 🤖 | Medium | On device | verify | |

## 5. Diabetes

⚠️ These can control insulin delivery. List them with a clear "not medical advice / talk to your care team" banner.

| Name | Helps you… | Platform | Setup | License | Notes |
|---|---|---|---|---|---|
| xDrip+ | Read and alert on CGM data | 🤖 | Medium | GPL-3.0 | |
| Nightscout | Share CGM data with family / caregivers | 🖥 🌐 | Hard | AGPL-3.0 | Needs a server |
| AndroidAPS | Automated insulin delivery | 🤖 | Hard | AGPL-3.0 | You build it yourself |
| Trio | Automated insulin delivery | 🍎 | Hard | MIT | Nightscout Foundation–backed |
| Loop | Automated insulin delivery | 🍎 | Hard | MIT | |

## 6. Your medical records

| Name | Helps you… | Platform | Setup | License | Notes |
|---|---|---|---|---|---|
| Fasten | Pull records from providers into one private record for you or your family | 🖥 | Hard | GPL-3.0 | US patient-access APIs; limited value in Canada/EU. Also sells a paid desktop edition |
| Mere Medical | Same idea; timeline view | 🖥 | Hard | verify | Pre-release; single developer |

## 7. Body, sleep & food

| Name | Helps you… | Platform | Setup | License | Notes |
|---|---|---|---|---|---|
| Gadgetbridge | Use fitness bands and watches without the vendor's cloud | 🤖 | Medium | AGPL-3.0 | High value for privacy-minded people |
| Plees Tracker | Log sleep start and stop times | 🤖 | Medium | verify | No battery drain, CSV export |
| OpenTracks | Private GPS activity tracking | 🤖 | Medium | Apache-2.0 | |
| Open Food Facts | Scan food for ingredients and nutrition | 🤖 🍎 | Easy | AGPL-3.0 | Useful for food-trigger tracking |

## 8. Communication & accessibility

| Name | Helps you… | Platform | Setup | License | Notes |
|---|---|---|---|---|---|
| Cboard | Communicate with symbols + text-to-speech (AAC) | 🌐 🤖 🍎 | Easy | GPL-3.0 (verify) | **Verify it's still free**: a competing project claims a 2024 paywall |
| OptiKey | Type with eye gaze | 🖥 (Windows) | Medium | GPL-3.0 | |
| Sprout AAC | AAC for kids | — | — | verify | Pre-release; watchlist only |

## 9. Harm reduction

| Name | Helps you… | Platform | Setup | License | Notes |
|---|---|---|---|---|---|
| Journal (isaakhanimann) | Log substance use; check interactions | 🤖 | Medium | verify | Include only if you want harm reduction in scope; decide deliberately |

---

## Out of scope / excluded

- All clinical, EHR, imaging and health-IT infrastructure from v1. Revisit only if you add a "for clinics" section later.
- Proprietary "free" trackers (Bearable, CareClinic, Daylio, eMoods). These are what your audience uses today. A "switch from X" page could be your best entry point.

## Where to find more

- F-Droid categories: **Mental Health**, **Medication**, **Sports & Health**. This is the richest source by far.
- GitHub topics: `mood-tracker`, `health-tracking`, `quantified-self`, `self-hosted` + health.
- Nightscout org for the diabetes ecosystem.
- AlternativeTo "open source alternative to Bearable / Daylio / eMoods" pages, to find what people are fleeing.

## Issues this list surfaced

1. **Almost everything is Android-only, via F-Droid.** iOS FOSS health apps are rare, and the iOS diabetes apps require building from source. F-Droid itself currently says it's under threat from Google's changes to app installation. Platform and setup difficulty need to be the first thing a visitor sees, not the license.
2. **Most entries are single-maintainer hobby projects.** Your users will trust health data to these. Show a maintenance signal (last release, number of maintainers), and automate it.
3. **Lead with privacy, not licenses.** Your audience cares where their data lives and whether an account is required. Proposed fields: *data location* (on device / self-hosted / cloud), *account required*, *internet access*, *export format*, *last release*, *setup difficulty*. License goes in the detail view.
4. **HealthFlare and Inner Flare land squarely in sections 1 and 2.** List them with a visible "maintained by the index author" note. Otherwise the index reads as marketing.
