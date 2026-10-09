import { PageHeader } from "@/components/PageHeader";
import { Container, Reveal, SectionHeading } from "@/components/ui";
import { ContactBlock } from "@/components/ContactBlock";
import { QuoteForm } from "@/components/QuoteForm";

export default function Contact() {
  return (
    <>
      <PageHeader eyebrow="Contact" title="Let's talk about your power and comfort." intro="Call, WhatsApp or send us a message — the Luminex team is ready to help." />
      <section className="py-20 lg:py-28">
        <Container><ContactBlock /></Container>
      </section>
      <section className="py-20 lg:py-28 bg-soft">
        <Container>
          <Reveal><SectionHeading eyebrow="Send a message" title="Request a quote or ask a question." align="center" className="mb-10" /></Reveal>
          <div className="max-w-3xl mx-auto"><QuoteForm /></div>
        </Container>
      </section>
    </>
  );
}
