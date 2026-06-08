
// import { QuantityProvider } from "../providers/QuantityProvider";
// import { SettingsProvider } from "../providers/SettingsProvider";
// import Navbar from "../componets/Navbar/Navbar";

// async function getSettings() {
//   try {
//     const res = await fetch("https://rootex-backend.vercel.app/api/v1/setting", {
//       next: { revalidate: 60 },
//     });
//     const data = await res.json();
//     return {
//       brand: data?.settings?.Brand,
//       shippingSignature: data?.settings?.shippingSignature,
//       hook: data?.settings?.hook,
//       buttonText: data?.settings?.buttonText,
//       shippingPrice: data?.settings?.shippingPrice,
//       floatingButton: data?.settings?.floatingButton,
//       colors: {
//         backgroundColor: data?.settings?.colors?.backgroundColor,
//         buttonbackground: data?.settings?.colors?.buttonbackground,
//         buttontext: data?.settings?.colors?.buttontext,
//         textColor: data?.settings?.colors?.textColor,
//         highlightColor: data?.settings?.colors?.highlightColor,
//       },
//       image: data?.settings?.images?.herosection,
//       resultBg: data?.settings?.images?.resultBg,
//       Fontfamily: data?.settings?.Fontfamily,
//       reviews: data?.settings?.reviewheader,
//       fansText: data?.settings?.fansText,
//     };
//   } catch (err) {
//     console.error("settings error:", err);
//     return null;
//   }
// }

// export default async function MainLayout({ children }) {
//   const settings = await getSettings();

//   return (
//     <SettingsProvider initialSettings={settings}>
      
    
//       <Navbar/>
//       <QuantityProvider>
//         {children}
//       </QuantityProvider>
//     </SettingsProvider>
//   );
// }
import { QuantityProvider } from "../providers/QuantityProvider";
import { SettingsProvider } from "../providers/SettingsProvider";
import Navbar from "../componets/Navbar/Navbar";
import Script from "next/script";
import { initPixel } from "../componets/utils/pixel";
import PixelPageView from "../componets/PixelPageView";

async function getSettings() {
  try {
    const res = await fetch("https://rootex-backend.vercel.app/api/v1/setting", {
      next: { revalidate: 60 },
    });

    const data = await res.json();

    return {
      brand: data?.settings?.Brand,
      shippingSignature: data?.settings?.shippingSignature,
      hook: data?.settings?.hook,
      buttonText: data?.settings?.buttonText,
      shippingPrice: data?.settings?.shippingPrice,
      floatingButton: data?.settings?.floatingButton,
      colors: {
        backgroundColor: data?.settings?.colors?.backgroundColor,
        buttonbackground: data?.settings?.colors?.buttonbackground,
        buttontext: data?.settings?.colors?.buttontext,
        textColor: data?.settings?.colors?.textColor,
        highlightColor: data?.settings?.colors?.highlightColor,
      },
      image: data?.settings?.images?.herosection,
      resultBg: data?.settings?.images?.resultBg,
      Fontfamily: data?.settings?.Fontfamily,
      reviews: data?.settings?.reviewheader,
      fansText: data?.settings?.fansText,
    };
  } catch (err) {
    console.error("settings error:", err);
    return null;
  }
}

const PIXEL_ID = "2496490754109919";

export default async function MainLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en">
        <head>
        {/* Load the Meta Pixel SDK once. onLoad fires after the script is ready,
            then initPixel bootstraps fbq and calls fbq('init').
            PixelPageView fires fbq('track','PageView') exactly once after that. */}
        <Script
          id="meta-pixel-sdk"
          strategy="afterInteractive"
          src="https://connect.facebook.net/en_US/fbevents.js"
          onLoad={() => initPixel(PIXEL_ID)}
        />
      </head>

      <body>
          <PixelPageView />
        <SettingsProvider initialSettings={settings}>
          <Navbar />

       

          <QuantityProvider>
            {children}
          </QuantityProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}