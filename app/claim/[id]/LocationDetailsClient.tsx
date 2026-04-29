"use client";
import { useState } from "react";

/* ─── Design tokens ─────────────────────────────────────────── */
const COLOR = {
  navy:        "#1e2b40",
  green:       "#2e7d2f",
  border:      "#d0d6e0",
  inputBorder: "#c8d0db",
  pageBg:      "#f0f2f5",
  cardBg:      "#fff",
  sectionBg:   "#f5f7fa",
  teal:        "#1a6b5a",
};

/* shared element styles */
const card: React.CSSProperties = {
  background: COLOR.cardBg, border: `1px solid ${COLOR.border}`,
  borderRadius: 6, marginBottom: 0, overflow: "hidden",
};
const rowDivider: React.CSSProperties = { borderBottom: `1px solid ${COLOR.border}` };
const rowPad: React.CSSProperties    = { padding: "12px 16px" };
const boldLabel: React.CSSProperties = { fontWeight: "bold", fontSize: 13, color: "#222", display: "block", marginBottom: 4 };
const inlineLabel: React.CSSProperties = { fontWeight: "bold", fontSize: 13, color: "#222", minWidth: 130, flexShrink: 0 };
const inp: React.CSSProperties = {
  border: `1px solid ${COLOR.inputBorder}`, borderRadius: 4,
  fontSize: 13, padding: "5px 8px", width: "100%",
  boxSizing: "border-box", background: "#fff", height: 32,
};
const inpRo: React.CSSProperties = { ...inp, background: "#eef0f4", color: "#555" };
const sel: React.CSSProperties  = { ...inp, appearance: "auto" as const };
const chkLabel: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 13, cursor: "pointer", userSelect: "none",
  marginBottom: 8,
};
const saveBtn: React.CSSProperties = {
  background: COLOR.green, color: "#fff", border: "none",
  borderRadius: 5, padding: "8px 36px", fontSize: 13,
  fontWeight: "bold", cursor: "pointer",
};
const greenTA: React.CSSProperties = {
  border: `2px solid ${COLOR.green}`, borderRadius: 4,
  fontSize: 13, padding: "6px 8px", width: "100%",
  boxSizing: "border-box", resize: "vertical",
};
const sectionHeading: React.CSSProperties = {
  fontWeight: "bold", fontSize: 14, color: COLOR.teal, marginBottom: 10,
};
const linkSt: React.CSSProperties = { color: COLOR.teal, fontSize: 12, cursor: "pointer", textDecoration: "none" };

/* ─── Option lists ──────────────────────────────────────────── */
const ACCIDENT_TYPES = [
  "Please Select One","Backing","Bicycle","Emergency Vehicle","Funeral Procession",
  "Intersection","Left of Center","Left Turn","Parking Lot","Passing","Pedestrian",
  "Rear End","Right Hand Squeeze","Right Turn","Sidewipe / Lane Change / Merge","U Turn",
];
const PASSING_TYPES = [
  "","Passing on Left - Audible or Lights at Night","Passing on Left - Overtaken Vehicle Has ROW",
  "Passing on Left - Passing Vehicle Has ROW","Passing on Left - Audible",
  "Passing on Right - Overtaken Vehicle Has ROW","Passing on Right - Passing Vehicle Has ROW",
];
const BICYCLE_TYPES   = ["In a Prohibited Area","On a Sidewalk","On the Roadway"];
const PED_TYPES       = ["Exiting Vehicle","In Crosswalk","Not in Crosswalk","Road Construction Worker","Violation of Signals"];
const SIDESWIPE_TYPES = ["Lane Change","Merge"];
const PARKING_TYPES   = ["Backing","Both Vehicles Moving","Illegal Parking","One Vehicle Moving","Open Door"];
const TRAFFIC_CTRL    = ["Please Select One","4 Way Stop","Exiting Private Road or Driveway","Flashing Red","Flashing Red/Yellow","Flashing Yellow","None","Other","Roundabout","Signal","Signal/Arrows","Stop Sign","Unknown","Yield Sign"];
const AREA_TYPES      = ["Residential","Unknown","Commerical","Recreational","Parking Lot","Rural / Farm","Mountainous"];
const DAY_NIGHT       = ["Night","Unknown","Day","Sunrise","Sunset"];
const LIGHTING_CONDS  = ["Unknown","Well Lit","Dimly Lit","Dark"];
const HOURS           = ["12","01","02","03","04","05","06","07","08","09","10","11"];
const MINS            = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

