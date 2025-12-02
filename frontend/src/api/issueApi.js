import apiClient from './apiClient';

const issueApi = {
    getAllIssues: async (filters = {}) => {
        try {
            const { status, category, page = 1, limit = 10 } = filters;

            const params = new URLSearchParams();
            if (status) params.append('status', status);
            if (category) params.append('category', category);
            params.append('page', page);
            params.append('limit', limit);

            const response = await apiClient.get(`/api/v1/report/getAllReports?${params.toString()}`);

            if (response.data && response.data.data) {
                const { reports, total, page: currentPage, limit: pageLimit } = response.data.data;

                // Map backend report structure to frontend issue structure
                const mappedIssues = reports.map(report => ({
                    id: report._id,
                    title: report.description, // Backend uses description as the main text
                    description: report.description,
                    category: report.category,
                    location: report.address || 'Unknown location',
                    coordinates: report.location?.coordinates
                        ? { latitude: report.location.coordinates[0], longitude: report.location.coordinates[1] }
                        : null,
                    upvotes: report.upvotes || 0,
                    imageUrl: report.image?.url || null,
                    createdAt: report.createdAt,
                    status: report.status || 'open',
                    user: report.user,
                }));

                return {
                    issues: mappedIssues,
                    total,
                    page: currentPage,
                    limit: pageLimit,
                };
            }

            return { issues: [], total: 0, page: 1, limit: 10 };
        } catch (error) {
            console.error('Get all issues error:', error);
            throw error;
        }
    },

    getIssueById: async (id) => {
        try {
            const response = await apiClient.get(`/api/v1/report/getReport/${id}`);

            if (response.data && response.data.data && response.data.data.report) {
                const report = response.data.data.report;

                return {
                    id: report._id,
                    title: report.description,
                    description: report.description,
                    category: report.category,
                    location: report.address || 'Unknown location',
                    coordinates: report.location?.coordinates
                        ? { latitude: report.location.coordinates[0], longitude: report.location.coordinates[1] }
                        : null,
                    upvotes: report.upvotes || 0,
                    imageUrl: report.image?.url || null,
                    createdAt: report.createdAt,
                    status: report.status || 'open',
                    user: report.user,
                };
            }

            return null;
        } catch (error) {
            console.error('Get issue by ID error:', error);
            throw error;
        }
    },

    createIssue: async (issueData) => {
        try {
            const formData = new FormData();

            formData.append('description', issueData.description || issueData.title);
            formData.append('department', issueData.department || 'General');
            formData.append('category', issueData.category);
            formData.append('latitude', issueData.coordinates?.latitude || issueData.latitude);
            formData.append('longitude', issueData.coordinates?.longitude || issueData.longitude);

            // Handle image upload
            if (issueData.image) {
                const imageUri = issueData.image;
                const filename = imageUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('image', {
                    uri: imageUri,
                    name: filename,
                    type,
                });
            }

            const response = await apiClient.post('/api/v1/report/submitReport', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data) {
                return {
                    success: true,
                    message: response.data.message || 'Issue reported successfully!'
                };
            }

            return { success: false, message: 'Failed to create issue' };
        } catch (error) {
            console.error('Create issue error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create issue';
            throw new Error(errorMessage);
        }
    },

    voteIssue: async (id) => {
        try {
            // Note: Backend doesn't have upvote endpoint yet, this is a placeholder
            console.log(`Voted for issue ${id}`);
            return { success: true, newVoteCount: 121 };
        } catch (error) {
            console.error('Vote issue error:', error);
            throw error;
        }
    },

    getMapIssues: async () => {
        try {
            // Get all issues for map view
            const result = await issueApi.getAllIssues({ limit: 100 });
            return result.issues || [];
        } catch (error) {
            console.error('Get map issues error:', error);
            throw error;
        }
    },

    getMyIssues: async (username) => {
        try {
            if (!username) {
                throw new Error('Username is required');
            }

            const response = await apiClient.get(`/api/v1/users/c/${username}`);

            if (response.data && response.data.data && response.data.data.reports) {
                const reports = response.data.data.reports;

                // Map backend report structure to frontend issue structure
                const mappedIssues = reports.map(report => ({
                    id: report._id,
                    title: report.description,
                    description: report.description,
                    category: report.category,
                    location: report.address || 'Unknown location',
                    coordinates: report.location?.coordinates
                        ? { latitude: report.location.coordinates[0], longitude: report.location.coordinates[1] }
                        : null,
                    upvotes: report.upvotes || 0,
                    imageUrl: report.image?.url || null,
                    createdAt: report.createdAt,
                    status: report.status || 'open',
                }));

                return mappedIssues;
            }

            return [];
        } catch (error) {
            console.error('Get my issues error:', error);
            throw error;
        }
    }
};

export default issueApi;
