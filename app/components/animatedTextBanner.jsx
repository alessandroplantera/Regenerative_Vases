"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const Banner = () => {
  return (
    <div className="fixed z-50 top-0 w-full overflow-hidden h-16 bg-background border-t-[1px] border-b-[1px] border-blandoBlue flex items-center">
      <Marquee
        gradient={false}
        speed={100} // Regola la velocità come preferisci
        pauseOnHover={false}
      >
        <span
          className="text-6xl md:text-6xl sm:text-4xl whitespace-nowrap text-blandoBlue mr-16"
          style={{ fontFamily: "var(--font-ppregular)" }}
        >
          (re)generative vases — experimental generative approach and digital
          fabrication
        </span>
        <span
          className="text-6xl md:text-6xl sm:text-4xl whitespace-nowrap text-blandoBlue mr-16"
          style={{ fontFamily: "var(--font-ppregular)" }}
        >
          (re)generative vases — experimental generative approach and digital
          fabrication
        </span>
      </Marquee>
    </div>
  );
};

export default Banner;
