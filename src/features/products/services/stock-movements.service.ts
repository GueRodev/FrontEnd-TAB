/**
 * Stock Movements Service
 * Manages stock tracking, reservations, and inventory history
 * Laravel Integration Ready with localStorage fallback
 */

import { apiClient } from '@/api';
import { APP_CONFIG } from '@/config';
import type {
  StockMovement,
  StockAvailability,
  ReserveStockDto,
  AdjustStockDto,
} from '../types';
import { transformLaravelStockMovement } from '../utils';

/**
 * Filters for stock movements queries
 */
export interface StockMovementFilters {
  product_id?: string;
  type?: string;
  user_id?: string;
  order_id?: string;
  from_date?: string;
  to_date?: string;
  page?: number;
  per_page?: number;
}

/**
 * Stock Movements Service
 */
class StockMovementsService {
  /**
   * Get stock movements for a specific product
   */
  async getByProduct(productId: string): Promise<StockMovement[]> {
    if (APP_CONFIG.useAPI) {
      const response = await apiClient.get<StockMovement[]>(
        `/products/${productId}/stock-movements`
      );
      return response.map(transformLaravelStockMovement);
    }

    // localStorage fallback - return empty array
    return [];
  }

  /**
   * Get all stock movements with optional filters
   */
  async getAll(filters?: StockMovementFilters): Promise<StockMovement[]> {
    if (APP_CONFIG.useAPI) {
      const response = await apiClient.get<StockMovement[]>('/stock-movements', {
        params: filters,
      });
      return response.map(transformLaravelStockMovement);
    }

    // localStorage fallback - return empty array
    return [];
  }

  /**
   * Check stock availability for multiple items
   * Used before order creation to validate stock
   */
  async checkAvailability(
    items: Array<{ product_id: string; quantity: number }>
  ): Promise<StockAvailability> {
    if (APP_CONFIG.useAPI) {
      const response = await apiClient.post<StockAvailability>(
        '/stock-movements/check-availability',
        { items }
      );
      return response;
    }

    // localStorage fallback - simple check
    const errors: any[] = [];
    const products = this.getLocalProducts();

    for (const item of items) {
      const product = products.find(p => p.id === item.product_id);
      if (!product) {
        errors.push({
          product_id: item.product_id,
          product_name: 'Producto desconocido',
          requested: item.quantity,
          available: 0,
          message: 'Producto no encontrado',
        });
      } else if (product.stock < item.quantity) {
        errors.push({
          product_id: item.product_id,
          product_name: product.name,
          requested: item.quantity,
          available: product.stock,
          message: `Stock insuficiente. Disponible: ${product.stock}`,
        });
      }
    }

    return {
      available: errors.length === 0,
      errors,
    };
  }

  /**
   * Reserve stock for a pending order
   * Creates 'reserva' movements for each item
   */
  async reserveStock(dto: ReserveStockDto): Promise<void> {
    if (APP_CONFIG.useAPI) {
      await apiClient.post('/stock-movements/reserve', dto);
      return;
    }

    // localStorage fallback - no operation needed
    // Stock is checked at order creation time
  }

  /**
   * Confirm sale and deduct real stock
   * Creates 'venta' movements and updates product stock
   */
  async confirmSale(orderId: string): Promise<void> {
    if (APP_CONFIG.useAPI) {
      await apiClient.post(`/stock-movements/confirm-sale/${orderId}`);
      return;
    }

    // localStorage fallback - deduct stock manually
    const orders = this.getLocalOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      const products = this.getLocalProducts();
      
      for (const item of order.items) {
        const productIndex = products.findIndex(p => p.id === item.id);
        if (productIndex !== -1) {
          products[productIndex].stock -= item.quantity;
        }
      }
      
      localStorage.setItem('products', JSON.stringify(products));
    }
  }

  /**
   * Cancel reservation and release stock
   * Creates 'cancelacion_reserva' movements
   */
  async cancelReservation(orderId: string): Promise<void> {
    if (APP_CONFIG.useAPI) {
      await apiClient.post(`/stock-movements/cancel-reservation/${orderId}`);
      return;
    }

    // localStorage fallback - no operation needed
    // Stock is restored at order cancellation time
  }

  /**
   * Manual stock adjustment
   * Creates 'entrada', 'salida', or 'ajuste' movement
   */
  async adjustStock(
    productId: string,
    dto: AdjustStockDto
  ): Promise<StockMovement> {
    if (APP_CONFIG.useAPI) {
      const response = await apiClient.post<StockMovement>(
        `/products/${productId}/stock`,
        dto
      );
      return transformLaravelStockMovement(response);
    }

    // localStorage fallback - update stock directly
    const products = this.getLocalProducts();
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const stockBefore = products[productIndex].stock;
    let stockChange = dto.quantity;

    // Adjust stock based on type
    if (dto.type === 'salida') {
      stockChange = -Math.abs(dto.quantity);
    } else if (dto.type === 'entrada') {
      stockChange = Math.abs(dto.quantity);
    }

    products[productIndex].stock = stockBefore + stockChange;
    localStorage.setItem('products', JSON.stringify(products));

    // Return mock movement
    return {
      id: Date.now().toString(),
      product_id: productId,
      type: dto.type,
      quantity: stockChange,
      stock_before: stockBefore,
      stock_after: products[productIndex].stock,
      reason: dto.reason || null,
      user_id: '1',
      order_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // Helper methods for localStorage
  private getLocalProducts(): any[] {
    const stored = localStorage.getItem('products');
    return stored ? JSON.parse(stored) : [];
  }

  private getLocalOrders(): any[] {
    const stored = localStorage.getItem('orders');
    return stored ? JSON.parse(stored) : [];
  }
}

export const stockMovementsService = new StockMovementsService();
