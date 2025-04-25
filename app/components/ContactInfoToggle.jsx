import React, { useState, useEffect } from "react";

const ContactInfoToggle = () => {
  const pages = [
    ["Get updated or order on demand", "Discover more about the project"],
    ["regenerativevases@gmail.com", "@regenerativevases"],
  ];
  const typingSpeed = 50;
  const pauseDuration = 3000;
  const [pageIndex, setPageIndex] = useState(0);
  const [phase, setPhase] = useState("typing");
  const [charIndex, setCharIndex] = useState(0);

  const lines = pages[pageIndex];
  const maxLen = Math.max(lines[0].length, lines[1].length);
  const currentLine1 = lines[0].slice(0, charIndex);
  const currentLine2 = lines[1].slice(0, charIndex);

  useEffect(() => {
    let timeout;
    if (phase === "typing") {
      if (charIndex < maxLen) {
        timeout = setTimeout(() => setCharIndex((ci) => ci + 1), typingSpeed);
      } else {
        timeout = setTimeout(() => setPhase("deleting"), pauseDuration);
      }
    } else if (phase === "deleting") {
      if (charIndex > 0) {
        timeout = setTimeout(() => setCharIndex((ci) => ci - 1), typingSpeed);
      } else {
        setPageIndex((pi) => (pi + 1) % pages.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, phase, maxLen]);

  return (
    <div className="contact-info text-sm lg:text-base md:text-base sm:text-sm">
      {pageIndex === 0 ? (
        <>
          <p>
            <a
              href="mailto:regenerativevases@gmail.com"
              className="underline block"
            >
              {currentLine1}
            </a>
          </p>
          <p>
            <a
              href="https://www.instagram.com/studio_blando/"
              className="underline block"
              target="_blank"
            >
              {currentLine2}
            </a>
          </p>
        </>
      ) : (
        <>
          <p>
            <a
              href="mailto:regenerativevases@gmail.com"
              className="underline block"
            >
              {currentLine1}
            </a>
          </p>
          <p>
            <a
              href="https://www.instagram.com/studio_blando/"
              className="underline block"
              target="_blank"
            >
              {currentLine2}
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default ContactInfoToggle;
