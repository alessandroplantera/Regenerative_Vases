"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Loader from "./Loader";
import HeaderCenterTitle from "./HeaderCenterTitle";

gsap.registerPlugin(ScrollTrigger);

const Header = forwardRef(
  (
    { setCurrentFrame, currentFrame, totalFrames, milestones, fps }, // Props
    ref // Ref passato tramite forwardRef
  ) => {
    const videoRef = useRef(null); // Riferimento per il video
    const headerMoreInfo = useRef(null);
    const headerTeamInfo = useRef(null);
    const headerCenterTitleRef = useRef(null);
    const [isEffectActive, setIsEffectActive] = useState(false); // Stato per gestire l'effetto

    // Funzione per attivare/disattivare l'effetto
    const toggleEffect = () => {
      setIsEffectActive((prev) => !prev); // Alterna lo stato
    };

    useEffect(() => {
      if (!videoRef.current) return;

      // Aggiungi un event listener manualmente
      const videoElement = videoRef.current;
      videoElement.addEventListener("click", toggleEffect);

      // Cleanup
      return () => {
        videoElement.removeEventListener("click", toggleEffect);
      };
    }, []);
    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0; // Assicura che il video inizi dal primo frame
        videoRef.current.play(); // Avvia il video
        setCurrentFrame(0);
      }
    }, [setCurrentFrame]);

    return (
      <header ref={ref} className="relative w-screen h-screen bg-gray-200">
        <HeaderCenterTitle
          ref={headerCenterTitleRef}
          headerMoreInfo={headerMoreInfo}
          headerTeamInfo={headerTeamInfo}
          currentFrame={currentFrame} // Passa il frame corrente
          milestones={milestones}
          alignment="center" // Allineamento centrato
        />
        <video
          ref={videoRef}
          src="/videos/input.mp4"
          autoPlay
          loop
          preload="auto"
          playsInline
          muted
          className={`absolute top-0 left-0 w-full h-full object-cover ${
            isEffectActive ? "effect-difference" : ""
          }`} // Applica la classe dinamicamente
        />
        {/* Aggiungi il Loader */}
        <Loader videoRef={videoRef} />
      </header>
    );
  }
);

export default Header;
