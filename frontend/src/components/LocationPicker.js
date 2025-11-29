import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

const LocationPicker = () => {
    const [location, setLocation] = useState(null);
    const [locationName, setLocationName] = useState('Getting location...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        try {
            setLoading(true);
            // Simulate getting location
            setTimeout(() => {
                setLocationName('New York, USA');
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error getting location:', error);
            setLocationName('Unable to get location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={getCurrentLocation}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
            {loading ? (
                <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
            ) : (
                <Text style={styles.locationText} numberOfLines={1}>
                    {locationName}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: SPACING.xs,
        maxWidth: 200,
    },
    locationText: {
        color: COLORS.textPrimary,
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    loader: {
        marginLeft: SPACING.xs,
    },
});

export default LocationPicker;
