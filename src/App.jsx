import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Left from "./pages/Left";
import Center from "./pages/Center";

export default function App() {
  const [index, setIndex] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);



  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 50) {
      // Swipe right
      setIndex((i) => Math.max(0, i - 1));
    } else if (deltaX < -50) {
      // Swipe left
      setIndex((i) => Math.min(1, i + 1));
    }
  };



  useEffect(() => {
    const navEntry = performance.getEntriesByType("navigation")[0];
    const should = navEntry?.type === "reload" || navEntry?.type === "navigate";
    const timeout = setTimeout(() => setShouldAnimate(should), 100);
    return () => clearTimeout(timeout);
  }, []);



  useEffect(() => {
    setHasMounted(true);
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setIndex((i) => Math.min(1, i + 1));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);


  const handleClick = (e) => {
    const x = e.clientX;
    const w = window.innerWidth;
    if (x < w * 0.2) setIndex((i) => Math.max(0, i - 1));
    else if (x > w * 0.8) setIndex((i) => Math.min(1, i + 1));
  };

  return (
    <div
      className="overflow-hidden w-screen h-screen relative"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      <motion.div
        animate={{ x: `-${index * 100}vw` }}
        initial={false} // <-- prevents first load animation
        transition={
          hasMounted
            ? { type: "tween", duration: 1.5, ease: [0.7, 0, 0.3, 1] }
            : { duration: 0 }
        }
        className="flex w-[200vw] h-screen relative z-10"
      >
        <Left shouldPlay={index === 0} />
        <Center
          shouldAnimate={shouldAnimate}
          onAnimationComplete={() => setShouldAnimate(false)}
        />
      </motion.div>
    </div>
  );
}
