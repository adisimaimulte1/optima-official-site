import { useEffect, useState } from "react";
import FrameAnimation from "../components/FrameAnimation";
import Particles from "../components/ParticlesBackground";

export default function Left({ shouldPlay }) {
  const [playOnce, setPlayOnce] = useState(false);

  useEffect(() => {
    if (shouldPlay && !playOnce) {
      setPlayOnce(true); // ✅ Play only once when `index === 0`
    }
  }, [shouldPlay, playOnce]);

  return (
    <div className="w-screen h-screen flex-shrink-0 relative overflow-hidden bg-gradient-to-r from-[#FFE8A7] to-[#FFC62D]">
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

      <FrameAnimation play={playOnce} scale={0.8} />
    </div>
  );
}
