
"use client";
import Link from "next/link";
import { useState } from "react";
  import { useRouter } from "next/navigation";

export default function Product({ settings, product }) {
  const item = product?.[0];
  const [qty, setQty] = useState(1);


const router = useRouter();
  if (!item) return null;

  const nameParts = item.name?.ar.split("-");

  return (
    <section
      id="product"
      dir="rtl"
      className="w-[90%] max-w-5xl m-auto flex flex-col md:flex-row items-center justify-center gap-16 px-6 py-20"
      style={{ margin: "60px auto", color: "#fff" }}
    >
     
      <div className="flex-1 flex justify-center">
        <div className="relative">
        
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-20 scale-90"
            style={{ background: settings.colors.gold }}
          />
          <img
            src={item.images?.[0]}
            alt={item.name?.ar}
            className="relative w-[280px] md:w-[460px] rounded-3xl shadow-2xl object-cover"
          />
        </div>
      </div>

  
      <div className="flex-1 flex flex-col gap-6">

  
        <div>
          <h2
            className="text-4xl font-extrabold leading-tight"
            style={{ color: settings.colors.primary }}
          >
            {nameParts?.[0]}
            {nameParts?.[1] && (
              <span style={{ color: settings.colors.gold }}>
                {" "}{nameParts[1]}
              </span>
            )}
          </h2>
          <div
            className="mt-3 h-[2px] w-16 rounded-full"
            style={{ background: settings.colors.gold }}
          />
        </div>

       
        <p
          className="text-sm leading-8 opacity-80 whitespace-pre-line"
          style={{ color: settings.colors.primary }}
        >
          {item.description?.ar}
        </p>

  

        <div
          className="w-full h-[1px] opacity-20"
          style={{ background: settings.colors.primary }}
        />

     
        <div className="flex items-center justify-between">
       
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-2 shadow-sm border"
            style={{ borderColor: settings.colors.gold + "33", background: "#fff" }}
          >
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold transition hover:opacity-70 cursor-pointer"
              style={{ color: settings.colors.primary }}
            >
              −
            </button>
            <span
              className="min-w-[28px] text-center text-lg font-bold"
              style={{ color: settings.colors.gold }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold transition hover:opacity-70 cursor-pointer"
              style={{ color: settings.colors.primary }}
            >
              +
            </button>
          </div>

   
          {item.price && (
            <div className="text-right">
              <span
                className="text-2xl font-extrabold"
                style={{ color: settings.colors.gold }}
              >
                {item.price * qty} جنيه
              </span>
            </div>
          )}
        </div>


        <Link href="/checkoutpage">
          <button
             onClick={() => router.push(`/checkoutpage?qty=${qty}`)}
            className="w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${settings.colors.gold}, ${settings.colors.gold}cc)`,
              color: "#1a1a0a",
              boxShadow: `0 8px 24px ${settings.colors.gold}44`,
            }}
          >
            🛒 اشتري الآن
          </button>
        </Link>

       
        <div className="flex items-center justify-center gap-6 opacity-50 text-xs"
          style={{ color: settings.colors.primary }}>
          <span>✓ شحن سريع</span>
          <span>✓ ضمان الجودة</span>
          <span>✓ دفع آمن</span>
        </div>

      </div>
    </section>
  );
}