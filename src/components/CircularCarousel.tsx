import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getItems, type CarouselItem } from "@/lib/carouselStore";

const CARD_CONFIGS = [
  { width: 200, height: 300, scale: 0.85, opacity: 0.45, x: -580 },  // far left
  { width: 260, height: 360, scale: 0.92, opacity: 0.7, x: -310 },   // left
  { width: 320, height: 440, scale: 1, opacity: 1, x: 0 },           // center
  { width: 260, height: 360, scale: 0.92, opacity: 0.7, x: 310 },    // right
  { width: 200, height: 300, scale: 0.85, opacity: 0.45, x: 580 },   // far right
];

// Off-screen positions for enter/exit
const OFF_LEFT = { width: 180, height: 280, scale: 0.8, opacity: 0, x: -820 };
const OFF_RIGHT = { width: 180, height: 280, scale: 0.8, opacity: 0, x: 820 };

export default function CircularCarousel() {
  const [items, setItems] = useState<CarouselItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setItems(getItems());
  }, []);

  const count = items.length;

  const goTo = useCallback(
    (newIndex: number) => {
      if (isAnimating || count === 0) return;
      const targetIndex = ((newIndex % count) + count) % count;

      setIsAnimating(true);
      setActiveIndex(targetIndex);
      setTimeout(() => setIsAnimating(false), 550);
    },
    [isAnimating, count, activeIndex]
  );

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  if (count === 0) return null;

  // Get visible slots: -2 to +2 around active
  const getSlotItems = () => {
    const slots: { item: CarouselItem; index: number; slot: number }[] = [];
    for (let offset = -2; offset <= 2; offset++) {
      const idx = ((activeIndex + offset) % count + count) % count;
      slots.push({ item: items[idx], index: idx, slot: offset + 2 });
    }
    return slots;
  };

  const slotItems = getSlotItems();

  return (
    <div className="relative flex items-center justify-center w-full h-[70vh] overflow-hidden select-none">
      <div className="relative" style={{ width: "1200px", height: "500px" }}>
        {slotItems.map(({ item, slot }) => {
          const config = CARD_CONFIGS[slot];

          return (
            <div
              key={item.id}
              className="absolute rounded-2xl overflow-hidden cursor-pointer"
              style={{
                width: `${config.width}px`,
                height: `${config.height}px`,
                left: "50%",
                top: "50%",
                marginLeft: `${-config.width / 2}px`,
                marginTop: `${-config.height / 2}px`,
                transform: `translateX(${config.x}px) scale(${config.scale})`,
                opacity: config.opacity,
                zIndex: slot === 2 ? 10 : 5 - Math.abs(slot - 2),
                transition: "all 0.55s cubic-bezier(0.45, 0, 0.15, 1)",
                boxShadow:
                  slot === 2
                    ? "0 25px 60px -15px rgba(0,0,0,0.5)"
                    : "0 10px 30px -10px rgba(0,0,0,0.3)",
              }}
              onClick={() => {
                if (slot === 2) return;
                goTo(activeIndex + (slot - 2));
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Dark overlay - gradient for center, solid for others */}
              <div
                className="absolute inset-0 transition-all duration-500"
                style={{
                  background:
                    slot === 2
                      ? "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 45%, transparent 100%)"
                      : `rgba(0,0,0,${0.4 + Math.abs(slot - 2) * 0.12})`,
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center gap-2">
                {item.status && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/90 text-primary-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                    {item.status}
                  </span>
                )}
                <h3
                  className="font-bold text-center uppercase tracking-wide text-foreground drop-shadow-lg"
                  style={{ fontSize: slot === 2 ? "1.1rem" : "0.8rem" }}
                >
                  {item.title}
                </h3>
                {slot === 2 && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 px-5 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/80 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Xem chi tiết
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav buttons */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-muted/40 hover:bg-muted/70 hover:scale-110 active:scale-95 text-foreground transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-muted/40 hover:bg-muted/70 hover:scale-110 active:scale-95 text-foreground transition-all duration-300 backdrop-blur-sm"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 flex gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="h-2.5 rounded-full transition-all duration-300"
            style={{
              width: i === activeIndex ? "24px" : "10px",
              backgroundColor:
                i === activeIndex
                  ? "hsl(var(--primary))"
                  : "hsl(var(--foreground) / 0.3)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
