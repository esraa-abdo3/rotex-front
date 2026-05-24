
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AdminNavbar({ user }) {
 
  const router = useRouter();

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggleSidebar"));
  };


  return (
    <>
      <nav
        style={{
          height: 60,
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          fontFamily: "'Cairo', sans-serif",
        }}
      >
       
        <button
          className="admin-hamburger"
          onClick={toggleSidebar}
          style={{
            display: "none",
            background: "none",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: 18,
            color: "#3a4520",
          }}
        >
          ☰
        </button>

  
        <span style={{ fontWeight: 800, fontSize: 18, color: "#3a4520" }}>
          Roote<span style={{ color: "#c8a93e" }}>x</span>
          <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af", marginRight: 8 }}>
            Dashboard
          </span>
        </span>

      
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

        
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#f9f7f2",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            padding: "6px 12px",
          }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c8a93e, #d4b84a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "#1a1a0a",
            }}>
              {user?.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#3a4520" }}>
              {user?.email}
            </span>
          </div>

        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .admin-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
