"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";

const HeaderCenterTitle = forwardRef(
  (
    {
      currentFrame,
      milestones,
      fps,
      alignment = "center", // Nuova prop per gestire l'allineamento
      title = "(re)generative vases",
      subtitle = "place-based",
      subsubtitle = " design from waste",
      subsubsubtitle = "materials",
      year = "2024®",
      showScrollText = true,
    },
    ref
  ) => {
    const hideTimeoutRef = useRef(null);

    useEffect(() => {
      if (!ref.current || !currentFrame || !milestones) return;

      const hideTitle = () => {
        gsap.to(ref.current, {
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        });
      };

      const resetTitle = () => {
        gsap.to(ref.current, {
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        });
      };

      const isInFirstMilestone =
        currentFrame >= milestones[0] && currentFrame < milestones[1];

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      if (isInFirstMilestone) {
        hideTimeoutRef.current = setTimeout(() => {
          resetTitle();
        }, 3000);
      } else {
        hideTitle();
      }

      return () => {
        if (!isInFirstMilestone && hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }, [currentFrame, milestones, fps, ref]);

    return (
      <div
        id="header-center-title"
        ref={ref}
        className={`absolute flex flex-col items-center text-center z-10`}
        style={{
          top: alignment === "center" ? "50%" : "0",
          transform:
            alignment === "center"
              ? "translate(-50%, -50%)"
              : "translate(-50%, 0%)",
          left: alignment === "center" ? "50%" : "50%",
        }}
      >
        <h2 id="header-main-title">{title}</h2>
        {subtitle && <p id="header-subtitle">{subtitle}</p>}
        {subsubtitle && <p id="header-subtitle">{subsubtitle}</p>}
        {subsubsubtitle && <p id="header-subtitle">{subsubsubtitle}</p>}
        <p id="header-year">{year}</p>
        {showScrollText && (
          <p id="header-scroll-text">scroll to explore more</p>
        )}
      </div>
    );
  }
);

HeaderCenterTitle.displayName = "HeaderCenterTitle";

export default HeaderCenterTitle;
