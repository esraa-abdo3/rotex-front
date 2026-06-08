
// import { SettingsProvider } from "./providers/SettingsProvider";
// import { AuthProvider } from "./providers/AuthProvider";
// import { LanguageProvider } from "./providers/LanguageProvider";
// import "./globals.css";

// async function getSettings() {
//   try {
//     const res = await fetch("https://rootex-backend.vercel.app/api/v1/setting", {
//       cache: "no-store",
//     });
//     if (!res.ok) return null;
//     const data = await res.json();
//     const s = data?.settings;
//     return {
//       brand:      "RooteX",
//       hook:       s?.hook,
//       buttonText: s?.buttonText,
//       colors: {
//         primaryDark:   s?.colors?.primaryDark,
//         secondaryDark: s?.colors?.secondaryDark,
//         primary:       s?.colors?.primary,
//         gold:          s?.colors?.gold,
//         goldLight:     s?.colors?.goldLight,
//       },
//       image: s?.images?.herosection,
//     };
//   } catch {
//     return null;
//   }
// }

// export default   async function RootLayout({ children }) {
//     const settings = await getSettings();
//   return (
//     <html lang="ar">
//       <body className="min-h-full flex flex-col">
//         <SettingsProvider  initialSettings={settings}>
//           <AuthProvider>
//             <LanguageProvider>
        
//               {children}
            
//             </LanguageProvider>
//           </AuthProvider>
//         </SettingsProvider>
//       </body>
//     </html>
//   );
// }

import { SettingsProvider } from "./providers/SettingsProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import MetaPixelScript from "./componets/pixel/MetaPixelScript";

import "./globals.css";

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
      <body className="min-h-full flex flex-col">
        {/*
          ── Meta Pixel ──────────────────────────────────────────────────────
          MetaPixelScript  → injects fbq init snippet (afterInteractive, once)
          PixelPageTracker → fires PageView on every route change, deduped
          ────────────────────────────────────────────────────────────────────
        */}
        <MetaPixelScript />
       

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
