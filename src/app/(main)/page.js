
import Herosection from "../componets/herosection/herosection";
import Product     from "../componets/product/product";
import Review      from "../componets/review/review";
import Result      from "../componets/result/result";

async function getProduct() {
  try {
    const res = await fetch(
      "https://rootex-backend.vercel.app/api/v1/product/getallproducts",
      { cache: "no-store" }
    );

    if (!res.ok) return { data: [] };

    return res.json();
  } catch {
    return { data: [] };
  }
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