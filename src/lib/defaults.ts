import type { SiteData, Service } from "./types";

const svc = (
  s: Omit<Service, "sort_order" | "published"> & Partial<Service>,
  i: number
): Service => ({ sort_order: i, published: true, ...s });

export const defaultServices: Service[] = [
  svc(
    {
      id: "solar-power",
      slug: "solar-power",
      title: "Solar Power",
      icon: "sun",
      image: "/images/solar.jpg",
      cta_text: "Explore Solar Solutions",
      short_description:
        "Complete solar system design, installation and maintenance designed to improve energy independence, reduce electricity costs and provide reliable backup power.",
      overview:
        "Ghana receives abundant sunshine all year round. Luminex turns that sunlight into dependable electricity for your home or business, with systems that are sized to your actual consumption — not oversold and not under-built.",
      provides: [
        "Site assessment and load analysis",
        "Grid-tied, hybrid and off-grid solar system design",
        "Solar panel, inverter and battery supply and installation",
        "Backup power systems for outages",
        "System monitoring setup",
        "Scheduled cleaning, inspection and maintenance",
      ],
      benefits: [
        "Lower monthly electricity bills",
        "Reliable power during outages",
        "Protection against rising tariffs",
        "Clean energy with minimal running costs",
      ],
      applications: [
        "Residential homes and estates",
        "Shops, offices and guest houses",
        "Schools, clinics and churches",
        "Farms and remote facilities",
      ],
      process: [
        "Consultation and energy-usage review",
        "Site survey and system design",
        "Transparent quotation",
        "Professional installation and commissioning",
        "Handover, training and monitoring",
      ],
      maintenance:
        "We offer panel cleaning, electrical inspection, battery health checks and inverter servicing so your system keeps performing as designed.",
      why_luminex:
        "We design around your real energy needs, use quality components and install to a professional standard — then stay available for support after handover.",
    },
    0
  ),
  svc(
    {
      id: "electrical-works",
      slug: "electrical-works",
      title: "Electrical Works",
      icon: "bolt",
      image: "/images/electrical.jpg",
      cta_text: "Explore Electrical Services",
      short_description:
        "Professional electrical wiring, primary electrical installations, equipment repairs and electrical infrastructure solutions.",
      overview:
        "Safe, well-planned electrical work is the foundation of every reliable building. Luminex handles new installations, rewiring and repairs with careful workmanship and attention to safety.",
      provides: [
        "Complete wiring for new buildings",
        "Rewiring and upgrades of older properties",
        "Distribution boards, breakers and earthing",
        "Lighting design and installation",
        "Fault finding and equipment repairs",
        "Generator and changeover connections",
      ],
      benefits: [
        "Safer homes and workplaces",
        "Fewer faults and interruptions",
        "Neat, well-documented installations",
        "Infrastructure ready for solar and AC loads",
      ],
      applications: [
        "New residential and commercial buildings",
        "Renovations and extensions",
        "Shops, offices and warehouses",
        "Hospitality and institutional facilities",
      ],
      process: [
        "Requirement discussion and site visit",
        "Load calculation and layout planning",
        "Quotation and scheduling",
        "Installation and testing",
        "Final inspection and handover",
      ],
      maintenance:
        "Periodic inspections, thermal checks on boards, tightening of connections and prompt repair services keep your electrical system safe.",
      why_luminex:
        "We treat electrical safety seriously: proper sizing, proper protection and proper testing on every job, large or small.",
    },
    1
  ),
  svc(
    {
      id: "air-conditioning",
      slug: "air-conditioning",
      title: "Air Conditioning",
      icon: "snow",
      image: "/images/ac.jpg",
      cta_text: "Explore AC Services",
      short_description:
        "Premium air-conditioning sales, professional installation, deep servicing and fast repair solutions for homes and businesses.",
      overview:
        "Comfort in Ghana's climate depends on cooling that works quietly, efficiently and reliably. Luminex supplies, installs and services air-conditioning systems with the care premium equipment deserves.",
      provides: [
        "Supply of split, cassette and standing AC units",
        "Professional installation and piping",
        "Deep cleaning and chemical servicing",
        "Gas top-up and leak repair",
        "Compressor and electrical fault repairs",
        "Relocation of existing units",
      ],
      benefits: [
        "Consistent, comfortable indoor temperatures",
        "Lower running costs with efficient units",
        "Cleaner air and longer equipment life",
        "Quick response when something goes wrong",
      ],
      applications: [
        "Bedrooms and living rooms",
        "Offices and meeting rooms",
        "Shops, salons and restaurants",
        "Server rooms and clinics",
      ],
      process: [
        "Room assessment and capacity sizing",
        "Unit recommendation and quotation",
        "Clean, professional installation",
        "Testing and performance check",
        "Servicing schedule and support",
      ],
      maintenance:
        "Regular servicing keeps units efficient and prevents breakdowns. We recommend a deep service every three to six months depending on use.",
      why_luminex:
        "Correct sizing, correct installation and honest servicing — the three things that make the difference between an AC that lasts and one that keeps failing.",
    },
    2
  ),
  svc(
    {
      id: "energy-savings",
      slug: "energy-savings",
      title: "Energy Savings",
      icon: "leaf",
      image: "/images/energy.jpg",
      cta_text: "Improve Your Energy Efficiency",
      short_description:
        "Smart energy assessments and modern efficiency upgrades designed to reduce unnecessary energy consumption, operating costs and environmental impact.",
      overview:
        "Many homes and businesses pay for energy they never use well. Luminex reviews how your building consumes power and recommends practical upgrades that pay for themselves.",
      provides: [
        "Energy consumption assessment",
        "LED lighting conversions",
        "Efficient AC and appliance recommendations",
        "Smart controls, timers and sensors",
        "Power-quality and load-balancing checks",
        "Solar-readiness evaluation",
      ],
      benefits: [
        "Reduced electricity bills",
        "Less wasted energy and heat",
        "Lower environmental impact",
        "Clear understanding of where energy goes",
      ],
      applications: [
        "Households with high bills",
        "Shops and offices running AC all day",
        "Hotels, guest houses and schools",
        "Businesses planning for solar",
      ],
      process: [
        "Walk-through assessment",
        "Measurement and bill analysis",
        "Prioritised recommendations",
        "Implementation of upgrades",
        "Follow-up review of savings",
      ],
      maintenance:
        "We can revisit periodically to confirm savings are holding and recommend further improvements as your needs change.",
      why_luminex:
        "Because we also install solar, electrical and AC systems, our efficiency advice is practical and grounded in how buildings actually work.",
    },
    3
  ),
];

