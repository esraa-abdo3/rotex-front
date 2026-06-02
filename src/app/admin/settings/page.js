// "use client";

// import { useEffect, useRef, useState } from "react";
// import axios from "axios";

// const API = "https://rootex-backend.vercel.app/api/v1";

// const TEXT_FIELDS = [
//   { key: "text1",      label: "Text 1",       desc: "First line of the hero hook" },
//   { key: "text2",      label: "Text 2",       desc: "Second line of the hero hook" },
//   { key: "highlight1", label: "Highlight 1",  desc: "First highlighted word" },
//   { key: "highlight2", label: "Highlight 2",  desc: "Second highlighted word" },
//   { key: "buttonText", label: "Button Text",  desc: "CTA button label" },
// ];

// const COLOR_FIELDS = [
//   { key: "primaryDark",   label: "Primary Dark",    desc: "Main dark background color" },
//   { key: "secondaryDark", label: "Secondary Dark",  desc: "Secondary dark tone" },
//   { key: "primary",       label: "Primary",         desc: "Main brand color" },
//   { key: "gold",          label: "Gold",            desc: "Accent gold color" },
//   { key: "goldLight",     label: "Gold Light",      desc: "Light gold / highlight" },
// ];
// const FONTS = [
//   // عربي
//   "Cairo", "Tajawal", "Almarai", "Amiri", "Lateef","Learning Curve",
//   // سيريف - فرق واضح جداً
//   "Playfair Display", "Cormorant Garamond", "Libre Baskerville", "Lora",
//   // ديسبلاي / شخصية قوية
//   "Oswald", "Bebas Neue", "Abril Fatface", "Righteous",
//   // هاندرايتينج
//   "Pacifico", "Dancing Script", "Satisfy",
//   // مونوسبيس - فرق صارخ
//   "Courier Prime", "Space Mono", "IBM Plex Mono",
// ];
// export default function SettingsPage() {
//   const [loading, setLoading] = useState(true);
//   const [saving,  setSaving]  = useState(false);
//   const [toast,   setToast]   = useState(null);
//   const [fontOpen, setFontOpen] = useState(false);
//   const [heroPreview,   setHeroPreview]   = useState("");
//   const [heroFile,      setHeroFile]      = useState(null);
//  const [resultPreview, setResultPreview] = useState([]);
// const [resultFiles, setResultFiles] = useState([]);
//   const heroRef   = useRef();
//   const resultRef = useRef();
//   const [form, setForm] = useState({
//     text1_ar: "", text1_en: "",
//     text2_ar: "", text2_en: "",
//     highlight1_ar: "", highlight1_en: "",
//     highlight2_ar: "", highlight2_en: "",
//     buttonText_ar: "", buttonText_en: "",
//     primaryDark: "#000000", secondaryDark: "#000000",
//     primary: "#000000", gold: "#000000", goldLight: "#000000",
//     Fontfamily:""
//   });
//  const [existingImages, setExistingImages] = useState([]);

//   const showToast = (msg, ok = true) => {
//     setToast({ msg, ok });
//     setTimeout(() => setToast(null), 3000);
//   };

//   useEffect(() => {
//     axios.get(`${API}/setting`)
//       .then(({ data }) => {
//         const s = data.settings;
//         setForm({
//             Fontfamily:  s?.Fontfamily ||"Cairo",
//           text1_ar:      s?.hook?.text1?.ar      || "",
//           text1_en:      s?.hook?.text1?.en      || "",
//           text2_ar:      s?.hook?.text2?.ar      || "",
//           text2_en:      s?.hook?.text2?.en      || "",
//           highlight1_ar: s?.hook?.highlight1?.ar || "",
//           highlight1_en: s?.hook?.highlight1?.en || "",
//           highlight2_ar: s?.hook?.highlight2?.ar || "",
//           highlight2_en: s?.hook?.highlight2?.en || "",
//           buttonText_ar: s?.buttonText?.ar       || "",
//           buttonText_en: s?.buttonText?.en       || "",
//           primaryDark:   s?.colors?.primaryDark   || "#000000",
//           secondaryDark: s?.colors?.secondaryDark || "#000000",
//           primary:       s?.colors?.primary       || "#000000",
//           gold:          s?.colors?.gold          || "#000000",
//           goldLight: s?.colors?.goldLight || "#000000",
          
//         })
//         setHeroPreview(s?.images?.herosection || "");
//         setExistingImages(s?.images?.resultBg || []);
// setResultPreview(s?.images?.resultBg || []);
      
//       })
//       .catch(() => showToast("Failed to load settings", false))
//       .finally(() => setLoading(false));
//   }, []);
//   useEffect(() => {
//   FONTS.forEach(fontName => {
//     const id = `preview-font-${fontName.replace(/ /g, "-")}`;
//     if (document.getElementById(id)) return;
//     const link = document.createElement("link");
//     link.id = id;
//     link.rel = "stylesheet";
//     link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;700&display=swap`;
//     document.head.appendChild(link);
//   });
// }, []);
//     console.log(form.Fontfamily)

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setSaving(true);

//   try {
//     const fd = new FormData();

//     Object.entries(form).forEach(([key, value]) => {
//       if (value !== "") {
//         fd.append(key, value);
//       }
//     });

//     // Hero Image
//     if (heroFile) {
//       fd.append("herosection", heroFile);
//     }

//     // الصور القديمة اللي لسه موجودة
//     fd.append(
//       "existingResultBg",
//       JSON.stringify(existingImages)
//     );

//     // الصور الجديدة
//     resultFiles.forEach((file) => {
//       fd.append("resultBg", file);
//     });

