// "use client";
// import { useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useSettings } from "@/app/providers/SettingsProvider";
// import { useLang } from "@/app/providers/LanguageProvider";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const GOVS = {
//   "القاهرة": ["القاهرة","مدينة نصر","شبرا","المطرية","عين شمس","حلوان","المعادي","مصر الجديدة","الزيتون","الأميرية","بولاق","السلام","الخليفة","الدرب الأحمر","الموسكي","الساحل","شبرا الخيمة","الوايلي"],
//   "الجيزة": ["الجيزة","الدقي","المهندسين","العجوزة","إمبابة","بولاق الدكرور","الهرم","فيصل","أوسيم","الواحات البحرية","كرداسة","البدرشين","العياط","أطفيح","الصف"],
//   "الإسكندرية": ["الإسكندرية","المنتزه","العجمي","برج العرب","أبو قير","الرمل","المحطة","سيدي جابر","باب شرق","العامرية","ورديان"],
//   "الدقهلية": ["المنصورة","طلخا","ميت غمر","أجا","المنزلة","دكرنس","بلقاس","تمي الأمديد","شربين","نبروه","السنبلاوين","الجمالية","منية النصر"],
//   "الشرقية": ["الزقازيق","بلبيس","منيا القمح","أبو كبير","ههيا","الإبراهيمية","فاقوس","أبو حماد","الحسينية","كفر صقر","القنايات","العاشر من رمضان","ديرب نجم"],
//   "المنوفية": ["شبين الكوم","مينوف","أشمون","الباجور","قويسنا","بركة السبع","تلا","السادات","الشهداء"],
//   "البحيرة": ["دمنهور","كفر الدوار","رشيد","إدكو","أبو حمص","حوش عيسى","الدلنجات","المحمودية","إيتاي البارود","شبراخيت","وادي النطرون","النوبارية"],
//   "الغربية": ["طنطا","المحلة الكبرى","كفر الزيات","زفتى","السنطة","بسيون","سمنود","قطور"],
//   "كفر الشيخ": ["كفر الشيخ","دسوق","فوه","مطوبس","بلطيم","سيدي سالم","الحامول","برج البرلس","قلين"],
//   "الفيوم": ["الفيوم","سنورس","إطسا","أبشواي","يوسف الصديق","طامية"],
//   "بني سويف": ["بني سويف","الفشن","ببا","إهناسيا","بياض العرب","ناصر","سمسطا"],
//   "المنيا": ["المنيا","ملوي","أبو قرقاص","العدوة","سمالوط","مطاي","بني مزار","دير مواس","المغاغة"],
//   "أسيوط": ["أسيوط","ديروط","القوصية","منفلوط","أبو تيج","صدفا","الفتح","الغنايم","ساحل سليم","أبنوب"],
//   "سوهاج": ["سوهاج","أخميم","جرجا","المراغة","دار السلام","جهينة","المنشأة","البلينا","طما","طهطا"],
//   "قنا": ["قنا","نجع حمادي","دشنا","قوص","فرشوط","أبو تشت","نقادة","الوقف"],
//   "الأقصر": ["الأقصر","إسنا","أرمنت","الطود","القرنة"],
//   "أسوان": ["أسوان","كوم أمبو","إدفو","نصر النوبة","دراو","أبو سمبل السياحية"],
//   "البحر الأحمر": ["الغردقة","سفاجا","القصير","مرسى علم","رأس غارب","الشلاتين"],
//   "الوادي الجديد": ["الخارجة","الداخلة","الفرافرة","بريس"],
//   "مطروح": ["مرسى مطروح","الحمام","الضبعة","سيوة","الواحات","النجيلة"],
//   "شمال سيناء": ["العريش","رفح","الشيخ زويد","بئر العبد","الحسنة","نخل"],
//   "جنوب سيناء": ["الطور","شرم الشيخ","دهب","نويبع","طابا","أبو رديس","رأس سدر"],
//   "الإسماعيلية": ["الإسماعيلية","التل الكبير","القصاصين","فايد","أبو صوير"],
//   "السويس": ["السويس","عتاقة","الجناين","فيصل"],
//   "بورسعيد": ["بورسعيد","بورفؤاد","بور الصياد","بور الجميل","الزهور","المناخ","الشرق"],
//   "دمياط": ["دمياط","رأس البر","الزرقا","فارسكور","كفر سعد","عزبة البرج"],
// };


