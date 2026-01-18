import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import TextInputComponent from '../../../components/textInputComponent';
import { apiPost } from '../../../services/apiUtility';
import { API_ENDPOINTS } from '../../../constants/apiEndPoints';
import { showMessage } from 'react-native-flash-message';

const AddBankDetails = ({ navigation }) => {

    const [accountHolder, setAccountHolder] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [ifscCode, setIfscCode] = useState('')
    const [loading, setLoading] = useState(false);

    const addBankDetails = async () => {
        setLoading(true);
        if (validateForm()) {
            let formData = new FormData();
            formData.append('ac_holder_name', accountHolder);
            formData.append('bank_name', bankName);
            formData.append('ac_number', accountNumber);
            formData.append('bank_ifsc_code', ifscCode);

            try {
                const response = await apiPost(
                    API_ENDPOINTS.BANK.ADD_BANK_DETAILS,
                    formData,
                );
                if (response.success) {
                    setLoading(false)
                    navigation.navigate('BankDetails')
                    showMessage({
                        message: response.message,
                        description: '',
                        type: 'success',
                    });
                } else {
                    console.log('Failed to fetch data');

                }
                // setRefreshing(false);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    };

    const [errors, setErrors] = useState({});


    const validateForm = () => {
        let newErrors = {};
        if (!accountHolder) newErrors.accountHolder = 'Account holder name is required';
        if (!bankName) newErrors.bankName = 'Bank name is required';
        if (!accountNumber) newErrors.accountNumber = 'Account number is required';
        if (!ifscCode) newErrors.ifscCode = 'IFSC code is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <TextInputComponent
                label="Account Holder Name"
                value={accountHolder}
                onChangeText={(text) => {
                    setAccountHolder(text)
                    setErrors(prev => ({ ...prev, accountHolder: '' }));
                }}
                error={!!errors.accountHolder}
                errorMessage={errors.accountHolder}
                placeholder="Enter account holder name"
            />

            <TextInputComponent
                label="Bank Name"
                value={bankName}
                onChangeText={(text) => {
                    setBankName(text)
                    setErrors(prev => ({ ...prev, bankName: '' }));
                }}
                error={!!errors.bankName}
                errorMessage={errors.bankName}
                placeholder="Enter bank name"
            />

            <TextInputComponent
                label="Account Number"
                value={accountNumber}
                maxLength={17}
                onChangeText={(text) => {
                    setAccountNumber(text)
                    setErrors(prev => ({ ...prev, accountNumber: '' }));
                }}
                error={!!errors.accountNumber}
                errorMessage={errors.accountNumber}
                placeholder="Enter account number"
                keyboardType="numeric"
            />

            <TextInputComponent
                label="IFSC Code"
                value={ifscCode}
                maxLength={11}
                onChangeText={(text) => {
                    setIfscCode(text)
                    setErrors(prev => ({ ...prev, ifscCode: '' }));
                }}
                error={!!errors.ifscCode}
                errorMessage={errors.ifscCode}
                placeholder="Enter IFSC code"
            />

            {/* <TextInputComponent
                label="Branch City"
                value={formData.branchCity}
                onChangeText={(text) => handleChange('branchCity', text)}
                error={!!errors.branchCity}
                errorMessage={errors.branchCity}
                placeholder="Enter branch city"
            /> */}

            <TouchableOpacity style={loading ? styles.disableButton : styles.submitButton} disabled={loading} onPress={addBankDetails}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#0032e8',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    disableButton: {
        backgroundColor: '#C0C0C0',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    submitButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AddBankDetails;
