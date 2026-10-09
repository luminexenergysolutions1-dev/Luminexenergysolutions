import { cn } from "@/utils/cn";

const NAVY = "#05204F";
const GREEN = "#02592A";
const GOLD = "#EAA806";

/** The Luminex emblem: sun + lightning, house, leaf and crescent swoosh. */
export function LogoMark({ className }: { className?: string }) {
  const rays = [-165, -141, -117, -93, -69, -45, -21, 3, 27, 51, 75];
  return (
    <svg viewBox="0 0 100 96" className={className} role="img" aria-label="Luminex emblem">
      {/* sun rays */}
      <g stroke={GOLD} strokeWidth="2.4" strokeLinecap="round">
        {rays.map((a) => {
          const r = (a * Math.PI) / 180;
          const c = (rad: number, axis: "x" | "y") =>
            (axis === "x" ? 65.7 + Math.cos(r) * rad : 34.8 + Math.sin(r) * rad).toFixed(2);
          return <line key={a} x1={c(26.5, "x")} y1={c(26.5, "y")} x2={c(31.5, "x")} y2={c(31.5, "y")} />;
        })}
      </g>
      {/* sun ring (open at lower-left) */}
      <circle
        cx="65.7"
        cy="34.8"
        r="21.5"
        fill="none"
        stroke={GOLD}
        strokeWidth="3.2"
        strokeDasharray="122 13"
        transform="rotate(152 65.7 34.8)"
      />
      {/* crescent swoosh */}
      <path
        d="M35 16C14 24 0 42 2 60c2 18 18 32 42 34 14 1 26-4 32-12-8 5-20 7-30 6C28 86 9 72 9 52 9 36 20 22 35 16Z"
        fill={NAVY}
      />
      {/* dark swoosh */}
      <path d="M29.5 79c5.5 3 11.5 5 17.5 5.500 10 .5 18-4.500 24-8-1 5.500-9 10.500-19 11.500-10 1-18-4-22.500-9Z" fill="#0A2B26" />
      {/* house */}
      <path d="M10 58 40 31l6 6-22 19v24l-6-6V58Z" fill={NAVY} />
      <g fill={NAVY}>
        <rect x="31" y="53" width="5" height="5" />
        <rect x="37" y="53" width="5" height="5" />
        <rect x="31" y="59" width="5" height="5" />
        <rect x="37" y="59" width="5" height="5" />
        <path d="M57 55 63.500 47 70 55h-3v25l-3.500 2V55H57Z" />
        <rect x="30" y="28" width="5" height="7" transform="rotate(-3 30 28)" />
      </g>
      {/* lightning bolt */}
      <polygon points="53.6,20.2 72.9,20.5 60.5,38.9 71.8,39.3 44.6,68.8 54.8,46.6 43.9,46.6" fill={GOLD} />
      {/* leaf */}
      <path d="M72 70c-2-8 4-14 14-15 4 3 7 9 6.500 17C92 79 86 83 79 82c-3-1-6-6-7-12Z" fill="#2A7527" />
      <path d="M72.500 78.500C78 72 83 66 88 61.300" stroke="#fff" strokeWidth="1.300" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/**
 * Full horizontal logo lockup.
 * `light` = the logo is placed on a dark background → it is shown on a white tile
 * so the navy lettering from the brand logo stays legible.
 */
export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  const lockup = (
    <span className="inline-flex items-center gap-2">
      <LogoMark className="h-11 w-auto shrink-0" />
      <span className="leading-none">
        <span className="block text-[23px] font-extrabold tracking-tight">
          <span style={{ color: NAVY }}>LUMI</span>
          <span style={{ color: GREEN }}>NE</span>
          <span
            style={{
              background: `linear-gradient(135deg, ${GREEN} 48%, #C48A08 52%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            X
          </span>
        </span>
        <span className="mt-1 flex items-center gap-1.5" style={{ color: NAVY }}>
          <span className="h-[2px] w-2.5" style={{ background: GREEN }} />
          <span className="text-[7.5px] font-semibold tracking-[0.26em] whitespace-nowrap">ENERGY SOLUTIONS</span>
          <span className="h-[2px] w-2.5" style={{ background: GREEN }} />
        </span>
      </span>
    </span>
  );

  return (
    <span
      className={cn(
        "inline-flex items-center",
        light && "rounded-xl bg-white px-2.5 py-1.5 shadow-[0_6px_20px_-8px_rgba(0,0,0,0.5)]",
        className
      )}
    >
      {lockup}
    </span>
  );
}
