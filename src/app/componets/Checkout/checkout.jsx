"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";

const GOVS = {
  "القاهرة": ["القاهرة","مدينة نصر","شبرا","المطرية","عين شمس","حلوان","المعادي","مصر الجديدة","الزيتون","الأميرية","بولاق","السلام","الخليفة","الدرب الأحمر","الموسكي","الساحل","شبرا الخيمة","الوايلي"],
  "الجيزة": ["الجيزة","الدقي","المهندسين","العجوزة","إمبابة","بولاق الدكرور","الهرم","فيصل","أوسيم","الواحات البحرية","كرداسة","البدرشين","العياط","أطفيح","الصف"],
  "الإسكندرية": ["الإسكندرية","المنتزه","العجمي","برج العرب","أبو قير","الرمل","المحطة","سيدي جابر","باب شرق","العامرية","ورديان"],
  "الدقهلية": ["المنصورة","طلخا","ميت غمر","أجا","المنزلة","دكرنس","بلقاس","تمي الأمديد","شربين","نبروه","السنبلاوين","الجمالية","منية النصر"],
  "الشرقية": ["الزقازيق","بلبيس","منيا القمح","أبو كبير","ههيا","الإبراهيمية","فاقوس","أبو حماد","الحسينية","كفر صقر","القنايات","العاشر من رمضان","ديرب نجم"],
  "المنوفية": ["شبين الكوم","مينوف","أشمون","الباجور","قويسنا","بركة السبع","تلا","السادات","الشهداء"],
  "البحيرة": ["دمنهور","كفر الدوار","رشيد","إدكو","أبو حمص","حوش عيسى","الدلنجات","المحمودية","إيتاي البارود","شبراخيت","وادي النطرون","النوبارية"],
  "الغربية": ["طنطا","المحلة الكبرى","كفر الزيات","زفتى","السنطة","بسيون","سمنود","قطور"],
  "كفر الشيخ": ["كفر الشيخ","دسوق","فوه","مطوبس","بلطيم","سيدي سالم","الحامول","برج البرلس","قلين"],
  "الفيوم": ["الفيوم","سنورس","إطسا","أبشواي","يوسف الصديق","طامية"],
  "بني سويف": ["بني سويف","الفشن","ببا","إهناسيا","بياض العرب","ناصر","سمسطا"],
  "المنيا": ["المنيا","ملوي","أبو قرقاص","العدوة","سمالوط","مطاي","بني مزار","دير مواس","المغاغة"],
  "أسيوط": ["أسيوط","ديروط","القوصية","منفلوط","أبو تيج","صدفا","الفتح","الغنايم","ساحل سليم","أبنوب"],
  "سوهاج": ["سوهاج","أخميم","جرجا","المراغة","دار السلام","جهينة","المنشأة","البلينا","طما","طهطا"],
  "قنا": ["قنا","نجع حمادي","دشنا","قوص","فرشوط","أبو تشت","نقادة","الوقف"],
  "الأقصر": ["الأقصر","إسنا","أرمنت","الطود","القرنة"],
  "أسوان": ["أسوان","كوم أمبو","إدفو","نصر النوبة","دراو","أبو سمبل السياحية"],
  "البحر الأحمر": ["الغردقة","سفاجا","القصير","مرسى علم","رأس غارب","الشلاتين"],
  "الوادي الجديد": ["الخارجة","الداخلة","الفرافرة","بريس"],
  "مطروح": ["مرسى مطروح","الحمام","الضبعة","سيوة","الواحات","النجيلة"],
  "شمال سيناء": ["العريش","رفح","الشيخ زويد","بئر العبد","الحسنة","نخل"],
  "جنوب سيناء": ["الطور","شرم الشيخ","دهب","نويبع","طابا","أبو رديس","رأس سدر"],
  "الإسماعيلية": ["الإسماعيلية","التل الكبير","القصاصين","فايد","أبو صوير"],
  "السويس": ["السويس","عتاقة","الجناين","فيصل"],
  "بورسعيد": ["بورسعيد","بورفؤاد","بور الصياد","بور الجميل","الزهور","المناخ","الشرق"],
  "دمياط": ["دمياط","رأس البر","الزرقا","فارسكور","كفر سعد","عزبة البرج"],
};

const SHIPPING = 60;

