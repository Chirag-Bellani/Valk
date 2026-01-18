import React from "react";
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';

const Paginator = ({ data, scrollX }) => {
    const { width } = useWindowDimensions();

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 64 }}>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                })

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],

                })
                return <Animated.View style={[styles.dot, { width: dotWidth, opacity }]} key={i.toString()} />;
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginHorizontal: 8,
    }
});

export default Paginator;
