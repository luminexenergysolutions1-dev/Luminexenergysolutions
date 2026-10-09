import { useEffect, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { CloseIcon, WhatsAppIcon } from "./Icons";

const KEY = "luminex_chat_nudge_seen";

export function WhatsAppButton() {
  const { whatsappLink } = useSite();
  const [nudge, setNudge] = useState(false);

  // One friendly, dismissible nudge per visit — never repeats.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      /* storage unavailable */
    }
    const show = setTimeout(() => setNudge(true), 9000);
    const hide = setTimeout(() => dismiss(), 9000 + 8000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const dismiss = () => {
    setNudge(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3">
      {nudge && (
        <div className="relative max-w-[240px] animate-[bubbleIn_0.4s_ease-out] rounded-2xl rounded-br-md bg-white py-3 pl-4 pr-9 text-sm shadow-premium ring-1 ring-charcoal/5">
          <a href={whatsappLink()} target="_blank" rel="noreferrer" onClick={dismiss} className="block font-semibold text-charcoal leading-snug">
            Need help choosing? <span className="text-[#168a45]">Chat with Luminex on WhatsApp</span>
          </a>
          <button onClick={dismiss} aria-label="Dismiss" className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full text-charcoal/40 hover:text-charcoal">
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      )}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Luminex on WhatsApp"
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition-transform hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-40 animate-ping [animation-duration:2.5s]" aria-hidden />
        <WhatsAppIcon width={28} height={28} className="relative" />
      </a>
    </div>
  );
}
