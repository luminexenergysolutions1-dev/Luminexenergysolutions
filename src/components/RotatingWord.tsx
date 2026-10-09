import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

/** Cross-fading word rotator. All words share one grid cell, so the width never jumps. */
export function RotatingWord({ words, className }: { words: string[]; className?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className={cn("inline-grid align-bottom", className)}>
      {words.map((w, idx) => (
        <span
          key={w}
          aria-hidden={idx !== i}
          className={cn(
            "col-start-1 row-start-1 transition-all duration-500",
            idx === i ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
