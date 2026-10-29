import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

// Builds a PDF summary of one hosted report entirely in the browser, from the
// same JSON files the report itself loads:
//   Allure → widgets/summary.json, data/suites.json, data/test-cases/<uid>.json
//   JMeter → statistics.json
// Loaded lazily from main.jsx, so jsPDF is only downloaded when someone asks for a PDF.

const MARGIN = 40;
const INK = [15, 23, 42];
const MUTED = [100, 116, 139];
const LINE = [226, 232, 240];

const STATUS_RGB = {
  passed:  [15, 157, 99],
  failed:  [220, 38, 38],
  broken:  [217, 119, 6],
  skipped: [100, 116, 139],
  unknown: [124, 58, 237],
};
const STATUS_ORDER = { failed: 0, broken: 1, unknown: 2, skipped: 3, passed: 4 };

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

// The built-in PDF fonts only cover Latin-1: swap common typographic characters
// and replace anything else, otherwise jsPDF prints garbage.
const clean = (s) =>
  String(s ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/\r/g, "")
    .replace(/[^\n\x20-\x7e\xa0-\xff]/g, "?");

const truncate = (s, n) => (s.length > n ? s.slice(0, n - 3) + "..." : s);

const fmtDuration = (ms) => {
  if (ms == null) return "-";
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${Math.round(s % 60)}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
};

