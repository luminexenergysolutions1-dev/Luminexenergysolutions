import { useEffect, useState, type ReactNode } from "react";
import { listMedia, uploadMedia } from "@/lib/api";
import type { MediaItem } from "@/lib/types";
import { cn } from "@/utils/cn";

export const inputCls =
  "w-full rounded-lg border border-charcoal/12 bg-white px-3.5 min-h-[44px] text-sm text-charcoal focus:border-energy focus:ring-2 focus:ring-energy/20 outline-none";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-charcoal mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-charcoal/50 mt-1">{hint}</span>}
    </label>
  );
}

export function TextInput({ value, onChange, label, hint, type = "text", placeholder }: { value: string; onChange: (v: string) => void; label: string; hint?: string; type?: string; placeholder?: string }) {
  return (
    <Field label={label} hint={hint}>
      <input type={type} className={inputCls} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function TextArea({ value, onChange, label, hint, rows = 4 }: { value: string; onChange: (v: string) => void; label: string; hint?: string; rows?: number }) {
  return (
    <Field label={label} hint={hint}>
      <textarea rows={rows} className={cn(inputCls, "py-2.5")} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

/** Multi-line list editor: one item per line */
export function ListInput({ value, onChange, label, hint }: { value: string[]; onChange: (v: string[]) => void; label: string; hint?: string }) {
  const [text, setText] = useState((value ?? []).join("\n"));
  useEffect(() => setText((value ?? []).join("\n")), [value]);
  return (
    <Field label={label} hint={hint ?? "One item per line"}>
      <textarea
        rows={Math.max(3, (value ?? []).length + 1)}
        className={cn(inputCls, "py-2.5")}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text.split("\n").map((s) => s.trim()).filter(Boolean))}
      />
    </Field>
  );
}

export function PairListInput({ value, onChange, label }: { value: { title: string; body: string }[]; onChange: (v: { title: string; body: string }[]) => void; label: string }) {
  const update = (i: number, k: "title" | "body", v: string) => {
    const next = value.map((it, idx) => (idx === i ? { ...it, [k]: v } : it));
    onChange(next);
  };
  return (
    <div>
      <span className="block text-sm font-semibold text-charcoal mb-2">{label}</span>
      <div className="space-y-3">
        {value.map((it, i) => (
          <div key={i} className="rounded-lg border border-charcoal/10 p-3 grid gap-2 sm:grid-cols-[1fr_2fr_auto]">
            <input className={inputCls} value={it.title} placeholder="Title" onChange={(e) => update(i, "title", e.target.value)} />
            <input className={inputCls} value={it.body} placeholder="Description" onChange={(e) => update(i, "body", e.target.value)} />
            <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="min-h-[44px] px-3 text-sm text-red-600 hover:bg-red-50 rounded-lg">Remove</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...value, { title: "", body: "" }])} className="mt-2 text-sm font-semibold text-energy min-h-[44px]">+ Add item</button>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer min-h-[44px]">
      <span
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={(e) => e.key === " " && onChange(!checked)}
        onClick={() => onChange(!checked)}
        className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-fresh" : "bg-charcoal/20")}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition", checked ? "left-[22px]" : "left-0.5")} />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

/** Image picker: URL input + upload + choose from media library */
export function ImageInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setItems(await listMedia());
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const onUpload = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    setErr("");
    try {
      const m = await uploadMedia(f);
      onChange(m.url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="block text-sm font-semibold text-charcoal mb-1.5">{label}</span>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-soft ring-1 ring-charcoal/10">
          {value && <img src={value} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="flex-1 space-y-2">
          <input className={inputCls} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder="Image URL" />
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center min-h-[40px] px-3 rounded-lg bg-soft text-sm font-semibold cursor-pointer hover:bg-ice">
              {busy ? "Uploading…" : "Upload image"}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onUpload(e.target.files?.[0])} />
            </label>
            <button type="button" onClick={() => { setOpen((o) => !o); if (!open) load(); }} className="min-h-[40px] px-3 rounded-lg bg-soft text-sm font-semibold hover:bg-ice">
              {open ? "Close library" : "Choose from library"}
            </button>
          </div>
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      </div>
      {open && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto rounded-lg border border-charcoal/10 p-2">
          {items.length === 0 && <p className="col-span-full text-xs text-charcoal/50 p-2">No images in the library yet.</p>}
          {items.map((m) => (
            <button key={m.name} type="button" onClick={() => { onChange(m.url); setOpen(false); }} className={cn("aspect-square overflow-hidden rounded-md ring-2", value === m.url ? "ring-energy" : "ring-transparent hover:ring-charcoal/20")}>
              <img src={m.url} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Media picker: supports multiple images and videos with reordering */
export function MediaInput({ media, onChange, label }: { media: ProjectMedia[]; onChange: (v: ProjectMedia[]) => void; label: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setItems(await listMedia());
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const onUpload = async (files: FileList | undefined) => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setErr("");
    try {
      for (const f of Array.from(files)) {
        const m = await uploadMedia(f);
        const type = m.type;
        const newMedia: ProjectMedia = {
          id: crypto.randomUUID(),
          type,
          url: m.url,
          sort_order: media.length,
        };
        onChange([...media, newMedia]);
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const removeMedia = (id: string) => {
    onChange(media.filter((m) => m.id !== id));
  };

  const reorderMedia = (fromIndex: number, toIndex: number) => {
    const newMedia = [...media];
    const [removed] = newMedia.splice(fromIndex, 1);
    newMedia.splice(toIndex, 0, removed);
    newMedia.forEach((m, idx) => { m.sort_order = idx; });
    onChange(newMedia);
  };

  const moveUp = (idx: number) => {
    if (idx > 0) reorderMedia(idx, idx - 1);
  };

  const moveDown = (idx: number) => {
    if (idx < media.length - 1) reorderMedia(idx, idx + 1);
  };

  const handleUrlChange = (idx: number, url: string) => {
    const newMedia = [...media];
    if (newMedia[idx]) {
      newMedia[idx] = { ...newMedia[idx], url };
      onChange(newMedia);
    }
  };

  return (
    <div>
      <span className="block text-sm font-semibold text-charcoal mb-1.5">{label}</span>
      {media.length === 0 && (
        <p className="text-xs text-charcoal/50 mb-2">No media added yet. Upload images or videos below.</p>
      )}
      <div className="space-y-3 mb-4">
        {media.map((m, idx) => (
          <div key={m.id} className="relative rounded-xl border border-charcoal/10 bg-white p-3 sm:flex sm:items-center sm:gap-3">
            <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg bg-soft ring-1 ring-charcoal/10">
              {m.type === "video" ? (
                <>
                  {m.thumbnail ? (
                    <img src={m.thumbnail} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-charcoal/40">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                </>
              ) : (
                m.url && <img src={m.url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0 mt-3 sm:mt-0 space-y-2">
              <input className={inputCls} value={m.url ?? ""} onChange={(e) => handleUrlChange(idx, e.target.value)} placeholder="Media URL" />
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center min-h-[40px] px-3 rounded-lg bg-soft text-sm font-semibold cursor-pointer hover:bg-ice">
                  {busy ? "Uploading…" : m.type === "video" ? "Upload video" : "Upload image"}
                  <input type="file" accept={m.type === "video" ? "video/*" : "image/*"} className="sr-only" onChange={(e) => onUpload(e.target.files)} />
                </label>
                <button type="button" onClick={() => { setOpen((o) => !o); if (!open) load(); }} className="min-h-[40px] px-3 rounded-lg bg-soft text-sm font-semibold hover:bg-ice">
                  {open ? "Close library" : "Choose from library"}
                </button>
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="min-h-[40px] px-3 rounded-lg bg-soft text-sm font-semibold hover:bg-ice" aria-label="Move up">↑</button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === media.length - 1} className="min-h-[40px] px-3 rounded-lg bg-soft text-sm font-semibold hover:bg-ice" aria-label="Move down">↓</button>
                <button type="button" onClick={() => removeMedia(m.id)} className="min-h-[40px] px-3 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100">Remove</button>
              </div>
              {err && <p className="text-xs text-red-600">{err}</p>}
            </div>
          </div>
        ))}
      </div>
      {open && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-56 overflow-y-auto rounded-lg border border-charcoal/10 p-2">
          {items.length === 0 && <p className="col-span-full text-xs text-charcoal/50 p-2">No media in the library yet.</p>}
          {items.map((m) => (
            <button key={m.name} type="button" onClick={() => {
              const newMedia: ProjectMedia = {
                id: crypto.randomUUID(),
                type: m.type,
                url: m.url,
                sort_order: media.length,
              };
              onChange([...media, newMedia]);
              setOpen(false);
            }} className={cn("aspect-square overflow-hidden rounded-md ring-2", m.type === "video" ? "bg-ice" : "")}>
              {m.type === "video" ? (
                <div className="h-full w-full flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                </div>
              ) : (
                <img src={m.url} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SaveBar({ saving, saved, error, onSave }: { saving: boolean; saved: boolean; error: string; onSave: () => void }) {
  return (
    <div className="sticky bottom-0 -mx-4 sm:-mx-6 mt-8 flex items-center justify-between gap-3 border-t border-charcoal/8 bg-white/95 backdrop-blur px-4 sm:px-6 py-3">
      <p className={cn("text-sm", error ? "text-red-600" : "text-fresh")}>{error || (saved ? "Saved — changes are live on the website." : "")}</p>
      <button onClick={onSave} disabled={saving} className="min-h-[44px] rounded-lg bg-charcoal px-5 text-sm font-semibold text-white hover:bg-[#1c2733] disabled:opacity-50">
        {saving ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

export function Card({ title, children, actions }: { title?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white ring-1 ring-charcoal/6 p-4 sm:p-6">
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 mb-5">
          {title && <h2 className="text-lg font-bold">{title}</h2>}
          {actions}
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

/** Hook: edit a settings section and save it */
export function useSettingForm<T>(initial: T, save: (v: T) => Promise<void>, onSaved?: () => Promise<void>) {
  const [form, setForm] = useState<T>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => setForm(initial), [initial]);
  const set = <K extends keyof T>(k: K) => (v: T[K]) => setForm((f) => ({ ...f, [k]: v }));
  const onSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await save(form);
      await onSaved?.();
      setSaved(true);
    } catch (e) {
      setError((e as Error).message || "Could not save.");
    } finally {
      setSaving(false);
    }
  };
  return { form, set, setForm, saving, saved, error, onSave };
}
