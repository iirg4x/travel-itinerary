# Travel Itinerary

A self-hosted multi-trip travel planner. Installable as a PWA on iPhone / Android. Single static HTML file, no build step, no server, no account.

Built for trips like *"Switzerland 8 days, two of us, want Jungfraujoch + Lucerne + lakes — and track every CHF I spend in AED."*

---

## What it does

- **Multi-trip switcher** — add unlimited trips, switch instantly, each with its own days, checklists, and expenses
- **Day-by-day editor** — add days, drag in stops with full info (parking · fee · opening hours · duration · tips · booking links)
- **Auto-built routes** — every day card has a *📍 Route in Maps* button that strings your stops into a Google Maps directions URL
- **Multi-currency expense tracker** — log expenses in any of 40+ currencies, auto-normalized to your trip's base currency, total shown in your home currency. Set a budget cap with a progress bar.
- **Live FX** — pulled from `open.er-api.com` (no API key, no tracking). Cached offline.
- **PDF export** — full expense report with category breakdown, ready for reimbursement
- **Pre-departure checklist** — 30-item template covering documents, money, packing, flight day; ticks saved per device
- **Offline-first** — service worker caches the entire app shell. Loads in milliseconds on airplane mode.
- **Dark mode** — auto-detects system preference, persists choice, updates iOS status bar colour
- **Arabic / RTL** — full translations for all UI strings; layout flips for RTL
- **JSON import/export** — share trips between devices, or generate JSON from any AI by pasting the included [AI_JSON_GUIDE.md](./AI_JSON_GUIDE.md)
- **No tracking** — only outbound network calls are to `open.er-api.com` (FX) and `api.open-meteo.com` (weather). Everything else lives in `localStorage` on the device.

---

## Quick start (try it locally)

```bash
git clone https://github.com/<your-username>/travel-itinerary.git
cd travel-itinerary
# That's it — open index.html in any browser
```

Or just open `index.html` directly. There's no build step.

---

## Deploy to GitHub Pages (one-time setup)

1. **Push this repo to GitHub** (see *Pushing your fork* below).
2. In your GitHub repo: **Settings → Pages**.
3. Under **Build and deployment**:
   - **Source**: `GitHub Actions`
4. Wait ~30 seconds for the first run of `.github/workflows/pages.yml`.
5. Your app is live at `https://<your-username>.github.io/travel-itinerary/`.

Every push to `main` auto-deploys via the included workflow.

---

## Install on iPhone

1. Open the GitHub Pages URL in **Safari** (not in-app browsers).
2. Tap the share icon → **Add to Home Screen**.
3. Launches fullscreen, works offline.

On Android: same flow in Chrome — you'll get a native install prompt instead.

---

## File structure

```
.
├── index.html               # The entire app (HTML + CSS + JS in one file)
├── manifest.json            # PWA metadata
├── service-worker.js        # Offline caching strategy
├── icons/                   # PNG icons (32, 180, 192, 512 + maskable variants)
├── AI_JSON_GUIDE.md         # Copy-paste prompt for generating trip JSON via any LLM
├── _headers                 # Cloudflare Pages cache headers (ignored by GitHub Pages)
├── .nojekyll                # Tells GitHub Pages to serve files verbatim
├── .github/workflows/
│   └── pages.yml            # Auto-deploy on push to main
├── deploy.ps1               # Optional PowerShell helper for non-GitHub-Pages hosts
└── README.md                # You're reading it
```

---

## Updating the app

When you edit `index.html` (or any other file), bump the cache version in `service-worker.js`:

```js
const SHELL_CACHE = 'swiss-shell-vN';   // increment N
```

Then push:

```bash
git add -A
git commit -m "Describe the change"
git push
```

GitHub Pages auto-deploys (~30 s). Installed devices see a *"New version available · Reload"* banner on next open.

---

## Adding a new trip

Three ways, in order of fastest:

### 1. From scratch in the app
Trip switcher → **+ New trip** → fill name, dates, currencies, budget → **+ Add day** → **+ Stop** for each timeline item. All editable forever after.

### 2. Import JSON
Trip switcher → **📁 Import JSON** → paste a trip object. Schema is documented in [AI_JSON_GUIDE.md](./AI_JSON_GUIDE.md).

### 3. Have an AI generate JSON for you
1. Open Claude / ChatGPT / Gemini in another tab
2. In the import modal, tap **📋 Copy AI prompt** — copies the full schema + voice guide
3. Paste into the AI chat, then add your rough plan ("we're going to Bali Oct 5–12, surf + temples")
4. AI returns valid JSON, paste back into the import dialog
5. Done — your trip is live, fully editable

---

## Pushing your fork

If you cloned this from someone else and want your own GitHub repo:

```bash
# Create an empty repo on github.com first (no README, no .gitignore)
# Then in this folder:
git remote remove origin                                    # if it exists
git remote add origin https://github.com/<you>/travel-itinerary.git
git push -u origin main
```

Then follow the **Deploy to GitHub Pages** section above.

---

## Privacy

The app makes outbound requests to exactly two domains:

- **`api.open-meteo.com`** — weather forecasts (no key, no tracking)
- **`open.er-api.com`** (with `cdn.jsdelivr.net` fallback) — FX rates

Trip data, expenses, and checklist progress are stored in `localStorage` on the device only. **Nothing syncs between devices.** Use **📤 Export trip as JSON** to back up or move trips.

---

## Tech

- One static `index.html` (~5,500 lines) — HTML, CSS, and JS inlined
- ES6+ JavaScript, no transpiler, no bundler
- Service worker (vanilla, no Workbox)
- Web App Manifest
- No frameworks, no dependencies

The whole thing weighs ~250 KB uncompressed, ~50 KB gzipped.

---

## License

MIT — see [LICENSE](./LICENSE).