export const defaultSiteData: SiteData = {
  homepage: {
    hero_heading: "Smart Power. Cool Comfort. Brighter Futures.",
    hero_description:
      "Reliable power, intelligent energy solutions and premium air-conditioning for homes and businesses across Ghana.",
    hero_image: "/images/hero.jpg",
    hero_primary_cta: "Request a Quote",
    hero_secondary_cta: "Explore Our Services",
    trust_items: [
      "Reliable Power",
      "Professional Installation",
      "Energy Efficient",
      "Nationwide Service",
    ],
    about_title: "Powering Better Living.",
    about_body:
      "Luminex Energy Solutions is an officially registered business in Ghana, established in September 2026.\n\nWe are a modern provider of reliable power, safe electrical infrastructure and premium air conditioning.\n\nWe deliver high-tech, affordable and energy-efficient solutions designed to keep homes, businesses and other spaces reliably powered and comfortably cooled.",
    about_image: "/images/about.jpg",
    about_cta: "Learn More About Luminex",
    services_title: "One team for power, electricity and cooling.",
    services_intro:
      "Four connected services, delivered by one accountable team — from the sun on your roof to the cool air in your room.",
    advantages_title: "Why Choose Luminex?",
    advantages: [
      {
        title: "Professional Service",
        body: "Every project is approached with attention to quality, safety and detail.",
      },
      {
        title: "Reliable Solutions",
        body: "Solutions are designed around practical energy and comfort needs.",
      },
      {
        title: "Energy Efficiency",
        body: "We help customers use energy more intelligently and efficiently.",
      },
      {
        title: "Affordable Solutions",
        body: "Professional solutions designed to provide value without unnecessary costs.",
      },
      {
        title: "Warranty",
        body: "Installations and applicable parts are supported by warranty according to the company's warranty terms.",
      },
      {
        title: "Nationwide Service",
        body: "Serving customers across Ghana.",
      },
    ],
    process_title: "How It Works",
    process_steps: [
      {
        title: "Tell Us What You Need",
        body: "Contact Luminex and explain your power, electrical or cooling requirements.",
      },
      {
        title: "Assessment",
        body: "Our team evaluates your requirements and recommends an appropriate solution.",
      },
      {
        title: "Installation",
        body: "Professional installation is completed with attention to safety and quality.",
      },
      {
        title: "Support",
        body: "Receive maintenance, servicing and ongoing technical support.",
      },
    ],
    projects_title: "Recent Work",
    projects_intro:
      "A selection of installations completed by the Luminex team across Ghana.",
    cta_title: "Paying too much for power that keeps failing?",
    cta_body:
      "A Luminex energy assessment shows you exactly where your electricity goes — and the practical upgrades that will reduce your bills and keep you comfortable.",
    cta_button: "Book an Energy Assessment",
  },
  about: {
    intro: "Powering Better Living.",
    description:
      "Luminex Energy Solutions is an officially registered business in Ghana, established in September 2026 and headquartered in Cape Coast. We provide reliable power, safe electrical infrastructure and premium air conditioning to homes, businesses and institutions across the country.\n\nWe started Luminex because too many Ghanaian households and businesses deal with the same three frustrations: unreliable power, unsafe or outdated wiring, and cooling systems that cost too much to run. We believe these problems are connected — and that they are best solved by one professional team.",
    mission:
      "To keep Ghanaian homes and businesses reliably powered and comfortably cooled through safe, efficient and affordable engineering.",
    vision:
      "To be the company Ghanaians trust first when power, electricity or cooling must be handled properly.",
    values: [
      { title: "Safety first", body: "No shortcuts on wiring, protection or installation practice." },
      { title: "Honest advice", body: "We recommend what you need, sized to your real usage." },
      { title: "Quality workmanship", body: "Clean, durable installations we are proud to put our name on." },
      { title: "Lasting support", body: "We stay available for servicing and support after handover." },
    ],
    image: "/images/about.jpg",
  },
  services: defaultServices,
  projects: [],
  testimonials: [],
  faqs: [
    {
      id: "f1",
      question: "Which areas do you serve?",
      answer:
        "We are headquartered in Cape Coast and serve Accra, Takoradi and customers nationwide across Ghana.",
      sort_order: 0,
      published: true,
    },
    {
      id: "f2",
      question: "How do I get a quotation?",
      answer:
        "Fill in the Request a Quote form, call us, or message us on WhatsApp. We will discuss your needs, arrange an assessment where required, and send a clear quotation.",
      sort_order: 1,
      published: true,
    },
    {
      id: "f3",
      question: "Can you install solar and air conditioning together?",
      answer:
        "Yes. Because we handle solar, electrical and AC work in-house, we can design a system where your cooling load is properly accounted for from the start.",
      sort_order: 2,
      published: true,
    },
    {
      id: "f4",
      question: "Do you offer servicing for systems you did not install?",
      answer:
        "Yes. We service and repair existing solar, electrical and AC systems after an initial inspection.",
      sort_order: 3,
      published: true,
    },
  ],
  contact: {
    company_name: "Luminex Energy Solutions",
    phones: ["+233 25 647 8208", "+233 55 876 9127", "+233 24 548 7608", "+233 55 461 1569"],
    whatsapp: "+233 24 548 7608",
    sms_number: "+233 24 548 7608",
    email: "",
    headquarters: "Cape Coast, Central Region, Ghana",
    digital_address: "CA14948538",
    service_areas: ["Accra", "Cape Coast", "Kumasi", "Sunyani", "Takoradi"],
    business_hours: "Monday – Friday",
  },
  social: {
    facebook_label: "Luminex Energy Solutions",
    facebook_url: "https://www.facebook.com/share/1Eqtk5ZCJ4/",
    whatsapp_label: "Luminex Energy Solutions",
    whatsapp_channel_url: "https://whatsapp.com/channel/0029VbDGfNmFMqrZ5urUAM3r",
    instagram_label: "@luminexenergysolutions",
    instagram_url: "https://www.instagram.com/luminexenergysolutions?stkn=cHJiZWp5ejJleDZ3",
    x_label: "@luminexenergy",
    x_url: "https://x.com/luminexenergy",
    tiktok_label: "@luminexenergysolu",
    tiktok_url: "https://www.tiktok.com/@luminexenergysolu",
  },
  seo: {
    title: "Luminex Energy Solutions | Smart Power. Cool Comfort. Brighter Futures.",
    description:
      "Reliable solar power, professional electrical works, premium air conditioning and energy-saving solutions for homes and businesses across Ghana.",
    keywords:
      "solar Ghana, air conditioning Ghana, electrician Cape Coast, energy efficiency Ghana, Luminex Energy Solutions",
    og_title: "Luminex Energy Solutions",
    og_description: "Smart Power. Cool Comfort. Brighter Futures.",
    og_image: "/images/hero.jpg",
    favicon: "",
  },
};

export const SERVICE_OPTIONS = [
  "Solar Power",
  "Electrical Works",
  "Air Conditioning",
  "Energy Savings",
  "Other",
];
export const PROPERTY_TYPES = [
  "Home / Residential",
  "Office",
  "Shop / Retail",
  "Hotel / Hospitality",
  "School / Institution",
  "Industrial / Warehouse",
  "Other",
];
export const CONTACT_METHODS = ["Phone Call", "WhatsApp", "SMS", "Email"];
export const QUOTE_STATUSES = [
  "New",
  "Contacted",
  "Assessment Scheduled",
  "Quoted",
  "Completed",
  "Cancelled",
] as const;
export const PROJECT_CATEGORIES = [
  "Solar",
  "Electrical",
  "Air Conditioning",
  "Energy Efficiency",
];
