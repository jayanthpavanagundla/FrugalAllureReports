import { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// ─── CONFIGURE YOUR REPORTS HERE ─────────────────────────────────────────────
// Each entry maps to a folder on your server.
// `path` must match the folder name where the Allure report is served.
// The app will fetch `/<path>/widgets/summary.json` for live stats.
// `color` drives the accent bar and button for that card.
// ─────────────────────────────────────────────────────────────────────────────
const REPORTS = [
  {
    id: 1,
    company: "AutoChek",
    name: "Business Owner Loan Flow",
    path: "Business Owner - Nigeria - AllureReport",
    description: "End-to-end loan process flow for Business Owner job type.",
    color: "#2563eb",
  },
  {
    id: 2,
    company: "AutoChek",
    name: "Loan Flow – All 3 Job Types",
    path: "ConditionalOffersIssue",
    description: "Loan flow covering the end-to-end process across all three job types.",
    color: "#2563eb",
  },
  {
    id: 3,
    company: "AutoChek",
    name: "Autochek – All APIs Automation",
    path: "All-APIs-report",
    description: "End-to-end API automation test results covering all Autochek APIs.",
    color: "#2563eb",
  },
  {
    id: 4,
    company: "Online Sales",
    name: "Ads Campaign Flow – 83 Scen.",
    path: "OnlineSales",
    description: "Complete flow covering the Ads Campaign process.",
    color: "#2563eb",
  },
  {
    id: 5,
    company: "Hafnia",
    name: "Hafnia - All APIs Automation",
    path: "Hafnia",
    description: "Complete API automation test results covering all Hafnia APIs.",
    color: "#2563eb",
  },
  {
    id: 6,
    company: "Sacred Groves",
    name: "SG - Website Automation",
    path: "SacredGroves",
    description: "Full Website Test Automation & Functional Validation Results",
    color: "#2563eb",
  },
  {
    id: 7,
    company: "BlueElephants",
    name: "Website Auth - 10 Websites",
    path: "BlueElephants",
    description: "Authentication testing results covering login and access validation across 10 websites.",
    color: "#2563eb",
  },
  {
    id: 8,
    company: "FlexiQuote",
    name: "FlexiQuote – Web Automation (100 Scen.)",
    path: "FlexiQuote",
    description: "End-to-end web automation across CSR, User, and Admin role flows.",
    color: "#2563eb",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

// ── Inline SVG logos (replace src attrs with your real image imports if needed)
const PCLogoSVG = () => (
  <img
    src="https://cdn.prod.website-files.com/64afb26dde3a7b4d2e104692/6a473117cae8a69f99743f2a_Frugal-Logo-1.png"
    alt="FT Automation Runs"
    width="200"
    height="50"
    style={{ objectFit: "contain" }}
  />
);

const AllureLogoSVG = () => (
  <img
    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Jeuz6k23eO5feHb7tLxqCBTT_DkeZuRoeFTu7Pjil26WCcDs3K4NUOKT&s=10"
    alt="Allure"
    width="22"
    height="22"
    style={{ objectFit: "contain" }}
  />
);

// ── Skeleton shimmer for loading state
function MetricsSkeleton() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 6,
      marginBottom: 20,
    }}>
      {[0,1,2,3].map(i => (
        <div key={i} style={{
          height: 56,
          borderRadius: 8,
          background: "linear-gradient(90deg, #f1f5f9 25%, #e8edf3 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
        }} />
      ))}
    </div>
  );
}

// ── Single metric box
function Metric({ value, label, bg, valueColor, borderColor }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      padding: "8px 4px",
      borderRadius: 8,
      border: `1px solid ${borderColor}`,
      background: bg,
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "1.1rem",
        fontWeight: 700,
        color: valueColor,
        lineHeight: 1,
      }}>{value}</span>
      <span style={{
        fontSize: ".52rem",
        fontWeight: 600,
        letterSpacing: ".06em",
        textTransform: "uppercase",
        color: "#64748b",
        textAlign: "center",
      }}>{label}</span>
    </div>
  );
}

