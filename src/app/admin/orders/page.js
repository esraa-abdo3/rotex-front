"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

const API = "https://rootex-backend.vercel.app/api/v1";

const STATUS_META = {
  all:        { label: "All",        color: "#374151", bg: "#f3f4f6" },
  pending:    { label: "Pending",    color: "#c2410c", bg: "#fff7ed" },
  processing: { label: "Processing", color: "#1d4ed8", bg: "#eff6ff" },
  shipped:    { label: "Shipped",    color: "#7c3aed", bg: "#f5f3ff" },
  delivered:  { label: "Delivered",  color: "#166534", bg: "#f0fdf4" },
  canceled:   { label: "Canceled",   color: "#b91c1c", bg: "#fef2f2" },
};

export default function OrdersPage() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [payFilter, setPay]       = useState("all");
  const [sortBy, setSortBy]       = useState("newest");

  useEffect(() => {
    fetch(`${API}/order`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== "all") list = list.filter((o) => o.orderStatus === statusFilter);
    if (payFilter !== "all")    list = list.filter((o) => o.paymentMethod === payFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.name?.toLowerCase().includes(q) ||
          o.phone?.includes(q) ||
          o._id?.toLowerCase().includes(q) ||
          o.governorate?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "newest")  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")  list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "highest") list.sort((a, b) => b.totalPrice - a.totalPrice);
    if (sortBy === "lowest")  list.sort((a, b) => a.totalPrice - b.totalPrice);
    return list;
  }, [orders, statusFilter, payFilter, search, sortBy]);

  const counts = useMemo(() => {
    const c = { all: orders.length };
    Object.keys(STATUS_META).forEach((k) => {
      if (k !== "all") c[k] = orders.filter((o) => o.orderStatus === k).length;
    });
    return c;
  }, [orders]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Orders</h1>
          <p style={styles.subtitle}>{orders.length} total orders</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div style={styles.tabs}>
        {Object.entries(STATUS_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setStatus(key)}
            style={{
              ...styles.tab,
              ...(statusFilter === key ? { ...styles.tabActive, borderBottomColor: meta.color, color: meta.color } : {}),
            }}
          >
            {meta.label}
            <span style={{
              ...styles.tabCount,
              background: statusFilter === key ? meta.bg : "#f3f4f6",
              color: statusFilter === key ? meta.color : "#888",
            }}>
              {counts[key] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by name, phone, order ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select value={payFilter} onChange={(e) => setPay(e.target.value)} style={styles.select}>
          <option value="all">All Payments</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="paymob">Paymob</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest price</option>
          <option value="lowest">Lowest price</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Order ID", "Customer", "Location", "Items", "Total", "Payment", "Status", "Date", ""].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} style={styles.td}>
                        <div style={styles.skeleton} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ ...styles.td, textAlign: "center", padding: "50px", color: "#aaa" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                    No orders found
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const sc = STATUS_META[order.orderStatus] || STATUS_META.pending;
                  const date = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : "—";
                  return (
                    <tr key={order._id} style={styles.tr}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafaf9"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={styles.td}>
                        <span style={styles.orderId}>{order.orderNumber}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>{order.name}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{order.phone}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontSize: 13 }}>{order.governorate || "—"}</div>
                        <div style={{ fontSize: 12, color: "#aaa" }}>{order.city}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.itemCount}>{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</span>
                      </td>
                      <td style={styles.td}>
                        <strong style={{ fontSize: 14 }}>{order.totalPrice?.toLocaleString()} EGP</strong>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.badge}>{order.paymentMethod}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.statusBadge, background: sc.bg, color: sc.color }}>
                          {sc.label}
                        </span>
                      </td>
                      <td style={{ ...styles.td, fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>{date}</td>
                      <td style={styles.td}>
                        <Link href={`/admin/orders/${order._id}`} style={styles.viewBtn}>
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length > 0 && (
          <div style={styles.tableFooter}>
            Showing {filtered.length} of {orders.length} orders
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: 24, fontFamily: "'DM Sans', sans-serif" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 },
  title: { fontSize: 26, fontWeight: 700, color: "#111", margin: 0 },
  subtitle: { color: "#888", fontSize: 14, margin: "4px 0 0" },
  tabs: { display: "flex", gap: 0, borderBottom: "1px solid #e8e8e6", overflowX: "auto" },
  tab: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 16px", background: "none", border: "none",
    borderBottom: "2px solid transparent", cursor: "pointer",
    fontSize: 14, fontWeight: 500, color: "#888",
    whiteSpace: "nowrap", transition: "color 0.2s",
  },
  tabActive: { color: "#111", borderBottomColor: "#1a1f0e" },
  tabCount: { fontSize: 11, fontWeight: 600, padding: "2px 7px", borderRadius: 20 },
  filtersRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  searchInput: {
    flex: "1 1 220px", padding: "10px 14px", borderRadius: 10,
    border: "1px solid #e0e0de", fontSize: 16, outline: "none",
    background: "white", color:"black"
  },
  select: {
    padding: "10px 14px", borderRadius: 10, border: "1px solid #e0e0de",
    fontSize: 14, outline: "none", background: "white", cursor: "pointer",
    color:"black",
  },
  tableCard: { background: "white", borderRadius: 14, border: "1px solid #e8e8e6", overflow: "hidden" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: {
    padding: "12px 16px", textAlign: "left", fontSize: 11,
    fontWeight: 600, color: "#aaa", letterSpacing: "0.5px",
    textTransform: "uppercase", background: "#fafaf9",
    borderBottom: "1px solid #f0f0ee", whiteSpace: "nowrap",
  },
  td: { padding: "14px 16px", borderBottom: "1px solid #f8f8f7", verticalAlign: "middle", color: "#333" },
  tr: { transition: "background 0.15s" },
  orderId: { fontFamily: "monospace", fontSize: 12, color: "#555", background: "#f3f4f6", padding: "2px 6px", borderRadius: 4 },
  itemCount: { fontSize: 12, color: "#666", background: "#f3f4f6", padding: "3px 8px", borderRadius: 6 },
  badge: { background: "#f3f4f6", color: "#555", padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 500, textTransform: "capitalize" },
  statusBadge: { padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600, textTransform: "capitalize" },
  viewBtn: { padding: "7px 14px", background: "#1a1f0e", color: "white", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 500 },
  skeleton: { height: 14, borderRadius: 4, background: "#f0f0ef", width: "70%" },
  tableFooter: { padding: "12px 18px", borderTop: "1px solid #f0f0ee", fontSize: 13, color: "#aaa" },
};