const fmtMs = (ms) => (ms == null ? "-" : ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`);

const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-US", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

const fetchJson = (url) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`${r.status} ${r.statusText} - ${url}`);
    return r.json();
  });

// ── Layout pieces ────────────────────────────────────────────────────────────

function drawHeader(doc, report, runLine) {
  const w = doc.internal.pageSize.getWidth();
  const accent = hexToRgb(report.color);

  doc.setFillColor(...accent);
  doc.rect(0, 0, w, 5, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...accent);
  doc.text(clean(report.company).toUpperCase(), MARGIN, 38);

  doc.setFontSize(20);
  doc.setTextColor(...INK);
  doc.text(clean(report.name), MARGIN, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  const desc = doc.splitTextToSize(clean(report.description), w - MARGIN * 2);
  doc.text(desc, MARGIN, 80);

  let y = 80 + desc.length * 13;
  if (runLine) {
    doc.text(runLine, MARGIN, y);
    y += 13;
  }
  return y + 12;
}

// A row of stat tiles mirroring the dashboard card. items: [label, value, rgb]
function drawTiles(doc, y, items) {
  const w = doc.internal.pageSize.getWidth();
  const gap = 10;
  const tw = (w - MARGIN * 2 - gap * (items.length - 1)) / items.length;

  items.forEach(([label, value, rgb], i) => {
    const x = MARGIN + i * (tw + gap);
    doc.setDrawColor(...LINE);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, tw, 50, 6, 6, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(...rgb);
    doc.text(String(value), x + tw / 2, y + 24, { align: "center" });

    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), x + tw / 2, y + 39, { align: "center" });
  });
  return y + 50 + 26;
}

function drawSectionTitle(doc, y, title) {
  // Start the section on a new page if only its title would fit.
  if (y > doc.internal.pageSize.getHeight() - 90) {
    doc.addPage();
    y = MARGIN;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...INK);
  doc.text(title, MARGIN, y);
  return y + 8;
}

function drawFooters(doc) {
  const pages = doc.getNumberOfPages();
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  const generated = `Frugal Testing - generated ${fmtDateTime(Date.now())}`;

  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(generated, MARGIN, h - 20);
    doc.text(`Page ${i} of ${pages}`, w - MARGIN, h - 20, { align: "right" });
  }
}

// ── Allure overview (mirrors the report's Overview page) ────────────────────

// Allure's own palette and bar order, so the overview reads like the report.
const ALLURE_RGB = {
  failed:  [253, 90, 62],
  broken:  [255, 208, 80],
  passed:  [151, 204, 100],
  skipped: [170, 170, 170],
  unknown: [211, 94, 190],
};
const ALLURE_STATUSES = ["failed", "broken", "passed", "skipped", "unknown"];
const CARD_GAP = 12;
const CARD_HEAD = 34;
const ROW_H = 22;

const statTotal = (stat = {}) => ALLURE_STATUSES.reduce((n, k) => n + (stat[k] ?? 0), 0);
const widgetItems = (w) => (Array.isArray(w) ? w : w?.items ?? []);

const fmtClock = (d) =>
  new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hourCycle: "h23" });

// Shorten s with "..." until it fits maxW at the current font size.
function fitText(doc, s, maxW) {
  if (doc.getTextWidth(s) <= maxW) return s;
  while (s.length > 1 && doc.getTextWidth(s + "...") > maxW) s = s.slice(0, -1);
  return s + "...";
}

function drawCard(doc, x, y, w, h, title, subtitle) {
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.75);
  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, w, h, "FD");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text(title, x + 14, y + 22);
  if (subtitle) {
    const tw = doc.getTextWidth(title);
    doc.setFontSize(9);
    doc.setTextColor(...MUTED);
    doc.text(subtitle, x + 14 + tw + 6, y + 22);
  }
}

function drawRowLine(doc, x, y, w) {
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.5);
  doc.line(x, y, x + w, y);
}

function drawEmptyNote(doc, x, y, w, text) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text(text, x + w / 2, y, { align: "center" });
}

// A single bar split by status, with counts printed where they fit.
function drawStatusBar(doc, x, y, w, h, stat) {
  const total = statTotal(stat);
  if (!total) return;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  let cx = x;
  for (const k of ALLURE_STATUSES) {
    const n = stat[k] ?? 0;
    if (!n) continue;
    const sw = (w * n) / total;
    doc.setFillColor(...ALLURE_RGB[k]);
    doc.rect(cx, y, sw, h, "F");
    if (doc.getTextWidth(String(n)) + 4 < sw) {
      doc.setTextColor(255, 255, 255);
      doc.text(String(n), cx + sw / 2, y + h / 2 + 2.5, { align: "center" });
    }
    cx += sw;
  }
}

// jsPDF has no arc primitive: stroke the arc as a polyline of 2° steps.
function strokeArc(doc, cx, cy, r, a0, a1) {
  const steps = Math.max(2, Math.ceil((a1 - a0) / (Math.PI / 90)));
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / steps;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const segs = pts.slice(1).map((p, i) => [p[0] - pts[i][0], p[1] - pts[i][1]]);
  doc.lines(segs, pts[0][0], pts[0][1], [1, 1], "S", false);
}

// segments: [value, rgb]; an empty donut is drawn as a grey ring.
function drawDonut(doc, cx, cy, r, segments, center, width = 11, fontSize = 16) {
  const total = segments.reduce((n, [v]) => n + v, 0);
  doc.setLineWidth(width);
  doc.setLineJoin("round");
  if (!total) {
    doc.setDrawColor(...LINE);
    strokeArc(doc, cx, cy, r, 0, Math.PI * 2);
  }
  let a = -Math.PI / 2;
  for (const [v, rgb] of segments) {
    if (!v) continue;
    const sweep = (v / total) * Math.PI * 2;
    doc.setDrawColor(...rgb);
    strokeArc(doc, cx, cy, r, a, a + sweep);
    a += sweep;
  }
  doc.setLineJoin("miter");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(...INK);
  doc.text(center, cx, cy + fontSize / 3, { align: "center" });
}

function drawRing(doc, cx, cy, r, stat) {
  const total = statTotal(stat);
  const pct = total ? `${Math.floor(((stat.passed ?? 0) / total) * 100)}%` : "-";
  drawDonut(doc, cx, cy, r, ALLURE_STATUSES.map((k) => [stat[k] ?? 0, ALLURE_RGB[k]]), pct);
}

// Each card returns its height and a draw(x, y, w) so the columns can be
// measured before anything is drawn.

function summaryCard(summary) {
  const stat = summary.statistic ?? {};
  const time = summary.time ?? {};
  return {
    h: 124,
    draw(doc, x, y, w) {
      const title = time.start ? `ALLURE REPORT ${new Date(time.start).toLocaleDateString("en-US")}` : "ALLURE REPORT";
      drawCard(doc, x, y, w, 124, title);
      if (time.start) {
        doc.setFontSize(9);
        doc.setTextColor(...MUTED);
        const stop = time.stop ?? time.start + (time.duration ?? 0);
        doc.text(`${fmtClock(time.start)} - ${fmtClock(stop)} (${fmtDuration(stop - time.start)})`, x + 14, y + 37);
      }
      const nx = x + w * 0.28;
      doc.setFontSize(36);
      doc.setTextColor(...INK);
      doc.text(String(stat.total ?? statTotal(stat)), nx, y + 88, { align: "center" });
      doc.setFontSize(9);
      doc.setTextColor(...MUTED);
      doc.text("test cases", nx, y + 102, { align: "center" });

      drawRing(doc, x + w * 0.74, y + 66, 40, stat);
    },
  };
}

// Name on the left, status bar on the right half — used by Suites and Categories.
function barListCard(title, items, emptyText, maxRows = 6) {
  const shown = items.slice(0, maxRows);
  const more = items.length - shown.length;
  const bodyH = shown.length ? shown.length * ROW_H + (more > 0 ? ROW_H : 0) : ROW_H + 6;
  const h = CARD_HEAD + bodyH + 4;
  return {
    h,
    draw(doc, x, y, w) {
      drawCard(doc, x, y, w, h, title, `${items.length} items total`);
      let ry = y + CARD_HEAD;
      if (!shown.length) {
        drawRowLine(doc, x, ry, w);
        drawEmptyNote(doc, x, ry + 17, w, emptyText);
        return;
      }
      const barX = x + w * 0.52;
      for (const item of shown) {
        drawRowLine(doc, x, ry, w);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...INK);
        doc.text(fitText(doc, clean(item.name), barX - x - 24), x + 14, ry + 14.5);
        drawStatusBar(doc, barX, ry + 6, x + w - 14 - barX, 10, item.statistic ?? {});
        ry += ROW_H;
      }
      if (more > 0) {
        drawRowLine(doc, x, ry, w);
        doc.setFontSize(8);
        doc.setTextColor(...MUTED);
        doc.text(`+ ${more} more`, x + w / 2, ry + 14.5, { align: "center" });
      }
    },
  };
}

// Plain "label  value" rows — used by Environment and Executors.
function textListCard(title, rows, emptyText, maxRows = 5) {
  const shown = rows.slice(0, maxRows);
  const h = CARD_HEAD + (shown.length ? shown.length * ROW_H : ROW_H + 6) + 4;
  return {
    h,
    draw(doc, x, y, w) {
      drawCard(doc, x, y, w, h, title);
      let ry = y + CARD_HEAD;
      if (!shown.length) {
        drawRowLine(doc, x, ry, w);
        drawEmptyNote(doc, x, ry + 17, w, emptyText);
        return;
      }
      for (const [label, value] of shown) {
        drawRowLine(doc, x, ry, w);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...INK);
        doc.text(fitText(doc, clean(label), w * 0.4 - 20), x + 14, ry + 14.5);
        doc.setTextColor(...MUTED);
        doc.text(fitText(doc, clean(value), w * 0.6 - 14), x + w * 0.4, ry + 14.5);
        ry += ROW_H;
      }
    },
  };
}

// Stacked bars per previous run; Allure needs at least two runs to show a trend.
function trendCard(history) {
  const runs = [...(history ?? [])].reverse().slice(-12);
  const h = 170;
  return {
    h,
    draw(doc, x, y, w) {
      drawCard(doc, x, y, w, h, "TREND");
      if (runs.length < 2) {
        drawEmptyNote(doc, x, y + h - 20, w, "There is nothing to show");
        return;
      }
      const left = x + 34, right = x + w - 14, top = y + 44, bottom = y + h - 26;
      const max = Math.max(1, ...runs.map((r) => statTotal(r.data)));
      const slot = (right - left) / runs.length;
      const bw = Math.min(26, slot * 0.6);

      drawRowLine(doc, left, bottom, right - left);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text(String(max), left - 6, top + 3, { align: "right" });
      doc.text("0", left - 6, bottom + 3, { align: "right" });

      runs.forEach((run, i) => {
        const bx = left + slot * i + (slot - bw) / 2;
        let by = bottom;
        for (const k of [...ALLURE_STATUSES].reverse()) {
          const n = run.data?.[k] ?? 0;
          if (!n) continue;
          const bh = ((bottom - top) * n) / max;
          by -= bh;
          doc.setFillColor(...ALLURE_RGB[k]);
          doc.rect(bx, by, bw, bh, "F");
        }
        doc.setTextColor(...MUTED);
        doc.text(run.buildOrder != null ? `#${run.buildOrder}` : String(i + 1), bx + bw / 2, bottom + 11, { align: "center" });
      });
    },
  };
}

