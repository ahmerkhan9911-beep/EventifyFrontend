import { Link } from "@tanstack/react-router";
import { Twitter, Instagram, Github, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react";
import { Logo } from "@/components/Logo";

const CATEGORIES = ["Music", "Tech", "Sports", "Art", "Food", "Workshops", "Wedding", "Business"];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-10 max-w-xs text-sm text-navy-foreground/70 leading-relaxed">
              The modern platform to discover, create and book unforgettable live experiences — from intimate workshops to global festivals.
            </p>

            {/* Contact info */}
            <div className="mt-6 space-y-2">
              <a href="mailto:hello@eventify.com" className="flex items-center gap-2 text-xs text-navy-foreground/60 hover:text-white transition-colors">
                <Mail className="h-3.5 w-3.5 text-primary" /> hello@eventify.com
              </a>
              <a href="tel:+15550000000" className="flex items-center gap-2 text-xs text-navy-foreground/60 hover:text-white transition-colors">
                <Phone className="h-3.5 w-3.5 text-primary" /> +1 (555) 000-0000
              </a>
              <p className="flex items-center gap-2 text-xs text-navy-foreground/60">
                <MapPin className="h-3.5 w-3.5 text-primary" /> 123 Event Street, New York, NY
              </p>
            </div>

            {/* Socials */}
            <div className="mt-6 flex gap-3">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Instagram, label: "Instagram" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Github, label: "GitHub" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-navy-foreground/60 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-navy-foreground/50">Explore</h4>
            <ul className="space-y-2.5 text-sm text-navy-foreground/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Browse Events</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Categories</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-navy-foreground/50">Categories</h4>
            <ul className="space-y-2.5 text-sm text-navy-foreground/70">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <Link
                    to="/events"
                    onClick={() => sessionStorage.setItem("eventify_filter_category", c)}
                    className="hover:text-white transition-colors"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-navy-foreground/50">Account</h4>
            <ul className="space-y-2.5 text-sm text-navy-foreground/70">
              <li><Link to="/signin" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/signup" className="hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>

            <h4 className="mb-4 mt-6 text-xs font-semibold uppercase tracking-wider text-navy-foreground/50">Company</h4>
            <ul className="space-y-2.5 text-sm text-navy-foreground/70">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter strip */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Stay in the loop 🎉</p>
              <p className="text-xs text-navy-foreground/60">Get weekly picks of the best events near you.</p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:opacity-95 transition whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-navy-foreground/50 sm:flex-row">
            <p className="flex items-center gap-1">
              © {new Date().getFullYear()} Eventify. Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for event lovers.
            </p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