//     const { data } = await axios.patch(
//       `${API}/setting`,
//       fd,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     setHeroPreview(
//       data.settings?.images?.herosection || heroPreview
//     );

//     setHeroFile(null);

//     setExistingImages(
//       data.settings?.images?.resultBg || []
//     );

//     setResultPreview(
//       data.settings?.images?.resultBg || []
//     );

//     setResultFiles([]);

//     showToast("Settings saved successfully");
//   } catch (err) {
//     console.log(err);

//     showToast(
//       err?.response?.data?.message ||
//       "Something went wrong",
//       false
//     );
//   } finally {
//     setSaving(false);
//   }
// };
// const removeResultImage = (index) => {
//   const image = resultPreview[index];

//   // صورة قديمة من السيرفر
//   if (existingImages.includes(image)) {
//     setExistingImages(prev =>
//       prev.filter(img => img !== image)
//     );
//   }

//   setResultPreview(prev =>
//     prev.filter((_, i) => i !== index)
//   );
// };
//   // ── Skeleton ──────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div style={s.page}>
//         <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
//           <div style={{ ...s.skel, height: 32, width: 220 }} />
//           <div style={{ ...s.skel, height: 16, width: 300 }} />
//         </div>
//         {[1, 2, 3].map((i) => (
//           <div key={i} style={{ ...s.card, display: "flex", flexDirection: "column", gap: 16 }}>
//             <div style={{ ...s.skel, height: 20, width: 120 }} />
//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
//               {Array.from({ length: 4 }).map((_, j) => (
//                 <div key={j} style={{ ...s.skel, height: 42, borderRadius: 10 }} />
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // ── Page ──────────────────────────────────────────────────
//   return (
//     <div style={s.page}>
//       {/* Toast */}
//       {toast && (
//         <div style={{ ...s.toast, background: toast.ok ? "#166534" : "#b91c1c" }}>
//           {toast.ok ? "✓" : "✗"} {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div style={s.pageHeader}>
//         <div>
//           <h1 style={s.title}>Website Settings</h1>
//           <p style={s.subtitle}>Manage hero texts, brand colors, and images</p>
//         </div>
//         <button
//           form="settings-form"
//           type="submit"
//           disabled={saving}
//           style={{ ...s.saveBtn, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}
//         >
//           {saving
//             ? <><span style={s.spinner} /></>
//             : " Save Settings"}
//         </button>
//       </div>

//       <form id="settings-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

//         {/* ── HERO TEXTS ──────────────────── */}
//         <div style={s.card}>
//           <div style={s.cardHeader}>
//             <span style={s.cardIcon}>✍️</span>
//             <div>
//               <h2 style={s.cardTitle}>Hero Texts</h2>
//               <p style={s.cardDesc}>Edit the main headline and CTA copy shown on the homepage</p>
//             </div>
//           </div>

//           <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//             {TEXT_FIELDS.map((field) => (
//               <div key={field.key} style={s.fieldBlock}>
//                 <div style={s.fieldMeta}>
//                   <span style={s.fieldLabel}>{field.label}</span>
//                   <span style={s.fieldDesc}>{field.desc}</span>
//                 </div>
//                 <div style={s.fieldInputs}>
//                   <div style={s.inputGroup}>
//                     <label style={s.inputLabel}>English</label>
//                     <input
//                       type="text"
//                       name={`${field.key}_en`}
//                       value={form[`${field.key}_en`]}
//                       onChange={handleChange}
//                       placeholder={`${field.label} in English`}
//                       style={s.input}
//                     />
//                   </div>
//                   <div style={s.inputGroup}>
//                     <label style={{ ...s.inputLabel, textAlign: "right" }}>عربي</label>
//                     <input
//                       type="text"
//                       name={`${field.key}_ar`}
//                       value={form[`${field.key}_ar`]}
//                       onChange={handleChange}
//                       placeholder={`${field.label} بالعربي`}
//                       dir="rtl"
//                       style={s.input}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ── COLORS ──────────────────────── */}
//         <div style={s.card}>
//           <div style={s.cardHeader}>
//             <span style={s.cardIcon}>🎨</span>
//             <div>
//               <h2 style={s.cardTitle}>Brand Colors</h2>
//               <p style={s.cardDesc}>Pick the color palette used across the whole website</p>
//             </div>
//           </div>

//           <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
//             {COLOR_FIELDS.map((c) => (
//               <div key={c.key} style={s.colorBlock}>
//                 <label style={s.inputLabel}>{c.label}</label>
//                 <p style={{ ...s.fieldDesc, margin: "2px 0 10px" }}>{c.desc}</p>
//                 <div style={s.colorRow}>
//                   <div style={{ position: "relative", flexShrink: 0 }}>
//                     <div style={{ ...s.colorSwatch, background: form[c.key] }} />
//                     <input
//                       type="color"
//                       name={c.key}
//                       value={form[c.key]}
//                       onChange={handleChange}
//                       style={s.colorInput}
//                       title="Pick color"
//                     />
//                   </div>
//                   <input
//                     type="text"
//                     name={c.key}
//                     value={form[c.key]}
//                     onChange={handleChange}
//                     placeholder="#000000"
//                     style={{ ...s.input, flex: 1, fontFamily: "monospace", fontSize: 13 }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
// {/* <label>Font Family</label>
// <select
//   value={form.Fontfamily || "Cairo"}
//   onChange={(e) => setForm(f => ({ ...f, Fontfamily: e.target.value }))}
//   style={{ ...s.input, direction: "ltr" }}
//   size={1}

