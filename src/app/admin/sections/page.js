"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://rootex-backend.vercel.app/api/v1";

const SECTION_META = {
  product: { label: "Product Section",  icon: "📦", desc: "The main product display & buy section" },
  after:   { label: "Results (After)",  icon: "✨", desc: "Before & after results showcase" },
  review:  { label: "Reviews Section",  icon: "⭐", desc: "Customer reviews & testimonials" },
};

export default function SectionsOrderPage() {
  const [order, setOrder]     = useState({ product: 1, after: 2, review: 3 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);
  const [draggedKey, setDraggedKey] = useState(null);
  const [dragOverKey, setDragOverKey] = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    axios.get(`${API}/section-order`)
      .then(({ data }) => {
        if (data.success) setOrder(data.order);
      })
      .catch(() => showToast("Failed to load section order", false))
      .finally(() => setLoading(false));
  }, []);


  const sortedSections = Object.entries(order)
    .sort(([, a], [, b]) => a - b)
    .map(([key]) => key);

  // ── Drag & Drop ─────────────────────────────────────────
  const onDragStart = (key) => setDraggedKey(key);
  const onDragOver  = (e, key) => { e.preventDefault(); setDragOverKey(key); };
  const onDragEnd   = () => { setDraggedKey(null); setDragOverKey(null); };

  const onDrop = (targetKey) => {
    if (!draggedKey || draggedKey === targetKey) return;

    const draggedOrder = order[draggedKey];
    const targetOrder  = order[targetKey];

    setOrder((prev) => ({
      ...prev,
      [draggedKey]: targetOrder,
      [targetKey]:  draggedOrder,
    }));

    setDraggedKey(null);
    setDragOverKey(null);
  };

  // ── Move Up / Down ───────────────────────────────────────
  const move = (key, dir) => {
    const currentOrder = order[key];
    const targetOrder  = currentOrder + dir;
    if (targetOrder < 1 || targetOrder > 3) return;

    const swapKey = Object.keys(order).find((k) => order[k] === targetOrder);
    if (!swapKey) return;

    setOrder((prev) => ({
      ...prev,
      [key]:     targetOrder,
      [swapKey]: currentOrder,
    }));
  };

  // ── Save ─────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(`${API}/section-order`, { ...order });
      if (data.success) {
        setOrder(data.order);
        showToast("Section order saved!");
      }
    } catch (err) {
      console.log(error)
      showToast(err?.response?.data?.message || "Something went wrong", false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={s.page}>
        <div style={s.skelTitle} />
        {[1, 2, 3].map((i) => <div key={i} style={s.skelCard} />)}
      </div>
    );
  }

  return (
    <div style={s.page}>
   
      {toast && (
        <div style={{ ...s.toast, background: toast.ok ? "#166534" : "#b91c1c" }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}

   
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.title}>Section Order</h1>
          <p style={s.subtitle}>Drag to reorder — changes appear live on the homepage</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
        >
          {saving ? <><span style={s.spinner} /> Saving…</> : "💾 Save Order"}
        </button>
      </div>

  
      <div style={s.list}>
        {sortedSections.map((key) => {
          const meta = SECTION_META[key];
          const isDragging = draggedKey === key;
          const isOver     = dragOverKey === key;
          const pos        = order[key];

          return (
            <div
              key={key}
              draggable
              onDragStart={() => onDragStart(key)}
              onDragOver={(e) => onDragOver(e, key)}
              onDrop={() => onDrop(key)}
              onDragEnd={onDragEnd}
              style={{
                ...s.card,
                opacity: isDragging ? 0.4 : 1,
                border: isOver
                  ? "2px dashed #1a1f0e"
                  : "1px solid #e8e8e6",
                transform: isOver ? "scale(1.01)" : "scale(1)",
              }}
            >
              {/* Drag handle */}
              <div style={s.handle} title="Drag to reorder">
                <span style={s.dots}>⠿</span>
              </div>

              {/* Position badge */}
              <div style={s.badge}>{pos}</div>

              {/* Icon */}
              <div style={s.icon}>{meta.icon}</div>

              {/* Info */}
              <div style={s.info}>
                <span style={s.sectionLabel}>{meta.label}</span>
                <span style={s.sectionDesc}>{meta.desc}</span>
              </div>

              {/* Up / Down arrows */}
              <div style={s.arrows}>
                <button
                  onClick={() => move(key, -1)}
                  disabled={pos === 1}
                  style={{ ...s.arrowBtn, opacity: pos === 1 ? 0.3 : 1 }}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(key, 1)}
                  disabled={pos === 3}
                  style={{ ...s.arrowBtn, opacity: pos === 3 ? 0.3 : 1 }}
                  title="Move down"
                >
                  ↓
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview hint */}
      <div style={s.hint }>
        <span style={{ fontSize: 16 }}>💡</span>
        <span
          style={{cursor:"default"}}
        >
          Order preview:{" "}
          <strong>Hero</strong>
          {sortedSections.map((k) => (
            <span key={k}> → <strong>{SECTION_META[k].label}</strong></span>
          ))}
        </span>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  page: {
    display: "flex", flexDirection: "column", gap: 20,
    fontFamily: "'DM Sans', sans-serif",
    maxWidth: "100%", position: "relative",
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
  list: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    background: "white", borderRadius: 14,
    padding: "18px 20px",
    display: "flex", alignItems: "center", gap: 16,
    cursor: "grab", transition: "transform 0.15s, border 0.15s, box-shadow 0.15s",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    userSelect: "none",
  },
  handle: {
    color: "#ccc", fontSize: 20, flexShrink: 0,
    cursor: "grab", lineHeight: 1,
  },
  dots: { fontSize: 20, letterSpacing: -2 },
  badge: {
    width: 32, height: 32, borderRadius: "50%",
    background: "#1a1f0e", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  icon:  { fontSize: 28, flexShrink: 0 },
  info:  { display: "flex", flexDirection: "column", gap: 2, flex: 1 },
  sectionLabel: { fontSize: 15, fontWeight: 600, color: "#111" },
  sectionDesc:  { fontSize: 12, color: "#aaa" },
  arrows: { display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 },
  arrowBtn: {
    width: 30, height: 30, borderRadius: 8,
    background: "rgb(17 22 18)", border: "1px solid #e0e0de",
    fontSize: 14, cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center",
    transition: "background 0.15s",
  },
  hint: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "14px 18px", borderRadius: 12,
    background: "#fafaf9", border: "1px solid #e8e8e6",
    fontSize: 13, color: "#555", 
   
  },
  skelTitle: { height: 32, width: 220, background: "#f0f0ef", borderRadius: 8 },
  skelCard:  { height: 80, background: "#f0f0ef", borderRadius: 14 },
};