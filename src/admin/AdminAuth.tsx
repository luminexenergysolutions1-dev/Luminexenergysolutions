import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { isCurrentUserAdmin } from "@/lib/api";

interface AuthValue {
  session: Session | null;
  isAdmin: boolean;
  checking: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }
    const sb = supabase;
    let active = true;
    const evaluate = async (s: Session | null) => {
      setSession(s);
      if (s) {
        const ok = await isCurrentUserAdmin();
        if (!ok) await sb.auth.signOut();
        if (active) setIsAdmin(ok);
      } else if (active) setIsAdmin(false);
      if (active) setChecking(false);
    };
    sb.auth.getSession().then(({ data }) => evaluate(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => {
      // Defer: Supabase recommends not awaiting client calls inside this callback
      setTimeout(() => evaluate(s), 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) return "Backend not configured.";
    setChecking(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setChecking(false);
      return "Invalid email or password.";
    }
    const ok = await isCurrentUserAdmin();
    if (!ok) {
      await supabase.auth.signOut();
      setChecking(false);
      return "This account is not authorised to access the Admin Portal.";
    }
    return null;
  };

  const signOut = async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <Ctx.Provider value={{ session, isAdmin, checking, configured: isSupabaseConfigured, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAdminAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAdminAuth outside provider");
  return v;
}
