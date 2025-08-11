import React, { useEffect, useMemo, useState } from "react";
import BrandingForm from "./BrandingForm";

/**
 * Endpoints assumed:
 *   GET    /api/branding
 *   POST   /api/branding
 *   PUT    /api/branding/:id
 *   DELETE /api/branding/:id
 *
 * Row fields (locked schema):
 * { id, tag_number, branding_id, branding_date, gender, breed_id, farm_id,
 *   dob, sire_branding_id, dam_branding_id, notes, current_status,
 *   breed_name?, farm_name? } // optional if your backend joins
 */
export default function BrandingList() {
  const base = process.env.REACT_APP_API_BASE_URL;

  const [rows, setRows] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [farms, setFarms] = useState([]);
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
        String(r.tag_number || "").toLowerCase().includes(s) ||
        String(r.branding_id || "").toLowerCase().includes(s)
    );
  }, [q, rows]);

  const fetchAll = async () => {
    try {
      setErr("");
      setLoading(true);
      const [br, bd, fm] = await Promise.all([
        fetch(`${base}/api/branding`),
        fetch(`${base}/api/breeds`),
        fetch(`${base}/api/farms`),
      ]);
      const [brData, bdData, fmData] = await Promise.all([
        br.json(),
        bd.json(),
        fm.json(),
      ]);
      setRows(Array.isArray(brData) ? brData : []);
      setBreeds(Array.isArray(bdData) ? bdData : []);
      setFarms(Array.isArray(fmData) ? fmData : []);
    } catch (e) {
      console.error(e);
      setErr("Failed to load branding records.");
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
      const res = await fetch(`${base}/api/branding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.text()) || "Create failed");
      await fetchAll();
      setShowForm(false);
    } catch (e) {
      console.error(e);
      setErr(e.message || "Could not create branding record.");
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing || editing.id == null) return;
    try {
      setErr("");
      const res = await fetch(`${base}/api/branding/${editing.id}`, {
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
      setErr(e.message || "Could not update branding record.");
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete ${row.tag_number || row.branding_id || row.id}? This cannot be undone.`))
      return;
    try {
      setErr("");
      const res = await fetch(`${base}/api/branding/${row.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.text()) || "Delete failed");
      await fetchAll();
    } catch (e) {
      console.error(e);
      setErr(e.message || "Could not delete branding record.");
    }
  };

  const breedName = (id) => breeds.find((b) => b.id === id)?.name || id || "-";
  const farmName = (id) => farms.find((f) => f.id === id)?.name || id || "-";

  return (
    <div style={styles.wrap}>
      <div style={styles.headerRow}>
        <h2 style={{ margin: 0 }}>Branding (Animal Master)</h2>
        <div style={styles.headerRight}>
          <input
            type="text"
            placeholder="Search tag/branding ID"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={styles.search}
          />
          <button onClick={beginAdd} style={styles.primaryBtn}>Add Branding</button>
        </div>
      </div>

      {err ? <div style={styles.error}>{err}</div> : null}
      {loading ? <div style={styles.info}>Loading…</div> : null}

      {showForm ? (
        <div style={{ margin: "12px 0" }}>
          <BrandingForm
            initialData={editing || {}}
            onSubmit={editing ? handleUpdate : handleAdd}
            onCancel={cancelForm}
            buttonLabel={editing ? "Update Branding" : "Save Branding"}
            breeds={breeds}
            farms={farms}
          />
        </div>
      ) : null}

      <div style={{ overflowX: "auto" }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Tag Number</th>
              <th>Branding ID</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Breed</th>
              <th>Farm</th>
              <th>Branding Date</th>
              <th>Sire</th>
              <th>Dam</th>
              <th>Status</th>
              <th>Notes</th>
              <th style={{ width: 140 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={13} style={styles.emptyCell}>
                  {q ? "No matches." : "No records yet."}
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={r.id ?? r.tag_number ?? i}>
                  <td>{i + 1}</td>
                  <td>{r.tag_number}</td>
                  <td>{r.branding_id || "-"}</td>
                  <td>{String(r.dob || "").slice(0, 10)}</td>
                  <td>{r.gender || "-"}</td>
                  <td>{r.breed_name || breedName(r.breed_id)}</td>
                  <td>{r.farm_name || farmName(r.farm_id)}</td>
                  <td>{String(r.branding_date || "").slice(0, 10) || "-"}</td>
                  <td>{r.sire_branding_id || "-"}</td>
                  <td>{r.dam_branding_id || "-"}</td>
                  <td>{r.current_status || "-"}</td>
                  <td title={r.notes || ""} style={{ maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {r.notes || "-"}
                  </td>
                  <td>
                    <div style={styles.rowBtns}>
                      <button onClick={() => beginEdit(r)} style={styles.smallBtn}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(r)} style={styles.dangerBtn}>
                        Delete
                      </button>
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
