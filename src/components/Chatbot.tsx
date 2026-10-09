import { useEffect, useRef, useState } from "react";
import { useSite } from "@/context/SiteContext";
import { CloseIcon, MailIcon, SunIcon } from "./Icons";
import { cn } from "@/utils/cn";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  label: string;
  action: () => void;
}

export function Chatbot() {
  const { data, whatsappLink, telLink } = useSite();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [nudge, setNudge] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const KEY = "luminex_chatbot_seen";

  // One friendly nudge per visit
  useEffect(() => {
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch {
      /* storage unavailable */
    }
    const show = setTimeout(() => setNudge(true), 9000);
    const hide = setTimeout(() => dismissNudge(), 9000 + 8000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add welcome message on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: "Hello! Welcome to Luminex Energy Solutions. How can I help you today?",
        timestamp: new Date(),
      }]);
    }
  }, [open]);

  const dismissNudge = () => {
    setNudge(false);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const close = () => setOpen(false);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || typing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage, timestamp: new Date() }]);
    setTyping(true);

    // Simulate AI response
    const response = await generateResponse(userMessage);
    setTyping(false);
    setMessages((prev) => [...prev, { role: "assistant", content: response, timestamp: new Date() }]);
  };

  const handleQuickAction = (action: () => void) => {
    action();
    setOpen(false);
  };

  const quickActions: QuickAction[] = [
    { label: "Request a Quote", action: () => window.location.href = "/quote" },
    { label: "View Services", action: () => window.location.href = "/services" },
    { label: "See Projects", action: () => window.location.href = "/projects" },
    { label: "Contact Us", action: () => window.location.href = "/contact" },
    { label: "Call Us", action: () => window.location.href = telLink(data.contact.phones[0] ?? "") },
    { label: "WhatsApp", action: () => window.open(whatsappLink(), "_blank") },
  ];

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3">
      {nudge && (
        <div className="relative max-w-[280px] animate-[bubbleIn_0.4s_ease-out] rounded-2xl rounded-br-md bg-white py-3 pl-4 pr-9 text-sm shadow-premium ring-1 ring-charcoal/5">
          <button onClick={() => { setOpen(true); dismissNudge(); }} className="block font-semibold text-charcoal leading-snug w-full text-left">
            Need help? <span className="text-[#168a45]">Chat with Luminex Assistant</span>
          </button>
          <button onClick={dismissNudge} aria-label="Dismiss" className="absolute right-1 top-1 grid h-8 w-8 place-items-center rounded-full text-charcoal/40 hover:text-charcoal">
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative grid h-14 w-14 place-items-center rounded-full transition-transform hover:scale-105 active:scale-95",
          "bg-gradient-to-br from-energy via-energy to-fresh text-white shadow-[0_12px_30px_-8px_rgba(8,121,201,0.5)]"
        )}
        aria-label={open ? "Close chat" : "Open chat with Luminex Assistant"}
        aria-expanded={open}
        aria-controls="chat-window"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-energy via-energy to-fresh opacity-40 animate-ping [animation-duration:2.5s]" aria-hidden />
        {open ? (
          <CloseIcon width={28} height={28} className="relative" />
        ) : (
          <MessageIcon width={28} height={28} className="relative" />
        )}
