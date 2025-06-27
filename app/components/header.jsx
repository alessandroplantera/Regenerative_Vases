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
    const [gltfLoaded, setGltfLoaded] = useState(false);

    // const text =
    //   "Interdisciplinary collaborative project of research, product design, communication and interaction curated by STUDIO BLANDO";

    // const words = text.split(" "); // Dividi il testo in parole
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // Indice della parola corrente
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 }); // Posizione del cursore
    const [isCursorVisible, setIsCursorVisible] = useState(false); // Stato visibilità cursore

    // Aggiorna la posizione del cursore
    // useEffect(() => {
    //   const handleMouseMove = (event) => {
    //     setCursorPosition({ x: event.clientX, y: event.clientY });

    //     // Aggiorna l'indice della parola in modo incrementale
    //     setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    //   };
    //   const handleMouseEnter = () => setIsCursorVisible(true);
    //   const handleMouseLeave = () => setIsCursorVisible(false);

    //   const headerElement = document.getElementById("header");

    //   if (headerElement) {
    //     headerElement.addEventListener("mousemove", handleMouseMove);
    //     headerElement.addEventListener("mouseenter", handleMouseEnter);
    //     headerElement.addEventListener("mouseleave", handleMouseLeave);
    //   }

    //   // Cleanup
    //   return () => {
    //     if (headerElement) {
    //       headerElement.removeEventListener("mousemove", handleMouseMove);
    //       headerElement.removeEventListener("mouseenter", handleMouseEnter);
    //       headerElement.removeEventListener("mouseleave", handleMouseLeave);
    //     }
    //   };
    // }, [words.length]);

    // Funzione per attivare/disattivare l'effetto
    // const toggleEffect = () => {
    //   setIsEffectActive((prev) => !prev); // Alterna lo stato
    // };

    // Gestione degli eventi del video
    useEffect(() => {
      const videoElement = videoRef.current;

      if (!videoElement) return;

      // Event listener per quando il video è pronto per essere riprodotto
      const handleCanPlayThrough = () => {
        setVideoLoaded(true);
      };

      // Event listener per gestire il click sul video
      // const handleClick = () => {
      //   toggleEffect();
      // };

      videoElement.addEventListener("canplaythrough", handleCanPlayThrough);
      // videoElement.addEventListener("click", handleClick);

      // Cleanup
      return () => {
        videoElement.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
        videoElement.removeEventListener("click", handleClick);
      };
    }, []);

    useEffect(() => {
      const onGltfLoaded = () => setGltfLoaded(true);
      window.addEventListener("gltfLoaded", onGltfLoaded);
      return () => window.removeEventListener("gltfLoaded", onGltfLoaded);
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
      <header
        ref={ref}
        className="relative w-full h-screen bg-background overflow-hidden"
      >
        <div className="absolute w-full left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 z-10">
          {/* Titolo centrato */}
          <HeaderCenterTitle />
        </div>
        <div className="text-l lg:text-xl md:text-xl sm:text-xl bottom-5 lg:bottom-10 md:bottom-10 sm:bottom-5 absolute  left-1/2 transform -translate-x-1/2 z-10 text-center text-blandoBlue leading-8">
          <p>scroll to see the vases</p>
        </div>
        {/* Testo dinamico vicino al cursore */}
        {isCursorVisible && (
          <div
            className="absolute pointer-events-none text-green-500 font-bold"
            style={{
              top: cursorPosition.y + 20, // Offset verticale
              left: cursorPosition.x + 20, // Offset p
            }}
          >
            {words[currentWordIndex]}
          </div>
        )}
        <video
          ref={videoRef}
          src="/videos/REGENERATIVE_imgSequence_1280_1.mp4"
          autoPlay
          loop
          preload="auto"
          playsInline
          muted
          className="absolute top-1/2 left-1/2 w-auto h-full transform -translate-x-1/2 scale-90 lg:scale-100 md:scale-100 -translate-y-1/2 object-cover"
        ></video>
        {/* Aggiungi il Loader */}
        {!(videoLoaded && gltfLoaded) && <Loader videoRef={videoRef} />}
      </header>
    );
  }
);
Header.displayName = "Header"; // Aggiungi la displayName qui

export default Header;
