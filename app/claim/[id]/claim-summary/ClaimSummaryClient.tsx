"use client";
import { useState } from "react";

const S = {
  page: { padding: 10, fontSize: 13, color: "#222", background: "#f0f2f5", minHeight: "100%", fontFamily: "Verdana, Arial, sans-serif" },
  sectionBox: { border: "1px solid #d0d6e0", marginBottom: 10, background: "#fff", borderRadius: 4, overflow: "hidden" },
  sectionHeader: {
    background: "var(--ctk-navy)", color: "#fff", fontSize: 13, fontWeight: "bold",
    padding: "7px 10px", display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  sectionBody: { padding: "10px 12px" },
  label: { fontSize: 12, color: "#444", marginBottom: 2, display: "block" },
  input: {
    border: "1px solid #c0c8d4", padding: "3px 6px", fontSize: 13, width: "100%",
    boxSizing: "border-box" as const, height: 28, borderRadius: 3,
  },
  select: {
    border: "1px solid #c0c8d4", padding: "3px 6px", fontSize: 13, width: "100%",
    boxSizing: "border-box" as const, height: 28, background: "#fff", borderRadius: 3,
  },
  textarea: {
    border: "1px solid #c0c8d4", padding: "4px 6px", fontSize: 13, width: "100%",
    boxSizing: "border-box" as const, resize: "vertical" as const, borderRadius: 3,
  },
  row: { display: "flex", gap: 10, marginBottom: 6, flexWrap: "wrap" as const },
  fieldGroup: { flex: 1, minWidth: 120 },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: 12 },
  th: {
    background: "#e8ecf2", border: "1px solid #c8d0db", padding: "4px 6px",
    fontWeight: "bold", textAlign: "left" as const, fontSize: 12, whiteSpace: "nowrap" as const,
  },
  td: { border: "1px solid #d0d6e0", padding: "5px 8px", verticalAlign: "top" as const, fontSize: 12 },
  btn: (color: string) => ({
    background: color, color: "#fff", border: "none",
    padding: "5px 14px", fontSize: 12, cursor: "pointer", borderRadius: 3, whiteSpace: "nowrap" as const,
  }),
  infoBox: {
    border: "1px solid #d0d6e0", background: "#f5f8fc", padding: "8px 12px",
    fontSize: 13, marginBottom: 8, borderRadius: 3,
  },
  infoRow: { display: "flex", gap: 24, flexWrap: "wrap" as const, marginBottom: 2 },
  infoItem: { display: "flex", gap: 4 },
  infoKey: { color: "#555", fontWeight: "bold" as const },
  badge: (color: string) => ({
    display: "inline-block", background: color, color: "#fff",
    borderRadius: 3, padding: "1px 7px", fontSize: 11, fontWeight: "bold",
  }),
  subrogationRow: { display: "flex", gap: 10, marginBottom: 6, flexWrap: "wrap" as const, alignItems: "flex-end" },
};

type InvestRow = {
  party: string;
  type: string;
  row: string;
  speed: string;
  lookout: string;
  avoidance: string;
  fault: string;
  status: string;
};

const INVESTIGATION_DATA: InvestRow[] = [
  { party: "Khizar Imtiaz",   type: "Insured / ROW",  row: "Yes", speed: "No",  lookout: "No",  avoidance: "No",  fault: "0%",   status: "Confirmed" },
  { party: "Farhan Nazarat",  type: "Claimant / FTY", row: "No",  speed: "Yes", lookout: "Yes", avoidance: "Yes", fault: "100%", status: "Confirmed" },
  { party: "Jane Doe",        type: "Witness",        row: "N/A", speed: "N/A", lookout: "N/A", avoidance: "N/A", fault: "N/A",  status: "Interviewed" },
  { party: "SPD Officer #402",type: "Law Enforcement",row: "N/A", speed: "N/A", lookout: "N/A", avoidance: "N/A", fault: "N/A",  status: "Report Filed" },
  { party: "Vehicle #1",      type: "Insured Vehicle",row: "N/A", speed: "N/A", lookout: "N/A", avoidance: "N/A", fault: "N/A",  status: "Inspected" },
  { party: "Vehicle #2",      type: "Claimant Vehicle",row:"N/A", speed: "N/A", lookout: "N/A", avoidance: "N/A", fault: "N/A",  status: "Inspected" },
  { party: "Springfield PD",  type: "Police Dept",    row: "N/A", speed: "N/A", lookout: "N/A", avoidance: "N/A", fault: "N/A",  status: "Report Filed" },
  { party: "ABC Insurance",   type: "Adverse Insurer",row: "N/A", speed: "N/A", lookout: "N/A", avoidance: "N/A", fault: "N/A",  status: "Contacted" },
  { party: "City of Springfield", type: "Municipality",row:"N/A",speed:"N/A",  lookout: "N/A", avoidance: "N/A", fault: "N/A",  status: "N/A" },
];

