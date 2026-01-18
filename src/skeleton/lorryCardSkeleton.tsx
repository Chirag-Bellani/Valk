import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import lorryCardStyles from '../assets/styles/lorryCard';

const LorryCardSkeleton = () => {
    return (
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
                    <SkeletonPlaceholder.Item width={100} height={10} borderRadius={4} />
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
    );
};

export default LorryCardSkeleton;
