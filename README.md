<p align="center">
<img width="120" height="130" alt="Screenshot 2026-02-08 at 2 26 46 PM" src="https://github.com/user-attachments/assets/62ecce5a-2c52-4a50-b518-ae4217df1522" />
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

Go to the GitHub repository and click **green "Code" button → Download ZIP**.
<p align="center">
  <img width="700" alt="Screenshot 2026-02-08 at 2 12 02 PM" src="https://github.com/user-attachments/assets/d69df757-0e2e-4549-a5d7-f7f80c05862e" />

</p>

<br/>

### Step 2 · Unzip the Folder

Double click to extract the downloaded `.zip` file. You should see a folder called **`scraper-main`** inside.

<!-- 📸 SCREENSHOT: File explorer showing the unzipped folder -->
<p align="center">
  <img width="700" alt="Screenshot 2026-02-08 at 2 12 38 PM" src="https://github.com/user-attachments/assets/5b74d90b-3a66-4807-adb5-3d839dbc4d24" />

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
<img width="700" alt="Screenshot 2026-02-08 at 2 13 02 PM" src="https://github.com/user-attachments/assets/0485a84f-1113-436f-a98b-d0b0199ca40e" />

</p>

<br/>

### Step 4 · Load the Extension

Click **Load unpacked** (on the top left). Open the **scraper-main** folder you unzipped and select the **`phase1-extension`** folder inside it.

<!-- 📸 SCREENSHOT: "Load unpacked" button clicked, file picker selecting the folder -->
<p align="center">
 <img width="700" alt="Screenshot 2026-02-08 at 2 13 39 PM" src="https://github.com/user-attachments/assets/55f89ed1-0bb8-41c8-89c1-7d1f4b45b917" />

</p>

The extension should now appear in your extensions list. Pin it for easy access.

<!-- 📸 SCREENSHOT: Extension visible in chrome://extensions list -->
<p align="center">
  <img width="700" alt="Screenshot 2026-02-08 at 2 13 45 PM" src="https://github.com/user-attachments/assets/7d309292-7651-4bbf-b88b-f30d5c8061a7" />

</p>

<br/>

### Step 5 · Open PitchBook & Launch the Panel

Navigate to any **PitchBook** page and click the extension icon in your toolbar. The scraper panel will appear on the page.

<!-- 📸 SCREENSHOT: PitchBook page with the side panel open -->
<p align="center">
  <img width="700" alt="Screenshot 2026-02-08 at 2 16 59 PM" src="https://github.com/user-attachments/assets/b05c00e9-f9c4-4fd6-b2b2-d0dac661c012" />

</p>

<br/>

### Step 6 · Navigate to Search Results & Scrape

Go to a **PitchBook Search Results** page and click the **"Scrape"** button in the panel.

You'll see a **preview of the first row** in the panel, and the full dataset is copied to your clipboard.

<!-- 📸 SCREENSHOT: Panel showing the preview of scraped data -->
<p align="center">
<img width="700"  alt="Screenshot 2026-02-08 at 2 25 17 PM" src="https://github.com/user-attachments/assets/f4f129d5-7ae5-4222-bd37-b4adf60a750f" />

</p>

<br/>

### Step 7 · Paste into Excel

Open **Excel** (or Google Sheets) and hit **Ctrl+V** / **⌘+V**. Your data will appear in clean columns.

<!-- 📸 SCREENSHOT: Excel with the pasted data nicely in columns -->
<p align="center">
 <img width="700" alt="Screenshot 2026-02-08 at 2 26 23 PM" src="https://github.com/user-attachments/assets/cc1a47fd-df27-4e9d-a0f9-0d1866238764" />

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
