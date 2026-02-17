import api from './api';
import type { Product, ProductRequest } from '../types';

export const productService = {
    getAllProducts: async (): Promise<Product[]> => {
        const response = await api.get('/api/products/all');
        return response.data;
    },

    getProductById: async (id: number): Promise<Product> => {
        const response = await api.get(`/api/products/${id}`);
        return response.data;
    },

    createProduct: async (data: ProductRequest): Promise<string> => {
        const response = await api.post('/api/products/create', data);
        return response.data;
    },

    updateProduct: async (id: number, data: ProductRequest): Promise<string> => {
        const response = await api.put(`/api/products/${id}/update`, data);
        return response.data;
    },

    deleteProduct: async (id: number): Promise<string> => {
        const response = await api.delete(`/api/products/${id}/delete`);
        return response.data;
    },

    getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
        const response = await api.get(`/api/products/category/${categoryId}`);
        return response.data;
    },

    getProductsBySeller: async (sellerId: number): Promise<Product[]> => {
        const response = await api.get(`/api/products/seller/${sellerId}`);
        return response.data;
    },
};
