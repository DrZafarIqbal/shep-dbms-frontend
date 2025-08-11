import React, { useEffect, useMemo, useState } from "react";

/**
 * Locked schema (Growth):
 *  id SERIAL PK
 *  tag_number VARCHAR(50)         -- for lambs (FK Branding.tag_number)
 *  branding_id VARCHAR(50)        -- for adults (FK Branding.branding_id)
 *  age_days INTEGER NOT NULL
 *  body_weight NUMERIC(5,2)       -- optional
 *  recorded_on DATE DEFAULT CURRENT_DATE  -- optional
 *  CHECK exactly-one-of (tag_number, branding_id)
 */
const empty = {
  tag_number: "",
  branding_id: "",
  age_days: "",
  body_weight: "",
  recorded_on: "",
};

export default function GrowthForm({
  initialData = {},
  onSubmit,
  onCancel,
  buttonLabel = "Save Growth",
}) {
  const base = process.env.REACT_APP_API_BASE_URL;

  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");
  const [animals, setAnimals] = useState([]);
  const [loadingOpts, setLoadingOpts] = useState(false);

  const isEdit = useMemo(() => !!initialData && Object.keys(initialData).length > 0, [initialData]);

  useEffect(() => {
    if (isEdit) {
      setForm({
        tag_number: initialData.tag_number ?? "",
        branding_id: initialData.branding_id ?? "",
        age_days: initialData.age_days != null ? String(initialData.age_days) : "",
        body_weight: initialData.body_weight != null ? String(initialData.body_weight) : "",
        recorded_on: initialData.recorded_on ? String(initialData.recorded_on).slice(0, 10) : "",
      });
    } else {
      setForm(empty);
    }
  }, [isEdit, initialData]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoadingOpts(true);
        const res = await fetch(`${base}/api/branding`);
        const data = await res.json();
        setAnimals(Array.isArray(data) ? data : []);
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

  const tagOptions = useMemo(
    () =>
      animals
        .filter((a) => a.tag_number && String(a.tag_number).trim() !== "")
        .map((a) => ({ value: a.tag_number, label: `${a.tag_number} — ${a.branding_id || "unbranded"}` })),
    [animals]
  );

  const brandOptions = useMemo(
    () =>
      animals
        .filter((a) => a.branding_id && String(a.branding_id).trim() !== "")
        .map((a) => ({ value: a.branding_id, label: `${a.branding_id} — ${a.tag_number}` })),
    [animals]
  );

  const update = (k, v) => {
    // enforce "exactly one of tag or brand" UX: clearing the other when one is set
    if (k === "tag_number" && v) {
      setForm((s) => ({ ...s, tag_number: v, branding_id: "" }));
    } else if (k === "branding_id" && v) {
      setForm((s) => ({ ...s, branding_id: v, tag_number: "" }));
    } else {
      setForm((s) => ({ ...s, [k]: v }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErr("");

    const tag = String(form.tag_number || "").trim();
    const brand = String(form.branding_id || "").trim();

    // Validate exactly-one-of
    if ((tag && brand) || (!tag && !brand)) {
      setErr("Choose exactly one: either Tag Number (lamb) or Branding ID (adult).");
      return;
    }

    // age_days required and integer >= 0
    if (String(form.age_days || "").trim() === "") {
      setErr("Please fill: age_days");
      return;
    }
    const ageInt = Number(form.age_days);
    if (!Number.isInteger(ageInt) || ageInt < 0) {
      setErr("age_days must be a non-negative integer.");
      return;
    }

    const toNull = (v) => (String(v ?? "").trim() === "" ? null : v);
    const toFloatOrNull = (v) => {
      const s = String(v ?? "").trim();
      return s === "" ? null : parseFloat(s);
    };

    const payload = {
      tag_number: tag || null,
      branding_id: brand || null,
      age_days: ageInt,
      body_weight: toFloatOrNull(form.body_weight),
      recorded_on: toNull(form.recorded_on), // let backend default if null
    };

    try {
      onSubmit && onSubmit(payload);
    } catch (e2) {
      console.error(e2);
      setErr("Could not submit the form. Check console for details.");
    }
  };

  const tagDisabled = Boolean(form.branding_id);
  const brandDisabled = Boolean(form.tag_number);

  return (
    <form onSubmit={handleSubmit} style={styles.card}>
      <h2 style={styles.h2}>{isEdit ? "Update Growth" : "Add Growth"}</h2>
      {err ? <div style={styles.error}>{err}</div> : null}

      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>Tag Number (lamb)</label>
          <input
            type="text"
            value={form.tag_number}
            onChange={(e) => update("tag_number", e.target.value)}
            list="tagList"
            placeholder="Select or type a tag"
            style={styles.input}
            disabled={tagDisabled}
          />
          <datalist id="tagList">
            {tagOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </datalist>
          <small style={styles.help}>Pick <b>Tag</b> for lambs (leave Branding empty).</small>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Branding ID (adult)</label>
          <input
            type="text"
            value={form.branding_id}
            onChange={(e) => update("branding_id", e.target.value)}
            list="brandList"
            placeholder="Select or type a branding ID"
            style={styles.input}
            disabled={brandDisabled}
          />
          <datalist id="brandList">
            {brandOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </datalist>
          <small style={styles.help}>Pick <b>Brand</b> for adults (leave Tag empty).</small>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Age (days) *</label>
          <input
            type="number"
            min="0"
            value={form.age_days}
            onChange={(e) => update("age_days", e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Body Weight (kg)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.body_weight}
            onChange={(e) => update("body_weight", e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Recorded On</label>
          <input
            type="date"
            value={form.recorded_on}
            onChange={(e) => update("recorded_on", e.target.value)}
            style={styles.input}
          />
          <small style={styles.help}>Leave empty to use today's date (DB default).</small>
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
    maxWidth: 900,
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
  label: { marginBottom: 4, fontSize: 14, color: "#374151" },
  help: { fontSize: 12, color: "#6b7280", marginTop: 4 },
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
