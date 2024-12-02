"use client";
import React, { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";

const HeaderCenterTitle = forwardRef(
  (
    {
      currentFrame,
      milestones,
      fps,
      titleVPosition = "66.6vh",
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
        console.log("resetTitle");
        gsap.to(ref.current, {
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        });
      };

      // Verifica se il frame corrente è vicino alla prima milestone
      const isInFirstMilestone =
        currentFrame >= milestones[0] && currentFrame < milestones[1];

      console.log(isInFirstMilestone);

      // Cancella eventuali timeout attivi
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      if (isInFirstMilestone) {
        // Se siamo nella prima milestone, mostra il titolo dopo un ritardo
        hideTimeoutRef.current = setTimeout(() => {
          resetTitle();
        }, 3000);
      } else {
        // Nascondi il titolo per tutte le altre milestone
        hideTitle();
      }

      return () => {
        // Cleanup eseguito solo allo smontaggio del componente
        if (!isInFirstMilestone && hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
      };
    }, [currentFrame, milestones, fps, ref.current]);

    return (
      <div
        id="header-center-title"
        ref={ref}
        className="absolute flex flex-col items-center justify-center text-center z-10"
        style={{
          top: titleVPosition,
          height: "auto",
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
