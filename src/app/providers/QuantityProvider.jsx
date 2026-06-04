"use client";
import { createContext, useContext, useState } from "react";

const QuantityContext = createContext(null);

export function QuantityProvider({ children }) {
  const [qty, setQty] = useState(1);

  const increment = () => setQty((q) => q + 1);
  const decrement = () => setQty((q) => Math.max(1, q - 1));

  return (
    <QuantityContext.Provider value={{ qty, increment, decrement }}>
      {children}
    </QuantityContext.Provider>
  );
}

export function useQuantity() {
  const ctx = useContext(QuantityContext);
  if (!ctx) throw new Error("useQuantity must be used inside QuantityProvider");
  return ctx;
}
