import React, { useEffect, useMemo, useState } from "react";
import GrowthForm from "./GrowthForm";

/**
 * Endpoints:
 *  GET    /api/growth
 *  POST   /api/growth
 *  PUT    /api/growth/:id
 *  DELETE /api/growth/:id
 *
 * Row shape (locked):
 * { id, tag_number, branding_id, age_days, body_weight, recorded_on }
 */
export default function GrowthList() {
  const base = process.env.REACT_APP_API_BASE_URL;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // filters
  const [q, setQ] = useState("");
  const [mode, setMode] = useState("all"); // all | tag | brand

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (mode === "tag" && !r.tag_number) return false;
      if (mode === "brand" && !r.branding_id) return false;
      const hit =
        String(r.tag_number || "").toLowerCase().includes(s) ||
        String(r.branding_id || "").toLowerCase().includes(s);
      return s ? hit : true;
    });
  }, [q, rows, mode]);

  const fetchAll = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await fetch(`${base}/api/growth`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load growth records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const beginAdd = () => {
    setEditing(null);
    setShowForm(true);
  };
  const beginEdit = (row) => {
    setEditing(row);
    setShowForm(true);
  };
  const cancelForm = () => {
    setEditing(null);
    setShowForm(false);
  };

  const handleAdd = async (payload) => {
    try {
      setErr("");
      const res = await fetch(`${base}/api/growth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || "Create failed");
      await fetchAll();
      setShowForm(false);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Could not create growth record.");
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing || editing.id == null) return;
    try {
      setErr("");
      const res = await fetch(`${base}/api/growth/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || "Update failed");
      await fetchAll();
      setEditing(null);
      setShowForm(false);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Could not update growth record.");
    }
  };

  const handleDelete = async (row) => {
    const label = row.tag_number || row.branding_id || row.id;
    if (!window.confirm(`Delete growth record for ${label}? This cannot be undone.`)) return;
    try {
      setErr("");
      const res = await fetch(`${base}/api/growth/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.text()) || "Delete failed");
      await fetchAll();
    } catch (e) {
      console.error(e);
      setErr(e.message || "Could not delete growth record.");
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <h2 style={{ margin: 0 }}>Growth</h2>
        <div style={styles.headerRight}>
          <input
            type="text"
            placeholder="Search tag/branding"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={styles.search}
          />
          <select value={mode} onChange={(e) => setMode(e.target.value)} style={styles.filter}>
            <option value="all">All</option>
            <option value="tag">Tag only</option>
            <option value="brand">Brand only</option>
          </select>
          <button onClick={beginAdd} style={styles.primaryBtn}>Add Growth</button>
        </div>
      </div>

      {err ? <div style={styles.error}>{err}</div> : null}
      {loading ? <div style={styles.info}>Loading…</div> : null}

      {showForm ? (
        <div style={{ margin: "12px 0" }}>
          <GrowthForm
            initialData={editing || {}}
            onSubmit={editing ? handleUpdate : handleAdd}
            onCancel={cancelForm}
            buttonLabel={editing ? "Update Growth" : "Save Growth"}
          />
        </div>
      ) : null}

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Tag</th>
              <th>Branding</th>
              <th>Age (days)</th>
              <th>Body Wt (kg)</th>
              <th>Recorded On</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={styles.emptyCell}>
                  {q ? "No matches." : "No records yet."}
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.id ?? `${r.tag_number}-${r.branding_id}-${i}`}>
                  <td>{i + 1}</td>
                  <td>{r.tag_number || "-"}</td>
                  <td>{r.branding_id || "-"}</td>
                  <td>{r.age_days}</td>
                  <td>{r.body_weight != null ? r.body_weight : "-"}</td>
                  <td>{String(r.recorded_on || "").slice(0, 10) || "-"}</td>
                  <td>
                    <div style={styles.rowBtns}>
                      <button onClick={() => beginEdit(r)} style={styles.smallBtn}>Edit</button>
                      <button onClick={() => handleDelete(r)} style={styles.dangerBtn}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: 1200, margin: "0 auto", padding: 8 },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  headerRight: { display: "flex", alignItems: "center", gap: 8 },
  search: {
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    minWidth: 240,
  },
  filter: {
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
  },
  primaryBtn: {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },
  emptyCell: { textAlign: "center", padding: 16, color: "#6b7280" },
  rowBtns: { display: "flex", gap: 8, justifyContent: "flex-start" },
  smallBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    background: "#fff",
    cursor: "pointer",
  },
  dangerBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #ef4444",
    background: "#fff",
    color: "#b91c1c",
    cursor: "pointer",
  },
  error: {
    marginBottom: 8,
    padding: "8px 10px",
    borderRadius: 8,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#991b1b",
    fontSize: 14,
  },
  info: {
    marginBottom: 8,
    padding: "8px 10px",
    borderRadius: 8,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1e3a8a",
    fontSize: 14,
  },
};
