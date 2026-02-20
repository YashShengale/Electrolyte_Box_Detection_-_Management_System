  import express from "express";
  import cors from "cors";
  import { spawn } from "child_process";
  import "./db/database.js";
  import { cleanupOldSessions } from "./db/clear.js";

  import archivesRoute from "./routes/archives.js";
  import sessionsRoute from "./routes/sessions.js";
  import challanRoutes from "./routes/challan.routes.js";

  const app = express();
  const PORT = 5000;

  // ================= START PYTHON SERVER =================
  const pythonProcess = spawn("python3", ["server.py"], {
    cwd: process.cwd(), // backend folder
    stdio: "inherit"
  });

  pythonProcess.on("error", (err) => {
    console.error("Failed to start Python backend:", err);
  });

  pythonProcess.on("close", (code) => {
    console.log(`Python backend exited with code ${code}`);
  });

  // ================= EXPRESS SETUP =================
  app.use(cors());
  app.use(express.json());

  app.use("/archives", archivesRoute);
  app.use("/sessions", sessionsRoute);
  app.use("/challan", challanRoutes);

  cleanupOldSessions();

  app.get("/", (req, res) => {
    res.send("Backend running");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Node backend running on port ${PORT}`);
  });
