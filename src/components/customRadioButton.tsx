import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const CustomRadioButton = ({ isSelected, onPress, label, hasError, errorMessage }) => {
    return (
        <View style={{ marginBottom: hasError && errorMessage ? 10 : 0 }}>
            <TouchableOpacity
                onPress={onPress}
                style={[
                    styles.radioButtonContainer,
                    isSelected && styles.selected,
                    hasError && styles.error,
                ]}
            >
                <Text style={[styles.radioButtonText, isSelected && styles.radioButtonTextSelected]}>
                    {label}
                </Text>

            </TouchableOpacity>
            {hasError && errorMessage && (
                <Text style={styles.errorMessage}>* {errorMessage}</Text>
            )}
        </View>
    );
};

const styles = {
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#007bff',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#fff',
    },
    selected: {
        backgroundColor: '#007bff',
    },
    radioButtonText: {
        fontSize: 16,
        color: '#007bff',
    },
    radioButtonTextSelected: {
        color: '#fff',
    },
    error: {
        borderColor: 'red',
    },
    errorIndicator: {
        color: 'red',
        marginLeft: 5,
        fontSize: 16,
    },
    errorMessage: {
        color: 'red',
        fontSize: 13,
        marginTop: 5,
        width: '80%'

    },
};

export default CustomRadioButton;
