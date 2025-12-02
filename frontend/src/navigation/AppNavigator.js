// src/navigation/AppNavigator.js
import React, { useContext } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthContext } from "../context/AuthContext";

// Screens
import BottomTabs from "./BottomTabs";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import BlogDetailScreen from "../screens/BlogDetailScreen";
import ReportScreen from "../screens/ReportScreen";
import MyReportsScreen from "../screens/MyReportsScreen";

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#a855f7" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen
                        name="SignUp"
                        component={SignUpScreen}
                        options={{ presentation: "modal" }}
                    />
                </>
            ) : (
                <>
                    <Stack.Screen name="Main" component={BottomTabs} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                    <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
                    <Stack.Screen name="Report" component={ReportScreen} />
                    <Stack.Screen name="MyReports" component={MyReportsScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
    },
});

export default AppNavigator;
