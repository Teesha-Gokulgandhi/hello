import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  Service,
  Booking,
  BookingFormData,
  Contact,
  ContactFormData,
  PaginatedResponse,
  ApiResponse
} from '../types';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>('/auth/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await this.api.get<{ user: User }>('/auth/me');
    return response.data;
  }

  async updateProfile(userData: Partial<User>, profileImage?: File): Promise<{ user: User }> {
    const formData = new FormData();
    
    Object.keys(userData).forEach(key => {
      const value = userData[key as keyof User];
      if (value !== undefined) {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    const response = await this.api.put<{ user: User }>('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const response = await this.api.put<ApiResponse>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  }

  // Service endpoints
  async getServices(params?: {
    category?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Service> & { services: Service[] }> {
    const response = await this.api.get<PaginatedResponse<Service> & { services: Service[] }>('/services', { params });
    return response.data;
  }

  async getServiceById(id: string): Promise<{ service: Service }> {
    const response = await this.api.get<{ service: Service }>(`/services/${id}`);
    return response.data;
  }

  async getServiceCategories(): Promise<{ categories: string[] }> {
    const response = await this.api.get<{ categories: string[] }>('/services/categories');
    return response.data;
  }

  async createService(serviceData: Partial<Service>, image?: File): Promise<{ service: Service }> {
    const formData = new FormData();
    
    Object.keys(serviceData).forEach(key => {
      const value = serviceData[key as keyof Service];
      if (value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (image) {
      formData.append('serviceImage', image);
    }

    const response = await this.api.post<{ service: Service }>('/services', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateService(id: string, serviceData: Partial<Service>, image?: File): Promise<{ service: Service }> {
    const formData = new FormData();
    
    Object.keys(serviceData).forEach(key => {
      const value = serviceData[key as keyof Service];
      if (value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (image) {
      formData.append('serviceImage', image);
    }

    const response = await this.api.put<{ service: Service }>(`/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async deleteService(id: string): Promise<ApiResponse> {
    const response = await this.api.delete<ApiResponse>(`/services/${id}`);
    return response.data;
  }

  // Booking endpoints
  async createBooking(bookingData: BookingFormData): Promise<{ booking: Booking }> {
    const response = await this.api.post<{ booking: Booking }>('/bookings', bookingData);
    return response.data;
  }

  async getBookings(params?: {
    status?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Booking> & { bookings: Booking[] }> {
    const response = await this.api.get<PaginatedResponse<Booking> & { bookings: Booking[] }>('/bookings', { params });
    return response.data;
  }

  async getBookingById(id: string): Promise<{ booking: Booking }> {
    const response = await this.api.get<{ booking: Booking }>(`/bookings/${id}`);
    return response.data;
  }

  async updateBookingStatus(id: string, status: string, additionalData?: any): Promise<{ booking: Booking }> {
    const response = await this.api.put<{ booking: Booking }>(`/bookings/${id}/status`, {
      status,
      ...additionalData,
    });
    return response.data;
  }

  async cancelBooking(id: string): Promise<{ booking: Booking }> {
    const response = await this.api.put<{ booking: Booking }>(`/bookings/${id}/cancel`);
    return response.data;
  }

  async addBookingFeedback(id: string, rating: number, comment?: string): Promise<{ booking: Booking }> {
    const response = await this.api.post<{ booking: Booking }>(`/bookings/${id}/feedback`, {
      rating,
      comment,
    });
    return response.data;
  }

  async uploadBookingImages(id: string, images: File[], description?: string): Promise<{ images: any[] }> {
    const formData = new FormData();
    
    images.forEach(image => {
      formData.append('bookingImages', image);
    });

    if (description) {
      formData.append('description', description);
    }

    const response = await this.api.post<{ images: any[] }>(`/bookings/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Contact endpoints
  async submitContactForm(contactData: ContactFormData): Promise<{ contactId: string }> {
    const response = await this.api.post<{ contactId: string }>('/contact', contactData);
    return response.data;
  }

  async getContacts(params?: {
    status?: string;
    category?: string;
    priority?: string;
    search?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<Contact> & { contacts: Contact[] }> {
    const response = await this.api.get<PaginatedResponse<Contact> & { contacts: Contact[] }>('/contact', { params });
    return response.data;
  }

  async getContactById(id: string): Promise<{ contact: Contact }> {
    const response = await this.api.get<{ contact: Contact }>(`/contact/${id}`);
    return response.data;
  }

  async updateContactStatus(id: string, status: string, priority?: string, assignedTo?: string): Promise<{ contact: Contact }> {
    const response = await this.api.put<{ contact: Contact }>(`/contact/${id}/status`, {
      status,
      priority,
      assignedTo,
    });
    return response.data;
  }

  async respondToContact(id: string, message: string): Promise<{ contact: Contact }> {
    const response = await this.api.post<{ contact: Contact }>(`/contact/${id}/respond`, {
      message,
    });
    return response.data;
  }

  // User management endpoints (Admin only)
  async getUsers(params?: {
    search?: string;
    role?: string;
    isActive?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User> & { users: User[] }> {
    const response = await this.api.get<PaginatedResponse<User> & { users: User[] }>('/users', { params });
    return response.data;
  }

  async getUserById(id: string): Promise<{ user: User }> {
    const response = await this.api.get<{ user: User }>(`/users/${id}`);
    return response.data;
  }

  async updateUserStatus(id: string, isActive: boolean): Promise<{ user: User }> {
    const response = await this.api.put<{ user: User }>(`/users/${id}/status`, { isActive });
    return response.data;
  }

  async updateUserRole(id: string, role: string): Promise<{ user: User }> {
    const response = await this.api.put<{ user: User }>(`/users/${id}/role`, { role });
    return response.data;
  }

  // Dashboard stats endpoints
  async getDashboardStats(): Promise<any> {
    const response = await this.api.get('/dashboard/stats');
    return response.data;
  }

  async getUserStats(): Promise<any> {
    const response = await this.api.get('/users/stats/dashboard');
    return response.data;
  }

  async getContactStats(): Promise<any> {
    const response = await this.api.get('/contact/stats/dashboard');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;