import { useEffect, useRef, useState } from "react";
import { useSpeed } from "../store/speedStore";
import type { SpeedLevel } from "../store/speedStore";

interface AnimatedNumberProps {
  value: number;
  style?: React.CSSProperties;
  className?: string;
  speed?: SpeedLevel;
  formatFn?: (n: number) => string;
}

const SPEED_MS: Record<SpeedLevel, number> = {
  slow: 1200,
  medium: 700,
  fast: 300,
};

export default function AnimatedNumber({
  value,
  style,
  className,
  speed: speedProp,
  formatFn,
}: AnimatedNumberProps) {
  const { speed: ctxSpeed } = useSpeed();
  const speed = speedProp ?? ctxSpeed;
  const durationMs = SPEED_MS[speed];

  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(value);
  const toRef = useRef(value);
  const dirTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: displayValue intentionally read via ref
  useEffect(() => {
    if (value === toRef.current) return;

    const dir = value > toRef.current ? "up" : "down";
    setDirection(dir);
    if (dirTimerRef.current) clearTimeout(dirTimerRef.current);
    dirTimerRef.current = setTimeout(
      () => setDirection(null),
      durationMs + 300,
    );

    fromRef.current = displayValue;
    toRef.current = value;
    startRef.current = null;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out cubic
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(
        fromRef.current + (toRef.current - fromRef.current) * eased,
      );
      setDisplayValue(current);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(toRef.current);
        fromRef.current = toRef.current;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (dirTimerRef.current) clearTimeout(dirTimerRef.current);
    };
  }, [value, durationMs]);

  const formatted = formatFn
    ? formatFn(displayValue)
    : displayValue.toLocaleString();

  const colorStyle: React.CSSProperties =
    direction === "up"
      ? { color: "#16a34a" }
      : direction === "down"
        ? { color: "#dc2626" }
        : {};

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        transition: `color ${durationMs}ms ease`,
        ...colorStyle,
        ...style,
      }}
    >
      {formatted}
    </span>
  );
}
