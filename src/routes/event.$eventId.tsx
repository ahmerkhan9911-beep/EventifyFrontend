import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Clock,
  MapPin,
  Users,
  Ticket,
  Heart,
  Share2,
  ArrowLeft,
  X,
  Phone,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/EventCard";
import { getEvent, similarEvents, formatDate } from "@/lib/events";
import { api } from "@/lib/api";
import type { Event } from "@/lib/api";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/event/$eventId")({
  component: EventDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Event not found</h1>
      <p className="mt-2 text-muted-foreground">The event you're looking for doesn't exist.</p>
      <Button asChild className="mt-6">
        <Link to="/events">Back to events</Link>
      </Button>
    </div>
  ),
});

// ─── Booking Modal ────────────────────────────────────────────────────────────
function BookingModal({
  event,
  onClose,
  onSuccess,
}: {
  event: Event;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [qtyError, setQtyError] = useState("");
  const [loading, setLoading] = useState(false);

  // MySQL returns price as a decimal string — always parse to float
  const price = parseFloat(String(event.price));
  const availableSeats = event.available_seats ?? 0;
  const maxTickets = Math.min(10, availableSeats);
  const total = (price * qty).toFixed(2);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    let valid = true;
    if (!phone.trim()) { setPhoneError("Phone number is required"); valid = false; }
    if (qty < 1 || qty > availableSeats) { setQtyError(`Max ${availableSeats} seat${availableSeats !== 1 ? "s" : ""} available`); valid = false; }
    if (!valid) return;

    setLoading(true);
    try {
      await api.createBooking(event.id, qty);
      toast.success("🎉 Booking confirmed!", {
        description: `${qty} ticket${qty > 1 ? "s" : ""} for ${event.title}`,
      });
      onSuccess();
      onClose();
      // Navigate to My Bookings so user can see their new booking immediately
      navigate({ to: "/my-bookings" });
    } catch (error: any) {
      toast.error(error.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full hover:bg-secondary text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-xl font-bold">Book tickets</h2>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{event.title}</p>

        <form onSubmit={handleConfirm} className="mt-5 space-y-4">
          {/* Auto-filled name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
              <User className="h-4 w-4 text-primary" /> Full Name
            </label>
            <input
              readOnly
              value={user?.name || ""}
              className="w-full rounded-xl border border-input bg-secondary px-4 py-2.5 text-sm text-muted-foreground"
            />
          </div>

          {/* Auto-filled email */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
              <Mail className="h-4 w-4 text-primary" /> Email
            </label>
            <input
              readOnly
              value={user?.email || ""}
              className="w-full rounded-xl border border-input bg-secondary px-4 py-2.5 text-sm text-muted-foreground"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
              <Phone className="h-4 w-4 text-primary" /> Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError("");
              }}
              placeholder="+1 (555) 000-0000"
              className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                phoneError ? "border-destructive" : "border-input"
              }`}
            />
            {phoneError && (
              <span className="mt-1 block text-xs font-medium text-destructive">
                {phoneError}
              </span>
            )}
          </div>

          {/* Tickets qty */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
              <Ticket className="h-4 w-4 text-primary" /> Number of Tickets
              <span className="ml-auto text-xs text-muted-foreground">{availableSeats} available</span>
            </label>
            <input
              type="number"
              min={1}
              max={maxTickets}
              value={qty}
              onChange={(e) => {
                const v = Math.max(1, Math.min(maxTickets, parseInt(e.target.value) || 1));
                setQty(v);
                setQtyError("");
              }}
              className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${qtyError ? "border-destructive" : "border-input"}`}
            />
            {qtyError && (
              <span className="mt-1 block text-xs font-medium text-destructive">{qtyError}</span>
            )}
          </div>

          {/* Total summary */}
          <div className="rounded-2xl bg-gradient-soft p-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Price per ticket</span>
              <span>${price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tickets</span>
              <span>× {qty}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || availableSeats === 0}
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
          >
            {loading ? "Confirming…" : `Confirm Booking — $${total}`}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Event Detail ─────────────────────────────────────────────────────────
function EventDetail() {
  const { eventId } = Route.useParams();
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [similar, setSimilar] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventData = await getEvent(parseInt(eventId));
        if (!eventData) throw notFound();
        setEvent(eventData);
        const similarEventsData = await similarEvents(eventData);
        setSimilar(similarEventsData);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  function handleBookNow() {
    if (!isLoggedIn) {
      toast.info("Please sign in to book events");
      navigate({ to: "/signin" });
      return;
    }
    if (isAdmin) {
      toast.info("Admins manage events — booking is for regular users");
      return;
    }
    setShowBooking(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Event not found</h1>
        <p className="mt-2 text-muted-foreground">The event you're looking for doesn't exist.</p>
        <Button asChild className="mt-6">
          <Link to="/events">Back to events</Link>
        </Button>
      </div>
    );
  }

  const soldOut = event.available_seats === 0;

  return (
    <>
      {/* Booking modal */}
      {showBooking && event && (
        <BookingModal
          event={event}
          onClose={() => setShowBooking(false)}
          onSuccess={() => setBooked(true)}
        />
      )}

      {/* Hero banner */}
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden bg-navy">
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
          }
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/60 to-navy/20" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6 lg:px-8">
          <Link
            to="/events"
            className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur hover:bg-white/20"
          >
            <ArrowLeft className="h-3 w-3" /> All events
          </Link>
          <span className="w-fit rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
            {event.category_name || "General"}
          </span>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold text-white sm:text-5xl">
            {event.title}
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Hosted by {event.organizer_name || "Event Organizer"}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        {/* Left: details */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: CalendarDays, label: "Date", value: formatDate(event.event_date) },
              { icon: Clock, label: "Time", value: event.event_time },
              { icon: MapPin, label: "Venue", value: event.location },
              {
                icon: Users,
                label: "Available",
                value: `${event.available_seats} seats`,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-4 shadow-soft"
              >
                <s.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
                <p className="mt-1 text-sm font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold">About this event</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {event.description}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Doors open one hour before the start time. Tickets are non-refundable but transferable. Accessible seating available — contact the organizer for details.
            </p>
          </div>
        </div>

        {/* Right: booking card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-border bg-gradient-card p-6 shadow-elevated">
            <p className="text-sm text-muted-foreground">From</p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-foreground">
                ${parseFloat(String(event.price)).toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">/ ticket</span>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Ticket className="h-4 w-4 text-primary" />
              <span>
                {soldOut ? (
                  <span className="font-semibold text-destructive">Sold out</span>
                ) : (
                  <>
                    <span className="font-semibold text-foreground">
                      {event.available_seats}
                    </span>{" "}
                    seats available
                  </>
                )}
              </span>
            </div>

            {/* Admin controls */}
            {isAdmin ? (
              <div className="mt-6 space-y-2">
                <Button asChild className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95" size="lg">
                  <Link to="/edit/$eventId" params={{ eventId: String(event.id) }}>
                    ✏️ Edit Event
                  </Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">Admin — manage this event from the dashboard</p>
              </div>
            ) : booked ? (
              <div className="mt-6 rounded-2xl bg-emerald-500/10 p-4 text-center">
                <p className="font-semibold text-emerald-600">✓ Booking confirmed!</p>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link to="/my-bookings">View my bookings</Link>
                </Button>
              </div>
            ) : (
              <Button
                className="mt-6 w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
                size="lg"
                onClick={handleBookNow}
                disabled={soldOut}
              >
                <Ticket className="mr-2 h-4 w-4" />
                {soldOut
                  ? "Sold Out"
                  : !isLoggedIn
                  ? "Sign in to Book"
                  : "Book Now"}
              </Button>
            )}

            {!isLoggedIn && !isAdmin && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>{" "}
                or{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  create an account
                </Link>{" "}
                to book.
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">
                <Heart className="mr-1 h-4 w-4" /> Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-1 h-4 w-4" /> Share
              </Button>
            </div>

            <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>$2.50</span>
              </div>
              <div className="flex justify-between">
                <span>Refundable until</span>
                <span>7 days before</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      {/* Similar events */}
      {similar.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold">Similar events</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
