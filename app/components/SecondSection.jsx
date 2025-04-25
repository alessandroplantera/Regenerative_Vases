"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SecondSection = ({ secondSectionRef, scrollToTop }) => {
  // Riferimenti per il canvas, il modello, gli oggetti e l'ID dell'animation frame
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const objectsRef = useRef([]);
  const animationFrameId = useRef(null);

  // Stato per le informazioni correnti (mostrate in overlay)
  const [currentInfo, setCurrentInfo] = useState(null);
  // (highlightedObject e originalEmissive sono ora gestiti in userData sui Mesh)
  const highlightedObject = useRef(null);

  // Dati dei vasi e mappa per il lookup (le chiavi qui devono corrispondere ai nomi forzati dei gruppi)
  const vaseData = [
    {
      id: "vase1",
      name: "A.0528.20",
      dimensions: ["Mouth ø 18cm", "Mouth h 15cm", "Vase h 20cm"],
      weight: "13kg",
      position: "N45.88060418116533 E8.95080618178338",
    },
    {
      id: "vase2",
      name: "P.1246.25",
      dimensions: ["Mouth ø 18cm", "Mouth h 15cm", "Vase h 20cm"],
      weight: "20kg",
      position: "N46.88060418116533 E8.95080618178338",
    },
    {
      id: "vase3",
      name: "C.0863.32",
      dimensions: ["Mouth ø 18cm", "Mouth h 15cm", "Vase h 20cm"],
      weight: "30kg",
      position: "N47.88060418116533 E8.95080618178338",
    },
  ];
  const vaseDataMap = new Map();
  vaseData.forEach((vase) => {
    vaseDataMap.set(vase.id, vase);
  });

  // Parametri per il materiale e le luci
  const materialParams = {
    emissiveIntensity: 2,
  };
  const lightParams = {
    spotLightIntensity: 0.5,
    spotLightColor: 0xffffff,
    spotLightDistance: 180,
    ambientLightIntensity: 4,
  };

  useEffect(() => {
    let scene, renderer, camera, controls, spotLightHelper;
    let zoomDisabled = false;
    const isMobile = window.innerWidth < 768;

    // --- Inizializzazione della scena, camera e renderer ---
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
    renderer.toneMappingExposure = 1;

    // --- Gestione del resize ---
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // --- Configurazione dei controlli OrbitControls ---
    // Import dinamico per evitare di appesantire il bundle iniziale
    (async () => {
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1;
      controls.dampingFactor = 0.1;
      controls.maxDistance = 10;
      controls.minDistance = isMobile ? 2 : 5;

      // Imposta i limiti di rotazione orizzontale
      controls.maxPolarAngle = Math.PI / 2; // Limita la rotazione a 90 gradi (non permette di vedere il sotto del modello)
      controls.minPolarAngle = 0; // Limita la rotazione verso l'alto

      // --- Gestione dello zoom via wheel ---
      const onWheel = (event) => {
        if (zoomDisabled) {
          const distance = camera.position.distanceTo(controls.target);
          if (event.deltaY > 0 && distance <= controls.minDistance + 0.1) {
            controls.enableZoom = true;
            zoomDisabled = false;
            // Slightly move camera outward
            const dir = new THREE.Vector3()
              .subVectors(camera.position, controls.target)
              .normalize();
            camera.position.addScaledVector(dir, 0.5);
            console.log(
              "Zoom riabilitato per scroll outwards, camera spostata:",
              camera.position
            );
          } else if (
            event.deltaY < 0 &&
            distance >= controls.maxDistance - 0.1
          ) {
            controls.enableZoom = true;
            zoomDisabled = false;
            // Slightly move camera inward
            const dirIn = new THREE.Vector3()
              .subVectors(camera.position, controls.target)
              .normalize();
            camera.position.addScaledVector(dirIn, -0.5);
            console.log(
              "Zoom riabilitato per scroll inwards, camera spostata:",
              camera.position
            );
          }
        }
        checkZoomAndDisable();
        if (zoomDisabled) return;
        event.preventDefault();
      };
      renderer.domElement.addEventListener("wheel", onWheel, {
        passive: false,
      });

      // Funzione per controllare la distanza della camera
      const checkZoomAndDisable = () => {
        const distance = camera.position.distanceTo(controls.target);
        if (
          (distance <= controls.minDistance + 0.1 ||
            distance >= controls.maxDistance - 0.1) &&
          !zoomDisabled
        ) {
          controls.enableZoom = false;
          zoomDisabled = true;
          console.log("Zoom disabilitato, attivo scroll, distance:", distance);
        } else if (
          distance > controls.minDistance + 0.1 &&
          distance < controls.maxDistance - 0.1 &&
          zoomDisabled
        ) {
          controls.enableZoom = true;
          zoomDisabled = false;
          console.log("Zoom riabilitato per distanza");
        }
      };

      // --- Caricamento del modello glTF ---
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        "/texturedVases.glb",
        (gltf) => {
          const model = gltf.scene;
          modelRef.current = model;
          // Imposta la scala in base al dispositivo
          if (!isMobile) {
            model.scale.set(0.05, 0.05, 0.05);
          } else {
            model.scale.set(0.03, 0.03, 0.03);
          }
          // Forza che ogni vaso sia un figlio diretto con nome standard "vase1", "vase2", ...
          const vaseGroups = [];
          model.children.forEach((child, index) => {
            child.name = `vase${index + 1}`;
            vaseGroups.push(child);
            child.traverse((mesh) => {
              if (mesh.isMesh && mesh.material) {
                // Salva il valore emissive originale (se il materiale lo supporta)
                if (mesh.material.emissive && !mesh.userData.originalEmissive) {
                  mesh.userData.originalEmissive =
                    mesh.material.emissive.clone();
                }
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                mesh.geometry.computeVertexNormals();
              }
            });
          });
          objectsRef.current = vaseGroups;
          scene.add(model);
        },
        (progress) => {
          console.log(
            "Loading progress:",
            (progress.loaded / progress.total) * 100 + "%"
          );
        },
        (error) => {
          console.error("Errore nel caricamento del modello:", error);
        }
      );

      // --- Impostazione delle luci ---
      const ambientLight = new THREE.AmbientLight(
        0xffffff,
        lightParams.ambientLightIntensity
      );
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight(lightParams.spotLightColor);
      spotLight.position.set(0, 0, 0);
      spotLight.castShadow = true;
      spotLight.angle = THREE.MathUtils.degToRad(180);
      spotLight.distance = lightParams.spotLightDistance;
      spotLight.intensity = lightParams.spotLightIntensity;
      spotLight.target.position.set(0, 0, 0);
      scene.add(spotLight.target);
      scene.add(spotLight);
      scene.add(camera);
      camera.add(spotLight);

      // (Opzionale) Helper per la luce spot
      // spotLightHelper = new THREE.SpotLightHelper(spotLight);
      // scene.add(spotLightHelper);
    })();

    // --- Raycaster e aggiornamento dell'intersezione ---
    const raycaster = new THREE.Raycaster();
    const mouseCenter = new THREE.Vector2(0, 0);

    const updateCurrentObject = () => {
      if (!modelRef.current || objectsRef.current.length === 0) return;
      camera.updateMatrixWorld(true);
      raycaster.setFromCamera(mouseCenter, camera);
      const intersects = raycaster.intersectObjects(objectsRef.current, true);

      // Raggruppa le intersezioni risalendo nella gerarchia fino a trovare il gruppo (vase)
      const uniqueGroups = [];
      const seen = new Set();
      for (const inter of intersects) {
        let obj = inter.object;
        while (obj && !objectsRef.current.includes(obj)) {
          obj = obj.parent;
        }
        if (obj && !seen.has(obj.uuid)) {
          uniqueGroups.push(obj);
          seen.add(obj.uuid);
        }
      }
      const highlightedGroup = uniqueGroups.length > 0 ? uniqueGroups[0] : null;

      // Per ogni gruppo, regola il colore dei materiali per "oscurare" quelli non evidenziati
      objectsRef.current.forEach((group) => {
        group.traverse((child) => {
          if (child.isMesh && child.material) {
            if (!child.userData.originalColor) {
              child.userData.originalColor = child.material.color.clone();
            }
            if (group === highlightedGroup) {
              child.material.color.copy(child.userData.originalColor);
            } else {
              child.material.color
                .copy(child.userData.originalColor)
                .multiplyScalar(0.3);
            }
          }
        });
      });

      // Aggiorna le informazioni basate sul gruppo evidenziato
      if (highlightedGroup) {
        const lookupResult = vaseDataMap.get(highlightedGroup.name);
        if (lookupResult) {
          setCurrentInfo({
            name: lookupResult.name,
            dimensions: lookupResult.dimensions,
            weight: lookupResult.weight,
            position: lookupResult.position,
          });
        } else {
          setCurrentInfo({
            name: "ENoENT",
            dimensions: [],
            weight: "",
            position: "",
          });
        }
      } else {
        setCurrentInfo(null);
      }
    };

    // --- Loop di animazione ---
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      if (controls) controls.update();
      renderer.render(scene, camera);
      updateCurrentObject();
      if (spotLightHelper) spotLightHelper.update();
    };
    animate();

    // --- Cleanup: rimozione degli event listener e cancellazione dell'animation frame ---
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(animationFrameId.current);
      if (controls) controls.dispose();
      renderer.dispose();
      scene.clear();
      objectsRef.current = [];
    };
  }, []);

  return (
    <section className="relative w-screen h-screen bg-background overflow-hidden flex justify-center items-center z-0">
      <div className="absolute inset-0 w-full h-full z-20">
        <canvas
          ref={canvasRef}
          className="inset-0 w-full h-full md:-translate-y-[5%] sm:-translate-y-[18%] -translate-y-[18%]"
        />
      </div>
      {currentInfo ? (
        <>
          {/* Overlay del nome e delle informazioni */}
          <div
            className="
              absolute left-1/2 
              lg:top-1/3 md:top-1/3 sm:top-1/3 top-1/4
              transform -translate-x-1/2 
              lg:-translate-y-1/2 md:-translate-y-1/2 sm:-translate-y-1/2 -translate-y-1/4
              text-7xl lg:text-[20rem] md:text-[20rem] sm:text-[8rem] 
              leading-[3.5rem] md:leading-[4rem] lg:leading-[4rem]
              text-blandoBlue
              z-0 gap-0"
            style={{ fontFamily: "var(--font-ppregular)" }}
          >
            <p>{currentInfo.name}</p>
          </div>
          <div className="absolute bottom-10 text-center p-4 text-blandoBlue sm:w-4/6 md:w-3/6 lg:w-2/6 z-20">
            <p className="lg:text-3xl md:text-3xl sm:text-3xl text-3xl mb-2">
              {currentInfo.name}
            </p>
            <hr className="border-blandoBlue my-2 w-full mx-auto" />
            <div className="flex justify-between text-lg w-full mt-2">
              <div className="pr-20">
                <p className="font-semibold text-left lg:text-base md:text-base sm:text-base text-base leading-4">
                  dimensions:
                </p>
                {Array.isArray(currentInfo.dimensions) ? (
                  currentInfo.dimensions.map((dim, index) => (
                    <p
                      key={index}
                      className="text-left lg:text-base md:text-base sm:text-base text-base leading-4"
                    >
                      {dim}
                    </p>
                  ))
                ) : (
                  <p className="text-left lg:text-base md:text-base sm:text-base text-base leading-4">
                    {currentInfo.dimensions || "N/A"}
                  </p>
                )}
              </div>
              <div>
                <p className="font-semibold text-left lg:text-base md:text-base sm:text-base text-base leading-4">
                  weight:
                </p>
                <p className="text-left lg:text-base md:text-base sm:text-base text-base leading-4">
                  {currentInfo.weight}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center w-full text-left lg:text-base md:text-base sm:text-base text-base leading-4 mt-4 text-nowrap">
              <p className="font-semibold">waste coordinates:</p>
              <p>{currentInfo.position}</p>
            </div>
            <hr className="border-blandoBlue my-2 w-full mx-auto" />
            <div
              className="mt-5 flex items-center place-content-center mx-auto justify-center h-12 sm:w-4/6 md:w-4/6 lg:w-4/6 w-5/6"
              style={{
                borderRadius: "100px",
                border: "1px solid var(--blandoBlue)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--blandoBlue)";
                e.currentTarget.style.color = "var(--background)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--blandoBlue)";
              }}
            >
              <p className="text-center mb-1 text-2xl md:text-2xl sm:text-2xl text-nowrap">
                Download Catalogue
              </p>
            </div>
          </div>
          <div>
            <a
              href="#top"
              onClick={scrollToTop}
              className="absolute z-50 bottom-5 translate-x-[-50%] text-center mb-1 text-md md:text-md sm:text-md text-blandoBlue underline-offset-4 underline"
            >
              {" "}
              Go to Top
            </a>
          </div>
        </>
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
