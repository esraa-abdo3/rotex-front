// "use client";
// import { useSettings } from "@/app/providers/SettingsProvider";
// import { useLang } from "@/app/providers/LanguageProvider";
// import { useEffect, useState, useRef } from "react";

// export default function Review({ reviewss }) {
//   const settings = useSettings();
//   const { lang } = useLang();

//   const [reviews] = useState(reviewss ?? []);
//   const [current, setCurrent] = useState(0);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStartX, setDragStartX] = useState(0);
//   const [dragDeltaX, setDragDeltaX] = useState(0);
//   const sliderRef = useRef(null);

//   // ── لو أكتر من 3 → slider ─────────────────────────────────────────────────
//   const isSlider = reviews.length > 3;

//   const handleScroll = () =>
//     document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });

//   const t = {
//     label: { ar: "آراء العملاء",               en: "Customer Reviews" },
//     title: { ar: "البنات اللي جرّبوا",         en: "Girls who tried" },
//     felt:  { ar: "حسّوا بالفرق",               en: "felt the difference" },
//     cta:   { ar: "ابدئي رحلتك مع RooteX الآن", en: "Start your RooteX journey now" },
//     fans:  { ar: "بنت حبّوا النتيجة 💛",        en: "girls loved the results 💛" },
//     empty: { ar: "لا توجد تقييمات بعد",         en: "No reviews yet" },
//   };

//   // ── Slider nav ────────────────────────────────────────────────────────────
//   const prev = () => setCurrent((c) => Math.max(0, c - 1));
//   const next = () => setCurrent((c) => Math.min(reviews.length - 1, c + 1));

//   // ── Drag / swipe ──────────────────────────────────────────────────────────
//   const onPointerDown = (e) => {
//     setIsDragging(true);
//     setDragStartX(e.clientX);
//     setDragDeltaX(0);
//     sliderRef.current?.setPointerCapture(e.pointerId);
//   };
//   const onPointerMove = (e) => {
//     if (!isDragging) return;
//     setDragDeltaX(e.clientX - dragStartX);
//   };
//   const onPointerUp = () => {
//     if (!isDragging) return;
//     setIsDragging(false);
//     if (dragDeltaX < -60) next();
//     else if (dragDeltaX > 60) prev();
//     setDragDeltaX(0);
//   };

//   // ── Auto-advance ──────────────────────────────────────────────────────────
//   useEffect(() => {
//     if (!isSlider || reviews.length < 2) return;
//     const id = setInterval(
//       () => setCurrent((c) => (c + 1) % reviews.length),
//       5000
//     );
//     return () => clearInterval(id);
//   }, [isSlider, reviews.length]);

//   if (!settings) return null;

//   const gold     = settings.colors?.gold         ?? "#c8a93e";
//   const goldLight= settings.colors?.goldLight    ?? "#d4b84a";
//   const primary  = settings.colors?.primary      ?? "#3a4520";
//   const secDark  = settings.colors?.secondaryDark ?? "#2d3518";
//   const dir      = lang === "ar" ? "rtl" : "ltr";

//   // ── Stars ─────────────────────────────────────────────────────────────────
//   const Stars = ({ rating = 5 }) => {
//     const n = Math.min(5, Math.max(1, rating));
//     return (
//       <span style={{ color: gold, letterSpacing: 3, fontSize: 17 }}>
//         {"★".repeat(n)}{"☆".repeat(5 - n)}
//       </span>
//     );
//   };

//   // ── Single card ───────────────────────────────────────────────────────────
//   const ReviewCard = ({ review, extraStyle = {} }) => (
//     <div style={{ ...cardBase, ...extraStyle }}>
//       {/* Top row: stars + badge */}
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <Stars rating={review.rating} />
//         <span style={{
//           fontSize: 11, fontWeight: 700, letterSpacing: 1,
//           color: gold, background: `${gold}22`,
//           padding: "3px 10px", borderRadius: 20,
//         }}>
//           {review.rating}.0 / 5
//         </span>
//       </div>

