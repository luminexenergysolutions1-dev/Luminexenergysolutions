import { useEffect, useMemo, useState } from "react";
import { deleteMedia, fetchQuotes, listMedia, updateQuoteStatus, uploadMedia } from "@/lib/api";
import { QUOTE_STATUSES } from "@/lib/defaults";
import type { MediaItem, QuoteRequest, QuoteStatus } from "@/lib/types";
import { AdminPageTitle } from "./AdminLayout";
import { inputCls } from "./fields";
import { cn } from "@/utils/cn";

const statusColor: Record<QuoteStatus, string> = {
  New: "bg-solar/25 text-charcoal",
  Contacted: "bg-ice text-energy",
  "Assessment Scheduled": "bg-energy/15 text-energy-dark",
  Quoted: "bg-purple-100 text-purple-700",
  Completed: "bg-fresh/15 text-fresh",
  Cancelled: "bg-charcoal/8 text-charcoal/60",
};

export function QuotesAdmin() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [open, setOpen] = useState<QuoteRequest | null>(null);
  const [err, setErr] = useState("");

  const load = () => fetchQuotes().then(setQuotes).catch((e) => setErr(e.message));
  useEffect(() => {
    load();
  }, []);

  const list = useMemo(() => {
    const s = q.toLowerCase();
    return quotes.filter(
      (x) =>
        (status === "All" || x.status === status) &&
        (!s || [x.full_name, x.phone, x.email, x.location, x.service, x.property_type].join(" ").toLowerCase().includes(s))
    );
  }, [quotes, q, status]);

  const setQuoteStatus = async (id: string, st: QuoteStatus) => {
    await updateQuoteStatus(id, st);
    setQuotes((all) => all.map((x) => (x.id === id ? { ...x, status: st } : x)));
    setOpen((o) => (o && o.id === id ? { ...o, status: st } : o));
  };

  return (
    <>
      <AdminPageTitle title="Quote Requests" intro={`${quotes.length} total · ${quotes.filter((x) => x.status === "New").length} new`} />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input className={cn(inputCls, "sm:max-w-xs")} placeholder="Search name, phone, location…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {["All", ...QUOTE_STATUSES].map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={cn("whitespace-nowrap rounded-full px-4 min-h-[40px] text-xs font-semibold", status === s ? "bg-charcoal text-white" : "bg-white ring-1 ring-charcoal/10")}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
      {list.length === 0 ? (
        <div className="rounded-2xl bg-white ring-1 ring-charcoal/6 p-10 text-center text-sm text-charcoal/50">No quote requests match.</div>
      ) : (
        <ul className="grid gap-3">
          {list.map((x) => (
            <li key={x.id}>
              <button onClick={() => setOpen(x)} className="w-full text-left rounded-2xl bg-white ring-1 ring-charcoal/6 p-4 hover:ring-charcoal/20 transition">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{x.full_name}</p>
                    <p className="text-xs text-charcoal/55">{x.service} · {x.property_type} · {x.location}</p>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", statusColor[x.status])}>{x.status}</span>
                </div>
                <p className="mt-2 text-sm text-charcoal/70 line-clamp-2">{x.description}</p>
                <p className="mt-2 text-xs text-charcoal/45">{new Date(x.created_at).toLocaleString("en-GB")}</p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => setOpen(null)}>
          <div className="w-full max-w-xl max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">{open.full_name}</h2>
                <p className="text-xs text-charcoal/50">Submitted {new Date(open.created_at).toLocaleString("en-GB")}</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", statusColor[open.status])}>{open.status}</span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ["Phone", <a key="p" href={`tel:${open.phone}`} className="text-energy font-semibold">{open.phone}</a>],
                ["Email", open.email ? <a key="e" href={`mailto:${open.email}`} className="text-energy font-semibold">{open.email}</a> : "—"],
                ["Location", open.location],
                ["Service", open.service],
                ["Property type", open.property_type],
                ["Preferred contact", open.contact_method],
              ].map(([k, v]) => (
                <div key={String(k)}>
                  <dt className="text-xs text-charcoal/50">{k}</dt>
                  <dd className="font-medium break-words">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <p className="text-xs text-charcoal/50">Description</p>
              <p className="mt-1 text-sm whitespace-pre-line">{open.description}</p>
            </div>
            {open.attachment_url && (
              <a href={open.attachment_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-energy">View attachment →</a>
            )}
            <label className="block mt-5">
              <span className="block text-sm font-semibold mb-1.5">Status</span>
              <select className={inputCls} value={open.status} onChange={(e) => setQuoteStatus(open.id, e.target.value as QuoteStatus)}>
                {QUOTE_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={`https://wa.me/${open.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="min-h-[44px] inline-flex items-center rounded-lg bg-[#25D366] text-white px-4 text-sm font-semibold">WhatsApp customer</a>
              <button onClick={() => setOpen(null)} className="min-h-[44px] rounded-lg px-4 text-sm font-semibold hover:bg-soft">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function MediaAdmin() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState("");

  const load = () => listMedia().then(setItems).catch((e) => setErr(e.message));
  useEffect(() => {
    load();
  }, []);

  const upload = async (files: FileList | null) => {
    if (!files) return;
    setBusy(true);
    setErr("");
    try {
      for (const f of Array.from(files)) await uploadMedia(f);
      await load();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (name: string) => {
    if (!confirm("Delete this media? Pages using it will show a broken image/video until replaced.")) return;
    await deleteMedia(name);
    load();
  };

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <>
      <AdminPageTitle
        title="Media Library"
        intro="Upload images and videos once, then assign them to the hero, services or projects. Use WebP or compressed JPG under 5MB, and MP4/WebM videos under 50MB for best performance."
        actions={
          <label className="min-h-[44px] inline-flex items-center rounded-lg bg-charcoal px-4 text-sm font-semibold text-white cursor-pointer">
            {busy ? "Uploading…" : "Upload media"}
            <input type="file" accept="image/*,video/*" multiple className="sr-only" onChange={(e) => upload(e.target.files)} />
          </label>
        }
      />
      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}
      {items.length === 0 ? (
        <div className="rounded-2xl bg-white ring-1 ring-charcoal/6 p-10 text-center text-sm text-charcoal/50">No media uploaded yet.</div>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((m) => (
            <li key={m.name} className="rounded-xl bg-white ring-1 ring-charcoal/6 overflow-hidden">
              <div className="aspect-[4/3] bg-soft relative">
                {m.type === "video" ? (
                  <>
                    <video src={m.url} poster={m.thumbnail} muted loop playsInline className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                  </>
                ) : (
                  <img src={m.url} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-2.5">
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[11px] text-charcoal/60 truncate" title={m.name}>{m.name}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-ice text-energy">{m.type}</span>
                </div>
                <div className="mt-1.5 flex gap-1">
                  <button onClick={() => copy(m.url)} className="flex-1 min-h-[36px] rounded-md bg-soft text-xs font-semibold">{copied === m.url ? "Copied" : "Copy URL"}</button>
                  <button onClick={() => remove(m.name)} className="min-h-[36px] px-2.5 rounded-md text-xs font-semibold text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
