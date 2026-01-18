import React, { useState, useRef } from "react";
import { View, FlatList, Animated } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import Paginator from "./paginator";
import NextButton from "./nextButton";
import WelcomeItem from "./welcomItem";
import slides from "./slides";
import styles from '../../assets/styles/main'


const Welcome = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            navigation.push("LoginScreen");
        }
    }

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={[styles.container, { flex: 1 }]}
        >
            <FlatList
                data={slides}
                renderItem={({ item }) => (
                    <WelcomeItem
                        item={item}
                        slides={slides} // Pass slides as a prop
                        scrollX={scrollX}
                        currentIndex={currentIndex}
                        scrollTo={scrollTo}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
            />

            <View style={styles.paginatorContainer}>
                <Paginator data={slides} scrollX={scrollX} />
                <NextButton scrollTo={scrollTo} percentage={(currentIndex + 1) * (100 / slides.length)} />
            </View>
        </LinearGradient>
    );
}

export default Welcome;
