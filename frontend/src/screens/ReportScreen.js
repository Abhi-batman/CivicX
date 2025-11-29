import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import Dropdown from '../components/Dropdown';
import issueApi from '../api/issueApi';

const DEPARTMENTS = ['Public Works', 'Sanitation', 'Transportation', 'Parks & Rec', 'Utilities'];
const CATEGORIES = {
    'Public Works': ['Pothole', 'Sidewalk Damage', 'Graffiti'],
    'Sanitation': ['Missed Pickup', 'Overflowing Bin', 'Illegal Dumping'],
    'Transportation': ['Traffic Light', 'Signage', 'Bus Stop'],
    'Parks & Rec': ['Playground', 'Tree Maintenance', 'Bench Repair'],
    'Utilities': ['Water Leak', 'Power Outage', 'Street Light'],
};

import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const ReportScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [department, setDepartment] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState(null);
    const [locationAddress, setLocationAddress] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);

            // Reverse geocode to get address
            let address = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (address.length > 0) {
                const addr = address[0];
                setLocationAddress(`${addr.street || ''} ${addr.name || ''}, ${addr.city || ''}`);
            }
        })();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("You've refused to allow this appp to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!department || !category || !description || !image) {
            Alert.alert('Missing Information', 'Please fill in all fields and add a photo.');
            return;
        }

        setSubmitting(true);
        try {
            await issueApi.createIssue({
                department,
                category,
                description,
                location: locationAddress,
                coordinates: location ? location.coords : null,
                image,
            });

            Alert.alert('Success', 'Issue reported successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('Home') }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to submit report. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header with Gradient */}
            <LinearGradient
                colors={[COLORS.primary, COLORS.primaryDark]}
                style={styles.headerGradient}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Report Issue</Text>
                    <View style={{ width: 40 }} />
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Dropdown
                    label="Department"
                    options={DEPARTMENTS}
                    value={department}
                    onSelect={(val) => {
                        setDepartment(val);
                        setCategory(''); // Reset category when department changes
                    }}
                />

                {department ? (
                    <Dropdown
                        label="Category"
                        options={CATEGORIES[department]}
                        value={category}
                        onSelect={setCategory}
                    />
                ) : null}

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.textArea}
                    multiline
                    numberOfLines={4}
                    placeholder="Describe the issue in detail..."
                    placeholderTextColor={COLORS.textTertiary}
                    value={description}
                    onChangeText={setDescription}
                    textAlignVertical="top"
                />

                <Text style={styles.label}>Location</Text>
                <View style={styles.locationBox}>
                    <Ionicons name="location" size={20} color={COLORS.primary} />
                    <Text style={styles.locationText}>
                        {locationAddress || 'Fetching location...'}
                    </Text>
                </View>

                <Text style={styles.label}>Photo</Text>
                <View style={styles.photoContainer}>
                    {image ? (
                        <View>
                            <Image source={{ uri: image }} style={styles.previewImage} />
                            <TouchableOpacity
                                style={styles.removePhoto}
                                onPress={() => setImage(null)}
                            >
                                <Ionicons name="close-circle" size={24} color={COLORS.error} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.photoButtons}>
                            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
                                <Ionicons name="camera" size={24} color={COLORS.primary} />
                                <Text style={styles.photoButtonText}>Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <Ionicons name="images" size={24} color={COLORS.primary} />
                                <Text style={styles.photoButtonText}>Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, submitting && styles.disabledButton]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryDark]}
                        style={styles.submitButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        {submitting ? (
                            <ActivityIndicator color={COLORS.textPrimary} />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Report</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerGradient: {
        paddingBottom: SPACING.md,
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
    content: {
        padding: SPACING.lg,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        fontWeight: '600',
        marginTop: SPACING.md,
    },
    textArea: {
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        minHeight: 100,
        fontSize: 16,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    locationBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    locationText: {
        marginLeft: SPACING.sm,
        color: COLORS.primary,
        flex: 1,
    },
    photoContainer: {
        marginBottom: SPACING.xl,
    },
    photoButtons: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    photoButton: {
        flex: 1,
        backgroundColor: COLORS.card,
        padding: SPACING.lg,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
    },
    photoButtonText: {
        marginTop: SPACING.sm,
        color: COLORS.primary,
        fontWeight: '600',
    },
    previewImage: {
        width: '100%',
        height: 200,
        borderRadius: RADIUS.md,
    },
    removePhoto: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.full,
    },
    submitButton: {
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        ...SHADOWS.purple,
    },
    submitButtonGradient: {
        paddingVertical: SPACING.md,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    submitButtonText: {
        color: COLORS.textPrimary,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ReportScreen;
