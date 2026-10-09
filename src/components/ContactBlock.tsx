import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import { Reveal, SectionHeading, Button } from "./ui";
import { ClockIcon, MailIcon, MapIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { SocialLinks } from "./SocialLinks";

export function ContactBlock({ showHeading = true }: { showHeading?: boolean }) {
  const { data, telLink, whatsappLink } = useSite();
  const c = data.contact;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
      <Reveal>
        {showHeading && (
          <SectionHeading eyebrow="Contact" title="Talk to the Luminex team." intro="Call, WhatsApp or visit us. We serve customers across Ghana from our headquarters in Cape Coast." />
        )}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button href={telLink(c.phones[0] ?? "")} variant="dark"><PhoneIcon width={18} height={18} /> Call {c.phones[0]}</Button>
          <Button href={whatsappLink()} target="_blank" rel="noreferrer" variant="subtle"><WhatsAppIcon /> WhatsApp</Button>
        </div>
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-charcoal/50 mb-3">Follow us</h3>
          <SocialLinks dark showLabels />
        </div>
      </Reveal>

      <Reveal delay={100} className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl bg-soft p-6 sm:col-span-2">
          <h3 className="text-lg font-bold">{c.company_name}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-[15px]">
            <p className="flex gap-3">
              <MapIcon className="mt-0.5 shrink-0 text-energy" width={20} height={20} />
              <span>
                <span className="block text-xs font-semibold text-charcoal/50">Headquarters</span>
                {c.headquarters}
                <span className="block text-sm text-charcoal/60 mt-1">Digital Address: {c.digital_address}</span>
              </span>
            </p>
            <p className="flex gap-3">
              <ClockIcon className="mt-0.5 shrink-0 text-energy" width={20} height={20} />
              <span>
                <span className="block text-xs font-semibold text-charcoal/50">Business Hours</span>
                {c.business_hours}
              </span>
            </p>
          </div>
        </div>
        <div className="rounded-2xl bg-soft p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal/50"><PhoneIcon width={16} height={16} /> Phone</h3>
          <ul className="mt-3 space-y-1">
            {c.phones.map((p) => (
              <li key={p}>
                <a href={telLink(p)} className="flex min-h-[44px] items-center font-semibold text-charcoal hover:text-energy">{p}</a>
              </li>
            ))}
          </ul>
          {c.email && (
            <a href={`mailto:${c.email}`} className="mt-3 flex items-center gap-2 text-sm text-energy font-semibold"><MailIcon width={16} height={16} /> {c.email}</a>
          )}
        </div>
        <div className="rounded-2xl bg-soft p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-charcoal/50"><MapIcon width={16} height={16} /> Service Areas</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {c.service_areas.map((a) => (
              <li key={a}>
                <Link
                  to={`/quote?location=${encodeURIComponent(a)}`}
                  className="inline-flex min-h-[40px] items-center rounded-full bg-white px-3.5 text-sm font-medium ring-1 ring-charcoal/8 transition hover:bg-ice hover:text-energy hover:ring-energy/30"
                  title={`Request a quote in ${a}`}
                >
                  {a}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-charcoal/50">Tap a city to request a quote there.</p>
        </div>
      </Reveal>
    </div>
  );
}
