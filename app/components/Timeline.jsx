"use client";

import React, { forwardRef } from "react";

const Timeline = forwardRef(
  (
    { currentFrame, milestones, totalFrames, scrollToFrame, isVisible },
    ref
  ) => {
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
        ref={ref}
        className={`timeline-container fixed right-4 top-1/4 flex flex-col items-end transition-opacity duration-500 ${
          isVisible
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {timelineItems.map(({ frameIndex, isMilestone }) => {
          const isActive = frameIndex <= currentFrame;

          return (
            <div
              key={frameIndex}
              className="flex flex-row items-center mb-2 cursor-pointer"
              onClick={() => scrollToFrame(frameIndex)}
            >
              {isMilestone && (
                <div
                  className={`text-xs mr-2 text-right ${
                    isActive ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  {`Milestone ${milestones.indexOf(frameIndex) + 1}`}
                </div>
              )}
              <div
                className={`h-0.5 ${
                  isMilestone ? "w-12" : "w-10"
                } transition-colors ${
                  isActive ? "bg-blue-500" : "bg-gray-400"
                }`}
              />
            </div>
          );
        })}
      </div>
    );
  }
);

export default Timeline;
