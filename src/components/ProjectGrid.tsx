import { useState } from "react";
import type { Project, ProjectMedia } from "@/lib/types";
import { CloseIcon, MapIcon, PlayIcon } from "./Icons";
import { Button } from "./ui";

function getFirstMedia(project: Project): ProjectMedia | null {
  return project.media?.[0] || null;
}

function isVideo(media: ProjectMedia | null): boolean {
  return media?.type === "video";
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  if (projects.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-dashed border-charcoal/15 bg-soft/60 px-6 py-14 sm:py-20 text-center">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-solar/20 blur-3xl" aria-hidden />
        <p className="text-xs font-semibold tracking-wider text-energy uppercase">Portfolio</p>
        <h3 className="mt-3 text-2xl sm:text-3xl font-bold">Projects coming soon</h3>
        <p className="mt-3 text-charcoal/60 max-w-md mx-auto leading-relaxed">
          Luminex launched in September 2026. As installations are completed across Ghana, we will share them here — real work, real locations.
        </p>
        <Button to="/quote" variant="dark" className="mt-7">Be one of our first projects</Button>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const media = getFirstMedia(p);
          const video = isVideo(media);
          return (
            <li key={p.id}>
              <button
                onClick={() => setActive(p)}
                className="group block w-full text-left overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-charcoal/5 transition hover:-translate-y-1 hover:shadow-premium"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  {video ? (
                    <>
                      {media.thumbnail && (
                        <img src={media.thumbnail} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                        <PlayIcon width={48} height={48} className="text-white" />
                      </div>
                    </>
                  ) : (
                    <img src={media?.url || ""} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5">
                  <span className="inline-block rounded-full bg-ice px-2.5 py-1 text-[11px] font-semibold text-energy">{p.category}</span>
                  <h3 className="mt-3 text-lg font-bold leading-snug">{p.title}</h3>
                  <p className="mt-1.5 flex items-center gap-1.5 text-sm text-charcoal/55"><MapIcon width={16} height={16} /> {p.location}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {active && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-charcoal/70 backdrop-blur-sm p-0 sm:p-6" onClick={() => { setActive(null); setPlayingVideo(null); }} role="dialog" aria-modal="true" aria-label={active.title}>
          <div className="w-full max-w-3xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/10]">
              {isVideo(getFirstMedia(active)) ? (
                <>
                  <video
                    src={getFirstMedia(active)?.url}
                    poster={getFirstMedia(active)?.thumbnail}
                    controls
                    className="h-full w-full"
                    autoPlay={playingVideo === active.id}
                    onPlay={() => setPlayingVideo(active.id)}
                    onPause={() => setPlayingVideo(null)}
                  />
                  {getFirstMedia(active)?.thumbnail && playingVideo !== active.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <img src={getFirstMedia(active)?.thumbnail} alt={active.title} className="h-full w-full object-cover" />
                      <PlayIcon width={64} height={64} className="text-white" />
                    </div>
                  )}
                </>
              ) : (
                <img src={getFirstMedia(active)?.url || ""} alt={active.title} className="h-full w-full object-cover" />
              )}
              <button onClick={() => { setActive(null); setPlayingVideo(null); }} className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-charcoal" aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-ice px-3 py-1 font-semibold text-energy">{active.category}</span>
                <span className="flex items-center gap-1.5 text-charcoal/55"><MapIcon width={16} height={16} /> {active.location}</span>
                {active.project_date && <span className="text-charcoal/55">{new Date(active.project_date).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>}
              </div>
              <h3 className="mt-4 text-2xl sm:text-3xl font-bold">{active.title}</h3>
              <p className="mt-3 text-charcoal/70 leading-relaxed">{active.description}</p>
              {active.details && <p className="mt-3 text-charcoal/70 leading-relaxed whitespace-pre-line">{active.details}</p>}
              <Button to="/quote" variant="primary" className="mt-6">Request a similar project</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}