// ── Report card
function ReportCard({ report, index, visible, stats, reportDate }) {
  const handleOpen = (e) => {
    e.stopPropagation();
    window.open(`/${report.path}/index.html`, "_blank", "noopener,noreferrer");
  };

  const total = stats ? (stats.total ?? stats.passed + stats.failed + (stats.broken ?? 0) + (stats.skipped ?? 0)) : 0;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleOpen(e)}
      style={{
        position: "relative",
        background: "#ffffff",
        border: "1px solid rgba(15,23,42,0.09)",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity .4s ease ${index * 70}ms, transform .4s ease ${index * 70}ms, border-color .2s, box-shadow .25s`,
        outline: "none",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(15,23,42,0.18)";
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(15,23,42,0.10), 0 0 40px ${report.color}1a`;
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.querySelector(".accent-bar").style.opacity = "1";
        e.currentTarget.querySelector(".card-btn").style.transform = "scale(1.03)";
        e.currentTarget.querySelector(".card-btn").style.boxShadow = `0 4px 16px ${report.color}66`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(15,23,42,0.09)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = visible ? "translateY(0)" : "translateY(18px)";
        e.currentTarget.querySelector(".accent-bar").style.opacity = "0";
        e.currentTarget.querySelector(".card-btn").style.transform = "scale(1)";
        e.currentTarget.querySelector(".card-btn").style.boxShadow = "none";
      }}
    >
      {/* Accent bar */}
      <div className="accent-bar" style={{
        height: 3,
        background: report.color,
        opacity: 0,
        transition: "opacity .25s ease",
      }} />

      <div style={{ padding: 20 }}>
        {/* Company + name + description */}
        <div style={{ marginBottom: 14 }}>
          <span style={{
            display: "inline-block",
            fontSize: ".58rem",
            fontWeight: 700,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: report.color,
            background: `${report.color}18`,
            border: `1px solid ${report.color}33`,
            borderRadius: 99,
            padding: "2px 8px",
            marginBottom: 8,
          }}>{report.company}</span>
          <div style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            letterSpacing: "-.02em",
            color: "#0f172a",
            lineHeight: 1.25,
          }}>{report.name}</div>
          <div style={{
            fontSize: ".72rem",
            color: "#64748b",
            marginTop: 4,
            lineHeight: 1.4,
          }}>{report.description}</div>
        </div>

        {/* Metrics */}
        {stats ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 6,
            marginBottom: 20,
          }}>
            <Metric value={total}         label="Total"   bg="rgba(100,116,139,0.06)" valueColor="#64748b"  borderColor="rgba(15,23,42,0.09)" />
            <Metric value={stats.passed}  label="Passed"  bg="rgba(16,185,129,0.08)"  valueColor="#0f9d63"  borderColor="rgba(16,185,129,0.18)" />
            <Metric value={stats.failed}  label="Failed"  bg="rgba(239,68,68,0.08)"   valueColor="#dc2626"  borderColor="rgba(239,68,68,0.18)" />
            <Metric value={stats.broken ?? 0} label="Broken" bg="rgba(245,158,11,0.08)" valueColor="#d97706" borderColor="rgba(245,158,11,0.18)" />
          </div>
        ) : (
          <MetricsSkeleton />
        )}

        {/* Footer */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          paddingTop: 16,
          borderTop: "1px solid rgba(15,23,42,0.09)",
        }}>
          {reportDate ? (
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: ".68rem",
              fontWeight: 500,
              color: "#475569",
              whiteSpace: "nowrap",
            }}>
              {new Date(reportDate).toLocaleDateString("en-US", {
                day: "2-digit", month: "short", year: "numeric",
              })}
            </span>
          ) : <span />}

          <button
            className="card-btn"
            onClick={handleOpen}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: report.color,
              color: "#fff",
              fontFamily: "'Inter', sans-serif",
              fontSize: ".7rem",
              fontWeight: 600,
              letterSpacing: ".02em",
              padding: "8px 14px",
              borderRadius: 8,
              border: "none",
              flexShrink: 0,
              cursor: "pointer",
              transition: "transform .15s, box-shadow .2s",
            }}
          >
            Open Report
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Calendar day button
function CalDay({ date, isToday, isSelected, onClick }) {
  const [hov, setHov] = useState(false);
  if (!date) return <span style={{ aspectRatio: 1 }} />;
  return (
    <button
      onClick={() => onClick(date)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        aspectRatio: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isSelected ? "#13a538" : hov ? "#f1f5f9" : "transparent",
        border: "none",
        borderRadius: 8,
        color: isSelected ? "#fff" : isToday ? "#0d7a2b" : "#0f172a",
        fontFamily: "'Inter', sans-serif",
        fontSize: ".74rem",
        fontWeight: isToday ? 700 : 400,
        cursor: "pointer",
        transition: "background .15s, color .15s",
      }}
    >{date.getDate()}</button>
  );
}

