/**
 * Local Storage Adapter
 * SSR-safe implementation of StorageAdapter using localStorage
 */

import type { StorageAdapter } from './storage.adapter';

class LocalStorageAdapter implements StorageAdapter {
  private isSSR(): boolean {
    return typeof window === 'undefined';
  }

  isAvailable(): boolean {
    if (this.isSSR()) return false;
    
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  getItem<T>(key: string): T | null {
    if (!this.isAvailable()) return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  }

  setItem<T>(key: string, value: T): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  }

  removeItem(key: string): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }

  clear(): void {
    if (!this.isAvailable()) return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

export const localStorageAdapter = new LocalStorageAdapter();
