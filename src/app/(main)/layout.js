import Footer from "../componets/Footer/Footer";
import Navbar from "../componets/Navbar/Navbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer/>
    </>
  );
}