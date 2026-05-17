import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import type { Event } from "@/lib/api";
import { formatDate } from "@/lib/events";

export function EventCard({ event }: { event: Event }) {
  return (
    <Link
      to="/event/$eventId"
      params={{ eventId: event.id.toString() }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated"
    >
      <div className="relative aspect-16/10 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
          {event.category_name || 'General'}
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
          ${event.price}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {event.title}
        </h3>
        <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            {formatDate(event.event_date)} · {event.event_time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {event.location}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">{(event.attendees || 0).toLocaleString()} attending</span>
          <span className="text-sm font-semibold text-primary">View details →</span>
        </div>
      </div>
    </Link>
  );
}
