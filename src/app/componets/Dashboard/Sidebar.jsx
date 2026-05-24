"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./sidbar.css";
import { useRouter } from "next/navigation";

const navLinks = [
  {
    href: "/admin",
    label: "Overview",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const API = "https://rootex-backend.vercel.app/api/v1";
    const router = useRouter();

  const isActive = (href) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };
    const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include", 
      });
    } catch (e) {
      
    }
    router.push("/login");
  };

  return (
    <div className="dashboard">
  
      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? "active" : ""}`}>
        <div className="logo">
          <div className="logo-inner">
            <span className="logo-icon">⬡</span>
            <span className="logo-text">Admin</span>
          </div>
          <button className="close-icon" onClick={() => setOpen(false)}>✕</button>
        </div>

        <nav>
          <p className="nav-label">NAVIGATION</p>
          <ul className="links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={isActive(link.href) ? "activeLink" : ""}
                  onClick={() => setOpen(false)}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <Link href="/" className="back-to-site">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Back to Site</span>
          </Link>

         
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "10px 12px",
              marginTop: 8,
              borderRadius: 10,
              background: "none",
              border: "none",
              color: loggingOut ? "rgba(255,255,255,0.25)" : "rgba(239,68,68,0.7)",
              fontSize: 13,
              fontWeight: 500,
              cursor: loggingOut ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "color 0.2s, background 0.2s",
              textAlign: "right",
            }}
            onMouseEnter={(e) => {
              if (!loggingOut) {
                e.currentTarget.style.color = "#f87171";
                e.currentTarget.style.background = "rgba(239,68,68,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = loggingOut ? "rgba(255,255,255,0.25)" : "rgba(239,68,68,0.7)";
              e.currentTarget.style.background = "none";
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>{loggingOut ? "جاري الخروج..." : "Logout"}</span>
          </button>
        </div>
      </aside>

      <main className="content">
        <button
          className="menuBtn"
          onClick={() => setOpen(true)}
          style={{ display: open ? "none" : undefined }}
        >
          ☰
        </button>
      </main>
    </div>
  );
}
