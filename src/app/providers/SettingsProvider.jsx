
"use client";
import { createContext, useContext, useEffect } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children, initialSettings }) {
  
  const settings = initialSettings ?? null;


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
    : "Cairo, sans-serif";

  return (
    <SettingsContext.Provider value={settings}>
      <div style={{ fontFamily }}>
        {children}
      </div>
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);