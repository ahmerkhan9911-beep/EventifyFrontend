const API_BASE_URL = 'http://localhost:5003/api';

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  [key: string]: any;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  category_id: number;
  category_name?: string;
  image: string;
  event_date: string;
  event_time: string;
  location: string;
  price: number;
  total_seats: number;
  available_seats: number;
  attendees?: number;
  organizer_name?: string;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  event_count?: number;
  created_at?: string;
}

export interface Booking {
  id: number;
  user_id: number;
  event_id: number;
  quantity: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  booking_date: string;
  event_title?: string;
  event_date?: string;
  event_time?: string;
  event_location?: string;
  event_image?: string;
  category_name?: string;
  user_name?: string;
  user_email?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Load token on init so requests are authenticated after page refresh
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('eventify_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('eventify_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('eventify_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('eventify_token');
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.getToken()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Auth endpoints
  async signup(name: string, email: string, password: string, role: 'user' | 'admin' = 'user') {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async signin(email: string, password: string) {
    const response = await this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getMe(): Promise<{ user: User }> {
    return this.request('/auth/me');
  }

  // Events endpoints
  async getEvents(params?: {
    category?: string;
    city?: string;
    date?: string;
    search?: string;
  }): Promise<{ events: Event[] }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    const query = searchParams.toString();
    return this.request(`/events${query ? `?${query}` : ''}`);
  }

  async getEvent(id: number): Promise<{ event: Event }> {
    return this.request(`/events/${id}`);
  }

  async getSimilarEvents(id: number): Promise<{ events: Event[] }> {
    return this.request(`/events/${id}/similar`);
  }

  async createEvent(eventData: Partial<Event>): Promise<{ event: Event }> {
    return this.request('/events/admin/create', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<{ event: Event }> {
    return this.request(`/events/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: number): Promise<{ message: string }> {
    return this.request(`/events/admin/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories endpoints
  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request('/categories');
  }

  async createCategory(categoryData: Partial<Category>): Promise<{ category: Category }> {
    return this.request('/categories/admin/create', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: number, categoryData: Partial<Category>): Promise<{ category: Category }> {
    return this.request(`/categories/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    return this.request(`/categories/admin/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings endpoints
  async createBooking(eventId: number, quantity: number = 1): Promise<{ booking: Booking }> {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify({ event_id: eventId, quantity }),
    });
  }

  async getMyBookings(): Promise<{ bookings: Booking[] }> {
    return this.request('/bookings/my-bookings');
  }

  async getAllBookings(): Promise<{ bookings: Booking[] }> {
    return this.request('/bookings/admin/all');
  }

  async updateBookingStatus(id: number, status: Booking['status']): Promise<{ booking: Booking }> {
    return this.request(`/bookings/admin/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteBooking(id: number): Promise<{ message: string }> {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  // Users endpoints
  async getAllUsers(): Promise<{ users: User[] }> {
    return this.request('/users/admin/all');
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    return this.request(`/users/admin/${id}`, {
      method: 'DELETE',
    });
  }

  async getDashboardStats(): Promise<{ 
    stats: DashboardStats; 
    latestBookings: Booking[]; 
    popularEvents: Event[]; 
    monthlyRevenue: any[] 
  }> {
    return this.request('/users/admin/dashboard/stats');
  }
}

export const api = new ApiClient();
