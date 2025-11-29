import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import issueApi from '../api/issueApi';

const MapScreen = () => {
    const [issues, setIssues] = useState([]);
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const data = await issueApi.getMapIssues();
                setIssues(data);
            } catch (error) {
                console.error('Error fetching map issues:', error);
            }
        };

        fetchIssues();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={region}
                showsUserLocation
                showsMyLocationButton
            >
                {issues.map((issue) => (
                    <Marker
                        key={issue.id}
                        coordinate={issue.coordinates}
                        title={issue.title}
                        description={issue.category}
                    >
                        <Callout>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{issue.title}</Text>
                                <Text style={styles.calloutDesc}>{issue.category} • {issue.upvotes} votes</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    callout: {
        width: 150,
        padding: 5,
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    calloutDesc: {
        fontSize: 12,
        color: '#666',
    },
});

export default MapScreen;
