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

  const materialParams = {
    emissiveIntensity: 5,
  };
  const lightParams = {
    spotLightIntensity: 80,
    spotLightColor: 0xffffff,
    spotLightDistance: 40,
    ambientLightIntensity: 0.5,
  };

  useEffect(() => {
    let OBJLoader, OrbitControls, SpotLightHelper;
    const init = async () => {
      // Importazioni dinamiche
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );
      const { OBJLoader } = await import(
        "three/examples/jsm/loaders/OBJLoader.js"
      );
      // Scena
      const scene = new THREE.Scene();
      const isMobile = window.innerWidth < 768;
      const camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 2, 8);

      // Renderer
      const renderer = new THREE.WebGLRenderer({
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
      renderer.toneMappingExposure = 1.5; // Aumenta l'esposizione globale
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
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = false;

      // Inizializza Raycaster e mouse
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2(0, 0); // Centro dello schermo

      const updateCurrentObject = () => {
        if (!modelRef.current || objectsRef.current.length === 0) return;

        // Aggiorna la matrice della telecamera
        camera.updateMatrixWorld(true);

        // Imposta il raycaster dal centro dello schermo
        raycaster.setFromCamera(mouse, camera);

        // Ottieni le intersezioni
        const intersects = raycaster.intersectObjects(objectsRef.current, true);

        if (intersects.length > 0) {
          const closestObject = intersects[0].object;
          // Recupera le informazioni dal dataset usando l'ID o il nome
          const vaseInfo = vaseDataMap.get(closestObject.name);

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
              dimensions: "",
              weight: "",
              description: "",
            });
          }
          // Se l'oggetto attualmente evidenziato è diverso dal nuovo
          if (highlightedObject.current !== closestObject) {
            // Ripristina l'oggetto precedentemente evidenziato
            if (highlightedObject.current) {
              const original = originalEmissive.current.get(
                highlightedObject.current
              );
              if (original) {
                highlightedObject.current.material.emissive.copy(
                  original.color
                );
                highlightedObject.current.material.emissiveIntensity =
                  original.intensity;
                highlightedObject.current.material.needsUpdate = true;
              }
            }

            // Memorizza le proprietà originali se non già fatto
            if (!originalEmissive.current.has(closestObject)) {
              originalEmissive.current.set(closestObject, {
                color: closestObject.material.emissive.clone(),
                intensity: closestObject.material.emissiveIntensity,
              });
            }

            // Applica l'effetto di emissione al nuovo oggetto
            closestObject.material.emissive.set(0x404040); // Regola il colore secondo necessità
            closestObject.material.emissiveIntensity =
              materialParams.emissiveIntensity; // Regola l'intensità secondo necessità
            closestObject.material.needsUpdate = true;

            // Aggiorna la referenza dell'oggetto evidenziato
            highlightedObject.current = closestObject;
          }
        } else {
          // Se nessun oggetto è intercettato, ripristina l'oggetto evidenziato
          if (highlightedObject.current) {
            const original = originalEmissive.current.get(
              highlightedObject.current
            );
            if (original) {
              highlightedObject.current.material.emissive.copy(original.color);
              highlightedObject.current.material.emissiveIntensity =
                original.intensity;
              highlightedObject.current.material.needsUpdate = true;
            }
            highlightedObject.current = null;
          }

          setCurrentInfo(null);
        }
      };

      // Carica la matcap texture
      const textureLoader = new THREE.TextureLoader();
      const matcapLikeTexture = textureLoader.load("matcap.png"); // Assicurati che il percorso sia corretto
      // matcapLikeTexture.encoding = THREE.sRGBEncoding;

      // Luce ambientale
      const ambientLight = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambientLight);

      // Luce spot
      const spotLight = new THREE.SpotLight(lightParams.spotLightColor);
      spotLight.position.set(0, 0, 0); // Abbassata a Y = 3
      spotLight.castShadow = true;
      spotLight.angle = THREE.MathUtils.degToRad(20);
      spotLight.distance = lightParams.spotLightDistance; // La luce ha effetto fino a 100 unità di distanza
      spotLight.intensity = lightParams.spotLightIntensity; // Intensità della luce

      // Imposta il target della luce spot
      spotLight.target.position.set(0, 0, 0); // Punto fisso nella scena
      scene.add(spotLight.target);

      // Aggiungi la luce alla scena
      scene.add(spotLight);

      // Aggiungi l'helper della luce spot
      const spotLightHelper = new THREE.SpotLightHelper(spotLight);
      // scene.add(spotLightHelper);

      // Aggiungi la luce alla scena
      scene.add(spotLight);
      scene.add(camera);
      camera.add(spotLight);

      // Carica il modello
      const objLoader = new OBJLoader();
      objLoader.load(
        "vases.obj",
        (obj) => {
          modelRef.current = obj;
          if (!isMobile) {
            obj.scale.set(0.05, 0.05, 0.05);
            console.log(isMobile);
          } else {
            obj.scale.set(0.03, 0.03, 0.03);
            console.log(isMobile);
          }
          // obj.position.set(0, -0.5, 0);

          const objects = [];
          let vaseCounter = 1;

          obj.traverse((child) => {
            if (child.isMesh) {
              // Applica MeshStandardMaterial con la matcap texture
              child.name = `vase${vaseCounter++}`;

              child.material = new THREE.MeshStandardMaterial({
                map: matcapLikeTexture, // Usa 'map' per la texture diffusa
                color: new THREE.Color(0xffffff), // Bianco di default
                emissive: new THREE.Color(0x000000), // Aggiungi un po' di emissione
                emissiveIntensity: materialParams.emissiveIntensity, // Regola l'intensità
                roughness: 0.8,
                metalness: 0.5,
              });

              // Abilita le ombre sugli oggetti
              child.castShadow = true;
              child.receiveShadow = true;

              // Se gli oggetti hanno fori, renderizza entrambi i lati
              child.geometry.computeVertexNormals();

              objects.push(child);
            }
          });
          objectsRef.current = objects;

          scene.add(obj);
        },
        undefined,
        (error) => {
          console.error("Errore nel caricamento del modello:", error);
        }
      );

      // Animazione
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
        updateCurrentObject();

        // Aggiorna l'helper della luce spot
        spotLightHelper.update();
      };

      // Inizia l'animazione
      animate();
      // Cleanup
    };
    init();
    return () => {
      renderer.dispose();
      scene.clear();
      objectsRef.current = [];
      // gui.destroy();
    };
  }, []);

  // HTML Injection
  return (
    <section className="relative w-screen h-screen bg-background overflow-hidden flex justify-center items-center z-0">
      <div className="absolute inset-0 w-full h-full z-20">
        <canvas ref={canvasRef} className="inset-0 w-full h-full" />
      </div>
      {currentInfo ? (
        <>
          {/* Testo posizionato dietro il canvas */}
          <p
            className="
              absolute left-1/2
              top-1/4 md:top-1/2
              transform -translate-x-1/2
              md:-translate-y-3/4
              text-[7rem] md:text-[25rem]
              text-blandoBlue
              z-0
            "
            style={{ fontFamily: "var(--font-ppregular)" }}
          >
            {currentInfo.name}
          </p>

          <div className="absolute bottom-10 text-center p-4 text-blandoBlue sm:w-4/6 md:w-3/6 lg:w-2/6 z-20">
            <p className="text-5xl mb-2">{currentInfo.name}</p>
            <hr className="border-blandoBlue my-2 w-full mx-auto" />
            <div className="flex justify-between text-lg w-full mt-4">
              <div className="pr-20">
                <p className="font-semibold text-left">Dimensions</p>
                {currentInfo.dimensions.map((dim, index) => (
                  <p key={index} className="text-left">
                    {dim}
                  </p>
                ))}
              </div>
              <div>
                <p className="font-semibold text-left">Weight</p>
                <p className="text-left">{currentInfo.weight}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center text-lg w-full mt-4 text-center">
              <p className="font-semibold">Quarry Position</p>
              <p className="">{currentInfo.position}</p>
            </div>
            <hr className="border-blandoBlue my-2 w-full mx-auto" />
            <div
              className="mt-5 flex items-center place-content-center mx-auto justify-center h-12 sm:w-4/6 md:w-3/6 lg:w-3/6"
              style={{
                borderRadius: "100px",
                border: "1px solid var(--blandoBlue)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--blandoBlue)";
                e.currentTarget.style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--blandoBlue)";
              }}
            >
              <p
                className="text-center mb-1"
                style={{ fontSize: "1.5rem", wordWrap: "none" }}
              >
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
