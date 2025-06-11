import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

import Left from "./pages/Left";
import Center from "./pages/Center";
import EmailVerifyPage from "./pages/EmailVerifyPage";


import CountUpPercent from "./components/CountUpPercent";
import Particles from "./components/ParticlesBackground";
import { useMotionValue, animate } from "framer-motion";




export default function MainApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  const oobCode = urlParams.get("oobCode");

  const isEmailVerification = mode === "verifyEmail" && oobCode;

  if (isEmailVerification) {
    return <EmailVerifyPage />;
  }



  const [index, setIndex] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);



  

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const x = useMotionValue(0);
  const [wasResized, setWasResized] = useState(false);

  const prevWidth = useRef(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      if (newWidth !== prevWidth.current) {
        setWasResized(true);
        setWindowWidth(newWidth);
        prevWidth.current = newWidth;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    if (wasResized) {
      // Skip animation on resize
      x.set(-index * windowWidth);
      setWasResized(false); // reset flag
    } else {
      const controls = animate(x, -index * windowWidth, {
        duration: 1.3,
        ease: [0.7, 0, 0.3, 1],
      });
      return controls.stop;
    }
  }, [index, windowWidth]);





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
        style={{ x }}
        initial={false}
        className="flex w-[200vw] h-screen relative z-10"
      >
        <Left shouldPlay={index === 0} scrollX={x} />
        <Center shouldAnimate={shouldAnimate} scrollX={x} onAnimationComplete={() => setShouldAnimate(false)} />
      </motion.div>



      {/* 🟣 Page Indicator Dots (put this AFTER motion.div) */}
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-40">
      <div
        className={`w-3 h-3 rounded-full transition-all duration-1900 ${
          index === 0
            ? 'bg-[#24324A] scale-125' // Yellow on left
            : 'bg-white opacity-50 scale-80'
        }`}
      />
      <div
        className={`w-3 h-3 rounded-full right-1/2 transition-all duration-1900 ${
          index === 1
            ? 'bg-[#FFC62D] scale-125' // Blue on center
            : 'bg-white opacity-50 scale-80'
        }`}
      />
    </div>


    </div>
  );
}
