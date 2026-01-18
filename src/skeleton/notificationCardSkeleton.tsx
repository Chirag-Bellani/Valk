import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const NotificationCardSkeleton = () => {
    return (
        <Pressable style={styles.card}>
            <View style={styles.cardContent}>
                {/* Title Skeleton */}
                <SkeletonPlaceholder highlightColor="#C9C4C4">
                    <SkeletonPlaceholder.Item
                        width={150}
                        height={14}
                        borderRadius={4}
                        marginBottom={5}
                    />
                </SkeletonPlaceholder>

                {/* Body Skeleton */}
                <SkeletonPlaceholder highlightColor="#C9C4C4">
                    <SkeletonPlaceholder.Item
                        width={250}
                        height={13}
                        borderRadius={4}
                        marginBottom={2}
                    />
                    <SkeletonPlaceholder.Item
                        width={200}
                        height={13}
                        borderRadius={4}
                    />
                </SkeletonPlaceholder>
            </View>

            {/* Background Placeholder */}
            <SkeletonPlaceholder highlightColor="#C9C4C4">
                <SkeletonPlaceholder.Item
                    style={{ backgroundColor: '#f0f4fa' }}
                    width={'100%'}
                    height={10}
                />
            </SkeletonPlaceholder>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 10,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 6,
        elevation: 2,
    },
    cardContent: {
        paddingBottom: 10,
    },
});

export default NotificationCardSkeleton;
