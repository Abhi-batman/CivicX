import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const BlogCard = ({ post, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(post)}
            activeOpacity={0.9}
        >
            <Image source={{ uri: post.featuredImage }} style={styles.image} />

            <LinearGradient
                colors={['transparent', 'rgba(15, 15, 15, 0.9)']}
                style={styles.imageGradient}
            />

            <View style={styles.content}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{post.category}</Text>
                </View>

                <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
                <Text style={styles.excerpt} numberOfLines={2}>{post.excerpt}</Text>

                <View style={styles.footer}>
                    <View style={styles.authorInfo}>
                        <View style={styles.avatar}>
                            <Ionicons name="person-circle" size={32} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.authorName}>{post.author.name}</Text>
                            <Text style={styles.date}>
                                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                            <Text style={styles.statText}>{post.readTime} min</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="eye-outline" size={16} color={COLORS.textSecondary} />
                            <Text style={styles.statText}>{post.views}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.medium,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    imageGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
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
        marginBottom: SPACING.sm,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '700',
        color: COLORS.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        lineHeight: 26,
    },
    excerpt: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    authorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        flex: 1,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authorName: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    date: {
        fontSize: 11,
        color: COLORS.textTertiary,
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
        fontSize: 12,
        color: COLORS.textSecondary,
    },
});

export default BlogCard;