//   const Field = ({ label, error, children , settings}) => (
//     <div className="flex flex-col gap-1">
//       <label className="text-xs font-semibold" style={{ color: settings?.colors?.primary }}>{label}</label>
//       {children}
//       {error && <span className="text-xs text-red-500">{error}</span>}
//     </div>
//   );

// export default function Checkout({ product }) {
//   const settings = useSettings();
//   const SHIPPING = settings?.shippingPrice || 60;
//   const { lang } = useLang();
//   const searchParams = useSearchParams();
//   const initialQty = Number(searchParams.get("qty")) || 1;
//   const [qty, setQty] = useState(initialQty);
//   const [payMethod, setPayMethod] = useState("cash");
//  const [form, setForm] = useState({ name: "", email: "", phone: "", gov: "", city: "", address: "" });
//   const [errors, setErrors] = useState({});
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   const set = (k, v) => setForm(p => ({ ...p, [k]: v, ...(k === "gov" ? { city: "" } : {}) }));
//   const cities = form.gov ? GOVS[form.gov] ?? [] : [];
//   const subtotal = qty * (product?.price ?? 0);
//   const total = subtotal + SHIPPING;

//   const t = {
//     title: { ar: "إتمام الطلب", en: "Complete Order" },
//     subtitle: { ar: "خطوة واحدة وطلبك في طريقه إليك", en: "One step and your order is on its way" },
//     delivery: { ar: "بيانات التوصيل", en: "Delivery Details" },
//     name: { ar: "الاسم الكامل", en: "Full Name" },
//     namePh: { ar: "محمد أحمد", en: "John Smith" },
//     email: { ar: "البريد الإلكتروني", en: "Email" },
//     phone: { ar: "رقم الهاتف", en: "Phone Number" },
//     gov: { ar: "المحافظة", en: "Governorate" },
//     govPh: { ar: "اختر المحافظة", en: "Select Governorate" },
//     city: { ar: "المدينة / المركز", en: "City / District" },
//     cityPh: { ar: "اختر المدينة", en: "Select City" },
//     cityFirst: { ar: "اختر المحافظة أولاً", en: "Select governorate first" },
//     address: { ar: "العنوان بالتفاصيل", en: "Detailed Address" },
//     addressPh: { ar: "الشارع، رقم المبنى، الدور، الشقة...", en: "Street, building number, floor, apartment..." },
//     payMethod: { ar: "طريقة الدفع", en: "Payment Method" },
//     cash: { ar: "الدفع عند الاستلام", en: "Cash on Delivery" },
//     cashSub: { ar: "كاش", en: "Cash" },
//     visa: { ar: "بطاقة ائتمان", en: "Credit Card" },
//     visaSub: { ar: "فيزا / ماستر", en: "Visa / Master" },
//     summary: { ar: "ملخص الطلب", en: "Order Summary" },
//     unitPrice: { ar: "سعر المنتج", en: "Unit Price" },
//     quantity: { ar: "الكمية", en: "Quantity" },
//     shipping: { ar: "الشحن", en: "Shipping" },
//     total: { ar: "الإجمالي", en: "Total" },
//     confirm: { ar: " تأكيد الطلب", en: " Confirm Order" },
//     fastShip: { ar: " ✓ شحن سريع", en: "Fast Shipping ✓" },
//     quality: { ar: "ضمان الجودة", en: "Quality Guarantee ✓" },
//     secure: { ar: "✓ دفع آمن", en: "Secure Payment ✓" },
//     currency: { ar: "جنيه", en: "EGP" },
//     qty: { ar: "الكمية", en: "Quantity" },
//     size: { ar: "الحجم: 100 مل", en: "Size: 100ml" },
//     errName: { ar: "أدخل اسمك", en: "Enter your name" },
//     errEmail: { ar: "إيميل غير صحيح", en: "Invalid email" },
//     errPhone: { ar: "رقم غير صحيح", en: "Invalid phone number" },
//     errGov: { ar: "اختر المحافظة", en: "Select governorate" },
//     errCity: { ar: "اختر المدينة", en: "Select city" },
//     errAddress: { ar: "أدخل عنوانك", en: "Enter your address" },
//     errAddress: { ar: "أدخل عنوانك", en: "Enter your address" },
//     otherCity: { ar: "أخرى", en: "Other" },
//    otherCityPh: { ar: "اكتب اسم المدينة", en: "Type your city name" },
//    errCityText: { ar: "أدخل اسم المدينة", en: "Enter city name" },
//   };

