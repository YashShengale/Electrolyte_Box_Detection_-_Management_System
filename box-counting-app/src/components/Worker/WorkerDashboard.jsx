import React, { useState } from "react";
import {
  LayoutDashboard,
  Archive,
  Plus,
  LogOut,
  Menu,
  User,
  Box,
} from "lucide-react";

import "./workerDashboard.css";

import NewSession from "./NewSession";
import Archives from "../Admin/Archives"; // ✅ reuse admin archives

export default function WorkerDashboard({ user }) {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-shell">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "expanded" : ""}`}>
        {/* HEADER */}
        <div className="sidebar-header">
          <div className="logo">
            <Box />
          </div>

          {sidebarOpen && (
            <div className="app-brand">
              <span className="brand-title">Box Counting System</span>
              <span className="brand-sub">Electrolyte Solutions</span>
            </div>
          )}

          <button
            className="menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu />
          </button>
        </div>

        {/* MANAGEMENT */}
        <div className="sidebar-section">
          <p className="sidebar-title">Management</p>

          <SideItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            active={active === "dashboard"}
            expanded={sidebarOpen}
            onClick={() => {setActive("dashboard");
              setSidebarOpen(false);
            }}
          />

          <SideItem
            icon={<Archive />}
            label="Archives"
            active={active === "archives"}
            expanded={sidebarOpen}
            onClick={() => {setActive("archives");
              setSidebarOpen(false);
            }}
          />
        </div>

        {/* ACTIONS */}
        <div className="sidebar-section">
          <p className="sidebar-title">Actions</p>

          <SideItem
            icon={<Plus />}
            label="New Session"
            expanded={sidebarOpen}
            onClick={() => {setActive("new");
              setSidebarOpen(false);
            }}
            accent
          />
        </div>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <div className="user-box">
            <User />
            {sidebarOpen && (
              <div>
                <p className="username">{user?.username}</p>
                <span className="role">Operator</span>
              </div>
            )}
          </div>

          <button
            className="logout-btn"
            onClick={() => window.location.reload()}
          >
            <LogOut />
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {/* MOBILE MENU TOGGLE */}
      <button
         className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
      >
        <Menu />
      </button>

      <main className="main-content">
        {active === "dashboard" && <SimpleDashboard />}

        {active === "archives" && (
          <Archives
            mode="worker"
            user={user}
            canDownload={false} // 🔒 IMPORTANT
          />
        )}

        {active === "new" && (
          <NewSession
            collapseSidebar={() => setSidebarOpen(false)}
          />
        )}
      </main>
    </div>
  );
}

/* ---------------- SIDEBAR ITEM ---------------- */
function SideItem({ icon, label, active, expanded, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className={`side-item ${active ? "active" : ""} ${
        accent ? "accent" : ""
      }`}
    >
      {icon}
      {expanded && <span>{label}</span>}
    </button>
  );
}

/* ---------------- DASHBOARD ---------------- */
function SimpleDashboard() {
  return (
    <div>
      <h1 className="page-title">Executive Dashboard</h1>
      <p className="page-subtitle">Industrial Intelligence & QA Hub</p>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Audits</p>
          <h2>2</h2>
        </div>
        <div className="stat-card">
          <p>Active Today</p>
          <h2>2</h2>
        </div>
        <div className="stat-card">
          <p>Model Accuracy</p>
          <h2>98.2%</h2>
        </div>
        <div className="stat-card">
          <p>Avg Throughput</p>
          <h2>42.5/hr</h2>
        </div>
      </div>
    </div>
  );
}