//       {/* Review text */}
//       <p style={{
//         fontSize: 15, lineHeight: 1.85, margin: 0, flex: 1,
//         color: primary, opacity: 0.9,
//         fontFamily: lang === "ar" ? "serif" : "inherit",
//       }}>
//         {review.review}
//       </p>

//       {/* Author */}
//       <div style={{
//         display: "flex", alignItems: "center", gap: 10,
//         paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)",
//       }}>
//         <div style={{
//           width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
//           background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           fontSize: 13, fontWeight: 800, color: "#1a1a0a",
//         }}>
//           {review.name?.[0]?.toUpperCase() ?? "?"}
//         </div>
//         <span style={{ fontWeight: 700, fontSize: 14, color: goldLight }}>
//           — {review.name}
//         </span>
//       </div>
//     </div>
//   );

//   return (
//     <section
//       id="reviews"
//       style={{ padding: "80px 20px", direction: dir }}
//     >
//       <style>{`
//         @keyframes shimmer-move {
//           0%   { background-position: 200% 0; }
//           100% { background-position: -200% 0; }
//         }

//         /* ── scrollbar completely hidden ── */
//         .rv-track::-webkit-scrollbar { display: none; }
//         .rv-track { -ms-overflow-style: none; scrollbar-width: none; }

//         .rv-dot   { transition: all 0.25s; cursor: pointer; }
//         .rv-dot:hover { opacity: 0.75; transform: scale(1.2); }

//         .rv-arrow {
//           transition: background 0.2s, transform 0.15s, opacity 0.2s;
//           cursor: pointer;
//         }
//         .rv-arrow:hover:not(:disabled) {
//           transform: translateY(-50%) scale(1.1) !important;
//         }
//         .rv-arrow:active:not(:disabled) {
//           transform: translateY(-50%) scale(0.93) !important;
//         }

//         /* subtle card hover lift — flex grid only */
//         .rv-card-lift:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 18px 50px rgba(0,0,0,0.35) !important;
//         }
//       `}</style>

//       <div style={{ maxWidth: 1200, margin: "0 auto" }}>

//         {/* ── Header ── */}
//         <div style={{ textAlign: "center", marginBottom: 52 }}>
//           <p style={{
//             fontSize: 11, letterSpacing: 5, color: gold,
//             textTransform: "uppercase", fontWeight: 700,
//             margin: "0 0 14px",
//           }}>
//             {t.label[lang]}
//           </p>
//           <h2 style={{
//             fontSize: "clamp(26px, 4.5vw, 46px)",
//             fontWeight: 800, lineHeight: 1.3, margin: 0,
//             color: primary,
//           }}>
//             {t.title[lang]}{" "}
//             Roote<span style={{ color: gold }}>x</span>{" "}
//             {t.felt[lang]}
//           </h2>
//         </div>

//         {/* ── Cards area ── */}
//         {reviews.length === 0 ? (
//           <div style={{
//             ...cardBase, textAlign: "center",
//             padding: "60px 24px",
//             color: "rgba(255,255,255,0.35)", fontSize: 15,
//           }}>
//             {t.empty[lang]}
//           </div>

//         ) : isSlider ? (
//           /* ════════════════ SLIDER (> 3 reviews) ════════════════ */
//           <div style={{ position: "relative", padding: "0 52px" }}>