function showSigInop(tc: string) {
  return !["Please Select One","None","Stop Sign","Yield Sign","4 Way Stop","Other","","Roundabout","Unknown"].includes(tc);
}

/* ─── Police Report Modal ───────────────────────────────────── */
function PoliceReportModal({ open, onClose, onSubmit, city, zip, state, lossLocation, facts }: {
  open: boolean; onClose: () => void; onSubmit: () => void;
  city: string; zip: string; state: string; lossLocation: string; facts: string;
}) {
  const [deptName,       setDN]  = useState("");
  const [reportTypeCode, setRTC] = useState("A");
  const [driverFirst,    setDF]  = useState("");
  const [driverLast,     setDL]  = useState("");
  const [lossHour,       setLH]  = useState("12");
  const [lossMin,        setLM]  = useState("0");
  const [ampm,           setAP]  = useState("AM");
  const [agencyName,     setAN]  = useState("");
  const [agencyType,     setAT]  = useState("");
  const [agencyORI,      setAO]  = useState("");
  const [reportNumber,   setRN]  = useState("");
  const [officerName,    setON]  = useState("");
  const [transactionId,  setTI]  = useState("");

  if (!open) return null;
  const mRow: React.CSSProperties = { display: "grid", gridTemplateColumns: "150px 1fr", borderBottom: `1px solid ${COLOR.border}`, padding: "5px 10px", alignItems: "center" };
  const mLbl: React.CSSProperties = { fontWeight: "bold", fontSize: 13 };
  const mRo:  React.CSSProperties = { ...inp, background: "#e8e8e8" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", width: 580, maxHeight: "92vh", display: "flex", flexDirection: "column", borderRadius: 6, border: `2px solid ${COLOR.navy}`, boxShadow: "0 6px 32px rgba(0,0,0,0.3)" }}>
        <div style={{ background: COLOR.navy, color: "#fff", padding: "9px 14px", fontSize: 15, fontWeight: "bold", borderRadius: "5px 5px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span>Order Police Report</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>
          <div style={{ margin: 12, border: `1px solid ${COLOR.border}`, borderRadius: 4 }}>
            {[
              { l: "Department Name:",      el: <input value={deptName}       onChange={e => setDN(e.target.value)}  style={inp} /> },
              { l: "Report Type Code:",     el: <input value={reportTypeCode} onChange={e => setRTC(e.target.value)} style={inp} /> },
              { l: "Status:",               el: <input readOnly value="Not Ordered"                                  style={mRo} /> },
              { l: "Date of Loss:",         el: <input readOnly value="2/25/2026"                                    style={mRo} /> },
              { l: "Driver Name First:",    el: <input value={driverFirst}    onChange={e => setDF(e.target.value)}  style={inp} /> },
              { l: "Driver Name Last:",     el: <input value={driverLast}     onChange={e => setDL(e.target.value)}  style={inp} /> },
              { l: "Loss Hour:",            el: <input value={lossHour}       onChange={e => setLH(e.target.value)}  style={inp} /> },
              { l: "Loss Minute:",          el: <input value={lossMin}        onChange={e => setLM(e.target.value)}  style={inp} /> },
              { l: "AM PM:",                el: <input value={ampm}           onChange={e => setAP(e.target.value)}  style={inp} /> },
              { l: "Loss City:",            el: <input readOnly value={city}                                         style={mRo} /> },
              { l: "Loss Zip:",             el: <input readOnly value={zip}                                          style={mRo} /> },
              { l: "State:",                el: <input readOnly value={state}                                        style={mRo} /> },
              { l: "Location:",             el: <input readOnly value={lossLocation}                                 style={mRo} /> },
              { l: "Accident Description:", el: <input readOnly value={facts}                                        style={mRo} /> },
              { l: "Agency Name:",          el: <input value={agencyName}     onChange={e => setAN(e.target.value)}  style={inp} /> },
              { l: "Agency Type:",          el: <input value={agencyType}     onChange={e => setAT(e.target.value)}  style={inp} /> },
              { l: "Agency ORI:",           el: <input value={agencyORI}      onChange={e => setAO(e.target.value)}  style={inp} /> },
              { l: "Report Number:",        el: <input value={reportNumber}   onChange={e => setRN(e.target.value)}  style={inp} /> },
              { l: "Officer Name:",         el: <input value={officerName}    onChange={e => setON(e.target.value)}  style={inp} /> },
              { l: "Date Reported:",        el: <input readOnly value="Apr  8 2026 11:00AM"                          style={{ ...mRo, color: "#1a5ca8" }} /> },
              { l: "Transaction ID:",       el: <input value={transactionId}  onChange={e => setTI(e.target.value)}  style={inp} /> },
            ].map(r => <div key={r.l} style={mRow}><span style={mLbl}>{r.l}</span>{r.el}</div>)}
          </div>
        </div>
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${COLOR.border}`, textAlign: "center", flexShrink: 0 }}>
          <button onClick={onSubmit} style={{ background: COLOR.navy, color: "#fff", border: "none", borderRadius: 4, padding: "6px 22px", fontSize: 13, cursor: "pointer" }}>
            Order Police Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════ */
export default function LocationDetailsClient() {
  const [facts, setFacts]             = useState("2 Cars collapsed with each other");
  const [hour, setHour]               = useState("12");
  const [min, setMin]                 = useState("00");
  const [timeUnk, setTimeUnk]         = useState(false);
  const [accType, setAccType]         = useState("Left of Center");
  const [centerTurnLane, setCTL]      = useState("0");
  const [passingType, setPT]          = useState("");
  const [bicycleType, setBT]          = useState("In a Prohibited Area");
  const [pedType, setPedT]            = useState("Exiting Vehicle");
  const [sideswipeType, setSWT]       = useState("Lane Change");
  const [parkingType, setPKT]         = useState("Backing");
  const [trafficControl, setTC]       = useState("4 Way Stop");
  const [otherSignal, setOS]          = useState("");
  const [sigInop, setSigInop]         = useState(false);
  const [locUnk, setLocUnk]           = useState(false);
  const [lossLocation, setLL]         = useState("Early St, Marion, AL 36756, USA");
  const [speedLimit, setSL]           = useState("0");
  const [speedUnk, setSpeedUnk]       = useState(false);
  const [numVehicles, setNV]          = useState("2");
  const [numParties, setNP]           = useState("2");
  const [numWitnesses, setNW]         = useState("2");
  const [policeAtScene, setPAS]       = useState(false);
  const [noPoliceReport, setNPR]      = useState(false);
  const [showPoliceModal, setSPM]     = useState(false);
  const [policeReportOrdered, setPRO] = useState(false);
  const [city, setCity]               = useState("Marion");
  const [state]                       = useState("Alabama");
  const [zip, setZip]                 = useState("36757");
  const [limitedAccess, setLA]        = useState(false);
  const [offRoad, setOR]              = useState(false);
  const [disabledVeh, setDV]          = useState(false);
  const [policeDir, setPD]            = useState(false);
  const [intersection, setIntr]       = useState(false);
  const [noPassZone, setNPZ]          = useState(false);
  const [driveway, setDW]             = useState(false);
  const [parkingLot, setPL]           = useState(false);
  const [noAreaRisk, setNAR]          = useState(false);
  const [slowMoving, setSM]           = useState(false);
  const [otherAreaRisk, setOAR]       = useState(false);
  const [viewObstruction, setVO]      = useState(false);
  const [schoolZone, setSZ]           = useState(false);
  const [construction, setCon]        = useState(false);
  const [heavyTraffic, setHT]         = useState(false);
  const [prevAccident, setPA]         = useState(false);
  const [hillyCurving, setHC]         = useState(false);
  const [riskComments, setRC]         = useState("");
  const [weatherNotFactor, setWNF]    = useState(false);
  const [snowIce, setSnowIce]         = useState(false);
  const [rain, setRain]               = useState(false);
  const [wetRoad, setWR]              = useState(false);
  const [snow, setSnow]               = useState(false);
  const [weatherEmerg, setWE]         = useState(false);
  const [fog, setFog]                 = useState(false);
  const [otherWeather, setOW]         = useState(false);
  const [weatherComments, setWC]      = useState("");
  const [areaType, setAreaType]       = useState("Residential");
  const [dayNight, setDayNight]       = useState("Night");
  const [lightingCond, setLC]         = useState("Dimly Lit");

  const showLFT          = accType === "Left Turn" || accType === "Sidewipe / Lane Change / Merge";
  const showTC           = accType === "Intersection";
  const showLightingCond = dayNight !== "Day" && dayNight !== "Unknown";
  const policeOrdered    = policeReportOrdered && policeAtScene && !noPoliceReport;

  const CheckRow = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label style={chkLabel}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      {label}
    </label>
  );

  return (
    <div style={{ padding: 12, fontSize: 13, color: "#222", background: COLOR.pageBg, minHeight: "100%", fontFamily: "Verdana, Arial, sans-serif" }}>
      <div style={card}>

        {/* ── Claim info bar ──────────────────────────────── */}
        <div style={{ display: "flex", borderBottom: `1px solid ${COLOR.border}` }}>
          {[
            { k: "Claim Number:",  v: "Khizooo-Street-View-Test" },
            { k: "Insured Name",   v: "Insured-Street-View-" },
            { k: "Date of Loss",   v: "2/25/2026" },
            { k: "State",          v: "Alabama" },
            { k: "Claim Rep",      v: "Support, Intelliscence" },
          ].map((item, i, arr) => (
            <div key={item.k} style={{ flex: 1, padding: "10px 14px", borderRight: i < arr.length - 1 ? `1px solid ${COLOR.border}` : "none" }}>
              <div style={{ fontWeight: "bold", fontSize: 12, color: "#444" }}>{item.k}</div>
              <div style={{ fontSize: 13, marginTop: 2 }}>{item.v}</div>
            </div>
          ))}
        </div>

        {/* ── Brief Accident Facts ────────────────────────── */}
        <div style={{ ...rowDivider, ...rowPad, display: "flex", gap: 16, alignItems: "flex-start" }}>
          <span style={inlineLabel}>Brief Accident Facts</span>
          <div style={{ flex: 1 }}>
            <textarea value={facts} onChange={e => setFacts(e.target.value)} rows={4} style={greenTA} />
          </div>
        </div>

        {/* ── Time of Loss ────────────────────────────────── */}
        <div style={{ ...rowDivider, ...rowPad, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={inlineLabel}>Time of Loss</span>
          <label style={{ ...chkLabel, marginBottom: 0, marginRight: 8 }}>
            <input type="checkbox" checked={timeUnk} onChange={e => setTimeUnk(e.target.checked)} />
            Unknown
          </label>
          {!timeUnk && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <select value={hour} onChange={e => setHour(e.target.value)} style={{ ...sel, width: 70 }}>
                {HOURS.map((h, i) => <option key={i} value={h}>{h}</option>)}
              </select>
              <select value={min} onChange={e => setMin(e.target.value)} style={{ ...sel, width: 70 }}>
                {MINS.map((m, i) => <option key={i} value={m}>{m}</option>)}
              </select>
              <select style={{ ...sel, width: 65 }}>
                <option>xx</option><option>AM</option><option>PM</option>
              </select>
            </div>
          )}
        </div>

        {/* ── Accident Type ───────────────────────────────── */}
        <div style={{ ...rowDivider, ...rowPad, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={inlineLabel}>Accident Type</span>
          <select value={accType} onChange={e => setAccType(e.target.value)} style={{ ...sel, width: 220 }}>
            {ACCIDENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          {showLFT && (
            <>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>Center Turn Lane</span>
              <select value={centerTurnLane} onChange={e => setCTL(e.target.value)} style={{ ...sel, width: 80 }}>
                <option value="1">Yes</option><option value="0">No</option>
              </select>
            </>
          )}
          {accType === "Passing" && (
            <>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>Passing Type</span>
              <select value={passingType} onChange={e => setPT(e.target.value)} style={{ ...sel, flex: 1 }}>
                {PASSING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </>
          )}
          {accType === "Bicycle" && (
            <>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>Bicycle Type</span>
              <select value={bicycleType} onChange={e => setBT(e.target.value)} style={{ ...sel, width: 200 }}>
                {BICYCLE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </>
          )}
          {accType === "Pedestrian" && (
            <>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>Pedestrian Type</span>
              <select value={pedType} onChange={e => setPedT(e.target.value)} style={{ ...sel, width: 220 }}>
                {PED_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </>
          )}
          {accType === "Sidewipe / Lane Change / Merge" && (
            <>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>Type</span>
              <select value={sideswipeType} onChange={e => setSWT(e.target.value)} style={{ ...sel, width: 130 }}>
                {SIDESWIPE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </>
          )}
          {accType === "Parking Lot" && (
            <>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>Parking Type</span>
              <select value={parkingType} onChange={e => setPKT(e.target.value)} style={{ ...sel, width: 200 }}>
                {PARKING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </>
          )}
          {showTC && (
            <>
              <span style={{ fontWeight: "bold", fontSize: 13 }}>Traffic Control</span>
              <select value={trafficControl} onChange={e => setTC(e.target.value)} style={{ ...sel, width: 230 }}>
                {TRAFFIC_CTRL.map(t => <option key={t}>{t}</option>)}
              </select>
              {trafficControl === "Other" && (
                <input value={otherSignal} onChange={e => setOS(e.target.value)} maxLength={20} style={{ ...inp, width: 150 }} />
              )}
              {showSigInop(trafficControl) && (
                <label style={{ ...chkLabel, marginBottom: 0 }}>
                  <input type="checkbox" checked={sigInop} onChange={e => setSigInop(e.target.checked)} />
                  Signal Inoperative
                </label>
              )}
            </>
          )}
        </div>

        {/* ── Location section ────────────────────────────── */}
        <div style={{ ...rowDivider, padding: "12px 16px" }}>
          <div style={{ display: "flex", gap: 12 }}>

            {/* Left: form fields */}
            <div style={{ flex: 1, background: COLOR.sectionBg, border: `1px solid ${COLOR.border}`, borderRadius: 6, padding: "12px 14px" }}>
              {/* Street + Speed Limit */}
              {!locUnk && (
                <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <div style={{ flex: 2 }}>
                    <span style={boldLabel}>Loss Location (Street)</span>
                    <input value={lossLocation} onChange={e => setLL(e.target.value)} style={inp} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={boldLabel}>Speed Limit</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {!speedUnk && <input value={speedLimit} onChange={e => setSL(e.target.value)} style={{ ...inp, width: 70 }} maxLength={3} />}
                      <label style={{ ...chkLabel, marginBottom: 0, fontSize: 12 }}>
                        <input type="checkbox" checked={speedUnk} onChange={e => setSpeedUnk(e.target.checked)} />
                        Speed Limit Unknown / NA
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Loss Location Unknown */}
              <div style={{ marginBottom: 10 }}>
                <label style={{ ...chkLabel, marginBottom: 0 }}>
                  <input type="checkbox" checked={locUnk} onChange={e => setLocUnk(e.target.checked)} />
                  Loss Location Unknown
                </label>
              </div>

              {/* Counts */}
              {!locUnk && (
                <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
                  {[
                    { label: "Number of Vehicles", val: numVehicles, set: setNV },
                    { label: "Number of Parties",  val: numParties,  set: setNP },
                    { label: "Witnesses",           val: numWitnesses,set: setNW },
                  ].map(f => (
                    <div key={f.label} style={{ flex: 1, minWidth: 80 }}>
                      <span style={boldLabel}>{f.label}</span>
                      <input value={f.val} onChange={e => f.set(e.target.value)} style={inp} maxLength={3} />
                    </div>
                  ))}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ ...boldLabel, textAlign: "center" }}>Police at Scene?</span>
                    <input type="checkbox" checked={policeAtScene}
                      onChange={e => { setPAS(e.target.checked); if (e.target.checked) setSPM(true); else setPRO(false); }}
                      style={{ width: 16, height: 16, marginTop: 4 }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ ...boldLabel, textAlign: "center" }}>No Police Report</span>
                    <input type="checkbox" checked={noPoliceReport} onChange={e => setNPR(e.target.checked)}
                      style={{ width: 16, height: 16, marginTop: 4 }}
                    />
                  </div>
                </div>
              )}

              {/* City + ZIP */}
              {!locUnk && (
                <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <span style={boldLabel}>City</span>
                    <input value={city} onChange={e => setCity(e.target.value)} style={inp} maxLength={30} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={boldLabel}>ZIP</span>
                    <input value={zip} onChange={e => setZip(e.target.value)} style={inp} maxLength={10} />
                    {policeOrdered && (
                      <div style={{ marginTop: 4, color: COLOR.green, fontWeight: "bold", fontSize: 12 }}>
                        Police Report Ordered{" "}
                        <a href="#" style={linkSt} onClick={e => { e.preventDefault(); setSPM(true); }}>(Edit)</a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* State + links */}
              <div>
                <span style={boldLabel}>State</span>
                <input readOnly value={state} style={inpRo} />
                {!locUnk && (
                  <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                    <a href="#" style={linkSt} onClick={e => e.preventDefault()}>Google Map Search</a>
                    <a href="#" style={linkSt} onClick={e => e.preventDefault()}>Weather</a>
                    <a href="#" style={linkSt} onClick={e => e.preventDefault()}>Time: 0:00AM</a>
                  </div>
                )}
              </div>
            </div>

            {/* Right: checkboxes */}
            <div style={{ width: 220, background: COLOR.sectionBg, border: `1px solid ${COLOR.border}`, borderRadius: 6, padding: "14px 16px" }}>
              <CheckRow label="Limited Access"        checked={limitedAccess} onChange={setLA} />
              <CheckRow label="Off Road"              checked={offRoad}       onChange={setOR} />
              <CheckRow label="Disabled Vehicle"      checked={disabledVeh}   onChange={setDV} />
              <CheckRow label="Police/Other Directing"checked={policeDir}     onChange={setPD} />
              <CheckRow label="Intersection"          checked={intersection}  onChange={setIntr} />
              <CheckRow label="No Passing Zone"       checked={noPassZone}    onChange={setNPZ} />
              <CheckRow label="Driveway"              checked={driveway}      onChange={setDW} />
              <CheckRow label="Parking Lot"           checked={parkingLot}    onChange={setPL} />
            </div>
          </div>

          {/* Save #1 */}
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button style={saveBtn}>Save</button>
          </div>
        </div>

        {/* ── Area Risk Factors ───────────────────────────── */}
        <div style={{ ...rowDivider, ...rowPad }}>
          <div style={{ display: "flex", gap: 20 }}>
            {/* Col 1 */}
            <div style={{ flex: 1 }}>
              <div style={sectionHeading}>Area Risk Factors</div>
              <CheckRow label="View Obstruction"  checked={viewObstruction} onChange={setVO} />
              <CheckRow label="Construction"      checked={construction}    onChange={setCon} />
              <CheckRow label="Previous Accident" checked={prevAccident}    onChange={setPA} />
              <CheckRow label="Slow Moving Veh"   checked={slowMoving}      onChange={setSM} />
            </div>
            {/* Col 2 */}
            <div style={{ flex: 1, paddingTop: 24 }}>
              <CheckRow label="None"           checked={noAreaRisk}   onChange={v => { setNAR(v); setRC(v ? "No Area Risk Factors" : riskComments.replace("No Area Risk Factors","").trim()); }} />
              <CheckRow label="School Zone"    checked={schoolZone}   onChange={setSZ} />
              <CheckRow label="Heavy Traffic"  checked={heavyTraffic} onChange={setHT} />
              <CheckRow label="Hill / Curving" checked={hillyCurving} onChange={setHC} />
              <CheckRow label="Other Area Risk"checked={otherAreaRisk}onChange={setOAR} />
            </div>
            {/* Col 3: comments */}
            <div style={{ flex: 2 }}>
              <div style={sectionHeading}>Area Risk Factors Comments</div>
              <textarea value={riskComments} onChange={e => setRC(e.target.value)} rows={7}
                style={greenTA} placeholder="Add comments..." />
            </div>
          </div>
        </div>

        {/* ── Weather ─────────────────────────────────────── */}
        <div style={{ ...rowDivider, ...rowPad }}>
          <div style={{ display: "flex", gap: 20 }}>
            {/* Col 1 */}
            <div style={{ flex: 1 }}>
              <div style={sectionHeading}>Weather</div>
              <CheckRow label="Snowy / Icy Roadways" checked={snowIce}       onChange={setSnowIce} />
              <CheckRow label="Wet Roadways"          checked={wetRoad}       onChange={setWR} />
              <CheckRow label="Weather Emergency"     checked={weatherEmerg}  onChange={setWE} />
              <CheckRow label="Other Weather"         checked={otherWeather}  onChange={setOW} />
            </div>
            {/* Col 2 */}
            <div style={{ flex: 1, paddingTop: 24 }}>
              <CheckRow label="Weather Not a Factor" checked={weatherNotFactor} onChange={v => { setWNF(v); setWC(v ? "Weather Not A Factor" : weatherComments.replace("Weather Not A Factor","").trim()); }} />
              <CheckRow label="Rain" checked={rain} onChange={setRain} />
              <CheckRow label="Snow" checked={snow} onChange={setSnow} />
              <CheckRow label="Fog"  checked={fog}  onChange={setFog} />
            </div>
            {/* Col 3: comments */}
            <div style={{ flex: 2 }}>
              <div style={sectionHeading}>Weather Comments</div>
              <textarea value={weatherComments} onChange={e => setWC(e.target.value)} rows={7}
                style={greenTA} placeholder="Add comments..." />
            </div>
          </div>
        </div>

        {/* ── Area + Lighting ─────────────────────────────── */}
        <div style={{ ...rowPad, display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <span style={boldLabel}>Area</span>
            <select value={areaType} onChange={e => setAreaType(e.target.value)} style={{ ...sel, width: 180 }}>
              {AREA_TYPES.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <span style={boldLabel}>Lighting</span>
            <div style={{ display: "flex", gap: 8 }}>
              <select value={dayNight} onChange={e => setDayNight(e.target.value)} style={{ ...sel, width: 150 }}>
                {DAY_NIGHT.map(d => <option key={d}>{d}</option>)}
              </select>
              {showLightingCond && (
                <select value={lightingCond} onChange={e => setLC(e.target.value)} style={{ ...sel, width: 150 }}>
                  {LIGHTING_CONDS.map(l => <option key={l}>{l}</option>)}
                </select>
              )}
            </div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <button style={saveBtn}>Save</button>
          </div>
        </div>

      </div>{/* end card */}

      <PoliceReportModal
        open={showPoliceModal}
        onClose={() => setSPM(false)}
        onSubmit={() => { setPRO(true); setSPM(false); }}
        city={city} zip={zip} state={state}
        lossLocation={lossLocation} facts={facts}
      />
    </div>
  );
}
