import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const BankCardSkeleton = () => {
    return (
        <SkeletonPlaceholder>
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.iconContainer} />
                    <View style={styles.textPlaceholder} />
                </View>
                <View style={styles.divider} />
                <View style={styles.infoContainer}>
                    {[...Array(3)].map((_, index) => (
                        <View key={index}>
                            <View style={styles.row}>
                                <View style={styles.iconPlaceholder} />
                                <View style={styles.textPlaceholder} />
                            </View>
                            <View style={styles.divider} />
                        </View>
                    ))}
                </View>
            </View>
        </SkeletonPlaceholder>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#E0E0E0",
    },
    textPlaceholder: {
        width: 100,
        height: 15,
        borderRadius: 4,
        backgroundColor: "#E0E0E0",
        marginLeft: 10,
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 8,
    },
    infoContainer: {
        marginTop: 5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    iconPlaceholder: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#E0E0E0",
    },
});

export default BankCardSkeleton;
