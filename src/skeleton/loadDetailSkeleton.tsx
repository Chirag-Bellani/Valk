import React from 'react';
import { View, StyleSheet } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import lorryCardStyles from '../assets/styles/lorryCard';

const LoadDetailSkeleton = () => {
    return (
        <>
            <View style={lorryCardStyles.card}>
                {/* Header Section Skeleton */}
                <SkeletonPlaceholder highlightColor="#C9C4C4">
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={10}>
                        {/* Image Placeholder */}
                        <SkeletonPlaceholder.Item
                            style={lorryCardStyles.imageContainer}
                            width={50}
                            height={50}
                            borderRadius={5}
                            marginRight={10}
                        />
                        {/* Vehicle Info Placeholder */}
                        <SkeletonPlaceholder.Item>
                            <SkeletonPlaceholder.Item width={140} height={10} borderRadius={4} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>

                {/* Info Row Skeleton */}
                <SkeletonPlaceholder highlightColor="#C9C4C4">
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={10}>
                        <SkeletonPlaceholder.Item width={140} height={10} borderRadius={4} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>


                {/* Buttons or Verification Row Skeleton */}
                <SkeletonPlaceholder highlightColor="#C9C4C4">
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginTop={15} gap={5}>
                        <SkeletonPlaceholder.Item width="30%" height={30} borderRadius={5} />
                        <SkeletonPlaceholder.Item width="30%" height={30} borderRadius={5} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>

            <View style={lorryCardStyles.card}>
                {/* Header Section Skeleton */}
                <SkeletonPlaceholder highlightColor="#C9C4C4">
                    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={10}>
                        {/* Image Placeholder */}
                        <SkeletonPlaceholder.Item
                            style={lorryCardStyles.imageContainer}
                            width={50}
                            height={50}
                            borderRadius={5}
                            marginRight={10}
                        />
                        {/* Vehicle Info Placeholder */}
                        <SkeletonPlaceholder.Item flexDirection="row" justifyContent='space-between'>
                            <SkeletonPlaceholder.Item width={140} height={10} borderRadius={4} />
                            <SkeletonPlaceholder.Item width={50} height={10} borderRadius={4} marginLeft={50} />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>

                {/* Info Row Skeleton */}
                <SkeletonPlaceholder highlightColor="#C9C4C4">
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom={10}>
                        <SkeletonPlaceholder.Item width={140} height={10} borderRadius={4} />
                        <SkeletonPlaceholder.Item width={100} height={10} borderRadius={4} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>


                {/* Buttons or Verification Row Skeleton */}
                <SkeletonPlaceholder highlightColor="#C9C4C4">
                    <SkeletonPlaceholder.Item flexDirection="row" justifyContent="space-between" marginTop={15} gap={5}>
                        <SkeletonPlaceholder.Item width="100%" height={30} borderRadius={5} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 20,
    },
    lorryDetailContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

export default LoadDetailSkeleton;
