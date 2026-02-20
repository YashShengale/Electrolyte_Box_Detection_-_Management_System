import React, { useState } from "react";
import {
  LayoutDashboard,
  Archive,
  Camera,
  Users,
  Menu,
} from "lucide-react";

import Archives from "./Archives";
import "./AdminDashboard.css";

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-root">
      {/* ☰ BUTTON (ALWAYS VISIBLE) */}
      <button
        className="sidebar-fab"
        onClick={() => setSidebarOpen(prev => !prev)}
      >

        <Menu />
      </button>

      {/* OVERLAY (click outside closes sidebar) */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="app-brand">
          <h2>Box Counting System</h2>
          <span>Electrolyte Solutions</span>
        </div>

        <SidebarItem
          icon={<LayoutDashboard />}
          label="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => {
            setActiveTab("dashboard");
            closeSidebar();
          }}
        />

        <SidebarItem
          icon={<Archive />}
          label="Archives"
          active={activeTab === "archives"}
          onClick={() => {
            setActiveTab("archives");
            closeSidebar();
          }}
        />

        <SidebarItem
          icon={<Camera />}
          label="Cameras"
          active={activeTab === "cameras"}
          onClick={() => {
            setActiveTab("cameras");
            closeSidebar();
          }}
        />

        <SidebarItem
          icon={<Users />}
          label="Workers"
          active={activeTab === "workers"}
          onClick={() => {
            setActiveTab("workers");
            closeSidebar();
          }}
        />

        <div className="admin-footer">
          <div className="admin-info">
            <strong>{user?.username || "Admin"}</strong>
            <span className="admin-tag">ADMIN</span>
          </div>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="admin-content">
        {activeTab === "dashboard" && <AdminOverview />}
        {activeTab === "archives" && <Archives />}
        {activeTab === "cameras" && <CameraPage />}
        {activeTab === "workers" && <WorkerPage />}
      </main>
    </div>
  );
}

/* ================= SIDEBAR ITEM ================= */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      className={`sidebar-item ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function AdminOverview() {
  return (
    <div className="admin-page">
      <h1>System Overview</h1>

      <div className="summary-grid">
        <SummaryCard title="Total Sessions" value="142" />
        <SummaryCard title="Boxes Counted Today" value="12,480" />
        <SummaryCard title="Active Cameras" value="3 / 3" />
        <SummaryCard title="Storage Used" value="38%" />
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div className="summary-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

/* ================= CAMERAS ================= */

function CameraPage() {
  return (
    <div className="admin-page">
      <h1>Camera Nodes</h1>

      <div className="info-grid">
        <InfoCard title="Main Conveyor (Top)" meta="FPS: 28 • Online" />
        <InfoCard title="Packing Station B" meta="FPS: 26 • Online" />
        <InfoCard title="Quality Hub 04" meta="FPS: 24 • Online" />
      </div>
    </div>
  );
}

/* ================= WORKERS ================= */

function WorkerPage() {
  return (
    <div className="admin-page">
      <h1>Workers</h1>

      <div className="info-grid">
        <InfoCard title="Ramesh K." meta="Shift A • Packing Station B" />
        <InfoCard title="Suresh P." meta="Shift B • Conveyor" />
      </div>
    </div>
  );
}

/* ================= SHARED ================= */

function InfoCard({ title, meta }) {
  return (
    <div className="info-card">
      <strong>{title}</strong>
      <span>{meta}</span>
    </div>
  );
}