function drawOverview(doc, y, { summary, suites, history, categories, executors, environment }) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const colW = (pageW - MARGIN * 2 - CARD_GAP) / 2;

  const left = [
    summaryCard(summary),
    barListCard("SUITES", suites, "There are no suites"),
    textListCard(
      "ENVIRONMENT",
      widgetItems(environment).map((e) => [e.name, (e.values ?? []).join(", ")]),
      "There are no environment variables",
    ),
  ];
  const right = [
    trendCard(history),
    barListCard("CATEGORIES", widgetItems(categories), "There are no categories", 5),
    textListCard(
      "EXECUTORS",
      widgetItems(executors).map((e) => [e.name ?? e.type ?? "Executor", e.buildName ?? e.reportName ?? ""]),
      "There is no information about tests executors",
      3,
    ),
  ];
  const colH = (cards) => cards.reduce((n, c) => n + c.h, 0) + CARD_GAP * (cards.length - 1);
  const height = Math.max(colH(left), colH(right));

  if (y + height > pageH - 40) {
    doc.addPage();
    y = MARGIN;
  }

  [[left, MARGIN], [right, MARGIN + colW + CARD_GAP]].forEach(([cards, x]) => {
    let cy = y;
    for (const card of cards) {
      card.draw(doc, x, cy, colW);
      cy += card.h + CARD_GAP;
    }
  });
  doc.setLineWidth(0.75);
  return y + height;
}

