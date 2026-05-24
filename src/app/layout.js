import { SettingsProvider } from "./providers/SettingsProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { LanguageProvider } from "./providers/LanguageProvider";
import Navbar from "./componets/Navbar/Navbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body className="min-h-full flex flex-col">
        <SettingsProvider>
          <AuthProvider>
            <LanguageProvider>
              <Navbar />
              {children}
            </LanguageProvider>
          </AuthProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}