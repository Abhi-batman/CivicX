import apiClient from './apiClient';

// Mock blog posts data until backend is ready
const MOCK_BLOG_POSTS = [
    {
        id: '1',
        title: 'How Community Reporting is Transforming Our City',
        excerpt: 'Discover how citizen engagement through our platform is making real changes in urban infrastructure and community services.',
        content: `# How Community Reporting is Transforming Our City

Community engagement has always been crucial for urban development, but with modern technology, we're seeing unprecedented levels of civic participation.

## The Power of Collective Action

When citizens come together to report issues, local authorities can prioritize resources more effectively. Our platform has helped resolve over 1,000 issues in the past year alone.

## Success Stories

From fixing potholes to improving street lighting, every report makes a difference. Here are some of our most impactful resolutions:

- **Highway 101 Pothole**: Reported by 245 citizens, fixed within 48 hours
- **Downtown Sanitation**: Multiple reports led to increased garbage collection frequency
- **Street Lighting Program**: Community feedback resulted in a city-wide LED upgrade

## Join the Movement

Your voice matters. Every report, every upvote, every comment contributes to building a better community.`,
        category: 'Community Impact',
        author: {
            id: '201',
            name: 'Emily Chen',
            avatar: 'https://i.pravatar.cc/150?img=10',
            role: 'Community Manager',
        },
        featuredImage: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1200&q=80',
        readTime: 5,
        views: 2340,
        likes: 189,
        publishedAt: '2023-11-28T08:00:00Z',
        tags: ['community', 'impact', 'civic-engagement'],
    },
    {
        id: '2',
        title: 'Understanding Your Rights as a Citizen Reporter',
        excerpt: 'Learn about your rights and responsibilities when reporting civic issues in your community.',
        content: `# Understanding Your Rights as a Citizen Reporter

As a citizen reporter, you have both rights and responsibilities. This guide will help you understand how to effectively report issues while respecting privacy and legal boundaries.

## Your Rights

- Freedom to report public infrastructure issues
- Protection of your identity (if desired)
- Right to follow up on reported issues
- Access to resolution updates

## Your Responsibilities

- Report accurate information
- Respect privacy of individuals
- Avoid defamatory content
- Focus on public interest issues

## Best Practices

Always include clear photos or videos, provide specific locations, and write detailed descriptions to help authorities respond quickly.`,
        category: 'Guidelines',
        author: {
            id: '202',
            name: 'Michael Torres',
            avatar: 'https://i.pravatar.cc/150?img=11',
            role: 'Legal Advisor',
        },
        featuredImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80',
        readTime: 7,
        views: 1890,
        likes: 156,
        publishedAt: '2023-11-26T10:30:00Z',
        tags: ['guidelines', 'rights', 'legal'],
    },
    {
        id: '3',
        title: 'Top 10 Most Reported Issues This Month',
        excerpt: 'A breakdown of the most common civic issues reported by our community members in November.',
        content: `# Top 10 Most Reported Issues This Month

Here's what our community has been most concerned about this November:

## 1. Road Maintenance (342 reports)
Potholes and road damage continue to be the top concern.

## 2. Street Lighting (287 reports)
Many areas still need better illumination for safety.

## 3. Sanitation (234 reports)
Garbage collection and cleanliness issues remain prevalent.

## 4. Traffic Signals (189 reports)
Malfunctioning signals causing safety concerns.

## 5. Sidewalk Repairs (156 reports)
Pedestrian infrastructure needs attention.

And the list continues... Stay tuned for next month's update!`,
        category: 'Monthly Report',
        author: {
            id: '203',
            name: 'Sarah Johnson',
            avatar: 'https://i.pravatar.cc/150?img=12',
            role: 'Data Analyst',
        },
        featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
        readTime: 4,
        views: 3120,
        likes: 267,
        publishedAt: '2023-11-25T14:00:00Z',
        tags: ['statistics', 'monthly-report', 'trends'],
    },
    {
        id: '4',
        title: 'How to Take Effective Photos for Issue Reports',
        excerpt: 'Tips and tricks for capturing clear, informative photos that help authorities understand and resolve issues faster.',
        content: `# How to Take Effective Photos for Issue Reports

A picture is worth a thousand words, especially when reporting civic issues. Here's how to capture photos that make an impact.

## Lighting is Key

- Take photos during daylight when possible
- Avoid harsh shadows
- Use flash sparingly

## Show Context

- Include surrounding landmarks
- Capture multiple angles
- Show the scale of the issue

## Focus on Details

- Get close-ups of the problem
- Ensure images are sharp and clear
- Avoid blurry or dark photos

## Safety First

- Never put yourself in danger for a photo
- Stay on public property
- Be aware of traffic and surroundings`,
        category: 'How-To',
        author: {
            id: '204',
            name: 'Alex Rivera',
            avatar: 'https://i.pravatar.cc/150?img=13',
            role: 'Photography Expert',
        },
        featuredImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80',
        readTime: 6,
        views: 1560,
        likes: 134,
        publishedAt: '2023-11-23T09:15:00Z',
        tags: ['how-to', 'photography', 'tips'],
    },
];

