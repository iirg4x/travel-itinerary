# AI Trip JSON — Generation Guide

Copy this whole file into **Claude / ChatGPT / Gemini / any LLM**, paste your rough plan below it, and ask for one JSON object. Then paste the result into the app's **📁 Import JSON** dialog.

---

## Your task as the AI

You are generating a JSON object describing a multi-day travel itinerary that will be imported into a travel PWA. The user gives you a rough plan (destination, dates, traveller count, interests). You produce **one valid JSON object** matching the schema below — and **nothing else**. No markdown fences, no commentary, no leading or trailing text.

---

## The single most important thing

**The `label` and `note` fields carry the trip's voice.** Don't dump everything into `stopInfo`. A good entry reads like a travel writer's note — descriptive, specific, evocative. A bad entry reads like a database row.

| ❌ Bad | ✅ Good |
|---|---|
| `label`: "Visit a viewpoint" | `label`: "Lavaux Vineyards — Chexbres Viewpoint" |
| `label`: "Mountain top" | `label`: "Jungfraujoch — Top of Europe (3,454m)" |
| `label`: "Bridge" | `label`: "Chapel Bridge (Kapellbrücke) + Old Town" |
| `label`: "Sherlock Holmes waterfall", `stopInfo.tip`: "It's where Holmes died" | `label`: "Reichenbach Falls — the Sherlock Holmes waterfall" |
| `label`: "Lake walk", `stopInfo.tip`: "Take rowboat optional" | `label`: "Lake walk + optional rowboat hire", `note`: "3+ hours — one of the must-dos of the trip" |

**Use `note` to add atmosphere and context** — the kind of thing a friend would tell you:
- ✅ "UNESCO terraced vineyards overlooking Lake Geneva — the Riviera's signature view"
- ✅ "Europe's oldest covered wooden bridge, built 1333"
- ✅ "Marmots included with your ticket · La Rambertia alpine garden opens Jun–Sep"
- ✅ "Mountain road atmosphere — better than a long cruise if you enjoy driving"
- ✅ "Sphinx Observatory · Aletsch Glacier · Ice Palace · 3.5 hrs on summit"
- ❌ "Beautiful place" *(generic)*
- ❌ "Pick up rental SUV" *(belongs in `label`, not `note`)*

---

## When to use `stopInfo` — and when NOT to

`stopInfo` pills appear as small coloured rows under the label. **Every pill must earn its place.** If removing a pill loses no information, leave it out.

