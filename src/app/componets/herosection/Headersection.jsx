"use client";
import "./hersection.css";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import { renderHighlighted } from "../utils/highlight";

export default function Headersection() {
  const settings = useSettings();
  const { lang } = useLang();
  if (!settings) return null;

  const highlightColor = settings?.colors?.highlightColor;
  const textColor      = settings?.colors?.textColor;
  const hook           = settings.hook;

  return (
    <div className="hero-content">
      <p className="hero-hook" style={{ color: textColor }}>
        {renderHighlighted(hook?.text1?.[lang], highlightColor)}
      </p>
    </div>
  );
}
