
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers/AuthProvider";
import "./login.css"

const colors = {
  primaryDark: "#ffffff",
  secondaryDark: "#f5f5f5",
  primary: "#111111",
  gold: "#000000",
  goldLight: "#333333",
};

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     const res = await fetch(`/api/auth/login`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
     
  //       credentials: "include",
  //       body: JSON.stringify(form),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       setError(data?.data || data?.msg || "بيانات غلط");
  //       setLoading(false);
  //       return;
  //     }

  //     const role = data?.data?.existuser?.role;

  //     if (role === "admin") {
  //       router.push("/admin");
  //     } else {
  //       router.push("/");
  //     }
  //   } catch (err) {
  //     setError("حصل خطأ، حاول تاني");
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("/api/Auth/login", {  
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
  

    if (!res.ok) {
      setError(data?.data || data?.msg || "بيانات غلط");
      setLoading(false);
      return;
    }

  
    await refreshUser();

    const role = data?.data?.existuser?.role;

    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  } catch (err) {
    setError("حصل خطأ، حاول تاني");
    setLoading(false);
  }
};
  return (
<div
  className="login"
  style={{
    minHeight: "100vh",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
    padding: "20px",
  }}
>



      <div
  style={{
    width: "100%",
    maxWidth: 440,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: 24,
    padding: "40px 36px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    position: "relative",
    zIndex: 1,
  }}
      >
       
        <div style={{ textAlign: "center", marginBottom: 32 }}>
    <h1
  style={{
    fontSize: 32,
    fontWeight: 900,
    color: "black",
    margin: 0,
    letterSpacing: 1,
  }}
>
  Roote
  <span style={{ color: "#000" }}>x</span>
</h1>

<p
  style={{
    color: "#777",
    fontSize: 14,
    marginTop: 6,
  }}
>
  تسجيل الدخول للوحة التحكم
</p>
        </div>

        {/* Error */}
        {error && (
      <div
  style={{
    background: "#fff5f5",
    border: "1px solid #fecaca",
    color: "#dc2626",
    borderRadius: 12,
    padding: "12px 16px",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  }}
>
  {error}
</div>
        )}

    
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@rootex.com"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#111")}
onBlur={(e) => (e.target.style.borderColor = "#dcdcdc")}
            />
          </div>

          <div>
            <label style={labelStyle}>كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = colors.gold)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

    <button
  type="submit"
  disabled={loading}
  style={{
    marginTop: 8,
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: loading ? "#999" : "#111",
    color: "white",
    fontSize: 16,
    fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    transition: "0.3s",
    fontFamily: "'Cairo', sans-serif",
  }}
          >
            تسجيل دخول
</button>
        </form>

        {/* Back to site */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
   <a
  href="/"
  style={{
    color: "#666",
    fontSize: 13,
    textDecoration: "none",
  }}
>
  ← الرجوع للموقع
</a>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  color: "#444",
  fontSize: 13,
  marginBottom: 8,
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  background: "#fff",
  border: "1px solid #dcdcdc",
  borderRadius: 12,
  color: "#111",
  fontSize: 16,
  fontFamily: "'Cairo', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s",
};