// ── Charts ───────────────────────────────────────────────────────────────────

const CHART_H = 210;

// Wraps a chart in a card; draw() gets the plot area inside the card.
function chartCard(title, subtitle, draw) {
  return {
    h: CHART_H,
    draw(doc, x, y, w) {
      drawCard(doc, x, y, w, CHART_H, title, subtitle);
      draw(doc, x + 14, y + CARD_HEAD + 8, w - 28, CHART_H - CARD_HEAD - 20);
    },
  };
}

// Lays cards out two per row, moving a row to a new page when it doesn't fit.
function drawCardGrid(doc, y, cards) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const colW = (pageW - MARGIN * 2 - CARD_GAP) / 2;
  for (let i = 0; i < cards.length; i += 2) {
    const row = cards.slice(i, i + 2);
    const rowH = Math.max(...row.map((c) => c.h));
    if (y + rowH > pageH - 40) {
      doc.addPage();
      y = MARGIN;
    }
    row.forEach((card, j) => card.draw(doc, MARGIN + j * (colW + CARD_GAP), y, colW));
    y += rowH + CARD_GAP;
  }
  doc.setLineWidth(0.75);
  return y;
}

// entries: [label, rgb, valueText] listed vertically from (x, y).
function drawLegend(doc, x, y, entries) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  entries.forEach(([label, rgb, value], i) => {
    const ry = y + i * 16;
    doc.setFillColor(...rgb);
    doc.rect(x, ry - 7, 8, 8, "F");
    doc.setTextColor(...INK);
    doc.text(label, x + 14, ry);
    doc.setTextColor(...MUTED);
    doc.text(String(value), x + 110, ry, { align: "right" });
  });
}

