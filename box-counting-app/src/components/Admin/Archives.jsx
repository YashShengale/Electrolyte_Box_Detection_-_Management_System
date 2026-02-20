import React, { useEffect, useState } from "react";
import { FileText } from "lucide-react";
import "./Archives.css";

const API_BASE = "http://localhost:5000";

export default function Archives({ mode = "admin" }) {
  const [sessions, setSessions] = useState([]);
  const [showChallan, setShowChallan] = useState(false);
  const [lotInput, setLotInput] = useState("");
  const [challanItems, setChallanItems] = useState([]);
  const [loadingChallan, setLoadingChallan] = useState(false);
  const [challanError, setChallanError] = useState("");
  const [courierPartner, setCourierPartner] = useState("");

  const [customer, setCustomer] = useState("");
  const [transporter, setTransporter] = useState("");
  const [challanNo, setChallanNo] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const [showBoxStats, setShowBoxStats] = useState(false);
  const [boxStats, setBoxStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState("");


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

  useEffect(() => {
    fetch(`${API_BASE}/archives`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSessions(data.sessions);
        }
      });
  }, []);

  const generatePDF = async () => {
    if (!lotInput || challanItems.length === 0) {
      alert("Fetch lot data first");
      return;
    }

    if (!customer || !challanNo || !pickupDate) {
      alert("Please fill all challan details");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/challan/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lot: lotInput,
          customer,
          transporter,
          courierPartner,
          challanNo,
          pickupDate
        })

      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Challan_Lot_${lotInput}.pdf`;
      a.click();
    } catch (err) {
      alert("Failed to generate PDF");
    }
  };

const generateDOCX = async () => {
  if (!lotInput || challanItems.length === 0) {
    alert("Fetch lot data first");
    return;
  }

  if (!customer || !challanNo || !pickupDate) {
    alert("Please fill all challan details");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/challan/docx`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lot: lotInput,
        customer,
        transporter,
        courierPartner,
        challanNo,
        pickupDate
      })

    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `Challan_Lot_${lotInput}.docx`;
    a.click();
  } catch (err) {
    alert("Failed to generate DOCX");
  }
};



