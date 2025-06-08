import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Left from "./pages/Left";
import Center from "./pages/Center";
import Right from "./pages/Right";

export default function App() {
  const [index, setIndex] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const navEntry = performance.getEntriesByType('navigation')[0];
    if (navEntry?.type === 'reload') {
      setShouldAnimate(true);
    }
  }, []);

  useEffect(() => {
    const updateBodyBackground = () => {
      if (index === 0 || index === 1) {
        document.body.style.backgroundColor = "#FFC62D"; // yellow
      } else if (index === 2) {
        document.body.style.backgroundColor = "#24324A"; // dark for Right
      }
    };

    updateBodyBackground();
  }, [index]);

  useEffect(() => {
    setHasMounted(true);
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIndex((i) => Math.min(2, i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);


  const handleClick = (e) => {
    const x = e.clientX;
    const w = window.innerWidth;
    if (x < w * 0.2) setIndex((i) => Math.max(0, i - 1));
    else if (x > w * 0.8) setIndex((i) => Math.min(2, i + 1));
  };

  return (
    <div className="overflow-hidden w-screen h-screen relative" onClick={handleClick}>
      <motion.div
        animate={{ x: `-${index * 100}vw` }}
        initial={false} // <-- prevents first load animation
        transition={
          hasMounted
            ? { type: "tween", duration: 1.5, ease: [0.7, 0, 0.3, 1] }
            : { duration: 0 }
        }
        className="flex w-[300vw] h-screen"
      >
        <Left />
        <Center
          shouldAnimate={shouldAnimate}
          onAnimationComplete={() => setShouldAnimate(false)}
        />
        <Right />
      </motion.div>
    </div>
  );
}
