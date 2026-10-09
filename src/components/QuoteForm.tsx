import { useState, type FormEvent } from "react";
import { CONTACT_METHODS, PROPERTY_TYPES, SERVICE_OPTIONS } from "@/lib/defaults";
import { submitQuote, uploadQuoteAttachment } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useSite } from "@/context/SiteContext";
import { Button } from "./ui";
import { CheckIcon, MailIcon, WhatsAppIcon } from "./Icons";
import { cn } from "@/utils/cn";

const inputCls =
  "w-full min-w-0 rounded-xl border border-charcoal/12 bg-white px-4 min-h-[48px] text-base sm:text-[15px] text-charcoal placeholder:text-charcoal/35 focus:border-energy focus:ring-2 focus:ring-energy/20 outline-none transition";
const labelCls = "block text-sm font-semibold text-charcoal mb-1.5";

const empty = {
  full_name: "",
  phone: "",
  email: "",
  location: "",
  service: "",
  property_type: "",
  contact_method: "",
  description: "",
};

type Method = "online" | "whatsapp" | "sms";

/**
 * Layout is driven by the FORM's own width (container queries: @md, @xl),
 * so it adapts correctly whether it sits full-width on a phone, in a
 * narrow side column on a laptop, or centred on a wide monitor.
 */
export function QuoteForm({
  compact = false,
  defaultService,
  defaultLocation,
}: {
  compact?: boolean;
  defaultService?: string;
  defaultLocation?: string;
}) {
  const { data, whatsappLink, smsLink } = useSite();
  const [form, setForm] = useState({ ...empty, service: defaultService ?? "", location: defaultLocation ?? "" });
  const [file, setFile] = useState<File | null>(null);
  const [method, setMethod] = useState<Method>(isSupabaseConfigured ? "online" : "whatsapp");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [sentLink, setSentLink] = useState("");
  const [sentMethod, setSentMethod] = useState<Method>("online");

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const methods: { id: Method; label: string; hint: string }[] = [
    ...(isSupabaseConfigured ? [{ id: "online" as Method, label: "Online request", hint: "Sent straight to our team" }] : []),
    { id: "whatsapp", label: "WhatsApp", hint: "Opens WhatsApp with your details" },
    { id: "sms", label: "SMS", hint: "Opens your messages app" },
  ];

  const validate = () => {
    if (form.full_name.trim().length < 2) return "Please enter your full name.";
    if (!/^[+\d][\d\s()-]{7,}$/.test(form.phone.trim())) return "Please enter a valid phone number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
    if (!form.location.trim()) return "Please enter your location.";
    if (!form.service) return "Please select the service you need.";
    if (!form.property_type) return "Please select your property type.";
    if (!form.contact_method) return "Please choose how we should contact you.";
    if (form.description.trim().length < 10) return "Please describe your project briefly (at least 10 characters).";
    if (method === "online" && file && file.size > 5 * 1024 * 1024) return "Attachment must be under 5MB.";
    return "";
  };

  const buildMessage = () =>
    [
      `Hello ${data.contact.company_name}, I would like to request a quote.`,
      "",
      `Name: ${form.full_name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : "",
      `Location: ${form.location}`,
      `Service: ${form.service}`,
      `Property type: ${form.property_type}`,
      `Preferred contact: ${form.contact_method}`,
      "",
      `Project: ${form.description}`,
    ]
      .filter((l, i, arr) => l !== "" || (arr[i - 1] !== "" && i !== arr.length - 1))
      .join("\n");

  const openLink = (link: string, m: Method) => {
    if (m === "sms") {
      window.location.href = link;
    } else {
      const w = window.open(link, "_blank", "noopener,noreferrer");
      if (!w) window.location.href = link; // popup blocked → navigate instead
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");

    // WhatsApp / SMS: open the app immediately (must run inside the click gesture)
    if (method !== "online") {
      const link = method === "whatsapp" ? whatsappLink(buildMessage()) : smsLink(buildMessage());
      setSentLink(link);
      setSentMethod(method);
      // Also keep a copy for the admin when the database is connected (best effort)
      if (isSupabaseConfigured) submitQuote({ ...form, attachment_url: null }).catch((err) => console.error(err));
      openLink(link, method);
      setState("done");
      return;
    }

    setState("sending");
    try {
      let attachment_url: string | null = null;
      if (file) attachment_url = await uploadQuoteAttachment(file);
      await submitQuote({ ...form, attachment_url });
      setSentMethod("online");
      setState("done");
    } catch (err) {
      console.error(err);
      setError("We could not send your request online right now. Please choose WhatsApp or SMS instead.");
      setState("error");
    }
  };

  if (state === "done") {
    const viaApp = sentMethod !== "online";
    const appName = sentMethod === "sms" ? "your messages app" : "WhatsApp";
    return (
      <div className="rounded-2xl bg-white p-6 sm:p-10 text-center shadow-card ring-1 ring-charcoal/5">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-fresh/15 text-fresh">
          <CheckIcon width={32} height={32} />
        </span>
        <h3 className="mt-5 text-2xl font-bold">
          {viaApp ? "Almost there" : "Thank you"}, {form.full_name.split(" ")[0]}.
        </h3>
        <p className="mt-3 text-charcoal/65 leading-relaxed max-w-md mx-auto">
          {viaApp
            ? `Your request is ready in ${appName}. Just press send and it goes straight to the Luminex team — we'll reply on ${form.contact_method.toLowerCase()}.`
            : `Your quote request has been received. A member of the Luminex team will contact you via ${form.contact_method.toLowerCase()} to discuss your ${form.service.toLowerCase()} requirements.`}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          {viaApp && (
            <Button href={sentLink} target={sentMethod === "sms" ? undefined : "_blank"} rel="noreferrer" variant="primary">
              {sentMethod === "sms" ? <MailIcon width={18} height={18} /> : <WhatsAppIcon />} Open {sentMethod === "sms" ? "SMS" : "WhatsApp"} again
            </Button>
          )}
          <Button
            onClick={() => {
              setForm({ ...empty });
              setFile(null);
              setState("idle");
            }}
            variant="outline"
          >
            Submit another request
          </Button>
        </div>
        {data.social.whatsapp_channel_url && (
          <a
            href={data.social.whatsapp_channel_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-[#168a45] hover:underline"
          >
            <WhatsAppIcon width={18} height={18} /> Follow our WhatsApp Channel for updates
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="@container rounded-2xl bg-white p-5 sm:p-8 shadow-card ring-1 ring-charcoal/5">
      <div className={cn("grid grid-cols-1 @md:grid-cols-2", compact ? "gap-4" : "gap-5")}>
        <div>
          <label htmlFor="q-name" className={labelCls}>Full Name</label>
          <input id="q-name" className={inputCls} value={form.full_name} onChange={set("full_name")} autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="q-phone" className={labelCls}>Phone Number</label>
          <input id="q-phone" type="tel" inputMode="tel" className={inputCls} value={form.phone} onChange={set("phone")} placeholder="+233 ..." autoComplete="tel" required />
        </div>
        <div>
          <label htmlFor="q-email" className={labelCls}>Email <span className="text-charcoal/40 font-normal">(optional)</span></label>
          <input id="q-email" type="email" inputMode="email" className={inputCls} value={form.email} onChange={set("email")} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="q-location" className={labelCls}>Location</label>
          <input id="q-location" className={inputCls} value={form.location} onChange={set("location")} placeholder="e.g. Kumasi, Ahodwo" list="q-cities" required />
          <datalist id="q-cities">
            {data.contact.service_areas.map((a) => <option key={a} value={a} />)}
          </datalist>
        </div>
        <div>
          <label htmlFor="q-service" className={labelCls}>Service Required</label>
          <select id="q-service" className={inputCls} value={form.service} onChange={set("service")} required>
            <option value="">Select a service</option>
            {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="q-property" className={labelCls}>Property Type</label>
          <select id="q-property" className={inputCls} value={form.property_type} onChange={set("property_type")} required>
            <option value="">Select property type</option>
            {PROPERTY_TYPES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="@md:col-span-2">
          <span className={labelCls}>Preferred Contact Method</span>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferred contact method">
            {CONTACT_METHODS.map((m) => (
              <label
                key={m}
                className={`cursor-pointer rounded-xl border px-4 min-h-[44px] inline-flex items-center text-sm font-medium transition ${
                  form.contact_method === m ? "border-energy bg-ice text-energy" : "border-charcoal/12 text-charcoal/70 hover:border-charcoal/30"
                }`}
              >
                <input type="radio" name="contact_method" value={m} className="sr-only" checked={form.contact_method === m} onChange={set("contact_method")} />
                {m}
              </label>
            ))}
          </div>
        </div>
        <div className="@md:col-span-2">
          <label htmlFor="q-desc" className={labelCls}>Project Description</label>
          <textarea id="q-desc" rows={compact ? 3 : 4} className={`${inputCls} py-3`} value={form.description} onChange={set("description")} placeholder="Tell us about the space, what you need, and any timelines." required />
        </div>

        {/* Choose how to send */}
        <div className="@md:col-span-2 rounded-xl bg-soft p-3 @md:p-4">
          <span className={labelCls}>Send my request via <span className="text-charcoal/40 font-normal">(your choice)</span></span>
          <div
            className={cn("grid grid-cols-1 gap-2", methods.length === 3 ? "@xl:grid-cols-3" : "@md:grid-cols-2")}
            role="radiogroup"
            aria-label="How to send your request"
          >
            {methods.map((m) => (
              <label
                key={m.id}
                className={cn(
                  "cursor-pointer rounded-xl border bg-white p-3 transition min-h-[56px] flex items-center gap-3",
                  method === m.id ? "border-energy ring-2 ring-energy/20" : "border-charcoal/10 hover:border-charcoal/30"
                )}
              >
                <input type="radio" name="send_method" className="sr-only" checked={method === m.id} onChange={() => setMethod(m.id)} />
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                    m.id === "whatsapp" ? "bg-[#25D366] text-white" : m.id === "sms" ? "bg-energy text-white" : "bg-charcoal text-white"
                  )}
                >
                  {m.id === "whatsapp" ? <WhatsAppIcon width={18} height={18} /> : m.id === "sms" ? <MailIcon width={18} height={18} /> : <CheckIcon width={18} height={18} />}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold">{m.label}</span>
                  <span className="block text-[11px] leading-tight text-charcoal/55">{m.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {method === "online" && (
          <div className="@md:col-span-2">
            <label htmlFor="q-file" className={labelCls}>Image / File <span className="text-charcoal/40 font-normal">(optional, max 5MB)</span></label>
            <input
              id="q-file"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full min-w-0 text-sm text-charcoal/70 file:mr-3 file:rounded-lg file:border-0 file:bg-soft file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-charcoal hover:file:bg-ice"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 @md:flex-row @md:items-center">
        <Button type="submit" variant="primary" disabled={state === "sending"} className="w-full @md:w-auto @md:px-8">
          {state === "sending" ? "Sending…" : "Request My Quote"}
        </Button>
        <p className="text-xs text-charcoal/50">
          {method === "online" ? "" : `Next step: ${method === "whatsapp" ? "WhatsApp" : "your messages app"} opens with your details ready to send. `}
          We respond {data.contact.business_hours}.
        </p>
      </div>
    </form>
  );
}
