import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BlogCard from '../components/BlogCard';
import blogApi from '../api/blogApi';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const BlogScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const fetchPosts = useCallback(async () => {
        try {
            const data = await blogApi.getBlogPosts(1, 20);
            setPosts(data.posts);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            try {
                setLoading(true);
                const data = await blogApi.searchBlogPosts(searchQuery);
                setPosts(data.results);
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setLoading(false);
            }
        } else {
            fetchPosts();
        }
    };

    const handlePressBlog = (post) => {
        navigation.navigate('BlogDetail', { post });
    };

    if (loading && posts.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <LinearGradient
                colors={[COLORS.backgroundSecondary, COLORS.background]}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Blog</Text>
                    <TouchableOpacity
                        style={styles.searchButton}
                        onPress={() => setShowSearch(!showSearch)}
                    >
                        <Ionicons
                            name={showSearch ? "close" : "search"}
                            size={24}
                            color={COLORS.textPrimary}
                        />
                    </TouchableOpacity>
                </View>

                {showSearch && (
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search articles..."
                            placeholderTextColor={COLORS.textTertiary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => {
                                setSearchQuery('');
                                fetchPosts();
                            }}>
                                <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </LinearGradient>

            {/* Blog List */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BlogCard post={item} onPress={handlePressBlog} />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={64} color={COLORS.textTertiary} />
                        <Text style={styles.emptyText}>No blog posts found</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    searchButton: {
        padding: SPACING.sm,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        marginTop: SPACING.md,
        gap: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        paddingVertical: SPACING.xs,
    },
    listContent: {
        padding: SPACING.md,
        paddingBottom: 100,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.xxl * 2,
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
    },
});

export default BlogScreen;
