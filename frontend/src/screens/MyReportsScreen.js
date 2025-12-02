import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import IssueCard from '../components/IssueCard';
import issueApi from '../api/issueApi';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

import DescriptionModal from '../components/DescriptionModal';
import CommentModal from '../components/CommentModal';

const MyReportsScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { user } = useContext(AuthContext);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);

    const fetchMyIssues = useCallback(async () => {
        try {
            if (user?.username) {
                const data = await issueApi.getMyIssues(user.username);
                // Sort by date descending
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setIssues(sortedData);
            }
        } catch (error) {
            console.error('Error fetching my issues:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMyIssues();
    }, [fetchMyIssues]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMyIssues();
    };

    const handlePressIssue = (issue) => {
        setSelectedIssue(issue);
        setDescriptionModalVisible(true);
    };

    const handleComment = (id) => {
        const issue = issues.find(i => i.id === id);
        setSelectedIssue(issue);
        setCommentModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

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
                <Text style={styles.headerTitle}>My Reports</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={issues}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <IssueCard
                        issue={item}
                        onPress={handlePressIssue}
                        onVote={() => { }} // Disable voting on own issues?
                        onComment={handleComment}
                    />
                )}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={COLORS.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={64} color={COLORS.textTertiary} />
                        <Text style={styles.emptyText}>You haven't reported any issues yet.</Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
            />

            <DescriptionModal
                visible={descriptionModalVisible}
                issue={selectedIssue}
                onClose={() => setDescriptionModalVisible(false)}
            />

            <CommentModal
                visible={commentModalVisible}
                issueId={selectedIssue?.id}
                onClose={() => setCommentModalVisible(false)}
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.card,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    listContent: {
        padding: SPACING.md,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
        gap: SPACING.md,
    },
    emptyText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
});

export default MyReportsScreen;
