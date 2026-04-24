import { useRef, useState, useEffect, ReactNode, Children } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function HorizontalScroll({ children, className = "" }: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const positionsRef = useRef<number[]>([0]);
  const currentIndexRef = useRef(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // 🔥 NEW: detect drag
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const getScrollPositions = (el: HTMLDivElement) => {
    const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    return [
      0,
      ...Array.from(el.children).map((child) =>
        Math.min((child as HTMLElement).offsetLeft, maxScrollLeft)
      ),
    ]
      .sort((a, b) => a - b)
      .filter((pos, i, arr) => i === 0 || Math.abs(pos - arr[i - 1]) > 2);
  };

  const syncScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;

    const positions = getScrollPositions(el);

    const currentIndex = positions.reduce(
      (closest, pos, i) =>
        Math.abs(pos - el.scrollLeft) <
        Math.abs(positions[closest] - el.scrollLeft)
          ? i
          : closest,
      0
    );

    positionsRef.current = positions;
    currentIndexRef.current = currentIndex;

    setActiveIndex(currentIndex);
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < positions.length - 1);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => syncScrollState();

    const resizeObserver = new ResizeObserver(update);

    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    resizeObserver.observe(el);

    Array.from(el.children).forEach((child) =>
      resizeObserver.observe(child)
    );

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      resizeObserver.disconnect();
    };
  }, [children]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const clamped = Math.max(
      0,
      Math.min(index, positionsRef.current.length - 1)
    );

    el.scrollTo({
      left: positionsRef.current[clamped],
      behavior: "smooth",
    });
  };

  const scroll = (dir: "left" | "right") => {
    scrollTo(
      dir === "right"
        ? currentIndexRef.current + 1
        : currentIndexRef.current - 1
    );
  };

  // 🔥 FIX ANDROID SWIPE
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = false;
    startX.current = e.touches[0].pageX;
    scrollLeft.current = scrollRef.current?.scrollLeft || 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const x = e.touches[0].pageX;
    const walk = Math.abs(x - startX.current);

    if (walk > 5) {
      isDragging.current = true;
    }
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (isDragging.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:text-white -ml-3"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/90 border border-border shadow-lg flex items-center justify-center hover:bg-primary hover:text-white -mr-3"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      <div
        ref={scrollRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onClickCapture={onClickCapture}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
        style={{
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
        }}
      >
        {children}
      </div>

      {positionsRef.current.length > 1 && (
        <div className="flex justify-center gap-1.5 pt-3">
          {positionsRef.current.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all ${
                i === activeIndex
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}