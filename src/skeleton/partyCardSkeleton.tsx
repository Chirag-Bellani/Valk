// PartyCardSkeleton.js
import React from 'react';
import { View, SafeAreaView } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const PartyCardSkeleton = () => {
    return (
        <SafeAreaView style={{ flex: 1, marginTop: '5%' }}>
            <SkeletonPlaceholder borderRadius={4}>
                <View style={{ padding: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 50, height: 50, borderRadius: 25 }} />
                        <View style={{ marginLeft: 10 }}>
                            <View style={{ width: 120, height: 20 }} />
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ width: '60%', height: 20 }} />
                        <View style={{ width: '100%', height: 40, marginTop: 10 }} />
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <View style={{ width: '45%', height: 20 }} />
                        <View style={{ width: '45%', height: 20 }} />
                    </View>

                    <View style={{ marginTop: 30, width: 80, height: 30 }} />
                </View>
            </SkeletonPlaceholder>
        </SafeAreaView>
    );
};

export default PartyCardSkeleton;
