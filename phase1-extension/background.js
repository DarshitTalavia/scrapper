function isPitchBookUrl(url) {
  return typeof url === "string" && /https:\/\/[^/]*pitchbook\.com\//i.test(url);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendTogglePanelWithRetry(tabId) {
  const message = { type: "TOGGLE_PANEL" };
  let lastError = null;
  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      await chrome.tabs.sendMessage(tabId, message);
      return true;
    } catch (err) {
      lastError = err;
      await delay(80 * attempt);
    }
  }
  if (lastError) throw lastError;
  return false;
}

async function tryTogglePanel(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: "TOGGLE_PANEL" });
    return true;
  } catch (_err) {
    return false;
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  if (tab.url && !isPitchBookUrl(tab.url)) return;

  if (await tryTogglePanel(tab.id)) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });
  } catch (_err) {
    return;
  }

  try {
    await sendTogglePanelWithRetry(tab.id);
  } catch (_err) {
    // Ignore.
  }
});
