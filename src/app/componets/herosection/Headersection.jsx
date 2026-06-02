"use client";
import "./hersection.css";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Headersection() {
  const settings = useSettings();
  
  const { lang } = useLang();

  if (!settings) return null;

  const hook = settings.hook;
  const hookJSX = (
    <>
      {hook?.text1?.[lang]}
      <br />
      {hook?.text2?.[lang]}{" "}
      <span className="hero-highlight" style={{ color: settings.colors.gold }}>
        {hook?.highlight1?.[lang]}
      </span>
      {" ... "}
      <span className="hero-highlight" style={{ color: settings.colors.gold }}>
        {hook?.highlight2?.[lang]}
      </span>
    </>
  );
    return (

<div className="hero-content">
 
  <div className="hero-decoration">
    <span className="hero-line" style={{backgroundColor: settings.colors.gold}}></span>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill={settings.colors.gold}
    >
      <path d="M12 2c-1.5 3-3.5 5-6 6 2.5 1 4.5 3 6 6 1.5-3 3.5-5 6-6-2.5-1-4.5-3-6-6z" />
    </svg>

    <span className="hero-line" style={{backgroundColor: settings.colors.gold}}></span>
  </div>

  
            <p className="hero-hook"
                style={{color : settings.colors.primary}}
            >
    {hookJSX}
  </p>


 


</div>
    )
}