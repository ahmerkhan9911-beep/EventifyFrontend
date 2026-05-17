import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  CalendarPlus,
  DollarSign,
  Edit3,
  Eye,
  Plus,
  Ticket,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { formatDate } from "@/lib/events";
import { api } from "@/lib/api";
import type { Event, Booking, DashboardStats } from "@/lib/api";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Eventify" },
      {
        name: "description",
        content: "Manage all events, bookings and view platform stats.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { isLoggedIn, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/signin" });
      return;
    }
    if (!isAdmin) {
      navigate({ to: "/access-denied" });
      return;
    }
    fetchDashboardData();
  }, [isLoggedIn, isAdmin]);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      const [dashboardData, eventsData, bookingsData] = await Promise.all([
        api.getDashboardStats(),
        api.getEvents(),
        api.getAllBookings(),
      ]);
      setStats(dashboardData.stats);
      setEvents(eventsData.events);
      setBookings(bookingsData.bookings.slice(0, 10)); // Show latest 10
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteEvent(eventId: number, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingEventId(eventId);
    try {
      await api.deleteEvent(eventId);
      toast.success("Event deleted successfully");
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete event");
    } finally {
      setDeletingEventId(null);
    }
  }

  if (!isAdmin) return null;

  const statCards = stats
    ? [
        {
          label: "Total Events",
          value: stats.totalEvents.toLocaleString(),
          icon: CalendarPlus,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          label: "Total Users",
          value: stats.totalUsers.toLocaleString(),
          icon: Users,
          color: "text-purple-500",
          bg: "bg-purple-500/10",
        },
        {
          label: "Total Bookings",
          value: stats.totalBookings.toLocaleString(),
          icon: Ticket,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
        {
          label: "Total Revenue",
          value: `$${stats.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: "text-amber-500",
          bg: "bg-amber-500/10",
        },
      ]
    : [];

  const bookingStatusColors: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-amber-500/10 text-amber-600",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Admin Dashboard"
          title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Admin"}`}
          description="Manage events, bookings and monitor platform activity."
        />
        <Button
          asChild
          className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
        >
          <Link to="/create">
            <Plus className="mr-1 h-4 w-4" /> New event
          </Link>
        </Button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="mt-10 flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      ) : (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-gradient-card p-6 shadow-soft hover-lift"
              >
                <div className="flex items-center justify-between">
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg}`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                </div>
                <p className="mt-5 font-display text-3xl font-bold">{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Events table */}
          <div className="mt-12">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Manage Events</h2>
              <Link
                to="/create"
                className="text-sm font-medium text-primary hover:underline"
              >
                + Create new
              </Link>
            </div>

            {events.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3">Event</th>
                        <th className="hidden px-5 py-3 sm:table-cell">Date</th>
                        <th className="hidden px-5 py-3 md:table-cell">Seats</th>
                        <th className="hidden px-5 py-3 md:table-cell">Price</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((e) => (
                        <tr
                          key={e.id}
                          className="border-t border-border transition hover:bg-secondary/40"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  e.image ||
                                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200"
                                }
                                alt=""
                                className="h-12 w-16 rounded-lg object-cover flex-shrink-0"
                              />
                              <div>
                                <p className="font-medium text-foreground line-clamp-1">
                                  {e.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {e.category_name} · {e.location}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                            {formatDate(e.event_date)}
                          </td>
                          <td className="hidden px-5 py-4 md:table-cell">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                              {e.available_seats}/{e.total_seats}
                            </span>
                          </td>
                          <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                            ${e.price}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <Link
                                to="/events/$eventId"
                                params={{ eventId: String(e.id) }}
                                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                              <Link
                                to="/edit/$eventId"
                                params={{ eventId: String(e.id) }}
                                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteEvent(e.id, e.title)}
                                disabled={deletingEventId === e.id}
                                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Recent Bookings */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold">Recent Bookings</h2>
            {bookings.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No bookings yet.</p>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-secondary text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3">User</th>
                        <th className="px-5 py-3">Event</th>
                        <th className="hidden px-5 py-3 sm:table-cell">Tickets</th>
                        <th className="hidden px-5 py-3 md:table-cell">Amount</th>
                        <th className="px-5 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr
                          key={b.id}
                          className="border-t border-border transition hover:bg-secondary/40"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium">{b.user_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{b.user_email}</p>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground">
                            <p className="line-clamp-1 font-medium text-foreground">
                              {b.event_title}
                            </p>
                            {b.event_date && (
                              <p className="text-xs">{formatDate(b.event_date)}</p>
                            )}
                          </td>
                          <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                            {b.quantity}
                          </td>
                          <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                            ${b.total_amount}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                                bookingStatusColors[b.status] ??
                                "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-soft">
        <CalendarPlus className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No events yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first event in under 5 minutes.
      </p>
      <Button
        asChild
        className="mt-6 bg-gradient-primary text-primary-foreground"
      >
        <Link to="/create">Create event</Link>
      </Button>
    </div>
  );
}
