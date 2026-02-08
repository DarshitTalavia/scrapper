(function () {
  const PANEL_ID = "hb-panel-root";

  let panelRoot = null;
  let lastTsv = "";
  let lastRows = [];
  let lastRowCount = 0;
  let lastCopiedOk = false;

  function setStatus(text, isError) {
    if (!panelRoot) return;
    const statusEl = panelRoot.querySelector("#hb-status");
    statusEl.textContent = text;
    statusEl.style.color = isError ? "#dc2626" : "#0f766e";
  }

  function setMoreIndicator(rowCount) {
    if (!panelRoot) return;
    const moreEl = panelRoot.querySelector("#hb-preview-more");
    if (!moreEl) return;

    const maxPreviewRows = 5;
    const remaining = typeof rowCount === "number" ? Math.max(rowCount - maxPreviewRows, 0) : 0;
    if (!remaining) {
      moreEl.style.display = "none";
      moreEl.textContent = "";
      return;
    }

    moreEl.style.display = "block";
    moreEl.textContent = lastCopiedOk ? `... + ${remaining} more rows copied` : `... + ${remaining} more rows`;
  }

  function renderPreview(rows, rowCount) {
    if (!panelRoot) return;
    panelRoot.querySelector("#hb-rows").textContent = typeof rowCount === "number" ? String(rowCount) : "-";

    const previewWrap = panelRoot.querySelector("#hb-preview");
    const emptyEl = panelRoot.querySelector("#hb-preview-empty");
    const tableEl = panelRoot.querySelector("#hb-preview-table");
    if (!previewWrap || !emptyEl || !tableEl) return;

    const safeRows = Array.isArray(rows) ? rows : [];
    const maxPreviewRows = 5;
    const maxPreviewCols = 50;

    const previewRows = safeRows.slice(0, maxPreviewRows).map((r) => String(r || "").split("\t"));
    const maxColsFound = previewRows.reduce((acc, cells) => Math.max(acc, cells.length), 0);
    const hasData = previewRows.length > 0 && maxColsFound > 0;

    tableEl.innerHTML = "";
    if (!hasData) {
      emptyEl.style.display = "block";
      return;
    }

    emptyEl.style.display = "none";

    const needsOverflowCol = maxColsFound > maxPreviewCols;
    const colCount = Math.min(maxColsFound, maxPreviewCols) + (needsOverflowCol ? 1 : 0);

    for (const cells of previewRows) {
      const tr = document.createElement("tr");

      for (let i = 0; i < colCount; i += 1) {
        const td = document.createElement("td");
        td.style.padding = "6px 8px";
        td.style.borderBottom = "1px solid #e2e8f0";
        td.style.borderRight = "1px solid #e2e8f0";
        td.style.verticalAlign = "top";
        td.style.maxWidth = "180px";
        td.style.whiteSpace = "nowrap";
        td.style.overflow = "hidden";
        td.style.textOverflow = "ellipsis";

        if (needsOverflowCol && i === colCount - 1) {
          td.textContent = "...";
          td.style.textAlign = "center";
          td.style.opacity = "0.7";
          tr.appendChild(td);
          continue;
        }

        const raw = cells[i] == null ? "" : String(cells[i]);
        td.textContent = raw;
        if (raw) td.title = raw;
        tr.appendChild(td);
      }

      tableEl.appendChild(tr);
    }

    setMoreIndicator(rowCount);
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

  function findSplitTableContainer() {
    const byId = document.querySelector("#search-results-data-table");
    if (byId) return byId;

    const tbodies = Array.from(document.querySelectorAll(".data-table__tbody"));
    if (!tbodies.length) return null;

    const candidates = new Map();
    for (const tbody of tbodies) {
      let current = tbody;
      for (let depth = 0; depth < 10 && current; depth += 1) {
        if (!(current instanceof Element)) break;
        const tbodyCount = current.querySelectorAll(".data-table__tbody").length;
        const rowCount = current.querySelectorAll(".data-table__row").length;
        if (tbodyCount >= 2 && rowCount >= 1) {
          const existing = candidates.get(current);
          const score = -depth;
          if (!existing || score > existing) {
            candidates.set(current, score);
          }
        }
        current = current.parentElement;
      }
    }

    let best = null;
    let bestScore = -Infinity;
    for (const [el, score] of candidates.entries()) {
      if (score > bestScore) {
        best = el;
        bestScore = score;
      }
    }
    return best;
  }

  function deepDrillScrape() {
    const container = findSplitTableContainer();
    if (!container) {
      throw new Error("Table not found. Open a PitchBook list page and wait for it to load.");
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
            .querySelectorAll(
              ".number, .tooltip, .hidden, [class*='actions'], [style*='display: none'], [aria-hidden='true']"
            )
            .forEach((el) => el.remove());

          let text = clone.innerText
            .replace(/[\r\n]+/g, " ")
            .replace(/\t/g, " ")
            .replace(/\s{2,}/g, " ")
            .trim();

          // Remove PitchBook-style row index prefixes like "1. Google".
          text = text.replace(/^\s*\d+\.\s+/, "");

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
      rows,
      rowCount: rows.length
    };
  }

  async function onScrape() {
    ensurePanel();
    setStatus("Scraping and copying...", false);
    lastCopiedOk = false;

    let result;
    try {
      result = deepDrillScrape();
    } catch (err) {
      lastTsv = "";
      lastRows = [];
      lastRowCount = 0;
      renderPreview(lastRows, lastRowCount);
      setStatus(err && err.message ? err.message : "Scrape failed.", true);
      return;
    }

    lastTsv = result.tsv;
    lastRows = result.rows;
    lastRowCount = result.rowCount;
    renderPreview(lastRows, lastRowCount);

    const copied = await copyToClipboard(lastTsv);
    if (!copied) {
      setStatus(`Scraped ${lastRowCount} rows. Clipboard copy failed (try again).`, true);
      setMoreIndicator(lastRowCount);
      return;
    }

    lastCopiedOk = true;
    setMoreIndicator(lastRowCount);
    setStatus("Copied to clipboard - you can paste it in Excel or anywhere you like.", false);
  }

  async function onCopyAgain() {
    ensurePanel();
    if (!lastTsv) {
      setStatus("Nothing to copy yet. Click Scrape first.", true);
      return;
    }
    const copied = await copyToClipboard(lastTsv);
    setStatus(
      copied ? "Copied to clipboard - you can paste it in Excel or anywhere you like." : "Clipboard copy failed.",
      !copied
    );
  }

  function ensurePanel() {
    if (panelRoot) return panelRoot;

    panelRoot = document.createElement("div");
    panelRoot.id = PANEL_ID;
    panelRoot.innerHTML = `
      <div id="hb-panel" style="position:fixed;top:80px;right:16px;width:520px;z-index:2147483647;background:#ffffff;border:1px solid #cbd5e1;border-radius:10px;box-shadow:0 8px 20px rgba(2,6,23,.2);font-family:Segoe UI,Tahoma,sans-serif;color:#0f172a;">
        <div style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;font-size:13px;display:flex;justify-content:space-between;align-items:center;">
          <span>PitchBook Data Scraper</span>
          <button id="hb-close" style="border:none;background:transparent;font-size:16px;cursor:pointer;line-height:1;">x</button>
        </div>
        <div style="padding:10px 12px;display:flex;flex-direction:column;gap:10px;">
          <div style="display:flex;gap:8px;">
            <button id="hb-scrape" style="flex:1;border:none;border-radius:8px;padding:8px 10px;background:#0284c7;color:#fff;font-weight:700;cursor:pointer;">Scrape</button>
            <button id="hb-copy" style="flex:1;border:none;border-radius:8px;padding:8px 10px;background:#334155;color:#fff;font-weight:700;cursor:pointer;">Copy Again</button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;">
            <div><strong>Rows:</strong> <span id="hb-rows">-</span></div>
            <div style="opacity:.75;">Preview: first 5 rows</div>
          </div>

          <div id="hb-preview" style="margin:0;max-height:200px;overflow:auto;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
            <div id="hb-preview-empty" style="padding:10px;font-size:11px;opacity:.7;">(click Scrape)</div>
            <table id="hb-preview-table" style="width:100%;border-collapse:collapse;font-size:11px;"></table>
          </div>
          <div id="hb-preview-more" style="display:none;font-size:11px;opacity:.75;text-align:left;padding:2px 2px 0 2px;"></div>
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
      renderPreview(lastRows, lastRowCount);
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
