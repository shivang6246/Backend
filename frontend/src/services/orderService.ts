import api from './api';
import type { Order, OrderStatus } from '../types';

export const orderService = {
    placeOrder: async (userId: number): Promise<Order> => {
        const response = await api.post(`/api/orders/place/${userId}`);
        return response.data;
    },

    getOrdersByUser: async (userId: number): Promise<Order[]> => {
        const response = await api.get(`/api/orders/user/${userId}`);
        return response.data;
    },

    getOrderById: async (orderId: number): Promise<Order> => {
        const response = await api.get(`/api/orders/${orderId}`);
        return response.data;
    },

    updateOrderStatus: async (orderId: number, status: OrderStatus): Promise<Order> => {
        const response = await api.put(`/api/orders/status/${orderId}?status=${status}`);
        return response.data;
    },
};
