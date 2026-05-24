"use client";
import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);


export function SettingsProvider({ children ,initialSettings}) {
   const [settings ,setSettings] = useState(initialSettings ?? null);

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
        });
      })
      .catch(err => console.error("settings error:", err));
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
