"use client";

import Link from "next/link";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import "./Navbar.css"
export default function Navbar() {
  const settings = useSettings();
  const { user, loading } = useAuth();
  const { lang, toggleLang } = useLang();


  const t = {
    buyNow: { ar: "اشتري الآن", en: "Buy Now" },
    dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  };

  const gold = settings?.colors?.gold ?? "#c8a93e";
  const primaryDark = settings?.colors?.primaryDark ?? "#1a1f0e";
  const primary = settings?.colors?.primary ?? "#3a4520";
  const goldLight = settings?.colors?.goldLight ?? "#d4b84a";


  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${primaryDark}f2`,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${primary}33`,
     fontFamily: settings?.fontFamily || "'Cairo', sans-serif",
        direction: lang === "ar" ? "rtl" : "ltr",
      }}>
        <div style={{
          maxWidth: "85%", margin: "0 auto",
          padding: "0 24px", height: 68,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>

        
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: 1 }}>
              Roote<span style={{ color: gold }}>x</span>
            </span>
          </Link>

    


          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

         
            <button onClick={toggleLang} style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${primary}55`,
              borderRadius: 8, padding: "6px 14px",
              color: "rgba(255,255,255,0.75)",
              fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Cairo', sans-serif",
              transition: "all 0.2s",
              letterSpacing: 0.5,
            }}
            className="setting-desctop"
            
            >
              {lang === "ar" ? "EN" : "ar"}
            </button>

      
            {!loading && user?.role === "admin" && (
              <Link href="/admin" style={{
                padding: "8px 16px", borderRadius: 10,
                background: "rgba(255,255,255,0.08)",
                border: `1px solid ${gold}44`,
                color: gold, fontWeight: 700, fontSize: 13,
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
              background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
              color: "#1a1a0a", fontWeight: 700, fontSize: 14,
              fontFamily: "'Cairo', sans-serif",
              textDecoration: "none", border: "none",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: `0 4px 14px ${gold}33`,
            }}
             
             
            >
              {t.buyNow[lang]}
            </Link>

        
     
          </div>
        </div>

    
      </nav>

      {/* <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
      
          .nav-cta { display: none !important; }
        }
      `}</style> */}
    </>
  );
}



