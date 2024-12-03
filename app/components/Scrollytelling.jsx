"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Header from "./header";
import Timeline from "./Timeline";
import SecondSection from "./SecondSection";
import useScrollToTopOnTrigger from "./hooks/useScrollToTopOnTrigger"; // Importa il tuo hook

gsap.registerPlugin(ScrollTrigger);

const Scrollytelling = () => {
  const [currentFrame, setCurrentFrame] = useState(0); // Stato per il frame corrente
  const headerRef = useRef(null); // Riferimento all'header
  const [showTimeline, setShowTimeline] = useState(true); // Stato per la visibilità della timeline
  const secondSectionRef = useRef(null); // Riferimento alla seconda sezione
  const totalFrames = 1560;
  const fps = 60;

  // Funzione per scrollare in cima
  const scrollToTop = () => {
    if (headerRef.current) {
      gsap.to(window, {
        scrollTo: { y: headerRef.current.offsetTop },
        duration: 1,
        ease: "power2.inOut",
        onComplete: () => {
          ScrollTrigger.refresh();
        },
      });
    }
  };

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

  // Funzione per scrollare a un frame specifico
  const scrollToFrame = (frameIndex) => {
    if (!headerRef.current) {
      console.error("Header reference is not defined.");
      return;
    }

    const progress = frameIndex / (totalFrames - 1); // Progresso target del frame
    if (progress < 0 || progress > 1) {
      console.error("Invalid progress value:", progress);
      return;
    }

    const trigger = ScrollTrigger.getAll().find(
      (t) => t.vars.trigger === headerRef.current
    );

    if (!trigger) {
      console.error("No ScrollTrigger found for headerRef.");
      return;
    }

    const triggerStart = trigger.start;
    const triggerEnd = trigger.end;

    // Calcola la posizione di scroll target basandoti sul progresso
    const targetScroll = triggerStart + progress * (triggerEnd - triggerStart);

    console.log(`Scrolling to frame ${frameIndex}`);
    console.log(`Calculated target scroll position: ${targetScroll}`);

    gsap.to(window, {
      scrollTo: { y: targetScroll },
      duration: 1, // Durata della transizione
      ease: "power2.inOut",
      onComplete: () => {
        ScrollTrigger.refresh(); // Assicurati che tutto sia sincronizzato
      },
    });
  };

  // Usa il custom hook per il trigger della SecondSection
  useScrollToTopOnTrigger(headerRef, {
    start: "top bottom",
    end: "bottom top",
    duration: 1,
  });

  useScrollToTopOnTrigger(secondSectionRef, {
    start: "top 90%",
    duration: 1,
  });

  // Gestione della visibilità della timeline
  useEffect(() => {
    if (!secondSectionRef.current) return;

    const timelineTrigger = ScrollTrigger.create({
      trigger: secondSectionRef.current,
      start: "top center",
      onEnter: () => setShowTimeline(false),
      onLeaveBack: () => setShowTimeline(true),
    });

    return () => {
      timelineTrigger.kill();
    };
  }, [secondSectionRef]);

  return (
    <div>
      <Header
        ref={headerRef} // Passa il riferimento all'header
        setCurrentFrame={setCurrentFrame}
        totalFrames={totalFrames}
        milestones={milestones}
        fps={fps}
        currentFrame={currentFrame} // Passa lo stato al componente Header
      />
      <Timeline
        currentFrame={currentFrame}
        milestones={milestones}
        totalFrames={totalFrames}
        scrollToFrame={scrollToFrame} // Passa la funzione per lo scroll
        isVisible={showTimeline}
      />
      <div ref={secondSectionRef} className="second-section">
        <SecondSection
          secondSectionRef={secondSectionRef}
          scrollToTop={scrollToTop} // Passa la funzione
        />
      </div>
    </div>
  );
};

export default Scrollytelling;
