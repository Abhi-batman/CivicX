import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('❌ Error caught by boundary:', error);
        console.error('Error info:', errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>⚠️ App Error</Text>
                    <Text style={styles.errorText}>{this.state.error?.toString()}</Text>
                    <Text style={styles.errorStack}>
                        {this.state.errorInfo?.componentStack?.substring(0, 500)}
                    </Text>
                </View>
            );
        }

        return this.props.children;
    }
}

export default function App() {
    useEffect(() => {
        console.log('✅ App component mounted');
    }, []);

    return (
        <ErrorBoundary>
            <SafeAreaProvider>
                <AuthProvider>
                    <NavigationContainer>
                        <AppNavigator />
                    </NavigationContainer>
                </AuthProvider>
            </SafeAreaProvider>
        </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#1a1a2e',
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ff6b6b',
        marginBottom: 10,
    },
    errorText: {
        fontSize: 14,
        color: '#eee',
        textAlign: 'center',
        marginBottom: 10,
    },
    errorStack: {
        fontSize: 10,
        color: '#999',
        textAlign: 'left',
        fontFamily: 'monospace',
    },
});
