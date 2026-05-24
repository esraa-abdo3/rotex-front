import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../componets/Dashboard/Sidebar.jsx";

export const metadata = {
  title: "Admin Dashboard",
};

async function getMe() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("TOKEN:", token);

    if (!token) return null;

    const res = await fetch(
      "https://rootex-backend.vercel.app/api/v1/auth/me",
      {
        method: "GET",
        headers: {
          Cookie: `token=${token}`,
        },
        cache: "no-store",
      }
    );

    

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    console.log("USER DATA:", data);

    return data?.user || null;
  } catch (error) {
    console.log("GET ME ERROR:", error);
    return null;
  }
}

export default async function AdminLayout({ children }) {
  const user = await getMe();

  console.log("CURRENT USER:", user);

  // لو مش عامل لوجين
  if (!user) {
    redirect("/Login");
  }

  // لو مش ادمن
  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f5f5f3",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "32px",
          overflowX: "hidden",
          maxWidth: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
}
