"use client";

import { useLang } from "@/app/providers/LanguageProvider";
import { useEffect, useState, useMemo } from "react";

const API = "https://api.beautyhub.es/api/v1";

// ─── Star renderer ────────────────────────────────────────────────────────────
function Stars({ rating, size = 14, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0);
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = interactive ? n <= (hovered || rating) : n <= rating;
        return (
          <span
            key={n}
            onClick={() => interactive && onRate?.(n)}
            onMouseEnter={() => interactive && setHovered(n)}
            onMouseLeave={() => interactive && setHovered(0)}
            style={{
              fontSize: size,
              cursor: interactive ? "pointer" : "default",
              color: filled ? "#c8a93e" : "#d1d5db",
              transition: "color 0.15s",
              userSelect: "none",
            }}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

// ─── Skeleton shimmer ─────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[55, 160, 260, 70, 80, 90].map((w, i) => (
        <td key={i} style={styles.td}>
          <div style={{ ...styles.skeleton, width: w }} />
        </td>
      ))}
      <td style={styles.td}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ ...styles.skeleton, width: 48, height: 28, borderRadius: 8 }} />
          <div style={{ ...styles.skeleton, width: 56, height: 28, borderRadius: 8 }} />
        </div>
      </td>
    </tr>
  );
}

function ReviewModal({ mode, review, onClose, onSave }) {

    const blank = {
    name: "",
    review: "",
    rating: 5,
    isVisible: true,
  };

  const [form, setForm] = useState(
    mode === "edit"
      ? {
          ...review,
          review:
            typeof review?.review === "object"
              ? review.review.ar
              : review?.review || "",
        }
      : blank
  );

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState(
    mode === "edit" ? review?.image : null
  );

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name?.trim() || !form.review?.trim()) {
      setErr("Name and review text are required.");
      return;
    }

    setSaving(true);
    setErr("");

    try {
      const url =
        mode === "edit"
          ? `${API}/Review/${review._id}`
          : `${API}/Review`;

      const method = mode === "edit" ? "PATCH" : "POST";

      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("review", form.review.trim());
      formData.append("rating", form.rating);
      formData.append("isVisible", form.isVisible);

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (
        mode === "edit" &&
        imagePreview === null &&
        review?.image
      ) {
        formData.append("removeImage", "true");
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      onSave(data.data, mode);
    } catch (err) {
      console.log(err);
      setErr("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Modal header */}
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>
            {mode === "edit" ? " Edit Review" : " Add Review"}
          </h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {err && <div style={styles.errBanner}>⚠️ {err}</div>}

        {/* Name */}
        <label style={styles.label}>Customer Name</label>
        <input
          style={styles.input}
          placeholder="e.g. Ahmed Mohamed"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />

        {/* Review text */}
        <label style={styles.label}>Review Text</label>
        <textarea
          style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
          placeholder="Customer review…"
          value={form.review}
          onChange={(e) => set("review", e.target.value)}
        />

        {/* Image upload */}
        <label style={styles.label}>Customer Photo (optional)</label>
        <div style={styles.uploadArea} onClick={() => document.getElementById("review-img-input").click()}>
          {imagePreview ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={imagePreview}
                alt="preview"
                style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: "3px solid #e0e0de" }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null); }}
                style={styles.removeImgBtn}
              >✕</button>
            </div>
          ) : (
            <div style={{ textAlign: "center", color: "#aaa" }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
              <p style={{ margin: 0, fontSize: 13 }}>Click to upload image</p>
              <p style={{ margin: "4px 0 0", fontSize: 11 }}>JPG, PNG, WEBP — max 5MB</p>
            </div>
          )}
        </div>
        <input
          id="review-img-input"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />

        {/* Rating */}
        <label style={styles.label}>Rating</label>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Stars rating={form.rating} size={26} interactive onRate={(n) => set("rating", n)} />
          <span style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>{form.rating} / 5</span>
        </div>

        {/* Visibility */}
        <label style={{ ...styles.label, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div
            onClick={() => set("isVisible", !form.isVisible)}
            style={{
              width: 42, height: 24, borderRadius: 12,
              background: form.isVisible ? "#166534" : "#d1d5db",
              position: "relative", cursor: "pointer", transition: "background 0.2s",
            }}
          >
            <div style={{
              width: 18, height: 18, borderRadius: "50%", background: "white",
              position: "absolute", top: 3,
              left: form.isVisible ? 21 : 3,
              transition: "left 0.2s",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
          </div>
          <span style={{ fontWeight: 500, color: "#333" }}>
            {form.isVisible ? "Visible on site" : "Hidden from site"}
          </span>
        </label>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={styles.saveBtn}>
            {saving ? <span style={styles.spinner}> </span>: mode === "edit" ? "Save Changes" : "Add Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete confirm modal ─────────────────────────────────────────────────────
function DeleteModal({ review, onClose, onConfirm, deleting }) {
  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...styles.modal, maxWidth: 420 }}>
        <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>
            Delete Review?
          </h2>
          <p style={{ color: "#666", fontSize: 14, margin: 0 }}>
            Review by <strong>{review.name}</strong> will be permanently removed.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            style={{ ...styles.saveBtn, background: "#b91c1c" }}
          >
            {deleting ? <span style={styles.spinner}> </span> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const [reviews, setReviews]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search,  setSearch]      = useState("");
  const [ratingF, setRatingF]     = useState("all");
  const [visF,    setVisF]        = useState("all");
  const [sortBy,  setSortBy]      = useState("newest");
  const [toast,   setToast]       = useState(null);
  const [modal,    setModal]    = useState(null); // { mode: "add"|"edit", review? }
  const [delModal, setDelModal] = useState(null); // review to delete
  const [deleting, setDeleting] = useState(false);
    const { lang } = useLang()

  // ── toast helper ────────────────────────────────────────────────────────────
  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  };

  // ── fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/Review`)
      .then((r) => r.json())
      .then((d) => { setReviews(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // ── filter + sort ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...reviews];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
       r.review?.[lang]?.toLowerCase().includes(q)
      );
    }
    if (ratingF !== "all") list = list.filter((r) => r.rating === Number(ratingF));
    if (visF === "visible") list = list.filter((r) => r.isVisible);
    if (visF === "hidden")  list = list.filter((r) => !r.isVisible);
    if (sortBy === "newest")      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "rating_high") list.sort((a, b) => b.rating - a.rating);
    if (sortBy === "rating_low")  list.sort((a, b) => a.rating - b.rating);
    return list;
  }, [reviews, search, ratingF, visF, sortBy]);

  // ── CRUD callbacks ───────────────────────────────────────────────────────────
  const handleSave = (saved, mode) => {
    if (mode === "edit") {
      setReviews((prev) => prev.map((r) => (r._id === saved._id ? saved : r)));
      showToast("Review updated successfully");
    } else {
      setReviews((prev) => [saved, ...prev]);
      showToast("Review added successfully");
    }
    setModal(null);
  };

  const handleToggleVisibility = async (review) => {
    try {
      const res = await fetch(`${API}/Review/${review._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVisible: !review.isVisible }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews((prev) => prev.map((r) => (r._id === review._id ? data.data : r)));
      showToast(`Review ${!review.isVisible ? "shown" : "hidden"} successfully`);
    } catch {
      showToast("Failed to update visibility", false);
    }
  };

  const handleDelete = async () => {
    if (!delModal) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/Review/${delModal._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setReviews((prev) => prev.filter((r) => r._id !== delModal._id));
      showToast("Review deleted successfully");
      setDelModal(null);
    } catch {
      showToast("Failed to delete review", false);
    } finally {
      setDeleting(false);
    }
  };

  // ── stat helpers ─────────────────────────────────────────────────────────────
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";
  const visibleCount = reviews.filter((r) => r.isVisible).length;

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ ...styles.toast, background: toast.ok ? "#166534" : "#b91c1c" }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}

      {/* Modals */}
      {modal && (
        <ReviewModal
          mode={modal.mode}
          review={modal.review}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {delModal && (
        <DeleteModal
          review={delModal}
          onClose={() => setDelModal(null)}
          onConfirm={handleDelete}
          deleting={deleting}
        />
      )}

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Reviews</h1>
          <p style={styles.subtitle}>{reviews.length} total customer reviews</p>
        </div>
        <button onClick={() => setModal({ mode: "add" })} style={styles.primaryBtn}>
          + Add Review
        </button>
      </div>

      {/* Summary cards */}
      <div style={styles.summaryRow}>
        <SummaryCard label="Total Reviews"   value={reviews.length}  icon="💬" />
        <SummaryCard label="Visible on Site" value={visibleCount}    icon="👁️" />
        <SummaryCard label="Hidden"          value={reviews.length - visibleCount} icon="🙈" warn={reviews.length - visibleCount > 0} />
        <SummaryCard label="Avg. Rating"     value={avgRating === "—" ? "—" : `${avgRating} ★`} icon="⭐" color="#c8a93e" />
      </div>

      {/* Filters */}
      <div style={styles.filtersRow}>
        <input
          type="text"
          placeholder="Search by name or review…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <select value={ratingF} onChange={(e) => setRatingF(e.target.value)} style={styles.select}>
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{"★".repeat(n)} {n} Stars</option>
          ))}
        </select>
        <select value={visF} onChange={(e) => setVisF(e.target.value)} style={styles.select}>
          <option value="all">All Visibility</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="rating_high">Rating: High → Low</option>
          <option value="rating_low">Rating: Low → High</option>
        </select>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["#", "Customer", "Review", "Rating", "Visibility", "Date", "Actions"].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ ...styles.td, textAlign: "center", color: "#aaa", padding: "48px 0", fontSize: 14 }}>
                    {reviews.length === 0 ? "No reviews yet — add your first one!" : "No reviews match your filters."}
                  </td>
                </tr>
              ) : (
                filtered.map((r, idx) => (
                  <tr
                    key={r._id}
                    style={styles.tr}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafaf9")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* Index */}
                    <td style={{ ...styles.td, color: "#bbb", fontSize: 12, width: 40 }}>{idx + 1}</td>

                    {/* Customer */}
                    {/* <td style={styles.td}>
                      <div style={styles.avatar}>
                        <div style={styles.avatarCircle}>
                          {r.name?.[0]?.toUpperCase() ?? "?"}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                      </div>
                    </td> */}
                    {/* Customer */}
<td style={styles.td}>
  <div style={styles.avatar}>
    {r.image ? (
      <img
        src={r.image}
        alt={r.name}
        style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      />
    ) : (
      <div style={styles.avatarCircle}>
        {r.name?.[0]?.toUpperCase() ?? "?"}
      </div>
    )}
    <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
  </div>
</td>

                    {/* Review text */}
                    <td style={{ ...styles.td, maxWidth: 320 }}>
                     <p style={styles.reviewText}>
  {r.review?.[lang]}
</p>
                    </td>

                    {/* Rating */}
                    <td style={styles.td}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Stars rating={r.rating} size={14} />
                        <span style={{ fontSize: 11, color: "#aaa" }}>{r.rating}.0 / 5.0</span>
                      </div>
                    </td>

                    {/* Visibility toggle */}
                    <td style={styles.td}>
                      <button
                        onClick={() => handleToggleVisibility(r)}
                        style={{
                          ...styles.visBadge,
                          background: r.isVisible ? "#f0fdf4" : "#fef2f2",
                          color: r.isVisible ? "#166534" : "#b91c1c",
                          borderColor: r.isVisible ? "#bbf7d0" : "#fecaca",
                        }}
                      >
                        {r.isVisible ? "👁 Visible" : "🙈 Hidden"}
                      </button>
                    </td>

                    {/* Date */}
                    <td style={{ ...styles.td, fontSize: 12, color: "#aaa", whiteSpace: "nowrap" }}>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td style={styles.td}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => setModal({ mode: "edit", review: r })}
                          style={styles.editBtn}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDelModal(r)}
                          style={styles.deleteBtn}
                        >
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
        {!loading && filtered.length > 0 && (
          <div style={styles.tableFooter}>
            Showing {filtered.length} of {reviews.length} reviews
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Summary card component ───────────────────────────────────────────────────
function SummaryCard({ label, value, icon, warn, color }) {
  return (
    <div style={{ ...styles.summaryCard, border: warn ? "1px solid #fee2e2" : "1px solid #e8e8e6" }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <p style={{
          margin: 0, fontSize: 11, fontWeight: 600,
          letterSpacing: "0.3px", textTransform: "uppercase",
          color: warn ? "#f87171" : "#888",
        }}>
          {label}
        </p>
        <p style={{
          margin: "4px 0 0", fontSize: 22, fontWeight: 700,
          color: color ?? (warn ? "#b91c1c" : "#111"),
        }}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  page:        { display: "flex", flexDirection: "column", gap: 24, fontFamily: "'DM Sans', sans-serif", position: "relative" },
  header:      { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 },
  title:       { fontSize: 26, fontWeight: 700, color: "#111", margin: 0 },
  subtitle:    { color: "#888", fontSize: 14, margin: "4px 0 0" },
  primaryBtn:  { padding: "10px 20px", background: "#1a1f0e", color: "white", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  toast:       { position: "fixed", top: 20, right: 24, color: "white", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
  summaryRow:  { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14 },
  summaryCard: { background: "white", borderRadius: 12, padding: "16px 18px", display: "flex", alignItems: "center", gap: 14 },
  filtersRow:  { display: "flex", gap: 12, flexWrap: "wrap" },
  searchInput: { flex: "1 1 220px", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0e0de", fontSize: 14, outline: "none", background: "white" },
  select:      { padding: "10px 14px", borderRadius: 10, border: "1px solid #e0e0de", fontSize: 14, outline: "none", background: "white", cursor: "pointer", color: "black" },
  tableCard:   { background: "white", borderRadius: 14, border: "1px solid #e8e8e6", overflow: "hidden" },
  tableWrap:   { overflowX: "auto" },
  table:       { width: "100%", borderCollapse: "collapse", fontSize: 14 },
  th:          { padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.5px", textTransform: "uppercase", background: "#fafaf9", borderBottom: "1px solid #f0f0ee", whiteSpace: "nowrap" },
  td:          { padding: "14px 16px", borderBottom: "1px solid #f8f8f7", verticalAlign: "middle", color: "#333", cursor: "default" },
  tr:          { transition: "background 0.15s" },
  skeleton:    { height: 14, borderRadius: 4, background: "linear-gradient(90deg, #f0f0ef 25%, #e8e8e7 50%, #f0f0ef 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", width: "70%" },
  tableFooter: { padding: "12px 18px", borderTop: "1px solid #f0f0ee", fontSize: 13, color: "#aaa" },
  avatar:      { display: "flex", alignItems: "center", gap: 10 },
  avatarCircle:{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #1a1f0e, #3a4520)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 },
  reviewText:  { margin: 0, fontSize: 13, color: "#555", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" },
  visBadge:    { padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid", background: "none", transition: "all 0.15s" },
  editBtn:     { padding: "6px 14px", background: "#1a1f0e", color: "white", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  deleteBtn:   { padding: "6px 14px", background: "#fef2f2", color: "#b91c1c", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" },
  // Modal
  overlay:     { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9998, padding: 20 },
  modal:       { background: "white", borderRadius: 16, padding: "28px 32px", width: "100%", maxWidth: 520, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", gap: 12 },
  modalHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  modalTitle:  { fontSize: 18, fontWeight: 700, color: "#111", margin: 0 },
  closeBtn:    { background: "#f3f4f6", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14, color: "#555", display: "flex", alignItems: "center", justifyContent: "center" },
  label:       { fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6, display: "block" },
  input:       { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e0e0de", fontSize: 16, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#111", boxSizing: "border-box" },
  errBanner:   { background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 8, padding: "10px 14px", fontSize: 13 },
  cancelBtn:   { padding: "9px 20px", background: "#f3f4f6", color: "#333", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer" },
  saveBtn: { padding: "9px 22px", background: "#1a1f0e", color: "white", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" },
  uploadArea: {
  border: "2px dashed #e0e0de",
  borderRadius: 12,
  padding: "20px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  minHeight: 100,
  transition: "border-color 0.15s",
},
removeImgBtn: {
  position: "absolute",
  top: -6,
  right: -6,
  width: 22,
  height: 22,
  borderRadius: "50%",
  background: "#b91c1c",
  color: "white",
  border: "none",
  fontSize: 11,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  },
  spinner: {
    display: "inline-block", width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
    borderRadius: "50%", animation: "spin 0.8s linear infinite",
  },
};
