export type ServiceSlug = string;

export interface Service {
  id: string;
  slug: ServiceSlug;
  title: string;
  short_description: string;
  overview: string;
  icon: "sun" | "bolt" | "snow" | "leaf";
  image: string;
  cta_text: string;
  provides: string[];
  benefits: string[];
  applications: string[];
  process: string[];
  maintenance: string;
  why_luminex: string;
  sort_order: number;
  published: boolean;
}

export interface ProjectMedia {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  details?: string | null;
  media: ProjectMedia[];
  project_date?: string | null;
  published: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  published: boolean;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
}

export interface ContactInfo {
  company_name: string;
  phones: string[];
  whatsapp: string;
  /** Number that receives quote requests sent by SMS */
  sms_number: string;
  email: string;
  headquarters: string;
  digital_address: string;
  service_areas: string[];
  business_hours: string;
}

export interface SocialLinks {
  facebook_label: string;
  facebook_url: string;
  whatsapp_label: string;
  whatsapp_channel_url: string;
  instagram_label: string;
  instagram_url: string;
  x_label: string;
  x_url: string;
  tiktok_label: string;
  tiktok_url: string;
}

export interface Homepage {
  hero_heading: string;
  hero_description: string;
  hero_image: string;
  hero_primary_cta: string;
  hero_secondary_cta: string;
  trust_items: string[];
  about_title: string;
  about_body: string;
  about_image: string;
  about_cta: string;
  services_title: string;
  services_intro: string;
  advantages_title: string;
  advantages: { title: string; body: string }[];
  process_title: string;
  process_steps: { title: string; body: string }[];
  projects_title: string;
  projects_intro: string;
  cta_title: string;
  cta_body: string;
  cta_button: string;
}

export interface AboutContent {
  intro: string;
  description: string;
  mission: string;
  vision: string;
  values: { title: string; body: string }[];
  image: string;
}

export interface SeoSettings {
  title: string;
  description: string;
  keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  favicon: string;
}

export interface MediaItem {
  name: string;
  url: string;
  type: "image" | "video";
  thumbnail?: string;
  created_at?: string;
}

export type QuoteStatus =
  | "New"
  | "Contacted"
  | "Assessment Scheduled"
  | "Quoted"
  | "Completed"
  | "Cancelled";

export interface QuoteRequest {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  property_type: string;
  contact_method: string;
  description: string;
  attachment_url?: string | null;
  status: QuoteStatus;
  created_at: string;
}

export interface SiteData {
  homepage: Homepage;
  about: AboutContent;
  services: Service[];
  projects: Project[];
  testimonials: Testimonial[];
  faqs: Faq[];
  contact: ContactInfo;
  social: SocialLinks;
  seo: SeoSettings;
}
