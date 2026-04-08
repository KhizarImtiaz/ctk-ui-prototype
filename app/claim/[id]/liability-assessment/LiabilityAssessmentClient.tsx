"use client";
import { useState, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATE_LAW = "Alabama: Contributory - Any Negligence Eliminates Recovery; Check Company Procedure";

const ROW_DUTIES = [
  { title: "Driving on the left", duty: "Driving on the (b) No vehicle shall be driven to the left side of the center of the roadway in overtaking and passing..." },
];
const LOOKOUT_DUTIES = [
  { title: "Concentration", duty: "Concentration is one of the most important elements of safe driving. The driver's seat is no place for daydreaming..." },
  { title: "Reasonable and Prudent Speed", duty: "" },
];
const AVOIDANCE_DUTIES = [
  { title: "Reasonable and Prudent Speed", duty: "(a) No vehicle shall be driven to the left side..." },
  { title: "SPEED REGULATIONS", duty: "Speed may not always, in itself, be the primary factor that turns a minor mishap..." },
];

const CLAIM_PARTIES: { name: string; type: string; isInsured?: boolean }[] = [
  { name: "Khizar Imtiaz",  type: "Driver With the Right of Way (ROW)*", isInsured: true },
  { name: "Khizar Imtiaz",  type: "Driver With the Right of Way (ROW)*", isInsured: true },
  { name: "Farhan Nazarat", type: "Driver Who Failed To Yield (FTY)" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

interface PartyEvidence {
  partyKey: string;   // unique key (name + index)
  partyName: string;
  partyType: string;
  isInsured: boolean;
  agree: "agree" | "disagree" | "";
  summary: string;
  attachedDocIds: string[];
}

interface DutyData {
  note: string;
  locationNote: string;
  parties: PartyEvidence[];
}

const makeDutyData = (): DutyData => ({
  note: "",
  locationNote: "",
  parties: CLAIM_PARTIES.map((p, i) => ({
    partyKey: `${p.name}-${i}`,
    partyName: p.name,
    partyType: p.type,
    isInsured: !!p.isInsured,
    agree: "",
    summary: "",
    attachedDocIds: [],
  })),
});

// ─── Shared style constants ───────────────────────────────────────────────────
const C = {
  border: "1px solid #aaa",
  borderLight: "1px solid #ddd",
  navy: "#1e2b40",
  green: "#2e7d2f",
  blue: "#1a5ca8",
  headerBg: "#d0d8e8",
  altRow: "#f8f9fb",
};

const colHeaderStyle = (bg = C.navy): React.CSSProperties => ({
  background: bg, color: "#fff", fontSize: 14, fontWeight: "bold",
  padding: "5px 8px", borderBottom: C.border,
});

const greenBtn: React.CSSProperties = {
  background: C.green, color: "#fff", border: "none",
  padding: "5px 0", fontSize: 13, fontWeight: "bold",
  cursor: "pointer", width: "100%", textAlign: "center",
};

const selectStyle: React.CSSProperties = {
  fontSize: 13, padding: "2px 4px", border: "1px solid #bbb",
  width: "100%", fontFamily: "Arial,sans-serif", background: "#fff", color: "#222",
};

const inputStyle: React.CSSProperties = {
  fontSize: 13, padding: "2px 4px", border: "1px solid #bbb",
  fontFamily: "Arial,sans-serif", background: "#fff", color: "#222",
  width: "100%",
};

const textareaStyle: React.CSSProperties = {
  width: "100%", fontSize: 13, fontFamily: "Arial,sans-serif",
  padding: "4px 6px", border: "1px solid #ccc", resize: "vertical" as const,
  boxSizing: "border-box" as const,
};

// ─── Small helpers ────────────────────────────────────────────────────────────
function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ fontSize: 12, color: "#444", marginBottom: 1, lineHeight: 1.3 }}>{label}</div>
      {children}
    </div>
  );
}

function FlagText({ children, color = "#c00" }: { children: React.ReactNode; color?: string }) {
  return <div style={{ fontSize: 12, color, fontWeight: "bold", marginTop: 2 }}>{children}</div>;
}

