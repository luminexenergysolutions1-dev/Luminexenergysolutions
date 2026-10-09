import { useSite } from "@/context/SiteContext";
import { ArrowIcon, WhatsAppIcon } from "./Icons";

/** Promotes the official WhatsApp Channel (URL comes from Admin Portal → Social Media). */
export function ChannelBanner() {
  const { data } = useSite();
  const url = data.social.whatsapp_channel_url;
  if (!url) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b3d2e] via-[#0f5a3f] to-[#128c4a] px-6 py-10 text-white sm:px-12 sm:py-12">
      <WhatsAppIcon className="pointer-events-none absolute -right-8 -top-8 h-56 w-56 text-white/[0.07]" width={224} height={224} />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-solar/25 blur-3xl" aria-hidden />
      <div className="relative grid items-center gap-6 lg:grid-cols-[auto_1fr_auto]">
        <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-[#25D366] shadow-[0_12px_30px_-8px_rgba(37,211,102,0.8)]">
          <span className="absolute inset-0 rounded-2xl bg-[#25D366] opacity-40 animate-ping [animation-duration:3s]" aria-hidden />
          <WhatsAppIcon width={34} height={34} className="relative" />
        </span>
        <div>
          <p className="text-sm font-semibold text-solar">Official WhatsApp Channel</p>
          <h3 className="mt-1 text-2xl font-bold leading-tight sm:text-3xl">Stay powered with Luminex.</h3>
          <p className="mt-2 max-w-xl leading-relaxed text-white/75">
            Follow the channel for announcements, energy-saving tips and service updates — straight to your phone, no sign-up needed.
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-[15px] font-bold text-[#0b3d2e] transition hover:bg-solar active:scale-[0.98] lg:w-auto"
        >
          Join the Channel <ArrowIcon width={18} height={18} />
        </a>
      </div>
    </div>
  );
}
