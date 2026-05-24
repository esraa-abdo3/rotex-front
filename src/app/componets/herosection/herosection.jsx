
"use client";
import "./hersection.css"
export default function Herosection({ settings }) {
  
  const handleScroll = () => {
    document
      .getElementById("product")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
    
      className="overflow-hiddeny"
      style={{
        position:"relative",
      
        fontFamily: "Cairo, sans-serif",
        backgroundImage: `url(${settings.image})`,
        backgroundSize:"cover"
      }}
    >
      <div className="grid  lg:grid-cols-2">
   
        <div className=" z-10 flex items-center px-6 py-16 sm:px-10 lg:px-16">
          <div className="max-w-[340px] text-con ">
        
      
           
          <p className="md:mb-10 text-lg leading-[2.2rem] text-[#f5f0e0] text-m  md:text-[40px] cursor-default">
                          {settings.hook}
          </p>
            <button
              className="rounded-[8px]  mt-2  px-2 py-2 md:px-15 py-4 text-sm font-bold transition duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${settings.colors.gold}, #d4b050)`,
                color: "#1a1a0a",
              }}
              onClick={handleScroll }
            >
              {settings.buttonText}
            </button>
          </div>
           
          <div className=" icons absolute  md:bottom-6 right-6 flex items-center gap-3 rounded-[8px] border border-[#b4963c66] bg-[#14180ce0] px-4 py-4 backdrop-blur-md cursor-default text-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>

            <div>
              <h4
                className="text-sm font-bold"
                style={{
                  color: "#e8d88a",
                }}
              >
                RootX Spray
              </h4>

              <p className="text-xs text-[#dcd2aad9]">
                مناسب لكل أنواع الشعر
              </p>
            </div>
          </div>
        </div>

   
      </div>
    </section>
  );
}