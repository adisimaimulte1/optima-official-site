import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTransform, motion } from "framer-motion";

import SplitText from '../components/SplitText';
import Particles from '../components/ParticlesBackground'

export default function Center({ shouldAnimate, onAnimationComplete, scrollX }) {
  // Parallax transforms for OPTIMA text and description text (different ranges for layered effect)
  const halfWindowWidth = window.innerWidth / 2;
  const optimaParallaxX = useTransform(scrollX, [-window.innerWidth, 0], [0, halfWindowWidth]);
  const descriptionParallaxX = useTransform(scrollX, [-window.innerWidth, 0], [0, halfWindowWidth]);

  const foregroundColor = '#24324A';

  const foregroundRef = useRef(null);
  const mottoRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (!shouldAnimate || !foregroundRef.current || !mottoRef.current) return;

    const el = foregroundRef.current;
    const motto = mottoRef.current;

    // Start with both hidden
    gsap.set([el, motto], {
      xPercent: 100,
      yPercent: 100,
      opacity: 0,
    });

    gsap.set(el, {
      clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%)',
    });

    const tl = gsap.timeline();

    tl.to([el, motto], {
      xPercent: 0,
      yPercent: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'power4.out',
    });

    tl.to(el, {
      clipPath: 'polygon(100% 100%, 100% 0%, 0% 100%)',
      duration: 0.8,
      ease: 'power4.out',
    }, '<');

    tl.fromTo(
      descriptionRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.1,
      }
    );

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
        className="absolute inset-0 z-0 pointer-events-none"
      />

      <div
        className="absolute z-20"
        style={{
          top: 'clamp(1rem, 5vh, 4rem)',
          left: 'clamp(1rem, 5vw, 4rem)',
        }}
      >
        {/* OPTIMA text with parallax */}
        <motion.div style={{ x: optimaParallaxX }}>
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
        </motion.div>

        {/* Description text with stronger parallax */}
        <motion.div
          ref={descriptionRef}
          className="text-[#24324A] font-semibold"
          style={{
            x: descriptionParallaxX,
            fontFamily: 'Tusker',
            fontSize: 'clamp(1.2rem, 2vw, 1.8rem)',
            lineHeight: 1.4,
            maxWidth: '50vw',
            paddingLeft: 'clamp(0.5rem, 2vw, 1rem)',
            paddingTop: 'clamp(0.4rem, 1.2vh, 1rem)',
            wordBreak: 'break-word',
          }}
        >
          <p>
            A portable outreach platform for everyone: plan events, assign tasks,<br />
            Optimize execution, and track impact with the help of an AI assistant.
          </p>
        </motion.div>
      </div>

      <div
        ref={foregroundRef}
        className="absolute inset-0 z-10 triangle-mask"
        style={{
          background: `linear-gradient(to top left, ${foregroundColor}, ${foregroundColor})`,
        }}
      />

      <div
        ref={mottoRef}
        className="absolute bottom-0 right-0 z-30"
        style={{
          padding: 'clamp(1rem, 9vw, 9rem)',
        }}
      >
        <img
          src="./assets/motto.png"
          alt="Optimized Outreach. Maximum Success."
          className="aspect-square object-contain"
          style={{
            width: 'clamp(15rem, 25vw, 30rem)',
            minWidth: '15rem',
            minHeight: '15rem',
          }}
        />
      </div>
    </div>
  );
}
