import Database from "better-sqlite3";

const db = new Database("database/app.db");
const API_BASE = "http://localhost:5000";

// MAIN TABLE
db.prepare(`
CREATE TABLE IF NOT EXISTS box_sessions (
  session_id TEXT PRIMARY KEY,

  part_number TEXT NOT NULL,
  lot_number TEXT NOT NULL,

  packing_date TEXT NOT NULL,

  camera_name TEXT NOT NULL,
  worker_name TEXT NOT NULL,

  ai_count INTEGER NOT NULL,
  manual_count INTEGER NOT NULL,

  duration_seconds INTEGER,

  status TEXT DEFAULT 'completed',

  video_path TEXT,
  video_created_at TEXT,

  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`).run();

console.log("Database initialized");

export default db;