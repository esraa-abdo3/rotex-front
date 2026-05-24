
import { SettingsProvider } from "./providers/SettingsProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body className="min-h-full flex flex-col">
        <SettingsProvider>
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