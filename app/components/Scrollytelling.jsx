"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Header from "./header";
import SecondSection from "./SecondSection";
import HeaderCenterTitle from "./HeaderCenterTitle";
import ContactInfoToggle from "./ContactInfoToggle"; // Assicurati che il percorso sia corretto
import Banner from "./animatedTextBanner";
import AboutOverlay from "./AboutOverlay";

gsap.registerPlugin(ScrollTrigger);

const Scrollytelling = () => {
  const [currentFrame, setCurrentFrame] = useState(0); // Stato per il frame corrente
  const [isLoaded, setIsLoaded] = useState(false); // Stato per sapere se il video è caricato
  const headerRef = useRef(null); // Riferimento all'header
  const secondSectionRef = useRef(null); // Riferimento alla seconda sezione
  const totalFrames = 1560;
  const [showTitle, setShowTitle] = useState(false);
  const [showAbout, setShowAbout] = useState(false); // Nuovo state per overlay About
  const fps = 60;
  const milestones = useMemo(
    () => [
      0,
      Math.floor(totalFrames * 0.25),
      Math.floor(totalFrames * 0.5),
      Math.floor(totalFrames * 0.75),
      totalFrames - 1,
    ],
    [totalFrames]
  );
  useEffect(() => {
    if (secondSectionRef.current) {
      const trigger = ScrollTrigger.create({
        trigger: secondSectionRef.current,
        start: "top 90%",
        end: "bottom center",
        onEnter: () => setShowTitle(true),
        onLeaveBack: () => setShowTitle(false),
        onLeave: () => setShowTitle(false),
        onEnterBack: () => setShowTitle(true),
      });

      // Pulizia
      return () => {
        trigger.kill();
      };
    }
  }, []);
  const handleLoaded = () => {
    setIsLoaded(true); // Aggiorna lo stato quando il video è caricato
  };

  const scrollToTop = () => {
    if (headerRef.current) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div>
      <Banner />
      <div className="absolute top-5 left-0 w-full h-16 flex items-center justify-between px-3 md:px-4 lg:px-4 my-0 lg:my-5 md:my-5 sm:my-0 z-10 sm:text-xs md:text-s">
        {/* Elemento a sinistra (può essere vuoto o contenere un logo) */}
        <div className="text-blandoBlue flex flex-col text-left">
          <ContactInfoToggle />
        </div>
        {/* Link "About" all'estrema destra */}
        <a
          className="text-blandoBlue underline text-sm lg:text-base md:text-base sm:text-sm"
          onClick={() => setShowAbout(true)}
        >
          About
        </a>
      </div>
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        {/* Titolo centrato */}
        <HeaderCenterTitle
          title="(re)generative vases"
          year="2024"
          fontSizeTitle="lg:text-7xl md:text-7xl sm:text-7xl text-5xl"
          fontSizeYear="lg:text-5xl md:text-5xl sm:text-5xl text-4xl"
          show={true}
        />
      </div>
      <Header
        ref={headerRef} // Passa il riferimento all'header
        setCurrentFrame={setCurrentFrame}
        totalFrames={totalFrames}
        milestones={milestones}
        fps={fps}
        currentFrame={currentFrame} // Passa lo stato al componente Header
      />
      <div ref={secondSectionRef} className="second-section">
        <SecondSection
          secondSectionRef={secondSectionRef}
          scrollToTop={scrollToTop}
        />
      </div>

      {/* Overlay About */}
      {showAbout && <AboutOverlay onClose={() => setShowAbout(false)} />}
    </div>
  );
};

export default Scrollytelling;
