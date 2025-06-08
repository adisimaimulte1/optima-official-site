import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";


const SplitText = ({
  text,
  className = "",
  delay = 500,
  duration = 1,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  textAlign = "center",
  onLetterAnimationComplete,
  enabled = true,
  style = {},
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    let cleanupFn;

    const prepareTargets = (splitter, type) => {
      switch (type) {
        case "lines":
          return splitter.lines;
        case "words":
          return splitter.words;
        case "words, chars":
          return [...splitter.words, ...splitter.chars];
        default:
          return splitter.chars;
      }
    };

    const animateText = () => {
      const absoluteLines = splitType === "lines";
      if (absoluteLines) el.style.position = "relative";

      const splitter = new GSAPSplitText(el, {
        type: splitType,
        absolute: absoluteLines,
        linesClass: "split-line",
      });

      const targets = prepareTargets(splitter, splitType);

      targets.forEach((t) => {
        t.style.willChange = "transform, opacity";
      });

      const tl = gsap.timeline({
        onComplete: () => {
          onLetterAnimationComplete?.();
        },
      });

      tl.set(targets, { ...from, immediateRender: false, force3D: true });
      tl.to(targets, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true,
      });

      cleanupFn = () => {
        tl.kill();
        gsap.killTweensOf(targets);
        splitter.revert();
      };
    };

    document.fonts.ready.then(animateText);

    return () => {
      cleanupFn?.();
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    enabled,
    onLetterAnimationComplete,
  ]);

  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        ...style,
        color: '#24324A',
        fontFamily: "Tusker",
        fontSize: 'clamp(5rem, 8vw, 8rem)',
        textAlign,
        overflow: "visible",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
    >
      {text}
    </p>
  );
};

export default SplitText;
