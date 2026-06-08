
import { QuantityProvider } from "../providers/QuantityProvider";
import { SettingsProvider } from "../providers/SettingsProvider";
import Navbar from "../componets/Navbar/Navbar";
import Script from "next/script";



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
  
    <div>
       <Script
        id="facebook-pixel"
        strategy="afterInteractive"
      >
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}
          (window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');

          fbq('init', '2496490754109919');
          
        `}
      </Script>
          
        <SettingsProvider initialSettings={settings}>
          <Navbar />
          <QuantityProvider>
            {children}
          </QuantityProvider>
        </SettingsProvider>
      </div>

  

  );
}