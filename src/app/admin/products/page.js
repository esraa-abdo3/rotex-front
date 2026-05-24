"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const API = "https://rootex-backend.vercel.app/api/v1";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [sortBy,   setSortBy]   = useState("newest");
  const [deleting, setDeleting] = useState(null);
  const [toast,    setToast]    = useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch(`${API}/product/getallproducts`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.en?.toLowerCase().includes(q) ||
          p.name?.ar?.toLowerCase().includes(q) ||
          p._id?.toLowerCase().includes(q)
      );
    }
    if (sortBy === "newest")    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")    list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "price_asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc")list.sort((a, b) => b.price - a.price);
    if (sortBy === "stock_low") list.sort((a, b) => a.stock - b.stock);
    return list;
  }, [products, search, sortBy]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API}/product/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      showToast("Product deleted successfully");
    } catch {
      showToast("Failed to delete product", false);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={styles.page}>
      {toast && (
        <div style={{ ...styles.toast, background: toast.ok ? "#166534" : "#b91c1c" }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Products</h1>
          <p style={styles.subtitle}>{products.length} products in catalogue</p>
        </div>
      </div>

      {/* Summary cards */}
      <div style={styles.summaryRow}>
        <SummaryCard label="Total Products" value={products.length} icon="🛍️" />
        <SummaryCard label="Low Stock (≤5)" value={products.filter(p => p.stock <= 5).length} icon="⚠️" warn />
        <SummaryCard label="Out of Stock"   value={products.filter(p => p.stock === 0).length} icon="🚫" warn />
        <SummaryCard label="Avg. Price"     value={products.length ? Math.round(products.reduce((s,p) => s + p.price, 0) / products.length).toLocaleString() + " EGP" : "—"} icon="💰" />
      </div>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="stock_low">Stock: Low first</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Image", "Name (EN/AR)", "Price", "Stock", "Images", "Created", "Actions"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} style={styles.td}><div style={styles.skeleton} /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...styles.td, textAlign: "center", padding: 50, color: "#aaa" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
                    No products found
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const img   = product.images?.[0];
                  const lowSt = product.stock <= 5;
                  return (
                    <tr key={product._id} style={styles.tr}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafaf9"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={styles.td}>
                        <div style={styles.imgBox}>
                          {img ? (
                            <Image src={img} alt={product.name?.en || ""} width={52} height={52} style={{ objectFit: "cover", borderRadius: 8, width: 52, height: 52 }} />
                          ) : (
                            <div style={{ ...styles.imgPlaceholder }}>🖼</div>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{product.name?.en}</div>
                        <div style={{ fontSize: 12, color: "#aaa", direction: "rtl", textAlign: "center", fontFamily: "serif" }}>
                          {product.name?.ar}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <strong>{product.price?.toLocaleString()} EGP</strong>
                      </td>
                      <td style={styles.td}>
                        <span style={{ ...styles.stockBadge, background: lowSt ? "#fef2f2" : "#f0fdf4", color: lowSt ? "#b91c1c" : "#166534", fontWeight: 600 }}>
                          {product.stock === 0 ? "Out of stock" : product.stock}
                          {lowSt && product.stock > 0 && " ⚠️"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontSize: 12, color: "#888" }}>{product.images?.length || 0} photo{product.images?.length !== 1 ? "s" : ""}</span>
                      </td>
                      <td style={{ ...styles.td, fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 8 }}>
                          <Link href={`/admin/products/${product._id}`} style={styles.editBtn}>Edit</Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deleting === product._id}
                            style={{ ...styles.deleteBtn, opacity: deleting === product._id ? 0.5 : 1 }}
                          >
                            {deleting === product._id ? "…" : "Delete"}
                          </button>
                        </div>
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
            Showing {filtered.length} of {products.length} products
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, warn }) {
  return (
    <div style={{ ...styles.summaryCard, border: warn ? "1px solid #fee2e2" : "1px solid #e8e8e6" }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: warn ? "#f87171" : "#888", fontWeight: 600, letterSpacing: "0.3px", textTransform: "uppercase" }}>{label}</p>
        <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 700, color: warn ? "#b91c1c" : "#111" }}>{value}</p>
      </div>
    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", gap: 24, fontFamily: "'DM Sans', sans-serif", position: "relative" },
  header: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 },
  title: { fontSize: 26, fontWeight: 700, color: "#111", margin: 0 },
  subtitle: { color: "#888", fontSize: 14, margin: "4px 0 0" },
  toast: { position: "fixed", top: 20, right: 24, color: "white", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
  summaryRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 },
  summaryCard: { background: "white", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 },
  filtersRow: { display: "flex", gap: 12, flexWrap: "wrap" },
  searchInput: { flex: "1 1 220px", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0e0de", fontSize: 14, outline: "none", background: "white" },
  select: { padding: "10px 14px", borderRadius: 10, border: "1px solid #e0e0de", fontSize: 14, outline: "none", background: "white", cursor: "pointer" ,color:"black" },
  tableCard: { background: "white", borderRadius: 14, border: "1px solid #e8e8e6", overflow: "hidden" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th: { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.5px", textTransform: "uppercase", background: "#fafaf9", borderBottom: "1px solid #f0f0ee", whiteSpace: "nowrap" },
  td: { padding: "14px 16px", borderBottom: "1px solid #f8f8f7", verticalAlign: "middle", color: "#333"  ,cursor:"default"},
  tr: { transition: "background 0.15s" },
  imgBox: { width: 52, height: 52 },
  imgPlaceholder: { width: 52, height: 52, background: "#f3f4f6", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 },
  stockBadge: { padding: "4px 10px", borderRadius: 20, fontSize: 12 },
  editBtn: { padding: "6px 14px", background: "#1a1f0e", color: "white", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 500 },
  deleteBtn: { padding: "6px 14px", background: "#fef2f2", color: "#b91c1c", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" },
  skeleton: { height: 14, borderRadius: 4, background: "#f0f0ef", width: "70%" },
  tableFooter: { padding: "12px 18px", borderTop: "1px solid #f0f0ee", fontSize: 13, color: "#aaa" },
};
