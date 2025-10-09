/**
 * Storage Adapter Interface
 * Abstraction layer for data persistence
 * Enables easy migration to different storage solutions (API, Supabase, etc.)
 */

export interface StorageAdapter {
  /**
   * Get item from storage
   */
  getItem<T>(key: string): T | null;

  /**
   * Set item in storage
   */
  setItem<T>(key: string, value: T): void;

  /**
   * Remove item from storage
   */
  removeItem(key: string): void;

  /**
   * Clear all items from storage
   */
  clear(): void;

  /**
   * Check if storage is available
   */
  isAvailable(): boolean;
}
