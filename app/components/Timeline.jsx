"use client";
const Timeline = ({
  currentFrame,
  milestones,
  totalFrames,
  scrollToFrame,
  isVisible,
}) => {
  const step = 40; // Un trattino ogni 40 immagini
  const totalSteps = Math.ceil(totalFrames / step);

  // Combiniamo milestone e trattini intermedi
  const timelineItems = Array.from({ length: totalSteps }, (_, index) => {
    const frameIndex = index * step;
    return {
      frameIndex,
      isMilestone: milestones.includes(frameIndex),
    };
  });

  milestones.forEach((milestone) => {
    if (!timelineItems.some((item) => item.frameIndex === milestone)) {
      timelineItems.push({ frameIndex: milestone, isMilestone: true });
    }
  });

  timelineItems.sort((a, b) => a.frameIndex - b.frameIndex);

  return (
    <div
      style={{
        position: "fixed",
        right: "1vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        top: "25vh",
        height: "80vh",
        width: "auto", // Aumenta lo spazio per il testo e il trattino
        zIndex: 1000,
        opacity: isVisible ? 1 : 0, // Opacità controllata
        pointerEvents: isVisible ? "auto" : "none", // Disattiva interazioni se non visibile
        transition: "opacity 0.5s ease", // Transizione fluida
      }}
    >
      {timelineItems.map(({ frameIndex, isMilestone }) => {
        const isActive = frameIndex <= currentFrame + 1;

        return (
          <div
            key={frameIndex}
            className="flex flex-row items-center" // Cambia a flex-row per layout orizzontale
            onClick={() => scrollToFrame(frameIndex)}
            style={{
              marginBottom: "8px",
            }}
          >
            {isMilestone && (
              <div
                style={{
                  fontSize: "10px",
                  color: isActive ? "var(--blandoBlue)" : "gray",
                  marginRight: "8px", // Spaziatura tra il testo e il trattino
                  textAlign: "right",
                }}
              >
                {`Milestone ${milestones.indexOf(frameIndex) + 1}`}
              </div>
            )}
            <div
              style={{
                flexShrink: 0, // Mantiene la dimensione fissa del trattino
                width: isMilestone ? "50px" : "38px",
                height: "2px",
                backgroundColor: isActive ? "var(--blandoBlue)" : "gray",
                transition: "background-color 0.5s ease",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
export default Timeline;
