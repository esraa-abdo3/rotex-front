"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const API = "https://rootex-backend.vercel.app/api/v1";

const TEXT_FIELDS = [
  { key: "text1",      label: "Text 1",       desc: "First line of the hero hook" },
  { key: "text2",      label: "Text 2",       desc: "Second line of the hero hook" },
  { key: "highlight1", label: "Highlight 1",  desc: "First highlighted word" },
  { key: "highlight2", label: "Highlight 2",  desc: "Second highlighted word" },
  { key: "buttonText", label: "Button Text",  desc: "CTA button label" },
];

const COLOR_FIELDS = [
  { key: "primaryDark",   label: "Primary Dark",    desc: "Main dark background color" },
  { key: "secondaryDark", label: "Secondary Dark",  desc: "Secondary dark tone" },
  { key: "primary",       label: "Primary",         desc: "Main brand color" },
  { key: "gold",          label: "Gold",            desc: "Accent gold color" },
  { key: "goldLight",     label: "Gold Light",      desc: "Light gold / highlight" },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);

  const [heroPreview,   setHeroPreview]   = useState("");
  const [resultPreview, setResultPreview] = useState("");
  const [heroFile,      setHeroFile]      = useState(null);
  const [resultFile,    setResultFile]    = useState(null);

  const heroRef   = useRef();
  const resultRef = useRef();

  const [form, setForm] = useState({
    text1_ar: "", text1_en: "",
    text2_ar: "", text2_en: "",
    highlight1_ar: "", highlight1_en: "",
    highlight2_ar: "", highlight2_en: "",
    buttonText_ar: "", buttonText_en: "",
    primaryDark: "#000000", secondaryDark: "#000000",
    primary: "#000000", gold: "#000000", goldLight: "#000000",
  });

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    axios.get(`${API}/setting`)
      .then(({ data }) => {
        const s = data.settings;
        setForm({
          text1_ar:      s?.hook?.text1?.ar      || "",
          text1_en:      s?.hook?.text1?.en      || "",
          text2_ar:      s?.hook?.text2?.ar      || "",
          text2_en:      s?.hook?.text2?.en      || "",
          highlight1_ar: s?.hook?.highlight1?.ar || "",
          highlight1_en: s?.hook?.highlight1?.en || "",
          highlight2_ar: s?.hook?.highlight2?.ar || "",
          highlight2_en: s?.hook?.highlight2?.en || "",
          buttonText_ar: s?.buttonText?.ar       || "",
          buttonText_en: s?.buttonText?.en       || "",
          primaryDark:   s?.colors?.primaryDark   || "#000000",
          secondaryDark: s?.colors?.secondaryDark || "#000000",
          primary:       s?.colors?.primary       || "#000000",
          gold:          s?.colors?.gold          || "#000000",
          goldLight:     s?.colors?.goldLight     || "#000000",
        });
        setHeroPreview(s?.images?.herosection || "");
        setResultPreview(s?.images?.resultBg  || "");
      })
      .catch(() => showToast("Failed to load settings", false))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
      if (heroFile)   fd.append("herosection", heroFile);
      if (resultFile) fd.append("resultBg",    resultFile);

      const { data } = await axios.patch(`${API}/setting`, fd);
      setHeroPreview(data.settings?.images?.herosection || heroPreview);
      setResultPreview(data.settings?.images?.resultBg  || resultPreview);
      setHeroFile(null);
      setResultFile(null);
      showToast("Settings saved successfully");
    } catch (err) {
      showToast(err?.response?.data?.message || "Something went wrong", false);
    } finally {
      setSaving(false);
    }
  };

  // ── Skeleton ──────────────────────────────────────────────
  if (loading) {
    return (
      <div style={s.page}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
          <div style={{ ...s.skel, height: 32, width: 220 }} />
          <div style={{ ...s.skel, height: 16, width: 300 }} />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ ...s.card, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ ...s.skel, height: 20, width: 120 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} style={{ ...s.skel, height: 42, borderRadius: 10 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Page ──────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* Toast */}
      {toast && (
        <div style={{ ...s.toast, background: toast.ok ? "#166534" : "#b91c1c" }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.title}>Website Settings</h1>
          <p style={s.subtitle}>Manage hero texts, brand colors, and images</p>
        </div>
        <button
          form="settings-form"
          type="submit"
          disabled={saving}
          style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving
            ? <><span style={s.spinner} /> Saving…</>
            : "💾 Save Settings"}
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── HERO TEXTS ──────────────────── */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardIcon}>✍️</span>
            <div>
              <h2 style={s.cardTitle}>Hero Texts</h2>
              <p style={s.cardDesc}>Edit the main headline and CTA copy shown on the homepage</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {TEXT_FIELDS.map((field) => (
              <div key={field.key} style={s.fieldBlock}>
                <div style={s.fieldMeta}>
                  <span style={s.fieldLabel}>{field.label}</span>
                  <span style={s.fieldDesc}>{field.desc}</span>
                </div>
                <div style={s.fieldInputs}>
                  <div style={s.inputGroup}>
                    <label style={s.inputLabel}>English</label>
                    <input
                      type="text"
                      name={`${field.key}_en`}
                      value={form[`${field.key}_en`]}
                      onChange={handleChange}
                      placeholder={`${field.label} in English`}
                      style={s.input}
                    />
                  </div>
                  <div style={s.inputGroup}>
                    <label style={{ ...s.inputLabel, textAlign: "right" }}>عربي</label>
                    <input
                      type="text"
                      name={`${field.key}_ar`}
                      value={form[`${field.key}_ar`]}
                      onChange={handleChange}
                      placeholder={`${field.label} بالعربي`}
                      dir="rtl"
                      style={s.input}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COLORS ──────────────────────── */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardIcon}>🎨</span>
            <div>
              <h2 style={s.cardTitle}>Brand Colors</h2>
              <p style={s.cardDesc}>Pick the color palette used across the whole website</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {COLOR_FIELDS.map((c) => (
              <div key={c.key} style={s.colorBlock}>
                <label style={s.inputLabel}>{c.label}</label>
                <p style={{ ...s.fieldDesc, margin: "2px 0 10px" }}>{c.desc}</p>
                <div style={s.colorRow}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ ...s.colorSwatch, background: form[c.key] }} />
                    <input
                      type="color"
                      name={c.key}
                      value={form[c.key]}
                      onChange={handleChange}
                      style={s.colorInput}
                      title="Pick color"
                    />
                  </div>
                  <input
                    type="text"
                    name={c.key}
                    value={form[c.key]}
                    onChange={handleChange}
                    placeholder="#000000"
                    style={{ ...s.input, flex: 1, fontFamily: "monospace", fontSize: 13 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── IMAGES ──────────────────────── */}
        <div style={s.card}>
          <div style={s.cardHeader}>
            <span style={s.cardIcon}>🖼️</span>
            <div>
              <h2 style={s.cardTitle}>Images</h2>
              <p style={s.cardDesc}>Upload images used in the hero section and results background</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {/* Hero Image */}
            <ImageUpload
              label="Hero Section"
              desc="Main background or product image on the homepage"
              preview={heroPreview}
              fileRef={heroRef}
              onChange={(file) => {
                setHeroFile(file);
                setHeroPreview(URL.createObjectURL(file));
              }}
              onClear={() => { setHeroFile(null); setHeroPreview(""); }}
              newFile={heroFile}
            />

            {/* Result Image */}
            <ImageUpload
              label="Result Background"
              desc="Background image for the results / review section"
              preview={resultPreview}
              fileRef={resultRef}
              onChange={(file) => {
                setResultFile(file);
                setResultPreview(URL.createObjectURL(file));
              }}
              onClear={() => { setResultFile(null); setResultPreview(""); }}
              newFile={resultFile}
            />
          </div>
        </div>

        {/* Mobile Save button (bottom) */}
        <button
          type="submit"
          disabled={saving}
          style={{
            ...s.saveBtn,
            width: "100%",
            justifyContent: "center",
            opacity: saving ? 0.6 : 1,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving
            ? <><span style={s.spinner} /> Saving…</>
            : "💾 Save Settings"}
        </button>

      </form>
    </div>
  );
}

// ── Image Upload Sub-Component ──────────────────────────────
function ImageUpload({ label, desc, preview, fileRef, onChange, onClear, newFile }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <p style={s.inputLabel}>{label}</p>
        <p style={{ ...s.fieldDesc, marginTop: 2 }}>{desc}</p>
      </div>

      {preview ? (
        <div style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={label}
            style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, border: "1px solid #e8e8e6", display: "block" }}
          />
          {newFile && (
            <div style={s.newBadge}>New</div>
          )}
        </div>
      ) : (
        <div style={s.imagePlaceholder}>
          <span style={{ fontSize: 32 }}>🖼️</span>
          <p style={{ margin: "8px 0 0", fontSize: 13, color: "#aaa" }}>No image uploaded</p>
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          style={s.uploadBtn}
        >
          {preview ? "Replace Image" : "Upload Image"}
        </button>
        {preview && (
          <button type="button" onClick={onClear} style={s.clearBtn}>
            Clear
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) onChange(file);
            e.target.value = "";
          }}
        />
      </div>

      {newFile && (
        <p style={{ fontSize: 12, color: "#b45309", background: "#fffbeb", padding: "6px 10px", borderRadius: 8, margin: 0 }}>
          ⚠️ New file selected: <strong>{newFile.name}</strong> — will upload on save
        </p>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  page: {
    display: "flex", flexDirection: "column", gap: 24,
    fontFamily: "'DM Sans', sans-serif", position: "relative",
    maxWidth: "100%",
  },
  toast: {
    position: "fixed", top: 20, right: 24, color: "white",
    padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500,
    zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    display: "flex", alignItems: "center", gap: 8,
  },
  pageHeader: {
    display: "flex", alignItems: "flex-start",
    justifyContent: "space-between", flexWrap: "wrap", gap: 16,
  },
  title:    { fontSize: 26, fontWeight: 700, color: "#111", margin: 0 },
  subtitle: { color: "#888", fontSize: 14, margin: "4px 0 0" },
  saveBtn: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "11px 22px", background: "#1a1f0e", color: "white",
    border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
    transition: "opacity 0.2s", whiteSpace: "nowrap",
  },
  spinner: {
    display: "inline-block", width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
  card: {
    background: "white", borderRadius: 14,
    border: "1px solid #e8e8e6", padding: "22px 24px",
    display: "flex", flexDirection: "column", gap: 20,
  },
  cardHeader: { display: "flex", alignItems: "flex-start", gap: 14 },
  cardIcon:   { fontSize: 22, marginTop: 1, flexShrink: 0 },
  cardTitle:  { fontSize: 16, fontWeight: 600, color: "#111", margin: 0 },
  cardDesc:   { fontSize: 13, color: "#999", margin: "3px 0 0" },

  fieldBlock: {
    display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap",
    paddingBottom: 16, borderBottom: "1px solid #f5f5f3",
  },
  fieldMeta:   { width: 160, flexShrink: 0 },
  fieldLabel:  { fontSize: 14, fontWeight: 600, color: "#333", display: "block" },
  fieldDesc:   { fontSize: 12, color: "#aaa", marginTop: 3, display: "block" },
  fieldInputs: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, minWidth: 260 },

  inputGroup: { display: "flex", flexDirection: "column", gap: 5 },
  inputLabel: { fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.4px" },
  input: {
    padding: "10px 12px", borderRadius: 10,
    border: "1px solid #e0e0de", fontSize: 14, outline: "none",
    background: "#fafaf9", fontFamily: "inherit", width: "100%",
    boxSizing: "border-box", transition: "border-color 0.2s",
    color:"black"
  },

  colorBlock: { display: "flex", flexDirection: "column" },
  colorRow:   { display: "flex", alignItems: "center", gap: 10 },
  colorSwatch: {
    width: 42, height: 42, borderRadius: 10,
    border: "1px solid #e0e0de", cursor: "pointer",
    transition: "transform 0.15s",
  },
  colorInput: {

    position: "absolute", inset: 0, opacity: 0,
    width: "100%", height: "100%", cursor: "pointer", border: "none",
  },

  imagePlaceholder: {
    width: "100%", height: 180, background: "#fafaf9",
    borderRadius: 12, border: "2px dashed #e0e0de",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
  },
  newBadge: {
    position: "absolute", top: 8, right: 8,
    background: "#1a1f0e", color: "white",
    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
  },
  uploadBtn: {
    flex: 1, padding: "9px 14px", background: "#f5f5f3",
    border: "1px solid #e0e0de", borderRadius: 9,
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    color: "#333", transition: "background 0.2s",
  },
  clearBtn: {
    padding: "9px 14px", background: "#fef2f2",
    border: "none", borderRadius: 9,
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    color: "#b91c1c",
  },

  skel: { background: "#f0f0ef", borderRadius: 8, display: "block" },
};
