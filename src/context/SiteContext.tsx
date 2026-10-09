import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { defaultSiteData } from "@/lib/defaults";
import { fetchSiteData } from "@/lib/api";
import type { SiteData } from "@/lib/types";

interface SiteContextValue {
  data: SiteData;
  loading: boolean;
  refresh: () => Promise<void>;
  whatsappLink: (message?: string) => string;
  smsLink: (message?: string) => string;
  telLink: (phone: string) => string;
}

/** Converts "0245487608", "+233 24 548 7608" or "233245487608" to digits-only international form: 233245487608 */
const toIntl = (n: string) => {
  const d = n.replace(/[^\d]/g, "");
  return d.startsWith("0") ? `233${d.slice(1)}` : d;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultSiteData);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const d = await fetchSiteData();
      setData(d);
    } catch (e) {
      console.error("Failed to load site data, using defaults", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Apply SEO settings globally
  useEffect(() => {
    const { seo } = data;
    document.title = seo.title;
    const setMeta = (sel: string, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement("meta");
        const [k, v] = sel.replace("meta[", "").replace("]", "").split("=");
        el.setAttribute(k, v.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", seo.description);
    setMeta('meta[name="keywords"]', "content", seo.keywords);
    setMeta('meta[property="og:title"]', "content", seo.og_title);
    setMeta('meta[property="og:description"]', "content", seo.og_description);
    setMeta('meta[property="og:image"]', "content", seo.og_image);
    if (seo.favicon) {
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = seo.favicon;
    }
  }, [data]);

  const value = useMemo<SiteContextValue>(
    () => ({
      data,
      loading,
      refresh,
      telLink: (phone) => `tel:+${toIntl(phone)}`,
      whatsappLink: (message) => {
        const num = toIntl(data.contact.whatsapp);
        const text = encodeURIComponent(
          message ??
            `Hello ${data.contact.company_name}, I would like to enquire about your services.`
        );
        return `https://wa.me/${num}?text=${text}`;
      },
      smsLink: (message) => {
        const num = toIntl(data.contact.sms_number || data.contact.whatsapp);
        const body = encodeURIComponent(
          message ??
            `Hello ${data.contact.company_name}, I would like to enquire about your services.`
        );
        // "?&body=" works on both Android and iOS
        return `sms:+${num}?&body=${body}`;
      },
    }),
    [data, loading, refresh]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
