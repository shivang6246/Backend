import api from './api';
import type { Category, CategoryRequest } from '../types';

export const categoryService = {
    getAllCategories: async (): Promise<Category[]> => {
        const response = await api.get('/api/categories/all');
        return response.data;
    },

    getCategoryById: async (id: number): Promise<Category> => {
        const response = await api.get(`/api/categories/${id}`);
        return response.data;
    },

    createCategory: async (data: CategoryRequest): Promise<string> => {
        const response = await api.post('/api/categories/create', data);
        return response.data;
    },

    deleteCategory: async (id: number): Promise<string> => {
        const response = await api.delete(`/api/categories/delete/${id}`);
        return response.data;
    },
};
