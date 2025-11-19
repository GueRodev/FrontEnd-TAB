/**
 * useApi Hook
 * Centralizes API call logic with loading states, error handling, and toasts
 */

import { useState, useCallback } from 'react';
import { toast } from './use-toast';
import type { ValidationError } from '@/api/types';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

interface UseApiReturn<T> {
  isLoading: boolean;
  error: Error | null;
  data: T | null;
  execute: (apiCall: () => Promise<T>, options?: UseApiOptions) => Promise<T | undefined>;
  reset: () => void;
}

export function useApi<T = any>(): UseApiReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (
      apiCall: () => Promise<T>,
      options?: UseApiOptions
    ): Promise<T | undefined> => {
      const {
        onSuccess,
        onError,
        successMessage,
        errorMessage,
        showSuccessToast = true,
        showErrorToast = true,
      } = options || {};

      setIsLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);

        if (showSuccessToast && successMessage) {
          toast({
            title: 'Éxito',
            description: successMessage,
          });
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err as Error & Partial<ValidationError>;
        setError(error);

        if (showErrorToast) {
          // Handle Laravel validation errors (422)
          if (error.errors) {
            const errorMessages = Object.entries(error.errors)
              .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
              .join('\n');

            toast({
              title: 'Error de validación',
              description: errorMessages || error.message,
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Error',
              description: errorMessage || error.message,
              variant: 'destructive',
            });
          }
        }

        onError?.(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    execute,
    reset,
  };
}
