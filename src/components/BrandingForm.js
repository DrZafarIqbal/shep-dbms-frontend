import React, { useEffect, useMemo, useState } from "react";

/**
 * BrandingForm — matches locked schema exactly.
 * Required by schema: tag_number (NOT NULL, UNIQUE), dob (NOT NULL)
 * Optional: branding_id (UNIQUE), branding_date, gender ('Male'|'Female'),
 *           breed_id (FK), farm_id (FK), sire_branding_id, dam_branding_id,
 *           notes, current_status (VARCHAR(30))
 *
 * Props:
 * - initialData?: existing row for edit
 * - onSubmit(payload)
 * - onCancel?()
 * - buttonLabel?: string
 * - breeds?: [{id, name}] (optional prefetch)
 * - farms?:  [{id, name}] (optional prefetch)
 */
const empty = {
  tag_number: "",
  branding_id: "",
  branding_date: "",
  gender: "",
  breed_id: "",
  farm_id: "",
  dob: "",
  sire_branding_id: "",
  dam_branding_id: "",
  notes: "",
  current_status: "",
};

export default function BrandingForm({
  initialData = {},
  onSubmit,
  onCancel,
  buttonLabel = "Save Branding",
  breeds: breedsProp = [],
  farms: farmsProp = [],
}) {
  const [form, setForm] = useState(empty);
  const [breeds, setBreeds] = useState(breedsProp);
  const [farms, setFarms] = useState(farmsProp);
  const [loadingOpts, setLoadingOpts] = useState(false);
  const [err, setErr] = useState("");

  const isEdit = useMemo(
    () => Boolean(initialData && Object.keys(initialData).length),
    [initialData]
  );

  useEffect(() => {
    if (isEdit) {
      setForm({
        tag_number: initialData.tag_number ?? "",
        branding_id: initialData.branding_id ?? "",
        branding_date: initialData.branding_date
          ? String(initialData.branding_date).slice(0, 10)
          : "",
        gender: initialData.gender ?? "",
        breed_id: initialData.breed_id?.toString?.() ?? "",
        farm_id: initialData.farm_id?.toString?.() ?? "",
        dob: initialData.dob ? String(initialData.dob).slice(0, 10) : "",
        sire_branding_id: initialData.sire_branding_id ?? "",
        dam_branding_id: initialData.dam_branding_id ?? "",
        notes: initialData.notes ?? "",
        current_status: initialData.current_status ?? "",
      });
    } else {
      setForm(empty);
    }
  }, [isEdit, initialData]);

  // Fetch dropdowns only if not provided
  useEffect(() => {
    const needBreeds = !breedsProp?.length;
    const needFarms = !farmsProp?.length;
    if (!needBreeds && !needFarms) return;

    const base = process.env.REACT_APP_API_BASE_URL;
    const run = async () => {
      try {
        setLoadingOpts(true);
        const [bRes, fRes] = await Promise.all([
          needBreeds ? fetch(`${base}/api/breeds`) : Promise.resolve(null),
          needFarms ? fetch(`${base}/api/farms`) : Promise.resolve(null),
        ]);
        if (bRes) setBreeds(Array.isArray(await bRes.json()) ? await bRes.json() : []);
        if (fRes) setFarms(Array.isArray(await fRes.json()) ? await fRes.json() : []);
      } catch (e) {
        console.error(e);
        setErr("Failed to load Breeds/Farms options.");
      } finally {
        setLoadingOpts(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    // Strict to schema: only tag_number and dob are required.
    const required = ["tag_number", "dob"];
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
      tag_number: form.tag_number.trim(),
      branding_id: toNull(form.branding_id),
      branding_date: toNull(form.branding_date),
      gender: toNull(form.gender), // backend CHECK allows only 'Male'/'Female' when not null
      breed_id: toIntOrNull(form.breed_id),
      farm_id: toIntOrNull(form.farm_id),
      dob: form.dob, // yyyy-mm-dd required
      sire_branding_id: toNull(form.sire_branding_id),
      dam_branding_id: toNull(form.dam_branding_id),
      notes: toNull(form.notes),
      current_status: toNull(form.current_status),
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
      <h2 style={styles.h2}>{isEdit ? "Update Branding" : "Add Branding"}</h2>
      {err ? <div style={styles.error}>{err}</div> : null}

      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>Tag Number *</label>
          <input
            type="text"
            value={form.tag_number}
            onChange={(e) => update("tag_number", e.target.value)}
            placeholder="e.g., TAG-2025-0001"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Branding ID (tattoo)</label>
          <input
            type="text"
            value={form.branding_id}
            onChange={(e) => update("branding_id", e.target.value)}
            placeholder="e.g., LRN-24-001 (optional until branded)"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Branding Date</label>
          <input
            type="date"
            value={form.branding_date}
            onChange={(e) => update("branding_date", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Gender</label>
          <select
            value={form.gender}
            onChange={(e) => update("gender", e.target.value)}
            style={styles.input}
          >
            <option value="">(not set)</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Breed</label>
          <select
            value={form.breed_id}
            onChange={(e) => update("breed_id", e.target.value)}
            style={styles.input}
            disabled={loadingOpts && !breeds.length}
          >
            <option value="">-- Select Breed (optional) --</option>
            {breeds.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Farm</label>
          <select
            value={form.farm_id}
            onChange={(e) => update("farm_id", e.target.value)}
            style={styles.input}
            disabled={loadingOpts && !farms.length}
          >
            <option value="">-- Select Farm (optional) --</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Date of Birth *</label>
          <input
            type="date"
            value={form.dob}
            onChange={(e) => update("dob", e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Sire Branding ID</label>
          <input
            type="text"
            value={form.sire_branding_id}
            onChange={(e) => update("sire_branding_id", e.target.value)}
            placeholder="e.g., SIRE-23-145"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Dam Branding ID</label>
          <input
            type="text"
            value={form.dam_branding_id}
            onChange={(e) => update("dam_branding_id", e.target.value)}
            placeholder="e.g., DAM-20-078"
            style={styles.input}
          />
        </div>

        <div style={styles.fieldFull}>
          <label style={styles.label}>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            placeholder="Any remarks…"
            rows={3}
            style={{ ...styles.input, resize: "vertical" }}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Current Status</label>
          <input
            type="text"
            value={form.current_status}
            onChange={(e) => update("current_status", e.target.value)}
            placeholder="Alive / Dead / Transferred / Sold"
            style={styles.input}
            maxLength={30}
          />
        </div>
      </div>

      <div style={styles.row}>
        <button type="submit" style={styles.primaryBtn}>
          {buttonLabel}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} style={styles.secondaryBtn}>
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

const styles = {
  card: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 16,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    background: "#fff",
  },
  h2: { margin: "0 0 12px 0" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
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
