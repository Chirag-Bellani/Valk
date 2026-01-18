import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const KycModal = ({ isVisible, onClose, userDetail }) => {
    const navigation = useNavigation();

    const isKycPending = userDetail?.mainDetail?.get_user_party_detail?.aadhaar_front_image !== null ||
        userDetail?.mainDetail?.get_user_party_detail?.pan_image !== null

    return (
        <Modal visible={isVisible} transparent animationType="slide">
            <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
                <View style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingBottom: 15,
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>Complete KYC</Text>
                        <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
                            <Feather name="x" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 10 }}>
                        {isKycPending ? 'Your KYC Under Verification' : 'Complete KYC to Post Load'}.
                    </Text>
                    <Text style={{ fontSize: 16, color: 'gray' }}>
                        {isKycPending ? 'Please Wait Till KYC Is Verified By Admin To Post Load' : 'Please complete your KYC to post a load'}.
                    </Text>

                    {!isKycPending && (
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#0032e8',
                                padding: 10,
                                borderRadius: 5,
                                marginTop: 10,
                            }}
                            onPress={() => {
                                onClose();
                                navigation.navigate('KYC', { profileData: userDetail });
                            }}
                        >
                            <Text style={{ fontSize: 16, color: 'white', textAlign: 'center' }}>
                                Complete KYC
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default KycModal;
