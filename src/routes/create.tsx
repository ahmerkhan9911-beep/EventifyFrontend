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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { categories } from "@/lib/events";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/create")({
  head: () => ({
    meta: [
      { title: "Create Event — Eventify" },
      {
        name: "description",
        content: "Launch your event in minutes with Eventify's beautiful, simple form.",
      },
    ],
  }),
  component: CreateEvent,
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

function CreateEvent() {
  const navigate = useNavigate();
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

  // Guard: redirect if not admin
  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/signin" });
    } else if (!isAdmin) {
      navigate({ to: "/access-denied" });
    }
  }, [isLoggedIn, isAdmin]);

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
    // Reject base64 images — only URLs are accepted
    if (form.image && form.image.startsWith("data:"))
      next.image = "Paste an image URL (e.g. https://...), not a base64 image";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      // Map category name to category_id
      const categoryMap: Record<string, number> = {
        Music: 1,
        Tech: 2,
        Art: 3,
        Sports: 4,
        Food: 5,
        Workshops: 6,
      };

      const payload = {
        title: form.title,
        category_id: categoryMap[form.category] || 1,
        description: form.description,
        event_date: form.date,
        event_time: form.time,
        location: form.location,
        price: parseFloat(form.price),
        total_seats: parseInt(form.total_seats),
        available_seats: parseInt(form.total_seats),
        image: form.image || undefined,
      };
      
      console.log("Calling API URL: POST /api/events/admin/create");
      console.log("Request Payload:", payload);
      
      const response = await api.createEvent(payload);
      
      console.log("Backend Response:", response);

      toast.success("Event published!", {
        description: "Your event is now live on Eventify.",
      });
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      console.error("Error Response:", error);
      toast.error(error.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputBase =
    "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  if (!isAdmin) return null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Admin — Host"
        title="Create a new event"
        description="Fill in the details below — you can edit anything later."
      />

      <form
        onSubmit={submit}
        className="mt-10 space-y-6 rounded-3xl border border-border bg-gradient-card p-6 shadow-soft sm:p-8"
      >
        <FieldWrapper label="Event title" icon={Type} error={errors.title}>
          <input
            id="create-title"
            className={`${inputBase} ${errors.title ? "border-destructive" : "border-input"}`}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="e.g. Summer Sound Festival 2026"
          />
        </FieldWrapper>

        <FieldWrapper label="Cover image URL" icon={ImageIcon} error={errors.image}>
          <input
            id="create-image"
            className={`${inputBase} ${errors.image ? "border-destructive" : "border-input"}`}
            value={form.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://images.unsplash.com/... (paste a URL, not a file)"
          />
          {!errors.image && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              💡 Paste an image URL from the web (e.g. Unsplash). Do not upload or paste base64 data.
            </p>
          )}
        </FieldWrapper>

        <div className="grid gap-6 sm:grid-cols-2">
          <FieldWrapper label="Category" icon={Tag} error={errors.category}>
            <select
              id="create-category"
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
              id="create-price"
              className={`${inputBase} ${errors.price ? "border-destructive" : "border-input"}`}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              placeholder="0 for free"
              type="number"
              min="0"
            />
          </FieldWrapper>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FieldWrapper label="Date" icon={Calendar} error={errors.date}>
            <input
              id="create-date"
              type="date"
              className={`${inputBase} ${errors.date ? "border-destructive" : "border-input"}`}
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
            />
          </FieldWrapper>
          <FieldWrapper label="Time" icon={Clock} error={errors.time}>
            <input
              id="create-time"
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
              id="create-location"
              className={`${inputBase} ${errors.location ? "border-destructive" : "border-input"}`}
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
              placeholder="Venue, City"
            />
          </FieldWrapper>
          <FieldWrapper label="Total Seats" icon={Users} error={errors.total_seats}>
            <input
              id="create-seats"
              type="number"
              min="1"
              className={`${inputBase} ${
                errors.total_seats ? "border-destructive" : "border-input"
              }`}
              value={form.total_seats}
              onChange={(e) => update("total_seats", e.target.value)}
              placeholder="e.g. 200"
            />
          </FieldWrapper>
        </div>

        <FieldWrapper label="Description" error={errors.description}>
          <textarea
            id="create-description"
            rows={5}
            className={`${inputBase} ${errors.description ? "border-destructive" : "border-input"}`}
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
            id="create-submit"
            type="submit"
            disabled={loading}
            className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95"
          >
            {loading ? "Publishing…" : "Publish event"}
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
