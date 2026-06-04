
"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings ?? null);

  useEffect(() => {
    fetch("https://rootex-backend.vercel.app/api/v1/setting")
      .then(r => r.json())
      .then(data => {
        console.log(data)
        setSettings({
          brand: data?.settings?.Brand,
           shippingSignature: data?.settings?.shippingSignature,
          hook: data?.settings?.hook,
          buttonText: data?.settings?.buttonText,
          shippingPrice: data?.settings?.shippingPrice,
         floatingButton: data?.settings?.floatingButton,
          colors: {
            backgroundColor: data?.settings?.colors?.backgroundColor,
            buttonbackground: data?.settings?.colors?.buttonbackground,
            buttontext: data?.settings?.colors?.buttontext,
            textColor: data?.settings?.colors?.textColor,
            highlightColor: data?.settings?.colors?.highlightColor,
          },
          image: data?.settings?.images?.herosection,
          resultBg:data?.settings?.images?.resultBg,
          Fontfamily: data?.settings?.Fontfamily,
          reviews: data?.settings?.reviewheader,
          fansText: data?.settings?.fansText,
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