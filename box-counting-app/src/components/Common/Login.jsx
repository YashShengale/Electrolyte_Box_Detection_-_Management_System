import React, { useState } from "react";
import { Box, Shield } from "lucide-react";
import "./login.css";

const ADMIN_PASSWORD = "12";

export default function Login({ onLogin }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "worker",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setError("");

    // 👷 Worker: only username ne  eded
    if (form.role === "worker") {
      if (!form.username) return;

      setLoading(true);
      setTimeout(() => {
        onLogin({
          username: form.username,
          role: "worker",
        });
        setLoading(false);
      }, 600);

      return;
    }

    // 🛠 Admin: username + fixed password
    if (!form.username || !form.password) return;

    if (form.password !== ADMIN_PASSWORD) {
      setError("Invalid admin password");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      onLogin({
        username: form.username,
        role: "admin",
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="login-root">
      <div className="login-bg" />

      <form onSubmit={submit} className="login-card">
        {/* LOGO */}
        <div className="login-logo">
          <Box className="w-7 h-7 text-white" />
        </div>

        <h1 className="login-title">Industrial Box Counting</h1>
        <p className="login-subtitle">Electrolyte Solutions</p>

        {/* USERNAME */}
        <div className="login-field">
          <label>IDENTITY</label>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        </div>

        {/* PASSWORD — ONLY FOR ADMIN */}
        {form.role === "admin" && (
          <div className="login-field">
            <label>ACCESS KEY</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>
        )}

        {/* ROLE */}
        <div className="login-field">
          <label>PRIVILEGE LEVEL</label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
                password: "", // reset when switching roles
              })
            }
          >
            <option value="worker">Floor Operator</option>
            <option value="admin">System Admin</option>
          </select>
        </div>

        {/* ERROR */}
        {error && <p className="login-error">{error}</p>}

        {/* ACTION */}
        <button type="submit" className="login-btn">
          {loading ? "AUTHENTICATING…" : "ACCESS SYSTEM"}
        </button>

        <div className="login-footer">
          <Shield className="w-4 h-4" />
          Internal industrial access
        </div>
      </form>
    </div>
  );
}
