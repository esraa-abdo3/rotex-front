"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ar");
  const toggleLang = () => setLang(l => l === "ar" ? "en" : "ar");
  const dir = lang === "ar" ? "rtl" : "ltr";

  // غير direction الصفحة كلها
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <LangContext.Provider value={{ lang, toggleLang, dir }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
