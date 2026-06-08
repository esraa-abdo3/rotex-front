"use client";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import { useQuantity } from "@/app/providers/QuantityProvider";
import { useRouter } from "next/navigation";
import { renderHighlighted } from "../utils/highlight";
import "./CTA.css";
import Link from "next/link";

export default function CTA({ product }) {
  const settings = useSettings();
  const { lang } = useLang();
  const { qty, increment, decrement } = useQuantity();
  const router = useRouter();

  const buttonbackground = settings?.colors?.buttonbackground;
  const backgroundColor  = settings?.colors?.backgroundColor;
  const highlightColor   = settings?.colors?.highlightColor;
  const textColor        = settings?.colors?.textColor;
  const buttontext       = settings?.colors?.buttontext;
  const item             = product?.[0];

  const t = {
    cta:       { ar: settings?.buttonText?.ar,                        en: settings?.buttonText?.en },
    fans:      { ar: settings?.fansText?.ar || "بنت حبّوا النتيجة ", en: settings?.fansText?.en || "girls loved the results 💛" },
    currency:  { ar: "جنيه",     en: "EGP"        },
    insteadOf: { ar: "بدلاً من", en: "Instead of" },
  };
const oldPrice = item?.oldPrice ?? item?.originalPrice ?? 2700;
const totalOldPrice = oldPrice * qty;
const totalPrice = item?.price * qty;
//   const QtyPill = () => (
//     <div style={{ display: "flex", alignItems: "center",background: `${buttonbackground}`, borderRadius: 16, overflow: "hidden", width: "fit-content", height: 35 }}>
//       <button onClick={decrement} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background:  `${buttonbackground}`, border: "none", fontSize: 16, fontWeight: 500, color: buttontext, cursor: "pointer" }}>−</button>
//       <span style={{ width: 44, textAlign: "center", fontSize: 16, fontWeight: 700, color: buttontext, background: `${buttonbackground}` }}>{qty}</span>
//       <button onClick={increment} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${buttonbackground}`, border: "none", fontSize: 16, fontWeight: 500, color: buttontext, cursor: "pointer" }}>+</button>
//     </div>
//   );

//   return (
//     <>
//       <div className="textafter" style={{ width: "75%", margin:"2px auto 0px auto" }}>
//                 <div style={{ fontSize: 14, color: textColor, margin: "3px 0 0px 0", textAlign: "center" }}>
//           {renderHighlighted(t.fans[lang], highlightColor)}
//         </div>

     
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 10, direction: lang === "ar" ? "rtl" : "ltr" }}>
//           <QtyPill />
//           <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" , justifyContent:"center" }}>
//             <span style={{ fontSize: 24, fontWeight: 900, color: textColor }}>{item?.price * qty} {t.currency[lang]}</span>
//             <span style={{ fontSize: 12, color: textColor, opacity: 0.6 }}>{t.insteadOf[lang]}</span>
// <span className="old-price" style={{color:textColor}}>
//   {totalOldPrice} {t.currency[lang]}
// </span>
//           </div>
//         </div>
//       </div>   

//    <div className="cta-section" style={{ borderRadius: 16, overflow: "hidden", width: "75%", margin: "5px auto 0px auto", backgroundColor: backgroundColor, paddingBottom: 0 }}>
//       <div className="itemcta" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", flexWrap: "wrap", gap: 5, padding: "0px 5px" }}>

  
//         {/* Buy Button */}
//         <button
//           onClick={() => router.push(`/checkoutpage?qty=${qty}`)}
//           style={{ padding: "5px 38px", borderRadius: 16, background: buttonbackground, color: buttontext, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: `0 10px 30px ${buttonbackground}44`, transition: "transform 0.2s, box-shadow 0.2s", fontFamily: "inherit", width: "100%", margin: "5px 0", fontSize: 23 }}
//         >
//           {renderHighlighted(t.cta[lang], highlightColor)}
//         </button>
//       </div>
//     </div>
//     </>
 
//   );
  const QtyPill = () => (
    <div className="qtypill" style={{ display: "flex", alignItems: "center",background: `${buttonbackground}`, borderRadius: 16, overflow: "hidden", width: "fit-content", height: 35 }}>
      <button onClick={decrement} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background:  `${buttonbackground}`, border: "none", fontSize: 16, fontWeight: 500, color: buttontext, cursor: "pointer" }}>−</button>
      <span style={{ width: 44, textAlign: "center", fontSize: 16, fontWeight: 700, color: buttontext, background: `${buttonbackground}` }}>{qty}</span>
      <button onClick={increment} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: `${buttonbackground}`, border: "none", fontSize: 16, fontWeight: 500, color: buttontext, cursor: "pointer" }}>+</button>
    </div>
  );

  return (


    <>

        <div className="textafter" style={{ width: "75%", margin:"0px auto 3px auto" }}>
            <div style={{ fontSize: 14, color: textColor, margin: "3px 0 0px 0", textAlign: "center" }}>
          {renderHighlighted(t.fans[lang], highlightColor)}
        </div>

     
        <div className="price-desc" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 10, direction: lang === "ar" ? "rtl" : "ltr" }}>
          <QtyPill />
          <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" , justifyContent:"center" }}>
            <span className="currentprice" style={{ fontSize: 24, fontWeight: 900, color: textColor }}>{item?.price * qty} {t.currency[lang]}</span>
            <span className="insteadof" style={{ fontSize: 12, color: textColor, opacity: 0.6 }}>{t.insteadOf[lang]}</span>
<span className="old-price" style={{color:textColor}}>
  {totalOldPrice} {t.currency[lang]}
</span>
          </div>
        </div>
      </div>   
       <div className="cta-section" style={{ borderRadius: 16, overflow: "hidden", width: "75%", margin: "5px auto 0px auto", backgroundColor: backgroundColor, paddingBottom: 0 }}>
      <div className="itemcta" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", flexWrap: "wrap", gap: 5, padding: "0px 5px" }}>

  
          {/* Buy Button */}
          <Link href={`/checkoutpage?qty=${qty}`}>
        <button
     
          style={{ padding: "5px 38px", borderRadius: 16, background: buttonbackground, color: buttontext, fontWeight: 800, border: "none", cursor: "pointer", boxShadow: `0 10px 30px ${buttonbackground}44`, transition: "transform 0.2s, box-shadow 0.2s", fontFamily: "inherit", width: "100%", margin: "2px 0", fontSize: 23 }}
        >
          {renderHighlighted(t.cta[lang], highlightColor)}
            </button>
            </Link>
      </div>
    </div>
    

  
  
    </>

  );
}
