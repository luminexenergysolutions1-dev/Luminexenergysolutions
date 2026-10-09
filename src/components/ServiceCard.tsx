import { Link } from "react-router-dom";
import type { Service } from "@/lib/types";
import { ArrowIcon, serviceIcon } from "./Icons";
import { cn } from "@/utils/cn";

const accent: Record<Service["icon"], string> = {
  sun: "from-solar/90 to-solar/60 text-charcoal",
  bolt: "from-energy to-energy-dark text-white",
  snow: "from-[#5FC1F2] to-energy text-white",
  leaf: "from-fresh to-[#2b8a45] text-white",
};

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = serviceIcon[service.icon] ?? serviceIcon.sun;
  return (
    <Link
      to={`/services/${service.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-charcoal/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
        <span className={cn("absolute left-4 top-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br shadow-lg", accent[service.icon])}>
          <Icon width={24} height={24} />
        </span>
        <span className="absolute right-4 top-4 text-xs font-semibold text-white/80 tracking-wider">
          0{index + 1}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-charcoal">{service.title}</h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-charcoal/65 flex-1">{service.short_description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-energy">
          {service.cta_text}
          <ArrowIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
