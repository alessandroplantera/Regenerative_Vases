"use client";

import React, { useEffect, useRef, forwardRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import HeaderCenterTitle from "./HeaderCenterTitle";

gsap.registerPlugin(ScrollTrigger);

const Header = forwardRef(
  (
    {
      setCurrentFrame,
      currentFrame,
      totalFrames,
      milestones,
      fps,
      onVideoLoad,
      videoRef, // Ricevi videoRef come prop
    },
    ref // Ref passato tramite forwardRef
  ) => {
    const headerMoreInfo = useRef(null);
    const headerTeamInfo = useRef(null);
    const headerCenterTitleRef = useRef(null);

    // Gestisce il caricamento del video
    useEffect(() => {
      const video = videoRef.current;

      if (!video) return;

      const handleCanPlayThrough = () => {
        if (onVideoLoad) onVideoLoad(); // Chiama il callback quando il video è pronto
      };

      video.addEventListener("canplaythrough", handleCanPlayThrough);

      return () => {
        video.removeEventListener("canplaythrough", handleCanPlayThrough);
      };
    }, [onVideoLoad]);

    // Sincronizzazione dello scroll e aggiornamento del frame corrente
    useEffect(() => {
      if (!videoRef.current || !ref?.current) return;

      const video = videoRef.current;

      const scrollTriggerInstance = ScrollTrigger.create({
        trigger: ref.current, // Usa il ref passato
        start: "top top",
        end: "bottom+=50% top",
        scrub: true,
        pin: true,
        pinSpacing: true,
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
          markers: false,
        },
        onUpdate: (self) => {
          const progress = self.progress;
          const frameIndex = Math.floor(progress * (totalFrames - 1));
          const currentTime = frameIndex / fps;

          if (videoRef.current) {
            videoRef.current.currentTime = currentTime;
          }
          setCurrentFrame(frameIndex);
        },
      });

      const handleResize = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scale = Math.min(viewportWidth / 1920, viewportHeight / 1080);

        video.style.width = `${1920 * scale}px`;
        video.style.height = `${1080 * scale}px`;

        scrollTriggerInstance.refresh();
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        scrollTriggerInstance.kill();
      };
    }, [milestones, totalFrames, fps]);

    return (
      <header ref={ref} className="relative w-screen h-screen bg-gray-200">
        <HeaderCenterTitle
          ref={headerCenterTitleRef}
          headerMoreInfo={headerMoreInfo}
          headerTeamInfo={headerTeamInfo}
          currentFrame={currentFrame} // Passa il frame corrente
          milestones={milestones}
        />
        <video
          ref={videoRef}
          src="/videos/input.mp4"
          preload="metadata" // More conservative preload strategy
          playsInline
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
          onLoadStart={() => console.log("Video Load Start")}
          onLoadedMetadata={(e) =>
            console.log("Metadata Loaded", e.target.duration)
          }
          onError={(e) => console.error("Video Load Error", e)}
        />
      </header>
    );
  }
);

export default Header;