//             {/* Track */}
//             <div
//               ref={sliderRef}
//               onPointerDown={onPointerDown}
//               onPointerMove={onPointerMove}
//               onPointerUp={onPointerUp}
//               onPointerCancel={onPointerUp}
//               style={{
//                 overflow: "hidden",
//                 borderRadius: 28,
//                 cursor: isDragging ? "grabbing" : "grab",
//                 userSelect: "none",
//               }}
//             >
//               <div style={{
//                 display: "flex",
//                 transform: `translateX(calc(${dir === "rtl" ? "" : "-"}${current * 100}% + ${dragDeltaX}px))`,
//                 transition: isDragging
//                   ? "none"
//                   : "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
//                 willChange: "transform",
//               }}>
//                 {reviews.map((r) => (
//                   <ReviewCard
//                     key={r._id}
//                     review={r}
//                     extraStyle={{
//                       flex: "0 0 100%",
//                       minWidth: "100%",
//                       boxSizing: "border-box",
//                     }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* ── Arrow: prev ── */}
//             <button
//               className="rv-arrow"
//               onClick={dir === "rtl" ? next : prev}
//               disabled={current === (dir === "rtl" ? reviews.length - 1 : 0)}
//               style={{
//                 ...arrowBtn(gold),
//                 [dir === "rtl" ? "right" : "left"]: 0,
//                 opacity: current === (dir === "rtl" ? reviews.length - 1 : 0) ? 0.3 : 1,
//               }}
//             >
//               {dir === "rtl" ? "›" : "‹"}
//             </button>

//             {/* ── Arrow: next ── */}
//             <button
//               className="rv-arrow"
//               onClick={dir === "rtl" ? prev : next}
//               disabled={current === (dir === "rtl" ? 0 : reviews.length - 1)}
//               style={{
//                 ...arrowBtn(gold),
//                 [dir === "rtl" ? "left" : "right"]: 0,
//                 opacity: current === (dir === "rtl" ? 0 : reviews.length - 1) ? 0.3 : 1,
//               }}
//             >
//               {dir === "rtl" ? "‹" : "›"}
//             </button>

//             {/* ── Dots ── */}
//             <div style={{
//               display: "flex", justifyContent: "center",
//               gap: 8, marginTop: 24,
//             }}>
//               {reviews.map((_, i) => (
//                 <div
//                   key={i}
//                   className="rv-dot"
//                   onClick={() => setCurrent(i)}
//                   style={{
//                     height: 8,
//                     width: i === current ? 28 : 8,
//                     borderRadius: 4,
//                     background: i === current ? gold : `${gold}40`,
//                     boxShadow: i === current ? `0 0 8px ${gold}88` : "none",
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//         ) : (
//           /* ════════════════ FLEX GRID (≤ 3 reviews) ════════════════ */
//           <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
//             {reviews.map((r) => (
//               <ReviewCard
//                 key={r._id}
//                 review={r}
//                 extraStyle={{
//                   flex: "1 1 280px",
//                   className: "rv-card-lift",
//                 }}
//               />
//             ))}
//           </div>
//         )}

     
//         <div style={{
//           marginTop: 52, borderRadius: 32,
//           background: `linear-gradient(135deg, ${secDark}, ${primary})`,
//           border: "1px solid rgba(255,255,255,0.1)",
//           overflow: "hidden",
//         }}>
//           <div style={{
//             display: "flex", alignItems: "center",
//             justifyContent: "space-between",
//             flexWrap: "wrap", gap: 24,
//             padding: "32px 40px",
//           }}>
//             <div>
//               <div style={{
//                 fontSize: 50, fontWeight: 900,
//                 color: gold, lineHeight: 1,
//                 textShadow: `0 0 30px ${gold}55`,
//               }}>
//                 +1000
//               </div>
//               <div style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
//                 {t.fans[lang]}
//               </div>
//             </div>

//             <button
//               onClick={handleScroll}
//               style={{
//                 padding: "14px 38px", borderRadius: 50,
//                 background: `linear-gradient(to right, ${gold}, ${goldLight})`,
//                 color: "#1a1a0a", fontWeight: 800, fontSize: 16,
//                 border: "none", cursor: "pointer",
//                 boxShadow: `0 10px 30px ${gold}44`,
//                 transition: "transform 0.2s, box-shadow 0.2s",
//                 fontFamily: "inherit",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.transform = "scale(1.05)";
//                 e.currentTarget.style.boxShadow = `0 16px 40px ${gold}55`;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = "scale(1)";
//                 e.currentTarget.style.boxShadow = `0 10px 30px ${gold}44`;
//               }}
//             >
//               {t.cta[lang]}
//             </button>
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }

