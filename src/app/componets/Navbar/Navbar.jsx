"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Navbar() {
  const settings = useSettings();
  const { user, loading } = useAuth();
  const { lang, toggleLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const t = {
    product: { ar: "المنتج", en: "Product" },
    reviews: { ar: "آراء العملاء", en: "Reviews" },
    buyNow: { ar: "اشتري الآن", en: "Buy Now" },
    dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  };

  const gold = settings?.colors?.gold ?? "#c8a93e";
  const primaryDark = settings?.colors?.primaryDark ?? "#1a1f0e";
  const primary = settings?.colors?.primary ?? "#3a4520";
  const goldLight = settings?.colors?.goldLight ?? "#d4b84a";

  const handleScroll = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: `${primaryDark}f2`,
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${primary}33`,
        fontFamily: "'Cairo', sans-serif",
        direction: lang === "ar" ? "rtl" : "ltr",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 24px", height: 68,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: 1 }}>
              Roote<span style={{ color: gold }}>x</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="nav-desktop" style={{
            display: "flex", alignItems: "center",
            gap: 32, listStyle: "none", margin: 0, padding: 0,
          }}>
            <li>
              <button onClick={() => handleScroll("product")} style={linkStyle}>
                {t.product[lang]}
              </button>
            </li>
            <li>
              <button onClick={() => handleScroll("reviews")} style={linkStyle}>
                {t.reviews[lang]}
              </button>
            </li>
          </ul>

          {/* Right Side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

            {/* Language Toggle */}
            <button onClick={toggleLang} style={{
              background: "rgba(255,255,255,0.06)",
              border: `1px solid ${primary}55`,
              borderRadius: 8, padding: "6px 14px",
              color: "rgba(255,255,255,0.75)",
              fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Cairo', sans-serif",
              transition: "all 0.2s",
              letterSpacing: 0.5,
            }}>
              {lang === "ar" ? "EN" : "عر"}
            </button>

            {/* Dashboard لو admin */}
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
              }}>
                ⚙️ {t.dashboard[lang]}
              </Link>
            )}

            {/* Buy Now */}
            <Link href="/checkoutpage" className="nav-cta" style={{
              padding: "9px 20px", borderRadius: 10,
              background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
              color: "#1a1a0a", fontWeight: 700, fontSize: 14,
              fontFamily: "'Cairo', sans-serif",
              textDecoration: "none", border: "none",
              cursor: "pointer", transition: "all 0.2s",
              boxShadow: `0 4px 14px ${gold}33`,
            }}>
              {t.buyNow[lang]}
            </Link>

            {/* Hamburger */}
            <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
              display: "none", background: "none",
              border: "none", color: "white",
              fontSize: 22, cursor: "pointer", padding: "4px 8px",
            }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            background: primaryDark,
            borderTop: `1px solid ${primary}33`,
            padding: "16px 24px 20px",
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <button onClick={() => handleScroll("product")} style={mobileLinkStyle}>
              {t.product[lang]}
            </button>
            <button onClick={() => handleScroll("reviews")} style={mobileLinkStyle}>
              {t.reviews[lang]}
            </button>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={toggleLang} style={{
                flex: 1, padding: "10px",
                borderRadius: 10, border: `1px solid ${primary}55`,
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.75)",
                fontWeight: 700, fontSize: 14,
                cursor: "pointer", fontFamily: "'Cairo', sans-serif",
              }}>
                {lang === "ar" ? "English" : "العربية"}
              </button>

              {!loading && user?.role === "admin" && (
                <Link href="/admin" onClick={() => setMenuOpen(false)} style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: `1px solid ${gold}44`,
                  background: "rgba(255,255,255,0.05)",
                  color: gold, fontWeight: 700, fontSize: 14,
                  fontFamily: "'Cairo', sans-serif",
                  textDecoration: "none", textAlign: "center",
                }}>
                  ⚙️ {t.dashboard[lang]}
                </Link>
              )}
            </div>

            <Link href="/checkoutpage" onClick={() => setMenuOpen(false)} style={{
              padding: "12px", borderRadius: 10, textAlign: "center",
              background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
              color: "#1a1a0a", fontWeight: 700, fontSize: 15,
              fontFamily: "'Cairo', sans-serif", textDecoration: "none",
            }}>
              {t.buyNow[lang]}
            </Link>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-cta { display: none !important; }
        }
      `}</style>
    </>
  );
}

const linkStyle = {
  background: "none", border: "none",
  color: "rgba(255,255,255,0.65)",
  fontSize: 15, fontWeight: 600,
  cursor: "pointer", fontFamily: "'Cairo', sans-serif",
  transition: "color 0.2s", padding: 0,
};

const mobileLinkStyle = {
  background: "none", border: "none",
  color: "rgba(255,255,255,0.7)",
  fontSize: 16, fontWeight: 600,
  cursor: "pointer", fontFamily: "'Cairo', sans-serif",
  textAlign: "right", padding: "8px 0",
};