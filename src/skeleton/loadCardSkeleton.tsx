import React from 'react';
import { View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import loadCardStyles from '../assets/styles/loadCard';

const LoadCardSkeleton = () => {
    return (
        <View style={[loadCardStyles.card, { backgroundColor: '#f0f0f0', padding: 5 }]}>
            {/* Placeholder for Post Status */}
            <SkeletonPlaceholder highlightColor="#C9C4C4">
                <SkeletonPlaceholder.Item marginBottom={10}>
                    <SkeletonPlaceholder.Item width={80} height={10} borderRadius={4} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>

            {/* Header Section */}
            <SkeletonPlaceholder highlightColor="#C9C4C4">
                <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginBottom={15}>
                    <SkeletonPlaceholder.Item
                        width={50}
                        height={50}
                        borderRadius={5}
                        marginRight={10}
                    />
                    <SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item width={180} height={10} borderRadius={4} marginBottom={6} />
                        <SkeletonPlaceholder.Item width={120} height={10} borderRadius={4} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>

            {/* Card Content */}
            {/* Card Content */}
            <SkeletonPlaceholder highlightColor="#C9C4C4">
                <SkeletonPlaceholder.Item
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="flex-start" // Adjust alignment within row
                    style={{ width: '100%' }} // Ensure the content stretches within card bounds
                >
                    <SkeletonPlaceholder.Item>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <SkeletonPlaceholder.Item key={index} flexDirection="row" alignItems="center" marginBottom={10}>
                                <SkeletonPlaceholder.Item
                                    width={20}
                                    height={20}
                                    borderRadius={3}
                                    marginRight={10}
                                />
                                <SkeletonPlaceholder.Item width={140} height={10} borderRadius={4} />
                            </SkeletonPlaceholder.Item>
                        ))}
                    </SkeletonPlaceholder.Item>

                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>


            {/* Action Buttons or Status Messages Placeholder */}
            <SkeletonPlaceholder highlightColor="#C9C4C4">
                <SkeletonPlaceholder.Item
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    marginTop={20}
                >
                    <SkeletonPlaceholder.Item width={140} height={10} borderRadius={4} marginRight={10} />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
    );
};

export default LoadCardSkeleton;
