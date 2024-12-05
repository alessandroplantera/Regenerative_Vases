"use client";
import React from "react";

const HeaderCenterTitle = ({
  title = "(re)generative vases",
  year = "2024®",
  show = false, // Prop per controllare la visibilità
}) => {
  return (
    <div
      id="header-center-title"
      className={`flex flex-col items-center justify-center text-center z-10 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2
        id="header-main-title"
        className="
          text-[5rem]
          lg:text-[15rem]
          font-ppregular
        "
      >
        {title}
      </h2>
      <p
        id="header-year"
        className="
          text-sm
          sm:text-base
          mt-2
        "
      >
        {year}
      </p>
    </div>
  );
};

export default HeaderCenterTitle;
