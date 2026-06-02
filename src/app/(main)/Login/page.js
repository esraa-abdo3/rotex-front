// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import "./login.css"


// const colors = {
//   primaryDark: "#1a1f0e",
//   secondaryDark: "#2d3518",
//   primary: "#3a4520",
//   gold: "#c8a93e",
//   goldLight: "#d4b84a",
// };

// export default function LoginPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setError("");
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   //     const res = await fetch(`/api/auth/login`, {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
     
//   //       credentials: "include",
//   //       body: JSON.stringify(form),
//   //     });

//   //     const data = await res.json();

//   //     if (!res.ok) {
//   //       setError(data?.data || data?.msg || "بيانات غلط");
//   //       setLoading(false);
//   //       return;
//   //     }

//   //     const role = data?.data?.existuser?.role;

//   //     if (role === "admin") {
//   //       router.push("/admin");
//   //     } else {
//   //       router.push("/");
//   //     }
//   //   } catch (err) {
//   //     setError("حصل خطأ، حاول تاني");
//   //     setLoading(false);
//   //   }
//   // };
// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//   setError("");

//   try {
//     const res = await fetch("/api/Auth/login", {  
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
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
//   return (
//     <div
//       className="login"
//       style={{
//         minHeight: "100vh",
//         background: colors.primaryDark,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontFamily: "'Cairo', sans-serif",
//         direction: "rtl",
//         padding: "20px",
//       }}
//     >

//       <div
//         style={{
//           position: "fixed",
//           top: "20%",
//           left: "50%",
//           transform: "translateX(-50%)",
//           width: 600,
//           height: 600,
//           borderRadius: "50%",
//           background: `radial-gradient(circle, ${colors.gold}18 0%, transparent 70%)`,
//           pointerEvents: "none",
//         }}
//       />

//       <div
//         style={{
//           width: "100%",
//           maxWidth: 440,
//           background: "rgba(255,255,255,0.04)",
//           border: `1px solid ${colors.gold}33`,
//           borderRadius: 24,
//           padding: "40px 36px",
//           backdropFilter: "blur(12px)",
//           boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
//           position: "relative",
//           zIndex: 1,
//         }}
//       >
       
//         <div style={{ textAlign: "center", marginBottom: 32 }}>
//           <h1
//             style={{
//               fontSize: 32,
//               fontWeight: 900,
//               color: colors.primary,
//               margin: 0,
//               letterSpacing: 1,
//             }}
//           >
//             Roote
//             <span style={{ color: colors.gold }}>x</span>
//           </h1>
//           <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 6 }}>
//             تسجيل الدخول للوحة التحكم
//           </p>
//         </div>

//         {/* Error */}
//         {error && (
//           <div
//             style={{
//               background: "rgba(239,68,68,0.12)",
//               border: "1px solid rgba(239,68,68,0.3)",
//               color: "#fca5a5",
//               borderRadius: 12,
//               padding: "12px 16px",
//               fontSize: 14,
//               marginBottom: 20,
//               textAlign: "center",
//             }}
//           >
//             {error}
//           </div>
//         )}

    
//         <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           <div>
//             <label style={labelStyle}>البريد الإلكتروني</label>
//             <input
//               type="email"
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//               placeholder="admin@rootex.com"
//               required
//               style={inputStyle}
//               onFocus={(e) => (e.target.style.borderColor = colors.gold)}
//               onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
//             />
//           </div>

//           <div>
//             <label style={labelStyle}>كلمة المرور</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//               placeholder="••••••••"
//               required
//               style={inputStyle}
//               onFocus={(e) => (e.target.style.borderColor = colors.gold)}
//               onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               marginTop: 8,
//               padding: "14px",
//               borderRadius: 12,
//               border: "none",
//               background: loading
//                 ? "rgba(200,169,62,0.4)"
//                 : `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
//               color: "#1a1a0a",
//               fontSize: 16,
//               fontWeight: 700,
//               cursor: loading ? "not-allowed" : "pointer",
//               transition: "all 0.3s",
//               fontFamily: "'Cairo', sans-serif",
//             }}
//           >
//   {loading ? (
//     <>
//       <span
//         style={{
//           width: "18px",
//           height: "18px",
//           border: "2px solid #fff",
//           borderTop: "2px solid transparent",
//           borderRadius: "50%",
//           display: "inline-block",
//           animation: "spin 0.7s linear infinite",
//         }}
//       ></span>

//       <style jsx>{`
//         @keyframes spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </>
//   ) : (
//     "دخول"
//   )}
//           </button>
//         </form>

//         {/* Back to site */}
//         <div style={{ textAlign: "center", marginTop: 24 }}>
//           <a
//             href="/"
//             style={{
//               color: "rgba(255,255,255,0.35)",
//               fontSize: 13,
//               textDecoration: "none",
//             }}
//           >
//             ← الرجوع للموقع
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

// const labelStyle = {
//   display: "block",
//   color: "rgba(255,255,255,0.6)",
//   fontSize: 13,
//   marginBottom: 8,
//   fontWeight: 600,
// };

// const inputStyle = {
//   width: "100%",
//   padding: "13px 16px",
//   background: "rgba(255,255,255,0.05)",
//   border: "1px solid rgba(255,255,255,0.1)",
//   borderRadius: 12,
//   color: "white",
//   fontSize: 14,
//   fontFamily: "'Cairo', sans-serif",
//   outline: "none",
//   boxSizing: "border-box",
//   transition: "border-color 0.2s",
// };
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import "./login.css"


const colors = {
  primaryDark: "#1a1f0e",
  secondaryDark: "#2d3518",
  primary: "#3a4520",
  gold: "#c8a93e",
  goldLight: "#d4b84a",
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
        background: colors.primaryDark,
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
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${colors.gold}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${colors.gold}33`,
          borderRadius: 24,
          padding: "40px 36px",
          backdropFilter: "blur(12px)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          position: "relative",
          zIndex: 1,
        }}
      >
       
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: colors.primary,
              margin: 0,
              letterSpacing: 1,
            }}
          >
            Roote
            <span style={{ color: colors.gold }}>x</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, marginTop: 6 }}>
            تسجيل الدخول للوحة التحكم
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5",
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
              onFocus={(e) => (e.target.style.borderColor = colors.gold)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
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
              background: loading
                ? "rgba(200,169,62,0.4)"
                : `linear-gradient(135deg, ${colors.gold}, ${colors.goldLight})`,
              color: "#1a1a0a",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
  {loading ? (
    <>
      <span
        style={{
          width: "18px",
          height: "18px",
          border: "2px solid #fff",
          borderTop: "2px solid transparent",
          borderRadius: "50%",
          display: "inline-block",
          animation: "spin 0.7s linear infinite",
        }}
      ></span>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  ) : (
    "دخول"
  )}
          </button>
        </form>

        {/* Back to site */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a
            href="/"
            style={{
              color: "rgba(255,255,255,0.35)",
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
  color: "rgba(255,255,255,0.6)",
  fontSize: 13,
  marginBottom: 8,
  fontWeight: 600,
};

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  color: "white",
  fontSize: 16,
  fontFamily: "'Cairo', sans-serif",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};