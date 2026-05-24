
import Herosection from "./componets/herosection/herosection";
import Navbar from "./componets/Navbar/Navbar";
import Product from "./componets/product/product";
import Review from "./componets/review/review";
import Result from "./componets/result/result";
import Footer from "./componets/Footer/Footer";
async function getProduct() {
  const res = await fetch("https://rootex-backend.vercel.app/api/v1/product/getallproducts", {
    cache: "no-store", 
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}
async function getsetting() {
    const res = await fetch("https://rootex-backend.vercel.app/api/v1/setting", {
    cache: "no-store", 
  });

  if (!res.ok) {
    throw new Error("Failed to settings");
  }

  return res.json();
}
  

export const metadata = {
  title: "RooteX | Hair Care & Recovery",
  
  description:
    "RooteX helps you restore healthy, stronger hair with effective hair care solutions designed to reduce hair loss and boost confidence.",

  keywords: [
    "RooteX",
    "Hair Care",
    "Hair Recovery",
    "Hair Loss Treatment",
    "Healthy Hair",
    "Hair Growth",
    "Scalp Care",
    "Beauty",
    "Cosmetics",
  ],

  authors: [
    {
      name: "Esraa Abdo",
    },
  ],

  creator: "Esraa Abdo",

  openGraph: {
    title: "RooteX | Hair Care & Recovery",
    
    description:
      "Restore your confidence with premium hair care solutions from RooteX.",

    url: "https://your-domain.com",

    siteName: "RooteX",

    images: [
      {
        url: "/herosection.png",
        width: 1200,
        height: 630,
        alt: "RooteX Hair Care",
      },
    ],

    locale: "en_US",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "RooteX | Hair Care & Recovery",

    description:
      "Premium hair recovery solutions to help reduce hair loss and restore confidence.",

    images: ["/herosection.png"],
  },

  icons: {
    icon: "/resultproduct.png",
  },
};
export default async function Home() {
  const product = await getProduct();
  const datasettings = await getsetting();


const lang = "ar"; 

const settings = {
  brand: "RooteX",

  hook: (
    <>
      {datasettings?.settings?.hook?.text1?.[lang]}
      <br />

      {datasettings?.settings?.hook?.text2?.[lang]}{" "}

      <span
        className="font-bold"
        style={{
          color: "gold",
        }}
      >
        {datasettings?.settings?.hook?.highlight1?.[lang]}
      </span>

      {" ... "}

      <span
        className="font-bold"
        style={{
          color: "gold",
        }}
      >
        {datasettings?.settings?.hook?.highlight2?.[lang]}
      </span>
    </>
  ),

  buttonText:
    datasettings?.settings?.buttonText?.[lang],

  colors: {
    primaryDark:
      datasettings?.settings?.colors?.primaryDark,

    secondaryDark:
      datasettings?.settings?.colors?.secondaryDark,

    primary:
      datasettings?.settings?.colors?.primary,

    gold:
      datasettings?.settings?.colors?.gold,

    goldLight:
      datasettings?.settings?.colors?.goldLight,
  },

  image:
    datasettings?.settings?.images?.herosection,
};

  return (
    <div>
      
      <Herosection settings={settings} />
      <Product settings={settings} product={product.data}/>
    
      <Result settings={settings} />
      <Review settings={settings} />
      <Footer settings={settings}/>
    </div>
  );
}
