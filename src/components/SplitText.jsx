import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(GSAPSplitText, ScrollTrigger);

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 1.2,
  ease = "elastic.out(1, 0.4)",
  splitType = "chars",
  from = { opacity: 0, y: 60, rotateX: 30 },
  to = { opacity: 1, y: 0, rotateX: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
  enabled = true,
}) => {
  const ref = useRef(null);
  const wrapperRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
  if (!enabled) {
    hasAnimated.current = false;
  }
}, [enabled]);


  useEffect(() => {
  const el = ref.current;
  const wrapper = wrapperRef.current;
  if (!el || !enabled || hasAnimated.current) return;

  hasAnimated.current = true;

  const run = () => {
    const absoluteLines = splitType === "lines";
    if (absoluteLines) el.style.position = "relative";

    const splitter = new GSAPSplitText(el, {
      type: splitType,
      absolute: absoluteLines,
      linesClass: "split-line",
    });

    const targets = (() => {
      switch (splitType) {
        case "lines": return splitter.lines;
        case "words": return splitter.words;
        case "words, chars": return [...splitter.words, ...splitter.chars];
        default: return splitter.chars;
      }
    })();

    targets.forEach(t => {
      t.style.willChange = "transform, opacity";
    });

    wrapper.style.opacity = "1";

    gsap.set(targets, { ...from });

    gsap.to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      force3D: true,
      onComplete: () => onLetterAnimationComplete?.(),
    });
  };

  if (document.fonts?.ready) {
    document.fonts.ready.then(run);
  } else {
    run();
  }
}, [enabled]);


  return (
    <div
      ref={wrapperRef}
      style={{ opacity: 0 }} // hidden at first
    >
      <p
        ref={ref}
        className={`split-parent ${className}`}
        style={{
          textAlign,
          overflow: "hidden",
          display: "inline-block",
          whiteSpace: "normal",
          wordWrap: "break-word",
          color: "#24324A",
          fontFamily: "Tusker",
          fontSize: "clamp(5rem, 8vw, 8rem)",
          lineHeight: 1.2,
          padding: "clamp(0.5rem, 2vw, 2rem) 0",
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {text}
      </p>
    </div>
  );

};

export default SplitText;
