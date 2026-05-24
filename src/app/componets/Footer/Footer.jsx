"use client";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import Link from "next/link";

export default function Footer() {
  const settings = useSettings();
  const { lang } = useLang();

  const t = {
    density:    { ar: "كثافة أكثر",      en: "More Density" },
    strength:   { ar: "قوة أكبر",        en: "More Strength" },
    confidence: { ar: "ثقة تدوم",        en: "Lasting Confidence" },
    tagline:    { ar: "شعرك يستاهل الأفضل", en: "Your hair deserves the best" },
    rights:     { ar: "جميع الحقوق محفوظة", en: "All Rights Reserved" },
    made:       { ar: "صُنع بـ ❤️ لكل امرأة تستحق الثقة", en: "Made with ❤️ for every woman who deserves confidence" },
  };

  if (!settings) return null;

  const gold = settings.colors.gold;
  const primaryDark = settings.colors.primaryDark;
  const primary = settings.colors.primary;
  const year = new Date().getFullYear();

  return (
  <>

    <footer
      dir={lang === "ar" ? "rtl" : "ltr"}
      style={{ background: primaryDark, fontFamily: "'Cairo', sans-serif" }}
      >
        

      <div
        className="border-t"
        style={{ borderColor: gold + "22" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-8">

       
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-2xl font-black tracking-wide text-white">
              Roote<span style={{ color: gold }}>x</span>
            </span>
            <p className="text-sm" style={{ color: gold + "99" }}>
              {t.tagline[lang]}
            </p>
          </div>

       
          <div className="flex items-center gap-6">
            {[t.density[lang], t.strength[lang], t.confidence[lang]].map((item, i, arr) => (
              <div key={item} className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className="text-lg font-bold"
                    style={{ color: gold }}
                  >
                    {["✦", "✦", "✦"][i]}
                  </span>
                  <span className="text-sm font-semibold text-white opacity-80">{item}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-8 w-px" style={{ background: gold + "33" }} />
                )}
              </div>
            ))}
          </div>


          </div>
        </div>
    

    
      <div
        className="border-t"
        style={{ borderColor: gold + "15" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs opacity-40 text-white">
            {t.made[lang]}
          </p>
          <p className="text-xs opacity-40 text-white">
            © {year} RooteX — {t.rights[lang]}
          </p>
        </div>
      </div>
    </footer >
        </>
  );
}