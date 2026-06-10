"use client";
import { createContext, useContext, useState, useEffect } from "react";

const LangContext = createContext(null);

const LANG_KEY = "rootex_lang";

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("ar");


  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "ar") {
      setLang(saved);
    }
  }, []);

  const toggleLang = () => {
    setLang(l => {
      const next = l === "ar" ? "en" : "ar";
      localStorage.setItem(LANG_KEY, next);
      return next;
    });
  };

  const dir = lang === "ar" ? "rtl" : "ltr";

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
