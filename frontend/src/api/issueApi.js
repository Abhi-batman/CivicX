import apiClient from './apiClient';

// Mock data for development when backend is not connected
const MOCK_ISSUES = [
    {
        id: '1',
        title: 'Deep Pothole on Main St',
        description: 'There is a very deep pothole near the bus stop. It is dangerous for cars.',
        category: 'Roads',
        location: 'Main St & 5th Ave',
        coordinates: { latitude: 37.78825, longitude: -122.4324 },
        upvotes: 120,
        imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        createdAt: '2023-10-25T10:00:00Z',
        status: 'open',
    },
    {
        id: '2',
        title: 'Overflowing Garbage Bin',
        description: 'The garbage bin in the park is overflowing and smells bad.',
        category: 'Sanitation',
        location: 'Central Park',
        coordinates: { latitude: 37.78925, longitude: -122.4344 },
        upvotes: 85,
        imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
        createdAt: '2023-10-24T14:30:00Z',
        status: 'open',
    },
    {
        id: '3',
        title: 'Broken Street Light',
        description: 'Street light #452 is flickering and mostly off at night.',
        category: 'Lighting',
        location: 'Elm Street',
        coordinates: { latitude: 37.78725, longitude: -122.4314 },
        upvotes: 45,
        imageUrl: 'https://images.unsplash.com/photo-1517487002384-a781791775d8?auto=format&fit=crop&w=800&q=80',
        createdAt: '2023-10-26T09:15:00Z',
        status: 'resolved',
    },
];

const issueApi = {
    getAllIssues: async () => {
        try {
            // Replace with actual API call:
            // const response = await apiClient.get('/issues');
            // return response.data;

            // Returning mock data for now
            return new Promise((resolve) => {
                setTimeout(() => resolve(MOCK_ISSUES), 500);
            });
        } catch (error) {
            throw error;
        }
    },

    getIssueById: async (id) => {
        try {
            // const response = await apiClient.get(`/issues/${id}`);
            // return response.data;
            return MOCK_ISSUES.find(issue => issue.id === id);
        } catch (error) {
            throw error;
        }
    },

    createIssue: async (issueData) => {
        try {
            // const response = await apiClient.post('/issues', issueData);
            // return response.data;
            console.log('Creating issue:', issueData);

            const newIssue = {
                id: String(MOCK_ISSUES.length + 1),
                ...issueData,
                imageUrl: issueData.image, // Map image to imageUrl
                upvotes: 0,
                createdAt: new Date().toISOString(),
                status: 'open',
            };

            MOCK_ISSUES.unshift(newIssue);

            return { success: true, message: 'Issue reported successfully!' };
        } catch (error) {
            throw error;
        }
    },

    voteIssue: async (id) => {
        try {
            // const response = await apiClient.post(`/issues/${id}/vote`);
            // return response.data;
            console.log(`Voted for issue ${id}`);
            return { success: true, newVoteCount: 121 };
        } catch (error) {
            throw error;
        }
    },

    getMapIssues: async () => {
        try {
            // const response = await apiClient.get('/issues/map');
            // return response.data;
            return MOCK_ISSUES;
        } catch (error) {
            throw error;
        }
    },

    getMyIssues: async () => {
        try {
            // In a real app, this would filter by the current user's ID
            // const response = await apiClient.get('/issues/me');
            // return response.data;

            // For mock data, we'll just return a subset or all issues
            return new Promise((resolve) => {
                setTimeout(() => resolve(MOCK_ISSUES), 500);
            });
        } catch (error) {
            throw error;
        }
    }
};

export default issueApi;
