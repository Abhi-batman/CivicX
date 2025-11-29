// src/navigation/AppNavigator.js
import React, { useContext } from "react";
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
        return null; // or splash screen
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

export default AppNavigator;
