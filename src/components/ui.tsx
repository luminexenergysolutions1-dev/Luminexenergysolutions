import { useEffect, useRef, type ReactNode, type HTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

/* ---------- Scroll reveal ---------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn("reveal", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Comp>
  );
}

/* ---------- Buttons ---------- */
const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-center font-semibold leading-snug transition-all duration-200 min-h-[48px] px-6 text-[15px] touch-manipulation focus-visible:outline-2 active:scale-[0.98]";
const variants = {
  primary: "bg-solar text-charcoal hover:bg-[#ffc54a] shadow-[0_10px_30px_-10px_rgba(245,183,47,0.7)]",
  dark: "bg-charcoal text-white hover:bg-[#1c2733]",
  blue: "bg-energy text-white hover:bg-energy-dark",
  outline: "border border-charcoal/15 text-charcoal hover:border-charcoal/40 bg-white/60 backdrop-blur",
  ghostLight: "border border-white/30 text-white hover:bg-white/10",
  subtle: "bg-soft text-charcoal hover:bg-ice",
};
type Variant = keyof typeof variants;

export function Button({
  to,
  href,
  variant = "primary",
  className,
  children,
  ...rest
}: {
  to?: string;
  href?: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children"> & { type?: "button" | "submit"; disabled?: boolean; target?: string; rel?: string }) {
  const cls = cn(btnBase, variants[variant], className);
  if (to) return <Link to={to} className={cls} {...(rest as object)}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...(rest as object)}>{children}</a>;
  return (
    <button className={cls} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

/* ---------- Section heading ---------- */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center mx-auto", "max-w-2xl", className)}>
      {eyebrow && (
        <p className={cn("text-sm font-semibold tracking-wide mb-3", light ? "text-solar" : "text-energy")}>
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] tracking-tight",
          light ? "text-white" : "text-charcoal"
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-4 text-base sm:text-lg leading-relaxed", light ? "text-white/70" : "text-charcoal/65")}>
          {intro}
        </p>
      )}
    </div>
  );
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-5 sm:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full bg-ice px-3.5 py-1.5 text-xs font-semibold text-energy", className)}>
      {children}
    </span>
  );
}