// ── Main App
export default function App() {
  const [visible, setVisible]         = useState(false);
  const [search, setSearch]           = useState("");
  const [dateFrom, setDateFrom]       = useState("");
  const [dateTo, setDateTo]           = useState("");
  const [reportData, setReportData]   = useState({});
  const [calOpen, setCalOpen]         = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [calMonth, setCalMonth]       = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const calRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Close calendar on outside click
  useEffect(() => {
    if (!calOpen) return;
    const fn = (e) => { if (calRef.current && !calRef.current.contains(e.target)) setCalOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [calOpen]);

  // Fetch summary.json for each report
  useEffect(() => {
    REPORTS.forEach(report => {
      fetch(`/${report.path}/widgets/summary.json`)
        .then(r => r.json())
        .then(data => {
          setReportData(prev => ({
            ...prev,
            [report.id]: { stats: data.statistic, date: data.time?.stop ?? null },
          }));
        })
        .catch(() => {
          setReportData(prev => ({
            ...prev,
            [report.id]: { stats: null, date: null },
          }));
        });
    });
  }, []);

  // Helpers
  const toISO = (d) =>
    `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

  const todayISO = toISO(new Date());
  const hasDateFilter = dateFrom || dateTo;

  const clearDate = () => { setDateFrom(""); setDateTo(""); setActivePreset(null); };

  const applyPreset = (preset) => {
    const today = new Date();
    if (preset === "today") {
      const iso = toISO(today); setDateFrom(iso); setDateTo(iso);
    } else if (preset === "week") {
      const wStart = new Date(today); wStart.setDate(today.getDate() - today.getDay());
      const lwStart = new Date(wStart); lwStart.setDate(wStart.getDate() - 7);
      const lwEnd   = new Date(wStart); lwEnd.setDate(wStart.getDate() - 1);
      setDateFrom(toISO(lwStart)); setDateTo(toISO(lwEnd));
    } else if (preset === "month") {
      const lmStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lmEnd   = new Date(today.getFullYear(), today.getMonth(), 0);
      setDateFrom(toISO(lmStart)); setDateTo(toISO(lmEnd));
    }
    setActivePreset(preset);
    setCalOpen(false);
  };

  const selectDay = (date) => {
    const iso = toISO(date);
    setDateFrom(iso); setDateTo(iso);
    setActivePreset(null);
    setCalOpen(false);
  };

  // Calendar days grid
  const calDays = (() => {
    const y = calMonth.getFullYear(), m = calMonth.getMonth();
    const offset = new Date(y, m, 1).getDay();
    const dim    = new Date(y, m + 1, 0).getDate();
    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from({ length: dim }, (_, i) => new Date(y, m, i + 1)),
    ];
  })();

  const monthLabel = calMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Filtered + sorted reports
  const displayed = REPORTS.filter(r => {
    const q = search.toLowerCase();
    if (!r.name.toLowerCase().includes(q) && !(r.company ?? "").toLowerCase().includes(q)) return false;
    const date = reportData[r.id]?.date;
    if (dateFrom && (!date || new Date(date) < new Date(dateFrom))) return false;
    if (dateTo   && (!date || new Date(date) > new Date(`${dateTo}T23:59:59.999`))) return false;
    return true;
  }).sort((a, b) => (reportData[b.id]?.date ?? 0) - (reportData[a.id]?.date ?? 0));

  // ── Shared tokens
  const border = "1px solid rgba(15,23,42,0.09)";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #ffffff;
          color: #0f172a;
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(19,165,56,0.10) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(19,165,56,0.06) 0%, transparent 55%);
          pointer-events: none; z-index: 0;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: .4; }
        }
        .search-input:focus {
          border-color: rgba(19,165,56,0.4) !important;
          box-shadow: 0 0 0 3px rgba(19,165,56,0.10) !important;
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto", padding: "20px 24px 96px" }}>

        {/* ── HEADER */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 48,
          flexWrap: "wrap",
          gap: 16,
          animation: "fadeDown .5s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <PCLogoSVG />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AllureLogoSVG />
            <span style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-.01em",
            }}>Allure Report</span>
            <span style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(19,165,56,0.10)",
              border: "1px solid rgba(19,165,56,0.22)",
              borderRadius: 99,
              padding: "6px 14px",
              fontSize: ".7rem",
              fontWeight: 600,
              color: "#0d7a2b",
              letterSpacing: ".04em",
              marginLeft: 4,
            }}>
              <span style={{
                width: 6, height: 6,
                background: "#13a538",
                borderRadius: "50%",
                boxShadow: "0 0 8px #13a538",
                animation: "pulse 2s infinite",
                display: "inline-block",
              }} />
              LIVE
            </span>
          </div>
        </header>

        {/* ── FILTER BAR */}
        <div style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          gap: 12,
          marginBottom: 28,
          flexWrap: "wrap",
          animation: "fadeDown .5s .08s ease both",
        }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 240px" }}>
            <svg style={{
              position: "absolute", left: 16, top: "50%",
              transform: "translateY(-50%)",
              color: "#64748b", pointerEvents: "none",
            }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="search-input"
              placeholder="Search reports by name or company…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "#fff",
                border,
                borderRadius: 12,
                padding: "13px 16px 13px 44px",
                fontSize: ".88rem",
                color: "#0f172a",
                fontFamily: "'Inter', sans-serif",
                outline: "none",
                transition: "border-color .2s, box-shadow .2s",
              }}
            />
          </div>

          {/* Calendar trigger */}
          <div style={{ position: "relative" }} ref={calRef}>
            <button
              onClick={() => setCalOpen(o => !o)}
              aria-label="Filter by date"
              style={{
                width: 46, height: 46,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: calOpen ? "rgba(19,165,56,0.10)" : "#fff",
                border: calOpen ? "1px solid rgba(19,165,56,0.4)" : border,
                borderRadius: 12,
                color: calOpen ? "#0d7a2b" : "#475569",
                cursor: "pointer",
                position: "relative",
                transition: "border-color .2s, color .2s, background .2s",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {hasDateFilter && (
                <span style={{
                  position: "absolute", top: 6, right: 6,
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#13a538", boxShadow: "0 0 6px #13a538",
                }} />
              )}
            </button>

            {/* Calendar dropdown */}
            {calOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                zIndex: 30, width: 270,
                background: "#fff",
                border,
                borderRadius: 14,
                padding: 12,
                boxShadow: "0 16px 48px rgba(15,23,42,0.14)",
                animation: "fadeDown .18s ease both",
              }}>
                {/* Month navigator */}
                <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: border }}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    fontSize: ".78rem", fontWeight: 600, color: "#0f172a",
                  }}>
                    <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth()-1, 1))}
                      style={{ display:"flex",alignItems:"center",justifyContent:"center",width:24,height:24,background:"transparent",border:"none",color:"#475569",cursor:"pointer",borderRadius:6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <span>{monthLabel}</span>
                    <button onClick={() => setCalMonth(m => new Date(m.getFullYear(), m.getMonth()+1, 1))}
                      style={{ display:"flex",alignItems:"center",justifyContent:"center",width:24,height:24,background:"transparent",border:"none",color:"#475569",cursor:"pointer",borderRadius:6 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
                    {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
                      <span key={d} style={{ textAlign:"center", fontSize:".6rem", fontWeight:600, letterSpacing:".04em", textTransform:"uppercase", color:"#64748b", paddingBottom:6 }}>{d}</span>
                    ))}
                    {calDays.map((date, i) => (
                      <CalDay
                        key={i}
                        date={date}
                        isToday={date ? toISO(date) === todayISO : false}
                        isSelected={date ? toISO(date) === dateFrom && toISO(date) === dateTo : false}
                        onClick={selectDay}
                      />
                    ))}
                  </div>
                </div>

                {/* Presets */}
                <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                  {[["today","Today"],["week","Last Week"],["month","Last Month"]].map(([key,label]) => (
                    <button key={key} onClick={() => applyPreset(key)}
                      style={{
                        background: activePreset === key ? "rgba(19,165,56,0.14)" : "transparent",
                        border: "none",
                        color: activePreset === key ? "#0d7a2b" : "#0f172a",
                        fontFamily:"'Inter',sans-serif",
                        fontSize:".82rem",
                        fontWeight: activePreset === key ? 600 : 500,
                        textAlign:"left",
                        padding:"9px 10px",
                        borderRadius:8,
                        cursor:"pointer",
                      }}>{label}</button>
                  ))}
                </div>

                {hasDateFilter && (
                  <button onClick={clearDate} style={{
                    width:"100%", marginTop:12,
                    background:"transparent",
                    border,
                    color:"#475569",
                    fontSize:".72rem", fontWeight:600,
                    padding:"8px 0",
                    borderRadius:8, cursor:"pointer",
                    fontFamily:"'Inter',sans-serif",
                  }}>Clear filter</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── SECTION LABEL */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: ".65rem",
          fontWeight: 600,
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "#64748b",
          marginBottom: 20,
          animation: "fadeDown .5s .12s ease both",
        }}>
          <span>{displayed.length} of {REPORTS.length} reports</span>
          <span style={{ flex:1, height:1, background:"rgba(15,23,42,0.09)" }} />
        </div>

        {/* ── REPORT GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: 16,
        }}>
          {displayed.length === 0 ? (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"60px 20px", color:"#64748b", fontSize:".9rem" }}>
              No reports match the current filters.
            </div>
          ) : (
            displayed.map((report, i) => (
              <ReportCard
                key={report.id}
                report={report}
                index={i}
                visible={visible}
                stats={reportData[report.id]?.stats ?? null}
                reportDate={reportData[report.id]?.date ?? null}
              />
            ))
          )}
        </div>

        {/* ── FOOTER */}
        <footer style={{
          marginTop: 72,
          textAlign: "center",
          fontSize: ".63rem",
          color: "#64748b",
          opacity: .6,
        }}>
          Frugal Testing Allure Reports · Static Hosting · {new Date().getFullYear()}
          {" · "}
          <a href="/api/auth/logout" style={{ color: "inherit", textDecoration: "underline" }}>
            Sign out
          </a>
        </footer>
      </div>
    </>
  );
}

// ── Mount
createRoot(document.getElementById("root")).render(<App />);