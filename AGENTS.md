# AGENTS.md

This repo contains a minimal Chrome Extension (Manifest V3) that adds an in-page panel on PitchBook and scrapes Search Results into clipboard-friendly TSV.

Project layout
- `phase1-extension/manifest.json`: MV3 manifest (PitchBook-only content script + service worker).
- `phase1-extension/background.js`: service worker; toggles the in-page panel.
- `phase1-extension/content.js`: content script panel + scraper + clipboard copy.
- `phase1-extension/README.md`: human setup notes.

Cursor/Copilot rules
- No `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md` found in this repo.
- If you add them later, keep this file in sync.

---

## Build / Lint / Test

There is no build system, dependency manager, or automated test runner configured.
Development is "edit JS/JSON + reload extension".

Load/run the extension (manual)
1. Chrome: `chrome://extensions`.
2. Enable Developer mode.
3. Click "Load unpacked".
4. Select `phase1-extension/`.
5. Open a `https://*.pitchbook.com/*` page.
6. Click the extension icon to toggle the in-page panel.

Reload after changes
- In `chrome://extensions`, click the extension's "Reload" button.
- Refresh the target PitchBook tab.

Backend endpoint
N/A (this extension scrapes and copies to clipboard; no backend calls).

Quick sanity checks (no deps)
- Syntax check (requires Node.js):
  - `node --check phase1-extension/background.js`
  - `node --check phase1-extension/content.js`
- JSON validity:
  - `python3 -m json.tool phase1-extension/manifest.json >/dev/null`

Manual "single test" scenarios (pick one)
- Panel toggle: click icon -> panel appears/disappears; no console errors.
- Scrape: open PitchBook Search Results -> click "Scrape" -> preview shows first row.
- Clipboard: after scrape, paste into a spreadsheet/text editor -> rows/columns align.
- PitchBook-only gate: on non-PitchBook URL the panel should not open and send should fail.

Note: Chrome blocks clipboard writes without a user gesture; scraping is wired to a button click.

Optional tooling (NOT currently configured)
- If you add lint/format:
  - ESLint (with a minimal browser/MV3 config) + Prettier.
  - Keep formatting aligned with existing style (2 spaces, double quotes, semicolons).
- If you add automated tests:
  - Consider Playwright for "load extension + click UI + assert message" flows.
  - Prefer a small smoke test suite over unit tests for DOM heuristics.

---

## Code Style Guidelines

This codebase is plain JavaScript (no bundler, no TS). Maintain the current style and patterns.

Formatting
- Indentation: 2 spaces.
- Quotes: double quotes for strings.
- Semicolons: required.
- Prefer template literals only for multi-line strings (e.g., the panel HTML).

Imports / modules
- No imports today (content scripts/service workers run as separate extension contexts).
- If you introduce modules, ensure MV3 supports it for the target file and update `manifest.json` accordingly.
- Do not assume a bundler; avoid requiring build-time transforms.

Naming
- `const` for constants; UPPER_SNAKE_CASE for file-level constants (e.g., `API_ENDPOINT`).
- camelCase for functions/variables (`inferSelectionTarget`, `selectedElement`).
- DOM ids/classes created by the extension should be prefixed: `hb-...`.
- Message types are string literals in SCREAMING_SNAKE_CASE: `"TOGGLE_PANEL"`, `"SEND_PAYLOAD"`.

Types / data shapes (informal)
- Scrape output is TSV (tab-separated cells, newline-separated rows) copied to clipboard.
- UI shows a preview of the first scraped row; full content is stored only in-memory (`lastTsv`).

Control flow
- Prefer early returns for guard checks (URL gating, missing selection, missing tab id).
- Keep event handlers short; delegate to named helpers.
- Avoid hidden global state: `phase1-extension/content.js` correctly wraps logic in an IIFE.

Error handling
- Prefer user-facing errors in the panel status area; avoid noisy console logs.
- Scraper throws `Error` with a helpful message; click handler catches and displays it.
- Clipboard copy uses `navigator.clipboard.writeText()` with `document.execCommand("copy")` fallback.

Chrome Extension specifics (MV3)
- Background is a service worker: no long-lived in-memory state; it may be suspended.
- Keep permissions tight:
  - Avoid broadening `host_permissions` beyond PitchBook + required backend.
  - Prefer adding specific permissions only when required.
- Validate origin in both directions:
  - `background.js` checks PitchBook URLs before toggling panel and before sending.
  - Keep these checks if you add new message types.

DOM / page safety
- Do not break the host page:
  - Only `preventDefault/stopPropagation` during selection mode.
  - Avoid adding global CSS; current approach uses inline styles on injected nodes.
- Use `pointerEvents: "none"` for overlays to avoid capturing clicks.
- Keep z-index values high (current overlays/panel use near-max values) so UI is visible.
- Treat `innerText`/`textContent` as potentially expensive; keep sampling bounded (see `text_sample`).

Scraping heuristics
- Prefer stable, high-signal selectors (ids/roles) over brittle layout divs.
- Keep fallbacks bounded; avoid selecting huge subtrees that produce massive `innerText`.

UI changes
- The panel HTML is in a template literal inside `ensurePanel()`.
- Keep the panel self-contained (no external assets).
- Prefer small UI changes; avoid redesigning unless requested.

Security / privacy
- Scraped data can be sensitive; do not log full exports by default.
- Do not persist scraped rows to `chrome.storage` unless explicitly required.

Versioning / manifest changes
- If behavior changes in a user-visible way, bump `manifest.json` `version`.
- When adding new files (icons, css), update `manifest.json` and verify they load.

---

## When You Change Things

Expected workflow
1. Update `phase1-extension/*.js` and/or `phase1-extension/manifest.json`.
2. Reload extension in `chrome://extensions`.
3. Refresh PitchBook tab.
4. Run one manual scenario from the list in "Manual single test scenarios".

Common pitfalls
- Forgetting to add new backend domains to `host_permissions`.
- Assuming background state persists (MV3 worker suspension).
- Injecting UI that collides with the host page (ids/classes without `hb-` prefix).
