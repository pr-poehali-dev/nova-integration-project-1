import { CSSProperties, useEffect, useRef } from "react";

type MeshGradientProps = {
  colors?: [string, string, string, string];
  speed?: number;
  style?: CSSProperties;
  className?: string;
};

export function MeshGradient({
  colors = ["#001c80", "#1ac7ff", "#04ffb1", "#ff1ff1"],
  speed = 1,
  style,
  className,
}: MeshGradientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    const animate = () => {
      if (!ref.current) return;
      const t = (Date.now() - startRef.current) / 1000 * speed;

      const x0 = 20 + Math.sin(t * 0.5) * 15;
      const y0 = 20 + Math.cos(t * 0.4) * 15;
      const x1 = 80 + Math.cos(t * 0.6) * 12;
      const y1 = 20 + Math.sin(t * 0.3) * 18;
      const x2 = 40 + Math.sin(t * 0.4 + 1) * 20;
      const y2 = 80 + Math.cos(t * 0.5 + 2) * 12;
      const x3 = 80 + Math.cos(t * 0.35 + 0.5) * 15;
      const y3 = 80 + Math.sin(t * 0.45 + 1) * 14;

      ref.current.style.background = `
        radial-gradient(ellipse at ${x0}% ${y0}%, ${colors[0]} 0%, transparent 55%),
        radial-gradient(ellipse at ${x1}% ${y1}%, ${colors[1]} 0%, transparent 55%),
        radial-gradient(ellipse at ${x2}% ${y2}%, ${colors[2]} 0%, transparent 55%),
        radial-gradient(ellipse at ${x3}% ${y3}%, ${colors[3]} 0%, transparent 55%),
        linear-gradient(180deg, ${colors[0]}22 0%, ${colors[3]}22 100%)
      `;

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [colors, speed]);

  return <div ref={ref} className={className} style={style} />;
}