// // ── Shared base styles ─────────────────────────────────────────────────────────
// const cardBase = {
//   background: "rgba(255,255,255,0.04)",
//   border: "1px solid rgba(255,255,255,0.1)",
//   borderRadius: 28,
//   padding: "26px 28px",
//   backdropFilter: "blur(14px)",
//   boxShadow: "0 10px 40px rgba(0,0,0,0.22)",
//   display: "flex", flexDirection: "column", gap: 14,
//   transition: "transform 0.3s ease, box-shadow 0.3s ease",
// };

// const arrowBtn = (gold) => ({
//   position: "absolute",
//   top: "40%",                          // فوق الـ dots بشوية
//   transform: "translateY(-50%)",
//   width: 44, height: 44,
//   borderRadius: "50%",
//   display: "flex", alignItems: "center", justifyContent: "center",
//   fontSize: 22, fontWeight: 700,
//   background: `${gold}22`,
//   border: `1.5px solid ${gold}66`,
//   color: gold,
//   cursor: "pointer",
//   zIndex: 2,
//   boxShadow: `0 4px 16px ${gold}22`,
// });
"use client";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import { useEffect, useState, useRef } from "react";

export default function Review({ reviewss }) {
  const settings = useSettings();
  const { lang } = useLang();

  const [reviews] = useState(reviewss ?? []);
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const sliderRef = useRef(null);

  // ── Responsive ────────────────────────────────────────────────────────────
  useEffect(() => {
    const updateVisible = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const isSlider = reviews.length > visibleCount;
  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const handleScroll = () =>
    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });

  const t = {
    label: { ar: "آراء العملاء",               en: "Customer Reviews" },
    title: { ar: "البنات اللي جرّبوا",         en: "Girls who tried" },
    felt:  { ar: "حسّوا بالفرق",               en: "felt the difference" },
    cta:   { ar: "ابدئي رحلتك مع RooteX الآن", en: "Start your RooteX journey now" },
    fans:  { ar: "بنت حبّوا النتيجة 💛",        en: "girls loved the results 💛" },
    empty: { ar: "لا توجد تقييمات بعد",         en: "No reviews yet" },
  };

  // ── Nav ───────────────────────────────────────────────────────────────────
  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  // ── Drag ──────────────────────────────────────────────────────────────────
  const onPointerDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragDeltaX(0);
    sliderRef.current?.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!isDragging) return;
    setDragDeltaX(e.clientX - dragStartX);
  };
  const onPointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragDeltaX < -60) next();
    else if (dragDeltaX > 60) prev();
    setDragDeltaX(0);
  };

  // ── Auto-advance ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isSlider) return;
    const id = setInterval(
      () => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)),
      5000
    );
    return () => clearInterval(id);
  }, [isSlider, maxIndex]);

  // ── Reset on resize ───────────────────────────────────────────────────────
  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  if (!settings) return null;

  const gold      = settings.colors?.gold          ?? "#c8a93e";
  const goldLight = settings.colors?.goldLight      ?? "#d4b84a";
  const primary   = settings.colors?.primary        ?? "#3a4520";
  const secDark   = settings.colors?.secondaryDark  ?? "#2d3518";
  const dir       = lang === "ar" ? "rtl" : "ltr";
  const gapPx     = 20;

  // ── Stars ─────────────────────────────────────────────────────────────────
  const Stars = ({ rating = 5 }) => {
    const n = Math.min(5, Math.max(1, Math.round(rating)));
    return (
      <span style={{ color: gold, letterSpacing: 3, fontSize: 18 }}>
        {"★".repeat(n)}{"☆".repeat(5 - n)}
      </span>
    );
  };

  // ── Card ──────────────────────────────────────────────────────────────────
  const ReviewCard = ({ review, extraStyle = {} }) => (
    <div className="rv-card-lift" style={{ ...cardBase, ...extraStyle }}>
      {/* stars + badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stars rating={review.rating} />
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1,
          color: "#1a1a0a", background: gold,
          padding: "4px 12px", borderRadius: 20,
        }}>
          {review.rating}.0 / 5
        </span>
      </div>

      {/* text */}
      <p style={{
        fontSize: 15, lineHeight: 1.85, margin: 0, flex: 1,
        color: primary,
        fontFamily: lang === "ar" ? "serif" : "inherit",
      }}>
        {review.review}
      </p>

      {/* author */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        paddingTop: 12, borderTop: `1px solid ${gold}44`,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, fontWeight: 800, color: "#1a1a0a",
          boxShadow: `0 0 0 3px ${gold}33`,
        }}>
          {review.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <span style={{ fontWeight: 700, fontSize: 14, color: primary }}>
          — {review.name}
        </span>
      </div>
    </div>
  );

  // ── Transform: الحساب الصح مع الـ gap ─────────────────────────────────────
  // كل كارد عرضه = (100% / visibleCount)
  // الـ gap بينهم = gapPx
  // المسافة الكاملة لكل step = عرض الكارد + الـ gap
  // بالـ calc: current * (100/visibleCount % + gapPx)
  const sign = dir === "rtl" ? "" : "-";
  const sliderTransform = `translateX(calc(${sign}${current} * (${100 / visibleCount}% + ${gapPx}px) + ${dragDeltaX}px))`;

  return (
    <section id="reviews" style={{ padding: "80px 20px", direction: dir }}>
      <style>{`
        .rv-card-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .rv-card-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 55px rgba(0,0,0,0.15) !important;
        }
        .rv-dot { transition: all 0.25s; cursor: pointer; }
        .rv-dot:hover { opacity: 0.75; transform: scale(1.2); }
        .rv-arrow {
          transition: background 0.2s, transform 0.15s, opacity 0.2s;
          cursor: pointer;
        }
        .rv-arrow:hover:not(:disabled) {
          transform: translateY(-50%) scale(1.1) !important;
        }
        .rv-arrow:active:not(:disabled) {
          transform: translateY(-50%) scale(0.93) !important;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{
            fontSize: 11, letterSpacing: 5, color: gold,
            textTransform: "uppercase", fontWeight: 700,
            margin: "0 0 14px",
          }}>
            {t.label[lang]}
          </p>
          <h2 style={{
            fontSize: "clamp(26px, 4.5vw, 46px)",
            fontWeight: 800, lineHeight: 1.3, margin: 0,
            color: primary,
          }}>
            {t.title[lang]}{" "}
            Roote<span style={{ color: gold }}>x</span>{" "}
            {t.felt[lang]}
          </h2>
        </div>

        {/* ── Cards ── */}
        {reviews.length === 0 ? (
          <div style={{
            ...cardBase, textAlign: "center",
            padding: "60px 24px",
            color: `${primary}88`, fontSize: 15,
          }}>
            {t.empty[lang]}
          </div>

        ) : isSlider ? (
          /* ══════════════ SLIDER ══════════════ */
          <div style={{ position: "relative", padding: "0 56px" }}>

            {/* overflow wrapper */}
            <div style={{ overflow: "hidden", borderRadius: 24 }}>
              <div
                ref={sliderRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{
                  display: "flex",
                  gap: gapPx,
                  transform: sliderTransform,
                  transition: isDragging
                    ? "none"
                    : "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
                  willChange: "transform",
                  cursor: isDragging ? "grabbing" : "grab",
                  userSelect: "none",
                  padding: "8px 2px 16px",
                }}
              >
                {reviews.map((r) => (
                  <ReviewCard
                    key={r._id}
                    review={r}
                    extraStyle={{
                      // عرض كل كارد = (100% - مجموع الـ gaps) / visibleCount
                      flex: `0 0 calc(${100 / visibleCount}% - ${gapPx * (visibleCount - 1) / visibleCount}px)`,
                      minWidth: 0,
                      boxSizing: "border-box",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Arrow prev */}
            <button
              className="rv-arrow"
              onClick={dir === "rtl" ? next : prev}
              disabled={current === (dir === "rtl" ? maxIndex : 0)}
              style={{
                ...arrowBtn(gold),
                [dir === "rtl" ? "right" : "left"]: 0,
                opacity: current === (dir === "rtl" ? maxIndex : 0) ? 0.3 : 1,
              }}
            >
              {dir === "rtl" ? "›" : "‹"}
            </button>

            {/* Arrow next */}
            <button
              className="rv-arrow"
              onClick={dir === "rtl" ? prev : next}
              disabled={current === (dir === "rtl" ? 0 : maxIndex)}
              style={{
                ...arrowBtn(gold),
                [dir === "rtl" ? "left" : "right"]: 0,
                opacity: current === (dir === "rtl" ? 0 : maxIndex) ? 0.3 : 1,
              }}
            >
              {dir === "rtl" ? "‹" : "›"}
            </button>

            {/* Dots */}
            <div style={{
              display: "flex", justifyContent: "center",
              gap: 8, marginTop: 20,
            }}>
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="rv-dot"
                  onClick={() => setCurrent(i)}
                  style={{
                    height: 8,
                    width: i === current ? 28 : 8,
                    borderRadius: 4,
                    background: i === current ? gold : `${gold}55`,
                    boxShadow: i === current ? `0 0 8px ${gold}88` : "none",
                  }}
                />
              ))}
            </div>
          </div>

        ) : (
          /* ══════════════ FLEX GRID ══════════════ */
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {reviews.map((r) => (
              <ReviewCard
                key={r._id}
                review={r}
                extraStyle={{ flex: "1 1 280px" }}
              />
            ))}
          </div>
        )}

        {/* ── CTA Banner ── */}
        <div style={{
          marginTop: 52, borderRadius: 32,
          background: `linear-gradient(135deg, ${secDark}, ${primary})`,
          border: `1px solid ${gold}33`,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", gap: 24,
            padding: "32px 40px",
          }}>
            <div>
              <div style={{
                fontSize: 50, fontWeight: 900,
                color: gold, lineHeight: 1,
                textShadow: `0 0 30px ${gold}55`,
              }}>
                +1000
              </div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", marginTop: 6 }}>
                {t.fans[lang]}
              </div>
            </div>

            <button
              onClick={handleScroll}
              style={{
                padding: "14px 38px", borderRadius: 50,
                background: `linear-gradient(to right, ${gold}, ${goldLight})`,
                color: "#1a1a0a", fontWeight: 800, fontSize: 16,
                border: "none", cursor: "pointer",
                boxShadow: `0 10px 30px ${gold}44`,
                transition: "transform 0.2s, box-shadow 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = `0 16px 40px ${gold}55`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 10px 30px ${gold}44`;
              }}
            >
              {t.cta[lang]}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

// ── Base styles ───────────────────────────────────────────────────────────────
const cardBase = {
  background: "rgba(255,255,255,0.82)",
  border: "1px solid rgba(200,169,62,0.3)",
  borderRadius: 24,
  padding: "26px 28px",
  backdropFilter: "blur(14px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
  display: "flex", flexDirection: "column", gap: 14,
};

const arrowBtn = (gold) => ({
  position: "absolute",
  top: "42%",
  transform: "translateY(-50%)",
  width: 44, height: 44,
  borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 22, fontWeight: 700,
  background: gold,
  border: "none",
  color: "#1a1a0a",
  cursor: "pointer",
  zIndex: 2,
  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
});