// Donut on the left, legend on the right.
function drawDonutWithLegend(doc, x, y, w, h, entries, center) {
  const r = Math.min(h / 2 - 10, w / 4);
  drawDonut(doc, x + w * 0.28, y + h / 2, r, entries.map(([, v, rgb]) => [v, rgb]), center, 14, 15);
  const shown = entries.filter(([, v]) => v);
  drawLegend(doc, x + w * 0.58, y + h / 2 - ((shown.length - 1) * 16) / 2 + 3, shown.map(([l, v, rgb, t]) => [l, rgb, t ?? v]));
}

// items: { label, value, rgb, text } — one horizontal bar per item.
function drawHBars(doc, x, y, w, h, items, emptyText) {
  if (!items.length) {
    drawEmptyNote(doc, x, y + h / 2, w, emptyText);
    return;
  }
  const labelW = w * 0.4;
  const valueW = 52;
  const barW = w - labelW - valueW;
  const max = Math.max(...items.map((i) => i.value)) || 1;
  const rowH = Math.min(16, h / items.length);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  items.forEach((item, i) => {
    const ry = y + i * rowH;
    doc.setTextColor(...INK);
    doc.text(fitText(doc, clean(item.label), labelW - 8), x, ry + rowH / 2 + 2.5);
    doc.setFillColor(...item.rgb);
    doc.rect(x + labelW, ry + rowH * 0.2, Math.max(1, (barW * item.value) / max), rowH * 0.6, "F");
    doc.setTextColor(...MUTED);
    doc.text(item.text, x + w, ry + rowH / 2 + 2.5, { align: "right" });
  });
}

// items: { label, stacks: [value, rgb][], text } — vertical (optionally stacked) columns.
function drawColumns(doc, x, y, w, h, items, emptyText) {
  const totals = items.map((i) => i.stacks.reduce((n, [v]) => n + v, 0));
  if (!totals.some(Boolean)) {
    drawEmptyNote(doc, x, y + h / 2, w, emptyText);
    return;
  }
  const top = y + 12, bottom = y + h - 14;
  const max = Math.max(...totals);
  const slot = w / items.length;
  const bw = Math.min(36, slot * 0.6);
  drawRowLine(doc, x, bottom, w);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  items.forEach((item, i) => {
    const bx = x + slot * i + (slot - bw) / 2;
    let by = bottom;
    for (const [v, rgb] of item.stacks) {
      if (!v) continue;
      const bh = ((bottom - top) * v) / max;
      by -= bh;
      doc.setFillColor(...rgb);
      doc.rect(bx, by, bw, bh, "F");
    }
    doc.setTextColor(...INK);
    doc.text(item.text ?? String(totals[i]), bx + bw / 2, by - 3, { align: "center" });
    doc.setTextColor(...MUTED);
    doc.text(fitText(doc, clean(item.label), slot - 2), bx + bw / 2, bottom + 10, { align: "center" });
  });
}

const SEVERITIES = ["blocker", "critical", "normal", "minor", "trivial"];

