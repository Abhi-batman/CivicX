import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const BlogDetailScreen = ({ route, navigation }) => {
    const insets = useSafeAreaInsets();
    const { post } = route.params;
    const [upvotes, setUpvotes] = useState(post.likes || 0);
    const [isUpvoted, setIsUpvoted] = useState(false);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this article: ${post.title}`,
                title: post.title,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleUpvote = () => {
        if (isUpvoted) {
            setUpvotes(prev => prev - 1);
        } else {
            setUpvotes(prev => prev + 1);
        }
        setIsUpvoted(!isUpvoted);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Image */}
                <View style={styles.heroContainer}>
                    <Image source={{ uri: post.featuredImage }} style={styles.heroImage} />
                    <LinearGradient
                        colors={['transparent', COLORS.background]}
                        style={styles.heroGradient}
                    />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Category Badge */}
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{post.category}</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{post.title}</Text>

                    {/* Meta Info */}
                    <View style={styles.metaContainer}>
                        <View style={styles.authorInfo}>
                            <View style={styles.avatar}>
                                <Ionicons name="person-circle" size={40} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.authorName}>{post.author.name}</Text>
                                <Text style={styles.authorRole}>{post.author.role}</Text>
                            </View>
                        </View>

                        <View style={styles.stats}>
                            <View style={styles.statItem}>
                                <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                                <Text style={styles.statText}>{post.readTime} min read</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="eye-outline" size={16} color={COLORS.textSecondary} />
                                <Text style={styles.statText}>{post.views} views</Text>
                            </View>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Article Content */}
                    <Text style={styles.articleContent}>{post.content}</Text>

                    {/* Tags */}
                    <View style={styles.tagsContainer}>
                        {post.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Engagement Stats */}
                    <View style={styles.engagementContainer}>
                        <TouchableOpacity
                            style={[styles.engagementButton, isUpvoted && styles.engagementButtonActive]}
                            onPress={handleUpvote}
                        >
                            <Ionicons
                                name={isUpvoted ? "arrow-up-circle" : "arrow-up-circle-outline"}
                                size={24}
                                color={isUpvoted ? COLORS.white : COLORS.primary}
                            />
                            <Text style={[styles.engagementText, isUpvoted && styles.engagementTextActive]}>
                                {upvotes} Upvotes
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.backgroundSecondary,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        padding: SPACING.sm,
    },
    shareButton: {
        padding: SPACING.sm,
    },
    scrollView: {
        flex: 1,
    },
    heroContainer: {
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    heroGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    content: {
        padding: SPACING.md,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        lineHeight: 36,
    },
    metaContainer: {
        marginBottom: SPACING.md,
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginBottom: SPACING.sm,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authorName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    authorRole: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    stats: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    articleContent: {
        fontSize: 16,
        color: COLORS.textPrimary,
        lineHeight: 26,
        marginBottom: SPACING.lg,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    tag: {
        backgroundColor: COLORS.card,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tagText: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: '600',
    },
    engagementContainer: {
        flexDirection: 'row',
        gap: SPACING.md,
        paddingVertical: SPACING.md,
    },
    engagementButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.card,
        paddingVertical: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    engagementText: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    engagementButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    engagementTextActive: {
        color: COLORS.white,
    },
});

export default BlogDetailScreen;
