import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Ticket, XCircle, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import type { Booking } from "@/lib/api";
import { formatDate } from "@/lib/events";
import { toast } from "sonner";

export const Route = createFileRoute("/my-bookings")({
  head: () => ({
    meta: [
      { title: "My Bookings — Eventify" },
      { name: "description", content: "View and manage all your event bookings." },
    ],
  }),
  component: MyBookings,
});

function MyBookings() {
  const { isLoggedIn, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  // Redirect if not logged in or is admin
  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/signin" });
      return;
    }
    if (isAdmin) {
      navigate({ to: "/access-denied" });
      return;
    }
    fetchBookings();
  }, [isLoggedIn, isAdmin]);

  async function fetchBookings() {
    setLoading(true);
    try {
      const response = await api.getMyBookings();
      setBookings(response.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Could not load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(bookingId: number) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancellingId(bookingId);
    try {
      await api.deleteBooking(bookingId);
      toast.success("Booking cancelled successfully");
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  }

  const statusColors: Record<string, string> = {
    confirmed: "bg-emerald-500/10 text-emerald-600",
    pending: "bg-amber-500/10 text-amber-600",
    cancelled: "bg-destructive/10 text-destructive",
  };

  if (!isLoggedIn) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="My account"
          title={`Your bookings, ${user?.name?.split(" ")[0]}`}
          description="All your event tickets and reservations in one place."
        />
        <Button variant="outline" asChild>
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse more events
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Loading your bookings…</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-card p-16 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-soft">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">No bookings yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't booked any events. Start exploring!
          </p>
          <Button asChild className="mt-6 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
            <Link to="/events">Browse events</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-elevated sm:flex-row sm:items-center"
            >
              {/* Event image */}
              <img
                src={
                  booking.event_image ||
                  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400"
                }
                alt={booking.event_title}
                className="h-28 w-full rounded-xl object-cover sm:h-20 sm:w-32 flex-shrink-0"
              />

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {booking.category_name || "Event"}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-foreground line-clamp-1">
                      {booking.event_title}
                    </h3>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      statusColors[booking.status] || "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {booking.event_date && (
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      {formatDate(booking.event_date)}
                      {booking.event_time && ` · ${booking.event_time}`}
                    </span>
                  )}
                  {booking.event_location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {booking.event_location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Ticket className="h-3.5 w-3.5 text-primary" />
                    {booking.quantity} ticket{booking.quantity !== 1 ? "s" : ""} · $
                    {booking.total_amount}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 gap-2 sm:flex-col sm:items-end">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link
                    to="/event/$eventId"
                    params={{ eventId: String(booking.event_id) }}
                  >
                    View event
                  </Link>
                </Button>
                {booking.status !== "cancelled" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={cancellingId === booking.id}
                    onClick={() => handleCancel(booking.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    {cancellingId === booking.id ? "Cancelling…" : "Cancel"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
