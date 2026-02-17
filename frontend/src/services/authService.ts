import api from './api';
import type { LoginRequest, RegisterRequest, OtpRequest } from '../types';

export const authService = {
    login: async (data: LoginRequest) => {
        const response = await api.post('/api/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest) => {
        const response = await api.post('/api/auth/register', data);
        return response.data;
    },

    sendOtp: async (email: string) => {
        const response = await api.post(`/api/auth/send-otp?email=${encodeURIComponent(email)}`);
        return response.data;
    },

    verifyOtp: async (data: OtpRequest) => {
        const response = await api.post('/api/auth/verify-otp', data);
        return response.data;
    },
};
