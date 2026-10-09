import { useState } from "react";
import { useSite } from "@/context/SiteContext";
import { PageHeader } from "@/components/PageHeader";
import { Container } from "@/components/ui";
import { ProjectGrid } from "@/components/ProjectGrid";
import { PROJECT_CATEGORIES } from "@/lib/defaults";
import { cn } from "@/utils/cn";

export default function Projects() {
  const { data } = useSite();
  const [cat, setCat] = useState("All");
  const all = data.projects.filter((p) => p.published);
  const list = cat === "All" ? all : all.filter((p) => p.category === cat);

  return (
    <>
      <PageHeader eyebrow="Projects" title="Our work across Ghana." intro="Solar, electrical, air-conditioning and energy-efficiency installations completed by the Luminex team." />
      <section className="py-16 lg:py-24">
        <Container>
          {all.length > 0 && (
            <div className="-mx-5 px-5 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
              <div className="flex gap-2 pb-2">
                {["All", ...PROJECT_CATEGORIES].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className={cn(
                      "whitespace-nowrap rounded-full px-5 min-h-[44px] text-sm font-semibold transition",
                      cat === c ? "bg-charcoal text-white" : "bg-soft text-charcoal/70 hover:bg-ice"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mt-8">
            <ProjectGrid projects={list} />
          </div>
        </Container>
      </section>
    </>
  );
}
