"use client";

const Timeline = ({
  currentFrame,
  milestones,
  totalFrames,
  scrollToFrame,
  isVisible,
}) => {
  const step = 40; // Un trattino ogni 40 frame
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
        width: "auto",
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
        transition: "opacity 0.5s ease",
      }}
    >
      {timelineItems.map(({ frameIndex, isMilestone }) => {
        const isActive = frameIndex <= currentFrame;

        return (
          <div
            key={frameIndex}
            className="flex flex-row items-center"
            onClick={() => scrollToFrame(frameIndex)} // Usa la nuova funzione scrollToFrame
            style={{
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            {isMilestone && (
              <div
                style={{
                  fontSize: "10px",
                  color: isActive ? "var(--blandoBlue)" : "gray",
                  marginRight: "8px",
                  textAlign: "right",
                }}
              >
                {`Milestone ${milestones.indexOf(frameIndex) + 1}`}
              </div>
            )}
            <div
              style={{
                flexShrink: 0,
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
