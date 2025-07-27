import api from './auth';

export const ordersAPI = {
  // Get all orders (for current user)
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  // Get single order
  getOrder: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order' };
    }
  },

  // Create order (vendors only)
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/orders/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order status' };
    }
  },

  // Delete order
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete order' };
    }
  },

  // Get vendor orders
  getVendorOrders: async () => {
    try {
      const response = await api.get('/orders/vendor');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch vendor orders' };
    }
  },

  // Get supplier orders
  getSupplierOrders: async () => {
    try {
      const response = await api.get('/orders/supplier');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch supplier orders' };
    }
  },

  // Get order statistics
  getOrderStats: async () => {
    try {
      const response = await api.get('/orders/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order statistics' };
    }
  },
};