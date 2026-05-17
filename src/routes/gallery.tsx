import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Eventify" },
      { name: "description", content: "Browse stunning photos from events hosted on Eventify — concerts, weddings, conferences, and more." },
    ],
  }),
  component: Gallery,
});

const FILTERS = ["All", "Concerts", "Conferences", "Weddings", "Sports", "Festivals", "Workshops"];

const GALLERY_ITEMS = [
  { id: 1, category: "Concerts", title: "Summer Sound Festival", src: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800", span: "col-span-2 row-span-2" },
  { id: 2, category: "Conferences", title: "DevCon 2026", src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800", span: "" },
  { id: 3, category: "Weddings", title: "Modern Elegant Wedding", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", span: "" },
  { id: 4, category: "Sports", title: "Champions League Final", src: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800", span: "" },
  { id: 5, category: "Festivals", title: "Cultural Festival", src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800", span: "" },
  { id: 6, category: "Workshops", title: "Design Sprint Workshop", src: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800", span: "col-span-2" },
  { id: 7, category: "Concerts", title: "Neon Nights Concert", src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800", span: "" },
  { id: 8, category: "Weddings", title: "Garden Wedding Reception", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800", span: "" },
  { id: 9, category: "Conferences", title: "Tech Summit 2026", src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800", span: "" },
  { id: 10, category: "Sports", title: "Marathon City Run", src: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800", span: "" },
  { id: 11, category: "Festivals", title: "Food & Wine Festival", src: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800", span: "col-span-2" },
  { id: 12, category: "Workshops", title: "Art Masterclass", src: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800", span: "" },
];

function Gallery() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);

  const filtered = active === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === active);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Gallery"
            title="Moments that last forever"
            description="A curated collection of stunning photos from events hosted on Eventify. Every frame tells a story."
          />

          {/* Filters */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-all ${
                  active === f
                    ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl ${item.span}`}
              onClick={() => setLightbox(item)}
            >
              <img
                src={item.src}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/50">
                <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                  <span className="rounded-full bg-gradient-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                    {item.category}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-white">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-muted-foreground">No images in this category yet.</p>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="w-full rounded-2xl object-cover max-h-[80vh]"
            />
            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {lightbox.category}
              </span>
              <p className="text-base font-semibold text-white">{lightbox.title}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
