"use client";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const NAV = [
  { label: "Location, Details and Type",            path: "" },
  { label: "Investigation Checklist & Legal Summary", path: "/investigation-checklist" },
  { label: "Assessment",                              path: "/liability-assessment" },
  { label: "Negotiation & Settlement",               path: "/negotiation" },
  { label: "Claim Summary",                          path: "/claim-summary" },
  { label: "Just in Time Training",                  path: "/training" },
  { label: "Documents & Correspondence",             path: "/documents" },
];

export default function ClaimLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const base = `/claim/${id}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ── Top nav ──────────────────────────────────────────────── */}
      <header style={{ background: "var(--ctk-navy)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", height: 38, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontWeight: "bold", fontSize: 13, letterSpacing: "0.02em" }}>
            🛡 ClaimToolkit
          </span>
          <span style={{ color: "#8ea8c8", fontSize: 11 }}>AUTO ASSESSMENT</span>
        </div>
        <nav style={{ display: "flex", gap: 18 }}>
          {["New Assessment", "Find Assessment", "Auto Assessment Admin"].map(l => (
            <a key={l} href="#" onClick={e => e.preventDefault()}
              style={{ color: "#cdd8e8", fontSize: 11, textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#cdd8e8")}
            >{l}</a>
          ))}
        </nav>
        <button style={{ background: "var(--ctk-green)", color: "#fff", border: "none", padding: "4px 14px", fontSize: 11, fontWeight: "bold", cursor: "pointer", borderRadius: 2 }}>
          Incident Management
        </button>
      </header>

      {/* ── Claim sub-header ─────────────────────────────────────── */}
      <div style={{ background: "var(--ctk-header-bg)", borderBottom: "1px solid var(--ctk-border)", padding: "4px 12px", fontSize: 11, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <Link href={base} style={{ color: "var(--ctk-navy)", textDecoration: "none", fontWeight: "bold" }}>←</Link>
        <span style={{ fontWeight: "bold", fontSize: 13, color: "var(--ctk-navy)" }}>Claim CLM-2026-0847</span>
        <span style={{ color: "#666" }}>John Doe | John Smith | 2024-03-15</span>
      </div>

      {/* ── Body: main + right sidebar ───────────────────────────── */}
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Page content */}
        <main style={{ flex: 1, padding: 10, overflowY: "auto", minWidth: 0 }}>
          {children}
        </main>

        {/* Right sidebar */}
        <aside style={{ width: 400, minWidth: 350, background: "var(--ctk-sidebar-bg)", borderLeft: "1px solid var(--ctk-border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {/* Scene map thumbnail */}
          <div style={{ borderBottom: "1px solid var(--ctk-border)", padding: 6, textAlign: "center" }}>
            <div style={{ width: "100%", height: 110, background: "#b8c8b8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#555", marginBottom: 4, position: "relative", overflow: "hidden" }}>
              <span style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.4)", color: "#fff", fontSize: 9, padding: "1px 4px", borderRadius: 2 }}>Scene</span>
              🗺
            </div>
            <button style={{ background: "var(--ctk-green)", color: "#fff", border: "none", fontSize: 10, padding: "3px 10px", cursor: "pointer", width: "100%" }}>
              Edit Scene
            </button>
          </div>

          {/* Navigation */}
          <nav style={{ display: "flex", flexDirection: "column", padding: "4px 0" }}>
            {NAV.map(item => {
              const href = `${base}${item.path}`;
              const active = pathname === href || (item.path === "" && pathname === base);
              return (
                <Link key={item.path} href={href}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "5px 8px", fontSize: 11,
                    color: active ? "#fff" : "var(--ctk-navy)",
                    background: active ? "var(--ctk-green)" : "transparent",
                    borderBottom: "1px solid #ddd", textDecoration: "none", lineHeight: 1.3,
                  }}
                >
                  <span>{item.label}</span>
                  {active && <span style={{ fontSize: 9, marginLeft: 4 }}>●</span>}
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
    </div>
  );
}
