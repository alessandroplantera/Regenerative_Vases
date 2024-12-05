"use client";

import React, { useEffect } from "react";

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.id = "custom-cursor";
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", moveCursor);

    const interactiveElements = document.querySelectorAll("a, button");
    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        cursor.style.transform = "scale(1.5)";
        cursor.style.mixBlendMode = "difference";
      });
      element.addEventListener("mouseleave", () => {
        cursor.style.transform = "scale(1)";
        cursor.style.mixBlendMode = "normal";
      });
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      cursor.remove();
    };
  }, []);

  return null; // Non restituisce nulla perché è un cursore globale
};

export default CustomCursor;
