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
        right: "0",
        top: "10%",
        height: "80vh",
        width: "60px",
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
            className="flex flex-col items-center"
            onClick={() => scrollToFrame(frameIndex)}
            style={{
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                width: isMilestone ? "16px" : "8px",
                height: "2px",
                backgroundColor: isActive ? "black" : "gray",
                transition: "background-color 0.5s ease",
              }}
            />
            {isMilestone && (
              <div
                style={{
                  fontSize: "10px",
                  color: isActive ? "black" : "gray",
                  marginTop: "4px",
                }}
              >
                {`Milestone ${milestones.indexOf(frameIndex) + 1}`}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default Timeline;
