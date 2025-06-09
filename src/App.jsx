import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import Left from "./pages/Left";
import Center from "./pages/Center";

import CountUpPercent from "./components/CountUpPercent";
import Particles from "./components/ParticlesBackground";

export default function App() {
  const [index, setIndex] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
  const timeout = setTimeout(() => {
    setIsLoading(false); // Hide loader after 2 seconds
  }, 2000); // Adjust duration as needed
  return () => clearTimeout(timeout);
}, []);



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
    if (!isLoading) {
      setShouldAnimate(true);
    }
  }, [isLoading]);




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

      
      {isLoading && (
        <div className="absolute inset-0 bg-[#FFC62D] z-50 overflow-hidden">
          {/* Particles with z-0 */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Particles
              particleCount={260}
              particleSpread={15}
              speed={0.1}
              particleBaseSize={500}
              moveParticlesOnHover={false}
              alphaParticles={false}
              disableRotation={false}
              className="w-full h-full"
            />
          </div>

          {/* Counter with z-10 */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <CountUpPercent from={0} to={100} duration={1} />
          </div>
        </div>
      )}



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
