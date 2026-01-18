import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const TextInputComponent = ({
  label,
  value,
  onChangeText,
  error = false,
  placeholder = '',
  caretHidden = false,
  keyboardType = 'default',
  editable = true,
  color = '#000',
  placeholderTextColor = '#C0C0C0',
  errorMessage = 'Invalid input',
  maxLength = null,
  autoCapitalize = 'none',
  multiline = false,
  inputStyle = {},
  labelStyle = {},
  errorLabelStyle = {},
  containerStyle = {},
}) => {
  return (
    <View style={[styles.inputWrapper, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          { color }, // dynamic color
          error && { borderColor: 'red' }, // highlight error
          inputStyle, // custom styles
        ]}
        value={value}
        onChangeText={onChangeText}
        caretHidden={caretHidden}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor={placeholderTextColor}
        maxLength={maxLength}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
      />
      {error && (
        <Text style={[styles.errorLabel, { color: 'red' }, errorLabelStyle]}>
          * {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
    marginBottom: '2%',
    alignSelf: 'center'
  },
  label: {
    fontSize: 14,
    fontFamily: 'Arial',
    color: '#7D7D7D',
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: '1%'
  },
  input: {
    flex: 1, // Use flex to occupy remaining space
    // height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  errorLabel: {
    fontSize: 13,
    marginTop: 5,
  },
});

export default TextInputComponent;
