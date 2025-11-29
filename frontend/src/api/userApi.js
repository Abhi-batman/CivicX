import apiClient from './apiClient';

const MOCK_RANKINGS = [
    { id: '1', name: 'Alice Johnson', points: 1250, rank: 1, avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Bob Smith', points: 980, rank: 2, avatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '3', name: 'Charlie Brown', points: 850, rank: 3, avatar: 'https://i.pravatar.cc/150?img=7' },
    { id: '4', name: 'Diana Prince', points: 720, rank: 4, avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '5', name: 'Evan Wright', points: 600, rank: 5, avatar: 'https://i.pravatar.cc/150?img=11' },
];

const userApi = {
    getRankings: async () => {
        try {
            // const response = await apiClient.get('/users/rankings');
            // return response.data;
            return new Promise((resolve) => {
                setTimeout(() => resolve(MOCK_RANKINGS), 500);
            });
        } catch (error) {
            throw error;
        }
    },

    getUserProfile: async (userId) => {
        try {
            // const response = await apiClient.get(`/users/${userId}`);
            // return response.data;
            return { name: 'Current User', points: 450, rank: 12 };
        } catch (error) {
            throw error;
        }
    },

    checkEmailExists: async (email) => {
        try {
            // const response = await apiClient.post('/users/check-email', { email });
            // return response.data.exists;

            // Mock check
            return false;
        } catch (error) {
            throw error;
        }
    },

    updateProfile: async (userId, data) => {
        try {
            // const response = await apiClient.put(`/users/${userId}`, data);
            // return response.data;

            // Mock update
            return { ...data, success: true };
        } catch (error) {
            throw error;
        }
    }
};

export default userApi;
