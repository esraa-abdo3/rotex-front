
"use client";
import "./hersection.css";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Herosection() {
  const settings = useSettings();
  const { lang } = useLang();
  if (!settings) return null;

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${settings.image})` }}
    >
  
      <div className="hero-overlay" />

   
      <div className="hero-content-badge">
        <div className="hero-badge">
          <div className="hero-badge-dot" />
          <div>
            <h4 className="hero-badge-title">RootX Spray</h4>
            <p className="hero-badge-sub">
              {lang === "ar" ? "مناسب لكل أنواع الشعر" : "Suitable for all hair types"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}