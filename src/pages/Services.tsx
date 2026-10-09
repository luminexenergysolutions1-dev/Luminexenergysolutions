import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { PageHeader } from "@/components/PageHeader";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui";
import { ServiceCard } from "@/components/ServiceCard";
import { ChevronIcon } from "@/components/Icons";
import { cn } from "@/utils/cn";

export default function Services() {
  const { data } = useSite();
  const services = data.services.filter((s) => s.published).sort((a, b) => a.sort_order - b.sort_order);
  const faqs = data.faqs.filter((f) => f.published).sort((a, b) => a.sort_order - b.sort_order);
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <>
      <PageHeader eyebrow="Services" title="Solar, electrical, air conditioning and energy savings." intro="Four connected services delivered by one accountable team — designed, installed and supported to a professional standard." />

      <section className="py-20 lg:py-28 bg-soft">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}><ServiceCard service={s} index={i} /></Reveal>
            ))}
          </div>
        </Container>
      </section>

      {faqs.length > 0 && (
        <section className="py-20 lg:py-28">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
              <Reveal>
                <SectionHeading eyebrow="FAQs" title="Common questions." intro="Can't find what you're looking for? Call or WhatsApp us — we're happy to help." />
                <Button to="/contact" variant="outline" className="mt-6">Contact us</Button>
              </Reveal>
              <Reveal delay={100}>
                <ul className="divide-y divide-charcoal/8 border-y border-charcoal/8">
                  {faqs.map((f) => {
                    const isOpen = open === f.id;
                    return (
                      <li key={f.id}>
                        <button
                          onClick={() => setOpen(isOpen ? null : f.id)}
                          className="flex w-full items-center justify-between gap-4 py-5 text-left"
                          aria-expanded={isOpen}
                        >
                          <span className="text-base sm:text-lg font-semibold">{f.question}</span>
                          <ChevronIcon className={cn("shrink-0 text-energy transition-transform", isOpen && "rotate-180")} />
                        </button>
                        <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr] opacity-100 pb-5" : "grid-rows-[0fr] opacity-0")}>
                          <p className="overflow-hidden text-charcoal/65 leading-relaxed">{f.answer}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Reveal>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
