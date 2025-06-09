import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function CountUpPercent({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}) {
  const ref = useRef(null);
  const [displayValue, setDisplayValue] = useState(from);

  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView && startWhen) {
      onStart?.();

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      const holdFramesAfterEnd = 1000; // milliseconds to hold after reaching 100%

      const endTimeout = setTimeout(() => {
      motionValue.set(to); // force snap to final value
      setTimeout(() => {
          onEnd?.();
      }, holdFramesAfterEnd);
      }, delay * 1000 + duration * 1000);


      return () => {
        clearTimeout(timeoutId);
        clearTimeout(endTimeout);
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      const options = {
        useGrouping: !!separator,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      };

      const formatted = Intl.NumberFormat("en-US", options).format(latest.toFixed(0));
      setDisplayValue(separator ? formatted.replace(/,/g, separator) : formatted);
    });

    return () => unsubscribe();
  }, [springValue, separator]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        textAlign: "center",
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
      {displayValue}%
    </div>
  );
}
