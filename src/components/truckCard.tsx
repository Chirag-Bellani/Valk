import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const CustomCard = ({ item, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, isSelected && styles.selectedCard]}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={[styles.title, isSelected && styles.selectedTitle]}>
        {item.name}
      </Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    // flex: 1,
    height: verticalScale(130),
    width: '45%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: moderateScale(5),
    margin: moderateScale(5),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedCard: {
    borderColor: '#007bff',
    backgroundColor: '#e6f7ff',
  },
  image: {
    width: scale(100),
    height: verticalScale(50),
    marginBottom: moderateScale(10),
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedTitle: {
    color: '#007bff',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
  },
});

export default CustomCard;
