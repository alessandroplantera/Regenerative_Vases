"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SecondSection from "./SecondSection";
import Timeline from "./Timeline";
import { useMemo } from "react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import HeaderCenterTitle from "./HeaderCenterTitle";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Scrollytelling = () => {
  const headerRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0); // Dichiarazione di currentFrame
  const secondSectionRef = useRef(null); // Riferimento alla seconda sezione
  const [showTimeline, setShowTimeline] = useState(true); // Stato per mostrare/nascondere la timeline
  let [scrollTimeout, setScrollTimeout] = useState(null);
  const headerCenterTitleRef = useRef(null);
  const headerTeamInfo = useRef(null);
  const headerMoreInfo = useRef(null);
  const videoRef = useRef(null);
  const totalFrames = 1560;
  const milestones = useMemo(
    () => [
      0,
      Math.floor(totalFrames * 0.25),
      Math.floor(totalFrames * 0.5),
      Math.floor(totalFrames * 0.75),
      totalFrames - 1,
    ],
    [totalFrames] // Ricalcola solo se totalFrames cambia
  );

  const fps = 60;
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // Assicurati che parta sempre dal primo frame
      setCurrentFrame(0); // Aggiorna il frame corrente
    }
  }, []); // Questo effetto viene eseguito solo una volta al caricamento
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    // Configura ScrollTrigger per sincronizzare il video con lo scroll
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: headerRef.current, // Elemento principale della sezione
      start: "top top",
      endTrigger: secondSectionRef.current, // Fine sincronizzata con l'inizio della seconda sezione
      end: "top top",
      scrub: true, // Sincronizza lo scroll con il movimento
      pin: true, // Fissa l'elemento durante lo scroll
      pinSpacing: true, // Aggiunge lo spazio durante il pinning
      snap: {
        snapTo: (progress) => {
          // Calcola il frame corrente
          const frame = Math.floor(progress * (totalFrames - 1));
          const closestMilestone = milestones.reduce((prev, curr) =>
            Math.abs(curr - frame) < Math.abs(prev - frame) ? curr : prev
          );
          return closestMilestone / (totalFrames - 1); // Snap al frame più vicino
        },
        duration: { min: 0.2, max: 0.5 }, // Durata dello snap
        ease: "power4.inOut", // Animazione dello snap
      },
      onUpdate: (self) => {
        // Aggiorna il frame corrente
        const progress = self.progress;
        const frameIndex = Math.floor(progress * (totalFrames - 1));
        const currentTime = frameIndex / fps; // Calcola il tempo del video in base al frame

        if (videoRef.current) {
          videoRef.current.currentTime = currentTime; // Aggiorna il tempo corrente del video
        }

        setCurrentFrame(frameIndex); // Aggiorna lo stato del frame corrente per la timeline
      },
    });
    const handleResize = () => {
      if (videoRef.current) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scale = Math.min(viewportWidth / 1920, viewportHeight / 1080);

        videoRef.current.style.width = `${1920 * scale}px`;
        videoRef.current.style.height = `${1080 * scale}px`;
      }

      scrollTriggerInstance.refresh(); // Aggiorna ScrollTrigger
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()); // Pulisci tutti i trigger
    };
  }, [milestones, totalFrames, fps]);

  useEffect(() => {
    if (!secondSectionRef.current) return;

    const timelineVisibilityTrigger = ScrollTrigger.create({
      trigger: secondSectionRef.current,
      start: "top center", // Quando la sezione entra nel centro della viewport
      onEnter: () => setShowTimeline(false), // Nascondi la timeline
      onLeaveBack: () => setShowTimeline(true), // Mostra di nuovo la timeline
    });

    // Cleanup
    return () => {
      timelineVisibilityTrigger.kill();
    };
  }, [secondSectionRef]);

  useEffect(() => {
    if (!secondSectionRef.current) {
      console.error("secondSectionRef is not attached to any DOM element.");
      return;
    }

    const snapToSecondSection = ScrollTrigger.create({
      trigger: secondSectionRef.current,
      start: "top 70%", // Quando il top della sezione entra al 40% della viewport
      onEnter: () => {
        gsap.to(window, {
          scrollTo: {
            y: secondSectionRef.current.offsetTop, // Scorri fino al top della sezione
          },
          duration: 1, // Durata dello scroll
          ease: "power2.inOut",
        });
      },
      // markers: true, // Aggiungi marker per il debug
    });

    return () => {
      snapToSecondSection.kill(); // Cleanup del trigger
    };
  }, [secondSectionRef]);
  const scrollToFrame = (frameIndex) => {
    const targetTime = frameIndex / fps; // Calcola il tempo corrispondente al frame
    const targetProgress = frameIndex / (totalFrames - 1); // Calcola la progressione target

    if (videoRef.current) {
      // Usa GSAP per animare il tempo del video
      gsap.to(videoRef.current, {
        currentTime: targetTime,
        duration: 1, // Durata dell'animazione
        ease: "power2.inOut",
      });
    }

    // Anima lo scroll
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === headerRef.current) {
        const targetScroll =
          trigger.start + targetProgress * (trigger.end - trigger.start);
        gsap.to(window, {
          scrollTo: { y: targetScroll },
          duration: 1, // Durata dello scroll
          ease: "power2.inOut",
        });
      }
    });
  };

  // Mostra/Nascondi timeline in base alla visibilità della seconda sezione
  useEffect(() => {
    if (!secondSectionRef.current || !headerRef.current) return;

    // Calcola dinamicamente lo spazio in base all'altezza del header
    const headerHeight = headerRef.current.offsetHeight;
    // Trigger per mostrare/nascondere la timeline
    const timelineTrigger = ScrollTrigger.create({
      trigger: secondSectionRef.current,
      start: `top+=${headerHeight} top`,
      end: "top+=10% top",
      markers: false,
      onEnter: () => setShowTimeline(false),
      onLeaveBack: () => setShowTimeline(true),
    });

    // Trigger per lo scroll automatico alla seconda sezione
    const scrollSnapTrigger = ScrollTrigger.create({
      trigger: headerRef.current,
      start: "top top",
      end: "bottom+=50% top",
      markers: false,
      onLeave: () => {
        if (secondSectionRef.current) {
          secondSectionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      },
    });

    // Cleanup solo dei trigger creati da questo useEffect
    return () => {
      timelineTrigger.kill();
      scrollSnapTrigger.kill();
    };
  }, [secondSectionRef, headerRef]);
  ///

  ///Testi Animation
  const currentFrameRef = useRef(0);
  useEffect(() => {
    // Aggiorna il ref ogni volta che currentFrame cambia
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  useEffect(() => {
    // GSAP ScrollTrigger per il fade-out durante lo scroll
    const hideTitle = () => {
      gsap.to(
        [
          headerCenterTitleRef.current,
          headerMoreInfo.current,
          headerTeamInfo.current,
        ],
        {
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        }
      );
    };

    const resetTitle = () => {
      gsap.to(
        [
          headerCenterTitleRef.current,
          headerMoreInfo.current,
          headerTeamInfo.current,
        ],
        {
          opacity: 1,
          duration: 1,
          ease: "power4.out",
        }
      );
    };

    // Event listener per ripristinare il titolo dopo 3 secondi di inattività
    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      hideTitle();

      const isMilestone1 = currentFrameRef.current < milestones[1];

      // console.log(
      //   "Current Frame:",
      //   currentFrameRef.current,
      //   "Is Milestone 1:",
      //   isMilestone1
      // );

      if (isMilestone1) {
        scrollTimeout = setTimeout(() => {
          resetTitle();
        }, 3000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerCenterTitleRef, headerMoreInfo, headerTeamInfo, milestones]);

  ///

  return (
    <div>
      <header
        ref={headerRef}
        className="relative w-screen h-screen bg-gray-200 overflow-hidden"
      >
        <img
          id="header-logo"
          src="/studioblando.svg"
          alt="Studio Blando"
          className="w-20 absolute top-5 left-10 space-y-4 z-10"
        />
        <div
          id="header-top-left"
          className="absolute top-20 left-10 space-y-4 z-10"
          ref={headerMoreInfo}
        >
          {/* Logo e descrizione breve */}
          <p id="header-description" className="space-y-10">
            Interdisciplinary collaborative project of <br /> research, product
            design, communication, and <br /> interaction curated by Studio
            Blando.
          </p>

          {/* Contatti */}
          <div id="header-contacts">
            <p id="header-email">studioblando@gmail.com</p>
            <p id="header-instagram">studio_blando</p>
          </div>
        </div>
        {/*TeamInfo*/}
        <div id="header-team-info" className="left-10" ref={headerTeamInfo}>
          <div className="team-item">
            <p className="team-title">Vases:</p>
            <p className="team-info">Sofia Petraglio</p>
          </div>
          <div className="team-item">
            <p className="team-title">Visual and Interactive Design:</p>
            <p className="team-info">Alice Mioni</p>
            <p className="team-info">Alessandro Plantera</p>
          </div>
          <div className="team-item">
            <p className="team-title">Visual and Photography:</p>
            <p className="team-info">Sophie Sprugasci</p>
          </div>
          <p>SUDIO BLANDO collective</p>
        </div>
        <HeaderCenterTitle ref={headerCenterTitleRef} titleVPosition="40vh" />
        <video
          ref={videoRef}
          src="/videos/input.mp4" // Percorso al tuo video ottimizzato
          preload="auto"
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </header>
      {/* Timeline */}
      <Timeline
        currentFrame={Math.round(videoRef.current?.currentTime * fps)} // Calcola il frame corrente dal tempo del video
        milestones={milestones}
        totalFrames={totalFrames}
        scrollToFrame={scrollToFrame}
        isVisible={showTimeline} // Passa lo stato di visibilità
      />

      {/* Seconda Sezione */}
      <div ref={secondSectionRef}>
        <SecondSection
          headerRef={headerRef}
          secondSectionRef={secondSectionRef}
        />
      </div>
    </div>
  );
};

export default Scrollytelling;
