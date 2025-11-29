import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileIcon from '../components/ProfileIcon';
import userApi from '../api/userApi';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const MOCK_COMPANY_RANKINGS = [
    { id: 'c1', name: 'City Works Dept', points: 540, rank: 1, avatar: 'https://ui-avatars.com/api/?name=City+Works&background=random' },
    { id: 'c2', name: 'Metro Transit', points: 420, rank: 2, avatar: 'https://ui-avatars.com/api/?name=Metro+Transit&background=random' },
    { id: 'c3', name: 'Green Parks Co', points: 310, rank: 3, avatar: 'https://ui-avatars.com/api/?name=Green+Parks&background=random' },
];

const RankingScreen = () => {
    const insets = useSafeAreaInsets();
    const [rankings, setRankings] = useState([]);
    const [companyRankings, setCompanyRankings] = useState(MOCK_COMPANY_RANKINGS);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('Users'); // 'Users' | 'Companies'

    const fetchData = async () => {
        try {
            const [rankData, userData] = await Promise.all([
                userApi.getRankings(),
                userApi.getUserProfile('current')
            ]);
            setRankings(rankData);
            setCurrentUser(userData);
        } catch (error) {
            console.error('Error fetching rankings:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.rankRow}>
            <View style={styles.rankNumberContainer}>
                <Text style={[styles.rankNumber, index < 3 && styles.topRank]}>#{item.rank}</Text>
            </View>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userPoints}>{item.points} {activeTab === 'Users' ? 'pts' : 'solved'}</Text>
            </View>
            {index === 0 && <Text style={styles.medal}>🥇</Text>}
            {index === 1 && <Text style={styles.medal}>🥈</Text>}
            {index === 2 && <Text style={styles.medal}>🥉</Text>}
        </View>
    );

    const TabButton = ({ title }) => (
        <TouchableOpacity
            style={[styles.tabButton, activeTab === title && styles.tabButtonActive]}
            onPress={() => setActiveTab(title)}
        >
            <Text style={[styles.tabText, activeTab === title && styles.tabTextActive]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={[COLORS.backgroundSecondary, COLORS.background]}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Leaderboard</Text>
                    <ProfileIcon />
                </View>

                <View style={styles.tabContainer}>
                    <TabButton title="Users" />
                    <TabButton title="Companies" />
                </View>
            </LinearGradient>

            {activeTab === 'Users' && currentUser && (
                <View style={styles.userRankCard}>
                    <Text style={styles.userRankLabel}>Your Rank</Text>
                    <View style={styles.userRankRow}>
                        <Text style={styles.userRankNumber}>#{currentUser.rank}</Text>
                        <View>
                            <Text style={styles.userRankName}>{currentUser.name}</Text>
                            <Text style={styles.userRankPoints}>{currentUser.points} Points</Text>
                        </View>
                    </View>
                </View>
            )}

            <FlatList
                data={activeTab === 'Users' ? rankings : companyRankings}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
    header: {
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.card,
        padding: 4,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tabButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        borderRadius: RADIUS.full,
    },
    tabButtonActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    tabTextActive: {
        color: COLORS.textPrimary,
    },
    userRankCard: {
        margin: SPACING.md,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.card,
        ...SHADOWS.purple,
    },
    userRankLabel: {
        color: COLORS.textSecondary,
        fontSize: 14,
        marginBottom: SPACING.sm,
        fontWeight: '600',
    },
    userRankRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userRankNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginRight: SPACING.md,
    },
    userRankName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    userRankPoints: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    listContent: {
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.lg,
    },
    rankRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.small,
    },
    rankNumberContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
    },
    topRank: {
        color: COLORS.primary,
        fontSize: 18,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.full,
        marginHorizontal: SPACING.md,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    userPoints: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    medal: {
        fontSize: 24,
    },
});

export default RankingScreen;
