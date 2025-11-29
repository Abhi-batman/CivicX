import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
        // Navigate to login screen
        navigation.replace('Login');
    };

    const stats = [
        { label: 'Issues Reported', value: '24', icon: 'document-text' },
        { label: 'Upvotes Given', value: '156', icon: 'arrow-up-circle' },
        { label: 'Rank', value: '#42', icon: 'trophy' },
    ];

    const menuItems = [
        { label: 'Edit Profile', icon: 'person-outline', action: () => navigation.navigate('EditProfile') },
        { label: 'My Reports', icon: 'list-outline', action: () => navigation.navigate('MyReports') },
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Profile</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Profile Info */}
                <View style={styles.profileInfo}>
                    <View style={styles.avatarContainer}>
                        <Ionicons name="person-circle" size={100} color={COLORS.textPrimary} />
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                    <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    {stats.map((stat, index) => (
                        <View key={index} style={styles.statItem}>
                            <Ionicons name={stat.icon} size={24} color={COLORS.textPrimary} />
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>
            </LinearGradient>

            {/* Menu Items */}
            <ScrollView
                style={styles.menuContainer}
                showsVerticalScrollIndicator={false}
            >
                {menuItems.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.menuItem}
                        onPress={item.action}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuIconContainer}>
                                <Ionicons name={item.icon} size={24} color={COLORS.primary} />
                            </View>
                            <Text style={styles.menuItemText}>{item.label}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                ))}

                {/* Logout Button */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color={COLORS.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                {/* Version Info */}
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerGradient: {
        paddingBottom: SPACING.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    backButton: {
        padding: SPACING.sm,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    profileInfo: {
        alignItems: 'center',
        paddingVertical: SPACING.lg,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: RADIUS.full,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
    },
    statItem: {
        alignItems: 'center',
        gap: SPACING.xs,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
    },
    menuContainer: {
        flex: 1,
        paddingTop: SPACING.md,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        marginHorizontal: SPACING.md,
        marginBottom: SPACING.sm,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuItemText: {
        fontSize: 16,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
        backgroundColor: COLORS.card,
        marginHorizontal: SPACING.md,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    logoutText: {
        fontSize: 16,
        color: COLORS.error,
        fontWeight: 'bold',
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.textTertiary,
        fontSize: 12,
        paddingVertical: SPACING.lg,
    },
});

export default ProfileScreen;
