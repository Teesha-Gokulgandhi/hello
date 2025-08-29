// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  address?: Address;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address?: Address;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Service types
export interface Service {
  _id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  pricePerKg: number;
  minimumQuantity: number;
  maximumQuantity: number;
  image?: string;
  isActive: boolean;
  features: string[];
  processingTime: string;
  availableAreas: string[];
  createdAt: string;
  updatedAt: string;
}

export type ServiceCategory = 
  | 'Paper & Cardboard'
  | 'Plastic'
  | 'Metal'
  | 'Glass'
  | 'Electronic Waste'
  | 'Organic Waste'
  | 'Textile'
  | 'Mixed Waste'
  | 'Bulk Pickup';

// Booking types
export interface BookingService {
  service: string | Service;
  quantity: number;
  estimatedPrice: number;
}

export interface Booking {
  _id: string;
  user: string | User;
  services: BookingService[];
  pickupAddress: Address;
  pickupDate: string;
  pickupTimeSlot: TimeSlot;
  contactPhone: string;
  alternatePhone?: string;
  specialInstructions?: string;
  status: BookingStatus;
  totalEstimatedPrice: number;
  actualWeight?: number;
  actualPrice?: number;
  assignedTo?: string | User;
  images: BookingImage[];
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  feedback?: BookingFeedback;
  createdAt: string;
  updatedAt: string;
}

export type TimeSlot = 
  | '9:00 AM - 12:00 PM'
  | '12:00 PM - 3:00 PM'
  | '3:00 PM - 6:00 PM'
  | '6:00 PM - 9:00 PM';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'in_progress'
  | 'picked_up'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'cash' | 'online' | 'bank_transfer';

export interface BookingImage {
  url: string;
  description?: string;
  uploadedAt: string;
}

export interface BookingFeedback {
  rating: number;
  comment?: string;
  submittedAt: string;
}

// Contact types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: ContactCategory;
  status: ContactStatus;
  priority: ContactPriority;
  assignedTo?: string | User;
  response?: ContactResponse;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ContactCategory = 
  | 'General Inquiry'
  | 'Service Request'
  | 'Complaint'
  | 'Feedback'
  | 'Partnership'
  | 'Technical Support'
  | 'Other';

export type ContactStatus = 'new' | 'in_progress' | 'resolved' | 'closed';
export type ContactPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ContactResponse {
  message: string;
  respondedBy: string | User;
  respondedAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: ContactCategory;
}

// API Response types
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalCount: number;
  };
}

// Form types
export interface BookingFormData {
  services: Array<{
    serviceId: string;
    quantity: number;
  }>;
  pickupAddress: Address;
  pickupDate: string;
  pickupTimeSlot: TimeSlot;
  contactPhone: string;
  alternatePhone?: string;
  specialInstructions?: string;
}

// Dashboard stats types
export interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  totalUsers: number;
  activeUsers: number;
  totalServices: number;
  totalContacts: number;
}

// UI State types
export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}

// Cart types for booking
export interface CartItem {
  service: Service;
  quantity: number;
  estimatedPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}