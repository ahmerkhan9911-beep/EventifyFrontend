import { api, Event, Category } from "./api";

export type { Event, Category };

export const categories = [
  { name: "Music", icon: "🎵", count: 0 },
  { name: "Tech", icon: "💻", count: 0 },
  { name: "Art", icon: "🎨", count: 0 },
  { name: "Sports", icon: "⚽", count: 0 },
  { name: "Food", icon: "🍷", count: 0 },
  { name: "Workshops", icon: "🛠️", count: 0 },
];

// Legacy dummy data for fallback - will be replaced with API calls
export const events: Event[] = [];

export const myCreatedEvents: Event[] = [];
export const myBookedEvents: Event[] = [];

// API functions
export async function getEvents(params?: {
  category?: string;
  city?: string;
  date?: string;
  search?: string;
}) {
  try {
    const response = await api.getEvents(params);
    return response.events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEvent(id: number) {
  try {
    const response = await api.getEvent(id);
    return response.event;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function getCategories() {
  try {
    const response = await api.getCategories();
    return response.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getMyBookings() {
  try {
    const response = await api.getMyBookings();
    return response.bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
}

export async function getMyCreatedEvents() {
  try {
    const response = await api.getEvents();
    // Filter events created by current user (this would need user context)
    return response.events.slice(0, 2); // Placeholder
  } catch (error) {
    console.error('Error fetching created events:', error);
    return [];
  }
}

export async function similarEvents(event: Event) {
  try {
    const response = await api.getSimilarEvents(event.id);
    return response.events;
  } catch (error) {
    console.error('Error fetching similar events:', error);
    return [];
  }
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
