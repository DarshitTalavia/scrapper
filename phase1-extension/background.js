function isPitchBookUrl(url) {
  return typeof url === "string" && /https:\/\/[^/]*pitchbook\.com\//i.test(url);
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  if (tab.url && !isPitchBookUrl(tab.url)) return;

  try {
    await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_PANEL" });
  } catch (_err) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });
      await chrome.tabs.sendMessage(tab.id, { type: "TOGGLE_PANEL" });
    } catch (_err2) {
      // Ignore: likely non-PitchBook URL or injection blocked.
    }
  }
});
