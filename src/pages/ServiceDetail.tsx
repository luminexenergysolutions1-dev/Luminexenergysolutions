import { Link, Navigate, useParams } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui";
import { QuoteForm } from "@/components/QuoteForm";
import { ArrowIcon, CheckIcon, serviceIcon } from "@/components/Icons";

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data, loading } = useSite();
  const service = data.services.find((s) => s.slug === slug && s.published);
  const others = data.services.filter((s) => s.published && s.slug !== slug);

  if (!service) {
    if (loading) return <div className="min-h-[60vh]" />;
    return <Navigate to="/services" replace />;
  }
  const Icon = serviceIcon[service.icon] ?? serviceIcon.sun;

  const List = ({ items }: { items: string[] }) => (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((it) => (
        <li key={it} className="flex gap-3 text-[15px] text-charcoal/75">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-fresh/15 text-fresh"><CheckIcon width={12} height={12} /></span>
          {it}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <section className="relative bg-charcoal text-white overflow-hidden">
        <img src={service.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/30 lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/80 lg:to-charcoal/20" />
        <Container className="relative pt-32 pb-16 lg:pt-44 lg:pb-28">
          <Link to="/services" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white min-h-[44px]">← All services</Link>
          <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-solar text-charcoal"><Icon width={28} height={28} /></span>
            <h1 className="min-w-0 break-words text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">{service.title}</h1>
          </div>
          <p className="mt-6 max-w-2xl text-lg text-white/75 leading-relaxed">{service.overview}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button to="#quote" variant="primary">Request a Quote <ArrowIcon width={18} height={18} /></Button>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-16">
              <Reveal>
                <SectionHeading title="What we provide" className="mb-8" />
                <List items={service.provides} />
              </Reveal>
              <Reveal>
                <SectionHeading title="Benefits" className="mb-8" />
                <ul className="grid gap-4 sm:grid-cols-2">
                  {service.benefits.map((b, i) => (
                    <li key={b} className="rounded-2xl bg-soft p-5">
                      <span className="text-xs font-bold text-energy">0{i + 1}</span>
                      <p className="mt-1.5 font-semibold">{b}</p>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal>
                <SectionHeading title="Typical applications" className="mb-8" />
                <List items={service.applications} />
              </Reveal>
              <Reveal>
                <SectionHeading title="Installation process" className="mb-8" />
                <ol className="relative space-y-6 border-l border-energy/20 pl-8">
                  {service.process.map((p, i) => (
                    <li key={p} className="relative">
                      <span className="absolute -left-[41px] grid h-6 w-6 place-items-center rounded-full bg-charcoal text-[11px] font-bold text-solar">{i + 1}</span>
                      <p className="font-semibold">{p}</p>
                    </li>
                  ))}
                </ol>
              </Reveal>
              <Reveal className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-ice/60 p-7">
                  <h3 className="text-lg font-bold">Maintenance</h3>
                  <p className="mt-2 text-charcoal/70 leading-relaxed">{service.maintenance}</p>
                </div>
                <div className="rounded-2xl bg-charcoal text-white p-7">
                  <h3 className="text-lg font-bold text-solar">Why choose Luminex</h3>
                  <p className="mt-2 text-white/75 leading-relaxed">{service.why_luminex}</p>
                </div>
              </Reveal>
            </div>

            <aside className="lg:sticky lg:top-24 self-start space-y-4">
              <div className="rounded-2xl border border-charcoal/8 p-6">
                <h3 className="font-bold">Other services</h3>
                <ul className="mt-3 space-y-1">
                  {others.map((o) => {
                    const OIcon = serviceIcon[o.icon] ?? serviceIcon.sun;
                    return (
                      <li key={o.id}>
                        <Link to={`/services/${o.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-soft">
                          <span className="grid h-9 w-9 place-items-center rounded-lg bg-soft text-charcoal"><OIcon width={18} height={18} /></span>
                          <span className="font-medium text-[15px]">{o.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="rounded-2xl bg-solar p-6">
                <p className="font-bold text-charcoal">Ready to start?</p>
                <p className="mt-1 text-sm text-charcoal/75">Request a quote and we'll respond with practical recommendations.</p>
                <Button to="#quote" variant="dark" className="mt-4 w-full">Request a Quote</Button>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section id="quote" className="py-20 lg:py-28 bg-soft scroll-mt-20">
        <Container>
          <Reveal><SectionHeading eyebrow="Request a Quote" title={`Get a ${service.title.toLowerCase()} quotation.`} align="center" className="mb-10" /></Reveal>
          <div className="max-w-3xl mx-auto"><QuoteForm defaultService={service.title} /></div>
        </Container>
      </section>
    </>
  );
}