function allureCharts(summary, tests, severity) {
  const stat = summary.statistic ?? {};
  const total = statTotal(stat);
  const timed = tests.filter((t) => t.time?.duration != null);

  // Duration histogram: 8 equal buckets between the fastest and slowest test.
  const durations = timed.map((t) => t.time.duration);
  const min = Math.min(...durations), max = Math.max(...durations);
  const bucketCount = durations.length ? (max > min ? 8 : 1) : 0;
  const step = (max - min) / (bucketCount || 1) || 1;
  const buckets = Array.from({ length: bucketCount }, (_, i) => ({ label: fmtDuration(min + step * i), stat: {} }));
  for (const t of timed) {
    const b = buckets[Math.min(bucketCount - 1, Math.floor((t.time.duration - min) / step))];
    b.stat[t.status] = (b.stat[t.status] ?? 0) + 1;
  }

  const bySeverity = SEVERITIES.map((sev) => {
    const s = {};
    for (const t of widgetItems(severity)) if (t.severity === sev) s[t.status] = (s[t.status] ?? 0) + 1;
    return s;
  });
  const statusStacks = (s) => [...ALLURE_STATUSES].reverse().map((k) => [s[k] ?? 0, ALLURE_RGB[k]]);

  return [
    chartCard("STATUS", `${total} test cases`, (doc, x, y, w, h) =>
      drawDonutWithLegend(
        doc, x, y, w, h,
        ALLURE_STATUSES.map((k) => [
          k[0].toUpperCase() + k.slice(1),
          stat[k] ?? 0,
          ALLURE_RGB[k],
          `${stat[k] ?? 0} (${total ? (((stat[k] ?? 0) / total) * 100).toFixed(1) : 0}%)`,
        ]),
        total ? `${Math.floor(((stat.passed ?? 0) / total) * 100)}%` : "-",
      )),
    chartCard("SEVERITY", "tests by severity and status", (doc, x, y, w, h) =>
      drawColumns(doc, x, y, w, h,
        SEVERITIES.map((sev, i) => ({ label: sev, stacks: statusStacks(bySeverity[i]) })),
        "There is no severity information")),
    chartCard("DURATION", "tests by run time", (doc, x, y, w, h) =>
      drawColumns(doc, x, y, w, h,
        buckets.map((b) => ({ label: b.label, stacks: statusStacks(b.stat) })),
        "There is no duration information")),
    chartCard("SLOWEST TESTS", "top 10 by duration", (doc, x, y, w, h) =>
      drawHBars(doc, x, y, w, h,
        [...timed].sort((a, b) => b.time.duration - a.time.duration).slice(0, 10).map((t) => ({
          label: t.name, value: t.time.duration, rgb: ALLURE_RGB[t.status] ?? MUTED, text: fmtDuration(t.time.duration),
        })),
        "There is no duration information")),
  ];
}

function jmeterCharts(total, rows, accent) {
  const top = (key) => [...rows].sort((a, b) => b[key] - a[key]).slice(0, 10);
  const ok = (total.sampleCount ?? 0) - (total.errorCount ?? 0);
  return [
    chartCard("REQUEST OUTCOME", `${(total.sampleCount ?? 0).toLocaleString("en-US")} samples`, (doc, x, y, w, h) =>
      drawDonutWithLegend(doc, x, y, w, h, [
        ["Success", ok, STATUS_RGB.passed, ok.toLocaleString("en-US")],
        ["Errors", total.errorCount ?? 0, STATUS_RGB.failed, (total.errorCount ?? 0).toLocaleString("en-US")],
      ], `${(100 - (total.errorPct ?? 0)).toFixed(1)}%`)),
    chartCard("RESPONSE TIME", "all transactions", (doc, x, y, w, h) =>
      drawColumns(doc, x, y, w, h,
        [["Min", total.minResTime], ["Avg", total.meanResTime], ["Median", total.medianResTime],
          ["90th", total.pct1ResTime], ["95th", total.pct2ResTime], ["99th", total.pct3ResTime], ["Max", total.maxResTime]]
          .map(([label, v]) => ({ label, stacks: [[v ?? 0, accent]], text: fmtMs(v) })),
        "There is no response time information")),
    chartCard("SLOWEST TRANSACTIONS", "top 10 by average response time", (doc, x, y, w, h) =>
      drawHBars(doc, x, y, w, h,
        top("meanResTime").map((r) => ({ label: r.transaction, value: r.meanResTime, rgb: accent, text: fmtMs(r.meanResTime) })),
        "There are no transactions")),
    chartCard("90TH PERCENTILE", "top 10 transactions", (doc, x, y, w, h) =>
      drawHBars(doc, x, y, w, h,
        top("pct1ResTime").map((r) => ({ label: r.transaction, value: r.pct1ResTime, rgb: STATUS_RGB.broken, text: fmtMs(r.pct1ResTime) })),
        "There are no transactions")),
    chartCard("ERROR RATE", "top 10 transactions with errors", (doc, x, y, w, h) =>
      drawHBars(doc, x, y, w, h,
        top("errorPct").filter((r) => r.errorCount > 0).map((r) => ({
          label: r.transaction, value: r.errorPct, rgb: errorRgb(r.errorPct), text: `${r.errorPct.toFixed(2)}%`,
        })),
        "No errors recorded")),
    chartCard("THROUGHPUT", "top 10 transactions by requests / sec", (doc, x, y, w, h) =>
      drawHBars(doc, x, y, w, h,
        top("throughput").map((r) => ({ label: r.transaction, value: r.throughput, rgb: accent, text: `${r.throughput.toFixed(2)}/s` })),
        "There are no transactions")),
  ];
}

