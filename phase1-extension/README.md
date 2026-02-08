# Phase 1 Extension MVP

## What it does
- Adds an in-page panel on PitchBook pages.
- Runs a scraper on PitchBook Search Results when you click "Scrape".
- Shows a preview of the first row in the panel.
- Copies all rows (tab-separated) to your clipboard.

## Load in Chrome
1. Open `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Select the `phase1-extension` folder.

## Usage
1. Open a PitchBook page.
2. Click the extension icon to open the in-page panel.
3. Navigate to a PitchBook Search Results page.
4. Click "Scrape".

## Notes
- The scraper targets PitchBook Search Results table layout (`#search-results-data-table`).
- If PitchBook changes their DOM, update the selectors in `phase1-extension/content.js`.
