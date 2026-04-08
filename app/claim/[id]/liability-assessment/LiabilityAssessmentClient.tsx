"use client";
import { useState, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const STATE_LAW = "Alabama: Contributory - Any Negligence Eliminates Recovery; Check Company Procedure";

const ROW_DUTY_TEXT = `(a) The driver of any vehicle shall not turn such vehicle so as to proceed in the opposite direction unless the movement can be made safely and without interfering with other traffic.
(b) No vehicle shall be driven to the left side of the center of the roadway in overtaking and passing another vehicle proceeding in the same direction unless such left side is clearly visible and is free of oncoming traffic for a sufficient distance ahead to permit such overtaking and passing to be completely made without interfering with the operation of any vehicle approaching from the opposite direction or any vehicle overtaken.

Section 32-5A-84
Driving on the right, narrow roadways
Drivers of vehicles proceeding in opposite directions shall pass each other to the right, and upon roadways having width for not more than one lane of traffic in each direction each driver shall give to the right half of the roadway as nearly as possible.`;

const CONCENTRATION_TEXT = `Concentration is one of the most important elements of safe driving. The driver's seat is no place for daydreaming, mental napping, wool-gathering, or any form of distracting conversation. Lack of concentration can do a number of omissions of observation and cause an accident that could have been avoided. Driving an automobile is a full-time job. There have been too many crashes, after which the driver who survived said, "I don't know what happened."

Section 32-5A-170
Reasonable and Prudent Speed
No person shall drive a vehicle at a speed greater than is reasonable and prudent under the conditions and having regard to the actual and potential hazards then existing.`;

const SPEED_REGS_TEXT = `Speed may not always, in itself, be the primary factor that turns a minor mishap into a fatal accident. The greatest danger of excessive speed lies in the increased severity rather than the frequency of collisions.

Alabama's basic speed law provides that you must never drive a vehicle at a speed that is faster than reasonable under existing conditions.

Consider road, weather, and your vehicle condition, as well as your own physical condition. What might be a reasonable speed at one time may not be reasonable at another time because of conditions.

Section 32-5A-170
Reasonable and Prudent Speed
No person shall drive a vehicle at a speed greater than is reasonable and prudent under the conditions and having regard to the actual and potential hazards then existing. Consistent with the foregoing, every person shall drive at a safe and appropriate speed when approaching and crossing an intersection or railroad grade crossing, when approaching and going around a curve, when approaching a hill crest, when traveling on a narrow or winding roadway, and when special hazards exist with respect to pedestrians or other traffic or by reason of weather or highway conditions.`;

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

// ─── Document types ───────────────────────────────────────────────────────────
interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

// ─── Evidence section component ───────────────────────────────────────────────
function EvidenceSection({
  title, subtitle, notes, onNotesChange,
  uploadedDocs, onUpload,
  attachedIds, onAttach, onDetach,
}: {
  title: string;
  subtitle: string;
  notes: string;
  onNotesChange: (v: string) => void;
  uploadedDocs: UploadedDoc[];
  onUpload: (doc: UploadedDoc) => void;
  attachedIds: string[];
  onAttach: (id: string) => void;
  onDetach: (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showAttachPicker, setShowAttachPicker] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(f => {
      const doc: UploadedDoc = {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: f.name,
        size: f.size > 1024 * 1024
          ? `${(f.size / (1024 * 1024)).toFixed(1)} MB`
          : `${(f.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toLocaleDateString(),
      };
      onUpload(doc);
      onAttach(doc.id);
    });
    e.target.value = "";
  };

  const unattachedDocs = uploadedDocs.filter(d => !attachedIds.includes(d.id));
  const attachedDocs   = uploadedDocs.filter(d => attachedIds.includes(d.id));

  return (
    <div style={{ padding: "10px 12px", background: "#fff" }}>
      {/* Header */}
      <div style={{ fontSize: 13, fontWeight: "bold", color: C.navy, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>{subtitle}</div>

      {/* Notes textarea */}
      <textarea
        rows={3}
        value={notes}
        onChange={e => onNotesChange(e.target.value)}
        placeholder="Enter key facts and notes…"
        style={{ width: "100%", fontSize: 13, fontFamily: "Arial,sans-serif", padding: "4px 6px", border: "1px solid #ccc", resize: "vertical", marginBottom: 8, boxSizing: "border-box" as const }}
      />

      {/* Attached documents */}
      {attachedDocs.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: "bold", color: "#555", marginBottom: 4 }}>Attached Documents</div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 3 }}>
            {attachedDocs.map(doc => (
              <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0f4f0", border: "1px solid #b8d8b8", borderRadius: 2, padding: "3px 8px" }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>📄</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "#333", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{doc.size} · Uploaded {doc.uploadedAt}</div>
                </div>
                <button
                  onClick={() => onDetach(doc.id)}
                  title="Detach"
                  style={{ fontSize: 12, padding: "1px 7px", background: "#fff0f0", border: "1px solid #e0a0a0", borderRadius: 2, cursor: "pointer", color: "#c00", fontWeight: "bold", flexShrink: 0 }}
                >Detach</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
        {/* Upload new */}
        <button
          onClick={() => fileRef.current?.click()}
          style={{ fontSize: 12, padding: "3px 10px", background: C.navy, color: "#fff", border: "none", borderRadius: 2, cursor: "pointer", fontWeight: "bold" }}
        >
          ⬆ Upload Document
        </button>
        <input ref={fileRef} type="file" multiple style={{ display: "none" }} onChange={handleFileChange} />

        {/* Attach existing */}
        {unattachedDocs.length > 0 && (
          <div style={{ position: "relative" as const }}>
            <button
              onClick={() => setShowAttachPicker(v => !v)}
              style={{ fontSize: 12, padding: "3px 10px", background: C.blue, color: "#fff", border: "none", borderRadius: 2, cursor: "pointer", fontWeight: "bold" }}
            >
              📎 Attach Existing ({unattachedDocs.length})
            </button>
            {showAttachPicker && (
              <div style={{
                position: "absolute" as const, top: "110%", left: 0, zIndex: 100,
                background: "#fff", border: "1px solid #aaa", borderRadius: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)", minWidth: 240, padding: 6,
              }}>
                <div style={{ fontSize: 12, fontWeight: "bold", color: "#555", marginBottom: 4, borderBottom: "1px solid #eee", paddingBottom: 3 }}>
                  Select to attach:
                </div>
                {unattachedDocs.map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => { onAttach(doc.id); setShowAttachPicker(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 6px", cursor: "pointer", borderRadius: 2, marginBottom: 2 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#e8f0e8")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontSize: 15 }}>📄</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: "#333", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{doc.size} · {doc.uploadedAt}</div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowAttachPicker(false)}
                  style={{ fontSize: 11, padding: "2px 8px", marginTop: 4, background: "#eee", border: "1px solid #ccc", cursor: "pointer", width: "100%" }}
                >Close</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
                  <button style={{ fontSize: 11, padding: "1px 6px", background: "#e8e8e8", border: "1px solid #bbb", cursor: "pointer", color: "#c00" }}>Delete</button>
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
              width: 28, height: 22, fontSize: 11, border: "1px solid #bbb", cursor: "pointer",
              background: selected === i ? C.green : "#f0f0f0",
              color: selected === i ? "#fff" : "#444", fontWeight: selected === i ? "bold" : "normal",
            }}>{pos}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LiabilityAssessmentPage() {
  // Suggested
  const [rowOwner,      setRowOwner]      = useState("Claimant");
  const [foreseeable,   setForeseeable]   = useState("Yes");
  const [rowSpeed,      setRowSpeed]      = useState("Please Select One");
  const [speedAssess,   setSpeedAssess]   = useState("Reduced Speed Required");
  const [lookout1,      setLookout1]      = useState("None Selected");
  const [lookout2,      setLookout2]      = useState("None Selected");
  const [lookout3,      setLookout3]      = useState("None Selected");
  const [avoidance1,    setAvoidance1]    = useState("None Selected");
  const [avoidance2,    setAvoidance2]    = useState("None Selected");
  const [avoidance3,    setAvoidance3]    = useState("None Selected");
  const [legalCtrl,     setLegalCtrl]     = useState("");
  const [physCtrl,      setPhysCtrl]      = useState("");
  const [insLeading,    setInsLeading]    = useState("No");
  const [clmLeading,    setClmLeading]    = useState("No");

  // Actual
  const [insActual, setInsActual] = useState("0%");
  const [insLow,    setInsLow]    = useState("0%");
  const [clmActual, setClmActual] = useState("0%");
  const [insHigh,   setInsHigh]   = useState("0%");
  const [clmHigh,   setClmHigh]   = useState("0%");
  const [clmLow,    setClmLow]    = useState("0%");
  const [deny,      setDeny]      = useState("No");

  // Evidence notes
  const [rowEvid, setRowEvid]     = useState("");
  const [spdEvid, setSpdEvid]     = useState("");
  const [lkEvid,  setLkEvid]      = useState("");
  const [avEvid,  setAvEvid]      = useState("");

  // Shared document pool (all uploaded docs across all sections)
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);

  // Per-section attached doc IDs
  const [rowAttached, setRowAttached] = useState<string[]>([]);
  const [spdAttached, setSpdAttached] = useState<string[]>([]);
  const [lkAttached,  setLkAttached]  = useState<string[]>([]);
  const [avAttached,  setAvAttached]  = useState<string[]>([]);

  const addDoc = (doc: UploadedDoc) =>
    setUploadedDocs(prev => prev.some(d => d.id === doc.id) ? prev : [...prev, doc]);

  const makeAttach = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (id: string) => setter(prev => prev.includes(id) ? prev : [...prev, id]);

  const makeDetach = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (id: string) => setter(prev => prev.filter(x => x !== id));

  const calc = () => alert("Calculate Suggested & Update Duties (prototype)");
  const save = () => alert("Saved! (prototype)");

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

        {/* COL 1 — Assessment dropdowns */}
        <div style={{ width: 420, flexShrink: 0, border: C.border, background: "#fff" }}>
          <div style={colHeaderStyle()}>Suggested Assessment</div>

          {/* Neg summary */}
          <div style={{ display: "flex", borderBottom: C.borderLight }}>
            {[["0%","Insured Suggested Neg"],["100%","Claimant Suggested Neg"],["Left of Center","Accident Type"]].map(([v,l]) => (
              <div key={l} style={{ flex: 1, padding: "4px 4px", textAlign: "center", borderRight: C.borderLight, background: "#f8f9fb" }}>
                <div style={{ fontWeight: "bold", fontSize: 14, color: C.navy }}>{v}</div>
                <div style={{ fontSize: 11, color: "#666", lineHeight: 1.2 }}>{l}</div>
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

        {/* COL 3 — Actual Liability */}
        <div style={{ width: 500, flexShrink: 0, border: C.border, background: "#fff" }}>
          <div style={colHeaderStyle()}>Actual Liability</div>

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

          {/* Negligence inputs 2×3 */}
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
            <button onClick={save}
              style={{ background: C.green, color: "#fff", border: "none", padding: "4px 14px", fontSize: 13, fontWeight: "bold", cursor: "pointer" }}>
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

      {/* ── Evidence of Duty Breaches ────────────────────────────────── */}
      <div style={{ border: C.border, marginTop: 2 }}>
        {/* Section header */}
        <div style={{ background: "#c0c8d8", fontSize: 13, fontWeight: "bold", padding: "6px 12px", color: C.navy, borderBottom: C.border }}>
          Evidence of Duty Breaches
        </div>

        {/* ROW */}
        <div style={{ borderBottom: C.border, background: C.altRow }}>
          <div style={{ padding: "6px 12px", background: "#eaf0f8", borderBottom: C.borderLight, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>Right of Way Duties</span>
            <span style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>— What Duty Was Breached to Give ROW?</span>
          </div>
          <EvidenceSection
            title="Right of Way Key Facts"
            subtitle="What Evidence Do You Have That Proves the Duty Breach?"
            notes={rowEvid} onNotesChange={setRowEvid}
            uploadedDocs={uploadedDocs} onUpload={addDoc}
            attachedIds={rowAttached}
            onAttach={makeAttach(setRowAttached)}
            onDetach={makeDetach(setRowAttached)}
          />
        </div>

        {/* Speed */}
        <div style={{ borderBottom: C.border }}>
          <div style={{ padding: "6px 12px", background: "#eaf0f8", borderBottom: C.borderLight, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>Speed Duties</span>
            <span style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>— What Duty Was Breached in Speed?</span>
          </div>
          <EvidenceSection
            title="Speed Key Facts"
            subtitle="What Evidence Do You Have That Proves the Duty Breach?"
            notes={spdEvid} onNotesChange={setSpdEvid}
            uploadedDocs={uploadedDocs} onUpload={addDoc}
            attachedIds={spdAttached}
            onAttach={makeAttach(setSpdAttached)}
            onDetach={makeDetach(setSpdAttached)}
          />
        </div>

        {/* Lookout */}
        <div style={{ borderBottom: C.border, background: C.altRow }}>
          <div style={{ padding: "6px 12px", background: "#eaf0f8", borderBottom: C.borderLight, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>Lookout Duties</span>
            <span style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>— What Look Out Duties did ROW Driver Breach?</span>
          </div>
          <EvidenceSection
            title="Lookout Key Facts"
            subtitle="What Evidence Do You Have That Proves the Duty Breach?"
            notes={lkEvid} onNotesChange={setLkEvid}
            uploadedDocs={uploadedDocs} onUpload={addDoc}
            attachedIds={lkAttached}
            onAttach={makeAttach(setLkAttached)}
            onDetach={makeDetach(setLkAttached)}
          />
        </div>

        {/* Avoidance */}
        <div>
          <div style={{ padding: "6px 12px", background: "#eaf0f8", borderBottom: C.borderLight, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: "bold", color: C.blue }}>Avoidance Duties</span>
            <span style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}>— What Avoidance Duties did ROW Driver Breach?</span>
          </div>
          <EvidenceSection
            title="Avoidance Key Facts"
            subtitle="What Evidence Do You Have That Proves the Duty Breach?"
            notes={avEvid} onNotesChange={setAvEvid}
            uploadedDocs={uploadedDocs} onUpload={addDoc}
            attachedIds={avAttached}
            onAttach={makeAttach(setAvAttached)}
            onDetach={makeDetach(setAvAttached)}
          />
        </div>
      </div>

      {/* Save */}
      <div style={{ textAlign: "center", padding: "6px 0 10px" }}>
        <button onClick={save}
          style={{ background: C.green, color: "#fff", border: "none", padding: "5px 40px", fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>
          Save
        </button>
      </div>
    </div>
  );
}
