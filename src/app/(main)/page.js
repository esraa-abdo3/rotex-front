
import Herosection from "../componets/herosection/herosection";
import Product     from "../componets/product/product";
import Review      from "../componets/review/review";
import Result      from "../componets/result/result";
import Headersection from "../componets/herosection/Headersection";
import CTA from "../componets/CTA/CTA.jsx"
import FloatingButton from "../componets/FloatingButton/FloatingButton";
import ViewContentTracker from "../componets/ViewContentTracker";



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
    if (!res.ok) return { Heroheader: 1, Hero: 2, product: 3, after: 4, review: 5, CTA: 6 };
    const data = await res.json();
    return data.success ? data.order : { Heroheader: 1, Hero: 2, product: 3, after: 4, review: 5, CTA: 6 };
  } catch {
    return { Heroheader: 1, Hero: 2, product: 3, after: 4, review: 5, CTA: 6 };
  }
}
function renderSection(key, props) {
  switch (key) {
    case "Heroheader":
      return <div id={`section-${key}`} key="Heroheader"><Headersection /></div>;
    case "Hero":
      return <div id={`section-${key}`} key="Hero"><Herosection /></div>;
    case "product":
      return <div id={`section-${key}`} key="product"><Product product={props.product} /></div>;
    case "after":
      return <div id={`section-${key}`} key="after"><Result /></div>;
    case "review":
      return <div id={`section-${key}`} key="review"><Review reviewss={props.reviews} /></div>;
    case "CTA":
      return <div id={`section-${key}`} key="CTA"><CTA product={props.product} /></div>;
    default:
      return null;
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
    const thirdSectionKey = sortedSections[2]

  return (
    <div>
  

      <ViewContentTracker targetId={`section-${thirdSectionKey}`} />
      {sortedSections.map((key) =>
        renderSection(key, { product: product.data, reviews })
      )}
      <FloatingButton  product={product.data}/>
  
    </div>
  );
}