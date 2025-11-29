// Obsidian Theme - Purple, Black, Grey Color Palette
export const COLORS = {
    // Primary Colors
    primary: '#8B5CF6',           // Vibrant purple
    primaryLight: '#A78BFA',      // Lighter purple
    primaryDark: '#7C3AED',       // Darker purple

    // Background Colors
    background: '#0F0F0F',        // Near black
    backgroundSecondary: '#1A1A1A', // Dark grey
    card: '#252525',              // Medium grey
    cardHover: '#2D2D2D',         // Lighter grey for hover

    // Text Colors
    textPrimary: '#FFFFFF',       // White
    textSecondary: '#A0A0A0',     // Light grey
    textTertiary: '#666666',      // Medium grey

    // Accent Colors
    accent: '#A78BFA',            // Accent purple
    success: '#10B981',           // Green for success
    error: '#EF4444',             // Red for errors
    warning: '#F59E0B',           // Orange for warnings

    // Border & Divider
    border: '#333333',            // Dark border
    divider: '#2A2A2A',           // Subtle divider

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.7)', // Dark overlay
    overlayLight: 'rgba(0, 0, 0, 0.5)',

    // Glassmorphism
    glass: 'rgba(37, 37, 37, 0.8)', // Semi-transparent card
    glassBorder: 'rgba(139, 92, 246, 0.2)', // Purple tinted border
};

// Gradient Definitions
export const GRADIENTS = {
    primary: ['#8B5CF6', '#7C3AED'],
    primaryVertical: ['#A78BFA', '#8B5CF6', '#7C3AED'],
    dark: ['#1A1A1A', '#0F0F0F'],
    card: ['#2D2D2D', '#252525'],
    purple: ['#A78BFA', '#8B5CF6'],
    purpleDark: ['#7C3AED', '#6D28D9'],
};

// Shadow Styles
export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 4,
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        elevation: 8,
    },
    purple: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
};

// Spacing System
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

// Border Radius
export const RADIUS = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

// Typography
export const TYPOGRAPHY = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    body: {
        fontSize: 16,
        fontWeight: 'normal',
        color: COLORS.textPrimary,
    },
    bodySecondary: {
        fontSize: 14,
        fontWeight: 'normal',
        color: COLORS.textSecondary,
    },
    caption: {
        fontSize: 12,
        fontWeight: 'normal',
        color: COLORS.textTertiary,
    },
};

// Animation Durations
export const ANIMATION = {
    fast: 150,
    normal: 300,
    slow: 500,
};

export default {
    COLORS,
    GRADIENTS,
    SHADOWS,
    SPACING,
    RADIUS,
    TYPOGRAPHY,
    ANIMATION,
};
