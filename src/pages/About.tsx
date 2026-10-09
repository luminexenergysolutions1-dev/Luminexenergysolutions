import { useSite } from "@/context/SiteContext";
import { PageHeader } from "@/components/PageHeader";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui";
import { EnergyFlow } from "@/components/EnergyFlow";
import { ArrowIcon, CheckIcon } from "@/components/Icons";

export default function About() {
  const { data } = useSite();
  const a = data.about;
  const testimonials = data.testimonials.filter((t) => t.published);

  return (
    <>
      <PageHeader eyebrow="About Luminex" title={a.intro} intro="A modern Ghanaian energy company built on safe engineering, honest advice and lasting support." />

      <section className="py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            <Reveal>
              <SectionHeading eyebrow="Who we are" title="Reliable power, safe electrical work and premium cooling — from one team." />
              <div className="mt-6 space-y-4 text-charcoal/70 text-base sm:text-lg leading-relaxed">
                {a.description.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Reveal>
            <Reveal delay={100} className="overflow-hidden rounded-3xl aspect-[4/3] lg:aspect-[4/5]">
              <img src={a.image} alt="Luminex team" loading="lazy" className="h-full w-full object-cover" />
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-16 bg-soft">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="rounded-3xl bg-white p-8 sm:p-10 shadow-card">
              <p className="text-sm font-semibold text-solar">Our Mission</p>
              <p className="mt-3 text-xl sm:text-2xl font-bold leading-snug">{a.mission}</p>
            </Reveal>
            <Reveal delay={100} className="rounded-3xl bg-charcoal text-white p-8 sm:p-10 shadow-card">
              <p className="text-sm font-semibold text-solar">Our Vision</p>
              <p className="mt-3 text-xl sm:text-2xl font-bold leading-snug">{a.vision}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <Reveal><SectionHeading eyebrow="Values" title="What we hold ourselves to." align="center" /></Reveal>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 70} className="rounded-2xl border border-charcoal/8 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-fresh/15 text-fresh"><CheckIcon width={20} height={20} /></span>
                <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-[15px] text-charcoal/65 leading-relaxed">{v.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {testimonials.length > 0 && (
        <section className="py-20 bg-ice/60">
          <Container>
            <Reveal><SectionHeading eyebrow="Customer Feedback" title="What customers say." /></Reveal>
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t.id} className="rounded-2xl bg-white p-7 shadow-card">
                  <p className="text-charcoal/80 leading-relaxed">“{t.quote}”</p>
                  <p className="mt-5 font-bold">{t.name}</p>
                  <p className="text-sm text-charcoal/55">{t.role}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <section className="py-20 lg:py-28 bg-charcoal">
        <Container>
          <Reveal><SectionHeading light align="center" eyebrow="How it connects" title="Sun → Power → Cooling → Comfort" /></Reveal>
          <Reveal delay={120} className="mt-14"><EnergyFlow /></Reveal>
          <div className="mt-14 text-center">
            <Button to="/quote" variant="primary">Request a Quote <ArrowIcon width={18} height={18} /></Button>
          </div>
        </Container>
      </section>
    </>
  );
}
