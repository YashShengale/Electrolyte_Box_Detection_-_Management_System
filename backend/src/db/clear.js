import db from "./database.js";

export function cleanupOldSessions() {
  const result = db.prepare(`
    DELETE FROM box_sessions
    WHERE packing_date < date('now', '-3 months')
  `).run();

  if (result.changes > 0) {
    console.log(`Deleted ${result.changes} sessions older than 3 months`);
  } else {
    console.log("No old sessions to delete");
  }
}