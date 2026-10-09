import { useState, type FormEvent } from "react";
import { Link, NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "./AdminAuth";
import { Logo } from "@/components/Logo";
import { CloseIcon, MenuIcon } from "@/components/Icons";
import { inputCls } from "./fields";
import { cn } from "@/utils/cn";

const nav = [
  ["/admin", "Dashboard"],
  ["/admin/content", "Website Content"],
  ["/admin/services", "Services"],
  ["/admin/projects", "Projects"],
  ["/admin/quotes", "Quote Requests"],
  ["/admin/testimonials", "Testimonials"],
  ["/admin/faqs", "FAQs"],
  ["/admin/contact", "Contact Information"],
  ["/admin/social", "Social Media"],
  ["/admin/homepage", "Homepage"],
  ["/admin/seo", "SEO Settings"],
  ["/admin/media", "Media Library"],
  ["/admin/settings", "Admin Settings"],
];

export function AdminLogin() {
  const { signIn, isAdmin, configured, checking } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAdmin) return <Navigate to="/admin" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await signIn(email.trim(), password);
    if (r) setErr(r);
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 sm:p-8 shadow-premium">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">Admin Portal</h1>
        <p className="text-sm text-charcoal/60 mt-1">Sign in to manage the Luminex website.</p>
        {!configured ? (
          <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800 leading-relaxed">
            The backend is not connected yet. Set <code className="font-mono">VITE_SUPABASE_URL</code> and <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>, run <code className="font-mono">supabase/schema.sql</code>, and create an administrator as described in <code className="font-mono">supabase/README.md</code>.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold mb-1.5">Email</span>
              <input type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold mb-1.5">Password</span>
              <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </label>
            {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
            <button type="submit" disabled={busy || checking} className="w-full min-h-[48px] rounded-xl bg-charcoal text-white font-semibold hover:bg-[#1c2733] disabled:opacity-50">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        )}
        <Link to="/" className="mt-6 inline-block text-sm text-charcoal/50 hover:text-charcoal">← Back to website</Link>
      </div>
    </div>
  );
}

export function AdminLayout() {
  const { isAdmin, checking, signOut, session } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  if (checking) return <div className="min-h-screen grid place-items-center text-sm text-charcoal/50">Checking access…</div>;
  if (!isAdmin) return <Navigate to="/admin/login" replace state={{ from: pathname }} />;

  const sidebar = (
    <nav className="flex flex-col h-full">
      <div className="hidden lg:block px-5 py-5 border-b border-white/10"><Logo light /></div>
      <ul className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {nav.map(([to, label]) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn("flex items-center min-h-[42px] px-3 rounded-lg text-sm font-medium transition", isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5")
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="p-3 border-t border-white/10">
        <p className="px-3 text-[11px] text-white/40 truncate">{session?.user.email}</p>
        <button onClick={signOut} className="mt-1 w-full text-left min-h-[42px] px-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5">Logout</button>
        <Link to="/" className="block min-h-[42px] leading-[42px] px-3 text-sm text-white/40 hover:text-white">View website →</Link>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-soft lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="hidden lg:block bg-charcoal sticky top-0 h-screen">{sidebar}</aside>
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-charcoal px-4 h-16">
        <Logo light />
        <button onClick={() => setOpen((o) => !o)} className="grid h-11 w-11 place-items-center text-white" aria-label="Menu">{open ? <CloseIcon /> : <MenuIcon />}</button>
      </div>
      {open && <div className="lg:hidden fixed inset-x-0 top-16 z-30 h-[calc(100dvh-4rem)] bg-charcoal">{sidebar}</div>}
      <main className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminPageTitle({ title, intro, actions }: { title: string; intro?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
        {intro && <p className="text-sm text-charcoal/60 mt-1">{intro}</p>}
      </div>
      {actions}
    </div>
  );
}