//   const validate = () => {
//     const e = {};
//     if (form.name.trim().length < 3) e.name = t.errName[lang];
//     if (!/^01[0-9]{9}$/.test(form.phone)) e.phone = t.errPhone[lang];
//     if (!form.gov) e.gov = t.errGov[lang];
//     if (!form.city) e.city = t.errCity[lang];
//   if (form.city === "__other__" && !form.cityText?.trim()) 
//   e.cityText = t.errCityText[lang];
//     if (form.address.trim().length < 5) e.address = t.errAddress[lang];
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };
//   const handleSubmit = async () => {
//     console.log("add")
//     console.log(validate())
//   if (!validate()) return;

//   try {
//     setLoading(true);

//     const payload = {
//       name: form.name,
//       phone: form.phone,
//       email: form.email,
//       country: "Egypt",
//       governorate: form.gov,
//       city:
//         form.city === "__other__"
//           ? form.cityText
//           : form.city,
//       address: form.address,
//       paymentMethod: payMethod,

//       items: [
//         {
//           product: "6a105fe04036081b1eda3108",
//           quantity: qty,
//         },
//       ],
//     };
//  console.log(payload)
//     const res = await axios.post(
//       "https://rootex-backend.vercel.app/api/v1/order/createorder",
//       payload
//     );

  
   

// if (payMethod === "cash") {
//   router.push(`/success/${res.data.data.orderNumber}`);
// }

// if (payMethod === "paymob") {
//   window.location.href = res.data.data.checkoutUrl;
// }


//   } catch (error) {
//       console.log(payMethod)
//       console.log(error);
//   console.log(error.response);
//   console.log(error.response?.data);
//   } finally {
//     setLoading(false);
//   }
// };

//   const inputCls = (k) =>
//     `border rounded-xl px-4 py-2.5 text-sm outline-none transition w-full bg-white
//      ${errors[k] ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 focus:border-[#c8a93e] focus:ring-1 focus:ring-[#c8a93e33]"}`;



//   const gold = settings?.colors?.gold ?? "#c8a93e";
//   const goldLight = settings?.colors?.goldLight ?? "#d4b84a";
//   const primary = settings?.colors?.primary ?? "#3a4520";
//     const buttonbackground = settings?.colors?.buttonbackground 
//   const backgroundColor = settings?.colors?.backgroundColor 
//   const highlightColor = settings?.colors?.highlightColor
//   const textColor = settings?.colors?.textColor ;
//   const buttontext = settings?.colors?.buttontext;
//   const dir = lang === "ar" ? "rtl" : "ltr";

//   const productName = product?.name?.[lang] || product?.name?.ar;

//   return (
//     <div
//       dir={dir}
//       className="min-h-screen py-10 px-4"
//       style={{ background: "#f7f5f0", fontFamily: "'Cairo', sans-serif" }}
//     >
//       <div className="max-w-5xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-extrabold" style={{ color: textColor }}>{t.title[lang]}</h1>
//           <p className="text-sm text-gray-400 mt-1">{t.subtitle[lang]}</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6">

        
//           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-2">
//             <p className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">
//               {t.delivery[lang]}
//             </p>

            
//               <Field label={t.name[lang]} error={errors.name}>
//                 <input className={inputCls("name")} placeholder={t.namePh[lang]}
//                   value={form.name} onChange={e => set("name", e.target.value)}
//                   style={{ color: primary }} />
//               </Field>
        
  

//             <Field label={t.phone[lang]} error={errors.phone}>
//               <input className={inputCls("phone")} placeholder="01xxxxxxxxx"
//                 maxLength={11} dir="ltr" value={form.phone}
//                 onChange={e => set("phone", e.target.value)}
//                 style={{ color: primary }} />
//             </Field>

