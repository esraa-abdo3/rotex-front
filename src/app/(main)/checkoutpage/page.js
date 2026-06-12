import Checkout from "../../componets/Checkout/checkout";

async function getProduct() {
  const res = await fetch("https://api.beautyhub.es/api/v1/product/getallproducts", {
    cache: "no-store", 
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
export default async function checkoutpage() {
    const product = await getProduct();
    return (
      <Checkout product={product.data[0]}/>
    )
    
}
