import React, { useState, useEffect } from "react";

const ContactInfoToggle = () => {
  // Stato per gestire quale contenuto mostrare
  const [showExtendedInfo, setShowExtendedInfo] = useState(true);

  useEffect(() => {
    // Timer per passare automaticamente al secondo stato dopo 2 secondi
    const timer = setTimeout(() => {
      setShowExtendedInfo(false);
    }, 2000); // 2000 millisecondi = 2 secondi

    // Pulizia del timer quando il componente si smonta o lo stato cambia
    return () => clearTimeout(timer);
  }, []);

  // Funzione per gestire l'evento hover
  const handleMouseEnter = () => {
    setShowExtendedInfo(true);
  };

  const handleMouseLeave = () => {
    // Opzionale: puoi decidere se vuoi che torni al secondo stato quando il mouse lascia il componente
    setShowExtendedInfo(false);
  };

  return (
    <div
      className="contact-info lg:text-base md:text-base sm:text-base"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showExtendedInfo ? (
        // Primo stato
        <div className="extended-info">
          <p>Get updated or order on demand</p>
          <a href="mailto:regenerativevases@gmail.com" className="underline">
            regenerativevases@gmail.com
          </a>
          <p>Discover more about the project</p>
          <a
            href="https://www.instagram.com/studio_blando/"
            className="underline"
            target="blank"
          >
            @regenerativevases
          </a>
        </div>
      ) : (
        // Secondo stato
        <div className="simple-info">
          <p className="underline">regenerativevases@gmail.com</p>
          <p className="underline">@regenerativevases</p>
        </div>
      )}
    </div>
  );
};

export default ContactInfoToggle;
