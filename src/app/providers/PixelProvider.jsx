"use client";
import { usePixelPageView } from "../componets/pixel/usePixelPageView";

export default function PixelProvider({ children }) {
  usePixelPageView();

  return children;
}