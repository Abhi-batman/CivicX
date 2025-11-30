import apiClient from './apiClient';

const userApi = {
    getRankings: async () => {
        try {
            // Note: Backend doesn't have a rankings endpoint yet
            // This is a placeholder that returns empty array
            // TODO: Implement rankings endpoint in backend
            return [];
        } catch (error) {
            console.error('Get rankings error:', error);
            throw error;
        }
    },

    getUserProfile: async (username) => {
        try {
            if (!username) {
                // Get current user profile
                const response = await apiClient.get('/api/v1/users/current-user');

                if (response.data && response.data.data) {
                    return response.data.data;
                }
            } else {
                // Get specific user profile by username
                const response = await apiClient.get(`/api/v1/users/c/${username}`);

                if (response.data && response.data.data) {
                    return response.data.data;
                }
            }

            return null;
        } catch (error) {
            console.error('Get user profile error:', error);
            throw error;
        }
    },

    updateProfile: async (updates) => {
        try {
            const response = await apiClient.patch('/api/v1/users/update-profile', updates);

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error('Update profile error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
            throw new Error(errorMessage);
        }
    },

    updatePassword: async (oldPassword, newPassword) => {
        try {
            const response = await apiClient.patch('/api/v1/users/change-password', {
                oldPassword,
                newPassword,
            });

            if (response.data) {
                return { success: true, message: response.data.message || 'Password updated successfully' };
            }

            return { success: false, message: 'Failed to update password' };
        } catch (error) {
            console.error('Update password error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update password';
            throw new Error(errorMessage);
        }
    },

    updateProfilePhoto: async (photoUri) => {
        try {
            const formData = new FormData();

            const filename = photoUri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('profilePhoto', {
                uri: photoUri,
                name: filename,
                type,
            });

            const response = await apiClient.patch('/api/v1/users/profile-photo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.data) {
                return response.data.data;
            }

            return null;
        } catch (error) {
            console.error('Update profile photo error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile photo';
            throw new Error(errorMessage);
        }
    }
};

export default userApi;
