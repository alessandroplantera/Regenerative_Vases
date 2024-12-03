"use client";

import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
// import * as dat from "dat.gui";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import ScrollTrigger from "gsap/ScrollTrigger";
import HeaderCenterTitle from "./HeaderCenterTitle";

const SecondSection = ({ secondSectionRef, scrollToTop }) => {
  const canvasRef = useRef(null);
  const headerCenterTitleRef = useRef(null); // Ref condiviso
  const modelRef = useRef(null);
  const isDragging = useRef(false);
  const startDragX = useRef(0);
  const rotationStart = useRef(0);
  const objectsRef = useRef([]);
  const isAutoRotating = useRef(false);
  const autoRotateTimeout = useRef(null);
  const [currentInfo, setCurrentInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  gsap.registerPlugin(ScrollToPlugin);

  const handleScrollToTop = () => {
    // Disattiva temporaneamente i trigger
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <section className="relative w-screen h-screen bg-gray-200 overflow-hidden flex justify-center items-center">
      <div className="absolute inset-0 z-100">
        <p
          className="absolute top-10 right-10 p-4 text-blandoBlue underline cursor-pointer text-center z-10"
          onClick={scrollToTop}
        >
          Go Up
        </p>
      </div>
      <div className="relative w-full h-screen">
        <HeaderCenterTitle
          ref={headerCenterTitleRef}
          showScrollText={false}
          alignment="top" // Allineamento in alto
        />{" "}
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
      {currentInfo ? (
        <div className="absolute bottom-10 text-center p-4 text-blandoBlue">
          {/* Nome con stile grande */}
          <p className="text-5xl mb-2">{currentInfo.name}</p>
          {/* Linea divisoria */}
          <hr className="border-blandoBlue my-2 w-3/4 mx-auto" />
          {/* Dimensioni e peso */}
          <div className="flex justify-between text-lg w-full px-4 mt-4">
            <div>
              <p className="font-semibold">dimensions</p>
              <p>{currentInfo.dimensions}</p>
            </div>
            <div>
              <p className="font-semibold">weight</p>
              <p>{currentInfo.weight}</p>
            </div>
          </div>
          {/* Coordinate */}
          <div className="mt-4">
            <p className="font-semibold">waste coordinates</p>
            <p>{currentInfo.coordinates}</p>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-10 text-center text-lg">
          <p>
            <strong>Informazioni non disponibili</strong>
          </p>
        </div>
      )}
    </section>
  );
};

export default SecondSection;
