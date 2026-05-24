
import Herosection from "../componets/herosection/herosection";
import Product     from "../componets/product/product";
import Review      from "../componets/review/review";
import Result      from "../componets/result/result";

export const metadata = {
  title: "RooteX | Hair Care & Recovery",
  description: "RooteX helps you restore healthy, stronger hair with effective hair care solutions designed to reduce hair loss and boost confidence.",
  keywords: ["RooteX", "Hair Care", "Hair Recovery", "Hair Loss Treatment", "Healthy Hair", "Hair Growth", "Scalp Care", "Beauty", "Cosmetics"],
  authors: [{ name: "Esraa Abdo" }],
  creator: "Esraa Abdo",
  openGraph: {
    title: "RooteX | Hair Care & Recovery",
    description: "Restore your confidence with premium hair care solutions from RooteX.",
    url: "https://rotex-front.vercel.app/",
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

async function getReviews() {
  const res = await fetch("https://rootex-backend.vercel.app/api/v1/Review/visible", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

async function getSectionOrder() {
  try {
    const res = await fetch("https://rootex-backend.vercel.app/api/v1/section-order", { cache: "no-store" });
    if (!res.ok) return { product: 1, after: 2, review: 3 };
    const data = await res.json();
    return data.success ? data.order : { product: 1, after: 2, review: 3 };
  } catch {
    // fallback لو الـ API مش شغال
    return { product: 1, after: 2, review: 3 };
  }
}


function renderSection(key, props) {
  switch (key) {
    case "product": return <Product key="product" product={props.product} />;
    case "after":   return <Result  key="after" />;
    case "review":  return <Review  key="review" reviewss={props.reviews} />;
    default:        return null;
  }
}

export default async function Home() {
  const [product, reviews, sectionOrder] = await Promise.all([
    getProduct(),
    getReviews(),
    getSectionOrder(),
  ]);


  const sortedSections = Object.entries(sectionOrder)
    .sort(([, a], [, b]) => a - b)
    .map(([key]) => key);

  return (
    <div>
      <Herosection />
      {sortedSections.map((key) =>
        renderSection(key, { product: product.data, reviews })
      )}
    </div>
  );
}