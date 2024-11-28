'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SecondSection from './SecondSection'; // Importa il componente della seconda sezione

gsap.registerPlugin(ScrollTrigger);

const Scrollytelling = () => {
  const canvasRef = useRef(null); // Riferimento al canvas
  const headerRef = useRef(null); // Riferimento alla prima sezione
  const sectionRef = useRef(null); // Riferimento alla seconda sezione
  const [loadedImages, setLoadedImages] = useState([]); // Array di immagini caricate


  const totalFrames = 1547;
  const imageAspectRatio = 1080 / 1080; // Rapporto d'aspetto delle immagini
  const milestones = [
    0,
    Math.floor(totalFrames * 0.25),
    Math.floor(totalFrames * 0.5),
    Math.floor(totalFrames * 0.75),
    totalFrames - 1,
  ]; // Definiamo le milestone come percentuali del totale dei frame

  useEffect(() => {
    const loadImages = async () => {
      const images = [];
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        img.src = `/images/sequence/frame${i}.webp`;
        images.push(img);
      }
      setLoadedImages(images);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (!canvasRef.current || loadedImages.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const resizeCanvas = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
      
        // Calcola il rapporto d'aspetto del viewport
        const viewportAspectRatio = viewportWidth / viewportHeight;
      
        // Confronta il rapporto d'aspetto del viewport con quello delle immagini
        const scale =
          viewportAspectRatio > 1 // Landscape
            ? viewportHeight / 1080 // Scala in base all'altezza
            : viewportWidth / 1080; // Scala in base alla larghezza
      
        const canvasWidth = 1080 * scale;
        const canvasHeight = 1080 * scale;
      
        // Aggiorna le dimensioni del canvas
        canvasRef.current.width = canvasWidth;
        canvasRef.current.height = canvasHeight;
      
        // Centra il canvas
        canvasRef.current.style.width = `${canvasWidth}px`;
        canvasRef.current.style.height = `${canvasHeight}px`;
        canvasRef.current.style.position = 'absolute';
        canvasRef.current.style.top = `${(viewportHeight - canvasHeight) / 2}px`;
        canvasRef.current.style.left = `${(viewportWidth - canvasWidth) / 2}px`;
        
      };

    resizeCanvas();

    // Configurazione dello ScrollTrigger con Snap
    const isMobile = window.innerWidth <= 768;
    ScrollTrigger.create({
      trigger: headerRef.current,
      start: 'top top',
      end: isMobile? '+=400%': '+=300%',
      scrub: true,
      pin: true,
      snap: {
        snapTo: (progress) => {
          // Trova la milestone più vicina in base alla posizione dello scroll
          const frame = Math.floor(progress * (totalFrames - 1));
          const closestMilestone = milestones.reduce((prev, curr) =>
            Math.abs(curr - frame) < Math.abs(prev - frame) ? curr : prev
          );
          return closestMilestone / (totalFrames - 1); // Snap alla milestone come frazione
        },
        duration: { min: 0.2, max: 0.5 }, // Durata dello snap
        ease: 'power4.inOut', // Effetto di easing per lo snap
      },
      onUpdate: (self) => {
        const frameIndex = Math.floor(self.progress * (loadedImages.length - 1));
        const image = loadedImages[frameIndex];
        if (!image) return;

        // Disegna l'immagine corrente nel canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      },
    });

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loadedImages]);

  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      headerRef.current.style.height = `${viewportHeight}px`;
    };
  
    updateHeight(); // Imposta l'altezza iniziale
    window.addEventListener('resize', updateHeight);
  
    return () => {
      window.removeEventListener('resize', updateHeight);
    };

    
  }, []);
  
  return (
    <div>
      {/* Prima Sezione */}
      <header
        ref={headerRef}
        className="w-screen h-[100dvh] bg-gray-200 relative overflow-hidden"
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
          }}
        />
      </header>
        {/* Seconda Sezione */}
        <SecondSection />
    </div>
  );
};

export default Scrollytelling;