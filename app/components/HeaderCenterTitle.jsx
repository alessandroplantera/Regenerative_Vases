"use client";
import React from "react";

function isTailwindClass(value) {
  return typeof value === "string" && value.includes("text-");
}

const HeaderCenterTitle = ({
  title = "(re)generative vases",
  year = "2024®",
  show = false, // Prop per controllare la visibilità
  fontSizeTitle, // può essere "6rem" o una classe Tailwind (es. "md:text-3xl")
  fontSizeYear, // può essere "4rem" o una classe Tailwind (es. "md:text-3xl")
}) => {
  return (
    <div
      id="header-center-title"
      className={`flex flex-col items-center w-screen justify-center text-center z-10 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2
        id="header-main-title"
        className={`font-ppregular leading-[2.5rem] ${
          fontSizeTitle && isTailwindClass(fontSizeTitle) ? fontSizeTitle : ""
        }`}
        style={
          fontSizeTitle && !isTailwindClass(fontSizeTitle)
            ? { fontSize: fontSizeTitle }
            : {}
        }
      >
        {title}
      </h2>
      <p
        id="header-year"
        className={`mt-4 ${
          fontSizeYear && isTailwindClass(fontSizeYear) ? fontSizeYear : ""
        }`}
        style={
          fontSizeYear && !isTailwindClass(fontSizeYear)
            ? { fontSize: fontSizeYear }
            : {}
        }
      >
        {year}
      </p>
    </div>
  );
};

export default HeaderCenterTitle;
