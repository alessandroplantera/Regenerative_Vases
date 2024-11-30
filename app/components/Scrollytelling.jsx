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
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0); // Dichiarazione di currentFrame
  const secondSectionRef = useRef(null); // Riferimento alla seconda sezione
  const [showTimeline, setShowTimeline] = useState(true); // Stato per mostrare/nascondere la timeline
  let [scrollTimeout, setScrollTimeout] = useState(null);
  const headerCenterTitleRef = useRef(null);
  const headerTeamInfo = useRef(null);
  const headerMoreInfo = useRef(null);

  const totalFrames = 1547;
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

  // Funzione per caricare immagini iniziali e successive
  const loadInitialImages = async () => {
    const initialFrames = Math.min(20, totalFrames);
    const initialImages = [];
    for (let i = 1; i <= initialFrames; i++) {
      const img = new Image();
      img.src = `/images/sequence/frame${i}.webp`;
      initialImages.push(img);
      if (i === 1) {
        // Disegna la prima immagine non appena è pronta
        img.onload = () => {
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          if (canvas && context) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        };
      }
    }
    setLoadedImages(initialImages);

    // Carica le altre immagini in background
    const remainingImages = [];
    for (let i = initialFrames + 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/images/sequence/frame${i}.webp`;
      remainingImages.push(img);
    }
    setLoadedImages((prev) => [...prev, ...remainingImages]);
  };
  // Funzione per navigare al frame specifico
  const scrollToFrame = (frameIndex) => {
    const targetProgress = frameIndex / (totalFrames - 1); // Calcola la progressione target
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.vars.trigger === headerRef.current) {
        const targetScroll =
          trigger.start + targetProgress * (trigger.end - trigger.start);
        gsap.to(window, {
          scrollTo: { y: targetScroll }, // Usa l'opzione scrollTo con "y"
          duration: 1, // Durata dell'animazione dello scroll
          ease: "power2.inOut",
        });
      }
    });
  };

  // Esegui la funzione di caricamento immagini al montaggio del componente
  useEffect(() => {
    loadInitialImages();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || loadedImages.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const resizeCanvas = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scale = Math.min(viewportWidth / 1080, viewportHeight / 1080);
      const canvasWidth = 1080 * scale;
      const canvasHeight = 1080 * scale;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;
      canvas.style.position = "absolute";
      canvas.style.top = `${(viewportHeight - canvasHeight) / 2}px`;
      canvas.style.left = `${(viewportWidth - canvasWidth) / 2}px`;
    };

    resizeCanvas();
    const isMobile = window.innerWidth <= 768;
    //Timeline
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: headerRef.current,
      start: "top top",
      endTrigger: secondSectionRef.current, // Usa SecondSection come riferimento per il trigger di fine
      end: "top top", // L'end è sincronizzato con l'inizio della seconda sezione
      scrub: true,
      pin: true,
      pinSpacing: true, // Assicurati che lo spazio venga aggiunto correttamente
      snap: {
        snapTo: (progress) => {
          const frame = Math.floor(progress * (totalFrames - 1));
          const closestMilestone = milestones.reduce((prev, curr) =>
            Math.abs(curr - frame) < Math.abs(prev - frame) ? curr : prev
          );
          return closestMilestone / (totalFrames - 1);
        },
        duration: { min: 0.2, max: 0.5 },
        ease: "power4.inOut",
      },
      onUpdate: (self) => {
        // console.log("Progress:", self.progress);
        const frameIndex = Math.floor(
          self.progress * (loadedImages.length - 1)
        );
        setCurrentFrame(frameIndex); // Aggiorna lo stato corrente
        // console.log("Loaded Images Length:", loadedImages.length);
        // console.log("Current Frame Index:", frameIndex);

        const image = loadedImages[frameIndex];
        if (image) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        }
      },
    });

    const handleResize = () => {
      resizeCanvas();
      scrollTriggerInstance.refresh(); // Aggiorna ScrollTrigger
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loadedImages, scrollTimeout]);

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
        <canvas
          ref={canvasRef}
          className="w-full h-auto will-change-transform block"
        />
      </header>
      {/* Timeline */}
      <Timeline
        currentFrame={currentFrame}
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

