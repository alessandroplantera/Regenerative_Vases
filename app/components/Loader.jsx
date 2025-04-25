"use client";

import React, { useEffect, useState } from "react";

const Loader = ({ videoRef }) => {
  const [gltfLoaded, setGltfLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // ascolta evento gltfLoaded
  useEffect(() => {
    const onGltf = () => setGltfLoaded(true);
    window.addEventListener("gltfLoaded", onGltf);
    return () => window.removeEventListener("gltfLoaded", onGltf);
  }, []);

  useEffect(() => {
    if (!videoRef?.current) {
      console.error("Loader: videoRef non è disponibile.");
      return;
    }

    const videoElement = videoRef.current;

    const handleProgress = () => {
      if (videoElement.buffered.length > 0) {
        // Trova il tempo finale massimo tra tutti gli intervalli di buffering
        let bufferedEnd = 0;
        for (let i = 0; i < videoElement.buffered.length; i++) {
          bufferedEnd = Math.max(bufferedEnd, videoElement.buffered.end(i));
        }
        const percentage = (bufferedEnd / videoElement.duration) * 100;
        setProgress(Math.min(Math.floor(percentage), 100));
      }
    };

    const handleCanPlayThrough = () => {
      setProgress(100);
      setTimeout(() => setIsLoaded(true), 500); // Aggiunge una piccola animazione prima di nascondere il loader
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(true); // Nasconde il loader anche in caso di errore
    };

    videoElement.addEventListener("progress", handleProgress);
    videoElement.addEventListener("canplaythrough", handleCanPlayThrough);
    videoElement.addEventListener("error", handleError);

    // Controllo iniziale nel caso in cui il video sia già caricato
    if (videoElement.readyState >= 4) {
      // HAVE_CAN_PLAY_THROUGH
      handleCanPlayThrough();
    }

    return () => {
      videoElement.removeEventListener("progress", handleProgress);
      videoElement.removeEventListener("canplaythrough", handleCanPlayThrough);
      videoElement.removeEventListener("error", handleError);
    };
  }, [videoRef]);

  // mostra Loader finché video o .glb non sono entrambi pronti
  if (isLoaded && gltfLoaded) {
    return null; // Rimuove il loader quando il video è caricato o se c'è stato un errore
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-64 h-4 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-200 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-white">{progress}%</p>
      {hasError && (
        <p className="mt-4 text-red-500">Errore nel caricamento del video</p>
      )}
    </div>
  );
};

export default Loader;
