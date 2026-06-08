
"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiUser, FiPhone } from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";
import "../CTA/CTA.css"
import { trackFB } from "../utils/fbPixel";

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



const inputCls = (err) =>
  `w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition bg-[#faf9fe] font-[Cairo]
   ${err ? "border-red-400 ring-1 ring-red-200" : "border-[#e8e3f5] focus:border-[#5b4fcf] focus:ring-1 focus:ring-[#5b4fcf33]"}`;

const Field = ({ label, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-bold" style={{ color: "black" }}>{label}</label>
    {children}
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);

export default function Checkout({ product }) {
  const settings = useSettings();
    const buttonbackground = settings?.colors?.buttonbackground 
  const backgroundColor = settings?.colors?.backgroundColor 
  const highlightColor = settings?.colors?.highlightColor
  const textColor = settings?.colors?.textColor ;
  const buttontext = settings?.colors?.buttontext;
  const Brand = settings?.brand;
  const SHIPPING = settings?.shippingPrice || 60;
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const initialQty = Number(searchParams.get("qty")) || 1;
  const [qty, setQty] = useState(initialQty);
  const [payMethod, setPayMethod] = useState("cash");
  const [form, setForm] = useState({ name: "", email: "", phone: "", gov: "", city: "", address: "" });
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v, ...(k === "gov" ? { city: "" } : {}) }));
  const cities = form.gov ? GOVS[form.gov] ?? [] : [];
  const subtotal = qty * (product?.price ?? 0);
  const total = subtotal + SHIPPING;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const productName = product?.name?.[lang] || product?.name?.ar;
  const totalPrice = product?.price * qty;
  const oldPrice = product?.oldPrice ?? product?.originalPrice ?? 2700;
