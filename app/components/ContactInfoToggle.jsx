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
      className="contact-info"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showExtendedInfo ? (
        // Primo stato
        <div className="extended-info">
          <p>Get updated or order on demand</p>
          <p className="underline">regenerativevases@gmail.com</p>
          <p>Discover more about the project</p>
          <p className="underline">@regenerativevases</p>
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
