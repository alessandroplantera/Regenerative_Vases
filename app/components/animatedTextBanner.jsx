"use client";

import React from "react";
import Marquee from "react-fast-marquee";

const Banner = () => {
  return (
    <div className="fixed z-50 top-0 left-0 w-full lg:h-15 md:h-15 sm:h-15 bg-background border-b-[1px] border-blandoBlue flex items-center">
      <Marquee
        gradient={false}
        speed={100} // Regola la velocità come preferisci
        pauseOnHover={false}
        loop={0}
      >
        <p
          className="lg:text-4xl md:text-4xl sm:text-4xl whitespace-nowrap text-blandoBlue mr-16"
          style={{ fontFamily: "var(--font-ppregular)" }}
        >
          (re)generative vases — experimental generative approach and digital
          fabrication
        </p>
      </Marquee>
    </div>
  );
};

export default Banner;
