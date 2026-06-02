
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings ?? null);

  useEffect(() => {
    fetch("https://rootex-backend.vercel.app/api/v1/setting")
      .then(r => r.json())
      .then(data => {
        setSettings({
          brand: "RooteX",
          hook: data?.settings?.hook,
          buttonText: data?.settings?.buttonText,
          colors: {
            primaryDark: data?.settings?.colors?.primaryDark,
            secondaryDark: data?.settings?.colors?.secondaryDark,
            primary: data?.settings?.colors?.primary,
            gold: data?.settings?.colors?.gold,
            goldLight: data?.settings?.colors?.goldLight,
          },
          image: data?.settings?.images?.herosection,
          resultBg:data?.settings?.images?.resultBg,
          Fontfamily: data?.settings?.Fontfamily,
        });
      })
      .catch(err => console.error("settings error:", err));
  }, []);

 
  useEffect(() => {
    if (!settings?.Fontfamily) return;

    const fontName = settings.Fontfamily.trim();
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@400;600;700;800;900&display=swap`;

    const existing = document.getElementById("dynamic-font");
    if (existing?.href === fontUrl) return; 
    if (existing) existing.remove();

    const link = document.createElement("link");
    link.id = "dynamic-font";
    link.rel = "stylesheet";
    link.href = fontUrl;
    document.head.appendChild(link);
  }, [settings?.Fontfamily]);

const fontFamily = settings?.Fontfamily
  ? `${settings.Fontfamily}`
  : "Cairo, sans-serif"; // default font


  return (
    <SettingsContext.Provider value={settings}>
      <div style={{ fontFamily }}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);