### `parking` — only when it actually matters
| ✅ Worth saying | ❌ Don't bother |
|---|---|
| "Grindelwald Terminal multi-storey (CHF 18/day)" | "Free street parking" *(everyone assumes this)* |
| "P+R Allmend CHF 12/day or Kesselturm garage CHF 3/h" | "Hotel parking" *(obvious from the day's hotel)* |
| "Park OUTSIDE Iseltwald village — metered access" | omit when not driving (airports, train stations, walking days) |

### `fee` — only for **paid** attractions
- `fee: 0` is only worth using as a **deliberate counterpoint** to nearby paid items ("Chillon — exterior photos only · Free"). For airports, beaches, viewpoints, public squares, casual walks: **omit `fee` entirely**. The user knows airports are free.
- `fee: <number>` → real entry/ticket cost, e.g. `fee: 18` for Trümmelbach Falls.
- `fee: { chf: 129.60, note: "RT from Grindelwald + seat res" }` → when the price needs context.

### `hours` — only for **non-obvious** operating times
| ✅ Worth saying | ❌ Don't bother |
|---|---|
| "Last gondola down 17:00 (May)" | "Open all day" *(meaningless)* |
| "First train 08:24" | "24/7" *(for airports — obvious)* |
| "Last cogwheel up 16:10" | "Open during business hours" *(no info)* |
| "Funicular every 30 min until 17:50" | repeating Google Maps' listed hours verbatim |

### `duration` — only when worth budgeting
| ✅ Worth saying | ❌ Don't bother |
|---|---|
| "3.5 hr on summit" | "1 hr" for an airport arrival |
| "~75 min lake walk" | "1.5 hr" for an obvious dinner |
| "45 min photo stop" | every casual stop |

### `tip` — only **actionable** insider advice
| ✅ Worth saying | ❌ Don't bother |
|---|---|
| "Sit on the right side going up for lake views" | "It's beautiful" |
| "Check live webcam night before — only go if clear" | "Bring a camera" |
| "Park OUTSIDE village & walk in — village access metered" | "Have fun" |
| "Tattoos OK — rare for Japanese onsen" | "Make a reservation" *(unless you've named the place)* |

### Rule of thumb
> If a stop has **only generic** info (`fee:0`, `hours:"Open all day"`, `duration:"1 hr"`), drop `stopInfo` entirely. A clean label with a good `note` is better than a label cluttered with empty pills.

---

## Schema

```jsonc
{
  // ── REQUIRED ──
  "name":          "string",      // "Japan 2026", "Iceland Ring Road"
  "startDate":     "YYYY-MM-DD",
  "endDate":       "YYYY-MM-DD",

  // ── OPTIONAL trip metadata ──
  "travelers":     2,
  "tagline":       "🗾 Tokyo + Kyoto", // short pill in hero
  "baseCurrency":  "JPY",              // ISO code, currency you spend in
  "homeCurrency":  "AED",              // ISO code, your bank's currency
  "budget":        12000,              // in homeCurrency, optional

  // ── DAYS ──
  "days": [
    {
      "title":        "Tokyo Arrival",       // required, descriptive
      "date":         "2026-10-15",          // required
      "town":         "Tokyo",
      "tags":         ["🛫 Arrival", "🏨 Park Hyatt"],
      "routeMapUrl":  "",                    // leave blank — auto-built from stops
      "timeline": [
        {
          "time":       "14:00",
          "label":      "Haneda Airport — clear customs & pick up Suica",
          "placeQuery": "Tokyo Haneda Airport",
          "note":       "JR ticket counter is left of arrivals — quicker than the kiosks",
          "kind":       "normal"
          // ← no stopInfo needed for an airport
        }
      ]
    }
  ]
}
```

### Field reference

| Field | Type | Notes |
|---|---|---|
| `name` | string | Trip name. |
| `startDate` / `endDate` | `YYYY-MM-DD` | Inclusive. |
| `travelers` | integer | Default 2. |
| `tagline` | string | Hero pill. Emoji + short. |
| `baseCurrency` / `homeCurrency` | ISO 4217 | E.g. `JPY` / `AED`. |
| `budget` | number | In `homeCurrency`. Tracker shows % used. Omit for no cap. |
| **Day** | | |
| `title` | string | What's the day about? Specific not generic. |
| `date` | `YYYY-MM-DD` | |
| `town` | string | Optional. |
| `tags` | string[] | Emoji + short label each. |
| `routeMapUrl` | string | **Leave blank** — auto-built from stops' `placeQuery`. Only override if you have a specific waypoint sequence. |
| `timeline` | array | **Sorted by time ascending.** |
| **Stop** | | |
| `time` | `HH:MM` | 24-hour. |
| `label` | string | The descriptive line. **This is where the trip's voice lives.** See examples. |
| `placeQuery` | string | Google Maps search query. Specific names only. Omit for vague stops ("Dinner nearby"). |
| `note` | string | Atmospheric / context line. One sentence. |
| `kind` | enum | `"normal"` / `"highlight"` (red dot, ~1–3 per day) / `"sleep"` (last item of the day). |
| `stopInfo` | object | **Only when it actually adds value.** See "When to use stopInfo" above. |
| `bookLink` | `{label, url}` | Klook search URLs only. Skip for free / non-bookable stops. |

### `bookLink` — Klook only

```json
"bookLink": {
  "label": "Book on Klook",
  "url":   "https://www.klook.com/search/?query=jungfraujoch"
}
```

Add **only** for paid attractions / experiences that exist as a bookable product (cable cars, cog railways, castle entries, guided tours, day cruises, museum tickets). **Skip** for restaurants, free sights, airport arrivals, hotel check-ins, transit.

---

## Anti-patterns to avoid

These are the most common mistakes AIs make when generating trip JSON. Don't.

### 1. Pill spam on obvious stops
```jsonc
// ❌ Bad — every airport gets the same useless triplet
{
  "time": "11:00",
  "label": "Arrive at Salalah Airport",
  "stopInfo": { "fee": 0, "duration": "1 hr", "hours": "24/7" }
}

// ✅ Good — clean, lets the next item shine
{
  "time": "11:00",
  "label": "Arrive at Salalah Airport — pick up rental SUV",
  "placeQuery": "Salalah Airport",
  "kind": "normal"
}
```

### 2. Generic labels with info dumped to fields
```jsonc
// ❌ Bad — label is bland, real info hidden in note/tip
{
  "time": "16:00",
  "label": "Visit a viewpoint",
  "note": "It's a famous vineyard area",
  "stopInfo": { "tip": "Best at sunset" }
}

// ✅ Good — label is the headline, note is the colour
{
  "time": "16:00",
  "label": "Lavaux Vineyards — Chexbres Viewpoint",
  "placeQuery": "Lavaux Vineyards Chexbres Viewpoint",
  "note": "UNESCO terraced vineyards overlooking Lake Geneva — the Riviera's signature view",
  "kind": "highlight"
}
```

### 3. Hours / fee filled with meaningless values
```jsonc
// ❌ Bad — adds pills, removes nothing if deleted
"stopInfo": { "fee": 0, "hours": "Open all day", "duration": "1 hr" }

// ✅ Good — only what's worth saying
"stopInfo": { "tip": "Rocks become slippery during Khareef rain" }
```

### 4. Restating the obvious
```jsonc
// ❌ Bad — duration on a dinner
{ "label": "Dinner at Le Mary Celeste", "stopInfo": { "duration": "1.5 hr" } }

// ✅ Good — no stopInfo needed
{ "label": "Dinner at Le Mary Celeste", "placeQuery": "Le Mary Celeste Paris",
  "stopInfo": { "tip": "Book a table 1 week ahead — small natural-wine bar" } }
```

### 5. Generic tags
```jsonc
// ❌ Bad
"tags": ["Day 1", "Travel"]

// ✅ Good — distinct emoji + concrete content
"tags": ["🚗 Scenic Drive", "🏰 Chillon", "🛏 Le Mirador"]
```

---

## Two good examples to model on

### Example A — a richly-labelled day (mountain trip)

```json
{
  "title": "Rochers-de-Naye + Alpine Scenic Drive Loop",
  "date": "2026-05-27",
  "tags": ["🚞 Cog Railway", "⛰ 2,042m Peak", "🚗 Alpine Loop"],
  "timeline": [
    {
      "time": "08:30",
      "label": "Drive down to Montreux station — board the cog railway",
      "placeQuery": "Montreux Railway Station Switzerland",
      "kind": "normal"
    },
    {
      "time": "09:24",
      "label": "Rochers-de-Naye — 50-min cog railway to 2,042m",
      "placeQuery": "Rochers-de-Naye Switzerland",
      "note": "Sweeping panorama over Lake Geneva to the Alps · climbs 1,600m",
      "kind": "highlight",
      "stopInfo": { "tip": "Sit on the right going up for lake views" },
      "bookLink": { "label": "Book on Klook", "url": "https://www.klook.com/search/?query=rochers-de-naye" }
    },
    {
      "time": "10:30",
      "label": "Marmot Paradise + summit ridge walks",
      "placeQuery": "Marmot Paradise Rochers-de-Naye",
      "note": "Marmots included with your ticket · La Rambertia alpine garden opens Jun–Sep",
      "kind": "highlight"
    },
    {
      "time": "14:00",
      "label": "Start alpine scenic drive: Villars-sur-Ollon",
      "placeQuery": "Villars-sur-Ollon Switzerland",
      "note": "Mountain road atmosphere — better than a long cruise if you enjoy driving",
      "kind": "highlight"
    },
    {
      "time": "16:30",
      "label": "Gstaad — coffee stop + short village walk",
      "placeQuery": "Gstaad Switzerland",
      "kind": "normal"
    },
    {
      "time": "18:15",
      "label": "Gruyères — medieval village evening stop",
      "placeQuery": "Gruyeres Switzerland",
      "note": "Short walk, photos, dinner nearby",
      "kind": "highlight"
    },
    {
      "time": "21:30",
      "label": "Scenic drive back to Le Mirador",
      "kind": "sleep"
    }
  ]
}
```

Note how:
- Most stops have **no** `stopInfo`. The label + note do the work.
- Only one stop has `stopInfo`, and it's a single actionable tip.
- Labels include specific details (50-min cog, 2,042m, "scenic drive: Villars-sur-Ollon").
- Notes add atmosphere ("Mountain road atmosphere — better than a long cruise…").
- Last stop is `kind: "sleep"`.

### Example B — a richly-labelled day (city + nature)

```json
{
  "title": "Lucerne + Chapel Bridge + Mount Pilatus",
  "date": "2026-05-31",
  "tags": ["🌉 Old Town", "⛰ Pilatus 2,132m"],
  "timeline": [
    {
      "time": "08:00",
      "label": "Lungern Viewpoint — lake-in-valley panorama",
      "placeQuery": "Lungern Viewpoint Switzerland",
      "kind": "highlight"
    },
    {
      "time": "09:45",
      "label": "Chapel Bridge (Kapellbrücke) + Old Town",
      "placeQuery": "Kapellbrucke Chapel Bridge Lucerne",
      "note": "Europe's oldest covered wooden bridge, built 1333",
      "kind": "highlight"
    },
    {
      "time": "14:30",
      "label": "Mount Pilatus — cable car from Kriens (2,132m)",
      "placeQuery": "Mount Pilatus Switzerland",
      "note": "World's steepest cogwheel railway option",
      "kind": "highlight",
      "stopInfo": {
        "fee": { "chf": 59.90, "note": "Golden Round Trip incl. boat + cogwheel + cableway" },
        "hours": "Last cogwheel up 16:10",
        "duration": "4–5 hr",
        "tip": "UP via cogwheel from Alpnachstad is scarier; DOWN via cableway is faster"
      },
      "bookLink": { "label": "Book on Klook", "url": "https://www.klook.com/search/?query=mount%20pilatus%20golden%20round%20trip" }
    },
    {
      "time": "22:00",
      "label": "Drive back to Interlaken (~1h 20m)",
      "note": "⚠ Longest day — expect ~23:30 hotel arrival",
      "kind": "sleep"
    }
  ]
}
```

Note the variety: **most stops are minimal**, only the Pilatus highlight earns a full `stopInfo` block because every field there carries real information (the multi-modal fee, the operating cutoff, the genuine "which way is scarier" insight).

---

## Pre-flight checklist before you return JSON

- [ ] Every label is **specific** — names places, includes useful detail (elevation, distance, era, signature dish)
- [ ] Atmospheric / contextual text lives in `note`, not `stopInfo.tip`
- [ ] No `fee: 0` on airports, beaches, viewpoints, casual stops
- [ ] No `hours: "Open all day"` / `"24/7"` / `"08:00–22:00"` for non-noteworthy times
- [ ] No `duration` on trivial stops (airport arrivals, casual meals)
- [ ] `tip` is **actionable** — would change what the traveller does
- [ ] `kind: "highlight"` is on 1–3 stops per day, not every stop
- [ ] Last stop of the day is `kind: "sleep"`
- [ ] `placeQuery` is a specific Google-searchable name, omitted when stop is vague
- [ ] `bookLink` only on paid attractions; only Klook URLs
- [ ] `tags` use emoji + short label (no "Day 1" / "Travel" generics)
- [ ] Dates ISO, times 24h, days sorted, timeline within each day sorted by time
- [ ] No prose outside the JSON. No code fences. Raw JSON only.

Return only the JSON object. Nothing else.
