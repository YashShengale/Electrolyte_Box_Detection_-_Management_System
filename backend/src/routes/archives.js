import express from "express";
import db from "../db/database.js";

const router = express.Router();


/* ================= ARCHIVES ================= */
router.get("/", (req, res) => {
  console.log("ARCHIVES ROUTE HIT");
  try {
    const rows = db.prepare(`
      SELECT
        session_id,
        part_number,
        lot_number,
        packing_date,
        camera_name,
        worker_name,
        ai_count,
        manual_count,
        duration_seconds,
        status
      FROM box_sessions
      WHERE status = 'VERIFIED'
      ORDER BY packing_date DESC
    `).all();


    res.json({
      success: true,
      sessions: rows
    });

  } catch (err) {
    console.error("ARCHIVES ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch archives"
    });
  }
});

/* ================= BOX STATISTICS ================= */
router.get("/box-statistics", (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT
        part_number,
        SUM(ai_count + manual_count) AS quantity
      FROM box_sessions
      WHERE status = 'VERIFIED'
      GROUP BY part_number
      ORDER BY part_number
    `).all();

    res.json({
      success: true,
      data: rows
    });

  } catch (err) {
    console.error("BOX STATS ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch box statistics"
    });
  }
});

export default router;