const STATUS_COLORS: Record<string, string> = {
  "Confirmed": "#2e7d2f",
  "Interviewed": "#1a5ca8",
  "Report Filed": "#6a3fa0",
  "Inspected": "#c47a00",
  "Contacted": "#555",
  "N/A": "#999",
};

export default function ClaimSummaryClient() {
  const [assessmentNotes, setAssessmentNotes] = useState(
    "Based on investigation findings, the insured driver had the clear right-of-way at a controlled intersection. The adverse party (Farhan Nazarat) failed to yield at the stop sign, directly causing the collision. No contributing negligence found on the insured's part. Assessment: Full liability on adverse party — 100% fault."
  );
  const [settlementNotes, setSettlementNotes] = useState(
    "Initial demand received from claimant: $18,500. Recommended settlement range: $12,000–$14,500 based on comparable cases and documented damages. Negotiation in progress."
  );
  const [subrogationPotential, setSubrogationPotential] = useState("Yes");
  const [subrogationNotes, setSubrogationNotes] = useState(
    "Adverse party is insured with ABC Insurance (Policy #ABC-98312-IL). Subrogation demand letter to be sent within 30 days of claim close."
  );
  const [subrogationAmount, setSubrogationAmount] = useState("14500");
  const [subrogationStatus, setSubrogationStatus] = useState("Pending");

  return (
    <div style={S.page}>
      {/* Liability Investigation and Determination */}
      <div style={S.sectionBox}>
        <div style={S.sectionHeader}>
          <span>Liability Investigation and Determination</span>
        </div>
        <div style={S.sectionBody}>
          {/* Insured Info Box */}
          <div style={S.infoBox}>
            <div style={S.infoRow}>
              <div style={S.infoItem}><span style={S.infoKey}>Claim #:</span><span>CLM-2026-0847</span></div>
              <div style={S.infoItem}><span style={S.infoKey}>Insured:</span><span>Khizar Imtiaz</span></div>
              <div style={S.infoItem}><span style={S.infoKey}>Claimant:</span><span>Farhan Nazarat</span></div>
              <div style={S.infoItem}><span style={S.infoKey}>Date of Loss:</span><span>2024-03-15</span></div>
            </div>
            <div style={S.infoRow}>
              <div style={S.infoItem}><span style={S.infoKey}>Policy #:</span><span>POL-2024-88712</span></div>
              <div style={S.infoItem}><span style={S.infoKey}>Accident Type:</span><span>Angle/Intersection</span></div>
              <div style={S.infoItem}><span style={S.infoKey}>Location:</span><span>Main St &amp; Oak Ave, Springfield, IL</span></div>
              <div style={S.infoItem}>
                <span style={S.infoKey}>Overall Fault:</span>
                <span style={S.badge("#c0392b")}>Adverse 100%</span>
              </div>
            </div>
          </div>

          {/* Investigation Table */}
          <table style={S.table}>
            <thead>
              <tr>
                {["Party Name","Party Type","ROW Duty","Speed Duty","Lookout Duty","Avoidance Duty","Fault %","Status"].map(h => (
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {INVESTIGATION_DATA.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f7f9fc" }}>
                  <td style={{ ...S.td, fontWeight: "bold" }}>{row.party}</td>
                  <td style={S.td}>{row.type}</td>
                  {[row.row, row.speed, row.lookout, row.avoidance].map((v, j) => (
                    <td key={j} style={{ ...S.td, textAlign: "center" as const }}>
                      {v === "Yes" ? <span style={{ color: "#c0392b", fontWeight: "bold" }}>Yes</span>
                        : v === "No" ? <span style={{ color: "#2e7d2f" }}>No</span>
                        : <span style={{ color: "#999" }}>{v}</span>}
                    </td>
                  ))}
                  <td style={{ ...S.td, textAlign: "center" as const, fontWeight: "bold", color: row.fault === "100%" ? "#c0392b" : row.fault === "0%" ? "#2e7d2f" : "#222" }}>{row.fault}</td>
                  <td style={S.td}>
                    <span style={S.badge(STATUS_COLORS[row.status] || "#888")}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assessment */}
      <div style={S.sectionBox}>
        <div style={S.sectionHeader}>Assessment</div>
        <div style={S.sectionBody}>
          <div style={{ marginBottom: 8 }}>
            <span style={S.label}>Assessment Notes</span>
            <textarea
              value={assessmentNotes}
              onChange={e => setAssessmentNotes(e.target.value)}
              rows={4}
              style={S.textarea}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            <button style={S.btn("var(--ctk-green)")}>Accept Assessment</button>
            <button style={S.btn("var(--ctk-navy)")}>Request Review</button>
            <button style={S.btn("#c0392b")}>Dispute Assessment</button>
            <button style={S.btn("#888")}>Save Draft</button>
          </div>
        </div>
      </div>

      {/* Negotiation & Settlement */}
      <div style={S.sectionBox}>
        <div style={S.sectionHeader}>Negotiation &amp; Settlement</div>
        <div style={S.sectionBody}>
          <div style={S.row}>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <span style={S.label}>Claimed Amount ($)</span>
              <input defaultValue="18500.00" style={S.input} type="number" />
            </div>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <span style={S.label}>Reserve Amount ($)</span>
              <input defaultValue="15000.00" style={S.input} type="number" />
            </div>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <span style={S.label}>Settlement Offer ($)</span>
              <input defaultValue="13000.00" style={S.input} type="number" />
            </div>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <span style={S.label}>Settlement Status</span>
              <select defaultValue="In Negotiation" style={S.select}>
                {["Open","In Negotiation","Agreed","Settled","Closed - No Pay","Litigated"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <span style={S.label}>Negotiation Notes</span>
            <textarea
              value={settlementNotes}
              onChange={e => setSettlementNotes(e.target.value)}
              rows={3}
              style={S.textarea}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button style={S.btn("var(--ctk-green)")}>Record Settlement</button>
            <button style={S.btn("var(--ctk-navy)")}>Log Negotiation</button>
            <button style={S.btn("#888")}>Save</button>
          </div>
        </div>
      </div>

      {/* Subrogation Collection */}
      <div style={S.sectionBox}>
        <div style={S.sectionHeader}>Subrogation Collection</div>
        <div style={S.sectionBody}>
          <div style={S.row}>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <span style={S.label}>Subrogation Potential</span>
              <select value={subrogationPotential} onChange={e => setSubrogationPotential(e.target.value)} style={S.select}>
                <option>Yes</option><option>No</option><option>Unknown</option>
              </select>
            </div>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <span style={S.label}>Recovery Amount ($)</span>
              <input value={subrogationAmount} onChange={e => setSubrogationAmount(e.target.value)} style={S.input} type="number" />
            </div>
            <div style={{ ...S.fieldGroup, flex: 1 }}>
              <span style={S.label}>Subrogation Status</span>
              <select value={subrogationStatus} onChange={e => setSubrogationStatus(e.target.value)} style={S.select}>
                {["Pending","Demand Sent","Payment Received","Closed - Collected","Closed - Waived","In Litigation"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <span style={S.label}>Subrogation Notes</span>
            <textarea
              value={subrogationNotes}
              onChange={e => setSubrogationNotes(e.target.value)}
              rows={3}
              style={S.textarea}
            />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button style={S.btn("var(--ctk-green)")}>Send Demand Letter</button>
            <button style={S.btn("var(--ctk-navy)")}>Log Recovery</button>
            <button style={S.btn("#888")}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
