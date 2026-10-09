import { Container } from "./ui";

export function PageHeader({ eyebrow, title, intro, image }: { eyebrow: string; title: string; intro?: string; image?: string }) {
  return (
    <section className="relative bg-charcoal text-white overflow-hidden">
      {image && (
        <>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
        </>
      )}
      <div className="pointer-events-none absolute -top-20 right-10 h-72 w-72 rounded-full bg-solar/20 blur-[100px] animate-glow" aria-hidden />
      <Container className="relative pt-32 pb-16 lg:pt-44 lg:pb-24">
        <p className="text-sm font-semibold text-solar">{eyebrow}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] max-w-3xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-white/70 leading-relaxed">{intro}</p>}
      </Container>
    </section>
  );
}
