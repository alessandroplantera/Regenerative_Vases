"use client";

import React, { useEffect, useState } from "react";

const Loader = ({ videoRef }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef?.current) {
      console.error("Loader: videoRef is not available.");
      return;
    }

    const videoElement = videoRef.current;

    const handleProgress = () => {
      if (videoElement.buffered.length > 0) {
        const bufferedEnd = videoElement.buffered.end(0);
        const percentage = (bufferedEnd / videoElement.duration) * 100;
        setProgress(Math.min(percentage, 100));
      }
    };

    const handleCanPlayThrough = () => {
      setProgress(100);
      setTimeout(() => setIsLoaded(true), 500); // Aggiunge una piccola animazione prima di nascondere il loader
    };

    videoElement.addEventListener("progress", handleProgress);
    videoElement.addEventListener("canplaythrough", handleCanPlayThrough);

    return () => {
      videoElement.removeEventListener("progress", handleProgress);
      videoElement.removeEventListener("canplaythrough", handleCanPlayThrough);
    };
  }, [videoRef]);

  if (isLoaded) {
    return null; // Rimuove il loader quando il video è caricato
  }

  return (
    <div className="loader-overlay">
      <div className="progress-bar">
        <div
          className="progress"
          style={{
            width: `${progress}%`,
            transition: "width 0.2s ease-in-out",
          }}
        ></div>
      </div>
      <p>{progress.toFixed(0)}%</p>
    </div>
  );
};

export default Loader;