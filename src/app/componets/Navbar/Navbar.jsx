"use client";

import Link from "next/link";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import "./Navbar.css"
import { renderHighlighted } from "../utils/highlight";
export default function Navbar() {
  const settings = useSettings();
  const { user, loading } = useAuth();
  const { lang, toggleLang } = useLang();


  const t = {
    buyNow: { ar: "اشتري الآن", en: "Buy Now" },
    dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  };

  const buttonbackground = settings?.colors?.buttonbackground 
  const backgroundColor = settings?.colors?.backgroundColor 
  const highlightColor = settings?.colors?.highlightColor
  const textColor = settings?.colors?.textColor ;
  const buttontext = settings?.colors?.buttontext;
  const Brand = settings?.brand;
 


  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${backgroundColor}`,
        backdropFilter: "blur(16px)",
       
     fontFamily: settings?.fontFamily || "'Cairo', sans-serif",
        direction: lang === "ar" ? "rtl" : "ltr",
      }}>
        <div style={{
          maxWidth: "95%", margin: "0 auto",
          padding: "0 24px", height: 50,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>

        
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: textColor, letterSpacing: 1 }}>
  {renderHighlighted(Brand, highlightColor)}
</span>
          </Link>

    


          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={toggleLang} style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${textColor}55`,
              borderRadius: 8, padding: "6px 14px",
              color: textColor,
              fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Cairo', sans-serif",
              transition: "all 0.2s",
              letterSpacing: 0.5,
            }}
            className="setting-desctop"
            
            >
              {lang === "ar" ? "English" : "arabic"}
            </button>

            {!loading && user?.role === "admin" && (
              <Link href="/admin" style={{
                padding: "8px 16px", borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                border: `1px solid ${textColor}44`,
                color: textColor, fontWeight: 700, fontSize: 13,
                fontFamily: "'Cairo', sans-serif",
                textDecoration: "none", display: "flex",
                alignItems: "center", gap: 6,
                transition: "all 0.2s",
              }}
                className="setting-desctop"
              >
                ⚙️ {t.dashboard[lang]}
              </Link>
            )}

            <Link href="/checkoutpage" className="nav-cta setting-desctop" style={{
              padding: "9px 20px", borderRadius: 10,
              background: buttonbackground,
              color:buttontext, fontWeight: 700, fontSize: 14,
              fontFamily: "'Cairo', sans-serif",
              textDecoration: "none", border: "none",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: `0 4px 14px ${buttonbackground}33`,
            }}
            >
              {t.buyNow[lang]}
            </Link>
          </div>
        </div>
      </nav>

    </>
  );
}



