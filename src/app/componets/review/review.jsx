
"use client";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import { useEffect, useState, useRef } from "react";


const Stars = ({ rating = 5, gold }) => {
  const n = Math.min(5, Math.max(1, Math.round(rating)));
  return (
    <span style={{ color: gold, letterSpacing: 3, fontSize: 18 }}>
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
};


const ReviewCard = ({ review, extraStyle = {}, gold, goldLight, primary, lang }) => (
  <div className="rv-card-lift" style={{ ...cardBase, ...extraStyle }}>

    {/* stars + badge */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Stars rating={review.rating} gold={gold} />
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: 1,
        color: "#1a1a0a", background: gold,
        padding: "4px 12px", borderRadius: 20,
      }}>
        {review.rating}.0 / 5
      </span>
    </div>

    {/* text + image */}
    <div style={{
      display: "flex", gap: 14, alignItems: "flex-start", flex: 1,
      flexDirection: lang === "ar" ? "row-reverse" : "row",
    }}>
          <div style={{
        width: 90, height: 90, flexShrink: 0,
        borderRadius: 14, overflow: "hidden",
        border: `1.5px solid ${gold}55`,
        background: `linear-gradient(135deg, ${gold}15, ${goldLight}22)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {review.image ? (
      <img
  src={review.image}
  alt={review.name}
  fetchPriority="high"
  loading="eager"
  style={{ width: "100%", height: "100%", objectFit: "cover" }}
/>
        ) : (
          <span style={{ fontSize: 32, opacity: 0.25 }}>🖼️</span>
        )}
      </div>
      <p style={{
        fontSize: 15, lineHeight: 1.85, margin: 0, flex: 1,
        color: primary,
        fontFamily: lang === "ar" ? "serif" : "inherit",
      }}>
       { review.review[lang]}
      </p>


  
    </div>

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

// ── Main Component ────────────────────────────────────────────────────────────
export default function Review({ reviewss }) {
  const settings = useSettings();
  const { lang } = useLang();
console.log("reviewssss",reviewss)
  const [reviews] = useState(reviewss ?? []);
  

useEffect(() => {
  reviews.forEach((r) => {
    if (r.image) {
      const img = new Image();
      img.src = r.image;
    }
  });
}, [reviews]);
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

  const sign = dir === "rtl" ? "" : "-";
  const sliderTransform = `translateX(calc(${sign}${current} * (${100 / visibleCount}% + ${gapPx}px) + ${dragDeltaX}px))`;

  
  const cardProps = { gold, goldLight, primary, lang };

  return (
    <section id="reviews" style={{ padding: "20px 20px 60px 20px", direction: dir }}>
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
            fontSize: 16, letterSpacing: 5, color: gold,
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
                    : "transform 0.28s cubic-bezier(0.25, 1, 0.5, 1)",
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
                    {...cardProps}
                    extraStyle={{
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
                {...cardProps}
                extraStyle={{ flex: "1 1 280px" }}
              />
            ))}
          </div>
        )}

  
   

      </div>
    </section>
  );
}