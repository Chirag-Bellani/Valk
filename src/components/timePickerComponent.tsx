import React from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import TimePicker from '@react-native-community/datetimepicker';

const TimePickerComponent = ({
  label,
  showPicker = false,
  time = new Date(),
  onTimeChange,
  togglePicker,
  displayValue = '',
  error = false,
  style = {},
  placeholder = 'Select Time',
  editable = false,
  color = '#000000',
  placeholderTextColor = '#C0C0C0',
  errorMessage = 'Invalid time',
}) => {
  return (
    <View style={[style.bottomMargin]}>
      {label && <Text style={[style.label]}>{label}</Text>}
      <View style={[style.formView]}>
        {showPicker ? (
          <TimePicker
            mode="time"
            display="spinner"
            value={time}
            onChange={onTimeChange}
          />
        ) : (
          <Pressable onPress={togglePicker}>
            <TextInput
              placeholder={placeholder}
              value={displayValue}
              placeholderTextColor={placeholderTextColor}
              editable={editable}
              style={[style.input, {color}]}
            />
          </Pressable>
        )}
      </View>
      {error && (
        <Text style={[styles.errorLabel, style.errorLabel]}>
          * {errorMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  formView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 4,
  },
  errorLabel: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default TimePickerComponent;
