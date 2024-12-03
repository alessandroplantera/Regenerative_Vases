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

    const text =
      "Interdisciplinary collaborative project of research, product design, communication and interaction curated by STUDIO BLANDO";

    const words = text.split(" "); // Dividi il testo in parole
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // Indice della parola corrente
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Posizione del cursore
    const [isCursorVisible, setIsCursorVisible] = useState(false); // Stato visibilità cursore

    // Aggiorna la posizione del cursore e l'indice della parola
    useEffect(() => {
      const handleMouseMove = (event) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });

        // Aggiorna l'indice della parola in modo incrementale
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      };
      const handleMouseEnter = () => setIsCursorVisible(true);
      const handleMouseLeave = () => setIsCursorVisible(false);

      const headerElement = document.getElementById("header");

      if (headerElement) {
        headerElement.addEventListener("mousemove", handleMouseMove);
        headerElement.addEventListener("mouseenter", handleMouseEnter);
        headerElement.addEventListener("mouseleave", handleMouseLeave);
      }

      // Cleanup
      return () => {
        if (headerElement) {
          headerElement.removeEventListener("mousemove", handleMouseMove);
          headerElement.removeEventListener("mouseenter", handleMouseEnter);
          headerElement.removeEventListener("mouseleave", handleMouseLeave);
        }
      };
    }, [words.length]);

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
        {/* Testo dinamico vicino al cursore */}
        {isCursorVisible && (
          <div
            className="absolute pointer-events-none text-green-500 font-bold"
            style={{
              top: cursorPosition.y + 20, // Offset verticale
              left: cursorPosition.x + 20, // Offset orizzontale
            }}
          >
            {words[currentWordIndex]}
          </div>
        )}
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
Header.displayName = "Header"; // Aggiungi la displayName qui

export default Header;
