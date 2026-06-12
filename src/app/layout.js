
import { SettingsProvider } from "./providers/SettingsProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import Script from "next/script";
import "./globals.css";
const PIXEL_ID = "974856042110122"

async function getSettings() {
  try {
    const res = await fetch("https://api.beautyhub.es/api/v1/setting", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const s = data?.settings;
    return {
      brand:      "RooteX",
      hook:       s?.hook,
      buttonText: s?.buttonText,
      colors: {
        primaryDark:   s?.colors?.primaryDark,
        secondaryDark: s?.colors?.secondaryDark,
        primary:       s?.colors?.primary,
        gold:          s?.colors?.gold,
        goldLight:     s?.colors?.goldLight,
      },
      image: s?.images?.herosection,
    };
  } catch {
    return null;
  }
}
export async function generateMetadata() {
  try {
    const res = await fetch("https://api.beautyhub.es/api/v1/product/getallproducts", {
      cache: "no-store",

      signal: AbortSignal.timeout(5000), 
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const data = await res.json();
    const product = data?.data?.[0];

    if (!product) throw new Error("No product found");

    return {
      title: product.name?.ar || "RooteX Store",
      description: product.description?.ar || "وصف المنتج هنا",
      icons: {
        icon: product.images?.[0] || "/favicon.ico",
      },
    };
  } catch (error) {
    
    return {
      title: "RooteX Store",
      description: "متجر روتكس الافتراضي",
      icons: {
        icon: "/favicon.ico", 
      },
    };
  }
}
export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="ar">
      <head>
        {PIXEL_ID && (
          <Script
            id="meta-pixel-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window,document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq.disablePushState = true;
                fbq('set','autoConfig', false, '${PIXEL_ID}');
                fbq('init','${PIXEL_ID}');
              
              `,
            }}
          />
        )}
      </head>
      <body className="min-h-full flex flex-col">
    
        {/* <PixelPageViewOnce /> */}

        <SettingsProvider initialSettings={settings}>
          <AuthProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AuthProvider>
          </SettingsProvider>
         
      </body>
    </html>
  );
}