function DutiesTable({ title, rows }: { title: string; rows: { title: string; duty: string }[] }) {
  return (
    <div style={{ marginBottom: 6, border: C.border }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#e8eef4", padding: "3px 6px", borderBottom: C.border }}>
        <span style={{ fontWeight: "bold", fontSize: 13, color: C.navy }}>{title}</span>
        <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: C.blue }}>Add Duties</a>
      </div>
      {rows.length === 0 ? (
        <div style={{ padding: "4px 6px", fontSize: 12, color: "#666", fontStyle: "italic" }}>No {title} Duties Breached.</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f4f8" }}>
              {["Title", "Duty (Click to Freeze)", "Delete"].map(h => (
                <th key={h} style={{ fontSize: 12, padding: "2px 4px", borderBottom: C.borderLight, borderRight: C.borderLight, textAlign: "left", color: "#444", fontWeight: "bold" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8f8f8" }}>
                <td style={{ fontSize: 12, padding: "2px 4px", borderBottom: C.borderLight, borderRight: C.borderLight, verticalAlign: "top", maxWidth: 80, wordBreak: "break-word" }}>{r.title}</td>
                <td style={{ fontSize: 12, padding: "2px 4px", borderBottom: C.borderLight, borderRight: C.borderLight, color: "#555", maxWidth: 120 }}>
                  {r.duty.length > 60 ? r.duty.slice(0, 60) + "..." : r.duty}
                </td>
                <td style={{ padding: "2px 4px", borderBottom: C.borderLight }}>
                  <button style={{ fontSize: 13, padding: "1px 6px", background: "#e8e8e8", border: "1px solid #bbb", cursor: "pointer", color: "#c00" }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function ImpactGrid({ label }: { label: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const positions = ["FL", "F", "FR", "L", "C", "R", "BL", "B", "BR"];
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontSize: 12, color: "#444", marginBottom: 2 }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 28px)", gap: 2, width: "fit-content" }}>
        {positions.map((pos, i) => (
          <button key={i} onClick={() => setSelected(selected === i ? null : i)}
            style={{
              width: 28, height: 22, fontSize: 13, border: "1px solid #bbb", cursor: "pointer",
              background: selected === i ? C.green : "#f0f0f0",
              color: selected === i ? "#fff" : "#444", fontWeight: selected === i ? "bold" : "normal",
            }}>{pos}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Document cell (used inside the table) ───────────────────────────────────
function DocCell({
  party, uploadedDocs, onUpload, onAttach, onDetach,
}: {
  party: PartyEvidence;
  uploadedDocs: UploadedDoc[];
  onUpload: (doc: UploadedDoc) => void;
  onAttach: (id: string) => void;
  onDetach: (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(f => {
      const doc: UploadedDoc = {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toLocaleDateString(),
      };
      onUpload(doc);
      onAttach(doc.id);
    });
    e.target.value = "";
  };

  const attached   = uploadedDocs.filter(d => party.attachedDocIds.includes(d.id));
  const unattached = uploadedDocs.filter(d => !party.attachedDocIds.includes(d.id));

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
      {/* Attached doc list */}
      {attached.map(doc => (
        <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 4, background: "#f0f4f0", border: "1px solid #b8d8b8", borderRadius: 2, padding: "2px 6px" }}>
          <span style={{ fontSize: 13 }}>📄</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{doc.name}</div>
          </div>
          <button onClick={() => onDetach(doc.id)} style={{ fontSize: 10, padding: "0px 5px", background: "#fff0f0", border: "1px solid #e0a0a0", borderRadius: 2, cursor: "pointer", color: "#c00" }}>✕</button>
        </div>
      ))}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
        <button onClick={() => fileRef.current?.click()}
          style={{ fontSize: 11, padding: "2px 8px", background: C.navy, color: "#fff", border: "none", borderRadius: 2, cursor: "pointer", fontWeight: "bold" }}>
          ⬆ Upload
        </button>
        <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />

        <div style={{ position: "relative" as const }}>
          <button onClick={() => setShowPicker(v => !v)}
            style={{ fontSize: 11, padding: "2px 8px", background: C.blue, color: "#fff", border: "none", borderRadius: 2, cursor: "pointer", fontWeight: "bold" }}>
            📎 Claim Docs{unattached.length > 0 ? ` (${unattached.length})` : ""}
          </button>
          {showPicker && (
            <div style={{ position: "absolute" as const, top: "110%", left: 0, zIndex: 300, background: "#fff", border: "1px solid #aaa", borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.18)", minWidth: 260, padding: 6 }}>
              <div style={{ fontSize: 12, fontWeight: "bold", color: "#555", marginBottom: 4, borderBottom: "1px solid #eee", paddingBottom: 3 }}>
                {unattached.length === 0 ? "No more claim documents available." : "Select a claim document:"}
              </div>
              {unattached.map(doc => (
                <div key={doc.id} onClick={() => { onAttach(doc.id); setShowPicker(false); }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", cursor: "pointer", borderRadius: 2, marginBottom: 2 }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#e8f0e8")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ fontSize: 14 }}>📄</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{doc.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{doc.size} · {doc.uploadedAt}</div>
                  </div>
                </div>
              ))}
              <button onClick={() => setShowPicker(false)} style={{ fontSize: 11, padding: "2px 8px", marginTop: 4, background: "#eee", border: "1px solid #ccc", cursor: "pointer", width: "100%" }}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Parties Table ────────────────────────────────────────────────────────────
function PartiesTable({
  parties, uploadedDocs, onUpload,
  onPartyAgree, onPartySummary, onPartyAttach, onPartyDetach,
}: {
  parties: PartyEvidence[];
  uploadedDocs: UploadedDoc[];
  onUpload: (doc: UploadedDoc) => void;
  onPartyAgree:   (key: string, val: "agree" | "disagree" | "") => void;
  onPartySummary: (key: string, val: string) => void;
  onPartyAttach:  (key: string, docId: string) => void;
  onPartyDetach:  (key: string, docId: string) => void;
}) {
  const thStyle: React.CSSProperties = {
    padding: "6px 10px", fontSize: 13, fontWeight: "bold", textAlign: "left",
    background: "#d8d8d0", color: "#222", borderRight: "1px solid #bbb",
    borderBottom: "2px solid #aaa", whiteSpace: "nowrap" as const,
  };
  const tdStyle = (alt: boolean): React.CSSProperties => ({
    padding: "8px 10px", fontSize: 13, verticalAlign: "top",
    borderRight: "1px solid #ccc", borderBottom: "1px solid #ccc",
    background: alt ? "#e8e8e0" : "#f8f8f4",
  });

  return (
    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #bbb" }}>
      <thead>
        <tr>
          <th style={{ ...thStyle, width: 160 }}>Name (Insured *)</th>
          <th style={{ ...thStyle, width: 220 }}>Party Type</th>
          <th style={thStyle}>Summary</th>
          <th style={{ ...thStyle, width: 220 }}>Documents</th>
          <th style={{ ...thStyle, width: 180, borderRight: "none" }}>Action</th>
        </tr>
      </thead>
      <tbody>
        {parties.map((party, idx) => {
          const alt = idx % 2 === 1;
          const isAgree    = party.agree === "agree";
          const isDisagree = party.agree === "disagree";
          return (
            <tr key={party.partyKey}>
              {/* Name */}
              <td style={tdStyle(alt)}>
                <a href="#" onClick={e => e.preventDefault()}
                  style={{ color: C.blue, fontWeight: "bold", fontSize: 13, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                  onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}>
                  {party.partyName}{party.isInsured ? "*" : ""}
                </a>
              </td>

              {/* Party type */}
              <td style={tdStyle(alt)}>
                <span style={{ fontSize: 13, color: "#222" }}>{party.partyType}</span>
              </td>

              {/* Summary */}
              <td style={tdStyle(alt)}>
                <textarea
                  rows={2} value={party.summary}
                  onChange={e => onPartySummary(party.partyKey, e.target.value)}
                  placeholder="Enter summary…"
                  style={{ ...textareaStyle, minWidth: 140 }}
                />
              </td>

              {/* Documents */}
              <td style={tdStyle(alt)}>
                <DocCell
                  party={party}
                  uploadedDocs={uploadedDocs}
                  onUpload={onUpload}
                  onAttach={id => onPartyAttach(party.partyKey, id)}
                  onDetach={id => onPartyDetach(party.partyKey, id)}
                />
              </td>

              {/* Action — Agree / Disagree */}
              <td style={{ ...tdStyle(alt), borderRight: "none" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => onPartyAgree(party.partyKey, isAgree ? "" : "agree")}
                    style={{
                      padding: "4px 12px", fontSize: 12, fontWeight: "bold", cursor: "pointer", borderRadius: 2,
                      border: `1px solid ${isAgree ? C.green : "#bbb"}`,
                      background: isAgree ? C.green : "#f0f0f0",
                      color: isAgree ? "#fff" : "#444",
                    }}>✓ Agree</button>
                  <button
                    onClick={() => onPartyAgree(party.partyKey, isDisagree ? "" : "disagree")}
                    style={{
                      padding: "4px 12px", fontSize: 12, fontWeight: "bold", cursor: "pointer", borderRadius: 2,
                      border: `1px solid ${isDisagree ? "#c00" : "#bbb"}`,
                      background: isDisagree ? "#c00" : "#f0f0f0",
                      color: isDisagree ? "#fff" : "#444",
                    }}>✗ Disagree</button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Duty Section Panel ───────────────────────────────────────────────────────
function DutySectionPanel({
  title, subtitle, locationLabel,
  data, onNoteChange, onLocationChange, onPartyAgree, onPartySummary, onPartyAttach, onPartyDetach,
  uploadedDocs, onUpload,
}: {
  title: string;
  subtitle: string;
  locationLabel?: string;
  data: DutyData;
  onNoteChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onPartyAgree:   (key: string, val: "agree" | "disagree" | "") => void;
  onPartySummary: (key: string, val: string) => void;
  onPartyAttach:  (key: string, docId: string) => void;
  onPartyDetach:  (key: string, docId: string) => void;
  uploadedDocs: UploadedDoc[];
  onUpload: (doc: UploadedDoc) => void;
}) {
  return (
    <div style={{ padding: "12px 14px", background: "#fff" }}>
      {/* Parties table */}
      <div style={{ marginBottom: 12 }}>
        <PartiesTable
          parties={data.parties}
          uploadedDocs={uploadedDocs}
          onUpload={onUpload}
          onPartyAgree={onPartyAgree}
          onPartySummary={onPartySummary}
          onPartyAttach={onPartyAttach}
          onPartyDetach={onPartyDetach}
        />
      </div>

      {/* Location field (Speed = Location of Impact / Lookout = Point of Impact) */}
      {locationLabel && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: "bold", color: "#555", marginBottom: 3 }}>{locationLabel}</div>
          <input
            style={inputStyle}
            value={data.locationNote}
            onChange={e => onLocationChange(e.target.value)}
            placeholder={`Enter ${locationLabel}…`}
          />
        </div>
      )}

      {/* Overall notes for this duty */}
      <div>
        <div style={{ fontSize: 12, fontWeight: "bold", color: "#555", marginBottom: 3 }}>Notes for {title}</div>
        <textarea
          rows={3} value={data.note}
          onChange={e => onNoteChange(e.target.value)}
          placeholder={`Key facts and notes about ${title}…`}
          style={textareaStyle}
        />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LiabilityAssessmentPage() {
  // Suggested Assessment dropdowns
  const [rowOwner,   setRowOwner]   = useState("Claimant");
  const [foreseeable, setForeseeable] = useState("Yes");
  const [rowSpeed,   setRowSpeed]   = useState("Please Select One");
  const [speedAssess, setSpeedAssess] = useState("Reduced Speed Required");
  const [lookout1,   setLookout1]   = useState("None Selected");
  const [lookout2,   setLookout2]   = useState("None Selected");
  const [lookout3,   setLookout3]   = useState("None Selected");
  const [avoidance1, setAvoidance1] = useState("None Selected");
  const [avoidance2, setAvoidance2] = useState("None Selected");
  const [avoidance3, setAvoidance3] = useState("None Selected");
  const [legalCtrl,  setLegalCtrl]  = useState("");
  const [physCtrl,   setPhysCtrl]   = useState("");
  const [insLeading, setInsLeading] = useState("No");
  const [clmLeading, setClmLeading] = useState("No");

  // Actual Assessment inputs
  const [insActual, setInsActual] = useState("0%");
  const [insLow,    setInsLow]    = useState("0%");
  const [clmActual, setClmActual] = useState("0%");
  const [insHigh,   setInsHigh]   = useState("0%");
  const [clmHigh,   setClmHigh]   = useState("0%");
  const [clmLow,    setClmLow]    = useState("0%");
  const [deny,      setDeny]      = useState("No");

  // Evidence of Duty Breaches — per-duty data
  const [rowDuty, setRowDuty] = useState<DutyData>(makeDutyData);
  const [spdDuty, setSpdDuty] = useState<DutyData>(makeDutyData);
  const [lkDuty,  setLkDuty]  = useState<DutyData>(makeDutyData);
  const [avDuty,  setAvDuty]  = useState<DutyData>(makeDutyData);

  // Overall summary for Evidence tab
  const [overallSummary, setOverallSummary] = useState("");

  // Evidence tab
  const [evidTab, setEvidTab] = useState<"evidence" | "summary">("evidence");

  // Shared uploaded docs pool
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const addDoc = (doc: UploadedDoc) =>
    setUploadedDocs(prev => prev.some(d => d.id === doc.id) ? prev : [...prev, doc]);

  // Helpers to update duty data immutably
  const updateDuty = (
    setter: React.Dispatch<React.SetStateAction<DutyData>>,
    updater: (prev: DutyData) => DutyData
  ) => setter(updater);

  const makeHandlers = (setter: React.Dispatch<React.SetStateAction<DutyData>>) => ({
    onNoteChange:     (v: string) => updateDuty(setter, d => ({ ...d, note: v })),
    onLocationChange: (v: string) => updateDuty(setter, d => ({ ...d, locationNote: v })),
    onPartyAgree:     (key: string, val: "agree" | "disagree" | "") => updateDuty(setter, d => ({
      ...d, parties: d.parties.map(p => p.partyKey === key ? { ...p, agree: val } : p),
    })),
    onPartySummary:   (key: string, val: string) => updateDuty(setter, d => ({
      ...d, parties: d.parties.map(p => p.partyKey === key ? { ...p, summary: val } : p),
    })),
    onPartyAttach:    (key: string, id: string) => updateDuty(setter, d => ({
      ...d, parties: d.parties.map(p => p.partyKey === key && !p.attachedDocIds.includes(id)
        ? { ...p, attachedDocIds: [...p.attachedDocIds, id] } : p),
    })),
    onPartyDetach:    (key: string, id: string) => updateDuty(setter, d => ({
      ...d, parties: d.parties.map(p => p.partyKey === key
        ? { ...p, attachedDocIds: p.attachedDocIds.filter(x => x !== id) } : p),
    })),
  });

  const rowH = makeHandlers(setRowDuty);
  const spdH = makeHandlers(setSpdDuty);
  const lkH  = makeHandlers(setLkDuty);
  const avH  = makeHandlers(setAvDuty);

  const calc = () => alert("Calculate Suggested & Update Duties (prototype)");
  const save = () => alert("Saved! (prototype)");

  const evidTabBtn = (tab: "evidence" | "summary"): React.CSSProperties => ({
    padding: "7px 20px", border: "none", cursor: "pointer", fontSize: 13, fontWeight: "bold",
    background: evidTab === tab ? C.navy : "#e8e8e8",
    color: evidTab === tab ? "#fff" : "#333",
    borderRight: "1px solid #aaa",
  });

  return (
    <div style={{ fontFamily: "Arial,sans-serif", fontSize: 14, color: "#222", background: "#fff", display: "flex", flexDirection: "column", gap: 6 }}>

      {/* ── Claim info bar ───────────────────────────────────────────── */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, background: C.headerBg, border: C.border, padding: "4px 10px", fontSize: 13 }}>
        <span><strong>Claim Number:</strong> Kh2000-Street-View-Test</span>
        <span><strong>Insured Name</strong> Insured-Street-View-</span>
        <span><strong>Date of Loss:</strong> 2/25/2026</span>
        <span><strong>State</strong> Alabama</span>
      </div>

      {/* ── Top 3-column layout ──────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 6, alignItems: "flex-start" }}>

        {/* COL 1 — Suggested Assessment dropdowns */}
        <div style={{ width: 420, flexShrink: 0, border: C.border, background: "#fff" }}>
          <div style={colHeaderStyle()}>Suggested Assessment</div>

          <div style={{ display: "flex", borderBottom: C.borderLight }}>
            {[["0%","Insured Suggested Neg"],["100%","Claimant Suggested Neg"],["Left of Center","Accident Type"]].map(([v,l]) => (
              <div key={l} style={{ flex: 1, padding: "4px 4px", textAlign: "center", borderRight: C.borderLight, background: "#f8f9fb" }}>
                <div style={{ fontWeight: "bold", fontSize: 14, color: C.navy }}>{v}</div>
                <div style={{ fontSize: 13, color: "#666", lineHeight: 1.2 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: "6px 6px" }}>
            <button style={greenBtn} onClick={calc}>Calculate Suggested &amp; Update Duties</button>
          </div>

          <div style={{ padding: "4px 6px", borderTop: C.borderLight }}>
            <FieldRow label="Who Had the Right of Way?">
              <select style={selectStyle} value={rowOwner} onChange={e => setRowOwner(e.target.value)}>
                {["Claimant","Insured","Unknown"].map(o => <option key={o}>{o}</option>)}
              </select>
              <FlagText>Last Clear Chance Valid</FlagText>
            </FieldRow>
            <FieldRow label="Was the Danger Foreseeable for the Driver With the Right of Way?">
              <select style={selectStyle} value={foreseeable} onChange={e => setForeseeable(e.target.value)}>
                {["Yes","No"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="ROW Driver's Stated Speed">
              <select style={selectStyle} value={rowSpeed} onChange={e => setRowSpeed(e.target.value)}>
                {["Please Select One","At speed limit","Below speed limit","Above speed limit","Unknown"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Speed Assessment">
              <select style={selectStyle} value={speedAssess} onChange={e => setSpeedAssess(e.target.value)}>
                {["Reduced Speed Required","Speed Not a Factor","Speed at Issue"].map(o => <option key={o}>{o}</option>)}
              </select>
              <FlagText color="#886000">Reduced Speed Required</FlagText>
            </FieldRow>
            <FieldRow label="Lookout Assessment  Look Out Type: Aware of Actual and Potential Hazards">
              <select style={selectStyle} value={lookout1} onChange={e => setLookout1(e.target.value)}>
                {["None Selected","Aware of Hazard","Not Aware"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Lookout Assessment">
              <select style={selectStyle} value={lookout2} onChange={e => setLookout2(e.target.value)}>
                {["None Selected","Adequate","Inadequate"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Lookout Assessment">
              <select style={selectStyle} value={lookout3} onChange={e => setLookout3(e.target.value)}>
                {["None Selected","Adequate","Inadequate"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Avoidance Assessment  Avoidance Type: Reasonable">
              <select style={selectStyle} value={avoidance1} onChange={e => setAvoidance1(e.target.value)}>
                {["None Selected","Reasonable","Unreasonable"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Avoidance Assessment  Horn Required To Warn">
              <select style={selectStyle} value={avoidance2} onChange={e => setAvoidance2(e.target.value)}>
                {["None Selected","Yes","No"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Avoidance Assessment">
              <select style={selectStyle} value={avoidance3} onChange={e => setAvoidance3(e.target.value)}>
                {["None Selected","Adequate","Inadequate"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Who Had Legal Control of the Location of Impact?">
              <select style={selectStyle} value={legalCtrl} onChange={e => setLegalCtrl(e.target.value)}>
                {["","Claimant","Insured","Neither"].map(o => <option key={o} value={o}>{o || "-- Select --"}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Who Had Physical Control of the Location of Impact?">
              <select style={selectStyle} value={physCtrl} onChange={e => setPhysCtrl(e.target.value)}>
                {["","Claimant","Insured","Neither"].map(o => <option key={o} value={o}>{o || "-- Select --"}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Was The Insured's Leading Edge Damaged?">
              <select style={selectStyle} value={insLeading} onChange={e => setInsLeading(e.target.value)}>
                {["No","Yes"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <FieldRow label="Was The Claimant's Leading Edge Damaged?">
              <select style={selectStyle} value={clmLeading} onChange={e => setClmLeading(e.target.value)}>
                {["No","Yes"].map(o => <option key={o}>{o}</option>)}
              </select>
            </FieldRow>
            <ImpactGrid label="Initial Point of Impact on Insured Vehicle" />
            <ImpactGrid label="Initial Point of Impact on Claimant Vehicle" />
            <div style={{ marginTop: 4, marginBottom: 6 }}>
              <button style={greenBtn} onClick={calc}>Calculate Suggested &amp; Update Duties</button>
            </div>
          </div>
        </div>

        {/* COL 2 — Duties Breached tables */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 0 }}>
          <DutiesTable title="ROW Duties Breached" rows={ROW_DUTIES} />
          <DutiesTable title="Speed Duties Breached" rows={[]} />
          <DutiesTable title="Look Out Duties Breached" rows={LOOKOUT_DUTIES} />
          <DutiesTable title="Avoidance Duties Breached" rows={AVOIDANCE_DUTIES} />
        </div>

        {/* COL 3 — Actual Assessment */}
        <div style={{ width: 500, flexShrink: 0, border: C.border, background: "#fff" }}>
          <div style={colHeaderStyle()}>Actual Assessment</div>

          <div style={{ padding: "6px 8px", borderBottom: C.borderLight }}>
            <div style={{ fontSize: 13, color: C.green, fontWeight: "bold", lineHeight: 1.4 }}>{STATE_LAW}</div>
          </div>

          <div style={{ padding: "4px 8px", borderBottom: C.borderLight, display: "flex", flexDirection: "column", gap: 2 }}>
            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: C.green, textDecoration: "underline", lineHeight: 1.3 }}>
              To Change the Claim Rep Who Owns the Assessment To You Click Here
            </a>
            <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 12, color: C.green, textDecoration: "underline", lineHeight: 1.3 }}>
              To Change the Claim Rep To Someone Else, Click Here
            </a>
          </div>

          <div style={{ padding: "6px 8px" }}>
            {[
              [["Insured Actual Negligence", insActual, setInsActual], ["Insured Low End", insLow, setInsLow]],
              [["Claimant Negligence Actual", clmActual, setClmActual], ["Insured High End", insHigh, setInsHigh]],
              [["Claimant Negligence High", clmHigh, setClmHigh], ["Claimant Negligence Low", clmLow, setClmLow]],
            ].map((row, ri) => (
              <div key={ri} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                {(row as [string, string, (v: string) => void][]).map(([lbl, val, setter]) => (
                  <div key={lbl} style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "#555", marginBottom: 1 }}>{lbl}</div>
                    <input style={{ ...inputStyle, width: "100%" }} value={val} onChange={e => setter(e.target.value)} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ padding: "6px 8px", borderTop: C.borderLight, background: "#f8f8f8", display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={save} style={{ background: C.green, color: "#fff", border: "none", padding: "4px 14px", fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
              Save Changes
            </button>
            <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#333" }}>
              Deny Claimant?
              <select value={deny} onChange={e => setDeny(e.target.value)} style={{ fontSize: 13, padding: "2px 3px", border: "1px solid #bbb", fontFamily: "Arial,sans-serif" }}>
                <option>No</option><option>Yes</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* ── Evidence of Duty Breaches (tabbed, below Avoidance & Actual Assessment) ── */}
      <div style={{ border: C.border, marginTop: 2 }}>

        {/* Tab bar */}
        <div style={{ display: "flex", background: "#e8e8e8", borderBottom: C.border }}>
          <button style={evidTabBtn("evidence")} onClick={() => setEvidTab("evidence")}>
            Evidence of Duty Breaches
          </button>
          <button style={evidTabBtn("summary")} onClick={() => setEvidTab("summary")}>
            Overall Summary
          </button>
        </div>

        {/* Evidence tab */}
        {evidTab === "evidence" && (
          <div>
            {/* ROW */}
            <div style={{ borderBottom: C.border, background: C.altRow }}>
              <div style={{ padding: "6px 12px", background: "#eaf0f8", borderBottom: C.borderLight }}>
                <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>Right of Way Duties</span>
                <span style={{ fontSize: 12, color: "#666", fontStyle: "italic", marginLeft: 8 }}>— What Duty Was Breached to Give ROW?</span>
              </div>
              <DutySectionPanel
                title="Right of Way Key Facts" subtitle="What evidence proves the duty breach?"
                data={rowDuty} uploadedDocs={uploadedDocs} onUpload={addDoc}
                {...rowH}
              />
            </div>

            {/* Speed */}
            <div style={{ borderBottom: C.border }}>
              <div style={{ padding: "6px 12px", background: "#eaf0f8", borderBottom: C.borderLight }}>
                <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>Speed Duties</span>
                <span style={{ fontSize: 12, color: "#666", fontStyle: "italic", marginLeft: 8 }}>— What Duty Was Breached in Speed?</span>
              </div>
              <DutySectionPanel
                title="Speed Key Facts" subtitle="What evidence proves the duty breach?"
                locationLabel="Location of Impact"
                data={spdDuty} uploadedDocs={uploadedDocs} onUpload={addDoc}
                {...spdH}
              />
            </div>

            {/* Lookout */}
            <div style={{ borderBottom: C.border, background: C.altRow }}>
              <div style={{ padding: "6px 12px", background: "#eaf0f8", borderBottom: C.borderLight }}>
                <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>Lookout Duties</span>
                <span style={{ fontSize: 12, color: "#666", fontStyle: "italic", marginLeft: 8 }}>— What Look Out Duties did ROW Driver Breach?</span>
              </div>
              <DutySectionPanel
                title="Lookout Key Facts" subtitle="What evidence proves the duty breach?"
                locationLabel="Point of Impact"
                data={lkDuty} uploadedDocs={uploadedDocs} onUpload={addDoc}
                {...lkH}
              />
            </div>

            {/* Avoidance */}
            <div>
              <div style={{ padding: "6px 12px", background: "#eaf0f8", borderBottom: C.borderLight }}>
                <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>Avoidance Duties</span>
                <span style={{ fontSize: 12, color: "#666", fontStyle: "italic", marginLeft: 8 }}>— What Avoidance Duties did ROW Driver Breach?</span>
              </div>
              <DutySectionPanel
                title="Avoidance Key Facts" subtitle="What evidence proves the duty breach?"
                data={avDuty} uploadedDocs={uploadedDocs} onUpload={addDoc}
                {...avH}
              />
            </div>
          </div>
        )}

        {/* Overall Summary tab */}
        {evidTab === "summary" && (
          <div style={{ padding: "16px 16px" }}>
            <div style={{ fontSize: 14, fontWeight: "bold", color: C.navy, marginBottom: 6 }}>Overall Summary of Evidence of Duty Breaches</div>
            <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
              Provide a consolidated summary of all duty breaches and supporting evidence across ROW, Speed, Lookout, and Avoidance duties.
            </div>
            <textarea
              rows={10} value={overallSummary}
              onChange={e => setOverallSummary(e.target.value)}
              placeholder="Enter overall summary of evidence and duty breaches…"
              style={{ ...textareaStyle, minHeight: 200 }}
            />
          </div>
        )}
      </div>

      {/* Save */}
      <div style={{ textAlign: "center", padding: "6px 0 10px" }}>
        <button onClick={save} style={{ background: C.green, color: "#fff", border: "none", padding: "5px 40px", fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>
          Save
        </button>
      </div>
    </div>
  );
}
