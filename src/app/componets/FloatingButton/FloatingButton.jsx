"use client";
import { useRouter } from "next/navigation";
import { useSettings } from "../../providers/SettingsProvider";
import { useQuantity } from "../../providers/QuantityProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import { renderHighlighted } from "../utils/highlight";

export default function FloatingButton({ product }) {
  const settings = useSettings();
  const { qty, increment, decrement } = useQuantity();
  const router = useRouter();
  const { lang } = useLang();

  if (!settings?.floatingButton?.visible) return null;

  const buttonbackground = settings?.colors?.buttonbackground;
  const backgroundColor  = settings?.colors?.backgroundColor;
  const highlightColor   = settings?.colors?.highlightColor;
  const textColor        = settings?.colors?.textColor;
  const buttontext       = settings?.colors?.buttontext;
  const item             = product?.[0];

  const t = {
    currency:  { ar: "جنيه",     en: "EGP"        },
    insteadOf: { ar: "بدلاً من", en: "Instead of" },
  };

  const QtyPill = () => (
    <div style={{ display: "flex", alignItems: "center", background: `white`, borderRadius: 16, overflow: "hidden", width: "fit-content", height: 35 }}>
      <button onClick={decrement} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${backgroundColor}33`, border: "none", fontSize: 16, fontWeight: 500, color: textColor, cursor: "pointer" }}>−</button>
      <span style={{ width: 44, textAlign: "center", fontSize: 16, fontWeight: 700, color: textColor}}>{qty}</span>
      <button onClick={increment} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${backgroundColor}33`, border: "none", fontSize: 16, fontWeight: 500, color: textColor, cursor: "pointer" }}>+</button>
    </div>
  );

  return (
    <div style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, width: "90%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>

      {/* Qty + Price */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 10, direction: lang === "ar" ? "rtl" : "ltr" }}>
        <QtyPill />
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: textColor }}>{item?.price * qty} {t.currency[lang]}</span>
          <span style={{ fontSize: 13, color: textColor, opacity: 0.6 }}>{t.insteadOf[lang]}</span>
          <span style={{ fontSize: 12, color: textColor, textDecoration: "line-through", fontWeight: 500, opacity: 0.5 }}>{item?.oldPrice ?? item?.originalPrice ?? 2700} {t.currency[lang]}</span>
        </div>
      </div>

      {/* Buy Button */}
      <button
        onClick={() => router.push(`/checkoutpage?qty=${qty}`)}
        style={{ width: "100%", background: buttonbackground, color: buttontext, border: "none", padding: "14px 28px", borderRadius: 14, fontWeight: 700, fontSize: 20, boxShadow: "0 8px 25px rgba(0,0,0,.15)", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}
      >
        {renderHighlighted(settings?.floatingButton?.text?.[lang], highlightColor)}
      </button>
    </div>
  );
}
