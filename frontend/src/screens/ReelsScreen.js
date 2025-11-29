import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    Text,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import reelsApi from '../api/reelsApi';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ReelItem = ({ item, isActive, onLike, onComment }) => {
    const videoRef = useRef(null);
    const [status, setStatus] = useState({});
    const [isMuted, setIsMuted] = useState(false);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.playAsync();
        } else if (videoRef.current) {
            videoRef.current.pauseAsync();
        }
    }, [isActive]);

    const handlePlayPause = async () => {
        if (status.isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
    };

    const handleLike = () => {
        setLiked(!liked);
        onLike(item.id);
    };

    return (
        <View style={styles.reelContainer}>
            <Video
                ref={videoRef}
                source={{ uri: item.videoUrl }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={isMuted}
                onPlaybackStatusUpdate={setStatus}
            />

            {/* Tap to play/pause overlay */}
            <TouchableOpacity style={styles.videoOverlay} onPress={handlePlayPause} activeOpacity={1}>
                {!status.isPlaying && (
                    <View style={styles.playIconContainer}>
                        <Ionicons name="play-circle" size={80} color="rgba(255,255,255,0.8)" />
                    </View>
                )}
            </TouchableOpacity>

            {/* Bottom gradient overlay */}
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.bottomGradient}
            >
                <View style={styles.infoContainer}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Ionicons name="person-circle" size={40} color={COLORS.primary} />
                        </View>
                        <View style={styles.userDetails}>
                            <Text style={styles.userName}>{item.user.name}</Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location" size={14} color={COLORS.textSecondary} />
                                <Text style={styles.location}>{item.location}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Right side action buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
                    <Ionicons
                        name={liked ? "arrow-up-circle" : "arrow-up-circle-outline"}
                        size={32}
                        color={liked ? COLORS.primary : COLORS.textPrimary}
                    />
                    <Text style={styles.actionText}>{item.upvotes + (liked ? 1 : 0)}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => onComment(item.id)}>
                    <Ionicons name="chatbubble-outline" size={28} color={COLORS.textPrimary} />
                    <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setIsMuted(!isMuted)}
                >
                    <Ionicons
                        name={isMuted ? "volume-mute" : "volume-high"}
                        size={28}
                        color={COLORS.textPrimary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

import CommentModal from '../components/CommentModal';

const ReelsScreen = () => {
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedReelId, setSelectedReelId] = useState(null);
    const flatListRef = useRef(null);

    const fetchReels = useCallback(async (pageNum = 1, isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            }

            const data = await reelsApi.getReels(pageNum, 5);

            // Use working dummy videos
            const reelsWithWorkingVideos = data.reels.map(reel => ({
                ...reel,
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' // Placeholder video
            }));

            if (isRefresh) {
                setReels(reelsWithWorkingVideos);
                setPage(1);
            } else {
                setReels(prev => [...prev, ...reelsWithWorkingVideos]);
            }

            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Error fetching reels:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchReels(1);
    }, []);

    const handleLike = async (reelId) => {
        try {
            await reelsApi.likeReel(reelId);
        } catch (error) {
            console.error('Error liking reel:', error);
        }
    };

    const handleComment = (reelId) => {
        setSelectedReelId(reelId);
        setCommentModalVisible(true);
    };

    const handleRefresh = () => {
        fetchReels(1, true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchReels(nextPage);
        }
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    if (loading && reels.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={reels}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item, index }) => (
                    <ReelItem
                        item={item}
                        isActive={index === activeIndex}
                        onLike={handleLike}
                        onComment={handleComment}
                    />
                )}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={SCREEN_HEIGHT}
                snapToAlignment="start"
                decelerationRate="fast"
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                ListFooterComponent={
                    loading && reels.length > 0 ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        </View>
                    ) : null
                }
            />

            <CommentModal
                visible={commentModalVisible}
                issueId={selectedReelId}
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
    reelContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIconContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: RADIUS.full,
        padding: SPACING.md,
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 300,
        justifyContent: 'flex-end',
        paddingBottom: 100,
        paddingHorizontal: SPACING.md,
    },
    infoContainer: {
        gap: SPACING.sm,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    location: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    description: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.lg,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    actionsContainer: {
        position: 'absolute',
        right: SPACING.md,
        bottom: 120,
        gap: SPACING.lg,
        alignItems: 'center',
    },
    actionButton: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    actionText: {
        fontSize: 12,
        color: COLORS.textPrimary,
        fontWeight: '600',
    },
    footerLoader: {
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ReelsScreen;
