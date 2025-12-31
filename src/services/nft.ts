import axios from 'axios';
import authService from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const nftService = {
    getAllNFTs: async () => {
        const response = await axios.get(`${API_URL}/nfts`);
        return response.data;
    },

    getNFTById: async (id: string) => {
        const response = await axios.get(`${API_URL}/nfts/${id}`);
        return response.data;
    },

    createNFT: async (data: FormData) => {
        const headers = authService.getAuthHeader();
        // Axios automatically sets Content-Type to multipart/form-data when data is FormData
        const response = await axios.post(`${API_URL}/nfts`, data, {
            headers: { ...headers } // Don't set Content-Type manually
        });
        return response.data;
    },

    updateNFT: async (id: string, data: any) => {
        const headers = authService.getAuthHeader();
        const response = await axios.put(`${API_URL}/nfts/${id}`, data, { headers });
        return response.data;
    },

    deleteNFT: async (id: string) => {
        const headers = authService.getAuthHeader();
        const response = await axios.delete(`${API_URL}/nfts/${id}`, { headers });
        return response.data;
    }
};

export default nftService;
