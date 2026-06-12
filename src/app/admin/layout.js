

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Sidebar from "../componets/Dashboard/Sidebar.jsx";
import Adminnavbar from "../componets/Dashboard/AdminNavbar.jsx";

export const metadata = { title: "Admin Dashboard" };

async function getMe() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const res = await fetch("https://api.beautyhub.es/api/v1/auth/me", {
      method: "GET",
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data?.user || null;
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }) {
  const user = await getMe();
  if (!user) redirect("/Login");
  if (user.role !== "admin") redirect("/");

  return (
    <div      dir="ltr" style={{ display: "flex", minHeight: "100vh", background: "#f5f5f3" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Adminnavbar user={user} />
        <div style={{ flex: 1, padding: "32px", overflowX: "hidden" }}>
          {children}
        </div>
      </div>
    </div>
  );
}