//               <Field label={t.gov[lang]} error={errors.gov}>
//                 <select className={inputCls("gov")} value={form.gov}
//                   onChange={e => set("gov", e.target.value)}
//                   style={{ color: primary }}>
//                   <option value="">{t.govPh[lang]}</option>
//                   {Object.keys(GOVS).map(g => <option key={g} value={g}>{g}</option>)}
//                 </select>
//               </Field> 
//            <Field label={t.city[lang]} error={errors.city}>
//   <select
//     className={inputCls("city")}
//     value={form.city}
//     disabled={!form.gov}
//     onChange={e => set("city", e.target.value)}
//     style={{ color: primary }}
//   >
//     <option value="">
//       {form.gov ? t.cityPh[lang] : t.cityFirst[lang]}
//     </option>
//     {cities.map(c => (
//       <option key={c} value={c}>{c}</option>
//     ))}
//     {form.gov && (
//       <option value="__other__">{t.otherCity[lang]}</option>
//     )}
//   </select>

//   {form.city === "__other__" && (
//     <div className="mt-2">
//       <input
//         className={inputCls("cityText")}
//         placeholder={t.otherCityPh[lang]}
//         value={form.cityText ?? ""}
//         onChange={e => setForm(p => ({ ...p, cityText: e.target.value }))}
//         style={{ color: primary }}
//       />
//       {errors.cityText && (
//         <span className="text-xs text-red-500">{errors.cityText}</span>
//       )}
//     </div>
//   )}
//             </Field>
//             <Field label={t.address[lang]} error={errors.address}>
//   <textarea
//     className={inputCls("address")}
//     rows={3}
//     placeholder={t.addressPh[lang]}
//     value={form.address}
//     onChange={e => set("address", e.target.value)}
//     style={{ color: primary }}
//   />
//              </Field>

//             <div className="flex flex-col gap-3 pt-1">
//               <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{t.payMethod[lang]}</p>
//               <div className="grid grid-cols-2 gap-3">
//                 {[
//                   { key: "cash", label: t.cash[lang], icon: "💵", sub: t.cashSub[lang] },
//                   { key: "paymob", label: t.visa[lang], icon: "💳", sub: t.visaSub[lang] },
//                 ].map(opt => (
//                   <button key={opt.key} onClick={() => setPayMethod(opt.key)}
//                     className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all text-right"
//                     style={{
//                       borderColor: payMethod === opt.key ? gold : "#e5e7eb",
//                       background: payMethod === opt.key ? gold + "11" : "#fff",
//                     }}>
//                     <span className="text-2xl">{opt.icon}</span>
//                     <div>
//                       <p className="text-sm font-bold" style={{ color: primary }}>{opt.label}</p>
//                       <p className="text-xs text-gray-400">{opt.sub}</p>
//                     </div>
//                     <div className="mr-auto ml-auto">
//                       <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
//                         style={{ borderColor: payMethod === opt.key ? gold : "#d1d5db" }}>
//                         {payMethod === opt.key && (
//                           <div className="w-2 h-2 rounded-full" style={{ background: gold }} />
//                         )}
//                       </div>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col gap-4">
//             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
//               <div className="flex gap-4 items-center">
//                 <img
//                   src={product?.images?.[0]}
//                   alt="product"
//                   className="w-20 h-20 rounded-2xl object-cover border border-gray-100 flex-shrink-0"
//                 />
//                 <div className="flex flex-col gap-1 flex-1">
//                   <p className="text-sm font-bold leading-snug" style={{ color: primary }}>{productName}</p>
//                   <p className="text-xs text-gray-400">{t.size[lang]}</p>
//                   <p className="text-base font-extrabold mt-1" style={{ color: gold }}>
//                     {product?.price} {t.currency[lang]}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
//                 <span className="text-sm text-gray-500">{t.qty[lang]}</span>
//                 <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-1.5 border border-gray-100">
//                   <button onClick={() => setQty(q => Math.max(1, q - 1))}
//                     className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition cursor-pointer"
//                     style={{ color: primary }}>−</button>
//                   <span className="text-base font-bold min-w-[20px] text-center" style={{ color: gold }}>{qty}</span>
//                   <button onClick={() => setQty(q => q + 1)}
//                     className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg hover:bg-gray-100 transition cursor-pointer"
//                     style={{ color: primary }}>+</button>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
//               <p className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-3">
//                 {t.summary[lang]}
//               </p>
//               {[
//                 [t.unitPrice[lang], `${product?.price} ${t.currency[lang]}`],
//                 [t.quantity[lang], `× ${qty}`],
//                 [t.shipping[lang], `${SHIPPING} ${t.currency[lang]}`],
//               ].map(([k, v]) => (
//                 <div key={k} className="flex justify-between text-sm">
//                   <span className="text-gray-500">{k}</span>
//                   <span className="font-medium" style={{ color: primary }}>{v}</span>
//                 </div>
//               ))}
//               <div className="flex justify-between items-center pt-3 border-t border-gray-100">
//                 <span className="font-bold" style={{ color: primary }}>{t.total[lang]}</span>
//                 <span className="text-xl font-extrabold" style={{ color: gold }}>
//                   {total.toLocaleString(lang === "ar" ? "ar-EG" : "en-US")} {t.currency[lang]}
//                 </span>
//               </div>
//             </div>

