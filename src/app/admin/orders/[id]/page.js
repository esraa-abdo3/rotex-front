"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const API = "https://rootex-backend.vercel.app/api/v1";

const STATUSES = ["pending", "processing", "shipped", "canceled", "delivered"];

const STATUS_META = {
  pending:    { color: "#c2410c", bg: "#fff7ed", dot: "#fb923c" },
  processing: { color: "#1d4ed8", bg: "#eff6ff", dot: "#60a5fa" },
  shipped:    { color: "#7c3aed", bg: "#f5f3ff", dot: "#a78bfa" },
  delivered:  { color: "#166534", bg: "#f0fdf4", dot: "#4ade80" },
  canceled:   { color: "#b91c1c", bg: "#fef2f2", dot: "#f87171" },
};

const STEPS = ["pending", "processing", "shipped",  "canceled","delivered" ];

export default function OrderDetailPage() {
  const { id }   = useParams();
  

  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState("");
  const [toast,   setToast]   = useState(null);

  useEffect(() => {
    fetch(`${API}/order/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setOrder(d.data);
        setStatus(d.data?.orderStatus || "pending");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateStatus = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/order/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      setOrder(data.data);
      showToast("Order status updated successfully");
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setSaving(false);
    }
  };

if (loading) {
  return (
    <div style={styles.page}>

      {/* Header */}
      <div>
        <div style={{ ...styles.skel, width: 120, height: 14, marginBottom: 18 }} />

        <div style={styles.pageHeader}>
          <div>
            <div style={{ ...styles.skel, width: 260, height: 30, marginBottom: 10 }} />
            <div style={{ ...styles.skel, width: 180, height: 14 }} />
          </div>

          <div style={{ ...styles.skel, width: 110, height: 36, borderRadius: 999 }} />
        </div>
      </div>

      {/* Progress */}
      <div style={styles.progressCard}>
        <div style={{ ...styles.skel, width: 120, height: 14, marginBottom: 24 }} />

        <div style={{ display: "flex", gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    ...styles.skel,
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />

                {i !== 4 && (
                  <div
                    style={{
                      ...styles.skel,
                      height: 2,
                      flex: 1,
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  ...styles.skel,
                  width: 60,
                  height: 12,
                  marginTop: 10,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={styles.grid}>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[1, 2].map((card) => (
            <div key={card} style={styles.card}>
              <div style={{ ...styles.skel, width: 150, height: 18, marginBottom: 22 }} />

              <div style={styles.infoGrid}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <div style={{ ...styles.skel, width: 70, height: 10, marginBottom: 8 }} />
                    <div style={{ ...styles.skel, width: "80%", height: 16 }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Items */}
          <div style={styles.card}>
            <div style={{ ...styles.skel, width: 140, height: 18, marginBottom: 20 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={styles.itemRow}>
                  <div
                    style={{
                      ...styles.skel,
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ ...styles.skel, width: "60%", height: 12, marginBottom: 8 }} />
                    <div style={{ ...styles.skel, width: "40%", height: 10 }} />
                  </div>

                  <div style={{ ...styles.skel, width: 70, height: 16 }} />
                </div>
              ))}

              <div style={styles.totalRow}>
                <div style={{ ...styles.skel, width: 70, height: 14 }} />
                <div style={{ ...styles.skel, width: 90, height: 18 }} />
              </div>
            </div>
          </div>

          {/* Status */}
          <div style={styles.card}>
            <div style={{ ...styles.skel, width: 140, height: 18, marginBottom: 20 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.skel,
                    width: "100%",
                    height: 46,
                    borderRadius: 10,
                  }}
                />
              ))}
            </div>

            <div
              style={{
                ...styles.skel,
                width: "100%",
                height: 44,
                borderRadius: 10,
                marginTop: 18,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

  if (!order) {
    return (
      <div style={styles.loadingWrap}>
        <div style={{ fontSize: 40 }}>🚫</div>
        <p style={{ color: "#aaa", marginTop: 12 }}>Order not found</p>
        <Link href="/admin/orders" style={styles.backBtn}>← Back to Orders</Link>
      </div>
    );
  }

  const sc = STATUS_META[order.orderStatus] || STATUS_META.pending;
  const currentStepIndex = STEPS.indexOf(order.orderStatus);
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
    : "—";

  return (
    <div style={styles.page}>
      
      {toast && (
        <div style={{ ...styles.toast, background: toast.ok ? "#166534" : "#b91c1c" }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}

     
      <div>
        <Link href="/admin/orders" style={styles.backLink}>
          ← Back to Orders
        </Link>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>
              Order <span style={styles.titleId}>{order.orderNumber}</span>
            </h1>
            <p style={styles.subtitle}>{date}</p>
          </div>
          <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
            <span style={{ ...styles.statusDot, background: sc.dot }} />
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Progress bar (non-canceled) */}
      {order.orderStatus !== "canceled" && (
        <div style={styles.progressCard}>
          <p style={styles.cardLabel}>Order Progress</p>
          <div style={styles.progressWrap}>
            {STEPS.map((step, i) => {
              const done    = i <= currentStepIndex;
              const current = i === currentStepIndex;
              return (
                <div key={step} style={styles.progressStep}>
                  <div style={{  flex:"1",display: "flex", alignItems: "center" , width:"100%" }}>
                    <div style={{ ...styles.progressDot, background: done ? "green" : "#e5e7eb", border: current ? "2px solid green" : "none"  }}>
                      {done && <span style={{ color: "white", fontSize: 12 }}>✓</span>}
                    </div>
                   
                      <div style={{ ...styles.progressLine, background: i < currentStepIndex ? "green" : "#e5e7eb", width:"100%" }} />
              
                  </div>
                  <p style={{ ...styles.progressLabel, fontWeight: current ? 600 : 400, color: done ? "#111" : "#aaa" }}>
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Customer Info */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>👤 Customer Info</h2>
            <div style={styles.infoGrid}>
              <InfoRow label="Name"     value={order.name} />
              <InfoRow label="Phone"    value={order.phone} />
              <InfoRow label="Email"    value={order.email || "—"} />
              <InfoRow label="Governorate" value={order.governorate || "—"} />
              <InfoRow label="City"     value={order.city || "—"} />
              <InfoRow label="Address"  value={order.address} full />
            </div>
          </div>

          {/* Payment */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>💳 Payment</h2>
            <div style={styles.infoGrid}>
              <InfoRow label="Method"  value={order.paymentMethod} />
              <InfoRow label="Status"  value={order.paymentStatus} />
              <InfoRow label="Total"   value={`${order.totalPrice?.toLocaleString()} EGP`} highlight />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Items */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📦 Items ({order.items?.length || 0})</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {order.items?.map((item, i) => (
                <div key={i} style={styles.itemRow}>
                  <div style={styles.itemIcon}>📦</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 500, fontFamily: "monospace", color: "#555" }}>
                      ID:{item.product.idnumber ||1000}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#aaa" }}>
                      {item.price?.toLocaleString()} EGP × {item.quantity}
                    </p>
                  </div>
                  <strong style={{ fontSize: 14 }}>
                    {((item.price || 0) * (item.quantity || 1)).toLocaleString()} EGP
                  </strong>
                </div>
              ))}

              <div style={styles.totalRow}>
                <span style={{ fontWeight: 600 }}>Total</span>
                <strong style={{ fontSize: 16, color: "#1a1f0e" }}>
                  {order.totalPrice?.toLocaleString()} EGP
                </strong>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🔄 Update Status</h2>
            <p style={{ fontSize: 13, color: "#888", margin: "0 0 14px" }}>
              Current: <strong style={{ color: sc.color }}>{order.orderStatus}</strong>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {STATUSES.map((s) => (
                <label key={s} style={{ ...styles.radioLabel, ...(status === s ? styles.radioLabelActive : {}) }}>
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    style={{ display: "none" }}
                  />
                  <span style={{ ...styles.radioCircle, ...(status === s ? styles.radioCircleActive : {}) }} />
                  <span style={{ textTransform: "capitalize", fontSize: 14 }}>{s}</span>
                  {s === "canceled" && <span style={{ marginLeft: "auto", fontSize: 11, color: "#f87171" }}>⚠</span>}
                </label>
              ))}
            </div>
            <button
              onClick={handleUpdateStatus}
              disabled={saving || status === order.orderStatus}
              style={{
                ...styles.saveBtn,
                opacity: saving || status === order.orderStatus ? 0.5 : 1,
                cursor: saving || status === order.orderStatus ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Saving…" : "Save Status"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, full, highlight }) {
  return (
    <div style={{ gridColumn: full ? "span 2" : "span 1" }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.5px", margin: 0, textTransform: "uppercase" }}>{label}</p>
      <p style={{ margin: "3px 0 0", fontSize: 14, fontWeight: highlight ? 700 : 400, color: highlight ? "#166534" : "#222" }}>{value}</p>
    </div>
  );
}

const styles = {
  skel: {
  background: "linear-gradient(90deg, #f1f1f1 25%, #e5e5e5 50%, #f1f1f1 75%)",
  backgroundSize: "200% 100%",
  animation: "pulse 1.4s ease infinite",
  borderRadius: 8,
},

  page: { display: "flex", flexDirection: "column", gap: 24, fontFamily: "'DM Sans', sans-serif", position: "relative" },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: 8 },
  spinner: { width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#1a1f0e", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  toast: { position: "fixed", top: 20, right: 24, color: "white", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
  backLink: { fontSize: 14, color: "#888", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 },
  backBtn: { marginTop: 16, padding: "10px 20px", background: "#1a1f0e", color: "white", borderRadius: 10, textDecoration: "none", fontSize: 14 },
  pageHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  title: { fontSize: 24, fontWeight: 700, color: "#111", margin: 0 },
  titleId: { color: "#888", fontSize: 20 },
  subtitle: { color: "#aaa", fontSize: 13, margin: "4px 0 0" },
  statusBadge: { display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, textTransform: "capitalize" },
  statusDot: { width: 8, height: 8, borderRadius: "50%" },
  progressCard: { background: "white", borderRadius: 14, padding: "20px 24px", border: "1px solid #e8e8e6" },
  cardLabel: { fontSize: 13, fontWeight: 600, color: "#888", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.5px" },
  progressWrap: { display: "flex", alignItems: "flex-start" },
  progressStep: { display: "flex", flexDirection: "column", alignItems: "flex-center", flex: 1 },
  progressDot: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  progressLine: { height: 2, flex: 1, minWidth: 20 },
  progressLabel: { fontSize: 12, marginTop: 8, textTransform: "capitalize" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" },
  card: { background: "white", borderRadius: 14, padding: "20px 22px", border: "1px solid #e8e8e6" ,color:"black" },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#111", margin: "0 0 16px", paddingBottom: 12, borderBottom: "1px solid #f0f0ee" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" },
  itemRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fafaf9", borderRadius: 10 },
  itemIcon: { fontSize: 24 },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: "#f0fdf4", borderRadius: 10, marginTop: 4 },
  radioLabel: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, cursor: "pointer", border: "1px solid #e5e7eb", transition: "all 0.15s" },
  radioLabelActive: { background: "#f0fdf4", borderColor: "#1a1f0e" },
  radioCircle: { width: 16, height: 16, borderRadius: "50%", border: "2px solid #d1d5db", flexShrink: 0, transition: "all 0.15s" },
  radioCircleActive: { border: "5px solid #1a1f0e" },
  saveBtn: { marginTop: 16, width: "100%", padding: "12px", background: "#1a1f0e", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, transition: "opacity 0.2s" },
};
