"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
 

function useConfetti(trigger) {
  useEffect(() => {
    if (!trigger) return;
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 5 + 3,
      color: ["#c8a93e", "#d4b84a", "#3a4520", "#6b8a3a", "#f0e6c0", "#fff"][Math.floor(Math.random() * 6)],
      rot: Math.random() * 360,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 1.5,
      vr: (Math.random() - 0.5) * 4,
      opacity: Math.random() * 0.6 + 0.4,
    }));
    let animId, frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.opacity * Math.max(0, 1 - frame / 220);
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      });
      frame++;
      if (frame < 260) animId = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [trigger]);
}
 

function AnimatedCheck({ done }) {
  return (
    <svg viewBox="0 0 52 52" style={{ width: "100%", height: "100%" }} fill="none">
    
      <circle
        cx="26" cy="26" r="25"
        fill="#6b8a3a"
        opacity={done ? 0.15 : 0}
        style={{ transition: "opacity .6s ease .8s" }}
      />
   
      <circle
        cx="26" cy="26" r="22"
        stroke="#e0ead6"
        strokeWidth="3"
        fill="none"
      />
     
      <circle
        cx="26" cy="26" r="22"
        stroke="#6b8a3a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="138.2"
        strokeDashoffset={done ? 0 : 138.2}
        style={{
          transformOrigin: "26px 26px",
          transform: "rotate(-90deg)",
          transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1) 0.1s",
        }}
      />
  
      <circle
        cx="26" cy="26" r="18"
        fill="#6b8a3a"
        opacity={done ? 1 : 0}
        style={{ transition: "opacity .3s ease 1s" }}
      />
    

      <polyline
  points="18,27 22,31 32,21"
  stroke="#fff"
  strokeWidth="2.5"
  strokeLinecap="round"
  strokeLinejoin="round"
  fill="none"
  strokeDasharray="24"
  strokeDashoffset={done ? 0 : 24}
  style={{ transition: "stroke-dashoffset 0.45s ease 1.1s" }}
/>
    </svg>
  );
}
 
