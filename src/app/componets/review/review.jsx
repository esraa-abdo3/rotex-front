"use client";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";

export default function Review() {
  const settings = useSettings();
  const { lang } = useLang();

  const handleScroll = () => {
    document.getElementById("product")?.scrollIntoView({ behavior: "smooth" });
  };

  const reviews = {
    ar: [
      { text: "من أول أسبوعين حسيت بفرق حقيقي. شعري بقى أكثف وما بتساقطش زي زمان.", name: "سارة م." },
      { text: "كنت شايلة هم تساقط الشعر من زمان، جربت RooteX وما تركتوش تاني.", name: "نورا ع." },
      { text: "ريحته حلوة ونتيجته أحلى. شعري رجع زي ما كانش بيتساقط خالص.", name: "مروة ح." },
    ],
    en: [
      { text: "Within just two weeks, I noticed a real difference. My hair became thicker and stopped falling like before.", name: "Sara M." },
      { text: "I'd been worried about hair loss for a long time. I tried RooteX and never looked back.", name: "Nora A." },
      { text: "It smells amazing and the results are even better. My hair looks like it never fell out at all.", name: "Marwa H." },
    ],
  };

  const t = {
    label: { ar: "آراء العملاء", en: "Customer Reviews" },
    title: { ar: "البنات اللي جرّبوا", en: "Girls who tried" },
    felt: { ar: "حسّوا بالفرق", en: "felt the difference" },
    cta: { ar: `ابدئي رحلتك مع RooteX الآن`, en: "Start your RooteX journey now" },
    fans: { ar: "بنت حبّوا النتيجة 💛", en: "girls loved the results 💛" },
  };

  if (!settings) return null;

  return (
    <section
      id="reviews"
      className="py-20 px-5"
      style={{ color: settings.colors.primary, direction: lang === "ar" ? "rtl" : "ltr" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm tracking-[4px] mb-4" style={{ color: settings.colors.gold }}>
            {t.label[lang]}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold leading-relaxed">
            {t.title[lang]}{" "}
            <span style={{ color: settings.colors.primary }}>
              Roote<span style={{ color: settings.colors.gold }}>x</span>
            </span>{" "}
            {t.felt[lang]}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews[lang].map((review, index) => (
            <div
              key={index}
              className="rounded-[28px] p-7 border backdrop-blur-md transition duration-300 hover:-translate-y-2"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
              }}
            >
              <div className="text-2xl mb-5" style={{ color: settings.colors.gold }}>★★★★★</div>
              <p className="text-[17px] leading-[2] opacity-90 mb-6">{review.text}</p>
              <p className="font-bold text-lg" style={{ color: settings.colors.goldLight }}>— {review.name}</p>
            </div>
          ))}
        </div>

        <div
          className="mt-14 rounded-[32px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${settings.colors.secondaryDark}, ${settings.colors.primary})`,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-10">
            <div className="text-center md:text-right">
              <div className="text-5xl font-black mb-2" style={{ color: settings.colors.gold }}>+1000</div>
              <div className="text-lg opacity-90 text-white">{t.fans[lang]}</div>
            </div>
            <div className="hidden md:block h-20 w-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
            <button
              className="px-10 py-4 rounded-full text-black font-bold text-lg transition duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(to right, ${settings.colors.gold}, ${settings.colors.goldLight})`,
                boxShadow: "0 10px 30px rgba(200,169,62,0.3)",
              }}
              onClick={handleScroll}
            >
              {t.cta[lang]}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
