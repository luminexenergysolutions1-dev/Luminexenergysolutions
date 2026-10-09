import { useEffect, useState } from "react";
import { BoltIcon, HomeIcon, SnowIcon, SunIcon } from "./Icons";
import { cn } from "@/utils/cn";

const steps = [
  { Icon: SunIcon, label: "Solar Energy", sub: "Ghana's abundant sunshine", color: "text-solar", bg: "bg-solar/15 ring-solar/40" },
  { Icon: BoltIcon, label: "Power Generation", sub: "Clean, reliable electricity", color: "text-energy", bg: "bg-energy/15 ring-energy/40" },
  { Icon: HomeIcon, label: "Your Building", sub: "Safe electrical infrastructure", color: "text-fresh", bg: "bg-fresh/15 ring-fresh/40" },
  { Icon: SnowIcon, label: "Cooling & Comfort", sub: "Efficient air conditioning", color: "text-ice", bg: "bg-ice/15 ring-ice/40" },
];

/** Animated SUN → POWER → BUILDING → COOLING flow. Horizontal on desktop, vertical on mobile.
 *  The active step advances automatically (pauses on hover/focus) and can be tapped. */
export function EnergyFlow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((v) => (v + 1) % steps.length), 2200);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* desktop connector */}
      <svg className="hidden md:block absolute left-0 right-0 top-9 h-2 w-full" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden>
        <defs>
          <linearGradient id="flowGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#F5B72F" />
            <stop offset="0.5" stopColor="#0879C9" />
            <stop offset="1" stopColor="#DFF4FF" />
          </linearGradient>
        </defs>
        <line x1="12" y1="1" x2="88" y2="1" stroke="rgba(255,255,255,0.12)" strokeWidth="0.4" />
        <line x1="12" y1="1" x2="88" y2="1" stroke="url(#flowGrad)" strokeWidth="0.5" strokeDasharray="2 2" className="animate-flow" />
      </svg>

      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-4">
        {steps.map((s, i) => {
          const on = active === i;
          return (
            <li key={s.label} className="relative">
              {/* mobile connector */}
              {i < steps.length - 1 && (
                <span className="md:hidden absolute left-9 top-[72px] h-[calc(100%-16px)] w-px bg-gradient-to-b from-solar/60 via-energy/50 to-ice/40" aria-hidden />
              )}
              <button
                type="button"
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
                aria-current={on ? "step" : undefined}
                className="relative flex w-full items-center gap-5 text-left md:flex-col md:text-center"
              >
                <span
                  className={cn(
                    "relative grid h-[72px] w-[72px] shrink-0 place-items-center rounded-2xl ring-1 backdrop-blur transition-all duration-500",
                    s.bg,
                    s.color,
                    on && "scale-110 ring-2"
                  )}
                >
                  <s.Icon width={32} height={32} />
                  <span className={cn("absolute inset-0 rounded-2xl blur-xl transition-opacity duration-500", on ? "opacity-70 bg-white/20" : "opacity-0")} aria-hidden />
                  {i === 0 && <span className="absolute inset-0 rounded-2xl bg-solar/30 blur-xl animate-glow" aria-hidden />}
                  {i === 3 && <span className="absolute inset-0 rounded-2xl bg-ice/20 blur-xl animate-glow [animation-delay:1.5s]" aria-hidden />}
                </span>
                <span className={cn("transition-opacity duration-500", on ? "opacity-100" : "opacity-60")}>
                  <span className="block text-white font-bold text-lg">{s.label}</span>
                  <span className="block text-sm text-white/60 mt-1">{s.sub}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