export default function SuccessPage() {
  const params = useParams();
  const settings = useSettings();
  const { lang } = useLang();
 
  const orderId = params?.orderId ?? "ORD-000000";
  const gold = settings?.colors?.gold ?? "#c8a93e";
  const goldLight = settings?.colors?.goldLight ?? "#d4b84a";
  const primary = settings?.colors?.primary ?? "#3a4520";
  const dir = lang === "ar" ? "rtl" : "ltr";
 
  const [ringDone, setRingDone] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [pulseRing, setPulseRing] = useState(false);
  const [copied, setCopied] = useState(false);
 
  useEffect(() => {
    const t1 = setTimeout(() => setRingDone(true), 300);
    const t2 = setTimeout(() => setPulseRing(true), 1500);
    const t3 = setTimeout(() => setCardsVisible(true), 1200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);
 
  useConfetti(ringDone);
 
  const handleCopy = () => {
    navigator.clipboard?.writeText(orderId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  const t = {
    congrats:   { ar: "تم الطلب بنجاح! 🎉",                          en: "Order Placed! 🎉" },
    sub:        { ar: "شكراً لثقتك بنا. طلبك في طريقه إليك قريباً",  en: "Thank you! Your order is on its way" },
    orderNum:   { ar: "رقم الطلب",                                     en: "Order ID" },
    trackTitle: { ar: "مراحل توصيل طلبك",                             en: "Your Order Journey" },
    backHome:   { ar: "العودة للرئيسية",                               en: "Back to Home" },
    trackOrder: { ar: "تتبع طلبي",                                     en: "Track Order" },
    copied:     { ar: "تم النسخ!",                                     en: "Copied!" },
    copyId:     { ar: "نسخ رقم الطلب",                                 en: "Copy Order ID" },
    eta:        { ar: "موعد التسليم المتوقع",                          en: "Estimated Delivery" },
    etaVal:     { ar: "٣-٥ أيام عمل",                                  en: "3-5 Business Days" },
   
    steps: {
      ar: [
        { icon: "✅", title: "تم استلام طلبك",    desc: "جاري مراجعة تفاصيل طلبك" },
        { icon: "📦", title: "قيد التجهيز",       desc: "يتم تجهيز طلبك الآن" },
        { icon: "🚚", title: "في الطريق إليك",   desc: "سيصلك الطلب خلال ٣-٥ أيام عمل" },
        { icon: "🏠", title: "التسليم",           desc: "سيتم التسليم على عنوانك المسجل" },
      ],
      en: [
        { icon: "✅", title: "Order Received",   desc: "We're reviewing your order details" },
        { icon: "📦", title: "Being Prepared",   desc: "Your order is being packed" },
        { icon: "🚚", title: "On the Way",       desc: "Arrives in 3-5 business days" },
        { icon: "🏠", title: "Delivery",         desc: "Will be delivered to your address" },
      ],
    },
  };
 
  return (
    <div
      dir={dir}
      style={{
        padding:"25px 0",
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f7f5f0 0%, #eee8d5 50%, #f7f5f0 100%)",
        fontFamily: "'Cairo', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* confetti canvas */}
      <canvas
        id="confetti-canvas"
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50 }}
      />
 
      {/* decorative blobs */}
      <div style={{
        position: "fixed", top: "-120px",
        right: dir === "rtl" ? "-120px" : "auto",
        left: dir === "rtl" ? "auto" : "-120px",
        width: 340, height: 340, borderRadius: "50%",
        background: `radial-gradient(circle, ${gold}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "-100px",
        left: dir === "rtl" ? "-100px" : "auto",
        right: dir === "rtl" ? "auto" : "-100px",
        width: 280, height: 280, borderRadius: "50%",
        background: `radial-gradient(circle, ${primary}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
 
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "2.5rem 1.25rem 4rem" }}>
 
        {/* ── check circle ── */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.75rem" }}>
          <div style={{ position: "relative", width: 120, height: 120 }}>
        
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                position: "absolute",
                inset: `${-i * 14}px`,
                borderRadius: "50%",
                border: `1.5px solid ${gold}`,
                opacity: pulseRing ? 0 : 0.4,
                transform: pulseRing ? "scale(1.5)" : "scale(1)",
                transition: `opacity 1.2s ease ${i * 0.2}s, transform 1.2s ease ${i * 0.2}s`,
              }} />
            ))}
           
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: `radial-gradient(circle, #6b8a3a33 0%, transparent 70%)`,
              opacity: ringDone ? 1 : 0,
              transition: "opacity .8s ease 1s",
            }} />
           
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              boxShadow: ringDone
                ? `0 0 0 3px #6b8a3a33, 0 20px 50px #6b8a3a22`
                : `0 4px 12px rgba(0,0,0,.08)`,
              transition: "box-shadow 1s ease 1s",
            }} />
            <AnimatedCheck done={ringDone} />
          </div>
        </div>
 
      
        <div style={{
          textAlign: "center", marginBottom: "1.5rem",
          opacity: ringDone ? 1 : 0,
          transform: ringDone ? "translateY(0)" : "translateY(16px)",
          transition: "opacity .6s ease .9s, transform .6s ease .9s",
        }}>
          <h1 style={{ fontSize: "1.55rem", fontWeight: 800, color: primary, margin: "0 0 .35rem" }}>
            {t.congrats[lang]}
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#7a7060", margin: 0, lineHeight: 1.6 }}>
            {t.sub[lang]}
          </p>
        </div>
 
        <div style={{
          background: "#fff",
          borderRadius: "1.75rem",
          padding: "1.4rem 1.6rem",
          border: `1.5px solid ${gold}44`,
          boxShadow: `0 8px 32px ${gold}1a`,
          marginBottom: "1.25rem",
          opacity: cardsVisible ? 1 : 0,
          transform: cardsVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity .5s ease, transform .5s ease",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.7rem", color: "#aaa", margin: "0 0 3px", fontWeight: 600, letterSpacing: "0.05em" }}>
                {t.orderNum[lang]}
              </p>
              <p style={{
                fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 800,
                color: primary, margin: 0, letterSpacing: "0.03em", direction: "ltr",
                wordBreak: "break-all",
              }}>
                # {orderId}
              </p>
            </div>
            <button onClick={handleCopy} style={{
              background: copied ? `${gold}22` : "#f7f5f0",
              border: `1.5px solid ${copied ? gold : "#e8e0cc"}`,
              borderRadius: "0.875rem",
              padding: "0.45rem 0.9rem",
              fontSize: "0.75rem", fontWeight: 700,
              color: copied ? primary : "#888",
              cursor: "pointer",
              display: "flex", alignItems: "center", gap: "0.35rem",
              transition: "all .25s",
              fontFamily: "'Cairo', sans-serif",
              flexShrink: 0,
              marginRight: dir === "rtl" ? "1rem" : 0,
              marginLeft: dir === "ltr" ? "1rem" : 0,
            }}>
              {copied ? "✓" : "⎘"} {copied ? t.copied[lang] : t.copyId[lang]}
            </button>
          </div>
 
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${gold}44, transparent)`,
            margin: "0 -0.2rem 1rem",
          }} />
 
          <div style={{
            background: "#f7f5f0", borderRadius: "1rem",
            padding: "0.65rem 0.85rem",
            display: "flex", alignItems: "center", gap: "0.6rem",
          }}>
            <span style={{ fontSize: "1.2rem" }}>🚚</span>
            <div>
              <p style={{ fontSize: "0.67rem", color: "#aaa", margin: "0 0 1px", fontWeight: 600 }}>
                {t.eta[lang]}
              </p>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: primary, margin: 0 }}>
                {t.etaVal[lang]}
              </p>
            </div>
          </div>
        </div>
 
     
        <div style={{
          background: "#fff",
          borderRadius: "1.75rem",
          padding: "1.4rem 1.5rem",
          border: "1px solid #f0ead6",
          marginBottom: "1.5rem",
          opacity: cardsVisible ? 1 : 0,
          transform: cardsVisible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity .5s ease .1s, transform .5s ease .1s",
        }}>
          <p style={{
            fontSize: "0.7rem", fontWeight: 700, color: "#bbb",
            letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 1rem",
          }}>
            {t.trackTitle[lang]}
          </p>
 
          <div style={{ display: "flex", flexDirection: "column" }}>
            {t.steps[lang].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "0.9rem", alignItems: "stretch" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, flexShrink: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: i === 0
                      ? `linear-gradient(135deg, ${gold}, ${goldLight})`
                      : i === 1 ? `${gold}33` : "#f0ead6",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", flexShrink: 0,
                    boxShadow: i === 0 ? `0 4px 12px ${gold}55` : "none",
                    opacity: cardsVisible ? 1 : 0,
                    transition: `opacity .4s ease ${0.2 + i * 0.12}s`,
                  }}>
                    {i === 0 ? "✓" : s.icon}
                  </div>
                  {i < t.steps[lang].length - 1 && (
                    <div style={{
                      width: 2, flex: 1, minHeight: 20,
                      background: i === 0
                        ? `linear-gradient(to bottom, ${gold}, ${gold}44)`
                        : "#f0ead6",
                      margin: "3px 0", borderRadius: 2,
                    }} />
                  )}
                </div>
 
                <div style={{
                  paddingBottom: i < t.steps[lang].length - 1 ? "0.85rem" : 0,
                  paddingTop: "0.2rem",
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? "translateX(0)" : `translateX(${dir === "rtl" ? 12 : -12}px)`,
                  transition: `opacity .4s ease ${0.25 + i * 0.12}s, transform .4s ease ${0.25 + i * 0.12}s`,
                }}>
                  <p style={{
                    fontWeight: i === 0 ? 800 : 600,
                    fontSize: "0.82rem",
                    color: i === 0 ? primary : "#999",
                    margin: "0 0 2px",
                  }}>
                    {s.title}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "#bbb", margin: 0 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        <div style={{
          display: "flex", gap: "0.75rem",
          opacity: cardsVisible ? 1 : 0,
          transform: cardsVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity .5s ease .4s, transform .5s ease .4s",
        }}
         
        >
<a
  href="/"
  className="flex-1 text-center py-3 rounded-2xl border-2 font-bold text-sm no-underline flex items-center justify-center gap-2 transition-all duration-300 text-[#c8a93e] hover:bg-[#c8a93e] hover:text-white"
  style={{
    borderColor: gold,
   
  
  }}
>
  {t.backHome[lang]}
</a>
          {/* <button style={{
            flex: 1, padding: "0.9rem", borderRadius: "1.2rem", border: "none",
            background: `linear-gradient(135deg, ${primary}, #6b8a3a)`,
            color: "#fff", fontWeight: 700, fontSize: "0.9rem",
            cursor: "pointer", fontFamily: "'Cairo', sans-serif",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
            boxShadow: `0 6px 20px ${primary}44`,
          }}>
            📦 {t.trackOrder[lang]}
          </button> */}
        </div>
 
     
 
      </div>
    </div>
  );
}