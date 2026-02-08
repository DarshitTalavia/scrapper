(function () {
  const PANEL_ID = "hb-panel-root";

  let panelRoot = null;
  let lastTsv = "";
  let lastPreview = "";
  let lastRowCount = 0;

  function setStatus(text, isError) {
    if (!panelRoot) return;
    const statusEl = panelRoot.querySelector("#hb-status");
    statusEl.textContent = text;
    statusEl.style.color = isError ? "#dc2626" : "#0f766e";
  }

  function renderPreview(previewRow, rowCount) {
    if (!panelRoot) return;
    panelRoot.querySelector("#hb-rows").textContent = typeof rowCount === "number" ? String(rowCount) : "-";
    panelRoot.querySelector("#hb-preview").textContent = previewRow || "(no rows found)";
  }

  function execCommandCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0px";
    document.body.appendChild(textArea);
    textArea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textArea);
    return ok;
  }

  async function copyToClipboard(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (_err) {
      // Fall back to execCommand.
    }
    try {
      return execCommandCopy(text);
    } catch (_err2) {
      return false;
    }
  }

  function deepDrillScrape() {
    const container = document.querySelector("#search-results-data-table");
    if (!container) {
      throw new Error("Table not found. Open the Search Results page and wait for it to load.");
    }

    const rowContainers = Array.from(container.querySelectorAll(".data-table__tbody"));
    if (rowContainers.length < 2) {
      throw new Error("Could not find left/right split. Wait for the table to finish rendering.");
    }

    const leftRows = Array.from(rowContainers[0].querySelectorAll(".data-table__row"));
    const rightRows = Array.from(rowContainers[1].querySelectorAll(".data-table__row"));
    if (!leftRows.length) {
      throw new Error("No rows found.");
    }

    const getDeepCells = (row) => {
      if (!row) return "";

      let cells = Array.from(row.querySelectorAll("[role='gridcell']"));
      if (cells.length === 0) {
        cells = Array.from(row.querySelectorAll(".data-table__cell"));
      }
      if (cells.length === 0) {
        cells = Array.from(row.querySelectorAll("div")).filter(
          (div) => div.querySelectorAll("div").length === 0 && div.innerText.trim().length > 0
        );
      }

      return cells
        .map((cell) => {
          const clone = cell.cloneNode(true);
          clone
            .querySelectorAll(".number, .tooltip, .hidden, [class*='actions'], [style*='display: none']")
            .forEach((el) => el.remove());

          let text = clone.innerText
            .replace(/[\r\n]+/g, " ")
            .replace(/\t/g, " ")
            .replace(/\s{2,}/g, " ")
            .trim();

          if (text.includes(",") || text.includes('"')) {
            text = `"${text.replace(/"/g, '""')}"`;
          }
          return text;
        })
        .join("\t");
    };

    const rows = leftRows.map((leftRow, index) => {
      const rightRow = rightRows[index];
      return getDeepCells(leftRow) + "\t" + (rightRow ? getDeepCells(rightRow) : "");
    });

    return {
      tsv: rows.join("\n"),
      preview: rows[0] || "",
      rowCount: rows.length
    };
  }

  async function onScrape() {
    ensurePanel();
    setStatus("Scraping...", false);

    let result;
    try {
      result = deepDrillScrape();
    } catch (err) {
      renderPreview("", 0);
      setStatus(err && err.message ? err.message : "Scrape failed.", true);
      return;
    }

    lastTsv = result.tsv;
    lastPreview = result.preview;
    lastRowCount = result.rowCount;
    renderPreview(lastPreview, lastRowCount);

    const copied = await copyToClipboard(lastTsv);
    if (!copied) {
      setStatus(`Scraped ${lastRowCount} rows. Clipboard copy failed (try again).`, true);
      return;
    }

    setStatus(`Copied ${lastRowCount} rows to clipboard. Preview shows row 1.`, false);
  }

  async function onCopyAgain() {
    ensurePanel();
    if (!lastTsv) {
      setStatus("Nothing to copy yet. Click Scrape first.", true);
      return;
    }
    const copied = await copyToClipboard(lastTsv);
    setStatus(copied ? `Copied ${lastRowCount} rows to clipboard.` : "Clipboard copy failed.", !copied);
  }

  function ensurePanel() {
    if (panelRoot) return panelRoot;

    panelRoot = document.createElement("div");
    panelRoot.id = PANEL_ID;
    panelRoot.innerHTML = `
      <div id="hb-panel" style="position:fixed;top:80px;right:16px;width:380px;z-index:2147483647;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;box-shadow:0 8px 20px rgba(2,6,23,.2);font-family:Segoe UI,Tahoma,sans-serif;color:#0f172a;">
        <div style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;display:flex;justify-content:space-between;align-items:center;">
          <span>scraper</span>
          <button id="hb-close" style="border:none;background:transparent;font-size:16px;cursor:pointer;line-height:1;">x</button>
        </div>
        <div style="padding:10px 12px;display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;gap:8px;">
            <button id="hb-scrape" style="flex:1;border:none;border-radius:8px;padding:8px 10px;background:#0284c7;color:#fff;font-weight:700;cursor:pointer;">Scrape</button>
            <button id="hb-copy" style="flex:1;border:none;border-radius:8px;padding:8px 10px;background:#334155;color:#fff;font-weight:700;cursor:pointer;">Copy Again</button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
            <div><strong>Rows:</strong> <span id="hb-rows">-</span></div>
            <div style="opacity:.75;">Preview: first row</div>
          </div>

          <pre id="hb-preview" style="margin:0;max-height:160px;overflow:auto;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px;font-size:11px;white-space:pre;word-break:normal;">(click Scrape)</pre>
          <div id="hb-status" style="font-size:12px;color:#0f766e;min-height:16px;"></div>
        </div>
      </div>
    `;

    document.documentElement.appendChild(panelRoot);

    panelRoot.querySelector("#hb-close").addEventListener("click", () => {
      panelRoot.style.display = "none";
    });
    panelRoot.querySelector("#hb-scrape").addEventListener("click", () => {
      onScrape();
    });
    panelRoot.querySelector("#hb-copy").addEventListener("click", () => {
      onCopyAgain();
    });

    return panelRoot;
  }

  function togglePanel() {
    ensurePanel();
    panelRoot.style.display = panelRoot.style.display === "none" ? "block" : "none";
    if (panelRoot.style.display !== "none") {
      renderPreview(lastPreview, lastRowCount);
      setStatus("Panel ready.", false);
    }
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message || !message.type) return;

    if (message.type === "TOGGLE_PANEL") {
      togglePanel();
      sendResponse({ ok: true });
    }
  });
})();
