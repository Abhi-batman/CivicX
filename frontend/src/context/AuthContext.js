import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for stored user on app start
        console.log('AuthProvider: Initializing...');
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            console.log('AuthProvider: Loading stored user...');
            const storedUser = await AsyncStorage.getItem('user');
            const accessToken = await AsyncStorage.getItem('accessToken');

            console.log('AuthProvider: Stored user:', storedUser ? 'Found' : 'Not found');
            console.log('AuthProvider: Access token:', accessToken ? 'Found' : 'Not found');

            if (storedUser && accessToken) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
                console.log('AuthProvider: User authenticated');
            } else {
                console.log('AuthProvider: No stored user, showing login');
            }
        } catch (error) {
            console.error('AuthProvider: Error loading stored user:', error);
        } finally {
            setLoading(false);
            console.log('AuthProvider: Loading complete');
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const login = async (emailOrUsername, password) => {
        try {
            // Validate input
            if (!emailOrUsername || !password) {
                throw new Error('Email/Username and password are required');
            }

            // Determine if input is email or username
            const isEmail = validateEmail(emailOrUsername);
            const payload = isEmail
                ? { email: emailOrUsername, password }
                : { username: emailOrUsername, password };

            // Call backend login API
            const response = await apiClient.post('/api/v1/users/login', payload);

            if (response.data && response.data.data) {
                const { user: userData, accessToken, refreshToken } = response.data.data;

                // Store tokens and user data
                await AsyncStorage.setItem('accessToken', accessToken);
                await AsyncStorage.setItem('refreshToken', refreshToken);
                await AsyncStorage.setItem('user', JSON.stringify(userData));

                setUser(userData);
                setIsAuthenticated(true);

                return userData;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            throw new Error(errorMessage);
        }
    };

    const signup = async (fullName, username, email, password) => {
        try {
            // Validate inputs
            if (!fullName || !username || !email || !password) {
                throw new Error('All fields are required');
            }

            if (!validateEmail(email)) {
                throw new Error('Invalid email format');
            }

            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            // Create FormData for multipart/form-data (backend expects this for profile photo)
            const formData = new FormData();
            formData.append('fullName', fullName);
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);

            // Note: Profile photo is optional, can be added later via update profile
            // For now, we'll skip it during registration

            // Call backend register API
            const response = await apiClient.post('/api/v1/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data && response.data.data) {
                const userData = response.data.data;

                // After successful registration, log the user in
                await login(email, password);

                return userData;
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Signup error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Signup failed';
            throw new Error(errorMessage);
        }
    };

    const logout = async () => {
        try {
            // Call backend logout API
            await apiClient.post('/api/v1/users/logout');
        } catch (error) {
            console.error('Logout API error:', error);
            // Continue with local logout even if API call fails
        } finally {
            // Clear local storage
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUserProfile = async (updates) => {
        try {
            const response = await apiClient.patch('/api/v1/users/update-profile', updates);

            if (response.data && response.data.data) {
                const updatedUser = response.data.data;
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                return updatedUser;
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated,
            login,
            signup,
            logout,
            updateUserProfile,
            validateEmail,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
