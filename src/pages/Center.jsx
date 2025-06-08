import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import SplitText from '../components/SplitText';
import { motion } from "framer-motion";


export default function Center({ shouldAnimate, onAnimationComplete }) {
  const foregroundColor = '#24324A';
  const foregroundRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate) return;

    const tl = gsap.timeline({
      onComplete: () => onAnimationComplete?.(),
    });

    tl.fromTo(
      foregroundRef.current,
      { xPercent: 100, yPercent: 100 },
      {
        xPercent: 0,
        yPercent: 0,
        duration: 1.2,
        ease: 'power3.out',
      }
    );

    // Let SplitText handle its own timing, or optionally sync more tightly here

    return () => tl.kill();
  }, [shouldAnimate]);

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FFC62D] z-0" />

      <div
        className="absolute z-20"
        style={{
          top: 'clamp(1rem, 5vh, 4rem)',
          left: 'clamp(1rem, 5vw, 4rem)',
        }}
      >
        <SplitText
          text="OPTIMA™"
          className="text-7xl font-tusker tracking-tight"
          delay={100}
          duration={0.8}
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          onLetterAnimationComplete={onAnimationComplete}
          enabled={shouldAnimate}
        />
      </div>

      <div
        ref={foregroundRef}
        className="absolute inset-0 z-10"
        style={{
          clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)',
          background: `linear-gradient(to top left, ${foregroundColor}, ${foregroundColor})`,
        }}
      />
    </div>
  );
}
