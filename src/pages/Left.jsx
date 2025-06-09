import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Tilt from "react-parallax-tilt";

import Magnet from '../components/Magnet';
import FrameAnimation from "../components/FrameAnimation";
import Particles from "../components/ParticlesBackground";

export default function Left({ shouldPlay }) {
  const [playOnce, setPlayOnce] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [magnetPadding, setMagnetPadding] = useState(80);


  // Dynamically set scale and magnet strength based on screen width
  useEffect(() => {
   const handleResize = () => {
    const width = window.innerWidth;

    let baseWidth = 1440;
    let minScale = 0.7;
    let maxScale = 1;

    if (width < 480) {
      baseWidth = 360;
      minScale = 0.65;
      maxScale = 0.85;
    } else if (width >= 480 && width < 1024) {
      baseWidth = 768;
      minScale = 0.75;
      maxScale = 0.95;
    } else if (width > 1920) {
      baseWidth = 1920;
      minScale = 0.9;
      maxScale = 1.1;
    }

    const rawScale = width / baseWidth;
    const clampedScale = Math.min(Math.max(rawScale, minScale), maxScale);
    setScaleFactor(clampedScale);

    // 👇 This is what you actually wanted:
    // shrink attraction padding for smaller widths
    const newPadding = Math.max(20, Math.min(100, width / 20));
    setMagnetPadding(newPadding);
  };


    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const magnetStrength = scaleFactor * 3;

  useEffect(() => {
    if (shouldPlay && !playOnce) {
      setPlayOnce(true);
      setTimeout(() => setQrVisible(true), 3200); // Delay QR reveal until after phone appears
    }
  }, [shouldPlay, playOnce]);



  return (
    <div className="w-screen h-screen flex-shrink-0 relative overflow-hidden bg-gradient-to-r from-[#FFE8A7] to-[#FFC62D]">
      {/* 🔹 Background */}
      <Particles
        particleCount={260}
        particleSpread={25}
        speed={0.1}
        particleBaseSize={500}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* 🔹 Main 3-column layout */}
      <div className="absolute inset-0 z-10 flex flex-col md:flex-row items-center justify-center gap-6 px-4 py-8 pointer-events-none">
        {/* Column 1: QR Code */}
        
        <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.95 }}
        animate={
          qrVisible
            ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
            : { opacity: 0, y: 40, filter: "blur(10px)", scale: 0.95 }
        }
        transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        className="flex-1 flex justify-center md:items-center pointer-events-auto will-change-[transform,filter,opacity]"
      >
        <div
          className="relative"
          style={{
            width: "clamp(8rem, 18vw, 20rem)",
            height: "clamp(8rem, 18vw, 20rem)",
          }}
        >
          {/* 🔹 QR Code with tilt */}
          <a
            href="https://linktr.ee/optima_app"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            <Tilt
              tiltMaxAngleX={20}
              tiltMaxAngleY={20}
              scale={1.05}
              className="w-full h-full"
            >
              <img
                src="./assets/qr-optima.png"
                alt="QR Code"
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </Tilt>
          </a>

          {/* 🔹 Larger overlay that follows scaling perfectly */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <img
              src="./assets/qr-frame.png"
              alt="Overlay"
              className="object-contain"
              style={{
                transform: "scale(1.3)",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </div>
      </motion.div>





        {/* Column 2: Phone Frame */}
        <div className="flex-1 flex justify-center pointer-events-none">
          <FrameAnimation play={playOnce} scale={0.8} />
        </div>

        {/* Column 3: Download Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.95 }}
          animate={
            qrVisible
              ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
              : { opacity: 0, y: 40, filter: "blur(10px)", scale: 0.95 }
          }
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="flex-1 flex flex-col items-center justify-end md:justify-center pointer-events-auto"
          style={{
            gap: "clamp(0.5rem, 4vw, 6rem)",
          }}
        >
          <Magnet id="android" padding={magnetPadding} magnetStrength={magnetStrength}>
            <a
              href="https://drive.google.com/file/d/1N2h3j1x9VOR028AQONi_SdNpdx-0lgY2/view?usp=drive_link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#24324A] text-[#FFC62D] rounded-2xl shadow-xl hover:scale-105 transition-transform"
              style={{
                fontSize: "clamp(0.8rem, 1.6vw, 1.5rem)",
                padding: "clamp(0.75rem, 1.5vw, 1.2rem) clamp(2rem, 4vw, 3rem)",
              }}
            >
              Download for Android
            </a>
          </Magnet>


          <Magnet id="ios" padding={magnetPadding} magnetStrength={magnetStrength}>
            <a
              href="https://apps.apple.com/app/id000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#24324A] text-[#FFC62D] rounded-2xl shadow-xl hover:scale-105 transition-transform"
              style={{
                fontSize: "clamp(0.8rem, 1.6vw, 1.5rem)",
                padding: "clamp(0.75rem, 1.5vw, 1.2rem) clamp(2rem, 4vw, 3rem)",
              }}
            >
              Download for iOS
            </a>
          </Magnet>

        </motion.div>


      </div>
    </div>
  );
}
