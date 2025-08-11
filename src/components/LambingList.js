import React, { useEffect, useMemo, useState } from "react";
import LambingForm from "./LambingForm";

/**
 * Endpoints:
 *  GET    /api/lambings
 *  POST   /api/lambings
 *  PUT    /api/lambings/:id
 *  DELETE /api/lambings/:id
 *
 * Row shape (locked):
 * { id, dam_branding_id, sire_branding_id, lambing_date, number_of_lambs, notes }
 */
export default function LambingList() {
  const base = process.env.REACT_APP_API_BASE_URL;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        String(r.dam_branding_id || "").toLowerCase().includes(s) ||
        String(r.sire_branding_id || "").toLowerCase().includes(s)
    );
  }, [q, rows]);

  const fetchAll = async () => {
    try {
      setErr("");
      setLoading(true);
      const res = await fetch(`${base}/api/lambings`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load lambings.");
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
      const res = await fetch(`${base}/api/lambings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || "Create failed");
      await fetchAll();
      setShowForm(false);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Could not create lambing.");
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing || editing.id == null) return;
    try {
      setErr("");
      const res = await fetch(`${base}/api/lambings/${editing.id}`, {
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
      setErr(e.message || "Could not update lambing.");
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete lambing for dam ${row.dam_branding_id}? This cannot be undone.`))
      return;
    try {
      setErr("");
      const res = await fetch(`${base}/api/lambings/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.text()) || "Delete failed");
      await fetchAll();
    } catch (e) {
      console.error(e);
      setErr(e.message || "Could not delete lambing.");
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <h2 style={{ margin: 0 }}>Lambings</h2>
        <div style={styles.headerRight}>
          <input
            type="text"
            placeholder="Search dam/sire branding ID"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={styles.search}
          />
          <button onClick={beginAdd} style={styles.primaryBtn}>Add Lambing</button>
        </div>
      </div>

      {err ? <div style={styles.error}>{err}</div> : null}
      {loading ? <div style={styles.info}>Loading…</div> : null}

      {showForm ? (
        <div style={{ margin: "12px 0" }}>
          <LambingForm
            initialData={editing || {}}
            onSubmit={editing ? handleUpdate : handleAdd}
            onCancel={cancelForm}
            buttonLabel={editing ? "Update Lambing" : "Save Lambing"}
          />
        </div>
      ) : null}

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Lambing Date</th>
              <th>Dam</th>
              <th>Sire</th>
              <th># Lambs</th>
              <th>Notes</th>
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
                <tr key={r.id ?? `${r.dam_branding_id}-${r.lambing_date}` ?? i}>
                  <td>{i + 1}</td>
                  <td>{String(r.lambing_date || "").slice(0, 10)}</td>
                  <td>{r.dam_branding_id}</td>
                  <td>{r.sire_branding_id || "-"}</td>
                  <td>{r.number_of_lambs ?? "-"}</td>
                  <td title={r.notes || ""} style={{ maxWidth: 240, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.notes || "-"}
                  </td>
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
  wrap: { maxWidth: 1000, margin: "0 auto", padding: 8 },
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
    minWidth: 260,
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
