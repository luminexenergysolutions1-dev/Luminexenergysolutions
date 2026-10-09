import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";
import { fetchQuotes, saveSetting } from "@/lib/api";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAdminAuth } from "./AdminAuth";
import { AdminPageTitle } from "./AdminLayout";
import { Card, ImageInput, ListInput, PairListInput, SaveBar, TextArea, TextInput, inputCls, useSettingForm } from "./fields";
import type { QuoteRequest } from "@/lib/types";

/* ---------------- Dashboard ---------------- */
export function Dashboard() {
  const { data } = useSite();
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  useEffect(() => {
    fetchQuotes().then(setQuotes).catch(() => setQuotes([]));
  }, []);
  const newQuotes = quotes.filter((q) => q.status === "New");
  const stats = [
    { label: "New quote requests", value: newQuotes.length, to: "/admin/quotes", accent: "bg-solar/20 text-charcoal" },
    { label: "Published projects", value: data.projects.filter((p) => p.published).length, to: "/admin/projects", accent: "bg-ice text-energy" },
    { label: "Active services", value: data.services.filter((s) => s.published).length, to: "/admin/services", accent: "bg-fresh/15 text-fresh" },
    { label: "Website status", value: isSupabaseConfigured ? "Live" : "Offline", to: "/", accent: "bg-charcoal text-white" },
  ];
  return (
    <>
      <AdminPageTitle title="Dashboard" intro="Overview of your website and recent activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="rounded-2xl bg-white ring-1 ring-charcoal/6 p-5 hover:ring-charcoal/20 transition">
            <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${s.accent}`}>{s.label}</span>
            <p className="mt-4 text-3xl font-extrabold">{s.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Card title="Latest quote requests" actions={<Link to="/admin/quotes" className="text-sm font-semibold text-energy">View all</Link>}>
          {quotes.length === 0 ? (
            <p className="text-sm text-charcoal/50">No quote requests yet.</p>
          ) : (
            <ul className="divide-y divide-charcoal/6">
              {quotes.slice(0, 6).map((q) => (
                <li key={q.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="font-semibold">{q.full_name} <span className="font-normal text-charcoal/50">· {q.service}</span></p>
                    <p className="text-charcoal/50 text-xs">{q.location} · {new Date(q.created_at).toLocaleDateString("en-GB")}</p>
                  </div>
                  <span className="rounded-full bg-soft px-2.5 py-1 text-xs font-semibold">{q.status}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

/* ---------------- Homepage ---------------- */
export function HomepageAdmin() {
  const { data, refresh } = useSite();
  const f = useSettingForm(data.homepage, (v) => saveSetting("homepage_content", v), refresh);
  const { form, set } = f;
  return (
    <>
      <AdminPageTitle title="Homepage" intro="Edit the content of every homepage section." />
      <div className="space-y-6">
        <Card title="Hero">
          <TextInput label="Hero heading" value={form.hero_heading} onChange={set("hero_heading")} />
          <TextArea label="Hero description" value={form.hero_description} onChange={set("hero_description")} rows={3} />
          <ImageInput label="Hero image" value={form.hero_image} onChange={set("hero_image")} />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Primary CTA text" value={form.hero_primary_cta} onChange={set("hero_primary_cta")} />
            <TextInput label="Secondary CTA text" value={form.hero_secondary_cta} onChange={set("hero_secondary_cta")} />
          </div>
          <ListInput label="Trust strip items" value={form.trust_items} onChange={set("trust_items")} />
        </Card>
        <Card title="About section">
          <TextInput label="Title" value={form.about_title} onChange={set("about_title")} />
          <TextArea label="Body" hint="Separate paragraphs with a blank line." value={form.about_body} onChange={set("about_body")} rows={6} />
          <ImageInput label="Image" value={form.about_image} onChange={set("about_image")} />
          <TextInput label="CTA text" value={form.about_cta} onChange={set("about_cta")} />
        </Card>
        <Card title="Services section">
          <TextInput label="Title" value={form.services_title} onChange={set("services_title")} />
          <TextArea label="Intro" value={form.services_intro} onChange={set("services_intro")} rows={2} />
          <p className="text-xs text-charcoal/50">Individual services are managed under <Link className="text-energy font-semibold" to="/admin/services">Services</Link>.</p>
        </Card>
        <Card title="Advantage section">
          <TextInput label="Title" value={form.advantages_title} onChange={set("advantages_title")} />
          <PairListInput label="Advantages" value={form.advantages} onChange={set("advantages")} />
        </Card>
        <Card title="Process section">
          <TextInput label="Title" value={form.process_title} onChange={set("process_title")} />
          <PairListInput label="Steps" value={form.process_steps} onChange={set("process_steps")} />
        </Card>
        <Card title="Projects section">
          <TextInput label="Title" value={form.projects_title} onChange={set("projects_title")} />
          <TextArea label="Intro" value={form.projects_intro} onChange={set("projects_intro")} rows={2} />
        </Card>
        <Card title="Energy efficiency CTA">
          <TextInput label="Title" value={form.cta_title} onChange={set("cta_title")} />
          <TextArea label="Body" value={form.cta_body} onChange={set("cta_body")} rows={3} />
          <TextInput label="Button text" value={form.cta_button} onChange={set("cta_button")} />
        </Card>
      </div>
      <SaveBar {...f} />
    </>
  );
}

/* ---------------- About / Website content ---------------- */
export function ContentAdmin() {
  const { data, refresh } = useSite();
  const f = useSettingForm(data.about, (v) => saveSetting("about", v), refresh);
  const { form, set } = f;
  return (
    <>
      <AdminPageTitle title="Website Content" intro="About page content: description, mission, vision and values." />
      <div className="space-y-6">
        <Card title="About page">
          <TextInput label="Page headline" value={form.intro} onChange={set("intro")} />
          <TextArea label="Company description" hint="Separate paragraphs with a blank line." value={form.description} onChange={set("description")} rows={7} />
          <ImageInput label="Company image" value={form.image} onChange={set("image")} />
        </Card>
        <Card title="Mission & Vision">
          <TextArea label="Mission" value={form.mission} onChange={set("mission")} rows={2} />
          <TextArea label="Vision" value={form.vision} onChange={set("vision")} rows={2} />
        </Card>
        <Card title="Values">
          <PairListInput label="Values" value={form.values} onChange={set("values")} />
        </Card>
      </div>
      <SaveBar {...f} />
    </>
  );
}

/* ---------------- Contact ---------------- */
export function ContactAdmin() {
  const { data, refresh } = useSite();
  const f = useSettingForm(data.contact, (v) => saveSetting("contact_information", v), refresh);
  const { form, set } = f;
  return (
    <>
      <AdminPageTitle title="Contact Information" intro="Changes here update the header, footer, contact page, quote section and WhatsApp button automatically." />
      <div className="space-y-6">
        <Card title="Company">
          <TextInput label="Company name" value={form.company_name} onChange={set("company_name")} />
          <TextInput label="Headquarters" value={form.headquarters} onChange={set("headquarters")} />
          <TextInput label="Digital address" value={form.digital_address} onChange={set("digital_address")} />
          <TextInput label="Business hours" value={form.business_hours} onChange={set("business_hours")} />
          <ListInput label="Service areas" value={form.service_areas} onChange={set("service_areas")} />
        </Card>
        <Card title="Phone & Email">
          <ListInput label="Phone numbers" value={form.phones} onChange={set("phones")} hint="One number per line. The first number is used for the main Call button." />
          <TextInput label="WhatsApp number" hint="Used by the floating WhatsApp button and every WhatsApp link, e.g. +233 24 548 7608" value={form.whatsapp} onChange={set("whatsapp")} />
          <TextInput label="SMS number" hint="Quote requests sent by SMS go to this number" value={form.sms_number} onChange={set("sms_number")} />
          <TextInput label="Email" type="email" value={form.email} onChange={set("email")} />
        </Card>
      </div>
      <SaveBar {...f} />
    </>
  );
}

/* ---------------- Social ---------------- */
export function SocialAdmin() {
  const { data, refresh } = useSite();
  const f = useSettingForm(data.social, (v) => saveSetting("social_links", v), refresh);
  const { form, set } = f;
  return (
    <>
      <AdminPageTitle title="Social Media" intro="Set display names and the real profile URLs. Icons without a URL are shown but not linked." />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Facebook name" value={form.facebook_label} onChange={set("facebook_label")} />
          <TextInput label="Facebook URL" value={form.facebook_url} onChange={set("facebook_url")} placeholder="https://facebook.com/..." />
          <TextInput label="WhatsApp Channel name" value={form.whatsapp_label} onChange={set("whatsapp_label")} />
          <TextInput label="WhatsApp Channel URL (most important)" value={form.whatsapp_channel_url} onChange={set("whatsapp_channel_url")} placeholder="https://whatsapp.com/channel/..." />
          <TextInput label="Instagram handle" value={form.instagram_label} onChange={set("instagram_label")} />
          <TextInput label="Instagram URL" value={form.instagram_url} onChange={set("instagram_url")} placeholder="https://instagram.com/..." />
          <TextInput label="X handle" value={form.x_label} onChange={set("x_label")} />
          <TextInput label="X URL" value={form.x_url} onChange={set("x_url")} placeholder="https://x.com/..." />
          <TextInput label="TikTok handle" value={form.tiktok_label} onChange={set("tiktok_label")} />
          <TextInput label="TikTok URL" value={form.tiktok_url} onChange={set("tiktok_url")} placeholder="https://tiktok.com/@..." />
        </div>
      </Card>
      <SaveBar {...f} />
    </>
  );
}

/* ---------------- SEO ---------------- */
export function SeoAdmin() {
  const { data, refresh } = useSite();
  const f = useSettingForm(data.seo, (v) => saveSetting("seo_settings", v), refresh);
  const { form, set } = f;
  return (
    <>
      <AdminPageTitle title="SEO Settings" />
      <Card>
        <TextInput label="Website title" value={form.title} onChange={set("title")} />
        <TextArea label="Meta description" value={form.description} onChange={set("description")} rows={3} />
        <TextInput label="Keywords" value={form.keywords} onChange={set("keywords")} hint="Comma separated" />
        <TextInput label="Open Graph title" value={form.og_title} onChange={set("og_title")} />
        <TextArea label="Open Graph description" value={form.og_description} onChange={set("og_description")} rows={2} />
        <ImageInput label="Social sharing image" value={form.og_image} onChange={set("og_image")} />
        <ImageInput label="Favicon" value={form.favicon} onChange={set("favicon")} />
      </Card>
      <SaveBar {...f} />
    </>
  );
}

/* ---------------- Admin settings ---------------- */
export function AdminSettings() {
  const { session } = useAdminAuth();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const change = async (e: FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (pw.length < 10) return setErr("Password must be at least 10 characters.");
    if (pw !== pw2) return setErr("Passwords do not match.");
    const { error } = await supabase!.auth.updateUser({ password: pw });
    if (error) setErr(error.message);
    else {
      setMsg("Password updated.");
      setPw("");
      setPw2("");
    }
  };

  return (
    <>
      <AdminPageTitle title="Admin Settings" />
      <div className="space-y-6">
        <Card title="Your account">
          <p className="text-sm">Signed in as <strong>{session?.user.email}</strong></p>
          <form onSubmit={change} className="grid gap-4 sm:grid-cols-2 max-w-xl">
            <label className="block"><span className="block text-sm font-semibold mb-1.5">New password</span><input type="password" className={inputCls} value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></label>
            <label className="block"><span className="block text-sm font-semibold mb-1.5">Confirm password</span><input type="password" className={inputCls} value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" /></label>
            {(err || msg) && <p className={`sm:col-span-2 text-sm ${err ? "text-red-600" : "text-fresh"}`}>{err || msg}</p>}
            <button className="sm:col-span-2 justify-self-start min-h-[44px] rounded-lg bg-charcoal text-white px-5 text-sm font-semibold">Update password</button>
          </form>
        </Card>
        <Card title="Administrators">
          <p className="text-sm text-charcoal/65 leading-relaxed">
            Administrators are managed securely in Supabase. To add one: create the user in <strong>Supabase → Authentication → Users</strong>, then insert their user ID into the <code className="font-mono">admin_users</code> table (see <code className="font-mono">supabase/README.md</code>). Credentials are never stored in the website code.
          </p>
        </Card>
      </div>
    </>
  );
}
