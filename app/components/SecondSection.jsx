"use client";

import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { gsap } from "gsap";
import HeaderCenterTitle from "./HeaderCenterTitle";

const SecondSection = () => {
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

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 5, Math.PI / 6, 0.5);
    spotLight.intensity = 4;
    spotLight.position.set(0, 1, 2);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.1);
    backLight.position.set(-2, 2, -2);
    scene.add(backLight);

    // Child Data
    const childData = [
      {
        name: "A.136.5",
        dimensions: "C:250 mm  D:350mm",
        weight: "10 kg",
        coordinates: "N45.88060418116533 E8.95080618178338",
      },
      {
        name: "P.136.5",
        dimensions: "C:250 mm  D:350mm",
        weight: "10 kg",
        coordinates: "N45.88060418116533 E8.95080618178338",
      },
      {
        name: "C.136.5",
        dimensions: "C:250 mm  D:350mm",
        weight: "10 kg",
        coordinates: "N45.88060418116533 E8.95080618178338",
      },
    ];

    const loader = new GLTFLoader();
    loader.load("vasiThreeJs.glb", (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      model.position.y = -0.1;
      model.scale.set(3, 3, 3);

      const objects = [];
      let meshIndex = 0; // Contatore per assegnare i dati

      model.traverse((child) => {
        if (child.isMesh) {
          // Sostituisci il materiale esistente con un materiale di default
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff, // Colore bianco di default
            roughness: 4, // Controlla la rugosità
            metalness: 0, // Controlla il livello di riflessione
          });

          objects.push(child);
          if (meshIndex < childData.length) {
            child.userData = childData[meshIndex]; // Assegna i dati
            meshIndex++;
          }
        }
      });

      if (objects.length === 0) {
        console.error("No valid Mesh objects found in the model!");
        return;
      }

      objectsRef.current = objects;

      // Posiziona gli oggetti attorno all'asse Y
      const radius = 0.15;
      const angleStep = (Math.PI * 2) / objects.length;
      objects.forEach((object, index) => {
        const angle = index * angleStep;
        object.position.set(
          Math.sin(angle) * radius,
          0,
          Math.cos(angle) * radius
        );
      });

      scene.add(model);
      updateInfo(); // Aggiorna le informazioni inizialmente
    });

    const normalizeRotation = (rotation) =>
      ((rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);

    const updateInfo = () => {
      if (!modelRef.current || objectsRef.current.length === 0) {
        console.error("Objects reference is empty or model is not loaded!");
        setCurrentInfo(null);
        return;
      }

      const modelRotationY = normalizeRotation(modelRef.current.rotation.y);
      const angleStep = (Math.PI * 2) / objectsRef.current.length;

      const closestIndex =
        Math.round(modelRotationY / angleStep) % objectsRef.current.length;

      if (closestIndex < 0 || closestIndex >= objectsRef.current.length) {
        console.error(`Invalid closest index: ${closestIndex}`);
        setCurrentInfo(null);
        return;
      }

      const targetChild = objectsRef.current[closestIndex];

      if (targetChild && targetChild.userData) {
        setCurrentInfo(targetChild.userData);
      } else {
        console.error("Target child does not have valid userData!");
        setCurrentInfo(null);
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      if (isAutoRotating.current && modelRef.current) {
        modelRef.current.rotation.y += 0.005;
        updateInfo();
      }
      renderer.render(scene, camera);
    };
    animate();

    const startAutoRotate = () => {
      clearTimeout(autoRotateTimeout.current);
      autoRotateTimeout.current = setTimeout(() => {
        isAutoRotating.current = true;
      }, 2000);
    };

    const clearAutoRotate = () => {
      clearTimeout(autoRotateTimeout.current);
      isAutoRotating.current = false;
    };

    const handleMouseDown = (event) => {
      clearAutoRotate();
      isDragging.current = true;
      startDragX.current = event.clientX;
      if (modelRef.current) {
        rotationStart.current = modelRef.current.rotation.y;
      }
    };

    const handleMouseMove = (event) => {
      if (!isDragging.current || !modelRef.current) return;

      const deltaX = event.clientX - startDragX.current;
      const rotationSpeed = 0.01;
      modelRef.current.rotation.y =
        rotationStart.current + deltaX * rotationSpeed;
      updateInfo();
    };

    const handleMouseUp = () => {
      if (!isDragging.current || !modelRef.current) return;

      isDragging.current = false;

      const currentRotation = modelRef.current.rotation.y;
      const angleStep = (Math.PI * 2) / objectsRef.current.length;
      const closestIndex = Math.round(currentRotation / angleStep);
      const snappedRotation = closestIndex * angleStep;

      gsap.to(modelRef.current.rotation, {
        y: snappedRotation,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: updateInfo,
      });

      startAutoRotate();
    };

    renderer.domElement.addEventListener("mousedown", handleMouseDown);
    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("mouseup", handleMouseUp);
    renderer.domElement.addEventListener("mouseleave", handleMouseUp);

    return () => {
      renderer.dispose();
      clearTimeout(autoRotateTimeout.current);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mouseleave", handleMouseUp);
    };
  }, []);

  return (
    <section className="relative w-screen h-screen bg-gray-200 overflow-hidden flex justify-center items-center">
      <div className="relative w-full h-screen">
        <HeaderCenterTitle
          ref={headerCenterTitleRef}
          showScrollText={false}
          scrollTextTop="2vh"
        />{" "}
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {currentInfo ? (
        <div className="absolute bottom-10 text-center text-lg bg-white p-4 rounded-lg shadow-md">
          <p>
            <strong>Nome:</strong> {currentInfo.name}
          </p>
          <p>
            <strong>Dimensioni:</strong> {currentInfo.dimensions}
          </p>
          <p>
            <strong>Peso:</strong> {currentInfo.weight}
          </p>
          <p>
            <strong>Coordinate:</strong> {currentInfo.coordinates}
          </p>
        </div>
      ) : (
        <div className="absolute bottom-10 text-center text-lg bg-white p-4 rounded-lg shadow-md">
          <p>
            <strong>Informazioni non disponibili</strong>
          </p>
        </div>
      )}
    </section>
  );
};

export default SecondSection;
