import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "./ui";
import { ClockIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { SocialLinks } from "./SocialLinks";
import { useSite } from "@/context/SiteContext";
import { cn } from "@/utils/cn";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { data, telLink, whatsappLink } = useSite();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled && !open;
  const close = () => setOpen(false);

  // Header style follows scroll position
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // While open: lock page scroll and allow Escape to close
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // If the window grows to desktop size (rotate / resize), close the mobile menu
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const firstPhone = data.contact.phones[0] ?? "";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300",
          transparent
            ? "bg-transparent"
            : open
              ? "bg-white border-b border-charcoal/5"
              : "bg-white/95 backdrop-blur-md border-b border-charcoal/5 shadow-[0_4px_24px_-16px_rgba(16,24,32,0.3)]"
        )}
      >
        <nav
          className="mx-auto flex h-[72px] w-full max-w-7xl 2xl:max-w-[1440px] items-center justify-between gap-3 px-5 sm:px-8"
          aria-label="Main"
        >
          <Link to="/" aria-label="Luminex Energy Solutions home" className="shrink-0" onClick={close}>
            <Logo light={transparent} />
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "px-4 py-2.5 rounded-lg text-[15px] font-medium transition-colors",
                      transparent ? "text-white/80 hover:text-white hover:bg-white/10" : "text-charcoal/70 hover:text-charcoal hover:bg-soft",
                      isActive && (transparent ? "text-white" : "text-charcoal bg-soft")
                    )
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop actions (phone number only when there is room) */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={telLink(firstPhone)}
              className={cn(
                "hidden xl:inline-flex items-center gap-2 text-sm font-semibold",
                transparent ? "text-white/85" : "text-charcoal/75"
              )}
            >
              <PhoneIcon width={18} height={18} />
              {firstPhone}
            </a>
            <Button to="/quote" variant="primary" className="min-h-[44px] px-5">
              Get a Quote
            </Button>
          </div>

          {/* Mobile / tablet burger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "lg:hidden relative grid h-12 w-12 shrink-0 place-items-center rounded-xl touch-manipulation transition-colors",
              transparent
                ? "text-white bg-white/10 hover:bg-white/20"
                : open
                ? "text-white bg-charcoal"
                : "text-charcoal bg-soft hover:bg-ice"
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="relative block h-5 w-6" aria-hidden>
              <span className={cn("absolute left-0 w-6 h-0.5 rounded bg-current transition-all duration-300", open ? "top-[9px] rotate-45" : "top-0")} />
              <span className={cn("absolute left-0 w-6 h-0.5 rounded bg-current transition-all duration-200", open ? "opacity-0" : "top-[9px]")} />
              <span className={cn("absolute left-0 w-6 h-0.5 rounded bg-current transition-all duration-300", open ? "top-[9px] -rotate-45" : "top-[18px]")} />
            </span>
          </button>
        </nav>
      </header>

      {/*
        Mobile menu is rendered OUTSIDE <header>.
        A parent with backdrop-filter becomes the containing block for fixed children,
        which previously collapsed this panel to zero height.
      */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "lg:hidden fixed inset-0 z-[45] h-[100dvh] bg-white transition-[opacity,transform,visibility] duration-300",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none"
        )}
      >
        <div className="h-full overflow-y-auto overscroll-contain px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-18 sm:px-8">
          <div className="mx-auto flex min-h-full max-w-xl flex-col">
            <ul className="space-y-1">
              {links.map((l, i) => (
                <li
                  key={l.to}
                  className={cn("transition-all duration-300", open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}
                  style={{ transitionDelay: open ? `${70 + i * 45}ms` : "0ms" }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === "/"}
                    onClick={close}
                    tabIndex={open ? 0 : -1}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-[56px] items-center rounded-xl px-4 text-xl font-semibold transition-colors",
                        isActive ? "bg-ice text-energy" : "text-charcoal hover:bg-soft"
                      )
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div
              className={cn("mt-6 grid gap-3 transition-all duration-300", open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0")}
              style={{ transitionDelay: open ? "320ms" : "0ms" }}
            >
              <Button to="/quote" variant="primary" className="w-full" onClick={close} tabIndex={open ? 0 : -1}>
                Get a Quote
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button href={telLink(firstPhone)} variant="subtle" tabIndex={open ? 0 : -1}>
                  <PhoneIcon width={18} height={18} /> Call
                </Button>
                <Button href={whatsappLink()} target="_blank" rel="noreferrer" variant="subtle" tabIndex={open ? 0 : -1}>
                  <WhatsAppIcon width={18} height={18} /> WhatsApp
                </Button>
              </div>
            </div>

            <div className="mt-auto pt-10">
              <SocialLinks dark />
              <p className="mt-4 flex items-center gap-2 text-sm text-charcoal/55">
                <ClockIcon width={16} height={16} /> {data.contact.business_hours}
              </p>
              <p className="mt-1 text-xs text-charcoal/40">{data.contact.headquarters}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
