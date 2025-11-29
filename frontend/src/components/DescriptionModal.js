import React from 'react';
import { View, Text, Modal, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { height } = Dimensions.get('window');

const DescriptionModal = ({ visible, issue, onClose }) => {
    if (!issue) return null;

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Issue Details</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <Image source={{ uri: issue.imageUrl }} style={styles.image} />

                    <View style={styles.details}>
                        <View style={styles.tagContainer}>
                            <Text style={styles.tag}>{issue.category}</Text>
                            <View style={[styles.statusBadge, issue.status === 'resolved' ? styles.resolved : styles.open]}>
                                <Text style={styles.statusText}>{issue.status.toUpperCase()}</Text>
                            </View>
                        </View>

                        <Text style={styles.title}>{issue.title}</Text>

                        <View style={styles.metaRow}>
                            <Ionicons name="location" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.metaText}>{issue.location}</Text>
                        </View>

                        <View style={styles.metaRow}>
                            <Ionicons name="time" size={18} color={COLORS.textSecondary} />
                            <Text style={styles.metaText}>{new Date(issue.createdAt).toLocaleString()}</Text>
                        </View>

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{issue.description}</Text>

                        <View style={styles.statsContainer}>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>{issue.upvotes}</Text>
                                <Text style={styles.statLabel}>Upvotes</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>12</Text>
                                <Text style={styles.statLabel}>Comments</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </Modal>
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
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        backgroundColor: COLORS.backgroundSecondary,
    },
    closeButton: {
        padding: SPACING.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        paddingBottom: 40,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    details: {
        padding: SPACING.lg,
    },
    tagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    tag: {
        color: COLORS.textPrimary,
        fontWeight: '600',
        fontSize: 14,
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.md,
    },
    open: {
        backgroundColor: COLORS.warning,
    },
    resolved: {
        backgroundColor: COLORS.success,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    metaText: {
        marginLeft: SPACING.sm,
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: SPACING.md,
        color: COLORS.textPrimary,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: COLORS.textSecondary,
    },
    statsContainer: {
        flexDirection: 'row',
        marginTop: SPACING.xl,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.border,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statLabel: {
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
});

export default DescriptionModal;
