

"use client";

import Navbar from "../componets/Navbar/Navbar";
import { QuantityProvider } from "../providers/QuantityProvider";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <QuantityProvider>{children}</QuantityProvider>
    </>
  );
}