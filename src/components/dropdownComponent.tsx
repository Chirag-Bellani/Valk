import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownComponent = ({
  label,
  data,
  value,
  onChange,
  error,
  style,
  labelField,
  valueField,
  placeholder,
  searchPlaceholder,
  errorMessage = 'Invalid input',
  multiSelect = false,
  optionMenuPosition,
  renderItem
}) => (
  <View style={style.formView}>
    <Text style={style.label}>{label}</Text>
    <View style={style.flexRow}>
      <Dropdown
        style={[style.dropdown, style.isFocus && { borderColor: 'blue' }, error && { borderColor: 'red' }]}
        placeholderStyle={style.placeholderStyle}
        selectedTextStyle={style.selectedTextStyle}
        inputSearchStyle={style.inputSearchStyle}
        itemTextStyle={style.itemTextStyle}
        iconStyle={style.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField={labelField}
        valueField={valueField}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        showsVerticalScrollIndicator={false}
        value={value}
        onChange={onChange}
        dropdownPosition={optionMenuPosition}
        renderItem={renderItem}
      />
    </View>
    {error ? <Text style={styles.errorLabel}> * {errorMessage}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  errorLabel: {
    color: 'red',
    fontSize: 12
  }
})
export default DropdownComponent;
