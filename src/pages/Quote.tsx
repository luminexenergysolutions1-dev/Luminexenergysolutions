import { useSearchParams } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import { Container, Reveal, SectionHeading, Button } from "@/components/ui";
import { QuoteForm } from "@/components/QuoteForm";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";

export default function Quote() {
  const [params] = useSearchParams();
  const { data, telLink, whatsappLink } = useSite();
  const h = data.homepage;

  return (
    <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-28 bg-soft overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full bg-solar/20 blur-[120px]" aria-hidden />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="Request a Quote" title="Get a clear quotation from Luminex." intro="Tell us about your home or business and what you need. We'll review it, arrange an assessment if required, and send you a transparent quotation." />
            <ul className="mt-8 space-y-3 text-[15px] text-charcoal/70">
              {["Takes less than a minute", "No obligation", "Solar · Electrical · Air Conditioning · Energy Savings"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-fresh/15 text-fresh"><CheckIcon width={14} height={14} /></span>{t}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-charcoal/5">
              <p className="text-sm font-semibold text-charcoal/50">Prefer to talk?</p>
              <div className="mt-3 flex flex-col gap-2">
                <Button href={telLink(data.contact.phones[0] ?? "")} variant="subtle" className="justify-start"><PhoneIcon width={18} height={18} /> {data.contact.phones[0]}</Button>
                <Button href={whatsappLink()} target="_blank" rel="noreferrer" variant="subtle" className="justify-start"><WhatsAppIcon /> WhatsApp us</Button>
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl aspect-[16/10] hidden lg:block">
              <img src={h.hero_image} alt="" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <QuoteForm defaultService={params.get("service") ?? undefined} defaultLocation={params.get("location") ?? undefined} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
