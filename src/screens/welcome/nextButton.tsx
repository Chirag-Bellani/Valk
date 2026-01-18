import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import mainStyles from '../../assets/styles/main';

const NextButton = ({ percentage, scrollTo }) => {
    const size = 128;
    const strokeWidth = 5;
    const center = size / 2;
    const radius = size / 2 - strokeWidth / 2 - 10;
    const circumference = 2 * Math.PI * radius;

    const progressAnimation = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(null);

    const animation = (toValue) => {
        return Animated.timing(progressAnimation, {
            toValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        animation(percentage);
    }, [percentage]);

    useEffect(() => {
        progressAnimation.addListener((value) => {
            const strokeDashoffset = circumference - (circumference * value.value) / 100;

            if (progressRef?.current) {
                progressRef.current.setNativeProps({
                    strokeDashoffset,
                });
            }
        });

        return () => {
            progressAnimation.removeAllListeners();
        };
    }, []);

    return (
        <View style={{ alignSelf: 'center', marginBottom: 20 }}>
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                style={[mainStyles.button, { borderRadius: 10 }]}
            >
                <TouchableOpacity style={mainStyles.buttonArrow} onPress={scrollTo}>
                    <Icon name="arrow-right" size={32} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

export default NextButton;
