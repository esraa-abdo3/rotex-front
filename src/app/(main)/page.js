import Herosection from "../componets/herosection/herosection";
import Product from "../componets/product/product";
import Review from "../componets/review/review";
import Result from "../componets/result/result";


export const metadata = {
  title: "RooteX | Hair Care & Recovery",
  description: "RooteX helps you restore healthy, stronger hair with effective hair care solutions designed to reduce hair loss and boost confidence.",
  keywords: ["RooteX", "Hair Care", "Hair Recovery", "Hair Loss Treatment", "Healthy Hair", "Hair Growth", "Scalp Care", "Beauty", "Cosmetics"],
  authors: [{ name: "Esraa Abdo" }],
  creator: "Esraa Abdo",
  openGraph: {
    title: "RooteX | Hair Care & Recovery",
    description: "Restore your confidence with premium hair care solutions from RooteX.",
    url: "https://your-domain.com",
    siteName: "RooteX",
    images: [{ url: "/herosection.png", width: 1200, height: 630, alt: "RooteX Hair Care" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RooteX | Hair Care & Recovery",
    description: "Premium hair recovery solutions to help reduce hair loss and restore confidence.",
    images: ["/herosection.png"],
  },
  icons: { icon: "/resultproduct.png" },
};

async function getProduct() {
  const res = await fetch("https://rootex-backend.vercel.app/api/v1/product/getallproducts", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function Home() {
  const product = await getProduct();

  return (
    <div>
      <Herosection />
      <Product product={product.data} />
      <Result />
      <Review />
  
    </div>
  );
}
