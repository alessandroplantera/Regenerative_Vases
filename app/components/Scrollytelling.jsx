"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SecondSection from "./SecondSection";
import Timeline from "./Timeline";
import { useMemo } from "react";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const Scrollytelling = () => {
  const canvasRef = useRef(null);
  const headerRef = useRef(null);
  const [loadedImages, setLoadedImages] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0); // Dichiarazione di currentFrame
  const secondSectionRef = useRef(null); // Riferimento alla seconda sezione
  const [showTimeline, setShowTimeline] = useState(true); // Stato per mostrare/nascondere la timeline

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
        const frameIndex = Math.floor(
          self.progress * (loadedImages.length - 1)
        );
        setCurrentFrame(frameIndex); // Aggiorna lo stato corrente

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
  }, [loadedImages]);

  // Mostra/Nascondi timeline in base alla visibilità della seconda sezione
  useEffect(() => {
    if (!secondSectionRef.current || !headerRef.current) return;

    // Calcola dinamicamente lo spazio in base all'altezza del header
    const headerHeight = headerRef.current.offsetHeight;

    ScrollTrigger.create({
      trigger: secondSectionRef.current,
      start: `top+=${headerHeight} top`, // Calcola l'inizio rispetto all'altezza del header
      end: "top+=10% top", // Puoi regolare il valore per un comportamento diverso
      markers: true, // Rimuovi dopo il debug
      onEnter: () => setShowTimeline(false), // Nascondi la timeline
      onLeaveBack: () => setShowTimeline(true), // Mostra di nuovo la timeline
    });
  }, [secondSectionRef, headerRef]);

  return (
    <div>
      <header
        ref={headerRef}
        className="relative w-screen h-screen bg-gray-200 overflow-hidden"
      >
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
      <div ref={secondSectionRef} style={{ border: "2px solid red" }}>
        <SecondSection />
      </div>
    </div>
  );
};

export default Scrollytelling;