<SunIcon
                className="absolute -top-1 -right-1 h-6 w-6 text-solar animate-bounce"
                aria-hidden
              />
      </button>

      <div
        id="chat-window"
        ref={chatContainerRef}
        className={cn(
          "fixed bottom-16 right-[max(1.25rem,env(safe-area-inset-right))] z-40 w-full max-w-sm sm:max-w-md lg:max-w-lg h-[500px] sm:h-[600px] bg-white rounded-2xl shadow-premium ring-1 ring-charcoal/5 overflow-hidden transition-all duration-300",
          open ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Luminex Energy Solutions Chat Assistant"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal/10 bg-gradient-to-r from-energy to-fresh text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
<SunIcon width={20} height={20} />
            </div>
            <div>
              <p className="font-semibold">Luminex Assistant</p>
              <p className="text-xs opacity-80">Online • Typically replies in seconds</p>
            </div>
          </div>
          <button onClick={close} aria-label="Close chat" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesEndRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={cn("flex gap-3 max-w-[85%]", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <div className={cn("flex-1 min-w-0", msg.role === "user" ? "text-right" : "")}>
                <div className={cn(
                  "inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  msg.role === "user"
                    ? "bg-charcoal text-white rounded-tr-none"
                    : "bg-soft text-charcoal rounded-tl-none"
                )}>
                  {msg.content}
                </div>
                <p className={cn("mt-1 text-[10px] opacity-50", msg.role === "user" ? "text-right" : "")}>
                  {msg.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-soft flex items-center justify-center flex-shrink-0">
<SunIcon width={18} height={18} className="text-energy" />
              </div>
              <div className="bg-soft rounded-2xl rounded-tl-none px-4 py-2.5">
                <div className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-energy/50 animate-bounce [animation-delay:0ms]"></span>
                  <span className="h-2 w-2 rounded-full bg-energy/50 animate-bounce [animation-delay:150ms]"></span>
                  <span className="h-2 w-2 rounded-full bg-energy/50 animate-bounce [animation-delay:300ms]"></span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions (when no messages or at bottom) */}
        {(messages.length <= 1 || typing) && (
          <div className="px-4 pb-3 border-t border-charcoal/5">
            <p className="text-xs text-charcoal/50 mb-2 text-center">Quick actions</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.slice(0, 4).map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.action)}
                  className="px-3 py-2 rounded-xl bg-soft text-sm font-medium text-charcoal hover:bg-energy/10 hover:text-energy transition-colors min-h-[44px]"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-charcoal/10 bg-white/50 backdrop-blur">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about solar, electrical, AC, energy savings…"
              className="flex-1 min-h-[48px] px-4 py-2 rounded-xl border border-charcoal/12 bg-white text-sm text-charcoal placeholder:text-charcoal/35 focus:border-energy focus:ring-2 focus:ring-energy/20 outline-none transition"
              disabled={typing}
              aria-label="Type your message"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="min-h-[48px] px-5 rounded-xl bg-charcoal text-white text-sm font-semibold hover:bg-[#1c2733] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-charcoal/40">
            AI assistant • May make mistakes • <a href="/contact" className="text-energy hover:underline">Contact us directly</a> for important matters
          </p>
        </form>
      </div>
    </div>
  );
}

async function generateResponse(userInput: string): Promise<string> {
  const input = userInput.toLowerCase();
  
  // Company overview
  if (input.includes("who") && (input.includes("are") || input.includes("luminex") || input.includes("company"))) {
    return "Luminex Energy Solutions is a Ghanaian energy company established in September 2026, headquartered in Cape Coast. We provide reliable solar power systems, professional electrical works, premium air conditioning, and energy-saving solutions for homes, businesses, and institutions across Ghana. Our mission is to keep Ghanaian homes and businesses reliably powered and comfortably cooled through safe, efficient, and affordable engineering.";
  }
  
  // Services
  if (input.includes("service") || input.includes("what do you do") || input.includes("offer")) {
    return "We offer four connected services:\n\n• **Solar Power** – Complete solar system design, installation & maintenance (grid-tied, hybrid, off-grid)\n• **Electrical Works** – Wiring, rewiring, distribution boards, lighting, fault finding, generator changeovers\n• **Air Conditioning** – Supply, installation, deep cleaning, gas top-up, repairs, relocation\n• **Energy Savings** – Consumption assessments, LED conversions, efficient AC recommendations, smart controls, solar-readiness evaluations\n\nAll services are delivered by one accountable team. Visit our Services page for details.";
  }
  
  // Solar
  if (input.includes("solar") || input.includes("panel") || input.includes("battery") || input.includes("inverter")) {
    return "Our solar solutions include site assessment, load analysis, system design (grid-tied, hybrid, off-grid), panel/inverter/battery supply & installation, backup power systems, monitoring setup, and scheduled maintenance. We size systems to your actual consumption — not oversold, not under-built. We serve Accra, Cape Coast, Kumasi, Sunyani, Takoradi, and nationwide.";
  }
  
  // Electrical
  if (input.includes("electrical") || input.includes("wiring") || input.includes("rewir") || input.includes("distribution board") || input.includes("generator")) {
    return "We handle complete wiring for new buildings, rewiring & upgrades for older properties, distribution boards/breakers/earthing, lighting design & installation, fault finding & equipment repairs, and generator/changeover connections. Safety is our priority — proper sizing, proper protection, and proper testing on every job.";
  }
  
  // Air Conditioning
  if (input.includes("air condition") || input.includes("ac ") || input.includes("cooling") || input.includes("split") || input.includes("cassette")) {
    return "We supply, install, and service split, cassette, and standing AC units. Services include professional installation & piping, deep cleaning & chemical servicing, gas top-up & leak repair, compressor & electrical fault repairs, and unit relocation. We recommend deep service every 3–6 months depending on use. Correct sizing and installation make the difference between an AC that lasts and one that keeps failing.";
  }
  
  // Energy Savings
  if (input.includes("energy saving") || input.includes("efficienc") || input.includes("reduce bill") || input.includes("led")) {
    return "Our energy savings services include consumption assessments, LED lighting conversions, efficient AC/appliance recommendations, smart controls/timers/sensors, power-quality & load-balancing checks, and solar-readiness evaluations. We help you understand where your energy goes and recommend practical upgrades that pay for themselves.";
  }
  
  // Projects
  if (input.includes("project") || input.includes("portfolio") || input.includes("work") || input.includes("installation")) {
    return "We have completed solar, electrical, and air-conditioning installations across Ghana. You can view our project portfolio on the Projects page, filtered by category (Solar, Electrical, Air Conditioning, Energy Efficiency). Each project shows location, category, description, and photos/videos.";
  }
  
  // Quote
  if (input.includes("quote") || input.includes("price") || input.includes("cost") || input.includes("quotation")) {
    return "You can request a quote on our Quote page — it takes less than a minute. We'll review your details, arrange an assessment if needed, and send a clear, itemised quotation. No obligation. You can also call or WhatsApp us directly for urgent requests.";
  }
  
  // Contact
  if (input.includes("contact") || input.includes("call") || input.includes("phone") || input.includes("email") || input.includes("where") || input.includes("location") || input.includes("address")) {
    const contact = data?.contact || {};
    return `You can reach us:\n\n📞 **Phone:** ${contact.phones?.[0] || "+233 25 647 8208"}\n📱 **WhatsApp:** ${contact.whatsapp || "+233 24 548 7608"}\n📍 **Headquarters:** ${contact.headquarters || "Cape Coast, Central Region, Ghana"}\n📧 **Email:** ${contact.email || "Not publicly listed"}\n\n**Service areas:** ${contact.service_areas?.join(", ") || "Accra, Cape Coast, Kumasi, Sunyani, Takoradi"}\n**Hours:** ${contact.business_hours || "Monday – Friday"}\n\nVisit our Contact page for a quote form and more details.`;
  }
  
  // FAQ
  if (input.includes("faq") || input.includes("question") || input.includes("how long") || input.includes("warranty") || input.includes("maintenance")) {
    return "Common questions:\n\n• **Areas served:** Accra, Cape Coast, Kumasi, Sunyani, Takoradi, and nationwide\n• **Quote process:** Fill the form, call, or WhatsApp → we discuss → assessment if needed → clear quotation\n• **Solar + AC together:** Yes! We design systems where cooling load is accounted for from the start\n• **Service existing systems:** Yes, after initial inspection\n• **Warranty:** Installations and applicable parts are supported by warranty per our terms\n\nCheck our FAQs on the Services page for more.";
  }
  
  // Default fallback
  const fallbacks = [
    "I can help you with information about our solar, electrical, air conditioning, and energy savings services. What would you like to know?",
    "For detailed questions, you can visit our Services page, request a Quote, or Contact us directly. How else can I assist?",
    "I'm here to help with Luminex Energy Solutions information. You can ask about our services, projects, or request a quote!",
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}