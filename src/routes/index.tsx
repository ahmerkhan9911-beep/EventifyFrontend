import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Search, Sparkles, Star, Ticket, Users, Zap, Shield, Heart } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getEvents, getCategories } from "@/lib/events";
import type { Event, Category } from "@/lib/api";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eventify — Discover, Create & Book Unforgettable Events" },
      { name: "description", content: "The modern platform for discovering and hosting world-class events." },
    ],
  }),
  component: Home,
});

const testimonials = [
  { name: "Maya Chen", role: "Event Producer", quote: "Eventify made selling out our 5,000-person conference effortless. The dashboard is genuinely beautiful.", rating: 5 },
  { name: "Diego Alvarez", role: "Festival Director", quote: "We moved 12 festivals onto Eventify in one season. Attendees love how fast booking is.", rating: 5 },
  { name: "Aisha Patel", role: "Workshop Host", quote: "Setup took 4 minutes. My first workshop sold out in 48 hours.", rating: 5 },
];

const steps = [
  { icon: Search, title: "Discover", text: "Browse curated events by category, city or vibe." },
  { icon: Ticket, title: "Book instantly", text: "Secure tickets in seconds with one-tap checkout." },
  { icon: CalendarCheck, title: "Show up & enjoy", text: "Get reminders, mobile tickets and venue info." },
];

const features = [
  { icon: Zap, title: "Lightning fast", text: "Optimized checkout that converts 2x better than legacy platforms." },
  { icon: Shield, title: "Trusted & secure", text: "Bank-level encryption, fraud protection and verified organizers." },
  { icon: Heart, title: "Built for humans", text: "An interface so good your attendees will compliment it." },
  { icon: Users, title: "Grow your audience", text: "Discovery tools that put your event in front of the right people." },
];

function Home() {
  const { isLoggedIn, isAdmin } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, categoriesData] = await Promise.all([
          getEvents(),
          getCategories()
        ]);
        setEvents(eventsData.slice(0, 6)); // Featured events - first 6
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryIcons: Record<string, string> = {
    'Music': '🎵',
    'Tech': '💻',
    'Art': '🎨',
    'Sports': '⚽',
    'Food': '🍷',
    'Workshops': '🛠️'
  };

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <img src={heroImg} alt="" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-linear-to-b from-navy/60 via-navy/70 to-navy" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Trusted by 25,000+ organizers worldwide
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Where every<br />
              <span className="text-gradient">unforgettable moment</span><br />
              begins.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-navy-foreground/80 sm:text-lg">
              Discover concerts, conferences, workshops and festivals — or launch your own in minutes with the most loved event platform.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                <Link to="/events">Explore events <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              {!isLoggedIn && (
                <Button size="lg" variant="outline" asChild className="border-white/30 bg-white/5 text-white hover:bg-white/10">
                  <Link to="/signup">Create account</Link>
                </Button>
              )}
              {isAdmin && (
                <Button size="lg" variant="outline" asChild className="border-white/30 bg-white/5 text-white hover:bg-white/10">
                  <Link to="/create">Host an event</Link>
                </Button>
              )}
            </div>
            <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-10">
              {[["50K+","Events hosted"],["2.4M","Tickets sold"],["180+","Cities"]].map(([n,l])=>(
                <div key={l}>
                  <dt className="font-display text-3xl font-bold text-white sm:text-4xl">{n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-navy-foreground/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Featured" title="Hand-picked events you'll love" description="Curated weekly by our team — from intimate gatherings to festival giants." />
          <Button variant="ghost" asChild>
            <Link to="/events">View all <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        </div>
        {loading ? (
          <div className="mt-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading featured events...</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e: Event) => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading align="center" eyebrow="Categories" title="Find your scene" description="Whatever you're into, there's an Eventify for that." />
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c: Category) => (
              <Link key={c.name} to="/events" className="group rounded-2xl border border-border bg-card p-6 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-elevated">
                <div className="text-3xl">{categoryIcons[c.name] || '📅'}</div>
                <h3 className="mt-3 font-semibold text-foreground group-hover:text-primary">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.event_count || 0} events</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading align="center" eyebrow="How it works" title="From discovery to door — in 3 steps" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-gradient-card p-8 shadow-soft hover-lift">
              <span className="absolute right-6 top-6 font-display text-5xl font-bold text-primary/10">0{i+1}</span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                <s.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="bg-navy py-20 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading align="center" eyebrow="Why Eventify" title="Built different. On purpose." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-navy-foreground/70">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading align="center" eyebrow="Loved by organizers" title="Don't just take our word for it" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-2xl border border-border bg-card p-7 shadow-soft hover-lift">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-4 text-base text-foreground">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary font-semibold text-primary-foreground">
                  {t.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-10 shadow-glow sm:p-16">
          <div className="mx-auto max-w-2xl text-center text-primary-foreground">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Never miss what's next</h2>
            <p className="mt-3 text-primary-foreground/85">Get the best events of the week, hand-picked for your city.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <input type="email" required placeholder="you@example.com" className="flex-1 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/60 outline-none focus:border-white" />
              <Button type="submit" className="rounded-full bg-white text-primary hover:bg-white/90">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
