import { ReactNode, useEffect, useRef, useState, CSSProperties } from "react";

/**
 * Reveal-on-scroll pakai IntersectionObserver + CSS transition (bukan framer-motion).
 * Animasi jalan di compositor (lebih ringan) & framer-motion tidak lagi ikut di load awal.
 */
function useInView<T extends HTMLElement>(rootMargin = "0px 0px -80px 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, inView]);

  return { ref, inView };
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function AnimatedSection({ children, className = "", delay = 0, direction = "up" }: AnimatedSectionProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const offset: Record<string, string> = {
    up: "translateY(30px)",
    down: "translateY(-30px)",
    left: "translateX(30px)",
    right: "translateX(-30px)",
  };

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "none" : offset[direction],
    transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
    willChange: "opacity, transform",
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

export function StaggerContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>("0px 0px -50px 0px");
  return (
    <div ref={ref} className={`stagger ${inView ? "in-view" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`stagger-item ${className}`}>{children}</div>;
}

export function FloatingElement({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`animate-float ${className}`}>{children}</div>;
}
