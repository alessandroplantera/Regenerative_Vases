"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Header from "./header";
import SecondSection from "./SecondSection";
import HeaderCenterTitle from "./HeaderCenterTitle";
import ContactInfoToggle from "./ContactInfoToggle"; // Assicurati che il percorso sia corretto
import Banner from "./animatedTextBanner";

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

  return (
    <div>
      <Banner />
      <div className="absolute top-10 left-0 w-full h-16 flex items-center justify-between px-3 md:px-4 lg:px-4 my-5 z-10 sm:text-xs md:text-s">
        {/* Elemento a sinistra (può essere vuoto o contenere un logo) */}
        <div className="text-blandoBlue flex flex-col text-left">
          <ContactInfoToggle />
        </div>
        {/* Link "About" all'estrema destra */}
        <a
          className="text-blandoBlue underline lg:text-base md:text-base sm:text-base"
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
          // scrollToTop={scrollToTop} // Passa la funzione
        />
      </div>

      {/* Overlay About */}
      {showAbout && (
        <div
          className="
        fixed inset-0 
        overflow-y-scroll
        w-full h-full min-h-screen 
        bg-black bg-opacity-50 
        flex flex-col 
        items-center justify-center
        z-50 "
        >
          <div
            className="
          relative w-full h-full max-h-screen 
          bg-background 
          pl-4 md:pl-10 pr-4 md:pr-10 pt-4 md:pt-10 "
          >
            <button
              onClick={() => setShowAbout(false)}
              className="absolute 
              top-4 lg:top-10 md:top-10 sm:top-10 
              right-5 lg:right-20 md:right-20 sm:right-20 "
            >
              Close
            </button>
          </div>

          <div
            className="fixed flex flex-col items-center justify-top h-full 
          w-[80%] md:w-[40%] sm:w-[40%] 
          text-center 
          mt-[10rem] md:mt-[10rem] sd:mt-[10rem]"
          >
            {/* Titolo centrato */}
            <HeaderCenterTitle
              title="(re)generative vases"
              year="2024"
              fontSizeTitle="text-4xl lg:text-8xl md:text-8xl sm:text-7xl  leading-[1rem] lg:leading-[4rem] md:leading-[4rem] sm:leading-[4rem]"
              fontSizeYear=" text-3xl lg:text-7xl md:text-7xl sm:text-5xl leading-[1rem] lg:leading-[4rem] md:leading-[4rem] sm:leading-[4rem]"
              show={true}
            />
            <div
              className="infoWrapperAbout 
            w-fit mx-auto 
            mt-10 lg:mt-20 md:mt-20 sm:mt-20
            text-blandoBlue "
            >
              <p
                className="
              leading-7 lg:leading-8 md:leading-6 sm:leading-5
              text-[1.7rem] lg:text-3xl md:text-3xl sm:text-3xl mb-5 lg:mb-10 md:mb-10 sm:mb-10 text-wrap"
              >
                An interdisciplinary collaborative project on digital
                materiality and recycled territories.
              </p>
              <div
                className="
              infoAboutPeople flex flex-col 
              leading-4 lg:leading-6 md:leading-4 sm:leading-4 
              text-base lg:text-xl md:text-xl sm:text-xl 
              gap-3 lg:gap-5 md:gap-5 sm:gap-5 "
              >
                <div className="infoAboutVases">
                  <p>Vases by:</p>
                  <a href="" className="underline">
                    Sofia Petraglio
                  </a>
                </div>
                <div className="infoAboutDesign">
                  <p>Visual and Interactive Design by:</p>
                  <a href="" className="underline">
                    Alice Mioni
                  </a>
                  <p></p>
                  <a href="" className="underline">
                    Alessandro Plantera
                  </a>
                </div>
                <div className="infoAboutPhotography">
                  <p>Visual Design and photography by:</p>
                  <a href="" className="underline">
                    Sophie Sprugasci
                  </a>
                </div>
              </div>
              <div className="mt-10 wrapperFooter text-left absolute bottom-[7rem] w-full">
                <hr className="border-t border-blandoBlue w-full my-4" />
                <div className="relative logos flex flex-row justify-between">
                  <div className="studioBlandoLogo space-y-2">
                    <p>Developed by:</p>
                    <img src="studioblando.svg" alt="Studio Blando" />
                  </div>
                  <div className="sponsor space-y-2">
                    <p>In collaboration with:</p>
                    <img
                      src="cristallina.png"
                      alt="Cristallina The Swiss Marble"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scrollytelling;
