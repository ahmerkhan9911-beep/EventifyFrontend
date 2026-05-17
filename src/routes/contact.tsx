import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle, Twitter, Instagram, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Eventify" },
      { name: "description", content: "Get in touch with the Eventify team. We're here to help organizers and attendees." },
    ],
  }),
  component: Contact,
});

const contactInfo = [
  { icon: Mail, label: "Email us", value: "hello@eventify.com", sub: "We reply within 24 hours", color: "bg-blue-500/10 text-blue-500" },
  { icon: Phone, label: "Call us", value: "+1 (555) 000-0000", sub: "Mon–Fri, 9am–6pm EST", color: "bg-emerald-500/10 text-emerald-500" },
  { icon: MapPin, label: "Visit us", value: "123 Event Street, NYC", sub: "New York, NY 10001", color: "bg-rose-500/10 text-rose-500" },
  { icon: Clock, label: "Office hours", value: "Mon–Fri 9am–6pm", sub: "Weekend support via email", color: "bg-purple-500/10 text-purple-500" },
];

const socials = [
  { icon: Twitter, label: "Twitter", href: "#", color: "hover:text-[#1DA1F2]" },
  { icon: Instagram, label: "Instagram", href: "#", color: "hover:text-[#E1306C]" },
  { icon: Linkedin, label: "LinkedIn", href: "#", color: "hover:text-[#0A66C2]" },
  { icon: Github, label: "GitHub", href: "#", color: "hover:text-foreground" },
];

const faqs = [
  { q: "How do I create an event on Eventify?", a: "Sign up as an organizer, then use the Create Event form to add all your event details. Your event goes live instantly." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, PayPal, Apple Pay, and Google Pay. Transactions are secured by Stripe." },
  { q: "Can I get a refund for my ticket?", a: "Refund policies are set by each organizer. Check the event page for specific refund terms before booking." },
  { q: "How do I become a verified organizer?", a: "Complete your profile, submit identity verification, and host your first event. Verification takes 1–2 business days." },
];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function update(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
  }

  const inputBase = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-soft border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            eyebrow="Contact us"
            title="We'd love to hear from you"
            description="Have a question, need help with an event, or want to partner with us? Our team is ready to help."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Left sidebar */}
          <div className="space-y-6">
            {/* Contact info cards */}
            {contactInfo.map((c) => (
              <div key={c.label} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
                  <p className="mt-0.5 text-sm font-semibold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.sub}</p>
                </div>
              </div>
            ))}

            {/* Socials */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <p className="text-sm font-semibold text-foreground mb-3">Follow us</p>
              <div className="flex gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className={`grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition ${s.color} hover:border-primary/30 hover:bg-secondary`}
                  >
                    <s.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-2xl border border-border bg-secondary shadow-soft aspect-video flex items-center justify-center">
              <div className="text-center p-4">
                <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">123 Event Street</p>
                <p className="text-xs text-muted-foreground">New York, NY 10001</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-border bg-gradient-card p-12 text-center shadow-soft">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="mt-6 text-2xl font-bold">Message sent!</h2>
                <p className="mt-2 text-muted-foreground">Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <Button className="mt-8 bg-gradient-primary text-primary-foreground shadow-glow" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5 rounded-3xl border border-border bg-gradient-card p-6 shadow-soft sm:p-8">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" /> Send us a message
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
                    <input className={inputBase} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Email <span className="text-destructive">*</span></label>
                    <input type="email" className={inputBase} value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Subject</label>
                  <input className={inputBase} value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="How can we help?" />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">Message <span className="text-destructive">*</span></label>
                  <textarea rows={6} className={inputBase} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us more about your question or request…" />
                </div>

                <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}

            {/* FAQs */}
            <div className="mt-8">
              <h3 className="text-lg font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((f) => (
                  <details key={f.q} className="group rounded-2xl border border-border bg-card">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 text-sm font-medium hover:bg-secondary rounded-2xl list-none">
                      {f.q}
                      <span className="text-muted-foreground text-lg group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="px-4 pb-4 text-sm text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