//   onMouseDown={(e) => {
//     const select = e.currentTarget;
//     const rect = select.getBoundingClientRect();
//     const spaceBelow = window.innerHeight - rect.bottom;
//     const spaceAbove = rect.top;
//     if (spaceBelow < 200 && spaceAbove > spaceBelow) {
//       select.style.position = "relative";
//     }
//   }}
// >
//   {FONTS.map(f => (
//     <option key={f} value={f} style={{ fontFamily: f }}>
//       {f}
//     </option>
//   ))}
// </select>

// <p style={{
//   fontFamily: `'${form.Fontfamily}', sans-serif`,
//   fontSize: 26,
//   fontWeight: 700,
//   marginTop: 8,
//   color: "#222",
//   lineHeight: 1.7,
//   transition: "font-family 0.3s",
//   border: "1px solid #e0e0de",
//   borderRadius: 10,
//   padding: "14px 16px",
//   background: "#fafaf9",
// }}>
//   منتج روتكس للشعر الطبيعي — RooteX Hair 123
// </p> */}
//         <div style={{ position: "relative" }}>
//   {/* Trigger */}
//   <div
//     onClick={() => setFontOpen(o => !o)}
//     style={{
//       ...s.input,
//       cursor: "pointer",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       fontFamily: `'${form.Fontfamily}', sans-serif`,
//       fontSize: 16,
//       fontWeight: 600,
//     }}
//   >
//     <span>{form.Fontfamily || "Cairo"}</span>
//     <span style={{ fontSize: 12, color: "#aaa" }}>{fontOpen ? "▲" : "▼"}</span>
//   </div>

//   {/* Dropdown */}
//   {fontOpen && (
//     <div style={{
//       position: "absolute",
//       bottom: "110%",
//       left: 0, right: 0,
//       background: "white",
//       border: "1px solid #e0e0de",
//       borderRadius: 12,
//       boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
//       zIndex: 999,
//       maxHeight: 320,
//       overflowY: "auto",
//     }}>
//       {FONTS.map(f => (
//         <div
//           key={f}
//           onClick={() => { setForm(p => ({ ...p, Fontfamily: f })); setFontOpen(false); }}
//           style={{
//             padding: "12px 16px",
//             fontFamily: `'${f}', sans-serif`,
//             fontSize: 16,
//             fontWeight: 600,
//             cursor: "pointer",
//             background: form.Fontfamily === f ? "#f5f5f3" : "white",
//             borderBottom: "1px solid #f5f5f3",
//             color: "#111",
//             transition: "background 0.15s",
//           }}
//           onMouseEnter={e => e.currentTarget.style.background = "#fafaf9"}
//           onMouseLeave={e => e.currentTarget.style.background = form.Fontfamily === f ? "#f5f5f3" : "white"}
//         >
//           {/* كل فونت مكتوب بنفسه */}
//           The quick brown fox — أهلاً بالعالم
//           <span style={{ fontSize: 12, color: "#aaa", marginRight: 8, fontFamily: "inherit" }}>
//             {" "}({f})
//           </span>
//         </div>
//       ))}
//     </div>
//   )}
// </div>
//         {/* ── IMAGES ──────────────────────── */}
//         <div style={s.card}>
//           <div style={s.cardHeader}>
//             <span style={s.cardIcon}>🖼️</span>
//             <div>
//               <h2 style={s.cardTitle}>Images</h2>
//               <p style={s.cardDesc}>Upload images used in the hero section and results background</p>
//             </div>
//           </div>

        
//             {/* Hero Image */}
//             <ImageUpload
//               label="Hero Section"
//               desc="Main background or product image on the homepage"
//               preview={heroPreview}
//               fileRef={heroRef}
//               onChange={(file) => {
//                 setHeroFile(file);
//                 setHeroPreview(URL.createObjectURL(file));
//               }}
//               onClear={() => { setHeroFile(null); setHeroPreview(""); }}
//               newFile={heroFile}
//             />

// <div
//   style={{
//     marginTop: 24,
//     paddingTop: 24,
//     borderTop: "1px solid #ececec",
//   }}
// >
//   <div style={{ marginBottom: 16 }}>
//     <p style={s.inputLabel}>RESULT BACKGROUND</p>
//     <p style={s.fieldDesc}>
//       Background images for results / reviews section
//     </p>
//   </div>

//   <div
//     style={{
//       display: "grid",
//       gridTemplateColumns:
//         "repeat(auto-fill,minmax(180px,1fr))",
//       gap: 16,
//     }}
//   >
//     {resultPreview.map((img, index) => (
//       <div
//         key={index}
//         style={{
//           position: "relative",
//           borderRadius: 16,
//           overflow: "hidden",
//           border: "1px solid #e5e5e5",
//           background: "#fff",
//           height: 220,
//         }}
//       >
//         <img
//           src={img}
//           alt=""
//           style={{
//             width: "100%",
//             height: "100%",
//             objectFit: "cover",
//             display: "block",
//           }}
//         />

//         <button
//           type="button"
//           onClick={() => removeResultImage(index)}
//           style={{
//             position: "absolute",
//             top: 10,
//             right: 10,
//             width: 34,
//             height: 34,
//             borderRadius: "50%",
//             border: "none",
//             background: "rgba(0,0,0,.7)",
//             color: "#fff",
//             cursor: "pointer",
//             fontSize: 18,
//             fontWeight: 700,
//             zIndex: 2,
//           }}
//         >
//           ×
//         </button>
//       </div>
//     ))}

