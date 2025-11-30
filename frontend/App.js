import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Step-by-step app builder to find the issue
export default function App() {
    const [step, setStep] = useState(1);
    const [error, setError] = useState(null);

    console.log(`✅ App Step ${step} loading...`);

    const testStep = (stepNum, testFn, description) => {
        try {
            console.log(`Testing: ${description}`);
            testFn();
            console.log(`✅ Step ${stepNum} passed: ${description}`);
            return true;
        } catch (err) {
            console.error(`❌ Step ${stepNum} failed: ${description}`, err);
            setError(`Step ${stepNum} failed: ${err.message}`);
            return false;
        }
    };

    useEffect(() => {
        if (step === 2) {
            // Test SafeAreaProvider
            testStep(2, () => { }, 'SafeAreaProvider');
        } else if (step === 3) {
            // Test Navigation
            const { NavigationContainer } = require('@react-navigation/native');
            testStep(3, () => { }, 'NavigationContainer');
        } else if (step === 4) {
            // Test AuthContext
            const { AuthProvider } = require('./src/context/AuthContext');
            testStep(4, () => { }, 'AuthContext');
        } else if (step === 5) {
            // Test AppNavigator
            const AppNavigator = require('./src/navigation/AppNavigator').default;
            testStep(5, () => { }, 'AppNavigator');
        }
    }, [step]);

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorTitle}>❌ Error Found!</Text>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={() => { setError(null); setStep(1); }}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <View style={styles.container}>
                        <Text style={styles.text}>✅ Step 1: Basic App Works</Text>
                        <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
                            <Text style={styles.buttonText}>Test SafeAreaProvider</Text>
                        </TouchableOpacity>
                    </View>
                );
            case 2:
                return (
                    <SafeAreaProvider>
                        <View style={styles.container}>
                            <Text style={styles.text}>✅ Step 2: SafeAreaProvider Works</Text>
                            <TouchableOpacity style={styles.button} onPress={() => setStep(3)}>
                                <Text style={styles.buttonText}>Test Navigation</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaProvider>
                );
            case 3:
                const { NavigationContainer } = require('@react-navigation/native');
                return (
                    <SafeAreaProvider>
                        <NavigationContainer>
                            <View style={styles.container}>
                                <Text style={styles.text}>✅ Step 3: Navigation Works</Text>
                                <TouchableOpacity style={styles.button} onPress={() => setStep(4)}>
                                    <Text style={styles.buttonText}>Test AuthContext</Text>
                                </TouchableOpacity>
                            </View>
                        </NavigationContainer>
                    </SafeAreaProvider>
                );
            case 4:
                const { NavigationContainer: NC } = require('@react-navigation/native');
                const { AuthProvider } = require('./src/context/AuthContext');
                return (
                    <SafeAreaProvider>
                        <AuthProvider>
                            <NC>
                                <View style={styles.container}>
                                    <Text style={styles.text}>✅ Step 4: AuthContext Works</Text>
                                    <TouchableOpacity style={styles.button} onPress={() => setStep(5)}>
                                        <Text style={styles.buttonText}>Test Full App</Text>
                                    </TouchableOpacity>
                                </View>
                            </NC>
                        </AuthProvider>
                    </SafeAreaProvider>
                );
            case 5:
                const { NavigationContainer: NC2 } = require('@react-navigation/native');
                const { AuthProvider: AP } = require('./src/context/AuthContext');
                const AppNavigator = require('./src/navigation/AppNavigator').default;
                return (
                    <SafeAreaProvider>
                        <AP>
                            <NC2>
                                <AppNavigator />
                            </NC2>
                        </AP>
                    </SafeAreaProvider>
                );
            default:
                return null;
        }
    };

    return renderStep();
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        padding: 20,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#a855f7',
        marginBottom: 20,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#a855f7',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
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
        marginBottom: 20,
    },
});
