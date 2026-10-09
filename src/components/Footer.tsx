import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { useSite } from "@/context/SiteContext";
import { SocialLinks } from "./SocialLinks";
import { ClockIcon, MapIcon, PhoneIcon, WhatsAppIcon } from "./Icons";

/** Link rows are 44px tall on touch screens, tighter on desktop. */
const linkCls =
  "inline-flex min-h-[44px] items-center text-white/80 transition-colors hover:text-solar md:min-h-0 md:py-1";

export function Footer() {
  const { data, telLink } = useSite();
  const { contact, social } = data;
  const services = data.services.filter((s) => s.published);

  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[1440px] px-5 sm:px-8 pt-14 pb-8 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-5 text-lg font-semibold text-white/90 max-w-xs leading-snug">
              Smart Power. Cool Comfort. Brighter Futures.
            </p>
            <p className="mt-3 text-sm text-white/55 max-w-sm leading-relaxed">
              Solar power, electrical works, air conditioning and energy-saving solutions for homes and businesses across Ghana.
            </p>
            <SocialLinks className="mt-6" showLabels />
            {social.whatsapp_channel_url && (
              <a
                href={social.whatsapp_channel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 text-sm font-bold text-white transition hover:bg-[#1ebe5a] sm:w-auto"
              >
                <WhatsAppIcon width={18} height={18} /> Join our WhatsApp Channel
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="text-sm font-semibold text-white/50 mb-3">Quick Links</h3>
              <ul className="text-[15px] md:space-y-1.5">
                {[
                  ["/", "Home"],
                  ["/about", "About"],
                  ["/services", "Services"],
                  ["/projects", "Projects"],
                  ["/contact", "Contact"],
                  ["/quote", "Request a Quote"],
                ].map(([to, label]) => (
                  <li key={to}>
                    <Link to={to} className={linkCls}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white/50 mb-3">Services</h3>
              <ul className="text-[15px] md:space-y-1.5">
                {services.map((s) => (
                  <li key={s.id}>
                    <Link to={`/services/${s.slug}`} className={linkCls}>{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-semibold text-white/50 mb-3">Contact</h3>
              <address className="not-italic space-y-3 text-[15px] text-white/80">
                <p className="flex gap-2.5">
                  <MapIcon className="shrink-0 mt-0.5 text-solar" width={18} height={18} />
                  <span className="min-w-0">
                    {contact.headquarters}
                    <br />
                    <span className="text-white/50 text-sm">Digital Address: {contact.digital_address}</span>
                  </span>
                </p>
                <ul>
                  {contact.phones.map((p) => (
                    <li key={p}>
                      <a href={telLink(p)} className="flex min-h-[44px] items-center gap-2.5 transition-colors hover:text-solar md:min-h-0 md:py-1">
                        <PhoneIcon className="shrink-0 text-solar" width={18} height={18} />
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
                {contact.email && (
                  <a href={`mailto:${contact.email}`} className="block break-all hover:text-solar">
                    {contact.email}
                  </a>
                )}
                <p className="flex items-center gap-2.5 text-sm text-white/70">
                  <ClockIcon className="shrink-0 text-solar" width={18} height={18} />
                  {contact.business_hours}
                </p>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/45 sm:flex-row sm:text-left">
          <p>© 2026 {contact.company_name}. All Rights Reserved.</p>
          <p>Service areas: {contact.service_areas.join(" · ")}</p>
        </div>
        <div className="mt-4 text-center">
          <Link to="/admin" className="inline-flex min-h-[44px] items-center px-3 text-[11px] text-white/25 transition-colors hover:text-white/50">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
