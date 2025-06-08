import SplitText from '../components/SplitText';

export default function Center({ shouldAnimate, onAnimationComplete }) {
  const foregroundColor = '#24324A';

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#FFC62D] z-0" />

      {/* Foreground */}
      <div
        className="absolute inset-0 z-10"
        style={{
          clipPath: 'polygon(0 100%, 100% 0, 100% 100%, 0% 100%)',
          background: `linear-gradient(to top left, ${foregroundColor}, ${foregroundColor})`,
        }}
      />

      {/* OPTIMA Text */}
      <div
        className="absolute z-20"
        style={{
          top: 'clamp(1rem, 5vh, 4rem)', // ⬅ dynamic vertical position
          left: 'clamp(1rem, 5vw, 4rem)', // ⬅ dynamic horizontal position
        }}
      >
        <SplitText
          text="OPTIMA™"
          className="text-7xl font-tusker tracking-tight"
          style={{
            color: foregroundColor,
            lineHeight: 1.2,
            padding: 'clamp(0.5rem, 2vw, 2rem) 0',
            overflow: 'visible',
            display: 'inline-block',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
          }}
          enabled={shouldAnimate}
          onLetterAnimationComplete={onAnimationComplete}
          delay={shouldAnimate ? 100 : 0}
          animationFrom={shouldAnimate ? { opacity: 0, transform: 'translate3d(0,40px,0)' } : {}}
          animationTo={shouldAnimate ? { opacity: 1, transform: 'translate3d(0,0,0)' } : {}}
          easing="easeOutCubic"
          threshold={0.1}
          rootMargin="-100px"
        />
      </div>
    </div>
  );
}

