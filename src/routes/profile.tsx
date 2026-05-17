import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Mail, Calendar, Ticket, Edit3, BookOpen, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Booking } from "@/lib/api";
import { formatDate } from "@/lib/events";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Eventify" },
      { name: "description", content: "View and manage your Eventify profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/signin" });
      return;
    }
    api.getMyBookings()
      .then((r) => setBookings(r.bookings.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn]);

  function handleLogout() {
    logout();
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  }

  if (!isLoggedIn) return null;

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const joinDate = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const statusColors: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-amber-500/10 text-amber-600",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Account" title="My Profile" description="Manage your account information and view your activity." />

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="rounded-3xl border border-border bg-gradient-card p-6 shadow-soft text-center lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-primary text-2xl font-bold text-primary-foreground shadow-glow">
            {initials}
          </div>
          <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="mt-2 flex justify-center">
            <span className={`rounded-full px-3 py-0.5 text-xs font-semibold capitalize ${user?.role === "admin" ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary"}`}>
              {user?.role}
            </span>
          </div>

          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>Member since {joinDate}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Ticket className="h-3.5 w-3.5" />
              <span>{bookings.length} booking{bookings.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/my-bookings">
                <BookOpen className="mr-2 h-4 w-4" /> My Bookings
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal Info */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Personal Information
              </h3>
              <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-500/10 rounded-full px-2.5 py-0.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</p>
                <p className="mt-1 text-sm font-semibold">{user?.name}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="mt-1 text-sm font-semibold">{user?.email}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</p>
                <p className="mt-1 text-sm font-semibold capitalize">{user?.role}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account ID</p>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">#{user?.id?.toString().padStart(6, "0")}</p>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Ticket className="h-5 w-5 text-primary" /> Recent Bookings
              </h3>
              <Link to="/my-bookings" className="text-sm font-medium text-primary hover:underline">
                View all →
              </Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <Ticket className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No bookings yet. Start exploring events!</p>
                <Button asChild className="mt-4 bg-gradient-primary text-primary-foreground shadow-glow" size="sm">
                  <Link to="/events">Browse events</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center gap-4 rounded-xl border border-border bg-background p-4">
                    <img
                      src={b.event_image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200"}
                      alt={b.event_title}
                      className="h-14 w-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1">{b.event_title}</p>
                      {b.event_date && <p className="text-xs text-muted-foreground">{formatDate(b.event_date)}</p>}
                      <p className="text-xs text-muted-foreground">{b.quantity} ticket{b.quantity !== 1 ? "s" : ""} · ${b.total_amount}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[b.status] ?? "bg-secondary text-muted-foreground"}`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { to: "/events", icon: Calendar, label: "Browse Events", sub: "Find your next experience" },
                { to: "/my-bookings", icon: Ticket, label: "My Bookings", sub: "View all your tickets" },
                { to: "/gallery", icon: BookOpen, label: "Gallery", sub: "See event highlights" },
                { to: "/contact", icon: Mail, label: "Get Support", sub: "We're here to help" },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 hover:bg-secondary hover:border-primary/30 transition-colors group"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-primary shadow-glow shrink-0">
                    <l.icon className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">{l.label}</p>
                    <p className="text-xs text-muted-foreground">{l.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
