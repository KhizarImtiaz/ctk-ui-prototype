"use client";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "unaddressed" | "confirmed" | "disputed";

interface CheckItem {
  id: string;
  group: string;
  label: string;
  status: Status;
  disputeNote: string;
  resolutionNote: string;
  resolutionDate: string;
  resolutionType: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const SEED: Omit<CheckItem, "status" | "disputeNote" | "resolutionNote" | "resolutionDate" | "resolutionType">[] = [
  { id: "date_loss",       group: "Incident Details",               label: "Confirm Date of Loss" },
  { id: "time_loss",       group: "Incident Details",               label: "Confirm Time of Loss" },
  { id: "loss_location",   group: "Incident Details",               label: "Confirm Loss Location" },
  { id: "acc_type",        group: "Incident Details",               label: "Confirm Accident Type" },
  { id: "acc_facts",       group: "Incident Details",               label: "Confirm Accident Facts" },
  { id: "traffic_ctrl",    group: "Scene & Environment",            label: "Confirm Traffic Control" },
  { id: "area_risk",       group: "Scene & Environment",            label: "Confirm Area Risk Factors" },
  { id: "adverse_wx",      group: "Scene & Environment",            label: "Confirm Adverse Weather" },
  { id: "loc_impact",      group: "Scene & Environment",            label: "Confirm Location of Impact" },
  { id: "point_impact",    group: "Scene & Environment",            label: "Confirm Point of Impact" },
  { id: "num_vehicles",    group: "Vehicles & Injuries",            label: "Confirm Number of Vehicles" },
  { id: "num_injuries",    group: "Vehicles & Injuries",            label: "Confirm Number of Injuries" },
  { id: "row_driver",      group: "Right of Way (ROW) Analysis",   label: "Confirm Right of Way Driver" },
  { id: "row_speed",       group: "Right of Way (ROW) Analysis",   label: "Confirm ROW Speed" },
  { id: "row_lookout",     group: "Right of Way (ROW) Analysis",   label: "Confirm ROW Lookout" },
  { id: "row_avoid",       group: "Right of Way (ROW) Analysis",   label: "Confirm ROW Avoidance" },
  { id: "sugg_assess",     group: "Assessments",                    label: "Complete Suggested Assessment" },
  { id: "actual_assess",   group: "Assessments",                    label: "Complete Actual Assessment" },
  { id: "ins_stmt",        group: "Statements & Reports",           label: "Insured Driver Statement" },
  { id: "ins_pass_stmt",   group: "Statements & Reports",           label: "Insured Passenger Statement" },
  { id: "clm_stmt",        group: "Statements & Reports",           label: "Claimant Driver Statement" },
  { id: "clm_pass_stmt",   group: "Statements & Reports",           label: "Claimant Passenger Statement" },
  { id: "witness_stmt",    group: "Statements & Reports",           label: "Witness Statement" },
  { id: "police_ordered",  group: "Statements & Reports",           label: "Police Report Ordered" },
  { id: "police_recv",     group: "Statements & Reports",           label: "Police Report Received" },
  { id: "scene_diagram",   group: "Scene Documentation",            label: "Complete Scene Diagram" },
  { id: "last_clear",      group: "Liability & Approval Processes", label: "Last Clear Chance Approval Process" },
  { id: "unforeseen",      group: "Liability & Approval Processes", label: "Not Foreseeable Approval Process" },
  { id: "sudden_emerg",    group: "Liability & Approval Processes", label: "Sudden Emergency Defense Approval" },
  { id: "word_vs_word",    group: "Liability & Approval Processes", label: "Word vs Word Approval Process" },
  { id: "neg_settle",      group: "Settlement & Closure",           label: "Negotiate Settlement" },
  { id: "close_actions",   group: "Settlement & Closure",           label: "Complete Closing Actions" },
];

const INITIAL: CheckItem[] = SEED.map(s => ({
  ...s, status: "unaddressed", disputeNote: "", resolutionNote: "", resolutionDate: "", resolutionType: "",
}));

const LEGAL = {
  state: "Alabama",
  rule: "Contributory — Any Negligence Eliminates Recovery; Check Company Procedure",
  accidentType: "U Turn",
  accidentSubType: "Right of Way Clear",
  rightOfWay: "Insured",
  rowFlags: ["Last Clear Chance Valid", "Reduced Speed Required"],
  speedType: "Must Reduce Speed With Conditions",
  avoidanceType: "Reasonable",
  avoidanceFlags: ["Horn Required to Warn"],
  lookoutType: "Aware of Actual and Potential Hazards",
};

// ─── Styles (inline, enterprise feel) ────────────────────────────────────────
const S = {
  page: { display: "flex", flexDirection: "column" as const, gap: 6 },
  titleBar: {
    display: "flex", alignItems: "center", gap: 6,
    background: "#f0f4f0", border: "1px solid var(--ctk-border)",
    borderLeft: "4px solid var(--ctk-green)", padding: "6px 10px",
    fontWeight: "bold", fontSize: 13, color: "var(--ctk-navy)",
  },
  tabRow: { display: "flex", border: "1px solid var(--ctk-border)", background: "#e8e8e8" },
  tab: (active: boolean): React.CSSProperties => ({
    flex: 1, padding: "7px 10px", border: "none", cursor: "pointer", fontWeight: "bold",
    fontSize: 12, textAlign: "center" as const,
    background: active ? "var(--ctk-green)" : "#e8e8e8",
    color: active ? "#fff" : "#333",
    transition: "background 0.15s",
  }),
  // Checklist
  checkWrap: { display: "flex", border: "1px solid var(--ctk-border)", minHeight: 480 },
  sidebarWrap: { width: 200, borderRight: "1px solid var(--ctk-border)", background: "#f8f8f8", overflowY: "auto" as const, flexShrink: 0 },
  sidebarHead: { background: "var(--ctk-navy)", color: "#fff", fontWeight: "bold", fontSize: 12, padding: "6px 8px" },
  groupWrap: (active: boolean): React.CSSProperties => ({
    borderBottom: "1px solid #ddd", cursor: "pointer",
    background: active ? "#d8ecd8" : "transparent",
  }),
  groupLabel: { fontWeight: "bold", fontSize: 11, padding: "4px 8px", color: "#2e5a2e" },
  sideItem: (status: Status): React.CSSProperties => ({
    fontSize: 10, padding: "1px 8px 1px 16px", lineHeight: 1.5,
    color: status === "confirmed" ? "#060" : status === "disputed" ? "#c00" : "#444",
    textDecoration: status === "confirmed" ? "line-through" : "none",
    fontWeight: status === "disputed" ? "bold" : "normal",
  }),
  contentWrap: { flex: 1, display: "flex", flexDirection: "column" as const, minWidth: 0 },
  toolbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "5px 10px", background: "#f0f0f0", borderBottom: "1px solid #ddd", fontSize: 11,
  },
  disputeList: { flex: 1, overflowY: "auto" as const, padding: 6, display: "flex", flexDirection: "column" as const, gap: 4 },
  // Dispute row
  dRow: (status: Status): React.CSSProperties => ({
    border: `1px solid ${status === "confirmed" ? "#6a9a6a" : status === "disputed" ? "#c00" : "#ccc"}`,
    background: status === "confirmed" ? "#f0fff0" : status === "disputed" ? "#fff5f5" : "#fff",
    borderRadius: 2,
  }),
  dRowHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "5px 8px", borderBottom: "1px solid #e0e0e0", background: "#f4f6f8", gap: 8,
  },
  dLabel: { fontSize: 11, fontWeight: "bold", color: "#333", flex: 1 },
  statusBtns: { display: "flex", gap: 3 },
  statusBtn: (active: boolean, variant: "normal" | "confirm" | "dispute"): React.CSSProperties => ({
    padding: "2px 8px", fontSize: 10, border: "1px solid #bbb", cursor: "pointer", borderRadius: 2,
    background: !active ? "#e8e8e8" : variant === "confirm" ? "var(--ctk-green)" : variant === "dispute" ? "#c00" : "#d0d8e8",
    color: !active ? "#444" : variant === "confirm" || variant === "dispute" ? "#fff" : "#224",
    fontWeight: active ? "bold" : "normal",
    borderColor: !active ? "#bbb" : variant === "confirm" ? "#1a5c1a" : variant === "dispute" ? "#900" : "#6080b0",
  }),
  disputeFields: { padding: "8px 10px", display: "flex", flexDirection: "column" as const, gap: 6, background: "#fff8f8", borderTop: "1px solid #ecc" },
  fieldRow: { display: "flex", gap: 8 },
  field: { flex: 1, display: "flex", flexDirection: "column" as const, gap: 2 },
  fieldSm: { width: 150, flexShrink: 0, display: "flex", flexDirection: "column" as const, gap: 2 },
  fLabel: { fontSize: 10, color: "#666", fontWeight: "bold" },
  textarea: { fontFamily: "Arial,sans-serif", fontSize: 11, padding: "3px 5px", border: "1px solid #ccc", resize: "vertical" as const, width: "100%" },
  input: { fontFamily: "Arial,sans-serif", fontSize: 11, padding: "3px 5px", border: "1px solid #ccc", width: "100%" },
  select: { fontFamily: "Arial,sans-serif", fontSize: 11, padding: "3px 4px", border: "1px solid #ccc", width: "100%" },
  // Summary bar
  summaryBar: { display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", background: "#e8e8e8", borderTop: "1px solid #bbb", flexShrink: 0 },
  summaryCell: { display: "flex", flexDirection: "column" as const, alignItems: "center", minWidth: 52 },
  summaryNum: (color?: string): React.CSSProperties => ({ fontSize: 16, fontWeight: "bold", color: color ?? "#333", lineHeight: 1 }),
  summaryLbl: { fontSize: 9, color: "#666", textTransform: "uppercase" as const, letterSpacing: "0.03em" },
  saveBtn: { marginLeft: "auto", padding: "4px 20px", background: "var(--ctk-green)", color: "#fff", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: 12 },
  // Legal
  legalPanel: { border: "1px solid var(--ctk-border)", background: "#fff", padding: "16px 18px" },
  legalGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px 24px" },
  legalCell: { display: "flex", flexDirection: "column" as const, gap: 4 },
  legalState: { fontSize: 13, fontWeight: "bold", color: "var(--ctk-navy)" },
  legalRule: { fontSize: 11, color: "#333", lineHeight: 1.4 },
  legalFLabel: { fontSize: 11, fontWeight: "bold", color: "#555" },
  legalVal: { fontSize: 12, color: "#222" },
  legalFlag: { fontSize: 11, color: "#c00", fontWeight: "bold" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function DisputeRow({ item, onChange }: { item: CheckItem; onChange: (id: string, field: string, val: string) => void }) {
  const set = (field: string, val: string) => onChange(item.id, field, val);
  return (
    <div style={S.dRow(item.status)}>
      <div style={S.dRowHeader}>
        <span style={S.dLabel}>{item.label}</span>
        <div style={S.statusBtns}>
          <button style={S.statusBtn(item.status === "unaddressed", "normal")} onClick={() => set("status", "unaddressed")}>Unaddressed</button>
          <button style={S.statusBtn(item.status === "confirmed", "confirm")} onClick={() => set("status", "confirmed")}>Confirmed</button>
          <button style={S.statusBtn(item.status === "disputed", "dispute")} onClick={() => set("status", "disputed")}>Disputed</button>
        </div>
      </div>
      {item.status === "disputed" && (
        <div style={S.disputeFields}>
          <div style={S.fieldRow}>
            <div style={S.field}>
              <label style={S.fLabel}>Dispute Notes</label>
              <textarea style={S.textarea} rows={2} value={item.disputeNote} placeholder="Describe the dispute…" onChange={e => set("disputeNote", e.target.value)} />
            </div>
          </div>
          <div style={S.fieldRow}>
            <div style={S.field}>
              <label style={S.fLabel}>Resolution Notes</label>
              <textarea style={S.textarea} rows={2} value={item.resolutionNote} placeholder="How was this resolved…" onChange={e => set("resolutionNote", e.target.value)} />
            </div>
            <div style={S.fieldSm}>
              <label style={S.fLabel}>Resolution Date</label>
              <input type="date" style={S.input} value={item.resolutionDate} onChange={e => set("resolutionDate", e.target.value)} />
              <label style={{ ...S.fLabel, marginTop: 6 }}>Resolution Type</label>
              <select style={S.select} value={item.resolutionType} onChange={e => set("resolutionType", e.target.value)}>
                <option value="">-- Select --</option>
                {["Statement", "Police Report", "Physical Evidence", "Photos", "Witness", "Other"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChecklistPanel({ items, onItemChange }: { items: CheckItem[]; onItemChange: (id: string, field: string, val: string) => void }) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const groups = [...new Set(items.map(i => i.group))];
  const visible = showAll ? items : items.filter(i => i.status !== "confirmed");
  const filtered = activeGroup ? visible.filter(i => i.group === activeGroup) : visible;

  const confirmed = items.filter(i => i.status === "confirmed").length;
  const disputed  = items.filter(i => i.status === "disputed").length;
  const remaining = items.filter(i => i.status !== "confirmed").length;

  return (
    <div style={S.checkWrap}>
      {/* Sidebar */}
      <div style={S.sidebarWrap}>
        <div style={S.sidebarHead}>Check List</div>
        {groups.map(g => (
          <div key={g} style={S.groupWrap(activeGroup === g)} onClick={() => setActiveGroup(activeGroup === g ? null : g)}>
            <div style={S.groupLabel}>{g}</div>
            {items.filter(i => i.group === g).map(item => (
              <div key={item.id} style={S.sideItem(item.status)}>• {item.label}</div>
            ))}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={S.contentWrap}>
        <div style={S.toolbar}>
          <span style={{ color: "#555" }}>
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
            {activeGroup ? ` — ${activeGroup}` : ""}
          </span>
          <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11 }}>
            <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} />
            Show confirmed items
          </label>
        </div>

        <div style={S.disputeList}>
          {filtered.length === 0
            ? <div style={{ padding: 16, color: "var(--ctk-green)", fontStyle: "italic", textAlign: "center" }}>All items confirmed ✓</div>
            : filtered.map(item => <DisputeRow key={item.id} item={item} onChange={onItemChange} />)
          }
        </div>

        <div style={S.summaryBar}>
          <div style={S.summaryCell}><span style={S.summaryNum()}>{items.length}</span><span style={S.summaryLbl}>Total</span></div>
          <div style={S.summaryCell}><span style={S.summaryNum("var(--ctk-green)")}>{confirmed}</span><span style={S.summaryLbl}>Confirmed</span></div>
          <div style={S.summaryCell}><span style={S.summaryNum(disputed > 0 ? "#c00" : "#333")}>{disputed}</span><span style={S.summaryLbl}>Disputed</span></div>
          <div style={S.summaryCell}><span style={S.summaryNum(remaining > 0 ? "#886000" : "#333")}>{remaining}</span><span style={S.summaryLbl}>Remaining</span></div>
          <button style={S.saveBtn} onClick={() => alert("Saved! (prototype)")}>Save</button>
        </div>
      </div>
    </div>
  );
}

function LegalSummaryPanel() {
  return (
    <div style={S.legalPanel}>
      <div style={S.legalGrid}>
        <div style={S.legalCell}>
          <div style={S.legalState}>{LEGAL.state}</div>
          <div style={S.legalRule}>{LEGAL.rule}</div>
        </div>
        <div style={S.legalCell}>
          <div style={S.legalFLabel}>Accident Type:</div>
          <div style={S.legalVal}>{LEGAL.accidentType}</div>
          <div style={S.legalVal}>{LEGAL.accidentSubType}</div>
        </div>
        <div style={S.legalCell}>
          <div style={S.legalFLabel}>Right of Way</div>
          <div style={S.legalVal}>{LEGAL.rightOfWay}</div>
          {LEGAL.rowFlags.map(f => <div key={f} style={S.legalFlag}>{f}</div>)}
        </div>
        <div style={S.legalCell}>
          <div style={S.legalFLabel}>Speed Type</div>
          <div style={S.legalVal}>{LEGAL.speedType}</div>
        </div>
        <div style={S.legalCell}>
          <div style={S.legalFLabel}>Avoidance Type</div>
          <div style={S.legalVal}>{LEGAL.avoidanceType}</div>
          {LEGAL.avoidanceFlags.map(f => <div key={f} style={S.legalFlag}>{f}</div>)}
        </div>
        <div style={S.legalCell}>
          <div style={S.legalFLabel}>Lookout Type</div>
          <div style={S.legalVal}>{LEGAL.lookoutType}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InvestigationChecklistPage() {
  const [tab, setTab] = useState<"checklist" | "legal">("checklist");
  const [items, setItems] = useState<CheckItem[]>(INITIAL);

  const handleChange = (id: string, field: string, val: string) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it));

  return (
    <div style={S.page}>
      <div style={S.titleBar}>
        <span style={{ color: "var(--ctk-green)", fontSize: 10 }}>●</span>
        Auto Investigation Checklist and Legal Summary
      </div>

      <div style={S.tabRow}>
        <button style={S.tab(tab === "checklist")} onClick={() => setTab("checklist")}>
          Check List / Disputes / Resolution
        </button>
        <button style={S.tab(tab === "legal")} onClick={() => setTab("legal")}>
          Legal Summary
        </button>
      </div>

      {tab === "checklist" && <ChecklistPanel items={items} onItemChange={handleChange} />}
      {tab === "legal"    && <LegalSummaryPanel />}
    </div>
  );
}
