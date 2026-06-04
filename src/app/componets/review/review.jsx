"use client";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import { useEffect, useState, useRef } from "react";
import { renderHighlighted } from "../utils/highlight";

const Stars = ({ rating = 5 }) => {
  const n = Math.min(5, Math.max(1, Math.round(rating)));
  return <span style={{ color: "#e9da73", letterSpacing: 2, fontSize: 22 }}>{"★".repeat(n)}{"☆".repeat(5 - n)}</span>;
};

const BeforeAfterSlider = ({ review }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const updatePos = (clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSliderPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };
  const onPointerDown = (e) => { isDragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); updatePos(e.clientX); };
  const onPointerMove = (e) => { if (isDragging.current) updatePos(e.clientX); };
  const onPointerUp   = () => { isDragging.current = false; };

  if (!review.beforeImage && !review.imageAfter) {
    return (
      <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
        <img src={review.image} alt={review.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  const before = review.beforeImage || review.image;
  const after  = review.imageAfter  || review.image;
  return (
    <div ref={containerRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      style={{ position: "relative", width: "100%", aspectRatio: "4/3", borderRadius: "16px 16px 0 0", overflow: "hidden", cursor: "ew-resize", userSelect: "none", touchAction: "none" }}>
      <img src={before} alt="before" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
        <img src={after} alt="after" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${sliderPos}%`, width: 2, background: "#fff", transform: "translateX(-50%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: `${sliderPos}%`, transform: "translate(-50%, -50%)", width: 40, height: 40, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.25)", pointerEvents: "none", fontSize: 16, fontWeight: 700, color: "#333" }}>‹›</div>
      <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(50,50,50,0.75)", color: "#fff", fontSize: 13, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>قبل</div>
      <div style={{ position: "absolute", bottom: 12, right: 12, background: "#5b2d8e", color: "#fff", fontSize: 13, fontWeight: 700, padding: "4px 14px", borderRadius: 20 }}>بعد</div>
    </div>
  );
};

const ReviewCard = ({ review, extraStyle = {}, lang, buttonbackground, buttontext, textColor, highlightColor }) => (
  <div className="rv-card-lift" style={{ background: "#fff", border: "1px solid rgba(91,45,142,0.15)", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", ...extraStyle }}>
    <BeforeAfterSlider review={review} />
    <div style={{ padding: "5px 16px", display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stars rating={review.rating} />
        <span style={{ fontSize: 11, fontWeight: 700, color: buttontext, background: buttonbackground, padding: "3px 10px", borderRadius: 20 }}>
          {review.rating}.0 / 5
        </span>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.5, margin: 0, color: textColor, fontWeight: 500, textAlign: "center" }}>
        {renderHighlighted(review.review?.[lang], highlightColor)}
      </p>
    </div>
  </div>
);

export default function Review({ reviewss }) {
  const settings = useSettings();
  const { lang } = useLang();

  const buttonbackground = settings?.colors?.buttonbackground;
  const backgroundColor  = settings?.colors?.backgroundColor;
  const highlightColor   = settings?.colors?.highlightColor;
  const textColor        = settings?.colors?.textColor;
  const buttontext       = settings?.colors?.buttontext;

  const [reviews] = useState(reviewss ?? []);
  const arrowBtn = () => (
    {
      position: "absolute",
      top: "42%"
      , transform: "translateY(-50%)",
      width: 42,
      height: 42,
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      fontSize: 26,
      fontWeight: 700,
      background: backgroundColor,
      border: "none",
      color: "#fff",
      cursor: "pointer",
      zIndex: 2,
      boxShadow: "0 4px 16px rgba(91,45,142,0.35)", textAlign: "center"
    });

  useEffect(() => {
    reviews.forEach((r) => [r.image, r.beforeImage, r.imageAfter].filter(Boolean).forEach((src) => { const img = new Image(); img.src = src; }));
  }, [reviews]);

  const [current, setCurrent]           = useState(0);
  const [isDragging, setIsDragging]     = useState(false);
  const [dragStartX, setDragStartX]     = useState(0);
  const [dragDeltaX, setDragDeltaX]     = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const sliderRef = useRef(null);

  useEffect(() => {
    const update = () => { const w = window.innerWidth; if (w < 640) setVisibleCount(1); else if (w < 1024) setVisibleCount(2); else setVisibleCount(3); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isSlider = reviews.length > visibleCount;
  const maxIndex = Math.max(0, reviews.length - visibleCount);
  const dir      = lang === "ar" ? "rtl" : "ltr";
  const gapPx    = 20;
  const prev     = () => setCurrent((c) => Math.max(0, c - 1));
  const next     = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  const onPointerDown = (e) => { setIsDragging(true); setDragStartX(e.clientX); setDragDeltaX(0); sliderRef.current?.setPointerCapture(e.pointerId); };
  const onPointerMove = (e) => { if (isDragging) setDragDeltaX(e.clientX - dragStartX); };
  const onPointerUp   = () => { if (!isDragging) return; setIsDragging(false); if (dragDeltaX < -60) next(); else if (dragDeltaX > 60) prev(); setDragDeltaX(0); };

  useEffect(() => { if (!isSlider) return; const id = setInterval(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), 5000); return () => clearInterval(id); }, [isSlider, maxIndex]);
  useEffect(() => { setCurrent((c) => Math.min(c, maxIndex)); }, [maxIndex]);

  if (!settings) return null;

  const sign            = dir === "rtl" ? "" : "-";
  const sliderTransform = `translateX(calc(${sign}${current} * (${100 / visibleCount}% + ${gapPx}px) + ${dragDeltaX}px))`;
  const cardProps       = { lang, buttonbackground, buttontext, textColor, highlightColor };

  return (
    <section id="reviews" dir={dir} style={{ padding: "10px 2px", background: "transparent" }}>
      <style>{`
        .rv-card-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .rv-card-lift:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important; }
        .rv-dot { transition: all 0.25s; cursor: pointer; }
        .rv-dot:hover { opacity: 0.75; transform: scale(1.2); }
        .rv-arrow { transition: transform 0.15s, opacity 0.2s; }
        .rv-arrow:hover { transform: translateY(-50%) scale(1.08) !important; }
        .rv-arrow:active { transform: translateY(-50%) scale(0.94) !important; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 0 }}>
          <p style={{ fontSize: 14, letterSpacing: 4, color: textColor, textTransform: "uppercase", fontWeight: 600, margin: "0 0 0px 0" }}>
            {renderHighlighted(settings?.reviews?.text?.[lang], highlightColor)}
          </p>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, lineHeight: 1.3, margin: "0 0 3px 0", color: textColor }}>
            {renderHighlighted(settings?.reviews?.paragraph?.[lang], highlightColor)}
          </h2>
        </div>

        {reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 24px", color: "#999", fontSize: 15 }}>
            {lang === "ar" ? "لا توجد تقييمات بعد" : "No reviews yet"}
          </div>
        ) : isSlider ? (
          <div style={{ position: "relative", padding: "0 10px" }}>
            <div style={{ overflow: "hidden", borderRadius: 24 }}>
              <div ref={sliderRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
                style={{ display: "flex", gap: gapPx, transform: sliderTransform, transition: isDragging ? "none" : "transform 0.28s cubic-bezier(0.25,1,0.5,1)", willChange: "transform", cursor: isDragging ? "grabbing" : "grab", userSelect: "none", padding: "8px 2px 16px" }}>
                {reviews.map((r) => (
                  <ReviewCard key={r._id} review={r} {...cardProps}
                    extraStyle={{ flex: `0 0 calc(${100 / visibleCount}% - ${gapPx * (visibleCount - 1) / visibleCount}px)`, minWidth: 0, boxSizing: "border-box" }} />
                ))}
              </div>
            </div>
            {/* {current !== (dir === "rtl" ? maxIndex : 0) && (
              <button className="rv-arrow" onClick={dir === "rtl" ? next : prev} style={{ ...arrowBtn(), [dir === "rtl" ? "right" : "left"]: "-10px" }}>{dir === "rtl" ? "›" : "‹"}</button>
            )}
            {current !== (dir === "rtl" ? 0 : maxIndex) && (
              <button className="rv-arrow" onClick={dir === "rtl" ? prev : next} style={{ ...arrowBtn(), [dir === "rtl" ? "left" : "right"]: 0 }}>{dir === "rtl" ? "‹" : "›"}</button>
            )} */}
              {current > 0 && (
  <button
    className="rv-arrow"
    onClick={prev}
    style={{
      ...arrowBtn(),
      left: "0px",
    }}
  >
    ←
  </button>
)}

{current < maxIndex && (
  <button
    className="rv-arrow"
    onClick={next}
    style={{
      ...arrowBtn(),
      right: "0px",
    }}
  >
    →
  </button>
)}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 0 }}>
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <div key={i} className="rv-dot" onClick={() => setCurrent(i)} style={{ height: 8, width: i === current ? 28 : 8, borderRadius: 4, background: i === current ? backgroundColor : "#5b2d8e44" }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            {reviews.map((r) => <ReviewCard key={r._id} review={r} {...cardProps} extraStyle={{ flex: "1 1 280px" }} />)}
          </div>
        )}
      </div>
    </section>
  );
}
