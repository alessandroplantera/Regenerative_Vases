'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const Scrollytelling = () => {
  const frameCount = 100; // Numero totale di frame
  const [currentFrame, setCurrentFrame] = useState(1); // Frame corrente

  // Ottieni lo scroll progress con Motion
  const { scrollYProgress } = useScroll();

  // Usa una molla (spring) per un'interpolazione fluida del frame
  const frameIndex = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 30,
  });

  useEffect(() => {
    // Aggiorna il frame corrente quando cambia lo scroll
    const unsubscribe = frameIndex.onChange((latest) => {
      const frame = Math.round(latest * (frameCount - 1)) + 1; // Calcola il frame
      setCurrentFrame(frame);
    });

    return () => unsubscribe(); // Cleanup per evitare memory leaks
  }, [frameIndex]);

  // Percorso dell'immagine corrente
  const currentFrameSrc = `/images/sequence/frame${currentFrame}.webp`;

  return (
    <div style={{ height: '500vh' }}>
      <motion.div
        className="sticky top-0 w-full h-screen"
        style={{ height: '100vh' }}
      >
        <img
          src={currentFrameSrc}
          alt={`Frame ${currentFrame}`}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

export default Scrollytelling;