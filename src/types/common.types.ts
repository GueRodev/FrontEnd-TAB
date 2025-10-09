/**
 * Common utility types
 * Reusable types for Next.js migration and general use
 */

// API Response wrapper (ready for Next.js API routes)
export type ApiResponse<T> = {
  data: T;
  error?: string;
  status: number;
};

// Pagination types (ready for server-side pagination)
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common status types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Form state helper
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
}