const blogApi = {
    /**
     * Fetch blog posts with pagination
     * @param {number} page - Page number (starts at 1)
     * @param {number} limit - Number of posts per page
     * @returns {Promise} - Promise resolving to blog posts data
     */
    getBlogPosts: async (page = 1, limit = 10) => {
        try {
            // TODO: Replace with actual API call when backend is ready
            // const response = await apiClient.get(`/blog?page=${page}&limit=${limit}`);
            // return response.data;

            return new Promise((resolve) => {
                setTimeout(() => {
                    const start = (page - 1) * limit;
                    const end = start + limit;
                    const paginatedPosts = MOCK_BLOG_POSTS.slice(start, end);

                    resolve({
                        posts: paginatedPosts,
                        page,
                        totalPages: Math.ceil(MOCK_BLOG_POSTS.length / limit),
                        hasMore: end < MOCK_BLOG_POSTS.length,
                    });
                }, 600);
            });
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            throw error;
        }
    },

    /**
     * Get a single blog post by ID
     * @param {string} postId - ID of the blog post
     * @returns {Promise} - Promise resolving to blog post data
     */
    getBlogPostById: async (postId) => {
        try {
            // TODO: Replace with actual API call
            // const response = await apiClient.get(`/blog/${postId}`);
            // return response.data;

            return new Promise((resolve) => {
                setTimeout(() => {
                    const post = MOCK_BLOG_POSTS.find(p => p.id === postId);
                    resolve(post || null);
                }, 400);
            });
        } catch (error) {
            console.error('Error fetching blog post:', error);
            throw error;
        }
    },

    /**
     * Search blog posts
     * @param {string} query - Search query
     * @returns {Promise} - Promise resolving to search results
     */
    searchBlogPosts: async (query) => {
        try {
            // TODO: Replace with actual API call
            // const response = await apiClient.get(`/blog/search?q=${query}`);
            // return response.data;

            return new Promise((resolve) => {
                setTimeout(() => {
                    const results = MOCK_BLOG_POSTS.filter(post =>
                        post.title.toLowerCase().includes(query.toLowerCase()) ||
                        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
                        post.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                    );
                    resolve({ results, query });
                }, 500);
            });
        } catch (error) {
            console.error('Error searching blog posts:', error);
            throw error;
        }
    },

    /**
     * Get blog posts by category
     * @param {string} category - Category name
     * @returns {Promise} - Promise resolving to filtered posts
     */
    getBlogPostsByCategory: async (category) => {
        try {
            // TODO: Replace with actual API call
            // const response = await apiClient.get(`/blog/category/${category}`);
            // return response.data;

            return new Promise((resolve) => {
                setTimeout(() => {
                    const filtered = MOCK_BLOG_POSTS.filter(post =>
                        post.category.toLowerCase() === category.toLowerCase()
                    );
                    resolve({ posts: filtered, category });
                }, 400);
            });
        } catch (error) {
            console.error('Error fetching blog posts by category:', error);
            throw error;
        }
    },
};

export default blogApi;