const tableStyles = (accent) => ({
  margin: { left: MARGIN, right: MARGIN, bottom: 40 },
  styles: { font: "helvetica", fontSize: 8, cellPadding: 5, textColor: INK, lineColor: LINE, lineWidth: 0.5, overflow: "linebreak" },
  headStyles: { fillColor: accent, textColor: [255, 255, 255], fontStyle: "bold" },
  alternateRowStyles: { fillColor: [248, 250, 252] },
});

// ── Allure ───────────────────────────────────────────────────────────────────

async function buildAllure(doc, report) {
  const root = `/${report.path}`;
  // The overview widgets are optional — older or trimmed reports may not have them.
  const optional = (file) => fetchJson(`${root}/${file}`).catch(() => null);
  const [summary, suites, suitesWidget, history, categories, executors, environment, severity] = await Promise.all([
    fetchJson(`${root}/widgets/summary.json`),
    fetchJson(`${root}/data/suites.json`),
    optional("widgets/suites.json"),
    optional("widgets/history-trend.json"),
    optional("widgets/categories.json"),
    optional("widgets/executors.json"),
    optional("widgets/environment.json"),
    optional("widgets/severity.json"),
  ]);

  // Leaves of the suites tree are test results; their ancestors form the suite path.
  const tests = [];
  const walk = (node, path) =>
    node.children
      ? node.children.forEach((c) => walk(c, [...path, node.name]))
      : tests.push({ ...node, suite: path.join(" / ") });
  (suites.children ?? []).forEach((c) => walk(c, []));

  tests.sort(
    (a, b) =>
      (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9) ||
      a.suite.localeCompare(b.suite) ||
      a.name.localeCompare(b.name),
  );

  // Failure messages live in each test's own file — only fetch the ones we need.
  const problems = tests.filter((t) => ["failed", "broken", "unknown"].includes(t.status));
  const details = await Promise.all(
    problems.map((t) => fetchJson(`${root}/data/test-cases/${t.uid}.json`).catch(() => null)),
  );

  // Without widgets/suites.json, count statuses per top-level suite ourselves.
  let suiteItems = widgetItems(suitesWidget);
  if (!suiteItems.length) {
    const bySuite = new Map();
    for (const t of tests) {
      const name = t.suite.split(" / ")[0] || t.name;
      const stat = bySuite.get(name) ?? {};
      stat[t.status] = (stat[t.status] ?? 0) + 1;
      bySuite.set(name, stat);
    }
    suiteItems = [...bySuite].map(([name, statistic]) => ({ name, statistic }));
  }

  const accent = hexToRgb(report.color);
  let y = drawHeader(doc, report, null);
  drawOverview(doc, y, { summary, suites: suiteItems, history, categories, executors, environment });

  // Charts get their own page after the overview, and the test tables after that.
  doc.addPage();
  drawCardGrid(doc, MARGIN, allureCharts(summary, tests, severity));
  doc.addPage();
  y = MARGIN;

  // Colour the status column like the dashboard.
  const colourStatus = (col) => (data) => {
    if (data.section === "body" && data.column.index === col) {
      data.cell.styles.textColor = STATUS_RGB[String(data.cell.raw).toLowerCase()] ?? INK;
      data.cell.styles.fontStyle = "bold";
    }
  };

  if (problems.length) {
    y = drawSectionTitle(doc, y, `Failed & broken tests (${problems.length})`);
    autoTable(doc, {
      ...tableStyles(accent),
      startY: y,
      head: [["#", "Test", "Status", "Error"]],
      body: problems.map((t, i) => [
        i + 1,
        `${clean(t.name)}\n${clean(t.suite)}`,
        t.status.toUpperCase(),
        truncate(clean(details[i]?.statusMessage ?? "").trim(), 600) || "-",
      ]),
      columnStyles: {
        0: { cellWidth: 24, halign: "right" },
        1: { cellWidth: 230 },
        2: { cellWidth: 56 },
      },
      didParseCell: colourStatus(2),
    });
    y = doc.lastAutoTable.finalY + 28;
  }

  y = drawSectionTitle(doc, y, `All tests (${tests.length})`);
  autoTable(doc, {
    ...tableStyles(accent),
    startY: y,
    head: [["Suite", "Test", "Status", "Duration"]],
    body: tests.map((t) => [
      clean(t.suite),
      clean(t.name),
      t.status.toUpperCase(),
      fmtDuration(t.time?.duration),
    ]),
    columnStyles: {
      0: { cellWidth: 260 },
      2: { cellWidth: 56 },
      3: { cellWidth: 60, halign: "right" },
    },
    didParseCell: colourStatus(2),
  });
}

