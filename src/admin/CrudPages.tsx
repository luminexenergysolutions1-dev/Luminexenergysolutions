import { useState, type ReactNode } from "react";
import { useSite } from "@/context/SiteContext";
import { deleteRow, seedDefaultFaqs, seedDefaultServices, upsertRow } from "@/lib/api";
import { PROJECT_CATEGORIES } from "@/lib/defaults";
import type { Faq, Project, ProjectMedia, Service, Testimonial } from "@/lib/types";
import { AdminPageTitle } from "./AdminLayout";
import { ImageInput, ListInput, MediaInput, TextArea, TextInput, Toggle, inputCls } from "./fields";
import { cn } from "@/utils/cn";

/* ---------- Generic CRUD editor ---------- */
interface CrudProps<T extends { id: string; published: boolean }> {
  title: string;
  intro?: string;
  table: "services" | "projects" | "testimonials" | "faqs";
  items: T[];
  blank: () => T;
  summary: (t: T) => { title: string; sub?: string; image?: string };
  renderForm: (form: T, set: <K extends keyof T>(k: K) => (v: T[K]) => void) => ReactNode;
  emptyAction?: ReactNode;
  isDefault?: boolean;
}

function CrudPage<T extends { id: string; published: boolean }>({ title, intro, table, items, blank, summary, renderForm, emptyAction, isDefault }: CrudProps<T>) {
  const { refresh } = useSite();
  const [editing, setEditing] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const set = <K extends keyof T>(k: K) => (v: T[K]) => setEditing((f) => (f ? { ...f, [k]: v } : f));

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    setErr("");
    try {
      const payload: Record<string, unknown> = { ...editing };
      if (isDefault || editing.id.length < 20) delete payload.id; // defaults / new rows → let DB assign uuid
      await upsertRow(table, payload as unknown as T);
      await refresh();
      setEditing(null);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    try {
      await deleteRow(table, id);
      await refresh();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  const togglePublish = async (t: T) => {
    try {
      await upsertRow(table, { ...t, published: !t.published });
      await refresh();
    } catch (e) {
      alert((e as Error).message);
    }
  };

  return (
    <>
      <AdminPageTitle
        title={title}
        intro={intro}
        actions={
          <button onClick={() => setEditing(blank())} className="min-h-[44px] rounded-lg bg-charcoal px-4 text-sm font-semibold text-white">+ Add new</button>
        }
      />
      {isDefault && (
        <div className="mb-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 flex flex-wrap items-center justify-between gap-3">
          <span>The website is showing built-in default content because this table is empty.</span>
          {emptyAction}
        </div>
      )}
      {items.length === 0 ? (
        <div className="rounded-2xl bg-white ring-1 ring-charcoal/6 p-10 text-center text-sm text-charcoal/50">Nothing here yet. {emptyAction}</div>
      ) : (
        <ul className="grid gap-3">
          {items.map((t) => {
            const s = summary(t);
            return (
              <li key={t.id} className="rounded-2xl bg-white ring-1 ring-charcoal/6 p-3 sm:p-4 flex items-center gap-4">
                {s.image !== undefined && (
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-soft">{s.image && <img src={s.image} alt="" className="h-full w-full object-cover" />}</div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{s.title}</p>
                  {s.sub && <p className="text-xs text-charcoal/50 truncate">{s.sub}</p>}
                  <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold", t.published ? "bg-fresh/15 text-fresh" : "bg-charcoal/8 text-charcoal/60")}>
                    {t.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-1 shrink-0">
                  <button onClick={() => setEditing(t)} className="min-h-[40px] px-3 rounded-lg text-sm font-semibold hover:bg-soft">Edit</button>
                  {!isDefault && (
                    <>
                      <button onClick={() => togglePublish(t)} className="min-h-[40px] px-3 rounded-lg text-sm font-semibold hover:bg-soft">{t.published ? "Unpublish" : "Publish"}</button>
                      <button onClick={() => remove(t.id)} className="min-h-[40px] px-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50">Delete</button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={() => !busy && setEditing(null)}>
          <div className="w-full max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 sm:p-6 space-y-5">
              <h2 className="text-xl font-bold">{editing.id && editing.id.length >= 20 ? "Edit" : "New"} item</h2>
              {renderForm(editing, set)}
              <Toggle checked={editing.published} onChange={set("published")} label="Published (visible on website)" />
              {err && <p className="text-sm text-red-600">{err}</p>}
            </div>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-charcoal/8 bg-white p-4">
              <button onClick={() => setEditing(null)} disabled={busy} className="min-h-[44px] px-4 rounded-lg text-sm font-semibold hover:bg-soft">Cancel</button>
              <button onClick={save} disabled={busy} className="min-h-[44px] px-5 rounded-lg bg-charcoal text-white text-sm font-semibold disabled:opacity-50">{busy ? "Saving…" : "Save"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Services ---------- */
export function ServicesAdmin() {
  const { data, refresh } = useSite();
  const isDefault = data.services.some((s) => s.id.length < 20);
  const seed = async () => {
    await seedDefaultServices();
    await refresh();
  };
  return (
    <CrudPage<Service>
      title="Services"
      intro="Create, edit, reorder and publish services. Each service has its own detail page."
      table="services"
      items={data.services}
      isDefault={isDefault}
      emptyAction={isDefault ? <button onClick={seed} className="min-h-[40px] rounded-lg bg-charcoal text-white px-3 text-sm font-semibold">Import defaults into database</button> : undefined}
      blank={() => ({
        id: "", slug: "", title: "", short_description: "", overview: "", icon: "sun", image: "", cta_text: "Learn more",
        provides: [], benefits: [], applications: [], process: [], maintenance: "", why_luminex: "", sort_order: data.services.length, published: true,
      })}
      summary={(s) => ({ title: s.title, sub: `/services/${s.slug} · order ${s.sort_order}`, image: s.image })}
      renderForm={(f, set) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Title" value={f.title} onChange={set("title")} />
            <TextInput label="Slug" value={f.slug} onChange={(v) => set("slug")(v.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} hint="Used in the URL" />
            <label className="block"><span className="block text-sm font-semibold mb-1.5">Icon</span>
              <select className={inputCls} value={f.icon} onChange={(e) => set("icon")(e.target.value as Service["icon"])}>
                <option value="sun">Sun (solar)</option><option value="bolt">Lightning (electrical)</option><option value="snow">Snowflake (cooling)</option><option value="leaf">Leaf (efficiency)</option>
              </select>
            </label>
            <TextInput label="Sort order" type="number" value={String(f.sort_order)} onChange={(v) => set("sort_order")(Number(v) || 0)} />
          </div>
          <ImageInput label="Service image" value={f.image} onChange={set("image")} />
          <TextArea label="Short description (card)" value={f.short_description} onChange={set("short_description")} rows={3} />
          <TextInput label="CTA text" value={f.cta_text} onChange={set("cta_text")} />
          <TextArea label="Overview" value={f.overview} onChange={set("overview")} rows={3} />
          <ListInput label="What we provide" value={f.provides} onChange={set("provides")} />
          <ListInput label="Benefits" value={f.benefits} onChange={set("benefits")} />
          <ListInput label="Typical applications" value={f.applications} onChange={set("applications")} />
          <ListInput label="Installation process" value={f.process} onChange={set("process")} />
          <TextArea label="Maintenance" value={f.maintenance} onChange={set("maintenance")} rows={2} />
          <TextArea label="Why choose Luminex" value={f.why_luminex} onChange={set("why_luminex")} rows={2} />
        </>
      )}
    />
  );
}

/* ---------- Projects ---------- */
export function ProjectsAdmin() {
  const { data } = useSite();
  return (
    <CrudPage<Project>
      title="Projects"
      intro="Only real completed projects should be added here. You can add multiple images and videos per project."
      table="projects"
      items={data.projects}
      blank={() => ({ id: "", title: "", location: "", category: PROJECT_CATEGORIES[0], description: "", details: "", media: [], project_date: "", published: true })}
      summary={(p) => ({ title: p.title, sub: `${p.category} · ${p.location}`, image: p.media?.[0]?.url || p.media?.[0]?.thumbnail }) }
      renderForm={(f, set) => (
        <>
          <TextInput label="Project title" value={f.title} onChange={set("title")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Location" value={f.location} onChange={set("location")} />
            <label className="block"><span className="block text-sm font-semibold mb-1.5">Service category</span>
              <select className={inputCls} value={f.category} onChange={(e) => set("category")(e.target.value)}>
                {PROJECT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <TextInput label="Project date (optional)" type="date" value={f.project_date ?? ""} onChange={(v) => set("project_date")(v || null)} />
          </div>
          <MediaInput label="Project media (images & videos)" media={f.media} onChange={set("media")} />
          <TextArea label="Short description" value={f.description} onChange={set("description")} rows={3} />
          <TextArea label="Project details (optional)" value={f.details ?? ""} onChange={set("details")} rows={4} />
        </>
      )}
    />
  );
}

/* ---------- Testimonials ---------- */
export function TestimonialsAdmin() {
  const { data } = useSite();
  return (
    <CrudPage<Testimonial>
      title="Testimonials"
      intro="Add genuine customer feedback only. Published testimonials appear on the About page."
      table="testimonials"
      items={data.testimonials}
      blank={() => ({ id: "", name: "", role: "", quote: "", published: true })}
      summary={(t) => ({ title: t.name, sub: t.role })}
      renderForm={(f, set) => (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Customer name" value={f.name} onChange={set("name")} />
            <TextInput label="Role / location" value={f.role} onChange={set("role")} placeholder="e.g. Homeowner, Cape Coast" />
          </div>
          <TextArea label="Quote" value={f.quote} onChange={set("quote")} rows={4} />
        </>
      )}
    />
  );
}

/* ---------- FAQs ---------- */
export function FaqsAdmin() {
  const { data, refresh } = useSite();
  const isDefault = data.faqs.some((f) => f.id.length < 20);
  const seed = async () => {
    await seedDefaultFaqs();
    await refresh();
  };
  return (
    <CrudPage<Faq>
      title="FAQs"
      intro="Shown as an accordion on the Services page. Lower sort order appears first."
      table="faqs"
      items={[...data.faqs].sort((a, b) => a.sort_order - b.sort_order)}
      isDefault={isDefault}
      emptyAction={isDefault ? <button onClick={seed} className="min-h-[40px] rounded-lg bg-charcoal text-white px-3 text-sm font-semibold">Import defaults into database</button> : undefined}
      blank={() => ({ id: "", question: "", answer: "", sort_order: data.faqs.length, published: true })}
      summary={(f) => ({ title: f.question, sub: `Order ${f.sort_order}` })}
      renderForm={(f, set) => (
        <>
          <TextInput label="Question" value={f.question} onChange={set("question")} />
          <TextArea label="Answer" value={f.answer} onChange={set("answer")} rows={4} />
          <TextInput label="Sort order" type="number" value={String(f.sort_order)} onChange={(v) => set("sort_order")(Number(v) || 0)} />
        </>
      )}
    />
  );
}
