import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db/database.js";

const router = express.Router();
const API_BASE = "http://localhost:5000";

router.post("/save", (req, res) => {
  const {
    part_number,
    lot_number,
    packing_date,
    camera_name,
    worker_name,
    ai_count,
    manual_count,
    duration_seconds
  } = req.body;

  if (ai_count !== manual_count) {
    return res.status(400).json({
      success: false,
      message: "Count mismatch. Session not saved."
    });
  }

  const session_id = uuidv4();

  try {
    // Corrected: Added the 10th '?' to match the 10 columns and 10 arguments
    db.prepare(`
      INSERT INTO box_sessions (
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
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      session_id,
      part_number,
      lot_number,
      packing_date,
      camera_name,
      worker_name,
      ai_count,
      manual_count,
      duration_seconds,
      "VERIFIED"
    );

    res.json({
      success: true,
      session_id
    });
  } catch (err) {
    console.error("DATABASE ERROR:", err);
    res.status(500).json({
      success: false,
      error: "Internal Server Error during database insertion"
    });
  }
});


router.post("/attach-image", (req, res) => {
  const { session_id, image_file } = req.body;

  if (!session_id || !image_file) {
    return res.status(400).json({ success: false });
  }

  db.prepare(`
    UPDATE box_sessions
    SET image_path = ?
    WHERE session_id = ?
  `).run(image_file, session_id);

  res.json({ success: true });
});


export default router;