import { useState } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import { ArrowIcon, serviceIcon } from "./Icons";
import { cn } from "@/utils/cn";

/** Simple guided picker: "What's your problem?" → recommended service → quote. No invented numbers. */
const needs = [
  { id: "outage", label: "Power cuts keep disrupting me", slug: "solar-power", quote: "Solar Power", why: "A solar and battery backup system keeps lights, fridges and equipment running when the grid goes down — and cuts what you pay for grid power." },
  { id: "bills", label: "My electricity bills are too high", slug: "energy-savings", quote: "Energy Savings", why: "An energy assessment shows exactly where your power goes, then we recommend practical upgrades — from LED lighting to smarter cooling — to reduce waste." },
  { id: "cooling", label: "I need cooling for a room, shop or office", slug: "air-conditioning", quote: "Air Conditioning", why: "We size the unit to your space, supply and install it properly, and service it so it keeps cooling efficiently." },
  { id: "acfault", label: "My AC isn't cooling or needs servicing", slug: "air-conditioning", quote: "Air Conditioning", why: "Deep servicing, gas top-up and fault repair for homes and businesses — sorted quickly by a professional technician." },
  { id: "wiring", label: "I need wiring, sockets or a fault fixed", slug: "electrical-works", quote: "Electrical Works", why: "Safe wiring, distribution boards, lighting and repairs, installed and tested to a professional standard." },
];

export function SolutionFinder() {
  const { data } = useSite();
  const [active, setActive] = useState<string | null>(null);
  const need = needs.find((n) => n.id === active);
  const service = need ? data.services.find((s) => s.slug === need.slug && s.published) : undefined;
  const Icon = service ? serviceIcon[service.icon] ?? serviceIcon.sun : serviceIcon.sun;

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-charcoal/6">
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="p-6 sm:p-10">
          <p className="text-sm font-semibold text-energy">Not sure where to start?</p>
          <h3 className="mt-2 text-2xl sm:text-3xl font-bold leading-tight">What's the problem you want solved?</h3>
          <p className="mt-2 text-charcoal/60">Tap the one that sounds most like you.</p>
          <div className="mt-6 flex flex-wrap gap-2.5" role="group" aria-label="Choose your need">
            {needs.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                aria-pressed={active === n.id}
                className={cn(
                  "min-h-[46px] rounded-full border px-4 py-2 text-left text-sm font-semibold transition-all",
                  active === n.id
                    ? "border-charcoal bg-charcoal text-white shadow-lg"
                    : "border-charcoal/12 bg-white text-charcoal/80 hover:border-energy hover:text-energy"
                )}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center bg-charcoal p-6 sm:p-10 text-white min-h-[240px]" aria-live="polite">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-solar/25 blur-3xl" aria-hidden />
          {need ? (
            <div key={need.id} className="relative animate-[fadeUp_0.45s_ease-out]">
              <p className="text-xs font-semibold text-solar">We recommend</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-solar text-charcoal"><Icon width={24} height={24} /></span>
                <h4 className="text-2xl font-bold">{service?.title ?? need.quote}</h4>
              </div>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">{need.why}</p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  to={`/quote?service=${encodeURIComponent(need.quote)}`}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-solar px-5 text-[15px] font-semibold text-charcoal hover:bg-[#ffc54a]"
                >
                  Get a quote <ArrowIcon width={18} height={18} />
                </Link>
                {service && (
                  <Link
                    to={`/services/${service.slug}`}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/25 px-5 text-[15px] font-semibold text-white hover:bg-white/10"
                  >
                    Learn more
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <p className="relative text-lg font-semibold text-white/70 max-w-xs">
              Pick an option on the left and we'll point you to the right Luminex service.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
