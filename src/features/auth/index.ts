/**
 * Auth Feature Module
 * Public API - Only export what's needed by other features
 */

// Components (UI)
export * from './components';

// Hooks (Business Logic)
export * from './hooks';

// Contexts (State Management)
export * from './contexts';

// Types (for external consumers)
export type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthState,
} from './types';

// Note: Services and validations are private to this feature
