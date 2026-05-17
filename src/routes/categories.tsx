import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Event Categories — Eventify" },
      { name: "description", content: "Browse all event categories on Eventify — concerts, weddings, tech conferences, sports, and more." },
    ],
  }),
  component: Categories,
});

const CATEGORIES = [
  {
    name: "Music",
    icon: "🎵",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-500/10",
    description: "Live concerts, festivals, and intimate performances",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600",
    count: "120+ events",
  },
  {
    name: "Tech",
    icon: "💻",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    description: "Developer conferences, hackathons, and workshops",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600",
    count: "85+ events",
  },
  {
    name: "Wedding",
    icon: "💍",
    color: "from-pink-500 to-rose-400",
    bg: "bg-pink-500/10",
    description: "Ceremonies, receptions, and engagement parties",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    count: "40+ events",
  },
  {
    name: "Sports",
    icon: "⚽",
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10",
    description: "Tournaments, marathons, and fitness events",
    image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600",
    count: "95+ events",
  },
  {
    name: "Art",
    icon: "🎨",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-500/10",
    description: "Gallery openings, exhibitions, and art fairs",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600",
    count: "55+ events",
  },
  {
    name: "Food",
    icon: "🍷",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/10",
    description: "Tastings, culinary festivals, and cooking classes",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600",
    count: "70+ events",
  },
  {
    name: "Business",
    icon: "💼",
    color: "from-slate-500 to-gray-600",
    bg: "bg-slate-500/10",
    description: "Networking events, summits, and trade shows",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600",
    count: "110+ events",
  },
  {
    name: "Entertainment",
    icon: "🎭",
    color: "from-indigo-500 to-purple-600",
    bg: "bg-indigo-500/10",
    description: "Shows, comedy nights, and theatrical performances",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
    count: "60+ events",
  },
  {
    name: "Workshops",
    icon: "🛠️",
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-500/10",
    description: "Skills workshops, masterclasses, and training",
    image: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600",
    count: "45+ events",
  },
  {
    name: "Birthday",
    icon: "🎂",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-500/10",
    description: "Birthday parties, surprises, and celebrations",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600",
    count: "30+ events",
  },
];

function navigateToCategory(name: string) {
  sessionStorage.setItem("eventify_filter_category", name);
}

function Categories() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Browse by type"
            title="Find events by category"
            description="Whether you're into music, tech, sports or food — there's an Eventify category for you."
          />
        </div>
      </section>

      {/* Category Cards */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to="/events"
              onClick={() => navigateToCategory(cat.name)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Icon badge */}
                <div className={`absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${cat.color} shadow-lg text-xl`}>
                  {cat.icon}
                </div>
                <span className="absolute bottom-3 right-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur">
                  {cat.count}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  {cat.name}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-8 shadow-glow text-center">
          <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">Don't see your category?</h2>
          <p className="mt-2 text-primary-foreground/85 text-sm">Browse all events or contact us to suggest a new category.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/events" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary hover:bg-white/90 transition">
              Browse all events <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition">
              Suggest a category
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
