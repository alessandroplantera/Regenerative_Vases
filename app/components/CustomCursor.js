"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 10, stiffness: 100 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);
  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    document.addEventListener("mousemove", handleMouseMove);
    const interactive = document.querySelectorAll("a, button");
    const onEnter = () => scale.set(1.5);
    const onLeave = () => scale.set(1);
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [mouseX, mouseY, scale]);

  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 20,
        height: 20,
        borderRadius: "50%",
        backgroundColor: "#00FF33",
        pointerEvents: "none",
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        scale: scaleSpring,
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
        transition: "transform 0.1s ease-in-out" /* Animazione morbida */,
      }}
      id="custom-cursor"
    />
  );
};

export default CustomCursor;
