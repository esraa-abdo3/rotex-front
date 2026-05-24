"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

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

const colors = {
  primaryDark: "#1a1f0e",
  primary: "#3a4520",
  gold: "#c8a93e",
  goldLight: "#d4b84a",
};

const SHIPPING = 60;

export default function Checkout({ product }) {
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

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = "أدخل اسمك";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "إيميل غير صحيح";
    if (!/^01[0-9]{9}$/.test(form.phone)) e.phone = "رقم غير صحيح";
    if (!form.gov) e.gov = "اختر المحافظة";
    if (!form.city) e.city = "اختر المدينة";
    if (form.address.trim().length < 5) e.address = "أدخل عنوانك";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    console.log("order:", { form, qty, payMethod, total });
  };

  const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold" style={{ color: colors.primary }}>{label}</label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );

  const inputCls = (k) =>
    `border rounded-xl px-4 py-2.5 text-sm outline-none transition w-full bg-white
     ${errors[k] ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 focus:border-[#c8a93e] focus:ring-1 focus:ring-[#c8a93e33]"}`;

  return (
    <div
      dir="rtl"
      className="min-h-screen py-10 px-4"
      style={{ background: "#f7f5f0", fontFamily: "'Cairo', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold" style={{ color: colors.primary }}>
            إتمام الطلب
          </h1>
          <p className="text-sm text-gray-400 mt-1">خطوة واحدة وطلبك في طريقه إليك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6">

          {/* ===== الجانب الأيمن — بيانات العميل ===== */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">

            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">
              بيانات التوصيل
            </p>

            <div className="grid grid-cols-2 gap-4">
              <Field label="الاسم الكامل" error={errors.name}>
                <input className={inputCls("name")} placeholder="محمد أحمد"
                  value={form.name} onChange={e => set("name", e.target.value)}
                  style={{ color: colors.primary }} />
              </Field>
              <Field label="البريد الإلكتروني" error={errors.email}>
                <input className={inputCls("email")} placeholder="example@email.com"
                  type="email" dir="ltr" value={form.email}
                  onChange={e => set("email", e.target.value)}
                  style={{ color: colors.primary }} />
              </Field>
            </div>

            <Field label="رقم الهاتف" error={errors.phone}>
              <input className={inputCls("phone")} placeholder="01xxxxxxxxx"
                maxLength={11} dir="ltr" value={form.phone}
                onChange={e => set("phone", e.target.value)}
                style={{ color: colors.primary }} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="المحافظة" error={errors.gov}>
                <select className={inputCls("gov")} value={form.gov}
                  onChange={e => set("gov", e.target.value)}
                  style={{ color: colors.primary }}>
                  <option value="">اختر المحافظة</option>
                  {Object.keys(GOVS).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="المدينة / المركز" error={errors.city}>
                <select className={inputCls("city")} value={form.city}
                  disabled={!form.gov} onChange={e => set("city", e.target.value)}
                  style={{ color: colors.primary }}>
                  <option value="">{form.gov ? "اختر المدينة" : "اختر المحافظة أولاً"}</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="العنوان بالتفاصيل" error={errors.address}>
              <textarea className={inputCls("address")} rows={3}
                placeholder="الشارع، رقم المبنى، الدور، الشقة..."
                value={form.address} onChange={e => set("address", e.target.value)}
                style={{ color: colors.primary }} />
            </Field>

            {/* طريقة الدفع */}
            <div className="flex flex-col gap-3 pt-1">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">طريقة الدفع</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "cash", label: "الدفع عند الاستلام", icon: "💵", sub: "كاش" },
                  { key: "visa", label: "بطاقة ائتمان", icon: "💳", sub: "فيزا / ماستر" },
                ].map(opt => (
                  <button key={opt.key} onClick={() => setPayMethod(opt.key)}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-right"
                    style={{
                      borderColor: payMethod === opt.key ? colors.gold : "#e5e7eb",
                      background: payMethod === opt.key ? colors.gold + "11" : "#fff",
                    }}>
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: colors.primary }}>{opt.label}</p>
                      <p className="text-xs text-gray-400">{opt.sub}</p>
                    </div>
                    <div className="mr-auto">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                        style={{ borderColor: payMethod === opt.key ? colors.gold : "#d1d5db" }}>
                        {payMethod === opt.key && (
                          <div className="w-2 h-2 rounded-full" style={{ background: colors.gold }} />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ===== الجانب الأيسر — ملخص الطلب ===== */}
          <div className="flex flex-col gap-4">

            {/* بطاقة المنتج */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
              <div className="flex gap-4 items-center">
                <img
                  src={product?.images?.[0]}
                  alt="product"
                  className="w-20 h-20 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
                />
                <div className="flex flex-col gap-1 flex-1">
                  <p className="text-sm font-bold leading-snug" style={{ color: colors.primary }}>
                    {product?.name?.ar ?? product?.name?.en}
                  </p>
                  <p className="text-xs text-gray-400">الحجم: 100 مل</p>
                  <p className="text-base font-extrabold mt-1" style={{ color: colors.gold }}>
                    {product?.price} جنيه
                  </p>
                </div>
              </div>

              {/* الكمية */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500">الكمية</span>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition"
                    style={{ color: colors.primary }}>−</button>
                  <span className="text-base font-bold min-w-[20px] text-center"
                    style={{ color: colors.gold }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition"
                    style={{ color: colors.primary }}>+</button>
                </div>
              </div>
            </div>

            {/* ملخص السعر */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">
                ملخص الطلب
              </p>

              {[
                ["سعر المنتج", `${product?.price} جنيه`],
                ["الكمية", `× ${qty}`],
                ["الشحن", `${SHIPPING} جنيه`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-gray-500">{k}</span>
                  <span className="font-medium" style={{ color: colors.primary }}>{v}</span>
                </div>
              ))}

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="font-bold" style={{ color: colors.primary }}>الإجمالي</span>
                <span className="text-xl font-extrabold" style={{ color: colors.gold }}>
                  {total.toLocaleString("ar-EG")} جنيه
                </span>
              </div>
            </div>

            {/* زرار التأكيد */}
            <button onClick={handleSubmit}
              className="w-full py-4 rounded-2xl font-extrabold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
                color: "#1a1a0a",
                boxShadow: `0 8px 24px ${colors.gold}44`,
              }}>
              ✅ تأكيد الطلب
            </button>

            {/* ضمانات */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                ["🔒", "دفع آمن"],
                ["🚚", "شحن سريع"],
                ["✅", "ضمان الجودة"],
              ].map(([icon, label]) => (
                <div key={label} className="bg-white rounded-2xl py-3 px-2 border border-gray-100">
                  <p className="text-lg">{icon}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}