import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import IssueCard from '../components/IssueCard';
import FloatingButton from '../components/FloatingButton';
import CommentModal from '../components/CommentModal';
import DescriptionModal from '../components/DescriptionModal';
import ProfileIcon from '../components/ProfileIcon';
import LocationPicker from '../components/LocationPicker';
import issueApi from '../api/issueApi';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [filter, setFilter] = useState('All'); // 'All', 'Pending', 'Resolved'

    const fetchIssues = useCallback(async () => {
        try {
            const data = await issueApi.getAllIssues();
            // Sort by upvotes descending, then by date
            const sortedData = data.sort((a, b) => {
                if (b.upvotes !== a.upvotes) {
                    return b.upvotes - a.upvotes;
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setIssues(sortedData);
            filterIssues(sortedData, filter);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [filter]);

    useFocusEffect(
        useCallback(() => {
            fetchIssues();
        }, [fetchIssues])
    );

    useEffect(() => {
        filterIssues(issues, filter);
    }, [filter, issues]);

    const filterIssues = (allIssues, currentFilter) => {
        if (currentFilter === 'All') {
            setFilteredIssues(allIssues);
        } else if (currentFilter === 'Pending') {
            setFilteredIssues(allIssues.filter(issue => issue.status === 'open'));
        } else {
            const status = currentFilter.toLowerCase();
            setFilteredIssues(allIssues.filter(issue => issue.status === status));
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchIssues();
    };

    const handleVote = async (id) => {
        try {
            await issueApi.voteIssue(id);
            // Optimistic update
            setIssues(prevIssues =>
                prevIssues.map(issue =>
                    issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
                ).sort((a, b) => b.upvotes - a.upvotes)
            );
        } catch (error) {
            console.error('Error voting:', error);
        }
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

    const FilterTab = ({ title }) => (
        <TouchableOpacity
            style={[styles.filterTab, filter === title && styles.filterTabActive]}
            onPress={() => setFilter(title)}
        >
            <Text style={[styles.filterText, filter === title && styles.filterTextActive]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={[COLORS.backgroundSecondary, COLORS.background]}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <LocationPicker />
                    <ProfileIcon />
                </View>
                <Text style={styles.headerTitle}>Community Issues</Text>

                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                    <FilterTab title="All" />
                    <FilterTab title="Pending" />
                    <FilterTab title="Resolved" />
                </View>
            </LinearGradient>

            <FlatList
                data={filteredIssues}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <IssueCard
                        issue={item}
                        onVote={handleVote}
                        onPress={handlePressIssue}
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
                showsVerticalScrollIndicator={false}
            />

            <FloatingButton onPress={() => navigation.navigate('Report')} />

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
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    filterTab: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.card,
    },
    filterTabActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
        fontSize: 14,
    },
    filterTextActive: {
        color: COLORS.textPrimary,
    },
    listContent: {
        padding: SPACING.md,
        paddingBottom: 100, // Space for FAB
    },
});

export default HomeScreen;