// ── JMeter ───────────────────────────────────────────────────────────────────

const errorRgb = (pct) => (pct > 5 ? STATUS_RGB.failed : pct > 1 ? STATUS_RGB.broken : STATUS_RGB.passed);

async function buildJmeter(doc, report) {
  const stats = await fetchJson(`/${report.path}/statistics.json`);
  const total = stats.Total ?? stats.total ?? {};
  const rows = Object.entries(stats)
    .filter(([key]) => key.toLowerCase() !== "total")
    .map(([, v]) => v)
    .sort((a, b) => b.errorPct - a.errorPct || b.sampleCount - a.sampleCount);

  const accent = hexToRgb(report.color);
  const runLine = report.date
    ? `Run: ${new Date(report.date).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}`
    : null;

  let y = drawHeader(doc, report, runLine);
  y = drawTiles(doc, y, [
    ["Samples", (total.sampleCount ?? 0).toLocaleString("en-US"), MUTED],
    ["Errors", (total.errorCount ?? 0).toLocaleString("en-US"), errorRgb(total.errorPct)],
    ["Error rate", `${(total.errorPct ?? 0).toFixed(2)}%`, errorRgb(total.errorPct)],
    ["Avg response", fmtMs(total.meanResTime), MUTED],
    ["90th pct", fmtMs(total.pct1ResTime), MUTED],
    ["Req / sec", (total.throughput ?? 0).toFixed(1), accent],
  ]);

  drawCardGrid(doc, y - 12, jmeterCharts(total, rows, accent));
  doc.addPage();
  y = MARGIN + 4;

  y = drawSectionTitle(doc, y, `Transactions (${rows.length})`);
  autoTable(doc, {
    ...tableStyles(accent),
    startY: y,
    head: [["Transaction", "Samples", "Errors", "Error %", "Avg", "Median", "90th", "95th", "99th", "Max", "Req/s"]],
    body: rows.map((r) => [
      clean(r.transaction),
      r.sampleCount.toLocaleString("en-US"),
      r.errorCount.toLocaleString("en-US"),
      `${r.errorPct.toFixed(2)}%`,
      fmtMs(r.meanResTime),
      fmtMs(r.medianResTime),
      fmtMs(r.pct1ResTime),
      fmtMs(r.pct2ResTime),
      fmtMs(r.pct3ResTime),
      fmtMs(r.maxResTime),
      r.throughput.toFixed(2),
    ]),
    columnStyles: Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [i + 1, { halign: "right", cellWidth: 52 }]),
    ),
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        data.cell.styles.textColor = errorRgb(rows[data.row.index].errorPct);
        data.cell.styles.fontStyle = "bold";
      }
    },
  });
}

// ── Entry point ──────────────────────────────────────────────────────────────

export async function downloadReportPdf(report, kind) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setProperties({ title: `${report.company} - ${report.name}`, author: "Frugal Testing" });

  await (kind === "jmeter" ? buildJmeter : buildAllure)(doc, report);
  drawFooters(doc);

  doc.save(`${clean(`${report.company} - ${report.name}`).replace(/[\\/:*?"<>|]/g, "-")}.pdf`);
}
