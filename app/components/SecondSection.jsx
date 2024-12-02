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
    // Funzione per determinare se è un dispositivo mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Imposta inizialmente il valore e aggiungi un listener per il resize
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    //Scene
    const scene = new THREE.Scene();
    //Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    if (typeof window === "undefined" || !secondSectionRef.current) return;
    if (!secondSectionRef.current) return;

    const cameraTrigger = ScrollTrigger.create({
      trigger: secondSectionRef.current,
      start: "top center",
      onEnter: () => {
        gsap.to(camera.position, {
          x: 0,
          y: 1,
          z: isMobile ? 2.5 : 1.5,
          duration: 3,
          delay: 0.4,
          ease: "power4.inOut",
          onUpdate: () => camera.lookAt(0, 0, 0),
        });
      },
    });

    camera.position.set(0, 1.5, 0);
    camera.lookAt(0, 0, 0);
    //Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    // Renderer adjustments
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Ombre morbide
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.01; // Regola l'esposizione

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Più soft
    const spotLight = new THREE.SpotLight(0xffffff, 1.2); // Regola il valore
    spotLight.position.set(0, 2, 3);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);

    scene.add(ambientLight, spotLight, directionalLight);

    //Orbit Controls
    ///////////////////Applicare animazione automatica che dal top passa avanti quando l'utente entra nella section
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1; // Ammortizzazione
    controls.minDistance = 1.5;
    controls.maxDistance = isMobile ? 3 : 2; // Distanza massima
    controls.maxPolarAngle = Math.PI / 2; // Angolo massimo di inclinazione
    controls.enablePan = false;
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
    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    const baseColor = textureLoader.load("textures/baseColor.jpg");
    const roughness = textureLoader.load("textures/roughness.png");
    const normalMap = textureLoader.load("textures/normal.jpg");
    // Imposta il centro di rotazione al centro della texture
    baseColor.center.set(0.5, 0.5);
    roughness.center.set(0.5, 0.5);
    normalMap.center.set(0.5, 0.5);
    // Applica una rotazione di 90 gradi (PI / 2 radianti)
    baseColor.rotation = Math.PI / 2;
    roughness.rotation = Math.PI / 2;
    normalMap.rotation = Math.PI / 2;
    // Scala la texture per ridurre la visibilità dei dettagli
    const scaleFactor = 3; // Maggiore è il numero, meno visibili saranno i dettagli
    baseColor.repeat.set(scaleFactor, scaleFactor);
    roughness.repeat.set(scaleFactor, scaleFactor);
    normalMap.repeat.set(scaleFactor, scaleFactor);
    // Imposta il wrapping per permettere la ripetizione
    baseColor.wrapS = THREE.RepeatWrapping;
    baseColor.wrapT = THREE.RepeatWrapping;
    roughness.wrapS = THREE.RepeatWrapping;
    roughness.wrapT = THREE.RepeatWrapping;
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;

    //3D Loader
    const loader = new GLTFLoader();
    loader.load("vasiThreeJs.glb", (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      model.position.y = -0.1;
      model.scale.set(3, 3, 3);
      model.rotation.set(0, 1.5 * Math.PI, 0); // Rotazione iniziale (x, y, z)

      const objects = [];
      let meshIndex = 0; // Contatore per assegnare i dati

      // Applica il materiale a tutte le mesh
      model.traverse((child) => {
        if (child.isMesh) {
          // //console.log("Materiale della mesh:", child.material);
          // Imposta un materiale standard con le texture PBR
          child.material = new THREE.MeshStandardMaterial({
            map: baseColor, // Texture base color
            roughnessMap: roughness, // Texture roughness
            normalMap: normalMap, // Texture normal map
            normalScale: new THREE.Vector2(0.3, 0.3), // Scala del normal map
            roughness: 1, // Alta rugosità per minimizzare specularità
            metalness: 0.0, // Nessun effetto metallico
          });
          child.material.needsUpdate = true;

          // Modifica lo shader per rimuovere la specularità diretta
          child.material.onBeforeCompile = (shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              "vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;",
              "vec3 totalSpecular = reflectedLight.indirectSpecular;"
            );
          };

          // Assicurati che il materiale sia aggiornato
          // Aggiungi la mesh alla lista degli oggetti
          objects.push(child);
          if (meshIndex < childData.length) {
            child.userData = childData[meshIndex]; // Assegna i dati
            meshIndex++;
          }
        }
      });

      objectsRef.current = objects;

      if (objects.length === 0) {
        console.error("No valid Mesh objects found in the model!");
        return;
      }
      scene.add(model);

      if (objects.length > 0) {
        updateInfo(); // Aggiorna le informazioni inizialmente
      } else {
        console.error("No valid objects to update info for!");
      }
    });

    //Rotazione automatica
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
      }, 800);
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

    //Snap
    const handleMouseUp = () => {
      if (!isDragging.current || !modelRef.current) return;

      isDragging.current = false;

      const currentRotation = modelRef.current.rotation.y;
      const angleStep = (Math.PI * 2) / objectsRef.current.length;
      const closestIndex = Math.round(currentRotation / angleStep);
      const snappedRotation = closestIndex * angleStep;

      gsap.to(modelRef.current.rotation, {
        y: snappedRotation,
        duration: 1,
        ease: "power4.out",
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
      cameraTrigger.kill();
      window.removeEventListener("resize", checkIsMobile);
      clearTimeout(autoRotateTimeout.current);
      renderer.domElement.removeEventListener("mousedown", handleMouseDown);
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("mouseup", handleMouseUp);
      renderer.domElement.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [secondSectionRef, isMobile]);

  return (
    <section className="relative w-screen h-screen bg-gray-200 overflow-hidden flex justify-center items-center">
      <div className="absolute inset-0 z-100">
        <p
          className="absolute bottom-10 right-0 p-4 text-blandoBlue underline cursor-pointer text-center z-10"
          onClick={scrollToTop}
        >
          Go Up
        </p>
      </div>
      <div className="relative w-full h-screen">
        <HeaderCenterTitle
          ref={headerCenterTitleRef}
          showScrollText={false}
          titleVPosition="2vh"
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
