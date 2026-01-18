import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerComponent = ({
  label,
  showPicker,
  date,
  onDateChange,
  togglePicker,
  displayValue,
  error,
  style,
  placeholder,
  editable = false,
  color = '#000000',
  placeholderTextColor = '#C0C0C0',
  errorMessage,
  minimumDate
}) => (
  <View style={[style.bottomMargin]}>
    <Text style={style.label}>{label}</Text>
    <View style={style.formView}>
      {showPicker && (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          minimumDate={minimumDate}
          onChange={onDateChange}
        />
      )}
      {!showPicker && (
        <Pressable onPress={togglePicker}>
          <TextInput
            placeholder={placeholder}
            color={color}
            placeholderTextColor={placeholderTextColor}
            value={displayValue}
            style={style.input}
            editable={editable}
          />
        </Pressable>
      )}
    </View>
    {error ? <Text style={styles.errorLabel}> * {errorMessage}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  errorLabel: {
    color: 'red',
    fontSize: 12,

  }
})

export default DatePickerComponent;
