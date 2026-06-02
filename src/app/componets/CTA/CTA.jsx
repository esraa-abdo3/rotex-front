"use client";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./CTA.css"

export default function CTA() {
    const router = useRouter();
    const settings = useSettings();
    const { lang } = useLang();
    const gold      = settings.colors?.gold          ?? "#c8a93e";
    const goldLight = settings.colors?.goldLight      ?? "#d4b84a";
    const primary   = settings.colors?.primary        ?? "#3a4520";
    const secDark   = settings.colors?.secondaryDark  ?? "#2d3518";
    const dir = lang === "ar" ? "rtl" : "ltr";
     const t = {
    label: { ar: "آراء العملاء",               en: "Customer Reviews" },
    title: { ar: "البنات اللي جرّبوا",         en: "Girls who tried" },
    felt:  { ar: "حسّوا بالفرق",               en: "felt the difference" },
        cta: {
          ar: settings?.buttonText?.ar,
          en: settings?.buttonText?.en
        },
    fans:  { ar: "بنت حبّوا النتيجة 💛",        en: "girls loved the results 💛" },
    empty: { ar: "لا توجد تقييمات بعد",         en: "No reviews yet" },
  };
    return (
      <div className="cta-section"
        style={{
          marginTop: 52, borderRadius: 32,
          background: `linear-gradient(135deg, ${secDark}, ${primary})`,
          border: `1px solid ${gold}33`,
            overflow: "hidden",
            marginBottom: "40px",
            width: "80%",
          margin :"40px auto 40px auto"
        }}>
        <div
          className="itemcta"
          style={{
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
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", marginTop: 6  , textAlign:"center"}}>
                {t.fans[lang]}
              </div>
            </div>
                <Link href={"/checkoutpage"}>
                       <button
            
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
                </Link>
         
          </div>
        </div>
    )
}