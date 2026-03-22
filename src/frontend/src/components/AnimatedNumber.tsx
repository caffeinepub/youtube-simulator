import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  style?: React.CSSProperties;
  formatFn?: (n: number) => string;
  direction?: "auto" | "up" | "down";
}

export default function AnimatedNumber({
  value,
  style,
  formatFn,
  direction = "auto",
}: AnimatedNumberProps) {
  const [displayed, setDisplayed] = useState(value);
  const [anim, setAnim] = useState<"up" | "down" | null>(null);
  const prevRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === value) return;

    const goingUp =
      direction === "up" || (direction === "auto" && value > prev);
    setAnim(goingUp ? "up" : "down");

    const start = prev;
    const end = value;
    const delta = end - start;
    const duration = Math.min(800, Math.max(200, Math.abs(delta) * 0.5));
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(start + delta * eased);
      setDisplayed(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayed(end);
        setTimeout(() => setAnim(null), 150);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    prevRef.current = value;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, direction]);

  const animStyle: React.CSSProperties =
    anim === "up"
      ? { color: "#00a000", transition: "color 0.3s" }
      : anim === "down"
        ? { color: "#cc0000", transition: "color 0.3s" }
        : { transition: "color 0.5s" };

  const formatted = formatFn ? formatFn(displayed) : displayed.toLocaleString();

  return <span style={{ ...animStyle, ...style }}>{formatted}</span>;
}
