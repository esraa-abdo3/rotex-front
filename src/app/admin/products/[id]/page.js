"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const API = "https://rootex-backend.vercel.app/api/v1";

export default function EditProductPage() {
  const { id }   = useParams();
  const router   = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const fileRef = useRef();

  const [form, setForm] = useState({
    nameEn: "", nameAr: "",
    descEn: "", descAr: "",
    price: "", stock: "",
  });
  const [newImages, setNewImages] = useState([]); // File objects
  const [previews,  setPreviews]  = useState([]); // object URLs

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch(`${API}/product/${id}`)
      .then((r) => r.json())
      .then((d) => {
        const p = d.data;
        setProduct(p);
        setForm({
          nameEn: p.name?.en || "",
          nameAr: p.name?.ar || "",
          descEn: p.description?.en || "",
          descAr: p.description?.ar || "",
          price:  p.price?.toString() || "",
          stock:  p.stock?.toString() || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append("name",        JSON.stringify({ en: form.nameEn, ar: form.nameAr }));
      fd.append("description", JSON.stringify({ en: form.descEn, ar: form.descAr }));
      fd.append("price",  form.price);
      fd.append("stock",  form.stock);
      newImages.forEach((f) => fd.append("images", f));

      const res = await fetch(`${API}/product/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setProduct(data.data);
      setNewImages([]);
      setPreviews([]);
      showToast("Product updated successfully ✓");
    } catch (err) {
      showToast(err.message, false);
    } finally {
      setSaving(false);
    }
  };

if (loading) {
  return (
    <div style={styles.page}>
      {/* top skeleton */}
      <div style={{ marginBottom: 24 }}>
        <div style={styles.skeletonBack} />

        <div style={styles.pageHeader}>
          <div>
            <div style={styles.skeletonTitle} />
            <div style={styles.skeletonText} />
          </div>

          <div style={styles.stockSkeleton} />
        </div>
      </div>

      {/* content skeleton */}
      <div style={styles.grid}>
        {/* left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[1, 2, 3].map((card) => (
            <div key={card} style={styles.card}>
              <div style={styles.skeletonCardTitle} />

              <div style={styles.formGrid}>
                <div>
                  <div style={styles.skeletonLabel} />
                  <div style={styles.skeletonInput} />
                </div>

                <div>
                  <div style={styles.skeletonLabel} />
                  <div style={styles.skeletonInput} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={styles.card}>
            <div style={styles.skeletonCardTitle} />

            <div style={styles.imagesGrid}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={styles.skeletonImage} />
              ))}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.skeletonCardTitle} />

            <div style={styles.skeletonDrop} />
          </div>

          <div style={styles.skeletonButton} />
        </div>
      </div>
    </div>
  );
}

  if (!product) {
    return (
      <div style={styles.loadingWrap}>
        <div style={{ fontSize: 40 }}>🚫</div>
        <p style={{ color: "#aaa", marginTop: 12 }}>Product not found</p>
        <Link href="/admin/products" style={styles.backBtn}>← Back to Products</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {toast && (
        <div style={{ ...styles.toast, background: toast.ok ? "#166534" : "#b91c1c" }}>
          {toast.ok ? "✓" : "✗"} {toast.msg}
        </div>
      )}

      <div>
        <Link href="/admin/products" style={styles.backLink}>← Back to Products</Link>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.title}>Edit Product</h1>
            <p style={styles.subtitle}>{product.name?.en}</p>
          </div>
          <div style={styles.stockInfo}>
            <span style={{ fontSize: 12, color: "#888" }}>Current stock</span>
            <strong style={{ fontSize: 22, color: product.stock === 0 ? "#b91c1c" : "#166534" }}>{product.stock}</strong>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Names */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Product Name</h2>
              <div style={styles.formGrid}>
                <Field label="Name (English)" name="nameEn" value={form.nameEn} onChange={handleChange} />
                <Field label="Name (Arabic)"  name="nameAr" value={form.nameAr} onChange={handleChange} dir="rtl" />
              </div>
            </div>

            {/* Descriptions */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Description</h2>
              <div style={styles.formGrid}>
                <Field label="Description (English)" name="descEn" value={form.descEn} onChange={handleChange} textarea />
                <Field label="Description (Arabic)"  name="descAr" value={form.descAr} onChange={handleChange} textarea dir="rtl" />
              </div>
            </div>

            {/* Price + Stock */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Pricing & Inventory</h2>
              <div style={styles.formGrid}>
                <Field label="Price (EGP)" name="price" value={form.price} onChange={handleChange} type="number" min="0" />
                <Field label="Stock"       name="stock" value={form.stock} onChange={handleChange} type="number" min="0" />
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Current Images */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Current Images</h2>
              {product.images?.length > 0 ? (
                <div style={styles.imagesGrid}>
                  {product.images.map((url, i) => (
                    <div key={i} style={styles.imgWrap}>
                      <Image src={url} alt="" width={90} height={90} style={{ objectFit: "cover", borderRadius: 8, width: "100%", height: 90 }} />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#aaa", fontSize: 13 }}>No images</p>
              )}
            </div>

            {/* Upload New */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Replace Images</h2>
              <p style={{ fontSize: 12, color: "#f59e0b", margin: "0 0 12px", background: "#fffbeb", padding: "8px 12px", borderRadius: 8 }}>
                ⚠️ Uploading new images will replace all existing images.
              </p>
              <div
                style={styles.dropZone}
                onClick={() => fileRef.current?.click()}
              >
                <span style={{ fontSize: 28 }}>📁</span>
                <p style={{ margin: "6px 0 0", fontSize: 14, fontWeight: 500, color: "#555" }}>Click to select images</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#aaa" }}>PNG, JPG, WEBP</p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleFiles}
                />
              </div>

              {previews.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>{previews.length} new image{previews.length !== 1 ? "s" : ""} selected:</p>
                  <div style={styles.imagesGrid}>
                    {previews.map((url, i) => (
                      <div key={i} style={styles.imgWrap}>
                        <Image src={url} alt="" width={90} height={90} style={{ objectFit: "cover", borderRadius: 8, width: "100%", height: 90 }} />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => { setNewImages([]); setPreviews([]); }}
                    style={styles.clearBtn}
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </div>

            {/* Save button */}
            <button
              type="submit"
              disabled={saving}
              style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
            >
        {saving ? (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    }}
  >
    <span style={styles.btnSpinner}></span>
    Saving...
  </div>
) : (
  " Save Changes"
)}
            </button>

            <Link href="/admin/products" style={styles.cancelLink}>
              Cancel & go back
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", textarea, dir, min }) {
  const base = {
    color:"black",
    width: "100%", padding: "10px 12px", borderRadius: 10,
    border: "1px solid #e0e0de", fontSize: 14, outline: "none",
    background: "#fafaf9", fontFamily: "inherit", direction: dir || "ltr",
    boxSizing: "border-box", transition: "border 0.2s",
    resize: textarea ? "vertical" : undefined,
    minHeight: textarea ? 90 : undefined,
  };

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#888", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.3px" }}>
        {label}
      </label>
      {textarea ? (
        <>
                <textarea name={name} value={value} onChange={onChange} style={base} />
                <p
  style={{
    fontSize: "12px",
    color: "#888",
    marginTop: "6px",
    lineHeight: 1.6,
  }}
>
  يمكنك استخدام Enter لعمل سطر جديد أو مسافات بين الفقرات.
</p>
        </>
  
        
        
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} min={min} style={base} />
      )}

    </div>
  );
}
const  shimmer = {
  background:
    "linear-gradient(90deg, #f1f1f1 25%, #e7e7e7 50%, #f1f1f1 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s infinite linear",
}


const styles = {
  btnSpinner: {
  width: 18,
  height: 18,

  border: "2px solid rgba(255,255,255,0.4)",
  borderTop: "2px solid white",

  borderRadius: "50%",

  animation: "spin 0.7s linear infinite",
},
  page: { display: "flex", flexDirection: "column", gap: 24, fontFamily: "'DM Sans', sans-serif", position: "relative" },
  loadingWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50vh", gap: 8 },
  spinner: { width: 36, height: 36, border: "3px solid #e5e7eb", borderTopColor: "#1a1f0e", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  toast: { position: "fixed", top: 20, right: 24, color: "white", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" },
  backLink: { fontSize: 14, color: "#888", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 },
  backBtn: { marginTop: 16, padding: "10px 20px", background: "#1a1f0e", color: "white", borderRadius: 10, textDecoration: "none", fontSize: 14 },
  pageHeader: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  title: { fontSize: 24, fontWeight: 700, color: "#111", margin: 0 },
  subtitle: { color: "#888", fontSize: 14, margin: "4px 0 0" },
  stockInfo: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 },
  form: {},
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20, alignItems: "start" },
  card: { background: "white", borderRadius: 14, padding: "20px 22px", border: "1px solid #e8e8e6" },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#111", margin: "0 0 16px", paddingBottom: 12, borderBottom: "1px solid #f0f0ee" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  imagesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 10 },
  imgWrap: { borderRadius: 8, overflow: "hidden", border: "1px solid #e8e8e6" },
  dropZone: {
    border: "2px dashed #d1d5db", borderRadius: 12, padding: "28px 20px",
    textAlign: "center", cursor: "pointer", transition: "border-color 0.2s",
  },
  clearBtn: { marginTop: 10, fontSize: 12, color: "#b91c1c", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" },
  saveBtn: { width: "100%", padding: "14px", background: "#1a1f0e", color: "white", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 600, transition: "opacity 0.2s" },
  cancelLink: { display: "block", textAlign: "center", fontSize: 13, color: "#aaa", textDecoration: "none", marginTop: -8 },
  skeletonBack: {
  width: 140,
  height: 18,
  borderRadius: 8,
  background: "#ececec",
  marginBottom: 20,
},

skeletonTitle: {
  width: 220,
  height: 32,
  borderRadius: 10,
  background: "#ececec",
},

skeletonText: {
  width: 180,
  height: 14,
  borderRadius: 8,
  background: "#f1f1f1",
  marginTop: 10,
},

stockSkeleton: {
  width: 90,
  height: 60,
  borderRadius: 12,
  background: "#f1f1f1",
},

skeletonCardTitle: {
  width: 160,
  height: 20,
  borderRadius: 8,
   ...shimmer,
  marginBottom: 20,
},

skeletonLabel: {
  width: 90,
  height: 12,
  borderRadius: 6,
  ...shimmer,
  marginBottom: 10,
},

skeletonInput: {
  width: "100%",
  height: 45,
  borderRadius: 10,
   ...shimmer,
},

skeletonImage: {
  width: "100%",
  height: 90,
  borderRadius: 10,
  ...shimmer,
},

skeletonDrop: {
  width: "100%",
  height: 140,
  borderRadius: 12,
  ...shimmer,
},

skeletonButton: {
  width: "100%",
  height: 50,
  borderRadius: 12,
  ...shimmer,
  },

};
