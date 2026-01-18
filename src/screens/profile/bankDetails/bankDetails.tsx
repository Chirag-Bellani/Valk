import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { apiPost } from '../../../services/apiUtility';
import { API_ENDPOINTS } from '../../../constants/apiEndPoints';
import { useIsFocused } from '@react-navigation/native';
import BankCardSkeleton from '../../../skeleton/bankCardSkeleton';

const BankDetails = ({ navigation }) => {
    const [bankDetails, setBankDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(true);
    const isFocused = useIsFocused();

    const fetchBankDetails = async () => {
        try {
            const response = await apiPost(
                API_ENDPOINTS.BANK.GET_BANK_DETAILS,
            );
            if (response.success) {
                setBankDetails(response.data.get_party_bank_details);
            } else {
                console.log('Failed to fetch data');
                setBankDetails([]);
            }
            // setRefreshing(false);
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const renderBankCard = ({ item }) => {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Icon name="account" size={26} color="#fff" />
                    </View>
                    <Text style={styles.accountHolder}>{item?.ac_holder_name}</Text>
                </View>
                <View style={styles.divider} />

                <View style={styles.infoContainer}>
                    <View style={styles.row}>
                        <Icon name="bank" size={22} color="#007bff" />
                        <Text style={styles.label}>Bank:</Text>
                        <Text style={styles.value}>{item?.bank_name}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Icon name="credit-card-outline" size={22} color="#28a745" />
                        <Text style={styles.label}>Account No:</Text>
                        <Text style={styles.value}>{item?.ac_number}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Icon name="barcode" size={22} color="#dc3545" />
                        <Text style={styles.label}>IFSC Code:</Text>
                        <Text style={styles.value}>{item?.bank_ifsc_code}</Text>
                    </View>
                    <View style={styles.divider} />
                </View>
            </View>
        );
    };

    useEffect(() => {
        fetchBankDetails();
    }, [isFocused]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
                <FlatList
                    data={[1, 1, 1, 1, 1, 1]}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={() => <BankCardSkeleton />}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={bankDetails} // Corrected data structure
                keyExtractor={(item, index) => item.id.toString()} // Ensure unique keys
                renderItem={renderBankCard}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchBankDetails} />
                }
                ListEmptyComponent={
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '70%' }}>
                        <Text style={{ fontSize: 16, color: '#888' }}> Data Not Found</Text>
                    </View>
                }
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddBankDetails')}
            >
                <Icon name="bank-plus" size={26} color="#fff" />
                <Text style={styles.buttonText}>Add Account</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 12,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    iconContainer: {
        backgroundColor: '#0056b3',
        padding: 8,
        borderRadius: 50,
        marginRight: 10,
    },
    accountHolder: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    infoContainer: {
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        flex: 1,
        marginLeft: 8,
    },
    value: {
        fontSize: 16,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 6,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0032e8',
        padding: 10,
        borderRadius: 25,
        position: 'absolute',
        bottom: 20,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        elevation: 5,
    },
    buttonText: {
        fontSize: 17,
        color: '#fff',
        marginLeft: 8,
    },
});

export default BankDetails;
