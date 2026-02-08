<p align="center">
  <img src="assets/logo.png" alt="PitchBook Scraper Logo" width="120" />
</p>

<h1 align="center">PitchBook Scraper</h1>

<p align="center">
  <strong>Extract PitchBook search results to your clipboard in one click.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" />
  <img src="https://img.shields.io/badge/manifest-v3-34A853?style=for-the-badge&logo=json&logoColor=white" />
  <img src="https://img.shields.io/badge/status-Active-00C853?style=for-the-badge" />
  <img src="https://img.shields.io/badge/license-Private-8E24AA?style=for-the-badge" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/⚡_zero_config-just_install_and_go-FF6D00?style=flat-square" />
  <img src="https://img.shields.io/badge/📋_clipboard_ready-paste_anywhere-1565C0?style=flat-square" />
</p>

---

<br/>

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **One-Click Scrape** | Hit "Scrape" on any PitchBook search results page |
| 📋 **Clipboard Ready** | Data copied as tab-separated values — paste directly into Excel, Google Sheets, or anywhere |
| 👁️ **Live Preview** | See the first row of results in the extension panel before pasting |
| 🧩 **In-Page Panel** | Clean side panel that lives right inside PitchBook — no popups, no new tabs |

<br/>

---

<br/>

## 🚀 Getting Started

Follow the steps below to go from **downloading the extension → scraping data → pasting into Excel**.

<br/>

### Step 1 · Download the Extension

Go to the GitHub repository and click **Code → Download ZIP**.

<!-- 📸 SCREENSHOT: GitHub repo page with the green "Code" button open showing "Download ZIP" -->
<p align="center">
  <img src="assets/screenshots/01-download-zip.png" alt="Download ZIP from GitHub" width="700" />
</p>

<br/>

### Step 2 · Unzip the Folder

Extract the downloaded `.zip` file. You should see a folder called **`phase1-extension`** inside.

<!-- 📸 SCREENSHOT: File explorer showing the unzipped folder -->
<p align="center">
  <img src="assets/screenshots/02-unzip-folder.png" alt="Unzipped folder" width="700" />
</p>

<br/>

### Step 3 · Open Chrome Extensions

Open Chrome and navigate to:

```
chrome://extensions
```

Then toggle **Developer mode** ON (top-right corner).

<!-- 📸 SCREENSHOT: chrome://extensions page with Developer mode toggle highlighted -->
<p align="center">
  <img src="assets/screenshots/03-developer-mode.png" alt="Enable Developer Mode" width="700" />
</p>

<br/>

### Step 4 · Load the Extension

Click **Load unpacked** and select the **`phase1-extension`** folder you unzipped.

<!-- 📸 SCREENSHOT: "Load unpacked" button clicked, file picker selecting the folder -->
<p align="center">
  <img src="assets/screenshots/04-load-unpacked.png" alt="Load Unpacked Extension" width="700" />
</p>

The extension should now appear in your extensions list. Pin it for easy access.

<!-- 📸 SCREENSHOT: Extension visible in chrome://extensions list -->
<p align="center">
  <img src="assets/screenshots/05-extension-loaded.png" alt="Extension Loaded" width="700" />
</p>

<br/>

### Step 5 · Open PitchBook & Launch the Panel

Navigate to any **PitchBook** page and click the extension icon in your toolbar. The scraper panel will appear on the page.

<!-- 📸 SCREENSHOT: PitchBook page with the side panel open -->
<p align="center">
  <img src="assets/screenshots/06-panel-open.png" alt="Extension Panel on PitchBook" width="700" />
</p>

<br/>

### Step 6 · Navigate to Search Results & Scrape

Go to a **PitchBook Search Results** page and click the **"Scrape"** button in the panel.

<!-- 📸 SCREENSHOT: Search results page with "Scrape" button highlighted -->
<p align="center">
  <img src="assets/screenshots/07-click-scrape.png" alt="Click Scrape" width="700" />
</p>

You'll see a **preview of the first row** in the panel, and the full dataset is copied to your clipboard.

<!-- 📸 SCREENSHOT: Panel showing the preview of scraped data -->
<p align="center">
  <img src="assets/screenshots/08-scrape-preview.png" alt="Scrape Preview" width="700" />
</p>

<br/>

### Step 7 · Paste into Excel

Open **Excel** (or Google Sheets) and hit **Ctrl+V** / **⌘+V**. Your data will appear in clean columns.

<!-- 📸 SCREENSHOT: Excel with the pasted data nicely in columns -->
<p align="center">
  <img src="assets/screenshots/09-paste-excel.png" alt="Paste into Excel" width="700" />
</p>

<br/>

---

<br/>

## ⚠️ Usage Limits

> **Keep scraping under ~2,000 rows per day** to stay safe and avoid getting rate-limited or blocked by PitchBook.

<br/>

---

<br/>

## 📁 Project Structure

```
phase1-extension/
├── manifest.json        # Chrome extension config (Manifest V3)
├── content.js           # Injected scraper logic
├── background.js        # Service worker
├── panel.html           # In-page panel UI
├── panel.css            # Panel styles
└── icons/               # Extension icons
```

<br/>

---

<br/>

## 🛠️ Troubleshooting

| Problem | Fix |
|---------|-----|
| Extension not showing | Make sure **Developer mode** is on and you loaded the correct folder |
| Scrape button doesn't work | Ensure you're on a PitchBook **Search Results** page, not a profile page |
| Nothing pastes into Excel | Try clicking inside a cell first, then paste — some browsers need focus |

<br/>

---

<p align="center">
  <sub>Built for internal use · Not affiliated with PitchBook</sub>
</p>