export default function Checkout({ product }) {
  const settings = useSettings();
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const initialQty = Number(searchParams.get("qty")) || 1;
  const [qty, setQty] = useState(initialQty);
  const [payMethod, setPayMethod] = useState("cash");
  const [form, setForm] = useState({ name: "", email: "", phone: "", gov: "", city: "", address: "" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v, ...(k === "gov" ? { city: "" } : {}) }));
  const cities = form.gov ? GOVS[form.gov] ?? [] : [];
  const subtotal = qty * (product?.price ?? 0);
  const total = subtotal + SHIPPING;

  const t = {
    title: { ar: "إتمام الطلب", en: "Complete Order" },
    subtitle: { ar: "خطوة واحدة وطلبك في طريقه إليك", en: "One step and your order is on its way" },
    delivery: { ar: "بيانات التوصيل", en: "Delivery Details" },
    name: { ar: "الاسم الكامل", en: "Full Name" },
    namePh: { ar: "محمد أحمد", en: "John Smith" },
    email: { ar: "البريد الإلكتروني", en: "Email" },
    phone: { ar: "رقم الهاتف", en: "Phone Number" },
    gov: { ar: "المحافظة", en: "Governorate" },
    govPh: { ar: "اختر المحافظة", en: "Select Governorate" },
    city: { ar: "المدينة / المركز", en: "City / District" },
    cityPh: { ar: "اختر المدينة", en: "Select City" },
    cityFirst: { ar: "اختر المحافظة أولاً", en: "Select governorate first" },
    address: { ar: "العنوان بالتفاصيل", en: "Detailed Address" },
    addressPh: { ar: "الشارع، رقم المبنى، الدور، الشقة...", en: "Street, building number, floor, apartment..." },
    payMethod: { ar: "طريقة الدفع", en: "Payment Method" },
    cash: { ar: "الدفع عند الاستلام", en: "Cash on Delivery" },
    cashSub: { ar: "كاش", en: "Cash" },
    visa: { ar: "بطاقة ائتمان", en: "Credit Card" },
    visaSub: { ar: "فيزا / ماستر", en: "Visa / Master" },
    summary: { ar: "ملخص الطلب", en: "Order Summary" },
    unitPrice: { ar: "سعر المنتج", en: "Unit Price" },
    quantity: { ar: "الكمية", en: "Quantity" },
    shipping: { ar: "الشحن", en: "Shipping" },
    total: { ar: "الإجمالي", en: "Total" },
    confirm: { ar: " تأكيد الطلب", en: " Confirm Order" },
    fastShip: { ar: " ✓ شحن سريع", en: "Fast Shipping ✓" },
    quality: { ar: "ضمان الجودة", en: "Quality Guarantee ✓" },
    secure: { ar: "✓ دفع آمن", en: "Secure Payment ✓" },
    currency: { ar: "جنيه", en: "EGP" },
    qty: { ar: "الكمية", en: "Quantity" },
    size: { ar: "الحجم: 100 مل", en: "Size: 100ml" },
    errName: { ar: "أدخل اسمك", en: "Enter your name" },
    errEmail: { ar: "إيميل غير صحيح", en: "Invalid email" },
    errPhone: { ar: "رقم غير صحيح", en: "Invalid phone number" },
    errGov: { ar: "اختر المحافظة", en: "Select governorate" },
    errCity: { ar: "اختر المدينة", en: "Select city" },
    errAddress: { ar: "أدخل عنوانك", en: "Enter your address" },
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = t.errName[lang];
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.errEmail[lang];
    if (!/^01[0-9]{9}$/.test(form.phone)) e.phone = t.errPhone[lang];
    if (!form.gov) e.gov = t.errGov[lang];
    if (!form.city) e.city = t.errCity[lang];
    if (form.address.trim().length < 5) e.address = t.errAddress[lang];
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log("order:", { form, qty, payMethod, total });
  };

  const inputCls = (k) =>
    `border rounded-xl px-4 py-2.5 text-sm outline-none transition w-full bg-white
     ${errors[k] ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 focus:border-[#c8a93e] focus:ring-1 focus:ring-[#c8a93e33]"}`;

  const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold" style={{ color: settings?.colors?.primary }}>{label}</label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );

  const gold = settings?.colors?.gold ?? "#c8a93e";
  const goldLight = settings?.colors?.goldLight ?? "#d4b84a";
  const primary = settings?.colors?.primary ?? "#3a4520";
  const dir = lang === "ar" ? "rtl" : "ltr";

  const productName = product?.name?.[lang] || product?.name?.ar;

  return (
    <div
      dir={dir}
      className="min-h-screen py-10 px-4"
      style={{ background: "#f7f5f0", fontFamily: "'Cairo', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold" style={{ color: primary }}>{t.title[lang]}</h1>
          <p className="text-sm text-gray-400 mt-1">{t.subtitle[lang]}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6">

        
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">
              {t.delivery[lang]}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t.name[lang]} error={errors.name}>
                <input className={inputCls("name")} placeholder={t.namePh[lang]}
                  value={form.name} onChange={e => set("name", e.target.value)}
                  style={{ color: primary }} />
              </Field>
              <Field label={t.email[lang]} error={errors.email}>
                <input className={inputCls("email")} placeholder="example@email.com"
                  type="email" dir="ltr" value={form.email}
                  onChange={e => set("email", e.target.value)}
                  style={{ color: primary }} />
              </Field>
            </div>

            <Field label={t.phone[lang]} error={errors.phone}>
              <input className={inputCls("phone")} placeholder="01xxxxxxxxx"
                maxLength={11} dir="ltr" value={form.phone}
                onChange={e => set("phone", e.target.value)}
                style={{ color: primary }} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label={t.gov[lang]} error={errors.gov}>
                <select className={inputCls("gov")} value={form.gov}
                  onChange={e => set("gov", e.target.value)}
                  style={{ color: primary }}>
                  <option value="">{t.govPh[lang]}</option>
                  {Object.keys(GOVS).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label={t.city[lang]} error={errors.city}>
                <select className={inputCls("city")} value={form.city}
                  disabled={!form.gov} onChange={e => set("city", e.target.value)}
                  style={{ color: primary }}>
                  <option value="">{form.gov ? t.cityPh[lang] : t.cityFirst[lang]}</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label={t.address[lang]} error={errors.address}>
              <textarea className={inputCls("address")} rows={3}
                placeholder={t.addressPh[lang]}
                value={form.address} onChange={e => set("address", e.target.value)}
                style={{ color: primary }} />
            </Field>

            <div className="flex flex-col gap-3 pt-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.payMethod[lang]}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "cash", label: t.cash[lang], icon: "💵", sub: t.cashSub[lang] },
                  { key: "visa", label: t.visa[lang], icon: "💳", sub: t.visaSub[lang] },
                ].map(opt => (
                  <button key={opt.key} onClick={() => setPayMethod(opt.key)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-right"
                    style={{
                      borderColor: payMethod === opt.key ? gold : "#e5e7eb",
                      background: payMethod === opt.key ? gold + "11" : "#fff",
                    }}>
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: primary }}>{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.sub}</p>
                    </div>
                    <div className="mr-auto ml-auto">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: payMethod === opt.key ? gold : "#d1d5db" }}>
                        {payMethod === opt.key && (
                          <div className="w-2 h-2 rounded-full" style={{ background: gold }} />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ملخص الطلب */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
              <div className="flex gap-4 items-center">
                <img
                  src={product?.images?.[0]}
                  alt="product"
                  className="w-20 h-20 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
                />
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-bold leading-snug" style={{ color: primary }}>{productName}</p>
                  <p className="text-xs text-gray-400">{t.size[lang]}</p>
                  <p className="text-base font-extrabold mt-1" style={{ color: gold }}>
                    {product?.price} {t.currency[lang]}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">{t.qty[lang]}</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition cursor-pointer"
                    style={{ color: primary }}>−</button>
                  <span className="text-base font-bold min-w-[20px] text-center" style={{ color: gold }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition cursor-pointer"
                    style={{ color: primary }}>+</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">
                {t.summary[lang]}
              </p>
              {[
                [t.unitPrice[lang], `${product?.price} ${t.currency[lang]}`],
                [t.quantity[lang], `× ${qty}`],
                [t.shipping[lang], `${SHIPPING} ${t.currency[lang]}`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium" style={{ color: primary }}>{v}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-bold" style={{ color: primary }}>{t.total[lang]}</span>
                <span className="text-xl font-extrabold" style={{ color: gold }}>
                  {total.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")} {t.currency[lang]}
                </span>
              </div>
            </div>

            <button onClick={handleSubmit}
              className="w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
                color: "#1a1a0a",
                boxShadow: `0 8px 24px ${gold}44`,
              }}>
              {t.confirm[lang]}
            </button>
      <div className="flex items-center justify-center gap-6 opacity-50 text-xs text-black" >
          <span>{t.fastShip[lang]}</span>
          <span>{t.quality[lang]}</span>
          <span>{t.secure[lang]}</span>
        </div>
        
          </div>
        </div>
      </div>
    </div>
  );
}
