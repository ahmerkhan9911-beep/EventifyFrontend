import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Search, MapPin, Calendar, SlidersHorizontal } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getEvents, getCategories } from "@/lib/events";
import type { Event, Category } from "@/lib/api";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Browse Events — Eventify" },
      { name: "description", content: "Search and filter thousands of events by category, location and date." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const [q, setQ] = useState("");
  // Read pre-selected category from navbar/categories page navigation
  const [cat, setCat] = useState<string>(() => {
    const saved = sessionStorage.getItem("eventify_filter_category");
    if (saved) sessionStorage.removeItem("eventify_filter_category");
    return saved || "All";
  });
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsData, categoriesData] = await Promise.all([
          getEvents({ category: cat === "All" ? undefined : cat, search: q, city, date }),
          getCategories()
        ]);
        setEvents(eventsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, cat, city, date]);

  const categoryNames = ["All", ...categories.map(c => c.name)];

  return (
    <>
      <section className="bg-gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Browse" title="Find your next experience" description="Filter by category, city and date to find events made for you." />
          <div className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft md:grid-cols-12">
            <div className="relative md:col-span-5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" />
            </div>
            <div className="relative md:col-span-3">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" />
            </div>
            <div className="relative md:col-span-3">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-3 text-sm outline-none focus:border-primary" />
            </div>
            <button onClick={() => { setQ(""); setCat("All"); setCity(""); setDate(""); }} className="md:col-span-1 inline-flex items-center justify-center gap-1 rounded-xl border border-input bg-background px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary">
              <SlidersHorizontal className="h-4 w-4" /> Reset
            </button>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {categoryNames.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${cat === c ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow" : "border-border bg-card text-muted-foreground hover:text-foreground"}`}>{c}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{events.length}</span> event{events.length === 1 ? "" : "s"} found</p>
            {events.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-soft">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No events match your filters</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try clearing some filters or searching a different city.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((e: Event) => <EventCard key={e.id} event={e} />)}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