const fetchChallanByLot = async () => {
  if (!lotInput) {
    setChallanError("Please enter Lot Number");
    return;
  }

  setLoadingChallan(true);
  setChallanError("");
  setChallanItems([]);

  try {
    const res = await fetch(`${API_BASE}/challan/lot/${lotInput}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      setChallanError("No data found for this Lot");
      return;
    }

    if (data.items.length === 0) {
      setChallanError("No completed sessions for this Lot");
      return;
    }

    setChallanItems(data.items);
  } catch (err) {
    setChallanError("Backend not reachable");
  } finally {
    setLoadingChallan(false);
  }
};

const getPartName = (code) => {
  const part = parts.find(p => p.code === code);
  return part ? part.desc : "-";
};

const closeChallan = () => {
  setShowChallan(false);
  setLotInput("");
  setCustomer("");
  setTransporter("");
  setCourierPartner("");
  setChallanNo("");
  setPickupDate("");
  setChallanItems([]);
  setChallanError("");
};

const fetchBoxStatistics = async () => { //
  setLoadingStats(true);
  setStatsError("");
  setBoxStats([]);

  try {
    const res = await fetch(`${API_BASE}/archives/box-statistics`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      setStatsError("Failed to fetch box statistics");
      return;
    }

    setBoxStats(data.data);
  } catch (err) {
    setStatsError("Backend not reachable");
  } finally {
    setLoadingStats(false);
  }
};


  return (
    
    <div className="archives-root">
      {/* ================= PAGE HEADER ================= */}
      <div className="archives-page-header">
        <div className="archives-title">
          <h1>Session Archives</h1>
          <p className="subtitle">Verified packing sessions</p>
        </div>

        {mode === "admin" && (
          <div className="archives-actions">
            <button
              className="primary-btn"
              onClick={() => setShowChallan(true)}
            >
              <FileText size={16} />
              Generate Challan
            </button>

            <button  className="secondary-btn"
                onClick={async() => {
                  setShowBoxStats(true);
                  await fetchBoxStatistics();
                }}
              >
              Box Statistics
            </button>
          </div>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="archive-table-wrapper">
        <table className="archive-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>Part</th>
              <th>Lot</th>
              <th>Date</th>
              <th>Camera</th>
              <th>Worker</th>
              <th>AI</th>
              <th>Manual</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sessions.length === 0 && (
              <tr>
                <td colSpan="11" className="empty-row">
                  No verified sessions found
                </td>
              </tr>
            )}

            {sessions.map((s) => (
              <tr key={s.session_id}>
                <td className="mono">{s.session_id}</td>
                <td>{s.part_number}</td>
                <td>{s.lot_number}</td>
                <td>{s.packing_date}</td>
                <td>{s.camera_name}</td>
                <td>{s.worker_name}</td>
                <td>{s.ai_count}</td>
                <td>{s.manual_count}</td>
                <td>{s.duration_seconds}s</td>
                <td className="status">{s.status}</td>
                <td>
                  {mode === "admin" && (
                    <button className="icon-btn" title="Generate Challan">
                      <FileText size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showChallan && (
        <div className="confirm-overlay">
          <div className="confirm-box" style={{ maxWidth: 600 }}>
            <h2>Generate Challan</h2>

{/* ================= CHALLAN HEADER TABLE ================= */}
<table className="challan-meta-table">
  <tbody>
    <tr>
      <td><strong>Customer Detail</strong></td>
      <td>
        <input value={customer} onChange={(e) => setCustomer(e.target.value)} />
      </td>

      <td><strong>Challan No</strong></td>
      <td>
        <input value={challanNo} onChange={(e) => setChallanNo(e.target.value)} />
      </td>
    </tr>

    <tr>
      <td><strong>Transporter ID</strong></td>
      <td>
        <input value={transporter} onChange={(e) => setTransporter(e.target.value)} />
      </td>

      <td><strong>Pickup Date</strong></td>
      <td>
        <input type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
      </td>
    </tr>

    <tr>
      <td><strong>Courier Partner</strong></td>
      <td>
        <input
          value={courierPartner}
          onChange={(e) => setCourierPartner(e.target.value)}
          placeholder="Courier Partner"
        />

      </td>

      <td><strong>Lot No</strong></td>
      <td>
        <input
          value={lotInput}
          onChange={(e) => setLotInput(e.target.value)}
        />
      </td>
    </tr>

  </tbody>
</table>

<button
  className="primary-btn"
  style={{ marginTop: 12 }}
  onClick={fetchChallanByLot}
  disabled={!lotInput || loadingChallan}
>
  {loadingChallan ? "Fetching..." : "Fetch Lot Data"}
</button>



            {/* RESULT TABLE */}
            {challanItems.length > 0 && (

              <table className="challan-item-table">
                <thead>
                  <tr>
                    <th>Sr No</th>
                    <th>Part Code</th>
                    <th>Part Name</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {challanItems.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.part_number}</td>
<td>{getPartName(item.part_number)}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>


            )}

            {/* ACTIONS */}
            <div className="challan-actions">
              <button className="btn-outline" onClick={closeChallan}>
                Close
              </button>

              <button
                className="btn-primary"
                onClick={generatePDF}
                disabled={!challanItems.length || !customer || !challanNo || !pickupDate}
              >
                Download PDF
              </button>

              <button
                className="btn-secondary"
                onClick={generateDOCX}
                disabled={!challanItems.length || !customer || !challanNo || !pickupDate}
              >
                Download DOCX
                <span className="sub-text">(Editable)</span>
              </button>
            </div>


          </div>
        </div>
      )}
    {showBoxStats && (
      <div className="confirm-overlay">
        <div className="confirm-box" style={{ maxWidth: 500 }}>
          <h2>Box Statistics</h2>

          {loadingStats && <p>Loading...</p>}
          {statsError && <p className="error">{statsError}</p>}

          {boxStats.length > 0 && (
            <table className="challan-item-table">
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Part Code</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {boxStats.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.part_number}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="challan-actions">
            <button
              className="btn-outline"
              onClick={() => {
                setShowBoxStats(false);
                setBoxStats([]);
                setStatsError("");
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )} 
  
    </div>
 

  );



}
