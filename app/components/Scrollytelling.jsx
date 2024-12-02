"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Header from "./header";
import Timeline from "./Timeline";
import Loader from "./Loader"; // Importa il Loader

import SecondSection from "./SecondSection";
import useScrollToTopOnTrigger from "./hooks/useScrollToTopOnTrigger"; // Importa il tuo hook

gsap.registerPlugin(ScrollTrigger);

const Scrollytelling = () => {
  const [isLoaded, setIsLoaded] = useState(false); // Stato per il caricamento
  const [progress, setProgress] = useState(0); // Stato per il progresso del caricamento
  const videoRef = useRef(null); // Riferimento al video

  const [currentFrame, setCurrentFrame] = useState(0); // Stato per il frame corrente
  const headerRef = useRef(null); // Riferimento all'header
  const [showTimeline, setShowTimeline] = useState(true); // Stato per la visibilità della timeline
  const secondSectionRef = useRef(null); // Riferimento alla seconda sezione
  const totalFrames = 1560;
  const fps = 60;
  // Funzione per gestire il caricamento del video
  useEffect(() => {
    // Ensure this only runs on the client
    if (typeof window === "undefined") return;

    console.log("Video Loading Effect Started");
    console.log("Video Reference:", videoRef.current);

    const video = videoRef.current;

    if (!video) {
      console.error("Video Reference is Null/Undefined");
      console.log("Possible Causes:");
      console.log("- Video element not rendered");
      console.log("- Ref not properly attached");
      console.log("- Timing issue with client-side rendering");
      return;
    }

    // Log video properties for diagnostic purposes
    console.log("Video Source:", video.src);
    console.log("Video Preload:", video.preload);

    // Enhanced error handling
    video.onerror = (e) => {
      console.error("Video Error Event:", e);
      console.log("Error Code:", video.error);
      switch (video.error.code) {
        case 1:
          console.log("MEDIA_ERR_ABORTED: Fetching process aborted");
          break;
        case 2:
          console.log("MEDIA_ERR_NETWORK: Network error");
          break;
        case 3:
          console.log("MEDIA_ERR_DECODE: Decoding error");
          break;
        case 4:
          console.log(
            "MEDIA_ERR_SRC_NOT_SUPPORTED: Video format not supported"
          );
          break;
      }
    };

    const handleProgress = (event) => {
      console.log("Progress Event Triggered", event);

      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;

        console.log("Buffered End:", bufferedEnd);
        console.log("Video Duration:", duration);

        if (duration > 0) {
          const progressValue = Math.min((bufferedEnd / duration) * 100, 100);
          console.log("Calculated Progress:", progressValue);
          setProgress(progressValue);
        }
      }
    };

    const handleCanPlayThrough = () => {
      console.log("Can Play Through Event");
      setProgress(100);
      setIsLoaded(true);
    };

    // Add multiple event listeners for comprehensive tracking
    video.addEventListener("progress", handleProgress);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("loadedmetadata", () =>
      console.log("Metadata Loaded")
    );

    return () => {
      video.removeEventListener("progress", handleProgress);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, []);

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
    <>
      <div className="relative">
        <Header
          videoRef={videoRef}
          ref={headerRef}
          setCurrentFrame={setCurrentFrame}
          totalFrames={totalFrames}
          milestones={milestones}
          fps={fps}
          currentFrame={currentFrame}
          onVideoLoad={() => setIsLoaded(true)}
        />
        {!isLoaded && <Loader progress={progress} />}
      </div>
      {isLoaded && (
        <>
          <Timeline
            currentFrame={currentFrame}
            milestones={milestones}
            totalFrames={totalFrames}
            scrollToFrame={scrollToFrame}
            isVisible={showTimeline}
          />
          <div ref={secondSectionRef} className="second-section">
            <SecondSection
              secondSectionRef={secondSectionRef}
              scrollToTop={scrollToTop}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Scrollytelling;
