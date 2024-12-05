import { useState, useEffect } from "react";

const useOnScreen = (ref, rootMargin = "0px") => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(ref.current);

    // Pulizia
    return () => {
      observer.unobserve(ref.current);
    };
  }, [ref, rootMargin]);

  return isIntersecting;
};

export default useOnScreen;
