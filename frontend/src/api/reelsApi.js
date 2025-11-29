import apiClient from './apiClient';

// Mock data for reels/videos until backend is ready
const MOCK_REELS = [
    {
        id: '1',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
        title: 'Pothole on Highway 101',
        description: 'Dangerous pothole causing accidents',
        category: 'Roads',
        location: 'Highway 101, Exit 23',
        upvotes: 245,
        views: 1200,
        createdAt: '2023-11-28T10:00:00Z',
        user: {
            id: '101',
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
    },
    {
        id: '2',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
        title: 'Garbage Overflow in Downtown',
        description: 'Multiple bins overflowing for days',
        category: 'Sanitation',
        location: 'Downtown Square',
        upvotes: 189,
        views: 850,
        createdAt: '2023-11-27T14:30:00Z',
        user: {
            id: '102',
            name: 'Jane Smith',
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
    },
    {
        id: '3',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517487002384-a781791775d8?auto=format&fit=crop&w=800&q=80',
        title: 'Street Light Malfunction',
        description: 'Entire street dark at night',
        category: 'Lighting',
        location: 'Elm Street',
        upvotes: 156,
        views: 620,
        createdAt: '2023-11-26T09:15:00Z',
        user: {
            id: '103',
            name: 'Mike Johnson',
            avatar: 'https://i.pravatar.cc/150?img=3',
        },
    },
    {
        id: '4',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
        title: 'Broken Sidewalk',
        description: 'Cracked sidewalk hazard for pedestrians',
        category: 'Infrastructure',
        location: 'Park Avenue',
        upvotes: 98,
        views: 450,
        createdAt: '2023-11-25T16:45:00Z',
        user: {
            id: '104',
            name: 'Sarah Williams',
            avatar: 'https://i.pravatar.cc/150?img=4',
        },
    },
    {
        id: '5',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
        title: 'Graffiti on Public Property',
        description: 'Vandalism on community center walls',
        category: 'Vandalism',
        location: 'Community Center',
        upvotes: 67,
        views: 320,
        createdAt: '2023-11-24T11:20:00Z',
        user: {
            id: '105',
            name: 'David Brown',
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
    },
];

const reelsApi = {
    /**
     * Fetch reels with pagination
     * @param {number} page - Page number (starts at 1)
     * @param {number} limit - Number of reels per page
     * @returns {Promise} - Promise resolving to reels data
     */
    getReels: async (page = 1, limit = 10) => {
        try {
            // TODO: Replace with actual API call when backend is ready
            // const response = await apiClient.get(`/reels?page=${page}&limit=${limit}`);
            // return response.data;

            // Simulate API delay and return mock data
            return new Promise((resolve) => {
                setTimeout(() => {
                    const start = (page - 1) * limit;
                    const end = start + limit;
                    const paginatedReels = MOCK_REELS.slice(start, end);

                    resolve({
                        reels: paginatedReels,
                        page,
                        totalPages: Math.ceil(MOCK_REELS.length / limit),
                        hasMore: end < MOCK_REELS.length,
                    });
                }, 800);
            });
        } catch (error) {
            console.error('Error fetching reels:', error);
            throw error;
        }
    },

    /**
     * Like/upvote a reel
     * @param {string} reelId - ID of the reel to like
     * @returns {Promise} - Promise resolving to updated reel data
     */
    likeReel: async (reelId) => {
        try {
            // TODO: Replace with actual API call
            // const response = await apiClient.post(`/reels/${reelId}/like`);
            // return response.data;

            console.log(`Liked reel ${reelId}`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, newUpvoteCount: 246 });
                }, 300);
            });
        } catch (error) {
            console.error('Error liking reel:', error);
            throw error;
        }
    },

    /**
     * Share a reel
     * @param {string} reelId - ID of the reel to share
     * @returns {Promise} - Promise resolving to share result
     */
    shareReel: async (reelId) => {
        try {
            // TODO: Replace with actual API call
            // const response = await apiClient.post(`/reels/${reelId}/share`);
            // return response.data;

            console.log(`Shared reel ${reelId}`);
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true, shareUrl: `https://app.example.com/reels/${reelId}` });
                }, 300);
            });
        } catch (error) {
            console.error('Error sharing reel:', error);
            throw error;
        }
    },

    /**
     * Get a single reel by ID
     * @param {string} reelId - ID of the reel
     * @returns {Promise} - Promise resolving to reel data
     */
    getReelById: async (reelId) => {
        try {
            // TODO: Replace with actual API call
            // const response = await apiClient.get(`/reels/${reelId}`);
            // return response.data;

            return new Promise((resolve) => {
                setTimeout(() => {
                    const reel = MOCK_REELS.find(r => r.id === reelId);
                    resolve(reel || null);
                }, 300);
            });
        } catch (error) {
            console.error('Error fetching reel:', error);
            throw error;
        }
    },
};

export default reelsApi;
