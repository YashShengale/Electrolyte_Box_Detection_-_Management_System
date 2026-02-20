import React, { useState } from "react";
import Login from "./components/Common/Login";
import WorkerDashboard from "./components/Worker/WorkerDashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CapturePhoto from "./components/Common/CapturePhoto";

export default function App() {
  const [user, setUser] = useState(null);
  const [stage, setStage] = useState("login");

  /* ---------------- AUTH HANDLERS ---------------- */

  const handleLogin = (userData) => {
    setUser(userData);
    // If worker, go to capture first; otherwise, go straight to dashboard
    if (userData.role === "worker") {
      setStage("capture");
    } else {
      setStage("dashboard");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setStage("login"); // CRITICAL: Reset the stage so the next user starts fresh
  };

  /* ---------------- RENDERING LOGIC ---------------- */

  // 1. If no user is logged in, show Login
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // 2. Worker Flow (Verification -> Dashboard)
  if (user.role === "worker") {
    if (stage === "capture") {
      return (
        <CapturePhoto 
          user={user} 
          onDone={() => setStage("dashboard")} 
        />
      );
    }
    return (
      <WorkerDashboard 
        user={user} 
        onLogout={handleLogout} 
      />
    );
  }

  // 3. Admin Flow
  if (user.role === "admin") {
    return (
      <AdminDashboard 
        user={user} 
        onLogout={handleLogout} 
      />
    );
  }

  // 4. Fallback for unauthorized or undefined roles
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h2>Unauthorized Role</h2>
      <p>Role: {user.role}</p>
      <button onClick={handleLogout}>Back to Login</button>
    </div>
  );
}