//     {/* Add Image Card */}
//     <div
//       onClick={() => resultRef.current?.click()}
//       style={{
//         height: 220,
//         borderRadius: 16,
//         border: "2px dashed #d7d7d7",
//         background: "#fafaf9",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         cursor: "pointer",
//         transition: ".2s",
//       }}
//     >
//       <div
//         style={{
//           width: 52,
//           height: 52,
//           borderRadius: "50%",
//           background: "#f2f2f2",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           fontSize: 26,
//           marginBottom: 10,
//         }}
//       >
//         +
//       </div>

//       <p
//         style={{
//           margin: 0,
//           fontWeight: 600,
//           color: "#333",
//         }}
//       >
//         Add Images
//       </p>

//       <span
//         style={{
//           fontSize: 12,
//           color: "#999",
//           marginTop: 4,
//         }}
//       >
//         Upload multiple files
//       </span>
//     </div>
//   </div>

//   <input
//     ref={resultRef}
//     type="file"
//     multiple
//     accept="image/*"
//     style={{ display: "none" }}
//     onChange={(e) => {
//       const files = Array.from(e.target.files);

//       if (files.length) {
//         setResultFiles((prev) => [
//           ...prev,
//           ...files,
//         ]);

//         setResultPreview((prev) => [
//           ...prev,
//           ...files.map((file) =>
//             URL.createObjectURL(file)
//           ),
//         ]);
//       }

//       e.target.value = "";
//     }}
//   />

//   {resultPreview.length > 0 && (
//     <button
//       type="button"
//       onClick={() => {
//         setResultFiles([]);
//         setResultPreview([]);
//       }}
//       style={{
//         marginTop: 16,
//         ...s.clearBtn,
//       }}
//     >
//       Remove All Images
//     </button>
//   )}
// </div>
//           </div>
      

//         {/* Mobile Save button (bottom) */}
//         <button
//           type="submit"
//           disabled={saving}
//           style={{
//             ...s.saveBtn,
//             width: "100%",
//             justifyContent: "center",
//             opacity: saving ? 0.6 : 1,
//             cursor: saving ? "not-allowed" : "pointer",
//           }}
//         >
//           {saving
//             ? <><span style={s.spinner} /> Saving…</>
//             : "💾 Save Settings"}
//         </button>

//       </form>
//     </div>
//   );
// }

// // ── Image Upload Sub-Component ──────────────────────────────
// function ImageUpload({ label, desc, preview, fileRef, onChange, onClear, newFile }) {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//       <div>
//         <p style={s.inputLabel}>{label}</p>
//         <p style={{ ...s.fieldDesc, marginTop: 2 }}>{desc}</p>
//       </div>

//       {preview ? (
//         <div style={{ position: "relative" }}>
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={preview}
//             alt={label}
//             style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, border: "1px solid #e8e8e6", display: "block" }}
//           />
//           {newFile && (
//             <div style={s.newBadge}>New</div>
//           )}
//         </div>
//       ) : (
//         <div style={s.imagePlaceholder}>
//           <span style={{ fontSize: 32 }}>🖼️</span>
//           <p style={{ margin: "8px 0 0", fontSize: 13, color: "#aaa" }}>No image uploaded</p>
//         </div>
//       )}

//       <div style={{ display: "flex", gap: 8 }}>
//         <button
//           type="button"
//           onClick={() => fileRef.current?.click()}
//           style={s.uploadBtn}
//         >
//           {preview ? "Replace Image" : "Upload Image"}
//         </button>
//         {preview && (
//           <button type="button" onClick={onClear} style={s.clearBtn}>
//             Clear
//           </button>
//         )}
//         <input
//           ref={fileRef}
//           type="file"
//           accept="image/*"
//           style={{ display: "none" }}
//           onChange={(e) => {
//             const file = e.target.files[0];
//             if (file) onChange(file);
//             e.target.value = "";
//           }}
//         />
//       </div>

//       {newFile && (
//         <p style={{ fontSize: 12, color: "#b45309", background: "#fffbeb", padding: "6px 10px", borderRadius: 8, margin: 0 }}>
//           ⚠️ New file selected: <strong>{newFile.name}</strong> — will upload on save
//         </p>
//       )}
//     </div>
//   );
// }

// // ── Styles ─────────────────────────────────────────────────
// const s = {
//   page: {
//     display: "flex", flexDirection: "column", gap: 24,
//     fontFamily: "'DM Sans', sans-serif", position: "relative",
//     maxWidth: "100%",
//   },
//   toast: {
//     position: "fixed", top: 20, right: 24, color: "white",
//     padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 500,
//     zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
//     display: "flex", alignItems: "center", gap: 8,
//   },
//   pageHeader: {
//     display: "flex", alignItems: "flex-start",
//     justifyContent: "space-between", flexWrap: "wrap", gap: 16,
//   },
//   title:    { fontSize: 26, fontWeight: 700, color: "#111", margin: 0 },
//   subtitle: { color: "#888", fontSize: 14, margin: "4px 0 0" },
//   saveBtn: {
//     display: "inline-flex", alignItems: "center", gap: 8,
//     padding: "11px 22px", background: "#1a1f0e", color: "white",
//     border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
//     transition: "opacity 0.2s", whiteSpace: "nowrap",
//   },
//   spinner: {
//     display: "inline-block", width: 14, height: 14,
//     border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
//     borderRadius: "50%", animation: "spin 0.8s linear infinite",
//   },
//   card: {
//     background: "white", borderRadius: 14,
//     border: "1px solid #e8e8e6", padding: "22px 24px",
//     display: "flex", flexDirection: "column", gap: 20,
//   },
//   cardHeader: { display: "flex", alignItems: "flex-start", gap: 14 },
//   cardIcon:   { fontSize: 22, marginTop: 1, flexShrink: 0 },
//   cardTitle:  { fontSize: 16, fontWeight: 600, color: "#111", margin: 0 },
//   cardDesc:   { fontSize: 13, color: "#999", margin: "3px 0 0" },

