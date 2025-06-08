import { useEffect, useState, useRef } from "react";

export default function FrameAnimation({
  frameCount = 120,
  fps = 60,
  play = false,
  scale = 0.5,
  delay = 900,
  startOffsetPx = 400,
  floatAmplitude = 30,
  floatFrequency = 0.4,
}) {
  const [frame, setFrame] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [floatStartTime, setFloatStartTime] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const finalYRef = useRef(null);

  // ✅ Preload all images
  useEffect(() => {
    let loaded = 0;
    for (let i = 0; i < frameCount; i++) {
      const padded = String(i).padStart(6, "0");
      const img = new Image();
      img.src = `./frames/frame_${padded}.png`;
      img.onload = () => {
        loaded++;
        console.log(`Preloaded frame ${i}`);
        if (loaded === frameCount) {
          setImagesLoaded(true);
        }
      };
    }
  }, [frameCount]);

  useEffect(() => {
    if (!play || !imagesLoaded) return;

    setFrame(0);
    setElapsedTime(0);
    setFloatStartTime(null);
    finalYRef.current = null;
    startTimeRef.current = performance.now();

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setFrame((prev) => {
          const next = prev + 1;
          if (next >= frameCount) {
            clearInterval(intervalRef.current);
            return prev;
          }
          return next;
        });
      }, 1000 / fps);
    }, delay);

    const updateTime = () => {
      const now = performance.now();
      setElapsedTime(now - startTimeRef.current);
      rafRef.current = requestAnimationFrame(updateTime);
    };
    rafRef.current = requestAnimationFrame(updateTime);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [play, imagesLoaded, fps, frameCount, delay]);

  const padded = String(frame).padStart(6, "0");
  const src = `./frames/frame_${padded}.png`;

  const progress = frame / (frameCount - 1);
  const linearY = startOffsetPx * (1 - progress);
  let translateY = linearY;

  if (frame === frameCount - 1) {
    if (finalYRef.current === null) {
      finalYRef.current = linearY;
      setFloatStartTime(performance.now());
    }

    const timeSinceFloat =
      floatStartTime !== null ? performance.now() - floatStartTime : 0;

    const floatOffset =
      Math.sin((timeSinceFloat / 1000) * 2 * Math.PI * floatFrequency) *
      floatAmplitude;

    translateY = finalYRef.current + floatOffset;
  }

  return (
    <div
      className="absolute z-10 inset-0 flex items-center justify-center pointer-events-none"
      style={{
        transform: `scale(${scale}) translateY(${translateY}px)`,
        transformOrigin: "center center",
      }}
    >
      {imagesLoaded && (
        <img
          src={src}
          alt={`Frame ${frame}`}
          className="w-full h-full object-contain max-w-[100vw] max-h-[100vh]"
          draggable={false}
        />
      )}
    </div>
  );
}