const totalOldPrice = oldPrice * qty;

  const t = {
    title: { ar: "إتمام الطلب", en: "Complete Order" },
    subtitle: { ar: "خطوة واحدة وطلبك في طريقه إليك", en: "One step and your order is on its way" },
    name: { ar: "الاسم الكامل", en: "Full Name" },
    namePh: { ar: "مثال: محمد أحمد", en: "John Smith" },
    phone: { ar: "رقم الهاتف", en: "Phone Number" },
    gov: { ar: "المحافظة", en: "Governorate" },
    govPh: { ar: "اختر المحافظة", en: "Select Governorate" },
    city: { ar: "المدينة / المركز", en: "City / District" },
    cityPh: { ar: "اختر المدينة / المركز", en: "Select City" },
    cityFirst: { ar: "اختر المحافظة أولاً", en: "⬅️government first" },
    address: { ar: "العنوان بالتفاصيل", en: "Detailed Address" },
    addressPh: { ar: "الشارع، رقم المبنى، الدور، الشقة...", en: "Street, building number, floor, apartment..." },
    payMethod: { ar: "طريقة الدفع", en: "Payment Method" },
    cash: { ar: "الدفع عند الاستلام", en: "Cash on Delivery" },
    cashSub: { ar: "كاش عند الإستلام", en: "Cash" },
    visa: { ar: "فيزا / ماستر كارد", en: "Credit / Debit Card" },
    visaSub: { ar: "ادفع أونلاين بأمان", en: "Pay securely online" },
    total: { ar: "إجمالي", en: "Total" },
    confirm: { ar: "إكمال الطلب", en: "Complete Order" },
    currency: { ar: "جنيه", en: "EGP" },
    qty: { ar: "الكمية", en: "Quantity" },
    errName: { ar: "أدخل اسمك", en: "Enter your name" },
    errPhone: { ar: "رقم غير صحيح", en: "Invalid phone number" },
    errGov: { ar: "اختر المحافظة", en: "Select governorate" },
    errCity: { ar: "اختر المدينة", en: "Select city" },
    errAddress: { ar: "أدخل عنوانك", en: "Enter your address" },
    otherCity: { ar: "أخرى", en: "Other" },
    otherCityPh: { ar: "اكتب اسم المدينة", en: "Type your city name" },
    errCityText: { ar: "أدخل اسم المدينة", en: "Enter city name" },
    trust: { ar: "بياناتك محمية وآمنة ولن يتم مشاركتها مع أي جهة أخرى", en: "Your data is safe and will never be shared" },
    dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
    price: { ar: "السعر", en: "price" },
    shippingCost: { ar: "تكلفة الشحن", en: "Shipping Cost" },
     insteadOf: { ar: "بدلاً من", en: "Instead of" },
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 3) e.name = t.errName[lang];
    if (!/^01[0-9]{9}$/.test(form.phone)) e.phone = t.errPhone[lang];
    if (!form.gov) e.gov = t.errGov[lang];
    if (!form.city) e.city = t.errCity[lang];
    if (form.city === "__other__" && !form.cityText?.trim()) e.cityText = t.errCityText[lang];
    if (form.address.trim().length < 5) e.address = t.errAddress[lang];
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        country: "Egypt",
        governorate: form.gov,
        city: form.city === "__other__" ? form.cityText : form.city,
        address: form.address,
        paymentMethod: payMethod,
        items: [{ product: "6a105fe04036081b1eda3108", quantity: qty }],
      };
      const res = await axios.post("https://rootex-backend.vercel.app/api/v1/order/createorder", payload);
          if (typeof window.fbq !== "undefined") {
   trackFB("Lead");
    }

      if (payMethod === "cash") router.push(`/success/${res.data.data.orderNumber}`);
      if (payMethod === "paymob") window.location.href = res.data.data.checkoutUrl;
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div dir={dir} className="checkoutpage"  style={{  fontFamily: "'Cairo', sans-serif", borderRadius:"4px", margin:"20px 0" }}>
      <div className="max-w-lg mx-auto">

        <div className="bg-white px-5 py-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label={t.name[lang]} error={errors.name}>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-3 text-[#c0b8e0] text-base">     <FiUser /></span>
                <input className={inputCls(errors.name)} style={{ paddingRight: "2rem", color: textColor }}
                  placeholder={t.namePh[lang]} value={form.name} onChange={e => set("name", e.target.value)} />
              </div>
            </Field>

            <Field label={t.phone[lang]} error={errors.phone}>
              <div className="relative">
                <span className="absolute top-1/2 -translate-y-1/2 right-3 text-[#c0b8e0] text-base">  <FiPhone /></span>
                <input className={inputCls(errors.phone)} style={{ paddingRight: "2rem", color: textColor}}
                  placeholder="01xxxxxxxxx" dir="ltr" maxLength={11}
                  value={form.phone} onChange={e => set("phone", e.target.value)} />
              </div>
            </Field>

            <Field label={t.gov[lang]} error={errors.gov}>
              <select className={inputCls(errors.gov)} style={{ color: textColor }}
                value={form.gov} onChange={e => set("gov", e.target.value)}>
                <option value="">{t.govPh[lang]}</option>
                {Object.keys(GOVS).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>

            <Field label={t.city[lang]} error={errors.city}>
              <select className={inputCls(errors.city)} style={{ color: textColor }}
                disabled={!form.gov} value={form.city} onChange={e => set("city", e.target.value)}>
                <option value="">{form.gov ? t.cityPh[lang] : t.cityFirst[lang]}</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                {form.gov && <option value="__other__">{t.otherCity[lang]}</option>}
              </select>
              {form.city === "__other__" && (
                <div className="mt-2">
                  <input className={inputCls(errors.cityText)} style={{ color: textColor }}
                    placeholder={t.otherCityPh[lang]}
                    value={form.cityText ?? ""}
                    onChange={e => setForm(p => ({ ...p, cityText: e.target.value }))} />
                  {errors.cityText && <span className="text-xs text-red-500">{errors.cityText}</span>}
                </div>
              )}
            </Field>

            <div className="col-span-2">
              <Field label={t.address[lang]} error={errors.address}>
                <textarea className={inputCls(errors.address)} rows={3} style={{ color: textColor, resize: "none" }}
                  placeholder={t.addressPh[lang]}
                  value={form.address} onChange={e => set("address", e.target.value)} />
              </Field>
            </div>
          </div>
        </div>

        <div className="h-2" style={{ background: "#f0eef8" }} />

    
        <div className="bg-white px-5 py-3">
          <div className="flex items-center gap-2 mb-2 justify-center text-center">
            <span style={{ color: backgroundColor, fontSize: 16 }}>< FiCreditCard/></span>
            <span className="text-sm font-bold" style={{ color: textColor }}>{t.payMethod[lang]}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "cash", label: t.cash[lang], sub: t.cashSub[lang], icon: "💵" },
              { key: "paymob", label: t.visa[lang], sub: t.visaSub[lang], icon: "💳" },
            ].map(opt => (
              <button style={{fontSize:"16px"}} key={opt.key} onClick={() => setPayMethod(opt.key)}
                className="flex items-center gap-1 px-1 py-3 rounded-2xl border-2 text-center transition-all"
                style={{
                  borderColor: payMethod === opt.key ?`${buttonbackground}22` : "#e8e3f5",
                  background: payMethod === opt.key ?`${buttonbackground}22` : "#faf9fe",
                }}>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: payMethod === opt.key ? `${buttonbackground}` : "#c0b8e0" }}>
                  {payMethod === opt.key && (
                    <div className="w-2.3 h-2.3 rounded-full" style={{ background: `${buttonbackground}` }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: textColor }}>{opt.label}</p>
                  <p className="text-xs" style={{ color: textColor }}>{opt.sub}</p>
                </div>
                <span className="text-xl">{opt.icon}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-2" style={{ background:"#f0eef8"  }} />
        <div className="bg-white  px-1 lg:px-4 py-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eef8]">
            <span className="text-sm font-semibold" style={{ color: textColor }}>
              {productName} × {qty}
            </span>
    
          </div>
          <div className="flex gap-2 items-center pt-2" style={{fontWeight:"700"}}>
            <span className="text-sm" style={{ color: textColor }}>{t.price[lang]}: </span>
            <span style={{ color: textColor }}>{ totalPrice} {t.currency[lang]}</span>

          </div>
                    <div className="flex gap-2 items-center pt-0" style={{fontWeight:"700"}}>
            <span className="text-sm" style={{ color: textColor }}>{t.shippingCost[lang]}: </span>
            <span style={{ color: textColor }}>{ SHIPPING} {t.currency[lang]}</span>

          </div>
          <div className="pb-3 border-b border-[#f0eef8]"></div>
         {/* test */}
          <div className=" price-desc flex justify-between items-center pt-0">
            <span  className="text-sm tota-checkout" style={{ color: textColor }}>{t.total[lang]} </span>
                <div style={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" , justifyContent:"center" }}>
            <span className="tota-checkout" style={{ fontSize: 24, fontWeight: 900, color: textColor }}>{(product?.price * qty)+SHIPPING} {t.currency[lang]}</span>
            <span style={{ fontSize: 12, color: textColor, opacity: 0.6 }}>{t.insteadOf[lang]}</span>
<span className="old-price" style={{color:textColor}}>
  {totalOldPrice +SHIPPING} {t.currency[lang]}
</span>
          </div>
          </div>
        </div>
          <div className="bg-white px-5 pb-2 pt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            style={{ background: buttonbackground, color:buttontext, boxShadow: "0 8px 24px rgba(59,47,140,0.3)" }}>
            {loading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <> {t.confirm[lang]}</>
            }
          </button>
          <p className="text-center text-xs my-3 flex items-center justify-center gap-1" style={{ color: "#9b8fc7" }}>
            🛡 {t.trust[lang]}
          </p>
          </div>

      </div>
    </div>
  );
}