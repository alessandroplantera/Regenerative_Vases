import React from "react";
import HeaderCenterTitle from "./HeaderCenterTitle";

const AboutOverlay = ({ onClose }) => (
  <div className="fixed inset-0 z-20 bg-black bg-opacity-50 flex items-center justify-center">
    {/* WRAPPER scrollabile */}
    <div className="relative bg-background w-full max-w-full h-screen max-h-screen overflow-y-auto p-[4vh] sm:mt-10 flex flex-col items-center">
      {/* Close button */}
      <div className="flex justify-between items-center w-full max-w-[90%]">
        <div></div> {/* placeholder */}
        <button
          className="ml-auto underline text-blandoBlue text-sm md:text-base"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {/* CONTENUTO CENTRALE */}
      <div className="flex flex-col items-center text-center mt-[5vh] mb-[3vh] justify-evenly">
        <HeaderCenterTitle
          className="mt-0"
          title="(re)generative vases"
          year="2024"
          fontSizeTitle="text-2xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight"
          fontSizeYear="text-xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight"
          show={true}
        />

        <div className="text-blandoBlue mt-6 max-w-[90%] md:max-w-[60%] lg:max-w-[40%] mx-auto">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-[3vh] leading-relaxed">
            An interdisciplinary collaborative project on digital materiality
            and recycled territories.
          </p>

          <div className="flex flex-col gap-[1vh] text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
            <div>
              <p>Vases by:</p>
              <a href="" className="underline">
                Sofia Petraglio
              </a>
            </div>
            <div>
              <p>Visual and Interactive Design by:</p>
              <a href="" className="underline">
                Alice Mioni
              </a>
              <br />
              <a href="" className="underline">
                Alessandro Plantera
              </a>
            </div>
            <div>
              <p>Visual Design and photography by:</p>
              <a href="" className="underline">
                Sophie Sprugasci
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CON LOGHI */}
      <div className="mt-[5vh] w-full max-w-[50%] mx-auto border-t border-blandoBlue pt-[3vh] flex flex-col items-center justify-center md:flex-row md:justify-between md:items-start gap-6 md:gap-0">
        <div className="items-center space-y-2 text-center md:items-start md:text-left">
          <p>Developed by:</p>
          <img
            src="studioblando.svg"
            alt="Studio Blando"
            className="w-20 md:w-24 mx-auto"
          />
        </div>
        <div className="items-center space-y-2 text-center md:items-start md:text-left">
          <p>In collaboration with:</p>
          <img
            src="cristallina.png"
            alt="Cristallina The Swiss Marble"
            className="w-20 md:w-24 mx-auto"
          />
        </div>
      </div>
    </div>
  </div>
);

export default AboutOverlay;
