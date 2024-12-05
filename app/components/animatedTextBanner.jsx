import React from "react";

const Banner = () => {
  return (
    <div className="fixed top-0 w-full overflow-hidden h-16 z-10 bg-[#E5E5E5] z-50">
      <div className="whitespace-nowrap animate-scroll-left">
        <p
          className="text-6xl inline-block whitespace-nowrap text-blandoBlue"
          style={{ fontFamily: "var(--font-ppregular)" }}
        >
          (re)generative vases — experimental generative approach and digital
          fabrication
        </p>
      </div>
      {/* <hr className="w-full h-px bg-blandoBlue border-0" /> */}
    </div>
  );
};

export default Banner;
