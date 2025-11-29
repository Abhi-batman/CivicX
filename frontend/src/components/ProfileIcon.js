import React, { useContext } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const ProfileIcon = () => {
    const navigation = useNavigation();
    const { user } = useContext(AuthContext);

    const handlePress = () => {
        if (user) {
            navigation.navigate('Profile');
        } else {
            navigation.navigate('Login');
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.iconContainer}>
                <Ionicons
                    name={user ? "person-circle" : "person-circle-outline"}
                    size={32}
                    color={COLORS.primary}
                />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: SPACING.xs,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.primary,
        ...SHADOWS.small,
    },
});

export default ProfileIcon;
