import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';

const AdditionalServiceCard = ({item, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(item?.screen, {data: item?.data})}
      style={styles.card}>
      {/* Left Section: Membership Image */}
      <Image
        source={item?.image} // Use a local image
        style={styles.membershipImage}
        resizeMode="contain"
      />

      {/* Right Section: Membership Details */}
      <View style={styles.rightSection}>
        <Text style={styles.title}>{item?.name}</Text>
        <Text style={styles.description}>{item?.description}</Text>

        {/* Highlighted Text
                <View style={styles.highlightText}>
                    <Text style={styles.highlightTextContent}>
                        10k+ companies are buying
                    </Text>
                </View> */}

        {/* Action Button */}
        <View>
          <Text style={styles.link}>See Plans →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    padding: moderateScale(5),
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(5),
    shadowOffset: {width: 0, height: verticalScale(3)},
    alignItems: 'center',
    margin: scale(5),
  },
  discountBadge: {
    position: 'absolute',
    top: verticalScale(5),
    left: scale(5),
    backgroundColor: '#C8E6C9',
    borderRadius: moderateScale(5),
    paddingVertical: verticalScale(2),
    paddingHorizontal: scale(8),
  },
  discountText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: moderateScale(12),
  },
  membershipImage: {
    width: scale(90), // Adjusted for different screen sizes
    height: verticalScale(80),
    borderRadius: moderateScale(10),
  },
  rightSection: {
    flex: 1,
    paddingLeft: scale(10),
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#000',
  },
  description: {
    fontSize: moderateScale(14),
    color: '#388E3C',
    marginVertical: verticalScale(5),
  },
  highlightText: {
    backgroundColor: '#FFF9C4',
    padding: moderateScale(5),
    borderRadius: moderateScale(5),
    marginBottom: verticalScale(5),
  },
  highlightTextContent: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: '#000',
  },
  link: {
    color: '#1565C0',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
});

export default AdditionalServiceCard;