//   fieldBlock: {
//     display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap",
//     paddingBottom: 16, borderBottom: "1px solid #f5f5f3",
//   },
//   fieldMeta:   { width: 160, flexShrink: 0 },
//   fieldLabel:  { fontSize: 14, fontWeight: 600, color: "#333", display: "block" },
//   fieldDesc:   { fontSize: 12, color: "#aaa", marginTop: 3, display: "block" },
//   fieldInputs: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, minWidth: 260 },

//   inputGroup: { display: "flex", flexDirection: "column", gap: 5 },
//   inputLabel: { fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.4px" },
//   input: {
//     padding: "10px 12px", borderRadius: 10,
//     border: "1px solid #e0e0de", fontSize: 14, outline: "none",
//     background: "#fafaf9", fontFamily: "inherit", width: "100%",
//     boxSizing: "border-box", transition: "border-color 0.2s",
//     color:"black"
//   },

//   colorBlock: { display: "flex", flexDirection: "column" },
//   colorRow:   { display: "flex", alignItems: "center", gap: 10 },
//   colorSwatch: {
//     width: 42, height: 42, borderRadius: 10,
//     border: "1px solid #e0e0de", cursor: "pointer",
//     transition: "transform 0.15s",
//   },
//   colorInput: {

//     position: "absolute", inset: 0, opacity: 0,
//     width: "100%", height: "100%", cursor: "pointer", border: "none",
//   },

//   imagePlaceholder: {
//     width: "100%", height: 180, background: "#fafaf9",
//     borderRadius: 12, border: "2px dashed #e0e0de",
//     display: "flex", flexDirection: "column",
//     alignItems: "center", justifyContent: "center",
//   },
//   newBadge: {
//     position: "absolute", top: 8, right: 8,
//     background: "#1a1f0e", color: "white",
//     fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20,
//   },
//   uploadBtn: {
//     flex: 1, padding: "9px 14px", background: "#f5f5f3",
//     border: "1px solid #e0e0de", borderRadius: 9,
//     fontSize: 13, fontWeight: 500, cursor: "pointer",
//     color: "#333", transition: "background 0.2s",
//   },
//   clearBtn: {
//     padding: "9px 14px", background: "#fef2f2",
//     border: "none", borderRadius: 9,
//     fontSize: 13, fontWeight: 500, cursor: "pointer",
//     color: "#b91c1c",
//   },

//   skel: { background: "#f0f0ef", borderRadius: 8, display: "block" },
// };
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  { key: "primaryDark",   label: "Primary Dark",   desc: "Main dark background" },
  { key: "secondaryDark", label: "Secondary Dark",  desc: "Secondary dark tone" },
  { key: "primary",       label: "Primary",         desc: "Main brand color" },
  { key: "gold",          label: "Gold",            desc: "Accent gold color" },
  { key: "goldLight",     label: "Gold Light",      desc: "Light gold / highlight" },
];

const FONTS = [
  "Cairo", "Tajawal", "Almarai", "Amiri", "Lateef",
  "Playfair Display", "Cormorant Garamond", "Libre Baskerville", "Lora",
  "Oswald", "Bebas Neue", "Abril Fatface", "Righteous",
  "Pacifico", "Dancing Script", "Satisfy",
  "Courier Prime", "Space Mono", "IBM Plex Mono",
];

