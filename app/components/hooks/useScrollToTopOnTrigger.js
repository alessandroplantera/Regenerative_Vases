import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const useScrollToTopOnTrigger = (ref, options = {}) => {
  const {
    start = "top 30%",
    duration = 1,
    endTrigger = null,
    end = "bottom top",
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start,
      endTrigger: endTrigger?.current || ref.current,
      end,
      onEnter: () => {
        gsap.to(window, {
          scrollTo: ref.current,
          duration,
          ease: "power2.inOut",
        });
      },
      // Optional: markers for debugging
      markers: false,
    });

    return () => {
      trigger.kill();
    };
  }, [ref, start, duration, endTrigger]);
};

export default useScrollToTopOnTrigger;
