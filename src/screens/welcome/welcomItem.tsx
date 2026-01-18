import React from "react";
import { View, Text, StyleSheet, Image, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const WelcomeItem = ({ item }) => {
    const { width } = useWindowDimensions();

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={[styles.container, { width }]}
        >
            <Image source={item.image} style={[styles.image, { width, resizeMode: 'contain' }]} />

            <View style={{ flex: 0.3 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 0.5,
        justifyContent: 'center'
    },
    title: {
        fontWeight: '800',
        fontSize: 28,
        marginBottom: 5,
        color: '#fff',
        textAlign: 'center',
    },
    description: {
        fontWeight: '300',
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 64,
    }
});

export default WelcomeItem;