// <button
//   onClick={handleSubmit}
//   disabled={loading}
//   className="w-full cursor-pointer py-4 rounded-2xl font-extrabold text-base transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
//               style={{
//                 display: "flex",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 cursor:"pointer",
                



//     background: `linear-gradient(135deg, ${gold}, ${goldLight})`,
//     color: "#1a1a0a",
//     boxShadow: `0 8px 24px ${gold}44`,
//   }}
// >
//   {loading
//     ? <div  className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
//     : t.confirm[lang]}
// </button>
//       <div className="flex items-center justify-center gap-6 opacity-50 text-xs text-black" >
//           <span>{t.fastShip[lang]}</span>
//           <span>{t.quality[lang]}</span>
//           <span>{t.secure[lang]}</span>
//         </div>
        
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useLang } from "@/app/providers/LanguageProvider";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiUser, FiPhone } from "react-icons/fi";
import { FiCreditCard } from "react-icons/fi";

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
    cityFirst: { ar: "اختر المحافظة أولاً", en: "Select governorate first" },
    address: { ar: "العنوان بالتفاصيل", en: "Detailed Address" },
    addressPh: { ar: "الشارع، رقم المبنى، الدور، الشقة...", en: "Street, building number, floor, apartment..." },
    payMethod: { ar: "طريقة الدفع", en: "Payment Method" },
    cash: { ar: "الدفع عند الاستلام", en: "Cash on Delivery" },
    cashSub: { ar: "كاش عند الإستلام", en: "Cash" },
    visa: { ar: "فيزا / ماستر كارد", en: "Credit Card" },
    visaSub: { ar: "ادفع أونلاين بأمان", en: "Pay online securely" },
    total: { ar: "الإجمالي النهائي شامل الشحن", en: "Total incl. shipping" },
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
            <span style={{ color: backgroundColor, fontSize: 18 }}>< FiCreditCard/></span>
            <span className="text-sm font-bold" style={{ color: textColor }}>{t.payMethod[lang]}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "cash", label: t.cash[lang], sub: t.cashSub[lang], icon: "💵" },
              { key: "paymob", label: t.visa[lang], sub: t.visaSub[lang], icon: "💳" },
            ].map(opt => (
              <button key={opt.key} onClick={() => setPayMethod(opt.key)}
                className="flex items-center gap-2 px-1 py-3 rounded-2xl border-2 text-right transition-all"
                style={{
                  borderColor: payMethod === opt.key ?`${buttonbackground/22}` : "#e8e3f5",
                  background: payMethod === opt.key ?`${buttonbackground/22}` : "#faf9fe",
                }}>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: payMethod === opt.key ? `${buttonbackground/22}` : "#c0b8e0" }}>
                  {payMethod === opt.key && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: `${buttonbackground/22}` }} />
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

        
        <div className="bg-white px-5 py-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eef8]">
            <span className="text-sm font-semibold" style={{ color: textColor }}>
              {productName} × {qty}
            </span>
    
          </div>
          <div className="flex justify-between items-end pt-0">
            <span className="text-sm" style={{ color: textColor }}>{t.total[lang]}</span>
            <div className="text-left">
              <div>
                <span className="text-3xl font-black" style={{ color: textColor }}>{total.toLocaleString()}</span>
                <span className="text-sm font-bold mr-1" style={{ color: textColor }}> {t.currency[lang]}</span>
              </div>
              <p className="text-xs line-through text-right" style={{ color: textColor }}>
                بدلاً من {(qty * 2700 + SHIPPING).toLocaleString()} {t.currency[lang]}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white px-5 pb-3 pt-3">
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-4 rounded-2xl font-black text-lg text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 cursor-pointer"
            style={{ background: buttonbackground, color:buttontext, boxShadow: "0 8px 24px rgba(59,47,140,0.3)" }}>
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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