/* ─────────────────────────────────────────────
   Each image in our state has this shape:
   { id, src, type: "existing"|"new", file? }
───────────────────────────────────────────── */
let _uid = 0;
const uid = () => `img_${++_uid}`;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);
  const [fontOpen, setFontOpen] = useState(false);

  const heroRef   = useRef();
  const resultRef = useRef();

  const [heroPreview, setHeroPreview] = useState("");
  const [heroFile,    setHeroFile]    = useState(null);

  // unified list: [{id, src, type, file?}]
  const [resultImages, setResultImages] = useState([]);

  const [form, setForm] = useState({
    text1_ar: "", text1_en: "",
    text2_ar: "", text2_en: "",
    highlight1_ar: "", highlight1_en: "",
    highlight2_ar: "", highlight2_en: "",
    buttonText_ar: "", buttonText_en: "",
    primaryDark: "#000000", secondaryDark: "#000000",
    primary: "#000000", gold: "#000000", goldLight: "#000000",
    Fontfamily: "Cairo",
  });

  // ── Toast ──
  const showToast = useCallback((msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Load ──
  useEffect(() => {
    axios.get(`${API}/setting`)
      .then(({ data }) => {
        console.log(data)
        const s = data.settings;
        setForm({
          Fontfamily:    s?.Fontfamily         || "Cairo",
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
        const existing = (s?.images?.resultBg || []).map(url => ({
          id: uid(), src: url, type: "existing",
        }));
        setResultImages(existing);
      })
      .catch(() => showToast("Failed to load settings", false))
      .finally(() => setLoading(false));
  }, [showToast]);

  // ── Preload fonts ──
  useEffect(() => {
    FONTS.forEach(f => {
      const id = `gf-${f.replace(/ /g, "-")}`;
      if (document.getElementById(id)) return;
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${f.replace(/ /g, "+")}:wght@400;700&display=swap`;
      document.head.appendChild(link);
    });
  }, []);

  // ── Handlers ──
  const handleChange = e =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const addResultImages = files => {
    const items = files.map(file => ({
      id: uid(),
      src: URL.createObjectURL(file),
      type: "new",
      file,
    }));
    setResultImages(p => [...p, ...items]);
  };

  const removeResultImage = id =>
    setResultImages(p => p.filter(img => img.id !== id));

  const clearAllResultImages = () => setResultImages([]);

  // ── Submit ──
  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();

      // text / color / font fields
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") fd.append(k, v);
      });

      // hero image
      if (heroFile) fd.append("herosection", heroFile);

      // existing URLs to keep
      const existingUrls = resultImages
        .filter(img => img.type === "existing")
        .map(img => img.src);
      fd.append("existingResultBg", JSON.stringify(existingUrls));

      // new files
      resultImages
        .filter(img => img.type === "new")
        .forEach(img => fd.append("resultBg", img.file));

      const { data } = await axios.patch(`${API}/setting`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // sync state with server response
      setHeroPreview(data.settings?.images?.herosection || heroPreview);
      setHeroFile(null);
      const synced = (data.settings?.images?.resultBg || []).map(url => ({
        id: uid(), src: url, type: "existing",
      }));
      setResultImages(synced);

      showToast("Settings saved successfully ✓");
    } catch (err) {
      showToast(err?.response?.data?.message || "Something went wrong", false);
    } finally {
      setSaving(false);
    }
  };

  // ── Skeleton ──
  if (loading) return (
    <div style={css.page}>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:8 }}>
        <div style={{ ...css.skel, height:32, width:220 }} />
        <div style={{ ...css.skel, height:16, width:300 }} />
      </div>
      {[1,2,3].map(i => (
        <div key={i} style={{ ...css.card, gap:16 }}>
          <div style={{ ...css.skel, height:20, width:140 }} />
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {Array.from({length:4}).map((_,j) => (
              <div key={j} style={{ ...css.skel, height:42, borderRadius:10 }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const newCount = resultImages.filter(i => i.type === "new").length;

  // ── Page ──
  return (
    <div style={css.page}>
      {/* Toast */}
      {toast && (
        <div style={{ ...css.toast, background: toast.ok ? "#14532d" : "#991b1b" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={css.pageHeader}>
        <div>
          <h1 style={css.title}>Website Settings</h1>
          <p style={css.subtitle}>Hero texts · Brand colors · Images · Font</p>
        </div>
        <button form="settings-form" type="submit" disabled={saving}
          style={{ ...css.saveBtn, opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
          {saving ? <><Spinner /> Saving…</> : "💾 Save Settings"}
        </button>
      </div>

      <form id="settings-form" onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:20 }}>

        {/* ── Hero Texts ── */}
        <Section icon="✍️" title="Hero Texts" desc="Main headline and CTA copy shown on the homepage">
          {TEXT_FIELDS.map(field => (
            <div key={field.key} style={css.fieldBlock}>
              <div style={css.fieldMeta}>
                <span style={css.fieldLabel}>{field.label}</span>
                <span style={css.fieldDesc}>{field.desc}</span>
              </div>
              <div style={css.fieldInputs}>
                <div style={css.inputGroup}>
                  <label style={css.inputLabel}>English</label>
                  <input type="text" name={`${field.key}_en`}
                    value={form[`${field.key}_en`]} onChange={handleChange}
                    placeholder={`${field.label} in English`} style={css.input} />
                </div>
                <div style={css.inputGroup}>
                  <label style={{ ...css.inputLabel, textAlign:"right" }}>عربي</label>
                  <input type="text" name={`${field.key}_ar`}
                    value={form[`${field.key}_ar`]} onChange={handleChange}
                    placeholder={`${field.label} بالعربي`} dir="rtl" style={css.input} />
                </div>
              </div>
            </div>
          ))}
        </Section>

        {/* ── Brand Colors ── */}
        <Section icon="🎨" title="Brand Colors" desc="Color palette used across the whole website">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16 }}>
            {COLOR_FIELDS.map(c => (
              <div key={c.key} style={css.colorBlock}>
                <label style={css.inputLabel}>{c.label}</label>
                <p style={{ ...css.fieldDesc, margin:"2px 0 10px" }}>{c.desc}</p>
                <div style={css.colorRow}>
                  <div style={{ position:"relative", flexShrink:0 }}>
                    <div style={{ ...css.colorSwatch, background: form[c.key] }} />
                    <input type="color" name={c.key} value={form[c.key]}
                      onChange={handleChange} style={css.colorInput} />
                  </div>
                  <input type="text" name={c.key} value={form[c.key]}
                    onChange={handleChange} placeholder="#000000"
                    style={{ ...css.input, flex:1, fontFamily:"monospace", fontSize:13 }} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Font Family ── */}
        <Section icon="🔤" title="Font Family" desc="Choose the typeface for the whole website">
          <div style={{ position:"relative" }}>
            <div onClick={() => setFontOpen(o => !o)} style={{
              ...css.input, cursor:"pointer", display:"flex",
              justifyContent:"space-between", alignItems:"center",
              fontFamily:`'${form.Fontfamily}', sans-serif`, fontSize:16, fontWeight:600,
            }}>
              <span>{form.Fontfamily || "Cairo"}</span>
              <span style={{ fontSize:12, color:"#aaa" }}>{fontOpen ? "▲" : "▼"}</span>
            </div>

            {fontOpen && (
              <div style={css.fontDropdown}>
                {FONTS.map(f => (
                  <div key={f}
                    onClick={() => { setForm(p => ({ ...p, Fontfamily: f })); setFontOpen(false); }}
                    style={{
                      padding:"12px 16px",
                      fontFamily:`'${f}', sans-serif`,
                      fontSize:15, fontWeight:600,
                      cursor:"pointer",
                      background: form.Fontfamily === f ? "#f5f5f3" : "white",
                      borderBottom:"1px solid #f5f5f3",
                      color:"#111",
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fafaf9"}
                    onMouseLeave={e => e.currentTarget.style.background = form.Fontfamily === f ? "#f5f5f3" : "white"}
                  >
                    <span>The quick brown fox — أهلاً بالعالم</span>
                    <span style={{ fontSize:11, color:"#bbb", fontFamily:"sans-serif", marginLeft:8 }}>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div style={{
            fontFamily:`'${form.Fontfamily}', sans-serif`,
            fontSize:22, fontWeight:700, color:"#1a1a1a",
            background:"#fafaf9", border:"1px solid #e8e8e6",
            borderRadius:12, padding:"16px 20px", lineHeight:1.8,
            transition:"font-family 0.25s",
          }}>
            منتج روتكس للشعر الطبيعي — RooteX Natural Hair
          </div>
        </Section>

        {/* ── Images ── */}
        <Section icon="🖼️" title="Images" desc="Hero section image and results background gallery">

          {/* Hero */}
          <div style={css.fieldBlock}>
            <div style={css.fieldMeta}>
              <span style={css.fieldLabel}>Hero Image</span>
              <span style={css.fieldDesc}>Main homepage background / product image</span>
            </div>
            <div style={{ flex:1, minWidth:260 }}>
              {heroPreview ? (
                <div style={{ position:"relative", marginBottom:10 }}>
                  <img src={heroPreview} alt="hero"
                    style={{ width:"100%", height:180, objectFit:"cover", borderRadius:12,
                      border:"1px solid #e8e8e6", display:"block" }} />
                  {heroFile && <div style={css.newBadge}>New</div>}
                </div>
              ) : (
                <div style={css.imagePlaceholder}>
                  <span style={{ fontSize:32 }}>🖼️</span>
                  <p style={{ margin:"8px 0 0", fontSize:13, color:"#aaa" }}>No image uploaded</p>
                </div>
              )}
              <div style={{ display:"flex", gap:8, marginTop:8 }}>
                <button type="button" onClick={() => heroRef.current?.click()} style={css.uploadBtn}>
                  {heroPreview ? "Replace Image" : "Upload Image"}
                </button>
                {heroPreview && (
                  <button type="button"
                    onClick={() => { setHeroFile(null); setHeroPreview(""); }}
                    style={css.clearBtn}>Clear</button>
                )}
              </div>
              {heroFile && (
                <p style={css.newFileBadge}>
                  ⚠️ New file: <strong>{heroFile.name}</strong> — will upload on save
                </p>
              )}
              <input ref={heroRef} type="file" accept="image/*" style={{ display:"none" }}
                onChange={e => {
                  const f = e.target.files[0];
                  if (f) { setHeroFile(f); setHeroPreview(URL.createObjectURL(f)); }
                  e.target.value = "";
                }} />
            </div>
          </div>

          {/* Result Backgrounds */}
          <div style={{ paddingTop:20, borderTop:"1px solid #ececec" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
              <div>
                <p style={{ ...css.inputLabel, margin:0 }}>Result Background Images</p>
                <p style={{ ...css.fieldDesc, marginTop:3 }}>
                  Background gallery for results / reviews section
                  {resultImages.length > 0 && (
                    <span style={{ marginLeft:8, background:"#e8e8e6", borderRadius:20,
                      padding:"1px 8px", fontWeight:600, color:"#555" }}>
                      {resultImages.length} image{resultImages.length !== 1 ? "s" : ""}
                      {newCount > 0 && ` · ${newCount} new`}
                    </span>
                  )}
                </p>
              </div>
              {resultImages.length > 0 && (
                <button type="button" onClick={clearAllResultImages} style={css.clearBtn}>
                  Remove All
                </button>
              )}
            </div>

            {/* Grid */}
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",
              gap:14,
            }}>
              {/* Existing / New images */}
              {resultImages.map(img => (
                <div key={img.id} style={css.thumbCard}>
                  <img src={img.src} alt=""
                    style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />

                  {/* Badge */}
                  {img.type === "new" && (
                    <div style={{ ...css.newBadge, top:8, left:8, right:"auto" }}>New</div>
                  )}

                  {/* Remove */}
                  <button type="button" onClick={() => removeResultImage(img.id)}
                    style={css.thumbRemove}>×</button>
                </div>
              ))}

              {/* Add card */}
              <div onClick={() => resultRef.current?.click()} style={css.addCard}>
                <div style={css.addIcon}>+</div>
                <p style={{ margin:0, fontWeight:600, color:"#444", fontSize:13 }}>Add Images</p>
                <span style={{ fontSize:11, color:"#aaa", marginTop:3 }}>Multiple files OK</span>
              </div>
            </div>

            <input ref={resultRef} type="file" multiple accept="image/*"
              style={{ display:"none" }}
              onChange={e => {
                const files = Array.from(e.target.files);
                if (files.length) addResultImages(files);
                e.target.value = "";
              }} />
          </div>
        </Section>

        {/* Mobile save */}
        <button type="submit" disabled={saving} style={{
          ...css.saveBtn, width:"100%", justifyContent:"center",
          opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer",
        }}>
          {saving ? <><Spinner /> Saving…</> : "💾 Save Settings"}
        </button>
      </form>
    </div>
  );
}

// ── Section Wrapper ─────────────────────────────────────────
function Section({ icon, title, desc, children }) {
  return (
    <div style={css.card}>
      <div style={css.cardHeader}>
        <span style={css.cardIcon}>{icon}</span>
        <div>
          <h2 style={css.cardTitle}>{title}</h2>
          <p style={css.cardDesc}>{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// ── Spinner ─────────────────────────────────────────────────
function Spinner() {
  return <span style={css.spinner} />;
}

// ── Styles ──────────────────────────────────────────────────
const css = {
  page: {
    display:"flex", flexDirection:"column", gap:24,
    fontFamily:"'DM Sans', sans-serif", position:"relative", maxWidth:"100%",
  },
  toast: {
    position:"fixed", top:20, right:24, color:"white",
    padding:"12px 20px", borderRadius:10, fontSize:14, fontWeight:500,
    zIndex:9999, boxShadow:"0 4px 20px rgba(0,0,0,0.15)",
  },
  pageHeader: {
    display:"flex", alignItems:"flex-start",
    justifyContent:"space-between", flexWrap:"wrap", gap:16,
  },
  title:    { fontSize:26, fontWeight:700, color:"#111", margin:0 },
  subtitle: { color:"#888", fontSize:14, margin:"4px 0 0" },
  saveBtn: {
    display:"inline-flex", alignItems:"center", gap:8,
    padding:"11px 22px", background:"#1a1f0e", color:"white",
    border:"none", borderRadius:10, fontSize:14, fontWeight:600,
    transition:"opacity 0.2s", whiteSpace:"nowrap",
  },
  spinner: {
    display:"inline-block", width:14, height:14,
    border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"white",
    borderRadius:"50%", animation:"spin 0.8s linear infinite",
  },
  card: {
    background:"white", borderRadius:14, border:"1px solid #e8e8e6",
    padding:"22px 24px", display:"flex", flexDirection:"column", gap:20,
  },
  cardHeader: { display:"flex", alignItems:"flex-start", gap:14 },
  cardIcon:   { fontSize:22, marginTop:2, flexShrink:0 },
  cardTitle:  { fontSize:16, fontWeight:600, color:"#111", margin:0 },
  cardDesc:   { fontSize:13, color:"#999", margin:"3px 0 0" },

  fieldBlock: {
    display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap",
    paddingBottom:16, borderBottom:"1px solid #f5f5f3",
  },
  fieldMeta:   { width:160, flexShrink:0 },
  fieldLabel:  { fontSize:14, fontWeight:600, color:"#333", display:"block" },
  fieldDesc:   { fontSize:12, color:"#aaa", marginTop:3, display:"block" },
  fieldInputs: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, flex:1, minWidth:260 },

  inputGroup: { display:"flex", flexDirection:"column", gap:5 },
  inputLabel: { fontSize:11, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:"0.4px" },
  input: {
    padding:"10px 12px", borderRadius:10, border:"1px solid #e0e0de",
    fontSize:14, outline:"none", background:"#fafaf9",
    fontFamily:"inherit", width:"100%", boxSizing:"border-box",
    transition:"border-color 0.2s", color:"black",
  },

  colorBlock: { display:"flex", flexDirection:"column" },
  colorRow:   { display:"flex", alignItems:"center", gap:10 },
  colorSwatch: { width:42, height:42, borderRadius:10, border:"1px solid #e0e0de", cursor:"pointer" },
  colorInput: { position:"absolute", inset:0, opacity:0, width:"100%", height:"100%", cursor:"pointer", border:"none" },

  fontDropdown: {
    position:"absolute", bottom:"110%", left:0, right:0,
    background:"white", border:"1px solid #e0e0de", borderRadius:12,
    boxShadow:"0 8px 32px rgba(0,0,0,0.12)", zIndex:999,
    maxHeight:320, overflowY:"auto",
  },

  imagePlaceholder: {
    width:"100%", height:180, background:"#fafaf9",
    borderRadius:12, border:"2px dashed #e0e0de",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
  },
  newBadge: {
    position:"absolute", top:8, right:8,
    background:"#1a1f0e", color:"white",
    fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:20,
  },
  newFileBadge: {
    fontSize:12, color:"#b45309", background:"#fffbeb",
    padding:"6px 10px", borderRadius:8, margin:"8px 0 0",
  },
  uploadBtn: {
    flex:1, padding:"9px 14px", background:"#f5f5f3",
    border:"1px solid #e0e0de", borderRadius:9,
    fontSize:13, fontWeight:500, cursor:"pointer", color:"#333",
  },
  clearBtn: {
    padding:"9px 14px", background:"#fef2f2",
    border:"none", borderRadius:9,
    fontSize:13, fontWeight:500, cursor:"pointer", color:"#b91c1c",
  },

  // Result image grid
  thumbCard: {
    position:"relative", borderRadius:14, overflow:"hidden",
    border:"1px solid #e5e5e5", background:"#fff", height:200,
  },
  thumbRemove: {
    position:"absolute", top:8, right:8,
    width:30, height:30, borderRadius:"50%",
    border:"none", background:"rgba(0,0,0,0.65)",
    color:"#fff", cursor:"pointer",
    fontSize:18, fontWeight:700,
    display:"flex", alignItems:"center", justifyContent:"center",
    lineHeight:1, zIndex:2,
  },
  addCard: {
    height:200, borderRadius:14, border:"2px dashed #d7d7d7",
    background:"#fafaf9", display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center", cursor:"pointer",
    transition:"border-color 0.2s, background 0.2s",
    gap:4,
  },
  addIcon: {
    width:48, height:48, borderRadius:"50%", background:"#efefef",
    display:"flex", alignItems:"center", justifyContent:"center",
    fontSize:24, marginBottom:6, color:"#555",
  },

  skel: { background:"#f0f0ef", borderRadius:8, display:"block" },
};