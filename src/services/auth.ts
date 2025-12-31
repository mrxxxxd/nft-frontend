import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const authService = {
    register: async (username: string, email: string, password: string) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            username,
            email,
            password,
        });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    login: async (email: string, password: string) => {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email,
            password,
        });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) return JSON.parse(userStr);
        }
        return null;
    },

    getAuthHeader: () => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                return { Authorization: 'Bearer ' + user.token };
            }
        }
        return {};
    }
};

export default authService;
