"use client";
import { useRouter } from "next/navigation";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import { useQuantity } from "@/app/providers/QuantityProvider";
import { renderHighlighted } from "../utils/highlight";

export default function Product({ product }) {
  const settings = useSettings();
  const { lang } = useLang();
  const { qty, increment, decrement } = useQuantity();
  const item = product?.[0];
  const router = useRouter();

  const buttonbackground  = settings?.colors?.buttonbackground;
  const backgroundColor   = settings?.colors?.backgroundColor;
  const highlightColor    = settings?.colors?.highlightColor;
  const textColor         = settings?.colors?.textColor;
  const buttontext        = settings?.colors?.buttontext;
  const shippingSignature = settings?.shippingSignature;

  if (!item || !settings) return null;

  const name        = item.name?.[lang]        || item.name?.ar;
  const description = item.description?.[lang] || item.description?.ar;
  const nameParts   = name?.split("-");

  const t = {
    buy:       { ar: "اشتري الآن", en: "🛒 Buy Now"  },
    currency:  { ar: "جنيه",       en: "EGP"         },
    insteadOf: { ar: "بدلاً من",   en: "Instead of"  },
  };
    const oldPrice = item?.oldPrice ?? item?.originalPrice ?? 2700;
const totalOldPrice = oldPrice * qty;

  const QtyPill = () => (
    <div style={{ display: "flex", alignItems: "center",background: `${buttonbackground}`, borderRadius: 16, overflow: "hidden", width: "fit-content", height: 35 }}>
      <button onClick={decrement} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background:  `${buttonbackground}`, border: "none", fontSize: 16, fontWeight: 500, color: buttontext, cursor: "pointer" }}>−</button>
      <span style={{ width: 44, textAlign: "center", fontSize: 16, fontWeight: 700, color: buttontext, background: `${buttonbackground}` }}>{qty}</span>
      <button onClick={increment} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${buttonbackground}`, border: "none", fontSize: 16, fontWeight: 500, color: buttontext, cursor: "pointer" }}>+</button>
    </div>
  );

  return (
    <section id="product" dir={lang === "ar" ? "rtl" : "ltr"} style={{ padding: "10px 20px", width: "100%", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }} className="product-inner">

        <div style={{ width: "100%", borderRadius: 24, overflow: "hidden" }}>
          <img src={item.images?.[0]} alt={name} style={{ width: "85%", maxHeight: 830, objectFit: "cover", borderRadius: 24, display: "block", margin: "0 auto" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Title */}
          <h2 style={{ fontSize: 26, fontWeight: 900, color: textColor, margin: 0, textTransform: "uppercase", letterSpacing: 0.5, textAlign: "center" }}>
            {renderHighlighted(nameParts?.[0], highlightColor)}
            {nameParts?.[1] && <span> {renderHighlighted(nameParts[1], highlightColor)}</span>}
          </h2>

          {/* Description */}
          <p style={{ fontSize: 16, color: textColor, margin: 0, whiteSpace: "pre-line", fontWeight: 500, textAlign: "center", lineHeight: 1.5 }}>
            {renderHighlighted(description, highlightColor)}
          </p>

          <div style={{ height: 1, background: "#c5bfb0", opacity: 0.5 }} />

          {/* Price + Qty */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 10, direction: lang === "ar" ? "rtl" : "ltr" }}>
            <QtyPill />
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: textColor }}>{item.price * qty} {t.currency[lang]}</span>
              <span style={{ fontSize: 13, color: textColor, opacity: 0.6 }}>{t.insteadOf[lang]}</span>
                   <span className="old-price" style={{color:textColor}}>
  {totalOldPrice} {t.currency[lang]}
</span>
            </div>
          </div>

          {/* Buy Button */}
          <button onClick={() => router.push(`/checkoutpage?qty=${qty}`)} style={{ width: "100%", padding: "15px 0", borderRadius: 50, background: buttonbackground, color: buttontext, fontWeight: 800, fontSize: 18, border: "none", cursor: "pointer", letterSpacing: 0.5, transition: "transform 0.15s", fontFamily: "inherit" }}>
            {renderHighlighted(t.buy[lang], highlightColor)}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, fontSize: 12, color: textColor, opacity: 0.7, flexWrap: "wrap" }}>
            <span>{renderHighlighted(shippingSignature?.[lang], highlightColor)}</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .product-inner { flex-direction: ${lang === "ar" ? "row" : "row-reverse"} !important; align-items: center; }
          .product-inner > div:first-child { flex: 1; }
          .product-inner > div:last-child  { flex: 1; }
        }
      `}</style>
    </section>
  );
}
