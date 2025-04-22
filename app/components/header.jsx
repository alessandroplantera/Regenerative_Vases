"use client";

import React, { useState, useEffect, useRef, forwardRef } from "react";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Loader from "./Loader";
import ContactInfoToggle from "./ContactInfoToggle";
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
    const [videoLoaded, setVideoLoaded] = useState(false); // Stato per il Loader

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

    // Gestione degli eventi del video
    useEffect(() => {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      // Event listener per quando il video è pronto per essere riprodotto
      const handleCanPlayThrough = () => {
        setVideoLoaded(true);
      };

      // Event listener per gestire il click sul video
      const handleClick = () => {
        toggleEffect();
      };

      videoElement.addEventListener("canplaythrough", handleCanPlayThrough);
      videoElement.addEventListener("click", handleClick);

      // Cleanup
      return () => {
        videoElement.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
        videoElement.removeEventListener("click", handleClick);
      };
    }, []);

    // Riproduci il video e reimposta il frame corrente al montaggio
    useEffect(() => {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.currentTime = 0; // Assicura che il video inizi dal primo frame
        videoElement
          .play()
          .then(() => {
            setCurrentFrame(0);
          })
          .catch((error) => {
            console.error("Errore nell'avvio del video:", error);
          }); // Avvia il video
      }
    }, [setCurrentFrame]);

    return (
      <header ref={ref} className="relative w-screen h-screen bg-background">
        <div className="absolute w-full left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
          {/* Titolo centrato */}
          <HeaderCenterTitle />
        </div>
        <div className="text-l lg:text-xl md:text-xl sm:text-xl bottom-10 lg:bottom-10 md:bottom-10 sm:bottom-15 absolute  left-1/2 transform -translate-x-1/2 z-10 text-center text-blandoBlue leading-8">
          <p>scroll to see the vases</p>
        </div>
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
        ></video>
        {/* Aggiungi il Loader */}
        {!videoLoaded && <Loader videoRef={videoRef} />}
      </header>
    );
  }
);
Header.displayName = "Header"; // Aggiungi la displayName qui

export default Header;
