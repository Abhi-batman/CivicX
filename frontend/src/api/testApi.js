import apiClient from './apiClient';

const testApi = {
    testConnection: async () => {
        try {
            console.log('Testing API connection...');
            const response = await apiClient.get('/api/v1/report/getAllReports');
            console.log('API connection successful:', response.data);
            return true;
        } catch (error) {
            console.error('API connection failed:', error.message);
            if (error.response) {
                console.error('Response error:', error.response.data);
            } else if (error.request) {
                console.error('No response received. Check if backend is running and URL is correct.');
            }
            return false;
        }
    }
};

export default testApi;
