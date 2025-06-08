import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

import SplitText from '../components/SplitText';
import Particles from '../components/ParticlesBackground';

export default function Center({ shouldAnimate, onAnimationComplete }) {
  const foregroundColor = '#24324A';
  const foregroundRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate || !foregroundRef.current) return;

    const el = foregroundRef.current;

    // Start with a collapsed triangle
    gsap.set(el, {
      clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%)',
      xPercent: 100,
      yPercent: 100,
    });

    const tl = gsap.timeline();

    tl.to(el, {
      xPercent: 0,
      yPercent: 0,
      duration: 0.6,
      ease: 'power4.out',
    });

    tl.to(el, {
      clipPath: 'polygon(100% 100%, 100% 0%, 0% 100%)',
      duration: 0.8,
      ease: 'power4.out',
    }, '<');

    return () => tl.kill();
  }, [shouldAnimate]);





  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[#FFC62D] z-0" />

      
      <Particles
        particleCount={260}
        particleSpread={15}
        speed={0.1}
        particleBaseSize={500}
        moveParticlesOnHover={false}
        alphaParticles={false}
        disableRotation={false}
        className="absolute inset-0 z-[5]"
      />


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
        className="absolute inset-0 z-10 triangle-mask"
        style={{
          background: `linear-gradient(to top left, ${foregroundColor}, ${foregroundColor})`,
        }}
      />
    </div>
  );
}
