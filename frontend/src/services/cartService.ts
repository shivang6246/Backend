import api from './api';
import type { Cart } from '../types';

export const cartService = {
    getCart: async (userId: number): Promise<Cart> => {
        const response = await api.get(`/api/cart/${userId}`);
        return response.data;
    },

    addToCart: async (userId: number, productId: number, quantity: number): Promise<string> => {
        const response = await api.post(`/api/cart/add?userId=${userId}&productId=${productId}&quantity=${quantity}`);
        return response.data;
    },

    removeFromCart: async (cartItemId: number): Promise<string> => {
        const response = await api.delete(`/api/cart/remove/${cartItemId}`);
        return response.data;
    },

    clearCart: async (userId: number): Promise<string> => {
        const response = await api.delete(`/api/cart/clear/${userId}`);
        return response.data;
    },
};
