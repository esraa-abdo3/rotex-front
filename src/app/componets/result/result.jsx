"use client";
import { useSettings } from "@/app/providers/SettingsProvider";
import { useEffect, useState } from "react";

export default function Result() {
  const settings = useSettings();
  const [current, setCurrent] = useState(0);

  const images = settings?.resultBg ?? [];
  
  const isSlider = images.length > 1;


  useEffect(() => {
    if (!isSlider) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % images.length),
      4000
    );
    return () => clearInterval(id);
  }, [isSlider, images.length]);

  const bgImage = images.length > 0 ? images[current] : null;

  return (
    <section className="relative h-[250px] md:min-h-screen">
      {images.map((src, i) => (
        <div
          key={src}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            opacity: i === current ? 1 : 0,
            transition: "opacity 1s ease-in-out",
            willChange: "opacity",
          }}
          className="absolute inset-0 bg-cover bg-no-repeat"
        />
      ))}

      {/* Fallback if no images */}
      {images.length === 0 && (
        <div style={{ position: "absolute", inset: 0, background: "#1a1f0e" }} />
      )}

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to left, rgba(12,16,7,0.05), rgba(12,16,7,0.2), transparent)",
        }}
      />

      {/* Dots — only when slider */}
      {isSlider && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 2,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                background: i === current ? "#c8a93e" : "rgba(200,169,62,0.4)",
                transition: "all 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
