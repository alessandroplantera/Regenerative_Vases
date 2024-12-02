import React, { useEffect, useState } from "react";

const Loader = ({ videoRef, onLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!videoRef?.current) {
      console.error("Loader: videoRef is not available.", {
        videoRef,
        current: videoRef?.current,
      });
      return;
    }

    const videoElement = videoRef.current;

    // Funzione per monitorare il caricamento del video
    const handleProgress = () => {
      if (videoElement.buffered.length > 0) {
        const bufferedEnd = videoElement.buffered.end(0);
        const percentage = (bufferedEnd / videoElement.duration) * 100;
        setProgress(Math.min(percentage, 100));
      }
    };

    // Promessa per attendere che il video sia pronto
    const loadVideoAsync = async () => {
      try {
        await new Promise((resolve, reject) => {
          videoElement.addEventListener("progress", handleProgress);
          videoElement.addEventListener("canplaythrough", resolve);
          videoElement.addEventListener("error", reject);
        });

        setProgress(100); // Segna il caricamento come completato
        onLoaded(); // Comunica al genitore che il caricamento è terminato
      } catch (error) {
        console.error("Error loading video:", error);
      }
    };

    // Avvia il caricamento del video
    loadVideoAsync();

    // Cleanup degli eventi
    return () => {
      videoElement.removeEventListener("progress", handleProgress);
      videoElement.removeEventListener("canplaythrough", onLoaded);
    };
  }, [onLoaded, videoRef]);

  return (
    <div className="loader">
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