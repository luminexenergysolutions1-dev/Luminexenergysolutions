import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import { Button, Container, Reveal, SectionHeading } from "@/components/ui";
import { ServiceCard } from "@/components/ServiceCard";
import { EnergyFlow } from "@/components/EnergyFlow";
import { QuoteForm } from "@/components/QuoteForm";
import { ProjectGrid } from "@/components/ProjectGrid";
import { RotatingWord } from "@/components/RotatingWord";
import { SolutionFinder } from "@/components/SolutionFinder";
import { ChannelBanner } from "@/components/ChannelBanner";
import {
  ArrowIcon,
  BoltIcon,
  CheckIcon,
  LeafIcon,
  MapIcon,
  ShieldIcon,
  WalletIcon,
  WrenchIcon,
} from "@/components/Icons";

const advantageIcons = [WrenchIcon, ShieldIcon, LeafIcon, WalletIcon, CheckIcon, MapIcon];
const trustIcons = [BoltIcon, WrenchIcon, LeafIcon, MapIcon];

export default function Home() {
  const { data } = useSite();
  const { homepage: h } = data;
  const services = data.services.filter((s) => s.published).sort((a, b) => a.sort_order - b.sort_order);
  const projects = data.projects.filter((p) => p.published).slice(0, 3);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative min-h-[100svh] flex items-end lg:items-center overflow-hidden bg-charcoal">
        <img
          src={h.hero_image}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/20 lg:bg-gradient-to-r lg:from-charcoal lg:via-charcoal/75 lg:to-charcoal/10" />
        {/* animated solar glow + energy lines */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-solar/25 blur-[120px] animate-glow" aria-hidden />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[360px] w-[360px] rounded-full bg-energy/25 blur-[120px] animate-drift" aria-hidden />
        <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full opacity-40" viewBox="0 0 1440 160" fill="none" preserveAspectRatio="none" aria-hidden>
          <path d="M0 120 C 240 60, 480 160, 720 100 S 1200 40, 1440 110" stroke="url(#heroGrad)" strokeWidth="1.5" strokeDasharray="6 10" className="animate-flow" />
          <path d="M0 140 C 300 100, 540 180, 820 120 S 1240 70, 1440 140" stroke="url(#heroGrad)" strokeWidth="1" strokeDasharray="4 12" className="animate-flow [animation-duration:3.6s]" />
          <defs>
            <linearGradient id="heroGrad" x1="0" x2="1">
              <stop offset="0" stopColor="#F5B72F" />
              <stop offset="1" stopColor="#DFF4FF" />
            </linearGradient>
          </defs>
        </svg>

        <Container className="relative pt-32 pb-16 lg:py-40">
          <div className="max-w-2xl lg:max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/85 backdrop-blur">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-solar" />
              <span className="sm:hidden">Solar · Electrical · AC · Savings</span>
              <span className="hidden sm:inline">Solar · Electrical · Air Conditioning · Energy Savings</span>
            </p>
            <h1 className="mt-6 text-4xl min-[400px]:text-5xl leading-[1.05] sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
              {h.hero_heading.split(". ").map((part, i, arr) => (
                <span key={i} className={i === 1 ? "text-ice" : i === 2 ? "text-solar" : ""}>
                  {part}
                  {i < arr.length - 1 ? ". " : ""}
                  {i < arr.length - 1 && <br className="hidden sm:block" />}
                </span>
              ))}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-white/75 leading-relaxed max-w-xl">{h.hero_description}</p>
            <p className="mt-4 text-base sm:text-lg font-semibold text-white">
              Built for{" "}
              <RotatingWord words={["homes", "shops", "offices", "schools", "clinics", "businesses"]} className="min-w-[6.5ch] text-solar" />
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button to="/quote" variant="primary" className="sm:px-8">
                {h.hero_primary_cta} <ArrowIcon width={18} height={18} />
              </Button>
              <Button to="/services" variant="ghostLight">
                {h.hero_secondary_cta}
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------- TRUST STRIP ---------------- */}
      <section className="bg-white border-b border-charcoal/5">
        <Container>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-charcoal/8">
            {h.trust_items.map((t, i) => {
              const Icon = trustIcons[i % trustIcons.length];
              return (
                <li key={t} className="flex flex-col items-start gap-2.5 bg-white px-4 py-5 sm:flex-row sm:items-center sm:gap-3 sm:px-6 lg:py-7">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ice text-energy">
                    <Icon width={20} height={20} />
                  </span>
                  <span className="text-sm sm:text-[15px] font-semibold text-charcoal">{t}</span>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      <section className="py-20 lg:py-28 bg-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <Reveal className="relative mb-6 lg:mb-0">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <img src={h.about_image} alt="Luminex engineers on site in Ghana" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-5 right-3 sm:right-6 rounded-2xl bg-charcoal text-white px-4 py-3 sm:px-5 sm:py-4 shadow-premium max-w-[220px] sm:max-w-[240px]">
                <p className="text-xs text-white/55">Registered in Ghana</p>
                <p className="text-sm font-bold mt-0.5">Established September 2026</p>
                <p className="text-xs text-white/55 mt-1">Headquartered in Cape Coast</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <SectionHeading eyebrow="About Luminex" title={h.about_title} />
              <div className="mt-6 space-y-4 text-charcoal/70 text-base sm:text-lg leading-relaxed">
                {h.about_body.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <Button to="/about" variant="dark" className="mt-8">
                {h.about_cta} <ArrowIcon width={18} height={18} />
              </Button>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- SERVICES ---------------- */}
      <section className="py-20 lg:py-28 bg-soft" id="services">
        <Container>
          <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <SectionHeading eyebrow="Our Services" title={h.services_title} intro={h.services_intro} />
            <Link to="/services" className="inline-flex items-center gap-2 font-semibold text-energy min-h-[44px]">
              View all services <ArrowIcon width={18} height={18} />
            </Link>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <ServiceCard service={s} index={i} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-14">
            <SolutionFinder />
          </Reveal>
        </Container>
      </section>

      {/* ---------------- ENERGY STORY ---------------- */}
      <section className="relative py-20 lg:py-28 bg-charcoal overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-solar/15 blur-[120px] animate-glow" aria-hidden />
        <div className="pointer-events-none absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full bg-energy/20 blur-[120px] animate-drift" aria-hidden />
        <Container className="relative">
          <Reveal>
            <SectionHeading
              light
              align="center"
              eyebrow="The Luminex Idea"
              title="From the sun on your roof to the cool air in your room."
              intro="Most companies handle one piece. Luminex connects the whole chain — generation, distribution and cooling — so each part is designed with the others in mind."
            />
          </Reveal>
          <Reveal delay={150} className="mt-14 lg:mt-20">
            <EnergyFlow />
          </Reveal>
        </Container>
      </section>

      {/* ---------------- ADVANTAGE ---------------- */}
      <section className="py-20 lg:py-28 bg-white">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="The Luminex Advantage" title={h.advantages_title} align="center" />
          </Reveal>
          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {h.advantages.map((a, i) => {
              const Icon = advantageIcons[i % advantageIcons.length];
              return (
                <Reveal as="li" key={a.title} delay={i * 60} className="group flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-soft text-charcoal transition-colors group-hover:bg-solar">
                    <Icon width={22} height={22} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{a.title}</h3>
                    <p className="mt-1.5 text-charcoal/65 leading-relaxed text-[15px]">{a.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ---------------- PROCESS ---------------- */}
      <section className="py-20 lg:py-28 bg-ice/60">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Simple Process" title={h.process_title} intro="Getting started with Luminex is straightforward — four steps from first call to ongoing support." />
          </Reveal>
          <ol className="mt-12 relative grid gap-8 lg:grid-cols-4 lg:gap-6">
            <span className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-solar via-energy to-fresh" aria-hidden />
            {h.process_steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 90} className="relative flex lg:flex-col gap-5 lg:gap-6">
                {i < h.process_steps.length - 1 && <span className="lg:hidden absolute left-6 top-14 bottom-[-2rem] w-px bg-energy/25" aria-hidden />}
                <span className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-charcoal text-solar text-sm font-bold ring-4 ring-ice/60 lg:mx-auto">
                  0{i + 1}
                </span>
                <div className="lg:text-center">
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-1.5 text-charcoal/65 text-[15px] leading-relaxed">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------------- PROJECTS ---------------- */}
      <section className="py-20 lg:py-28 bg-white">
        <Container>
          <Reveal className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <SectionHeading eyebrow="Projects" title={h.projects_title} intro={h.projects_intro} />
            {projects.length > 0 && (
              <Link to="/projects" className="inline-flex items-center gap-2 font-semibold text-energy min-h-[44px]">
                View all projects <ArrowIcon width={18} height={18} />
              </Link>
            )}
          </Reveal>
          <div className="mt-12">
            <ProjectGrid projects={projects} />
          </div>
        </Container>
      </section>

      {/* ---------------- ENERGY CTA ---------------- */}
      <section className="py-6">
        <Container>
          <Reveal className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-energy to-energy-dark px-6 py-12 sm:px-12 lg:px-16 lg:py-16 text-white">
            <LeafIcon className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 text-white/10" aria-hidden />
            <div className="pointer-events-none absolute -top-20 -left-10 h-60 w-60 rounded-full bg-solar/30 blur-3xl" aria-hidden />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_auto] items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight max-w-xl">{h.cta_title}</h2>
                <p className="mt-4 text-white/80 text-base sm:text-lg max-w-xl leading-relaxed">{h.cta_body}</p>
              </div>
              <Button to="/quote?service=Energy%20Savings" variant="primary" className="w-full sm:w-auto sm:px-8 lg:justify-self-end">
                {h.cta_button} <ArrowIcon width={18} height={18} />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------------- QUOTE ---------------- */}
      <section className="py-20 lg:py-28 bg-soft" id="quote">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
            <Reveal>
              <SectionHeading eyebrow="Request a Quote" title="Tell us what you need. We'll handle the rest." intro="Share a few details and the Luminex team will get back to you with practical recommendations and a clear quotation." />
              <ul className="mt-8 space-y-3 text-[15px] text-charcoal/70">
                {["No obligation", "Clear, itemised pricing", "Site assessment where required"].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-fresh/15 text-fresh"><CheckIcon width={14} height={14} /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <QuoteForm compact />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------------- CHANNEL BANNER ---------------- */}
      <section className="py-20 lg:py-28 bg-white">
        <Container>
          <Reveal className="mb-16 lg:mb-24">
            <ChannelBanner />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
