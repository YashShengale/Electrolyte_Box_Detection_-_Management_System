import React, { useState, useEffect, useRef } from "react";

import {
  Activity,
  ArrowLeft,
} from "lucide-react";
import "./NewSession.css";

export default function NewSession({ onExit, collapseSidebar }) {
  const [step, setStep] = useState(1);
  const API_BASE = "http://localhost:5000";
  const [startTime, setStartTime] = useState(null);


  // session data
  const [camera, setCamera] = useState("");
  const [lot, setLot] = useState("");
  const [expected, setExpected] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [manualCount, setManualCount] = useState("");
  const [revealAI, setRevealAI] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const videoRef = useRef(null);

const [part, setPart] = useState("");        // FINAL SELECTED CODE
const [partSearch, setPartSearch] = useState("");
const [showPartDropdown, setShowPartDropdown] = useState(false);


  // live count
  const [count, setCount] = useState(0);

const resetSession = () => {
  setStep(1);

  // session meta
  setCamera("");
  setLot("");
  setExpected(0);

  // part selection
  setPart("");
  setPartSearch("");
  setShowPartDropdown(false);

  // counting
  setCount(0);
  setManualCount("");
  setRevealAI(false);
  setMatchResult(null);
  setStartTime(null);

  // UI overlays
  setShowEndConfirm(false);
  setIsFullscreen(false);
};




const cameras = [
  { name: "Main Camera 1 ", desc: "Primary  line" },
  { name: "Packing Station 2", desc: "Secondary  zone" },
  { name: "Camera Spot 3", desc: "Tertiary zone" },
];


  const parts = [
    // Atomberg
    { code: "SA0087", desc: "PCB_Main_1200mm Ozeo_GV4" },
    { code: "SA0038", desc: "PCB_Regulator_1200mm Renesa Alpha_GV4" },
    { code: "SA0039", desc: "PC_Remote_1200mm Studio+_GV4" },
    { code: "SA0060", desc: "Power PCB BL_CF_Renesa_GV3" },
    { code: "SA0061", desc: "Power PCB WH_CF_Renesa_GV3" },
    { code: "SA0010", desc: "Digital PCB_1200mm_Renesa Smart+_GV3" },
    { code: "SA0011", desc: "Consolidate PCB GV3 CF_Renesat GV3" },
    { code: "SA0022", desc: "Main PCB_CF_1400mm Efficio_Reg 35W_GV2" },
    { code: "SA0021", desc: "Main PCB_CF_1200mm Efficio_Reg 28W_GV2" },
    { code: "SA0019", desc: "Consolidate PCB GV2_CF Efficio_GV2" },

    // Bajaj
    { code: "974267", desc: "MAIN PCB MAJESTY SLIM INDUCTION COOKER" },
    { code: "974268", desc: "CONTROL PCB MAJESTY SLIM INDUCTION" },
    { code: "974284", desc: "DISPLAY PCB ASSLY ICX 160 TS INDUCTION" },
    { code: "974290", desc: "DISPLAY PCB ASSLY ICX 190 TS INDUCTION" },
    { code: "974295", desc: "DISPLAY PCB ASSLY ICX 200 FP INDUCTION" },
    { code: "971054", desc: "MAIN PCB ASSLY SPLENDID 120 TS" },
    { code: "971055", desc: "DISPLAY PCB ASSLY SPLENDID 120 TS" },
    { code: "971064", desc: "MAIN PCB ASSLY SPLENDID 140 TS" },
    { code: "971065", desc: "DISPLAY PCB ASSLY SPLENDID 140 TS" },
    { code: "971039", desc: "MAIN PCB IRX 220F INFRARED COOKTOP" },
    { code: "971040", desc: "DISPLAY PCB IRX 220F INFRARED COOKTOP" },
    { code: "971084", desc: "DISPLAY PCB ICX 160 TS NEO" },
    { code: "971079", desc: "MAIN PCB ASSLY ICX 160 TS NEO" },
    { code: "971090", desc: "DISPLAY PCB ASSLY ICX 190 FS INDUCTION" },
    { code: "971089", desc: "MAIN PCB ASSLY ICX 190 FS INDUCTION" },
    { code: "9252950", desc: "MAIN PCB ASSLY CLASSICO SLEEK PLUS 1200" },
  ];


  const Back = () => (
    <button
      className="back-btn"
      onClick={() => {
        if (step <= 2) {
          exitSessionCompletely();   // FULL RESET
        } else {
          setStep(step - 1);
        }
      }}
    >
      <ArrowLeft /> Back
    </button>
  );



const exitSessionCompletely = () => {
  resetSession();
  onExit?.();          // optional: if parent navigation exists
};


/* ================= STEP 1 : CAMERA SELECT ================= */
if (step === 1) {
  return (
    <div className="source-root app-container">
      <h1>Source Selection</h1>
      <p>Select an active camera node</p>

      <div className="source-list">
        {cameras.map((cam) => (
          <div
            key={cam.name}
            className="source-row"
            onClick={() => {
              setCamera(cam.name);
              setStep(2);
            }}
          >
            <div className="camera-icon">
              📷
            </div>

            <div className="camera-meta">
              <h3>{cam.name}</h3>
              <span>{cam.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


  /* ================= STEP 2 : CAMERA STATUS ================= */
  if (step === 2) {
    return (
      <div className="status-root app-container">
        <Back />
        <h1>Camera Status</h1>
        <p>Verify live feed before packing</p>

        <div className="video-box">
          <img
            src="http://localhost:5000/video"
            alt="Live Camera Feed"
            className="video-feed"
          />
        </div>

        <button className="primary" onClick={() => setStep(3)}>
          Start Packing
        </button>
      </div>
    );
  }

/* ================= STEP 3 : BOX DETAILS ================= */
if (step === 3) {
  return (
    <div className="manifest-root app-container">
      <Back />

      <h1 className="page-title">Box Details</h1>

      {/* PART IDENTIFICATION */}
      <div className="card">
        <h3 className="card-title">Part Identification</h3>

        <div className="field">
          <label>Part Code</label>

          <input
            type="text"
            placeholder="Type part code (SA00 / 97...)"
            value={partSearch}
            onChange={(e) => {
              setPartSearch(e.target.value);
              setShowPartDropdown(true);
            }}
            onFocus={() => setShowPartDropdown(true)}
          />

          {showPartDropdown && (
            <div className="part-dropdown">
              {parts
                .filter((p) =>
                  p.code.toLowerCase().includes(partSearch.toLowerCase())
                )
                .map((p) => (
                  <div
                    key={p.code}
                    className="part-option"
                    onClick={() => {
                      setPart(p.code);        // ✅ ONLY CODE STORED
                      setPartSearch(p.code);  // input shows code
                      setShowPartDropdown(false);
                    }}
                  >
                    <strong>{p.code}</strong>
                    <span>{p.desc}</span>
                  </div>
                ))}

              {parts.filter((p) =>
                p.code.toLowerCase().includes(partSearch.toLowerCase())
              ).length === 0 && (
                <div className="part-option muted">
                  No matching part code
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* LOT INFO */}
      <div className="card">
        <h3 className="card-title">Batch Information</h3>

        <div className="field">
          <label>Lot / Batch Reference</label>
          <input
            placeholder="Ex: LOT-0425-A"
            value={lot}
            onChange={(e) => setLot(e.target.value)}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="form-actions">
        <button className="ghost-btn" onClick={() => setStep(2)}>
          Cancel
        </button>

        <button
          className="primary-btn"
          disabled={!part || !lot}
          onClick={() => setStep(4)}
        >
          Launch Session
        </button>
      </div>
    </div>
  );
}






const saveSessionToDB = async (manual, ai) => {
  const durationSeconds = startTime
    ? Math.floor((Date.now() - startTime) / 1000)
    : null;

  const payload = {
    part_number: part,
    lot_number: lot,
    packing_date: new Date().toISOString().slice(0, 10),
    camera_name: camera,
    worker_name: "Operator-1", // later from auth
    ai_count: ai,
    manual_count: manual,
    duration_seconds: durationSeconds,
  };

  try {
    const res = await fetch(`${API_BASE}/sessions/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to save session");
      return;
    }

    console.log("✅ Saved to DB:", data.session_id);
    alert("Session saved successfully");

    resetSession();
  } catch (err) {
    console.error(err);
    alert("Backend not reachable");
  }
};

const restartCounting = () => {
  setShowEndConfirm(false);
  setRevealAI(false);
  setMatchResult(null);
  setManualCount("");
  setCount(0);
  setStartTime(null);

  // go back to box placement to restart video + timing
  setStep(4);
};

  /* ================= STEP 4 : BOX PLACEMENT ================= */
  if (step === 4) {
    return (
      <div className="placement-root app-container">
        <Back />
        <h1>Box Placement</h1>
        <p>Place empty box under camera</p>

        <div className="video-box">
          <img
            src="http://localhost:5000/video"
            alt="Box Placement Feed"
            className="video-feed"
          />
        </div>

        <button
          className="primary"
          onClick={() => {
            setStartTime(Date.now());
            setStep(5);
          }}
        >
          Ready to Count
        </button>

      </div>
    );
  }

  /* ================= STEP 5 : LIVE COUNT ================= */
/* ================= STEP 5 : LIVE COUNT ================= */
if (step === 5) {
  return (
    <>
      <div className="count-root app-container">
        <header className="count-header">
          <div>
            <h1 className="live-title">
              <span className="live-dot" /> Live Count
            </h1>
            <p className="live-sub">
              {camera} • {part} • Lot {lot}
            </p>
          </div>

          <button
            className="end-btn"
            onClick={() => setShowEndConfirm(true)}
          >
            End Session
          </button>
          
        </header>

        <div className="count-grid">
          {/* VIDEO */}
          <div className="video-box" ref={videoRef}>
            <button
              className="fullscreen-btn"
              onClick={() => {
                if (!document.fullscreenElement) {
                  videoRef.current.requestFullscreen();
                  setIsFullscreen(true);
                } else {
                  document.exitFullscreen();
                  setIsFullscreen(false);
                }
              }}
            >
              ⛶
            </button>

            <img
              src="http://localhost:5000/video"
              alt="Live Counting Feed"
              className="video-feed"
            />

            <div className="video-overlay">
              AI Model Active
            </div>
          </div>

          {/* COUNT PANEL */}
          <div className="count-panel">
            <p className="panel-title">Confirmed Count</p>

            <h2 className="count-number">
              {revealAI ? count : "—"}
            </h2>

            <div className="divider" />

            <div className="row">
              <div>
                <label>Expected</label>
                <span>{expected}</span>
              </div>
              <div>
                <label>Remaining</label>
                <span className="warn">
                  {Math.max(expected - count, 0)}
                </span>
              </div>
            </div>

            {!revealAI && (
              <div className="count-note">
                Operator verification in progress
              </div>
            )}

            {revealAI && (
              <div className={`match-result ${matchResult}`}>
                <p>Manual Count: <strong>{manualCount}</strong></p>
                <p>AI Count: <strong>{count}</strong></p>

                {revealAI && matchResult === "match" && (
                  <div className="match-banner success">
                    <h3>✅ Counts Matched</h3>
                    <p>Session verified successfully.</p>
                  </div>
                )}

                {revealAI && matchResult === "mismatch" && (
                  <div className="match-banner error">
                    <h2>❌ COUNT MISMATCH</h2>

                    <p>
                      Manual Count (<strong>{manualCount}</strong>) does not match
                      AI Count (<strong>{count}</strong>).
                    </p>

                    <p className="instruction">
                      Please recount the box to continue.
                    </p>

                    <button
                      className="danger-btn"
                      onClick={restartCounting}
                    >
                      Recount Box
                    </button>
                  </div>
                )}

                
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONFIRM END SESSION */}
      {showEndConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <h2>End Current Session?</h2>
            <p>Enter manually counted boxes</p>

            <input
              type="number"
              placeholder="Manual count"
              value={manualCount}
              onChange={(e) => setManualCount(e.target.value)}
              className="manual-input"
            />

            <div className="confirm-actions">
              <button
                className="secondary-btn"
                onClick={() => setShowEndConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="danger-btn"
                disabled={manualCount === ""}
                onClick={() => {
                  setShowEndConfirm(false);

                  const ai = count;
                  const manual = Number(manualCount);

                  setRevealAI(true);

                  if (manual === ai) {
                    setMatchResult("match");
                    saveSessionToDB(manual, ai);   // 🔥 DB SAVE HERE
                  } else {
                    setMatchResult("mismatch");
                  }
                }}
              >
                Submit & Verify
              </button>


            </div>
          </div>
        </div>
      )}
    </>
  );
}


}
