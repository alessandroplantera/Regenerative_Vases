"use client";

import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const SecondSection = ({ secondSectionRef, scrollToTop }) => {
  const canvasRef = useRef(null);
  const modelRef = useRef(null); // Riferimento al modello caricato
  const objectsRef = useRef([]); // Array degli oggetti caricati
  const highlightMaterial = useRef(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x00ff33,
      emissiveIntensity: 1,
    })
  );
  const [currentInfo, setCurrentInfo] = useState(null);

  useEffect(() => {
    // All'inizio del tuo useEffect
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(0, 0); // Centro dello schermo
    // Configura la scena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1, 2.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Aggiungi luci
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.copy(camera.position);
    spotLight.angle = Math.PI / 6; // Regola l'angolo secondo necessità
    spotLight.penumbra = 0.2;
    spotLight.decay = 2;
    spotLight.distance = 100;
    spotLight.castShadow = false;
    scene.add(spotLight);

    // Aggiungi un oggetto target per la luce spot
    const spotLightTarget = new THREE.Object3D();
    scene.add(spotLightTarget);
    spotLight.target = spotLightTarget;
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(ambientLight, directionalLight);

    // Carica il modello
    const loader = new GLTFLoader();
    loader.load("vasiThreeJs.glb", (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      model.scale.set(0.05, 0.05, 0.05);

      const objects = [];
      model.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshPhongMaterial({
            color: 0x666666,
            emissive: 0x000000,
          });
          objects.push(child);
        }
      });
      objectsRef.current = objects;

      scene.add(model);
    });

    // Configura i controlli
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Ammortizzazione
    controls.enablePan = false; // Disabilita il panning
    controls.enableZoom = false; // Disabilita lo zoom

    // Funzione per aggiornare l'oggetto evidenziato
    const updateHighlight = () => {
      if (!modelRef.current || objectsRef.current.length === 0) return;

      // Aggiorna la matrice della telecamera
      camera.updateMatrixWorld(true);

      // Resetta tutti i materiali al materiale base
      objectsRef.current.forEach((object) => {
        object.material.emissive.set(0x000000);
      });

      // Imposta il raycaster dal centro dello schermo
      raycaster.setFromCamera(mouse, camera);

      // Ottieni le intersezioni
      const intersects = raycaster.intersectObjects(objectsRef.current, true);

      if (intersects.length > 0) {
        const closestObject = intersects[0].object;
        closestObject.material.emissive.set(0x00ff33);
        setCurrentInfo({
          name: closestObject.name || "Vaso sconosciuto",
          dimensions: "Specifiche dimensioni",
          weight: "Peso specifico",
        });
      } else {
        setCurrentInfo(null);
      }
    };
    let lastUpdateTime = 0;
    const updateInterval = 250; // ms

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      spotLight.position.copy(camera.position);
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      spotLightTarget.position.copy(camera.position).add(cameraDirection);

      renderer.render(scene, camera);

      // Aggiorna l'highlight solo ogni 250ms
      const currentTime = performance.now();
      if (currentTime - lastUpdateTime > updateInterval) {
        updateHighlight();
        lastUpdateTime = currentTime;
      }
    };
    animate();
    // Cleanup
    return () => {
      renderer.dispose();
      scene.clear();
      objectsRef.current = [];
    };
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
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
      {currentInfo ? (
        <div className="absolute bottom-10 text-center p-4 text-blandoBlue">
          <p className="text-5xl mb-2">{currentInfo.name}</p>
          <hr className="border-blandoBlue my-2 w-3/4 mx-auto" />
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
