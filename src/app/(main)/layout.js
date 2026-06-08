
import { QuantityProvider } from "../providers/QuantityProvider";
import { SettingsProvider } from "../providers/SettingsProvider";
import Navbar from "../componets/Navbar/Navbar";
;

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

export default async function MainLayout({ children }) {
  const settings = await getSettings();      

  return (
    <SettingsProvider initialSettings={settings}>
   
      <Navbar/>
      <QuantityProvider>
        {children}
      </QuantityProvider>
    </SettingsProvider>
  );
}