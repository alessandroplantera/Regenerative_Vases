"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const SecondSection = ({ secondSectionRef, scrollToTop }) => {
  const canvasRef = useRef(null);
  const modelRef = useRef(null);
  const objectsRef = useRef([]);
  const [currentInfo, setCurrentInfo] = useState(null);
  const highlightedObject = useRef(null);
  const originalEmissive = useRef(new Map());
  const vaseData = [
    {
      id: "01_mini",
      name: "A.0528.20",
      dimensions: ["Mouth ø 18cm", "Mouth h 15cm", "Vase h 20cm"],
      weight: "13kg",
      position: "N45.88060418116533 E8.95080618178338",
    },
    {
      id: "02_small",
      name: "P.1246.25",
      dimensions: ["Mouth ø 18cm", "Mouth h 15cm", "Vase h 20cm"],
      weight: "20kg",
      position: "N46.88060418116533 E8.95080618178338",
    },
    {
      id: "03_medium",
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
    const init = async () => {
      // Importazioni dinamiche
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );

      // Scena
      scene = new THREE.Scene();
      const isMobile = window.innerWidth < 768;
      camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 8);

      // Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.physicallyCorrectLights = true;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMappingExposure = 1; // Aumenta l'esposizione globale
      // renderer.outputEncoding = THREE.sRGBEncoding;

      // Gestione del ridimensionamento della finestra
      window.addEventListener("resize", () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      });

      // Configura i controlli
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = true;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 2;
      controls.dampingFactor = 0.1;
      controls.maxZoom = 0.5;
      controls.maxDistance = 10;
      controls.minDistance = 5;

      // Inizializza Raycaster e mouse
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(0, 0); // Centro dello schermo

      // Helper per evidenziare e ripristinare il materiale su un gruppo (vaso)
      const highlightVaseGroup = (group) => {
        group.traverse((child) => {
          if (
            child.isMesh &&
            child.material &&
            child.material.emissive // Assicurati che il materiale supporti l'emissive
          ) {
            // Salva il valore emissive originale se non già salvato
            if (!child.userData.originalEmissive) {
              child.userData.originalEmissive = child.material.emissive.clone();
            }
            child.material.emissive.set(0x404040);
            child.material.emissiveIntensity = materialParams.emissiveIntensity;
            child.material.needsUpdate = true;
          }
        });
      };

      const restoreVaseGroup = (group) => {
        group.traverse((child) => {
          if (
            child.isMesh &&
            child.material &&
            child.material.emissive &&
            child.userData.originalEmissive
          ) {
            child.material.emissive.copy(child.userData.originalEmissive);
            child.material.needsUpdate = true;
          }
        });
      };

      // Funzione che esegue il raycasting e gestisce l'evidenziazione
      const updateCurrentObject = () => {
        if (!modelRef.current || objectsRef.current.length === 0) return;

        // Assicura che la camera abbia aggiornato la sua matrice
        camera.updateMatrixWorld(true);

        // Usa il centro della viewport (0,0) per il raycaster
        const mouseCenter = new THREE.Vector2(0, 0);
        raycaster.setFromCamera(mouseCenter, camera);

        // Ottieni le intersezioni (controlla in profondità)
        const intersects = raycaster.intersectObjects(objectsRef.current, true);

        // Raggruppa le intersezioni: risali nella gerarchia per ottenere il gruppo (vase)
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

        // Il gruppo in primo piano (quello intersecato per primo) è quello da non oscurare
        const highlightedGroup =
          uniqueGroups.length > 0 ? uniqueGroups[0] : null;

        // Per ogni gruppo (vaso) in objectsRef, regola il colore dei materiali
        objectsRef.current.forEach((group) => {
          group.traverse((child) => {
            if (child.isMesh && child.material) {
              // Salva il colore originale (usato per le texture) se non già salvato
              if (!child.userData.originalColor) {
                child.userData.originalColor = child.material.color.clone();
              }
              if (group === highlightedGroup) {
                // Se il gruppo è quello intersecato, ripristina il colore originale
                child.material.color.copy(child.userData.originalColor);
              } else {
                // Altrimenti, riduci la luminosità – per esempio, moltiplicando per 0.3
                child.material.color
                  .copy(child.userData.originalColor)
                  .multiplyScalar(0.3);
              }
            }
          });
        });

        // Aggiorna le informazioni se c'è un gruppo evidenziato
        if (highlightedGroup) {
          const lookupResult = vaseDataMap.get(highlightedGroup.name);
          console.log("Highlighted group name:", highlightedGroup.name);
          console.log("Lookup result:", lookupResult);

          const vaseInfo = vaseDataMap.get(highlightedGroup.name);
          if (vaseInfo) {
            setCurrentInfo({
              name: vaseInfo.name,
              dimensions: vaseInfo.dimensions,
              weight: vaseInfo.weight,
              position: vaseInfo.position,
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

      // Luce ambientale e spot
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
      spotLightHelper = new THREE.SpotLightHelper(spotLight);
      // scene.add(spotLightHelper);

      // Caricamento del modello glTF
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        "/texturedVases.glb",
        (gltf) => {
          const model = gltf.scene;
          modelRef.current = model;
          if (!isMobile) {
            model.scale.set(0.05, 0.05, 0.05);
          } else {
            model.scale.set(0.03, 0.03, 0.03);
          }

          // Si assume che ogni vaso sia un figlio diretto di model
          const vaseGroups = [];
          model.children.forEach((child, index) => {
            if (child.isMesh || child.isGroup) {
              // Assegna un nome se non presente (es. "vase1", "vase2", …)
              if (!child.name || child.name === "") {
                child.name = `vase${index + 1}`;
              }
              vaseGroups.push(child);
              // Per ogni mesh interna al gruppo, abilita le ombre e salva il valore emissive originale
              child.traverse((mesh) => {
                if (mesh.isMesh && mesh.material) {
                  if (mesh.material.emissive) {
                    mesh.userData.originalEmissive =
                      mesh.userData.originalEmissive ||
                      mesh.material.emissive.clone();
                  }
                  mesh.castShadow = true;
                  mesh.receiveShadow = true;
                  mesh.geometry.computeVertexNormals();
                }
              });
            }
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

      // Loop di animazione
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        updateCurrentObject();
        if (spotLightHelper) spotLightHelper.update();
      };
      animate();
    };
    init();
    return () => {
      if (renderer) renderer.dispose();
      if (scene) scene.clear();
      objectsRef.current = [];
    };
  }, []);

  // HTML Injection
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
          {/* Testo posizionato dietro il canvas */}
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
          >
            <p className="" style={{ fontFamily: "var(--font-ppregular)" }}>
              {currentInfo.name}
            </p>
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
              <p className="">{currentInfo.position}</p>
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
