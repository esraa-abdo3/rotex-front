
"use client";
import "./hersection.css";
import { useSettings } from "@/app/providers/SettingsProvider";
export default function Herosection() {
  const settings = useSettings();
  if (!settings) return null;
  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${settings.image})` }}
    >
      <div className="hero-content-badge">
  
      </div>
    </section>
  );
}