import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  DollarSign,
  ImageIcon,
  MapPin,
  Tag,
  Type,
  Users,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { categories } from "@/lib/events";
import { api } from "@/lib/api";
import type { Event } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/edit/$eventId")({
  head: () => ({
    meta: [
      { title: "Edit Event — Eventify" },
      { name: "description", content: "Edit your event details." },
    ],
  }),
  component: EditEvent,
});

type Field =
  | "title"
  | "category"
  | "date"
  | "time"
  | "location"
  | "price"
  | "total_seats"
  | "description"
  | "image";

function EditEvent() {
  const navigate = useNavigate();
  const { eventId } = Route.useParams();
  const { isLoggedIn, isAdmin } = useAuth();
  const [form, setForm] = useState<Record<Field, string>>({
    title: "",
    category: "",
    date: "",
    time: "",
    location: "",
    price: "",
    total_seats: "",
    description: "",
    image: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/signin" });
      return;
    }
    if (!isAdmin) {
      navigate({ to: "/access-denied" });
      return;
    }
    fetchEvent();
  }, [isLoggedIn, isAdmin]);

  async function fetchEvent() {
    try {
      const response = await api.getEvent(parseInt(eventId));
      const e: Event = response.event;
      setForm({
        title: e.title || "",
        category: e.category_name || "",
        date: e.event_date?.split("T")[0] || "",
        time: e.event_time || "",
        location: e.location || "",
        price: String(e.price || ""),
        total_seats: String(e.total_seats || ""),
        description: e.description || "",
        image: e.image || "",
      });
    } catch (error) {
      toast.error("Failed to load event");
      navigate({ to: "/dashboard" });
    } finally {
      setFetching(false);
    }
  }

  function update<K extends Field>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!form.title) next.title = "Give your event a title";
    if (!form.category) next.category = "Pick a category";
    if (!form.date) next.date = "Select a date";
    if (!form.time) next.time = "Select a time";
    if (!form.location) next.location = "Add a location";
    if (!form.price || isNaN(+form.price)) next.price = "Enter a valid price";
    if (!form.total_seats || isNaN(+form.total_seats))
      next.total_seats = "Enter total seats";
    if (!form.description || form.description.length < 20)
      next.description = "At least 20 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      const categoryMap: Record<string, number> = {
        Music: 1,
        Tech: 2,
        Art: 3,
        Sports: 4,
        Food: 5,
        Workshops: 6,
      };

      await api.updateEvent(parseInt(eventId), {
        title: form.title,
        category_id: categoryMap[form.category] || 1,
        description: form.description,
        event_date: form.date,
        event_time: form.time,
        location: form.location,
        price: parseFloat(form.price),
        total_seats: parseInt(form.total_seats),
        image: form.image || undefined,
      });

      toast.success("Event updated successfully!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  if (!isAdmin) return null;

  if (fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Button variant="ghost" asChild size="sm">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
      </div>

      <SectionHeading
        eyebrow="Admin — Edit"
        title="Edit event"
        description="Update the details for this event."
      />

      <form
        onSubmit={submit}
        className="mt-10 space-y-6 rounded-3xl border border-border bg-gradient-card p-6 shadow-soft sm:p-8"
      >
        <FieldWrapper label="Event title" icon={Type} error={errors.title}>
          <input
            className={`${inputBase} ${errors.title ? "border-destructive" : "border-input"}`}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Summer Sound Festival 2026"
          />
        </FieldWrapper>

        <FieldWrapper label="Cover image URL" icon={ImageIcon}>
          <input
            className={`${inputBase} border-input`}
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://… (optional)"
          />
        </FieldWrapper>

        <div className="grid gap-6 sm:grid-cols-2">
          <FieldWrapper label="Category" icon={Tag} error={errors.category}>
            <select
              className={`${inputBase} ${errors.category ? "border-destructive" : "border-input"}`}
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </FieldWrapper>
          <FieldWrapper label="Price (USD)" icon={DollarSign} error={errors.price}>
            <input
              className={`${inputBase} ${errors.price ? "border-destructive" : "border-input"}`}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              type="number"
              min="0"
            />
          </FieldWrapper>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FieldWrapper label="Date" icon={Calendar} error={errors.date}>
            <input
              type="date"
              className={`${inputBase} ${errors.date ? "border-destructive" : "border-input"}`}
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </FieldWrapper>
          <FieldWrapper label="Time" icon={Clock} error={errors.time}>
            <input
              type="time"
              className={`${inputBase} ${errors.time ? "border-destructive" : "border-input"}`}
              value={form.time}
              onChange={(e) => update("time", e.target.value)}
            />
          </FieldWrapper>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FieldWrapper label="Location" icon={MapPin} error={errors.location}>
            <input
              className={`${inputBase} ${errors.location ? "border-destructive" : "border-input"}`}
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Venue, City"
            />
          </FieldWrapper>
          <FieldWrapper label="Total Seats" icon={Users} error={errors.total_seats}>
            <input
              type="number"
              min="1"
              className={`${inputBase} ${
                errors.total_seats ? "border-destructive" : "border-input"
              }`}
              value={form.total_seats}
              onChange={(e) => update("total_seats", e.target.value)}
            />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Description" error={errors.description}>
          <textarea
            rows={5}
            className={`${inputBase} ${
              errors.description ? "border-destructive" : "border-input"
            }`}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Tell attendees what to expect…"
          />
        </FieldWrapper>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/dashboard" })}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
          >
            {loading ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function FieldWrapper({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
        {Icon && <Icon className="h-4 w-4 text-primary" />} {label}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-destructive">{error}</span>
      )}
    </label>
  );
}
