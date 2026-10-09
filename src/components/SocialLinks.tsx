import { useSite } from "@/context/SiteContext";
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon, XIcon } from "./Icons";
import { cn } from "@/utils/cn";

export function SocialLinks({ className, dark = false, showLabels = false }: { className?: string; dark?: boolean; showLabels?: boolean }) {
  const { data, whatsappLink } = useSite();
  const s = data.social;
  // WhatsApp Channel is the most important channel → listed first and highlighted.
  const items = [
    { Icon: WhatsAppIcon, label: s.whatsapp_label, url: s.whatsapp_channel_url || whatsappLink(), name: "WhatsApp Channel", featured: true },
    { Icon: FacebookIcon, label: s.facebook_label, url: s.facebook_url, name: "Facebook", featured: false },
    { Icon: InstagramIcon, label: s.instagram_label, url: s.instagram_url, name: "Instagram", featured: false },
    { Icon: XIcon, label: s.x_label, url: s.x_url, name: "X", featured: false },
    { Icon: TikTokIcon, label: s.tiktok_label, url: s.tiktok_url, name: "TikTok", featured: false },
  ];

  if (showLabels) {
    return (
      <ul className={cn("space-y-2", className)}>
        {items.map(({ Icon, label, url, name, featured }) => {
          const inner = (
            <>
              <span
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-lg",
                  featured ? "bg-[#25D366] text-white" : dark ? "bg-soft text-charcoal" : "bg-white/10 text-white"
                )}
              >
                <Icon />
              </span>
              <span>
                <span className={cn("block text-xs", dark ? "text-charcoal/50" : "text-white/50")}>
                  {name}
                  {featured && <span className="ml-1.5 rounded-full bg-[#25D366]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#168a45]">Follow us here</span>}
                </span>
                <span className={cn("block text-sm font-semibold", dark ? "text-charcoal" : "text-white")}>{label}</span>
              </span>
            </>
          );
          return (
            <li key={name}>
              {url ? (
                <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 py-1 hover:opacity-80">
                  {inner}
                </a>
              ) : (
                <span className="flex items-center gap-3 py-1">{inner}</span>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map(({ Icon, label, url, name, featured }) => {
        const cls = cn(
          "grid h-11 w-11 place-items-center rounded-xl transition-all hover:-translate-y-0.5",
          featured
            ? "bg-[#25D366] text-white hover:bg-[#1ebe5a]"
            : dark
              ? "bg-soft text-charcoal hover:bg-ice hover:text-energy"
              : "bg-white/10 text-white hover:bg-solar hover:text-charcoal"
        );
        return (
          <li key={name}>
            {url ? (
              <a href={url} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${name}: ${label}`} title={`${name} — ${label}`}>
                <Icon />
              </a>
            ) : (
              <span className={cn(cls, "cursor-default")} aria-label={`${name}: ${label}`} title={label}>
                <Icon />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
