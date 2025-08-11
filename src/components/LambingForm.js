import React, { useEffect, useMemo, useState } from "react";

/**
 * Matches locked schema exactly:
 *  dam_branding_id (required, FK -> Branding.branding_id)
 *  sire_branding_id (optional, FK -> Branding.branding_id)
 *  lambing_date (required, DATE)
 *  number_of_lambs (optional, INTEGER)
 *  notes (optional, TEXT)
 */
const empty = {
  dam_branding_id: "",
  sire_branding_id: "",
  lambing_date: "",
  number_of_lambs: "",
  notes: "",
};

export default function LambingForm({
  initialData = {},
  onSubmit,
  onCancel,
  buttonLabel = "Save Lambing",
}) {
  const base = process.env.REACT_APP_API_BASE_URL;

  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");

  const [branding, setBranding] = useState([]);
  const [loadingOpts, setLoadingOpts] = useState(false);

  const isEdit = useMemo(
    () => Boolean(initialData && Object.keys(initialData).length),
    [initialData]
  );

  useEffect(() => {
    if (isEdit) {
      setForm({
        dam_branding_id: initialData.dam_branding_id ?? "",
        sire_branding_id: initialData.sire_branding_id ?? "",
        lambing_date: initialData.lambing_date
          ? String(initialData.lambing_date).slice(0, 10)
          : "",
        number_of_lambs:
          initialData.number_of_lambs != null
            ? String(initialData.number_of_lambs)
            : "",
        notes: initialData.notes ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [isEdit, initialData]);

  // fetch Branding list once (to populate dams/sires)
  useEffect(() => {
    const run = async () => {
      try {
        setLoadingOpts(true);
        const res = await fetch(`${base}/api/branding`);
        const data = await res.json();
        setBranding(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr("Failed to load animal options.");
      } finally {
        setLoadingOpts(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Only allow animals that actually have a non-null branding_id,
  // because FK references Branding(branding_id).
  const branded = useMemo(
    () => branding.filter((r) => r.branding_id && String(r.branding_id).trim() !== ""),
    [branding]
  );
  const dams = useMemo(
    () => branded.filter((r) => (r.gender || "").toLowerCase() === "female"),
    [branded]
  );
  const sires = useMemo(
    () => branded.filter((r) => (r.gender || "").toLowerCase() === "male"),
    [branded]
  );

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    // Required: dam_branding_id, lambing_date
    const required = ["dam_branding_id", "lambing_date"];
    const missing = required.filter((k) => !String(form[k] || "").trim());
    if (missing.length) {
      setErr(`Please fill: ${missing.join(", ")}`);
      return;
    }

    const toNull = (v) => (String(v || "").trim() === "" ? null : v);
    const toIntOrNull = (v) => {
      const s = String(v || "").trim();
      return s === "" ? null : Number(s);
    };

    const payload = {
      dam_branding_id: form.dam_branding_id.trim(),
      sire_branding_id: toNull(form.sire_branding_id),
      lambing_date: form.lambing_date, // yyyy-mm-dd
      number_of_lambs: toIntOrNull(form.number_of_lambs),
      notes: toNull(form.notes),
    };

    try {
      onSubmit && onSubmit(payload);
    } catch (e2) {
      console.error(e2);
      setErr("Could not submit the form. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <h2 style={styles.h2}>{isEdit ? "Update Lambing" : "Add Lambing"}</h2>
      {err ? <div style={styles.error}>{err}</div> : null}

      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>Dam Branding ID *</label>
          <select
            value={form.dam_branding_id}
            onChange={(e) => update("dam_branding_id", e.target.value)}
            style={styles.input}
            required
            disabled={loadingOpts}
          >
            <option value="">-- Select Dam --</option>
            {dams.map((d) => (
              <option key={d.branding_id} value={d.branding_id}>
                {d.branding_id} — {d.tag_number}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Sire Branding ID</label>
          <select
            value={form.sire_branding_id}
            onChange={(e) => update("sire_branding_id", e.target.value)}
            style={styles.input}
            disabled={loadingOpts}
          >
            <option value="">(optional)</option>
            {sires.map((s) => (
              <option key={s.branding_id} value={s.branding_id}>
                {s.branding_id} — {s.tag_number}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Lambing Date *</label>
          <input
            type="date"
            value={form.lambing_date}
            onChange={(e) => update("lambing_date", e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Number of Lambs</label>
          <input
            type="number"
            min="0"
            value={form.number_of_lambs}
            onChange={(e) => update("number_of_lambs", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            style={{ ...styles.input, resize: "vertical" }}
            rows={3}
            placeholder="Any remarks…"
          />
        </div>
      </div>

      <div style={styles.row}>
        <button type="submit" style={styles.primaryBtn}>{buttonLabel}</button>
        {onCancel ? (
          <button type="button" onClick={onCancel} style={styles.secondaryBtn}>Cancel</button>
        ) : null}
      </div>
    </form>
  );
}

const styles = {
  card: {
    maxWidth: 800,
    margin: "0 auto",
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    background: "#fff",
  },
  h2: { margin: "0 0 12px 0" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: { display: "flex", flexDirection: "column" },
  fieldFull: { gridColumn: "1 / -1", display: "flex", flexDirection: "column" },
  label: { marginBottom: 4, fontSize: 14, color: "#374151" },
  input: {
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    fontSize: 14,
  },
  row: { marginTop: 12, display: "flex", gap: 8 },
  primaryBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#111827",
    color: "white",
    fontWeight: 600,
  },
  secondaryBtn: {
    padding: "8px 14px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    cursor: "pointer",
    background: "white",
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
};
