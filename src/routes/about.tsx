import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Shield, Heart, Users, Star, Award, Globe, TrendingUp, CheckCircle, ArrowRight, Calendar, Ticket, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Eventify" },
      { name: "description", content: "Learn about Eventify — the modern platform for discovering and hosting unforgettable events." },
    ],
  }),
  component: About,
});

const stats = [
  { value: "50K+", label: "Events Hosted", icon: Calendar },
  { value: "2.4M", label: "Tickets Sold", icon: Ticket },
  { value: "180+", label: "Cities Worldwide", icon: Globe },
  { value: "25K+", label: "Happy Organizers", icon: Users },
];

const features = [
  { icon: Zap, title: "Lightning Fast Booking", text: "Secure your tickets in under 30 seconds. Our checkout converts 2× better than legacy platforms.", color: "bg-blue-500/10 text-blue-500" },
  { icon: Shield, title: "Trusted & Secure", text: "Bank-level encryption, fraud protection, and verified organizers for every event on our platform.", color: "bg-emerald-500/10 text-emerald-500" },
  { icon: Heart, title: "Built for Humans", text: "An interface so intuitive your attendees will compliment it. Accessibility is never an afterthought.", color: "bg-rose-500/10 text-rose-500" },
  { icon: TrendingUp, title: "Grow Your Audience", text: "Smart discovery tools that put your event in front of exactly the right people at the right time.", color: "bg-purple-500/10 text-purple-500" },
  { icon: Award, title: "Award-Winning Support", text: "24/7 customer success team ready to help organizers and attendees at every step of the journey.", color: "bg-amber-500/10 text-amber-500" },
  { icon: Globe, title: "Global Reach", text: "Host events in 180+ cities worldwide. Multi-currency, multi-language support built in.", color: "bg-cyan-500/10 text-cyan-500" },
];

const process = [
  { step: "01", icon: Search, title: "Discover", desc: "Browse thousands of curated events by category, city, or vibe. Find exactly what excites you." },
  { step: "02", icon: Ticket, title: "Book Instantly", desc: "Secure your spot in seconds. One-tap checkout with multiple payment options." },
  { step: "03", icon: Calendar, title: "Get Ready", desc: "Receive digital tickets, reminders, and all venue info automatically on your device." },
  { step: "04", icon: Star, title: "Experience & Share", desc: "Show up, enjoy the moment, and share your experience with the Eventify community." },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", bg: "from-blue-500 to-purple-500", initials: "SC" },
  { name: "Marcus Rivera", role: "CTO & Co-Founder", bg: "from-emerald-500 to-cyan-500", initials: "MR" },
  { name: "Aisha Patel", role: "Head of Design", bg: "from-rose-500 to-orange-500", initials: "AP" },
  { name: "David Kim", role: "VP of Growth", bg: "from-amber-500 to-yellow-500", initials: "DK" },
];

const values = [
  "We believe every event should be unforgettable",
  "Transparency in pricing and policies",
  "Organizer success is our success",
  "Community over competition",
  "Accessibility for every attendee",
  "Data privacy and security first",
];

function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur mb-6">
            <Star className="h-3.5 w-3.5 text-primary" /> Our Story
          </span>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            The platform that makes <br />
            <span className="text-gradient">events unforgettable</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-foreground/80">
            Eventify was founded in 2020 with a single mission — make discovering and hosting live experiences as effortless and joyful as the events themselves.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
              <Link to="/events">Explore Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/5 text-white hover:bg-white/10">
              <Link to="/contact">Get in touch</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft hover-lift">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                  <s.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <SectionHeading eyebrow="Our Mission" title="Bringing people together through shared experiences" description="We believe live experiences are one of the most powerful forces in the world. A concert, a conference, a workshop — these moments change how people think, feel, and connect." />
            <ul className="mt-8 space-y-3">
              {values.map((v) => (
                <li key={v} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gradient-primary p-6 text-primary-foreground shadow-glow">
              <p className="text-4xl font-bold">98%</p>
              <p className="mt-2 text-sm opacity-90">Attendee satisfaction rate</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-4xl font-bold text-foreground">4.9★</p>
              <p className="mt-2 text-sm text-muted-foreground">Average event rating</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <p className="text-4xl font-bold text-foreground">12s</p>
              <p className="mt-2 text-sm text-muted-foreground">Average booking time</p>
            </div>
            <div className="rounded-2xl bg-navy p-6 text-navy-foreground shadow-soft">
              <p className="text-4xl font-bold">Zero</p>
              <p className="mt-2 text-sm opacity-90">Hidden fees ever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-navy py-20 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading align="center" eyebrow="Why Eventify" title="Built different. On purpose." description="Every feature exists because an organizer or attendee asked for it." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10">
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${f.color}`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-navy-foreground/70">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process / Timeline */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading align="center" eyebrow="How it works" title="From discovery to the door in 4 steps" />
        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {process.map((p, i) => (
            <div key={p.step} className="relative rounded-2xl border border-border bg-gradient-card p-6 shadow-soft hover-lift text-center">
              <span className="absolute right-4 top-4 font-display text-4xl font-bold text-primary/10">{p.step}</span>
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                <p.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              {i < process.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30 hidden md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading align="center" eyebrow="Our Team" title="The people behind Eventify" description="A passionate team of event lovers, engineers, and designers." />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft hover-lift">
                <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${m.bg} text-xl font-bold text-white shadow-glow`}>
                  {m.initials}
                </div>
                <h3 className="mt-4 text-base font-semibold">{m.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 pb-24 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-gradient-primary p-10 shadow-glow sm:p-16 text-center">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">Ready to experience Eventify?</h2>
          <p className="mt-3 text-primary-foreground/85">Join 25,000+ organizers and millions of attendees worldwide.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/events">Browse events</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
