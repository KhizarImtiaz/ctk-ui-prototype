"use client";
import { useState, useRef } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface UploadedDoc {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

interface PartyEvidence {
  partyKey: string;
  partyName: string;
  partyType: string;
  isInsured: boolean;
  agree: "agree" | "disagree" | "";
  summary: string;
  attachedDocIds: string[];
}

interface DutyData {
  note: string;
  parties: PartyEvidence[];
}

interface BreachedDuty {
  id: string;
  title: string;
  duty: string;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_DOCS: UploadedDoc[] = [
  { id: "doc-001", name: "Historical_Weather_Report.pdf",      size: "1.2 MB", uploadedAt: "2/20/2026" },
  { id: "doc-002", name: "GENERAL_WEATHER_SECTION_REPORT.pdf", size: "840 KB", uploadedAt: "2/21/2026" },
  { id: "doc-003", name: "Police_Report_CLM-2026-0847.pdf",    size: "512 KB", uploadedAt: "2/25/2026" },
  { id: "doc-004", name: "Insured_Driver_Statement.pdf",       size: "210 KB", uploadedAt: "2/26/2026" },
  { id: "doc-005", name: "Scene_Diagram_CLM-2026-0847.png",    size: "340 KB", uploadedAt: "2/26/2026" },
];

const CLAIM_PARTIES = [
  { name: "Khizar Imtiaz",  type: "Driver With Right of Way (ROW)", isInsured: true  },
  { name: "Khizar Imtiaz",  type: "Driver With Right of Way (ROW)", isInsured: true  },
  { name: "Farhan Nazarat", type: "Driver Who Failed To Yield (FTY)", isInsured: false },
];

const INITIAL_PARTY_DOCS: Record<string, string[]> = {
  "Khizar Imtiaz-0":  ["doc-001", "doc-002"],
  "Khizar Imtiaz-1":  ["doc-002"],
  "Farhan Nazarat-2": ["doc-001"],
};

const makeDutyData = (): DutyData => ({
  note: "",
  parties: CLAIM_PARTIES.map((p, i) => {
    const key = `${p.name}-${i}`;
    return {
      partyKey: key,
      partyName: p.name,
      partyType: p.type,
      isInsured: p.isInsured,
      agree: "",
      summary: "",
      attachedDocIds: INITIAL_PARTY_DOCS[key] ?? [],
    };
  }),
});

const INITIAL_ROW_DUTIES: BreachedDuty[] = [
  {
    id: "row-1",
    title: "Driving on the left",
    duty: "No vehicle shall be driven to the left side of the center of the roadway in overtaking and passing another vehicle proceeding in the same direction…",
  },
];
const INITIAL_LOOKOUT_DUTIES: BreachedDuty[] = [
  { id: "lk-1", title: "Concentration", duty: "Concentration is one of the most important elements of safe driving. The driver's seat is no place for daydreaming…" },
  { id: "lk-2", title: "Reasonable and Prudent Speed", duty: "Driver must maintain a proper lookout for potential hazards at all times." },
];
const INITIAL_AVOIDANCE_DUTIES: BreachedDuty[] = [
  { id: "av-1", title: "Reasonable and Prudent Speed", duty: "No vehicle shall be driven to the left side…" },
  { id: "av-2", title: "Speed Regulations", duty: "Speed may not always, in itself, be the primary factor that turns a minor mishap into a serious collision…" },
];

// ── Primitive helpers ─────────────────────────────────────────────────────────

function StatusBadge({ label, variant }: { label: string; variant: "blue" | "green" | "amber" | "slate" | "violet" }) {
  const cls: Record<string, string> = {
    blue:   "bg-blue-100 text-blue-700 border-blue-200",
    green:  "bg-emerald-100 text-emerald-700 border-emerald-200",
    amber:  "bg-amber-100 text-amber-700 border-amber-200",
    slate:  "bg-slate-100 text-slate-600 border-slate-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${cls[variant]}`}>
      {label}
    </span>
  );
}

function FieldGroup({ label, helper, children }: { label: string; helper?: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-xs font-medium text-slate-500 mb-1 leading-tight">{label}</label>
      {children}
      {helper && <p className="text-xs text-amber-600 mt-1 font-semibold">{helper}</p>}
    </div>
  );
}

function StyledSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full text-sm border border-slate-200 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ── Assessment Input Panel ────────────────────────────────────────────────────

function AccordionCard({ title, icon, defaultOpen = true, children }: {
  title: string; icon: string; defaultOpen?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-2.5 bg-white">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="text-base">{icon}</span>
          {title}
        </span>
        <span className="text-slate-300 text-xs font-bold">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-4 pt-3 pb-2">{children}</div>}
    </div>
  );
}

function ImpactGrid({ label }: { label: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const positions = ["FL", "F", "FR", "L", "C", "R", "BL", "B", "BR"];
  return (
    <FieldGroup label={label}>
      <div className="grid grid-cols-3 gap-1 w-fit">
        {positions.map((pos, i) => (
          <button
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            className={`w-9 h-7 text-xs font-semibold rounded border transition-colors ${
              selected === i
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
            }`}
          >
            {pos}
          </button>
        ))}
      </div>
    </FieldGroup>
  );
}

function AssessmentInputPanel({
  rowOwner, setRowOwner, foreseeable, setForeseeable,
  rowSpeed, setRowSpeed, speedAssess, setSpeedAssess,
  lookout1, setLookout1, lookout2, setLookout2, lookout3, setLookout3,
  avoidance1, setAvoidance1, avoidance2, setAvoidance2, avoidance3, setAvoidance3,
  legalCtrl, setLegalCtrl, physCtrl, setPhysCtrl,
  insLeading, setInsLeading, clmLeading, setClmLeading,
  onCalculate, suggestedCompleted,
}: {
  rowOwner: string; setRowOwner: (v: string) => void;
  foreseeable: string; setForeseeable: (v: string) => void;
  rowSpeed: string; setRowSpeed: (v: string) => void;
  speedAssess: string; setSpeedAssess: (v: string) => void;
  lookout1: string; setLookout1: (v: string) => void;
  lookout2: string; setLookout2: (v: string) => void;
  lookout3: string; setLookout3: (v: string) => void;
  avoidance1: string; setAvoidance1: (v: string) => void;
  avoidance2: string; setAvoidance2: (v: string) => void;
  avoidance3: string; setAvoidance3: (v: string) => void;
  legalCtrl: string; setLegalCtrl: (v: string) => void;
  physCtrl: string; setPhysCtrl: (v: string) => void;
  insLeading: string; setInsLeading: (v: string) => void;
  clmLeading: string; setClmLeading: (v: string) => void;
  onCalculate: () => void;
  suggestedCompleted: boolean;
}) {
  return (
    <div>
      {/* AI Suggested mini-summary */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 mb-3">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">AI Suggestion</div>
        <div className="flex gap-2">
          <div className="flex-1 text-center bg-blue-50 rounded py-2 border border-blue-100">
            <div className="text-lg font-bold text-blue-700">0%</div>
            <div className="text-xs text-blue-400 mt-0.5">Insured</div>
          </div>
          <div className="flex-1 text-center bg-amber-50 rounded py-2 border border-amber-100">
            <div className="text-lg font-bold text-amber-700">100%</div>
            <div className="text-xs text-amber-400 mt-0.5">Claimant</div>
          </div>
        </div>
        <div className="mt-2 text-center">
          <StatusBadge label="Left of Center" variant="slate" />
        </div>
      </div>

      <AccordionCard title="Right of Way" icon="🚦">
        <FieldGroup
          label="Who Had the Right of Way?"
          helper={rowOwner === "Claimant" ? "Last Clear Chance Valid" : undefined}
        >
          <StyledSelect value={rowOwner} onChange={setRowOwner} options={["Claimant", "Insured", "Unknown"]} />
        </FieldGroup>
        <FieldGroup label="Was the Danger Foreseeable for the ROW Driver?">
          <StyledSelect value={foreseeable} onChange={setForeseeable} options={["Yes", "No"]} />
        </FieldGroup>
        <FieldGroup label="ROW Driver's Stated Speed">
          <StyledSelect
            value={rowSpeed}
            onChange={setRowSpeed}
            options={["Please Select One", "At speed limit", "Below speed limit", "Above speed limit", "Unknown"]}
          />
        </FieldGroup>
      </AccordionCard>

      <AccordionCard title="Speed" icon="⚡">
        <FieldGroup
          label="Speed Assessment"
          helper={speedAssess === "Reduced Speed Required" ? "Reduced Speed Required" : undefined}
        >
          <StyledSelect
            value={speedAssess}
            onChange={setSpeedAssess}
            options={["Reduced Speed Required", "Speed Not a Factor", "Speed at Issue"]}
          />
        </FieldGroup>
      </AccordionCard>

      <AccordionCard title="Lookout" icon="👁" defaultOpen={false}>
        <FieldGroup label="Awareness of Actual and Potential Hazards">
          <StyledSelect value={lookout1} onChange={setLookout1} options={["None Selected", "Aware of Hazard", "Not Aware"]} />
        </FieldGroup>
        <FieldGroup label="Lookout Adequacy">
          <StyledSelect value={lookout2} onChange={setLookout2} options={["None Selected", "Adequate", "Inadequate"]} />
        </FieldGroup>
        <FieldGroup label="Additional Lookout Factor">
          <StyledSelect value={lookout3} onChange={setLookout3} options={["None Selected", "Adequate", "Inadequate"]} />
        </FieldGroup>
      </AccordionCard>

      <AccordionCard title="Avoidance" icon="🔄" defaultOpen={false}>
        <FieldGroup label="Avoidance Reasonableness">
          <StyledSelect value={avoidance1} onChange={setAvoidance1} options={["None Selected", "Reasonable", "Unreasonable"]} />
        </FieldGroup>
        <FieldGroup label="Horn Warning Required">
          <StyledSelect value={avoidance2} onChange={setAvoidance2} options={["None Selected", "Yes", "No"]} />
        </FieldGroup>
        <FieldGroup label="Avoidance Adequacy">
          <StyledSelect value={avoidance3} onChange={setAvoidance3} options={["None Selected", "Adequate", "Inadequate"]} />
        </FieldGroup>
      </AccordionCard>

      <AccordionCard title="Impact & Control" icon="🚗" defaultOpen={false}>
        <FieldGroup label="Legal Control of Impact Location">
          <StyledSelect value={legalCtrl} onChange={setLegalCtrl} options={["-- Select --", "Claimant", "Insured", "Neither"]} />
        </FieldGroup>
        <FieldGroup label="Physical Control of Impact Location">
          <StyledSelect value={physCtrl} onChange={setPhysCtrl} options={["-- Select --", "Claimant", "Insured", "Neither"]} />
        </FieldGroup>
        <FieldGroup label="Insured's Leading Edge Damaged?">
          <StyledSelect value={insLeading} onChange={setInsLeading} options={["No", "Yes"]} />
        </FieldGroup>
        <FieldGroup label="Claimant's Leading Edge Damaged?">
          <StyledSelect value={clmLeading} onChange={setClmLeading} options={["No", "Yes"]} />
        </FieldGroup>
        <ImpactGrid label="Impact Point — Insured Vehicle" />
        <ImpactGrid label="Impact Point — Claimant Vehicle" />
      </AccordionCard>

      <button
        onClick={onCalculate}
        className={`w-full py-2.5 text-white text-sm font-semibold rounded-lg transition-colors mt-1 flex items-center justify-center gap-2 ${
          suggestedCompleted
            ? "bg-slate-600 hover:bg-slate-700"
            : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
        }`}
      >
        {suggestedCompleted ? "↺ Recalculate Assessment" : "✓ Calculate Suggested Assessment"}
      </button>
    </div>
  );
}

// ── Duty Breach Panel ─────────────────────────────────────────────────────────

function DutyCard({
  title, headerClass, duties, onAdd, onDelete,
}: {
  title: string;
  headerClass: string;
  duties: BreachedDuty[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-3">
      <div className={`flex items-center justify-between px-4 py-2.5 ${headerClass}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">{title}</span>
          {duties.length > 0 && (
            <span className="bg-white text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded-full border border-slate-200 leading-none">
              {duties.length}
            </span>
          )}
        </div>
        <button onClick={onAdd} className="text-xs text-blue-600 hover:text-blue-800 font-semibold">
          + Add Duty
        </button>
      </div>

      {duties.length === 0 ? (
        <div className="px-4 py-3 text-xs text-slate-400 italic">No duties breached in this category.</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {duties.map(d => (
            <div key={d.id} className="px-4 py-3 flex gap-3 group">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-700 mb-0.5">{d.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed line-clamp-2">{d.duty}</div>
              </div>
              <button
                onClick={() => onDelete(d.id)}
                title="Remove duty"
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all text-sm flex-shrink-0 mt-0.5"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DutyBreachPanel({
  rowDuties, setRowDuties,
  speedDuties, setSpeedDuties,
  lookoutDuties, setLookoutDuties,
  avoidanceDuties, setAvoidanceDuties,
}: {
  rowDuties: BreachedDuty[]; setRowDuties: React.Dispatch<React.SetStateAction<BreachedDuty[]>>;
  speedDuties: BreachedDuty[]; setSpeedDuties: React.Dispatch<React.SetStateAction<BreachedDuty[]>>;
  lookoutDuties: BreachedDuty[]; setLookoutDuties: React.Dispatch<React.SetStateAction<BreachedDuty[]>>;
  avoidanceDuties: BreachedDuty[]; setAvoidanceDuties: React.Dispatch<React.SetStateAction<BreachedDuty[]>>;
}) {
  const addDuty = (setter: React.Dispatch<React.SetStateAction<BreachedDuty[]>>, prefix: string) => {
    const title = prompt("Duty title:");
    if (!title) return;
    setter(prev => [...prev, { id: `${prefix}-${Date.now()}`, title, duty: "" }]);
  };
  const delDuty = (setter: React.Dispatch<React.SetStateAction<BreachedDuty[]>>, id: string) =>
    setter(prev => prev.filter(d => d.id !== id));

  return (
    <div>
      <DutyCard title="Right of Way Duties Breached" headerClass="bg-blue-50"
        duties={rowDuties} onAdd={() => addDuty(setRowDuties, "row")} onDelete={id => delDuty(setRowDuties, id)} />
      <DutyCard title="Speed Duties Breached" headerClass="bg-amber-50"
        duties={speedDuties} onAdd={() => addDuty(setSpeedDuties, "spd")} onDelete={id => delDuty(setSpeedDuties, id)} />
      <DutyCard title="Lookout Duties Breached" headerClass="bg-violet-50"
        duties={lookoutDuties} onAdd={() => addDuty(setLookoutDuties, "lk")} onDelete={id => delDuty(setLookoutDuties, id)} />
      <DutyCard title="Avoidance Duties Breached" headerClass="bg-emerald-50"
        duties={avoidanceDuties} onAdd={() => addDuty(setAvoidanceDuties, "av")} onDelete={id => delDuty(setAvoidanceDuties, id)} />
    </div>
  );
}

// ── Live Assessment Panel ─────────────────────────────────────────────────────

function LiveAssessmentPanel({
  insActual, setInsActual,
  insLow, setInsLow,
  clmActual, setClmActual,
  insHigh, setInsHigh,
  clmHigh, setClmHigh,
  clmLow, setClmLow,
  deny, setDeny,
  onSave,
}: {
  insActual: string; setInsActual: (v: string) => void;
  insLow: string; setInsLow: (v: string) => void;
  clmActual: string; setClmActual: (v: string) => void;
  insHigh: string; setInsHigh: (v: string) => void;
  clmHigh: string; setClmHigh: (v: string) => void;
  clmLow: string; setClmLow: (v: string) => void;
  deny: string; setDeny: (v: string) => void;
  onSave: () => void;
}) {
  const parseNum = (v: string) => parseInt(v.replace(/[^0-9]/g, "")) || 0;
  const ins = parseNum(insActual);
  const clm = parseNum(clmActual);
  const total = ins + clm || 100;
  const insPct = Math.round((ins / total) * 100);
  const clmPct = 100 - insPct;

  const fields: { label: string; value: string; set: (v: string) => void }[] = [
    { label: "Insured Actual",  value: insActual, set: setInsActual },
    { label: "Insured Low",     value: insLow,    set: setInsLow    },
    { label: "Claimant Actual", value: clmActual, set: setClmActual },
    { label: "Insured High",    value: insHigh,   set: setInsHigh   },
    { label: "Claimant Low",    value: clmLow,    set: setClmLow    },
    { label: "Claimant High",   value: clmHigh,   set: setClmHigh   },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Panel header */}
      <div className="px-4 py-3 bg-slate-800 text-white">
        <div className="text-sm font-semibold">Assessment Decision</div>
        <div className="text-xs text-slate-400 mt-0.5">Set final negligence distribution</div>
      </div>

      {/* Visual negligence bar */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex rounded-full overflow-hidden h-2.5 bg-slate-100 mb-2">
          <div style={{ width: `${insPct}%` }} className="bg-blue-500 transition-all duration-300" />
          <div style={{ width: `${clmPct}%` }} className="bg-amber-400 transition-all duration-300" />
        </div>
        <div className="flex justify-between text-xs">
          <span className="font-semibold text-blue-600">Insured {ins}%</span>
          <span className="font-semibold text-amber-600">Claimant {clm}%</span>
        </div>
      </div>

      {/* State law notice */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 rounded-md p-2 leading-snug text-center">
          Alabama: Contributory — Any Negligence Eliminates Recovery
        </div>
      </div>

      {/* Negligence inputs */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="grid grid-cols-2 gap-2">
          {fields.map(({ label, value, set }) => (
            <div key={label}>
              <label className="block text-xs text-slate-500 mb-1 leading-tight">{label}</label>
              <input
                value={value}
                onChange={e => set(e.target.value)}
                className="w-full text-sm font-semibold text-center border border-slate-200 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-600">Deny Claimant?</label>
          <select
            value={deny}
            onChange={e => setDeny(e.target.value)}
            className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option>No</option>
            <option>Yes</option>
          </select>
        </div>
        <button
          onClick={onSave}
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Save Changes
        </button>
        <button className="w-full py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium rounded-lg transition-colors">
          Save as Draft
        </button>
        <div className="pt-1 border-t border-slate-100 space-y-1">
          <a href="#" onClick={e => e.preventDefault()}
            className="block text-xs text-blue-600 hover:text-blue-800 hover:underline text-center">
            Assign assessment to me
          </a>
          <a href="#" onClick={e => e.preventDefault()}
            className="block text-xs text-blue-600 hover:text-blue-800 hover:underline text-center">
            Reassign to another rep
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Locked Decision Panel placeholder ────────────────────────────────────────

function LockedDecisionPanel({ onScrollToInputs }: { onScrollToInputs: () => void }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Header — matches LiveAssessmentPanel style so it doesn't feel abrupt */}
      <div className="px-4 py-3 bg-slate-800 text-white">
        <div className="text-sm font-semibold">Assessment Decision</div>
        <div className="text-xs text-slate-400 mt-0.5">Actual negligence distribution</div>
      </div>

      {/* Lock body */}
      <div className="px-5 py-8 flex flex-col items-center text-center gap-4">
        {/* Lock icon */}
        <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-2xl">
          🔒
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-700 mb-1">
            Complete Suggested Assessment First
          </div>
          <div className="text-xs text-slate-500 leading-relaxed">
            Fill in the assessment inputs on the left and click{" "}
            <span className="font-semibold text-slate-700">
              &ldquo;Calculate Suggested Assessment&rdquo;
            </span>{" "}
            to unlock the Actual Assessment decision panel.
          </div>
        </div>

        {/* Step indicators */}
        <div className="w-full space-y-2 mt-1">
          {[
            { step: "1", label: "Set Right of Way, Speed, Lookout & Avoidance inputs", done: false },
            { step: "2", label: "Click \"Calculate Suggested Assessment\"",             done: false },
            { step: "3", label: "Review and set Actual Assessment here",               done: false },
          ].map(({ step, label, done }) => (
            <div key={step} className="flex items-start gap-2.5 text-left">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 ${
                done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                {done ? "✓" : step}
              </div>
              <span className={`text-xs leading-snug ${done ? "text-emerald-700 line-through" : "text-slate-500"}`}>
                {label}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onScrollToInputs}
          className="mt-2 w-full py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Go to Assessment Inputs ↑
        </button>
      </div>
    </div>
  );
}

// ── Evidence Section ──────────────────────────────────────────────────────────

function DocumentChip({ doc, onDetach }: { doc: UploadedDoc; onDetach: () => void }) {
  return (
    <div className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5 text-xs text-blue-700 max-w-full">
      <span className="truncate" style={{ maxWidth: 120 }}>{doc.name}</span>
      <button onClick={onDetach} className="text-blue-400 hover:text-red-500 transition-colors flex-shrink-0 leading-none">×</button>
    </div>
  );
}

function PartyEvidenceCard({
  party, uploadedDocs, onUpload,
  onPartyAgree, onPartySummary, onPartyAttach, onPartyDetach,
}: {
  party: PartyEvidence;
  uploadedDocs: UploadedDoc[];
  onUpload: (doc: UploadedDoc) => void;
  onPartyAgree:   (key: string, val: "agree" | "disagree" | "") => void;
  onPartySummary: (key: string, val: string) => void;
  onPartyAttach:  (key: string, docId: string) => void;
  onPartyDetach:  (key: string, docId: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      onPartyAttach(party.partyKey, doc.id);
    });
    e.target.value = "";
  };

  const attached   = uploadedDocs.filter(d => party.attachedDocIds.includes(d.id));
  const unattached = uploadedDocs.filter(d => !party.attachedDocIds.includes(d.id));
  const isAgree    = party.agree === "agree";
  const isDisagree = party.agree === "disagree";

  return (
    <div className={`bg-white border rounded-lg overflow-hidden ${isAgree ? "border-emerald-300" : isDisagree ? "border-red-300" : "border-slate-200"}`}>
      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-slate-800">{party.partyName}</span>
            {party.isInsured && <StatusBadge label="Insured" variant="blue" />}
            {isAgree    && <StatusBadge label="Agreed"    variant="green" />}
            {isDisagree && <StatusBadge label="Disagreed" variant="amber" />}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{party.partyType}</div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => onPartyAgree(party.partyKey, isAgree ? "" : "agree")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
              isAgree
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
            }`}
          >
            ✓ Agree
          </button>
          <button
            onClick={() => onPartyAgree(party.partyKey, isDisagree ? "" : "disagree")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
              isDisagree
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-red-400 hover:text-red-700"
            }`}
          >
            ✗ Disagree
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1.5">Summary / Key Facts</div>
          <textarea
            rows={3}
            value={party.summary}
            onChange={e => onPartySummary(party.partyKey, e.target.value)}
            placeholder="Enter key facts and observations for this party…"
            className="w-full text-xs border border-slate-200 rounded-md px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <div className="text-xs font-medium text-slate-500 mb-1.5">Linked Documents</div>
          <div className="flex flex-wrap gap-1 min-h-8 mb-2">
            {attached.length === 0 && <span className="text-xs text-slate-300 italic">No documents linked yet</span>}
            {attached.map(doc => (
              <DocumentChip key={doc.id} doc={doc} onDetach={() => onPartyDetach(party.partyKey, doc.id)} />
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-md transition-colors font-medium"
            >
              ↑ Upload
            </button>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFile} />
            <div className="relative">
              <button
                onClick={() => setShowPicker(v => !v)}
                className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
              >
                📎 Claim Docs{unattached.length > 0 ? ` (${unattached.length})` : ""}
              </button>
              {showPicker && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl w-72 p-3">
                  <div className="text-xs font-semibold text-slate-600 mb-2 pb-2 border-b border-slate-100">
                    {unattached.length === 0 ? "No more documents available" : "Select a claim document"}
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {unattached.map(doc => (
                      <div
                        key={doc.id}
                        onClick={() => { onPartyAttach(party.partyKey, doc.id); setShowPicker(false); }}
                        className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <span className="text-base flex-shrink-0">📄</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs text-slate-700 truncate font-medium">{doc.name}</div>
                          <div className="text-xs text-slate-400">{doc.size} · {doc.uploadedAt}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowPicker(false)}
                    className="mt-2 w-full text-xs py-1.5 border border-slate-200 rounded text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type EvidenceTab = "row" | "speed" | "lookout" | "avoidance" | "summary";

interface DutyHandlers {
  onNoteChange:   (v: string) => void;
  onPartyAgree:   (key: string, val: "agree" | "disagree" | "") => void;
  onPartySummary: (key: string, val: string) => void;
  onPartyAttach:  (key: string, docId: string) => void;
  onPartyDetach:  (key: string, docId: string) => void;
}

function EvidenceSection({
  rowDuty, spdDuty, lkDuty, avDuty,
  uploadedDocs, onUpload,
  rowH, spdH, lkH, avH,
  overallSummary, setOverallSummary,
}: {
  rowDuty: DutyData; spdDuty: DutyData; lkDuty: DutyData; avDuty: DutyData;
  uploadedDocs: UploadedDoc[];
  onUpload: (doc: UploadedDoc) => void;
  rowH: DutyHandlers; spdH: DutyHandlers; lkH: DutyHandlers; avH: DutyHandlers;
  overallSummary: string;
  setOverallSummary: (v: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<EvidenceTab>("row");

  const tabs: { key: EvidenceTab; label: string; activeClass: string }[] = [
    { key: "row",       label: "Right of Way", activeClass: "border-blue-500 text-blue-600 bg-white"       },
    { key: "speed",     label: "Speed",         activeClass: "border-amber-500 text-amber-600 bg-white"    },
    { key: "lookout",   label: "Lookout",       activeClass: "border-violet-500 text-violet-600 bg-white"  },
    { key: "avoidance", label: "Avoidance",     activeClass: "border-emerald-500 text-emerald-600 bg-white"},
    { key: "summary",   label: "Overall Summary", activeClass: "border-slate-500 text-slate-700 bg-white"  },
  ];

  const subtitleMap: Record<EvidenceTab, string> = {
    row:       "What evidence proves Right of Way duty breach?",
    speed:     "What evidence proves Speed duty breach?",
    lookout:   "What evidence proves Lookout duty breach by the ROW driver?",
    avoidance: "What evidence proves Avoidance duty breach by the ROW driver?",
    summary:   "Consolidated summary across all duty breach categories",
  };

  const dutyMap:    Record<Exclude<EvidenceTab, "summary">, DutyData>    = { row: rowDuty, speed: spdDuty, lookout: lkDuty, avoidance: avDuty };
  const handlerMap: Record<Exclude<EvidenceTab, "summary">, DutyHandlers> = { row: rowH,    speed: spdH,    lookout: lkH,    avoidance: avH    };

  const currentDuty    = activeTab !== "summary" ? dutyMap[activeTab]    : null;
  const currentHandler = activeTab !== "summary" ? handlerMap[activeTab] : null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mt-4">
      <div className="px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-semibold text-slate-800">Evidence of Duty Breaches</h2>
        <p className="text-xs text-slate-500 mt-0.5">Review and annotate party-level evidence for each duty category</p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto">
        {tabs.map(tab => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                active ? tab.activeClass : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="px-6 py-5">
        {activeTab !== "summary" && currentDuty && currentHandler ? (
          <>
            <p className="text-xs text-slate-400 italic mb-4">{subtitleMap[activeTab]}</p>
            <div className="space-y-3">
              {currentDuty.parties.map(party => (
                <PartyEvidenceCard
                  key={party.partyKey}
                  party={party}
                  uploadedDocs={uploadedDocs}
                  onUpload={onUpload}
                  onPartyAgree={currentHandler.onPartyAgree}
                  onPartySummary={currentHandler.onPartySummary}
                  onPartyAttach={currentHandler.onPartyAttach}
                  onPartyDetach={currentHandler.onPartyDetach}
                />
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Section Notes — {tabs.find(t => t.key === activeTab)?.label}
              </label>
              <textarea
                rows={3}
                value={currentDuty.note}
                onChange={e => currentHandler.onNoteChange(e.target.value)}
                placeholder={`Key observations for ${tabs.find(t => t.key === activeTab)?.label} duties…`}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </>
        ) : (
          <div>
            <p className="text-xs text-slate-400 italic mb-4">{subtitleMap.summary}</p>
            <textarea
              rows={12}
              value={overallSummary}
              onChange={e => setOverallSummary(e.target.value)}
              placeholder="Enter a consolidated summary of all duty breaches and supporting evidence…"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              style={{ minHeight: 220 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────────────────

function AssessmentPageHeader({ totalDuties, docCount, suggestedCompleted }: {
  totalDuties: number;
  docCount: number;
  suggestedCompleted: boolean;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg px-6 py-4 mb-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">CLM-2026-0847</h1>
            <StatusBadge label={suggestedCompleted ? "Assessment Active" : "Suggested Pending"} variant={suggestedCompleted ? "green" : "amber"} />
            <StatusBadge label="Left of Center" variant="slate" />
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
            <span><span className="font-semibold text-slate-700">Insured:</span> Insured-Street-View</span>
            <span className="text-slate-300">·</span>
            <span><span className="font-semibold text-slate-700">Date of Loss:</span> Feb 25, 2026</span>
            <span className="text-slate-300">·</span>
            <span><span className="font-semibold text-slate-700">State:</span> Alabama</span>
            <span className="text-slate-300">·</span>
            <span><span className="font-semibold text-slate-700">Assigned:</span> Khizar Imtiaz</span>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="text-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-lg min-w-16">
            <div className="text-lg font-bold text-blue-700 leading-tight">0%</div>
            <div className="text-xs text-blue-400 mt-0.5">Insured Neg.</div>
          </div>
          <div className="text-center px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg min-w-16">
            <div className="text-lg font-bold text-amber-700 leading-tight">100%</div>
            <div className="text-xs text-amber-400 mt-0.5">Claimant Neg.</div>
          </div>
          <div className="text-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg min-w-16">
            <div className="text-lg font-bold text-slate-700 leading-tight">{totalDuties}</div>
            <div className="text-xs text-slate-500 mt-0.5">Duties Breached</div>
          </div>
          <div className="text-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg min-w-16">
            <div className="text-lg font-bold text-slate-700 leading-tight">{docCount}</div>
            <div className="text-xs text-slate-500 mt-0.5">Evidence Docs</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────────

export default function LiabilityAssessmentPage() {
  // Assessment input state
  const [rowOwner,    setRowOwner]    = useState("Claimant");
  const [foreseeable, setForeseeable] = useState("Yes");
  const [rowSpeed,    setRowSpeed]    = useState("Please Select One");
  const [speedAssess, setSpeedAssess] = useState("Reduced Speed Required");
  const [lookout1,    setLookout1]    = useState("None Selected");
  const [lookout2,    setLookout2]    = useState("None Selected");
  const [lookout3,    setLookout3]    = useState("None Selected");
  const [avoidance1,  setAvoidance1]  = useState("None Selected");
  const [avoidance2,  setAvoidance2]  = useState("None Selected");
  const [avoidance3,  setAvoidance3]  = useState("None Selected");
  const [legalCtrl,   setLegalCtrl]   = useState("-- Select --");
  const [physCtrl,    setPhysCtrl]    = useState("-- Select --");
  const [insLeading,  setInsLeading]  = useState("No");
  const [clmLeading,  setClmLeading]  = useState("No");

  // Gate: actual assessment is only shown after suggested assessment is calculated
  const [suggestedCompleted, setSuggestedCompleted] = useState(false);

  // Actual assessment state
  const [insActual, setInsActual] = useState("0%");
  const [insLow,    setInsLow]    = useState("0%");
  const [clmActual, setClmActual] = useState("100%");
  const [insHigh,   setInsHigh]   = useState("0%");
  const [clmHigh,   setClmHigh]   = useState("100%");
  const [clmLow,    setClmLow]    = useState("100%");
  const [deny,      setDeny]      = useState("No");

  // Breached duties
  const [rowDuties,       setRowDuties]       = useState<BreachedDuty[]>(INITIAL_ROW_DUTIES);
  const [speedDuties,     setSpeedDuties]     = useState<BreachedDuty[]>([]);
  const [lookoutDuties,   setLookoutDuties]   = useState<BreachedDuty[]>(INITIAL_LOOKOUT_DUTIES);
  const [avoidanceDuties, setAvoidanceDuties] = useState<BreachedDuty[]>(INITIAL_AVOIDANCE_DUTIES);

  // Evidence state
  const [rowDuty, setRowDuty] = useState<DutyData>(makeDutyData);
  const [spdDuty, setSpdDuty] = useState<DutyData>(makeDutyData);
  const [lkDuty,  setLkDuty]  = useState<DutyData>(makeDutyData);
  const [avDuty,  setAvDuty]  = useState<DutyData>(makeDutyData);
  const [overallSummary, setOverallSummary] = useState("");
  const [uploadedDocs, setUploadedDocs]     = useState<UploadedDoc[]>(MOCK_DOCS);

  const inputPanelRef = useRef<HTMLDivElement>(null);

  const addDoc = (doc: UploadedDoc) =>
    setUploadedDocs(prev => prev.some(d => d.id === doc.id) ? prev : [...prev, doc]);

  const makeHandlers = (setter: React.Dispatch<React.SetStateAction<DutyData>>): DutyHandlers => ({
    onNoteChange:   (v) => setter(d => ({ ...d, note: v })),
    onPartyAgree:   (key, val) => setter(d => ({ ...d, parties: d.parties.map(p => p.partyKey === key ? { ...p, agree: val } : p) })),
    onPartySummary: (key, val) => setter(d => ({ ...d, parties: d.parties.map(p => p.partyKey === key ? { ...p, summary: val } : p) })),
    onPartyAttach:  (key, id)  => setter(d => ({ ...d, parties: d.parties.map(p => p.partyKey === key && !p.attachedDocIds.includes(id) ? { ...p, attachedDocIds: [...p.attachedDocIds, id] } : p) })),
    onPartyDetach:  (key, id)  => setter(d => ({ ...d, parties: d.parties.map(p => p.partyKey === key ? { ...p, attachedDocIds: p.attachedDocIds.filter(x => x !== id) } : p) })),
  });

  const rowH = makeHandlers(setRowDuty);
  const spdH = makeHandlers(setSpdDuty);
  const lkH  = makeHandlers(setLkDuty);
  const avH  = makeHandlers(setAvDuty);

  const handleCalculate = () => {
    setSuggestedCompleted(true);
    // Real implementation: POST to /api/claims/{id}/assessment/calculate
  };

  const scrollToInputs = () => {
    inputPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalDuties = rowDuties.length + speedDuties.length + lookoutDuties.length + avoidanceDuties.length;

  return (
    <div className="min-h-full p-4" style={{ background: "#f0f2f5" }}>
      <AssessmentPageHeader
        totalDuties={totalDuties}
        docCount={uploadedDocs.length}
        suggestedCompleted={suggestedCompleted}
      />

      {/* 3-column workspace */}
      <div className="flex gap-4 items-start">

        {/* Left column — Assessment Inputs */}
        <div ref={inputPanelRef} className="flex-shrink-0" style={{ width: 276 }}>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-0.5">
            Assessment Inputs
          </div>
          <AssessmentInputPanel
            rowOwner={rowOwner}       setRowOwner={setRowOwner}
            foreseeable={foreseeable} setForeseeable={setForeseeable}
            rowSpeed={rowSpeed}       setRowSpeed={setRowSpeed}
            speedAssess={speedAssess} setSpeedAssess={setSpeedAssess}
            lookout1={lookout1}       setLookout1={setLookout1}
            lookout2={lookout2}       setLookout2={setLookout2}
            lookout3={lookout3}       setLookout3={setLookout3}
            avoidance1={avoidance1}   setAvoidance1={setAvoidance1}
            avoidance2={avoidance2}   setAvoidance2={setAvoidance2}
            avoidance3={avoidance3}   setAvoidance3={setAvoidance3}
            legalCtrl={legalCtrl}     setLegalCtrl={setLegalCtrl}
            physCtrl={physCtrl}       setPhysCtrl={setPhysCtrl}
            insLeading={insLeading}   setInsLeading={setInsLeading}
            clmLeading={clmLeading}   setClmLeading={setClmLeading}
            onCalculate={handleCalculate}
            suggestedCompleted={suggestedCompleted}
          />
        </div>

        {/* Center column — Duty Breach Cards */}
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-0.5">
            Breached Duties
          </div>
          <DutyBreachPanel
            rowDuties={rowDuties}             setRowDuties={setRowDuties}
            speedDuties={speedDuties}         setSpeedDuties={setSpeedDuties}
            lookoutDuties={lookoutDuties}     setLookoutDuties={setLookoutDuties}
            avoidanceDuties={avoidanceDuties} setAvoidanceDuties={setAvoidanceDuties}
          />
        </div>

        {/* Right column — Decision Panel (sticky) */}
        <div className="flex-shrink-0 sticky top-4" style={{ width: 252 }}>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-0.5">
            Decision Panel
          </div>
          {suggestedCompleted ? (
            <LiveAssessmentPanel
              insActual={insActual} setInsActual={setInsActual}
              insLow={insLow}       setInsLow={setInsLow}
              clmActual={clmActual} setClmActual={setClmActual}
              insHigh={insHigh}     setInsHigh={setInsHigh}
              clmHigh={clmHigh}     setClmHigh={setClmHigh}
              clmLow={clmLow}       setClmLow={setClmLow}
              deny={deny}           setDeny={setDeny}
              onSave={() => alert("Saved! (prototype)")}
            />
          ) : (
            <LockedDecisionPanel onScrollToInputs={scrollToInputs} />
          )}
        </div>
      </div>

      {/* Evidence section — full width below workspace */}
      <EvidenceSection
        rowDuty={rowDuty} spdDuty={spdDuty} lkDuty={lkDuty} avDuty={avDuty}
        uploadedDocs={uploadedDocs} onUpload={addDoc}
        rowH={rowH} spdH={spdH} lkH={lkH} avH={avH}
        overallSummary={overallSummary} setOverallSummary={setOverallSummary}
      />
    </div>
  );
}
