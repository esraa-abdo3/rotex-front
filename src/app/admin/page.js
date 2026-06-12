"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://api.beautyhub.es/api/v1";

const STATUS_COLORS = {
  pending:    { bg: "#fff7ed", text: "#c2410c" },
  processing: { bg: "#eff6ff", text: "#1d4ed8" },
  shipped:    { bg: "#f0fdf4", text: "#15803d" },
  delivered:  { bg: "#f0fdf4", text: "#166534" },
  canceled:   { bg: "#fef2f2", text: "#b91c1c" },
};

export default function AdminHome() {
  const [orders, setOrders]     = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    Promise.all([
      fetch(`${API}/order`).then((r) => r.json()).catch(() => ({ data: [] })),
      fetch(`${API}/product/getallproducts`).then((r) => r.json()).catch(() => ({ data: [] })),
    ]).then(([o, p]) => {
      setOrders(o.data || []);
      setProducts(p.data || []);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== "canceled")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const pendingCount   = orders.filter((o) => o.orderStatus === "pending").length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "delivered").length;

  const recentOrders = [...orders].slice(0, 6);

  const StatCard = ({ label, value, sub, icon, color }) => (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={styles.cardLabel}>{label}</p>
          {loading ? (
            <div style={styles.skeleton} />
          ) : (
            <h2 style={{ ...styles.cardValue, color }}>{value}</h2>
          )}
          {sub && <p style={styles.cardSub}>{sub}</p>}
        </div>
        <div style={{ ...styles.iconBox, background: color + "18" }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Welcome back 👋 — here's what's happening today.</p>
        </div>
        <Link href="/admin/orders" style={styles.primaryBtn}>
          View All Orders →
        </Link>
      </div>

      {/* Stat Cards */}
      <div style={styles.grid4}>
        <StatCard
          label="Total Orders"
          value={orders.length}
          sub={`${pendingCount} pending`}
          icon="📦"
          color="#1a1f0e"
        />
        <StatCard
          label="Revenue"
          value={`${totalRevenue.toLocaleString()} EGP`}
          sub="From non-canceled orders"
          icon="💰"
          color="#15803d"
        />
        <StatCard
          label="Products"
          value={products.length}
          sub="In catalogue"
          icon="🛍️"
          color="#7c3aed"
        />
        <StatCard
          label="Delivered"
          value={deliveredCount}
          sub={`of ${orders.length} orders`}
          icon="✅"
          color="#0891b2"
        />
      </div>

      {/* Recent Orders */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Orders</h2>
          <Link href="/admin/orders" style={styles.linkBtn}>See all →</Link>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Governorate", "Total", "Payment", "Status", ""].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} style={styles.td}>
                        <div style={{ ...styles.skeleton, width: "80%" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...styles.td, textAlign: "center", color: "#999", padding: "40px" }}>
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const sc = STATUS_COLORS[order.orderStatus] || { bg: "#f3f4f6", text: "#374151" };
                  return (
                    <tr key={order._id} style={styles.tr}>
                      <td style={styles.td}>
                        <span style={styles.orderId}>{order.orderNumber}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{order.name}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{order.phone}</div>
                      </td>
                      <td style={styles.td}>{order.governorate || "—"}</td>
                      <td style={styles.td}>
                        <strong>{order.totalPrice?.toLocaleString()} EGP</strong>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{order.paymentMethod}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.text }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <Link href={`/admin/orders/${order._id}`} style={styles.viewBtn}>
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.grid2}>
        <Link href="/admin/products" style={styles.actionCard}>
          <span style={{ fontSize: 28 }}>🛍️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Manage Products</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
              Add, edit or remove products from your catalogue
            </p>
          </div>
          <span style={{ marginLeft: "auto", color: "#999" }}>→</span>
        </Link>

        <Link href="/admin/settings" style={styles.actionCard}>
          <span style={{ fontSize: 28 }}>⚙️</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Site Settings</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#666" }}>
              Edit colors, texts and images on your website
            </p>
          </div>
          <span style={{ marginLeft: "auto", color: "#999" }}>→</span>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: 28, fontFamily: "'DM Sans', sans-serif" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 },
  title: { fontSize: 28, fontWeight: 700, color: "#111", margin: 0 },
  subtitle: { color: "#888", fontSize: 14, margin: "6px 0 0" },
  primaryBtn: {
    padding: "10px 20px", background: "#1a1f0e", color: "white",
    borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500,
    whiteSpace: "nowrap",
  },
  grid4: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 },
  card: {
    background: "white", borderRadius: 14, padding: "20px 22px",
    border: "1px solid #e8e8e6", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  cardLabel: { fontSize: 13, color: "#888", margin: 0, fontWeight: 500 },
  cardValue: { fontSize: 26, fontWeight: 700, margin: "8px 0 0", letterSpacing: "-0.5px" },
  cardSub: { fontSize: 12, color: "#aaa", margin: "4px 0 0" },
  iconBox: { width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" },
  skeleton: { height: 28, borderRadius: 6, background: "#f0f0ef", width: "60%", marginTop: 8 },
  section: { background: "white", borderRadius: 14, border: "1px solid #e8e8e6", overflow: "hidden" },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #f0f0ee" },
  sectionTitle: { fontSize: 16, fontWeight: 600, color: "#111", margin: 0 },
  linkBtn: { fontSize: 13, color: "#1a1f0e", textDecoration: "none", fontWeight: 500 },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.5px", textTransform: "uppercase", background: "#fafaf9", borderBottom: "1px solid #f0f0ee" },
  td: { padding: "14px 16px", borderBottom: "1px solid #f8f8f7", verticalAlign: "middle", color: "#333" },
  tr: { transition: "background 0.15s", cursor: "default" },
  orderId: { fontFamily: "monospace", fontSize: 13, color: "#555", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 },
  badge: { background: "#f3f4f6", color: "#555", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 500, textTransform: "capitalize" },
  statusBadge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: "capitalize" },
  viewBtn: { padding: "6px 14px", background: "#f3f4f6", color: "#333", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "background 0.2s" },
  grid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 },
  actionCard: {
    display: "flex", alignItems: "center", gap: 16,
    background: "white", border: "1px solid #e8e8e6", borderRadius: 14,
    padding: "20px 22px", textDecoration: "none", color: "#111",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
};
