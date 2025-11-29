import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ReportScreen from '../screens/ReportScreen';
import ReelsScreen from '../screens/ReelsScreen';
import RankingScreen from '../screens/RankingScreen';
import BlogScreen from '../screens/BlogScreen';
import { COLORS } from '../constants/theme';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Reels') {
                        iconName = focused ? 'play-circle' : 'play-circle-outline';
                    } else if (route.name === 'Ranking') {
                        iconName = focused ? 'trophy' : 'trophy-outline';
                    } else if (route.name === 'Blog') {
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.backgroundSecondary,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    paddingBottom: 5,
                    height: 60,
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Reels" component={ReelsScreen} />
            <Tab.Screen name="Ranking" component={RankingScreen} />
            <Tab.Screen name="Blog" component={BlogScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabs;
