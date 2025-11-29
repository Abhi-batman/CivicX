import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const IssueCard = ({ issue, onVote, onPress, onComment }) => {
    const isResolved = issue.status === 'resolved';

    return (
        <View style={styles.card}>
            <Image source={{ uri: issue.imageUrl }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.categoryContainer}>
                            <Text style={styles.categoryText}>{issue.category}</Text>
                        </View>
                        <View style={[styles.statusContainer, isResolved ? styles.statusResolved : styles.statusPending]}>
                            <Text style={styles.statusText}>{isResolved ? 'Resolved' : 'Pending'}</Text>
                        </View>
                    </View>
                    <Text style={styles.date}>{new Date(issue.createdAt).toLocaleDateString()}</Text>
                </View>

                <Text style={styles.title} numberOfLines={1}>{issue.title}</Text>

                <View style={styles.locationContainer}>
                    <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.locationText} numberOfLines={1}>{issue.location}</Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => onVote(issue.id)}>
                            <Ionicons name="arrow-up-circle" size={24} color={COLORS.primary} />
                            <Text style={styles.actionText}>{issue.upvotes}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton} onPress={() => onComment(issue.id)}>
                            <Ionicons name="chatbubble-outline" size={22} color={COLORS.textSecondary} />
                            <Text style={styles.actionText}>Comment</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.detailsButton} onPress={() => onPress(issue)}>
                        <Text style={styles.detailsButtonText}>Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
    content: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    categoryContainer: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.md,
    },
    categoryText: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '600',
    },
    statusContainer: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.md,
        borderWidth: 1,
    },
    statusPending: {
        borderColor: COLORS.warning,
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
    },
    statusResolved: {
        borderColor: COLORS.success,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    statusText: {
        color: COLORS.textPrimary,
        fontSize: 12,
        fontWeight: '600',
    },
    date: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    locationText: {
        color: COLORS.textSecondary,
        marginLeft: 4,
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.backgroundSecondary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        gap: SPACING.xs,
    },
    actionText: {
        fontWeight: '600',
        color: COLORS.textPrimary,
        fontSize: 14,
    },
    detailsButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
    },
    detailsButtonText: {
        color: COLORS.textPrimary,
        fontWeight: '600',
        fontSize: 14,
    },
});

export default IssueCard;
