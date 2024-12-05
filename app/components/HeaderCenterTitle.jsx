"use client";
import React from "react";

const HeaderCenterTitle = ({
  title = "(re)generative vases",
  year = "2024®",
  fontSizeTitle = "2rem",
  fontSizeYear = "1rem",
  show = false, // Nuova prop per controllare la visibilità
}) => {
  return (
    <div
      id="header-center-title"
      className={`flex flex-col items-center justify-center text-center z-10 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 id="header-main-title" style={{ fontSize: fontSizeTitle }}>
        {title}
      </h2>
      <p id="header-year" style={{ fontSize: fontSizeYear }}>
        {year}
      </p>
    </div>
  );
};

export default HeaderCenterTitle;
