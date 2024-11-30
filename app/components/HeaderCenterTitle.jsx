"use client";
import React, { forwardRef } from "react";

const HeaderCenterTitle = forwardRef(
  (
    {
      showScrollText = true,
      titleVPosition = "66.6vh", // Valore di default
      title = "(re)generative vases",
      subtitle = "place-based",
      subsubtitle = " design from waste",
      subsubsubtitle = "materials",
      year = "2024®",
    },
    ref
  ) => (
    <div
      id="header-center-title"
      ref={ref}
      className="absolute flex flex-col items-center justify-center text-center z-10"
      style={{
        top: titleVPosition, // Usa il valore passato dal prop
        height: "auto",
      }} // Centrare verticalmente}
    >
      <h2 id="header-main-title">{title}</h2>
      {subtitle && <p id="header-subtitle">{subtitle}</p>}
      {subsubtitle && <p id="header-subtitle">{subsubtitle}</p>}
      {subsubtitle && <p id="header-subtitle">{subsubsubtitle}</p>}
      <p id="header-year">{year}</p>
      {showScrollText && (
        <p id="header-scroll-text" style={{}}>
          scroll to explore more
        </p>
      )}
    </div>
  )
);
HeaderCenterTitle.displayName = "HeaderCenterTitle";
export default HeaderCenterTitle;
