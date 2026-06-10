
import { SettingsProvider } from "./providers/SettingsProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import Script from "next/script";
import "./globals.css";
import PixelPageViewOnce from "./componets/pixel/PixelPageViewOnce";
const PIXEL_ID = "2496490754109919"

async function getSettings() {
  try {
    const res = await fetch("https://rootex-backend.vercel.app/api/v1/setting", {
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